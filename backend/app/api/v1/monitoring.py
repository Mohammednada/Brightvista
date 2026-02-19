from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.models.case import Case
from app.models.submission import Submission
from app.schemas.common import APIResponse

router = APIRouter()


@router.get("/monitoring/overview", response_model=APIResponse)
async def monitoring_overview(db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    """Dashboard overview of all case statuses."""
    # Count cases by status
    result = await db.execute(
        select(Case.status, func.count(Case.id)).where(Case.deleted_at.is_(None)).group_by(Case.status)
    )
    status_counts = {row[0]: row[1] for row in result.all()}

    # Count submissions by status
    sub_result = await db.execute(
        select(Submission.status, func.count(Submission.id)).group_by(Submission.status)
    )
    sub_counts = {row[0]: row[1] for row in sub_result.all()}

    # Pending decisions
    pending_result = await db.execute(
        select(func.count(Submission.id)).where(Submission.status == "submitted", Submission.outcome.is_(None))
    )
    pending_decisions = pending_result.scalar() or 0

    return APIResponse(data={
        "cases_by_status": status_counts,
        "submissions_by_status": sub_counts,
        "pending_decisions": pending_decisions,
        "total_cases": sum(status_counts.values()),
    })


@router.get("/monitoring/cases/{case_id}/status", response_model=APIResponse)
async def check_case_status(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    """Check the latest submission status for a case. Simulates a payer status check."""
    result = await db.execute(
        select(Submission).where(Submission.case_id == case_id).order_by(Submission.created_at.desc()).limit(1)
    )
    sub = result.scalar_one_or_none()

    if not sub:
        return APIResponse(data={"status": "no_submission", "message": "No submission found for this case"})

    # In prototype, simulate status progression
    from app.services.status_monitor import simulate_status_check
    status_info = await simulate_status_check(sub)

    return APIResponse(data=status_info)
