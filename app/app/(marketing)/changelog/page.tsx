import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog — PMRead",
  description:
    "What's new in PMRead — product updates, new features, and improvements shipped by the team.",
  alternates: { canonical: "https://pmread.rohanyeole.com/changelog" },
  openGraph: {
    title: "PMRead Changelog",
    description: "Product updates, new features, and improvements.",
    url: "https://pmread.rohanyeole.com/changelog",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "PMRead Changelog",
  url: "https://pmread.rohanyeole.com/changelog",
  description: "Product updates, new features, and improvements shipped by PMRead.",
};

type ChangeType = "new" | "improved" | "fixed" | "removed";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: Change[];
}

const BADGE: Record<ChangeType, { label: string; className: string }> = {
  new:      { label: "New",      className: "bg-purple-100 text-purple-700" },
  improved: { label: "Improved", className: "bg-blue-100 text-blue-700" },
  fixed:    { label: "Fixed",    className: "bg-green-100 text-green-700" },
  removed:  { label: "Removed",  className: "bg-gray-100 text-gray-500" },
};

const RELEASES: Release[] = [
  {
    version: "v0.6",
    date: "20 Apr 2026",
    title: "Slack persistence, security hardening & env-aware CSP",
    summary:
      "Slack bot tokens and channels are now stored in the database — no more re-entering tokens on every session. Across the stack: tighter auth, safer file handling, environment-aware security headers, and dependency CVE fixes.",
    changes: [
      { type: "new",      text: "Slack persistence — bot token stored server-side per project, never exposed after saving; channels saved with message counts and last-fetch timestamps" },
      { type: "new",      text: "Per-channel re-fetch button; token change flow with masked display (xoxb-••••••••)" },
      { type: "new",      text: "Slack token verified as valid before saving; channel names validated on input" },
      { type: "improved", text: "Content-Security-Policy headers added across all pages" },
      { type: "improved", text: "Session cookies hardened — dedicated signing key, Secure flag enforced" },
      { type: "improved", text: "CORS policy tightened to configured origins only" },
      { type: "improved", text: "Password minimum raised to 12 characters" },
      { type: "improved", text: "Login flow hardened against credential probing" },
      { type: "improved", text: "Resend verification email limited to one request per 60 seconds" },
      { type: "improved", text: "Password change signs out all other active sessions" },
      { type: "improved", text: "Billing period verified server-side via Razorpay API" },
      { type: "improved", text: "Founding-member credit redemption tied to verified email" },
      { type: "fixed",    text: "File uploads now verify file content matches declared type (PDF, DOCX)" },
      { type: "fixed",    text: "PRD error messages standardized — no raw error text shown to users" },
      { type: "fixed",    text: "Updated JWT library to PyJWT 2.8.0; bumped setuptools to ≥70.0.0" },
      { type: "fixed",    text: "Admin panel authentication hardened" },
    ],
  },
  {
    version: "v0.5",
    date: "18 Apr 2026",
    title: "PRD extensions, sharing, Ask tab, SWR caching & marketing refresh",
    summary:
      "Living PRDs that grow with new research, a fully rebuilt Ask tab with chat persistence, SWR caching across the dashboard, an Interview Prep SEO tool, and a repositioned home page leading with evidence-chain messaging.",
    changes: [
      { type: "new",      text: "PRD extensions (Pro) — cherry-pick new insights and append an Update section to any existing PRD; max 3 extensions per PRD, no PRD credit deducted" },
      { type: "new",      text: "ExtendPRDModal — shows new insights with type badges and frequency counts; pre-selects all, supports select/deselect all" },
      { type: "new",      text: "PrdList — amber '✦ N new' badge per PRD when new insights exist since generation; disabled for free users or after 3 extensions" },
      { type: "new",      text: "Interview Prep tool — paste a JD and resume, get 5–10 likely questions with answers strictly from your own experience (Grok, no project data)" },
      { type: "new",      text: "Ask tab rebuilt — sticky context bar, AI avatar pill, ReactMarkdown rendering, localStorage chat persistence (max 20 messages), clear button, research framework links in empty state" },
      { type: "new",      text: "SWR caching for insights, PRDs, and files — dedupingInterval 60s, invalidateProjectCache() blows all three keys on upload" },
      { type: "improved", text: "Home page repositioned — hero now leads with 'Customer Evidence to Engineering Spec, With Every Claim Cited' instead of 'AI PRD Generator'" },
      { type: "improved", text: "InsightsBoard — date-bucketed sections (Today / This week / Earlier), sort dropdown (Most mentioned / Newest), collapsible quote toggle, delete button always visible, tabs wrap instead of scroll" },
      { type: "improved", text: "InsightsBoard empty state links to customer interview script; low-data nudge (< 5 insights) links to interview script template" },
      { type: "improved", text: "FilesTab migrated to SWR — no repeated network calls on tab switch" },
      { type: "improved", text: "GeneratePRD modal — custom date range (From / To date pickers) alongside existing presets" },
      { type: "improved", text: "Pricing features table updated — PRD extensions row added" },
      { type: "new",      text: "Sitemap updated — interview-prep tool page added" },
    ],
  },
  {
    version: "v0.4",
    date: "16 Apr 2026",
    title: "Pro plan & feature gating",
    summary:
      "GitHub, Slack, and transcript ingestion are now gated to Pro. Free users see a clear upgrade prompt instead of a silent error.",
    changes: [
      { type: "new",      text: "Pro plan enforced on Slack ingestion, call transcript upload, and GitHub repo connection" },
      { type: "new",      text: "Lock icon + upgrade prompt in UploadModal for free users on Pro-only tabs" },
      { type: "new",      text: "GithubRepoPicker shows locked state with upgrade link for free users" },
      { type: "new",      text: "PRO_ONLY_FEATURES constants map — single source of truth for gated features" },
      { type: "improved", text: "Backend returns 403 PRO_REQUIRED (not 500) when free users hit gated endpoints" },
    ],
  },
  {
    version: "v0.3",
    date: "15 Apr 2026",
    title: "GitHub integration & multi-source ingestion",
    summary:
      "Connect your GitHub repo and PMRead indexes it as context for PRD generation. Also ships Slack channel ingestion, call transcript support, and real-time SSE updates.",
    changes: [
      { type: "new",      text: "GitHub OAuth — connect, pick a repo, and index it as codebase context" },
      { type: "new",      text: "Slack channel ingestion — pull messages into your project insights" },
      { type: "new",      text: "Call transcript ingestion — upload Zoom or Meet transcripts as a source" },
      { type: "new",      text: "Server-Sent Events (SSE) endpoint replaces all polling — real-time extraction updates" },
      { type: "new",      text: "Multi-model provider abstraction — Claude primary, Grok fallback" },
      { type: "new",      text: "PostgreSQL full-text search replaces pgvector (no embedding API cost)" },
      { type: "new",      text: "DocWriter, Coverage, JiraExport, TOC panels on the analysis page" },
      { type: "new",      text: "SearchModal and AskTab for querying insights directly" },
      { type: "removed",  text: "Notion integration removed" },
    ],
  },
  {
    version: "v0.2",
    date: "14 Apr 2026",
    title: "Insights board & feedback pipeline",
    summary:
      "The core insight extraction pipeline ships. Upload PDFs, audio, or docs — AI extracts structured insights grouped by type.",
    changes: [
      { type: "new",      text: "Insight extraction pipeline — uploads trigger background extraction via Celery" },
      { type: "new",      text: "InsightsBoard — view extracted insights grouped by type (pain point, feature request, etc.)" },
      { type: "new",      text: "GeneratePRD modal — select date range, generate PRD from insights" },
      { type: "new",      text: "Admin dashboard for user and project management" },
      { type: "improved", text: "Feedback ingestion supports PDF, audio, and plain text" },
    ],
  },
  {
    version: "v0.1",
    date: "14 Apr 2026",
    title: "Initial launch",
    summary:
      "PMRead is live. Sign up, create a project, and generate your first PRD.",
    changes: [
      { type: "new", text: "User auth — sign up, log in, JWT sessions" },
      { type: "new", text: "Projects — create and manage multiple products" },
      { type: "new", text: "PRD generation from uploaded context" },
      { type: "new", text: "Next.js frontend + FastAPI backend, deployed on self-hosted VPS" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-medium text-[#7F77DD]">Changelog</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What&apos;s new in PMRead
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Product updates, new features, and improvements — shipped by the team.
          </p>
        </div>

        {/* Releases */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 h-full w-px bg-gray-200" aria-hidden="true" />

          <div className="space-y-14">
            {RELEASES.map((release) => (
              <div key={release.version} className="relative pl-8">
                {/* Dot */}
                <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-[#7F77DD]" />

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#7F77DD]/10 px-3 py-0.5 text-sm font-semibold text-[#7F77DD]">
                    {release.version}
                  </span>
                  <time className="text-sm text-gray-400">{release.date}</time>
                </div>

                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  {release.title}
                </h2>
                <p className="mt-1 text-gray-500">{release.summary}</p>

                {/* Changes */}
                <ul className="mt-4 space-y-2">
                  {release.changes.map((change, i) => {
                    const badge = BADGE[change.type];
                    return (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span
                          className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {change.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
          <p className="text-lg font-semibold text-gray-900">Try the latest version</p>
          <p className="mt-1 text-gray-500">
            Everything above is live. Sign up free and start generating PRDs from your customer feedback.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-lg bg-[#7F77DD] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6B63D0]"
          >
            Get started free →
          </Link>
        </div>
      </main>
    </>
  );
}
