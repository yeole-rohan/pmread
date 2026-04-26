"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Copy, Check, CheckCircle2 } from "lucide-react";

// ── Sample data ────────────────────────────────────────────────────────────────

const SAMPLE_TITLE = "Weekly Insights Digest — Automated Email Summary for Team Leads";

const SAMPLE_PRD = {
  problem:
    "Team leads using the product don't return between weekly planning meetings because nothing tells them what changed. By the time they log in for sprint planning, insights are stale and the team can't act on them in time. 11 of 22 customers interviewed flagged this as the primary reason their engagement dropped after the first month.",
  problem_quotes: [
    "I open it once a week during planning. I don't even know if there's new stuff between meetings.",
    "My team lead would actually use this if it just showed up in her inbox. She's never going to remember to check.",
    "We tried making it a habit but Slack pulls attention away. We need a push, not a pull.",
  ],
  proposed_feature:
    "A weekly email digest sent every Monday at 8 AM in the user's timezone that surfaces the 3 most-starred insights from the past 7 days, the latest PRD title if one was generated, and a count of new file uploads. Includes a one-click unsubscribe. Opt-in by default for Pro plan users.",
  why_worth_building:
    "11 of 22 interviewed customers cite 'not knowing what changed' as the primary reason they log in less than twice per week. Moving users from weekly to bi-weekly active is the clearest path to reducing churn at our current stage. The digest is the lowest-friction option here — it requires no behaviour change from the user and meets them in email, which they're already checking.",
  goals: [
    "Increase D14 retention by surfacing value on days users don't log in",
    "Achieve at least 40% open rate on digest emails within 90 days of launch",
    "Reduce 'what's new in my project' support tickets by 30%",
  ],
  non_goals: [
    "Real-time or daily email cadence — weekly digest only for v1",
    "Slack notification integration — planned for Q3, not in scope here",
    "Custom email templates or white-labelling for agency accounts",
  ],
  user_stories: [
    "As a team lead, I want to receive a weekly summary of my project's new insights so that I stay informed without having to log in every day.",
    "As a Pro user, I want to control the digest send day and time so that it arrives before my planning meeting.",
    "As any user, I want a clear one-click unsubscribe in every digest so that I never feel spammed.",
    "As a free plan user, I want to see the digest section in settings with an upgrade prompt so that I understand what I'm missing.",
  ],
  what_needs_to_change: {
    ui: "Add a 'Digest' section to project settings with an enable toggle (Pro only), day picker (Mon–Fri), and time picker. Include a 'Preview digest' button that renders the email in a modal. Free plan users see the section with the toggle disabled and an upgrade CTA.",
    data_model:
      "New table: digest_subscriptions (user_id, project_id, enabled, send_day, send_hour_utc, last_sent_at, created_at). New column on analyses: included_in_digest_at. Add compound index on insights (project_id, starred, created_at) for weekly window queries.",
    workflows:
      "Cron job runs daily at 06:00 UTC. Queries subscriptions where send_day matches today and last_sent_at is older than 6 days. Builds digest payload (top 3 starred insights, latest PRD title if any, new file count). Sends via Resend. Updates last_sent_at on success, logs error on failure.",
  },
  engineering_tasks: [
    {
      title: "Digest subscription model + migrations",
      description:
        "Create digest_subscriptions table, add included_in_digest_at column to analyses, write and test migrations. Add compound index on insights (project_id, starred, created_at).",
      estimate: "S" as const,
    },
    {
      title: "Digest payload builder",
      description:
        "Function that takes a project_id and date range, queries top 3 starred insights + latest PRD title + new file count, returns typed DigestPayload. Include unit tests with fixture data.",
      estimate: "S" as const,
    },
    {
      title: "Email template (React Email)",
      description:
        "Build the digest email template in React Email. Include project name header, 3 insight cards with type badges, PRD callout if applicable, file count, unsubscribe footer. Must render correctly in Gmail, Outlook, and Apple Mail.",
      estimate: "M" as const,
    },
    {
      title: "Send cron job",
      description:
        "Background task that runs daily, selects due subscriptions, calls payload builder, sends via Resend. Logs send status. Retries once on transient failure. Rate-limits to 100 sends per minute.",
      estimate: "M" as const,
    },
    {
      title: "Settings UI — Digest section",
      description:
        "Add collapsible Digest section to project settings page. Toggle, day picker, time picker. Preview button opens modal with rendered email HTML. Pro gate with upgrade CTA for free users.",
      estimate: "M" as const,
    },
  ],
  edge_cases: [
    "User has no starred insights this week — digest skips the insights section and shows 'No new highlights this week. Star insights to surface them here.'",
    "Project has no activity in 30+ days — suppress digest and send a re-engagement email instead",
    "User changes send_day mid-week — send at next occurrence of the new day, never twice in one week",
    "Resend API failure — log error, mark subscription with last_error, retry once after 15 minutes",
  ],
  analytics_events: [
    "digest_email_sent: { project_id, user_id, insight_count, has_prd, file_count }",
    "digest_email_opened: { project_id, user_id } — tracked via 1×1 pixel",
    "digest_cta_clicked: { project_id, user_id, cta_type: 'view_insight' | 'view_prd' | 'upload' }",
    "digest_unsubscribed: { project_id, user_id, source: 'email_link' | 'settings' }",
  ],
  open_questions: [
    "Opt-in vs opt-out for Pro users at signup? Opt-out maximises reach but risks early unsubscribes. Recommend: opt-in with a visible prompt on the first project creation screen.",
    "Do we surface insights from all project files or starred-only? Current plan is starred-only to reduce noise — validate with 5 beta users before shipping.",
    "When a Pro user downgrades to free: pause the digest silently or send a final email explaining why it stopped?",
  ],
};

const SAMPLE_INSIGHTS = [
  { type: "pain_point", dot: "bg-red-400", badge: "bg-red-100 text-red-700", content: "No way to know what changed between meetings — we only check the tool during planning.", freq: 11 },
  { type: "pain_point", dot: "bg-red-400", badge: "bg-red-100 text-red-700", content: "Slack pulls attention away. The tool needs to push updates to us, not wait for us to pull.", freq: 7 },
  { type: "feature_request", dot: "bg-blue-400", badge: "bg-blue-100 text-blue-700", content: "Weekly email showing what's new in my project — even a simple list of new insights would help.", freq: 14 },
  { type: "feature_request", dot: "bg-blue-400", badge: "bg-blue-100 text-blue-700", content: "Digest email or Slack notification when new insights are extracted from an upload.", freq: 5 },
  { type: "decision", dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700", content: "Weekly cadence agreed — daily would be too noisy. Monday 8 AM delivery confirmed with 3 customers.", freq: 1 },
  { type: "action_item", dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700", content: "Confirm React Email renders correctly in Outlook 2019 before starting template build.", freq: 1 },
];

// ── Shared copy button ─────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
      {copied
        ? <><Check size={12} className="text-green-500" /><span className="text-green-500">Copied</span></>
        : <><Copy size={12} /><span>Copy</span></>}
    </button>
  );
}

// ── Section card (mirrors real BriefRenderer) ─────────────────────────────────

function Section({ id, title, copyText, children }: { id?: string; title: string; copyText: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div id={id} className="bg-white rounded-xl border border-gray-100 scroll-mt-16">
      <div className="flex items-center justify-between px-5 py-3.5">
        <button onClick={() => setCollapsed(v => !v)} className="flex items-center gap-2 flex-1 text-left group">
          <ChevronDown size={14} className={`text-gray-300 transition-transform flex-shrink-0 ${collapsed ? "-rotate-90" : ""}`} />
          <h3 className="text-xs font-semibold text-[#7F77DD] uppercase tracking-wider">{title}</h3>
        </button>
        <CopyButton text={copyText} />
      </div>
      {!collapsed && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text.split(/(?<=[.!?])\s+/).reduce<string[][]>((acc, s, i) => {
        const chunk = Math.floor(i / 2);
        if (!acc[chunk]) acc[chunk] = [];
        acc[chunk].push(s);
        return acc;
      }, []).map((sentences, i) => (
        <p key={i} className="text-sm text-gray-700 leading-relaxed">{sentences.join(" ")}</p>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
          <span className="text-gray-300 flex-shrink-0 mt-0.5">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const ESTIMATE_COLOR: Record<string, string> = {
  XS: "bg-emerald-50 text-emerald-700 border-emerald-100",
  S: "bg-blue-50 text-blue-700 border-blue-100",
  M: "bg-amber-50 text-amber-700 border-amber-100",
  L: "bg-red-50 text-red-700 border-red-100",
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SamplePrdPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Sample banner */}
      <div className="bg-[#7F77DD] text-white text-center py-2.5 px-4">
        <p className="text-sm font-medium">
          Sample output — this is what PMRead generates from your customer research.{" "}
          <Link href="/signup" className="underline underline-offset-2 font-semibold hover:text-purple-200 transition-colors">
            Generate your own free →
          </Link>
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to home
        </Link>

        {/* Source evidence card */}
        <div className="mb-8 rounded-xl border border-purple-100 bg-purple-50 px-5 py-4">
          <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest mb-2">Source evidence — 22 customer interviews</p>
          <div className="space-y-2">
            {SAMPLE_PRD.problem_quotes.map((q, i) => (
              <blockquote key={i} className="border-l-2 border-[#7F77DD] pl-3 py-0.5 text-sm text-gray-600 italic">
                &ldquo;{q}&rdquo;
              </blockquote>
            ))}
          </div>
          <p className="mt-3 text-xs text-purple-500">11 of 22 customers flagged this as their top reason for low engagement</p>
        </div>

        {/* PRD header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[#7F77DD]">PRD</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 size={10} /> Complete
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">{SAMPLE_TITLE}</h1>
          <p className="text-sm text-gray-400">April 19, 2026</p>
        </div>

        {/* PRD sections */}
        <div className="space-y-4">
          {/* Problem */}
          <Section id="prd-problem" title="Problem" copyText={SAMPLE_PRD.problem}>
            <Prose text={SAMPLE_PRD.problem} />
            <div className="mt-3 space-y-2">
              {SAMPLE_PRD.problem_quotes.map((q, i) => (
                <blockquote key={i} className="border-l-2 border-[#7F77DD] pl-3 py-1 text-sm text-gray-500 italic bg-purple-50/40 rounded-r">
                  &ldquo;{q}&rdquo;
                </blockquote>
              ))}
            </div>
          </Section>

          {/* Proposed Feature */}
          <Section id="prd-feature" title="Proposed Feature" copyText={SAMPLE_PRD.proposed_feature}>
            <div className="bg-emerald-50 border-l-4 border-[#1D9E75] px-4 py-3 rounded-r-lg">
              <Prose text={SAMPLE_PRD.proposed_feature} />
            </div>
          </Section>

          {/* Why Build */}
          <Section id="prd-why" title="Why It's Worth Building" copyText={SAMPLE_PRD.why_worth_building}>
            <Prose text={SAMPLE_PRD.why_worth_building} />
          </Section>

          {/* Goals + Non-Goals */}
          <div className="grid grid-cols-2 gap-4">
            <Section id="prd-goals" title="Goals" copyText={SAMPLE_PRD.goals.join("\n")}>
              <Bullets items={SAMPLE_PRD.goals} />
            </Section>
            <Section id="prd-nongoals" title="Non-Goals" copyText={SAMPLE_PRD.non_goals.join("\n")}>
              <Bullets items={SAMPLE_PRD.non_goals} />
            </Section>
          </div>

          {/* User Stories */}
          <Section id="prd-stories" title="User Stories" copyText={SAMPLE_PRD.user_stories.join("\n")}>
            <ul className="space-y-1.5">
              {SAMPLE_PRD.user_stories.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">{s}</li>
              ))}
            </ul>
          </Section>

          {/* What Needs to Change */}
          <Section
            id="prd-changes"
            title="What Needs to Change"
            copyText={`UI: ${SAMPLE_PRD.what_needs_to_change.ui}\n\nData Model: ${SAMPLE_PRD.what_needs_to_change.data_model}\n\nWorkflows: ${SAMPLE_PRD.what_needs_to_change.workflows}`}
          >
            <div className="space-y-3">
              {[
                { label: "UI Changes", value: SAMPLE_PRD.what_needs_to_change.ui },
                { label: "Data Model", value: SAMPLE_PRD.what_needs_to_change.data_model },
                { label: "Workflows", value: SAMPLE_PRD.what_needs_to_change.workflows },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <Prose text={item.value} />
                </div>
              ))}
            </div>
          </Section>

          {/* Engineering Tasks */}
          <Section
            id="prd-tasks"
            title="Engineering Tasks"
            copyText={SAMPLE_PRD.engineering_tasks.map(t => `[${t.estimate}] ${t.title}\n${t.description}`).join("\n\n")}
          >
            <div className="space-y-3">
              {SAMPLE_PRD.engineering_tasks.map((task, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${ESTIMATE_COLOR[task.estimate]}`}>
                      {task.estimate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Edge Cases */}
          <Section id="prd-edge" title="Edge Cases" copyText={SAMPLE_PRD.edge_cases.join("\n")}>
            <Bullets items={SAMPLE_PRD.edge_cases} />
          </Section>

          {/* Analytics Events */}
          <Section id="prd-analytics" title="Analytics Events" copyText={SAMPLE_PRD.analytics_events.join("\n")}>
            <div className="space-y-1.5">
              {SAMPLE_PRD.analytics_events.map((e, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono whitespace-nowrap">
                    {e.split(":")[0]?.trim()}
                  </code>
                  <span className="text-gray-500 text-xs pt-1">{e.split(":").slice(1).join(":").trim()}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Open Questions */}
          <Section id="prd-questions" title="Open Questions" copyText={SAMPLE_PRD.open_questions.join("\n")}>
            <Bullets items={SAMPLE_PRD.open_questions} />
          </Section>
        </div>

        {/* Insights sidebar callout */}
        <div className="mt-10 rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Insights that fed this PRD</p>
          <div className="space-y-2">
            {SAMPLE_INSIGHTS.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${insight.dot}`} />
                <p className="text-sm text-gray-700 flex-1 leading-snug">{insight.content}</p>
                {insight.freq > 1 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${insight.badge}`}>{insight.freq}×</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Generate a PRD from your own customer research
          </h2>
          <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
            Upload interviews, transcripts, or feedback. PMRead extracts insights
            and generates a PRD like this one — with every requirement traced back
            to real customer evidence.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Get started free — 2 PRDs/month →
          </Link>
          <p className="mt-3 text-xs text-gray-400">No credit card required</p>
        </div>
      </div>
    </main>
  );
}
