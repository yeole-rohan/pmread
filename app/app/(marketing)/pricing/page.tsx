import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import PricingPlans from "@/components/PricingPlans";
import PricingVsStack from "@/components/PricingVsStack";

export const metadata: Metadata = {
  title: { absolute: "Pricing — PMRead" },
  description:
    "PMRead pricing — free AI PRD generator plan with paid tiers for growing product teams. No credit card required to start turning customer feedback into PRDs.",
  alternates: { canonical: SITE_URL + '/pricing' },
  openGraph: {
    title: "Pricing — PMRead",
    description:
      "Start free with 2 PRDs/month. Upgrade to Pro for ₹1,699/month.",
    url: SITE_URL + '/pricing',
  },
};

const CONTACT_EMAIL = "rohan.yeole@rohanyeole.com";

const faqItems = [
  {
    q: "What's the difference between Pro and Teams?",
    a: "Pro is for individual PMs — 15 PRDs/month, all integrations, and export. Teams adds 5 seats (60 PRDs/month), a shared workspace, a team decision log, and priority support. Studio is for larger orgs needing SSO, compliance audit trails, and a dedicated success manager.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings at any time. Your access continues until the end of the current billing period — no partial-month charges.",
  },
  {
    q: "Are there refunds?",
    a: "All purchases are non-refundable. You can cancel before your next billing date to avoid future charges. If you believe there has been a billing error, contact us and we will investigate.",
  },
  {
    q: "What counts as a PRD?",
    a: "Each time you generate a new PRD document from your insights, that counts as one. Editing, exporting, re-viewing, or pushing to Jira/Linear does not count.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual billing charges you for 10 months upfront — Pro at ₹16,990/year (saving ₹3,398), Teams at ₹1,19,990/year. You can toggle between monthly and annual on this page before subscribing.",
  },
  {
    q: "What file formats are supported?",
    a: "All plans support PDF, DOCX, TXT, MP3, MP4, and M4A uploads. Pro and above add Slack channel ingestion and GitHub repository indexing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Razorpay. You can pay with UPI, credit card, debit card, or net banking. INR pricing is shown — international cards are supported.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your files and insights are stored securely and are never used to train AI models. We do not share your data with third parties.",
  },
  {
    q: "What is Studio and who is it for?",
    a: "Studio is for agencies, consulting firms, and enterprise teams running multiple product lines. It includes unlimited PRDs and seats, SSO/SAML, compliance audit trails, Azure DevOps integration, and a dedicated success manager. Pricing is tailored — email us to discuss.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  keywords:
    "prd generator pricing, ai prd tool india, product management software india, pm tool free plan, productboard alternative pricing",
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
              Start free. Upgrade when you need more PRDs, team collaboration, or enterprise controls.
            </p>
          </div>
        </section>

        {/* ── Plans + comparison table (interactive toggle) ────────────── */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <PricingPlans />
          </div>
        </section>

        {/* ── Competitive justification ─────────────────────────────────── */}
        <PricingVsStack />

        {/* ── Sample output trust signal ───────────────────────────────── */}
        <section className="pt-12 pb-12 sm:pt-16 sm:pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-gray-500">
              Not sure what you&apos;ll get?{" "}
              <Link href="/sample-prd" className="text-[#7F77DD] hover:underline font-medium">
                See a real sample PRD →
              </Link>{" "}
              Generated from 22 customer interviews, with every requirement traced back to evidence.
            </p>
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
