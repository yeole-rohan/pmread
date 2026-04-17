import type { Metadata } from "next";
import Link from "next/link";
import {
  UploadCloud,
  Sparkles,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

export const metadata: Metadata = {
  title: "PMRead — AI PRD Generator from Customer Feedback",
  description:
    "Upload customer interviews, Slack threads, and docs. AI extracts insights and generates production-ready PRDs your engineers can build from.",
  keywords: [
    "prd generator",
    "ai prd generator",
    "customer feedback analysis tool",
    "prd software",
    "feedback synthesis",
    "product requirements document",
  ],
  alternates: { canonical: "https://pmread.rohanyeole.com" },
  openGraph: {
    title: "PMRead — AI PRD Generator from Customer Feedback",
    description:
      "Upload customer interviews, Slack threads, and docs. AI extracts insights and generates production-ready PRDs your engineers can build from.",
    url: "https://pmread.rohanyeole.com",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "PMRead",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://pmread.rohanyeole.com",
      description:
        "AI-powered PRD generator that turns customer feedback into production-ready product requirements documents",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "INR", name: "Free plan" },
        { "@type": "Offer", price: "999", priceCurrency: "INR", name: "Pro plan" },
      ],
    },
    {
      "@type": "Organization",
      name: "PMRead",
      url: "https://pmread.rohanyeole.com",
      foundingLocation: "India",
      contactPoint: {
        "@type": "ContactPoint",
        email: "rohan.yeole@rohanyeole.com",
        contactType: "customer support",
      },
    },
  ],
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload your sources",
    desc: "Drag in PDFs, call transcripts, Slack exports, audio, or video. PMRead handles any format — no reformatting needed.",
    icon: UploadCloud,
  },
  {
    step: "02",
    title: "Get instant insights",
    desc: "AI reads everything and extracts what matters: pain points, feature requests, key decisions, and action items — grouped and searchable.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Generate your PRD",
    desc: "Star your key insights, pick a focus area, and get a complete PRD — with user stories, engineering tasks, and real customer quotes.",
    icon: FileCheck,
  },
];

const FEATURES = [
  {
    tag: "Evidence-backed",
    title: "PRDs built on real customer data",
    desc: "Every section links back to actual customer quotes. Not ChatGPT filling in templates — insights extracted from your own research.",
    items: [
      "Pain points with supporting verbatim quotes",
      "Feature requests ranked by mention frequency",
      "Engineering tasks scoped from your actual ask",
    ],
    placeholder: "PRD with evidence quotes",
  },
  {
    tag: "Multi-source",
    title: "All your feedback in one place",
    desc: "Connect every channel where customers talk. PMRead ingests them all and builds a unified insight board across all your sources.",
    items: [
      "PDF uploads: reports, surveys, NPS verbatims",
      "Call transcripts: Zoom, Fireflies, Gong, Loom",
      "Slack channel exports and GitHub codebase context (Pro)",
    ],
    placeholder: "Multi-source ingestion UI",
  },
  {
    tag: "Instant",
    title: "From research to PRD in under 2 minutes",
    desc: "Upload your files, let PMRead extract insights, then generate a complete PRD in one click. What used to take a day takes minutes.",
    items: [
      "Insights extracted in ~30 seconds after upload",
      "One-click PRD generation with streaming output",
      "Ask any question about your research with the Ask tab",
    ],
    placeholder: "PRD generation speed demo",
  },
];

const FREE_TOOLS = [
  {
    name: "PRD Generator",
    href: "/tools/prd-generator",
    desc: "Paste a problem statement → get a full PRD draft",
  },
  {
    name: "Feedback Analyzer",
    href: "/tools/feedback-analyzer",
    desc: "Paste raw feedback → AI extracts themes and pain points",
  },
  {
    name: "Feature Prioritization",
    href: "/tools/feature-prioritization",
    desc: "Enter features + RICE scores → ranked output",
  },
  {
    name: "User Story Generator",
    href: "/tools/user-story-generator",
    desc: "Feature idea → acceptance criteria + user stories",
  },
  {
    name: "Persona Generator",
    href: "/tools/persona-generator",
    desc: "Bullet points → structured user persona card",
  },
];

const FREE_PLAN_FEATURES = [
  "2 PRDs / month",
  "Unlimited insights",
  "File uploads (PDF, audio, video)",
  "Insights board",
  "Ask tab Q&A",
];

const PRO_PLAN_FEATURES = [
  "15 PRDs / month",
  "Unlimited insights",
  "File uploads",
  "Slack channel ingestion",
  "Call transcript import",
  "GitHub codebase context",
  "PDF export",
  "Priority support",
];

// Placeholder testimonials — replace with real quotes from beta users before launch
const TESTIMONIALS = [
  {
    quote:
      "[ Testimonial placeholder — reach out to beta users and paste a real quote here. Aim for something that shows time saved or a specific workflow improvement. ]",
    name: "[ Beta user 1 — First Last ]",
    title: "[ Senior PM at Company ]",
    initials: "AB",
  },
  {
    quote:
      "[ Testimonial placeholder — ideally from a different role (e.g. founder or head of product) to show range of use cases. ]",
    name: "[ Beta user 2 — First Last ]",
    title: "[ Founder / Head of Product ]",
    initials: "CD",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingNav />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/70 via-white to-white pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD]" />
              AI-Powered PRD Generator
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              Turn Customer Feedback
              <br className="hidden sm:block" />
              <span className="text-[#7F77DD]"> Into PRDs in Minutes</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload calls, Slack threads, and docs. AI extracts insights and
              generates production-ready PRDs your engineers will actually build
              from.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-base transition-colors shadow-sm"
              >
                Get started free →
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl text-base transition-colors"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Free forever · No credit card required · 2 PRDs/month on the free plan
            </p>

            {/* App preview — replace with real screenshot or demo GIF */}
            <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-xl ring-1 ring-gray-900/5">
              <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
                <div className="flex-1 ml-3 bg-white rounded px-3 py-1 text-xs text-gray-400 text-left">
                  pmread.rohanyeole.com/project/...
                </div>
              </div>
              <div className="p-10 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Play size={24} className="text-[#7F77DD] ml-1" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">
                    Product demo coming soon
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    [ Replace with a 30-second screen recording or animated GIF ]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof bar ─────────────────────────────────────────── */}
        <section
          className="py-10 border-y border-gray-100 bg-gray-50/50"
          aria-label="Trusted by"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Trusted by product managers at — [ Replace with real company names/logos ]
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["Company A", "Company B", "Company C", "Company D", "Company E"].map(
                (c) => (
                  <div
                    key={c}
                    className="h-6 w-24 bg-gray-200 rounded opacity-30"
                    aria-hidden="true"
                  />
                )
              )}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 sm:py-28 scroll-mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Research to PRD in three steps
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                PMRead fits into your existing workflow. No new process to
                learn.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
                <div key={step}>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#7F77DD]" />
                  </div>
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                    Step {step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section id="features" className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Built for how PMs actually work
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Every feature is designed around one goal: from customer signal
                to shipped feature, faster.
              </p>
            </div>

            <div className="space-y-20">
              {FEATURES.map(({ tag, title, desc, items, placeholder }, i) => (
                <div
                  key={tag}
                  className={`flex flex-col md:flex-row items-center gap-12 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="inline-block px-2.5 py-1 rounded-full bg-purple-50 text-[#7F77DD] text-xs font-semibold mb-4 uppercase tracking-wide">
                      {tag}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {title}
                    </h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{desc}</p>
                    <ul className="space-y-2.5">
                      {items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-gray-600"
                        >
                          <CheckCircle
                            size={15}
                            className="text-[#1D9E75] mt-0.5 flex-shrink-0"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm min-h-[220px] flex items-center justify-center p-8">
                      <p className="text-xs text-gray-300 text-center">
                        [ Screenshot placeholder: {placeholder} ]
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Free tools ───────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Free tools — no signup required
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Start using PMRead&apos;s AI tools right now. No account
                needed.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREE_TOOLS.map(({ name, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group p-5 rounded-xl border border-gray-200 hover:border-[#7F77DD] hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {name}
                    </h3>
                    <ArrowRight
                      size={14}
                      className="text-gray-300 group-hover:text-[#7F77DD] transition-colors mt-0.5 flex-shrink-0"
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing preview ──────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Start free, upgrade when you&apos;re ready
            </h2>
            <p className="text-gray-500 text-lg mb-12">
              No credit card required to start.
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              {/* Free plan */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Free</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-4xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-400 text-sm mb-1">/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {FREE_PLAN_FEATURES.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle
                        size={14}
                        className="text-[#1D9E75] flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-lg text-sm transition-colors"
                >
                  Get started free
                </Link>
              </div>

              {/* Pro plan */}
              <div className="rounded-2xl border-2 border-[#7F77DD] bg-white p-6 relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#7F77DD] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pro</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-4xl font-bold text-gray-900">₹2,499</span>
                  <span className="text-gray-400 text-sm mb-1">/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {PRO_PLAN_FEATURES.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle
                        size={14}
                        className="text-[#1D9E75] flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?plan=pro"
                  className="block w-full text-center py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            </div>

            <Link
              href="/pricing"
              className="text-sm text-[#7F77DD] hover:underline font-medium"
            >
              See full feature comparison →
            </Link>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              PMs ship faster with PMRead
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {TESTIMONIALS.map(({ quote, name, title, initials }) => (
                <figure
                  key={name}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <blockquote className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-[#7F77DD] flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {name}
                      </p>
                      <p className="text-xs text-gray-400">{title}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#7F77DD]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start writing better PRDs today
            </h2>
            <p className="text-purple-200 text-lg mb-10">
              Join product managers who spend less time writing and more time
              shipping.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#7F77DD] font-semibold rounded-xl text-base hover:bg-purple-50 transition-colors shadow-sm"
              >
                Get started free →
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 border border-purple-400 hover:border-white text-white font-medium rounded-xl text-base transition-colors"
              >
                View pricing
              </Link>
            </div>
            <p className="mt-5 text-xs text-purple-300">
              Free forever · No credit card required
            </p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}
