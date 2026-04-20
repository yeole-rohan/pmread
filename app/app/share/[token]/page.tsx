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
