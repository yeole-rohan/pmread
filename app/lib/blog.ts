import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  author: string;
  featured: boolean;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return { ...data, body: content } as BlogPost;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { ...data, body: content } as BlogPost;
}

export function getRelatedPosts(
  slug: string,
  category: string,
  limit = 3
): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, limit);
}

export function getFeaturedPost(): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export const BLOG_CATEGORIES = [
  "PRD Writing",
  "Product Strategy",
  "Customer Research",
  "Planning",
  "AI & Product Management",
  "India Startups",
  "PMRead Tutorials",
] as const;
