import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { COMPARISONS, getComparison } from "@/lib/comparisons";

import { SITE_URL as BASE } from "@/lib/site";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparison(slug);
  if (!comp) return {};
  return {
    title: { absolute: `${comp.headline} | PMRead` },
    description: comp.metaDescription,
    alternates: { canonical: `${BASE}/compare/${comp.slug}` },
    openGraph: {
      title: comp.headline,
      description: comp.metaDescription,
      url: `${BASE}/compare/${comp.slug}`,
    },
  };
}

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true)
    return <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />;
  if (value === false)
    return <XCircle className="h-5 w-5 text-gray-300 mx-auto" />;
  return (
    <span className="text-xs text-gray-600 font-medium">{value}</span>
  );
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = getComparison(slug);
  if (!comp) notFound();

  const otherComps = COMPARISONS.filter((c) => c.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: comp.headline,
        description: comp.metaDescription,
        url: `${BASE}/compare/${comp.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: comp.faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: comp.headline, item: `${BASE}/compare/${comp.slug}` },
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
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <span className="text-gray-600">{comp.headline}</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Comparison
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {comp.headline}
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {comp.subheadline}
            </p>
          </div>

          {/* Product summaries */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="rounded-2xl border-2 border-[#7F77DD] bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#7F77DD]" />
                <p className="text-sm font-bold text-gray-900">PMRead</p>
                <span className="ml-auto text-xs bg-[#7F77DD]/10 text-[#7F77DD] px-2 py-0.5 rounded-full font-medium">
                  This product
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{comp.pmreadSummary}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <p className="text-sm font-bold text-gray-900">{comp.competitor}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{comp.competitorSummary}</p>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Feature comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 w-1/2">
                      Feature
                    </th>
                    <th className="text-center px-5 py-3.5 text-xs font-semibold text-[#7F77DD] w-1/4">
                      PMRead
                    </th>
                    <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 w-1/4">
                      {comp.competitorShort}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comp.tableRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-0 even:bg-gray-50/40"
                    >
                      <td className="px-5 py-3 text-gray-700">{row.feature}</td>
                      <td className="px-5 py-3 text-center">
                        <FeatureValue value={row.pmread} />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <FeatureValue value={row.competitor} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wins */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Where PMRead wins
              </h3>
              <ul className="space-y-2.5">
                {comp.pmreadWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MinusCircle className="h-4 w-4 text-gray-400" />
                Where {comp.competitorShort} wins
              </h3>
              <ul className="space-y-2.5">
                {comp.competitorWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 mt-0.5 shrink-0">–</span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verdict */}
          <div className="rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-6 sm:p-8 mb-12">
            <h2 className="text-base font-bold text-gray-900 mb-2">Verdict</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{comp.verdict}</p>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
            <div className="space-y-4">
              {comp.faqs.map(({ q, a }) => (
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
              Upload a transcript or PDF and get your first PRD draft in under 10 minutes.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-white text-[#7F77DD] font-bold rounded-xl text-sm hover:bg-purple-50 transition-colors"
            >
              Get started free →
            </Link>
          </div>

          {/* Other comparisons */}
          {otherComps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Other comparisons
              </p>
              <div className="flex flex-wrap gap-2">
                {otherComps.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white"
                  >
                    {c.headline}
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
