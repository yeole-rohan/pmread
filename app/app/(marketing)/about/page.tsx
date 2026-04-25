import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "About PMRead — Built by PMs, for PMs" },
  description:
    "PMRead is an AI-powered PRD generator built by product managers, for product managers. We're on a mission to turn customer feedback into shipping velocity.",
  alternates: { canonical: SITE_URL + '/about' },
  openGraph: {
    title: "About PMRead",
    description:
      "PMRead is an AI-powered PRD generator built by product managers, for product managers.",
    url: SITE_URL + '/about',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About PMRead",
  url: SITE_URL + '/about',
  description:
    "PMRead is an AI-powered product requirements document generator built in India.",
  mainEntity: {
    "@type": "Organization",
    name: "PMRead",
    url: SITE_URL,
    foundingDate: "2025",
    foundingLocation: "India",
    email: "rohan.yeole@rohanyeole.com",
  },
};

// Placeholder team — replace with real bios and photos before launch
const TEAM = [
  {
    name: "Rohan Yeole",
    role: "Founder",
    bio: "[ Short 2-3 sentence bio. Where you've worked, what you've shipped, why you built PMRead. ]",
    initials: "RY",
    linkedin: "https://linkedin.com/in/yeole-rohan",
  },
  {
    name: "[ Team member ]",
    role: "[ Role ]",
    bio: "[ Short bio placeholder — add when team grows. ]",
    initials: "TM",
    linkedin: "#",
  },
];

const VALUES = [
  {
    title: "Evidence over opinion",
    desc: "Every PRD should be traceable back to a real customer problem. We built PMRead so there's always a quote to back up the ask.",
  },
  {
    title: "Speed without cutting corners",
    desc: "PMs shouldn't have to choose between being thorough and being fast. AI should handle the synthesis so you can focus on the judgment calls.",
  },
  {
    title: "Built for Indian PMs",
    desc: "Product management in India is growing fast. We price for it, we design for it, and we root for every Indian PM trying to build world-class products.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Built by PMs, for PMs
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              PMRead exists because writing PRDs is the wrong bottleneck. The
              hard part is understanding what customers actually need — the
              document should be the easy part.
            </p>
          </div>
        </section>

        {/* ── Story ────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why we built PMRead
                </h2>
                <div className="prose prose-gray text-sm leading-relaxed space-y-4">
                  <p className="text-gray-600">
                    Every PM we talked to had the same problem: hours of
                    customer interviews, Slack threads, and support tickets — all
                    sitting in folders, only partially synthesised. The insight
                    was there. Time to extract it wasn&apos;t.
                  </p>
                  <p className="text-gray-600">
                    We built PMRead to close that gap. Upload your research, get
                    a structured insight board in minutes, then generate a
                    complete PRD backed by real customer evidence — not
                    templates filled in by ChatGPT.
                  </p>
                  <p className="text-gray-600">
                    PMRead is built in India, priced for India, and designed for
                    the speed at which Indian product teams need to move.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {VALUES.map(({ title, desc }) => (
                  <div
                    key={title}
                    className="p-5 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              The team
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {TEAM.map(({ name, role, bio, initials, linkedin }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  {/* Avatar placeholder — replace with <Image> once photos are available */}
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-xl font-bold text-[#7F77DD] mb-4">
                    {initials}
                  </div>
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-[#7F77DD] font-medium mb-3">
                    {role}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {bio}
                  </p>
                  {linkedin !== "#" && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8">
              We&apos;re a small team. If you&apos;re a PM or engineer who loves
              the problem we&apos;re solving,{" "}
              <a
                href="mailto:rohan.yeole@rohanyeole.com"
                className="text-[#7F77DD] hover:underline"
              >
                say hi
              </a>
              .
            </p>
          </div>
        </section>

        {/* ── India badge ──────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-4xl mb-3">🇮🇳</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Proudly built in India
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              PMRead is incorporated and operated in India. We use Razorpay for
              payments and keep pricing accessible for Indian teams.
            </p>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Mail size={20} className="text-[#7F77DD]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Get in touch
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Questions, feedback, partnership ideas, or just want to say hi —
              we read every email.
            </p>
            <a
              href="mailto:rohan.yeole@rohanyeole.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              rohan.yeole@rohanyeole.com
            </a>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-400">
                Ready to try PMRead?{" "}
                <Link href="/signup" className="text-[#7F77DD] hover:underline font-medium">
                  Get started free →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
