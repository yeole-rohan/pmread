"use client";

import { useState, useEffect, useCallback } from "react";
import { X, AlertCircle, Loader2, Lock, Plus, Trash2, CheckCircle2, RefreshCw } from "lucide-react";
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
  isPro?: boolean;
}

type UploadState = "idle" | "uploading" | "extracting" | "error";
type SourceTab = "files" | "slack" | "transcript";
type ChannelStatus = "idle" | "fetching" | "done" | "error";

interface SlackChannelRow {
  id: string;
  channel_name: string;
  message_count: number | null;
  last_fetched_at: string | null;
  status: ChannelStatus;
  error?: string;
}

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

export default function UploadModal({ projectId, open, onClose, onUploaded, isPro = false }: UploadModalProps) {
  const [sourceTab, setSourceTab] = useState<SourceTab>("files");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Slack state
  const [slackLoading, setSlackLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [changingToken, setChangingToken] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenSaving, setTokenSaving] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [channels, setChannels] = useState<SlackChannelRow[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const [addingChannel, setAddingChannel] = useState(false);
  const [addError, setAddError] = useState("");

  // Transcript state
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptName, setTranscriptName] = useState("");

  const loadSlackConfig = useCallback(async () => {
    if (!isPro) return;
    setSlackLoading(true);
    try {
      const data = await apiFetch<{ has_token: boolean; channels: Omit<SlackChannelRow, "status" | "error">[] }>(
        `/projects/${projectId}/slack/channels`
      );
      setHasToken(data.has_token);
      setChannels(data.channels.map((c) => ({ ...c, status: "idle" as ChannelStatus })));
    } catch {
      // silently fail — user sees empty state
    } finally {
      setSlackLoading(false);
    }
  }, [projectId, isPro]);

  // Load Slack config when Slack tab opens
  useEffect(() => {
    if (open && isPro && sourceTab === "slack") {
      loadSlackConfig();
    }
  }, [open, isPro, sourceTab, loadSlackConfig]);

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

  // ── Slack: save token ────────────────────────────────────────────────────
  async function handleSaveToken() {
    const t = tokenInput.trim();
    if (!t) return;
    setTokenSaving(true);
    setTokenError("");
    try {
      await apiFetch(`/projects/${projectId}/slack/token`, {
        method: "PUT",
        body: JSON.stringify({ token: t }),
      });
      setHasToken(true);
      setChangingToken(false);
      setTokenInput("");
    } catch (err: unknown) {
      setTokenError(err instanceof Error ? err.message : "Failed to save token.");
    } finally {
      setTokenSaving(false);
    }
  }

  // ── Slack: add channel ───────────────────────────────────────────────────
  async function handleAddChannel() {
    const name = newChannel.trim().replace(/^#/, "");
    if (!name) return;
    setAddingChannel(true);
    setAddError("");
    try {
      const ch = await apiFetch<Omit<SlackChannelRow, "status" | "error">>(
        `/projects/${projectId}/slack/channels`,
        { method: "POST", body: JSON.stringify({ channel_name: name }) }
      );
      setChannels((prev) => [...prev, { ...ch, status: "idle" }]);
      setNewChannel("");
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Could not add channel.");
    } finally {
      setAddingChannel(false);
    }
  }

  // ── Slack: remove channel ────────────────────────────────────────────────
  async function handleRemoveChannel(channelName: string) {
    try {
      await apiFetch(`/projects/${projectId}/slack/channels/${channelName}`, { method: "DELETE" });
      setChannels((prev) => prev.filter((c) => c.channel_name !== channelName));
    } catch {
      // ignore — channel stays in list
    }
  }

  // ── Slack: fetch channel messages ────────────────────────────────────────
  async function handleFetchChannel(channelName: string) {
    setChannels((prev) =>
      prev.map((c) => c.channel_name === channelName ? { ...c, status: "fetching", error: undefined } : c)
    );
    try {
      const updated = await apiFetch<Omit<SlackChannelRow, "status" | "error">>(
        `/projects/${projectId}/slack/channels/${channelName}/fetch`,
        { method: "POST" }
      );
      onUploaded();
      setChannels((prev) =>
        prev.map((c) => c.channel_name === channelName ? { ...updated, status: "done" } : c)
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed.";
      setChannels((prev) =>
        prev.map((c) => c.channel_name === channelName ? { ...c, status: "error", error: msg } : c)
      );
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
      setUploadState("idle");
      setErrorMsg(err instanceof Error ? err.message : "Transcript import failed.");
    }
  }

  const SOURCE_TABS: { id: SourceTab; label: string; proOnly: boolean }[] = [
    { id: "files",      label: "Files",       proOnly: false },
    { id: "slack",      label: "Slack",       proOnly: true },
    { id: "transcript", label: "Transcript",  proOnly: true },
  ];

  const anyFetching = channels.some((c) => c.status === "fetching");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
              {SOURCE_TABS.map((t) => {
                const locked = t.proOnly && !isPro;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setSourceTab(t.id); setErrorMsg(""); }}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      sourceTab === t.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {locked && <Lock size={11} className="text-gray-400" />}
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* ── Files ── */}
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

            {/* ── Slack upsell ── */}
            {sourceTab === "slack" && !isPro && (
              <div className="py-8 text-center">
                <Lock size={24} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-semibold text-gray-800 mb-1">Slack ingestion is a Pro feature</p>
                <p className="text-xs text-gray-500 mb-4">Upgrade to import messages from any Slack channel directly.</p>
                <a href="/settings?upgrade=1" className="inline-block px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors">
                  Upgrade to Pro →
                </a>
              </div>
            )}

            {/* ── Slack Pro ── */}
            {sourceTab === "slack" && isPro && (
              <div className="space-y-5">

                {slackLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={18} className="animate-spin text-gray-300" />
                  </div>
                ) : (
                  <>
                    {/* Bot token */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Bot token</label>

                      {hasToken && !changingToken ? (
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                          <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                          <span className="flex-1 text-sm text-gray-500 font-mono tracking-widest">xoxb-••••••••••••</span>
                          <button
                            onClick={() => { setChangingToken(true); setTokenInput(""); setTokenError(""); }}
                            className="text-xs text-[#7F77DD] hover:underline cursor-pointer flex-shrink-0"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tokenInput}
                              onChange={(e) => setTokenInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleSaveToken(); }}
                              placeholder="xoxb-your-slack-bot-token"
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40 font-mono"
                            />
                            <button
                              onClick={handleSaveToken}
                              disabled={!tokenInput.trim() || tokenSaving}
                              className="flex-shrink-0 px-3 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              {tokenSaving ? <Loader2 size={13} className="animate-spin" /> : null}
                              Save
                            </button>
                            {changingToken && (
                              <button
                                onClick={() => { setChangingToken(false); setTokenInput(""); setTokenError(""); }}
                                className="flex-shrink-0 px-2.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          {tokenError && <p className="text-xs text-red-500">{tokenError}</p>}
                        </div>
                      )}
                    </div>

                    {/* Channel list */}
                    {channels.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Channels</p>
                        <div className="space-y-1.5">
                          {channels.map((ch) => (
                            <div key={ch.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                              <span className="flex-1 text-sm text-gray-800 font-mono truncate">#{ch.channel_name}</span>

                              {/* Message count — read-only */}
                              <span className="text-xs text-gray-400 flex-shrink-0 min-w-[48px] text-right">
                                {ch.status === "done" || ch.message_count != null
                                  ? `${ch.message_count} msgs`
                                  : "—"}
                              </span>

                              {ch.status === "error" && (
                                <span className="text-xs text-red-500 flex-shrink-0 max-w-[110px] truncate" title={ch.error}>
                                  {ch.error}
                                </span>
                              )}

                              <button
                                onClick={() => handleFetchChannel(ch.channel_name)}
                                disabled={!hasToken || ch.status === "fetching"}
                                className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                                title={!hasToken ? "Save a bot token first" : undefined}
                              >
                                {ch.status === "fetching" ? (
                                  <><Loader2 size={11} className="animate-spin" />Fetching…</>
                                ) : ch.message_count != null ? (
                                  <><RefreshCw size={11} />Re-fetch</>
                                ) : (
                                  "Fetch"
                                )}
                              </button>

                              <button
                                onClick={() => handleRemoveChannel(ch.channel_name)}
                                disabled={ch.status === "fetching"}
                                className="flex-shrink-0 text-gray-300 hover:text-red-400 disabled:opacity-40 transition-colors cursor-pointer"
                                title="Remove channel"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add channel */}
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1.5">Add channel</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newChannel}
                          onChange={(e) => { setNewChannel(e.target.value); setAddError(""); }}
                          onKeyDown={(e) => { if (e.key === "Enter") handleAddChannel(); }}
                          placeholder="#customer-feedback"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40"
                        />
                        <button
                          onClick={handleAddChannel}
                          disabled={!newChannel.trim() || addingChannel}
                          className="flex-shrink-0 px-3 py-2 border border-dashed border-gray-300 hover:border-[#7F77DD] hover:text-[#7F77DD] disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 rounded-lg text-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {addingChannel ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
                          Add
                        </button>
                      </div>
                      {addError && <p className="mt-1 text-xs text-red-500">{addError}</p>}
                    </div>

                    {/* Policy note */}
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Bot token is stored securely — never exposed after saving. Required Slack app scopes:{" "}
                      <code className="bg-gray-100 px-1 rounded">channels:history</code>{" "}
                      <code className="bg-gray-100 px-1 rounded">channels:read</code>{" "}
                      <code className="bg-gray-100 px-1 rounded">groups:read</code>{" "}
                      — invite the bot to each channel before fetching.
                    </p>

                    {anyFetching && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                        <Loader2 size={12} className="animate-spin" />
                        Importing — you can close this modal, insights will appear shortly.
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button onClick={handleClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Transcript upsell ── */}
            {sourceTab === "transcript" && !isPro && (
              <div className="py-8 text-center">
                <Lock size={24} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-semibold text-gray-800 mb-1">Transcript ingestion is a Pro feature</p>
                <p className="text-xs text-gray-500 mb-4">Upgrade to import Zoom, Fireflies, and Gong transcripts.</p>
                <a href="/settings?upgrade=1" className="inline-block px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors">
                  Upgrade to Pro →
                </a>
              </div>
            )}

            {/* ── Transcript Pro ── */}
            {sourceTab === "transcript" && isPro && (
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
                {errorMsg && (
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
