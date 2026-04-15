"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import { apiUpload, apiFetch } from "@/lib/api";

interface UploadedFile {
  file: File;
  error?: string;
}

interface UploadModalProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

type UploadState = "idle" | "uploading" | "extracting" | "error";
type SourceTab = "files" | "slack" | "transcript";

const EXTRACTION_MESSAGES = [
  "Reading your files...",
  "Extracting pain points...",
  "Finding feature requests...",
  "Spotting key decisions...",
  "Logging action items...",
  "Insights will appear shortly...",
];

function ExtractionStatus({ onDone }: { onDone: () => void }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => Math.min(i + 1, EXTRACTION_MESSAGES.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-6">
      <div className="relative w-12 h-12 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-purple-100" />
        <div className="absolute inset-0 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#7F77DD] animate-pulse" />
        </div>
      </div>
      <h2 className="text-base font-semibold text-gray-900 mb-1.5">Extracting insights</h2>
      <p className="text-sm text-gray-500 min-h-[20px]">{EXTRACTION_MESSAGES[msgIdx]}</p>
      <p className="mt-4 text-xs text-gray-400">This runs in the background — you can keep working.</p>
      <button onClick={onDone} className="mt-5 px-4 py-2 text-sm text-[#7F77DD] font-medium hover:underline cursor-pointer">
        Got it →
      </button>
    </div>
  );
}

export default function UploadModal({ projectId, open, onClose, onUploaded }: UploadModalProps) {
  const [sourceTab, setSourceTab] = useState<SourceTab>("files");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Slack state
  const [slackToken, setSlackToken] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [slackLimit, setSlackLimit] = useState("200");

  // Transcript state
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptName, setTranscriptName] = useState("");

  if (!open) return null;

  const validFiles = files.filter((f) => !f.error);

  function handleClose() {
    if (uploadState === "uploading") return;
    setFiles([]);
    setUploadState("idle");
    setErrorMsg("");
    onClose();
  }

  // ── File upload ──────────────────────────────────────────────────────────
  async function handleFileUpload() {
    if (!validFiles.length || uploadState !== "idle") return;
    setUploadState("uploading");
    setErrorMsg("");
    try {
      const formData = new FormData();
      for (const { file } of validFiles) formData.append("files", file);
      await apiUpload(`/projects/${projectId}/upload`, formData);
      onUploaded();
      setUploadState("extracting");
    } catch (err: unknown) {
      setUploadState("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  }

  // ── Slack ingest ─────────────────────────────────────────────────────────
  async function handleSlackIngest() {
    if (!slackToken.trim() || !slackChannel.trim() || uploadState !== "idle") return;
    setUploadState("uploading");
    setErrorMsg("");
    try {
      await apiFetch("/ingest/slack", {
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          bot_token: slackToken.trim(),
          channel: slackChannel.trim(),
          limit: Math.min(parseInt(slackLimit) || 200, 1000),
        }),
      });
      onUploaded();
      setUploadState("extracting");
    } catch (err: unknown) {
      setUploadState("error");
      setErrorMsg(err instanceof Error ? err.message : "Slack import failed.");
    }
  }

  // ── Transcript ingest ────────────────────────────────────────────────────
  async function handleTranscriptIngest() {
    if (!transcriptText.trim() || uploadState !== "idle") return;
    setUploadState("uploading");
    setErrorMsg("");
    try {
      await apiFetch("/ingest/transcript", {
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          transcript: transcriptText.trim(),
          source_name: transcriptName.trim() || "Call transcript",
        }),
      });
      onUploaded();
      setUploadState("extracting");
    } catch (err: unknown) {
      setUploadState("error");
      setErrorMsg(err instanceof Error ? err.message : "Transcript import failed.");
    }
  }

  const SOURCE_TABS: { id: SourceTab; label: string }[] = [
    { id: "files",      label: "Files" },
    { id: "slack",      label: "Slack" },
    { id: "transcript", label: "Transcript" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4">
        <button
          onClick={handleClose}
          disabled={uploadState === "uploading"}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40 cursor-pointer"
        >
          <X size={18} />
        </button>

        {uploadState === "extracting" ? (
          <ExtractionStatus onDone={handleClose} />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add customer data</h2>
            <p className="text-sm text-gray-500 mb-4">Insights are extracted automatically. Always free.</p>

            {/* Source tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-5">
              {SOURCE_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSourceTab(t.id); setErrorMsg(""); }}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    sourceTab === t.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Files */}
            {sourceTab === "files" && (
              <>
                <UploadZone files={files} onChange={setFiles} />
                {uploadState === "error" && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}
                <div className="mt-5 flex gap-2">
                  <button onClick={handleClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">Cancel</button>
                  <button
                    onClick={handleFileUpload}
                    disabled={!validFiles.length || uploadState !== "idle"}
                    className="flex-1 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploadState === "uploading"
                      ? <><Loader2 size={14} className="animate-spin" />Uploading...</>
                      : `Upload ${validFiles.length > 0 ? `${validFiles.length} file${validFiles.length > 1 ? "s" : ""}` : "files"}`
                    }
                  </button>
                </div>
              </>
            )}

            {/* Slack */}
            {sourceTab === "slack" && (
              <>
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Bot token <span className="text-gray-400">(xoxb-...)</span></label>
                    <input
                      type="password"
                      value={slackToken}
                      onChange={(e) => setSlackToken(e.target.value)}
                      placeholder="xoxb-your-slack-bot-token"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Channel</label>
                      <input
                        type="text"
                        value={slackChannel}
                        onChange={(e) => setSlackChannel(e.target.value)}
                        placeholder="#customer-feedback"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Messages</label>
                      <input
                        type="number"
                        value={slackLimit}
                        min={10}
                        max={1000}
                        onChange={(e) => setSlackLimit(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Create a Slack app, add <code className="bg-gray-100 px-1 rounded">channels:history</code> + <code className="bg-gray-100 px-1 rounded">channels:read</code> scopes, invite the bot to the channel.
                  </p>
                </div>
                {uploadState === "error" && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={handleClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">Cancel</button>
                  <button
                    onClick={handleSlackIngest}
                    disabled={!slackToken.trim() || !slackChannel.trim() || uploadState !== "idle"}
                    className="flex-1 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploadState === "uploading"
                      ? <><Loader2 size={14} className="animate-spin" />Importing...</>
                      : "Import from Slack →"
                    }
                  </button>
                </div>
              </>
            )}

            {/* Transcript */}
            {sourceTab === "transcript" && (
              <>
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Source name</label>
                    <input
                      type="text"
                      value={transcriptName}
                      onChange={(e) => setTranscriptName(e.target.value)}
                      placeholder="e.g. Customer call with Acme — April 10"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Transcript <span className="text-gray-400">(paste from Zoom, Fireflies, Gong, Loom…)</span></label>
                    <textarea
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                      placeholder="Paste the full transcript here…"
                      rows={8}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{transcriptText.length.toLocaleString()} chars</p>
                  </div>
                </div>
                {uploadState === "error" && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={handleClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">Cancel</button>
                  <button
                    onClick={handleTranscriptIngest}
                    disabled={transcriptText.trim().length < 100 || uploadState !== "idle"}
                    className="flex-1 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploadState === "uploading"
                      ? <><Loader2 size={14} className="animate-spin" />Importing...</>
                      : "Import transcript →"
                    }
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
