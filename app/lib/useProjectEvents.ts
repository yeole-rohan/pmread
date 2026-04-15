"use client";

/**
 * useProjectEvents — real-time SSE hook replacing all project-level polling.
 *
 * Opens a single EventSource to /api/projects/{id}/events and dispatches
 * typed callbacks. Used by:
 *   - useProjectData  (extraction done → refresh insights)
 *   - GithubRepoPicker (index status → update UI)
 *
 * The connection is opened once on mount and closed on unmount.
 * Reconnects automatically on network drop (EventSource built-in behaviour).
 */

import { useEffect, useRef } from "react";
import { getToken } from "./api";

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "/api"
    : "http://localhost:8000/api";

export interface ExtractionEvent {
  type: "extraction";
  doc_id: string;
  status: "done" | "failed";
  insight_count: number;
}

export interface GithubIndexEvent {
  type: "github_index";
  status: "indexing" | "ready" | "failed";
  chunk_count: number;
}

export type ProjectEvent = ExtractionEvent | GithubIndexEvent | { type: "ping" };

interface Handlers {
  onExtraction?: (e: ExtractionEvent) => void;
  onGithubIndex?: (e: GithubIndexEvent) => void;
}

export function useProjectEvents(projectId: string, handlers: Handlers) {
  // Keep handlers in a ref so EventSource callbacks always see the latest version
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!projectId) return;

    const token = getToken();
    if (!token) return;

    const url = `${API_BASE}/projects/${projectId}/events?token=${token}`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      try {
        const event: ProjectEvent = JSON.parse(e.data);
        if (event.type === "extraction") {
          handlersRef.current.onExtraction?.(event as ExtractionEvent);
        } else if (event.type === "github_index") {
          handlersRef.current.onGithubIndex?.(event as GithubIndexEvent);
        }
        // ping — ignore
      } catch {}
    };

    es.onerror = () => {
      // EventSource reconnects automatically — no manual handling needed
    };

    return () => {
      es.close();
    };
  }, [projectId]);
}
