import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPARISONS } from "@/lib/comparisons";

import { SITE_URL as BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "PMRead vs Alternatives — Tool Comparisons | PMRead",
  description:
    "See how PMRead compares to Dovetail, Productboard, Notion AI, and other PM tools. Honest feature-by-feature breakdowns to help you pick the right tool.",
  alternates: { canonical: `${BASE}/compare` },
  openGraph: {
    title: "PMRead vs Alternatives — Tool Comparisons",
    description:
      "Honest feature-by-feature comparisons: PMRead vs Dovetail, Productboard, Notion AI, and more.",
    url: `${BASE}/compare`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Comparisons", item: `${BASE}/compare` },
  ],
};

export default function ComparePage() {
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
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Comparisons
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              PMRead vs alternatives
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Honest, detailed breakdowns of how PMRead compares to the other tools
              PMs commonly consider. No fluff.
            </p>
          </div>

          {/* Comparison cards */}
          <div className="space-y-3 mb-16">
            {COMPARISONS.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#7F77DD]/50 hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#7F77DD] transition-colors">
                    {comp.headline}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {comp.subheadline}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#7F77DD] shrink-0 transition-colors" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-[#7F77DD] p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">
              Try PMRead free — no credit card required
            </h2>
            <p className="text-purple-100 text-sm mb-5">
              Upload a transcript or PDF and get your first PRD draft in under 10 minutes.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-white text-[#7F77DD] font-bold rounded-xl text-sm hover:bg-purple-50 transition-colors"
            >
              Get started free →
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
