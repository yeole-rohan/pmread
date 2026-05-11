export interface User {
  id: string;
  email: string;
  display_name: string | null;
  plan: "free" | "pro" | "teams" | "studio";
  subscription_status: "active" | "expired";
  billing_provider: "stripe" | "razorpay" | null;
  billing_period: "monthly" | "annual" | null;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  plan_renews_at: string | null;
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
  ingest_email_token?: string | null;
  workspace_id?: string | null;
  workspace_name?: string | null;
  workspace_role?: string | null;
}

export interface WorkspaceMember {
  id: string;
  user_id: string | null;
  display_name: string | null;
  email: string;
  role: "owner" | "editor" | "viewer";
  accepted: boolean;
  invited_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  member_count: number;
  my_role: "owner" | "editor" | "viewer";
  created_at: string;
}

export interface WorkspaceDetail extends Workspace {
  members: WorkspaceMember[];
  project_count: number;
  prd_count: number;
}

export interface ScheduleSprint {
  sprint: number;
  start_date: string;
  end_date: string;
  story_points: number;
  tasks: string[];
}

export interface ScheduleEstimate {
  total_points: number;
  velocity_per_sprint: number;
  total_sprints: number;
  estimated_completion: string;
  sprints: ScheduleSprint[];
  critical_path: string[];
  risks: string[];
}

export interface PRDTemplate {
  disabled_sections: string[];
  section_hints: Record<string, string>;
  updated_at: string | null;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface ExecSummaryInsight {
  content: string;
  frequency: number;
}

export interface ExecSummaryContent {
  problem: string;
  top_insights: ExecSummaryInsight[];
  recommendation: string;
  ask: string;
}

export interface ExecSummary {
  id: string;
  analysis_id: string;
  content: ExecSummaryContent;
  generated_at: string;
  is_stale: boolean;
  share_token?: string | null;
}

export type InsightType = "pain_point" | "feature_request" | "decision" | "action_item";

export interface Insight {
  id: string;
  project_id: string;
  source_doc_id: string | null;
  source_name: string | null;
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

export interface UserStory {
  story: string;
  given: string;
  when: string;
  then: string;
}

export interface PRD {
  problem: string;
  problem_quotes: string[];
  proposed_feature: string;
  why_worth_building: string;
  goals: string[];
  non_goals: string[];
  user_stories: Array<string | UserStory>;
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
  share_expires_at?: string | null;
  share_revoked_at?: string | null;
  share_view_count?: number;
  share_feedback_count?: number;
  created_at: string;
  extension_count?: number;
  new_insights_count?: number;
}

export interface Decision {
  id: string;
  project_id: string;
  user_id: string;
  logged_by: string | null;
  title: string;
  what_we_decided: string;
  why: string | null;
  status: "active" | "reversed" | "superseded";
  evidence_insight_ids: string[];
  created_at: string;
  updated_at: string;
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
