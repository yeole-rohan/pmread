import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTEGRATIONS } from "@/lib/integrations";

import { SITE_URL as BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Integrations — Connect Slack, GitHub & More | PMRead" },
  description:
    "Connect PMRead with Slack and GitHub — pull customer feedback from Slack channels and engineering context from GitHub directly into your AI-generated PRDs.",
  alternates: { canonical: `${BASE}/integrations` },
  openGraph: {
    title: "PMRead Integrations — Slack, GitHub & More",
    description:
      "Connect Slack channels and GitHub repositories to PMRead. Customer feedback and codebase context — all in one place.",
    url: `${BASE}/integrations`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  keywords:
    "slack to prd integration, github product requirements, connect slack customer feedback prd, slack feedback analysis tool, prd with slack integration",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Integrations", item: `${BASE}/integrations` },
  ],
};

const INTEGRATION_DESCRIPTIONS: Record<string, string> = {
  slack: "Ingest customer feedback channels, CSM threads, and support escalations. Up to 1,000 messages per run.",
  github: "Give PRD generation real codebase context — file paths, APIs, open issues, and recent PRs.",
};

const COMING_SOON = [
  { name: "Jira", desc: "Push PRD engineering tasks directly to Jira as Epics and Stories." },
  { name: "Linear", desc: "Create Linear issues from PRD requirements in one click." },
  { name: "Notion", desc: "Export generated PRDs as Notion pages to a connected workspace." },
];

export default function IntegrationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Integrations
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Slack & GitHub integrations
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Connect your Slack channels and GitHub repositories to PMRead — pull customer
              feedback directly into your AI-generated PRDs without copy-pasting.
            </p>
          </div>

          {/* Live integrations */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Available now</p>
            <div className="space-y-3">
              {INTEGRATIONS.map((integration) => (
                <Link
                  key={integration.slug}
                  href={`/integrations/${integration.slug}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#7F77DD]/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#7F77DD] transition-colors">
                        {integration.name}
                      </p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#7F77DD]/10 text-[#7F77DD]">
                        {integration.plan}+
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {INTEGRATION_DESCRIPTIONS[integration.slug]}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#7F77DD] shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Coming soon */}
          <div className="mt-8 mb-16">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Coming soon</p>
            <div className="space-y-3">
              {COMING_SOON.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/60 p-5"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-400 mb-1">{item.name}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="text-xs text-gray-300 font-medium shrink-0">Soon</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-[#7F77DD] p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">
              Try PMRead free — no credit card required
            </h2>
            <p className="text-purple-100 text-sm mb-5">
              Start on the free tier with file uploads. Upgrade to Pro to unlock Slack and GitHub integrations.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-white text-[#7F77DD] font-bold rounded-xl text-sm hover:bg-purple-50 transition-colors"
            >
              Get started free →
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
