"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const MONTHLY_PRICE = 2499;
const ANNUAL_PRICE = 24990; // 10 months = ~2 months free

type FeatureRow = {
  name: string;
  free: boolean | string;
  pro: boolean | string;
};

export const FEATURE_ROWS: FeatureRow[] = [
  { name: "PRDs per month", free: "2", pro: "15" },
  { name: "Insight extraction", free: true, pro: true },
  { name: "Unlimited insights", free: true, pro: true },
  { name: "File uploads (PDF, DOCX, audio, video)", free: true, pro: true },
  { name: "Insights board with starring", free: true, pro: true },
  { name: "Ask tab Q&A over your data", free: true, pro: true },
  { name: "Slack channel ingestion", free: false, pro: true },
  { name: "Call transcript import (Zoom, Fireflies, Gong)", free: false, pro: true },
  { name: "GitHub codebase context", free: false, pro: true },
  { name: "PRD updates with new insights (3× per PRD)", free: false, pro: true },
  { name: "PDF export", free: false, pro: true },
  { name: "Priority support", free: false, pro: true },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-gray-700">{value}</span>;
  }
  return value ? (
    <CheckCircle size={18} className="text-[#1D9E75] mx-auto" />
  ) : (
    <X size={16} className="text-gray-300 mx-auto" />
  );
}

export default function PricingPlans() {
  const [annual, setAnnual] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("pmread_token"));
  }, []);

  /** CTA href for "Upgrade to Pro" — settings for logged-in, signup for guests */
  function upgradeHref(): string {
    const billing = annual ? "annual" : "monthly";
    if (loggedIn) return `/settings?upgrade=true&billing=${billing}`;
    return `/signup?plan=pro&billing=${billing}`;
  }

  const proMonthlyDisplay = annual
    ? Math.round(ANNUAL_PRICE / 12)
    : MONTHLY_PRICE;

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span
          className={`text-sm font-medium ${!annual ? "text-gray-900" : "text-gray-400"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:ring-offset-2 ${
            annual ? "bg-[#7F77DD]" : "bg-gray-200"
          }`}
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${annual ? "text-gray-900" : "text-gray-400"}`}
        >
          Annual
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Save 2 months
          </span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-2">Free</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold text-gray-900">₹0</span>
              <span className="text-gray-400 mb-1.5">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Perfect for getting started.
            </p>
          </div>
          <a
            href={loggedIn ? "/dashboard" : "/signup"}
            className="block w-full text-center py-3 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl text-sm transition-colors mb-8"
          >
            {loggedIn ? "Go to app" : "Get started — it's free"}
          </a>
          <ul className="space-y-3">
            {FEATURE_ROWS.filter((r) => r.free !== false).map((r) => (
              <li
                key={r.name}
                className="flex items-center gap-2.5 text-sm text-gray-600"
              >
                <CheckCircle size={15} className="text-[#1D9E75] flex-shrink-0" />
                {typeof r.free === "string"
                  ? `${r.free} ${r.name.toLowerCase()}`
                  : r.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border-2 border-[#7F77DD] bg-white p-8 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-[#7F77DD] text-white text-xs font-bold px-4 py-1.5 rounded-full">
              Most popular
            </span>
          </div>
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-2">Pro</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold text-gray-900">
                ₹{proMonthlyDisplay.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 mb-1.5">/month</span>
            </div>
            {annual ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-gray-500">
                  Billed ₹{ANNUAL_PRICE.toLocaleString("en-IN")}/year
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  Save ₹{(MONTHLY_PRICE * 12 - ANNUAL_PRICE).toLocaleString("en-IN")}/year
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1">≈ $30 USD · billed monthly</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              For PMs shipping features regularly.
            </p>
          </div>
          <a
            href={upgradeHref()}
            className="block w-full text-center py-3 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors mb-8"
          >
            Upgrade to Pro →
          </a>
          <ul className="space-y-3">
            {FEATURE_ROWS.map((r) => (
              <li
                key={r.name}
                className="flex items-center gap-2.5 text-sm text-gray-600"
              >
                <CheckCircle size={15} className="text-[#1D9E75] flex-shrink-0" />
                {typeof r.pro === "string"
                  ? `${r.pro} ${r.name.toLowerCase()}`
                  : r.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feature comparison table */}
      <div className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
          Full feature comparison
        </h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 font-semibold text-gray-500 w-1/2">
                  Feature
                </th>
                <th className="text-center px-5 py-4 font-semibold text-gray-700">
                  Free
                </th>
                <th className="text-center px-5 py-4 font-semibold text-[#7F77DD]">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {FEATURE_ROWS.map((row) => (
                <tr key={row.name} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 text-gray-700">{row.name}</td>
                  <td className="px-5 py-3.5 text-center">
                    <FeatureCell value={row.free} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <FeatureCell value={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
