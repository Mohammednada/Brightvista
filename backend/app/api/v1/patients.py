from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.core.exceptions import NotFoundError
from app.models.patient import Patient
from app.schemas.common import APIResponse
from app.schemas.patient import PatientResponse

router = APIRouter()


@router.get("/patients", response_model=APIResponse)
async def list_patients(db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Patient).order_by(Patient.created_at.desc()))
    patients = result.scalars().all()
    return APIResponse(data=[PatientResponse.model_validate(p) for p in patients])


@router.get("/patients/{patient_id}", response_model=APIResponse)
async def get_patient(patient_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise NotFoundError("Patient", patient_id)
    return APIResponse(data=PatientResponse.model_validate(patient))


@router.get("/patients/lookup/{mrn}", response_model=APIResponse)
async def lookup_patient_by_mrn(mrn: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Patient).where(Patient.mrn == mrn))
    patient = result.scalar_one_or_none()
    if not patient:
        raise NotFoundError("Patient", mrn)
    return APIResponse(data=PatientResponse.model_validate(patient))
