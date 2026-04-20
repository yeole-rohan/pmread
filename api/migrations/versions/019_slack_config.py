"""Add slack_bot_token to projects and create slack_channels table

Revision ID: 019
Revises: 018
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "019"
down_revision = "018"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("projects", sa.Column("slack_bot_token", sa.String(), nullable=True))

    op.create_table(
        "slack_channels",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column(
            "project_id",
            UUID(as_uuid=True),
            sa.ForeignKey("projects.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("channel_name", sa.String(), nullable=False),
        sa.Column("message_count", sa.Integer(), nullable=True),
        sa.Column("last_fetched_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )


def downgrade():
    op.drop_table("slack_channels")
    op.drop_column("projects", "slack_bot_token")
