import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class VoiceCall(Base):
    __tablename__ = "voice_calls"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id: Mapped[str] = mapped_column(String, ForeignKey("submissions.id"))

    call_sid: Mapped[str | None] = mapped_column(String(100))
    phone_number: Mapped[str | None] = mapped_column(String(30))
    status: Mapped[str] = mapped_column(String(30), default="initiated")  # initiated, ringing, in-progress, completed, failed
    duration_seconds: Mapped[int | None] = mapped_column(Integer)
    transcript: Mapped[str | None] = mapped_column(String)
    outcome_summary: Mapped[str | None] = mapped_column(String)
    auth_number_captured: Mapped[str | None] = mapped_column(String(50))

    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
