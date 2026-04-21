"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";

interface TemplateCopyBlockProps {
  content: string;
  filename: string;
}

export default function TemplateCopyBlock({ content, filename }: TemplateCopyBlockProps) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadMd() {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-medium text-gray-700">Template</span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
          >
            {copied ? (
              <><Check size={13} className="text-green-600" /> Copied</>
            ) : (
              <><Copy size={13} /> Copy</>
            )}
          </button>
          <button
            onClick={downloadMd}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <Download size={13} /> Download .md
          </button>
        </div>
      </div>
      <pre className="p-5 text-xs text-gray-700 leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono bg-white">
        {content}
      </pre>
    </div>
  );
}
