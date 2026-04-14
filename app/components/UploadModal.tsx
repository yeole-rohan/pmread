"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import { apiUpload } from "@/lib/api";

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
      {/* Claude-style spinner ring */}
      <div className="relative w-12 h-12 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-purple-100" />
        <div className="absolute inset-0 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#7F77DD] animate-pulse" />
        </div>
      </div>

      <h2 className="text-base font-semibold text-gray-900 mb-1.5">Extracting insights</h2>
      <p className="text-sm text-gray-500 min-h-[20px]">{EXTRACTION_MESSAGES[msgIdx]}</p>

      <p className="mt-4 text-xs text-gray-400">
        This runs in the background — you can keep working.
      </p>

      <button
        onClick={onDone}
        className="mt-5 px-4 py-2 text-sm text-[#7F77DD] font-medium hover:underline cursor-pointer"
      >
        Got it →
      </button>
    </div>
  );
}

export default function UploadModal({ projectId, open, onClose, onUploaded }: UploadModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const validFiles = files.filter((f) => !f.error);
  const canUpload = validFiles.length > 0 && uploadState === "idle";

  async function handleUpload() {
    if (!canUpload) return;
    setUploadState("uploading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      for (const { file } of validFiles) {
        formData.append("files", file);
      }
      await apiUpload(`/projects/${projectId}/upload`, formData);
      onUploaded(); // triggers parent polling
      setUploadState("extracting");
    } catch (err: unknown) {
      setUploadState("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  }

  function handleClose() {
    if (uploadState === "uploading") return;
    setFiles([]);
    setUploadState("idle");
    setErrorMsg("");
    onClose();
  }

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
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Upload files</h2>
            <p className="text-sm text-gray-500 mb-5">
              Insights are extracted automatically in the background. Always free.
            </p>

            <UploadZone files={files} onChange={setFiles} />

            {uploadState === "error" && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!canUpload}
                className="flex-1 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {uploadState === "uploading" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  `Upload ${validFiles.length > 0 ? `${validFiles.length} file${validFiles.length > 1 ? "s" : ""}` : "files"}`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
