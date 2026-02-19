from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.core.exceptions import NotFoundError
from app.models.payer import Payer
from app.models.payer_rule import PayerRule
from app.schemas.common import APIResponse
from app.schemas.payer import PayerResponse, PayerRuleResponse

router = APIRouter()


@router.get("/payers", response_model=APIResponse)
async def list_payers(db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Payer).order_by(Payer.name))
    payers = result.scalars().all()
    return APIResponse(data=[PayerResponse.model_validate(p) for p in payers])


@router.get("/payers/{payer_id}", response_model=APIResponse)
async def get_payer(payer_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Payer).where(Payer.id == payer_id))
    payer = result.scalar_one_or_none()
    if not payer:
        raise NotFoundError("Payer", payer_id)
    return APIResponse(data=PayerResponse.model_validate(payer))


@router.get("/payers/{payer_id}/rules", response_model=APIResponse)
async def get_payer_rules(payer_id: str, cpt_code: str | None = None, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    query = select(PayerRule).where(PayerRule.payer_id == payer_id)
    if cpt_code:
        query = query.where(PayerRule.cpt_code == cpt_code)
    result = await db.execute(query)
    rules = result.scalars().all()
    return APIResponse(data=[PayerRuleResponse.model_validate(r) for r in rules])


@router.get("/payer-rules/lookup", response_model=APIResponse)
async def lookup_payer_rule(
    payer_name: str | None = None,
    cpt_code: str | None = None,
    db: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    """Look up PA requirements by payer name and/or CPT code."""
    query = select(PayerRule).join(Payer)
    if payer_name:
        from sqlalchemy import func as sql_func
        query = query.where(sql_func.lower(Payer.name).contains(payer_name.lower()))
    if cpt_code:
        query = query.where(PayerRule.cpt_code == cpt_code)
    result = await db.execute(query)
    rules = result.scalars().all()
    return APIResponse(data=[PayerRuleResponse.model_validate(r) for r in rules])
