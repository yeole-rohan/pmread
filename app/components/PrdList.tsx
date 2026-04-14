"use client";

import Link from "next/link";
import { ChevronRight, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Analysis } from "@/lib/types";

interface PrdListProps {
  projectId: string;
  prds: Analysis[];
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

export default function PrdList({ projectId, prds }: PrdListProps) {
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
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prds.map((prd) => (
        <Link
          key={prd.id}
          href={`/project/${projectId}/analysis/${prd.id}`}
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-purple-200 hover:shadow-sm transition-all group"
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
            <span className="text-xs text-gray-400">{formatDate(prd.created_at)}</span>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
