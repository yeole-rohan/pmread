import type { Metadata } from "next";
import Link from "next/link";
import InterviewPrepTool from "./InterviewPrepTool";

import { SITE_URL as BASE, TWITTER_HANDLE } from "@/lib/site";

export const metadata: Metadata = {
  title: "PM Interview Prep Tool — Questions from JD + Resume",
  description:
    "Free AI tool for product managers. Paste a job description and your resume — get 5–10 likely interview questions with strong answers grounded in your actual experience. No signup required.",
  alternates: { canonical: `${BASE}/tools/interview-prep` },
  openGraph: {
    title: "PM Interview Prep Tool | PMRead",
    description: "Paste a JD + your resume → get likely PM interview questions with answers grounded in your real experience. Free, no signup.",
    url: `${BASE}/tools/interview-prep`,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "PM Interview Prep Tool | PMRead",
    description: "Paste a JD + your resume → get likely PM interview questions with answers from your own experience. Free.",
  },
};

const FAQS = [
  {
    q: "Will the answers be made up?",
    a: "No. The AI is instructed to use only what you provide in the resume/experience field. If something isn't in your background, it will say so — and suggest how to frame what you do have. No invented metrics or projects.",
  },
  {
    q: "Do I need to paste my full resume?",
    a: "No. Bullet points summarising your roles, key projects, and achievements work just as well — often better. The more specific your experience, the more specific the answers.",
  },
  {
    q: "What types of questions does it generate?",
    a: "Behavioral (STAR format), product design, metrics and analytical, and strategy questions — weighted towards what the JD actually emphasises. A JD focused on growth will produce more analytics and experimentation questions.",
  },
  {
    q: "Can I use this without a resume?",
    a: "Yes. Leave the resume field empty and the tool generates questions from the JD alone, with notes on what experience you'd want to demonstrate for each.",
  },
  {
    q: "Is this free?",
    a: "Yes. No account, no signup, no credit card required.",
  },
];

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "User Story Generator", href: "/tools/user-story-generator" },
  { name: "Persona Generator", href: "/tools/persona-generator" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "PM Interview Prep Tool",
      applicationCategory: "BusinessApplication",
      description: "Free AI tool that generates likely PM interview questions from a job description and resume — with answers grounded in your real experience.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: `${BASE}/tools/interview-prep`,
      keywords:
        "pm interview prep tool, product manager interview questions generator, pm interview practice ai, product manager interview prep, pm interview questions from jd",
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
        { "@type": "ListItem", position: 3, name: "PM Interview Prep", item: `${BASE}/tools/interview-prep` },
      ],
    },
  ],
};

export default function InterviewPrepPage() {
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
            <span className="text-gray-600">PM Interview Prep</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              PM Interview Prep
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Paste a job description and your resume. Get 5–10 likely interview
              questions with strong answers grounded strictly in your own
              experience — not generic advice.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <InterviewPrepTool />
          </div>

          <div className="mt-12 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">What you get</h2>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li><strong>5–10 questions</strong> specific to the JD — not a generic list every PM has memorised</li>
              <li><strong>Answers from your resume</strong> — the AI only uses what you provide, no fabricated achievements</li>
              <li><strong>Question type mix</strong> — behavioral, product design, metrics, and strategy weighted by JD emphasis</li>
              <li><strong>Gap flagging</strong> — if your background doesn&apos;t match a requirement, the tool says so and suggests how to frame what you have</li>
              <li><strong>Markdown output</strong> — copy to Notion, Google Docs, or download as a file</li>
            </ul>
          </div>

          <div className="mt-10 rounded-xl bg-amber-50 border border-amber-100 p-5">
            <p className="text-sm font-semibold text-amber-800 mb-1">How to get the best results</p>
            <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
              <li>Paste the full JD including requirements and responsibilities — the more detail, the more targeted the questions</li>
              <li>Add specific metrics and outcomes to your resume bullets — &quot;improved activation by 17%&quot; gives better answers than &quot;improved onboarding&quot;</li>
              <li>Run it twice: once for behavioral questions, once with focus area &quot;product design&quot; added to the JD field</li>
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
              Already got the job? Ship better PRDs.
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              PMRead turns customer interviews, Slack threads, and call recordings into
              evidence-backed PRDs — in minutes. Built for Indian PMs, priced in INR.
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
