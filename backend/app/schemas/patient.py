from pydantic import BaseModel


class FieldConfidence(BaseModel):
    source: str = "manual"  # ehr, ocr, manual, ai
    confidence: int = 100
    verified: bool = False
    needs_review: bool = False


class PatientCreate(BaseModel):
    name: str | None = None
    dob: str | None = None
    mrn: str | None = None
    phone: str | None = None
    address: str | None = None
    insurance_payer: str | None = None
    member_id: str | None = None
    plan_type: str | None = None
    referring_physician: str | None = None
    field_confidence: dict[str, FieldConfidence] | None = None


class PatientUpdate(BaseModel):
    name: str | None = None
    dob: str | None = None
    mrn: str | None = None
    phone: str | None = None
    address: str | None = None
    insurance_payer: str | None = None
    member_id: str | None = None
    plan_type: str | None = None
    referring_physician: str | None = None
    field_confidence: dict[str, FieldConfidence] | None = None


class PatientResponse(BaseModel):
    id: str
    name: str | None = None
    dob: str | None = None
    mrn: str | None = None
    phone: str | None = None
    address: str | None = None
    insurance_payer: str | None = None
    member_id: str | None = None
    plan_type: str | None = None
    referring_physician: str | None = None
    field_confidence: dict | None = None

    model_config = {"from_attributes": True}
