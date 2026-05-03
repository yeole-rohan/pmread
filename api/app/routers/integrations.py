"""Jira and Linear OAuth + PRD push."""
import httpx
from datetime import datetime, timezone, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.analysis import Analysis
from app.models.integration_token import IntegrationToken
from app.models.user import User

router = APIRouter()

Platform = Literal["jira", "linear"]

# ── Helpers ────────────────────────────────────────────────────────────────

def _get_token(db: DBSession, user_id, platform: str) -> IntegrationToken | None:
    return db.query(IntegrationToken).filter(
        IntegrationToken.user_id == user_id,
        IntegrationToken.platform == platform,
    ).first()


def _upsert_token(db: DBSession, user_id, platform: str, access_token: str,
                  refresh_token: str | None, expires_in: int | None, meta: dict) -> IntegrationToken:
    token = _get_token(db, user_id, platform)
    expires_at = None
    if expires_in:
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    if token:
        token.access_token = access_token
        token.refresh_token = refresh_token
        token.token_expires_at = expires_at
        token.meta = meta
        token.updated_at = datetime.now(timezone.utc)
    else:
        token = IntegrationToken(
            user_id=user_id, platform=platform,
            access_token=access_token, refresh_token=refresh_token,
            token_expires_at=expires_at, meta=meta,
        )
        db.add(token)
    db.commit()
    db.refresh(token)
    return token


# ── Status ─────────────────────────────────────────────────────────────────

@router.get("/")
async def list_integrations(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    tokens = db.query(IntegrationToken).filter(
        IntegrationToken.user_id == current_user.id
    ).all()
    result = {}
    for t in tokens:
        result[t.platform] = {
            "connected": True,
            "site": (t.meta or {}).get("site_url") or (t.meta or {}).get("workspace_name"),
        }
    return result


@router.delete("/{platform}")
async def disconnect_integration(
    platform: Platform,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    token = _get_token(db, current_user.id, platform)
    if token:
        db.delete(token)
        db.commit()
    return {"success": True}


# ── Jira OAuth ─────────────────────────────────────────────────────────────

JIRA_AUTH_URL = "https://auth.atlassian.com/authorize"
JIRA_TOKEN_URL = "https://auth.atlassian.com/oauth/token"
JIRA_SCOPES = "read:jira-work write:jira-work offline_access"


@router.get("/jira/connect")
async def jira_connect(current_user: User = Depends(get_current_user)):
    if not settings.JIRA_CLIENT_ID:
        raise HTTPException(status_code=501, detail={"error": "Jira integration not configured.", "code": "NOT_CONFIGURED"})
    callback = f"{settings.BACKEND_URL}/api/integrations/jira/callback"
    url = (
        f"{JIRA_AUTH_URL}?audience=api.atlassian.com"
        f"&client_id={settings.JIRA_CLIENT_ID}"
        f"&scope={JIRA_SCOPES.replace(' ', '%20')}"
        f"&redirect_uri={callback}"
        f"&state={str(current_user.id)}"
        f"&response_type=code&prompt=consent"
    )
    return RedirectResponse(url)


@router.get("/jira/callback")
async def jira_callback(code: str, state: str, db: DBSession = Depends(get_db)):
    callback = f"{settings.BACKEND_URL}/api/integrations/jira/callback"
    async with httpx.AsyncClient() as client:
        token_res = await client.post(JIRA_TOKEN_URL, json={
            "grant_type": "authorization_code",
            "client_id": settings.JIRA_CLIENT_ID,
            "client_secret": settings.JIRA_CLIENT_SECRET,
            "code": code,
            "redirect_uri": callback,
        })
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail={"error": "Jira token exchange failed.", "code": "OAUTH_FAILED"})
        token_data = token_res.json()

        # Fetch accessible resources (cloud instances)
        resources_res = await client.get(
            "https://api.atlassian.com/oauth/token/accessible-resources",
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        resources = resources_res.json() if resources_res.status_code == 200 else []
        cloud_id = resources[0]["id"] if resources else None
        site_url = resources[0]["url"] if resources else None

    _upsert_token(
        db, state, "jira",
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_in=token_data.get("expires_in"),
        meta={"cloud_id": cloud_id, "site_url": site_url},
    )
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?jira_connected=true")


# ── Linear OAuth ───────────────────────────────────────────────────────────

LINEAR_AUTH_URL = "https://linear.app/oauth/authorize"
LINEAR_TOKEN_URL = "https://api.linear.app/oauth/token"


@router.get("/linear/connect")
async def linear_connect(current_user: User = Depends(get_current_user)):
    if not settings.LINEAR_CLIENT_ID:
        raise HTTPException(status_code=501, detail={"error": "Linear integration not configured.", "code": "NOT_CONFIGURED"})
    callback = f"{settings.BACKEND_URL}/api/integrations/linear/callback"
    url = (
        f"{LINEAR_AUTH_URL}?client_id={settings.LINEAR_CLIENT_ID}"
        f"&redirect_uri={callback}"
        f"&response_type=code&scope=read,write"
        f"&state={str(current_user.id)}"
    )
    return RedirectResponse(url)


@router.get("/linear/callback")
async def linear_callback(code: str, state: str, db: DBSession = Depends(get_db)):
    callback = f"{settings.BACKEND_URL}/api/integrations/linear/callback"
    async with httpx.AsyncClient() as client:
        token_res = await client.post(LINEAR_TOKEN_URL, data={
            "grant_type": "authorization_code",
            "client_id": settings.LINEAR_CLIENT_ID,
            "client_secret": settings.LINEAR_CLIENT_SECRET,
            "code": code,
            "redirect_uri": callback,
        })
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail={"error": "Linear token exchange failed.", "code": "OAUTH_FAILED"})
        token_data = token_res.json()

        # Fetch workspace info
        workspace_res = await client.post(
            "https://api.linear.app/graphql",
            json={"query": "{ organization { name id } }"},
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        org = workspace_res.json().get("data", {}).get("organization", {}) if workspace_res.status_code == 200 else {}

    _upsert_token(
        db, state, "linear",
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_in=token_data.get("expires_in"),
        meta={"workspace_id": org.get("id"), "workspace_name": org.get("name")},
    )
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?linear_connected=true")


# ── Push PRD ───────────────────────────────────────────────────────────────

class PushResponse(BaseModel):
    platform: str
    epic_url: str | None
    stories_created: int


@router.post("/{platform}/push/{analysis_id}", response_model=PushResponse)
async def push_prd(
    platform: Platform,
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    token = _get_token(db, current_user.id, platform)
    if not token:
        raise HTTPException(status_code=400, detail={"error": f"{platform.title()} not connected.", "code": "NOT_CONNECTED"})

    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis or analysis.status != "complete":
        raise HTTPException(status_code=404, detail={"error": "PRD not found.", "code": "NOT_FOUND"})

    brief = analysis.brief or {}
    tasks = brief.get("engineering_tasks") or []
    stories = brief.get("user_stories") or []
    from app.schemas.analysis import split_question
    title, _ = split_question(analysis.question)

    if platform == "jira":
        return await _push_to_jira(token, title, brief, tasks, stories)
    return await _push_to_linear(token, title, brief, tasks, stories)


async def _push_to_jira(token: IntegrationToken, title: str, brief: dict,
                        tasks: list, stories: list) -> PushResponse:
    cloud_id = (token.meta or {}).get("cloud_id")
    if not cloud_id:
        raise HTTPException(status_code=400, detail={"error": "Jira cloud not found. Reconnect.", "code": "NO_CLOUD_ID"})

    base = f"https://api.atlassian.com/ex/jira/{cloud_id}/rest/api/3"
    headers = {"Authorization": f"Bearer {token.access_token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30) as client:
        # Get first project key
        proj_res = await client.get(f"{base}/project/search?maxResults=1", headers=headers)
        if proj_res.status_code != 200 or not proj_res.json().get("values"):
            raise HTTPException(status_code=400, detail={"error": "No Jira projects found.", "code": "NO_JIRA_PROJECT"})
        jira_project_key = proj_res.json()["values"][0]["key"]

        # Create Epic
        epic_body = {
            "fields": {
                "project": {"key": jira_project_key},
                "summary": title,
                "description": {
                    "type": "doc", "version": 1,
                    "content": [{"type": "paragraph", "content": [
                        {"type": "text", "text": brief.get("problem", "")}
                    ]}]
                },
                "issuetype": {"name": "Epic"},
            }
        }
        epic_res = await client.post(f"{base}/issue", json=epic_body, headers=headers)
        epic_key = epic_res.json().get("key") if epic_res.status_code == 201 else None
        epic_url = f"{(token.meta or {}).get('site_url', '')}/browse/{epic_key}" if epic_key else None

        # Create Stories from engineering tasks
        created = 0
        for task in tasks:
            ac_lines = []
            for s in stories:
                if isinstance(s, dict) and s.get("given"):
                    ac_lines.append(f"Given: {s['given']}\nWhen: {s['when']}\nThen: {s['then']}")

            story_body = {
                "fields": {
                    "project": {"key": jira_project_key},
                    "summary": task.get("title", ""),
                    "description": {
                        "type": "doc", "version": 1,
                        "content": [{"type": "paragraph", "content": [
                            {"type": "text", "text": task.get("description", "")}
                        ]}]
                    },
                    "issuetype": {"name": "Story"},
                    **({"parent": {"key": epic_key}} if epic_key else {}),
                }
            }
            res = await client.post(f"{base}/issue", json=story_body, headers=headers)
            if res.status_code == 201:
                created += 1

    return PushResponse(platform="jira", epic_url=epic_url, stories_created=created)


async def _push_to_linear(token: IntegrationToken, title: str, brief: dict,
                          tasks: list, stories: list) -> PushResponse:
    headers = {"Authorization": f"Bearer {token.access_token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30) as client:
        # Get first team id
        teams_res = await client.post(
            "https://api.linear.app/graphql",
            json={"query": "{ teams { nodes { id name } } }"},
            headers=headers,
        )
        teams = teams_res.json().get("data", {}).get("teams", {}).get("nodes", [])
        if not teams:
            raise HTTPException(status_code=400, detail={"error": "No Linear teams found.", "code": "NO_LINEAR_TEAM"})
        team_id = teams[0]["id"]

        # Create parent issue (Epic equivalent)
        create_epic = """
        mutation($title: String!, $desc: String!, $teamId: String!) {
          issueCreate(input: {title: $title, description: $desc, teamId: $teamId}) {
            issue { id url }
          }
        }"""
        epic_res = await client.post(
            "https://api.linear.app/graphql",
            json={"query": create_epic, "variables": {
                "title": title,
                "desc": brief.get("problem", ""),
                "teamId": team_id,
            }},
            headers=headers,
        )
        epic_data = epic_res.json().get("data", {}).get("issueCreate", {}).get("issue", {})
        epic_id = epic_data.get("id")
        epic_url = epic_data.get("url")

        # Create sub-issues from engineering tasks
        create_issue = """
        mutation($title: String!, $desc: String!, $teamId: String!, $parentId: String) {
          issueCreate(input: {title: $title, description: $desc, teamId: $teamId, parentId: $parentId}) {
            issue { id }
          }
        }"""
        created = 0
        for task in tasks:
            res = await client.post(
                "https://api.linear.app/graphql",
                json={"query": create_issue, "variables": {
                    "title": task.get("title", ""),
                    "desc": task.get("description", ""),
                    "teamId": team_id,
                    "parentId": epic_id,
                }},
                headers=headers,
            )
            if res.json().get("data", {}).get("issueCreate", {}).get("issue"):
                created += 1

    return PushResponse(platform="linear", epic_url=epic_url, stories_created=created)
