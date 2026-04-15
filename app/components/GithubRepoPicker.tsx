"use client";

import { useState, useEffect, useRef } from "react";
import { GitBranch, ChevronDown, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useProjectEvents } from "@/lib/useProjectEvents";

interface Repo {
  full_name: string;
  name: string;
  private: boolean;
  description: string;
  language: string;
}

interface IndexStatus {
  github_repo: string | null;
  github_index_status: string | null; // "indexing" | "ready" | "failed" | null
  chunk_count: number;
}

interface Props {
  projectId: string;
  githubConnected: boolean;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  indexing: { label: "Indexing...", color: "text-amber-600 bg-amber-50" },
  ready:    { label: "Indexed",    color: "text-emerald-600 bg-emerald-50" },
  failed:   { label: "Index failed", color: "text-red-500 bg-red-50" },
};

export default function GitBranchRepoPicker({ projectId, githubConnected }: Props) {
  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<IndexStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load current status on mount
  useEffect(() => {
    if (!githubConnected) return;
    apiFetch<IndexStatus>(`/github/projects/${projectId}/index-status`)
      .then(setStatus)
      .catch(() => {});
  }, [projectId, githubConnected]);

  // Real-time index status via SSE — replaces polling
  useProjectEvents(projectId, {
    onGithubIndex: (event) => {
      setStatus((prev) => ({
        github_repo: prev?.github_repo ?? null,
        github_index_status: event.status,
        chunk_count: event.chunk_count,
      }));
    },
  });

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function openPicker() {
    if (!githubConnected) {
      window.location.href = "/settings";
      return;
    }
    setOpen(true);
    if (repos.length === 0) {
      setLoadingRepos(true);
      try {
        const data = await apiFetch<Repo[]>("/github/repos");
        setRepos(data);
      } catch {}
      setLoadingRepos(false);
    }
  }

  async function selectRepo(repo: Repo | null) {
    setSaving(true);
    try {
      const result = await apiFetch<{ github_repo: string | null; github_index_status: string | null }>(
        `/github/projects/${projectId}/repo`,
        { method: "PATCH", body: JSON.stringify({ repo_full_name: repo?.full_name ?? null }) }
      );
      setStatus((prev) => ({
        github_repo: result.github_repo,
        github_index_status: result.github_index_status,
        chunk_count: prev?.chunk_count ?? 0,
      }));
    } catch {}
    setSaving(false);
    setOpen(false);
    setSearch("");
  }

  const filtered = repos.filter(
    (r) =>
      search.trim() === "" ||
      r.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const indexInfo = status?.github_index_status ? STATUS_LABEL[status.github_index_status] : null;

  if (!githubConnected) {
    return (
      <a
        href="/settings"
        className="flex items-center gap-1.5 px-2.5 py-1 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
        title="Connect GitHub to embed your codebase into PRDs"
      >
        <GitBranch size={13} />
        Connect GitHub
      </a>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={openPicker}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-colors ${
          status?.github_repo
            ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            : "border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
        }`}
        title={status?.github_repo ? `Linked: ${status.github_repo}` : "Link a GitHub repo for codebase context"}
      >
        <GitBranch size={13} />
        {status?.github_repo ? (
          <>
            <span className="max-w-[120px] truncate font-medium">{status.github_repo.split("/")[1]}</span>
            {indexInfo && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${indexInfo.color}`}>
                {indexInfo.label}
              </span>
            )}
            {status.github_index_status === "indexing" && (
              <Loader2 size={10} className="animate-spin text-amber-500" />
            )}
            {status.github_index_status === "ready" && (
              <CheckCircle2 size={10} className="text-emerald-500" />
            )}
          </>
        ) : (
          <>Link repo <ChevronDown size={11} /></>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-72 py-2">
          <div className="px-3 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repos..."
                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loadingRepos ? (
              <div className="flex items-center justify-center py-6 gap-2 text-xs text-gray-400">
                <Loader2 size={14} className="animate-spin" /> Loading repos...
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No repos found</p>
            ) : (
              filtered.map((repo) => (
                <button
                  key={repo.full_name}
                  onClick={() => selectRepo(repo)}
                  disabled={saving}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                    status?.github_repo === repo.full_name ? "bg-purple-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-800 truncate">{repo.full_name}</span>
                    {status?.github_repo === repo.full_name && (
                      <CheckCircle2 size={12} className="text-purple-500 flex-shrink-0" />
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{repo.description}</p>
                  )}
                  {repo.language && (
                    <span className="text-[10px] text-gray-400">{repo.language}</span>
                  )}
                </button>
              ))
            )}
          </div>

          {status?.github_repo && (
            <div className="px-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => selectRepo(null)}
                disabled={saving}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={11} /> Unlink repo
              </button>
            </div>
          )}

          {status?.github_index_status === "ready" && (
            <div className="px-3 pt-1">
              <p className="text-[10px] text-gray-400">
                {status.chunk_count} code chunks indexed · PRDs will use semantic search
              </p>
            </div>
          )}
          {status?.github_index_status === "failed" && (
            <div className="px-3 pt-1 flex items-center gap-1 text-[11px] text-red-500">
              <AlertCircle size={11} /> Indexing failed — try relinking the repo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
