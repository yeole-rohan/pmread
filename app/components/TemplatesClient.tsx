"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Template } from "@/lib/templates";
import { TEMPLATE_CATEGORIES } from "@/lib/templates";

export default function TemplatesClient({ templates }: { templates: Template[] }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filtered = q
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    : null;

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-8">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/30 focus:border-[#7F77DD] placeholder-gray-400 transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search results — flat list */}
      {filtered !== null && (
        <>
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No templates match &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((template) => (
                <TemplateCard key={template.slug} template={template} showCategory />
              ))}
            </div>
          )}
        </>
      )}

      {/* Grouped view — default */}
      {filtered === null &&
        TEMPLATE_CATEGORIES.map((category) => {
          const items = templates.filter((t) => t.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="mb-10">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {category}
              </h2>
              <div className="space-y-3">
                {items.map((template) => (
                  <TemplateCard key={template.slug} template={template} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

function TemplateCard({ template, showCategory }: { template: Template; showCategory?: boolean }) {
  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group flex items-start justify-between gap-4 bg-white rounded-2xl border border-gray-200 hover:border-[#7F77DD]/40 hover:shadow-sm p-5 transition-all"
    >
      <div className="flex-1 min-w-0">
        {showCategory && (
          <span className="text-[10px] font-semibold text-[#7F77DD] uppercase tracking-wider mb-1 block">
            {template.category}
          </span>
        )}
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#7F77DD] transition-colors mb-1">
          {template.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-[#7F77DD] group-hover:translate-x-0.5 transition-transform mt-0.5 whitespace-nowrap">
        Use template →
      </span>
    </Link>
  );
}
