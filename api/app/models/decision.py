import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Decision(Base):
    __tablename__ = "decisions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    what_we_decided: Mapped[str] = mapped_column(Text, nullable=False)
    why: Mapped[str | None] = mapped_column(Text, nullable=True)
    # active | reversed | superseded
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))


class DecisionEvidenceLink(Base):
    __tablename__ = "decision_evidence_links"

    decision_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("decisions.id", ondelete="CASCADE"), primary_key=True)
    insight_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("insights.id", ondelete="CASCADE"), primary_key=True)
