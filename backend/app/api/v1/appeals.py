from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.core.exceptions import NotFoundError
from app.models.appeal import Appeal
from app.models.case import Case
from app.schemas.common import APIResponse

router = APIRouter()


@router.post("/cases/{case_id}/appeals", response_model=APIResponse)
async def create_appeal(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    """Generate an appeal for a denied case."""
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise NotFoundError("Case", case_id)

    # Count existing appeals to determine level
    appeal_result = await db.execute(select(Appeal).where(Appeal.case_id == case_id))
    existing = appeal_result.scalars().all()
    level = len(existing) + 1

    from app.services.appeal_generator import generate_appeal
    appeal_data = await generate_appeal(case, level)

    appeal = Appeal(
        case_id=case_id,
        appeal_level=level,
        status="draft",
        denial_reason=case.denial_reason or "Medical necessity not demonstrated",
        appeal_strategy=appeal_data["strategy"],
        appeal_letter=appeal_data["letter"],
    )
    db.add(appeal)
    await db.commit()
    await db.refresh(appeal)

    return APIResponse(data={
        "id": appeal.id,
        "appeal_level": appeal.appeal_level,
        "status": appeal.status,
        "strategy": appeal.appeal_strategy,
        "letter": appeal.appeal_letter,
    })


@router.get("/cases/{case_id}/appeals", response_model=APIResponse)
async def list_appeals(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Appeal).where(Appeal.case_id == case_id).order_by(Appeal.appeal_level))
    appeals = result.scalars().all()
    data = []
    for a in appeals:
        data.append({
            "id": a.id,
            "appeal_level": a.appeal_level,
            "status": a.status,
            "denial_reason": a.denial_reason,
            "strategy": a.appeal_strategy,
            "letter": a.appeal_letter,
            "outcome": a.outcome,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        })
    return APIResponse(data=data)
