import type { Metadata } from "next";
import Link from "next/link";
import PricingPlans from "@/components/PricingPlans";

export const metadata: Metadata = {
  title: "Pricing — PMRead",
  description:
    "Start free with 2 PRDs/month. Upgrade to Pro for ₹1,699/month and unlock 15 PRDs, Slack ingestion, GitHub context, and PDF export.",
  alternates: { canonical: "https://pmread.rohanyeole.com/pricing" },
  openGraph: {
    title: "Pricing — PMRead",
    description:
      "Start free with 2 PRDs/month. Upgrade to Pro for ₹1,699/month.",
    url: "https://pmread.rohanyeole.com/pricing",
  },
};

const CONTACT_EMAIL = "rohan.yeole@rohanyeole.com";

const faqItems = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings at any time. Your Pro access continues until the end of the current billing period — no partial-month charges.",
  },
  {
    q: "Are there refunds?",
    a: "All purchases are non-refundable. You can cancel before your next billing date to avoid future charges, but we do not issue refunds for the current or past periods. If you believe there has been a billing error, contact us and we will investigate.",
  },
  {
    q: "What counts as a PRD?",
    a: "Each time you generate a new PRD document from your insights, that counts as one PRD. Editing, exporting, or re-viewing an existing PRD does not count.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your files and insights are stored securely and are never used to train AI models. We do not share your data with third parties. See our Privacy Policy for details.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Razorpay for payments. You can pay with UPI, credit card, debit card, or net banking. INR pricing is shown — international cards are supported.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual billing charges you for 10 months upfront (₹16,990/year), giving you 2 months free compared to monthly billing. You can toggle between monthly and annual on this page before signing up.",
  },
  {
    q: "What file formats are supported?",
    a: "Free plan supports PDF, DOCX, TXT, MP3, MP4, and M4A. Pro adds Slack channel exports and GitHub repository indexing.",
  },
  {
    q: "Is there a team plan?",
    a: "Team plans are on the roadmap. If you have a team of 3 or more PMs, reach out and we can discuss pricing.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="pt-16 pb-10 sm:pt-20 sm:pb-14 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-500">
              Start free. Upgrade when you need more.
            </p>
          </div>
        </section>

        {/* ── Plans + comparison table (interactive toggle) ────────────── */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <PricingPlans />
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {faqItems.map(({ q, a }) => (
                <div
                  key={q}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <dt className="font-semibold text-gray-900 mb-2">{q}</dt>
                  <dd className="text-gray-500 text-sm leading-relaxed">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-[#7F77DD]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-purple-200 mb-8">
              Email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white underline hover:no-underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              — we reply within one business day.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3.5 bg-white text-[#7F77DD] font-semibold rounded-xl hover:bg-purple-50 transition-colors"
            >
              Get started free →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
