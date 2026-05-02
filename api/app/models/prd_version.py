import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


class PrdVersion(Base):
    __tablename__ = "prd_versions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    prd_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    brief: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    brief_markdown: Mapped[str | None] = mapped_column(Text, nullable=True)
    # creation | extension | restore
    trigger: Mapped[str] = mapped_column(String(20), nullable=False, default="creation")
    triggered_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
