"use client";

import { useState } from "react";
import { Loader2, ChevronDown, ShieldCheck, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ValidationResult {
  coverage_score: number;
  gaps: string[];
  strengths: string[];
}

interface CoveragePanelProps {
  analysisId: string;
  cachedValidation?: ValidationResult | null;
}

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" :
    score >= 55 ? "bg-amber-400" :
    "bg-red-400";
  const label =
    score >= 80 ? "Strong coverage" :
    score >= 55 ? "Partial coverage" :
    "Low coverage";
  const textColor =
    score >= 80 ? "text-emerald-600" :
    score >= 55 ? "text-amber-600" :
    "text-red-500";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${textColor} flex-shrink-0`}>
        {score}% — {label}
      </span>
    </div>
  );
}

export default function CoveragePanel({ analysisId, cachedValidation }: CoveragePanelProps) {
  const [result, setResult] = useState<ValidationResult | null>(cachedValidation ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(!!cachedValidation);

  async function runValidation() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<ValidationResult>(`/analyses/${analysisId}/validate`, {
        method: "POST",
      });
      setResult(data);
      setOpen(true);
    } catch {
      setError("Validation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Not yet run
  if (!result && !loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">Coverage check</p>
          <p className="text-xs text-gray-400 mt-0.5">See which customer insights this PRD addresses</p>
        </div>
        <button
          onClick={runValidation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <ShieldCheck size={13} />
          Check coverage
        </button>
        {error && <p className="text-xs text-red-500 ml-3">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-2 text-sm text-gray-500">
        <Loader2 size={14} className="animate-spin text-[#7F77DD]" />
        Checking coverage against your insights…
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 group text-left"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#7F77DD]" />
          <span className="text-xs font-semibold text-[#7F77DD] uppercase tracking-wider">Coverage Check</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-300 group-hover:text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {/* Score meter */}
          <ScoreMeter score={result.coverage_score} />

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Strengths</p>
              <ul className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {result.gaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Gaps</p>
              <ul className="space-y-1.5">
                {result.gaps.map((g, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.gaps.length === 0 && result.strengths.length === 0 && (
            <p className="text-sm text-gray-400">No significant gaps or strengths found.</p>
          )}
        </div>
      )}
    </div>
  );
}
