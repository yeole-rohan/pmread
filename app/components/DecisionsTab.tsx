"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, X, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Decision, User } from "@/lib/types";

interface DecisionsTabProps {
  projectId: string;
  user: User | null | undefined;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: Decision["status"] }) {
  if (status === "active") {
    return (
      <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
        Active
      </span>
    );
  }
  if (status === "reversed") {
    return (
      <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
        Reversed
      </span>
    );
  }
  return (
    <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
      Superseded
    </span>
  );
}

interface DecisionFormValues {
  title: string;
  what_we_decided: string;
  why: string;
  status: Decision["status"];
}

const EMPTY_FORM: DecisionFormValues = {
  title: "",
  what_we_decided: "",
  why: "",
  status: "active",
};

interface DecisionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: DecisionFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  initial?: DecisionFormValues;
  saving: boolean;
  deleting?: boolean;
  title: string;
}

function DecisionModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial = EMPTY_FORM,
  saving,
  deleting,
  title,
}: DecisionModalProps) {
  const [values, setValues] = useState<DecisionFormValues>(initial);

  // Reset form when modal opens with new initial values
  const [lastInitial, setLastInitial] = useState<DecisionFormValues>(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setValues(initial);
  }

  if (!open) return null;

  function handleChange(field: keyof DecisionFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={values.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Adopt server-side rendering for marketing pages"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              What we decided <span className="text-red-400">*</span>
            </label>
            <textarea
              value={values.what_we_decided}
              onChange={(e) => handleChange("what_we_decided", e.target.value)}
              placeholder="Describe the decision that was made…"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Why <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={values.why}
              onChange={(e) => handleChange("why", e.target.value)}
              placeholder="Rationale or context…"
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={values.status}
              onChange={(e) =>
                handleChange("status", e.target.value as Decision["status"])
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent bg-white"
            >
              <option value="active">Active</option>
              <option value="reversed">Reversed</option>
              <option value="superseded">Superseded</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                disabled={deleting || saving}
                className="text-sm text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(values)}
              disabled={saving || !values.title.trim() || !values.what_we_decided.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DecisionsTab({ projectId, user }: DecisionsTabProps) {
  const cacheKey = `/decisions/?project_id=${projectId}`;
  const { data: decisions, isLoading, mutate } = useSWR<Decision[]>(
    cacheKey,
    (key: string) => apiFetch<Decision[]>(key),
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editDecision, setEditDecision] = useState<Decision | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editDeleting, setEditDeleting] = useState(false);

  const isFree = user?.plan === "free";
  const atLimit = isFree && (decisions?.length ?? 0) >= 10;

  async function handleCreate(values: DecisionFormValues) {
    setSaving(true);
    try {
      await apiFetch<Decision>("/decisions/", {
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          title: values.title,
          what_we_decided: values.what_we_decided,
          why: values.why || null,
          evidence_insight_ids: [],
        }),
      });
      await mutate();
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(values: DecisionFormValues) {
    if (!editDecision) return;
    setEditSaving(true);
    try {
      await apiFetch<Decision>(`/decisions/${editDecision.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: values.title,
          what_we_decided: values.what_we_decided,
          why: values.why || null,
          status: values.status,
        }),
      });
      await mutate();
      setEditDecision(null);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete() {
    if (!editDecision) return;
    setEditDeleting(true);
    try {
      await apiFetch(`/decisions/${editDecision.id}`, { method: "DELETE" });
      await mutate();
      setEditDecision(null);
    } finally {
      setEditDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const list = decisions ?? [];

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {list.length > 0 && (
            <>
              <span className="font-semibold text-gray-900">{list.length}</span>{" "}
              decision{list.length !== 1 ? "s" : ""} logged
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {atLimit ? (
            <p className="text-xs text-gray-500">
              Upgrade to Pro for unlimited decisions
            </p>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Add decision
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Plus size={20} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            No decisions logged yet
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Track key product decisions and the reasoning behind them.
          </p>
          {!atLimit && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Add decision
            </button>
          )}
          {atLimit && (
            <p className="text-xs text-gray-500">
              Upgrade to Pro for unlimited decisions
            </p>
          )}
        </div>
      )}

      {/* Decision cards */}
      {list.length > 0 && (
        <div className="space-y-3">
          {list.map((decision) => (
            <button
              key={decision.id}
              onClick={() => setEditDecision(decision)}
              className="w-full text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {decision.title}
                </p>
                <div className="flex-shrink-0 mt-0.5">
                  <StatusBadge status={decision.status} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {decision.what_we_decided}
              </p>
              {decision.why && (
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {decision.why}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-3">
                {formatDate(decision.created_at)}
                {decision.logged_by && (
                  <span className="ml-2 text-gray-300">· {decision.logged_by}</span>
                )}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Add modal */}
      <DecisionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleCreate}
        saving={saving}
        title="Log a decision"
      />

      {/* Edit modal */}
      {editDecision && (
        <DecisionModal
          open={true}
          onClose={() => setEditDecision(null)}
          onSave={handleEdit}
          onDelete={handleDelete}
          initial={{
            title: editDecision.title,
            what_we_decided: editDecision.what_we_decided,
            why: editDecision.why ?? "",
            status: editDecision.status,
          }}
          saving={editSaving}
          deleting={editDeleting}
          title="Edit decision"
        />
      )}
    </div>
  );
}
