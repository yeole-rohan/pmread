"""GitHub OAuth + repo context for PRD generation."""
import urllib.parse

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.project import Project
from app.models.user import User

router = APIRouter()

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_BASE = "https://api.github.com"


def _gh_headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _callback_uri() -> str:
    return f"{settings.BACKEND_URL}/api/github/callback"


# ── OAuth ─────────────────────────────────────────────────────────────────────

@router.get("/connect")
async def github_connect(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    """Redirect to GitHub OAuth. Token passed as ?token= query param for browser redirect."""
    request.session["github_user_id"] = str(current_user.id)
    params = urllib.parse.urlencode({
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": _callback_uri(),
        "scope": "repo read:user",
    })
    return RedirectResponse(f"{GITHUB_AUTH_URL}?{params}")


@router.get("/callback")
async def github_callback(
    request: Request,
    code: str = Query(...),
    db: DBSession = Depends(get_db),
):
    user_id = request.session.pop("github_user_id", None)
    if not user_id:
        return RedirectResponse(f"{settings.FRONTEND_URL}/settings?github=error")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": _callback_uri(),
            },
        )

    data = resp.json()
    access_token = data.get("access_token")
    if not access_token:
        return RedirectResponse(f"{settings.FRONTEND_URL}/settings?github=error")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return RedirectResponse(f"{settings.FRONTEND_URL}/settings?github=error")

    user.github_access_token = access_token
    db.commit()

    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?github=connected")


@router.delete("/disconnect")
async def github_disconnect(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    current_user.github_access_token = None
    db.commit()
    return {"success": True}


# ── Repo listing ─────────────────────────────────────────────────────────────

@router.get("/repos")
async def list_repos(current_user: User = Depends(get_current_user)):
    """Return repos the user has access to (first 50, sorted by push date)."""
    if not current_user.github_access_token:
        raise HTTPException(status_code=403, detail={"error": "GitHub not connected", "code": "NOT_CONNECTED"})

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/user/repos",
            headers=_gh_headers(current_user.github_access_token),
            params={"sort": "pushed", "per_page": 50, "affiliation": "owner,collaborator"},
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail={"error": "GitHub API error", "code": "GH_API_ERROR"})

    repos = [
        {
            "full_name": r["full_name"],
            "name": r["name"],
            "private": r["private"],
            "description": r.get("description") or "",
            "language": r.get("language") or "",
        }
        for r in resp.json()
    ]
    return repos


# ── Project repo link ─────────────────────────────────────────────────────────

class SetRepoRequest(BaseModel):
    repo_full_name: str | None  # None = disconnect


@router.patch("/projects/{project_id}/repo")
async def set_project_repo(
    project_id: str,
    body: SetRepoRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    repo_changed = project.github_repo != body.repo_full_name
    project.github_repo = body.repo_full_name

    if body.repo_full_name is None:
        # Disconnecting — clear chunks and status
        project.github_index_status = None
        from app.models.github_chunk import GithubCodeChunk
        db.query(GithubCodeChunk).filter(GithubCodeChunk.project_id == project_id).delete()
    elif repo_changed and current_user.github_access_token:
        # New or changed repo — dispatch to Celery worker (non-blocking)
        project.github_index_status = "indexing"
        from app.tasks.github_index import index_github_repo_task
        index_github_repo_task.delay(
            project_id,
            body.repo_full_name,
            current_user.github_access_token,
        )

    db.commit()
    return {"github_repo": project.github_repo, "github_index_status": project.github_index_status}


@router.get("/projects/{project_id}/index-status")
async def get_index_status(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Poll indexing status for a project's linked repo."""
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    chunk_count = 0
    if project.github_index_status == "ready":
        from app.models.github_chunk import GithubCodeChunk
        chunk_count = db.query(GithubCodeChunk).filter(
            GithubCodeChunk.project_id == project_id
        ).count()

    return {
        "github_repo": project.github_repo,
        "github_index_status": project.github_index_status,
        "chunk_count": chunk_count,
    }


# ── Context fetcher (used by PRD generator) ──────────────────────────────────

async def fetch_github_context(repo_full_name: str, token: str) -> str:
    """Fetch README + open issues + recent merged PRs. Returns formatted context string."""
    headers = _gh_headers(token)
    sections: list[str] = []

    async with httpx.AsyncClient(timeout=10) as client:
        # README
        try:
            r = await client.get(f"{GITHUB_API_BASE}/repos/{repo_full_name}/readme", headers=headers)
            if r.status_code == 200:
                import base64
                content = base64.b64decode(r.json()["content"]).decode("utf-8", errors="ignore")
                # Trim to 3000 chars to stay within token budget
                sections.append(f"## README\n\n{content[:3000]}")
        except Exception:
            pass

        # Open issues with 2+ comments (most active = most painful)
        try:
            r = await client.get(
                f"{GITHUB_API_BASE}/repos/{repo_full_name}/issues",
                headers=headers,
                params={"state": "open", "sort": "comments", "per_page": 15},
            )
            if r.status_code == 200:
                issues = r.json()
                if issues:
                    lines = [f"## Open GitHub Issues (top {len(issues)} by comments)\n"]
                    for iss in issues:
                        lines.append(f"- [{iss['number']}] {iss['title']} ({iss.get('comments', 0)} comments)")
                    sections.append("\n".join(lines))
        except Exception:
            pass

        # Recent merged PRs (what's been built)
        try:
            r = await client.get(
                f"{GITHUB_API_BASE}/repos/{repo_full_name}/pulls",
                headers=headers,
                params={"state": "closed", "sort": "updated", "per_page": 10},
            )
            if r.status_code == 200:
                prs = [p for p in r.json() if p.get("merged_at")][:10]
                if prs:
                    lines = [f"## Recently Merged PRs (last {len(prs)})\n"]
                    for pr in prs:
                        lines.append(f"- {pr['title']}")
                    sections.append("\n".join(lines))
        except Exception:
            pass

    if not sections:
        return ""

    return "# GitHub Codebase Context\n\n" + "\n\n---\n\n".join(sections)
