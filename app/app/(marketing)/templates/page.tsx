import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import TemplatesClient from "@/components/TemplatesClient";

import { SITE_URL as BASE, TWITTER_HANDLE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Free PM Templates — Copy-Paste Ready | PMRead" },
  description:
    "Free PM templates: PRD, OKR, product roadmap, buyer persona, user stories, and more. Written by PMs, copy-paste ready, no signup required.",
  alternates: { canonical: `${BASE}/templates` },
  openGraph: {
    title: "Free PM Templates | PMRead",
    description:
      "Free product management templates — PRD, OKR, roadmap, persona, user stories and more. Copy-paste ready, no signup.",
    url: `${BASE}/templates`,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "Free PM Templates | PMRead",
    description:
      "Free product management templates — PRD, OKR, roadmap, persona, user stories and more. Copy-paste ready, no signup.",
  },
};

const FAQS = [
  {
    q: "Are all these templates free?",
    a: "Yes. Every template on this page is free, with no signup, no account, and no credit card required.",
  },
  {
    q: "Can I use these templates in Notion, Confluence, or Google Docs?",
    a: "Yes. Every template is plain Markdown — it copies cleanly into Notion and Confluence (which both support Markdown paste). For Google Docs, paste as plain text and adjust formatting.",
  },
  {
    q: "Are these templates opinionated?",
    a: "Deliberately. Generic templates produce generic output. Each template reflects how experienced PMs actually work — with specific guidance on what to include, what to skip, and common mistakes to avoid.",
  },
  {
    q: "What is PMRead?",
    a: "PMRead is a product management tool that ingests customer interviews, feedback files, Slack channels, and GitHub — and generates PRDs grounded in real evidence. These templates are a manual starting point; PMRead automates the data-gathering that makes them actually useful.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Free Product Management Templates",
      description: "Free PM templates for product managers — PRD, OKR, roadmap, persona, user stories.",
      url: `${BASE}/templates`,
      numberOfItems: TEMPLATES.length,
      itemListElement: TEMPLATES.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: `${BASE}/templates/${t.slug}`,
        description: t.description,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Templates", item: `${BASE}/templates` },
      ],
    },
  ],
};

export default function TemplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Templates</span>
          </nav>

          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Templates
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Product management templates
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Copy-paste ready templates for every stage of the product process.
              Written for how PMs actually work — no filler, no fluff.
              No signup required.
            </p>
          </div>

          {/* Template grid — search + grouped by category */}
          <TemplatesClient templates={TEMPLATES} />

          {/* FAQ */}
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Want AI insights from your actual customer data?
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              PMRead ingests PDFs, audio, Slack channels, and GitHub — and generates
              PRDs grounded in real evidence, not guesses.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Get started free →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
