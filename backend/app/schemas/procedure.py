from pydantic import BaseModel


class ProcedureCreate(BaseModel):
    cpt_code: str | None = None
    cpt_description: str | None = None
    icd10_code: str | None = None
    icd10_description: str | None = None
    ordering_physician: str | None = None
    cpt_valid: bool | None = None
    icd10_valid: bool | None = None


class ProcedureResponse(BaseModel):
    id: str
    case_id: str
    cpt_code: str | None = None
    cpt_description: str | None = None
    icd10_code: str | None = None
    icd10_description: str | None = None
    ordering_physician: str | None = None
    cpt_valid: bool | None = None
    icd10_valid: bool | None = None

    model_config = {"from_attributes": True}
