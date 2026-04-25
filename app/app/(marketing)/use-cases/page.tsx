import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { USE_CASES } from "@/lib/use-cases";

import { SITE_URL as BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "PMRead Use Cases — Who It's Built For" },
  description:
    "How product teams use PMRead — from SaaS startups to fintech PMs in India. Turn customer feedback into PRDs faster with AI-powered product requirements generation.",
  alternates: { canonical: `${BASE}/use-cases` },
  openGraph: {
    title: "PMRead Use Cases — Who It's Built For",
    description:
      "See how PMRead fits different PM contexts: India startups, fintech, B2B SaaS, and consumer apps.",
    url: `${BASE}/use-cases`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  keywords:
    "prd tool for saas teams, product management tool for startups, pm tool fintech india, b2b saas prd tool, india startup pm workflow",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Use Cases", item: `${BASE}/use-cases` },
  ],
};

const SEGMENT_DESCRIPTIONS: Record<string, string> = {
  "india-startups": "Priced in INR. Built for lean teams moving fast without enterprise tooling budgets.",
  "fintech": "Ingest regulatory docs, complaints, and audit findings. PRDs that trace requirements to sources.",
  "b2b-saas": "Synthesise Slack, GitHub, and sales calls. Frequency-ranked insights across all enterprise feedback.",
  "consumer-apps": "Upload app store reviews and NPS data. PRDs with analytics events built in.",
};

export default function UseCasesPage() {
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
              Use Cases
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for how product teams actually work
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              From India startups to fintech PMs and B2B SaaS teams — see how PMRead helps
              you turn customer feedback into PRDs faster, whatever your context.
            </p>
          </div>

          {/* Use case cards */}
          <div className="space-y-3 mb-16">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.slug}
                href={`/use-cases/${uc.slug}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#7F77DD]/50 hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#7F77DD] transition-colors">
                      {uc.segment}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {SEGMENT_DESCRIPTIONS[uc.slug]}
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
