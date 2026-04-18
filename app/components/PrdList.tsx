"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Analysis } from "@/lib/types";
import ExtendPRDModal from "./ExtendPRDModal";

interface PrdListProps {
  projectId: string;
  prds: Analysis[];
  isPro?: boolean;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  complete: <CheckCircle2 size={14} className="text-[#1D9E75]" />,
  processing: <Loader2 size={14} className="text-[#7F77DD] animate-spin" />,
  pending: <Loader2 size={14} className="text-[#7F77DD] animate-spin" />,
  failed: <AlertCircle size={14} className="text-red-400" />,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PrdList({ projectId, prds: initialPrds, isPro = false }: PrdListProps) {
  const [prds, setPrds] = useState(initialPrds);
  const [extending, setExtending] = useState<Analysis | null>(null);

  function handleExtended(prdId: string, _appended: string, extensionCount: number) {
    setPrds((prev) =>
      prev.map((p) =>
        p.id === prdId
          ? { ...p, extension_count: extensionCount, new_insights_count: 0 }
          : p
      )
    );
    setExtending(null);
  }

  if (prds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-gray-600 font-medium mb-1">No PRDs yet</p>
        <p className="text-sm text-gray-400 max-w-xs">
          Upload files to extract insights, then hit Generate PRD to create your first one.
        </p>
        <a
          href="/templates/prd-template"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs text-[#7F77DD] hover:underline"
        >
          Not sure what to ask? Browse PRD templates →
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {prds.map((prd) => {
          const newCount = prd.new_insights_count ?? 0;
          const extCount = prd.extension_count ?? 0;
          const canExtend = isPro && prd.status === "complete" && newCount > 0 && extCount < 3;

          return (
            <div key={prd.id} className="flex items-center gap-2">
              <Link
                href={`/project/${projectId}/analysis/${prd.id}`}
                className="flex flex-1 items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-purple-200 hover:shadow-sm transition-all group min-w-0"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {STATUS_ICON[prd.status] ?? <Clock size={14} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{prd.question}</p>
                  {prd.brief_summary && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{prd.brief_summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {extCount > 0 && (
                    <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                      {extCount} update{extCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{formatDate(prd.created_at)}</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>

              {/* New insights badge + update button */}
              {newCount > 0 && prd.status === "complete" && (
                <button
                  onClick={() => setExtending(prd)}
                  title={
                    !isPro
                      ? "PRD updates require Pro"
                      : extCount >= 3
                      ? "Maximum 3 updates reached — generate a new PRD"
                      : `${newCount} new insight${newCount !== 1 ? "s" : ""} since this PRD was generated`
                  }
                  disabled={!isPro || extCount >= 3}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors ${
                    canExtend
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                      : "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Sparkles size={11} />
                  {newCount} new
                </button>
              )}
            </div>
          );
        })}
      </div>

      {extending && (
        <ExtendPRDModal
          prd={extending}
          onClose={() => setExtending(null)}
          onExtended={(appended, count) => handleExtended(extending.id, appended, count)}
        />
      )}
    </>
  );
}
