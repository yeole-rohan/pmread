"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { PRD } from "@/lib/types";

interface BriefRendererProps {
  brief: PRD;
}

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copied, copy };
}

function SectionHeader({ title, copyText }: { title: string; copyText: string }) {
  const { copied, copy } = useCopy(copyText);
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-semibold text-[#7F77DD] uppercase tracking-wider">{title}</h3>
      <button onClick={copy} className="text-gray-300 hover:text-gray-500 transition-colors">
        {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

/** Split a prose string into chunks of ~2 sentences each for easier reading. */
function splitProse(text: string): string[] {
  if (!text) return [];
  // Match sentences ending in . ! ? (including ellipsis) followed by space or end
  const sentences = text.match(/[^.!?]+(?:[.!?]+(?:\s|$))+/g);
  if (!sentences || sentences.length <= 2) return [text.trim()];
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const chunk = (sentences[i] + (sentences[i + 1] ?? "")).trim();
    if (chunk) chunks.push(chunk);
  }
  return chunks;
}

function ProseBlock({ text }: { text: string }) {
  const chunks = splitProse(text);
  return (
    <div className="space-y-2">
      {chunks.map((chunk, i) => (
        <p key={i} className="text-sm text-gray-700 leading-relaxed">{chunk}</p>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return null;
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

export function useDownload(url: string, filename: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        let msg = "Download failed. Please try again.";
        try {
          const data = await res.json();
          msg = data?.detail?.error ?? data?.detail ?? msg;
        } catch {}
        setError(msg);
        return;
      }
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objUrl);
    } catch {
      setError("Download failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return { download, loading, error, clearError: () => setError(null) };
}

export default function BriefRenderer({ brief }: BriefRendererProps) {
  return (
    <div className="space-y-4">
      {/* Problem */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <SectionHeader title="Problem" copyText={brief.problem} />
        <ProseBlock text={brief.problem} />
        {brief.problem_quotes?.length > 0 && (
          <div className="mt-3 space-y-2">
            {brief.problem_quotes.map((q, i) => (
              <blockquote key={i} className="border-l-2 border-[#7F77DD] pl-3 py-1 text-sm text-gray-500 italic bg-purple-50/40 rounded-r">
                &ldquo;{q}&rdquo;
              </blockquote>
            ))}
          </div>
        )}
      </div>

      {/* Proposed Feature */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <SectionHeader title="Proposed Feature" copyText={brief.proposed_feature} />
        <div className="bg-emerald-50 border-l-4 border-[#1D9E75] px-4 py-3 rounded-r-lg">
          <ProseBlock text={brief.proposed_feature} />
        </div>
      </div>

      {/* Why Build */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <SectionHeader title="Why It's Worth Building" copyText={brief.why_worth_building} />
        <ProseBlock text={brief.why_worth_building} />
      </div>

      {/* Goals + Non-Goals side by side */}
      {(brief.goals?.length > 0 || brief.non_goals?.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {brief.goals?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <SectionHeader title="Goals" copyText={brief.goals.join("\n")} />
              <BulletList items={brief.goals} />
            </div>
          )}
          {brief.non_goals?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <SectionHeader title="Non-Goals" copyText={brief.non_goals.join("\n")} />
              <BulletList items={brief.non_goals} />
            </div>
          )}
        </div>
      )}

      {/* User Stories */}
      {brief.user_stories?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <SectionHeader title="User Stories" copyText={brief.user_stories.join("\n")} />
          <ul className="space-y-1.5">
            {brief.user_stories.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What Needs to Change */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <SectionHeader
          title="What Needs to Change"
          copyText={`UI: ${brief.what_needs_to_change?.ui}\n\nData Model: ${brief.what_needs_to_change?.data_model}\n\nWorkflows: ${brief.what_needs_to_change?.workflows}`}
        />
        <div className="space-y-3">
          {[
            { label: "UI Changes", value: brief.what_needs_to_change?.ui },
            { label: "Data Model", value: brief.what_needs_to_change?.data_model },
            { label: "Workflows", value: brief.what_needs_to_change?.workflows },
          ].filter(i => i.value).map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
              <ProseBlock text={item.value ?? ""} />
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <SectionHeader
          title="Engineering Tasks"
          copyText={brief.engineering_tasks?.map((t) => `- ${t.title} [${t.estimate}]: ${t.description}`).join("\n")}
        />
        <div className="space-y-2">
          {brief.engineering_tasks?.map((task, i) => (
            <div key={i} className="flex gap-3 border border-gray-100 rounded-lg p-3">
              <div className="w-5 h-5 rounded-full bg-[#7F77DD] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{task.estimate}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edge Cases */}
      {brief.edge_cases?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <SectionHeader title="Edge Cases" copyText={brief.edge_cases.join("\n")} />
          <BulletList items={brief.edge_cases} />
        </div>
      )}

      {/* Analytics Events */}
      {brief.analytics_events?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <SectionHeader title="Analytics Events" copyText={brief.analytics_events.join("\n")} />
          <div className="space-y-1.5">
            {brief.analytics_events.map((e, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono whitespace-nowrap">
                  {e.split(":")[0]?.trim()}
                </code>
                <span className="text-gray-500 text-xs pt-1">{e.split(":").slice(1).join(":").trim()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Questions */}
      {brief.open_questions?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <SectionHeader title="Open Questions" copyText={brief.open_questions.join("\n")} />
          <BulletList items={brief.open_questions} />
        </div>
      )}

      
    </div>
  );
}

export function buildMarkdown(brief: PRD): string {
  const quotes = brief.problem_quotes?.map((q) => `> "${q}"`).join("\n") ?? "";
  const goals = brief.goals?.map((g) => `- ${g}`).join("\n") ?? "";
  const nonGoals = brief.non_goals?.map((g) => `- ${g}`).join("\n") ?? "";
  const stories = brief.user_stories?.map((s) => `- ${s}`).join("\n") ?? "";
  const wtc = brief.what_needs_to_change ?? {};
  const tasks = brief.engineering_tasks?.map((t) => `- **${t.title}** \`${t.estimate}\`\n  ${t.description}`).join("\n") ?? "";
  const edges = brief.edge_cases?.map((c) => `- ${c}`).join("\n") ?? "";
  const events = brief.analytics_events?.map((e) => `- ${e}`).join("\n") ?? "";
  const questions = brief.open_questions?.map((q) => `- ${q}`).join("\n") ?? "";

  return `# PRD\n\n## Problem\n${brief.problem}\n\n${quotes}\n\n## Proposed Feature\n${brief.proposed_feature}\n\n## Why It's Worth Building\n${brief.why_worth_building}\n\n## Goals\n${goals}\n\n## Non-Goals\n${nonGoals}\n\n## User Stories\n${stories}\n\n## What Needs to Change\n\n**UI Changes**\n${wtc.ui ?? ""}\n\n**Data Model**\n${wtc.data_model ?? ""}\n\n**Workflows**\n${wtc.workflows ?? ""}\n\n## Engineering Tasks\n${tasks}\n\n## Edge Cases\n${edges}\n\n## Analytics Events\n${events}\n\n## Open Questions\n${questions}\n\n---\n*Generated by PMRead*`;
}
