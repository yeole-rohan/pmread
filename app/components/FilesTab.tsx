"use client";

import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { FileText, FileImage, File, Loader2, CheckCircle2, XCircle, Clock, Copy, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Doc } from "@/lib/types";
import { docsCacheKey } from "@/lib/useProjectData";

interface FilesTabProps {
  projectId: string;
  ingestEmailToken?: string | null;
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

function IngestEmailSection({ projectId, initialToken }: { projectId: string; initialToken?: string | null }) {
  const [token, setToken] = useState<string | null>(initialToken ?? null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const email = token ? `${token}@ingest.pmread.com` : null;

  async function handleCopy() {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await apiFetch<{ ingest_email: string }>(`/projects/${projectId}/ingest-token/regenerate`, { method: "POST" });
      const newToken = res.ingest_email.split("@")[0];
      setToken(newToken);
      // Invalidate projects list cache so sidebar reflects new token
      globalMutate("/projects/");
    } catch {
      // silent
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <p className="text-sm font-semibold text-gray-700 mb-1">Email files to this project</p>
      <p className="text-xs text-gray-400 mb-3">
        Forward emails, transcripts, or attachments to this address to add them as files.
      </p>
      {email ? (
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 truncate">
            {email}
          </code>
          <button
            onClick={handleCopy}
            title="Copy"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            {copied ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Copy size={15} />}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            title="Regenerate"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400">No ingest address available.</p>
      )}
    </div>
  );
}

export default function FilesTab({ projectId, ingestEmailToken }: FilesTabProps) {
  const { data: docs, isLoading } = useSWR<Doc[]>(
    docsCacheKey(projectId),
    (key: string) => apiFetch<Doc[]>(key),
    { revalidateOnFocus: false, dedupingInterval: 30_000 },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!docs || docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <FileText size={20} className="text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No files uploaded yet</p>
        <p className="text-sm text-gray-400">Upload customer interviews, call transcripts, or feedback files.</p>
        <IngestEmailSection projectId={projectId} initialToken={ingestEmailToken} />
      </div>
    );
  }

  const done = docs.filter((d) => d.insight_status === "done").length;
  const total = docs.length;

  return (
    <div>
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

      <IngestEmailSection projectId={projectId} initialToken={ingestEmailToken} />
    </div>
  );
}
