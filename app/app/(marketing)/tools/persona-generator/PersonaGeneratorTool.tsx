"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ToolResult from "@/components/ToolResult";

const PLACEHOLDER = `- Senior product manager at a 50-person B2B SaaS startup in Bangalore
- Has 5+ years of PM experience, ex-Flipkart
- Manages a team of 3 junior PMs
- Spends 40% of time in customer calls, rest in Jira and Slack
- Pain: drowning in feedback, no time to synthesize before sprint planning
- Uses Notion for docs, Jira for tickets, Zoom for calls
- Goal: ship fewer features but with higher confidence`;

export default function PersonaGeneratorTool() {
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!details.trim()) return;
    setError("");
    setResult("");
    setStreaming(true);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "persona-generator", details }),
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
            Describe your user <span className="text-red-400">*</span>
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={8}
            placeholder={PLACEHOLDER}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-400"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Paste interview notes, survey responses, or any observations about this user type. More detail = better persona.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={generate}
          disabled={!details.trim() || streaming}
          className="w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {streaming ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Building persona…
            </>
          ) : (
            "Generate Persona →"
          )}
        </button>
      </div>

      <ToolResult result={result} streaming={streaming} filename="user-persona.md" />

      {result && (
        <div className="mt-8 rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">
            Build personas from real interview data automatically
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PMRead extracts patterns from your user interviews and feedback to keep personas grounded in evidence.
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
