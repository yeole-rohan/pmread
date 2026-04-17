export interface ComparisonRow {
  feature: string;
  pmread: string | boolean;
  competitor: string | boolean;
}

export interface Comparison {
  slug: string;
  competitor: string;
  competitorShort: string;
  headline: string;
  subheadline: string;
  metaDescription: string;
  pmreadSummary: string;
  competitorSummary: string;
  tableRows: ComparisonRow[];
  pmreadWins: string[];
  competitorWins: string[];
  verdict: string;
  faqs: { q: string; a: string }[];
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "pmread-vs-dovetail",
    competitor: "Dovetail",
    competitorShort: "Dovetail",
    headline: "PMRead vs Dovetail",
    subheadline:
      "Dovetail is a research repository. PMRead turns research into PRDs. Here's when to use which — and why many PMs need both.",
    metaDescription:
      "PMRead vs Dovetail — detailed comparison of features, pricing, and use cases. See which tool fits your workflow for customer research and PRD generation.",
    pmreadSummary:
      "PMRead is an AI-powered PRD generator that ingests customer feedback, transcripts, Slack, and GitHub — and produces structured PRDs grounded in real evidence. Built for PMs who need to move from insight to spec fast.",
    competitorSummary:
      "Dovetail is a qualitative research platform and insight repository. Teams use it to tag, cluster, and store interview notes and research findings. Strong at organising existing research; weaker at turning it into actionable product specs.",
    tableRows: [
      { feature: "PRD generation from customer data", pmread: true, competitor: false },
      { feature: "AI insight extraction from uploads", pmread: true, competitor: "Manual tagging" },
      { feature: "PDF / audio / video ingestion", pmread: true, competitor: true },
      { feature: "Slack ingestion", pmread: "Pro", competitor: false },
      { feature: "GitHub codebase context", pmread: "Pro", competitor: false },
      { feature: "Research repository / tagging", pmread: false, competitor: true },
      { feature: "Collaborative research notes", pmread: false, competitor: true },
      { feature: "Interview highlight reels", pmread: false, competitor: true },
      { feature: "Auto-generated PRD sections", pmread: true, competitor: false },
      { feature: "Free tier", pmread: "2 PRDs/mo", competitor: "Limited trial" },
      { feature: "Pro pricing", pmread: "₹2,499/mo", competitor: "$30–$50/user/mo" },
      { feature: "Built for India market", pmread: true, competitor: false },
    ],
    pmreadWins: [
      "Turns customer feedback directly into PRD drafts — no manual synthesis step",
      "Significantly cheaper, especially for solo PMs and small teams in India",
      "GitHub context means your PRD references the actual codebase",
      "One tool covers ingest → insights → spec; no separate PRD tool needed",
    ],
    competitorWins: [
      "Best-in-class research repository with rich tagging and clustering",
      "Interview highlight reels for sharing evidence with stakeholders",
      "Collaborative team workspace for large UX research orgs",
      "More mature integration ecosystem (Jira, Confluence, Notion)",
    ],
    verdict:
      "If your primary job is managing a large bank of qualitative research and sharing it across a UX org, Dovetail is the right tool. If your primary job is going from customer feedback to a shipped feature spec — and you want AI to handle the synthesis — PMRead is faster and significantly cheaper. Many teams use both: Dovetail as the research archive, PMRead for active PRD work.",
    faqs: [
      {
        q: "Can PMRead import data from Dovetail?",
        a: "Not directly via integration today. You can export insights from Dovetail as PDF or text and upload them to PMRead for PRD generation. Native Dovetail import is on the roadmap.",
      },
      {
        q: "Does Dovetail generate PRDs?",
        a: "Dovetail can summarise research themes with AI, but it does not generate structured PRDs with user stories, requirements, and success metrics. You'd need to copy findings to a separate doc-writing tool.",
      },
      {
        q: "Which is better for a solo PM?",
        a: "PMRead. A solo PM rarely needs a team research repository — they need to go from customer calls to a spec quickly. PMRead's free tier covers 2 PRDs/month; Dovetail's pricing is designed for team seats.",
      },
      {
        q: "Which is better for a large UX research team?",
        a: "Dovetail for organising and sharing research. Add PMRead for the PMs on that team who need to turn research into specs. The tools solve different problems and complement each other.",
      },
    ],
  },

  {
    slug: "pmread-vs-productboard",
    competitor: "Productboard",
    competitorShort: "Productboard",
    headline: "PMRead vs Productboard",
    subheadline:
      "Productboard is a full product management platform. PMRead is a focused AI PRD generator. Here's how they differ — and which one you actually need.",
    metaDescription:
      "PMRead vs Productboard — feature comparison, pricing, and honest assessment of which tool fits early-stage vs. enterprise product teams.",
    pmreadSummary:
      "PMRead focuses on one workflow: ingest customer feedback → extract insights with AI → generate a PRD. It's fast, cheap, and purpose-built for PMs who need to move from evidence to spec without friction.",
    competitorSummary:
      "Productboard is a comprehensive product management platform covering roadmapping, customer feedback collection, feature prioritisation, and stakeholder communication. It's the system of record for large product organisations — but brings significant cost and complexity.",
    tableRows: [
      { feature: "AI PRD generation", pmread: true, competitor: "Limited (Pulse AI)" },
      { feature: "Insight extraction from uploads", pmread: true, competitor: "Manual capture" },
      { feature: "Slack ingestion", pmread: "Pro", competitor: "Pro tier" },
      { feature: "GitHub codebase context", pmread: "Pro", competitor: false },
      { feature: "Visual product roadmap", pmread: false, competitor: true },
      { feature: "Feature prioritisation scoring", pmread: false, competitor: true },
      { feature: "Customer portal (idea submission)", pmread: false, competitor: true },
      { feature: "Jira / Linear sync", pmread: false, competitor: true },
      { feature: "Stakeholder-facing roadmap views", pmread: false, competitor: true },
      { feature: "Free tier", pmread: "2 PRDs/mo", competitor: "Trial only" },
      { feature: "Pro pricing", pmread: "₹2,499/mo", competitor: "$20–$80/user/mo" },
      { feature: "Setup time", pmread: "< 5 minutes", competitor: "Days to weeks" },
    ],
    pmreadWins: [
      "AI goes from uploaded transcript to PRD draft in minutes — Productboard requires manual data entry",
      "10–30x cheaper for small teams and solo PMs",
      "Zero configuration — sign up and generate your first PRD without a setup project",
      "GitHub context is unique — PRDs reference actual code, not just product ideas",
    ],
    competitorWins: [
      "Full roadmap management with stakeholder-facing views",
      "Customer feedback portal with voting and segmentation",
      "Deep Jira/Linear integration — features flow into engineering tickets automatically",
      "Enterprise features: SSO, audit logs, role-based access, compliance",
    ],
    verdict:
      "Productboard is built for product organisations that need a single system of record for roadmaps, feedback, and stakeholder communication — typically 5+ PMs with complex cross-team workflows. PMRead is built for the PM who has a folder of customer calls, a Slack channel full of feedback, and needs a first-draft PRD by end of day. If you're pre-Series B or a solo PM, PMRead will serve you faster and at a fraction of the cost.",
    faqs: [
      {
        q: "Does Productboard have AI features?",
        a: "Productboard has Pulse AI, which summarises customer feedback themes. It doesn't generate structured PRDs with user stories, requirements, and success metrics. The AI capability is more limited and positioned as a summary layer, not a spec generator.",
      },
      {
        q: "Can I use PMRead alongside Productboard?",
        a: "Yes. Many teams use Productboard as the roadmap and stakeholder communication layer, and PMRead to generate the actual feature specs. PMRead output can be pasted directly into Productboard's document fields.",
      },
      {
        q: "Is Productboard worth the price for a startup?",
        a: "At $20–$80/user/month per PM, Productboard adds up quickly for early-stage startups. Most pre-Series A teams get 80% of the value from a Notion-based roadmap + PMRead for spec generation — at a fraction of the cost.",
      },
      {
        q: "What does PMRead not do that Productboard does?",
        a: "PMRead does not have a visual roadmap, customer feedback portal, feature voting, or Jira sync. If you need those capabilities, Productboard or a similar tool (Aha!, Linear) covers them. PMRead is narrowly focused on turning customer evidence into PRD drafts.",
      },
    ],
  },

  {
    slug: "pmread-vs-notion-ai",
    competitor: "Notion AI",
    competitorShort: "Notion AI",
    headline: "PMRead vs Notion AI",
    subheadline:
      "Notion AI writes from prompts. PMRead writes from your actual customer data. Here's why that difference matters for PRD quality.",
    metaDescription:
      "PMRead vs Notion AI — comparison of AI PRD generation. Why customer-data-grounded PRDs beat template-based AI writing for product managers.",
    pmreadSummary:
      "PMRead ingests your actual customer feedback — calls, transcripts, PDFs, Slack messages, GitHub issues — extracts structured insights, and generates PRDs backed by real evidence. Every requirement traces back to customer data.",
    competitorSummary:
      "Notion AI is a general-purpose writing assistant built into Notion. It generates text from prompts and can help structure documents. Without access to your customer data, it generates plausible-sounding but ungrounded PRD content — useful for formatting, not for evidence-backed requirements.",
    tableRows: [
      { feature: "PRD generation from customer data", pmread: true, competitor: false },
      { feature: "Upload & analyse transcripts/PDFs", pmread: true, competitor: false },
      { feature: "AI insight extraction", pmread: true, competitor: false },
      { feature: "Evidence-backed requirements", pmread: true, competitor: false },
      { feature: "AI writing / formatting assistance", pmread: "Focused on PRDs", competitor: true },
      { feature: "General document creation", pmread: false, competitor: true },
      { feature: "Team wiki / knowledge base", pmread: false, competitor: true },
      { feature: "Database / project tracking", pmread: false, competitor: true },
      { feature: "Slack ingestion", pmread: "Pro", competitor: false },
      { feature: "GitHub context", pmread: "Pro", competitor: false },
      { feature: "Free tier", pmread: "2 PRDs/mo", competitor: "Free (limited AI)" },
      { feature: "AI pricing", pmread: "₹2,499/mo", competitor: "$10/user/mo add-on" },
    ],
    pmreadWins: [
      "PRDs grounded in real customer evidence — not hallucinated requirements",
      "Directly ingests transcripts, PDFs, Slack, and GitHub — Notion AI has no ingest capability",
      "Structured insight extraction by type (pain point, feature request, bug report)",
      "Purpose-built for PM workflows — not a generic writing tool",
    ],
    competitorWins: [
      "Full workspace: docs, databases, wikis, and project tracking in one place",
      "AI works across all content types, not just PRDs",
      "Already where many teams store their documentation",
      "Cheaper if you're already paying for Notion",
    ],
    verdict:
      "Notion AI is the right choice if you want an AI layer on top of your existing Notion workspace for general writing tasks. PMRead is the right choice if you want PRDs that are grounded in what your customers actually said — not what an AI thinks a PRD should say. The core difference: Notion AI generates text from your prompts; PMRead generates specifications from your customer data. For serious product work, the latter produces dramatically better requirements.",
    faqs: [
      {
        q: "Can't I just paste my transcripts into Notion AI?",
        a: "You can, but Notion AI's context window limits how much transcript it can process, and it doesn't extract structured insights — it summarises. PMRead processes multiple sources, extracts insights by category (pain points, feature requests, bugs), deduplicates them by frequency, and then generates a structured PRD. The output quality is significantly different.",
      },
      {
        q: "Is PMRead a replacement for Notion?",
        a: "No. PMRead doesn't replace your wiki, project tracker, or meeting notes. It's a specialist tool for one workflow: customer evidence → PRD. Most PMRead users store the generated PRD in Notion — the two tools work well together.",
      },
      {
        q: "What if I just use ChatGPT for PRDs?",
        a: "ChatGPT and Notion AI share the same limitation: they generate from prompts, not from your data. They produce well-formatted PRDs that sound convincing but aren't grounded in your specific customers' problems. PMRead's PRDs cite actual frequency data ('8 of your last 20 customers mentioned X') — ChatGPT can't do this.",
      },
      {
        q: "Which is better for a PM who already uses Notion?",
        a: "Use both. Keep Notion as your workspace and use PMRead specifically for PRD generation. The PMRead output is markdown — copy it directly into a Notion page. You get customer-grounded specs in your existing workspace.",
      },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
