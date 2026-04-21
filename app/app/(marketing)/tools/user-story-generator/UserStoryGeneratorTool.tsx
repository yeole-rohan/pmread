"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ToolResult from "@/components/ToolResult";

export default function UserStoryGeneratorTool() {
  const [feature, setFeature] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!feature.trim()) return;
    setError("");
    setResult("");
    setStreaming(true);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "user-story-generator", feature, role }),
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
            Feature description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            rows={4}
            placeholder="e.g. Allow users to export their insight board as a PDF report that they can share with stakeholders in a weekly review."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Primary user role <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Product manager, admin, enterprise customer"
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent placeholder:text-gray-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={generate}
          disabled={!feature.trim() || streaming}
          className="w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {streaming ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating stories…
            </>
          ) : (
            "Generate User Stories →"
          )}
        </button>
      </div>

      <ToolResult result={result} streaming={streaming} filename="user-stories.md" />

      {result && (
        <div className="mt-8 rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">
            Turn real customer feedback into user stories automatically
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PMRead extracts insights from your interviews and feedback, then generates PRDs grounded in evidence.
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
