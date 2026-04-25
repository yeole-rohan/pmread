import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/glossary";

import { SITE_URL as BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Product Management Glossary — PMRead" },
  description:
    "Product management glossary — plain-English definitions of PRD, OKR, RICE scoring, North Star Metric, Jobs to Be Done, MoSCoW, and 50+ PM terms.",
  alternates: { canonical: `${BASE}/glossary` },
  openGraph: {
    title: "Product Management Glossary",
    description: "Clear definitions of essential PM terms. No jargon, no filler.",
    url: `${BASE}/glossary`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTermSet",
      "@id": `${BASE}/glossary`,
      name: "Product Management Glossary",
      description: "Definitions of essential product management terms.",
      url: `${BASE}/glossary`,
      keywords:
        "product management glossary, prd meaning, product management terminology, what is a prd, okr definition, rice scoring definition",
      hasDefinedTerm: GLOSSARY.map((t) => ({
        "@type": "DefinedTerm",
        name: t.term,
        description: t.shortDef,
        url: `${BASE}/glossary/${t.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Glossary", item: `${BASE}/glossary` },
      ],
    },
  ],
};

const CATEGORIES = [...new Set(GLOSSARY.map((t) => t.category))].sort();

export default function GlossaryIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Reference
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Product Management Glossary
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Plain-English definitions for every PM term you need — PRD, OKR, RICE scoring,
              North Star Metric, Jobs to Be Done, MoSCoW, and 50+ more. No jargon, no filler.
            </p>
          </div>

          {/* Terms by category */}
          {CATEGORIES.map((category) => {
            const terms = GLOSSARY.filter((t) => t.category === category);
            return (
              <div key={category} className="mb-10">
                <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
                  {category}
                </h2>
                <div className="space-y-3">
                  {terms.map((term) => (
                    <Link
                      key={term.slug}
                      href={`/glossary/${term.slug}`}
                      className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-[#7F77DD]/50 hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {term.term}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
                          {term.shortDef}
                        </p>
                      </div>
                      <span className="text-[#7F77DD] text-sm font-medium shrink-0 mt-0.5">
                        Read →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="mt-8 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Put these frameworks into practice
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              PMRead uses RICE, OKRs, and JTBD to structure AI-generated PRDs from
              your actual customer feedback.
            </p>
            <Link
              href="/signup"
              className="inline-block px-5 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Try PMRead free →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
