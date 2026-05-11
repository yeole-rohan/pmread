"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Insight, InsightType } from "@/lib/types";

const TYPE_META = {
  pain_point:      { label: "Pain Points",      dot: "bg-red-400",     badge: "bg-red-100 text-red-700",     activeBorder: "border-red-500",     activeColor: "text-red-600",     countBadge: "bg-red-100 text-red-700" },
  feature_request: { label: "Feature Requests", dot: "bg-blue-400",    badge: "bg-blue-100 text-blue-700",    activeBorder: "border-blue-500",    activeColor: "text-blue-600",    countBadge: "bg-blue-100 text-blue-700" },
  decision:        { label: "Decisions",         dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700",  activeBorder: "border-amber-500",   activeColor: "text-amber-600",   countBadge: "bg-amber-100 text-amber-700" },
  action_item:     { label: "Action Items",      dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700", activeBorder: "border-emerald-500", activeColor: "text-emerald-600", countBadge: "bg-emerald-100 text-emerald-700" },
} as const;

const TYPES: InsightType[] = ["pain_point", "feature_request", "decision", "action_item"];

const NEW_THRESHOLD_MS = 48 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < NEW_THRESHOLD_MS;
}

function isToday(createdAt: string) {
  const d = new Date(createdAt);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function isThisWeek(createdAt: string) {
  const age = Date.now() - new Date(createdAt).getTime();
  return age < WEEK_MS && !isToday(createdAt);
}

function timeAgo(createdAt: string): string {
  const ms = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface InsightsBoardProps {
  grouped: Record<InsightType, Insight[]>;
  onDelete?: (id: string) => void;
  onStar?: (id: string) => void;
  highlightId?: string | null;
}

function parseStakeholderSource(name: string): { submitter: string; section: string | null } {
  // "Stakeholder feedback on 'Proposed Feature' — Krishna"
  // "Stakeholder feedback — Krishna"
  const withSection = name.match(/^Stakeholder feedback on '(.+)' — (.+)$/);
  if (withSection) return { submitter: withSection[2], section: withSection[1] };
  const plain = name.match(/^Stakeholder feedback — (.+)$/);
  if (plain) return { submitter: plain[1], section: null };
  return { submitter: name, section: null };
}

function InsightCard({ insight, onDelete, onStar, typeMeta, highlight }: {
  insight: Insight;
  onDelete?: (id: string) => void;
  onStar?: (id: string) => void;
  typeMeta: typeof TYPE_META[InsightType];
  highlight?: boolean;
}) {
  const isStakeholder = !!insight.source_name?.startsWith("Stakeholder feedback");
  const [expanded, setExpanded] = useState(isStakeholder);
  const [flashing, setFlashing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fresh = isNew(insight.created_at);

  useEffect(() => {
    if (!highlight) return;
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlashing(true);
    const t = setTimeout(() => setFlashing(false), 1800);
    return () => clearTimeout(t);
  }, [highlight]);

  return (
    <div ref={cardRef} className={`bg-white border rounded-xl p-3 flex flex-col transition-all hover:shadow-sm ${flashing ? "border-[#7F77DD] ring-2 ring-[#7F77DD]/20" : insight.used_in_prd ? "border-purple-100 bg-purple-50/20 hover:border-purple-200" : "border-gray-100 hover:border-gray-200"}`}>
      {/* Top row: dot + content + actions */}
      <div className="flex items-start gap-2">
        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${typeMeta.dot}`} />
        <p className={`flex-1 text-sm font-semibold leading-snug line-clamp-3 ${insight.used_in_prd ? "text-gray-400" : "text-gray-900"}`}>
          {insight.content}
        </p>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onStar && (
            <button
              onClick={() => onStar(insight.id)}
              className={`text-sm cursor-pointer transition-colors leading-none ${insight.starred ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
              title={insight.starred ? "Unstar" : "Star for PRD shortlist"}
            >
              ★
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(insight.id)}
              className="text-gray-300 hover:text-red-500 text-xs cursor-pointer transition-colors leading-none"
              title="Remove insight"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Meta + badges row */}
      <div className="flex items-center gap-1.5 mt-1.5 ml-3.5 flex-wrap">
        <span className="text-[10px] text-gray-400">{timeAgo(insight.created_at)}</span>
        {insight.frequency > 1 && (
          <span className={`text-[10px] px-1 py-0.5 rounded-full font-medium ${typeMeta.badge}`}>
            {insight.frequency}×
          </span>
        )}
        {fresh && (
          <span className="text-[10px] bg-purple-100 text-purple-600 px-1 py-0.5 rounded-full font-medium">
            New
          </span>
        )}
        {insight.used_in_prd && (
          <span className="text-[10px] bg-purple-50 text-purple-400 px-1 py-0.5 rounded-full font-medium">
            In PRD
          </span>
        )}
        {insight.source_name && (() => {
          if (isStakeholder) {
            const { submitter, section } = parseStakeholderSource(insight.source_name);
            return (
              <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full font-medium" title={insight.source_name}>
                👤 {submitter}{section && <span className="text-teal-500"> · {section}</span>}
              </span>
            );
          }
          return (
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium truncate max-w-[140px]" title={insight.source_name}>
              {insight.source_name}
            </span>
          );
        })()}
      </div>

      {/* Quote toggle — auto-expanded for stakeholder feedback */}
      {insight.quote && (
        <div className="mt-1.5 ml-3.5">
          {!isStakeholder && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              Evidence
            </button>
          )}
          {expanded && (
            <blockquote className={`mt-1 pl-2 border-l-2 text-[10px] italic leading-relaxed ${isStakeholder ? "border-teal-200 text-teal-700" : "border-gray-200 text-gray-500"}`}>
              &ldquo;{insight.quote.split("\n\n")[0]}&rdquo;
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}

function DateSection({
  label,
  items,
  defaultOpen,
  onDelete,
  onStar,
  typeMeta,
  highlightId,
}: {
  label: string;
  items: Insight[];
  defaultOpen: boolean;
  onDelete?: (id: string) => void;
  onStar?: (id: string) => void;
  typeMeta: typeof TYPE_META[InsightType];
  highlightId?: string | null;
}) {
  const hasHighlight = items.some((i) => i.id === highlightId);
  const [open, setOpen] = useState(defaultOpen || hasHighlight);

  if (items.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full mb-2 group cursor-pointer"
      >
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-medium">
          {items.length}
        </span>
        <div className="flex-1 h-px bg-gray-100 group-hover:bg-gray-200 transition-colors" />
        {open ? (
          <ChevronDown size={11} className="text-gray-300" />
        ) : (
          <ChevronRight size={11} className="text-gray-300" />
        )}
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 mb-5">
          {items.map((ins) => (
            <InsightCard key={ins.id} insight={ins} onDelete={onDelete} onStar={onStar} typeMeta={typeMeta} highlight={ins.id === highlightId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InsightsBoard({ grouped, onDelete, onStar, highlightId }: InsightsBoardProps) {
  // Find which tab the highlighted insight lives in
  const highlightTab = highlightId
    ? TYPES.find((t) => grouped[t]?.some((i) => i.id === highlightId))
    : undefined;

  const [activeTab, setActiveTab] = useState<InsightType>(highlightTab ?? "pain_point");
  const [sort, setSort] = useState<"frequency" | "newest">("frequency");

  // Switch tab if highlightId changes (e.g. second navigation from search)
  useEffect(() => {
    if (highlightTab) setActiveTab(highlightTab);
  }, [highlightTab]);

  const total = TYPES.reduce((sum, t) => sum + (grouped[t]?.length ?? 0), 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-gray-600 font-medium mb-1">No insights yet</p>
        <p className="text-sm text-gray-400 max-w-xs">
          Upload customer interviews, feedback, or meeting notes to start extracting insights.
        </p>
        <a
          href="/templates/user-interview-script"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs text-[#7F77DD] hover:underline"
        >
          How to run a customer interview →
        </a>
      </div>
    );
  }

  const activeMeta = TYPE_META[activeTab];
  const rawItems = grouped[activeTab] ?? [];

  // Sort
  const sorted = [...rawItems].sort((a, b) => {
    if (sort === "frequency") return b.frequency - a.frequency;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Date bucketing
  const todayItems = sorted.filter((i) => isToday(i.created_at));
  const weekItems = sorted.filter((i) => isThisWeek(i.created_at));
  const earlierItems = sorted.filter((i) => !isToday(i.created_at) && !isThisWeek(i.created_at));

  // If everything is "today" or there's no date spread, skip bucketing
  const useBuckets = weekItems.length > 0 || earlierItems.length > 0;

  return (
    <div>
      {/* Tab bar — flex-wrap to avoid overflow scroll */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 mb-5">
        {TYPES.map((type) => {
          const meta = TYPE_META[type];
          const newCount = grouped[type]?.filter((i) => isNew(i.created_at)).length ?? 0;
          const isActive = activeTab === type;

          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? `${meta.activeColor} ${meta.activeBorder}`
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
              {meta.label}
              {newCount > 0 && (
                <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-medium">
                  {newCount} new
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-400">
          {rawItems.length} {activeMeta.label.toLowerCase()}
        </span>
        {rawItems.length > 1 && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "frequency" | "newest")}
            className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7F77DD]/40 cursor-pointer bg-white"
          >
            <option value="frequency">Most mentioned</option>
            <option value="newest">Newest first</option>
          </select>
        )}
      </div>

      {/* Low-data nudge — show when board has fewer than 5 insights total */}
      {total < 5 && total > 0 && (
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
          <span>Still gathering research?</span>
          <a
            href="/templates/user-interview-script"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7F77DD] hover:underline"
          >
            Customer interview script →
          </a>
        </div>
      )}

      {/* Cards */}
      {rawItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-400">No {activeMeta.label.toLowerCase()} extracted yet.</p>
          <p className="text-xs text-gray-300 mt-1">They&apos;ll appear here after uploading files.</p>
        </div>
      ) : useBuckets ? (
        <div>
          <DateSection label="Today" items={todayItems} defaultOpen={true} onDelete={onDelete} onStar={onStar} typeMeta={activeMeta} highlightId={highlightId} />
          <DateSection label="This week" items={weekItems} defaultOpen={true} onDelete={onDelete} onStar={onStar} typeMeta={activeMeta} highlightId={highlightId} />
          <DateSection label="Earlier" items={earlierItems} defaultOpen={false} onDelete={onDelete} onStar={onStar} typeMeta={activeMeta} highlightId={highlightId} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {sorted.map((ins) => (
            <InsightCard key={ins.id} insight={ins} onDelete={onDelete} onStar={onStar} typeMeta={activeMeta} highlight={ins.id === highlightId} />
          ))}
        </div>
      )}
    </div>
  );
}
