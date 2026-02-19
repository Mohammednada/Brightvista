from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    channel: str | None = None  # api, portal, phone, fax — None = auto-route


class SubmissionResponse(BaseModel):
    id: str
    case_id: str
    channel: str
    status: str
    tracking_number: str | None = None
    outcome: str | None = None
    auth_number: str | None = None
    error_message: str | None = None
    submitted_at: str | None = None
    decided_at: str | None = None

    model_config = {"from_attributes": True}
