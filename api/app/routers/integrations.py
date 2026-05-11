"""Jira and Linear OAuth + PRD push."""
import httpx
import secrets
from datetime import datetime, timezone, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.analysis import Analysis
from app.models.integration_token import IntegrationToken
from app.models.user import User

# Signs OAuth state: {user_id}:{nonce} — expires in 10 minutes
_state_signer = URLSafeTimedSerializer(settings.JWT_SECRET, salt="oauth-state")


def _make_state(user_id: str) -> str:
    nonce = secrets.token_hex(8)
    return _state_signer.dumps({"uid": str(user_id), "n": nonce})


def _verify_state(state: str) -> str:
    """Returns user_id or raises HTTPException on invalid/expired state."""
    try:
        data = _state_signer.loads(state, max_age=600)
        return data["uid"]
    except SignatureExpired:
        # Must be caught before BadSignature — it's a subclass
        raise HTTPException(status_code=400, detail={"error": "OAuth session expired. Please try again.", "code": "STATE_EXPIRED"})
    except BadSignature:
        raise HTTPException(status_code=400, detail={"error": "Invalid OAuth state. Possible CSRF attempt.", "code": "STATE_INVALID"})
    except KeyError:
        raise HTTPException(status_code=400, detail={"error": "Invalid OAuth state. Possible CSRF attempt.", "code": "STATE_INVALID"})

router = APIRouter()

Platform = Literal["jira", "linear", "azuredevops"]

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
    state = _make_state(str(current_user.id))
    url = (
        f"{JIRA_AUTH_URL}?audience=api.atlassian.com"
        f"&client_id={settings.JIRA_CLIENT_ID}"
        f"&scope={JIRA_SCOPES.replace(' ', '%20')}"
        f"&redirect_uri={callback}"
        f"&state={state}"
        f"&response_type=code&prompt=consent"
    )
    return RedirectResponse(url)


@router.get("/jira/callback")
async def jira_callback(code: str, state: str = Query(...), db: DBSession = Depends(get_db)):
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

    user_id = _verify_state(state)
    _upsert_token(
        db, user_id, "jira",
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
    state = _make_state(str(current_user.id))
    url = (
        f"{LINEAR_AUTH_URL}?client_id={settings.LINEAR_CLIENT_ID}"
        f"&redirect_uri={callback}"
        f"&response_type=code&scope=read,write"
        f"&state={state}"
    )
    return RedirectResponse(url)


@router.get("/linear/callback")
async def linear_callback(code: str, state: str = Query(...), db: DBSession = Depends(get_db)):
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

    user_id = _verify_state(state)
    _upsert_token(
        db, user_id, "linear",
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
    from app.plan_config import require_feature
    require_feature(
        current_user.plan,
        "push_integrations",
        f"Pushing to {platform.title()} is a Pro feature. Upgrade to sync your PRDs.",
    )

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

    if platform == "azuredevops":
        from app.plan_config import require_feature as _rf
        _rf(current_user.plan, "azuredevops_push",
            "Azure DevOps push is a Teams feature. Upgrade to Teams to sync with Azure DevOps.")

    if platform == "jira":
        return await _push_to_jira(token, title, brief, tasks, stories)
    if platform == "azuredevops":
        return await _push_to_azuredevops(token, title, brief, tasks, stories)
    return await _push_to_linear(token, title, brief, tasks, stories)


async def _push_to_jira(token: IntegrationToken, title: str, brief: dict,
                        tasks: list, stories: list) -> PushResponse:
    cloud_id = (token.meta or {}).get("cloud_id")
    if not cloud_id:
        raise HTTPException(status_code=400, detail={"error": "Jira cloud not found. Reconnect.", "code": "NO_CLOUD_ID"})

    base = f"https://api.atlassian.com/ex/jira/{cloud_id}/rest/api/3"
    headers = {"Authorization": f"Bearer {token.access_token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30) as client:
        # Get first project key + its issue types
        proj_res = await client.get(f"{base}/project/search?maxResults=1&expand=issueTypes", headers=headers)
        if proj_res.status_code != 200 or not proj_res.json().get("values"):
            raise HTTPException(status_code=400, detail={"error": "No Jira projects found.", "code": "NO_JIRA_PROJECT"})
        project = proj_res.json()["values"][0]
        jira_project_key = project["key"]

        # Detect available issue type names (varies by project style)
        issue_type_names = {it["name"].lower() for it in project.get("issueTypes", [])}
        epic_type = "Epic" if "epic" in issue_type_names else None
        story_type = "Story" if "story" in issue_type_names else ("Task" if "task" in issue_type_names else "Task")

        def _doc(text: str) -> dict:
            return {"type": "doc", "version": 1, "content": [
                {"type": "paragraph", "content": [{"type": "text", "text": text or " "}]}
            ]}

        # Create Epic (or parent Task if Epic not available)
        epic_key = None
        epic_url = None
        parent_type = epic_type or story_type
        epic_body = {"fields": {
            "project": {"key": jira_project_key},
            "summary": title,
            "description": _doc(brief.get("problem", "")),
            "issuetype": {"name": parent_type},
        }}
        epic_res = await client.post(f"{base}/issue", json=epic_body, headers=headers)
        if epic_res.status_code == 201:
            epic_key = epic_res.json().get("key")
            site_url = (token.meta or {}).get("site_url", "")
            epic_url = f"{site_url}/browse/{epic_key}" if epic_key else None

        # Create child issues from engineering tasks
        created = 0
        for task in tasks:
            fields: dict = {
                "project": {"key": jira_project_key},
                "summary": task.get("title", "Untitled task"),
                "description": _doc(task.get("description", "")),
                "issuetype": {"name": story_type},
            }
            # Link to parent epic — works for both company-managed and next-gen
            if epic_key:
                if epic_type:
                    fields["parent"] = {"key": epic_key}
                # For next-gen projects parent is set via hierarchy — no extra field needed

            res = await client.post(f"{base}/issue", json={"fields": fields}, headers=headers)
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


# ── Azure DevOps OAuth ─────────────────────────────────────────────────────

AZDO_AUTH_URL  = "https://app.vssps.visualstudio.com/oauth2/authorize"
AZDO_TOKEN_URL = "https://app.vssps.visualstudio.com/oauth2/token"
AZDO_SCOPE     = "vso.work_write"


@router.get("/azuredevops/connect")
async def azuredevops_connect(current_user: User = Depends(get_current_user)):
    if not settings.AZUREDEVOPS_CLIENT_ID:
        raise HTTPException(status_code=501, detail={"error": "Azure DevOps integration not configured.", "code": "NOT_CONFIGURED"})
    from app.plan_config import require_feature
    require_feature(current_user.plan, "azuredevops_push",
                    "Azure DevOps is a Teams feature. Upgrade to Teams to connect.")
    callback = f"{settings.BACKEND_URL}/api/integrations/azuredevops/callback"
    state = _make_state(str(current_user.id))
    url = (
        f"{AZDO_AUTH_URL}?client_id={settings.AZUREDEVOPS_CLIENT_ID}"
        f"&response_type=Assertion"
        f"&state={state}"
        f"&scope={AZDO_SCOPE}"
        f"&redirect_uri={callback}"
    )
    return RedirectResponse(url)


@router.get("/azuredevops/callback")
async def azuredevops_callback(code: str = Query(None), state: str = Query(...),
                                db: DBSession = Depends(get_db)):
    if not code:
        raise HTTPException(status_code=400, detail={"error": "Azure DevOps authorisation denied.", "code": "OAUTH_DENIED"})

    callback = f"{settings.BACKEND_URL}/api/integrations/azuredevops/callback"

    async with httpx.AsyncClient(timeout=30) as client:
        # Azure DevOps uses a non-standard JWT-bearer grant type
        token_res = await client.post(
            AZDO_TOKEN_URL,
            data={
                "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                "client_assertion": settings.AZUREDEVOPS_CLIENT_SECRET,
                "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "assertion": code,
                "redirect_uri": callback,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail={"error": "Azure DevOps token exchange failed.", "code": "OAUTH_FAILED"})
        token_data = token_res.json()
        access_token = token_data.get("access_token") or token_data.get("accessToken")
        refresh_token = token_data.get("refresh_token") or token_data.get("refreshToken")
        expires_in = token_data.get("expires_in") or token_data.get("expiresIn")

        # Fetch the user's organisations
        profile_res = await client.get(
            "https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=7.1",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile = profile_res.json() if profile_res.status_code == 200 else {}
        member_id = profile.get("id", "")

        org_res = await client.get(
            f"https://app.vssps.visualstudio.com/_apis/accounts?memberId={member_id}&api-version=7.1",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        orgs = org_res.json().get("value", []) if org_res.status_code == 200 else []
        org_name = orgs[0]["accountName"] if orgs else ""

    user_id = _verify_state(state)
    _upsert_token(
        db, user_id, "azuredevops",
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=int(expires_in) if expires_in else None,
        meta={"org_name": org_name, "site_url": f"https://dev.azure.com/{org_name}" if org_name else ""},
    )
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?azuredevops_connected=true")


async def _push_to_azuredevops(token: IntegrationToken, title: str, brief: dict,
                                tasks: list, stories: list) -> PushResponse:
    org = (token.meta or {}).get("org_name")
    if not org:
        raise HTTPException(status_code=400, detail={"error": "Azure DevOps organisation not found. Reconnect.", "code": "NO_ORG"})

    base_headers = {
        "Authorization": f"Bearer {token.access_token}",
        "Content-Type": "application/json-patch+json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        # Get first project in the organisation
        proj_res = await client.get(
            f"https://dev.azure.com/{org}/_apis/projects?api-version=7.1",
            headers={**base_headers, "Content-Type": "application/json"},
        )
        if proj_res.status_code != 200 or not proj_res.json().get("value"):
            raise HTTPException(status_code=400, detail={"error": "No Azure DevOps projects found.", "code": "NO_PROJECT"})
        project = proj_res.json()["value"][0]["name"]

        api = f"https://dev.azure.com/{org}/{project}/_apis/wit/workitems"

        def _patch(fields: dict) -> list:
            return [{"op": "add", "path": f"/fields/{k}", "value": v} for k, v in fields.items()]

        # Create Epic
        epic_url = None
        epic_id = None
        epic_res = await client.post(
            f"{api}/$Epic?api-version=7.1",
            json=_patch({
                "System.Title": title,
                "System.Description": brief.get("problem", ""),
            }),
            headers=base_headers,
        )
        if epic_res.status_code == 200:
            epic_data = epic_res.json()
            epic_id = epic_data.get("id")
            epic_url = epic_data.get("_links", {}).get("html", {}).get("href")

        # Create child User Stories under the Epic
        created = 0
        for task in tasks:
            fields = {
                "System.Title": task.get("title", "Untitled task"),
                "System.Description": task.get("description", ""),
            }
            patch = _patch(fields)
            # Link to parent Epic via hierarchy relation
            if epic_id:
                patch.append({
                    "op": "add",
                    "path": "/relations/-",
                    "value": {
                        "rel": "System.LinkTypes.Hierarchy-Reverse",
                        "url": f"https://dev.azure.com/{org}/{project}/_apis/wit/workitems/{epic_id}",
                    },
                })
            res = await client.post(
                f"{api}/$User%20Story?api-version=7.1",
                json=patch,
                headers=base_headers,
            )
            if res.status_code == 200:
                created += 1

    return PushResponse(platform="azuredevops", epic_url=epic_url, stories_created=created)
