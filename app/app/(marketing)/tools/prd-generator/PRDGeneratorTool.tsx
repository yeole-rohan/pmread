"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ToolResult from "@/components/ToolResult";

export default function PRDGeneratorTool() {
  const [problem, setProblem] = useState("");
  const [users, setUsers] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!problem.trim()) return;
    setError("");
    setResult("");
    setStreaming(true);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "prd-generator", problem, users, context }),
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
            Problem statement <span className="text-red-400">*</span>
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            placeholder="e.g. Enterprise PMs spend 3+ hours manually reading interview transcripts to find common pain points, missing patterns and shipping the wrong features."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-400"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Target users <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              placeholder="e.g. Product managers at B2B SaaS startups"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional context <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Mobile app, existing auth system"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={generate}
          disabled={!problem.trim() || streaming}
          className="w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {streaming ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating PRD…
            </>
          ) : (
            "Generate PRD →"
          )}
        </button>
      </div>

      <ToolResult result={result} streaming={streaming} filename="prd-draft.md" />

      {result && (
        <div className="mt-8 rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">
            Want to generate PRDs from real customer interviews and feedback?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PMRead extracts insights from calls, docs, and Slack — then writes PRDs grounded in evidence.
          </p>
          <a
            href="/signup?plan=pro"
            className="inline-block px-5 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Try PMRead free →
          </a>
        </div>
      )}
    </div>
  );
}
