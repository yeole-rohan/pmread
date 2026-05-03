"use client";

import { useState } from "react";
import { X, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface PushModalProps {
  analysisId: string;
  integrations: Record<string, { connected: boolean; site?: string }>;
  onClose: () => void;
}

interface PushResult {
  platform: string;
  epic_url: string | null;
  stories_created: number;
}

export default function PushModal({ analysisId, integrations, onClose }: PushModalProps) {
  const platforms = Object.entries(integrations).filter(([, v]) => v.connected);
  const [selected, setSelected] = useState<string>(platforms[0]?.[0] ?? "");
  const [pushing, setPushing] = useState(false);
  const [result, setResult] = useState<PushResult | null>(null);
  const [error, setError] = useState("");

  async function handlePush() {
    if (!selected) return;
    setPushing(true);
    setError("");
    try {
      const res = await apiFetch<PushResult>(
        `/integrations/${selected}/push/${analysisId}`,
        { method: "POST" }
      );
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Push failed. Please try again.");
    } finally {
      setPushing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Push to project management</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {result ? (
          <div className="text-center py-4">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {result.stories_created} task{result.stories_created !== 1 ? "s" : ""} created in {result.platform === "jira" ? "Jira" : "Linear"}
            </p>
            {result.epic_url && (
              <a
                href={result.epic_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#7F77DD] hover:underline mt-1"
              >
                Open Epic <ExternalLink size={11} />
              </a>
            )}
            <button
              onClick={onClose}
              className="mt-5 w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Creates one Epic from the PRD title and one Story per engineering task. Acceptance criteria are mapped to each story.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Push to</label>
              <div className="space-y-2">
                {platforms.map(([platform, info]) => (
                  <button
                    key={platform}
                    onClick={() => setSelected(platform)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      selected === platform
                        ? "border-[#7F77DD] bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selected === platform ? "bg-[#7F77DD]" : "bg-gray-300"}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{platform}</p>
                      {info.site && <p className="text-xs text-gray-400">{info.site}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              onClick={handlePush}
              disabled={pushing || !selected}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pushing && <Loader2 size={14} className="animate-spin" />}
              {pushing ? "Pushing…" : `Push to ${selected ? (selected === "jira" ? "Jira" : "Linear") : "…"}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
