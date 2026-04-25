"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, ChevronRight, X } from "lucide-react";

// ── Sample data ────────────────────────────────────────────────────────────────

const SAMPLE_INSIGHTS = {
  pain_point: [
    {
      id: "sp1",
      content: "No way to know what changed between meetings — we only check the tool during sprint planning.",
      quote: "I open it once a week during planning. I don't even know if there's new stuff between meetings.",
      frequency: 11,
      starred: true,
    },
    {
      id: "sp2",
      content: "Slack pulls attention away. The tool needs to push updates to us, not wait for us to pull.",
      quote: "We tried making it a habit but Slack wins every time. We need a push, not a pull.",
      frequency: 7,
      starred: false,
    },
    {
      id: "sp3",
      content: "After the first month, engagement drops because there's no reason to come back daily.",
      quote: null,
      frequency: 4,
      starred: false,
    },
  ],
  feature_request: [
    {
      id: "sf1",
      content: "Weekly email digest showing what's new in my project — even a simple list of new insights would help.",
      quote: "A weekly email showing what changed would get me back in the tool far more regularly.",
      frequency: 14,
      starred: true,
    },
    {
      id: "sf2",
      content: "Notification when new insights are ready after a file upload.",
      quote: null,
      frequency: 5,
      starred: false,
    },
  ],
  decision: [
    {
      id: "sd1",
      content: "Weekly cadence agreed — daily would be too noisy. Monday 8 AM delivery confirmed with 3 customers.",
      quote: null,
      frequency: 1,
      starred: false,
    },
  ],
  action_item: [
    {
      id: "sa1",
      content: "Confirm React Email renders correctly in Outlook 2019 before starting template build.",
      quote: null,
      frequency: 1,
      starred: false,
    },
  ],
};

const SAMPLE_PRD = {
  id: "sample",
  title: "Weekly Insights Digest — Automated Email Summary for Team Leads",
  brief_summary: "Weekly email digest for Pro users surfacing starred insights, latest PRD, and file activity.",
  created_at: "2026-04-19T10:00:00Z",
};

const TYPE_META = {
  pain_point:      { label: "Pain Points",      dot: "bg-red-400",     badge: "bg-red-100 text-red-700" },
  feature_request: { label: "Feature Requests", dot: "bg-blue-400",    badge: "bg-blue-100 text-blue-700" },
  decision:        { label: "Decisions",         dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700" },
  action_item:     { label: "Action Items",      dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
} as const;

type InsightType = keyof typeof TYPE_META;
const TYPES: InsightType[] = ["pain_point", "feature_request", "decision", "action_item"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Component ──────────────────────────────────────────────────────────────────

interface SampleProjectViewProps {
  onUpload: () => void;
}

export default function SampleProjectView({ onUpload }: SampleProjectViewProps) {
  const [tab, setTab] = useState<"insights" | "prds">("insights");
  const [dismissed, setDismissed] = useState(false);
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  if (dismissed) return null;

  const totalInsights = Object.values(SAMPLE_INSIGHTS).flat().length;

  function toggleQuote(id: string) {
    setExpandedQuotes(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="relative">
      {/* Sample data banner */}
      <div className="mb-5 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-purple-800 mb-0.5">
            Sample project — this is what your dashboard looks like with real data
          </p>
          <p className="text-xs text-purple-600">
            Upload your first customer interview, transcript, or feedback file to replace this with your own insights.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <button
            onClick={onUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Upload size={12} />
            Upload file
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-purple-400 hover:text-purple-600 cursor-pointer"
            title="Dismiss sample"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab("insights")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === "insights" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Insights
          <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{totalInsights}</span>
        </button>
        <button
          onClick={() => setTab("prds")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === "prds" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          PRDs
          <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">1</span>
        </button>
      </div>

      {/* Insights tab */}
      {tab === "insights" && (
        <div className="space-y-5">
          {TYPES.map(type => {
            const items = SAMPLE_INSIGHTS[type];
            if (!items.length) return null;
            const meta = TYPE_META[type];
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{meta.label}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${meta.badge}`}>{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map(insight => (
                    <div key={insight.id} className={`bg-white border rounded-xl p-3 flex flex-col opacity-80 ${insight.starred ? "border-purple-100 bg-purple-50/20" : "border-gray-100"}`}>
                      <div className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${meta.dot}`} />
                        <p className="flex-1 text-sm font-semibold text-gray-900 leading-snug">{insight.content}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-sm leading-none ${insight.starred ? "text-amber-500" : "text-gray-300"}`}>★</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 ml-3.5 flex-wrap">
                        {insight.frequency > 1 && (
                          <span className={`text-[10px] px-1 py-0.5 rounded-full font-medium ${meta.badge}`}>{insight.frequency}×</span>
                        )}
                        {insight.quote && (
                          <button
                            onClick={() => toggleQuote(insight.id)}
                            className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            <ChevronRight size={10} className={expandedQuotes[insight.id] ? "rotate-90" : ""} />
                            Evidence
                          </button>
                        )}
                      </div>
                      {insight.quote && expandedQuotes[insight.id] && (
                        <blockquote className="mt-2 ml-3.5 border-l-2 border-[#7F77DD] pl-2 text-xs text-gray-500 italic">
                          &ldquo;{insight.quote}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRDs tab */}
      {tab === "prds" && (
        <div>
          <Link
            href="/sample-prd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-purple-200 hover:shadow-sm transition-all group opacity-80"
          >
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle2 size={14} className="text-[#1D9E75]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{SAMPLE_PRD.title}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{SAMPLE_PRD.brief_summary}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400">{formatDate(SAMPLE_PRD.created_at)}</span>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </Link>
          <p className="mt-3 text-xs text-gray-400 text-center">
            Upload files and generate your first PRD to replace this sample.
          </p>
        </div>
      )}
    </div>
  );
}
