"use client";

import { useState } from "react";
import { X, ExternalLink, Loader2, CheckCircle2, Zap } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { APIError } from "@/lib/types";

interface PushModalProps {
  analysisId: string;
  integrations: Record<string, { connected: boolean; site?: string }>;
  onClose: () => void;
  onUpgradeRequired?: () => void;
}

interface PushResult {
  platform: string;
  epic_url: string | null;
  stories_created: number;
}

const PLATFORM_META: Record<string, { label: string; color: string; bg: string; border: string; logo: string }> = {
  jira: {
    label: "Jira",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    logo: "J",
  },
  linear: {
    label: "Linear",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    logo: "L",
  },
  azuredevops: {
    label: "Azure DevOps",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    logo: "Az",
  },
};

export default function PushModal({ analysisId, integrations, onClose, onUpgradeRequired }: PushModalProps) {
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
      if (err instanceof APIError && err.status === 402 && onUpgradeRequired) {
        onClose();
        onUpgradeRequired();
        return;
      }
      setError(err instanceof Error ? err.message : "Push failed. Please try again.");
    } finally {
      setPushing(false);
    }
  }

  const meta = PLATFORM_META[selected] ?? PLATFORM_META["jira"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header band */}
        <div className="bg-gradient-to-r from-[#7F77DD] to-[#a78bfa] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Push to project management</p>
                <p className="text-white/70 text-xs mt-0.5">Creates Epic + tasks from your PRD</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white cursor-pointer transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {result ? (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <p className="text-base font-bold text-gray-900 mb-1">
                {result.stories_created} task{result.stories_created !== 1 ? "s" : ""} created
              </p>
              <p className="text-sm text-gray-400 mb-4">
                in {PLATFORM_META[result.platform]?.label ?? result.platform}
                {result.stories_created === 0 && " — no engineering tasks found in PRD"}
              </p>
              {result.epic_url && (
                <a
                  href={result.epic_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors mb-4"
                >
                  Open Epic <ExternalLink size={11} />
                </a>
              )}
              <button
                onClick={onClose}
                className="block w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-gray-300 cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Platform selector */}
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Push to</p>
              <div className="space-y-2 mb-5">
                {platforms.map(([platform, info]) => {
                  const m = PLATFORM_META[platform] ?? PLATFORM_META["jira"];
                  const active = selected === platform;
                  return (
                    <button
                      key={platform}
                      onClick={() => setSelected(platform)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        active ? `${m.border} ${m.bg}` : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${active ? `${m.bg} ${m.color}` : "bg-gray-100 text-gray-500"}`}>
                        {m.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${active ? m.color : "text-gray-700"}`}>{m.label}</p>
                        {info.site && <p className="text-xs text-gray-400 truncate">{info.site}</p>}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${active ? "border-[#7F77DD]" : "border-gray-300"}`}>
                        {active && <div className="w-2 h-2 rounded-full bg-[#7F77DD]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* What will be created */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5">
                <p className="text-xs font-medium text-gray-500 mb-2">What gets created</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.bg.replace("bg-", "bg-")}`} style={{background: selected === "linear" ? "#7c3aed" : "#2563eb"}} />
                    1 Epic from the PRD title
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    1 Story per engineering task
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handlePush}
                disabled={pushing || !selected}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#7F77DD] to-[#a78bfa] hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {pushing ? (
                  <><Loader2 size={14} className="animate-spin" /> Pushing to {meta.label}…</>
                ) : (
                  <><Zap size={14} /> Push to {meta.label}</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
