"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BriefRenderer from "@/components/BriefRenderer";
import { PRD } from "@/lib/types";

interface SharedPRD {
  question: string;
  title: string;
  additional_context: string | null;
  brief: PRD;
  created_at: string;
  sections?: string[];
}

const DEFAULT_SECTIONS = [
  "Problem", "Proposed Feature", "Why Worth Building", "Goals", "Non-Goals",
  "User Stories", "What Needs to Change", "Engineering Tasks", "Edge Cases",
  "Analytics Events", "Open Questions",
];

function FeedbackForm({ token, sections }: { token: string; sections: string[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [section, setSection] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/share/${token}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitter_name: name.trim(),
          submitter_email: email.trim() || null,
          section_ref: section || null,
          feedback_text: text.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900">Thanks for your feedback!</p>
        <p className="text-xs text-gray-400 mt-1">Your input has been shared with the product team.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Section <span className="text-gray-400 font-normal">(optional)</span></label>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent bg-white"
        >
          <option value="">General feedback</option>
          {sections.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Feedback <span className="text-red-400">*</span></label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts on this PRD…"
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={sending || !name.trim() || !text.trim()}
        className="w-full py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<SharedPRD | null>(null);
  const [notFound, setNotFound] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";

  useEffect(() => {
    fetch(`${apiBase}/share/${token}`)
      .then((res) => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json();
      })
      .then((json) => json && setData(json))
      .catch(() => setNotFound(true));
  }, [token, apiBase]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">This PRD link is invalid or has been removed.</p>
          <Link href="/" className="text-[#7F77DD] text-sm hover:underline">
            Learn about PMRead →
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#7F77DD]">PMRead</span>
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Create your own PRDs →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-medium uppercase tracking-widest text-[#7F77DD]">PRD</span>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mt-2 mb-3">{data.title || data.question}</h1>
          {data.additional_context && (
            <div className="mb-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Additional context</p>
              <div className="space-y-1.5">
                {data.additional_context.replace("Additional context:", "").trim().split(/Q: /).filter(Boolean).map((block, i) => {
                  const [q, ...aParts] = block.split(/ A: /);
                  const a = aParts.join(" A: ").trim();
                  return (
                    <div key={i} className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-medium text-gray-500">Q: </span>{q.trim()}
                      {a && <><br /><span className="font-medium text-gray-500">A: </span>{a}</>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-400">{formatDate(data.created_at)}</p>
        </div>

        {/* PRD content — readonly, no export bar */}
        <BriefRenderer brief={data.brief} />

        {/* Feedback form */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Leave feedback</h2>
          <p className="text-sm text-gray-400 mb-5">No account required. Your input goes directly to the product team.</p>
          <FeedbackForm token={token} sections={data.sections ?? DEFAULT_SECTIONS} />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-100 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Built with PMRead
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Turn customer research into evidence-backed PRDs in minutes.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Try PMRead free →
          </Link>
        </div>
      </div>
    </div>
  );
}
