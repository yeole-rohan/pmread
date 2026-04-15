"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, Download } from "lucide-react";

interface EngineeringTask {
  title: string;
  description: string;
  estimate: "XS" | "S" | "M" | "L";
}

interface JiraExportPanelProps {
  tasks: EngineeringTask[];
  prdTitle: string;
}

const ESTIMATE_STORY_POINTS: Record<string, number> = {
  XS: 1,
  S: 2,
  M: 5,
  L: 8,
};

function taskToText(task: EngineeringTask): string {
  return `${task.title}\n${task.description}\n[${task.estimate} — ${ESTIMATE_STORY_POINTS[task.estimate]} pts]`;
}

export default function JiraExportPanel({ tasks, prdTitle }: JiraExportPanelProps) {
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [format, setFormat] = useState<"text" | "csv" | "json">("text");

  if (!tasks?.length) return null;

  async function copyTask(idx: number) {
    await navigator.clipboard.writeText(taskToText(tasks[idx]));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  }

  function buildExportContent(): string {
    if (format === "json") {
      return JSON.stringify(
        tasks.map((t) => ({
          summary: t.title,
          description: t.description,
          estimate: t.estimate,
          story_points: ESTIMATE_STORY_POINTS[t.estimate],
          labels: ["pmread"],
          issue_type: "Story",
        })),
        null,
        2
      );
    }
    if (format === "csv") {
      const header = "Summary,Description,Estimate,Story Points,Labels";
      const rows = tasks.map(
        (t) =>
          `"${t.title.replace(/"/g, '""')}","${t.description.replace(/"/g, '""')}",${t.estimate},${ESTIMATE_STORY_POINTS[t.estimate]},pmread`
      );
      return [header, ...rows].join("\n");
    }
    // text
    return tasks
      .map((t, i) => `[${i + 1}] ${taskToText(t)}`)
      .join("\n\n---\n\n");
  }

  async function handleCopyAll() {
    await navigator.clipboard.writeText(buildExportContent());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  function handleDownload() {
    const content = buildExportContent();
    const ext = format === "json" ? "json" : format === "csv" ? "csv" : "txt";
    const mime = format === "json" ? "application/json" : format === "csv" ? "text/csv" : "text/plain";
    const slug = prdTitle.slice(0, 40).replace(/\s+/g, "-").toLowerCase();
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jira-tickets-${slug}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 group text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#7F77DD] uppercase tracking-wider">Jira Tickets</span>
          <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-300 group-hover:text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* Format + export controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {(["text", "csv", "json"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    format === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Download size={11} />
                Download
              </button>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedAll ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy all</>}
              </button>
            </div>
          </div>

          {/* Task list */}
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className="flex gap-3 border border-gray-100 rounded-lg p-3 group">
                <div className="w-5 h-5 rounded-full bg-[#7F77DD]/10 text-[#7F77DD] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {task.estimate} · {ESTIMATE_STORY_POINTS[task.estimate]}pt
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>
                </div>
                <button
                  onClick={() => copyTask(i)}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
                >
                  {copiedIdx === i
                    ? <><Check size={11} className="text-green-500" /><span className="text-green-500">Copied</span></>
                    : <><Copy size={11} /><span>Copy</span></>
                  }
                </button>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Labels &ldquo;pmread&rdquo; + story points pre-filled from estimate size.
          </p>
        </div>
      )}
    </div>
  );
}
