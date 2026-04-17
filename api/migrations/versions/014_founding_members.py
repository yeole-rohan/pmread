"""add founding_member_emails table and prd_credits column on users

Revision ID: 014
Revises: 013
Create Date: 2026-04-17
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "014"
down_revision = "013"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "founding_member_emails",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("claimed_by", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("claimed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("added_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_founding_member_emails_email", "founding_member_emails", ["email"])

    op.add_column(
        "users",
        sa.Column("prd_credits", sa.Integer(), nullable=False, server_default="0"),
    )


def downgrade():
    op.drop_column("users", "prd_credits")
    op.drop_index("ix_founding_member_emails_email", table_name="founding_member_emails")
    op.drop_table("founding_member_emails")
