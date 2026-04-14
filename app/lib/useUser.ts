"use client";

import useSWR from "swr";
import { User } from "./types";
import { apiFetch, getToken } from "./api";

export function useUser() {
  const { data, error, mutate } = useSWR<User>(
    () => (getToken() ? "/auth/me" : null),
    (path: string) => apiFetch<User>(path),
    { revalidateOnFocus: false }
  );

  // If there's no token, we're not loading — we just have no user.
  // Without this, loading stays true forever (SWR key is null, never resolves).
  const hasToken = typeof window !== "undefined" && !!getToken();

  return {
    user: data,
    loading: hasToken && !data && !error,
    error,
    mutate,
  };
}
