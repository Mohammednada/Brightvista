from pydantic import BaseModel

from app.schemas.patient import PatientResponse, FieldConfidence
from app.schemas.procedure import ProcedureResponse


class DocumentRequirement(BaseModel):
    id: str
    name: str
    status: str = "missing"  # found, missing, recommended, na
    source: str | None = None
    date: str | None = None
    required: bool = True


class ApprovalFactor(BaseModel):
    label: str
    weight: int
    met: bool


class StepState(BaseModel):
    id: str
    label: str
    sublabel: str | None = None
    status: str = "pending"  # pending, active, complete, needs-attention


class CaseCreate(BaseModel):
    priority: str = "medium"
    department: str | None = None
    deadline: str | None = None


class CaseUpdate(BaseModel):
    status: str | None = None
    current_step: str | None = None
    priority: str | None = None
    department: str | None = None
    deadline: str | None = None
    notes: str | None = None


class CaseSetPatient(BaseModel):
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


class CaseSetProcedure(BaseModel):
    cpt_code: str | None = None
    cpt_description: str | None = None
    icd10_code: str | None = None
    icd10_description: str | None = None
    ordering_physician: str | None = None
    cpt_valid: bool | None = None
    icd10_valid: bool | None = None


class CaseSetDocuments(BaseModel):
    documents: list[DocumentRequirement]


class CaseSummary(BaseModel):
    id: str
    case_number: str
    status: str
    priority: str
    patient_name: str | None = None
    procedure_type: str | None = None
    payer_name: str | None = None
    department: str | None = None
    deadline: str | None = None
    approval_likelihood: int
    created_at: str
    updated_at: str


class CaseDetail(BaseModel):
    id: str
    case_number: str
    status: str
    current_step: str
    priority: str
    approval_likelihood: int
    approval_factors: list[ApprovalFactor]
    steps: list[StepState]
    patient: PatientResponse | None = None
    procedure: ProcedureResponse | None = None
    documents: list[DocumentRequirement]
    payer_name: str | None = None
    department: str | None = None
    deadline: str | None = None
    auth_number: str | None = None
    denial_reason: str | None = None
    notes: str | None = None
    created_at: str
    updated_at: str
    submitted_at: str | None = None
