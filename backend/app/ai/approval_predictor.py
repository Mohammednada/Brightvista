"""
Approval likelihood predictor — enhanced prediction using payer rules and historical data.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.payer_rule import PayerRule


async def predict_approval(
    db: AsyncSession,
    payer_id: str | None,
    cpt_code: str | None,
    base_likelihood: int,
) -> dict:
    """Enhanced approval prediction using payer-specific rules."""

    adjustments = []
    predicted = base_likelihood

    if payer_id and cpt_code:
        result = await db.execute(
            select(PayerRule).where(PayerRule.payer_id == payer_id, PayerRule.cpt_code == cpt_code)
        )
        rule = result.scalar_one_or_none()

        if rule:
            # Adjust based on historical approval rate
            if rule.historical_approval_rate is not None:
                hist_factor = int(rule.historical_approval_rate * 10)  # Scale to ~0-10 adjustment
                predicted = min(100, predicted + hist_factor)
                adjustments.append({
                    "factor": "Payer historical rate",
                    "detail": f"{rule.historical_approval_rate:.0%} historical approval for CPT {cpt_code}",
                    "adjustment": hist_factor,
                })

            # Check for common denial reasons
            if rule.common_denial_reasons:
                adjustments.append({
                    "factor": "Common denial risks",
                    "detail": f"Watch for: {', '.join(rule.common_denial_reasons[:3])}",
                    "adjustment": 0,
                })

    return {
        "base_likelihood": base_likelihood,
        "predicted_likelihood": min(100, max(0, predicted)),
        "adjustments": adjustments,
        "confidence": "high" if payer_id and cpt_code else "low",
    }
