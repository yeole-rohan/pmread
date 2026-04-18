"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ToolResult from "@/components/ToolResult";

const PLACEHOLDER = `DAU dropped 12% week-over-week (from 8,400 to 7,400)
New signups flat at ~180/day
Churn increased from 3.2% to 4.1% this month
Feature adoption for "Export PDF" at 34% (was 41% last month)
P95 API latency up from 420ms to 890ms after Tuesday's deploy`;

export default function MetricStoryGeneratorTool() {
  const [metrics, setMetrics] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!metrics.trim()) return;
    setError("");
    setResult("");
    setStreaming(true);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "metric-story-generator",
          metrics,
          context: context.trim() || "Not provided",
        }),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult((prev) => prev + decoder.decode(value));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Paste your metrics <span className="text-red-400">*</span>
        </label>
        <textarea
          value={metrics}
          onChange={(e) => setMetrics(e.target.value)}
          rows={6}
          placeholder={PLACEHOLDER}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-400 font-mono"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Numbers, percentages, trends — any format. One metric per line works best.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Product context <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. B2B SaaS project management tool, 12K MAU, launched new onboarding last Tuesday"
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent placeholder:text-gray-400"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          What your product is and any relevant recent changes — helps generate a more accurate narrative.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={generate}
        disabled={!metrics.trim() || streaming}
        className="w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {streaming ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Writing your story…
          </>
        ) : (
          "Generate Metric Story →"
        )}
      </button>

      <ToolResult result={result} streaming={streaming} filename="metric-story.md" />

      {result && (
        <div className="mt-6 rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">
            Get metrics grounded in real customer feedback
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PMRead connects your metrics to the actual customer evidence behind them — so you know not just what changed, but why.
          </p>
          <a
            href="/signup"
            className="inline-block px-5 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Try PMRead free →
          </a>
        </div>
      )}
    </div>
  );
}
