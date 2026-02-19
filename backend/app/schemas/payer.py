from pydantic import BaseModel


class PayerResponse(BaseModel):
    id: str
    name: str
    short_name: str | None = None
    portal_url: str | None = None
    phone_number: str | None = None
    supported_channels: list[str] | None = None
    preferred_channel: str | None = None
    avg_turnaround_days: int | None = None
    approval_rate: float | None = None

    model_config = {"from_attributes": True}


class PayerRuleResponse(BaseModel):
    id: str
    payer_id: str
    cpt_code: str
    cpt_description: str | None = None
    pa_required: bool
    plan_types: list[str] | None = None
    required_documents: list[str] | None = None
    clinical_criteria: list[str] | None = None
    historical_approval_rate: float | None = None
    avg_decision_days: int | None = None
    common_denial_reasons: list[str] | None = None

    model_config = {"from_attributes": True}
