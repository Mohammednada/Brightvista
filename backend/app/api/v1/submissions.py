from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.core.exceptions import NotFoundError
from app.models.submission import Submission
from app.schemas.common import APIResponse
from app.schemas.submission import SubmissionResponse

router = APIRouter()


@router.get("/cases/{case_id}/submissions", response_model=APIResponse)
async def list_submissions(case_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(
        select(Submission).where(Submission.case_id == case_id).order_by(Submission.created_at.desc())
    )
    subs = result.scalars().all()
    data = []
    for s in subs:
        data.append(SubmissionResponse(
            id=s.id,
            case_id=s.case_id,
            channel=s.channel,
            status=s.status,
            tracking_number=s.tracking_number,
            outcome=s.outcome,
            auth_number=s.auth_number,
            error_message=s.error_message,
            submitted_at=s.submitted_at.isoformat() if s.submitted_at else None,
            decided_at=s.decided_at.isoformat() if s.decided_at else None,
        ))
    return APIResponse(data=data)


@router.get("/submissions/{submission_id}", response_model=APIResponse)
async def get_submission(submission_id: str, db: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise NotFoundError("Submission", submission_id)
    return APIResponse(data=SubmissionResponse(
        id=sub.id,
        case_id=sub.case_id,
        channel=sub.channel,
        status=sub.status,
        tracking_number=sub.tracking_number,
        outcome=sub.outcome,
        auth_number=sub.auth_number,
        error_message=sub.error_message,
        submitted_at=sub.submitted_at.isoformat() if sub.submitted_at else None,
        decided_at=sub.decided_at.isoformat() if sub.decided_at else None,
    ))
