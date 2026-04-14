"""Add digest_enabled to users

Revision ID: 006
Revises: 005
"""

from alembic import op
import sqlalchemy as sa

revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column(
        "digest_enabled", sa.Boolean(), nullable=False, server_default="true"
    ))


def downgrade():
    op.drop_column("users", "digest_enabled")
