import type { Metadata } from "next";
import Link from "next/link";
import {
  UploadCloud,
  Sparkles,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Play,
  Quote,
  GitBranch,
  Layers,
  BarChart2,
  IndianRupee,
} from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import WorkflowChart from "@/components/WorkflowChart";
import FeaturesSection from "@/components/FeaturesSection";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "PMRead — Customer Evidence to Engineering Spec" },
  description:
    "Turn customer interviews and feedback into evidence-backed PRDs with AI. PMRead is the AI PRD generator built for product managers — from raw feedback to shipping-ready spec in minutes.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "PMRead — Customer Evidence to Engineering Spec",
    description:
      "Upload customer interviews, transcripts, and feedback. PMRead extracts insights, ranks them by frequency, and generates a PRD where every requirement is traced back to real customer evidence.",
    url: SITE_URL,
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
      url: SITE_URL,
      description:
        "Customer evidence to engineering spec, with citations. PMRead extracts insights from interviews and feedback, then generates PRDs where every requirement traces back to real customer data.",
      keywords:
        "ai prd generator, customer feedback analysis tool, prd generator, product requirements document, turn customer feedback into prd, ai product requirements",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "INR", name: "Free plan" },
        { "@type": "Offer", price: "1699", priceCurrency: "INR", name: "Pro plan" },
      ],
    },
    {
      "@type": "Organization",
      name: "PMRead",
      url: SITE_URL,
      foundingLocation: "India",
      contactPoint: {
        "@type": "ContactPoint",
        email: "rohan.yeole@rohanyeole.com",
        contactType: "customer support",
      },
    },
  ],
};

const STATS = [
  {
    value: "4–8 hrs",
    label: "to write a PRD manually",
    contrast: "PMRead does it in under 15 minutes",
    source: "PM industry research",
    href: null,
  },
  {
    value: "⅓",
    label: "of working hours spent in meetings",
    contrast: "Leaving almost no time for actual spec work",
    source: "Workplace productivity research",
    href: null,
  },
  {
    value: "$42,000",
    label: "wasted per manager annually",
    contrast: "In unnecessary meetings and overhead tasks",
    source: "Organizational efficiency research",
    href: null,
  },
  {
    value: "20 min",
    label: "re-entry cost per context switch",
    contrast: "Fragmented tools kill deep work",
    source: "Cited by Shreyas Doshi, PM frameworks research",
    href: "https://www.linkedin.com/in/shreyasdoshi/",
  },
  {
    value: "71%",
    label: "of workers would skip low-value meetings",
    contrast: "If they had high-quality async notes and action items",
    source: "Employee workplace survey",
    href: null,
  },
  {
    value: "95%",
    label: "of products fail",
    contrast: "The difference is often the quality of the spec",
    source: "Marty Cagan, Silicon Valley Product Group",
    href: "https://www.svpg.com",
  },
];

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
    desc: "AI runs customer feedback analysis across everything you upload — extracting pain points, feature requests, key decisions, and action items, grouped and searchable.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Generate a cited spec",
    desc: "Star your key insights, pick a focus area, and get a complete PRD — every requirement traced back to real customer quotes. Not AI-filled templates. Cited evidence.",
    icon: FileCheck,
  },
];


const DIFFERENTIATORS = [
  {
    icon: Quote,
    title: "Real evidence. Not synthetic interviews.",
    body: "Some AI tools run \"synthetic user interviews\" — they give you answers shaped by the prompt, not by customers. PMRead only works from what your customers actually said. Upload a transcript, and every insight traces back to a real quote. \"7 of 15 customers mentioned this\" is not a hallucination. It's your data.",
  },
  {
    icon: GitBranch,
    title: "GitHub codebase context",
    body: "No other PM tool reads your codebase. When PMRead generates engineering tasks, they reference real modules, file paths, and data models — not generic placeholders that engineers have to translate.",
  },
  {
    icon: Layers,
    title: "The full chain in one tool",
    body: "Other tools are either research repositories or spec generators. PMRead is both: upload a transcript and it automatically feeds the PRD generator. Ingest → extract → rank → generate, without leaving the tab.",
  },
  {
    icon: BarChart2,
    title: "Frequency ranking kills the loudest voice",
    body: "Decisions made from the most recent complaint are the norm. PMRead tracks how often each problem appears across all your sources — so your roadmap reflects 20 customers, not the one who emailed last.",
  },
  {
    icon: IndianRupee,
    title: "Built for India. Priced in INR.",
    body: "Every competing tool is priced for US teams at $30–$80/user/month. PMRead Pro is ₹1,699/month — billed in INR via Razorpay, with a free tier that actually lets you use the product.",
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
    name: "PM Interview Prep",
    href: "/tools/interview-prep",
    desc: "Paste a JD + resume → get likely questions with answers from your real experience",
  },
  {
    name: "Metric Story Generator",
    href: "/tools/metric-story-generator",
    desc: "Raw metrics → narrative: what changed, why, and what to do next",
  },
];

const FREE_PLAN_FEATURES = [
  "2 PRDs / month",
  "Unlimited insights",
  "File uploads (PDF, DOCX)",
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
  "PRD updates — extend with new insights (up to 3×/PRD)",
  "PDF export",
  "Priority support",
];

const TESTIMONIALS = [
  {
    quote: "I used to spend half a day writing a PRD after every round of user interviews. PMRead cut that to 20 minutes — and the citations make engineers trust the requirements instead of questioning them.",
    name: "Priya Sharma",
    title: "Senior Product Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=PriyaSharma&backgroundColor=b6e3f4&radius=50",
  },
  {
    quote: "The frequency ranking killed our loudest-voice problem overnight. Now I can say '14 of 20 users mentioned this' instead of 'someone important asked for this'. Roadmap credibility went up immediately.",
    name: "Arjun Mehta",
    title: "Head of Product",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ArjunMehta&backgroundColor=c0aede&radius=50",
  },
];

const PM_STAGES = [
  { label: "Customer research & calls",    traditional: 120, pmread: 120, tradLabel: "2 hr",   pmLabel: "2 hr",    auto: false, color: "#94a3b8" },
  { label: "Transcription & formatting",   traditional: 60,  pmread: 2,   tradLabel: "1 hr",   pmLabel: "2 min",   auto: true,  color: "#f97316" },
  { label: "Synthesis & note-taking",      traditional: 90,  pmread: 0.5, tradLabel: "90 min", pmLabel: "< 1 min", auto: true,  color: "#ef4444" },
  { label: "Pattern identification",       traditional: 60,  pmread: 0.5, tradLabel: "1 hr",   pmLabel: "< 1 min", auto: true,  color: "#f59e0b" },
  { label: "Insight extraction & tagging", traditional: 60,  pmread: 1,   tradLabel: "1 hr",   pmLabel: "1 min",   auto: true,  color: "#a78bfa" },
  { label: "Prioritization by frequency",  traditional: 45,  pmread: 0.5, tradLabel: "45 min", pmLabel: "< 1 min", auto: true,  color: "#8b5cf6" },
  { label: "PRD drafting",                 traditional: 240, pmread: 15,  tradLabel: "4 hr",   pmLabel: "15 min",  auto: true,  color: "#7F77DD" },
  { label: "Evidence & citations",         traditional: 90,  pmread: 1,   tradLabel: "90 min", pmLabel: "1 min",   auto: true,  color: "#1D9E75" },
  { label: "Engineering handoff",          traditional: 60,  pmread: 20,  tradLabel: "1 hr",   pmLabel: "20 min",  auto: false, color: "#0ea5e9" },
] as const;

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
        <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/70 via-white to-white pointer-events-none" />
          <div className="relative mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD]" />
              Evidence-Backed PRD Workflow
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              Customer Evidence <span className="text-[#7F77DD]">to Engineering Spec</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Upload interviews, transcripts, and feedback. PMRead is the AI PRD generator
              that extracts insights, tracks frequency across all your sources, and generates
              a product requirements document where every requirement links back to what
              customers actually said.
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

            {/* Product demo — thumbnail linking to YouTube */}
            <a
              href="https://www.youtube.com/watch?v=M8R3bTm6VZk"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 block rounded-2xl max-w-4xl mx-auto overflow-hidden shadow-xl ring-1 ring-gray-900/5 relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/75%25%20PM%20WORK%20GONE.png"
                alt="PMRead product walkthrough — 75% of PM work automated"
                className="w-full block"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-colors">
                  <Play size={24} className="text-[#7F77DD] ml-1" fill="currentColor" />
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* ── PM Workflow Chart ────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
                Time comparison
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                The PM workflow, before and after
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                PMRead automates 7 of 9 stages. You keep doing the work only you can do.
              </p>
            </div>

            <WorkflowChart />

            {/* Stage reference table */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
              {PM_STAGES.map(({ label, tradLabel, pmLabel, color, auto: isAuto }) => (
                <div key={label} className="flex items-center gap-3 text-xs text-gray-600 py-1 border-b border-gray-50">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="flex-1">{label}</span>
                  <span className="text-gray-400 w-14 text-right">{tradLabel}</span>
                  <span className="font-semibold text-[#7F77DD] w-16 text-right">
                    {pmLabel}{isAuto && " ↑"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-2 text-xs text-gray-400">
              <span className="w-14 text-right">Traditional</span>
              <span className="text-[#7F77DD] w-16 text-right">PMRead ↑ = auto</span>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Y-axis = cumulative time. Both lines start together at research. The gap is automation.
            </p>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
                The overhead problem
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Why PMs can&apos;t write good PRDs
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                The data on where product managers actually spend their time — and why specs suffer.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800 rounded-2xl overflow-hidden">
              {STATS.map(({ value, label, contrast, source, href }) => (
                <div key={value + label} className="bg-gray-950 p-8 flex flex-col">
                  <p className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
                    {value}
                  </p>
                  <p className="text-sm font-semibold text-gray-200 mb-2">{label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 flex-1">{contrast}</p>
                  <p className="text-xs text-gray-400 border-t border-gray-800 pt-3 mt-auto">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors underline underline-offset-2"
                      >
                        {source}
                      </a>
                    ) : (
                      source
                    )}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Sources: Workplace productivity research, Shreyas Doshi (LNO Framework), Marty Cagan (SVPG)
            </p>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-12 sm:py-16 scroll-mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
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
        <section id="features" className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Built for how PMs actually work
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Every feature is designed around one chain: customer evidence → extracted insight → cited requirement → shipped feature.
              </p>
            </div>

            <FeaturesSection />
          </div>
        </section>

        {/* ── Differentiators ──────────────────────────────────────────── */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
                Why PMRead
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What no other AI tool does
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                These aren&apos;t feature bullets. They&apos;re gaps every other tool has — that PMRead doesn&apos;t.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {DIFFERENTIATORS.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className={`rounded-2xl border border-gray-200 bg-white p-6 flex gap-4${
                    i === DIFFERENTIATORS.length - 1 && DIFFERENTIATORS.length % 2 !== 0
                      ? " md:col-span-2 md:max-w-lg md:mx-auto"
                      : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={16} className="text-[#7F77DD]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Free tools ───────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
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
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Start free, upgrade when you&apos;re ready
            </h2>
            <p className="text-gray-500 text-lg mb-8">
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
                  <span className="text-4xl font-bold text-gray-900">₹1,699</span>
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
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
              PMs ship faster with PMRead
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {TESTIMONIALS.map(({ quote, name, title, avatar }) => (
                <figure
                  key={name}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <blockquote className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt={name} width={40} height={40} className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400">{title}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-[#7F77DD]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Build specs your engineers can trust
            </h2>
            <p className="text-purple-200 text-lg mb-10">
              Every requirement backed by evidence. Every claim traced to a real customer.
              Stop writing from memory — start writing from proof.
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
