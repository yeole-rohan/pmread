"use client";

import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ToolResultProps {
  result: string;
  streaming: boolean;
  filename?: string;
}

export default function ToolResult({ result, streaming, filename = "result.md" }: ToolResultProps) {
  const [copied, setCopied] = useState(false);

  if (!result && !streaming) return null;

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadMd() {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-medium text-gray-700">
          {streaming && !result ? "Generating…" : "Result"}
        </span>
        {result && (
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={downloadMd}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <Download size={13} />
              .md
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {streaming && !result && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7F77DD] animate-pulse" />
            Thinking…
          </div>
        )}
        {result && (
          <div className="prose-tool">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold text-gray-900 mt-5 mb-2 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-1.5">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 mb-3 pl-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-gray-700 list-disc leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#7F77DD] pl-3 my-3 text-sm italic text-gray-600">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
