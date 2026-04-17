import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { USE_CASES, getUseCase } from "@/lib/use-cases";

const BASE = "https://pmread.rohanyeole.com";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};
  return {
    title: `${uc.headline} | PMRead`,
    description: uc.metaDescription,
    alternates: { canonical: `${BASE}/use-cases/${uc.slug}` },
    openGraph: {
      title: uc.headline,
      description: uc.metaDescription,
      url: `${BASE}/use-cases/${uc.slug}`,
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) notFound();

  const others = USE_CASES.filter((u) => u.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: uc.headline,
        description: uc.metaDescription,
        url: `${BASE}/use-cases/${uc.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: uc.faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Use Cases", item: `${BASE}/use-cases` },
          { "@type": "ListItem", position: 3, name: uc.segment, item: `${BASE}/use-cases/${uc.slug}` },
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
            <Link href="/use-cases" className="hover:text-gray-600">Use Cases</Link>
            <span>/</span>
            <span className="text-gray-600">{uc.segment}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              {uc.segment}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {uc.headline}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              {uc.subheadline}
            </p>

            {/* Hero stat */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 px-5 py-3">
              <span className="text-xl font-bold text-[#7F77DD]">{uc.heroStat.value}</span>
              <span className="text-sm text-gray-500">{uc.heroStat.label}</span>
            </div>
          </div>

          {/* Pain points */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              The challenges {uc.segment.toLowerCase()} PMs face
            </h2>
            <div className="space-y-4">
              {uc.painPoints.map((p, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{p.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How PMRead helps */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              How PMRead helps
            </h2>
            <div className="space-y-4">
              {uc.howItHelps.map((h, i) => (
                <div key={i} className="rounded-2xl border border-green-100 bg-green-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{h.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{h.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="mb-12 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-6 sm:p-8">
            <blockquote className="text-sm text-gray-700 leading-relaxed italic mb-4">
              "{uc.quote.text}"
            </blockquote>
            <p className="text-xs font-semibold text-gray-900">{uc.quote.author}</p>
            <p className="text-xs text-gray-400">{uc.quote.role}</p>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {uc.faqs.map(({ q, a }) => (
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

          {/* Other use cases */}
          {others.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Other use cases
              </p>
              <div className="flex flex-wrap gap-2">
                {others.map((u) => (
                  <Link
                    key={u.slug}
                    href={`/use-cases/${u.slug}`}
                    className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white"
                  >
                    {u.segment}
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
