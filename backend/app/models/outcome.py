import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Outcome(Base):
    """Tracks outcomes for the learning/feedback loop."""

    __tablename__ = "outcomes"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String, ForeignKey("cases.id"), index=True)
    payer_id: Mapped[str | None] = mapped_column(String, ForeignKey("payers.id"))

    cpt_code: Mapped[str | None] = mapped_column(String(10))
    icd10_code: Mapped[str | None] = mapped_column(String(10))
    outcome: Mapped[str] = mapped_column(String(30))  # approved, denied, partial, appealed-overturned
    predicted_likelihood: Mapped[int | None] = mapped_column(Integer)
    actual_turnaround_days: Mapped[int | None] = mapped_column(Integer)

    channel_used: Mapped[str | None] = mapped_column(String(20))
    submission_attempts: Mapped[int] = mapped_column(Integer, default=1)
    denial_reason_code: Mapped[str | None] = mapped_column(String(50))
    appeal_successful: Mapped[bool | None] = mapped_column(default=None)

    # Features used for prediction improvement
    feature_snapshot: Mapped[dict | None] = mapped_column(JSON)
    prediction_accuracy: Mapped[float | None] = mapped_column(Float)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
