"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/api";

interface InviteInfo {
  workspace_id: string;
  workspace_name: string;
  role: string;
  invite_email: string | null;
  inviter_name: string | null;
  already_accepted: boolean;
}

export default function JoinWorkspacePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = params.token;

  useEffect(() => {
    apiFetch<InviteInfo>(`/workspaces/join/${token}`)
      .then(setInfo)
      .catch(() => setError("This invite link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  async function accept() {
    if (!getToken()) {
      // Redirect to login with return URL
      router.push(`/login?next=/join/${token}`);
      return;
    }
    setAccepting(true);
    try {
      const res = await apiFetch<{ workspace_id: string }>(`/workspaces/join/${token}`, { method: "POST" });
      router.push(`/dashboard?workspace_joined=${res.workspace_id}`);
    } catch {
      setError("Failed to accept invite. Please try again.");
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <p className="text-gray-900 font-medium mb-2">Invalid invite</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <a href="/dashboard" className="text-sm text-[#7F77DD] hover:underline">Go to dashboard →</a>
        </div>
      </div>
    );
  }

  if (info?.already_accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <p className="text-gray-900 font-medium mb-2">Already joined</p>
          <p className="text-sm text-gray-500 mb-4">You&apos;re already a member of <strong>{info.workspace_name}</strong>.</p>
          <a href="/dashboard" className="text-sm text-[#7F77DD] hover:underline">Go to dashboard →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-xl font-bold text-purple-600">{info?.workspace_name?.[0] ?? "W"}</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 mb-1">You&apos;re invited</h1>
        {info?.inviter_name && (
          <p className="text-sm text-gray-500 mb-1">
            <strong>{info.inviter_name}</strong> invited you to join
          </p>
        )}
        <p className="text-base font-medium text-gray-900 mb-1">{info?.workspace_name}</p>
        <p className="text-xs text-gray-400 mb-6 capitalize">as {info?.role}</p>

        <button
          onClick={accept}
          disabled={accepting}
          className="w-full py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          {accepting ? "Joining..." : "Accept invite →"}
        </button>
        <p className="text-xs text-gray-400 mt-3">
          {!getToken() ? "You'll be asked to log in first." : ""}
        </p>
      </div>
    </div>
  );
}
