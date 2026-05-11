"""prd_summaries table

Revision ID: 027
Revises: 026
"""
revision = "027"
down_revision = "026"

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB


def upgrade():
    op.create_table(
        "prd_summaries",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("analysis_id", UUID(as_uuid=True), sa.ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("content", JSONB, nullable=False),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("is_stale", sa.Boolean, nullable=False, server_default=sa.text("false")),
        sa.Column("share_token", sa.String(64), nullable=True, unique=True),
    )
    op.create_index("ix_prd_summaries_analysis_id", "prd_summaries", ["analysis_id"])


def downgrade():
    op.drop_index("ix_prd_summaries_analysis_id", "prd_summaries")
    op.drop_table("prd_summaries")
