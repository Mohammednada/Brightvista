import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PayerRule(Base):
    __tablename__ = "payer_rules"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    payer_id: Mapped[str] = mapped_column(String, ForeignKey("payers.id"))

    cpt_code: Mapped[str] = mapped_column(String(10), index=True)
    cpt_description: Mapped[str | None] = mapped_column(String(500))
    pa_required: Mapped[bool] = mapped_column(Boolean, default=True)
    plan_types: Mapped[list | None] = mapped_column(JSON)  # ["HMO", "PPO", "EPO"]

    # Requirements
    required_documents: Mapped[list | None] = mapped_column(JSON)  # list of doc keys
    clinical_criteria: Mapped[list | None] = mapped_column(JSON)  # medical necessity criteria
    age_restrictions: Mapped[str | None] = mapped_column(String(100))
    gender_restrictions: Mapped[str | None] = mapped_column(String(20))

    # Historical performance
    historical_approval_rate: Mapped[float | None] = mapped_column(Float)
    avg_decision_days: Mapped[int | None] = mapped_column(Integer)
    common_denial_reasons: Mapped[list | None] = mapped_column(JSON)

    # Effective dates
    effective_from: Mapped[str | None] = mapped_column(String(20))
    effective_to: Mapped[str | None] = mapped_column(String(20))

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    payer: Mapped["Payer"] = relationship(back_populates="rules")  # noqa: F821
