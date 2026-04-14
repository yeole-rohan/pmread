"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleRazorpay() {
    setLoading(true);
    trackEvent("upgrade_clicked", { method: "razorpay" });
    try {
      const data = await apiFetch<{
        subscription_id: string;
        key_id: string;
        name: string;
        description: string;
        prefill: { email: string; name: string };
      }>("/billing/razorpay/create-subscription", { method: "POST" });

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
            }),
          });
          trackEvent("upgrade_completed", { method: "razorpay" });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          You&apos;ve used your 2 free PRDs this month.
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Upgrade to Pro to keep generating PRDs and unlock exports.
        </p>

        <div className="bg-purple-50 rounded-xl p-5 mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">₹2,499</span>
            <span className="text-gray-400 text-xs">/month</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Pro Plan</p>
          <ul className="space-y-1.5">
            {[
              "15 PRDs/month",
              "Unlimited uploads & insight extraction",
              "PDF & Markdown export",
              "Unlimited project history",
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
          {loading ? "Opening payment..." : "Upgrade to Pro — ₹2,499/mo"}
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>

        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
          Recurring monthly subscription. Cancel any time from Settings — access
          continues until the end of the paid period.
        </p>
      </div>
    </div>
  );
}

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
