"""add billing_period to users

Revision ID: 013
Revises: 012
Create Date: 2026-04-16
"""
from alembic import op
import sqlalchemy as sa

revision = "013"
down_revision = "012"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column("billing_period", sa.String(), nullable=True),
    )


def downgrade():
    op.drop_column("users", "billing_period")
