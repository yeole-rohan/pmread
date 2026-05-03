"""share expiry/revoke/view_count on analyses + prd_share_feedback table

Revision ID: 024
Revises: 023
"""
revision = "024"
down_revision = "023"

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column("analyses", sa.Column("share_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("analyses", sa.Column("share_revoked_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("analyses", sa.Column("share_view_count", sa.Integer(), nullable=False, server_default="0"))

    op.create_table(
        "prd_share_feedback",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("prd_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("project_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("submitter_name", sa.String(200), nullable=False),
        sa.Column("submitter_email", sa.String(200), nullable=True),
        sa.Column("section_ref", sa.String(100), nullable=True),
        sa.Column("feedback_text", sa.Text(), nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )


def downgrade():
    op.drop_table("prd_share_feedback")
    op.drop_column("analyses", "share_view_count")
    op.drop_column("analyses", "share_revoked_at")
    op.drop_column("analyses", "share_expires_at")
