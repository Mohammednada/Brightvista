"""
Status monitor — simulates payer status checks for the prototype.
"""

import random
from datetime import datetime, timezone

from app.models.submission import Submission


async def simulate_status_check(submission: Submission) -> dict:
    """Simulate a payer status check response."""

    # Calculate how long since submission
    if submission.submitted_at:
        elapsed = datetime.now(timezone.utc) - submission.submitted_at.replace(tzinfo=timezone.utc)
        hours_elapsed = elapsed.total_seconds() / 3600
    else:
        hours_elapsed = 0

    # Simulate progression based on time
    if submission.outcome:
        return {
            "status": "decided",
            "outcome": submission.outcome,
            "auth_number": submission.auth_number,
            "channel": submission.channel,
            "tracking_number": submission.tracking_number,
            "message": f"Decision reached: {submission.outcome}",
        }

    if hours_elapsed < 1:
        status = "received"
        message = "PA request received by payer. Under initial review."
        progress = 25
    elif hours_elapsed < 24:
        status = "in-review"
        message = "PA request is under clinical review by payer medical team."
        progress = 50
    elif hours_elapsed < 72:
        status = "pending-decision"
        message = "Clinical review complete. Awaiting final determination."
        progress = 75
    else:
        # After 72h, randomly decide
        outcomes = ["approved", "approved", "approved", "denied"]  # 75% approval
        outcome = random.choice(outcomes)
        status = "decided"
        message = f"Decision reached: {outcome}"
        progress = 100

        return {
            "status": status,
            "outcome": outcome,
            "auth_number": f"AUTH-{random.randint(100000, 999999)}" if outcome == "approved" else None,
            "channel": submission.channel,
            "tracking_number": submission.tracking_number,
            "message": message,
            "progress": progress,
        }

    return {
        "status": status,
        "outcome": None,
        "channel": submission.channel,
        "tracking_number": submission.tracking_number,
        "message": message,
        "progress": progress,
        "estimated_decision": "3-5 business days",
    }
