"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Loader2, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
  { value: "bug",        label: "Bug",        color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200" },
  { value: "suggestion", label: "Suggestion",  color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" },
  { value: "praise",     label: "Praise",      color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200" },
];

export default function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleOpen() {
    setDone(false);
    setMessage("");
    setCategory("suggestion");
    setOpen(true);
  }

  function handleClose() {
    if (loading) return;
    setOpen(false);
  }

  async function handleSubmit() {
    if (!message.trim() || loading) return;
    setLoading(true);
    try {
      await apiFetch("/feedback/", {
        method: "POST",
        body: JSON.stringify({ category, message: message.trim(), page: pathname }),
      });
      setDone(true);
      setTimeout(() => setOpen(false), 1800);
    } catch {
      // fail silently — feedback is best-effort
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={handleOpen}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-md text-xs font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all cursor-pointer"
      >
        <MessageSquare size={13} />
        Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end pb-16 pr-5">
          <div
            className="absolute inset-0"
            onClick={handleClose}
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-80 p-5">
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-pointer"
            >
              <X size={15} />
            </button>

            {done ? (
              <div className="py-4 flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check size={18} className="text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-gray-800">Thanks for the feedback!</p>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Share feedback</h3>

                {/* Category chips */}
                <div className="flex gap-1.5 mb-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        category === c.value ? c.color : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <textarea
                  autoFocus
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/40 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 mb-3">⌘ + Enter to submit</p>

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className="w-full py-2 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {loading ? <><Loader2 size={13} className="animate-spin" /> Sending...</> : "Send feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
