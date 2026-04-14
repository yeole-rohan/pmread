"""Add password_reset_token and password_reset_exp to users

Revision ID: 007
Revises: 006
"""
from alembic import op
import sqlalchemy as sa

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("password_reset_token", sa.String(), nullable=True))
    op.add_column("users", sa.Column("password_reset_exp", sa.DateTime(timezone=True), nullable=True))


def downgrade():
    op.drop_column("users", "password_reset_exp")
    op.drop_column("users", "password_reset_token")
