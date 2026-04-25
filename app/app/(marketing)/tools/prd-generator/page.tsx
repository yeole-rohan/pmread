import { SITE_URL, TWITTER_HANDLE } from "@/lib/site";
import type { Metadata } from "next";
import PRDGeneratorTool from "./PRDGeneratorTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Free AI PRD Generator | PMRead" },
  description:
    "Generate a full product requirements document from a problem statement in seconds. Free AI PRD generator — no signup required.",
  alternates: { canonical: `${SITE_URL}/tools/prd-generator` },
  openGraph: {
    title: "Free AI PRD Generator | PMRead",
    description: "Turn a problem statement into a full PRD with user stories, acceptance criteria, and success metrics.",
    url: `${SITE_URL}/tools/prd-generator`,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "Free AI PRD Generator | PMRead",
    description: "Turn a problem statement into a full PRD with user stories, acceptance criteria, and success metrics.",
  },
};

const FAQS = [
  {
    q: "Is this PRD generator free?",
    a: "Yes, completely free. No signup, no account, and no credit card required.",
  },
  {
    q: "What is a product requirements document (PRD)?",
    a: "A PRD defines the problem a feature solves, who it is for, what it does, and how success is measured. It aligns engineering, design, and business stakeholders before any code is written.",
  },
  {
    q: "How detailed should my problem statement be?",
    a: "The more specific the better. Include who the user is, what they are trying to do, and what is currently painful. A sentence or two is enough — use the optional fields for extra context.",
  },
  {
    q: "Can I edit the generated PRD?",
    a: "Yes. Copy the result into Notion, Google Docs, or any editor. The Download button exports a .md file you can open anywhere.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free AI PRD Generator",
      applicationCategory: "BusinessApplication",
      description: "Generate a product requirements document from a problem statement using AI. Includes user stories, acceptance criteria, and success metrics.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: `${SITE_URL}/tools/prd-generator`,
      keywords:
        "free prd generator, ai prd generator free, free ai prd generator no signup, generate prd online free, product requirements document generator, ai prd writer",
    },
    {
      "@type": "HowTo",
      name: "How to generate a PRD with AI",
      description: "Generate a product requirements document from a problem statement in seconds.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Describe the problem", text: "Paste your problem statement — who the user is, what they are trying to do, and what is broken or painful today." },
        { "@type": "HowToStep", position: 2, name: "Add optional context", text: "Optionally specify target users and any additional context such as platform or constraints." },
        { "@type": "HowToStep", position: 3, name: "Generate", text: "Click Generate PRD. The AI writes a structured PRD with user stories, acceptance criteria, and success metrics." },
        { "@type": "HowToStep", position: 4, name: "Copy or download", text: "Copy the result to your clipboard or download it as a Markdown file." },
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
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: "PRD Generator", item: `${SITE_URL}/tools/prd-generator` },
      ],
    },
  ],
};

const OTHER_TOOLS = [
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "User Story Generator", href: "/tools/user-story-generator" },
  { name: "Persona Generator", href: "/tools/persona-generator" },
  { name: "Feature Prioritization", href: "/tools/feature-prioritization" },
];

export default function PRDGeneratorPage() {
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
            <span className="text-gray-600">PRD Generator</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              AI PRD Generator
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Paste your problem statement and get a structured product requirements document
              — problem, user stories, acceptance criteria, and success metrics — in seconds.
              No signup required.
            </p>
          </div>

          {/* Tool */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <PRDGeneratorTool />
          </div>

          {/* What is a PRD */}
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What is a PRD?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              A <strong>product requirements document (PRD)</strong> defines the problem a product
              feature solves, who it is for, and what success looks like. It aligns engineering,
              design, and business stakeholders before any code is written.
            </p>
            <h2 className="text-xl font-bold text-gray-900 pt-2">What this tool generates</h2>
            <ul className="space-y-1.5 text-sm text-gray-600 list-disc pl-5">
              <li>Problem statement — the core pain in one paragraph</li>
              <li>Target users — who this is for and why</li>
              <li>User stories — in "As a / I want / So that" format</li>
              <li>Acceptance criteria — testable conditions for each story</li>
              <li>Success metrics — measurable KPIs</li>
              <li>Out of scope — explicit non-goals to prevent scope creep</li>
            </ul>
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

          {/* Other tools */}
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
