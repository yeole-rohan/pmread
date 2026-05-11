"""OAuth state signing — CSRF protection tests."""
import time
import pytest
from unittest.mock import patch
from fastapi import HTTPException
from itsdangerous import URLSafeTimedSerializer


# Patch settings before importing the module under test
@pytest.fixture(autouse=True)
def patch_settings():
    with patch("app.config.settings") as m:
        m.JWT_SECRET = "test-secret-do-not-use-in-prod"
        m.JIRA_CLIENT_ID = "jira-client-id"
        m.LINEAR_CLIENT_ID = "linear-client-id"
        m.BACKEND_URL = "http://localhost:8000"
        m.FRONTEND_URL = "http://localhost:3000"
        yield m


from app.routers.integrations import _make_state, _verify_state  # noqa: E402


def test_make_state_returns_string():
    state = _make_state("user-123")
    assert isinstance(state, str)
    assert len(state) > 10


def test_verify_state_round_trip():
    state = _make_state("user-abc")
    user_id = _verify_state(state)
    assert user_id == "user-abc"


def test_verify_state_different_users_produce_different_states():
    s1 = _make_state("user-1")
    s2 = _make_state("user-2")
    assert s1 != s2


def test_verify_state_tampered_raises():
    state = _make_state("user-123")
    tampered = state[:-4] + "xxxx"
    with pytest.raises(HTTPException) as exc:
        _verify_state(tampered)
    assert exc.value.detail["code"] == "STATE_INVALID"


def test_verify_state_arbitrary_string_raises():
    with pytest.raises(HTTPException) as exc:
        _verify_state("not-a-real-state")
    assert exc.value.detail["code"] == "STATE_INVALID"


def test_verify_state_raw_user_id_raises():
    """Old insecure state format (plain user_id) must be rejected."""
    with pytest.raises(HTTPException) as exc:
        _verify_state("550e8400-e29b-41d4-a716-446655440000")
    assert exc.value.detail["code"] == "STATE_INVALID"


def test_verify_state_expired_raises():
    """State signed >10 minutes ago must be rejected."""
    import app.routers.integrations as integ_mod
    # Use the module's own signer so the secret matches
    state = integ_mod._state_signer.dumps({"uid": "user-123", "n": "abc123"})

    future = time.time() + 660
    with patch("itsdangerous.timed.time.time", return_value=future):
        with pytest.raises(HTTPException) as exc:
            _verify_state(state)
    assert exc.value.detail["code"] == "STATE_EXPIRED"


def test_state_contains_nonce_so_each_call_is_unique():
    """Two calls for the same user must produce different states (nonce)."""
    s1 = _make_state("user-same")
    s2 = _make_state("user-same")
    assert s1 != s2
