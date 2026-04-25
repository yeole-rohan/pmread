import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted before imports — factory must return both named exports AND default
vi.mock("fs", () => {
  const existsSync = vi.fn();
  const readdirSync = vi.fn();
  const readFileSync = vi.fn();
  const mod = { existsSync, readdirSync, readFileSync };
  return { ...mod, default: mod };
});

import * as fs from "fs";
import { getAllPosts, getPost, getRelatedPosts, getFeaturedPost } from "@/lib/blog";

const POST_A = `---
title: Alpha Post
slug: alpha-post
description: Description of alpha
category: PRD Writing
keyword: alpha
publishedAt: 2026-04-01
updatedAt: 2026-04-01
readingTime: 5
author: rohan-yeole
featured: false
---
Body of alpha post.`;

const POST_B = `---
title: Beta Post
slug: beta-post
description: Description of beta
category: PRD Writing
keyword: beta
publishedAt: 2026-04-10
updatedAt: 2026-04-10
readingTime: 3
author: rohan-yeole
featured: true
---
Body of beta post.`;

const POST_C = `---
title: Gamma Post
slug: gamma-post
description: Description of gamma
category: Product Strategy
keyword: gamma
publishedAt: 2026-03-15
updatedAt: 2026-03-15
readingTime: 7
author: rohan-yeole
featured: false
---
Body of gamma post.`;

function setupFs(files: Record<string, string>) {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readdirSync).mockReturnValue(
    Object.keys(files) as unknown as ReturnType<typeof fs.readdirSync>
  );
  vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
    const name = String(filePath).split("/").pop() ?? "";
    const slug = name.replace(".md", "");
    const key = Object.keys(files).find(
      (k) => k === name || k === `${slug}.md`
    );
    return (key ? files[key] : "") as unknown as string;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── getAllPosts ─────────────────────────────────────────────────────────────

describe("getAllPosts", () => {
  it("returns empty array when content dir does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllPosts()).toEqual([]);
  });

  it("returns all posts sorted newest-first", () => {
    setupFs({
      "alpha-post.md": POST_A,
      "beta-post.md": POST_B,
      "gamma-post.md": POST_C,
    });
    const posts = getAllPosts();
    expect(posts).toHaveLength(3);
    expect(posts[0].slug).toBe("beta-post");   // 2026-04-10 newest
    expect(posts[1].slug).toBe("alpha-post");  // 2026-04-01
    expect(posts[2].slug).toBe("gamma-post");  // 2026-03-15 oldest
  });

  it("parses frontmatter fields correctly", () => {
    setupFs({ "alpha-post.md": POST_A });
    const [post] = getAllPosts();
    expect(post.title).toBe("Alpha Post");
    expect(post.slug).toBe("alpha-post");
    expect(post.category).toBe("PRD Writing");
    expect(post.readingTime).toBe(5);
    expect(post.author).toBe("rohan-yeole");
    expect(post.featured).toBe(false);
  });

  it("includes markdown body content", () => {
    setupFs({ "alpha-post.md": POST_A });
    const [post] = getAllPosts();
    expect(post.body).toContain("Body of alpha post");
  });

  it("returns empty array when no markdown files exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue(
      [] as unknown as ReturnType<typeof fs.readdirSync>
    );
    expect(getAllPosts()).toEqual([]);
  });
});

// ── getPost ────────────────────────────────────────────────────────────────

describe("getPost", () => {
  it("returns null when file does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getPost("nonexistent")).toBeNull();
  });

  it("returns parsed post when file exists", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(POST_B as unknown as string);
    const post = getPost("beta-post");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("Beta Post");
    expect(post!.slug).toBe("beta-post");
  });

  it("returns body content", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(POST_B as unknown as string);
    const post = getPost("beta-post");
    expect(post!.body).toContain("Body of beta post");
  });
});

// ── getRelatedPosts ────────────────────────────────────────────────────────

describe("getRelatedPosts", () => {
  beforeEach(() => {
    setupFs({
      "alpha-post.md": POST_A,
      "beta-post.md": POST_B,
      "gamma-post.md": POST_C,
    });
  });

  it("excludes the current post from related", () => {
    const related = getRelatedPosts("alpha-post", "PRD Writing", 5);
    expect(related.every((p) => p.slug !== "alpha-post")).toBe(true);
  });

  it("only returns posts from same category", () => {
    const related = getRelatedPosts("alpha-post", "PRD Writing", 5);
    expect(related.every((p) => p.category === "PRD Writing")).toBe(true);
  });

  it("respects the limit", () => {
    const related = getRelatedPosts("gamma-post", "PRD Writing", 1);
    expect(related).toHaveLength(1);
  });

  it("returns empty array when no related posts exist", () => {
    const related = getRelatedPosts("gamma-post", "Product Strategy", 3);
    expect(related).toHaveLength(0);
  });
});

// ── getFeaturedPost ────────────────────────────────────────────────────────

describe("getFeaturedPost", () => {
  it("returns the post with featured=true", () => {
    setupFs({
      "alpha-post.md": POST_A,
      "beta-post.md": POST_B,
    });
    const post = getFeaturedPost();
    expect(post?.slug).toBe("beta-post");
  });

  it("falls back to first post when none is featured", () => {
    setupFs({ "alpha-post.md": POST_A });
    const post = getFeaturedPost();
    expect(post?.slug).toBe("alpha-post");
  });

  it("returns null when no posts exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getFeaturedPost()).toBeNull();
  });
});
