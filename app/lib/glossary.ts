export interface GlossaryTerm {
  slug: string;
  term: string;
  category: string;
  shortDef: string;
  metaDescription: string;
  definition: string; // markdown
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  relatedTemplates: { slug: string; title: string }[];
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "prd",
    term: "PRD (Product Requirements Document)",
    category: "Documentation",
    shortDef:
      "A written document that describes what a product or feature should do, why it exists, and how success will be measured — before engineering begins.",
    metaDescription:
      "What is a PRD? A Product Requirements Document defines what to build, why, and how success is measured. Learn the format, structure, and best practices.",
    definition: `## What is a PRD?

A **Product Requirements Document (PRD)** is a written artifact that defines the scope, purpose, and success criteria of a product feature or initiative. It is the primary communication tool between product management and engineering, design, and QA.

A well-written PRD answers three questions:
1. **What problem are we solving, and for whom?**
2. **What should the product do to solve it?**
3. **How will we know if it worked?**

---

## What a PRD typically contains

| Section | Purpose |
|---|---|
| Problem statement | The user pain being solved and the evidence for it |
| Goals & non-goals | What success looks like — and what's explicitly out of scope |
| User stories | Scenarios written from the user's perspective |
| Functional requirements | What the system must do (P0 / P1 / P2 priority) |
| UX & design requirements | Accessibility, layouts, Figma links |
| Technical constraints | Performance targets, API dependencies, security |
| Success metrics | Measurable outcomes with baselines and targets |
| Timeline & milestones | Key dates for design, engineering, QA, launch |
| Open questions | Unresolved decisions that could change scope |

---

## PRD vs BRD vs MRD

| Document | Who writes it | What it covers |
|---|---|---|
| **MRD** (Market Requirements Document) | Product / Marketing | Market problem, opportunity, customer segments |
| **BRD** (Business Requirements Document) | Business analyst / PM | What the business needs — common in enterprise IT |
| **PRD** (Product Requirements Document) | Product Manager | What the product should do — standard in tech companies |

In most startups and tech companies, the PRD is the only document that matters. MRDs and BRDs are artifacts of older enterprise processes.

---

## When to write a PRD

Write a full PRD for features that:
- Span multiple teams or require cross-functional alignment
- Carry high ambiguity about scope or approach
- Have significant user journey changes
- Take more than one sprint to build

For small changes (< 1 sprint, single team, low ambiguity), a well-written Jira or Linear ticket with acceptance criteria is usually enough.

---

## Common PRD mistakes

- **Starting with solutions instead of problems.** A PRD that leads with "build a dashboard" instead of "users can't see their data without exporting to Excel" is a requirements document for the wrong thing.
- **No non-goals.** Listing what you're not building is as important as what you are. Without it, scope creep is inevitable.
- **Unmeasurable success metrics.** "Improve user experience" is not a metric. "Reduce time-to-complete onboarding from 8 minutes to 4 minutes" is.
- **Written in isolation.** The best PRDs are co-authored with an engineering lead. Their early input on feasibility prevents late rewrites.`,
    faqs: [
      {
        q: "How long should a PRD be?",
        a: "2–5 pages for most features. 8–12 pages for large platform bets. If it's longer than 15 pages, split it. The goal is to be unambiguous, not comprehensive.",
      },
      {
        q: "Should engineering be involved before the PRD is written?",
        a: "Yes. Involve an engineering lead in the problem statement and scope sections. Their input on feasibility and constraints makes requirements more realistic and avoids late rewrites.",
      },
      {
        q: "Does every feature need a PRD?",
        a: "No. For changes under 1 sprint with low ambiguity, a detailed Jira ticket is sufficient. Reserve the full PRD for features with cross-team scope, significant user journey changes, or high uncertainty.",
      },
      {
        q: "What's the difference between a PRD and a spec?",
        a: "A PRD defines what to build and why (product perspective). A spec defines how to build it (engineering perspective). A PRD precedes the spec. In some teams, the spec is written inside the PRD as a separate section.",
      },
    ],
    relatedSlugs: ["okr", "rice-scoring"],
    relatedTemplates: [
      { slug: "prd-template", title: "PRD Template" },
      { slug: "user-story-template", title: "User Story Template" },
      { slug: "acceptance-criteria", title: "Acceptance Criteria Template" },
    ],
  },

  {
    slug: "rice-scoring",
    term: "RICE Scoring",
    category: "Prioritization",
    shortDef:
      "A quantitative feature prioritization framework that scores each initiative by Reach, Impact, Confidence, and Effort — producing a single number to rank your roadmap.",
    metaDescription:
      "What is RICE scoring? Learn how to prioritize features using the RICE framework — Reach, Impact, Confidence, Effort. Formula, examples, and common mistakes.",
    definition: `## What is RICE Scoring?

**RICE scoring** is a prioritization framework that helps product managers rank features and initiatives using four factors:

| Factor | Definition | Unit |
|---|---|---|
| **Reach** | How many users are affected per quarter? | Number of users |
| **Impact** | How much does it move the needle per user? | 0.25 / 0.5 / 1 / 2 / 3 |
| **Confidence** | How certain are you in your estimates? | % (50 / 80 / 100) |
| **Effort** | Total person-months to build | Person-months |

### The formula

> **RICE Score = (Reach × Impact × Confidence%) ÷ Effort**

A higher score means higher priority.

---

## Worked example

| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| Bulk CSV export | 800 | 1 | 80% | 0.5 | **1,280** |
| SSO / SAML login | 200 | 3 | 80% | 2 | **240** |
| Slack notifications | 1,200 | 0.5 | 100% | 0.5 | **1,200** |
| AI summary widget | 400 | 2 | 50% | 3 | **133** |

Ranked order: CSV export → Slack notifications → SSO → AI widget.

---

## Impact scale

| Score | Description |
|---|---|
| 3 | Massive impact — fundamentally changes user behaviour |
| 2 | High impact — significant improvement to core workflow |
| 1 | Medium impact — noticeable improvement |
| 0.5 | Low impact — minor convenience |
| 0.25 | Minimal impact — edge case |

---

## When to use RICE

Use RICE when:
- You have a backlog of 10+ items competing for the same sprint capacity
- You need to defend prioritization decisions to stakeholders
- You want to depersonalize debates ("the data says X, not my opinion")

Don't use RICE for:
- < 5 items where tradeoffs are obvious
- Pure compliance or regulatory work (must-do regardless of score)
- Very early-stage products where all Reach and Impact estimates are noise

---

## Common mistakes

- **Using 100% confidence for everything.** Low confidence should reduce the score. If you're not sure the impact is real, score it at 50%.
- **PM estimates Effort.** Engineering estimates Effort. PMs estimate Reach, Impact, and Confidence. Mixing this creates biased scores.
- **Adjusting scores after calculating.** If you adjust scores to match a predetermined answer, you've built a rationalization tool, not a prioritization tool.`,
    faqs: [
      {
        q: "What's the difference between RICE and ICE scoring?",
        a: "ICE (Impact × Confidence × Ease) skips the Reach factor, treating all features as if they affect the same user base. RICE adds Reach explicitly, making it better when features have different audience sizes. For growth experiments targeting all users equally, ICE is simpler and equivalent.",
      },
      {
        q: "Should I use the same time horizon for all Reach estimates?",
        a: "Yes — always estimate Reach over the same period (typically one quarter). Mixing time horizons makes scores incomparable.",
      },
      {
        q: "What RICE score should trigger shipping a feature?",
        a: "There's no universal threshold — set one for your team at the start of the quarter. Items above the threshold are in scope; items below go to the backlog. A threshold of 200 is common for B2B SaaS teams with 2–3 person-months of capacity per sprint.",
      },
      {
        q: "How often should RICE scores be recalculated?",
        a: "Recalculate at the start of each planning cycle (quarterly or per sprint). Scores decay as user behaviour changes and as confidence in estimates improves or decays.",
      },
    ],
    relatedSlugs: ["moscow-method", "north-star-metric"],
    relatedTemplates: [
      { slug: "rice-scoring", title: "RICE Scoring Template" },
      { slug: "moscow-method", title: "MoSCoW Prioritization Template" },
      { slug: "product-roadmap-template", title: "Product Roadmap Template" },
    ],
  },

  {
    slug: "north-star-metric",
    term: "North Star Metric",
    category: "Metrics",
    shortDef:
      "A single metric that best captures the core value your product delivers to customers — and that the whole company optimises toward.",
    metaDescription:
      "What is a North Star Metric? Learn how to pick the right NSM for your product, avoid vanity metrics, and align your team around a single number.",
    definition: `## What is a North Star Metric?

A **North Star Metric (NSM)** is the single metric that best represents the core value your product delivers to users. It's not a revenue metric or a vanity metric — it's the measurement of real value exchange between your product and its users.

The North Star is not the only metric that matters. It's the metric that, if it grows consistently, reliably predicts everything else (revenue, retention, NPS) growing too.

---

## Examples by company

| Company | North Star Metric | Why |
|---|---|---|
| Airbnb | Nights booked | Captures value for both hosts and guests |
| Slack | Daily active users | Measures habitual, sticky usage |
| Spotify | Time spent listening | Reflects music discovery and engagement |
| Duolingo | Daily active learners | Measures learning habit formation |
| Amplitude | Weekly Querying Users | Captures core analytics workflow |

---

## How to pick your North Star

A good NSM satisfies all four criteria:

1. **Measures delivered value** — not a proxy like signups or pageviews, but evidence that users got something out of the product
2. **Predicts long-term success** — correlates with retention and revenue, not just activation
3. **Actionable** — the team can run experiments to move it
4. **A leading indicator** — it moves before revenue moves

### Questions to help you find yours

- What action means a user got real value from our product?
- If this number grows every week, does our business grow too?
- Can our product team directly influence this metric?

---

## North Star vs. vanity metrics

| Vanity metric | Why it fails | Better alternative |
|---|---|---|
| Registered users | Includes churned and inactive users | Weekly active users |
| Pageviews | Measures noise, not value | [Value action] completions per user |
| App downloads | Doesn't reflect usage | Day-7 retention rate |
| Revenue | Lags; hard for product to directly move | Paid feature adoption rate |

---

## Input metrics

Your North Star is an output. To move it, you need **input metrics** — the 3–5 leading indicators that drive it. Example:

**NSM:** Weekly active projects created

**Input metrics:**
- Onboarding completion rate
- Time to first project created
- Projects created per active user
- % users who invite a collaborator

Track input metrics weekly. They tell you which lever to pull before the NSM moves.`,
    faqs: [
      {
        q: "Can a company have more than one North Star Metric?",
        a: "One is ideal — it forces focus. Two can work if your product has two distinct value loops (e.g. a marketplace serving buyers and sellers). More than two usually means the team hasn't agreed on what value actually means.",
      },
      {
        q: "What's the difference between a North Star Metric and an OKR?",
        a: "The North Star is persistent — it doesn't change quarter to quarter. OKRs are time-bound goals for moving specific metrics within a quarter. An OKR key result might be 'grow NSM from 1,200 to 1,500 weekly active projects', but the NSM itself stays constant.",
      },
      {
        q: "How often should we review the North Star Metric?",
        a: "Track it weekly. Review whether it's still the right metric annually, or after a major product pivot. Companies in growth stage sometimes find their NSM needs updating as the product matures (e.g. moving from 'users activated' to 'users retained past day 30').",
      },
      {
        q: "What if our North Star Metric plateaus?",
        a: "A plateau usually means market saturation in one segment, a product ceiling, or a metric that's measuring the wrong thing. Diagnose by breaking the NSM into its input metrics — the plateau will show up in one specific input. Fix that, or reconsider whether the NSM still reflects delivered value.",
      },
    ],
    relatedSlugs: ["okr", "product-market-fit"],
    relatedTemplates: [
      { slug: "north-star-metric", title: "North Star Metric Framework" },
      { slug: "okr-template", title: "OKR Template" },
      { slug: "aarrr-metrics", title: "AARRR Pirate Metrics" },
    ],
  },

  {
    slug: "product-market-fit",
    term: "Product-Market Fit",
    category: "Strategy",
    shortDef:
      "The degree to which a product satisfies strong market demand — characterised by organic growth, high retention, and users who would be 'very disappointed' if the product disappeared.",
    metaDescription:
      "What is product-market fit? Learn how to measure PMF, the Sean Ellis test, retention curves, and what to do before and after you find it.",
    definition: `## What is Product-Market Fit?

**Product-market fit (PMF)** is the state in which a product satisfies a strong enough market need that the market pulls the product forward — through word-of-mouth, organic growth, and high retention — without the company having to force it.

Marc Andreessen, who coined the term, described it simply: "You can always feel when product/market fit is happening. The customers are buying the product just as fast as you can make it."

---

## How to measure product-market fit

### 1. The Sean Ellis test (most common)

Survey your active users: *"How would you feel if you could no longer use [product]?"*

| Response | Benchmark |
|---|---|
| Very disappointed | > 40% = strong PMF signal |
| Somewhat disappointed | Useful but not transformational |
| Not disappointed | No PMF |

### 2. Retention curve flattening

Plot weekly or monthly retention cohorts. If retention curves flatten (users stop churning after week 4–8), you have a retained core — the foundation of PMF. If retention continues declining to zero, you don't have PMF yet.

### 3. Net Promoter Score (NPS)

NPS > 50 in a B2B product is a strong PMF signal. But NPS alone is insufficient — pair it with retention data.

### 4. Organic growth

If > 30–40% of new signups come from word-of-mouth or organic search (not paid acquisition), that's a PMF signal.

---

## PMF is not binary

Product-market fit exists on a spectrum:

| Stage | Signal |
|---|---|
| No PMF | High churn, users don't return, < 20% "very disappointed" |
| Weak PMF | Some retention, mixed signals, 20–35% "very disappointed" |
| Strong PMF | Flat retention curve, > 40% "very disappointed", organic growth |
| Scaling PMF | Repeatable acquisition, strong NPS, market pulling product |

---

## Before PMF: what to focus on

- Talk to users weekly — find the segment that finds your product indispensable
- Narrow ICP until you have a cohort with very high retention
- Don't scale marketing — it amplifies mismatch before you've found the right signal

## After PMF: what changes

- Shift from discovery to execution — speed of shipping matters more
- Invest in scalable acquisition channels
- Build for retention at scale (onboarding, notifications, integrations)
- Raise capital — the unit economics are defensible now`,
    faqs: [
      {
        q: "How long does it take to find product-market fit?",
        a: "Most successful startups take 1–3 years. B2B SaaS tends to take longer than consumer products because enterprise sales cycles are longer. Companies that claim PMF in < 6 months are often measuring the wrong thing.",
      },
      {
        q: "Can you lose product-market fit after finding it?",
        a: "Yes. Market conditions change (new competitors, regulatory shifts), user behaviour evolves, or the product drifts from its core value. Companies that scaled without regularly re-measuring retention often discover they lost PMF quietly over 12–18 months.",
      },
      {
        q: "Is NPS a reliable PMF signal?",
        a: "Partially. NPS measures satisfaction, not behaviour. A user who gives you a 9/10 NPS but churns after 3 months hasn't demonstrated PMF — they liked you but didn't need you. Pair NPS with retention cohort data for a complete picture.",
      },
      {
        q: "What's the difference between PMF and problem-solution fit?",
        a: "Problem-solution fit means you've validated that a real problem exists and your solution solves it (usually via prototypes or manual processes). PMF means the market is actively choosing and retaining your product at scale. PSF comes first — it's a prerequisite for PMF.",
      },
    ],
    relatedSlugs: ["north-star-metric", "jobs-to-be-done"],
    relatedTemplates: [
      { slug: "lean-canvas", title: "Lean Canvas" },
      { slug: "buyer-persona-template", title: "Buyer Persona Template" },
      { slug: "north-star-metric", title: "North Star Metric Framework" },
    ],
  },

  {
    slug: "jobs-to-be-done",
    term: "Jobs to Be Done (JTBD)",
    category: "Research",
    shortDef:
      "A framework that explains why customers buy products — not because of what the product is, but because of the progress they're trying to make in a specific situation.",
    metaDescription:
      "What is Jobs to Be Done? Learn the JTBD framework, the difference between functional and emotional jobs, and how to apply it to product discovery.",
    definition: `## What is Jobs to Be Done?

The **Jobs to Be Done (JTBD)** framework, developed by Clayton Christensen, holds that customers don't buy products — they **hire** products to do a job. The "job" is the progress they're trying to make in a specific situation.

The classic example: people don't buy a drill because they want a drill. They buy it because they want a hole in the wall. Understanding the job — not the product — is what drives product decisions that actually retain customers.

---

## The JTBD statement format

> **When** [situation], **I want to** [motivation / job], **so I can** [expected outcome].

Examples:
- "When I finish a customer call, I want to capture key insights quickly, so I can update my PRD before I forget them."
- "When I'm presenting to leadership, I want to show customer evidence for each feature, so I can defend the roadmap without relying on my gut."

---

## Three types of jobs

| Job type | Description | Example |
|---|---|---|
| **Functional** | The practical task to be done | "Summarise 50 customer interviews" |
| **Emotional** | How they want to feel | "Feel confident I'm building the right thing" |
| **Social** | How they want to be perceived | "Look data-driven to stakeholders" |

Good products satisfy all three. Great positioning speaks to all three.

---

## JTBD vs. Personas

| Dimension | Personas | JTBD |
|---|---|---|
| Focus | Who the user is | What the user is trying to do |
| Risk | Gets stale; demographic assumptions | Stays valid as long as the situation exists |
| Strength | Good for messaging and empathy | Good for product decisions and prioritisation |
| Weakness | Can lead to building for the persona, not the need | Harder to visualise for design teams |

Both frameworks are useful. Personas are better for marketing; JTBD is better for product discovery.

---

## How to apply JTBD

1. **Interview for the job, not the product.** Ask "walk me through the last time you had to [task]" — not "what features do you want?"
2. **Map the timeline of the job.** What happened before, during, and after? Where was the friction?
3. **Find the hire/fire moment.** What caused them to hire your product? What would cause them to fire it?
4. **Segment by job, not demographics.** Two customers who look nothing alike (different age, industry, company size) may share the exact same job — and should get the same product solution.`,
    faqs: [
      {
        q: "Who invented Jobs to Be Done?",
        a: "Clayton Christensen popularised JTBD through his work at Harvard Business School and his book 'The Innovator's Dilemma'. Bob Moesta and Chris Spiek developed the Switch Interview methodology for applying JTBD in practice. Tony Ulwick developed Outcome-Driven Innovation (ODI), a related but distinct JTBD application.",
      },
      {
        q: "How is JTBD different from user stories?",
        a: "User stories (As a / I want / So that) are used during sprint planning to define specific product behaviours. JTBD is used during discovery to understand the underlying motivation before any product decisions are made. JTBD informs what user stories to write; user stories implement specific JTBD insights.",
      },
      {
        q: "Can JTBD be used for B2B products?",
        a: "Yes — it's particularly powerful in B2B. B2B buyers often have multiple jobs simultaneously: a functional job (process invoices faster), an emotional job (feel less stressed at month-end), and a social job (look competent to the CFO). Products that address all three get shortlisted; products that address only the functional job get replaced by spreadsheets.",
      },
      {
        q: "How many jobs does a product typically have?",
        a: "Most successful products are hired for 1–3 core jobs. If a product is trying to be hired for 10 different jobs, it's either a platform (and needs to be managed as such) or it's unfocused. Focus on the job your best-retained customers are hiring you for.",
      },
    ],
    relatedSlugs: ["product-market-fit", "north-star-metric"],
    relatedTemplates: [
      { slug: "jobs-to-be-done", title: "JTBD Template" },
      { slug: "buyer-persona-template", title: "Buyer Persona Template" },
      { slug: "user-interview-script", title: "User Interview Script" },
    ],
  },

  {
    slug: "moscow-method",
    term: "MoSCoW Method",
    category: "Prioritization",
    shortDef:
      "A prioritization technique that classifies requirements into four categories — Must Have, Should Have, Could Have, and Won't Have — to scope a release against a fixed deadline.",
    metaDescription:
      "What is the MoSCoW method? Learn how to use Must Have, Should Have, Could Have, and Won't Have to scope sprints and releases. Includes examples and templates.",
    definition: `## What is the MoSCoW Method?

The **MoSCoW method** is a prioritization framework that categorises requirements into four buckets based on their necessity within a fixed timeframe. The name is an acronym from the first letters of each category (the Os are added for pronunciation).

| Category | Definition |
|---|---|
| **Must Have** | Non-negotiable. The release fails without these. |
| **Should Have** | Important, but a workaround exists. Include if capacity allows. |
| **Could Have** | Nice to have. Include only if time and budget allow. |
| **Won't Have (this time)** | Explicitly out of scope for this release. |

---

## How to apply it

**Step 1: Set the release boundary.** MoSCoW only works with a fixed deadline or capacity constraint. Without one, everything becomes Must Have.

**Step 2: Classify with stakeholders.** Must Haves should represent ~60% of estimated effort — leaving buffer for Should Haves and unexpected complexity.

**Step 3: Document Won't Haves explicitly.** This is the most underused part. Writing down what you're not building prevents scope creep and converts "no" into "not this release."

**Step 4: Get sign-off.** All key stakeholders should agree on the Must Have list before development begins.

---

## Recommended capacity split

| Category | % of sprint/release capacity |
|---|---|
| Must Have | ~60% |
| Should Have | ~20% |
| Could Have | ~20% (pulled in if Must + Should complete early) |

---

## MoSCoW vs. RICE

| Dimension | MoSCoW | RICE |
|---|---|---|
| Output | Categorical buckets | Ranked numeric scores |
| Use case | Scoping a specific release | Ranking a full backlog |
| Effort | Low — qualitative judgement | Medium — requires estimates |
| Strength | Fast stakeholder alignment | Data-backed, defensible prioritisation |

**Use together:** RICE to rank your backlog, MoSCoW to scope a specific sprint or release from the top of that ranked list.

---

## Common mistakes

- **All Must Have lists.** If everything is Must Have, either the deadline is wrong or the scope hasn't been properly challenged. Force-rank the Must Haves — the bottom becomes Should Have.
- **Ignoring Won't Have.** Without an explicit Won't Have list, scope creep enters through requests that "shouldn't take long."
- **Using MoSCoW without a deadline.** The framework is meaningless without a constraint it's scoping against.`,
    faqs: [
      {
        q: "Who invented the MoSCoW method?",
        a: "Dai Clegg created MoSCoW in 1994 while working at Oracle. It was later adopted as part of the DSDM (Dynamic Systems Development Method) agile framework.",
      },
      {
        q: "Should Could Haves ever be included?",
        a: "Yes — that's their purpose. If the team delivers Must Haves and Should Haves ahead of schedule, Could Haves get pulled in. They act as a productive buffer that keeps developers working without overcommitting scope.",
      },
      {
        q: "How detailed should each MoSCoW item be?",
        a: "Detailed enough for engineering to estimate and QA to test. 'Improve performance' is too vague. 'Reduce search API response time from 800ms to under 300ms' is a Must Have. Vague items belong in the backlog, not a MoSCoW matrix.",
      },
      {
        q: "Can MoSCoW be used for product roadmaps, not just sprints?",
        a: "Yes — it works at any horizon. Apply it to a quarterly roadmap (Must Have this quarter, Should Have if capacity allows, Won't Have until next quarter) or a release (Must Have for launch, Should Have in v1.1). The fixed constraint just changes from sprint capacity to quarter capacity.",
      },
    ],
    relatedSlugs: ["rice-scoring", "prd"],
    relatedTemplates: [
      { slug: "moscow-method", title: "MoSCoW Prioritization Template" },
      { slug: "rice-scoring", title: "RICE Scoring Template" },
      { slug: "sprint-retrospective", title: "Sprint Retrospective Template" },
    ],
  },

  {
    slug: "okr",
    term: "OKR (Objectives and Key Results)",
    category: "Strategy",
    shortDef:
      "A goal-setting framework where an Objective states what you want to achieve and Key Results define the measurable outcomes that prove you achieved it.",
    metaDescription:
      "What are OKRs? Learn the Objectives and Key Results framework — how to write good OKRs, avoid common mistakes, and align your product team around outcomes.",
    definition: `## What are OKRs?

**OKRs (Objectives and Key Results)** are a goal-setting framework developed at Intel by Andy Grove and popularised by John Doerr, who introduced them to Google in 1999.

- **Objective** — A qualitative, inspiring statement of what you want to achieve. It answers "where do we want to go?"
- **Key Results** — 2–5 measurable outcomes that define what success looks like. They answer "how will we know we got there?"

> **"An objective is a direction. A key result is a destination."** — John Doerr

---

## Good OKR examples

**Objective:** Make onboarding so good that new users reach their first value moment without help.

| Key Result | Owner | Baseline | Target |
|---|---|---|---|
| KR1: Onboarding completion rate | Growth PM | 34% | 60% |
| KR2: Time to first project created | Growth PM | 8 min | < 3 min |
| KR3: Day-7 retention for new cohorts | Growth PM | 28% | 42% |

---

## Outcomes vs. outputs

The most common OKR mistake is writing outputs (tasks) as Key Results.

| Output (wrong) | Outcome (right) |
|---|---|
| Ship onboarding redesign | Onboarding completion rate reaches 60% |
| Launch Slack integration | 30% of active users connect Slack within 14 days |
| Run 3 customer interviews | Identify 5 validated pain points with supporting quotes |

If your Key Result looks like a task, rewrite it as a metric.

---

## OKR scoring

At the end of the quarter, score each KR from 0.0 to 1.0.

| Score | Meaning |
|---|---|
| 0.7–1.0 | Strong result |
| 0.4–0.7 | Partial — investigate what blocked full delivery |
| 0.0–0.4 | Missed — diagnose whether the target was wrong or the initiative failed |

**A consistent score of 1.0 means targets are too easy.** Google's guideline: 0.6–0.7 is healthy; it means you're setting ambitious goals that stretch the team without being delusional.

---

## OKR cadence

| Level | Frequency | Owner |
|---|---|---|
| Company OKRs | Annual / Quarterly | CEO + leadership |
| Team OKRs | Quarterly | Team lead + PM |
| Mid-quarter check-in | Week 6 of 13 | PM |
| End-of-quarter scoring | Week 13 | Team |

---

## OKRs vs. KPIs

| | OKRs | KPIs |
|---|---|---|
| Time horizon | Quarterly | Ongoing |
| Purpose | Set direction and measure progress toward it | Monitor health of existing business |
| Stability | Change each quarter | Persistent |
| Example | "Grow activation rate to 60% in Q2" | "Activation rate (always tracked)" |

KPIs are your health metrics. OKRs are where you want to move them.`,
    faqs: [
      {
        q: "How many OKRs should a team have per quarter?",
        a: "2–3 objectives with 2–4 key results each. More than 3 objectives means you don't have real priorities — everything is urgent, which means nothing is. Teams that succeed with OKRs are ruthlessly focused.",
      },
      {
        q: "Should OKRs be tied to compensation?",
        a: "Most OKR practitioners, including John Doerr, recommend against it. When OKRs affect bonuses, teams set conservative targets to guarantee a high score instead of ambitious goals. Keep OKRs separate from performance management.",
      },
      {
        q: "What's the difference between company OKRs and team OKRs?",
        a: "Company OKRs set the direction for the organisation. Team OKRs should cascade from them — each team's objectives should connect to at least one company objective. If a team's OKRs don't connect to company goals, they'll be deprioritised when things get busy.",
      },
      {
        q: "How long does it take for OKRs to work?",
        a: "Most teams need 2–3 quarters to get the rhythm right. The first quarter is usually spent writing outputs instead of outcomes, over-committing, and not doing mid-quarter check-ins. By quarter 3, the team has calibrated target-setting and the format becomes natural.",
      },
    ],
    relatedSlugs: ["north-star-metric", "rice-scoring"],
    relatedTemplates: [
      { slug: "okr-template", title: "OKR Template" },
      { slug: "product-roadmap-template", title: "Product Roadmap Template" },
      { slug: "weekly-pm-report", title: "Weekly PM Report" },
    ],
  },

  // ── Strategy & Planning ──────────────────────────────────────────────────────

  {
    slug: "mvp",
    term: "MVP (Minimum Viable Product)",
    category: "Strategy & Planning",
    shortDef: "The smallest version of a product that delivers enough value to attract early adopters and generate validated learning about your core assumptions.",
    metaDescription: "What is an MVP? Learn what minimum viable product means, how to define one, and common mistakes teams make when scoping their first release.",
    definition: `## What is an MVP?

An **MVP (Minimum Viable Product)** is the version of a product with the minimum set of features needed to test a core hypothesis with real users. The goal is not to ship something small — it's to learn as fast as possible whether the product idea is worth building.

Eric Ries, who popularised the term in *The Lean Startup*, defines it as: "That version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort."

---

## What an MVP is not

| Common misconception | What it actually means |
|---|---|
| A buggy half-finished product | The smallest thing that *works* for the target user |
| Version 1.0 | A learning vehicle — may not even be code |
| The same for every product | Depends on the hypothesis being tested |

---

## Types of MVPs

- **Concierge MVP** — do the service manually before automating it
- **Wizard of Oz MVP** — looks automated to users, is manual behind the scenes
- **Landing page MVP** — test demand before building anything
- **Prototype MVP** — clickable Figma with no real backend
- **Single-feature MVP** — ship one core feature and measure retention

---

## How to scope an MVP

1. State the hypothesis: "We believe [user] has [problem] and will [behaviour] if we solve it with [solution]."
2. List the minimum features needed to test that hypothesis.
3. Cut everything that doesn't directly test the hypothesis.
4. Define the success metric before you build.`,
    faqs: [
      { q: "Should an MVP be publicly launched?", a: "Not necessarily. Some MVPs are tested with 10–20 users. The key is that they're real users with real needs — not friends and family who give polite feedback." },
      { q: "What's the difference between an MVP and an MMP (Minimum Marketable Product)?", a: "An MVP tests a hypothesis — it's a learning tool. An MMP is the smallest version you'd market publicly and charge for. MMP comes after MVP once you've validated the core assumption." },
    ],
    relatedSlugs: ["product-market-fit", "product-discovery"],
    relatedTemplates: [{ slug: "lean-canvas", title: "Lean Canvas" }, { slug: "prd-template", title: "PRD Template" }],
  },

  {
    slug: "value-proposition",
    term: "Value Proposition",
    category: "Strategy & Planning",
    shortDef: "A clear statement of the specific benefit your product delivers, who it's for, and why it's better than the alternative.",
    metaDescription: "What is a value proposition? Learn how to write a clear, compelling value proposition for your product and why it matters for positioning and growth.",
    definition: `## What is a Value Proposition?

A **value proposition** is a statement that explains what benefit your product delivers, to which customer segment, and why it's the best solution available. It's not a slogan — it's the core argument for why a specific customer should choose your product.

---

## The Value Proposition Canvas

Geoffrey Moore's positioning formula is the most practical structure:

> **For** [target customer] **who** [has this problem/need], **[product name]** is a [category] **that** [key benefit]. **Unlike** [main alternative], **our product** [key differentiator].

---

## Strong vs. weak value propositions

| Weak | Strong |
|---|---|
| "The best project management tool" | "The only PRD generator that uses your actual customer feedback, not templates" |
| "Easy to use" | "Get your first PRD draft in under 10 minutes" |
| "Saves time" | "Cut PRD writing time from 3 hours to 30 minutes" |

---

## Where the VP breaks down

- **Too broad:** Targets "everyone" → resonates with no one
- **Feature-focused:** Describes what it does, not the outcome it delivers
- **Not differentiated:** Could describe every competitor equally`,
    faqs: [
      { q: "Is a value proposition the same as a tagline?", a: "No. A tagline is marketing copy for brand recognition. A value proposition is a strategic statement of who you serve, what you deliver, and why you win. The tagline might be inspired by the VP, but they're different artifacts." },
      { q: "How often should a value proposition change?", a: "It should evolve as you learn more about your ICP and as the market shifts. Revisit it after significant customer discovery sprints, after finding PMF, and when entering new market segments." },
    ],
    relatedSlugs: ["product-market-fit", "mvp"],
    relatedTemplates: [{ slug: "lean-canvas", title: "Lean Canvas" }, { slug: "buyer-persona-template", title: "Buyer Persona Template" }],
  },

  {
    slug: "product-discovery",
    term: "Product Discovery",
    category: "Strategy & Planning",
    shortDef: "The process of determining what to build — through user research, prototyping, and testing — before committing engineering resources to delivery.",
    metaDescription: "What is product discovery? Learn how PMs use discovery to validate problems and solutions before building, and how it differs from delivery.",
    definition: `## What is Product Discovery?

**Product discovery** is the work product teams do to decide *what* to build and *why* before they build it. It sits upstream of delivery — its output is a validated understanding of user problems, not shipped features.

Marty Cagan's framing: discovery is about answering four questions before coding starts:
1. **Value** — Will users buy or use this?
2. **Usability** — Can users figure out how to use it?
3. **Feasibility** — Can engineering build it in a reasonable time?
4. **Business viability** — Does it work for the business?

---

## Discovery vs. Delivery

| Discovery | Delivery |
|---|---|
| What should we build? | Build the thing we decided to build |
| High uncertainty, fast learning | Low uncertainty, high execution |
| PM + Design lead | Engineering leads |
| Output: validated decisions | Output: working software |

---

## Core discovery activities

- **Customer interviews** — 1:1 sessions to understand problems and workflows
- **Usability testing** — watching users interact with prototypes
- **Prototyping** — making ideas tangible without engineering cost
- **Assumption mapping** — identifying and ranking risky assumptions
- **Concierge tests** — manually delivering the solution to test demand`,
    faqs: [
      { q: "How much time should discovery take?", a: "Discovery should be continuous, not a phase. Dedicate 20–30% of PM and design capacity to ongoing discovery even while delivering features. Separating discovery from delivery with a 'big design up front' phase is a common antipattern." },
      { q: "What's the output of a discovery sprint?", a: "Not a document — a decision. Discovery produces validated answers to specific questions: 'users will pay for this', 'users can complete onboarding without help', 'the API latency is acceptable'. These answers unlock the delivery work." },
    ],
    relatedSlugs: ["mvp", "jobs-to-be-done"],
    relatedTemplates: [{ slug: "user-interview-script", title: "User Interview Script" }, { slug: "lean-canvas", title: "Lean Canvas" }],
  },

  {
    slug: "gtm-strategy",
    term: "GTM Strategy (Go-To-Market)",
    category: "Strategy & Planning",
    shortDef: "The plan for how a company will reach its target customers and deliver its value proposition — covering positioning, channels, pricing, and sales motion.",
    metaDescription: "What is a go-to-market strategy? Learn the key components of a GTM plan — ICP, positioning, channels, pricing, and sales motion — with examples.",
    definition: `## What is a GTM Strategy?

A **go-to-market (GTM) strategy** is the plan for how a company will bring a product to market and acquire customers. It answers: who is the customer, what is the message, through what channels, at what price, and with what sales motion?

---

## Core GTM components

| Component | Question it answers |
|---|---|
| **ICP (Ideal Customer Profile)** | Who specifically are we selling to? |
| **Positioning** | Why should they choose us over alternatives? |
| **Channels** | How do we reach them? (SEO, paid, sales, PLG) |
| **Pricing** | How do we monetise the delivered value? |
| **Sales motion** | Self-serve, inside sales, or enterprise? |
| **Launch plan** | What happens on day 1, week 1, month 1? |

---

## Sales-led vs. Product-led GTM

| Model | Description | Best for |
|---|---|---|
| **Sales-led** | Sales team closes deals, product follows | Enterprise, high ACV |
| **Product-led (PLG)** | Product itself acquires, activates, and retains | SMB, developer tools, high-volume |
| **Marketing-led** | Content/SEO drives inbound pipeline | Competitive markets with long purchase cycles |

---

## Common GTM failures

- **Wrong ICP** — building for a segment that exists but won't pay
- **Undefined motion** — trying PLG and enterprise simultaneously
- **Premature scaling** — spending on acquisition before validating retention`,
    faqs: [
      { q: "Is GTM strategy a one-time exercise?", a: "No. GTM evolves as you move upmarket, enter new geographies, or launch new products. Revisit it at each major product milestone: initial launch, first 100 customers, first $1M ARR, first enterprise customer." },
      { q: "Who owns GTM — PM or marketing?", a: "Both, with different scopes. Product defines the value proposition and pricing. Marketing owns channel strategy and messaging. Sales owns the motion. The PM is usually the connector — ensuring product capabilities match the GTM promise." },
    ],
    relatedSlugs: ["value-proposition", "product-market-fit"],
    relatedTemplates: [{ slug: "go-to-market-template", title: "Go-to-Market Template" }, { slug: "india-gtm", title: "India GTM Template" }],
  },

  // ── Execution & Development ───────────────────────────────────────────────────

  {
    slug: "agile",
    term: "Agile",
    category: "Execution & Development",
    shortDef: "An iterative approach to software development that delivers working software in short cycles, embraces changing requirements, and prioritises collaboration over documentation.",
    metaDescription: "What is Agile? Learn the core principles of Agile software development, how it differs from Waterfall, and how PMs work in Agile teams.",
    definition: `## What is Agile?

**Agile** is a set of values and principles for software development, first articulated in the 2001 Agile Manifesto. It emerged as a reaction to heavyweight, sequential ("Waterfall") development processes that delivered software too slowly and with too little user feedback.

---

## The four Agile values

> 1. **Individuals and interactions** over processes and tools
> 2. **Working software** over comprehensive documentation
> 3. **Customer collaboration** over contract negotiation
> 4. **Responding to change** over following a plan

---

## Agile frameworks

| Framework | Key idea | Best for |
|---|---|---|
| **Scrum** | Time-boxed sprints with defined roles (PM, dev, scrum master) | Most product teams |
| **Kanban** | Continuous flow with WIP limits | Support, ops, maintenance |
| **SAFe** | Scaled Agile for large enterprises | 50+ person engineering orgs |
| **Shape Up** | 6-week cycles, no sprints | Small, senior teams (Basecamp model) |

---

## Agile vs. Waterfall

| Waterfall | Agile |
|---|---|
| Requirements frozen upfront | Requirements evolve |
| Deliver at end of project | Deliver every 1–2 weeks |
| Change is failure | Change is expected |
| Separate phases (design → dev → QA) | Phases overlap within sprints |`,
    faqs: [
      { q: "Is Agile only for software development?", a: "No — Agile principles have been applied to hardware, marketing, HR, and operations. But the tooling (sprints, backlogs, standups) was designed for software. Adapt the principles rather than the rituals when applying Agile outside engineering." },
      { q: "What's the PM's role in an Agile team?", a: "The PM (or Product Owner in Scrum) prioritises the backlog, defines acceptance criteria, participates in sprint planning, and provides feedback on shipped features. They're the voice of the customer in the development process — not a project manager tracking tasks." },
    ],
    relatedSlugs: ["scrum", "sprint", "backlog"],
    relatedTemplates: [{ slug: "sprint-retrospective", title: "Sprint Retrospective Template" }, { slug: "engineering-kickoff", title: "Engineering Kickoff Template" }],
  },

  {
    slug: "scrum",
    term: "Scrum",
    category: "Execution & Development",
    shortDef: "An Agile framework that organises work into fixed-length sprints (1–4 weeks) with defined roles, ceremonies, and artifacts to deliver working software iteratively.",
    metaDescription: "What is Scrum? Learn the Scrum framework — sprints, ceremonies, roles, and artifacts — and how PMs fit into a Scrum team.",
    definition: `## What is Scrum?

**Scrum** is the most widely used Agile framework. It organises work into time-boxed iterations called **sprints** (typically 1–2 weeks), with a defined set of roles, ceremonies, and artifacts.

---

## Scrum roles

| Role | Responsibility |
|---|---|
| **Product Owner** | Owns the backlog; prioritises work; represents customer needs |
| **Scrum Master** | Removes blockers; facilitates ceremonies; coaches the team |
| **Development Team** | Self-organising engineers, designers, and QA |

---

## Scrum ceremonies

| Ceremony | Frequency | Purpose |
|---|---|---|
| Sprint Planning | Start of sprint | Agree what to build this sprint |
| Daily Standup | Daily | 15-min sync on progress and blockers |
| Sprint Review | End of sprint | Demo to stakeholders; gather feedback |
| Retrospective | End of sprint | How to improve the process |

---

## Scrum artifacts

- **Product Backlog** — ordered list of all work to be done
- **Sprint Backlog** — subset committed to the current sprint
- **Increment** — working, potentially shippable software produced each sprint`,
    faqs: [
      { q: "Is the Product Manager the same as the Product Owner?", a: "In small companies, often yes. In larger orgs, the PM owns strategy and discovery; the Product Owner handles day-to-day backlog management and is embedded in the Scrum team. They can be the same person or different people." },
      { q: "How long should sprints be?", a: "2 weeks is the most common. 1 week is faster feedback but more ceremony overhead. 4 weeks risks too much work in progress and slow learning. Default to 2 weeks and adjust based on team velocity and product maturity." },
    ],
    relatedSlugs: ["agile", "sprint", "backlog"],
    relatedTemplates: [{ slug: "sprint-retrospective", title: "Sprint Retrospective Template" }, { slug: "engineering-kickoff", title: "Engineering Kickoff Template" }],
  },

  {
    slug: "kanban",
    term: "Kanban",
    category: "Execution & Development",
    shortDef: "A visual workflow management method that limits work in progress, makes bottlenecks visible, and optimises for continuous flow rather than time-boxed sprints.",
    metaDescription: "What is Kanban? Learn how the Kanban method works, when to use it instead of Scrum, and how to set WIP limits for your team.",
    definition: `## What is Kanban?

**Kanban** (Japanese for "signboard") is a workflow management method that visualises work in progress and limits how much work can be in any stage at once. Unlike Scrum, there are no sprints — work flows continuously through columns.

---

## Core Kanban principles

1. **Visualise the workflow** — every task on a board, one card per item
2. **Limit work in progress (WIP)** — max items per column prevents overload
3. **Manage flow** — optimise for fast, smooth delivery, not individual utilisation
4. **Make policies explicit** — "done" means the same thing to everyone
5. **Improve collaboratively** — use data to improve the system, not blame individuals

---

## Kanban vs. Scrum

| Kanban | Scrum |
|---|---|
| No fixed iterations | 1–2 week sprints |
| Continuous delivery | Deliver at sprint end |
| No prescribed roles | Product Owner, Scrum Master, Dev Team |
| Change anytime | Change at sprint boundary |
| Best for continuous flow work | Best for planned feature development |

---

## When to use Kanban

- Support and bug fix queues
- Ops and DevOps pipelines
- Content production workflows
- Small teams with highly variable incoming work`,
    faqs: [
      { q: "What's a good WIP limit?", a: "A common rule: number of team members minus one. If you have 4 devs, limit WIP to 3. This forces collaboration and prevents the team from each starting independent work that never gets finished." },
      { q: "Can you combine Kanban and Scrum?", a: "Yes — this is called Scrumban. Teams keep sprint planning and retrospectives from Scrum but replace sprint backlogs with a Kanban board and WIP limits. Common in teams transitioning from Scrum to more continuous delivery." },
    ],
    relatedSlugs: ["agile", "scrum", "backlog"],
    relatedTemplates: [{ slug: "sprint-retrospective", title: "Sprint Retrospective Template" }],
  },

  {
    slug: "backlog",
    term: "Product Backlog",
    category: "Execution & Development",
    shortDef: "A prioritised list of all work — features, bugs, improvements, and technical debt — that a product team intends to build, ordered by value and urgency.",
    metaDescription: "What is a product backlog? Learn how to build, prioritise, and groom a backlog that keeps your team aligned and shipping the right things.",
    definition: `## What is a Product Backlog?

The **product backlog** is an ordered list of all work the team plans to do, maintained by the Product Owner or PM. Items at the top are well-defined, estimated, and ready for sprint. Items at the bottom are vague — they exist to capture future direction.

---

## Backlog item types

| Type | Description |
|---|---|
| **Feature** | New functionality for users |
| **Bug** | Defect in existing behaviour |
| **Technical debt** | Engineering improvement with no visible user change |
| **Spike** | Research or investigation task |
| **Chore** | Infrastructure, ops, or maintenance work |

---

## Healthy vs. unhealthy backlog

| Healthy | Unhealthy |
|---|---|
| Top 2 sprints fully groomed with AC | 500+ items, 3 years old |
| Items deleted when no longer relevant | Nothing ever removed |
| Ordered by value | Ordered by who asked loudest |
| Known to the team | Only the PM knows it exists |

---

## Backlog grooming (refinement)

A regular session (30–60 min/week) where PM and engineering review upcoming items, add acceptance criteria, break down large items, and estimate effort. Output: a sprint-ready top of backlog.`,
    faqs: [
      { q: "How big should a backlog be?", a: "Large enough to always have 2–3 sprints of prioritised work ready. Backlogs with hundreds of stale items are a liability — prune anything not actioned in 6 months. If it matters, it'll come back." },
      { q: "Who should have access to the backlog?", a: "Everyone on the team, read-only. Engineering needs visibility to plan ahead. Design needs it to work on upcoming features. Only the PM should re-order it — 'backlog by committee' is a fast path to incoherent priorities." },
    ],
    relatedSlugs: ["scrum", "sprint", "agile"],
    relatedTemplates: [{ slug: "moscow-method", title: "MoSCoW Prioritization Template" }, { slug: "rice-scoring", title: "RICE Scoring Template" }],
  },

  {
    slug: "sprint",
    term: "Sprint",
    category: "Execution & Development",
    shortDef: "A fixed-length iteration (usually 1–2 weeks) in Scrum during which a team completes a set amount of work from the backlog and delivers a potentially shippable increment.",
    metaDescription: "What is a sprint in Scrum? Learn how sprint planning, execution, and review work — and what makes a sprint succeed or fail.",
    definition: `## What is a Sprint?

A **sprint** is a fixed-length development cycle in Scrum — usually 1 or 2 weeks — during which a team works on a committed set of backlog items and produces a working, potentially shippable product increment.

---

## Sprint lifecycle

\`\`\`
Sprint Planning → Daily Standups → Sprint Review → Retrospective → next Sprint Planning
\`\`\`

| Phase | What happens |
|---|---|
| **Sprint Planning** | Team selects backlog items, estimates effort, agrees on sprint goal |
| **Daily Standup** | 15-min sync: what did I do, what will I do, any blockers? |
| **Sprint Review** | Demo to stakeholders, collect feedback |
| **Retrospective** | What went well, what to improve, 3 action items |

---

## Sprint goal

Every sprint should have a single sentence goal: "This sprint we will X so that Y." Not just a list of tickets. A sprint without a goal is a sprint that can be disrupted by anything.

---

## What kills a sprint

- Scope added mid-sprint without removing equivalent scope
- Unresolved dependencies discovered during the sprint
- Over-commitment (velocity not calibrated to realistic capacity)
- No sprint goal — team optimises for task completion, not outcomes`,
    faqs: [
      { q: "Can sprint scope change mid-sprint?", a: "In principle, no — that's the point of committing. In practice, P0 incidents and critical bugs justify scope changes. The rule: anything added must have equivalent scope removed, and the sprint goal must remain intact." },
      { q: "What's the difference between sprint velocity and capacity?", a: "Velocity is the average story points completed per sprint, measured over the last 3–5 sprints. Capacity is the available person-hours in a given sprint (accounting for leave, meetings, etc.). Use velocity to forecast; use capacity to adjust for anomalous sprints." },
    ],
    relatedSlugs: ["scrum", "backlog", "agile"],
    relatedTemplates: [{ slug: "sprint-retrospective", title: "Sprint Retrospective Template" }, { slug: "engineering-kickoff", title: "Engineering Kickoff Template" }],
  },

  {
    slug: "technical-debt",
    term: "Technical Debt",
    category: "Execution & Development",
    shortDef: "The accumulated cost of shortcuts, deferred improvements, and suboptimal decisions made during development — paid back through slower delivery and higher bug rates.",
    metaDescription: "What is technical debt? Learn how tech debt accumulates, how to measure its impact on delivery speed, and how PMs can prioritise paying it down.",
    definition: `## What is Technical Debt?

**Technical debt** is a metaphor coined by Ward Cunningham. Like financial debt, technical shortcuts taken today create interest payments tomorrow — in the form of slower development, more bugs, and harder onboarding for new engineers.

---

## Types of technical debt

| Type | Description | Example |
|---|---|---|
| **Intentional** | Conscious shortcut with a plan to fix later | Hardcoded config to meet launch deadline |
| **Unintentional** | Mistakes or lack of knowledge | Poor abstraction that made sense at the time |
| **Architectural** | Foundational design choices that limit scale | Monolith that should have been modular |
| **Dependency** | Outdated libraries and frameworks | Running Node 12 when Node 22 is current |

---

## How debt affects product teams

- Feature estimates increase 20–50% on heavily indebted codebases
- Onboarding new engineers takes longer
- Bug rates increase in areas with accumulated debt
- Engineers lose motivation working in poor code

---

## PM's role in managing debt

- Maintain a visible debt inventory with engineering
- Allocate 15–20% of sprint capacity to debt reduction
- Frame debt in business terms: "This delays every feature in checkout by 1 week"
- Prioritise debt that sits in the critical path of upcoming features`,
    faqs: [
      { q: "How do you convince leadership to prioritise tech debt?", a: "Frame it as risk and delivery speed. 'Our checkout module has high debt — every new feature there takes 3x longer than equivalent features elsewhere. Paying it down is a multiplier on Q3 roadmap velocity.' Avoid technical jargon." },
      { q: "Is all technical debt bad?", a: "No. Intentional, documented debt taken to hit a deadline is a rational business decision. Undocumented, accumulating debt with no plan to repay it is the problem. The analogy holds: a mortgage is fine; maxed credit cards with no payment plan are not." },
    ],
    relatedSlugs: ["agile", "scrum"],
    relatedTemplates: [{ slug: "technical-debt-scorecard", title: "Technical Debt Scorecard" }, { slug: "post-mortem", title: "Post-Mortem Template" }],
  },

  {
    slug: "velocity",
    term: "Velocity",
    category: "Execution & Development",
    shortDef: "The average amount of work (in story points) a Scrum team completes per sprint, used to forecast how much can be delivered in future sprints.",
    metaDescription: "What is velocity in Scrum? Learn how to measure and use sprint velocity for forecasting, and why it shouldn't be used as a performance metric.",
    definition: `## What is Velocity?

**Velocity** is a Scrum metric that measures how many story points a team completes per sprint, averaged over the last 3–5 sprints. It's a forecasting tool — not a measure of team performance.

---

## How to calculate velocity

\`\`\`
Sprint 1: 34 points completed
Sprint 2: 28 points completed
Sprint 3: 31 points completed
Average velocity = (34 + 28 + 31) / 3 = 31 points/sprint
\`\`\`

---

## Using velocity for forecasting

If your backlog has 150 story points of work and your average velocity is 30 points/sprint, you can forecast ~5 sprints to complete it. This is useful for release planning — not for guaranteeing dates.

---

## What velocity is not

- **Not a productivity metric** — comparing velocity across teams is meaningless (different estimation scales)
- **Not a target** — teams that optimise for velocity inflate estimates
- **Not stable** — velocity drops with new team members, tech debt paydown, and after holidays

---

## Velocity vs. throughput

Some teams prefer **throughput** (number of items completed per sprint) over story points, especially when story sizes are roughly uniform. It's simpler and avoids estimation debates.`,
    faqs: [
      { q: "Should velocity be shared with stakeholders?", a: "Share what it means for delivery forecasts, not the raw number. 'Based on our current pace we expect to complete the Q2 roadmap by end of June' is useful. 'Our velocity is 31 points' is meaningless to non-Scrum practitioners." },
      { q: "Why does velocity fluctuate so much?", a: "Team composition changes, varying sprint goals, accumulated debt, holidays, and estimation drift all cause fluctuation. Use a rolling 4-sprint average and treat it as a range (±20%) rather than a precise figure." },
    ],
    relatedSlugs: ["scrum", "sprint", "backlog"],
    relatedTemplates: [{ slug: "sprint-retrospective", title: "Sprint Retrospective Template" }],
  },

  {
    slug: "scope-creep",
    term: "Scope Creep",
    category: "Execution & Development",
    shortDef: "The gradual expansion of a project's scope beyond its original boundaries — through uncontrolled feature additions, unclear requirements, or stakeholder requests — without adjusting timeline or resources.",
    metaDescription: "What is scope creep? Learn how to identify, prevent, and manage scope creep in product development with practical PM techniques.",
    definition: `## What is Scope Creep?

**Scope creep** is the gradual, often uncontrolled expansion of a project's scope after work has begun. It's the accumulation of small "while we're at it..." additions that collectively delay delivery, inflate cost, and erode team focus.

---

## Common causes

| Cause | Example |
|---|---|
| Vague requirements | "Make it better" → team makes 10 things without a shared goal |
| Stakeholder additions mid-sprint | "Can we also add CSV export?" halfway through the sprint |
| Gold plating | Engineers adding features not in the spec because they seem useful |
| No explicit non-goals | Assumptions fill the vacuum where scope wasn't defined |

---

## How to prevent it

1. **Write explicit non-goals in every PRD** — "we are not building X in this version"
2. **MoSCoW every release** — items not in Must/Should are explicitly deferred
3. **Change control process** — new scope requires explicit owner, timeline impact, and sign-off
4. **Protect the sprint goal** — any addition mid-sprint requires removing equivalent scope

---

## When to say yes to scope changes

Scope changes are sometimes right. Say yes when: the change directly supports the sprint goal, the impact on delivery is explicitly acknowledged, and an equivalent item is removed.`,
    faqs: [
      { q: "Is scope creep always bad?", a: "Uncontrolled scope creep is bad. Managed scope change — where the impact is acknowledged and something else is cut or deferred — is normal product management. The problem is invisible expansion, not evolution." },
      { q: "Who is responsible for preventing scope creep?", a: "The PM owns the scope definition and the non-goals. Engineering owns flagging when new requests add effort. Stakeholders own the decisions when tradeoffs are presented. Scope creep usually happens when one of these three fails." },
    ],
    relatedSlugs: ["moscow-method", "prd"],
    relatedTemplates: [{ slug: "moscow-method", title: "MoSCoW Prioritization Template" }, { slug: "prd-template", title: "PRD Template" }],
  },

  // ── Metrics & Analytics ───────────────────────────────────────────────────────

  {
    slug: "churn-rate",
    term: "Churn Rate",
    category: "Metrics & Analytics",
    shortDef: "The percentage of customers or revenue lost in a given period — the primary indicator of whether a product retains the value it delivers.",
    metaDescription: "What is churn rate? Learn how to calculate user and revenue churn, what good benchmarks look like, and how to reduce churn in SaaS products.",
    definition: `## What is Churn Rate?

**Churn rate** measures the percentage of customers (or revenue) that stops using a product in a given period. It is the inverse of retention and the most direct signal of whether your product delivers lasting value.

---

## Types of churn

| Type | Formula | What it measures |
|---|---|---|
| **User churn** | (Users lost ÷ Users at start) × 100 | % of users who stopped using the product |
| **Revenue churn (MRR churn)** | (MRR lost ÷ MRR at start) × 100 | % of recurring revenue lost |
| **Net revenue churn** | (MRR lost − expansion MRR) ÷ MRR at start | Churn net of upsells (can be negative) |

---

## Benchmarks (B2B SaaS)

| Stage | Monthly churn benchmark |
|---|---|
| Early stage (< $1M ARR) | < 5% monthly |
| Growth stage ($1–10M ARR) | < 2% monthly |
| Scale stage (> $10M ARR) | < 1% monthly |

Annual churn = approximately (1 − (1 − monthly churn)^12) × 100

---

## Root causes of churn

- Poor onboarding — users never reach activation
- Product doesn't solve the stated problem
- Better alternative exists (or customer perceives it does)
- Pricing misalignment — expected more for the cost
- Change in customer's internal priorities or budget`,
    faqs: [
      { q: "What's the difference between churn rate and retention rate?", a: "They're complements: if monthly churn is 3%, monthly retention is 97%. Retention measures who stayed; churn measures who left. SaaS investors typically focus on retention cohorts (Day 30, Day 90 curves) rather than monthly churn because cohort curves reveal the depth of engagement." },
      { q: "What's negative net revenue churn?", a: "Negative net revenue churn means your existing customers expanded (upgraded, added seats) more than the revenue lost from churned customers. It's a strong signal of PMF — your installed base is growing without new customer acquisition. Stripe and Datadog famously achieved this early." },
    ],
    relatedSlugs: ["retention-rate", "ltv", "nps"],
    relatedTemplates: [{ slug: "churn-analysis", title: "Churn Analysis Template" }, { slug: "aarrr-metrics", title: "AARRR Pirate Metrics" }],
  },

  {
    slug: "retention-rate",
    term: "Retention Rate",
    category: "Metrics & Analytics",
    shortDef: "The percentage of users who continue using a product over a defined time period — the most important signal of product-market fit and sustainable growth.",
    metaDescription: "What is retention rate? Learn how to measure user retention, read cohort curves, and identify the aha moment that drives long-term retention.",
    definition: `## What is Retention Rate?

**Retention rate** is the percentage of users who return to use a product after their initial visit or activation. It measures whether users get repeated value — and is the most important leading indicator of PMF, LTV, and sustainable growth.

---

## How to measure retention

**N-day retention:** % of users who return on day N after first use.

> Day-30 retention = (Users active on day 30) ÷ (Users acquired on day 0) × 100

**Cohort retention curves:** Plot each acquisition cohort's retention over time. A curve that flattens indicates a retained core; a curve that declines to zero indicates no PMF.

---

## Retention benchmarks (mobile/SaaS)

| Day | Consumer apps | B2B SaaS |
|---|---|---|
| Day 1 | 25–35% | 60–70% |
| Day 7 | 10–20% | 40–55% |
| Day 30 | 5–10% | 25–40% |

---

## Retention levers

| Lever | Mechanism |
|---|---|
| **Onboarding** | Get users to aha moment faster |
| **Habit triggers** | Notifications, digests, reminders |
| **Feature depth** | Users who use core + 1 feature retain 2x longer |
| **Integration hooks** | Slack/Jira integrations increase switching cost |`,
    faqs: [
      { q: "What's the 'aha moment' and why does it matter for retention?", a: "The aha moment is the point where a user first experiences the core value of the product. Users who reach it retain; users who don't, churn. For Slack, it's 'send 2,000 team messages'. For Dropbox, it's 'save one file'. Find yours by correlating early actions with Day-30 retention." },
      { q: "How do you improve D1 retention specifically?", a: "D1 retention is almost entirely an onboarding problem. Map the user's first session: where do they drop off? Are they reaching the aha moment? Reduce steps to first value, add progress indicators, and send a 24-hour re-engagement email." },
    ],
    relatedSlugs: ["churn-rate", "product-market-fit", "north-star-metric"],
    relatedTemplates: [{ slug: "aarrr-metrics", title: "AARRR Pirate Metrics" }, { slug: "product-health-dashboard", title: "Product Health Dashboard" }],
  },

  {
    slug: "ltv",
    term: "LTV (Lifetime Value)",
    category: "Metrics & Analytics",
    shortDef: "The total revenue a business expects to earn from a single customer over the entire duration of the relationship.",
    metaDescription: "What is LTV (Lifetime Value)? Learn how to calculate customer lifetime value, the LTV:CAC ratio, and how to use LTV to make growth decisions.",
    definition: `## What is LTV?

**LTV (Lifetime Value)**, also called CLV or CLTV, is the total revenue a company expects from a single customer account from acquisition to churn. It's the primary input for understanding how much you can afford to spend acquiring customers (CAC).

---

## LTV formula (simple)

> **LTV = ARPU × Average Customer Lifetime**

> Average Customer Lifetime = 1 ÷ Monthly Churn Rate

**Example:** ARPU = ₹999/mo, monthly churn = 3%
→ Average lifetime = 1 ÷ 0.03 = 33 months
→ LTV = ₹999 × 33 = **₹32,967**

---

## LTV:CAC ratio

The ratio of LTV to Customer Acquisition Cost tells you whether your business model is sustainable.

| Ratio | Interpretation |
|---|---|
| < 1:1 | Losing money on every customer |
| 1:1 – 3:1 | Marginal — not enough to fund growth |
| 3:1 | Healthy — industry benchmark for SaaS |
| > 5:1 | Either pricing too low or underinvesting in growth |

---

## How to increase LTV

- **Reduce churn** — biggest lever; doubles LTV when halved
- **Increase ARPU** — upsells, expansions, seat growth
- **Extend payback period** — annual plans reduce early churn`,
    faqs: [
      { q: "Should I use gross margin LTV or revenue LTV?", a: "Gross margin LTV (revenue minus COGS) is more accurate for comparing against CAC, since CAC is a cash cost. Revenue LTV overstates the economics. For SaaS with 70–80% gross margins, the difference is significant." },
      { q: "How reliable are LTV calculations for early-stage companies?", a: "Unreliable — they require stable churn rates you don't have yet. Early-stage LTV is a directional estimate. Use cohort retention data instead: 'our 6-month cohort retains 55%' is more honest than projecting a 36-month LTV from 3 months of data." },
    ],
    relatedSlugs: ["cac", "churn-rate", "arpu"],
    relatedTemplates: [{ slug: "unit-economics", title: "Unit Economics Template" }, { slug: "aarrr-metrics", title: "AARRR Pirate Metrics" }],
  },

  {
    slug: "cac",
    term: "CAC (Customer Acquisition Cost)",
    category: "Metrics & Analytics",
    shortDef: "The total cost to acquire one new customer — including sales, marketing, and any related overhead — divided by the number of new customers acquired in a period.",
    metaDescription: "What is CAC? Learn how to calculate Customer Acquisition Cost, the LTV:CAC ratio, and how to reduce CAC across different growth channels.",
    definition: `## What is CAC?

**CAC (Customer Acquisition Cost)** is the total cost of acquiring a new paying customer. It's calculated by dividing all sales and marketing costs in a period by the number of new customers acquired in that period.

---

## CAC formula

> **CAC = Total Sales & Marketing Spend ÷ New Customers Acquired**

**Example:** ₹5,00,000 spent on ads + sales salaries in April → 50 new customers
→ CAC = ₹5,00,000 ÷ 50 = **₹10,000 per customer**

---

## Blended vs. channel CAC

| Type | When to use |
|---|---|
| **Blended CAC** | Overall unit economics health check |
| **Channel CAC** | Comparing paid search vs. content vs. sales |
| **Paid CAC** | Isolates non-organic acquisition cost |

---

## CAC payback period

> **CAC Payback = CAC ÷ (ARPU × Gross Margin %)**

This is how many months to recoup the acquisition cost. Benchmark: < 12 months for self-serve SaaS, < 18 months for enterprise.

---

## How to reduce CAC

- Invest in organic channels (SEO, content, community)
- Improve conversion rates at each funnel stage
- Build referral and word-of-mouth loops
- Narrow ICP — broad targeting is expensive targeting`,
    faqs: [
      { q: "Should CAC include only direct ad spend or total costs?", a: "Total costs for an accurate picture: include salaries of the sales and marketing team, tools and software, agency fees, and events. Direct-only CAC dramatically understates the true cost of customer acquisition." },
      { q: "What's a good LTV:CAC ratio?", a: "3:1 is the benchmark for healthy SaaS. Below 3:1 means you're not making enough profit per customer to fund sustainable growth. Above 5:1 often means you're underinvesting in growth — raise your CAC budget." },
    ],
    relatedSlugs: ["ltv", "churn-rate"],
    relatedTemplates: [{ slug: "unit-economics", title: "Unit Economics Template" }, { slug: "aarrr-metrics", title: "AARRR Pirate Metrics" }],
  },

  {
    slug: "nps",
    term: "NPS (Net Promoter Score)",
    category: "Metrics & Analytics",
    shortDef: "A customer loyalty metric based on a single question — 'How likely are you to recommend us?' — scored 0–10, that classifies respondents as Promoters, Passives, or Detractors.",
    metaDescription: "What is NPS? Learn how to calculate Net Promoter Score, what good NPS benchmarks look like, and how PMs use NPS to prioritise product decisions.",
    definition: `## What is NPS?

**NPS (Net Promoter Score)** was developed by Fred Reichheld at Bain & Company in 2003. It measures customer loyalty by asking one question:

> *"On a scale of 0–10, how likely are you to recommend [product] to a friend or colleague?"*

---

## How NPS is calculated

| Score | Category | Definition |
|---|---|---|
| 9–10 | **Promoters** | Loyal enthusiasts who will refer others |
| 7–8 | **Passives** | Satisfied but unenthusiastic; vulnerable to competitors |
| 0–6 | **Detractors** | Unhappy customers who may damage brand through negative WOM |

> **NPS = % Promoters − % Detractors**

Range: −100 to +100

---

## NPS benchmarks (SaaS)

| Score | Interpretation |
|---|---|
| < 0 | Critical — more detractors than promoters |
| 0–30 | Below average |
| 30–50 | Good |
| 50–70 | Excellent |
| > 70 | World-class (Apple, Netflix at their peaks) |

---

## NPS limitations for product decisions

NPS measures satisfaction, not behaviour. A user can give 9/10 NPS and still churn. Always pair NPS with:
- Retention cohort data
- Follow-up qualitative "why" question
- Segmented analysis (by plan, cohort, or persona)`,
    faqs: [
      { q: "When should you send the NPS survey?", a: "In-product, after the user has experienced core value — not immediately after signup. For SaaS, trigger it at Day 30 or after the user completes 3–5 key actions. Annual email surveys produce less actionable data than in-product, event-triggered surveys." },
      { q: "Is NPS a reliable predictor of growth?", a: "Weakly. Reichheld's original research showed correlation between NPS and revenue growth, but subsequent studies found the correlation is industry-specific and often overstated. Use NPS as one signal among many — not as your primary growth metric." },
    ],
    relatedSlugs: ["retention-rate", "churn-rate", "product-market-fit"],
    relatedTemplates: [{ slug: "product-health-dashboard", title: "Product Health Dashboard" }, { slug: "weekly-pm-report", title: "Weekly PM Report" }],
  },

  {
    slug: "arpu",
    term: "ARPU (Average Revenue Per User)",
    category: "Metrics & Analytics",
    shortDef: "Total revenue divided by total active users in a period — a key indicator of monetisation efficiency and pricing power.",
    metaDescription: "What is ARPU? Learn how to calculate Average Revenue Per User, ARPU vs ARPPU, and how to use it to benchmark your monetisation strategy.",
    definition: `## What is ARPU?

**ARPU (Average Revenue Per User)** measures how much revenue a product generates per active user in a given period.

> **ARPU = Total Revenue ÷ Total Active Users**

---

## ARPU vs. ARPPU

| Metric | Denominator | Use case |
|---|---|---|
| **ARPU** | All active users | Overall monetisation health |
| **ARPPU** (per paying user) | Paying users only | Pricing and packaging decisions |

ARPPU removes non-paying users from the denominator — useful for freemium products where most users are free.

---

## ARPU benchmarks (monthly, SaaS)

| Segment | Typical ARPU |
|---|---|
| Consumer apps | $1–$10 |
| SMB SaaS | $20–$200 |
| Mid-market SaaS | $200–$2,000 |
| Enterprise SaaS | $2,000+ |

---

## How to increase ARPU

- Tiered pricing with higher-value plans
- Usage-based pricing that scales with value delivered
- Add-on features for power users
- Reduce free plan limits to accelerate upgrade`,
    faqs: [
      { q: "Is high ARPU always better?", a: "Not necessarily. Lower ARPU with very high volume (consumer apps) can generate more total revenue than high ARPU with small volume. What matters is ARPU relative to CAC — if ARPU is high but CAC is higher, the unit economics don't work." },
      { q: "How does ARPU relate to LTV?", a: "LTV = ARPU × average customer lifetime. Increasing ARPU directly increases LTV without changing churn rate. It's one of the two main LTV levers — the other being reducing churn." },
    ],
    relatedSlugs: ["ltv", "cac", "churn-rate"],
    relatedTemplates: [{ slug: "unit-economics", title: "Unit Economics Template" }, { slug: "b2b-saas-pricing", title: "B2B SaaS Pricing Template" }],
  },

  {
    slug: "conversion-rate",
    term: "Conversion Rate",
    category: "Metrics & Analytics",
    shortDef: "The percentage of users who complete a desired action — signup, upgrade, purchase, or feature activation — out of all users who had the opportunity to do so.",
    metaDescription: "What is conversion rate? Learn how to measure and improve conversion rates across signup, activation, upgrade, and purchase funnels.",
    definition: `## What is Conversion Rate?

**Conversion rate** measures the percentage of users who take a desired action at a specific step in a funnel.

> **Conversion Rate = (Users who completed action ÷ Total users who had opportunity) × 100**

---

## Conversion rates by funnel stage (SaaS benchmarks)

| Stage | Benchmark |
|---|---|
| Visitor → Signup | 2–5% |
| Signup → Activated | 30–50% |
| Trial → Paid | 15–25% |
| Free → Paid (freemium) | 2–5% |
| Paid → Expansion | 10–30% annually |

---

## Types of conversion events

- **Acquisition conversion** — visitor signs up
- **Activation conversion** — new user reaches aha moment
- **Monetisation conversion** — free user upgrades
- **Engagement conversion** — user completes a key action (invites a teammate, connects an integration)

---

## How to improve conversion rate

1. Identify the biggest drop-off step in the funnel
2. Form a hypothesis for why users drop off
3. Run an A/B test on the specific step
4. Measure impact on downstream retention, not just the conversion step itself`,
    faqs: [
      { q: "Should conversion rates be optimised in isolation?", a: "No — optimising for conversion at one step can hurt downstream metrics. A signup flow optimised purely for volume might attract low-intent users who immediately churn. Always measure the impact of conversion improvements on D30 retention and LTV." },
      { q: "What's a good trial-to-paid conversion rate?", a: "15–25% is healthy for B2B SaaS. Below 10% usually means the trial isn't delivering value quickly enough or the upgrade prompt is poorly timed. Above 30% often means the free tier is too limited — you might be leaving growth on the table." },
    ],
    relatedSlugs: ["retention-rate", "funnel-analysis", "ab-testing"],
    relatedTemplates: [{ slug: "aarrr-metrics", title: "AARRR Pirate Metrics" }, { slug: "experiment-design", title: "Experiment Design Template" }],
  },

  {
    slug: "ab-testing",
    term: "A/B Testing",
    category: "Metrics & Analytics",
    shortDef: "A controlled experiment that compares two versions of a product element (A = control, B = variant) to determine which performs better on a defined metric.",
    metaDescription: "What is A/B testing? Learn how to design, run, and interpret A/B tests — including sample size, statistical significance, and common mistakes.",
    definition: `## What is A/B Testing?

**A/B testing** (also called split testing) is a randomised controlled experiment that shows two versions of a product element to different user segments simultaneously to determine which version drives better outcomes.

---

## A/B test anatomy

| Element | Description |
|---|---|
| **Control (A)** | The existing version |
| **Variant (B)** | The new version being tested |
| **Hypothesis** | "Changing X will increase Y because Z" |
| **Primary metric** | The one metric that determines the winner |
| **Guard metrics** | Metrics you must not harm (e.g. revenue) |
| **MDE** | Minimum detectable effect — smallest improvement worth detecting |
| **Sample size** | Calculated from MDE, baseline conversion, and significance level |

---

## Statistical significance

A result is significant at 95% confidence when there's only a 5% chance the observed difference occurred by random chance. Don't stop tests early — running until significance is reached after peeking inflates false positive rates.

---

## Common mistakes

- **Too many variants** — multivariate tests require much larger samples
- **Stopping early** — peeking at results and stopping when significant inflates false positives
- **Wrong primary metric** — optimising for clicks while the real goal is revenue
- **No holdout** — running a test without a control group`,
    faqs: [
      { q: "How long should an A/B test run?", a: "Until you've reached the required sample size calculated upfront — not until you see a significant result. For most SaaS products, this is 1–4 weeks. Never stop a test early because it looks like B is winning." },
      { q: "What's the difference between A/B testing and multivariate testing?", a: "A/B testing compares two versions of one element. Multivariate testing compares multiple variations of multiple elements simultaneously. MVT requires much larger sample sizes and is harder to interpret — use it only when you have very high traffic and are optimising multiple elements at once." },
    ],
    relatedSlugs: ["conversion-rate", "north-star-metric"],
    relatedTemplates: [{ slug: "ab-test-plan", title: "A/B Test Plan Template" }, { slug: "experiment-design", title: "Experiment Design Template" }],
  },

  {
    slug: "cohort-analysis",
    term: "Cohort Analysis",
    category: "Metrics & Analytics",
    shortDef: "A technique that groups users who share a common characteristic (usually acquisition date) and tracks their behaviour over time to reveal retention, engagement, and revenue trends.",
    metaDescription: "What is cohort analysis? Learn how to read cohort retention tables, identify product improvements in cohort data, and use cohorts to measure PMF.",
    definition: `## What is Cohort Analysis?

**Cohort analysis** groups users who share a common starting point (usually their signup week/month) and tracks their behaviour over time. It reveals whether product improvements are actually being experienced by real users, not just new cohorts.

---

## Reading a cohort retention table

\`\`\`
Cohort   | Week 0 | Week 1 | Week 2 | Week 4 | Week 8
Jan      | 100%   | 45%    | 32%    | 22%    | 18%
Feb      | 100%   | 48%    | 35%    | 25%    | 20%
Mar      | 100%   | 52%    | 40%    | 31%    | 26%
\`\`\`

Each row is an acquisition cohort. Each column is how many users were active N weeks after signup. Improving numbers from Jan → Mar indicates the product is getting better at retaining users.

---

## What to look for

- **Flattening curves** — retention stabilising above 0% = you have a retained core
- **Improving cohorts** — later cohorts retain better = product improvements are working
- **Cliff at day 1/3** — massive early drop-off = onboarding problem
- **Revenue cohorts** — expansion MRR in older cohorts = strong monetisation`,
    faqs: [
      { q: "What's the difference between cohort analysis and funnel analysis?", a: "Funnel analysis measures conversion through a sequence of steps at a point in time. Cohort analysis measures what happens to a group of users over time. Use funnels to find where users drop off in a flow; use cohorts to measure whether product changes improved long-term retention." },
      { q: "How many users do I need for reliable cohort analysis?", a: "At least 100–200 users per cohort for statistical reliability. With smaller cohorts, retention curves are noisy. Early-stage companies should focus on qualitative interviews alongside cohort data rather than trusting small-sample cohort curves." },
    ],
    relatedSlugs: ["retention-rate", "churn-rate", "ab-testing"],
    relatedTemplates: [{ slug: "churn-analysis", title: "Churn Analysis Template" }, { slug: "product-health-dashboard", title: "Product Health Dashboard" }],
  },

  {
    slug: "funnel-analysis",
    term: "Funnel Analysis",
    category: "Metrics & Analytics",
    shortDef: "A method of tracking user progression through a defined sequence of steps — from awareness to conversion — to identify where users drop off.",
    metaDescription: "What is funnel analysis? Learn how to build and read a conversion funnel, find drop-off points, and prioritise optimisation efforts.",
    definition: `## What is Funnel Analysis?

**Funnel analysis** tracks how users move through a defined sequence of steps toward a goal (signup, activation, purchase). At each step, some users drop off — the funnel shape visualises where the losses occur.

---

## AARRR funnel (Pirate Metrics)

| Stage | Question | Example metric |
|---|---|---|
| **Acquisition** | How do users find us? | Visitor → Signup rate |
| **Activation** | Do they get value on first use? | Users who complete onboarding |
| **Retention** | Do they come back? | Week-4 retention rate |
| **Revenue** | Do they pay? | Free → Paid conversion rate |
| **Referral** | Do they tell others? | Viral coefficient |

---

## Reading a funnel

\`\`\`
Visited landing page:     10,000
↓ 4.2% conversion
Signed up:                   420
↓ 48% conversion
Completed onboarding:        202
↓ 31% conversion
Activated (key action):       63
↓ 22% conversion
Upgraded to paid:             14
\`\`\`

The biggest absolute drop (10,000 → 420) is the landing page. The most improvable step is often activation (48%) — improving it by 20% compounds through every step below it.

---

## How to prioritise funnel optimisation

Focus on the step with the highest traffic × lowest conversion rate. Small improvements at high-traffic steps have outsized downstream impact.`,
    faqs: [
      { q: "Should I optimise the top or bottom of the funnel first?", a: "Bottom of the funnel first — activation and conversion improvements have immediate revenue impact. Top-of-funnel improvements bring more users into a broken funnel, amplifying churn. Fix the leaks before turning on the tap." },
      { q: "How do I know which funnel step to fix first?", a: "Calculate the revenue impact of a 10% improvement at each step. The step where a 10% improvement generates the most incremental revenue is your highest leverage point." },
    ],
    relatedSlugs: ["conversion-rate", "retention-rate", "ab-testing"],
    relatedTemplates: [{ slug: "aarrr-metrics", title: "AARRR Pirate Metrics" }, { slug: "experiment-design", title: "Experiment Design Template" }],
  },

  // ── Design & Experience ───────────────────────────────────────────────────────

  {
    slug: "ux",
    term: "UX (User Experience)",
    category: "Design & Experience",
    shortDef: "The overall quality of a user's interaction with a product — encompassing usability, accessibility, performance, and emotional response — not just visual design.",
    metaDescription: "What is UX? Learn what user experience covers, how UX differs from UI, and what PMs need to understand about UX to ship better products.",
    definition: `## What is UX?

**UX (User Experience)** encompasses everything a user thinks, feels, and does when interacting with a product. It's not limited to visual design — it includes performance, copy, information architecture, error handling, and support.

Don Norman, who coined the term at Apple in the 1990s, defined it as: "all aspects of the end-user's interaction with the company, its services, and its products."

---

## UX vs. UI

| UX | UI |
|---|---|
| The experience of using the product | The visual interface the user sees |
| How it works | How it looks |
| Information architecture, flows, wireframes | Typography, colour, components |
| Validated through usability testing | Validated through visual QA and feedback |

Good UI with bad UX frustrates users who can see the product is polished but can't accomplish their goals. Good UX with bad UI is functional but creates poor first impressions.

---

## UX in the PM's scope

PMs don't design UX — designers do. But PMs:
- Define user problems that UX design must solve
- Review prototypes against acceptance criteria
- Prioritise UX improvements in the backlog alongside features
- Advocate for research budget and user testing time`,
    faqs: [
      { q: "What's the PM's relationship with UX design?", a: "PMs define the 'what' and 'why' (the problem to solve and the outcome expected). UX designers define the 'how' (the interaction model). Good PM-UX relationships involve PMs in discovery and designers in backlog prioritisation — both informing each other's work." },
      { q: "How do you measure UX quality?", a: "Quantitatively: task completion rate, time-on-task, error rate, and SUS (System Usability Scale) score. Qualitatively: usability test observations, support ticket themes, and NPS open-text responses. Retention is the ultimate UX metric — users who can't accomplish their goals don't come back." },
    ],
    relatedSlugs: ["wireframe", "prototype", "usability-testing"],
    relatedTemplates: [{ slug: "design-review-checklist", title: "Design Review Checklist" }, { slug: "user-interview-script", title: "User Interview Script" }],
  },

  {
    slug: "wireframe",
    term: "Wireframe",
    category: "Design & Experience",
    shortDef: "A low-fidelity visual representation of a product screen that shows layout and structure without visual design — used to communicate information architecture and user flows early in the design process.",
    metaDescription: "What is a wireframe? Learn how wireframes are used in product design, how they differ from prototypes and mockups, and when to use each.",
    definition: `## What is a Wireframe?

A **wireframe** is a schematic or blueprint of a UI screen. It shows the placement of elements — navigation, content areas, buttons, forms — without colours, images, or final typography. Think of it as a rough sketch that communicates *what goes where* before investing in how it looks.

---

## Fidelity spectrum

| Type | Description | Tools |
|---|---|---|
| **Lo-fi wireframe** | Hand sketch or basic boxes | Paper, Balsamiq |
| **Mid-fi wireframe** | Greyscale, real layout | Figma, Sketch |
| **Hi-fi mockup** | Full colour, real typography | Figma |
| **Prototype** | Clickable interactions | Figma, Framer |

---

## When wireframes are most valuable

- Early in discovery, before investing design time
- When aligning PM and engineering on information architecture
- When testing flow and layout with users before visual polish
- When communicating scope to engineering (what screens exist, what actions are available)

---

## What to review in a wireframe

- Does the layout match the user's mental model?
- Is the primary action obvious?
- Are all edge cases represented (empty state, error state, loading)?
- Does the navigation reflect the information architecture?`,
    faqs: [
      { q: "Should PMs create wireframes?", a: "PMs can sketch rough wireframes to communicate intent — especially for simple layouts. But wireframes for complex flows should be created by designers. A PM wireframe that goes directly to engineering without designer review often misses usability issues." },
      { q: "When should you skip wireframes and go straight to high-fidelity?", a: "When iterating on an existing pattern (adding a field to a known form, new item in an existing list). Skip wireframes when the information architecture is already established and only the content is changing." },
    ],
    relatedSlugs: ["ux", "prototype"],
    relatedTemplates: [{ slug: "design-review-checklist", title: "Design Review Checklist" }, { slug: "spec-to-react", title: "Spec-to-React Template" }],
  },

  {
    slug: "prototype",
    term: "Prototype",
    category: "Design & Experience",
    shortDef: "A simulated version of a product or feature — ranging from paper sketches to clickable Figma flows — used to test ideas with users before engineering investment.",
    metaDescription: "What is a prototype? Learn the difference between lo-fi and hi-fi prototypes, when to prototype vs. build, and how to use prototypes in user testing.",
    definition: `## What is a Prototype?

A **prototype** is an early model of a product used to test a concept before committing to full development. Prototypes range from rough paper sketches to high-fidelity interactive simulations — the appropriate fidelity depends on the question being tested.

---

## Prototype fidelity vs. purpose

| Fidelity | Purpose | Tools |
|---|---|---|
| **Paper / sketch** | Explore many ideas quickly | Paper, whiteboard |
| **Clickable wireframe** | Test flow and information architecture | Figma (lo-fi) |
| **Hi-fi interactive** | Test visual design and micro-interactions | Figma, Framer |
| **Coded prototype** | Test performance and real data | React, Next.js |
| **Concierge / wizard** | Test demand before building anything | Humans doing it manually |

---

## The rule of appropriate fidelity

Use the lowest fidelity that can answer your current question. A paper sketch to test if users understand a flow costs 1 hour. A coded prototype for the same test wastes a sprint.

---

## Prototype vs. MVP

| Prototype | MVP |
|---|---|
| Tests a design hypothesis | Tests a product hypothesis |
| Simulates behaviour | Real working behaviour |
| No backend needed | Backend required |
| Throw away after testing | Foundation for v1 |`,
    faqs: [
      { q: "What questions can a prototype answer that an MVP can't?", a: "Whether users understand the flow, whether the information architecture makes sense, whether the copy is clear, and whether users know what to do next — all before a line of production code is written. Prototypes test usability; MVPs test value and retention." },
      { q: "How many users should you test a prototype with?", a: "5 users per round of testing is the classic Nielsen Norman guideline — enough to identify 80–85% of usability issues. Run 3–5 users, fix the major issues, run another 3–5. Avoid large-sample usability studies — they're expensive and the last 15 users rarely surface new issues." },
    ],
    relatedSlugs: ["wireframe", "ux", "mvp"],
    relatedTemplates: [{ slug: "design-review-checklist", title: "Design Review Checklist" }, { slug: "user-interview-script", title: "User Interview Script" }],
  },

  {
    slug: "usability-testing",
    term: "Usability Testing",
    category: "Design & Experience",
    shortDef: "A user research method where participants attempt real tasks on a product while researchers observe — revealing where users struggle, get confused, or fail to complete their goals.",
    metaDescription: "What is usability testing? Learn how to run usability tests, what to observe, and how to turn findings into product improvements.",
    definition: `## What is Usability Testing?

**Usability testing** is observing real users attempt specific tasks on your product (or prototype) to identify where they struggle, get confused, or fail. The goal is not to get opinions — it's to observe behaviour.

The key rule: **don't help**. When a user gets stuck, observe. The confusion is the data.

---

## Types of usability testing

| Type | Description | When |
|---|---|---|
| **Moderated** | Researcher observes and probes live | Discovery, early prototypes |
| **Unmoderated** | Users complete tasks on their own (recorded) | Later-stage, higher volume |
| **Remote** | Conducted via Zoom or tool like UserTesting | Most common in practice |
| **In-person** | Researcher is physically present | Complex tasks, lab settings |

---

## How to write usability test tasks

Bad task: "Find the settings page and update your notification preferences."
(Tells the user what to do — doesn't test if they can find it.)

Good task: "You've been getting too many emails from the app and want to stop them. Show me what you'd do."
(Mimics a real motivation — tests whether users can accomplish the goal without being told how.)

---

## What to measure

- **Task completion rate** — % of users who finish the task
- **Time on task** — how long it took
- **Error rate** — wrong clicks, backtracking
- **Satisfaction** — post-task rating (Single Ease Question: 1–7)`,
    faqs: [
      { q: "How many participants do you need?", a: "5 per round is the Nielsen guideline for moderated testing — enough to catch 80–85% of major usability issues. For unmoderated tests you need 20–30+ for statistical reliability. Run iterative rounds of 5 rather than one large study." },
      { q: "What's the difference between usability testing and user interviews?", a: "User interviews uncover motivations, problems, and mental models through conversation. Usability testing reveals how users interact with a specific interface through observation. Use interviews for discovery; use usability testing for validation of designs." },
    ],
    relatedSlugs: ["ux", "prototype", "wireframe"],
    relatedTemplates: [{ slug: "user-interview-script", title: "User Interview Script" }, { slug: "empathy-map", title: "Empathy Map" }],
  },

  // ── Prioritization & Frameworks ───────────────────────────────────────────────

  {
    slug: "kano-model",
    term: "Kano Model",
    category: "Prioritization & Frameworks",
    shortDef: "A feature prioritization framework that classifies features into five categories based on their relationship between implementation and customer satisfaction — distinguishing 'must-haves' from 'delighters'.",
    metaDescription: "What is the Kano Model? Learn how to classify features as Basic, Performance, Excitement, Indifferent, or Reverse — and how to use Kano surveys for prioritisation.",
    definition: `## What is the Kano Model?

The **Kano Model**, developed by Professor Noriaki Kano in 1984, classifies product features by how their presence (or absence) affects customer satisfaction. It distinguishes between features users expect, features that scale satisfaction linearly, and features that delight unexpectedly.

---

## The five Kano categories

| Category | Implemented | Not implemented | Example |
|---|---|---|---|
| **Basic (Must-have)** | Not delighted (expected) | Very dissatisfied | Login works |
| **Performance (Linear)** | More = more satisfied | Less = less satisfied | Faster load time |
| **Excitement (Delighter)** | Delighted (unexpected) | No dissatisfaction | Surprise personalisation |
| **Indifferent** | No reaction | No reaction | Obscure export format |
| **Reverse** | Dissatisfied | Satisfied | Forced feature nobody asked for |

---

## How to run a Kano survey

For each feature, ask two questions:
1. "If this feature **were** available, how would you feel?" (functional form)
2. "If this feature **were not** available, how would you feel?" (dysfunctional form)

Responses: Delighted / Expected / Neutral / Accepted / Dissatisfied

Map functional + dysfunctional responses to a Kano category using the standard evaluation table.

---

## Why it matters

- **Don't waste effort on Indifferent features** — users won't notice
- **Never ship without Basics** — users won't forgive missing expectations
- **Excitement features become Basics over time** — yesterday's delight is today's expectation`,
    faqs: [
      { q: "How is the Kano Model different from RICE scoring?", a: "RICE scores features by expected impact on metrics. Kano classifies features by their emotional impact on satisfaction. They're complementary: use Kano in discovery to understand which features matter to which segment, then use RICE to prioritise among the Performance and Excitement features you've identified." },
      { q: "Can Excitement features become Basic over time?", a: "Yes — this is called the 'Kano decay effect'. Two-factor authentication was an Excitement feature in 2015; it's a Basic expectation for enterprise SaaS in 2026. Revisit your Kano classifications annually as market expectations evolve." },
    ],
    relatedSlugs: ["rice-scoring", "moscow-method", "jobs-to-be-done"],
    relatedTemplates: [{ slug: "kano-model", title: "Kano Model Template" }, { slug: "rice-scoring", title: "RICE Scoring Template" }],
  },

  {
    slug: "ice-scoring",
    term: "ICE Scoring",
    category: "Prioritization & Frameworks",
    shortDef: "A lightweight prioritization framework that scores initiatives by Impact, Confidence, and Ease — producing a simple rank-order without requiring per-feature reach estimates.",
    metaDescription: "What is ICE scoring? Learn how to use the Impact, Confidence, Ease framework for fast feature prioritisation and how it compares to RICE.",
    definition: `## What is ICE Scoring?

**ICE scoring** was popularised by Sean Ellis (who also created the 40% NPS PMF benchmark) as a fast prioritisation tool for growth experiments. It scores each initiative on three dimensions:

| Factor | Question | Scale |
|---|---|---|
| **Impact** | If this works, how big is the effect? | 1–10 |
| **Confidence** | How sure are we it will work? | 1–10 |
| **Ease** | How easy is it to implement? | 1–10 |

> **ICE Score = Impact × Confidence × Ease**

---

## ICE vs. RICE

| Dimension | ICE | RICE |
|---|---|---|
| Reach | Not included | Included |
| Speed | Faster — no Reach estimate needed | Slower |
| Best for | Growth experiments, equal-reach features | Backlog with variable audience sizes |
| Risk | Treats all features as same audience | More accurate but more effort |

---

## When to use ICE

- Growth experiments where all features target the full user base
- Quick stack-ranking when you need a decision in < 30 minutes
- Early-stage products where Reach estimates are unreliable
- Comparing experiments within a single funnel stage

---

## ICE pitfall

Because Ease is in the formula, ICE systematically favours quick wins over high-impact hard things. Balance this by also reviewing top ICE items against strategic importance.`,
    faqs: [
      { q: "Should Ease be higher = easier or higher = harder?", a: "Higher = easier in the standard ICE formula. A score of 9 means it's very easy to implement. Some teams invert this to 'Effort' (higher = more effort) and divide instead of multiply — but this changes the formula direction. Stick to the original: higher Ease = simpler implementation = higher score." },
      { q: "How is ICE different from just gut instinct?", a: "ICE makes the assumptions explicit and forces you to separate the three dimensions. It also creates a shared decision record — 'we scored this 7×3×8 = 168 and ranked it #3' — which is more defensible than 'it felt right'. The value is in the conversation the scoring triggers, not the precision of the number." },
    ],
    relatedSlugs: ["rice-scoring", "moscow-method"],
    relatedTemplates: [{ slug: "rice-scoring", title: "RICE Scoring Template" }, { slug: "moscow-method", title: "MoSCoW Prioritization Template" }],
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}
