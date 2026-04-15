"use client";

import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Message {
  id: number;
  question: string;
  answer: string;
  quotes: string[];
}

interface AskTabProps {
  projectId: string;
  hasInsights: boolean;
}

const EXAMPLE_QUESTIONS = [
  "What do customers complain about most?",
  "What feature is requested most often?",
  "What decisions have been made so far?",
  "Summarise the biggest pain points",
];

export default function AskTab({ projectId, hasInsights }: AskTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim();
    if (!text || loading) return;
    setQuestion("");
    setLoading(true);

    const id = nextId.current++;
    // Optimistic: show question immediately
    setMessages((prev) => [...prev, { id, question: text, answer: "", quotes: [] }]);

    try {
      const res = await apiFetch<{ answer: string; quotes: string[] }>(
        `/projects/${projectId}/chat`,
        { method: "POST", body: JSON.stringify({ question: text }) }
      );
      setMessages((prev) =>
        prev.map((m) => m.id === id ? { ...m, answer: res.answer, quotes: res.quotes } : m)
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

  if (!hasInsights) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No insights yet</p>
        <p className="text-sm text-gray-400">Upload files first to start asking questions about your customers.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Conversation */}
      <div className="flex-1 space-y-5 pb-4">
        {messages.length === 0 && (
          <div className="py-6">
            <p className="text-sm text-gray-500 mb-4">Ask anything about your customer insights. Try:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleAsk(q)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {/* Question bubble */}
            <div className="flex justify-end">
              <div className="bg-[#7F77DD] text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                {msg.question}
              </div>
            </div>

            {/* Answer */}
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] space-y-3">
                {msg.answer ? (
                  <>
                    <p className="text-sm text-gray-800 leading-relaxed">{msg.answer}</p>
                    {msg.quotes.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-gray-50">
                        {msg.quotes.map((q, i) => (
                          <blockquote
                            key={i}
                            className="border-l-2 border-[#7F77DD] pl-3 text-xs text-gray-500 italic"
                          >
                            &ldquo;{q}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 size={13} className="animate-spin" />
                    Thinking...
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
        <div className="flex gap-2 items-end bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#7F77DD]/40">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask about your customers…"
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
