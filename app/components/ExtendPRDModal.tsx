"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Analysis } from "@/lib/types";

interface NewInsight {
  id: string;
  type: string;
  content: string;
  quote: string | null;
  frequency: number;
  created_at: string;
}

interface Props {
  prd: Analysis;
  onClose: () => void;
  onExtended: (extension: import("@/lib/types").PRDExtension, extensionCount: number) => void;
}

const TYPE_LABEL: Record<string, string> = {
  pain_point: "Pain Point",
  feature_request: "Feature Request",
  decision: "Decision",
  action_item: "Action Item",
};

const TYPE_COLOR: Record<string, string> = {
  pain_point: "bg-red-50 text-red-600",
  feature_request: "bg-blue-50 text-blue-600",
  decision: "bg-amber-50 text-amber-600",
  action_item: "bg-emerald-50 text-emerald-600",
};

export default function ExtendPRDModal({ prd, onClose, onExtended }: Props) {
  const [insights, setInsights] = useState<NewInsight[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extensionsUsed = prd.extension_count ?? 0;
  const extensionsRemaining = 3 - extensionsUsed;

  useEffect(() => {
    apiFetch<NewInsight[]>(`/analyses/${prd.id}/new-insights`)
      .then((data) => {
        setInsights(data);
        // Pre-select all by default
        setSelected(new Set(data.map((i) => i.id)));
      })
      .catch(() => setError("Could not load new insights."))
      .finally(() => setLoading(false));
  }, [prd.id]);

  function toggleInsight(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleExtend() {
    if (selected.size === 0) return;
    setExtending(true);
    setError(null);
    try {
      const result = await apiFetch<{
        success: boolean;
        extension_count: number;
        extensions_remaining: number;
        extension: import("@/lib/types").PRDExtension;
      }>(`/analyses/${prd.id}/extend`, {
        method: "POST",
        body: JSON.stringify({ insight_ids: Array.from(selected) }),
      });
      onExtended(result.extension, result.extension_count);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update PRD. Try again.";
      setError(msg);
    } finally {
      setExtending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Update PRD</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{prd.title || prd.question}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        {/* Extension count */}
        <div className="px-5 py-2.5 bg-purple-50 border-b border-purple-100">
          <p className="text-xs text-purple-700">
            <span className="font-semibold">{extensionsRemaining} update{extensionsRemaining !== 1 ? "s" : ""} remaining</span>
            {" "}for this PRD · Updates append a new section, no credit deducted
          </p>
        </div>

        {/* Insight list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-xs text-gray-400">
              <Loader2 size={14} className="animate-spin" /> Loading new insights...
            </div>
          ) : insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-gray-500 font-medium">No new insights since this PRD was generated</p>
              <p className="text-xs text-gray-400 mt-1">Upload more files to extract fresh evidence first.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">
                Select which insights to fold into the PRD ({selected.size} of {insights.length} selected):
              </p>
              {insights.map((insight) => (
                <label
                  key={insight.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selected.has(insight.id)
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(insight.id)}
                    onChange={() => toggleInsight(insight.id)}
                    className="mt-0.5 accent-[#7F77DD]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${TYPE_COLOR[insight.type] ?? "bg-gray-50 text-gray-500"}`}>
                        {TYPE_LABEL[insight.type] ?? insight.type}
                      </span>
                      {insight.frequency > 1 && (
                        <span className="text-[10px] text-gray-400">{insight.frequency}×</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-800 font-medium leading-snug">{insight.content}</p>
                    {insight.quote && (
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 italic">&ldquo;{insight.quote}&rdquo;</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mb-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
            <AlertCircle size={12} />
            {error}
          </div>
        )}

        {/* Footer */}
        {insights.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() =>
                setSelected(
                  selected.size === insights.length
                    ? new Set()
                    : new Set(insights.map((i) => i.id))
                )
              }
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {selected.size === insights.length ? "Deselect all" : "Select all"}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExtend}
                disabled={selected.size === 0 || extending}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {extending ? (
                  <><Loader2 size={13} className="animate-spin" /> Updating...</>
                ) : (
                  <><Sparkles size={13} /> Update PRD ({selected.size})</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
