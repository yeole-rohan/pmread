"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-select a billing period (e.g. passed from the pricing page toggle). Defaults to "monthly". */
  defaultBilling?: "monthly" | "annual";
}

const MONTHLY_PRICE = 1699;
const ANNUAL_PRICE = 16990;
const ANNUAL_PER_MONTH = Math.round(ANNUAL_PRICE / 12); // 2083

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

export default function UpgradeModal({
  open,
  onClose,
  defaultBilling = "monthly",
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "annual">(defaultBilling);

  if (!open) return null;

  async function handleRazorpay() {
    setLoading(true);
    trackEvent("upgrade_clicked", { method: "razorpay", billing });
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

      const options = {
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
          trackEvent("upgrade_completed", { method: "razorpay", billing });
          window.location.href = "/settings?upgraded=true";
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setLoading(false);
    }
  }

  const priceLabel =
    billing === "annual"
      ? `₹${ANNUAL_PER_MONTH.toLocaleString("en-IN")}/mo`
      : `₹${MONTHLY_PRICE.toLocaleString("en-IN")}/mo`;

  const billedLabel =
    billing === "annual"
      ? `Billed ₹${ANNUAL_PRICE.toLocaleString("en-IN")}/year — save 2 months`
      : "Billed monthly · Cancel anytime from Settings";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Upgrade to Pro
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Unlock 15 PRDs/month, Slack ingestion, GitHub context, and PDF export.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-5">
          <button
            onClick={() => setBilling("monthly")}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
              billing === "annual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs text-emerald-600 font-semibold">
              −17%
            </span>
          </button>
        </div>

        {/* Pricing summary */}
        <div className="bg-purple-50 rounded-xl p-5 mb-5">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-2xl font-bold text-gray-900">{priceLabel}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">{billedLabel}</p>

          <ul className="space-y-1.5">
            {[
              "15 PRDs / month",
              "Unlimited uploads & insight extraction",
              "Slack ingestion + Call transcripts",
              "GitHub codebase context",
              "PDF export",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <Check size={14} className="text-[#1D9E75] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleRazorpay}
          disabled={loading}
          className="w-full py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 text-white font-semibold rounded-lg transition-colors text-sm mb-2"
        >
          {loading
            ? "Opening payment..."
            : billing === "annual"
            ? `Pay ₹${ANNUAL_PRICE.toLocaleString("en-IN")}/year →`
            : `Pay ₹${MONTHLY_PRICE.toLocaleString("en-IN")}/month →`}
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>

        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
          All purchases are non-refundable. Cancel before next billing date to
          stop future charges.
        </p>
      </div>
    </div>
  );
}
