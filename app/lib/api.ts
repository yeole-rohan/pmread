import { APIError } from "./types";

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pmread_token");
}

export function setToken(token: string): void {
  localStorage.setItem("pmread_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("pmread_token");
}

async function _handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new APIError("Not authenticated", "UNAUTHORIZED", 401);
  }

  if (res.status === 402) {
    let detail: { error?: string; code?: string; feature?: string } = {};
    try { detail = (await res.clone().json()).detail ?? {}; } catch { /* ignore */ }
    const code = detail.code || "PLAN_EXPIRED";
    // Only redirect to /plan-expired for subscription expiry, not for feature gates
    if (code === "PLAN_EXPIRED" && typeof window !== "undefined") {
      window.location.href = "/plan-expired";
    }
    throw new APIError(detail.error || "Plan limit reached", code, 402);
  }

  if (!res.ok) {
    let detail: { error?: string; code?: string } = {};
    try {
      const body = await res.json();
      detail = body.detail || body;
    } catch {
      detail = { error: res.statusText };
    }
    throw new APIError(
      detail.error || "Request failed",
      detail.code || "UNKNOWN",
      res.status
    );
  }

  return res.json() as Promise<T>;
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  return _handleResponse<T>(res);
}

export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  return _handleResponse<T>(res);
}

export function getSSEUrl(analysisId: string): string {
  const token = getToken();
  return `${API_BASE}/stream/${analysisId}${token ? `?token=${token}` : ""}`;
}
