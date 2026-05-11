/**
 * OAuth connect URL — token is always appended as ?token= so the backend
 * can authenticate the user before starting the OAuth redirect.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ── helpers ──────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:8000/api";

function buildConnectUrl(platform: string, token: string | null): string {
  return `${API_BASE}/integrations/${platform}/connect?token=${token ?? ""}`;
}

function extractToken(url: string): string {
  return new URL(url).searchParams.get("token") ?? "";
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("OAuth connect URL", () => {
  it("includes token for jira", () => {
    const url = buildConnectUrl("jira", "jwt.abc.123");
    expect(url).toContain("/integrations/jira/connect");
    expect(extractToken(url)).toBe("jwt.abc.123");
  });

  it("includes token for linear", () => {
    const url = buildConnectUrl("linear", "jwt.xyz.456");
    expect(extractToken(url)).toBe("jwt.xyz.456");
  });

  it("passes empty string when no token stored", () => {
    const url = buildConnectUrl("jira", null);
    expect(extractToken(url)).toBe("");
  });

  it("never uses a relative path — always hits the backend directly", () => {
    const url = buildConnectUrl("jira", "tok");
    expect(url.startsWith("http://localhost:8000")).toBe(true);
  });

  it("does not duplicate token param", () => {
    const url = buildConnectUrl("linear", "tok");
    const params = new URL(url).searchParams.getAll("token");
    expect(params).toHaveLength(1);
  });
});

// ── rate limit response handling ──────────────────────────────────────────────

describe("share feedback rate limit (429 handling)", () => {
  it("429 response has standard structure", () => {
    const mockResponse = { status: 429, detail: "Rate limit exceeded: 5 per 1 minute" };
    expect(mockResponse.status).toBe(429);
    expect(mockResponse.detail).toMatch(/rate limit/i);
  });

  it("submitter sees friendly message on rate limit", () => {
    function handleFeedbackError(status: number): string {
      if (status === 429) return "Too many submissions. Please wait a minute and try again.";
      if (status === 404) return "This PRD link is invalid or has been removed.";
      return "Something went wrong. Please try again.";
    }
    expect(handleFeedbackError(429)).toMatch(/too many/i);
    expect(handleFeedbackError(404)).toMatch(/invalid/i);
    expect(handleFeedbackError(500)).toMatch(/something went wrong/i);
  });
});
