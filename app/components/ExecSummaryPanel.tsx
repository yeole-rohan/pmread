"use client";

import { useState } from "react";
import { FileText, RefreshCw, AlertTriangle, Copy, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ExecSummary } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

interface ExecSummaryPanelProps {
  analysisId: string;
  isPro: boolean;
  onUpgradeRequired: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ExecSummaryPanel({ analysisId, isPro, onUpgradeRequired }: ExecSummaryPanelProps) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<ExecSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function fetchSummary() {
    if (fetched) return;
    setLoading(true);
    try {
      const data = await apiFetch<ExecSummary | null>(`/analyses/${analysisId}/summary`);
      setSummary(data);
      setFetched(true);
    } catch {
      // no summary yet — that's fine
      setFetched(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    if (!isPro) {
      onUpgradeRequired();
      return;
    }
    const next = !open;
    setOpen(next);
    if (next && !fetched) {
      await fetchSummary();
    }
  }

  async function generate() {
    if (!isPro) { onUpgradeRequired(); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ExecSummary>(`/analyses/${analysisId}/summary`, { method: "POST" });
      setSummary(data);
      trackEvent("exec_summary_generated", { analysis_id: analysisId });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  }

  function buildCopyText(s: ExecSummary): string {
    const lines = [
      "EXECUTIVE SUMMARY",
      "",
      "Problem",
      s.content.problem,
      "",
      "Key Evidence",
      ...s.content.top_insights.map((i) => `• ${i.content} (${i.frequency}× mentioned)`),
      "",
      "Recommendation",
      s.content.recommendation,
      "",
      "Decision Needed",
      s.content.ask,
    ];
    return lines.join("\n");
  }

  async function copyAll() {
    if (!summary) return;
    await navigator.clipboard.writeText(buildCopyText(summary));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <FileText size={16} className="text-[#7F77DD]" />
          <span className="text-sm font-semibold text-gray-800">Executive Summary</span>
          {!isPro && (
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">Pro</span>
          )}
          {summary?.is_stale && (
            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              <AlertTriangle size={10} />Outdated
            </span>
          )}
          {summary && !summary.is_stale && (
            <span className="text-xs text-gray-400">Generated {formatDate(summary.generated_at)}</span>
          )}
        </div>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              {summary ? "Regenerating..." : "Generating executive summary..."}
            </div>
          )}

          {error && !loading && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {!loading && !summary && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">
                Generate a 60-second summary your stakeholders can actually read — problem, evidence, recommendation, and ask.
              </p>
              <button
                onClick={generate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FileText size={14} />
                Generate Summary
              </button>
            </div>
          )}

          {!loading && summary && (
            <div className="space-y-5">
              {summary.is_stale && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
                  <p className="text-xs text-amber-700">This PRD was extended — summary may be outdated.</p>
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900 disabled:opacity-50"
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
                </div>
              )}

              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Problem</p>
                <p className="text-sm text-gray-700 leading-relaxed">{summary.content.problem}</p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Key Evidence</p>
                <ul className="space-y-1.5">
                  {summary.content.top_insights.map((ins, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>
                        {ins.content}
                        {ins.frequency > 0 && (
                          <span className="ml-1.5 text-xs text-gray-400">({ins.frequency}×)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Recommendation</p>
                <p className="text-sm text-gray-700 leading-relaxed">{summary.content.recommendation}</p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3">
                <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-widest mb-1">Decision Needed</p>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{summary.content.ask}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={copyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy summary"}
                </button>
                {!summary.is_stale && (
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
