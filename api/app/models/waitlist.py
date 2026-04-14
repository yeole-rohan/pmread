from datetime import datetime
from sqlalchemy import String, DateTime, BigInteger, text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WaitlistEmail(Base):
    __tablename__ = "waitlist_emails"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    source: Mapped[str] = mapped_column(String, nullable=False, default="landing")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("NOW()")
    )
