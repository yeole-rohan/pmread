"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUpDown } from "lucide-react";

type Feature = {
  id: number;
  name: string;
  reach: string;
  impact: string;
  confidence: string;
  effort: string;
};

type RankedFeature = Feature & { rice: number };

const IMPACT_OPTIONS = [
  { label: "Massive (3×)", value: "3" },
  { label: "High (2×)", value: "2" },
  { label: "Medium (1×)", value: "1" },
  { label: "Low (0.5×)", value: "0.5" },
  { label: "Minimal (0.25×)", value: "0.25" },
];

let nextId = 4;

const DEFAULT_FEATURES: Feature[] = [
  { id: 1, name: "Slack integration", reach: "500", impact: "2", confidence: "80", effort: "2" },
  { id: 2, name: "PDF export", reach: "300", impact: "1", confidence: "90", effort: "0.5" },
  { id: 3, name: "AI theme grouping", reach: "800", impact: "3", confidence: "60", effort: "5" },
];

function riceScore(f: Feature): number {
  const r = parseFloat(f.reach) || 0;
  const i = parseFloat(f.impact) || 0;
  const c = parseFloat(f.confidence) || 0;
  const e = parseFloat(f.effort) || 1;
  return Math.round((r * i * (c / 100)) / e);
}

export default function FeaturePrioritizationTool() {
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);
  const [ranked, setRanked] = useState<RankedFeature[] | null>(null);

  function update(id: number, field: keyof Feature, value: string) {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
    setRanked(null);
  }

  function addRow() {
    setFeatures((prev) => [
      ...prev,
      { id: nextId++, name: "", reach: "", impact: "1", confidence: "80", effort: "1" },
    ]);
    setRanked(null);
  }

  function removeRow(id: number) {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    setRanked(null);
  }

  function calculate() {
    const results = features
      .filter((f) => f.name.trim())
      .map((f) => ({ ...f, rice: riceScore(f) }))
      .sort((a, b) => b.rice - a.rice);
    setRanked(results);
  }

  function copyResults() {
    if (!ranked) return;
    const header = "Rank | Feature | Reach | Impact | Confidence | Effort | RICE Score\n" +
                   "-----|---------|-------|--------|------------|--------|----------";
    const rows = ranked
      .map((f, i) =>
        `${i + 1} | ${f.name} | ${f.reach} | ${f.impact}× | ${f.confidence}% | ${f.effort} | **${f.rice}**`
      )
      .join("\n");
    navigator.clipboard.writeText(header + "\n" + rows);
  }

  const maxRice = ranked ? Math.max(...ranked.map((f) => f.rice)) : 0;

  return (
    <div className="max-w-full">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-3 py-3 font-semibold text-gray-600 min-w-[160px]">Feature</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-600 min-w-[90px]">
                <span title="Users reached per quarter">Reach</span>
              </th>
              <th className="text-center px-3 py-3 font-semibold text-gray-600 min-w-[130px]">Impact</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-600 min-w-[110px]">
                <span title="How confident are you? 0-100%">Confidence %</span>
              </th>
              <th className="text-center px-3 py-3 font-semibold text-gray-600 min-w-[90px]">
                <span title="Person-months to build">Effort</span>
              </th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {features.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50/50">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => update(f.id, "name", e.target.value)}
                    placeholder="Feature name"
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#7F77DD] rounded px-1 py-0.5 text-sm placeholder:text-gray-300"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={f.reach}
                    onChange={(e) => update(f.id, "reach", e.target.value)}
                    placeholder="500"
                    min="0"
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#7F77DD] rounded px-1 py-0.5 text-sm text-center placeholder:text-gray-300"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={f.impact}
                    onChange={(e) => update(f.id, "impact", e.target.value)}
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#7F77DD] rounded px-1 py-0.5 text-sm text-center"
                  >
                    {IMPACT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={f.confidence}
                    onChange={(e) => update(f.id, "confidence", e.target.value)}
                    placeholder="80"
                    min="0"
                    max="100"
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#7F77DD] rounded px-1 py-0.5 text-sm text-center placeholder:text-gray-300"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={f.effort}
                    onChange={(e) => update(f.id, "effort", e.target.value)}
                    placeholder="1"
                    min="0.1"
                    step="0.5"
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#7F77DD] rounded px-1 py-0.5 text-sm text-center placeholder:text-gray-300"
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => removeRow(f.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="Remove row"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Plus size={14} />
          Add feature
        </button>
        <p className="text-xs text-gray-400">
          RICE = (Reach × Impact × Confidence%) ÷ Effort
        </p>
      </div>

      <button
        onClick={calculate}
        disabled={features.filter((f) => f.name.trim()).length === 0}
        className="w-full mt-4 py-3 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        <ArrowUpDown size={15} />
        Calculate & Rank
      </button>

      {/* Results */}
      {ranked && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Ranked by RICE score</span>
            <button
              onClick={copyResults}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Copy table
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {ranked.map((f, i) => (
              <div key={f.id} className="px-5 py-3.5 flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{f.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {f.reach} reach · {f.impact}× impact · {f.confidence}% confidence · {f.effort} effort
                  </p>
                  {/* Score bar */}
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#7F77DD] transition-all"
                      style={{ width: `${maxRice > 0 ? (f.rice / maxRice) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold text-[#7F77DD] shrink-0">{f.rice}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
