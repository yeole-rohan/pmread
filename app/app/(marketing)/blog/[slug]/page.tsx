import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";
import BlogRenderer, { extractToc } from "@/components/BlogRenderer";
import AuthorChip from "@/components/AuthorChip";
import BlogSidebarCta from "@/components/BlogSidebarCta";
import { SITE_URL as BASE } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const author = getAuthor(post.author);
  return {
    title: { absolute: `${post.title} | PMRead Blog` },
    description: post.description,
    alternates: { canonical: `${BASE}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${BASE}/blog/${post.slug}`,
      images: [{ url: `${BASE}/blog/${post.slug}.svg`, width: 1200, height: 630 }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: author ? [`${BASE}/author/${author.slug}`] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${BASE}/blog/${post.slug}.svg`],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const related = getRelatedPosts(post.slug, post.category, 3);
  const toc = extractToc(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${BASE}/blog/${post.slug}.svg`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: `${BASE}/author/${author.slug}`,
          sameAs: [author.linkedin],
        }
      : undefined,
    publisher: { "@type": "Organization", name: "PMRead", url: BASE },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/blog/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
          </nav>

          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 items-start">
            {/* Main content */}
            <article>
              <div className="rounded-2xl overflow-hidden mb-8 bg-gray-100 h-64 sm:h-80">
                <img src={`/blog/${post.slug}.svg`} alt={`Featured image for: ${post.title}`} className="w-full h-full object-cover" />
              </div>

              <span className="text-xs font-semibold text-[#7F77DD] uppercase tracking-widest">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
                {post.title}
              </h1>

              {author && (
                <div className="mb-8">
                  <AuthorChip
                    author={author}
                    date={post.publishedAt}
                    readingTime={post.readingTime}
                    size="md"
                    linkToProfile
                  />
                </div>
              )}

              <BlogRenderer body={post.body} />

              {/* Bottom CTA */}
              <div className="mt-12 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-6 sm:p-8">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Want PRDs grounded in your actual customer data?
                </h2>
                <p className="text-sm text-gray-500 mb-4 max-w-md">
                  PMRead ingests your interviews, Slack threads, and feedback files — and generates PRDs backed by real evidence, not guesses.
                </p>
                <BlogSidebarCta slug={post.slug} location="bottom" />
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-12">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Related posts
                  </p>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="group flex items-start gap-4 bg-white rounded-xl border border-gray-200 hover:border-[#7F77DD]/40 p-4 transition-all"
                      >
                        <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={`/blog/${r.slug}.svg`} alt={`Featured image for: ${r.title}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#7F77DD] transition-colors leading-snug">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{r.readingTime} min read</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-6">
                {/* Author card */}
                {author && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="mb-3">
                      <AuthorChip
                        author={author}
                        date={post.publishedAt}
                        readingTime={post.readingTime}
                        size="md"
                        linkToProfile
                      />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mt-3">{author.bio}</p>
                    <a
                      href={author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-[#7F77DD] font-semibold hover:underline"
                    >
                      LinkedIn →
                    </a>
                  </div>
                )}

                {/* ToC */}
                {toc.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                      In this article
                    </p>
                    <nav className="space-y-1.5">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-xs hover:text-[#7F77DD] transition-colors ${
                            item.level === 3 ? "pl-3 text-gray-400" : "text-gray-600 font-medium"
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Sidebar CTA */}
                <div className="rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">
                    Turn customer evidence into PRDs
                  </p>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Upload interviews, feedback files, and Slack threads. PMRead extracts insights and generates cited PRDs.
                  </p>
                  <BlogSidebarCta slug={post.slug} location="sidebar" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
