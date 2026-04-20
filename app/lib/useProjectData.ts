"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
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
  startExtracting: () => void;
  handleDeleteInsight: (insightId: string) => Promise<void>;
  handleStarInsight: (insightId: string) => Promise<void>;
}

// SWR cache keys — exported so other call sites can invalidate them
export function insightsCacheKey(projectId: string) {
  return `/projects/${projectId}/insights`;
}
export function prdsCacheKey(projectId: string) {
  return `/analyses/?project_id=${projectId}`;
}
export function docsCacheKey(projectId: string) {
  return `/projects/${projectId}/docs`;
}

/** Invalidate all project data caches after an upload or significant change. */
export function invalidateProjectCache(projectId: string) {
  globalMutate(insightsCacheKey(projectId));
  globalMutate(prdsCacheKey(projectId));
  globalMutate(docsCacheKey(projectId));
}

const SWR_OPTS = {
  revalidateOnFocus: false,
  // Don't re-request within 60s — covers tab switching back and forth
  dedupingInterval: 60_000,
};

export function useProjectData(projectId: string): ProjectData {
  const [refreshing, setRefreshing] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const {
    data: insightsData,
    isLoading: insightsLoading,
    mutate: mutateInsights,
  } = useSWR<InsightsResponse>(
    insightsCacheKey(projectId),
    (key: string) => apiFetch<InsightsResponse>(key),
    SWR_OPTS,
  );

  const {
    data: prdsData,
    isLoading: prdsLoading,
    mutate: mutatePrds,
  } = useSWR<Analysis[]>(
    prdsCacheKey(projectId),
    (key: string) => apiFetch<Analysis[]>(key),
    SWR_OPTS,
  );

  const loading = insightsLoading || prdsLoading;
  const insights = insightsData?.grouped ?? EMPTY_GROUPED;
  const insightTotal = insightsData?.total ?? 0;
  const prds = prdsData ?? [];

  const fetchInsights = useCallback(async () => {
    await mutateInsights();
  }, [mutateInsights]);

  const fetchPrds = useCallback(async () => {
    await mutatePrds();
  }, [mutatePrds]);

  async function refreshInsights() {
    setRefreshing(true);
    await mutateInsights();
    setRefreshing(false);
  }

  function startExtracting() {
    setExtracting(true);
  }

  // Real-time SSE — revalidates cache when extraction finishes
  useProjectEvents(projectId, {
    onExtraction: async () => {
      await Promise.all([mutateInsights(), mutatePrds()]);
      setExtracting(false);
    },
  });

  async function handleDeleteInsight(insightId: string) {
    try {
      await apiFetch(`/projects/${projectId}/insights/${insightId}`, { method: "DELETE" });
      await mutateInsights();
    } catch {}
  }

  async function handleStarInsight(insightId: string) {
    try {
      await apiFetch(`/projects/${projectId}/insights/${insightId}/star`, { method: "PATCH" });
      trackEvent("star_insight");
      // Optimistic update — flip locally, revalidate in background
      await mutateInsights(
        (prev) => {
          if (!prev) return prev;
          const next = { ...prev, grouped: { ...prev.grouped } };
          for (const type of Object.keys(next.grouped) as InsightType[]) {
            next.grouped[type] = next.grouped[type].map((ins) =>
              ins.id === insightId ? { ...ins, starred: !ins.starred } : ins
            );
          }
          return next;
        },
        { revalidate: false },
      );
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
