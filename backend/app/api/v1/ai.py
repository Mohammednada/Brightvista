"""AI-powered endpoints — clinical NLP, narrative generation, code validation."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.clinical_nlp import extract_clinical_entities, validate_cpt, validate_icd10
from app.ai.narrative_generator import generate_narrative
from app.api.deps import get_current_user, get_session
from app.schemas.common import APIResponse

router = APIRouter()


class ClinicalTextInput(BaseModel):
    text: str


class CodeValidation(BaseModel):
    code: str


class NarrativeRequest(BaseModel):
    patient_name: str
    cpt_code: str
    cpt_description: str
    icd10_code: str
    icd10_description: str
    payer_name: str
    clinical_notes: str | None = None


class ChatMessage(BaseModel):
    message: str
    case_id: str | None = None


@router.post("/ai/extract-clinical", response_model=APIResponse)
async def extract_clinical(body: ClinicalTextInput, user=Depends(get_current_user)):
    result = await extract_clinical_entities(body.text)
    return APIResponse(data=result)


@router.post("/ai/validate-cpt", response_model=APIResponse)
async def validate_cpt_code(body: CodeValidation, user=Depends(get_current_user)):
    result = validate_cpt(body.code)
    return APIResponse(data=result)


@router.post("/ai/validate-icd10", response_model=APIResponse)
async def validate_icd10_code(body: CodeValidation, user=Depends(get_current_user)):
    result = validate_icd10(body.code)
    return APIResponse(data=result)


@router.post("/ai/generate-narrative", response_model=APIResponse)
async def gen_narrative(body: NarrativeRequest, user=Depends(get_current_user)):
    narrative = await generate_narrative(
        patient_name=body.patient_name,
        cpt_code=body.cpt_code,
        cpt_description=body.cpt_description,
        icd10_code=body.icd10_code,
        icd10_description=body.icd10_description,
        payer_name=body.payer_name,
        clinical_notes=body.clinical_notes,
    )
    return APIResponse(data={"narrative": narrative})


@router.post("/ai/chat", response_model=APIResponse)
async def ai_chat(body: ChatMessage, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    """AI chat endpoint — processes user messages and returns agent responses.
    Uses Claude API when available, falls back to smart pattern matching."""

    from app.services.chat_agent import process_message
    response = await process_message(db, body.message, body.case_id)
    return APIResponse(data=response)
