import uuid
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    category: Mapped[str]           # "bug" | "suggestion" | "praise"
    message: Mapped[str] = mapped_column(Text)
    page: Mapped[str | None]        # URL path where feedback was submitted
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
