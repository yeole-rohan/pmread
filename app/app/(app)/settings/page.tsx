"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Users, Copy, Trash2 } from "lucide-react";
import { useUser } from "@/lib/useUser";
import { apiFetch, getToken } from "@/lib/api";
import { logout } from "@/lib/auth";
import UpgradeModal from "@/components/UpgradeModal";
import WorkspaceSetupWizard from "@/components/WorkspaceSetupWizard";
import { Workspace, WorkspaceDetail, PRDTemplate, AuditLogEntry } from "@/lib/types";

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
  const [integrations, setIntegrations] = useState<Record<string, { connected: boolean; site?: string }>>({});
  // Workspace state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceDetail | null>(null);
  const [newWsName, setNewWsName] = useState("");
  const [creatingWs, setCreatingWs] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [personalProjects, setPersonalProjects] = useState<{ id: string; name: string }[]>([]);
  const [addingProject, setAddingProject] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [editingWsName, setEditingWsName] = useState(false);
  const [wsNameDraft, setWsNameDraft] = useState("");
  // PRD template state
  const [prdTemplate, setPrdTemplate] = useState<PRDTemplate | null>(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  // Audit log state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);
  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
  const connectUrl = (platform: string) => {
    const tok = getToken();
    return `${apiBase}/integrations/${platform}/connect?token=${tok ?? ""}`;
  };

  const upgraded = searchParams.get("upgraded") === "true";
  const upgradedTo = searchParams.get("to") ?? null; // "pro" | "teams" | null
  const upgradeIntent = searchParams.get("upgrade") === "true";
  const billingParam = (searchParams.get("billing") || "monthly") as "monthly" | "annual";
  const planParam = (searchParams.get("plan") || undefined) as "pro" | "teams" | undefined;
  const githubConnected = searchParams.get("github") === "connected";
  const githubError = searchParams.get("github") === "error";
  const jiraConnected = searchParams.get("jira_connected") === "true";
  const linearConnected = searchParams.get("linear_connected") === "true";
  const azuredevopsConnected = searchParams.get("azuredevops_connected") === "true";

  useEffect(() => {
    if (user) setDisplayName(user.display_name || "");
  }, [user]);

  useEffect(() => {
    apiFetch<Record<string, { connected: boolean; site?: string }>>("/integrations/")
      .then(setIntegrations)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user && ["teams", "studio"].includes(user.plan)) {
      apiFetch<Workspace[]>("/workspaces/")
        .then(setWorkspaces)
        .catch(() => {});
      // Fetch personal (non-workspace) projects so user can move them in
      apiFetch<{ id: string; name: string; workspace_id: string | null }[]>("/projects/")
        .then((all) => setPersonalProjects(all.filter((p) => !p.workspace_id)))
        .catch(() => {});
    }
  }, [user]);

  async function loadWorkspaceDetail(id: string) {
    const detail = await apiFetch<WorkspaceDetail>(`/workspaces/${id}`);
    setActiveWorkspace(detail);
    setPrdTemplate(null);
    setShowAuditLog(false);
    // Refresh personal projects list in case some were just moved in
    apiFetch<{ id: string; name: string; workspace_id: string | null }[]>("/projects/")
      .then((all) => setPersonalProjects(all.filter((p) => !p.workspace_id)))
      .catch(() => {});
    // Only Teams/Studio users have workspaces, so always load the template
    loadPrdTemplate(id);
  }

  async function addProjectToWorkspace(projectId: string) {
    if (!activeWorkspace) return;
    setAddingProject(projectId);
    try {
      await apiFetch(`/workspaces/${activeWorkspace.id}/projects/${projectId}`, { method: "POST" });
      setPersonalProjects((prev) => prev.filter((p) => p.id !== projectId));
    } finally {
      setAddingProject(null);
    }
  }

  async function createWorkspace() {
    if (!newWsName.trim()) return;
    setCreatingWs(true);
    try {
      const ws = await apiFetch<Workspace>("/workspaces/", {
        method: "POST",
        body: JSON.stringify({ name: newWsName.trim() }),
      });
      setWorkspaces((prev) => [...prev, ws]);
      setNewWsName("");
      await loadWorkspaceDetail(ws.id);
    } finally {
      setCreatingWs(false);
    }
  }

  async function inviteMember() {
    if (!inviteEmail.trim() || !activeWorkspace) return;
    setInviting(true);
    try {
      const res = await apiFetch<{ invite_token: string }>(`/workspaces/${activeWorkspace.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const link = `${window.location.origin}/join/${res.invite_token}`;
      setInviteLink(link);
      setInviteEmail("");
      await loadWorkspaceDetail(activeWorkspace.id);
    } finally {
      setInviting(false);
    }
  }

  async function removeMember(memberId: string) {
    if (!activeWorkspace) return;
    await apiFetch(`/workspaces/${activeWorkspace.id}/members/${memberId}`, { method: "DELETE" });
    await loadWorkspaceDetail(activeWorkspace.id);
  }

  async function changeMemberRole(memberId: string, role: "editor" | "viewer") {
    if (!activeWorkspace) return;
    await apiFetch(`/workspaces/${activeWorkspace.id}/members/${memberId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    await loadWorkspaceDetail(activeWorkspace.id);
  }

  async function renameWorkspace(newName: string) {
    if (!activeWorkspace || !newName.trim()) return;
    const updated = await apiFetch<Workspace>(`/workspaces/${activeWorkspace.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: newName.trim() }),
    });
    setWorkspaces((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    await loadWorkspaceDetail(activeWorkspace.id);
  }

  async function resendInvite(email: string) {
    if (!activeWorkspace) return;
    const res = await apiFetch<{ invite_token: string }>(`/workspaces/${activeWorkspace.id}/invite`, {
      method: "POST",
      body: JSON.stringify({ email, role: "editor" }),
    });
    const link = `${window.location.origin}/join/${res.invite_token}`;
    setInviteLink(link);
  }

  async function loadPrdTemplate(workspaceId: string) {
    try {
      const t = await apiFetch<PRDTemplate>(`/workspaces/${workspaceId}/prd-template`);
      setPrdTemplate(t);
    } catch {
      setPrdTemplate({ disabled_sections: [], section_hints: {}, updated_at: null });
    }
  }

  async function savePrdTemplate() {
    if (!activeWorkspace || !prdTemplate) return;
    setSavingTemplate(true);
    try {
      const updated = await apiFetch<PRDTemplate>(`/workspaces/${activeWorkspace.id}/prd-template`, {
        method: "PUT",
        body: JSON.stringify({ disabled_sections: prdTemplate.disabled_sections, section_hints: prdTemplate.section_hints }),
      });
      setPrdTemplate(updated);
    } finally {
      setSavingTemplate(false);
    }
  }

  async function loadAuditLogs() {
    if (!activeWorkspace) return;
    setLoadingAudit(true);
    try {
      const logs = await apiFetch<AuditLogEntry[]>(`/workspaces/${activeWorkspace.id}/audit-logs`);
      setAuditLogs(logs);
      setShowAuditLog(true);
    } finally {
      setLoadingAudit(false);
    }
  }

  function copyInviteLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }

  async function disconnectIntegration(platform: string) {
    setConnectingPlatform(platform);
    try {
      await apiFetch(`/integrations/${platform}`, { method: "DELETE" });
      setIntegrations((prev) => { const next = { ...prev }; delete next[platform]; return next; });
    } finally {
      setConnectingPlatform(null);
    }
  }

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

  // Auto-open workspace setup wizard right after a Teams payment
  useEffect(() => {
    if (upgraded && (upgradedTo === "teams" || user?.plan === "teams")) {
      setShowSetupWizard(true);
    }
  }, [upgraded, upgradedTo, user?.plan]);

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
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

      {upgraded && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-0.5">
            <CheckCircle size={16} />
            {upgradedTo === "teams" || user?.plan === "teams"
              ? "You're now on Teams!"
              : "You've upgraded to Pro!"}
          </div>
          <p className="text-sm text-green-600 ml-6">
            {upgradedTo === "teams" || user?.plan === "teams"
              ? "Create your workspace below to invite teammates. Your existing projects are still here — you can add them to the workspace whenever you're ready."
              : "15 PRDs/month unlocked. All your existing projects and data are unchanged."}
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ── Left column ── */}
        <div className="space-y-4">

      {/* Profile */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
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
      <section className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Plan &amp; Usage</h2>

        {(() => {
          const PRD_LIMITS: Record<string, number> = { free: 2, pro: 15, teams: 60, studio: 999999 };
          const PLAN_LABELS: Record<string, string> = { free: "Free", pro: "Pro", teams: "Teams", studio: "Studio" };
          const PLAN_SUBTITLES: Record<string, string> = {
            free: "2 PRDs/month · unlimited uploads & insights",
            pro: "15 PRDs/month · unlimited uploads & insights",
            teams: "60 PRDs/month · 5 seats · shared workspace",
            studio: "Unlimited PRDs & seats",
          };

          const isPaid = ["pro", "teams", "studio"].includes(user.plan);
          const isCancelling = isPaid && !!user.plan_expires_at;
          const isExpired = user.plan === "free" && !!user.plan_expires_at;
          const expiryDate = user.plan_expires_at
            ? new Date(user.plan_expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : null;

          return (
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {PLAN_LABELS[user.plan] ?? user.plan} Plan
                  {isCancelling && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Cancelling</span>
                  )}
                  {user.plan === "studio" && (
                    <span className="ml-2 text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">✦ Studio</span>
                  )}
                </p>
                {isPaid && !isCancelling && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {PLAN_SUBTITLES[user.plan]}
                    {user.plan_renews_at && (
                      <span className="ml-1.5 text-gray-400">
                        · Renews {new Date(user.plan_renews_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </p>
                )}
                {isCancelling && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    Access continues until {expiryDate}. No further charges.{" "}
                    <span className="text-gray-400">You can resubscribe after that date.</span>
                  </p>
                )}
                {isExpired && <p className="text-xs text-gray-400 mt-0.5">Plan ended on {expiryDate}</p>}
                {user.plan === "free" && !isExpired && (
                  <p className="text-xs text-gray-500 mt-0.5">{PLAN_SUBTITLES.free}</p>
                )}
              </div>

              {/* Free or expired — show upgrade */}
              {(user.plan === "free" || isExpired) && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="flex-shrink-0 px-3 py-1.5 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] transition-colors"
                >
                  {isExpired ? "Resubscribe →" : "Upgrade to Pro — ₹3,999/mo"}
                </button>
              )}

              {/* Paid active + not cancelling — show cancel button */}
              {isPaid && !isCancelling && user.billing_provider === "razorpay" && (
                !confirmCancelRazorpay ? (
                  <button
                    onClick={() => setConfirmCancelRazorpay(true)}
                    className="flex-shrink-0 text-sm text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    Cancel subscription
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
          );
        })()}

        {(() => {
          const PRD_LIMITS: Record<string, number> = { free: 2, pro: 15, teams: 60, studio: 999999 };
          const prdLimit = PRD_LIMITS[user.plan] ?? 2;
          const isUnlimited = user.plan === "studio";
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
                <span className={`text-xs font-semibold ${!isUnlimited && prdsUsed >= prdLimit ? "text-red-500" : "text-gray-600"}`}>
                  {isUnlimited ? `${prdsUsed} (unlimited)` : `${prdsUsed} / ${prdLimit}`}
                </span>
              </div>
              {!isUnlimited && (
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${prdsUsed >= prdLimit ? "bg-red-400" : "bg-[#7F77DD]"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">Resets on {nextReset}</p>
            </>
          );
        })()}
      </section>

      {/* Notifications */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
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

      {/* Team Workspace */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700">Team Workspace</h2>
          {user && !["teams", "studio"].includes(user.plan) && (
            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">Teams+</span>
          )}
        </div>

        {user && !["teams", "studio"].includes(user.plan) ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">
              Invite teammates to share projects, insights, and PRDs in a shared workspace.
            </p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-4 py-2 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] transition-colors"
            >
              Upgrade to Teams to unlock →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Workspace selector / create */}
            {workspaces.length === 0 && !activeWorkspace ? (
              <div>
                <p className="text-sm text-gray-500 mb-3">Create your first workspace to invite teammates.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWsName}
                    onChange={(e) => setNewWsName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createWorkspace()}
                    placeholder="Workspace name (e.g. Acme Product Team)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={createWorkspace}
                    disabled={creatingWs || !newWsName.trim()}
                    className="px-3 py-2 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] disabled:opacity-50 transition-colors"
                  >
                    {creatingWs ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Workspace tabs if multiple */}
                {workspaces.length > 1 && (
                  <div className="flex gap-1 mb-4 overflow-x-auto">
                    {workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => loadWorkspaceDetail(ws.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          activeWorkspace?.id === ws.id
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {ws.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Load first workspace on mount */}
                {!activeWorkspace && workspaces.length > 0 && (() => {
                  loadWorkspaceDetail(workspaces[0].id);
                  return null;
                })()}

                {activeWorkspace && (
                  <div className="space-y-4">
                    {/* Workspace name + rename */}
                    <div className="flex items-center justify-between">
                      {editingWsName ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            autoFocus
                            value={wsNameDraft}
                            onChange={(e) => setWsNameDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { renameWorkspace(wsNameDraft); setEditingWsName(false); }
                              if (e.key === "Escape") setEditingWsName(false);
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button onClick={() => { renameWorkspace(wsNameDraft); setEditingWsName(false); }} className="text-xs text-[#7F77DD] font-medium hover:underline">Save</button>
                          <button onClick={() => setEditingWsName(false)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">{activeWorkspace.my_role === "owner" ? activeWorkspace.name : activeWorkspace.name}</p>
                      )}
                      {activeWorkspace.my_role === "owner" && !editingWsName && (
                        <button
                          onClick={() => { setWsNameDraft(activeWorkspace.name); setEditingWsName(true); }}
                          className="text-xs text-gray-400 hover:text-gray-600 ml-2"
                        >
                          Rename
                        </button>
                      )}
                    </div>

                    {/* Analytics row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Projects", value: activeWorkspace.project_count },
                        { label: "PRDs", value: activeWorkspace.prd_count },
                        { label: "Members", value: activeWorkspace.members.filter((m) => m.accepted).length },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                          <p className="text-lg font-semibold text-gray-900">{value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Members list */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Members ({activeWorkspace.members.filter(m => m.accepted).length})</p>
                      <div className="space-y-2">
                        {activeWorkspace.members.map((m) => (
                          <div key={m.id} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold flex-shrink-0">
                                {(m.display_name || m.email)[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-gray-900 truncate">{m.display_name || m.email}</p>
                                {!m.accepted && (
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-amber-500">Invite pending</p>
                                    {activeWorkspace.my_role === "owner" && (
                                      <button
                                        onClick={() => resendInvite(m.email)}
                                        className="text-xs text-[#7F77DD] hover:underline"
                                      >
                                        Resend
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {m.role === "owner" ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">owner</span>
                              ) : activeWorkspace.my_role === "owner" ? (
                                <select
                                  value={m.role}
                                  onChange={(e) => changeMemberRole(m.id, e.target.value as "editor" | "viewer")}
                                  className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                >
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                              ) : (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === "editor" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                                  {m.role}
                                </span>
                              )}
                              {m.role !== "owner" && activeWorkspace.my_role === "owner" && (
                                <button
                                  onClick={() => removeMember(m.id)}
                                  className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                  title="Remove member"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invite form */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Invite teammate</p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && inviteMember()}
                          placeholder="colleague@company.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value as "editor" | "viewer")}
                          className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={inviteMember}
                          disabled={inviting || !inviteEmail.trim()}
                          className="px-3 py-2 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] disabled:opacity-50 transition-colors"
                        >
                          {inviting ? "..." : "Invite"}
                        </button>
                      </div>

                      {inviteLink && (
                        <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="flex-1 text-xs text-gray-500 truncate">{inviteLink}</p>
                          <button
                            onClick={() => copyInviteLink(inviteLink)}
                            className="flex items-center gap-1 text-xs text-[#7F77DD] font-medium hover:underline flex-shrink-0"
                          >
                            <Copy size={12} />
                            {copiedLink ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Move existing personal projects into workspace */}
                    {personalProjects.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">Add existing projects</p>
                        <p className="text-xs text-gray-400 mb-2">
                          These are your personal projects — add them to share with your team. No data is lost.
                        </p>
                        <div className="space-y-1.5">
                          {personalProjects.map((p) => (
                            <div key={p.id} className="flex items-center justify-between py-1">
                              <span className="text-sm text-gray-700 truncate flex-1">{p.name}</span>
                              <button
                                onClick={() => addProjectToWorkspace(p.id)}
                                disabled={addingProject === p.id}
                                className="ml-3 text-xs text-[#7F77DD] font-medium hover:underline disabled:opacity-50 flex-shrink-0"
                              >
                                {addingProject === p.id ? "Adding..." : "Add →"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PRD Template editor (Teams+ owner only) */}
                    {prdTemplate && activeWorkspace.my_role === "owner" && user && ["teams", "studio"].includes(user.plan) && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">PRD Template</p>
                        <p className="text-xs text-gray-400 mb-3">
                          Disable sections you don&apos;t use and add hints to guide the AI for each section.
                        </p>
                        <div className="space-y-2">
                          {[
                            { key: "quotes", label: "Evidence quotes" },
                            { key: "non_goals", label: "Non-goals" },
                            { key: "user_stories", label: "User stories" },
                            { key: "what_needs_to_change", label: "What needs to change" },
                            { key: "engineering_tasks", label: "Engineering tasks" },
                            { key: "edge_cases", label: "Edge cases" },
                            { key: "analytics_events", label: "Analytics events" },
                            { key: "open_questions", label: "Open questions" },
                          ].map(({ key, label }) => {
                            const disabled = prdTemplate.disabled_sections.includes(key);
                            const hint = prdTemplate.section_hints[key] ?? "";
                            return (
                              <div key={key} className="rounded-lg border border-gray-100 p-2.5 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${disabled ? "line-through text-gray-300" : "text-gray-700"}`}>{label}</span>
                                  <button
                                    onClick={() =>
                                      setPrdTemplate((t) =>
                                        t ? {
                                          ...t,
                                          disabled_sections: disabled
                                            ? t.disabled_sections.filter((s) => s !== key)
                                            : [...t.disabled_sections, key],
                                        } : t
                                      )
                                    }
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                                      disabled
                                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                  >
                                    {disabled ? "Disabled" : "Enabled"}
                                  </button>
                                </div>
                                {!disabled && (
                                  <input
                                    type="text"
                                    value={hint}
                                    onChange={(e) =>
                                      setPrdTemplate((t) =>
                                        t ? { ...t, section_hints: { ...t.section_hints, [key]: e.target.value } } : t
                                      )
                                    }
                                    placeholder={`Hint for ${label} (optional)`}
                                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={savePrdTemplate}
                          disabled={savingTemplate}
                          className="mt-3 w-full px-3 py-2 bg-[#7F77DD] text-white rounded-lg text-sm font-medium hover:bg-[#6b64c4] disabled:opacity-50 transition-colors"
                        >
                          {savingTemplate ? "Saving..." : "Save template"}
                        </button>
                      </div>
                    )}

                    {/* Audit log (Studio only) */}
                    {user?.plan === "studio" && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500">Audit Log</p>
                            <p className="text-xs text-gray-400">Immutable record of workspace actions.</p>
                          </div>
                          <button
                            onClick={loadAuditLogs}
                            disabled={loadingAudit}
                            className="text-xs text-[#7F77DD] font-medium hover:underline disabled:opacity-50"
                          >
                            {loadingAudit ? "Loading..." : showAuditLog ? "Refresh" : "View log"}
                          </button>
                        </div>
                        {showAuditLog && (
                          <div className="space-y-1 max-h-64 overflow-y-auto">
                            {auditLogs.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No actions logged yet.</p>
                            ) : (
                              auditLogs.map((entry) => (
                                <div key={entry.id} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                                  <div className="flex-1 min-w-0">
                                    <span className="text-xs font-medium text-gray-700">{entry.action.replace(/_/g, " ")}</span>
                                    {entry.resource_type && (
                                      <span className="text-xs text-gray-400 ml-1">· {entry.resource_type}</span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400 flex-shrink-0">
                                    {new Date(entry.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

        </div> {/* end left column */}

        {/* ── Right column ── */}
        <div className="space-y-4">

      {/* Integrations */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Integrations</h2>

        {(jiraConnected || linearConnected || azuredevopsConnected) && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4">
            <CheckCircle size={13} />
            {jiraConnected ? "Jira" : linearConnected ? "Linear" : "Azure DevOps"} connected successfully.
          </div>
        )}

        <div className="space-y-4">
          {/* Jira */}
          {(() => {
            const jira = integrations["jira"];
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Jira</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Push PRD engineering tasks as Epics + Stories to your Jira project
                  </p>
                  {jira?.site && <p className="text-xs text-[#7F77DD] mt-0.5">{jira.site}</p>}
                </div>
                {jira?.connected ? (
                  <button
                    onClick={() => disconnectIntegration("jira")}
                    disabled={connectingPlatform === "jira"}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-red-200 hover:text-red-600 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {connectingPlatform === "jira" ? "Disconnecting…" : "Disconnect"}
                  </button>
                ) : (
                  <a
                    href={connectUrl("jira")}
                    className="px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Connect
                  </a>
                )}
              </div>
            );
          })()}

          {/* Linear */}
          {(() => {
            const linear = integrations["linear"];
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Linear</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Push PRD engineering tasks as issues to your Linear workspace
                  </p>
                  {linear?.site && <p className="text-xs text-[#7F77DD] mt-0.5">{linear.site}</p>}
                </div>
                {linear?.connected ? (
                  <button
                    onClick={() => disconnectIntegration("linear")}
                    disabled={connectingPlatform === "linear"}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-red-200 hover:text-red-600 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {connectingPlatform === "linear" ? "Disconnecting…" : "Disconnect"}
                  </button>
                ) : (
                  <a
                    href={connectUrl("linear")}
                    className="px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Connect
                  </a>
                )}
              </div>
            );
          })()}

          {/* Azure DevOps */}
          {(() => {
            const azdo = integrations["azuredevops"];
            const isTeams = user && ["teams", "studio"].includes(user.plan);
            return (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">Azure DevOps</p>
                    {!isTeams && (
                      <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">Teams+</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Push PRD engineering tasks as Epics + Work Items to Azure Boards
                  </p>
                  {azdo?.site && <p className="text-xs text-[#7F77DD] mt-0.5">{azdo.site}</p>}
                </div>
                {azdo?.connected ? (
                  <button
                    onClick={() => disconnectIntegration("azuredevops")}
                    disabled={connectingPlatform === "azuredevops"}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-red-200 hover:text-red-600 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {connectingPlatform === "azuredevops" ? "Disconnecting…" : "Disconnect"}
                  </button>
                ) : isTeams ? (
                  <a
                    href={connectUrl("azuredevops")}
                    className="px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Connect
                  </a>
                ) : (
                  <a
                    href="/settings?upgrade=true"
                    className="px-3 py-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-medium transition-colors"
                  >
                    Upgrade to Teams
                  </a>
                )}
              </div>
            );
          })()}

          {/* GitHub */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">GitHub</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Embed your codebase so PRDs reference real implementation context
              </p>
            </div>
            <span className="px-3 py-1.5 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 cursor-default select-none">
              Coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 border-red-50">
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

        </div> {/* end right column */}
      </div> {/* end grid */}

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} defaultBilling={billingParam} targetPlan={planParam} />
      <WorkspaceSetupWizard
        open={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onWorkspaceCreated={(ws) => {
          setWorkspaces((prev) => [...prev, ws]);
          loadWorkspaceDetail(ws.id);
        }}
      />
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
