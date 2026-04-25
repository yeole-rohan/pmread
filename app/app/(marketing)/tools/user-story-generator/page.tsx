import { SITE_URL, TWITTER_HANDLE } from "@/lib/site";
import type { Metadata } from "next";
import UserStoryGeneratorTool from "./UserStoryGeneratorTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Free AI User Story Generator | PMRead" },
  description:
    "Generate user stories and acceptance criteria from a feature description. Free AI user story generator for product managers — no signup required.",
  alternates: { canonical: `${SITE_URL}/tools/user-story-generator` },
  openGraph: {
    title: "Free AI User Story Generator | PMRead",
    description: "Describe a feature and get user stories in 'As a / I want / So that' format with Given/When/Then acceptance criteria.",
    url: `${SITE_URL}/tools/user-story-generator`,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "Free AI User Story Generator | PMRead",
    description: "Describe a feature and get user stories in 'As a / I want / So that' format with Given/When/Then acceptance criteria.",
  },
};

const FAQS = [
  {
    q: "What format are user stories generated in?",
    a: "Each story follows the standard format: 'As a [user], I want [action] so that [benefit].' Each story also includes Given/When/Then acceptance criteria and a shared definition of done.",
  },
  {
    q: "How specific should my feature description be?",
    a: "Specific enough to convey intent but not implementation. 'Allow users to export their dashboard as a PDF' is ideal. 'Build a PDF export feature' is too vague. Include who the user is and why they need it.",
  },
  {
    q: "What is the difference between a user story and a task?",
    a: "A user story describes what a user needs and why — it belongs in planning. A task describes what an engineer does — it belongs in sprint tickets. This tool generates stories, not tasks.",
  },
  {
    q: "Is this user story generator free?",
    a: "Yes, completely free. No signup, no account, and no credit card required.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free AI User Story Generator",
      applicationCategory: "BusinessApplication",
      description: "Generate user stories and acceptance criteria from a feature description using AI. Free, no signup required.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: `${SITE_URL}/tools/user-story-generator`,
      keywords:
        "free user story generator, user story generator ai, agile user story creator free, acceptance criteria generator free, as a i want so that generator",
    },
    {
      "@type": "HowTo",
      name: "How to generate user stories with AI",
      description: "Generate well-formed user stories and acceptance criteria from a feature description.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Describe the feature", text: "Write a clear description of the feature — what the user needs and why. Include the outcome, not the implementation." },
        { "@type": "HowToStep", position: 2, name: "Specify the user role", text: "Optionally enter the primary user role (e.g. product manager, admin, end user) for more targeted stories." },
        { "@type": "HowToStep", position: 3, name: "Generate", text: "Click Generate User Stories. The AI produces 4–6 stories with full Given/When/Then acceptance criteria." },
        { "@type": "HowToStep", position: 4, name: "Copy or download", text: "Copy the stories into Jira, Linear, or any tool. Download as Markdown for documentation." },
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
        { "@type": "ListItem", position: 3, name: "User Story Generator", item: `${SITE_URL}/tools/user-story-generator` },
      ],
    },
  ],
};

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "Persona Generator", href: "/tools/persona-generator" },
  { name: "Feature Prioritization", href: "/tools/feature-prioritization" },
];

export default function UserStoryGeneratorPage() {
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
            <span className="text-gray-600">User Story Generator</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              User Story Generator
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Describe a feature and get well-formed user stories in "As a / I want / So that"
              format, complete with Given/When/Then acceptance criteria and a definition of done.
              No signup required.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <UserStoryGeneratorTool />
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What makes a good user story?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Good user stories follow the <strong>INVEST</strong> criteria: Independent, Negotiable,
              Valuable, Estimable, Small, and Testable. They describe what a user wants and why —
              not how to build it.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              {[
                { label: "User story format", text: `"As a [user], I want [action] so that [benefit]."` },
                { label: "Acceptance criteria", text: "Given [context], When [action], Then [outcome]." },
                { label: "Definition of done", text: "A checklist confirming the story is truly complete." },
              ].map(({ label, text }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-white p-4">
                  <p className="text-xs font-semibold text-[#7F77DD] mb-1.5">{label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">{text}</p>
                </div>
              ))}
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
