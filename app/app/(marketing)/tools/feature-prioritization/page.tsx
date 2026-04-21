import type { Metadata } from "next";
import FeaturePrioritizationTool from "./FeaturePrioritizationTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free RICE Feature Prioritization Calculator | PMRead",
  description:
    "Prioritize your product backlog with RICE scoring. Enter features with Reach, Impact, Confidence, and Effort — get a ranked list instantly. Free, no signup.",
  alternates: { canonical: "https://pmread.rohanyeole.com/tools/feature-prioritization" },
  openGraph: {
    title: "Free RICE Feature Prioritization Calculator | PMRead",
    description: "Score and rank product features using the RICE framework. Free prioritization tool for product managers.",
    url: "https://pmread.rohanyeole.com/tools/feature-prioritization",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free RICE Feature Prioritization Calculator | PMRead",
    description: "Score and rank product features using the RICE framework. Free prioritization tool for product managers.",
  },
};

const FAQS = [
  {
    q: "What is RICE scoring?",
    a: "RICE is a prioritization framework by Intercom. It scores each feature on Reach (users impacted), Impact (how much per user), Confidence (how sure you are), and Effort (time to build). RICE Score = (Reach × Impact × Confidence%) ÷ Effort.",
  },
  {
    q: "How do I choose the right Impact score?",
    a: "Use the scale: 3× for massive impact (fundamentally changes how users work), 2× for high, 1× for medium, 0.5× for low, 0.25× for minimal. When in doubt, default to medium (1×) and lower it if you are uncertain.",
  },
  {
    q: "What unit should I use for Effort?",
    a: "Person-months is standard. A 2-week task for one engineer = 0.5. A 3-month project for two engineers = 6. Keep it rough — RICE is for relative ranking, not precise scheduling.",
  },
  {
    q: "Is this feature prioritization tool free?",
    a: "Yes, completely free. No AI, no signup — just a RICE calculator.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free Feature Prioritization Tool (RICE Calculator)",
      applicationCategory: "BusinessApplication",
      description: "RICE scoring calculator for product managers. Rank features by Reach × Impact × Confidence ÷ Effort.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: "https://pmread.rohanyeole.com/tools/feature-prioritization",
    },
    {
      "@type": "HowTo",
      name: "How to prioritize features using RICE scoring",
      description: "Rank your product backlog objectively using the RICE framework.",
      step: [
        { "@type": "HowToStep", position: 1, name: "List your features", text: "Enter each feature you are considering in the table. You can add as many rows as you need." },
        { "@type": "HowToStep", position: 2, name: "Score Reach", text: "Estimate how many users this feature will impact per quarter based on your analytics." },
        { "@type": "HowToStep", position: 3, name: "Score Impact and Confidence", text: "Choose an Impact multiplier (3× to 0.25×) and enter your Confidence percentage (0–100%)." },
        { "@type": "HowToStep", position: 4, name: "Enter Effort", text: "Estimate the effort in person-months. A 2-week solo project = 0.5." },
        { "@type": "HowToStep", position: 5, name: "Calculate and rank", text: "Click Calculate & Rank. Features are sorted by RICE score with a visual score bar." },
      ],
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pmread.rohanyeole.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://pmread.rohanyeole.com/tools" },
        { "@type": "ListItem", position: 3, name: "Feature Prioritization", item: "https://pmread.rohanyeole.com/tools/feature-prioritization" },
      ],
    },
  ],
};

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "User Story Generator", href: "/tools/user-story-generator" },
  { name: "Persona Generator", href: "/tools/persona-generator" },
];

export default function FeaturePrioritizationPage() {
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
            <Link href="/tools" className="hover:text-gray-600">Tools</Link>
            <span>/</span>
            <span className="text-gray-600">Feature Prioritization</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Feature Prioritization (RICE)
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Score your product backlog using the RICE framework. Enter features with Reach,
              Impact, Confidence, and Effort — get a ranked priority list instantly.
              No signup, no AI required.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <FeaturePrioritizationTool />
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">How RICE scoring works</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              RICE is a prioritization framework created by Intercom that scores features on four
              factors to produce a single comparable number:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { letter: "R", name: "Reach", desc: "How many users will this impact per quarter? Use real data from analytics where possible." },
                { letter: "I", name: "Impact", desc: "How much will this move the needle for each user? Scale: 3× massive, 2× high, 1× medium, 0.5× low, 0.25× minimal." },
                { letter: "C", name: "Confidence", desc: "How confident are you in your estimates? 100% = high confidence, 80% = medium, 50% = low." },
                { letter: "E", name: "Effort", desc: "How many person-months will this take? Be honest — effort kills more projects than low impact." },
              ].map(({ letter, name, desc }) => (
                <div key={letter} className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-[#7F77DD]/10 text-[#7F77DD] font-bold text-sm flex items-center justify-center">
                      {letter}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">{name}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
              <p className="text-sm font-mono text-gray-700">
                RICE Score = (Reach × Impact × Confidence%) ÷ Effort
              </p>
            </div>
          </div>

          {/* FAQ */}
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

          {/* Platform CTA */}
          <div className="mt-12 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Want AI insights from your actual customer data?
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              PMRead ingests PDFs, audio, Zoom transcripts, Slack channels, and GitHub — and
              generates PRDs grounded in real evidence, not guesses.
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
                <Link
                  key={t.href}
                  href={t.href}
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white"
                >
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
