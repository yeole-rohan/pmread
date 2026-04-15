"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useUser } from "@/lib/useUser";
import { apiFetch, getToken } from "@/lib/api";
import { logout } from "@/lib/auth";
import UpgradeModal from "@/components/UpgradeModal";

function SettingsContent() {
  const { user, mutate } = useUser();
  const searchParams = useSearchParams();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [cancellingRazorpay, setCancellingRazorpay] = useState(false);
  const [confirmCancelRazorpay, setConfirmCancelRazorpay] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [disconnectingGithub, setDisconnectingGithub] = useState(false);
  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const upgraded = searchParams.get("upgraded") === "true";
  const upgradeIntent = searchParams.get("upgrade") === "true";
  const githubConnected = searchParams.get("github") === "connected";
  const githubError = searchParams.get("github") === "error";

  useEffect(() => {
    if (user) setDisplayName(user.display_name || "");
  }, [user]);

  async function changePassword() {
    if (newPassword !== confirmPassword) { setPasswordError("Passwords don't match"); return; }
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    setPasswordSaving(true);
    setPasswordError("");
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      setPasswordSaved(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      setPasswordError(msg);
    } finally {
      setPasswordSaving(false);
    }
  }

  async function toggleDigest() {
    const next = !user!.digest_enabled;
    await apiFetch("/auth/me", { method: "PATCH", body: JSON.stringify({ digest_enabled: next }) });
    await mutate();
  }

  useEffect(() => {
    if (upgradeIntent) setShowUpgrade(true);
  }, [upgradeIntent]);

  async function saveName() {
    setSaving(true);
    try {
      await apiFetch("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ display_name: displayName }),
      });
      await mutate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function resendVerification() {
    setSendingVerification(true);
    try {
      await apiFetch("/auth/resend-verification", { method: "POST" });
      setVerificationSent(true);
    } finally {
      setSendingVerification(false);
    }
  }

  async function cancelRazorpaySubscription() {
    setCancellingRazorpay(true);
    try {
      await apiFetch("/billing/razorpay/cancel", { method: "POST" });
      setConfirmCancelRazorpay(false);
      await mutate();
    } finally {
      setCancellingRazorpay(false);
    }
  }

  async function disconnectGithub() {
    setDisconnectingGithub(true);
    try {
      await apiFetch("/github/disconnect", { method: "DELETE" });
      await mutate();
    } finally {
      setDisconnectingGithub(false);
    }
  }

  async function deleteAccount() {
    setDeletingAccount(true);
    try {
      await apiFetch("/auth/me", { method: "DELETE" });
      logout();
    } finally {
      setDeletingAccount(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

      {upgraded && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          <CheckCircle size={16} />
          You've upgraded to Pro. 15 PRDs/month unlocked!
        </div>
      )}

      {/* Email verification banner */}
      {!user.email_verified && (
        <div className="mb-6 flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-700">Verify your email address</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Check your inbox for a verification link.
            </p>
          </div>
          {verificationSent ? (
            <span className="text-xs text-green-600 font-medium">Sent!</span>
          ) : (
            <button
              onClick={resendVerification}
              disabled={sendingVerification}
              className="text-xs text-amber-700 font-medium hover:underline flex-shrink-0"
            >
              {sendingVerification ? "Sending..." : "Resend"}
            </button>
          )}
        </div>
      )}

      {/* Profile */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Profile</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Display name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your name"
            />
            <button
              onClick={saveName}
              disabled={saving}
              className="px-3 py-2 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] disabled:opacity-50 transition-colors"
            >
              {saved ? "Saved!" : saving ? "..." : "Save"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">{user.email}</span>
            {user.email_verified ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
            ) : (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Unverified</span>
            )}
          </div>
        </div>

        {/* Password change */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Password</label>
            {passwordSaved && <span className="text-xs text-green-600 font-medium">Changed!</span>}
            <button
              onClick={() => { setShowPasswordForm((v) => !v); setPasswordError(""); }}
              className="text-sm text-[#7F77DD] hover:underline"
            >
              {showPasswordForm ? "Cancel" : "Change →"}
            </button>
          </div>
          {showPasswordForm && (
            <div className="mt-3 space-y-2">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 chars)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
              <button
                onClick={changePassword}
                disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                className="px-3 py-2 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] disabled:opacity-50 transition-colors"
              >
                {passwordSaving ? "Saving..." : "Update password"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Plan */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Plan &amp; Usage</h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900 capitalize">{user.plan} Plan</p>
            {user.plan === "free" && (
              <p className="text-xs text-gray-500 mt-0.5">2 PRDs/month · unlimited uploads & insights</p>
            )}
            {user.plan === "pro" && (
              <p className="text-xs text-gray-500 mt-0.5">15 PRDs/month · unlimited uploads & insights</p>
            )}
          </div>
          {user.plan === "free" && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-3 py-1.5 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] transition-colors"
            >
              Upgrade to Pro — ₹2,499/mo
            </button>
          )}
          {user.plan === "pro" && user.billing_provider === "razorpay" && (
            !confirmCancelRazorpay ? (
              <button
                onClick={() => setConfirmCancelRazorpay(true)}
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                Cancel subscription →
              </button>
            ) : (
              <div className="text-right space-y-1">
                <p className="text-xs text-gray-600">Cancel at end of billing period?</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelRazorpaySubscription}
                    disabled={cancellingRazorpay}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    {cancellingRazorpay ? "Cancelling..." : "Yes, cancel"}
                  </button>
                  <button
                    onClick={() => setConfirmCancelRazorpay(false)}
                    className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Keep
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {(() => {
          const prdLimit = user.plan === "pro" ? 15 : 2;
          const prdsUsed = user.prds_generated_this_month ?? 0;
          const pct = Math.min(100, (prdsUsed / prdLimit) * 100);
          const nextReset = (() => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth() + 1, 1)
              .toLocaleDateString("en-US", { month: "long", day: "numeric" });
          })();
          return (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">PRDs used this month</span>
                <span className={`text-xs font-semibold ${prdsUsed >= prdLimit ? "text-red-500" : "text-gray-600"}`}>
                  {prdsUsed} / {prdLimit}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${prdsUsed >= prdLimit ? "bg-red-400" : "bg-[#7F77DD]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Resets on {nextReset}</p>
            </>
          );
        })()}
      </section>

      {/* Notifications */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-900">Weekly insights digest</p>
            <p className="text-xs text-gray-500 mt-0.5">Monday morning summary of new insights across your projects</p>
          </div>
          <button
            onClick={toggleDigest}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              user.digest_enabled ? "bg-[#7F77DD]" : "bg-gray-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              user.digest_enabled ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Integrations</h2>

        {githubConnected && (
          <div className="mb-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
            <CheckCircle size={13} />
            GitHub connected successfully
          </div>
        )}
        {githubError && (
          <div className="mb-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle size={13} />
            GitHub connection failed. Try again.
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">GitHub</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Embed your codebase so PRDs reference real implementation context
            </p>
          </div>
          {user.github_connected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">Connected</span>
              <button
                onClick={disconnectGithub}
                disabled={disconnectingGithub}
                className="text-xs text-gray-400 hover:text-gray-600 hover:underline cursor-pointer"
              >
                {disconnectingGithub ? "Disconnecting..." : "Disconnect"}
              </button>
            </div>
          ) : (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/github/connect?token=${getToken() ?? ""}`}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Connect GitHub →
            </a>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-4">Danger Zone</h2>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-500 hover:text-red-700 hover:underline"
          >
            Delete account
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Are you sure? Your account will be deactivated and you won&apos;t be able to log in again. This email address cannot be reused.
            </p>
            <div className="flex gap-2">
              <button
                onClick={deleteAccount}
                disabled={deletingAccount}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
