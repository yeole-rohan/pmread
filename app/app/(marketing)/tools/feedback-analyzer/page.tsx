import type { Metadata } from "next";
import FeedbackAnalyzerTool from "./FeedbackAnalyzerTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Customer Feedback Analyzer — Extract Themes & Pain Points | PMRead",
  description:
    "Paste raw customer feedback and instantly extract key themes, pain points, and feature requests. Free AI feedback analysis tool — no signup required.",
  alternates: { canonical: "https://pmread.rohanyeole.comanyeole.com/tools/feedback-analyzer" },
  openGraph: {
    title: "Free Customer Feedback Analyzer | PMRead",
    description: "Paste raw feedback and get structured themes, pain points, feature requests, and recommended actions in seconds.",
    url: "https://pmread.rohanyeole.comanyeole.com/tools/feedback-analyzer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Customer Feedback Analyzer | PMRead",
    description: "Paste raw feedback and get structured themes, pain points, feature requests, and recommended actions in seconds.",
  },
};

const FAQS = [
  {
    q: "What types of feedback can I paste?",
    a: "Any text — survey responses, NPS comments, interview notes, support tickets, Slack messages, or app store reviews. Mix sources freely.",
  },
  {
    q: "How much feedback should I paste for good results?",
    a: "5–20 entries is the sweet spot. Too few (1–2) and there are no patterns to find. For larger volumes, split into batches of 20–30.",
  },
  {
    q: "Is this feedback analyzer free?",
    a: "Yes, completely free. No signup, no account, and no credit card required.",
  },
  {
    q: "How is this different from PMRead's full product?",
    a: "This tool works on text you paste manually. PMRead automatically ingests your files, Zoom transcripts, Slack channels, and GitHub — and keeps insights updated continuously as new feedback arrives.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free Customer Feedback Analyzer",
      applicationCategory: "BusinessApplication",
      description: "AI tool that extracts themes, pain points, and feature requests from raw customer feedback. Free, no signup required.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: "https://pmread.rohanyeole.comanyeole.com/tools/feedback-analyzer",
    },
    {
      "@type": "HowTo",
      name: "How to analyze customer feedback with AI",
      description: "Extract themes, pain points, and recommended actions from raw customer feedback in seconds.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Collect your feedback", text: "Gather raw feedback from surveys, interviews, support tickets, or Slack messages. One entry per line works best." },
        { "@type": "HowToStep", position: 2, name: "Paste into the tool", text: "Paste all feedback into the text area. Mix sources freely — the AI handles it." },
        { "@type": "HowToStep", position: 3, name: "Analyze", text: "Click Analyze Feedback. The AI identifies themes, pain points, feature requests, and recommended actions." },
        { "@type": "HowToStep", position: 4, name: "Copy or download", text: "Copy the structured analysis or download it as a Markdown file to share with your team." },
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pmread.rohanyeole.comanyeole.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://pmread.rohanyeole.comanyeole.com/tools" },
        { "@type": "ListItem", position: 3, name: "Feedback Analyzer", item: "https://pmread.rohanyeole.comanyeole.com/tools/feedback-analyzer" },
      ],
    },
  ],
};

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "User Story Generator", href: "/tools/user-story-generator" },
  { name: "Persona Generator", href: "/tools/persona-generator" },
  { name: "Feature Prioritization", href: "/tools/feature-prioritization" },
];

export default function FeedbackAnalyzerPage() {
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
            <span className="text-gray-600">Feedback Analyzer</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Customer Feedback Analyzer
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Paste raw customer feedback — survey responses, interview notes, support tickets,
              or Slack messages — and get structured themes, pain points, and recommended actions
              in seconds. No signup required.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <FeedbackAnalyzerTool />
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">How to use this tool</h2>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
              <li>Paste any raw customer feedback — one response per line works best</li>
              <li>Mix sources freely: interview notes, NPS responses, support emails, Slack messages</li>
              <li>Click Analyze — the AI identifies patterns across all entries</li>
              <li>Copy or download the structured analysis as Markdown</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 pt-2">What you get</h2>
            <ul className="space-y-1.5 text-sm text-gray-600 list-disc pl-5">
              <li><strong>Key themes</strong> — recurring topics across all feedback</li>
              <li><strong>Pain points</strong> — what is frustrating users most</li>
              <li><strong>Feature requests</strong> — what users are asking for</li>
              <li><strong>Positive signals</strong> — what is working and worth preserving</li>
              <li><strong>Top 3 recommended actions</strong> — prioritized next steps</li>
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
