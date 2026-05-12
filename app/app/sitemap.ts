import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { TEMPLATES } from "@/lib/templates";

// Static pages — update lastModified whenever the page content changes
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "monthly",
    priority: 1.0,
  },
  {
    url: `${BASE}/pricing`,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${BASE}/about`,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE}/privacy`,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE}/terms`,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

// Free tools — high priority, purchase intent
const TOOL_PAGES: MetadataRoute.Sitemap = [
  "/tools",
  "/tools/prd-generator",
  "/tools/feedback-analyzer",
  "/tools/feature-prioritization",
  "/tools/user-story-generator",
  "/tools/persona-generator",
  "/tools/meeting-cost-calculator",
  "/tools/metric-story-generator",
  "/tools/interview-prep",
].map((path) => ({
  url: `${BASE}${path}`,
  lastModified: new Date("2026-04-18"),
  changeFrequency: "monthly" as const,
  priority: 0.9,
}));

// Comparison pages — high conversion
const COMPARE_PAGES: MetadataRoute.Sitemap = [
  "/compare",
  "/compare/pmread-vs-dovetail",
  "/compare/pmread-vs-productboard",
  "/compare/pmread-vs-notion-ai",
].map((path) => ({
  url: `${BASE}${path}`,
  lastModified: new Date("2026-04-25"),
  changeFrequency: "monthly" as const,
  priority: 0.8,
}));

// Template pages — driven by TEMPLATES data, auto-includes new templates
const TEMPLATE_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${BASE}/templates`,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  ...TEMPLATES.map((t) => ({
    url: `${BASE}/templates/${t.slug}`,
    lastModified: new Date("2026-04-16"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];

// Glossary pages
const GLOSSARY_PAGES: MetadataRoute.Sitemap = [
  "/glossary",
  // Original 7
  "/glossary/prd",
  "/glossary/rice-scoring",
  "/glossary/north-star-metric",
  "/glossary/product-market-fit",
  "/glossary/jobs-to-be-done",
  "/glossary/moscow-method",
  "/glossary/okr",
  // Strategy & Planning
  "/glossary/mvp",
  "/glossary/value-proposition",
  "/glossary/product-discovery",
  "/glossary/gtm-strategy",
  // Execution & Development
  "/glossary/agile",
  "/glossary/scrum",
  "/glossary/kanban",
  "/glossary/backlog",
  "/glossary/sprint",
  "/glossary/technical-debt",
  "/glossary/velocity",
  "/glossary/scope-creep",
  // Metrics & Analytics
  "/glossary/churn-rate",
  "/glossary/retention-rate",
  "/glossary/ltv",
  "/glossary/cac",
  "/glossary/nps",
  "/glossary/arpu",
  "/glossary/conversion-rate",
  "/glossary/ab-testing",
  "/glossary/cohort-analysis",
  "/glossary/funnel-analysis",
  // Design & Experience
  "/glossary/ux",
  "/glossary/wireframe",
  "/glossary/prototype",
  "/glossary/usability-testing",
  // Prioritization & Frameworks
  "/glossary/kano-model",
  "/glossary/ice-scoring",
].map((path) => ({
  url: `${BASE}${path}`,
  lastModified: new Date("2026-04-25"),
  changeFrequency: "yearly" as const,
  priority: 0.6,
}));

// Use-case pages
const USE_CASE_PAGES: MetadataRoute.Sitemap = [
  "/use-cases",
  "/use-cases/india-startups",
  "/use-cases/fintech",
  "/use-cases/b2b-saas",
  "/use-cases/consumer-apps",
].map((path) => ({
  url: `${BASE}${path}`,
  lastModified: new Date("2026-04-25"),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

// Integration pages
const INTEGRATION_PAGES: MetadataRoute.Sitemap = [
  "/integrations",
  "/integrations/slack",
  "/integrations/github",
  // /integrations/jira — not built yet, added when Jira integration ships
].map((path) => ({
  url: `${BASE}${path}`,
  lastModified: new Date("2026-04-25"),
  changeFrequency: "monthly" as const,
  priority: 0.6,
}));

// Blog pages — driven by filesystem, auto-includes every .md file in content/blog/
const BLOG_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${BASE}/blog`,
    lastModified: new Date("2026-04-24"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  ...getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  {
    url: `${BASE}/author/rohan-yeole`,
    lastModified: new Date("2026-04-24"),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PAGES,
    ...TOOL_PAGES,
    ...COMPARE_PAGES,
    ...TEMPLATE_PAGES,
    ...GLOSSARY_PAGES,
    ...USE_CASE_PAGES,
    ...INTEGRATION_PAGES,
    ...BLOG_PAGES,
  ];
}