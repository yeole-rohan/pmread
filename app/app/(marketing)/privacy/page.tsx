import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — PMRead" },
  description:
    "PMRead's privacy policy. How we collect, use, and protect your data.",
  alternates: { canonical: SITE_URL + '/privacy' },
  robots: { index: true, follow: true },
};

// Update LAST_UPDATED whenever this document changes
const LAST_UPDATED = "16 April 2026";
const CONTACT_EMAIL = "rohan.yeole@rohanyeole.com";
const COMPANY_NAME = "PMRead";
const COMPANY_LOCATION = "India";

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "1. Information we collect",
    content: [
      {
        sub: "Account information",
        text: "When you register, we collect your email address and optionally your display name. We store a hashed version of your password — we never store it in plain text.",
      },
      {
        sub: "Content you upload",
        text: "Files, transcripts, and text you upload are stored securely and used only to extract insights and generate PRDs for your projects. We do not read your content for any other purpose.",
      },
      {
        sub: "Usage data",
        text: "We collect anonymised data about how you use PMRead (pages visited, features used, error events) via Google Analytics. This data does not include the content of your files or insights.",
      },
      {
        sub: "Billing information",
        text: "Payments are processed by Razorpay. PMRead does not store your card details. We receive a transaction reference and your plan status from Razorpay.",
      },
      {
        sub: "Integration tokens",
        text: "If you connect GitHub or Slack, we store access tokens required to fetch your data. These are encrypted at rest and used only when you explicitly trigger an import.",
      },
    ],
  },
  {
    id: "how-we-use-it",
    title: "2. How we use your information",
    bullets: [
      "To provide the PMRead service — extract insights, generate PRDs, and store your project data.",
      "To send transactional emails (e.g., email verification, password reset, billing receipts). We do not send marketing emails without your explicit opt-in.",
      "To improve the product using aggregated, anonymised usage analytics.",
      "To respond to support requests.",
      "We do not use your uploaded content to train AI models.",
      "We do not sell, rent, or share your personal data with third parties for marketing purposes.",
    ],
  },
  {
    id: "data-storage",
    title: "3. Data storage and security",
    content: [
      {
        sub: "Where your data is stored",
        text: "PMRead data is stored on cloud infrastructure hosted in data centers with industry-standard physical and network security. [ Update with specific region — e.g., AWS ap-south-1 — before launch. ]",
      },
      {
        sub: "Encryption",
        text: "Data is encrypted in transit using TLS 1.2+. Sensitive data (passwords, API keys, integration tokens) is encrypted at rest.",
      },
      {
        sub: "Retention",
        text: "We retain your account data and project content for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required by law to retain it.",
      },
    ],
  },
  {
    id: "third-parties",
    title: "4. Third-party services",
    bullets: [
      "Razorpay — payment processing. Subject to Razorpay's privacy policy.",
      "Google Analytics — anonymised usage analytics. You can opt out via browser extensions.",
      "Anthropic / xAI — AI generation. Your content is sent to these APIs to generate insights and PRDs. Content is not retained by these providers for training (governed by their enterprise terms).",
      "OpenAI — embedding generation for semantic search (optional). Same data handling principle applies.",
      "GitHub / Slack — only when you explicitly connect these integrations.",
    ],
  },
  {
    id: "your-rights",
    title: "5. Your rights",
    content: [
      {
        sub: "Access",
        text: "You can export all your project data at any time from within PMRead (Settings → Export data). [ Feature coming soon — add export endpoint before launch. ]",
      },
      {
        sub: "Deletion",
        text: "You can delete individual projects, files, and insights from within PMRead. To delete your entire account and all associated data, email us at " + CONTACT_EMAIL + " with the subject \"Delete my account\".",
      },
      {
        sub: "Correction",
        text: "You can update your email address and display name from Settings.",
      },
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies",
    text: "PMRead uses a single cookie to maintain your session (authentication token). We use Google Analytics which sets its own cookies for analytics. We do not use advertising cookies or tracking pixels. You can disable cookies in your browser, but core functionality (logging in) will not work without the session cookie.",
  },
  {
    id: "children",
    title: "7. Children's privacy",
    text: "PMRead is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us.",
  },
  {
    id: "changes",
    title: "8. Changes to this policy",
    text: "We may update this policy from time to time. Material changes will be notified by email to registered users at least 14 days before taking effect. The current policy is always available at pmread.org/privacy.",
  },
  {
    id: "contact",
    title: "9. Contact",
    text: `If you have questions about this privacy policy or want to exercise your data rights, contact us at ${CONTACT_EMAIL}. ${COMPANY_NAME}, ${COMPANY_LOCATION}.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <p className="text-gray-600 mb-10 leading-relaxed">
          {COMPANY_NAME} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
          &ldquo;us&rdquo;) is committed to protecting your privacy. This
          policy explains what data we collect, how we use it, and your rights.
          By using PMRead, you agree to the practices described here.
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

              {content &&
                content.map(({ sub, text: t }) => (
                  <div key={sub} className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {sub}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t}</p>
                  </div>
                ))}

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

              {text && (
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              )}
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
            <Link href="/terms" className="hover:text-gray-700 transition-colors">
              Terms of Service
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
