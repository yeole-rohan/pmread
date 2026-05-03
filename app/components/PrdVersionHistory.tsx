"use client";

import useSWR from "swr";
import { History } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface PrdVersion {
  id: string;
  trigger: "creation" | "extension" | "restore";
  triggered_by: string | null;
  created_at: string;
}

const TRIGGER_LABEL: Record<PrdVersion["trigger"], string> = {
  creation: "Created",
  extension: "Updated",
  restore: "Restored",
};

const TRIGGER_DOT: Record<PrdVersion["trigger"], string> = {
  creation: "bg-purple-400",
  extension: "bg-amber-400",
  restore: "bg-blue-400",
};

const TRIGGER_BADGE: Record<PrdVersion["trigger"], string> = {
  creation: "bg-purple-50 text-purple-700",
  extension: "bg-amber-50 text-amber-700",
  restore: "bg-blue-50 text-blue-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function useVersions(prdId: string) {
  return useSWR<PrdVersion[]>(
    `/analyses/${prdId}/versions`,
    (key: string) => apiFetch<PrdVersion[]>(key),
    { revalidateOnFocus: false }
  );
}

// Compact sidebar variant — fits inside the left ToC column
export function PrdVersionHistorySidebar({ prdId }: { prdId: string }) {
  const { data: versions, isLoading } = useVersions(prdId);

  if (isLoading || !versions || versions.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <History size={12} className="text-gray-400" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">History</span>
      </div>

      <ol className="space-y-3">
        {versions.map((v, i) => (
          <li key={v.id} className="flex items-start gap-2">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${TRIGGER_DOT[v.trigger]}`} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-gray-700">{TRIGGER_LABEL[v.trigger]}</span>
                {i === 0 && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(v.created_at)}</p>
              {v.triggered_by && (
                <p className="text-[11px] text-gray-400">{v.triggered_by}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Full panel variant — bottom of main content column (shown on non-xl screens only)
export default function PrdVersionHistory({ prdId }: { prdId: string }) {
  const { data: versions, isLoading } = useVersions(prdId);

  if (isLoading || !versions || versions.length === 0) return null;

  return (
    <div className="xl:hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <History size={15} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">Version History</h3>
        <span className="text-xs text-gray-400 ml-1">{versions.length} snapshot{versions.length !== 1 ? "s" : ""}</span>
      </div>

      <ol className="relative border-l border-gray-100 space-y-4 ml-2">
        {versions.map((v, i) => (
          <li key={v.id} className="ml-4">
            <div className="absolute w-2.5 h-2.5 bg-gray-200 rounded-full -left-1.5 border border-white mt-1" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TRIGGER_BADGE[v.trigger]}`}>
                {TRIGGER_LABEL[v.trigger]}
              </span>
              {i === 0 && (
                <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
              <span className="text-xs text-gray-400">{formatDateTime(v.created_at)}</span>
              {v.triggered_by && (
                <span className="text-xs text-gray-400">· {v.triggered_by}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
