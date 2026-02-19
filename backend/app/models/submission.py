import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String, ForeignKey("cases.id"))

    channel: Mapped[str] = mapped_column(String(20))  # api, portal, phone, fax
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending, in-progress, submitted, failed, completed
    tracking_number: Mapped[str | None] = mapped_column(String(100))

    # Channel-specific data
    request_payload: Mapped[dict | None] = mapped_column(JSON)
    response_payload: Mapped[dict | None] = mapped_column(JSON)
    error_message: Mapped[str | None] = mapped_column(String)

    # Outcome
    outcome: Mapped[str | None] = mapped_column(String(30))  # approved, denied, pended, partial
    auth_number: Mapped[str | None] = mapped_column(String(50))
    decision_notes: Mapped[str | None] = mapped_column(String)

    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    case: Mapped["Case"] = relationship(back_populates="submissions")  # noqa: F821
