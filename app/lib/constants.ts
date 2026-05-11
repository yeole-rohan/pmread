/** Monthly PRD generation limits per plan. Single source of truth for frontend. */
export const PLAN_PRD_LIMITS: Record<string, number> = { free: 2, pro: 15, teams: 60, studio: Infinity };

/** Features restricted to Pro plan. */
export const PRO_ONLY_FEATURES = {
  slack: true,
  transcript: true,
  github: true,
} as const;

/** How many seconds to poll for insight updates after an upload. */
export const INSIGHT_POLL_INTERVAL_MS = 5000;
export const INSIGHT_POLL_MAX_TICKS = 6;
