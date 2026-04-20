export interface User {
  id: string;
  email: string;
  display_name: string | null;
  plan: "free" | "pro";
  billing_provider: "stripe" | "razorpay" | null;
  billing_period: "monthly" | "annual" | null;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  analyses_used: number;
  prds_generated_this_month: number;
  prds_reset_at: string | null;
  email_verified: boolean;
  digest_enabled: boolean;
  github_connected?: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  analysis_count: number;
  last_analysis_at: string | null;
}

export type InsightType = "pain_point" | "feature_request" | "decision" | "action_item";

export interface Insight {
  id: string;
  project_id: string;
  source_doc_id: string | null;
  type: InsightType;
  content: string;
  quote: string | null;
  frequency: number;
  starred: boolean;
  used_in_prd: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsightsResponse {
  project_id: string;
  total: number;
  grouped: Record<InsightType, Insight[]>;
}

export interface Doc {
  id: string;
  name: string;
  file_type: string;
  char_count: number | null;
  insight_status: "pending" | "processing" | "done" | "failed";
  created_at: string;
}

export interface PRD {
  problem: string;
  problem_quotes: string[];
  proposed_feature: string;
  why_worth_building: string;
  goals: string[];
  non_goals: string[];
  user_stories: string[];
  what_needs_to_change: {
    ui: string;
    data_model: string;
    workflows: string;
  };
  engineering_tasks: Array<{
    title: string;
    description: string;
    estimate: "XS" | "S" | "M" | "L";
  }>;
  edge_cases: string[];
  analytics_events: string[];
  open_questions: string[];
}

// Keep Brief as alias for backwards compatibility
export type Brief = PRD;

export interface PRDExtension {
  label: string;       // "Update 1"
  date: string;        // "Apr 19, 2026"
  created_at: string;
  content: string;     // LLM-generated markdown prose
  insight_ids: string[];
}

export interface Analysis {
  id: string;
  project_id: string;
  question: string;
  title: string;
  additional_context?: string | null;
  status: "pending" | "processing" | "complete" | "failed";
  brief: PRD | null;
  extensions?: PRDExtension[];
  brief_summary?: string | null;
  error_message?: string | null;
  share_token?: string | null;
  created_at: string;
  extension_count?: number;
  new_insights_count?: number;
}

export class APIError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
