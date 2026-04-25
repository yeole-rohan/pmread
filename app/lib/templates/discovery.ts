import type { Template } from "./types";

export const discoveryTemplates: Template[] = [
  {
    slug: "competitive-analysis",
    title: "Competitive Analysis Template",
    shortTitle: "Competitive Analysis",
    category: "Discovery",
    description:
      "A structured competitive analysis template covering competitor overview, feature comparison matrix, positioning, pricing, strengths and weaknesses, and strategic implications.",
    metaDescription:
      "Free competitive analysis template for product managers. Feature comparison matrix, positioning map, pricing analysis, and strategic takeaways. Copy-paste ready.",
    filename: "competitive-analysis-template.md",
    content: `# Competitive Analysis

**Product:** [Your Product]
**Analyst:** [PM Name]
**Date:** [Date]
**Reviewed with:** [Stakeholders who reviewed this]

---

## Why We're Doing This Analysis

> [1–2 sentences: what decision or question this analysis is meant to inform]

---

## Competitors Included

| # | Competitor | Category | Why Included |
|---|---|---|---|
| 1 | [Name] | Direct / Indirect / Substitute | [Why they matter] |
| 2 | [Name] | Direct / Indirect / Substitute | [Why they matter] |
| 3 | [Name] | Direct / Indirect / Substitute | [Why they matter] |
| 4 | [Name] | Direct / Indirect / Substitute | [Why they matter] |

---

## Feature Comparison Matrix

| Feature | Us | [Competitor 1] | [Competitor 2] | [Competitor 3] |
|---|---|---|---|---|
| [Core feature] | ✅ | ✅ | ❌ | ✅ |
| [Core feature] | ✅ | ❌ | ✅ | ❌ |
| [Differentiating feature] | ✅ | ❌ | ❌ | ❌ |
| [Table-stakes feature] | ✅ | ✅ | ✅ | ✅ |
| [Requested feature] | 🔲 | ✅ | ✅ | ❌ |

Legend: ✅ Full support · ⚡ Partial · ❌ Not available · 🔲 On our roadmap

---

## Competitor Deep Dives

### [Competitor 1]

**Positioning:** [How they describe themselves]
**Target customer:** [Who they go after]
**Pricing:** [Plans and pricing, if public]
**Key strengths:**
- [Strength 1]
- [Strength 2]

**Key weaknesses:**
- [Weakness 1]
- [Weakness 2]

**What they're saying about us:** [If known — from G2, sales calls, etc.]

---

### [Competitor 2]

**Positioning:** [How they describe themselves]
**Target customer:** [Who they go after]
**Pricing:** [Plans and pricing]
**Key strengths:**
- [Strength 1]

**Key weaknesses:**
- [Weakness 1]

---

## Pricing Comparison

| | Us | [Comp 1] | [Comp 2] | [Comp 3] |
|---|---|---|---|---|
| Free tier | [Details] | [Details] | [Details] | [Details] |
| Entry paid | [Price / features] | | | |
| Mid tier | [Price / features] | | | |
| Enterprise | [Contact us / price] | | | |

---

## Positioning Map

Plot competitors on two axes most relevant to your market (e.g. Price vs. Depth of AI, Ease of use vs. Power):

\`\`\`
         High [Axis Y]
              |
  [Comp B]   |     [Comp A]
             |
 ────────────┼────────────
             |
  [Comp C]   |     [Us]
              |
          Low [Axis Y]
    Low [Axis X]     High [Axis X]
\`\`\`

---

## Our Competitive Advantages

1. **[Advantage]** — [Why this is hard to copy and valuable to customers]
2. **[Advantage]** — [Why this is hard to copy and valuable to customers]
3. **[Advantage]** — [Why this is hard to copy and valuable to customers]

## Our Gaps (Honest Assessment)

1. **[Gap]** — [What we're missing vs. competitors and our plan to address it]
2. **[Gap]** — [What we're missing vs. competitors and our plan to address it]

---

## Strategic Implications

| Insight | Recommended Action | Owner | Timeline |
|---|---|---|---|
| [What this tells us] | [What to do about it] | [Name] | [Quarter] |
| [What this tells us] | [What to do about it] | [Name] | [Quarter] |

---

## Sources

- [Source: G2 reviews, competitor website, sales call notes, etc.]
- [Source]
`,
    howToUse: [
      {
        step: "Define the decision first",
        detail:
          "A competitive analysis without a specific question is just a pile of information. Start with 'This analysis will help us decide...' — it keeps the scope tight and makes the strategic implications section useful.",
      },
      {
        step: "Include indirect competitors",
        detail:
          "Your customers' alternative to your product is often a spreadsheet or doing nothing. Include these as 'substitute' competitors — they're often the hardest to displace.",
      },
      {
        step: "Get data from customers, not just websites",
        detail:
          "Competitor websites show what they want you to see. Sales call notes, G2 reviews, and customer interviews reveal what customers actually experience. Weight these sources higher.",
      },
      {
        step: "Update quarterly, not just at planning time",
        detail:
          "Competitors ship fast. A competitive analysis that's 6 months old can lead to bad positioning decisions. Set a calendar reminder to update the feature matrix every quarter.",
      },
    ],
    faqs: [
      {
        q: "How many competitors should I include?",
        a: "3–5 direct competitors is the right scope for most analyses. Going broader than 7 produces noise rather than insight. Focus on companies your customers actively compare you to — not every player in the market.",
      },
      {
        q: "Where do I get reliable competitor data?",
        a: "In priority order: your own sales call recordings (where prospects mention alternatives), G2 and Capterra reviews, competitor changelog pages, their job listings (signals what they're building), and their marketing pages. Avoid relying on Gartner reports alone — they lag reality by 12–18 months.",
      },
      {
        q: "Should I share the competitive analysis externally?",
        a: "No. Competitive analyses contain sensitive strategic assessments about your own weaknesses. Share internally and mark as confidential. If a customer asks about competitors, use a sales battle card — a sanitized, public-safe version focused on differentiation.",
      },
      {
        q: "What's the difference between a competitive analysis and a battle card?",
        a: "A competitive analysis is an internal strategic document covering the full landscape. A battle card is a 1-page sales tool for handling objections about a specific competitor in real time. Build the analysis first, then distill it into battle cards per competitor.",
      },
    ],
    keywords: ["competitive analysis template", "competitor analysis framework", "competitive research template", "competitive analysis product management", "competitor comparison template"],
  },

  // ─── 8. Go-to-Market Template ─────────────────────────────────────────────,

  {
    slug: "product-brief-template",
    title: "Product Brief Template",
    shortTitle: "Product Brief",
    category: "Discovery",
    description:
      "A concise product brief template that aligns stakeholders before a PRD is written. Covers problem, opportunity, proposed solution, constraints, and open questions.",
    metaDescription:
      "Free product brief template for PMs. Covers problem statement, opportunity sizing, proposed solution, constraints, and success metrics. 1-page alignment doc. No signup.",
    filename: "product-brief-template.md",
    content: `# Product Brief

**Title:** [Feature / Initiative Name]
**Author:** [PM Name]
**Date:** [Date]
**Status:** Draft / Shared for Review / Approved

> A product brief is a 1-page alignment document written *before* a PRD. Its purpose is to get stakeholder agreement on the problem and direction — not to specify requirements.

---

## Problem

> What problem are we solving and for whom?

[2–4 sentences. Be specific about the user, the friction, and the frequency. Avoid jumping to solutions here.]

**Evidence this problem is real:**
- [Customer quote, support ticket volume, survey data, or sales call insight]
- [Data point: "X% of users drop off at Y step"]

---

## Opportunity

**Who experiences this problem:** [User segment — be specific]
**How many users:** [Rough count or % of user base]
**Frequency:** [How often they hit this problem]
**Current workaround:** [What they do today — manual, competitor, nothing]

**Business opportunity:**
- [Revenue impact, retention impact, or activation improvement if solved]

---

## Proposed Direction

> Not a spec — a direction. Engineering will shape the solution.

[3–5 sentences describing the approach we're considering and why. What we build, what we don't, and the key design bet we're making.]

**Key assumption we're making:** [The belief that must be true for this direction to work]

---

## Goals

- [ ] [Primary user outcome]
- [ ] [Business metric we expect to move]

## Non-Goals

- [What we are explicitly not doing in this initiative]
- [Adjacent problem we are not solving here]

---

## Constraints

| Constraint | Detail |
|---|---|
| Timeline | [Hard deadline, if any] |
| Engineering | [Estimated size or team capacity] |
| Dependencies | [Teams or systems we depend on] |
| Regulatory | [Compliance or legal constraint, if any] |

---

## Open Questions

- [ ] [Question that must be answered before we can write a PRD]
- [ ] [Risk or unknown that needs validation]

---

## Proposed Next Steps

- [ ] [Stakeholder review by: date]
- [ ] [Discovery spike or prototype by: date]
- [ ] [PRD draft by: date]

---

## Stakeholder Sign-off

| Role | Name | Status |
|---|---|---|
| Engineering Lead | [Name] | Pending / Approved |
| Design | [Name] | Pending / Approved |
| Data / Analytics | [Name] | Pending / Approved |
| Leadership | [Name] | Pending / Approved |
`,
    howToUse: [
      {
        step: "Write the brief before the PRD",
        detail:
          "The brief's job is to build alignment on the problem before anyone spends time specifying a solution. If stakeholders disagree on whether the problem is worth solving, discovering that in a 1-page brief saves weeks of PRD work.",
      },
      {
        step: "Keep it to one page",
        detail:
          "A brief that exceeds two pages has become a PRD. If you're writing detailed requirements, stop — you've moved past alignment and into specification. Push detailed requirements to a separate PRD once the brief is approved.",
      },
      {
        step: "Lead with evidence, not opinions",
        detail:
          "The 'Evidence this problem is real' section is the most important part. Stakeholders who see a customer quote and a data point are far more likely to approve a direction than stakeholders who hear 'I think users want this.'",
      },
      {
        step: "List your open questions explicitly",
        detail:
          "Open questions signal intellectual honesty and prevent you from being held accountable for decisions that haven't been made yet. Every question in this section should have an owner and a resolution path.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a product brief and a PRD?",
        a: "A product brief (also called a one-pager or product spec) answers 'what problem are we solving and why?' — it's an alignment document. A PRD answers 'what exactly should we build?' — it's a specification document. Write the brief first, get agreement, then write the PRD. Many teams skip the brief and start with the PRD, which leads to expensive late-stage disagreements about scope.",
      },
      {
        q: "Who should review the product brief?",
        a: "At minimum: the engineering lead, design lead, and whoever owns the product metric you're trying to move. For features that touch pricing, legal, or compliance, include those stakeholders early. The goal is to surface disagreements before they become PRD debates.",
      },
      {
        q: "How long should it take to write a product brief?",
        a: "2–4 hours for a well-defined problem. If it's taking longer, the problem is not yet clearly understood — which is exactly the signal you need before writing requirements. Use the brief's open questions section to park unresolved questions and move forward.",
      },
      {
        q: "Do I need a brief for every feature?",
        a: "No. For small, well-understood improvements (under a week of work, single team), a ticket with acceptance criteria is enough. Reserve the brief format for new capabilities, cross-team initiatives, or anything with ambiguity about whether the problem is worth solving.",
      },
    ],
    keywords: ["product brief template", "product brief format", "one pager product template", "product spec template", "product brief example"],
  },

  // ─── 12. Lean Canvas ──────────────────────────────────────────────────────,

  {
    slug: "lean-canvas",
    title: "Lean Canvas Template",
    shortTitle: "Lean Canvas",
    category: "Discovery",
    description:
      "A one-page Lean Canvas template adapted for product teams and founders. Covers problem, customer segments, unique value proposition, solution, channels, revenue streams, cost structure, key metrics, and unfair advantage.",
    metaDescription:
      "Free Lean Canvas template for product managers and founders. One-page business model canvas with problem, UVP, channels, revenue, and metrics. Copy-paste ready.",
    filename: "lean-canvas-template.md",
    content: `# Lean Canvas

**Product / Startup:** [Name]
**Author:** [Name]
**Date:** [Date]
**Version:** [1.0 — update as assumptions are validated]

> The Lean Canvas is a 1-page business model snapshot. Fill it in 20 minutes. Update it as you learn. Every cell is an assumption until validated.

---

## 1. Problem

> Top 3 problems your customers have that you're solving.

1. [Primary problem — the one that hurts most]
2. [Secondary problem]
3. [Tertiary problem]

**Existing alternatives:**
How do customers solve this today?
- [Alternative 1 — competitor, workaround, or doing nothing]
- [Alternative 2]

---

## 2. Customer Segments

> Who has the problems above? Be specific — "everyone" is not a customer segment.

**Target customers:**
- [Primary segment — job title, company type, or demographic]
- [Secondary segment]

**Early adopters:**
[The subset of your target customer who feels the problem most acutely and will try your product first. Be very specific.]

---

## 3. Unique Value Proposition (UVP)

> Single, clear, compelling message that says why you're different and worth paying attention to.

**Headline (≤ 10 words):**
[e.g. "Turn Customer Interviews into PRDs in Minutes"]

**Sub-headline (1–2 sentences):**
[Expand on who it's for and what they get]

---

## 4. Solution

> Simplest thing that solves each of the three problems. Not a feature list — the core concept.

1. [Solution to Problem 1]
2. [Solution to Problem 2]
3. [Solution to Problem 3]

---

## 5. Channels

> How do you reach your customer segments?

**Awareness:**
- [Channel: e.g. SEO, content marketing, paid social, word of mouth]

**Acquisition:**
- [Channel: e.g. freemium, sales outreach, PLG, app store]

**Retention / Expansion:**
- [Channel: e.g. email, in-app, account management]

---

## 6. Revenue Streams

| Source | Model | Price |
|---|---|---|
| [Primary revenue] | [Subscription / usage / one-time] | [₹/$ per user/month] |
| [Secondary revenue] | [Model] | [Price] |

**Lifetime Value (LTV) estimate:** [₹/$ per customer]
**Payback period:** [Months to recover CAC]

---

## 7. Cost Structure

**Fixed costs:**
- [Hosting / infrastructure: ₹X/mo]
- [Team: ₹X/mo]

**Variable costs:**
- [Cost per transaction / API call / user]

**Customer Acquisition Cost (CAC) estimate:** [₹/$ per customer]

---

## 8. Key Metrics

> The 3–5 numbers that tell you if the business is working. One primary metric to rule them all.

**North Star Metric:** [The single number that best captures value delivered to customers]

| Metric | Current | Target (90 days) |
|---|---|---|
| [Activation rate] | [X%] | [Y%] |
| [Retention D30] | [X%] | [Y%] |
| [MRR] | [₹X] | [₹Y] |
| [CAC] | [₹X] | [₹Y] |

---

## 9. Unfair Advantage

> What do you have that cannot easily be copied or bought?

[Examples: proprietary data, founder domain expertise, network effects, exclusive partnerships, regulatory moat, brand trust]

**Be honest — most early-stage products don't have this yet. That's fine. Write what you're building toward.**

---

## Assumption Validation Tracker

| Assumption | Type | Validated? | Evidence |
|---|---|---|---|
| [Customers have Problem 1] | Customer | ❌ | [Interview, survey, data] |
| [Customers will pay ₹X/mo] | Revenue | ❌ | |
| [Channel X will convert at Y%] | Channel | ❌ | |
`,
    howToUse: [
      {
        step: "Fill it in 20 minutes — don't overthink it",
        detail:
          "The Lean Canvas is a snapshot of your current thinking, not a finished strategy. Speed is the point. Fill every cell quickly, then use the Assumption Validation Tracker to decide what to test first.",
      },
      {
        step: "Start with Customer Segments and Problem",
        detail:
          "These two cells are the foundation. If you're wrong about who your customer is or what problem they have, everything else is irrelevant. Fill these from real interviews, not assumptions.",
      },
      {
        step: "Be ruthlessly specific about Early Adopters",
        detail:
          "Early adopters aren't 'all PMs' — they're 'solo PMs at Series A startups who manage at least 3 engineers and are frustrated by manual feedback synthesis.' The more specific, the easier it is to find and sell to them.",
      },
      {
        step: "Update it after every discovery sprint",
        detail:
          "Keep the version number. A Lean Canvas that hasn't been updated in 3 months is a record of old assumptions, not current strategy. Treat updates as a sign of learning, not failure.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a Lean Canvas and a Business Model Canvas?",
        a: "The Business Model Canvas (Osterwalder) was designed for established businesses. Ash Maurya adapted it into the Lean Canvas for startups, replacing 'Key Partners', 'Key Activities', and 'Customer Relationships' with 'Problem', 'Key Metrics', and 'Unfair Advantage' — the cells that matter most when you're still finding product-market fit.",
      },
      {
        q: "Can I use the Lean Canvas for an internal product or a new feature?",
        a: "Yes. Replace 'Revenue Streams' with 'Value to the business' (cost savings, efficiency gains, revenue impact). Replace 'Cost Structure' with 'Engineering investment'. The rest of the cells apply directly — particularly Problem, Customer Segments, UVP, and Key Metrics.",
      },
      {
        q: "How often should I update the Lean Canvas?",
        a: "After every significant discovery activity — a batch of user interviews, a pricing experiment, or a channel test. In early-stage, monthly updates are normal. The canvas should feel like a living document, not a finished deliverable.",
      },
      {
        q: "What if I can't fill in the Unfair Advantage cell?",
        a: "Most early-stage products can't. Leave it honest: 'Not yet established — building toward X.' The danger is filling this cell with something soft like 'our team is passionate' — that's not an unfair advantage. Think network effects, proprietary data, regulatory barriers, or deep domain expertise.",
      },
    ],
    keywords: ["lean canvas template", "lean startup canvas", "business model canvas product manager", "lean canvas free", "lean canvas example"],
  },

  // ─── 13. North Star Metric Framework ──────────────────────────────────────,

  {
    slug: "north-star-metric",
    title: "North Star Metric Framework",
    shortTitle: "North Star",
    category: "Discovery",
    description:
      "A framework for defining and aligning your team around a single North Star Metric. Covers candidate evaluation, input metrics, counter-metrics, and a team alignment canvas.",
    metaDescription:
      "Free North Star Metric template for product teams. Covers NSM definition, input metrics, counter-metrics, and team alignment. Copy-paste ready, no signup.",
    filename: "north-star-metric-framework.md",
    content: `# North Star Metric Framework

**Product:** [Name]
**Team:** [Team / Squad]
**Author:** [PM Name]
**Date:** [Date]

---

## What Is a North Star Metric?

A North Star Metric (NSM) is the single metric that best captures the core value your product delivers to customers. It connects daily product work to long-term business outcomes.

**A good NSM:**
- Measures value delivered to the customer (not just business revenue)
- Is sensitive to product decisions (moves when you ship good things)
- Is lagging enough to be meaningful (not trivially gamed)
- Can be understood by the whole team in one sentence

---

## Step 1: Candidate Metrics

List 3–5 potential North Star Metrics. Be honest about why each one might not work.

| Candidate Metric | What it measures | Risk / Why it might be wrong |
|---|---|---|
| [e.g. Weekly Active Users] | Breadth of engagement | Doesn't measure depth of value |
| [e.g. # PRDs generated/week] | Core action completed | Could be gamed with low-quality output |
| [e.g. % users who return D7] | Retention / habit formed | Lagging — slow to respond to changes |
| [Your candidate] | | |

---

## Step 2: Our North Star Metric

**North Star Metric:**
> [Metric name and definition in one sentence]

**Current value:** [X per week / month]
**Target (12 months):** [Y]
**How it's measured:** [Tool, query, or dashboard link]

**Why this is the right NSM:**
[2–3 sentences explaining why this metric captures value to the customer AND predicts long-term business health. If you can't explain this clearly, the metric isn't right yet.]

---

## Step 3: Input Metrics (Leading Indicators)

Input metrics are the levers your team controls that drive the NSM. Break the NSM into 3–5 components.

> Formula: NSM = f(Input 1, Input 2, Input 3...)

| Input Metric | How it feeds the NSM | Owner | Current | Target |
|---|---|---|---|---|
| [e.g. Activation rate] | More activated users → more weekly actions | [Team] | [X%] | [Y%] |
| [e.g. D7 retention] | Users who return drive weekly engagement | [Team] | [X%] | [Y%] |
| [e.g. Feature adoption: X] | Users who use X are 3x more likely to return | [Team] | [X%] | [Y%] |

---

## Step 4: Counter-Metrics (Guard Rails)

Counter-metrics prevent optimising the NSM at the expense of things that matter.

| Counter-Metric | What it protects | Acceptable threshold |
|---|---|---|
| [e.g. Support ticket volume] | Quality — prevents shipping fast and breaking things | < [X] tickets/week |
| [e.g. Time-to-value] | Onboarding — prevents engagement that hides bad activation | < [X] minutes |
| [e.g. Churn rate] | Revenue — ensures engagement translates to retention | < [X%]/month |

---

## Step 5: Team Alignment Canvas

Use this in your next all-hands or team meeting.

**Our North Star Metric is:** ___________________

**It matters because:** [One sentence connecting NSM to customer value]

**This quarter, we're moving it by focusing on:** [Top 1–2 input metrics]

**We'll know we're succeeding when:** [NSM reaches X by date]

**We'll know we're failing when:** [Counter-metric breaches Y]

---

## Common NSM Mistakes

| Mistake | Example | Why it's wrong |
|---|---|---|
| Revenue as NSM | MRR | Measures business outcome, not customer value. Revenue follows value; it doesn't define it. |
| Vanity metric | App downloads | Easy to game; doesn't measure whether users got value |
| Too broad | "User satisfaction" | Unmeasurable; not actionable |
| Too narrow | "% users who clicked button X" | Doesn't capture overall product health |
`,
    howToUse: [
      {
        step: "Pick one metric — not two or three",
        detail:
          "The hardest part of this exercise is the forcing function of choosing just one. If you can't align on a single NSM, it usually means different team members have different theories of what value your product creates. Resolve that disagreement before writing code.",
      },
      {
        step: "Validate that it moves when you ship good things",
        detail:
          "Look back at the last 3 features you shipped and check whether your candidate NSM moved. If it didn't respond to work you believe was valuable, it's either measuring the wrong thing or lagging too far behind actions.",
      },
      {
        step: "Define input metrics before choosing initiatives",
        detail:
          "The input metrics section is where the NSM becomes actionable. Without input metrics, 'improve NSM' is not a workable strategy. Each input metric should map to a team or initiative that owns it.",
      },
      {
        step: "Always pair the NSM with at least one counter-metric",
        detail:
          "Teams that optimise a single metric without guard rails often produce perverse outcomes — improving engagement at the cost of quality, or improving activation at the cost of retention. Counter-metrics prevent this.",
      },
    ],
    faqs: [
      {
        q: "What are good North Star Metrics by product type?",
        a: "B2B SaaS: weekly active teams, or key workflow completions. Marketplace: successful transactions per week. Consumer social: D30 retained users, or messages sent. Media/content: articles read to completion per user per week. The pattern: find the action that happens repeatedly when a user is getting real value.",
      },
      {
        q: "Should the NSM be a rate or an absolute number?",
        a: "Depends on your growth stage. Early stage: absolute numbers (e.g. 'PRDs generated per week') make it easy to see progress and are motivating. Growth stage: rates and ratios (e.g. '% of users who complete onboarding') are more meaningful because they normalise for user count and reveal efficiency.",
      },
      {
        q: "How often should we review the North Star Metric?",
        a: "The NSM itself should be stable for 12–18 months minimum. Changing it quarterly means you don't have a North Star — you have a metric of the month. Review your input metrics and targets quarterly; review the NSM itself only when your product strategy fundamentally changes.",
      },
      {
        q: "Can different teams have different North Star Metrics?",
        a: "Teams should share one company-level NSM. What differs is the input metrics each team owns. The growth team owns activation rate; the retention team owns D30 retention; the monetisation team owns conversion to paid. Each team's input metric should feed the shared NSM.",
      },
    ],
    keywords: ["north star metric template", "north star metric framework", "nsm product management", "north star metric examples", "product north star metric"],
  },

  // ─── 14. Jobs to be Done (JTBD) ───────────────────────────────────────────,

  {
    slug: "jobs-to-be-done",
    title: "Jobs to Be Done Template",
    shortTitle: "JTBD",
    category: "Discovery",
    description:
      "A Jobs to Be Done template for capturing functional, emotional, and social jobs, along with the forces that drive customers to switch products and the outcomes they're trying to achieve.",
    metaDescription:
      "Free Jobs to Be Done (JTBD) template for product managers. Functional, emotional, and social jobs, switch interview guide, and outcome statements. Copy-paste ready.",
    filename: "jobs-to-be-done-template.md",
    content: `# Jobs to Be Done (JTBD)

**Product / Feature:** [Name]
**Researcher:** [Name]
**Date:** [Date]
**Based on:** [N switch interviews / customer discovery sessions]

---

## What Is a Job to Be Done?

A Job to Be Done is the progress a customer is trying to make in a specific circumstance. Customers don't buy products — they hire them to get a job done.

**Job statement format:**
> When [situation], I want to [motivation / goal], so I can [expected outcome].

---

## Core Job Statement

> When **[situation the customer is in]**,
> I want to **[what they're trying to accomplish]**,
> so I can **[the outcome they're seeking]**.

**Example (for PMRead):**
> When I finish a round of customer interviews, I want to quickly extract the key themes and pain points, so I can write a grounded PRD without spending a full day on synthesis.

---

## Job Layers

### Functional Job
[The practical task the customer is trying to accomplish]
> [Functional job statement]

### Emotional Job
[How the customer wants to feel during or after the job]
> [Emotional job statement — e.g. "feel confident the decision is evidence-based"]

### Social Job
[How the customer wants to be perceived by others]
> [Social job statement — e.g. "be seen as a data-driven PM by their team"]

---

## The Switch Interview: Forces of Progress

Use this framework to understand what pushes customers away from their current solution and toward yours.

### Push (dissatisfaction with old solution)
> What frustrated the customer enough to consider switching?

- [Push 1: Specific frustration with current tool/approach]
- [Push 2]
- [Push 3]

### Pull (attraction toward new solution)
> What about the new solution attracted them?

- [Pull 1: Specific capability or outcome they hoped for]
- [Pull 2]

### Anxiety (fear about switching)
> What made them hesitate to switch?

- [Anxiety 1: e.g. "Will it be too complex to set up?"]
- [Anxiety 2]

### Habit (inertia)
> What kept them with the old solution as long as they stayed?

- [Habit 1: e.g. "The whole team is already in Notion"]
- [Habit 2]

---

## Desired Outcomes (from the customer's perspective)

Desired outcomes are the metrics customers use to judge how well a job is done. Format: verb + metric + object + clarifier.

| # | Desired Outcome | Importance (1–5) | Satisfaction with current solution (1–5) | Opportunity Score |
|---|---|---|---|---|
| 1 | [Minimise the time to turn interviews into themes] | [4] | [2] | [Importance + (Importance − Satisfaction) = X] |
| 2 | [Reduce the risk of missing a critical customer pain point] | | | |
| 3 | [Increase the confidence that the PRD reflects real data] | | | |

> **Opportunity Score** = Importance + (Importance − Satisfaction). Scores > 10 = underserved job. Scores < 5 = overserved.

---

## Job Map (Steps in the Job)

Break the main job into the sequence of steps the customer takes.

| Step | What the customer is doing | Current friction |
|---|---|---|
| 1. Define | [What they do first] | [What's hard / slow / risky] |
| 2. Locate | [Finding inputs or resources] | |
| 3. Prepare | [Setting up to do the job] | |
| 4. Execute | [Core action] | |
| 5. Monitor | [Checking progress] | |
| 6. Conclude | [Finishing and handing off] | |

---

## Strategic Implications

| Job insight | Product or roadmap implication |
|---|---|
| [Insight from job analysis] | [What to build, change, or stop doing] |
| [Insight] | [Implication] |
`,
    howToUse: [
      {
        step: "Run switch interviews, not satisfaction surveys",
        detail:
          "JTBD comes alive through switch interviews — conversations with customers about the specific moment they decided to hire (or fire) a product. Ask 'walk me through the day you decided to start looking for a new solution.' Surveys tell you what; interviews tell you why.",
      },
      {
        step: "Write one core job statement before anything else",
        detail:
          "The core job statement is the anchor for everything else on this template. If it takes you more than 10 minutes to write, you haven't done enough interviews yet. Go back to the customer before filling out the rest.",
      },
      {
        step: "Use the opportunity score to find underserved outcomes",
        detail:
          "The best product opportunities are high-importance outcomes that current solutions satisfy poorly. Any outcome with an opportunity score above 10 is a legitimate product bet. Start your roadmap there.",
      },
      {
        step: "Map the full job, not just your feature's slice",
        detail:
          "The job map shows where your product fits in a larger workflow. Gaps in the map are expansion opportunities; steps where competitors outperform you are competitive risks. PMs who only understand their slice of the job get disrupted by tools that do the whole job.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between JTBD and user personas?",
        a: "Personas describe who a customer is (demographics, goals, frustrations). JTBD describes what progress they're trying to make regardless of who they are. Two people with very different personas can have the same job. JTBD is more useful for innovation; personas are more useful for messaging and UX decisions.",
      },
      {
        q: "How many jobs does a typical product serve?",
        a: "Most successful products have one primary job they do better than alternatives, and 2–4 adjacent jobs they do reasonably well. Products that try to serve too many jobs become bloated and lose to focused competitors. Knowing your primary job helps you say no to features that serve different jobs.",
      },
      {
        q: "How many switch interviews do I need?",
        a: "5–8 is enough to identify a core job clearly. At 3, you might see a pattern. At 10+, you start hitting diminishing returns. The quality of the interview matters more than the count — a deep 60-minute switch interview is worth 5 shallow 15-minute conversations.",
      },
      {
        q: "Is JTBD only for B2C products?",
        a: "No. JTBD works as well or better in B2B. The job is often more clearly articulated in B2B because customers are hiring your product to accomplish a professional outcome they can describe precisely. The switch interview is especially powerful in B2B — buyers often remember exactly when and why they decided to evaluate alternatives.",
      },
    ],
    keywords: ["jobs to be done template", "jtbd framework template", "jobs to be done product management", "jtbd template free", "jobs to be done examples"],
  },

  // ─── 15. Customer Journey Map ─────────────────────────────────────────────

  // ─── 47. Problem Statement Canvas ────────────────────────────────────────
  {
    slug: "problem-statement-canvas",
    title: "Problem Statement Canvas",
    shortTitle: "Problem Statement Canvas",
    category: "Discovery",
    description:
      "A structured canvas for articulating a product problem from all angles — who has it, how severe it is, what they do today, why existing solutions fall short, and what success looks like.",
    metaDescription:
      "Free problem statement canvas for product managers. Define the user, the pain, the current workaround, and the success criterion before writing a single requirement. Copy-paste ready.",
    filename: "problem-statement-canvas.md",
    content: `# Problem Statement Canvas

**Problem Title:** [Short label — e.g. "Onboarding drop-off", "Manual invoice matching"]
**PM Owner:** [Name]
**Date:** [Date]
**Status:** Draft / Validated / Closed

---

## 1. Who Has This Problem?

> Describe the specific person experiencing the problem. Not a persona card — a real human in a real context.

**User segment:** [e.g. "Ops managers at logistics SMBs with 10–50 drivers"]
**When does it occur:** [e.g. "At end-of-month reconciliation, every 4 weeks"]
**How often:** [ ] Daily [ ] Weekly [ ] Monthly [ ] Episodic

**User quote (if available):**
> "[Verbatim quote from a user interview, support ticket, or survey]"

---

## 2. What Is the Problem?

> One sentence. Lead with the user, not the system.

**Statement:** [User/role] cannot [do X] because [constraint], which causes [consequence].

**Example:** "Ops managers cannot reconcile driver expenses in one place because mileage data lives in a spreadsheet and fuel receipts are emailed separately, which causes a 4-hour monthly manual merge exercise."

---

## 3. How Bad Is It?

Rate severity and frequency to prioritize against other problems.

| Dimension | Score (1–5) | Evidence |
|---|---|---|
| **Frequency** — How often does this happen? | | |
| **Severity** — How painful is each occurrence? | | |
| **Breadth** — What % of users are affected? | | |
| **Business impact** — Tied to revenue / retention / NPS? | | |

**Overall priority score (avg):** [X.X / 5]

---

## 4. What Do They Do Today?

> Describe the workaround or current solution — even if it's bad. This is the benchmark you need to beat.

- [ ] Manual process (describe): ___
- [ ] Competitor product (name): ___
- [ ] Custom internal tool: ___
- [ ] They don't solve it / live with the pain: ___

**Why the current approach falls short:**
1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

---

## 5. Why Hasn't It Been Solved?

> This is often the most honest question. If it were easy, someone would have built it.

- [ ] Technical complexity (explain): ___
- [ ] Coordination problem (multiple teams/systems): ___
- [ ] Not previously prioritized: ___
- [ ] The pain is hidden / users don't articulate it: ___
- [ ] Other: ___

---

## 6. What Does "Solved" Look Like?

> Define success from the user's perspective before designing anything.

**User outcome statement:** "After this is fixed, [user] can [do X] in [timeframe] without [the painful step]."

**Measurable signal:**
- [Metric 1 — e.g. "reconciliation time < 30 min"]
- [Metric 2 — e.g. "zero manual spreadsheet merges"]

---

## 7. Constraints and Out-of-Scope

**Hard constraints:**
- [e.g. "Cannot require driver app change — drivers use personal phones"]
- [e.g. "Must work within existing Stripe billing setup"]

**Explicitly out of scope:**
- [e.g. "Payroll processing — owned by Finance team"]
- [e.g. "Real-time GPS tracking — separate roadmap"]

---

## 8. Open Questions

| Question | Owner | Due |
|---|---|---|
| [e.g. "Do ops managers have API access to fuel card provider?"] | | |
| [e.g. "Is the 4-hour figure representative or an outlier?"] | | |

---

## 9. Evidence Log

| Source | Date | Key Finding |
|---|---|---|
| [User interview — Priya, Ops at LogiCo] | [Date] | [Finding] |
| [Support ticket #4421] | [Date] | [Finding] |
| [NPS survey comment] | [Date] | [Finding] |
`,
    howToUse: [
      {
        step: "Fill in Section 1 before anything else",
        detail:
          "The hardest discipline in problem statements is specificity. 'SMB ops managers' is a segment. 'Ops managers at logistics companies with 10–50 drivers who own monthly reconciliation' is a user. The more specific, the easier the rest of the canvas becomes.",
      },
      {
        step: "Write the one-sentence problem in Section 2",
        detail:
          "Use the template: [User] cannot [do X] because [constraint], which causes [consequence]. If you can't fill in all four parts, you don't understand the problem yet. The 'because' clause is the hardest — and the most important.",
      },
      {
        step: "Score severity in Section 3",
        detail:
          "The 4-dimension scoring is for relative prioritization, not absolute truth. A score of 2.5 vs 4.1 tells you which problem to work on next. Don't agonize over exact numbers — directional accuracy is enough.",
      },
      {
        step: "Describe the current workaround honestly",
        detail:
          "If the workaround is 'a spreadsheet and 4 hours', write that. It tells you both the bar you need to beat and the workflow you need to fit into. Products that ignore the current workaround often get ignored.",
      },
      {
        step: "Get the canvas validated by a user before writing requirements",
        detail:
          "Share Section 2 and Section 6 with 2–3 users and ask: 'Does this accurately describe the problem and what success looks like?' If they say 'sort of', the canvas needs revision. Validated problem statements cut rework by half.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a problem statement and a PRD?",
        a: "A problem statement defines what problem exists and for whom, before any solution is proposed. A PRD documents the solution. Skipping directly to the PRD is how teams build the right feature for the wrong problem. The canvas should be written and validated before you open a PRD.",
      },
      {
        q: "How long should this take to fill in?",
        a: "If you already have user research, 30–60 minutes. If you're starting from scratch, 1–2 discovery interviews first, then 30 minutes. The canvas should surface what you don't know as much as what you do — treat gaps as research prompts.",
      },
      {
        q: "How is this different from a 'How Might We' statement?",
        a: "An HMW reframes the problem as an opportunity and is used as a design thinking prompt. This canvas is more rigorous — it forces you to quantify severity, describe current behavior, and define success. Use both: canvas to validate the problem, HMW to open up the solution space.",
      },
      {
        q: "Section 5 asks why it hasn't been solved. Isn't that uncomfortable?",
        a: "Yes, and that's the point. If the answer is 'it was never prioritized', that's fine — go build it. If the answer is 'three teams tried and failed', that's critical context. If it's 'technically very hard', you need to know that before writing user stories.",
      },
      {
        q: "Should I fill in the Evidence Log before or after the canvas?",
        a: "Before. The canvas should summarize evidence, not precede it. If you have no entries in Section 9, you're writing fiction. At minimum, 2 user quotes and 1 quantitative signal (support ticket volume, survey %, churn flag) before calling a problem validated.",
      },
    ],
  },
];