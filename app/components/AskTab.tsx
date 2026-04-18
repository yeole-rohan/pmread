"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, GitBranch, Lock, CheckCircle2, AlertCircle, Code2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "@/lib/api";

interface Message {
  id: number;
  question: string;
  answer: string;
  quotes: string[];
  codeRefs: string[];
  usedCodebase: boolean;
}

interface IndexStatus {
  github_repo: string | null;
  github_index_status: string | null;
  chunk_count: number;
}

interface AskTabProps {
  projectId: string;
  hasInsights: boolean;
  isPro: boolean;
  githubConnected: boolean;
}

const EXAMPLE_QUESTIONS = [
  "What do customers complain about most?",
  "What feature is requested most often?",
  "What decisions have been made so far?",
  "Summarise the biggest pain points",
];

const CODEBASE_QUESTIONS = [
  "Does SSO exist anywhere in the codebase?",
  "Where is the payment flow handled?",
  "What data do we store about users?",
  "What would break if we changed the auth flow?",
];

const MAX_STORED = 20;

function chatKey(projectId: string) {
  return `pmread_chat_${projectId}`;
}

function loadHistory(projectId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(chatKey(projectId));
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(projectId: string, messages: Message[]) {
  try {
    // Keep only the last MAX_STORED completed messages (no empty answers)
    const completed = messages.filter((m) => m.answer);
    const trimmed = completed.slice(-MAX_STORED);
    localStorage.setItem(chatKey(projectId), JSON.stringify(trimmed));
  } catch {}
}

export default function AskTab({ projectId, hasInsights, isPro, githubConnected }: AskTabProps) {
  const [messages, setMessages] = useState<Message[]>(() => loadHistory(projectId));
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [useCodebase, setUseCodebase] = useState(false);
  const [indexStatus, setIndexStatus] = useState<IndexStatus | null>(null);
  const nextId = useRef((loadHistory(projectId).length + 1));
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch index status if GitHub is connected
  useEffect(() => {
    if (!isPro || !githubConnected) return;
    apiFetch<IndexStatus>(`/github/projects/${projectId}/index-status`)
      .then(setIndexStatus)
      .catch(() => {});
  }, [projectId, isPro, githubConnected]);

  // Persist messages whenever they change (only completed ones)
  useEffect(() => {
    saveHistory(projectId, messages);
  }, [projectId, messages]);

  const repoReady = indexStatus?.github_index_status === "ready";
  const repoIndexing = indexStatus?.github_index_status === "indexing";

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim();
    if (!text || loading) return;
    setQuestion("");
    setLoading(true);

    const id = nextId.current++;
    const willUseCodebase = useCodebase && repoReady;

    setMessages((prev) => [...prev, {
      id,
      question: text,
      answer: "",
      quotes: [],
      codeRefs: [],
      usedCodebase: willUseCodebase,
    }]);

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      const res = await apiFetch<{ answer: string; quotes: string[]; code_refs: string[] }>(
        `/projects/${projectId}/chat`,
        { method: "POST", body: JSON.stringify({ question: text, use_codebase: willUseCodebase }) }
      );
      setMessages((prev) =>
        prev.map((m) => m.id === id ? {
          ...m,
          answer: res.answer,
          quotes: res.quotes,
          codeRefs: res.code_refs ?? [],
        } : m)
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) => m.id === id ? { ...m, answer: "Something went wrong. Try again." } : m)
      );
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  function clearHistory() {
    setMessages([]);
    localStorage.removeItem(chatKey(projectId));
  }

  if (!hasInsights) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No insights yet</p>
        <p className="text-sm text-gray-400 mb-4">Upload files first to start asking questions about your customers.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
          <span>Need customer data?</span>
          <a href="/templates/user-interview-script" target="_blank" rel="noopener noreferrer" className="text-[#7F77DD] hover:underline">
            Interview script →
          </a>
          <a href="/templates/empathy-map" target="_blank" rel="noopener noreferrer" className="text-[#7F77DD] hover:underline">
            Empathy map →
          </a>
        </div>
      </div>
    );
  }

  const exampleQs = useCodebase && repoReady ? CODEBASE_QUESTIONS : EXAMPLE_QUESTIONS;

  return (
    <div className="flex flex-col h-full min-h-[500px]">

      {/* Context source bar — sticky */}
      <div className="sticky top-0 z-10 bg-gray-50 flex items-center justify-between mb-4 pb-3 pt-1 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Context:</span>

          {/* Insights — always on */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-medium text-purple-700">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Insights
          </span>

          {/* Codebase toggle */}
          {!isPro ? (
            <a
              href="/settings?upgrade=1"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-gray-200 text-xs text-gray-400 hover:border-purple-300 hover:text-purple-500 transition-colors"
              title="Codebase context requires Pro"
            >
              <Lock size={10} />
              Codebase
              <span className="text-[10px] bg-gray-100 text-gray-400 px-1 rounded">Pro</span>
            </a>
          ) : !githubConnected ? (
            <a
              href="/settings"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-gray-200 text-xs text-gray-500 hover:border-gray-300 transition-colors"
            >
              <GitBranch size={10} />
              Connect GitHub
            </a>
          ) : !indexStatus?.github_repo ? (
            <a
              href="/settings"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-gray-200 text-xs text-gray-500 hover:border-gray-300 transition-colors"
            >
              <GitBranch size={10} />
              Link a repo
            </a>
          ) : repoIndexing ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-xs text-amber-600">
              <Loader2 size={10} className="animate-spin" />
              Indexing {indexStatus.github_repo?.split("/")[1]}…
            </span>
          ) : indexStatus?.github_index_status === "failed" ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-200 bg-red-50 text-xs text-red-500">
              <AlertCircle size={10} />
              Index failed
            </span>
          ) : repoReady ? (
            <button
              onClick={() => setUseCodebase((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                useCodebase
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
              }`}
              title={`${useCodebase ? "Disable" : "Enable"} codebase context — ${indexStatus.chunk_count} chunks indexed`}
            >
              {useCodebase
                ? <CheckCircle2 size={10} className="text-emerald-500" />
                : <Code2 size={10} />
              }
              {indexStatus.github_repo?.split("/")[1]}
              {useCodebase && (
                <span className="text-[10px] text-emerald-600">{indexStatus.chunk_count} chunks</span>
              )}
            </button>
          ) : null}
        </div>

        {/* Clear history */}
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            title="Clear conversation"
          >
            <Trash2 size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Conversation */}
      <div className="flex-1 space-y-6 pb-4">
        {messages.length === 0 && (
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-3">
              {useCodebase && repoReady
                ? "Ask about your codebase + customer insights. Try:"
                : "Ask anything about your customer insights. Try:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQs.map((q) => (
                <button
                  key={q}
                  onClick={() => handleAsk(q)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 pt-3 border-t border-gray-100">
              <span className="text-[11px] text-gray-300">Research frameworks:</span>
              <a href="/glossary/jobs-to-be-done" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-[#7F77DD] transition-colors">Jobs to Be Done</a>
              <a href="/glossary/north-star-metric" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-[#7F77DD] transition-colors">North Star Metric</a>
              <a href="/glossary/product-discovery" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-[#7F77DD] transition-colors">Product Discovery</a>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {/* Question bubble */}
            <div className="flex justify-end">
              <div className="bg-[#7F77DD] text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[78%] leading-relaxed">
                {msg.question}
              </div>
            </div>

            {/* Answer bubble */}
            <div className="flex justify-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#7F77DD]">AI</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5 max-w-[85%] space-y-3 shadow-sm">
                {msg.answer ? (
                  <>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="text-sm text-gray-900 leading-relaxed my-1">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li className="text-sm text-gray-900 leading-relaxed">{children}</li>,
                        code: ({ children }) => <code className="text-[#7F77DD] bg-purple-50 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-sm font-semibold text-gray-900 mt-1.5 mb-0.5">{children}</h4>,
                      }}
                    >
                      {msg.answer}
                    </ReactMarkdown>

                    {/* Customer insight quotes */}
                    {msg.quotes.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">From your insights</p>
                        {msg.quotes.map((q, i) => (
                          <blockquote
                            key={i}
                            className="border-l-2 border-[#7F77DD]/40 pl-3 text-xs text-gray-600 italic leading-relaxed"
                          >
                            &ldquo;{q}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    )}

                    {/* Codebase file references */}
                    {msg.codeRefs.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <Code2 size={10} />
                          Referenced files
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {msg.codeRefs.map((ref, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] rounded font-mono"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 size={13} className="animate-spin" />
                    {msg.usedCodebase ? "Searching insights + codebase…" : "Thinking…"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 pt-3 bg-gray-50">
        <div className="flex gap-2 items-end bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#7F77DD]/40 shadow-sm">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder={
              useCodebase && repoReady
                ? "Ask about customers or codebase…"
                : "Ask about your customers…"
            }
            rows={1}
            disabled={loading}
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none disabled:opacity-50 bg-transparent"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || loading}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
