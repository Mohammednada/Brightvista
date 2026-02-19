import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, Float, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Payer(Base):
    __tablename__ = "payers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), unique=True)
    short_name: Mapped[str | None] = mapped_column(String(50))
    portal_url: Mapped[str | None] = mapped_column(String(500))
    phone_number: Mapped[str | None] = mapped_column(String(30))
    fax_number: Mapped[str | None] = mapped_column(String(30))
    api_endpoint: Mapped[str | None] = mapped_column(String(500))

    # Submission profile
    supported_channels: Mapped[list | None] = mapped_column(JSON, default=list)  # ["api", "portal", "phone", "fax"]
    preferred_channel: Mapped[str | None] = mapped_column(String(20))
    avg_turnaround_days: Mapped[int | None] = mapped_column(Integer)
    approval_rate: Mapped[float | None] = mapped_column(Float)

    # IVR navigation map (for voice channel)
    ivr_map: Mapped[dict | None] = mapped_column(JSON)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    rules: Mapped[list["PayerRule"]] = relationship(back_populates="payer")  # noqa: F821
    cases: Mapped[list["Case"]] = relationship(back_populates="payer")  # noqa: F821
