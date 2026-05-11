"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { useUser } from "@/lib/useUser";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-select a billing period. */
  defaultBilling?: "monthly" | "annual";
  /** Override the plan to show — lets a free user jump directly to Teams checkout. */
  targetPlan?: "pro" | "teams";
}

// ── Pro pricing ────────────────────────────────────────────────────────────
const PRO_MONTHLY  = 3999;
const PRO_ANNUAL   = 39990;
const PRO_PER_MONTH = Math.round(PRO_ANNUAL / 12); // 3333

// ── Teams pricing ──────────────────────────────────────────────────────────
const TEAMS_MONTHLY = 4499; // per seat
const TEAMS_ANNUAL  = 3499; // per seat

const CONTACT_EMAIL = "rohan.yeole@rohanyeole.com";

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

// ── Free → Pro ─────────────────────────────────────────────────────────────
function UpgradeToProView({
  defaultBilling,
  onClose,
}: {
  defaultBilling: "monthly" | "annual";
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "annual">(defaultBilling);

  async function handleRazorpay() {
    setLoading(true);
    trackEvent("upgrade_clicked", { method: "razorpay", billing, from: "free", to: "pro" });
    try {
      const data = await apiFetch<{
        subscription_id: string;
        key_id: string;
        name: string;
        description: string;
        billing: string;
        prefill: { email: string; name: string };
      }>("/billing/razorpay/create-subscription", {
        method: "POST",
        body: JSON.stringify({ billing }),
      });

      await loadRazorpayScript();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: data.name,
        description: data.description,
        prefill: data.prefill,
        theme: { color: "#7F77DD" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          await apiFetch("/billing/razorpay/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              billing_period: billing,
            }),
          });
          trackEvent("upgrade_completed", { method: "razorpay", billing, to: "pro" });
          window.location.href = "/settings?upgraded=true&to=pro";
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Upgrade to Pro</h2>
      <p className="text-gray-500 text-sm mb-1">
        Unlock 15 PRDs/month, Slack ingestion, GitHub context, PDF export, Jira &amp; Linear push.
      </p>
      <p className="text-xs text-gray-400 mb-5">
        Need team seats?{" "}
        <a href="/pricing" className="text-[#7F77DD] hover:underline">See Teams &amp; Studio plans →</a>
      </p>

      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-5">
        <button
          onClick={() => setBilling("monthly")}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${billing === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${billing === "annual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Annual <span className="ml-1 text-xs text-emerald-600 font-semibold">−17%</span>
        </button>
      </div>

      <div className="bg-purple-50 rounded-xl p-5 mb-5">
        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-2xl font-bold text-gray-900">
            ₹{(billing === "annual" ? PRO_PER_MONTH : PRO_MONTHLY).toLocaleString("en-IN")}/mo
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {billing === "annual"
            ? `Billed ₹${PRO_ANNUAL.toLocaleString("en-IN")}/year — save 2 months`
            : "Billed monthly · Cancel anytime from Settings"}
        </p>
        <ul className="space-y-1.5">
          {["15 PRDs / month", "Unlimited uploads & insight extraction", "Slack ingestion + Call transcripts", "GitHub codebase context", "PDF export"].map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <Check size={14} className="text-[#1D9E75] flex-shrink-0" />{f}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleRazorpay}
        disabled={loading}
        className="w-full py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 text-white font-semibold rounded-lg transition-colors text-sm mb-2"
      >
        {loading ? "Opening payment..." : billing === "annual"
          ? `Pay ₹${PRO_ANNUAL.toLocaleString("en-IN")}/year →`
          : `Pay ₹${PRO_MONTHLY.toLocaleString("en-IN")}/month →`}
      </button>
      <button onClick={onClose} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
      <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
        All purchases are non-refundable. Cancel before next billing date to stop future charges.
      </p>
    </>
  );
}

// ── Pro → Teams (or Free → Teams direct) ───────────────────────────────────
const TEAMS_BASE_SEATS = 3;
const TEAMS_MONTHLY_TOTAL = TEAMS_MONTHLY * TEAMS_BASE_SEATS;   // 13,497
const TEAMS_ANNUAL_TOTAL  = TEAMS_ANNUAL  * TEAMS_BASE_SEATS * 12; // 1,25,964
const TEAMS_PER_MONTH_ANNUAL = Math.round(TEAMS_ANNUAL_TOTAL / 12); // 10,497

function UpgradeToTeamsView({
  defaultBilling,
  onClose,
}: {
  defaultBilling: "monthly" | "annual";
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "annual">(defaultBilling);

  async function handleRazorpay() {
    setLoading(true);
    trackEvent("upgrade_clicked", { method: "razorpay", billing, from: "any", to: "teams" });
    try {
      const data = await apiFetch<{
        subscription_id: string;
        key_id: string;
        name: string;
        description: string;
        billing: string;
        target_plan: string;
        prefill: { email: string; name: string };
      }>("/billing/razorpay/create-subscription", {
        method: "POST",
        body: JSON.stringify({ billing, plan: "teams" }),
      });

      await loadRazorpayScript();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: data.name,
        description: data.description,
        prefill: data.prefill,
        theme: { color: "#1a1a2e" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          await apiFetch("/billing/razorpay/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          trackEvent("upgrade_completed", { method: "razorpay", billing, to: "teams" });
          window.location.href = "/settings?upgraded=true&to=teams";
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setLoading(false);
    }
  }

  const price = billing === "annual" ? TEAMS_PER_MONTH_ANNUAL : TEAMS_MONTHLY_TOTAL;

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Upgrade to Teams</h2>
      <p className="text-gray-500 text-sm mb-1">
        Shared workspace, unlimited PRDs, Azure DevOps, and role-based access for your team.
      </p>
      <p className="text-xs text-gray-400 mb-5">
        Minimum 3 seats · Need enterprise?{" "}
        <a href="/pricing" className="text-[#7F77DD] hover:underline">See Studio →</a>
      </p>

      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-5">
        <button
          onClick={() => setBilling("monthly")}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${billing === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${billing === "annual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Annual <span className="ml-1 text-xs text-emerald-600 font-semibold">−22%</span>
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 mb-5">
        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-2xl font-bold text-gray-900">
            ₹{price.toLocaleString("en-IN")}/mo
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {billing === "annual"
            ? `Billed ₹${TEAMS_ANNUAL_TOTAL.toLocaleString("en-IN")}/year — 3 seats included`
            : "Billed monthly · 3 seats included · Cancel anytime from Settings"}
        </p>
        <ul className="space-y-1.5">
          {["Unlimited PRDs & projects", "Shared team workspace + roles", "Azure DevOps push", "Risk Register (PMBOK 7-aligned)", "Scope Ledger + change alerts"].map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <Check size={14} className="text-[#1D9E75] flex-shrink-0" />{f}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleRazorpay}
        disabled={loading}
        className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors text-sm mb-2"
      >
        {loading ? "Opening payment..." : billing === "annual"
          ? `Pay ₹${TEAMS_ANNUAL_TOTAL.toLocaleString("en-IN")}/year →`
          : `Pay ₹${TEAMS_MONTHLY_TOTAL.toLocaleString("en-IN")}/month →`}
      </button>
      <button onClick={onClose} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
      <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
        All purchases are non-refundable. Cancel before next billing date to stop future charges.
      </p>
    </>
  );
}

// ── Teams → Studio ─────────────────────────────────────────────────────────
function UpgradeToStudioView({ onClose }: { onClose: () => void }) {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Upgrade to Studio</h2>
      <p className="text-gray-500 text-sm mb-5">
        For IT services firms, regulated fintech, and enterprise PMO teams with compliance requirements.
      </p>

      <div className="bg-amber-50 rounded-xl p-5 mb-5 border border-amber-100">
        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-2xl font-bold text-gray-900">Custom</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Floor ₹75,000/mo · up to 10 seats + ₹6,000/seat beyond</p>
        <ul className="space-y-1.5">
          {[
            "Unlimited seats, PRDs & projects",
            "Everything in Teams",
            "Audit trail (SEBI/RBI compliant)",
            "Schedule Estimator + Critical Path",
            "Dedicated Slack support",
            "Custom onboarding & SLA",
          ].map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <Check size={14} className="text-amber-500 flex-shrink-0" />{f}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`mailto:${CONTACT_EMAIL}?subject=PMRead Studio enquiry`}
        onClick={() => { trackEvent("upgrade_clicked", { from: "teams", to: "studio" }); onClose(); }}
        className="block w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors text-sm text-center mb-2"
      >
        Contact us about Studio →
      </a>
      <button onClick={onClose} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
    </>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────
export default function UpgradeModal({
  open,
  onClose,
  defaultBilling = "monthly",
  targetPlan,
}: UpgradeModalProps) {
  const { user } = useUser();
  const plan = user?.plan ?? "free";

  if (!open) return null;
  if (plan === "studio") return null; // already on top plan

  // Determine which view to show.
  // targetPlan lets a free user jump directly to Teams checkout (e.g. from pricing page).
  const showTeams = plan === "pro" || (plan === "free" && targetPlan === "teams");
  const showStudio = plan === "teams";
  const showPro = !showTeams && !showStudio; // free → pro (default)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
          <X size={18} />
        </button>

        {showPro    && <UpgradeToProView    defaultBilling={defaultBilling} onClose={onClose} />}
        {showTeams  && <UpgradeToTeamsView  defaultBilling={defaultBilling} onClose={onClose} />}
        {showStudio && <UpgradeToStudioView onClose={onClose} />}
      </div>
    </div>
  );
}
