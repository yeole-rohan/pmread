import type { Metadata } from "next";
import Link from "next/link";
import MetricStoryGeneratorTool from "./MetricStoryGeneratorTool";

import { SITE_URL as BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Metric Story Generator — Raw Data to Narrative | PMRead",
  description:
    "Free AI tool for product managers. Paste your product metrics and get a clear narrative: what changed, why it likely happened, and what to do next. No signup required.",
  alternates: { canonical: `${BASE}/tools/metric-story-generator` },
  openGraph: {
    title: "Metric Story Generator | PMRead",
    description: "Paste raw metrics → get a clear narrative with what happened, why, and what to do next. Free, no signup.",
    url: `${BASE}/tools/metric-story-generator`,
  },
};

const FAQS = [
  {
    q: "What kind of metrics can I paste?",
    a: "Anything — DAU/MAU, churn, conversion rates, latency numbers, feature adoption, revenue metrics, NPS scores. The AI works with numbers in any format. One metric per line gives the cleanest output.",
  },
  {
    q: "How is this different from asking ChatGPT?",
    a: "This tool is purpose-built for product metric narratives. The prompt is structured to produce a specific format: what changed, likely root causes ranked by probability, and concrete next steps — not a generic summary.",
  },
  {
    q: "Should I add context about my product?",
    a: "Yes, if you want more accurate root cause analysis. Without context the AI makes plausible general guesses. With context (product type, recent changes, user base) it can make more specific, useful hypotheses.",
  },
  {
    q: "Can I use this for a weekly PM report?",
    a: "That's a common use case. Paste the week's key metrics, add a line of context, and get a narrative that explains the week to stakeholders — in a format they can actually read.",
  },
];

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "Meeting Cost Calculator", href: "/tools/meeting-cost-calculator" },
  { name: "Feature Prioritization", href: "/tools/feature-prioritization" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Metric Story Generator",
      applicationCategory: "BusinessApplication",
      description: "Free AI tool that turns raw product metrics into a clear narrative — what happened, why, and what to do. No signup required.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: `${BASE}/tools/metric-story-generator`,
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
        { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE}/tools` },
        { "@type": "ListItem", position: 3, name: "Metric Story Generator", item: `${BASE}/tools/metric-story-generator` },
      ],
    },
  ],
};

export default function MetricStoryGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-gray-600">Tools</Link>
            <span>/</span>
            <span className="text-gray-600">Metric Story Generator</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Metric Story Generator
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Paste your raw product metrics and get a clear narrative — what changed,
              why it likely happened, and what to do next. No more staring at a dashboard
              trying to write the weekly update.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <MetricStoryGeneratorTool />
          </div>

          <div className="mt-12 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">What you get</h2>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li><strong>Executive summary</strong> — one paragraph capturing the headline story</li>
              <li><strong>What changed</strong> — key movements with directional framing (up/down, good/bad)</li>
              <li><strong>Likely root causes</strong> — ranked hypotheses with reasoning</li>
              <li><strong>Recommended next steps</strong> — specific, actionable, prioritised</li>
              <li><strong>Signals to watch</strong> — leading indicators to monitor in the next cycle</li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Connect your metrics to customer evidence
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              PMRead links product metrics to actual customer feedback — so your metric story
              says &ldquo;DAU dropped because 8 customers flagged this specific pain&rdquo; instead of guessing.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Get started free →
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Other free tools</p>
            <div className="flex flex-wrap gap-2">
              {OTHER_TOOLS.map((t) => (
                <Link key={t.href} href={t.href}
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white">
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
