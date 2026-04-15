"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "./api";
import { Analysis, Insight, InsightType, InsightsResponse } from "./types";
import { trackEvent } from "./analytics";
import { useProjectEvents } from "./useProjectEvents";

const EMPTY_GROUPED: Record<InsightType, Insight[]> = {
  pain_point: [],
  feature_request: [],
  decision: [],
  action_item: [],
};

interface ProjectData {
  insights: Record<InsightType, Insight[]>;
  insightTotal: number;
  prds: Analysis[];
  loading: boolean;
  refreshing: boolean;
  extracting: boolean;
  fetchInsights: () => Promise<void>;
  fetchPrds: () => Promise<void>;
  refreshInsights: () => Promise<void>;
  /** Call after upload to show the extracting banner. SSE will clear it automatically. */
  startExtracting: () => void;
  handleDeleteInsight: (insightId: string) => Promise<void>;
  handleStarInsight: (insightId: string) => Promise<void>;
}

export function useProjectData(projectId: string): ProjectData {
  const [insights, setInsights] = useState<Record<InsightType, Insight[]>>(EMPTY_GROUPED);
  const [insightTotal, setInsightTotal] = useState(0);
  const [prds, setPrds] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const fetchInsights = useCallback(async () => {
    try {
      const data = await apiFetch<InsightsResponse>(`/projects/${projectId}/insights`);
      setInsights(data.grouped);
      setInsightTotal(data.total);
    } catch {}
  }, [projectId]);

  const fetchPrds = useCallback(async () => {
    try {
      const data = await apiFetch<Analysis[]>(`/analyses/?project_id=${projectId}`);
      setPrds(data);
    } catch {}
  }, [projectId]);

  // Initial load
  useEffect(() => {
    async function load() {
      setLoading(true);
      await Promise.all([fetchInsights(), fetchPrds()]);
      setLoading(false);
    }
    load();
  }, [fetchInsights, fetchPrds]);

  async function refreshInsights() {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  }

  // Called after upload — shows the extracting banner immediately.
  // The SSE extraction event clears it and refreshes insights automatically.
  function startExtracting() {
    setExtracting(true);
  }

  // Real-time SSE — replaces the polling timer
  useProjectEvents(projectId, {
    onExtraction: async (event) => {
      await fetchInsights();
      setExtracting(false);
    },
  });

  async function handleDeleteInsight(insightId: string) {
    try {
      await apiFetch(`/projects/${projectId}/insights/${insightId}`, { method: "DELETE" });
      await fetchInsights();
    } catch {}
  }

  async function handleStarInsight(insightId: string) {
    try {
      await apiFetch(`/projects/${projectId}/insights/${insightId}/star`, { method: "PATCH" });
      trackEvent("star_insight");
      // Optimistic update — flip locally without full refetch
      setInsights((prev) => {
        const next = { ...prev };
        for (const type of Object.keys(next) as InsightType[]) {
          next[type] = next[type].map((ins) =>
            ins.id === insightId ? { ...ins, starred: !ins.starred } : ins
          );
        }
        return next;
      });
    } catch {}
  }

  return {
    insights,
    insightTotal,
    prds,
    loading,
    refreshing,
    extracting,
    fetchInsights,
    fetchPrds,
    refreshInsights,
    startExtracting,
    handleDeleteInsight,
    handleStarInsight,
  };
}

/**
 * Auto-deletes a project on unmount if it has no insights and no PRDs.
 * Used to clean up empty projects created by navigation.
 */
export function useEmptyProjectCleanup(
  projectId: string,
  loading: boolean,
  insightTotal: number,
  prdCount: number
) {
  const cleanupRef = useRef({ shouldDelete: false, projectId });

  useEffect(() => {
    cleanupRef.current = {
      shouldDelete: !loading && insightTotal === 0 && prdCount === 0,
      projectId,
    };
  }, [loading, insightTotal, prdCount, projectId]);

  useEffect(() => {
    return () => {
      const { shouldDelete, projectId: pid } = cleanupRef.current;
      if (shouldDelete) apiFetch(`/projects/${pid}`, { method: "DELETE" }).catch(() => {});
    };
  }, [projectId]);
}
