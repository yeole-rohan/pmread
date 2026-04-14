"""add feedback table

Revision ID: 008
Revises: 007
Create Date: 2026-04-14
"""
from alembic import op
import sqlalchemy as sa

revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "feedback",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("page", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_feedback_user_id", "feedback", ["user_id"])


def downgrade():
    op.drop_index("ix_feedback_user_id", table_name="feedback")
    op.drop_table("feedback")
