"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ToolResult from "@/components/ToolResult";

const JD_PLACEHOLDER = `Product Manager — Growth, Series B B2B SaaS startup

We're looking for a PM to own our self-serve acquisition funnel. You'll define experiments, work closely with design and engineering, and be responsible for activation rate and time-to-value metrics.

Requirements:
- 3+ years as a PM at a B2B SaaS company
- Strong analytical skills, comfortable with SQL and A/B testing
- Experience with PLG (product-led growth) motions
- Prior experience working on onboarding or activation flows`;

const RESUME_PLACEHOLDER = `Senior PM at Razorpay (2021–2024)
- Led onboarding redesign that improved activation rate from 34% to 51%
- Ran 12 A/B tests on the merchant dashboard; 8 shipped to production
- Managed a squad of 4 engineers and 1 designer

Associate PM at Clevertap (2019–2021)
- Built self-serve pricing page; contributed to 18% increase in trial signups
- Proficient in Mixpanel, Amplitude, basic SQL`;

export default function InterviewPrepTool() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!jd.trim()) return;
    setError("");
    setResult("");
    setStreaming(true);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "interview-prep", jd, resume }),
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
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Job description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={7}
          placeholder={JD_PLACEHOLDER}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-300"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Paste the full JD or the key sections — role overview, requirements, and responsibilities.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your resume or experience{" "}
          <span className="text-gray-400 font-normal">(recommended)</span>
        </label>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={6}
          placeholder={RESUME_PLACEHOLDER}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none placeholder:text-gray-300"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Bullet points or pasted resume text. Answers will be grounded only in what you provide — no invented achievements.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={generate}
        disabled={!jd.trim() || streaming}
        className="w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {streaming ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Preparing your questions…
          </>
        ) : (
          "Generate Interview Questions →"
        )}
      </button>

      <ToolResult result={result} streaming={streaming} filename="interview-prep.md" />

      {result && (
        <div className="mt-6 rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-800 mb-1">
            Already have the job — need to write better PRDs?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PMRead turns customer interviews and Slack threads into evidence-backed PRDs in minutes.
            Built for Indian PMs, priced in INR.
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
