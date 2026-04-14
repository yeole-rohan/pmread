"""add billing provider and plan date columns

Revision ID: 003
Revises: 002
Create Date: 2026-04-10

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("billing_provider", sa.String(), nullable=True))
    op.add_column("users", sa.Column("plan_started_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("plan_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("razorpay_payment_id", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "billing_provider")
    op.drop_column("users", "plan_started_at")
    op.drop_column("users", "plan_expires_at")
    op.drop_column("users", "razorpay_payment_id")
