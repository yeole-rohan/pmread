import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GLOSSARY, getTerm } from "@/lib/glossary";

const BASE = "https://pmread.rohanyeole.com";

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term: slug } = await params;
  const entry = getTerm(slug);
  if (!entry) return {};

  return {
    title: `${entry.term} — PM Glossary | PMRead`,
    description: entry.metaDescription,
    alternates: { canonical: `${BASE}/glossary/${entry.slug}` },
    openGraph: {
      title: `${entry.term} — PM Glossary`,
      description: entry.metaDescription,
      url: `${BASE}/glossary/${entry.slug}`,
    },
  };
}

/** Minimal markdown renderer — only what the glossary definition uses */
function renderDefinition(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-gray-900 mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      elements.push(<hr key={i} className="my-6 border-gray-100" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-[#7F77DD]/40 pl-4 italic text-gray-500 text-sm my-3"
        >
          {line.slice(2)}
        </blockquote>
      );
      i++;
      continue;
    }

    // Table — collect rows
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (!cells.every((c) => /^[-: ]+$/.test(c))) rows.push(cells);
        i++;
      }
      const [header, ...body] = rows;
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {header.map((h, j) => (
                  <th
                    key={j}
                    className="text-left px-3 py-2 font-semibold text-gray-700 border border-gray-200 text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="even:bg-gray-50/50">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-2 border border-gray-200 text-gray-600 align-top"
                      dangerouslySetInnerHTML={{
                        __html: cell
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-xs'>$1</code>"),
                      }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 text-sm text-gray-600 my-3 pl-1">
          {items.map((item, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-xs'>$1</code>"),
              }}
            />
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1.5 text-sm text-gray-600 my-3 pl-1">
          {items.map((item, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-xs'>$1</code>"),
              }}
            />
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p
        key={i}
        className="text-sm text-gray-600 leading-relaxed my-2"
        dangerouslySetInnerHTML={{
          __html: line
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-xs'>$1</code>"),
        }}
      />
    );
    i++;
  }

  return <div>{elements}</div>;
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  const entry = getTerm(slug);
  if (!entry) notFound();

  const relatedTerms = GLOSSARY.filter((t) => entry.relatedSlugs.includes(t.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: entry.term,
        description: entry.shortDef,
        url: `${BASE}/glossary/${entry.slug}`,
        inDefinedTermSet: { "@type": "DefinedTermSet", name: "PM Glossary", url: `${BASE}/glossary` },
      },
      {
        "@type": "FAQPage",
        mainEntity: entry.faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Glossary", item: `${BASE}/glossary` },
          { "@type": "ListItem", position: 3, name: entry.term, item: `${BASE}/glossary/${entry.slug}` },
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
            <Link href="/glossary" className="hover:text-gray-600">Glossary</Link>
            <span>/</span>
            <span className="text-gray-600">{entry.term}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              {entry.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {entry.term}
            </h1>
            {/* Short def callout */}
            <div className="rounded-xl border border-[#7F77DD]/20 bg-purple-50 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{entry.shortDef}</p>
            </div>
          </div>

          {/* Definition body */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            {renderDefinition(entry.definition)}
          </div>

          {/* Related templates */}
          {entry.relatedTemplates.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Free templates for {entry.term.split(" ")[0]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {entry.relatedTemplates.map((t) => (
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

          {/* FAQ */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {entry.faqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PMRead CTA */}
          <div className="mt-10 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-6 sm:p-8">
            <div className="sm:flex items-center justify-between gap-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Apply {entry.term.split("(")[0].trim()} to your real product data
                </h2>
                <p className="text-sm text-gray-500 max-w-md">
                  PMRead ingests customer feedback, interviews, and Slack threads — and
                  generates PRDs grounded in real evidence.
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

          {/* Related terms */}
          {relatedTerms.length > 0 && (
            <div className="mt-10">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Related terms
              </p>
              <div className="space-y-3">
                {relatedTerms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/glossary/${t.slug}`}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-[#7F77DD]/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{t.term}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{t.shortDef}</p>
                    </div>
                    <span className="text-[#7F77DD] text-sm shrink-0">→</span>
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
