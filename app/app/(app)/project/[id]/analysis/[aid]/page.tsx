"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, RefreshCw, Check, Link2, Copy } from "lucide-react";
import Link from "next/link";
import BriefRenderer, { buildMarkdown, useCopy, useDownload } from "@/components/BriefRenderer";
import CoveragePanel from "@/components/CoveragePanel";
import DocWriterPanel from "@/components/DocWriterPanel";
import JiraExportPanel from "@/components/JiraExportPanel";
import PrdTableOfContents from "@/components/PrdTableOfContents";
import StatusRotator from "@/components/StatusRotator";
import UpgradeModal from "@/components/UpgradeModal";
import { useAnalysisStream } from "@/lib/useAnalysisStream";
import { useUser } from "@/lib/useUser";
import { apiFetch, getToken } from "@/lib/api";
import { Analysis } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

const PRD_SECTIONS = [
  "Problem",
  "Proposed Feature",
  "Why It's Worth Building",
  "Goals & Non-Goals",
  "User Stories",
  "What Needs to Change",
  "Engineering Tasks",
  "Edge Cases",
  "Analytics Events",
  "Open Questions",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const analysisId = params.aid as string;
  const { user } = useUser();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const stream = useAnalysisStream(
    analysis?.status === "processing" || analysis?.status === "pending" ? analysisId : null
  );

  useEffect(() => {
    setAnalysis(null);
    setFetchError(false);
    apiFetch<Analysis>(`/analyses/${analysisId}`)
      .then(setAnalysis)
      .catch(() => setFetchError(true));
  }, [analysisId]);

  useEffect(() => {
    if (stream.status === "complete" && stream.brief) {
      setAnalysis((prev) => prev ? { ...prev, status: "complete", brief: stream.brief } : prev);
      trackEvent("prd_complete");
    }
  }, [stream.status, stream.brief]);

  // Hard 404 — redirect
  useEffect(() => {
    if (fetchError) {
      router.replace(`/project/${projectId}`);
    }
  }, [fetchError, projectId, router]);

  async function handleShare() {
    setShareLoading(true);
    try {
      let token = analysis?.share_token;
      if (!token) {
        const res = await apiFetch<{ share_token: string }>(`/analyses/${analysisId}/share`, { method: "POST" });
        token = res.share_token;
        setAnalysis((prev) => prev ? { ...prev, share_token: token } : prev);
      }
      const url = `${window.location.origin}/share/${token}`;
      await navigator.clipboard.writeText(url);
      trackEvent("share_prd");
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {}
    setShareLoading(false);
  }

  const isProcessing = !fetchError && (
    analysis?.status === "pending" ||
    analysis?.status === "processing" ||
    stream.status === "streaming" ||
    stream.status === "connecting"
  );
  const isFailed = analysis?.status === "failed" || stream.status === "error";
  const isComplete = (analysis?.status === "complete" && analysis?.brief) || stream.brief;
  const brief = stream.brief || analysis?.brief;

  // Export hooks — derive text from brief when available
  const allText = brief ? buildMarkdown(brief) : "";
  const { copied: copiedAll, copy: copyAll } = useCopy(allText);
  const token = getToken();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
  const md = useDownload(
    `${apiBase}/export/${analysisId}/markdown${token ? `?token=${token}` : ""}`,
    `prd-${analysisId}.md`
  );
  const pdf = useDownload(
    `${apiBase}/export/${analysisId}/pdf${token ? `?token=${token}` : ""}`,
    `prd-${analysisId}.pdf`
  );
  const exportError = md.error || pdf.error;

  // Loading — analysis not fetched yet
  if (!analysis && !fetchError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis || !user) return null;

  return (
    <div className="min-h-full bg-gray-50 flex">
      {/* Far-left ToC — fixed within the scroll container, only when complete */}
      {isComplete && brief && (
        <aside className="hidden xl:flex flex-col w-52 flex-shrink-0 border-r border-gray-100 bg-white">
          <div className="sticky top-0 h-screen overflow-y-auto py-8 px-4">
            <PrdTableOfContents brief={brief} />
          </div>
        </aside>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0">
      {/* Top nav bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="mx-auto px-6 h-12 flex items-center justify-between">
          <Link
            href={`/project/${projectId}?tab=prds`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to project
          </Link>

          {isComplete && (
            <button
              onClick={handleShare}
              disabled={shareLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {shareCopied
                ? <><Check size={14} className="text-green-500" /> Link copied</>
                : shareLoading
                ? <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                : <><Link2 size={14} /> Share</>
              }
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto px-6 py-8">
        {/* PRD header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[#7F77DD]">PRD</span>
            {isComplete && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                Complete
              </span>
            )}
            {isProcessing && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium animate-pulse">
                Generating...
              </span>
            )}
            {isFailed && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                Failed
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">
            {analysis.question}
          </h1>
          {isComplete && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{formatDate(analysis.created_at)}</p>
              <div className="flex items-center gap-2">
                {user?.plan === "free" ? (
                  <button onClick={() => setShowUpgrade(true)} className="text-xs text-[#7F77DD] hover:underline">
                    🔒 Export on Pro →
                  </button>
                ) : (
                  <>
                    <button
                      onClick={copyAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {copiedAll ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copiedAll ? "Copied!" : "Copy all"}
                    </button>
                    <button
                      onClick={md.download}
                      disabled={md.loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {md.loading ? <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" /> : "↓"}
                      .md
                    </button>
                    <button
                      onClick={pdf.download}
                      disabled={pdf.loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {pdf.loading ? <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" /> : "↓"}
                      PDF
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {exportError && (
            <div className="flex items-center gap-2 mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <span>{exportError}</span>
              <button onClick={() => { md.clearError(); pdf.clearError(); }} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">✕</button>
            </div>
          )}
        </div>

        {/* Processing state */}
        {isProcessing && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="mb-8">
              <StatusRotator currentMessage={stream.statusMessage || undefined} />
            </div>

            <div className="space-y-2.5">
              {PRD_SECTIONS.map((section, i) => {
                const currentIdx = PRD_SECTIONS.findIndex(
                  (s) => stream.statusMessage?.toLowerCase().includes(s.toLowerCase().split(" ")[0])
                );
                const isDone = currentIdx > i;
                const isCurrent = currentIdx === i;
                return (
                  <div key={section} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone
                        ? "bg-emerald-100"
                        : isCurrent
                        ? "bg-purple-100 animate-pulse"
                        : "bg-gray-100"
                    }`}>
                      {isDone ? (
                        <Check size={10} className="text-emerald-600" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-purple-500" : "bg-gray-300"}`} />
                      )}
                    </div>
                    <span className={`text-sm ${isDone ? "text-gray-500 line-through" : isCurrent ? "text-gray-800 font-medium" : "text-gray-300"}`}>
                      {section}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error state */}
        {isFailed && (
          <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">PRD generation failed</p>
                <p className="text-sm text-gray-500 mb-4">
                  {analysis.error_message || stream.error || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={() => router.push(`/project/${projectId}`)}
                  className="inline-flex items-center gap-1.5 text-sm text-[#7F77DD] font-medium hover:underline"
                >
                  <RefreshCw size={13} />
                  Back to project to try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRD content */}
        {isComplete && brief && (
          <div className="space-y-4">
            <CoveragePanel
              analysisId={analysisId}
              cachedValidation={(brief as any).validation ?? null}
            />
            <BriefRenderer brief={brief} />
            <DocWriterPanel
              analysisId={analysisId}
              cachedDocs={brief as unknown as Record<string, string>}
            />
            <JiraExportPanel
              tasks={brief.engineering_tasks ?? []}
              prdTitle={analysis.question}
            />
          </div>
        )}
      </div>
      </div> {/* end main column */}

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
