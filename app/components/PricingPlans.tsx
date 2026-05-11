"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, X, Zap } from "lucide-react";

// ── Prices from phase2-todo.md ─────────────────────────────────────────────
const PRO_MONTHLY  = 3999;
const PRO_ANNUAL   = 39990;  // ₹3,333/mo — 2 months free
const TEAMS_MONTHLY = 4499;  // per seat, min 3
const TEAMS_ANNUAL  = 3499;  // per seat, min 3
// Studio: custom — floor ₹75,000/mo up to 10 seats + ₹6,000/seat/mo

type FeatureRow = {
  name: string;
  pro: boolean | string;
  teams: boolean | string;
  studio: boolean | string;
  section?: string;
};

const FEATURE_ROWS: FeatureRow[] = [
  // Core
  { name: "PRDs per month",                           pro: "15/month",         teams: "Unlimited",       studio: "Unlimited",          section: "Core" },
  { name: "Projects",                                 pro: "Unlimited",        teams: "Unlimited",       studio: "Unlimited" },
  { name: "Unlimited uploads & insights",             pro: true,               teams: true,              studio: true },
  { name: "Insights board (all 4 types)",             pro: true,               teams: true,              studio: true },
  { name: "Ask tab Q&A",                              pro: true,               teams: true,              studio: true },
  { name: "Email-to-project inbox",                   pro: true,               teams: true,              studio: true },

  // Evidence & Ingestion
  { name: "Slack channel ingestion",                  pro: true,               teams: true,              studio: true,                 section: "Evidence & Ingestion" },
  { name: "Call transcript import",                   pro: true,               teams: true,              studio: true },
  { name: "GitHub codebase context",                  pro: true,               teams: true,              studio: true },
  { name: "Stakeholder feedback pipeline",            pro: true,               teams: true,              studio: true },

  // PRD Quality
  { name: "Given/When/Then acceptance criteria",      pro: true,               teams: true,              studio: true,                 section: "PRD Quality" },
  { name: "PRD updates with new insights",            pro: "3× per PRD",       teams: "Unlimited",       studio: "Unlimited" },
  { name: "PRD version history",                      pro: "Full history",     teams: "Full history",    studio: "Full history" },
  { name: "Coverage & validation panel",              pro: true,               teams: true,              studio: true },
  { name: "Decision log",                             pro: "Unlimited",        teams: "Unlimited",       studio: "Unlimited" },
  { name: "Shareable read-only PRD link",             pro: true,               teams: true,              studio: true },

  // Export & Integrations
  { name: "PDF & Markdown export",                    pro: true,               teams: true,              studio: true,                 section: "Export & Integrations" },
  { name: "Jira & Linear push",                       pro: true,               teams: true,              studio: true },
  { name: "Azure DevOps push",                        pro: false,              teams: true,              studio: true },

  // Teams
  { name: "Team workspace + shared projects",         pro: false,              teams: true,              studio: true,                 section: "Teams" },
  { name: "Roles (Owner / Editor / Viewer / Guest)",  pro: false,              teams: true,              studio: true },
  { name: "Org-level PRD templates",                  pro: false,              teams: true,              studio: true },
  { name: "Activity feed",                            pro: false,              teams: true,              studio: true },
  { name: "\"Approved by\" sign-off",                 pro: false,              teams: true,              studio: true },

  // PM Accounting
  { name: "Risk Register (PMBOK 7)",                  pro: false,              teams: true,              studio: true,                 section: "PM Accounting" },
  { name: "Scope Ledger + change alerts",             pro: false,              teams: true,              studio: true },
  { name: "Stakeholder Map + Comms Engine",           pro: false,              teams: true,              studio: true },
  { name: "Schedule Estimator + Critical Path",       pro: false,              teams: false,             studio: true },

  // Enterprise
  { name: "Audit trail (SEBI/RBI compliant)",         pro: false,              teams: false,             studio: true,                 section: "Enterprise" },
  { name: "Unlimited seats, PRDs, projects",          pro: false,              teams: false,             studio: true },
  { name: "Dedicated Slack support channel",          pro: false,              teams: false,             studio: true },
  { name: "Custom onboarding + SLA",                  pro: false,              teams: false,             studio: true },
  { name: "Support",                                  pro: "Priority email",   teams: "Priority",        studio: "Dedicated" },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm font-medium text-gray-700">{value}</span>;
  return value
    ? <CheckCircle size={16} className="text-emerald-500 mx-auto" />
    : <X size={14} className="text-gray-200 mx-auto" />;
}

export default function PricingPlans() {
  const [annual, setAnnual] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [seats, setSeats] = useState(3);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("pmread_token"));
  }, []);

  function upgradeHref(plan: "pro" | "teams") {
    const billing = annual ? "annual" : "monthly";
    if (loggedIn) return `/settings?upgrade=true&billing=${billing}&plan=${plan}`;
    return `/signup?plan=${plan}&billing=${billing}`;
  }

  function fmt(n: number) { return n.toLocaleString("en-IN"); }

  const proDisplay   = annual ? Math.round(PRO_ANNUAL / 12) : PRO_MONTHLY;
  const teamsPerSeat = annual ? TEAMS_ANNUAL : TEAMS_MONTHLY;
  const teamsTotal   = teamsPerSeat * seats;

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!annual ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:ring-offset-2 ${annual ? "bg-[#7F77DD]" : "bg-gray-200"}`}
          role="switch" aria-checked={annual} aria-label="Toggle annual billing"
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${annual ? "translate-x-6" : "translate-x-1"}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-gray-900" : "text-gray-400"}`}>
          Annual
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Save 2 months</span>
        </span>
      </div>

      {/* 3 paid plan cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-4">

        {/* Pro */}
        <div className="rounded-2xl border-2 border-[#7F77DD] bg-white p-6 flex flex-col relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-[#7F77DD] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Most popular</span>
          </div>
          <div className="mb-5 flex-1">
            <p className="text-xs font-bold text-[#7F77DD] uppercase tracking-wider mb-3">Pro</p>
            <div className="flex items-end gap-1 mb-0.5">
              <span className="text-4xl font-bold text-gray-900">₹{fmt(proDisplay)}</span>
              <span className="text-gray-400 mb-1 text-sm">/mo</span>
            </div>
            {annual
              ? <p className="text-xs text-emerald-600 font-medium mb-4">₹{fmt(PRO_ANNUAL)}/year · 2 months free</p>
              : <p className="text-xs text-gray-400 mb-4">per PM · cancel anytime</p>}
            <ul className="space-y-2">
              {["15 PRDs/month", "Unlimited projects", "Slack & GitHub ingestion", "Jira & Linear push", "PDF export", "Full decision log"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <a href={upgradeHref("pro")}
            className="block w-full text-center py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors">
            Get Pro →
          </a>
        </div>

        {/* Teams */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col">
          <div className="mb-5 flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Teams</p>
            <div className="flex items-end gap-1 mb-0.5">
              <span className="text-4xl font-bold text-gray-900">₹{fmt(teamsPerSeat)}</span>
              <span className="text-gray-400 mb-1 text-sm">/seat/mo</span>
            </div>
            {annual
              ? <p className="text-xs text-emerald-600 font-medium mb-2">Annual billing · min 3 seats</p>
              : <p className="text-xs text-gray-400 mb-2">Monthly · min 3 seats</p>}

            {/* Seat picker */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Seats:</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setSeats(s => Math.max(3, s - 1))}
                  className="w-6 h-6 rounded border border-gray-200 text-gray-500 hover:border-gray-400 text-sm font-bold leading-none cursor-pointer">−</button>
                <span className="w-6 text-center text-sm font-semibold text-gray-900">{seats}</span>
                <button onClick={() => setSeats(s => s + 1)}
                  className="w-6 h-6 rounded border border-gray-200 text-gray-500 hover:border-gray-400 text-sm font-bold leading-none cursor-pointer">+</button>
              </div>
              <span className="text-xs font-semibold text-gray-700">= ₹{fmt(teamsTotal)}/mo</span>
            </div>

            <ul className="space-y-2">
              {["Unlimited PRDs", "Shared team workspace", "Roles & permissions", "Risk Register (PMBOK 7)", "Scope Ledger + alerts", "Azure DevOps push"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <a href={upgradeHref("teams")}
            className="block w-full text-center py-2.5 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl text-sm transition-colors">
            Get Teams →
          </a>
        </div>

        {/* Studio */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-amber-50/50 to-white p-6 flex flex-col">
          <div className="mb-5 flex-1">
            <div className="flex items-center gap-1.5 mb-3">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Studio</p>
              <Zap size={11} className="text-amber-500" />
            </div>
            <div className="mb-0.5">
              <span className="text-3xl font-bold text-gray-900">Custom</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Floor ₹75,000/mo · up to 10 seats</p>
            <p className="text-xs text-gray-400 mb-4">+ ₹6,000/seat/mo beyond 10</p>
            <ul className="space-y-2">
              {["Unlimited seats, PRDs, projects", "Everything in Teams", "Schedule Estimator + Critical Path", "Audit trail (SEBI/RBI compliant)", "Dedicated Slack support", "Custom onboarding + SLA"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={13} className="text-amber-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <a href="mailto:rohan.yeole@rohanyeole.com?subject=PMRead Studio enquiry"
            className="block w-full text-center py-2.5 border border-amber-200 hover:border-amber-400 text-amber-700 font-semibold rounded-xl text-sm transition-colors">
            Contact us →
          </a>
        </div>
      </div>

      {/* Free — single strip below the 3 paid plans */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-bold text-gray-700">Free</span>
            <span className="text-sm text-gray-900 font-semibold">₹0</span>
            <span className="text-xs text-gray-400">No credit card required</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {["2 PRDs/month", "1 project", "Unlimited insights", "Insights board", "Ask tab Q&A", "Share PRD links", "Decision log (up to 10)", "Email-to-project inbox"].map(f => (
              <span key={f} className="flex items-center gap-1 text-xs text-gray-500">
                <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />{f}
              </span>
            ))}
          </div>
        </div>
        <a href="/signup" className="flex-shrink-0 px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl text-sm transition-colors text-center">
          Get started free
        </a>
      </div>

      {/* Full comparison table */}
      <div className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Full feature comparison</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 font-semibold text-gray-500 w-2/5">Feature</th>
                <th className="text-center px-4 py-4 font-semibold text-[#7F77DD]">Pro</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-800">Teams</th>
                <th className="text-center px-4 py-4 font-semibold text-amber-600">Studio</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row) => (
                <React.Fragment key={row.name}>
                  {row.section && (
                    <tr>
                      <td colSpan={4} className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50">{row.section}</td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-700">{row.name}</td>
                    <td className="px-4 py-3 text-center"><Cell value={row.pro} /></td>
                    <td className="px-4 py-3 text-center"><Cell value={row.teams} /></td>
                    <td className="px-4 py-3 text-center"><Cell value={row.studio} /></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Free plan: 2 PRDs/month · 1 project · unlimited insights · no credit card needed.{" "}
          <a href="/signup" className="text-[#7F77DD] hover:underline">Start free →</a>
        </p>
      </div>
    </div>
  );
}
