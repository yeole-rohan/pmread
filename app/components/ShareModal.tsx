"use client";

import { useState } from "react";
import { X, Copy, Check, Link2, Eye, MessageSquare, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Analysis } from "@/lib/types";

interface ShareModalProps {
  analysis: Analysis;
  onClose: () => void;
  onUpdated: (updated: Partial<Analysis>) => void;
}

type ExpiresIn = "7d" | "30d" | "never";

function formatExpiry(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `Expires in ${days} day${days !== 1 ? "s" : ""}`;
}

export default function ShareModal({ analysis, onClose, onUpdated }: ShareModalProps) {
  const isRevoked = !!analysis.share_revoked_at;
  const hasToken = !!analysis.share_token && !isRevoked;

  const [expiresIn, setExpiresIn] = useState<ExpiresIn>("never");
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = hasToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${analysis.share_token}`
    : null;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await apiFetch<{ share_token: string }>(
        `/analyses/${analysis.id}/share`,
        { method: "POST", body: JSON.stringify({ expires_in: expiresIn }) }
      );
      onUpdated({
        share_token: res.share_token,
        share_revoked_at: null,
        share_expires_at: expiresIn === "never" ? null
          : new Date(Date.now() + (expiresIn === "7d" ? 7 : 30) * 86400000).toISOString(),
      });
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke() {
    setRevoking(true);
    try {
      await apiFetch(`/analyses/${analysis.id}/share`, { method: "DELETE" });
      onUpdated({ share_revoked_at: new Date().toISOString() });
    } finally {
      setRevoking(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-[#7F77DD]" />
            <h2 className="text-base font-semibold text-gray-900">Share PRD</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        {(analysis.share_view_count || analysis.share_feedback_count) ? (
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            {(analysis.share_view_count ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={12} /> {analysis.share_view_count} view{analysis.share_view_count !== 1 ? "s" : ""}
              </span>
            )}
            {(analysis.share_feedback_count ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare size={12} /> {analysis.share_feedback_count} feedback
              </span>
            )}
          </div>
        ) : null}

        {hasToken && shareUrl ? (
          <>
            {/* Active link */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3">
              <p className="flex-1 text-xs text-gray-600 truncate font-mono">{shareUrl}</p>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>

            {analysis.share_expires_at && (
              <p className="text-xs text-amber-600 mb-3">{formatExpiry(analysis.share_expires_at)}</p>
            )}

            <button
              onClick={handleRevoke}
              disabled={revoking}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={12} />
              {revoking ? "Revoking…" : "Revoke link"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {isRevoked ? "This link has been revoked. Generate a new one to share again." : "Generate a read-only link to share this PRD. Stakeholders can leave feedback without an account."}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Link expiry</label>
              <div className="flex gap-2">
                {(["7d", "30d", "never"] as ExpiresIn[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setExpiresIn(opt)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                      expiresIn === opt
                        ? "bg-[#7F77DD] text-white border-[#7F77DD]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {opt === "7d" ? "7 days" : opt === "30d" ? "30 days" : "No expiry"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {generating ? "Generating…" : "Generate link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
