import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { AUTHORS, getAuthor } from "@/lib/authors";
import AuthorAvatar from "@/components/AuthorAvatar";
import { SITE_URL as BASE } from "@/lib/site";

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role} | PMRead Blog`,
    description: author.bio,
    alternates: { canonical: `${BASE}/author/${author.slug}` },
    openGraph: {
      title: `${author.name} | PMRead Blog`,
      description: author.bio,
      url: `${BASE}/author/${author.slug}`,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const posts = getAllPosts().filter((p) => p.author === author.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${BASE}/author/${author.slug}`,
    jobTitle: author.role,
    description: author.bio,
    sameAs: [author.linkedin, ...(author.twitter ? [author.twitter] : [])],
    worksFor: { "@type": "Organization", name: "PMRead", url: BASE },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-600">{author.name}</span>
          </nav>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-10">
            <div className="flex items-start gap-5">
              <AuthorAvatar author={author} size={64} />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-0.5">{author.name}</h1>
                <p className="text-sm text-[#7F77DD] font-medium mb-3">{author.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{author.bio}</p>
                <div className="flex items-center gap-4 mt-4">
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#7F77DD] hover:underline"
                  >
                    LinkedIn →
                  </a>
                  {author.twitter && (
                    <a
                      href={author.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#7F77DD] hover:underline"
                    >
                      Twitter →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-4">
            {posts.map((post) => {
              const formatted = new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-200 hover:border-[#7F77DD]/40 hover:shadow-sm p-5 transition-all"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={`/blog/${post.slug}.svg`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-[#7F77DD] uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#7F77DD] transition-colors leading-snug mt-0.5">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatted} · {post.readingTime} min read
                    </p>
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
