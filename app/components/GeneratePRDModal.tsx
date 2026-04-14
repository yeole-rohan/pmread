"use client";

import { useState } from "react";
import { X, Loader2, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { APIError, Insight, InsightType } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

const TYPE_META: Record<InsightType, { label: string; badge: string }> = {
  pain_point:      { label: "Pain Points",      badge: "bg-red-100 text-red-700 border-red-200" },
  feature_request: { label: "Feature Requests", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  decision:        { label: "Decisions",         badge: "bg-amber-100 text-amber-700 border-amber-200" },
  action_item:     { label: "Action Items",      badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const TYPES: InsightType[] = ["pain_point", "feature_request", "decision", "action_item"];

type WindowPreset = "all" | "7" | "30" | "90" | "custom";

const PRESETS: { label: string; value: WindowPreset }[] = [
  { label: "All time", value: "all" },
  { label: "Last 7d", value: "7" },
  { label: "Last 30d", value: "30" },
  { label: "Last 90d", value: "90" },
  { label: "Custom", value: "custom" },
];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function inDateWindow(ins: Insight, preset: WindowPreset, dateFrom: string, dateTo: string): boolean {
  const d = new Date(ins.created_at).getTime();
  if (preset === "custom") {
    if (dateFrom && d < new Date(dateFrom).getTime()) return false;
    if (dateTo && d > new Date(dateTo + "T23:59:59").getTime()) return false;
  } else if (preset !== "all") {
    if (d < Date.now() - Number(preset) * 24 * 60 * 60 * 1000) return false;
  }
  return true;
}

interface GeneratePRDModalProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onCreated: (analysisId: string) => void;
  onUpgradeNeeded: () => void;
  grouped: Record<InsightType, Insight[]>;
}

export default function GeneratePRDModal({
  projectId,
  open,
  onClose,
  onCreated,
  onUpgradeNeeded,
  grouped,
}: GeneratePRDModalProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<InsightType>>(new Set(TYPES));
  const [starredOnly, setStarredOnly] = useState(false);
  const [preset, setPreset] = useState<WindowPreset>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(todayISO());

  if (!open) return null;

  const allInsights = TYPES.flatMap((t) => grouped[t] ?? []);
  const starredCount = allInsights.filter((i) => i.starred).length;

  const totalSelected = starredOnly
    ? starredCount
    : allInsights.filter((ins) => {
        if (!selectedTypes.has(ins.type as InsightType)) return false;
        return inDateWindow(ins, preset, dateFrom, dateTo);
      }).length;

  const customValid = preset !== "custom" || (dateFrom.length > 0 && dateTo.length > 0 && dateFrom <= dateTo);
  const canSubmit = question.trim().length > 5 && !loading && selectedTypes.size > 0 && customValid && totalSelected > 0;

  function toggleType(type: InsightType) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size === 1) return prev;
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    let daysBack: number | null = null;
    let dateFromPayload: string | null = null;
    let dateToPayload: string | null = null;

    if (preset === "custom") {
      dateFromPayload = dateFrom || null;
      dateToPayload = dateTo || null;
    } else if (preset !== "all") {
      daysBack = Number(preset);
    }

    try {
      const result = await apiFetch<{ analysis_id: string }>("/analyses/", {
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          question: question.trim(),
          insight_types: starredOnly ? null : Array.from(selectedTypes),
          starred_only: starredOnly,
          days_back: starredOnly ? null : daysBack,
          date_from: starredOnly ? null : dateFromPayload,
          date_to: starredOnly ? null : dateToPayload,
        }),
      });
      trackEvent("generate_prd", {
        starred_only: starredOnly,
        insight_count: totalSelected,
        question_length: question.trim().length,
      });
      setQuestion("");
      onCreated(result.analysis_id);
    } catch (err) {
      if (err instanceof APIError && err.code === "PRD_LIMIT_REACHED") {
        onClose();
        onUpgradeNeeded();
      } else {
        setError(err instanceof APIError ? err.message : "Something went wrong. Try again.");
      }
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setQuestion("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* When submitting, use a fully opaque backdrop that blocks all interaction */}
      <div
        className={`absolute inset-0 transition-colors ${loading ? "bg-black/60 cursor-not-allowed" : "bg-black/40"}`}
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4">
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40 cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">Generate PRD</h2>
        {loading ? (
          <div className="flex items-center gap-2 mb-5">
            <Loader2 size={14} className="animate-spin text-[#7F77DD]" />
            <p className="text-sm text-[#7F77DD] font-medium">Starting generation — please wait...</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-5">
            PMRead answers using your filtered insights.
          </p>
        )}

        {/* Insight scope */}
        <div className="mb-5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
            Use insights from
          </p>

          {/* Starred toggle — global across all types */}
          <button
            onClick={() => starredCount > 0 && setStarredOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-3 transition-all ${
              starredCount === 0
                ? "text-gray-300 border-gray-100 bg-white cursor-default"
                : starredOnly
                ? "bg-amber-100 text-amber-700 border-amber-200 cursor-pointer"
                : "text-gray-400 border-gray-200 bg-white hover:border-amber-200 hover:text-amber-600 cursor-pointer"
            }`}
            title={starredCount === 0 ? "Star insights to use this filter" : undefined}
          >
            <span>★</span>
            Starred only ({starredCount})
          </button>

          {/* Type filters — disabled when starred only */}
          <div className={`flex flex-wrap gap-1.5 mb-3 transition-opacity ${starredOnly ? "opacity-30 pointer-events-none" : ""}`}>
            {TYPES.map((type) => {
              const meta = TYPE_META[type];
              const count = (grouped[type] ?? []).filter((ins) =>
                inDateWindow(ins, preset, dateFrom, dateTo)
              ).length;
              const selected = selectedTypes.has(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    selected
                      ? meta.badge
                      : "text-gray-400 border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {selected && <Check size={9} />}
                  {meta.label}
                  <span className={selected ? "opacity-70" : "opacity-50"}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Time window — disabled when starred only */}
          <div className={`space-y-2 transition-opacity ${starredOnly ? "opacity-30 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-400 mr-1">Time window:</span>
              {PRESETS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPreset(opt.value)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                    preset === opt.value
                      ? "bg-[#7F77DD] text-white"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {preset === "custom" && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-gray-400">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    max={dateTo || todayISO()}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7F77DD]/40 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-300">→</span>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-gray-400">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    min={dateFrom}
                    max={todayISO()}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7F77DD]/40 cursor-pointer"
                  />
                </div>
                {dateFrom && dateTo && dateFrom > dateTo && (
                  <span className="text-xs text-red-500">Invalid range</span>
                )}
              </div>
            )}
          </div>

          {/* Scope summary */}
          <p className="mt-2.5 text-xs text-gray-400">
            {totalSelected === 0
              ? "No insights match this filter."
              : `${totalSelected} insight${totalSelected !== 1 ? "s" : ""} will be used`}
          </p>
        </div>

        {/* Question */}
        <textarea
          autoFocus
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
          placeholder="e.g. What should I build next for the billing experience?"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40 resize-none"
        />

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <p className="mt-1.5 text-xs text-gray-400">⌘ + Enter to submit</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Starting...
              </>
            ) : (
              "Generate PRD →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
