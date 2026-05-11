"""workspaces, workspace_members tables + workspace_id on projects

Revision ID: 026
Revises: 025
"""
revision = "026"
down_revision = "025"

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


def upgrade():
    op.create_table(
        "workspaces",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("owner_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )
    op.create_index("ix_workspaces_owner_id", "workspaces", ["owner_id"])

    op.create_table(
        "workspace_members",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("workspace_id", UUID(as_uuid=True), sa.ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True),
        sa.Column("role", sa.String(20), nullable=False),
        sa.Column("invite_email", sa.String(), nullable=True),
        sa.Column("invite_token", sa.String(64), nullable=True, unique=True),
        sa.Column("invited_by_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("invited_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_workspace_members_workspace_id", "workspace_members", ["workspace_id"])
    op.create_index("ix_workspace_members_user_id", "workspace_members", ["user_id"])

    op.add_column(
        "projects",
        sa.Column("workspace_id", UUID(as_uuid=True), sa.ForeignKey("workspaces.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_projects_workspace_id", "projects", ["workspace_id"])


def downgrade():
    op.drop_index("ix_projects_workspace_id", "projects")
    op.drop_column("projects", "workspace_id")
    op.drop_index("ix_workspace_members_user_id", "workspace_members")
    op.drop_index("ix_workspace_members_workspace_id", "workspace_members")
    op.drop_table("workspace_members")
    op.drop_index("ix_workspaces_owner_id", "workspaces")
    op.drop_table("workspaces")
