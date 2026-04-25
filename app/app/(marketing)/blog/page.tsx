import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getFeaturedPost } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";
import AuthorChip from "@/components/AuthorChip";
import { SITE_URL as BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Product Management Blog — PMRead",
  description:
    "Practical product management guides: PRD writing, customer research, feature prioritization, OKRs, and AI workflows. Written by PMs, for PMs.",
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: "Product Management Blog — PMRead",
    description:
      "Practical product management guides: PRD writing, customer research, feature prioritization, OKRs, and AI workflows.",
    url: `${BASE}/blog`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "PMRead Blog",
  description: "Practical product management guides for PMs.",
  url: `${BASE}/blog`,
  publisher: { "@type": "Organization", name: "PMRead", url: BASE },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Blog</span>
          </nav>

          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              PM Blog
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Product management guides
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Practical guides for every stage of the product process — written by PMs, not content farms.
            </p>
          </div>

          {/* Featured post */}
          {featured && (() => {
            const author = getAuthor(featured.author);
            return (
              <Link
                href={`/blog/${featured.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 hover:border-[#7F77DD]/40 hover:shadow-sm overflow-hidden transition-all mb-10"
              >
                <div className="relative h-56 sm:h-72 overflow-hidden bg-gray-100">
                  <img src={`/blog/${featured.slug}.svg`} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#7F77DD] text-white text-xs font-semibold">
                    Featured
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-[#7F77DD] uppercase tracking-widest">
                    {featured.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#7F77DD] transition-colors mt-1 mb-2">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{featured.description}</p>
                  {author && (
                    <AuthorChip author={author} date={featured.publishedAt} readingTime={featured.readingTime} />
                  )}
                </div>
              </Link>
            );
          })()}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {posts
              .filter((p) => p.slug !== featured?.slug)
              .map((post) => {
                const author = getAuthor(post.author);
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-[#7F77DD]/40 hover:shadow-sm overflow-hidden transition-all flex flex-col"
                  >
                    <div className="h-36 overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={`/blog/${post.slug}.svg`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] font-semibold text-[#7F77DD] uppercase tracking-widest mb-1">
                        {post.category}
                      </span>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#7F77DD] transition-colors mb-1.5 leading-snug flex-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      {author && (
                        <AuthorChip author={author} date={post.publishedAt} readingTime={post.readingTime} />
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </main>
    </>
  );
}
