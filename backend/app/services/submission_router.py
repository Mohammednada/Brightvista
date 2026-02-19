"""
Submission router — selects the best channel and submits.

In prototype mode, all channels are simulated with realistic delays.
"""

import random
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.case import Case
from app.models.payer import Payer
from app.models.submission import Submission


CHANNEL_PRIORITY = ["api", "portal", "phone", "fax"]


async def route_submission(db: AsyncSession, case: Case) -> Submission:
    """Select channel and create a submission record."""

    # Determine available channels from payer profile
    payer = case.payer
    if payer and payer.supported_channels:
        channels = payer.supported_channels
        preferred = payer.preferred_channel or channels[0]
    else:
        channels = ["api", "portal"]
        preferred = "api"

    # Select channel: use preferred if available
    channel = preferred if preferred in channels else channels[0]

    # Simulate submission
    tracking = f"TRK-{random.randint(100000, 999999)}"

    submission = Submission(
        case_id=case.id,
        channel=channel,
        status="submitted",
        tracking_number=tracking,
        submitted_at=datetime.now(timezone.utc),
        request_payload={
            "case_number": case.case_number,
            "patient_name": case.patient.name if case.patient else None,
            "cpt_code": case.procedure.cpt_code if case.procedure else None,
            "payer": payer.name if payer else "Unknown",
            "channel": channel,
        },
        response_payload={
            "accepted": True,
            "tracking_number": tracking,
            "estimated_decision": "3-5 business days",
            "message": f"PA request submitted successfully via {channel} channel.",
        },
    )
    db.add(submission)
    await db.flush()
    return submission
