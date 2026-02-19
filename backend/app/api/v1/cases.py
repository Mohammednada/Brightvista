import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_session
from app.core.exceptions import NotFoundError
from app.models.case import Case
from app.models.document import Document
from app.models.patient import Patient
from app.models.procedure import Procedure
from app.models.payer import Payer
from app.schemas.case import (
    ApprovalFactor,
    CaseCreate,
    CaseDetail,
    CaseSetDocuments,
    CaseSetPatient,
    CaseSetProcedure,
    CaseSummary,
    CaseUpdate,
    DocumentRequirement,
    StepState,
)
from app.schemas.common import APIResponse
from app.services.approval_calculator import calculate_approval

router = APIRouter()


def generate_case_number() -> str:
    year = datetime.now().year
    num = random.randint(1000, 9999)
    return f"PA-{year}-{num}"


DEFAULT_STEPS = [
    {"id": "patient", "label": "Patient Info", "status": "active"},
    {"id": "procedure", "label": "Procedure", "status": "pending"},
    {"id": "documentation", "label": "Documentation", "status": "pending"},
    {"id": "review", "label": "Review", "status": "pending"},
    {"id": "submit", "label": "Submit", "status": "pending"},
    {"id": "check-status", "label": "Check Status", "status": "pending"},
    {"id": "decision", "label": "Decision", "status": "pending"},
]

DEFAULT_DOCUMENTS = [
    {"id": "conservative-therapy", "name": "Conservative Therapy Records", "status": "missing", "required": True},
    {"id": "specialist-referral", "name": "Specialist Referral Letter", "status": "missing", "required": True},
    {"id": "physical-exam", "name": "Physical Exam Notes", "status": "missing", "required": True},
    {"id": "medication-history", "name": "Medication History", "status": "missing", "required": True},
    {"id": "previous-imaging", "name": "Previous Imaging Results", "status": "missing", "required": False},
]


async def _load_case(db: AsyncSession, case_id: str) -> Case:
    result = await db.execute(
        select(Case)
        .options(selectinload(Case.patient), selectinload(Case.procedure), selectinload(Case.documents), selectinload(Case.payer))
        .where(Case.id == case_id, Case.deleted_at.is_(None))
    )
    case = result.scalar_one_or_none()
    if not case:
        raise NotFoundError("Case", case_id)
    return case


def _build_detail(case: Case) -> CaseDetail:
    from app.schemas.patient import PatientResponse
    from app.schemas.procedure import ProcedureResponse

    docs = []
    for d in case.documents:
        docs.append(DocumentRequirement(id=d.doc_key, name=d.name, status=d.status, source=d.source, date=d.date, required=d.required))
    if not docs and case.steps:
        # Use default documents if none saved yet
        docs = [DocumentRequirement(**d) for d in DEFAULT_DOCUMENTS]

    return CaseDetail(
        id=case.id,
        case_number=case.case_number,
        status=case.status,
        current_step=case.current_step,
        priority=case.priority,
        approval_likelihood=case.approval_likelihood,
        approval_factors=[ApprovalFactor(**f) for f in (case.approval_factors or [])],
        steps=[StepState(**s) for s in (case.steps or DEFAULT_STEPS)],
        patient=PatientResponse.model_validate(case.patient) if case.patient else None,
        procedure=ProcedureResponse.model_validate(case.procedure) if case.procedure else None,
        documents=docs,
        payer_name=case.payer.name if case.payer else None,
        department=case.department,
        deadline=case.deadline,
        auth_number=case.auth_number,
        denial_reason=case.denial_reason,
        notes=case.notes,
        created_at=case.created_at.isoformat() if case.created_at else "",
        updated_at=case.updated_at.isoformat() if case.updated_at else "",
        submitted_at=case.submitted_at.isoformat() if case.submitted_at else None,
    )


@router.post("/cases", response_model=APIResponse)
async def create_case(body: CaseCreate, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = Case(
        case_number=generate_case_number(),
        status="draft",
        current_step="patient",
        priority=body.priority,
        department=body.department,
        deadline=body.deadline,
        steps=DEFAULT_STEPS,
        approval_likelihood=0,
        approval_factors=[],
        assigned_coordinator_id=user.get("sub") if isinstance(user, dict) else None,
    )
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return APIResponse(data={"case_id": case.id, "case_number": case.case_number, "status": case.status})


@router.get("/cases", response_model=APIResponse)
async def list_cases(status: str | None = None, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    query = select(Case).where(Case.deleted_at.is_(None)).order_by(Case.created_at.desc())
    if status:
        query = query.where(Case.status == status)
    result = await db.execute(query.options(selectinload(Case.patient), selectinload(Case.procedure), selectinload(Case.payer)))
    cases = result.scalars().all()

    summaries = []
    for c in cases:
        summaries.append(
            CaseSummary(
                id=c.id,
                case_number=c.case_number,
                status=c.status,
                priority=c.priority,
                patient_name=c.patient.name if c.patient else None,
                procedure_type=c.procedure.cpt_description if c.procedure else None,
                payer_name=c.payer.name if c.payer else None,
                department=c.department,
                deadline=c.deadline,
                approval_likelihood=c.approval_likelihood,
                created_at=c.created_at.isoformat() if c.created_at else "",
                updated_at=c.updated_at.isoformat() if c.updated_at else "",
            )
        )
    return APIResponse(data=summaries, meta={"total": len(summaries)})


@router.get("/cases/{case_id}", response_model=APIResponse)
async def get_case(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = await _load_case(db, case_id)
    return APIResponse(data=_build_detail(case))


@router.patch("/cases/{case_id}", response_model=APIResponse)
async def update_case(case_id: str, body: CaseUpdate, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = await _load_case(db, case_id)
    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(case, key, value)
    if body.status == "submitted" and not case.submitted_at:
        case.submitted_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(case)
    case = await _load_case(db, case_id)
    return APIResponse(data=_build_detail(case))


@router.post("/cases/{case_id}/patient", response_model=APIResponse)
async def set_patient(case_id: str, body: CaseSetPatient, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = await _load_case(db, case_id)

    if case.patient:
        patient = case.patient
        for key, value in body.model_dump(exclude_unset=True, exclude={"field_confidence"}).items():
            setattr(patient, key, value)
        if body.field_confidence:
            patient.field_confidence = {k: v.model_dump() for k, v in body.field_confidence.items()}
    else:
        confidence = {k: v.model_dump() for k, v in body.field_confidence.items()} if body.field_confidence else {}
        patient = Patient(
            **body.model_dump(exclude={"field_confidence"}),
            field_confidence=confidence,
        )
        db.add(patient)
        await db.flush()
        case.patient_id = patient.id

    # Auto-detect payer
    if body.insurance_payer:
        from sqlalchemy import func as sql_func
        payer_result = await db.execute(
            select(Payer).where(sql_func.lower(Payer.name).contains(body.insurance_payer.lower().split()[0]))
        )
        payer = payer_result.scalar_one_or_none()
        if payer:
            case.payer_id = payer.id

    # Recalculate approval
    case = await _recalculate(db, case)
    await db.commit()
    db.expire_all()
    case = await _load_case(db, case_id)
    return APIResponse(data=_build_detail(case))


@router.post("/cases/{case_id}/procedure", response_model=APIResponse)
async def set_procedure(case_id: str, body: CaseSetProcedure, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = await _load_case(db, case_id)

    if case.procedure:
        for key, value in body.model_dump(exclude_unset=True).items():
            setattr(case.procedure, key, value)
    else:
        proc = Procedure(case_id=case.id, **body.model_dump())
        db.add(proc)

    case = await _recalculate(db, case)
    await db.commit()
    db.expire_all()
    case = await _load_case(db, case_id)
    return APIResponse(data=_build_detail(case))


@router.post("/cases/{case_id}/documents", response_model=APIResponse)
async def set_documents(case_id: str, body: CaseSetDocuments, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = await _load_case(db, case_id)

    # Clear existing documents for this case
    for doc in case.documents:
        await db.delete(doc)

    for doc_req in body.documents:
        doc = Document(
            case_id=case.id,
            doc_key=doc_req.id,
            name=doc_req.name,
            status=doc_req.status,
            source=doc_req.source,
            date=doc_req.date,
            required=doc_req.required,
        )
        db.add(doc)

    case = await _recalculate(db, case)
    await db.commit()
    db.expire_all()
    case = await _load_case(db, case_id)
    return APIResponse(data=_build_detail(case))


@router.get("/cases/{case_id}/approval-likelihood", response_model=APIResponse)
async def get_approval_likelihood(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    case = await _load_case(db, case_id)
    likelihood, factors = calculate_approval(case)
    return APIResponse(data={"approval_likelihood": likelihood, "factors": [f.model_dump() for f in factors]})


@router.post("/cases/{case_id}/submit", response_model=APIResponse)
async def submit_case(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    """Submit a case for PA — triggers the submission router."""
    case = await _load_case(db, case_id)
    if case.status == "submitted":
        return APIResponse(data={"message": "Case already submitted"}, errors=[{"error": "already_submitted"}])

    from app.services.submission_router import route_submission
    submission = await route_submission(db, case)

    case.status = "submitted"
    case.submitted_at = datetime.now(timezone.utc)

    # Update steps
    steps = case.steps or DEFAULT_STEPS
    for s in steps:
        if s["id"] in ("patient", "procedure", "documentation", "review", "submit"):
            s["status"] = "complete"
        elif s["id"] == "check-status":
            s["status"] = "active"
    case.steps = steps

    await db.commit()
    case = await _load_case(db, case_id)
    return APIResponse(data={
        "case": _build_detail(case).model_dump(),
        "submission": {
            "id": submission.id,
            "channel": submission.channel,
            "status": submission.status,
            "tracking_number": submission.tracking_number,
        },
    })


async def _recalculate(db: AsyncSession, case: Case) -> Case:
    """Recalculate approval likelihood and step statuses."""
    await db.flush()

    # Reload relationships
    if case.patient_id:
        result = await db.execute(select(Patient).where(Patient.id == case.patient_id))
        patient = result.scalar_one_or_none()
    else:
        patient = None

    if case.procedure:
        proc = case.procedure
    else:
        result = await db.execute(select(Procedure).where(Procedure.case_id == case.id))
        proc = result.scalar_one_or_none()

    doc_result = await db.execute(select(Document).where(Document.case_id == case.id))
    docs = doc_result.scalars().all()

    # Calculate approval
    from app.services.approval_calculator import calculate_approval_from_data
    likelihood, factors = calculate_approval_from_data(patient, proc, docs)
    case.approval_likelihood = likelihood
    case.approval_factors = [f.model_dump() for f in factors]

    # Derive step statuses
    from app.services.step_deriver import derive_steps
    case.steps = derive_steps(patient, proc, docs, case.status)
    case.current_step = next((s["id"] for s in case.steps if s["status"] == "active"), case.current_step)

    if case.status == "draft" and patient and patient.name:
        case.status = "in-progress"

    return case
