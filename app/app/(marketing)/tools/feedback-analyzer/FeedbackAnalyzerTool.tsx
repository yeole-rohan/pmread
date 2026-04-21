"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ToolResult from "@/components/ToolResult";

const PLACEHOLDER = `Customer 1: The onboarding is confusing, I didn't know where to start after signup.
Customer 2: Love the insights feature but please add Slack integration.
Customer 3: Exporting to PDF would save me so much time every sprint review.
Customer 4: The AI summaries are great but sometimes miss the real pain.
Customer 5: Why can't I filter insights by source? I need to separate interviews from survey data.`;

export default function FeedbackAnalyzerTool() {
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!feedback.trim()) return;
    setError("");
    setResult("");
    setStreaming(true);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "feedback-analyzer", feedback }),
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
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Paste customer feedback <span className="text-red-400">*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={8}
            placeholder={PLACEHOLDER}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-400 font-mono"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Paste raw notes, survey responses, interview snippets, or support tickets — one entry per line works best.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={analyze}
          disabled={!feedback.trim() || streaming}
          className="w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {streaming ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Analyzing feedback…
            </>
          ) : (
            "Analyze Feedback →"
          )}
        </button>
      </div>

      <ToolResult result={result} streaming={streaming} filename="feedback-analysis.md" />

      {result && (
        <div className="mt-8 rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">
            Analyze feedback from files, calls, and Slack automatically
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PMRead ingests PDFs, audio recordings, Zoom transcripts, and Slack channels — and extracts insights continuously.
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
