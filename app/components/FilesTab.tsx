"use client";

import { useEffect, useState } from "react";
import { FileText, FileImage, File, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Doc } from "@/lib/types";

interface FilesTabProps {
  projectId: string;
}

function fileIcon(fileType: string) {
  if (fileType === "pdf") return <FileText size={16} className="text-red-400" />;
  if (["png", "jpg", "jpeg", "webp"].includes(fileType)) return <FileImage size={16} className="text-blue-400" />;
  return <File size={16} className="text-gray-400" />;
}

function StatusBadge({ status }: { status: Doc["insight_status"] }) {
  if (status === "done") {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <CheckCircle2 size={11} />
        Extracted
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <XCircle size={11} />
        Failed
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
        <Loader2 size={11} className="animate-spin" />
        Processing
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <Clock size={11} />
      Pending
    </span>
  );
}

function formatWords(chars: number | null) {
  if (!chars) return "";
  const words = Math.round(chars / 5);
  return words >= 1000 ? `~${(words / 1000).toFixed(1)}k words` : `~${words} words`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function FilesTab({ projectId }: FilesTabProps) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<Doc[]>(`/projects/${projectId}/docs`)
      .then(setDocs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <FileText size={20} className="text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No files uploaded yet</p>
        <p className="text-sm text-gray-400">Upload customer interviews, call transcripts, or feedback files.</p>
      </div>
    );
  }

  const done = docs.filter((d) => d.insight_status === "done").length;
  const total = docs.length;

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{total}</span> file{total !== 1 ? "s" : ""} uploaded
          {done > 0 && (
            <span className="ml-2 text-emerald-600">{done} extracted</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"
          >
            <div className="flex-shrink-0">{fileIcon(doc.file_type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {doc.file_type.toUpperCase()}
                {doc.char_count ? ` · ${formatWords(doc.char_count)}` : ""}
                {" · "}
                {formatDate(doc.created_at)}
              </p>
            </div>
            <StatusBadge status={doc.insight_status} />
          </div>
        ))}
      </div>
    </div>
  );
}
