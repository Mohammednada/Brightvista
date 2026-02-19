import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Appeal(Base):
    __tablename__ = "appeals"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String, ForeignKey("cases.id"))

    appeal_level: Mapped[int] = mapped_column(Integer, default=1)  # 1st, 2nd, 3rd level
    status: Mapped[str] = mapped_column(String(30), default="draft")  # draft, submitted, under-review, decided
    denial_reason: Mapped[str | None] = mapped_column(String)
    appeal_strategy: Mapped[str | None] = mapped_column(String)
    appeal_letter: Mapped[str | None] = mapped_column(String)
    outcome: Mapped[str | None] = mapped_column(String(30))  # overturned, upheld, partial

    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime)
    deadline: Mapped[str | None] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    case: Mapped["Case"] = relationship(back_populates="appeals")  # noqa: F821
