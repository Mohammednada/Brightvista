"""
Seed data — populates the database on first run with realistic prototype data.

- 5 payers with submission profiles
- 20 payer rules across common CPT codes
- 3 sample cases (draft, in-progress, submitted)
- 2 demo users (coordinator + manager)
"""

from sqlalchemy import select

from app.core.security import hash_password
from app.database import async_session
from app.models.case import Case
from app.models.document import Document
from app.models.patient import Patient
from app.models.payer import Payer
from app.models.payer_rule import PayerRule
from app.models.procedure import Procedure
from app.models.submission import Submission
from app.models.user import User


async def seed_if_empty():
    async with async_session() as db:
        result = await db.execute(select(Payer).limit(1))
        if result.scalar_one_or_none():
            return  # Already seeded

        await _seed_users(db)
        payers = await _seed_payers(db)
        await _seed_rules(db, payers)
        await _seed_cases(db, payers)
        await db.commit()


async def _seed_users(db):
    users = [
        User(
            email="coordinator@brightvista.health",
            name="Sarah Mitchell",
            hashed_password=hash_password("demo123"),
            role="pa-coordinator",
            specialty="Orthopedics",
        ),
        User(
            email="manager@brightvista.health",
            name="Dr. James Chen",
            hashed_password=hash_password("demo123"),
            role="pa-manager",
            specialty="General",
        ),
    ]
    for u in users:
        db.add(u)


async def _seed_payers(db) -> dict[str, Payer]:
    payer_data = [
        {
            "name": "BlueCross BlueShield",
            "short_name": "BCBS",
            "portal_url": "https://provider.bcbs.com/pa",
            "phone_number": "1-800-676-2583",
            "fax_number": "1-800-676-2584",
            "supported_channels": ["api", "portal", "phone", "fax"],
            "preferred_channel": "api",
            "avg_turnaround_days": 5,
            "approval_rate": 0.87,
            "ivr_map": {"main_menu": "Press 3 for prior auth", "pa_menu": "Press 1 for new request, 2 for status"},
        },
        {
            "name": "UnitedHealthcare",
            "short_name": "UHC",
            "portal_url": "https://provider.uhc.com/priorauth",
            "phone_number": "1-800-842-9800",
            "fax_number": "1-800-842-9801",
            "supported_channels": ["api", "portal", "phone"],
            "preferred_channel": "portal",
            "avg_turnaround_days": 7,
            "approval_rate": 0.82,
            "ivr_map": {"main_menu": "Press 2 for authorizations", "pa_menu": "Press 1 for new, 3 for status check"},
        },
        {
            "name": "Aetna",
            "short_name": "Aetna",
            "portal_url": "https://providerportal.aetna.com",
            "phone_number": "1-800-624-0756",
            "fax_number": "1-800-624-0757",
            "supported_channels": ["portal", "phone", "fax"],
            "preferred_channel": "portal",
            "avg_turnaround_days": 6,
            "approval_rate": 0.84,
            "ivr_map": {"main_menu": "Press 4 for precertification"},
        },
        {
            "name": "Cigna",
            "short_name": "Cigna",
            "portal_url": "https://cignaforhcp.cigna.com/priorauth",
            "phone_number": "1-800-768-4695",
            "fax_number": "1-800-768-4696",
            "supported_channels": ["api", "portal", "phone"],
            "preferred_channel": "api",
            "avg_turnaround_days": 4,
            "approval_rate": 0.89,
            "ivr_map": {"main_menu": "Press 1 for prior authorization"},
        },
        {
            "name": "Humana",
            "short_name": "Humana",
            "portal_url": "https://provider.humana.com",
            "phone_number": "1-800-457-4708",
            "fax_number": "1-800-457-4709",
            "supported_channels": ["portal", "phone", "fax"],
            "preferred_channel": "phone",
            "avg_turnaround_days": 8,
            "approval_rate": 0.79,
            "ivr_map": {"main_menu": "Press 5 for prior authorization requests"},
        },
    ]

    payers = {}
    for data in payer_data:
        payer = Payer(**data)
        db.add(payer)
        await db.flush()
        payers[data["short_name"]] = payer
    return payers


async def _seed_rules(db, payers: dict[str, Payer]):
    rules = [
        # BCBS rules
        ("BCBS", "72141", "MRI Cervical Spine without Contrast", True, ["HMO", "PPO", "EPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam"], 0.88, 5,
         ["Insufficient conservative therapy", "Missing referral", "Incomplete clinical documentation"]),
        ("BCBS", "27447", "Total Knee Replacement", True, ["HMO", "PPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam", "previous-imaging", "medication-history"], 0.82, 7,
         ["BMI > 40 without optimization", "Insufficient conservative therapy (< 6 months)", "Missing weight-bearing X-rays"]),
        ("BCBS", "70553", "MRI Brain with and without Contrast", True, ["HMO"],
         ["specialist-referral", "physical-exam"], 0.91, 3,
         ["Missing neurologist referral"]),
        ("BCBS", "22612", "Lumbar Spinal Fusion", True, ["HMO", "PPO", "EPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam", "previous-imaging", "medication-history"], 0.72, 10,
         ["Conservative therapy < 12 weeks", "Missing psychological evaluation", "No trial of ESI"]),

        # UHC rules
        ("UHC", "72141", "MRI Cervical Spine without Contrast", True, ["HMO", "PPO"],
         ["conservative-therapy", "physical-exam"], 0.85, 7,
         ["No documented failed conservative treatment", "Missing physical exam findings"]),
        ("UHC", "27447", "Total Knee Replacement", True, ["HMO", "PPO", "EPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam", "previous-imaging"], 0.78, 10,
         ["Insufficient documentation of functional limitation", "BMI criteria not met"]),
        ("UHC", "78816", "PET Scan (Whole Body)", True, ["HMO", "PPO"],
         ["specialist-referral", "previous-imaging"], 0.86, 5,
         ["Missing pathology report", "Prior imaging not provided"]),
        ("UHC", "63030", "Lumbar Laminotomy/Discectomy", True, ["HMO"],
         ["conservative-therapy", "specialist-referral", "previous-imaging", "physical-exam"], 0.80, 8,
         ["Conservative therapy duration insufficient", "MRI findings inconsistent"]),

        # Aetna rules
        ("Aetna", "72148", "MRI Lumbar Spine without Contrast", True, ["HMO", "PPO"],
         ["conservative-therapy", "physical-exam"], 0.90, 4,
         ["Missing 6-week conservative therapy documentation"]),
        ("Aetna", "27130", "Total Hip Replacement", True, ["HMO", "PPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam", "previous-imaging"], 0.81, 8,
         ["Incomplete hip X-ray series", "Conservative therapy not adequately documented"]),
        ("Aetna", "71275", "CT Angiography, Chest", True, ["HMO"],
         ["specialist-referral", "physical-exam"], 0.92, 3,
         ["Missing clinical indication documentation"]),
        ("Aetna", "77386", "IMRT Radiation Therapy", True, ["HMO", "PPO", "EPO"],
         ["specialist-referral", "previous-imaging", "medication-history"], 0.88, 5,
         ["Missing tumor board documentation", "Pathology report not provided"]),

        # Cigna rules
        ("Cigna", "72141", "MRI Cervical Spine without Contrast", True, ["HMO", "PPO"],
         ["conservative-therapy", "physical-exam"], 0.92, 3,
         ["Missing physical exam documentation"]),
        ("Cigna", "29881", "Knee Arthroscopy with Meniscectomy", True, ["HMO", "PPO"],
         ["conservative-therapy", "specialist-referral", "previous-imaging"], 0.87, 5,
         ["MRI not provided", "Conservative therapy < 4 weeks"]),
        ("Cigna", "64483", "Epidural Steroid Injection, Lumbar", True, ["HMO"],
         ["conservative-therapy", "physical-exam", "previous-imaging"], 0.93, 3,
         ["Exceeds frequency limit (3 per year)"]),
        ("Cigna", "74177", "CT Abdomen and Pelvis with Contrast", True, ["HMO", "PPO"],
         ["specialist-referral", "physical-exam"], 0.94, 2,
         ["Missing clinical indication"]),

        # Humana rules
        ("Humana", "72141", "MRI Cervical Spine without Contrast", True, ["HMO", "PPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam"], 0.81, 8,
         ["Documentation incomplete", "Missing referral from PCP"]),
        ("Humana", "27447", "Total Knee Replacement", True, ["HMO", "PPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam", "previous-imaging", "medication-history"], 0.75, 12,
         ["Functional assessment missing", "Weight management not addressed"]),
        ("Humana", "23472", "Total Shoulder Replacement", True, ["HMO", "PPO"],
         ["conservative-therapy", "specialist-referral", "physical-exam", "previous-imaging"], 0.77, 10,
         ["Insufficient conservative therapy documentation", "Missing shoulder X-ray series"]),
        ("Humana", "20610", "Joint Injection (Major Joint)", True, ["HMO"],
         ["physical-exam"], 0.95, 2,
         ["Exceeds annual frequency limit"]),
    ]

    for short_name, cpt, desc, pa_req, plans, docs, rate, days, denials in rules:
        payer = payers[short_name]
        rule = PayerRule(
            payer_id=payer.id,
            cpt_code=cpt,
            cpt_description=desc,
            pa_required=pa_req,
            plan_types=plans,
            required_documents=docs,
            clinical_criteria=[f"Medical necessity for {desc}", "Failed conservative therapy", "Clinical documentation complete"],
            historical_approval_rate=rate,
            avg_decision_days=days,
            common_denial_reasons=denials,
        )
        db.add(rule)


async def _seed_cases(db, payers: dict[str, Payer]):
    # Case 1: Draft — just started
    p1 = Patient(
        name="Margaret Thompson",
        dob="03/15/1958",
        mrn="NHC-2024-88421",
        phone="(860) 555-0147",
        insurance_payer="BlueCross BlueShield",
        member_id="BCB-447821953",
        plan_type="PPO Gold",
        referring_physician="Dr. Sarah Patel",
        field_confidence={
            "name": {"source": "ehr", "confidence": 98, "verified": True, "needs_review": False},
            "dob": {"source": "ehr", "confidence": 98, "verified": True, "needs_review": False},
            "mrn": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "insurance_payer": {"source": "ehr", "confidence": 95, "verified": True, "needs_review": False},
            "member_id": {"source": "ehr", "confidence": 95, "verified": True, "needs_review": False},
        },
    )
    db.add(p1)
    await db.flush()

    c1 = Case(
        case_number="PA-2026-1847",
        status="in-progress",
        current_step="procedure",
        priority="urgent",
        patient_id=p1.id,
        payer_id=payers["BCBS"].id,
        department="Orthopedics",
        deadline="Feb 16, 2026",
        approval_likelihood=20,
        steps=[
            {"id": "patient", "label": "Patient Info", "status": "complete"},
            {"id": "procedure", "label": "Procedure", "status": "active"},
            {"id": "documentation", "label": "Documentation", "status": "pending"},
            {"id": "review", "label": "Review", "status": "pending"},
            {"id": "submit", "label": "Submit", "status": "pending"},
            {"id": "check-status", "label": "Check Status", "status": "pending"},
            {"id": "decision", "label": "Decision", "status": "pending"},
        ],
        approval_factors=[
            {"label": "Patient information complete", "weight": 20, "met": True},
            {"label": "Procedure codes validated", "weight": 15, "met": False},
            {"label": "All required documents present", "weight": 35, "met": False},
            {"label": "Conservative therapy documented", "weight": 15, "met": False},
            {"label": "Specialist referral present", "weight": 15, "met": False},
        ],
    )
    db.add(c1)
    await db.flush()

    # Case 2: In-progress — has procedure + some docs
    p2 = Patient(
        name="Robert Chen",
        dob="07/22/1965",
        mrn="NHC-2024-77103",
        phone="(860) 555-0283",
        insurance_payer="UnitedHealthcare",
        member_id="UHC-338912674",
        plan_type="HMO Standard",
        referring_physician="Dr. Michael Torres",
        field_confidence={
            "name": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "dob": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "mrn": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "insurance_payer": {"source": "ehr", "confidence": 97, "verified": True, "needs_review": False},
            "member_id": {"source": "ehr", "confidence": 97, "verified": True, "needs_review": False},
        },
    )
    db.add(p2)
    await db.flush()

    c2 = Case(
        case_number="PA-2026-1852",
        status="in-progress",
        current_step="documentation",
        priority="high",
        patient_id=p2.id,
        payer_id=payers["UHC"].id,
        department="Orthopedics",
        deadline="Feb 20, 2026",
        approval_likelihood=50,
        steps=[
            {"id": "patient", "label": "Patient Info", "status": "complete"},
            {"id": "procedure", "label": "Procedure", "status": "complete"},
            {"id": "documentation", "label": "Documentation", "status": "needs-attention", "sublabel": "2/4 docs"},
            {"id": "review", "label": "Review", "status": "pending"},
            {"id": "submit", "label": "Submit", "status": "pending"},
            {"id": "check-status", "label": "Check Status", "status": "pending"},
            {"id": "decision", "label": "Decision", "status": "pending"},
        ],
        approval_factors=[
            {"label": "Patient information complete", "weight": 20, "met": True},
            {"label": "Procedure codes validated", "weight": 15, "met": True},
            {"label": "All required documents present", "weight": 35, "met": False},
            {"label": "Conservative therapy documented", "weight": 15, "met": True},
            {"label": "Specialist referral present", "weight": 15, "met": False},
        ],
    )
    db.add(c2)
    await db.flush()

    proc2 = Procedure(
        case_id=c2.id,
        cpt_code="27447",
        cpt_description="Total Knee Replacement (Arthroplasty)",
        icd10_code="M17.11",
        icd10_description="Primary osteoarthritis, right knee",
        ordering_physician="Dr. Michael Torres",
        cpt_valid=True,
        icd10_valid=True,
    )
    db.add(proc2)

    docs2 = [
        Document(case_id=c2.id, doc_key="conservative-therapy", name="Conservative Therapy Records", status="found", source="EMR", date="12 weeks PT completed", required=True),
        Document(case_id=c2.id, doc_key="specialist-referral", name="Specialist Referral Letter", status="missing", required=True),
        Document(case_id=c2.id, doc_key="physical-exam", name="Physical Exam Notes", status="found", source="Dr. Torres", date="Feb 5, 2026", required=True),
        Document(case_id=c2.id, doc_key="previous-imaging", name="Previous Imaging Results", status="missing", required=True),
        Document(case_id=c2.id, doc_key="medication-history", name="Medication History", status="found", source="EMR", date="Current", required=False),
    ]
    for d in docs2:
        db.add(d)

    # Case 3: Submitted — full case
    from datetime import datetime, timedelta, timezone

    p3 = Patient(
        name="Sarah Williams",
        dob="11/03/1972",
        mrn="NHC-2024-65890",
        phone="(860) 555-0419",
        insurance_payer="Aetna",
        member_id="AET-556781234",
        plan_type="PPO Premier",
        referring_physician="Dr. Lisa Park",
        field_confidence={
            "name": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "dob": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "mrn": {"source": "ehr", "confidence": 99, "verified": True, "needs_review": False},
            "insurance_payer": {"source": "ehr", "confidence": 98, "verified": True, "needs_review": False},
            "member_id": {"source": "ehr", "confidence": 98, "verified": True, "needs_review": False},
        },
    )
    db.add(p3)
    await db.flush()

    submitted_time = datetime.now(timezone.utc) - timedelta(hours=36)

    c3 = Case(
        case_number="PA-2026-1831",
        status="submitted",
        current_step="check-status",
        priority="medium",
        patient_id=p3.id,
        payer_id=payers["Aetna"].id,
        department="Cardiology",
        deadline="Feb 22, 2026",
        submitted_at=submitted_time,
        approval_likelihood=85,
        steps=[
            {"id": "patient", "label": "Patient Info", "status": "complete"},
            {"id": "procedure", "label": "Procedure", "status": "complete"},
            {"id": "documentation", "label": "Documentation", "status": "complete"},
            {"id": "review", "label": "Review", "status": "complete"},
            {"id": "submit", "label": "Submit", "status": "complete"},
            {"id": "check-status", "label": "Check Status", "status": "active"},
            {"id": "decision", "label": "Decision", "status": "pending"},
        ],
        approval_factors=[
            {"label": "Patient information complete", "weight": 20, "met": True},
            {"label": "Procedure codes validated", "weight": 15, "met": True},
            {"label": "All required documents present", "weight": 35, "met": True},
            {"label": "Conservative therapy documented", "weight": 15, "met": True},
            {"label": "Specialist referral present", "weight": 15, "met": False},
        ],
    )
    db.add(c3)
    await db.flush()

    proc3 = Procedure(
        case_id=c3.id,
        cpt_code="71275",
        cpt_description="CT Angiography, Chest",
        icd10_code="I25.10",
        icd10_description="Atherosclerotic heart disease",
        ordering_physician="Dr. Lisa Park",
        cpt_valid=True,
        icd10_valid=True,
    )
    db.add(proc3)

    docs3 = [
        Document(case_id=c3.id, doc_key="conservative-therapy", name="Conservative Therapy Records", status="found", source="EMR", date="Medication management documented", required=True),
        Document(case_id=c3.id, doc_key="specialist-referral", name="Specialist Referral Letter", status="found", source="Dr. Park", date="Feb 8, 2026", required=True),
        Document(case_id=c3.id, doc_key="physical-exam", name="Physical Exam Notes", status="found", source="Dr. Park", date="Feb 10, 2026", required=True),
        Document(case_id=c3.id, doc_key="medication-history", name="Medication History", status="found", source="EMR", date="Current", required=False),
    ]
    for d in docs3:
        db.add(d)

    sub3 = Submission(
        case_id=c3.id,
        channel="portal",
        status="submitted",
        tracking_number="TRK-482917",
        submitted_at=submitted_time,
        request_payload={"case_number": "PA-2026-1831", "payer": "Aetna", "channel": "portal"},
        response_payload={"accepted": True, "tracking_number": "TRK-482917", "estimated_decision": "3-5 business days"},
    )
    db.add(sub3)
