import type { Metadata } from "next";
import Link from "next/link";
import MeetingCostCalculatorTool from "./MeetingCostCalculatorTool";

const BASE = "https://pmread.rohanyeole.com";

export const metadata: Metadata = {
  title: "Meeting Cost Calculator — See What Your Meetings Really Cost | PMRead",
  description:
    "Free meeting cost calculator for product managers. Enter attendees, salary, and duration to see the real cost of your meeting — and how many PRDs you could have written instead.",
  alternates: { canonical: `${BASE}/tools/meeting-cost-calculator` },
  openGraph: {
    title: "Meeting Cost Calculator | PMRead",
    description: "How much is that standup actually costing? Free calculator — no signup required.",
    url: `${BASE}/tools/meeting-cost-calculator`,
  },
};

const FAQS = [
  {
    q: "How is the meeting cost calculated?",
    a: "Annual salary ÷ 52 weeks ÷ 40 hours = hourly rate per person. That's multiplied by the number of attendees and the meeting duration in hours. Straightforward fully-loaded time cost.",
  },
  {
    q: "Should I use CTC or take-home salary?",
    a: "Use CTC (Cost to Company) for the most accurate number — it reflects the actual cost to the organisation, including benefits and overhead. Take-home will underestimate the real cost.",
  },
  {
    q: "What does 'PRDs you could generate' mean?",
    a: "A rough estimate of how many PRDs a PM could produce in the same amount of billable time, assuming ~2 hours of PM time per PRD. It's a framing device, not a precise calculation.",
  },
  {
    q: "This feels uncomfortable. Is that the point?",
    a: "Yes. Research shows that making meeting costs visible — even roughly — nudges teams to reconsider whether every participant needs to attend and whether the meeting could be async instead.",
  },
];

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "Metric Story Generator", href: "/tools/metric-story-generator" },
  { name: "Feature Prioritization", href: "/tools/feature-prioritization" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Meeting Cost Calculator",
      applicationCategory: "BusinessApplication",
      description: "Free calculator that shows the real cost of a meeting based on attendees, salary, and duration.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: `${BASE}/tools/meeting-cost-calculator`,
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
        { "@type": "ListItem", position: 3, name: "Meeting Cost Calculator", item: `${BASE}/tools/meeting-cost-calculator` },
      ],
    },
  ],
};

export default function MeetingCostCalculatorPage() {
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
            <span className="text-gray-600">Meeting Cost Calculator</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meeting Cost Calculator
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Enter your meeting details and see the real cost in seconds.
              No AI, no fluff — just the math your calendar doesn&apos;t show you.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <MeetingCostCalculatorTool />
          </div>

          <div className="mt-12 space-y-4 text-sm text-gray-600">
            <h2 className="text-xl font-bold text-gray-900">Why this matters</h2>
            <p>
              Research shows professionals spend over a third of their working hours in meetings.
              For managers with four or more direct reports, that number exceeds 22 hours per week —
              with an estimated <strong>$42,000 per manager, per year</strong> in wasted time.
            </p>
            <p>
              The problem isn&apos;t meetings themselves. It&apos;s that the cost is invisible.
              This calculator makes it visible — which is the first step toward fixing it.
            </p>
            <p className="text-xs text-gray-400 italic">
              Source: Workplace productivity research. Cited by Shreyas Doshi (LNO Framework) and
              organisational efficiency studies.
            </p>
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
              Reclaim that time with better PRDs
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              A good PRD eliminates the alignment meetings that exist to compensate for a bad spec.
              PMRead generates evidence-backed PRDs from your customer data in minutes.
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
