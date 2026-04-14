"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, FileText, AlertCircle } from "lucide-react";

interface UploadedFile {
  file: File;
  error?: string;
}

interface UploadZoneProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/markdown": [".md"],
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export default function UploadZone({ files, onChange }: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const remaining = MAX_FILES - files.length;
      const toAdd = accepted.slice(0, remaining).map((file) => {
        if (file.size > MAX_SIZE) {
          return { file, error: `${file.name} exceeds 10MB limit` };
        }
        return { file };
      });
      onChange([...files, ...toAdd]);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES - files.length,
    disabled: files.length >= MAX_FILES,
  });

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-purple-400 bg-purple-50"
            : files.length >= MAX_FILES
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <FileText size={32} className="text-gray-300" />
          {files.length >= MAX_FILES ? (
            <p className="text-sm text-gray-400">Maximum 5 files reached</p>
          ) : isDragActive ? (
            <p className="text-sm text-purple-600 font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <span className="text-[#7F77DD] font-medium">Click to browse</span> or drag &amp; drop
              </p>
              <p className="text-xs text-gray-400">PDF, DOCX, TXT, MD — max 10MB each, up to 5 files</p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                item.error
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {item.error ? (
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              ) : (
                <FileText size={14} className="text-gray-400 flex-shrink-0" />
              )}
              <span className={`flex-1 truncate ${item.error ? "text-red-600" : "text-gray-700"}`}>
                {item.error || item.file.name}
              </span>
              <span className="text-xs text-gray-400">
                {(item.file.size / 1024).toFixed(0)}KB
              </span>
              <button
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
