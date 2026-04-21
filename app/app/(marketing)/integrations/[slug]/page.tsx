import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { INTEGRATIONS, getIntegration } from "@/lib/integrations";

import { SITE_URL as BASE } from "@/lib/site";

export function generateStaticParams() {
  return INTEGRATIONS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) return {};
  return {
    title: `${integration.headline} | PMRead`,
    description: integration.metaDescription,
    alternates: { canonical: `${BASE}/integrations/${integration.slug}` },
    openGraph: {
      title: integration.headline,
      description: integration.metaDescription,
      url: `${BASE}/integrations/${integration.slug}`,
    },
  };
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) notFound();

  const others = INTEGRATIONS.filter((i) => i.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: integration.headline,
        description: integration.metaDescription,
        url: `${BASE}/integrations/${integration.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: integration.faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Integrations", item: `${BASE}/integrations` },
          { "@type": "ListItem", position: 3, name: integration.name, item: `${BASE}/integrations/${integration.slug}` },
        ],
      },
    ],
  };

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
            <Link href="/integrations" className="hover:text-gray-600">Integrations</Link>
            <span>/</span>
            <span className="text-gray-600">{integration.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase">
                {integration.tagline}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#7F77DD]/10 text-[#7F77DD]">
                {integration.plan}+
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {integration.headline}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              {integration.subheadline}
            </p>

            {/* Hero stat */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 px-5 py-3">
              <span className="text-xl font-bold text-[#7F77DD]">{integration.heroStat.value}</span>
              <span className="text-sm text-gray-500">{integration.heroStat.label}</span>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">How it works</h2>
            <div className="space-y-3">
              {integration.howItWorks.map((step, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-xs font-bold text-[#7F77DD] uppercase tracking-wider mb-1.5">
                    {step.step}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Why it matters</h2>
            <div className="space-y-4">
              {integration.benefits.map((b, i) => (
                <div key={i} className="rounded-2xl border border-green-100 bg-green-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{b.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup guide */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Setup guide</h2>
            <div className="space-y-3">
              {integration.setupSteps.map((s, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7F77DD]/10 text-[#7F77DD] text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{s.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
            <div className="space-y-4">
              {integration.faqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-[#7F77DD] p-8 text-center text-white mb-10">
            <h2 className="text-xl font-bold mb-2">
              Try PMRead free — no credit card required
            </h2>
            <p className="text-purple-100 text-sm mb-5">
              Start on the free tier. Upgrade to Pro when you&apos;re ready to connect {integration.name}.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-white text-[#7F77DD] font-bold rounded-xl text-sm hover:bg-purple-50 transition-colors"
            >
              Get started free →
            </Link>
          </div>

          {/* Other integrations */}
          {others.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Other integrations
              </p>
              <div className="flex flex-wrap gap-2">
                {others.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/integrations/${i.slug}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white"
                  >
                    {i.name}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
