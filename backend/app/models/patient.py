import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str | None] = mapped_column(String(200))
    dob: Mapped[str | None] = mapped_column(String(20))
    mrn: Mapped[str | None] = mapped_column(String(50), index=True)
    phone: Mapped[str | None] = mapped_column(String(30))
    address: Mapped[str | None] = mapped_column(String(500))
    insurance_payer: Mapped[str | None] = mapped_column(String(200))
    member_id: Mapped[str | None] = mapped_column(String(100), index=True)
    plan_type: Mapped[str | None] = mapped_column(String(100))
    referring_physician: Mapped[str | None] = mapped_column(String(200))

    # Confidence metadata per field
    field_confidence: Mapped[dict | None] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    cases: Mapped[list["Case"]] = relationship(back_populates="patient")  # noqa: F821
