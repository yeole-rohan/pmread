"use client";

import { useEffect, useRef, useState } from "react";
import { PRD } from "@/lib/types";

interface TocItem {
  id: string;
  label: string;
  count?: number;
}

function buildTocItems(brief: PRD): TocItem[] {
  const items: TocItem[] = [];
  items.push({ id: "prd-problem",   label: "Problem",          count: brief.problem_quotes?.length || undefined });
  items.push({ id: "prd-feature",   label: "Proposed Feature" });
  items.push({ id: "prd-why",       label: "Why Build" });
  if (brief.goals?.length)              items.push({ id: "prd-goals",     label: "Goals",        count: brief.goals.length });
  if (brief.non_goals?.length)          items.push({ id: "prd-nongoals",  label: "Non-Goals",    count: brief.non_goals.length });
  if (brief.user_stories?.length)       items.push({ id: "prd-stories",   label: "User Stories", count: brief.user_stories.length });
  items.push({ id: "prd-changes",   label: "What Changes" });
  if (brief.engineering_tasks?.length)  items.push({ id: "prd-tasks",     label: "Eng Tasks",    count: brief.engineering_tasks.length });
  if (brief.edge_cases?.length)         items.push({ id: "prd-edge",      label: "Edge Cases",   count: brief.edge_cases.length });
  if (brief.analytics_events?.length)   items.push({ id: "prd-analytics", label: "Analytics",    count: brief.analytics_events.length });
  if (brief.open_questions?.length)     items.push({ id: "prd-questions", label: "Open Qs",      count: brief.open_questions.length });
  return items;
}

export default function PrdTableOfContents({ brief }: { brief: PRD }) {
  const items = buildTocItems(brief);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [stripTop, setStripTop] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Update strip position whenever active changes
  function updateStrip(id: string) {
    const li = listRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (li) setStripTop(li.offsetTop);
  }

  useEffect(() => {
    updateStrip(activeId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // IntersectionObserver — track which section is visible
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(id: string) {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
        Contents · {items.length}
      </p>

      <div className="relative">
        {/* Animated active strip */}
        <span
          className="absolute left-0 w-0.5 bg-[#7F77DD] rounded-full transition-all duration-200 ease-out"
          style={{ top: stripTop + 4, height: 24 }}
        />

        <ul ref={listRef} className="space-y-0.5">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} data-id={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`w-full flex items-center justify-between pl-4 pr-2 py-1.5 rounded-lg text-left text-xs transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "text-[#7F77DD] font-semibold"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`ml-2 flex-shrink-0 tabular-nums ${isActive ? "text-purple-300" : "text-gray-200"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
