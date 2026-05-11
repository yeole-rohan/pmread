import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Expired — PMRead",
  robots: { index: false },
};

export default function PlanExpiredPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Your plan has ended</h1>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">
          Access to PMRead requires an active plan. Your projects and data are safe — subscribe to pick up where you left off.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-8">
          <span>Pro — ₹3,999/mo</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Teams — ₹4,499/seat/mo</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Studio — Custom</span>
        </div>
        <div className="space-y-3">
          <Link
            href="/settings?upgrade=true"
            className="block w-full py-3 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Resubscribe →
          </Link>
          <Link
            href="/pricing"
            className="block w-full py-3 border border-gray-200 hover:border-gray-300 text-gray-600 font-medium rounded-xl text-sm transition-colors"
          >
            Compare all plans
          </Link>
        </div>
      </div>
    </main>
  );
}
