"use client";

import { User } from "./types";
import { apiFetch, setToken, clearToken } from "./api";

export async function login(
  email: string,
  password: string,
  remember_me: boolean
): Promise<User> {
  const data = await apiFetch<{ access_token: string; user: User }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password, remember_me }),
    }
  );
  setToken(data.access_token);
  return data.user;
}

export async function signup(
  email: string,
  password: string,
  display_name?: string
): Promise<User> {
  const data = await apiFetch<{ access_token: string; user: User }>(
    "/auth/signup",
    {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    }
  );
  setToken(data.access_token);
  return data.user;
}

export function logout(): void {
  clearToken();
  window.location.href = "/";
}
