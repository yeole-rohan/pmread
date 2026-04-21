import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import TemplateCopyBlock from "@/components/TemplateCopyBlock";

const BASE = "https://pmread.rohanyeole.com";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};

  return {
    title: `Free ${template.title} for Product Managers | PMRead`,
    description: template.metaDescription,
    alternates: { canonical: `${BASE}/templates/${template.slug}` },
    openGraph: {
      title: `Free ${template.title} | PMRead`,
      description: template.metaDescription,
      url: `${BASE}/templates/${template.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Free ${template.title} | PMRead`,
      description: template.metaDescription,
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const otherTemplates = TEMPLATES.filter((t) => t.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `Free ${template.title}`,
        applicationCategory: "BusinessApplication",
        description: template.metaDescription,
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: `${BASE}/templates/${template.slug}`,
      },
      {
        "@type": "HowTo",
        name: `How to use this ${template.shortTitle} template`,
        description: template.description,
        step: template.howToUse.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.step,
          text: s.detail,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: template.faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Templates", item: `${BASE}/templates` },
          { "@type": "ListItem", position: 3, name: template.title, item: `${BASE}/templates/${template.slug}` },
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
            <Link href="/templates" className="hover:text-gray-600">Templates</Link>
            <span>/</span>
            <span className="text-gray-600">{template.title}</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              {template.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {template.title}
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              {template.description} Free to copy, download, and use. No signup required.
            </p>
          </div>

          {/* Template copy block */}
          <TemplateCopyBlock content={template.content} filename={template.filename} />

          {/* How to use */}
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              How to use this {template.shortTitle} template
            </h2>
            <div className="space-y-3">
              {template.howToUse.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                  <span className="w-6 h-6 rounded-full bg-[#7F77DD]/10 text-[#7F77DD] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.step}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PMRead CTA */}
          <div className="mt-10 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-6 sm:p-8">
            <div className="sm:flex items-center justify-between gap-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Want a {template.shortTitle} grounded in your actual customer data?
                </h2>
                <p className="text-sm text-gray-500 max-w-md">
                  PMRead ingests your customer interviews, feedback, and Slack threads — and
                  generates PRDs backed by real evidence, not guesses.
                </p>
              </div>
              <Link
                href="/signup"
                className="mt-4 sm:mt-0 inline-block px-5 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap flex-shrink-0"
              >
                Try PMRead free →
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {template.faqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other templates */}
          {otherTemplates.length > 0 && (
            <div className="mt-10">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Other free templates
              </p>
              <div className="flex flex-wrap gap-2">
                {otherTemplates.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/templates/${t.slug}`}
                    className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white"
                  >
                    {t.title}
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
