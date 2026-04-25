import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";

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

// Template pages — high volume keywords
const TEMPLATE_PAGES: MetadataRoute.Sitemap = [
  // Index
  "/templates",
  // Tier 1 — highest volume
  "/templates/prd-template",
  "/templates/okr-template",
  "/templates/product-roadmap-template",
  "/templates/buyer-persona-template",
  "/templates/user-story-template",
  // Tier 2 — in sitemap, added 2026-04-16
  "/templates/product-launch-checklist",
  "/templates/competitive-analysis",
  "/templates/go-to-market-template",
  "/templates/release-notes-template",
  "/templates/acceptance-criteria",
  "/templates/product-brief-template",
  // Tier 3 — Discovery & Research
  "/templates/lean-canvas",
  "/templates/north-star-metric",
  "/templates/jobs-to-be-done",
  "/templates/customer-journey-map",
  "/templates/empathy-map",
  "/templates/user-interview-script",
  "/templates/kano-model",
  "/templates/stakeholder-map",
  "/templates/problem-statement-canvas",
  // Tier 4 — Planning & Agile
  "/templates/rice-scoring",
  "/templates/moscow-method",
  "/templates/ab-test-plan",
  "/templates/sprint-retrospective",
  "/templates/decision-log",
  "/templates/risk-register",
  // Tier 5 — PM × Engineering (differentiators)
  "/templates/spec-to-django",
  "/templates/spec-to-react",
  "/templates/api-design-spec",
  "/templates/technical-debt-scorecard",
  "/templates/feature-flag-decision",
  "/templates/architecture-decision-record",
  "/templates/engineering-kickoff",
  "/templates/design-review-checklist",
  "/templates/post-mortem",
  // Tier 6 — PM × AI (differentiators)
  "/templates/ai-feature-spec",
  "/templates/llm-evaluation-scorecard",
  "/templates/ai-product-risk",
  "/templates/responsible-ai-checklist",
  "/templates/prompt-design-template",
  // Tier 7 — PM × India (differentiators)
  "/templates/india-gtm",
  "/templates/unit-economics",
  "/templates/fundraising-prd",
  "/templates/b2b-saas-pricing",
  // Tier 8 — Metrics & Growth
  "/templates/aarrr-metrics",
  "/templates/weekly-pm-report",
  "/templates/churn-analysis",
  "/templates/experiment-design",
  "/templates/product-health-dashboard",
  // Tier 9 — Growth / Launch
  "/templates/customer-onboarding-checklist",
  "/templates/feature-announcement",
].map((path) => ({
  url: `${BASE}${path}`,
  lastModified: new Date("2026-04-16"),
  changeFrequency: "monthly" as const,
  priority: 0.8,
}));

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

// Blog slugs — add as posts are published
// Batch 1 (published 2026-04-24): 10 high-volume evergreen posts
const BATCH_1_BLOG_SLUGS = [
  "how-to-write-a-prd",
  "how-to-write-user-stories",
  "how-to-measure-product-market-fit",
  "north-star-metric",
  "how-to-build-product-roadmap",
  "feature-prioritization-guide",
  "jobs-to-be-done-vs-personas",
  "customer-feedback-analysis",
  "feature-prioritization",
  "okr-guide-product-managers",
] as const;

const BLOG_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${BASE}/blog`,
    lastModified: new Date("2026-04-24"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  ...BATCH_1_BLOG_SLUGS.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date("2026-04-24"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  // Author pages
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
