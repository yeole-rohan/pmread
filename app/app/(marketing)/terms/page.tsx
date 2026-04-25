import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service — PMRead" },
  description:
    "PMRead's terms of service. Your rights and responsibilities when using PMRead.",
  alternates: { canonical: SITE_URL + '/terms' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "16 April 2026";
const CONTACT_EMAIL = "rohan.yeole@rohanyeole.com";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of terms",
    text: "By creating an account or using PMRead in any way, you agree to these Terms of Service. If you do not agree, do not use PMRead. We may update these terms from time to time; continued use after changes constitutes acceptance.",
  },
  {
    id: "description",
    title: "2. Description of service",
    text: "PMRead is a web-based tool that uses artificial intelligence to help product managers extract insights from customer research and generate product requirements documents (PRDs). The service is provided as-is, with features and pricing subject to change.",
  },
  {
    id: "accounts",
    title: "3. Accounts",
    bullets: [
      "You must provide a valid email address to register. You are responsible for maintaining the confidentiality of your password.",
      "You are responsible for all activity that occurs under your account.",
      "You must be at least 13 years old to use PMRead.",
      "One person may not maintain more than one free account. Multiple accounts created to circumvent plan limits will be terminated.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    text: "You agree not to:",
    bullets: [
      "Use PMRead to process data you do not have the right to use (e.g., confidential data of third parties without consent).",
      "Attempt to reverse-engineer, scrape, or extract data from PMRead's AI models or APIs.",
      "Use PMRead to generate content that is illegal, defamatory, or infringes third-party intellectual property.",
      "Circumvent, disable, or interfere with security features of the service.",
      "Use automated tools (bots, scripts) to access PMRead in a way that burdens our infrastructure.",
      "Resell or sublicense access to PMRead without written permission.",
    ],
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual property",
    content: [
      {
        sub: "Your content",
        text: "You retain full ownership of all content you upload to PMRead (files, transcripts, etc.) and all PRDs you generate. PMRead does not claim any rights over your content.",
      },
      {
        sub: "PMRead IP",
        text: "The PMRead software, design, brand, and underlying AI models are owned by PMRead. Nothing in these terms grants you a right to use our intellectual property beyond what is necessary to use the service.",
      },
      {
        sub: "Licence to operate",
        text: "By uploading content, you grant PMRead a limited, non-exclusive licence to process that content for the sole purpose of providing the service to you. This licence terminates when you delete the content or your account.",
      },
    ],
  },
  {
    id: "payments",
    title: "6. Payments and refunds",
    bullets: [
      "Pro plan subscriptions are billed monthly or annually in INR via Razorpay.",
      "All purchases are non-refundable. Once a billing period begins, no refund will be issued for that period, including if you cancel mid-period or do not use the service.",
      "If you believe there has been a billing error, contact rohan.yeole@rohanyeole.com within 7 days of the charge and we will investigate.",
      "If a payment fails, your account will be downgraded to the free plan until payment is resolved.",
      "We reserve the right to change pricing with 30 days' notice to active subscribers. Price changes do not apply to the current billing period.",
    ],
  },
  {
    id: "data",
    title: "7. Data handling",
    text: "Our Privacy Policy (pmread.org/privacy) governs how we collect and use your data and is incorporated into these terms by reference.",
  },
  {
    id: "availability",
    title: "8. Availability and uptime",
    text: "We aim for high availability but do not guarantee uninterrupted access. We may perform maintenance that temporarily makes the service unavailable. We are not liable for losses arising from downtime.",
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers and limitation of liability",
    bullets: [
      "PMRead is provided \"as is\" without warranties of any kind, express or implied.",
      "AI-generated PRDs are drafts and starting points — you are responsible for reviewing and validating them before use.",
      "PMRead is not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the service.",
      "Our total liability for any claim arising from these terms is limited to the amount you paid us in the 3 months preceding the claim.",
    ],
  },
  {
    id: "termination",
    title: "10. Termination",
    text: "You may close your account at any time from Settings. We may terminate or suspend your account immediately if you violate these terms. Upon termination, your right to use the service ceases. Sections 5, 9, and 11 survive termination.",
  },
  {
    id: "governing-law",
    title: "11. Governing law",
    text: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [ City, State — e.g., Pune, Maharashtra ]. [ Update before launch with your registered address jurisdiction. ]",
  },
  {
    id: "contact",
    title: "12. Contact",
    text: `For questions about these terms, contact us at ${CONTACT_EMAIL}.`,
  },
];

export default function TermsPage() {
  return (
    <main className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <p className="text-gray-600 mb-10 leading-relaxed">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
          PMRead, operated by PMRead (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;our&rdquo;). Please read them carefully before using the
          service.
        </p>

        {/* Table of contents */}
        <nav
          className="mb-12 p-5 rounded-xl bg-gray-50 border border-gray-100"
          aria-label="Contents"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Contents
          </p>
          <ol className="space-y-1.5">
            {SECTIONS.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm text-[#7F77DD] hover:underline"
                >
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-12">
          {SECTIONS.map(({ id, title, content, bullets, text }) => (
            <section key={id} id={id} className="scroll-mt-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>

              {text && !bullets && (
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              )}

              {text && bullets && (
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {text}
                </p>
              )}

              {bullets && (
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li
                      key={b}
                      className="text-sm text-gray-600 leading-relaxed flex gap-2"
                    >
                      <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {content &&
                content.map(({ sub, text: t }) => (
                  <div key={sub} className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {sub}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t}</p>
                  </div>
                ))}
            </section>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-xs text-gray-400">
            Questions?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#7F77DD] hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
