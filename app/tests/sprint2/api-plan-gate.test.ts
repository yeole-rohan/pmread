import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { APIError } from "@/lib/types";

// Isolate module so we can control fetch + window per test
vi.stubGlobal("window", { location: { href: "" } });

// We test the _handleResponse behaviour by driving apiFetch with a mocked fetch.
// The module is re-imported after each stubGlobal so the window reference is fresh.

function makeFetchStub(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: vi.fn().mockResolvedValue(body),
    statusText: "Error",
  } as unknown as Response);
}

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn().mockReturnValue("fake-token"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
  vi.stubGlobal("window", { location: { href: "" } });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("apiFetch — 402 Plan Expired", () => {
  it("throws APIError with code PLAN_EXPIRED on 402", async () => {
    vi.stubGlobal("fetch", makeFetchStub(402, {}));
    const { apiFetch } = await import("@/lib/api");

    await expect(apiFetch("/some-plan-gated-endpoint")).rejects.toMatchObject({
      code: "PLAN_EXPIRED",
      status: 402,
    });
  });

  it("error has both code and status properties on 402", async () => {
    vi.stubGlobal("fetch", makeFetchStub(402, {}));
    const { apiFetch } = await import("@/lib/api");

    try {
      await apiFetch("/some-plan-gated-endpoint");
    } catch (err: unknown) {
      expect(err).toHaveProperty("code", "PLAN_EXPIRED");
      expect(err).toHaveProperty("status", 402);
    }
  });

  it("redirects to /plan-expired when window is defined on 402", async () => {
    const locationRef = { href: "" };
    vi.stubGlobal("window", { location: locationRef });
    vi.stubGlobal("fetch", makeFetchStub(402, {}));
    const { apiFetch } = await import("@/lib/api");

    try {
      await apiFetch("/decisions/");
    } catch {
      // expected
    }
    expect(locationRef.href).toBe("/plan-expired");
  });
});

describe("apiFetch — 403 Plan Insufficient", () => {
  it("throws APIError with code from response body on 403", async () => {
    vi.stubGlobal(
      "fetch",
      makeFetchStub(403, { detail: { code: "PLAN_INSUFFICIENT", error: "Upgrade required" } })
    );
    const { apiFetch } = await import("@/lib/api");

    await expect(apiFetch("/pro-feature")).rejects.toMatchObject({
      code: "PLAN_INSUFFICIENT",
      status: 403,
      message: "Upgrade required",
    });
  });

  it("throws APIError with code DECISION_LIMIT_REACHED on 403 from decision limit", async () => {
    vi.stubGlobal(
      "fetch",
      makeFetchStub(403, { detail: { code: "DECISION_LIMIT_REACHED", error: "Free plan limit reached" } })
    );
    const { apiFetch } = await import("@/lib/api");

    await expect(apiFetch("/decisions/")).rejects.toMatchObject({
      code: "DECISION_LIMIT_REACHED",
      status: 403,
    });
  });

  it("does NOT redirect on 403", async () => {
    const locationRef = { href: "" };
    vi.stubGlobal("window", { location: locationRef });
    vi.stubGlobal(
      "fetch",
      makeFetchStub(403, { detail: { code: "PLAN_INSUFFICIENT" } })
    );
    const { apiFetch } = await import("@/lib/api");

    try {
      await apiFetch("/pro-feature");
    } catch {
      // expected
    }
    expect(locationRef.href).toBe(""); // no redirect
  });
});

describe("apiFetch — 401 Unauthenticated", () => {
  it("throws UNAUTHORIZED and clears token on 401", async () => {
    const removeItem = vi.fn();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue("expired-token"),
      setItem: vi.fn(),
      removeItem,
    });
    vi.stubGlobal("fetch", makeFetchStub(401, {}));
    const { apiFetch } = await import("@/lib/api");

    try {
      await apiFetch("/me");
    } catch {
      // expected
    }
    expect(removeItem).toHaveBeenCalledWith("pmread_token");
  });
});

describe("apiFetch — success", () => {
  it("returns parsed JSON on 200", async () => {
    vi.stubGlobal("fetch", makeFetchStub(200, { id: "abc", name: "Test" }));
    const { apiFetch } = await import("@/lib/api");

    const result = await apiFetch<{ id: string; name: string }>("/projects/abc");
    expect(result).toEqual({ id: "abc", name: "Test" });
  });
});
