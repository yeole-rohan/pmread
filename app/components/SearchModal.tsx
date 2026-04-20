"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface SearchInsight {
  id: string;
  project_id: string;
  type: string;
  content: string;
  frequency: number;
}

interface SearchProject {
  id: string;
  name: string;
}

interface SearchPRD {
  id: string;
  project_id: string;
  title: string;
}

interface SearchResults {
  projects: SearchProject[];
  insights: SearchInsight[];
  prds: SearchPRD[];
}

const TYPE_COLORS: Record<string, string> = {
  pain_point:      "bg-red-100 text-red-600",
  feature_request: "bg-blue-100 text-blue-600",
  decision:        "bg-amber-100 text-amber-600",
  action_item:     "bg-emerald-100 text-emerald-600",
};

const TYPE_LABELS: Record<string, string> = {
  pain_point:      "Pain",
  feature_request: "Feature",
  decision:        "Decision",
  action_item:     "Action",
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleChange(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setResults(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiFetch<SearchResults>(
          `/search?q=${encodeURIComponent(val.trim())}`
        );
        setResults(data);
      } catch {}
      setLoading(false);
    }, 300);
  }

  function navigate(path: string) {
    router.push(path);
    onClose();
  }

  if (!open) return null;

  const totalCount =
    (results?.projects?.length ?? 0) +
    (results?.insights?.length ?? 0) +
    (results?.prds?.length ?? 0);
  const hasResults = totalCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          {loading
            ? <Loader2 size={16} className="text-gray-400 flex-shrink-0 animate-spin" />
            : <Search size={16} className="text-gray-400 flex-shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search insights, PRDs, projects…"
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults(null); }} className="text-gray-300 hover:text-gray-500 cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length >= 2 && !loading && !hasResults && (
            <p className="px-4 py-8 text-center text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</p>
          )}

          {query.length < 2 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Type at least 2 characters to search</p>
          )}

          {hasResults && (
            <div className="py-2">
              {/* Projects */}
              {results!.projects.length > 0 && (
                <div>
                  <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Projects</p>
                  {results!.projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/project/${p.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded bg-purple-100 text-purple-600 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        P
                      </span>
                      <span className="text-sm text-gray-800">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* PRDs */}
              {results!.prds?.length > 0 && (
                <div>
                  <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">PRDs</p>
                  {results!.prds.map((prd) => (
                    <button
                      key={prd.id}
                      onClick={() => navigate(`/project/${prd.project_id}/analysis/${prd.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        D
                      </span>
                      <span className="text-sm text-gray-800 line-clamp-1">{prd.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Insights */}
              {results!.insights.length > 0 && (
                <div>
                  <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">Insights</p>
                  {results!.insights.map((ins) => (
                    <button
                      key={ins.id}
                      onClick={() => navigate(`/project/${ins.project_id}?tab=insights&highlight=${ins.id}`)}
                      className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <span className={`mt-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[ins.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {TYPE_LABELS[ins.type] ?? ins.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2 leading-snug">{ins.content}</p>
                      </div>
                      {ins.frequency > 1 && (
                        <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{ins.frequency}×</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">⌘K to open · Esc to close</p>
          {hasResults && (
            <p className="text-xs text-gray-400">
              {totalCount} result{totalCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
