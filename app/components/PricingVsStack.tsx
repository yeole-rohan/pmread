"use client";

import { Check, X, Minus } from "lucide-react";

type Coverage = boolean | "partial";

const NEEDS: { label: string; note?: string; dovetail: Coverage; productboard: Coverage; pmread: Coverage }[] = [
  {
    label: "Extract themes from customer feedback",
    dovetail: true,  productboard: "partial", pmread: true,
    note: "Productboard's AI feedback themes are basic — no transcript or interview depth",
  },
  {
    label: "Analyse call & meeting transcripts",
    dovetail: true,  productboard: false, pmread: true,
  },
  {
    label: "Slack feedback ingestion",
    dovetail: true,  productboard: true,  pmread: true,
  },
  {
    label: "Generate a PRD from evidence",
    dovetail: false, productboard: false, pmread: true,
  },
  {
    label: "Push engineering tasks from PRD to Jira",
    dovetail: false, productboard: false, pmread: true,
    note: "Productboard pushes roadmap items to Jira, not PRD-derived engineering tasks",
  },
  {
    label: "Decision log with evidence trail",
    dovetail: false, productboard: false, pmread: true,
  },
  {
    label: "Version history",
    dovetail: false, productboard: false, pmread: true,
  },
  {
    label: "Acceptance criteria (Given/When/Then)",
    dovetail: false, productboard: false, pmread: true,
  },
];

function Cell({ val }: { val: Coverage }) {
  if (val === true)
    return <Check size={15} className="text-emerald-500 mx-auto" />;
  if (val === "partial")
    return <Minus size={14} className="text-amber-400 mx-auto" />;
  return <X size={14} className="text-gray-300 mx-auto" />;
}

export default function PricingVsStack() {
  return (
    <section className="py-16 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          What you&apos;re replacing
        </h2>
        <p className="text-sm text-gray-500 text-center mb-10">
          Most PMs combine 2–3 tools. PMRead covers the entire loop for less.
        </p>

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-4 font-medium text-gray-500 w-1/2">What you need</th>
                <th className="text-center px-4 py-4 font-medium text-gray-500">
                  Dovetail
                  <span className="block text-xs font-normal text-gray-400 mt-0.5">$29/mo</span>
                </th>
                <th className="text-center px-4 py-4 font-medium text-gray-500">
                  Productboard
                  <span className="block text-xs font-normal text-gray-400 mt-0.5">$20/mo</span>
                </th>
                <th className="text-center px-4 py-4 font-semibold text-gray-900">
                  PMRead Pro
                  <span className="block text-xs font-normal text-[#7F77DD] mt-0.5">~$48/mo</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {NEEDS.map((row, i) => (
                <tr key={row.label} className={`border-t border-gray-50 ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                  <td className="px-5 py-3.5 text-gray-700">
                    {row.label}
                    {row.note && (
                      <span className="block text-[11px] text-gray-400 mt-0.5">{row.note}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center"><Cell val={row.dovetail} /></td>
                  <td className="px-4 py-3.5 text-center"><Cell val={row.productboard} /></td>
                  <td className="px-4 py-3.5 text-center"><Cell val={row.pmread} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td className="px-5 py-3.5 text-sm font-medium text-gray-600">Combined cost</td>
                <td className="px-4 py-3.5 text-center text-sm font-semibold text-gray-500">$29</td>
                <td className="px-4 py-3.5 text-center text-sm font-semibold text-gray-500">$20</td>
                <td className="px-4 py-3.5 text-center text-sm font-semibold text-gray-900">~$48</td>
              </tr>
              <tr className="border-t border-gray-100 bg-white">
                <td className="px-5 py-3 text-xs text-gray-400">
                  Dovetail + Productboard = $49/mo, still missing PRD generation and task push.
                </td>
                <td colSpan={2} className="px-4 py-3 text-center">
                  <span className="text-sm font-bold text-red-400 line-through">$49/mo</span>
                  <span className="text-xs text-gray-400 ml-1.5">incomplete stack</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-bold text-emerald-600">~$48/mo</span>
                  <span className="text-xs text-gray-400 ml-1.5">everything included</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-center gap-5 mt-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-400"><Check size={11} className="text-emerald-500" /> Full support</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400"><Minus size={11} className="text-amber-400" /> Partial</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400"><X size={11} className="text-gray-300" /> Not available</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">USD prices, billed annually. ₹3,999/mo ≈ $48.</span>
        </div>

      </div>
    </section>
  );
}
