"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSSEUrl } from "./api";
import { Brief } from "./types";

type StreamStatus = "idle" | "connecting" | "streaming" | "complete" | "error";

interface StreamState {
  status: StreamStatus;
  statusMessage: string;
  rawBuffer: string;
  brief: Brief | null;
  error: string | null;
}

export function useAnalysisStream(analysisId: string | null) {
  const [state, setState] = useState<StreamState>({
    status: "idle",
    statusMessage: "",
    rawBuffer: "",
    brief: null,
    error: null,
  });
  const esRef = useRef<EventSource | null>(null);

  const fetchFinalBrief = useCallback(async (id: string) => {
    try {
      const { apiFetch } = await import("./api");
      const data = await apiFetch<{ brief: Brief }>(`/analyses/${id}`);
      setState((prev) => ({ ...prev, brief: data.brief, status: "complete" }));
    } catch {
      // brief was already streaming in, ignore
    }
  }, []);

  useEffect(() => {
    if (!analysisId) return;

    setState({
      status: "connecting",
      statusMessage: "Connecting...",
      rawBuffer: "",
      brief: null,
      error: null,
    });

    const url = getSSEUrl(analysisId);
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "status") {
        setState((prev) => ({
          ...prev,
          status: "streaming",
          statusMessage: data.message,
        }));
      } else if (data.type === "chunk") {
        setState((prev) => ({ ...prev, rawBuffer: prev.rawBuffer + data.content }));
      } else if (data.type === "complete") {
        es.close();
        fetchFinalBrief(data.analysis_id);
      } else if (data.type === "error") {
        setState((prev) => ({ ...prev, status: "error", error: data.message }));
        es.close();
      } else if (data.type === "section") {
        // For already-complete analyses
        setState((prev) => ({ ...prev, status: "streaming" }));
      }
    };

    es.onerror = () => {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Connection lost. Refresh to retry.",
      }));
      es.close();
    };

    return () => {
      es.close();
    };
  }, [analysisId, fetchFinalBrief]);

  return state;
}
