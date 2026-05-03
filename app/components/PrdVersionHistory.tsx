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

const TRIGGER_COLOR: Record<PrdVersion["trigger"], string> = {
  creation: "bg-purple-50 text-purple-700",
  extension: "bg-amber-50 text-amber-700",
  restore: "bg-blue-50 text-blue-700",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PrdVersionHistory({ prdId }: { prdId: string }) {
  const { data: versions, isLoading } = useSWR<PrdVersion[]>(
    `/analyses/${prdId}/versions`,
    (key: string) => apiFetch<PrdVersion[]>(key),
    { revalidateOnFocus: false }
  );

  if (isLoading || !versions || versions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TRIGGER_COLOR[v.trigger]}`}>
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
