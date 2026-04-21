"""add plan_renews_at to users

Revision ID: 020
Revises: 019
"""
revision = "020"
down_revision = "019"

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column(
        "users",
        sa.Column("plan_renews_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade():
    op.drop_column("users", "plan_renews_at")
