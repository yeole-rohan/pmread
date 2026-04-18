import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Product Management Tools — No Signup Required | PMRead",
  description:
    "Free AI tools for product managers: PRD generator, feedback analyzer, user story generator, persona creator, RICE calculator, meeting cost calculator, metric story generator, and PM interview prep.",
  alternates: { canonical: "https://pmread.rohanyeole.comanyeole.com/tools" },
  openGraph: {
    title: "Free PM Tools | PMRead",
    description: "Free AI tools for product managers — PRD generator, feedback analyzer, user story generator, persona creator, and RICE calculator. No signup required.",
    url: "https://pmread.rohanyeole.comanyeole.com/tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PM Tools | PMRead",
    description: "Free AI tools for product managers — PRD generator, feedback analyzer, user story generator, persona creator, and RICE calculator.",
  },
};

const TOOLS = [
  {
    href: "/tools/prd-generator",
    name: "PRD Generator",
    desc: "Paste a problem statement → get a full product requirements document with user stories, acceptance criteria, and success metrics.",
    tag: "AI",
    cta: "Generate PRD →",
  },
  {
    href: "/tools/feedback-analyzer",
    name: "Feedback Analyzer",
    desc: "Paste raw customer feedback → extract key themes, pain points, feature requests, and recommended actions.",
    tag: "AI",
    cta: "Analyze feedback →",
  },
  {
    href: "/tools/user-story-generator",
    name: "User Story Generator",
    desc: "Describe a feature → get user stories in 'As a / I want / So that' format with Given/When/Then acceptance criteria.",
    tag: "AI",
    cta: "Generate stories →",
  },
  {
    href: "/tools/persona-generator",
    name: "Persona Generator",
    desc: "Paste bullet points about your user → get a complete persona card with goals, frustrations, a memorable quote, and tools they use.",
    tag: "AI",
    cta: "Build persona →",
  },
  {
    href: "/tools/feature-prioritization",
    name: "Feature Prioritization (RICE)",
    desc: "Enter features with Reach, Impact, Confidence, and Effort → get a ranked priority list. No AI — pure RICE math.",
    tag: "Calculator",
    cta: "Prioritize features →",
  },
  {
    href: "/tools/meeting-cost-calculator",
    name: "Meeting Cost Calculator",
    desc: "Enter attendees, salary, and duration → see the real cost of your meeting and what you could have done instead. No AI — pure math.",
    tag: "Calculator",
    cta: "Calculate cost →",
  },
  {
    href: "/tools/metric-story-generator",
    name: "Metric Story Generator",
    desc: "Paste raw product metrics → get a clear narrative: what changed, why it likely happened, and what to do next.",
    tag: "AI",
    cta: "Generate story →",
  },
  {
    href: "/tools/interview-prep",
    name: "PM Interview Prep",
    desc: "Paste a job description + your resume → get 5–10 likely interview questions with answers grounded strictly in your own experience. No invented achievements.",
    tag: "AI",
    cta: "Prep for interview →",
  },
];

const FAQS = [
  {
    q: "Are all these tools really free?",
    a: "Yes. All eight tools are free with no signup, no account, and no credit card required.",
  },
  {
    q: "Do these tools use AI?",
    a: "Six tools use AI (PRD Generator, Feedback Analyzer, User Story Generator, Persona Generator, Metric Story Generator, PM Interview Prep). Feature Prioritization and Meeting Cost Calculator are pure math — no AI needed.",
  },
  {
    q: "What is PMRead?",
    a: "PMRead is a product management tool that ingests customer interviews, feedback files, Slack channels, and GitHub — and generates PRDs grounded in real evidence. The free tools here are a lighter, manual version of what PMRead does automatically.",
  },
  {
    q: "Do I need to sign up to use these tools?",
    a: "No. All tools work without an account. Sign up for PMRead if you want AI insights from your actual customer data, not just pasted text.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Free Product Management Tools",
      description: "Free AI tools for product managers — no signup required.",
      url: "https://pmread.rohanyeole.comanyeole.com/tools",
      numberOfItems: TOOLS.length, // auto-computed from TOOLS array
      itemListElement: TOOLS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: `https://pmread.rohanyeole.comanyeole.com${t.href}`,
        description: t.desc,
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pmread.rohanyeole.comanyeole.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://pmread.rohanyeole.comanyeole.com/tools" },
      ],
    },
  ],
};

export default function ToolsPage() {
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
            <span className="text-gray-600">Tools</span>
          </nav>

          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tools
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Free tools for product managers
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Eight tools to help you write PRDs, analyze feedback, generate user stories,
              build personas, prioritize features, calculate meeting costs, turn metrics into narratives, and prep for PM interviews. No signup required.
            </p>
          </div>

          <div className="space-y-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group block bg-white rounded-2xl border border-gray-200 hover:border-[#7F77DD]/40 hover:shadow-sm p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-base font-semibold text-gray-900 group-hover:text-[#7F77DD] transition-colors">
                        {tool.name}
                      </h2>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {tool.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#7F77DD] group-hover:translate-x-0.5 transition-transform mt-0.5 whitespace-nowrap">
                    {tool.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-14">
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
        </div>
      </main>
    </>
  );
}
