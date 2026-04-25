"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Upload, FileText, RefreshCw, X, Loader2 } from "lucide-react";
import { useUser } from "@/lib/useUser";
import { useProjectData, useEmptyProjectCleanup, invalidateProjectCache } from "@/lib/useProjectData";
import { PLAN_PRD_LIMITS } from "@/lib/constants";
import InsightsBoard from "@/components/InsightsBoard";
import PrdList from "@/components/PrdList";
import AskTab from "@/components/AskTab";
import FilesTab from "@/components/FilesTab";
import SampleProjectView from "@/components/SampleProjectView";
import UploadModal from "@/components/UploadModal";
import GeneratePRDModal from "@/components/GeneratePRDModal";
import UpgradeModal from "@/components/UpgradeModal";
import { trackEvent } from "@/lib/analytics";
import GithubRepoPicker from "@/components/GithubRepoPicker";

type Tab = "insights" | "prds" | "ask" | "files";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user, mutate: mutateUser } = useUser();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [tab, setTab] = useState<Tab>(
    searchParams.get("tab") === "prds" ? "prds" : "insights"
  );
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showGeneratePRD, setShowGeneratePRD] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const {
    insights,
    insightTotal,
    prds,
    loading,
    refreshing,
    extracting,
    refreshInsights,
    startExtracting,
    handleDeleteInsight,
    handleStarInsight,
  } = useProjectData(projectId);

  useEmptyProjectCleanup(projectId, loading, insightTotal, prds.length);

  async function handleUploaded() {
    setShowUpload(false);
    trackEvent("upload_files");
    startExtracting();
    // Invalidate all project caches so files tab, insights, and PRDs refetch fresh data
    invalidateProjectCache(projectId);
  }

  async function handlePRDCreated(analysisId: string) {
    setShowGeneratePRD(false);
    await mutateUser();
    router.push(`/project/${projectId}/analysis/${analysisId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const prdLimit = PLAN_PRD_LIMITS[user?.plan ?? "free"] ?? 2;
  const prdsUsed = user?.prds_generated_this_month ?? 0;
  const allInsights = Object.values(insights).flat();
  const hasStarred = allInsights.some((i) => i.starred);

  // Onboarding: show until all 3 steps done
  const steps = [
    { label: "Upload your first file", done: insightTotal > 0 },
    { label: "Star an insight for your shortlist", done: hasStarred },
    { label: "Generate your first PRD", done: prdsUsed > 0 },
  ];
  const allStepsDone = steps.every((s) => s.done);

  const showUpgradeNudge =
    user?.plan === "free" &&
    insightTotal >= 15 &&
    !nudgeDismissed &&
    prdsUsed < prdLimit;

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">

      {/* Sample project view — shown only when project has no data and is not currently extracting */}
      {insightTotal === 0 && prds.length === 0 && !extracting && (
        <SampleProjectView onUpload={() => setShowUpload(true)} />
      )}

      {/* Onboarding checklist — shown once user has started but not finished all steps */}
      {!allStepsDone && insightTotal > 0 && prdsUsed === 0 && (
        <div className="mb-6 bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-3">
            Get started
          </p>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  step.done
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-white border border-purple-200 text-purple-400"
                }`}>
                  {step.done ? "✓" : i + 1}
                </div>
                <span className={`text-sm ${step.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade nudge at 15+ insights */}
      {showUpgradeNudge && (
        <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              You&apos;ve built strong evidence — {insightTotal} insights across your uploads.
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Upgrade to Pro for 15 PRDs/month and PDF export.
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Upgrade →
            </button>
            <button
              onClick={() => setNudgeDismissed(true)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Extraction in-progress banner */}
      {extracting && (
        <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700">
          <Loader2 size={14} className="animate-spin flex-shrink-0" />
          <span>Extracting insights from your files — this takes about 30 seconds&hellip;</span>
        </div>
      )}

      {/* Tabs + content — hidden while sample view is active */}
      {(insightTotal > 0 || prds.length > 0) && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTab("insights")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  tab === "insights"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Insights
                {insightTotal > 0 && (
                  <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                    {insightTotal}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("prds")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  tab === "prds"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                PRDs
                {prds.length > 0 && (
                  <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                    {prds.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("ask")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  tab === "ask"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Ask
              </button>
              <button
                onClick={() => setTab("files")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  tab === "files"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Files
              </button>
            </div>

            <div className="flex items-center gap-2">
              <GithubRepoPicker
                projectId={projectId}
                githubConnected={!!user?.github_connected}
                isPro={user?.plan === "pro"}
              />
              {tab === "insights" && (
                <>
                  <button
                    onClick={refreshInsights}
                    disabled={refreshing}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                  </button>
                  <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload size={14} />
                    Upload files
                  </button>
                </>
              )}
              {tab === "prds" && (
                <button
                  onClick={() => {
                    if (prdsUsed >= prdLimit) setShowUpgrade(true);
                    else setShowGeneratePRD(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <FileText size={14} />
                  Generate PRD
                </button>
              )}
            </div>
          </div>

          {tab === "insights" && (
            <InsightsBoard
              grouped={insights}
              onDelete={handleDeleteInsight}
              onStar={handleStarInsight}
              highlightId={highlightId}
            />
          )}
          {tab === "prds" && (
            <PrdList projectId={projectId} prds={prds} isPro={user?.plan === "pro"} />
          )}
          {tab === "ask" && (
            <AskTab
              projectId={projectId}
              hasInsights={insightTotal > 0}
              isPro={user?.plan === "pro"}
              githubConnected={!!user?.github_connected}
            />
          )}
          {tab === "files" && (
            <FilesTab projectId={projectId} />
          )}
        </>
      )}

      <UploadModal
        projectId={projectId}
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUploaded}
        isPro={user?.plan === "pro"}
      />
      <GeneratePRDModal
        projectId={projectId}
        open={showGeneratePRD}
        onClose={() => setShowGeneratePRD(false)}
        onCreated={handlePRDCreated}
        onUpgradeNeeded={() => setShowUpgrade(true)}
        grouped={insights}
      />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
