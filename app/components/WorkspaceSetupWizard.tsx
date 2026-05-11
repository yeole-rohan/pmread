"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Copy, Check, Users, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Workspace } from "@/lib/types";

interface WorkspaceSetupWizardProps {
  open: boolean;
  onClose: () => void;
  onWorkspaceCreated?: (ws: Workspace) => void;
}

type Step = "name" | "invite" | "done";

interface InviteSent {
  email: string;
  link: string;
  copied: boolean;
}

export default function WorkspaceSetupWizard({
  open,
  onClose,
  onWorkspaceCreated,
}: WorkspaceSetupWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [wsName, setWsName] = useState("");
  const [creating, setCreating] = useState(false);
  const [wsError, setWsError] = useState("");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [invitesSent, setInvitesSent] = useState<InviteSent[]>([]);

  if (!open) return null;

  async function createWorkspace() {
    if (!wsName.trim()) return;
    setCreating(true);
    setWsError("");
    try {
      const ws = await apiFetch<Workspace>("/workspaces/", {
        method: "POST",
        body: JSON.stringify({ name: wsName.trim() }),
      });
      setWorkspace(ws);
      onWorkspaceCreated?.(ws);
      setStep("invite");
    } catch (e: unknown) {
      setWsError(e instanceof Error ? e.message : "Failed to create workspace");
    } finally {
      setCreating(false);
    }
  }

  async function inviteMember() {
    if (!inviteEmail.trim() || !workspace) return;
    setInviting(true);
    setInviteError("");
    try {
      const res = await apiFetch<{ invite_token: string }>(`/workspaces/${workspace.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const link = `${window.location.origin}/join/${res.invite_token}`;
      setInvitesSent((prev) => [...prev, { email: inviteEmail.trim(), link, copied: false }]);
      setInviteEmail("");
    } catch (e: unknown) {
      setInviteError(e instanceof Error ? e.message : "Failed to send invite");
    } finally {
      setInviting(false);
    }
  }

  function copyLink(idx: number) {
    navigator.clipboard.writeText(invitesSent[idx].link);
    setInvitesSent((prev) =>
      prev.map((i, n) => (n === idx ? { ...i, copied: true } : i))
    );
    setTimeout(() => {
      setInvitesSent((prev) =>
        prev.map((i, n) => (n === idx ? { ...i, copied: false } : i))
      );
    }, 2000);
  }

  function handleDone() {
    router.replace("/settings");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-[#7F77DD] transition-all duration-500"
            style={{ width: step === "name" ? "33%" : step === "invite" ? "66%" : "100%" }}
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {/* ── Step 1: Name ── */}
          {step === "name" && (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 mb-5">
                <Users size={22} className="text-[#7F77DD]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Welcome to Teams!
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Let&apos;s create your team workspace. You can invite colleagues right after.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Workspace name
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createWorkspace()}
                    placeholder="e.g. Acme Product Team"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {wsError && (
                    <p className="text-xs text-red-600 mt-1">{wsError}</p>
                  )}
                </div>

                <button
                  onClick={createWorkspace}
                  disabled={creating || !wsName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {creating ? "Creating..." : <>Create workspace <ArrowRight size={15} /></>}
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600"
              >
                I&apos;ll do this later
              </button>
            </>
          )}

          {/* ── Step 2: Invite ── */}
          {step === "invite" && workspace && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {workspace.name}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Invite your teammates
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Send invite links to up to 2 more people now — you can always add more from Settings.
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    autoFocus
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
                    className="px-3 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {inviting ? "..." : "Invite"}
                  </button>
                </div>
                {inviteError && (
                  <p className="text-xs text-red-600">{inviteError}</p>
                )}
              </div>

              {/* Sent invites */}
              {invitesSent.length > 0 && (
                <div className="space-y-2 mb-5">
                  {invitesSent.map((inv, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-emerald-600" />
                      </div>
                      <span className="flex-1 text-xs text-gray-600 truncate">{inv.email}</span>
                      <button
                        onClick={() => copyLink(i)}
                        className="flex items-center gap-1 text-xs text-[#7F77DD] font-medium hover:underline flex-shrink-0"
                      >
                        {inv.copied ? (
                          <><Check size={11} className="text-green-500" />Copied!</>
                        ) : (
                          <><Copy size={11} />Copy link</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep("done")}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-lg transition-colors text-sm"
              >
                {invitesSent.length > 0 ? "Done, let's go" : "Skip for now"} <ArrowRight size={15} />
              </button>
            </>
          )}

          {/* ── Step 3: Done ── */}
          {step === "done" && workspace && (
            <div className="text-center py-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mx-auto mb-5">
                <Check size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-gray-700">{workspace.name}</span> is ready.
              </p>
              {invitesSent.length > 0 && (
                <p className="text-sm text-gray-500 mb-6">
                  {invitesSent.length} invite{invitesSent.length !== 1 ? "s" : ""} sent — teammates will see shared projects when they accept.
                </p>
              )}
              {invitesSent.length === 0 && (
                <p className="text-sm text-gray-500 mb-6">
                  Invite teammates anytime from Settings → Team Workspace.
                </p>
              )}
              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Go to dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
