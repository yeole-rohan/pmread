"use client";

import { useState } from "react";
import { Loader2, Copy, Check, ChevronDown, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";

type DocType = "release_notes" | "faq" | "announcement";

const DOC_OPTIONS: {
  type: DocType;
  label: string;
  tagline: string;
  what: string;
  value: string;
}[] = [
  {
    type: "release_notes",
    label: "Release Notes",
    tagline: "Customer-facing changelog copy",
    what: "Headline + 2-sentence summary + 3–5 bullet points of what's new. Written for end users.",
    value: "Drop straight into your changelog, Product Hunt post, or in-app announcement banner.",
  },
  {
    type: "faq",
    label: "FAQ",
    tagline: "Support & docs Q&A",
    what: "5–7 Q&A pairs covering what it does, who it's for, what changes for existing users, and any limits.",
    value: "Paste into your help center, support runbook, or onboarding doc. Saves your support team hours.",
  },
  {
    type: "announcement",
    label: "Announcement",
    tagline: "Internal Slack / email (< 150 words)",
    what: "3 short paragraphs: what shipped, why it matters, what to do next. Ends with a clear CTA.",
    value: "Share with sales, support, and design so everyone knows what launched and why.",
  },
];

interface DocWriterPanelProps {
  analysisId: string;
  cachedDocs?: Record<string, string>;
}

export default function DocWriterPanel({ analysisId, cachedDocs }: DocWriterPanelProps) {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState<DocType>("release_notes");
  const [results, setResults] = useState<Partial<Record<DocType, string>>>(
    () => {
      const init: Partial<Record<DocType, string>> = {};
      for (const opt of DOC_OPTIONS) {
        const cached = cachedDocs?.[`doc_${opt.type}`];
        if (cached) init[opt.type] = cached;
      }
      return init;
    }
  );
  const [loading, setLoading] = useState<DocType | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const activeOpt = DOC_OPTIONS.find((o) => o.type === activeType)!;
  const activeContent = results[activeType];
  const isLoading = loading === activeType;

  async function generate() {
    if (isLoading) return;
    setLoading(activeType);
    setError("");
    try {
      const res = await apiFetch<{ doc_type: string; content: string }>(
        `/analyses/${analysisId}/write-doc?doc_type=${activeType}`,
        { method: "POST" }
      );
      setResults((prev) => ({ ...prev, [activeType]: res.content }));
    } catch {
      setError("Generation failed. Try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handleCopy() {
    const text = results[activeType];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const generatedCount = DOC_OPTIONS.filter((o) => results[o.type]).length;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 group text-left"
      >
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[#7F77DD]" />
          <span className="text-xs font-semibold text-[#7F77DD] uppercase tracking-wider">Write Docs</span>
          {generatedCount > 0 && (
            <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
              {generatedCount} generated
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-300 group-hover:text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* Doc type tabs */}
          <div className="flex gap-1 mb-5">
            {DOC_OPTIONS.map((opt) => {
              const isDone = !!results[opt.type];
              const isCurrent = activeType === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => { setActiveType(opt.type); setError(""); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    isCurrent
                      ? "bg-[#7F77DD] text-white border-[#7F77DD]"
                      : isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                  {isDone && !isCurrent && <span className="ml-1">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Description card — always visible for active tab */}
          {!activeContent && !isLoading && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{activeOpt.tagline}</p>
              <p className="text-sm text-gray-700 mb-1.5">
                <span className="font-medium">What you get:</span> {activeOpt.what}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Value:</span> {activeOpt.value}
              </p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-2 py-6 justify-center text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin text-[#7F77DD]" />
              Writing {activeOpt.label}…
            </div>
          )}

          {/* Generated content */}
          {activeContent && !isLoading && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400">{activeOpt.tagline}</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-semibold transition-colors cursor-pointer"
                >
                  {copied
                    ? <><Check size={12} className="text-green-500" /><span className="text-green-500">Copied</span></>
                    : <><Copy size={12} /><span>Copy</span></>
                  }
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {activeContent}
              </div>
            </div>
          )}

          {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

          {/* Action buttons */}
          <div className="flex gap-2">
            {activeContent && !isLoading && (
              <button
                onClick={() => { setResults((prev) => { const n = {...prev}; delete n[activeType]; return n; }); setError(""); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                Regenerate
              </button>
            )}
            {!activeContent && !isLoading && (
              <button
                onClick={generate}
                className="flex-1 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Generate {activeOpt.label} →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
