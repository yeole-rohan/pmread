"""add ingest_email_token to projects

Revision ID: 023
Revises: 022
"""
revision = "023"
down_revision = "022"

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.add_column(
        "projects",
        sa.Column("ingest_email_token", sa.String(32), nullable=True, unique=True),
    )
    op.execute("UPDATE projects SET ingest_email_token = encode(gen_random_bytes(16), 'hex') WHERE ingest_email_token IS NULL")


def downgrade():
    op.drop_column("projects", "ingest_email_token")
