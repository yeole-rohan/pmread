import type { Template } from "./types";

export const planningTemplates: Template[] = [
  {
    slug: "okr-template",
    title: "OKR Template",
    shortTitle: "OKR",
    category: "Planning",
    description:
      "A complete OKR template for product teams. Covers company and team-level objectives, key results with baselines and targets, quarterly initiatives, and a retrospective section.",
    metaDescription:
      "Free OKR template for product managers and teams. Includes objectives, key results with baselines, initiatives, mid-quarter check-ins, and a quarter-end retro. Copy-paste ready.",
    filename: "okr-template.md",
    content: `# OKR Template

**Team / Owner:** [Team Name or Individual]
**Quarter:** Q[X] [Year]
**Last Updated:** [Date]

---

## How OKRs Work

- **Objective** — A qualitative, inspiring statement of what you want to achieve.
- **Key Results** — 2–5 measurable outcomes that define what success looks like.
- **Score** — Rate each KR 0.0–1.0 at the end of the quarter. 0.7 is good; 1.0 means the target was too easy.

---

## Company OKRs (if applicable)

### Objective 1: [Company Objective]
| # | Key Result | Owner | Baseline | Target | Score |
|---|---|---|---|---|---|
| KR1 | [Measurable result] | [Name] | [Current] | [Goal] | — |
| KR2 | [Measurable result] | [Name] | [Current] | [Goal] | — |
| KR3 | [Measurable result] | [Name] | [Current] | [Goal] | — |

---

## Team OKRs

### Objective 1: [Inspiring team objective — what does winning look like?]

> **Why this matters:** [1 sentence connecting this objective to company strategy]

| # | Key Result | Owner | Baseline | Target | Mid-Q Check-in | Final Score |
|---|---|---|---|---|---|---|
| KR1 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |
| KR2 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |
| KR3 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |

**Initiatives that drive this objective:**
- [ ] [Project or initiative name] — [Expected contribution]
- [ ] [Project or initiative name] — [Expected contribution]

---

### Objective 2: [Second team objective]

> **Why this matters:** [1 sentence]

| # | Key Result | Owner | Baseline | Target | Mid-Q Check-in | Final Score |
|---|---|---|---|---|---|---|
| KR1 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |
| KR2 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |

**Initiatives that drive this objective:**
- [ ] [Project or initiative name] — [Expected contribution]

---

### Objective 3: [Third team objective — optional]

> **Why this matters:** [1 sentence]

| # | Key Result | Owner | Baseline | Target | Mid-Q Check-in | Final Score |
|---|---|---|---|---|---|---|
| KR1 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |
| KR2 | [Specific, measurable result] | [Name] | [Current] | [Goal] | — | — |

---

## Quarter-End Review

**What went well:**
- [Achievement]

**What we missed and why:**
- [Missed KR] — [Root cause]

**Key learnings for next quarter:**
- [Learning]

---

## OKR Writing Checklist

- [ ] Each objective is ambitious but achievable — it should feel slightly uncomfortable
- [ ] Each key result is measurable with a specific number or percentage
- [ ] Key results measure outcomes, not outputs (not "ship feature X" but "increase retention by 10%")
- [ ] No more than 3–5 objectives per team per quarter
- [ ] Every key result has a clearly named owner
- [ ] Baseline data exists before the quarter starts
`,
    howToUse: [
      {
        step: "Start with the company OKRs",
        detail:
          "Team OKRs should cascade from company-level objectives. If your team's objectives don't connect to company goals, they'll be deprioritized when things get busy.",
      },
      {
        step: "Write outcomes, not outputs",
        detail:
          "Key Results should measure outcomes ('increase activation rate to 40%') not outputs ('ship onboarding redesign'). If your KR looks like a task, rewrite it as a metric.",
      },
      {
        step: "Set a baseline before the quarter starts",
        detail:
          "You can't measure progress without knowing where you started. Pull the baseline number before day 1 of the quarter.",
      },
      {
        step: "Do a mid-quarter check-in",
        detail:
          "Review progress at week 6 of 13. If a KR is already at 100%, raise the target. If it's at 0%, diagnose why — is the initiative under-resourced or is the metric lagging?",
      },
    ],
    faqs: [
      {
        q: "How many OKRs should a team have per quarter?",
        a: "2–3 objectives, with 2–4 key results each. More than 3 objectives means you don't have real priorities — everything is important, which means nothing is. Teams that succeed with OKRs are ruthlessly focused.",
      },
      {
        q: "What's a good OKR score?",
        a: "0.6–0.7 out of 1.0 is considered healthy at companies like Google. If you're consistently scoring 1.0, your targets are too conservative. If you're consistently scoring below 0.4, your targets are unrealistic or your initiatives are misaligned.",
      },
      {
        q: "Should OKRs be tied to performance reviews?",
        a: "Most OKR practitioners, including John Doerr who popularized the framework, recommend against it. When OKRs affect compensation, teams set conservative targets to guarantee a high score instead of setting ambitious goals. Keep OKRs separate from performance management.",
      },
      {
        q: "What's the difference between OKRs and KPIs?",
        a: "KPIs are ongoing health metrics you always track (e.g. NPS, churn, uptime). OKRs are time-bound goals for a specific quarter — they describe where you want to move, not just where you are. A KPI like 'revenue' might inform an OKR key result like 'grow MRR from $100k to $130k in Q2'.",
      },
    ],
  },

  {
    slug: "product-roadmap-template",
    title: "Product Roadmap Template",
    shortTitle: "Roadmap",
    category: "Planning",
    description:
      "A Now/Next/Later product roadmap template with strategic themes, initiative tables, dependency tracking, and a changelog. Works for any product stage.",
    metaDescription:
      "Free product roadmap template for PMs. Now/Next/Later format with strategic themes, outcomes, confidence levels, and dependencies. Copy-paste ready Markdown.",
    filename: "product-roadmap-template.md",
    content: `# Product Roadmap

**Product:** [Product Name]
**Owner:** [Product Manager]
**Last Updated:** [Date]
**Horizon:** [Q1–Q2 2025 / H1 2025 / 12-month]

---

## Vision & Strategy

> **Product vision (1 sentence):** [Where this product is going in 2–3 years]

**Strategic bets this year:**
1. [Theme 1 — e.g. "Own the onboarding experience for SMB teams"]
2. [Theme 2 — e.g. "Build the integrations layer competitors can't match"]
3. [Theme 3 — e.g. "Move upmarket with enterprise-grade security"]

---

## Now — Current Quarter (Q[X] [Year])

> **Theme:** [What this quarter is focused on and why]

| Initiative | Outcome | Status | Owner | Notes |
|---|---|---|---|---|
| [Feature/Project] | [Measurable customer outcome] | In progress | [Name] | [Any context] |
| [Feature/Project] | [Measurable customer outcome] | In design | [Name] | |
| [Feature/Project] | [Measurable customer outcome] | Not started | [Name] | Blocked by [X] |

---

## Next — Q[X+1] [Year]

> **Theme:** [What this quarter is focused on]

| Initiative | Outcome | Confidence | Owner | Notes |
|---|---|---|---|---|
| [Feature/Project] | [Measurable outcome] | High | [Name] | |
| [Feature/Project] | [Measurable outcome] | Medium | [Name] | Needs research |
| [Feature/Project] | [Measurable outcome] | Low | [Name] | Exploring |

---

## Later — Q[X+2]+ / Future

> Items here are directional — sequence and scope may change.

| Initiative | Strategic Rationale | Rough Size |
|---|---|---|
| [Feature/Project] | [Why this matters to strategy] | S / M / L / XL |
| [Feature/Project] | [Why this matters to strategy] | S / M / L / XL |
| [Feature/Project] | [Why this matters to strategy] | S / M / L / XL |

---

## Not Doing (and Why)

| Request | Why Not Now |
|---|---|
| [Requested feature] | [Out of scope / low priority / technical constraint] |
| [Requested feature] | [Waiting for X / deferred to later] |

---

## Key Dependencies & Risks

| Dependency / Risk | Type | Owner | Mitigation |
|---|---|---|---|
| [Dependency] | External / Internal | [Name] | [Plan] |
| [Risk] | Technical / Market | [Name] | [Plan] |

---

## How to Read This Roadmap

- **Now** = committed for this quarter
- **Next** = planned, subject to learning from Now
- **Later** = directional, not committed
- Dates are intentionally absent — this is a direction document, not a delivery schedule
- Confidence levels: **High** = validated, scoped; **Medium** = rough idea; **Low** = hypothesis

---

## Changelog

| Date | Change | Author |
|---|---|---|
| [Date] | [What changed and why] | [Name] |
`,
    howToUse: [
      {
        step: "Anchor on strategy first",
        detail:
          "Fill in the Vision and Strategic Bets section before listing any initiatives. Every item on the roadmap should connect to one of your bets — if it doesn't, question why it's there.",
      },
      {
        step: "Use Now/Next/Later, not dates",
        detail:
          "Date-based roadmaps become liabilities the moment a date slips. Now/Next/Later communicates direction without creating false commitments. Add dates only for items where external parties (customers, partners) require them.",
      },
      {
        step: "Lead with outcomes, not features",
        detail:
          "Replace 'Add dashboard export' with 'Reduce data export time from 30 min to 2 min'. Outcome-framing forces you to be honest about what success means.",
      },
      {
        step: "Maintain the 'Not Doing' list",
        detail:
          "Every roadmap needs a 'Not Doing' section. It signals to stakeholders that requests were heard and deliberately deferred — which is very different from being ignored.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a roadmap and a backlog?",
        a: "A roadmap communicates direction and strategy to stakeholders — it's outward facing. A backlog is a prioritized list of work for engineering — it's inward facing. Roadmaps operate at the initiative or outcome level; backlogs operate at the feature or ticket level.",
      },
      {
        q: "How often should I update the product roadmap?",
        a: "Now items should be reviewed weekly. Next items should be reviewed before each quarter. Later items can be reviewed quarterly. A roadmap that's never updated is worse than no roadmap — it creates false expectations.",
      },
      {
        q: "Should the roadmap include time estimates?",
        a: "For external-facing roadmaps (customers, investors), avoid specific dates unless you're confident in them. For internal roadmaps, rough quarters are fine. The Now/Next/Later format deliberately avoids dates to prevent the roadmap from becoming a project plan.",
      },
      {
        q: "How do I handle stakeholder requests that don't fit the roadmap?",
        a: "Log them in the 'Not Doing' section with a reason. This converts a 'no' into a 'not now, because...' — which is much easier for stakeholders to accept. Review the Not Doing list at each quarterly planning cycle in case priorities have shifted.",
      },
    ],
  },

  {
    slug: "kano-model",
    title: "Kano Model Template",
    shortTitle: "Kano Model",
    category: "Planning",
    description:
      "A Kano Model analysis template for categorising product features into Must-Haves, Performance features, and Delighters — with a survey question guide and prioritisation output.",
    metaDescription:
      "Free Kano Model template for product managers. Categorise features into Must-Haves, Performance, and Delighters with survey questions and prioritisation output. No signup.",
    filename: "kano-model-template.md",
    content: `# Kano Model Analysis

**Product:** [Name]
**Analyst:** [PM Name]
**Date:** [Date]
**Features evaluated:** [N]
**Research method:** [Kano survey / customer interviews / team workshop]

---

## What Is the Kano Model?

The Kano Model (Noriaki Kano, 1984) categorises features by how they affect customer satisfaction:

| Category | Description | Example |
|---|---|---|
| **Must-Have (Basic)** | Expected features. Their absence causes dissatisfaction; their presence is neutral. | Login, data security, core workflow |
| **Performance (Linear)** | More = more satisfied. Less = less satisfied. Directly tied to value. | Speed, accuracy, breadth of integrations |
| **Delighter (Excitement)** | Unexpected. Their absence is fine; their presence creates delight. | A surprise shortcut, a magical moment |
| **Indifferent** | Nobody cares either way. | Most rarely-used settings |
| **Reverse** | Some users want it; others are annoyed by it. | AI auto-suggestions |

---

## Feature List

| # | Feature | Description |
|---|---|---|
| 1 | [Feature name] | [Brief description] |
| 2 | [Feature name] | [Brief description] |
| 3 | [Feature name] | [Brief description] |
| 4 | [Feature name] | [Brief description] |
| 5 | [Feature name] | [Brief description] |

---

## Kano Survey Questions

For each feature, ask two questions:

**Functional question:** "If [feature] were present, how would you feel?"
**Dysfunctional question:** "If [feature] were absent, how would you feel?"

**Response scale:**
- I would like it
- I expect it
- I am neutral
- I can tolerate it
- I dislike it

---

## Kano Classification Matrix

| Dysfunctional → | Dislike | Tolerate | Neutral | Expect | Like |
|---|---|---|---|---|---|
| **Functional ↓** | | | | | |
| **Like** | Q (Questionable) | D (Delighter) | D | D | P (Performance) |
| **Expect** | R (Reverse) | I (Indifferent) | I | I | M (Must-Have) |
| **Neutral** | R | I | I | I | M |
| **Tolerate** | R | I | I | I | M |
| **Dislike** | R | R | R | R | Q |

---

## Analysis Results

| # | Feature | Category | Satisfaction if present | Dissatisfaction if absent | Priority |
|---|---|---|---|---|---|
| 1 | [Feature] | Must-Have / Performance / Delighter / Indifferent | +[score] | -[score] | |
| 2 | [Feature] | | | | |
| 3 | [Feature] | | | | |

**Satisfaction coefficient:** (Like + Expect) / (Like + Expect + Neutral + Dislike)
**Dissatisfaction coefficient:** (Expect + Dislike) / (Like + Expect + Neutral + Dislike) × -1

---

## Prioritisation Output

### Must-Have — Fix or ship immediately
> These features cause active dissatisfaction if absent. No amount of Delighters compensates for missing Must-Haves.
- [Feature]
- [Feature]

### Performance — Invest proportionally to competitive gap
> Features where being better than alternatives directly converts to more satisfaction and willingness to pay.
- [Feature] — currently [X% behind / ahead of] competitors
- [Feature]

### Delighters — Ship one per quarter to drive word-of-mouth
> These create moments that get talked about. One well-chosen Delighter does more for NPS than 10 Performance improvements.
- [Feature]

### Indifferent — Deprioritise or delete
> Engineering time spent here is wasted.
- [Feature]

---

## Strategic Implications

| Finding | Action |
|---|---|
| [Key insight from Kano analysis] | [What to build, kill, or reframe] |
`,
    howToUse: [
      {
        step: "Survey at least 20 customers per segment",
        detail:
          "Kano analysis is statistical — you need enough responses to see clear patterns. 20 is the minimum; 50+ gives you confidence to make major investment decisions based on the results.",
      },
      {
        step: "Fix Must-Haves before shipping Delighters",
        detail:
          "A product with missing Must-Haves cannot be saved by exciting new features. If customers expect something and it's absent, no amount of delight compensates. Run the Kano analysis before your next sprint to check you're not building on a cracked foundation.",
      },
      {
        step: "Use Delighters strategically — one per quarter",
        detail:
          "Delighters are most powerful when rare and surprising. A product that constantly surprises users builds cult followings. One unexpected feature per quarter is more memorable than 10 incremental improvements.",
      },
      {
        step: "Re-run the analysis annually",
        detail:
          "Delighters become Must-Haves over time as customer expectations rise. A feature that delighted users in 2022 (e.g. dark mode) is expected today. Run the Kano analysis annually to watch features move between categories.",
      },
    ],
    faqs: [
      {
        q: "Do I need a formal survey to use the Kano Model?",
        a: "A formal Kano survey is most rigorous, but you can do a lightweight version in customer interviews by asking the functional/dysfunctional question pair verbally. This gives you directional insight without needing statistical significance. For high-stakes prioritisation decisions, invest in the full survey.",
      },
      {
        q: "What's the difference between Performance and Delighter features?",
        a: "Performance features are expected in your category — customers know they want them, and more is always better (faster search, more integrations, higher accuracy). Delighters are unexpected — customers didn't ask for them and would be fine without them, but they produce disproportionate positive emotion when present.",
      },
      {
        q: "How does the Kano Model compare to RICE scoring?",
        a: "RICE scores features by business impact (Reach, Impact, Confidence, Effort). Kano scores them by how they affect customer satisfaction. They're complementary: use Kano to understand whether a feature is table-stakes (Must-Have), a differentiator (Performance), or a loyalty driver (Delighter), then use RICE to prioritise within each category.",
      },
      {
        q: "Can I use the Kano Model for enterprise products?",
        a: "Yes, but segment by role. What's a Delighter for an end-user might be a Must-Have for an IT admin (e.g. SSO, audit logs). Survey both buyers and users separately and build your priority list with both in mind.",
      },
    ],
  },

  // ─── 19. Stakeholder Map ──────────────────────────────────────────────────,

  {
    slug: "stakeholder-map",
    title: "Stakeholder Map Template",
    shortTitle: "Stakeholder Map",
    category: "Planning",
    description:
      "A stakeholder mapping template for PMs covering influence vs. interest analysis, stakeholder profiles, communication plan, and resistance management.",
    metaDescription:
      "Free stakeholder map template for product managers. Influence/interest matrix, stakeholder profiles, communication plan, and resistance strategies. No signup required.",
    filename: "stakeholder-map-template.md",
    content: `# Stakeholder Map

**Initiative:** [Feature / Project / Strategic Decision]
**PM:** [Name]
**Date:** [Date]

---

## Why Stakeholder Mapping Matters

Products fail not because of bad engineering — they fail because the wrong people were surprised, ignored, or excluded. Map your stakeholders before you write a single requirement.

---

## Step 1: Identify All Stakeholders

List everyone who is affected by, has influence over, or has a stake in this initiative.

| Name | Role / Team | Relationship to Initiative |
|---|---|---|
| [Name] | [VP Product] | [Approves scope and timeline] |
| [Name] | [Engineering Lead] | [Owns technical feasibility] |
| [Name] | [Sales] | [Affected by launch timing and messaging] |
| [Name] | [Legal / Compliance] | [Must sign off on data handling] |
| [Name] | [Customer Success] | [Trains customers post-launch] |
| [Name] | [CEO / Founder] | [Strategic sponsor] |

---

## Step 2: Influence × Interest Matrix

Place each stakeholder in one of four quadrants:

\`\`\`
High Influence │
               │  [Name]              [Name]
               │  Manage Closely      Keep Satisfied
               │
    ───────────┼───────────────────────────────────
               │
               │  [Name]              [Name]
               │  Monitor             Keep Informed
               │
Low Influence  │
               └───────────────────────────────────
              Low Interest                High Interest
\`\`\`

| Quadrant | Strategy |
|---|---|
| High Influence + High Interest | Manage closely — involve in decisions, get early buy-in |
| High Influence + Low Interest | Keep satisfied — brief regularly, don't overwhelm |
| Low Influence + High Interest | Keep informed — share updates, they're advocates |
| Low Influence + Low Interest | Monitor — minimal effort, inform at milestones |

---

## Step 3: Stakeholder Profiles

### [Stakeholder Name]

| | |
|---|---|
| **Role** | [Title and team] |
| **Quadrant** | [Manage Closely / Keep Satisfied / Keep Informed / Monitor] |
| **Primary concern** | [What matters most to them about this initiative] |
| **Success looks like (to them)** | [Their definition of a win] |
| **Potential objections** | [What they might push back on] |
| **Preferred communication** | [Async/sync, frequency, channel] |
| **Decision power** | [Can block / can approve / advisory only] |

---

### [Stakeholder Name]

| | |
|---|---|
| **Role** | |
| **Quadrant** | |
| **Primary concern** | |
| **Success looks like** | |
| **Potential objections** | |
| **Preferred communication** | |
| **Decision power** | |

---

## Step 4: Communication Plan

| Stakeholder | What to share | When | Channel | Owner |
|---|---|---|---|---|
| [Name] | [Weekly status: blockers, decisions needed] | Weekly | Slack DM | PM |
| [Name] | [Milestone updates: brief at start and end] | Monthly | Email | PM |
| [Name] | [Demo at each major milestone] | Bi-weekly | Sync meeting | PM |

---

## Step 5: Resistance Management

| Stakeholder | Expected resistance | Root cause | Mitigation strategy |
|---|---|---|---|
| [Name] | [They want to delay launch for more testing] | [Risk aversion / past incident] | [Show evidence from beta + define rollback plan] |
| [Name] | [They want to add scope] | [Different success criteria] | [Align on shared OKR; scope additions go to next quarter] |

---

## Alignment Checklist

- [ ] All "Manage Closely" stakeholders have reviewed the brief or PRD
- [ ] All blockers identified and assigned an owner
- [ ] Communication cadence agreed with key stakeholders
- [ ] No stakeholder will be surprised by anything at launch
`,
    howToUse: [
      {
        step: "Map stakeholders at the start of every significant initiative",
        detail:
          "The stakeholder map should be the first document you create, before the PRD. Discovering a key stakeholder late — after scope is locked — is the most common cause of launch delays and expensive rework.",
      },
      {
        step: "Separate influence from interest",
        detail:
          "The most dangerous stakeholder is high influence with low interest — they can block your initiative without following it closely enough to understand the context. Invest in keeping them informed proactively before they hear about it from someone else.",
      },
      {
        step: "Profile each 'Manage Closely' stakeholder individually",
        detail:
          "Knowing a stakeholder's definition of success and likely objections before your first meeting changes the conversation entirely. You can address objections before they become blockers.",
      },
      {
        step: "Update the map as the project evolves",
        detail:
          "Stakeholder maps go stale. People change roles, new executives join, and the scope of an initiative can pull in new stakeholders mid-project. Review the map at every major milestone.",
      },
    ],
    faqs: [
      {
        q: "How is a stakeholder map different from a RACI chart?",
        a: "A RACI chart (Responsible, Accountable, Consulted, Informed) assigns process roles to stakeholders for specific decisions or tasks. A stakeholder map is broader — it analyses influence, interest, motivations, and communication needs. Build the stakeholder map first to understand the political landscape, then use RACI to organise execution.",
      },
      {
        q: "Should I share the stakeholder map with stakeholders?",
        a: "Share the communication plan section — stakeholders appreciate knowing when and how they'll hear from you. Keep the Resistance Management section and the Influence/Interest matrix internal. Telling a VP they're in the 'Low Interest' quadrant or that you've pre-planned a strategy to overcome their objections is rarely well-received.",
      },
      {
        q: "What do I do with a stakeholder who is blocking progress?",
        a: "First understand their root cause — is it risk aversion, competing priorities, or different success criteria? Then address it directly in a 1:1 before escalating. Most blockers resolve when the stakeholder feels heard and sees evidence their concern is being taken seriously. If a blocker persists, escalate to your shared manager with a clear ask.",
      },
      {
        q: "How many stakeholders are too many?",
        a: "If you have more than 5 stakeholders in the 'Manage Closely' quadrant, the initiative may be too large or the team's decision rights may be unclear. Consider whether the scope can be reduced, whether decision rights can be delegated, or whether a steering committee structure would help manage the complexity.",
      },
    ],
  },

  // ─── 20. A/B Test Plan ────────────────────────────────────────────────────,

  {
    slug: "rice-scoring",
    title: "RICE Scoring Template",
    shortTitle: "RICE Scoring",
    category: "Planning",
    description:
      "A ready-to-use RICE scoring template for feature prioritization. Score your backlog by Reach, Impact, Confidence, and Effort — and let the numbers drive roadmap decisions.",
    metaDescription:
      "Free RICE scoring template for product managers. Score features by Reach, Impact, Confidence, and Effort. Download and use in minutes.",
    filename: "rice-scoring-template.md",
    content: `# RICE Scoring Template

**Product / Feature Area:** [Name]
**Scoring Date:** [Date]
**Scored By:** [PM Name]
**Quarter / Cycle:** [Q2 2026]

---

## RICE Formula

> **RICE Score = (Reach × Impact × Confidence) ÷ Effort**

| Factor | Definition | Scale |
|---|---|---|
| **Reach** | How many users/customers will this affect per quarter? | Number (e.g., 500 users/quarter) |
| **Impact** | How much will it move the metric per user? | 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal |
| **Confidence** | How sure are you in your estimates? | 100% = high, 80% = medium, 50% = low |
| **Effort** | Total person-months across all team members | 0.5 = 1 week, 1 = 1 month, 2 = 2 months, etc. |

---

## Feature Scoring Table

| Feature / Initiative | Reach | Impact | Confidence | Effort | **RICE Score** | Priority |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**RICE Score formula:** =(Reach * Impact * Confidence%) / Effort

---

## Worked Example

| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| Bulk CSV export | 800 | 1 | 80% | 0.5 | **(800 × 1 × 0.8) / 0.5 = 1,280** |
| SSO / SAML login | 200 | 3 | 80% | 2 | **(200 × 3 × 0.8) / 2 = 240** |
| Slack notifications | 1,200 | 0.5 | 100% | 0.5 | **(1,200 × 0.5 × 1.0) / 0.5 = 1,200** |
| AI summary widget | 400 | 2 | 50% | 3 | **(400 × 2 × 0.5) / 3 = 133** |

**Ranked:** Bulk CSV export (1,280) → Slack notifications (1,200) → SSO (240) → AI widget (133)

---

## Notes / Assumptions

For each feature, document the key assumptions behind your estimates:

| Feature | Key Assumptions |
|---|---|
| | |
| | |

---

## Decision Log

After scoring, record which items you're committing to and why:

| Decision | Rationale |
|---|---|
| Shipping [Feature X] in Q2 | RICE = 1,280; low effort, high reach. Unblocks enterprise sales. |
| Deferring [Feature Y] | RICE = 133; low confidence in impact estimate. Revisit after user research. |
| Descoping [Feature Z] | RICE below threshold; stakeholder request, not user need. |

---

## RICE Threshold

> Set a threshold score and stick to it. Items below the threshold go to the backlog unless a strategic override is documented.

**This cycle's threshold:** ___

Items above threshold: ___
Items below threshold: ___`,
    howToUse: [
      {
        step: "Gather your candidate features",
        detail:
          "List every initiative you're considering for the quarter — new features, improvements, bugs, and tech debt. Include everything before scoring anything. Incomplete lists produce biased rankings.",
      },
      {
        step: "Score each feature by factor",
        detail:
          "Fill in Reach (user count), Impact (1–3 scale), Confidence (%), and Effort (person-months). Be consistent: always estimate Reach over the same time horizon (usually per quarter). Score independently before discussing as a team.",
      },
      {
        step: "Calculate and rank",
        detail:
          "Apply the formula: (Reach × Impact × Confidence%) ÷ Effort. Sort descending. The top of the list is your starting roadmap. Don't adjust scores retroactively to justify a predetermined answer.",
      },
      {
        step: "Document assumptions and overrides",
        detail:
          "Every score is only as good as its assumptions. Write down what you assumed for Reach and Impact. If you override a low-scoring item for strategic reasons, document why — it creates a paper trail and forces honest tradeoffs.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between RICE and ICE scoring?",
        a: "ICE (Impact × Confidence × Ease) skips the Reach factor, treating every feature as if it affects the same number of users. RICE adds Reach explicitly, which makes it better for products with variable audience sizes. For growth experiments where all features target the full user base, ICE is simpler and equally valid.",
      },
      {
        q: "How do I estimate Reach accurately?",
        a: "Reach = number of users affected per quarter if the feature ships. Use analytics to find the relevant cohort (e.g., 'users who upload files' = 800/quarter). If you don't have data, use 50% confidence. Never use 'all users' unless every active user genuinely hits the feature.",
      },
      {
        q: "Should engineering estimate Effort or should PM do it?",
        a: "Engineering estimates Effort. PMs estimate Reach, Impact, and Confidence. Mixing these responsibilities creates systematically biased scores — PMs tend to underestimate effort when it's their pet feature, and over-estimate impact on low-confidence bets.",
      },
      {
        q: "When should I NOT use RICE scoring?",
        a: "RICE doesn't work well for: (1) qualitative bets that are hard to quantify (brand, morale, technical foundation), (2) items with strong regulatory or compliance drivers, (3) very early-stage products where you have < 100 users and most estimates are noise. Use it when you have enough data to make the numbers meaningful.",
      },
    ],
  },

  // ─── 23. MoSCoW Method Template ─────────────────────────────────────────────,

  {
    slug: "moscow-method",
    title: "MoSCoW Prioritization Template",
    shortTitle: "MoSCoW Method",
    category: "Planning",
    description:
      "A MoSCoW prioritization template for sprint planning, release scoping, and stakeholder alignment. Classify features into Must Have, Should Have, Could Have, and Won't Have — and defend the line.",
    metaDescription:
      "Free MoSCoW prioritization template for product managers. Classify features into Must / Should / Could / Won't Have. Download and use today.",
    filename: "moscow-prioritization-template.md",
    content: `# MoSCoW Prioritization Template

**Product / Release:** [Name]
**Date:** [Date]
**PM:** [Name]
**Stakeholders:** [Engineering, Design, QA, Sales, Leadership]

---

## MoSCoW Framework

| Category | Definition | % of Release Scope |
|---|---|---|
| **Must Have** | Non-negotiable. Release fails without it. | ~60% |
| **Should Have** | Important, but workaround exists. Include if possible. | ~20% |
| **Could Have** | Nice to have. Include only if time and scope allow. | ~20% |
| **Won't Have (this time)** | Explicitly deferred. Not in scope for this release. | — |

---

## Must Have

> The release is not shippable without these. Failure to deliver = failed release.

| # | Feature / Requirement | Rationale | Owner |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## Should Have

> Significant value. Should be included if team capacity allows. Has a workaround if cut.

| # | Feature / Requirement | Rationale | Workaround if Cut |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## Could Have

> Minor improvements, polish, or low-effort wins. Include if scope remains within budget.

| # | Feature / Requirement | Notes |
|---|---|---|
| 1 | | |
| 2 | | |

---

## Won't Have (This Release)

> Explicitly out of scope. Document here to prevent scope creep.

| # | Feature / Requirement | Why Deferred | Target Release |
|---|---|---|---|
| 1 | | | |
| 2 | | | |

---

## Release Scope Summary

| Category | Count | Estimated Effort (person-days) |
|---|---|---|
| Must Have | | |
| Should Have | | |
| Could Have | | |
| **Total in scope** | | |

---

## Stakeholder Sign-Off

Confirm that all stakeholders agree on the Must Have list before development begins.

| Stakeholder | Role | Agreed? | Notes |
|---|---|---|---|
| | Engineering Lead | | |
| | Design Lead | | |
| | QA Lead | | |
| | Sales / Customer Success | | |
| | Leadership | | |

---

## Cut Decisions Log

When scope is cut during the sprint, document the decision here:

| Item Cut | Category | Reason | Moved to |
|---|---|---|---|
| | | | Next sprint / Backlog / Cancelled |`,
    howToUse: [
      {
        step: "Define the release boundary first",
        detail:
          "Before scoring anything, agree on the release goal (e.g., 'v2.0 targeting enterprise buyers by April 30'). MoSCoW only works when there's a fixed deadline and a constraint — without that, everything becomes Must Have.",
      },
      {
        step: "Fill Must Haves with engineering present",
        detail:
          "PMs define what is non-negotiable from a product standpoint; engineering confirms what is technically feasible in the timeframe. Must Haves should represent roughly 60% of estimated capacity — any more and you have no buffer.",
      },
      {
        step: "Explicitly document Won't Haves",
        detail:
          "This is the most underused part of MoSCoW. Write down what you are not building and why. This prevents stakeholders from reintroducing deferred items mid-sprint and gives you a clear record for the next planning cycle.",
      },
      {
        step: "Get sign-off on the Must Have list",
        detail:
          "Before development starts, every key stakeholder should explicitly agree that the Must Have list is correct. Disputes about priorities surface here — not in week 3 of a sprint when it's too late to replan.",
      },
    ],
    faqs: [
      {
        q: "How is MoSCoW different from RICE scoring?",
        a: "RICE gives you a quantitative rank-order of all features. MoSCoW gives you a categorical commitment for a specific release. They're complementary: use RICE to rank your backlog, then use MoSCoW to scope a specific sprint or release from the top of that ranked list.",
      },
      {
        q: "What if stakeholders say everything is a Must Have?",
        a: "That means the release is under-scoped or over-constrained. Facilitate the tradeoff explicitly: 'If everything is Must Have, what's the minimum we can ship and still call it a release?' Force the team to rank Must Haves — the bottom of that list is actually Should Have.",
      },
      {
        q: "Should Could Haves ever make it into a release?",
        a: "Yes — that's their purpose. If the team delivers Must Haves and Should Haves ahead of schedule, Could Haves get pulled in. They're a buffer that keeps developers productive without committing to scope that might not fit.",
      },
      {
        q: "How detailed should each item in the list be?",
        a: "Detailed enough that engineering can estimate it and QA can test it. 'Improve performance' is too vague — 'reduce API response time for search endpoint from 800ms to under 300ms' is a Must Have. Vague entries belong in the backlog, not in a MoSCoW matrix.",
      },
    ],
  },

  // ─── 24. Spec-to-Django ──────────────────────────────────────────────────────

  // ─── 48. Decision Log ────────────────────────────────────────────────────
  {
    slug: "decision-log",
    title: "Decision Log Template",
    shortTitle: "Decision Log",
    category: "Planning",
    description:
      "A running log of product decisions — what was decided, why, who approved it, and what alternatives were considered. Prevents re-litigation of closed debates and builds institutional memory.",
    metaDescription:
      "Free decision log template for product managers. Record product decisions with rationale, alternatives considered, and approval. Prevents rework and builds team alignment. Copy-paste ready.",
    filename: "decision-log.md",
    content: `# Decision Log

**Product / Feature:** [Product or initiative name]
**PM Owner:** [Name]
**Last Updated:** [Date]

---

## How to Use This Log

Add a new entry every time a non-trivial decision is made — one that would cause confusion or re-litigation if forgotten. Include decisions that were overruled or reversed (those are the most important ones to document).

---

## Decision Entries

---

### Decision #001

**Date:** [Date]
**Status:** [ ] Open · [ ] Decided · [ ] Reversed

**Decision:** [One sentence — what was decided]

**Context:**
> [1–3 sentences: the situation that required a decision. What was the background?]

**Options Considered:**

| Option | Pros | Cons |
|---|---|---|
| **Option A** — [Label] | [Pros] | [Cons] |
| **Option B** — [Label] | [Pros] | [Cons] |
| **Option C** — [Label, if applicable] | [Pros] | [Cons] |

**Decision Rationale:**
> [Why this option was chosen. What was the deciding factor? What was explicitly accepted or traded off?]

**Approved By:** [Name(s) + role]
**Stakeholders Informed:** [Who was told and how]

**Constraints / Assumptions:**
- [e.g. "Assumes backend migration is complete by Q3"]
- [e.g. "Valid only if usage stays under 10K requests/day"]

**Reversal Criteria:** [What would cause you to revisit this? e.g. "If error rate exceeds 1% in first 30 days"]

---

### Decision #002

**Date:** [Date]
**Status:** [ ] Open · [ ] Decided · [ ] Reversed

**Decision:** [One sentence]

**Context:**
> [Background]

**Options Considered:**

| Option | Pros | Cons |
|---|---|---|
| **Option A** — [Label] | | |
| **Option B** — [Label] | | |

**Decision Rationale:**
> [Why this option]

**Approved By:** [Name + role]
**Stakeholders Informed:** [Names]

**Constraints / Assumptions:**
- [Assumption 1]

**Reversal Criteria:** [Trigger to revisit]

---

### Decision #003

**Date:** [Date]
**Status:** [ ] Open · [ ] Decided · [ ] Reversed

**Decision:** [One sentence]

**Context:**
> [Background]

**Options Considered:**

| Option | Pros | Cons |
|---|---|---|
| **Option A** | | |
| **Option B** | | |

**Decision Rationale:**
> [Rationale]

**Approved By:** [Name]
**Stakeholders Informed:** [Names]

**Reversal Criteria:** [Trigger]

---

## Reversed Decisions

> Move entries here when a decision is overturned. Include a note on why it was reversed.

| # | Original Decision | Reversed On | Reason for Reversal |
|---|---|---|---|
| #00X | [What was decided] | [Date] | [Why it changed] |

---

## Open Decisions (Parking Lot)

> Questions that need a decision but haven't been resolved yet.

| # | Question | Owner | Due |
|---|---|---|---|
| | [e.g. "Should we build the export feature in v1 or v1.1?"] | | |
| | | | |
`,
    howToUse: [
      {
        step: "Add an entry at the moment the decision is made",
        detail:
          "The decision log decays fast if you try to backfill it. The best time to write an entry is within 24 hours of the decision being made. Pull in the meeting notes or Slack thread and distill it into the template. 10 minutes now saves 2 hours of archaeology later.",
      },
      {
        step: "Write the decision as a single declarative sentence",
        detail:
          "Not 'we discussed the modal approach' — 'we will use a slide-out panel instead of a modal for the insight detail view'. The test: could a new team member read this in 6 months and know exactly what was decided without asking anyone?",
      },
      {
        step: "Always record the alternatives",
        detail:
          "The alternatives section is the most important part. If you only record what was decided, you'll re-open the same debate in 3 months. Recording what was *not* chosen and why is what closes debates permanently.",
      },
      {
        step: "Set reversal criteria upfront",
        detail:
          "For every decision, ask: what signal would make us change our minds? If it's 'error rate > 1%' or 'three enterprise customers request this' — write it down. This makes revisiting decisions feel principled, not political.",
      },
      {
        step: "Link the decision log to your PRD or epic",
        detail:
          "Add a 'Decision Log' section in your PRD that links to the relevant entries. Engineers and designers should know where to look when they're unsure why something was built a certain way. The log is only useful if people can find it.",
      },
    ],
    faqs: [
      {
        q: "How is this different from meeting notes?",
        a: "Meeting notes capture what was discussed. The decision log captures what was decided. Most meetings discuss many things and decide few. The log distills the outcome, the rationale, and the alternatives — in a format designed to be read in 30 seconds, not 30 minutes.",
      },
      {
        q: "How granular should entries be?",
        a: "Log decisions that, if forgotten or reversed without context, would cause confusion, rework, or conflict. 'We'll use UTC timestamps everywhere' is worth logging. 'We'll use a 14px font in the tooltip' is probably not. A good rule: if someone will ask 'why did we do it this way?' in 6 months, log it.",
      },
      {
        q: "What about decisions made in Slack?",
        a: "Slack is where decisions get made; the log is where they get recorded. Copy the key message thread into the context section, summarize it into one sentence, and add it to the log. Don't rely on search — Slack threads get buried and context is lost.",
      },
      {
        q: "Should every team member maintain this log, or just the PM?",
        a: "The PM owns the log, but anyone can add entries. Eng leads often make technical decisions that the PM needs to know about (e.g. 'we'll use a background job instead of synchronous processing'). Make the log collaborative — shared doc, Notion page, or section of the PRD.",
      },
      {
        q: "What happens when a decision is reversed?",
        a: "Don't delete the original entry. Move it to the 'Reversed Decisions' section and add a note explaining why it changed. Seeing a reversal is itself valuable context — it tells the team that the issue was properly considered twice, and under what conditions the team changed direction.",
      },
    ],
  },

  // ─── 51. Risk Register for PMs ───────────────────────────────────────────
  {
    slug: "risk-register",
    title: "Risk Register for PMs",
    shortTitle: "Risk Register",
    category: "Planning",
    description:
      "A product risk register that identifies, scores, and tracks mitigation plans for the key risks that could cause a feature or launch to miss its goals — from technical debt to user adoption.",
    metaDescription:
      "Free risk register template for product managers. Identify, score, and mitigate launch and product risks before they become incidents. Probability × impact scoring included. Copy-paste ready.",
    filename: "risk-register.md",
    content: `# Risk Register

**Product / Feature:** [Feature or initiative name]
**PM Owner:** [Name]
**Date Created:** [Date]
**Last Reviewed:** [Date]
**Review Cadence:** [ ] Weekly during build · [ ] Bi-weekly · [ ] Per sprint

---

## How to Score Risks

Use a **Probability × Impact** score (1–5 each) to prioritize:

| Score | Probability | Impact |
|---|---|---|
| 1 | Unlikely — < 10% chance | Trivial — cosmetic, no user impact |
| 2 | Possible — 10–30% | Minor — affects < 5% of users |
| 3 | Likely — 30–60% | Moderate — delays launch or affects core flow |
| 4 | Very likely — 60–85% | Significant — affects majority of users or revenue |
| 5 | Near-certain — > 85% | Critical — launch blocker or major incident |

**Risk Score = Probability × Impact**
- 1–6: Low (monitor)
- 7–12: Medium (active mitigation needed)
- 13–25: High (escalate, assign owner, weekly review)

---

## Risk Register

| # | Risk | Category | Probability | Impact | Score | Status | Owner | Mitigation | Due |
|---|---|---|---|---|---|---|---|---|---|
| R-01 | [Risk description] | [Category] | [1–5] | [1–5] | [P×I] | Open | [Name] | [Mitigation plan] | [Date] |
| R-02 | | | | | | | | | |
| R-03 | | | | | | | | | |

**Status options:** Open · In Mitigation · Mitigated · Accepted · Closed

---

## Risk Detail Entries

### R-01 — [Risk Title]

**Risk:** [Full description of what could go wrong]
**Category:** [ ] Technical · [ ] User Adoption · [ ] Dependencies · [ ] Compliance · [ ] Resource · [ ] Market
**Probability:** [1–5] — [Justification]
**Impact:** [1–5] — [Justification]
**Risk Score:** [P × I]
**Status:** Open / In Mitigation / Mitigated / Accepted

**Root Cause:**
> [Why might this happen? What's the underlying driver?]

**Impact if it occurs:**
> [What happens to users, launch timeline, or business metrics?]

**Mitigation Plan:**
- [ ] [Action 1 — e.g. "Run load test at 2× expected traffic before launch"]
- [ ] [Action 2 — e.g. "Get legal sign-off on data retention policy by [date]"]
- [ ] [Action 3]

**Contingency (if mitigation fails):**
> [What's the backup plan? e.g. "Roll back to v1 behind feature flag; communicate to customers within 2h"]

**Owner:** [Name]
**Review Date:** [Date]

---

### R-02 — [Risk Title]

**Risk:** [Description]
**Category:** [ ] Technical · [ ] User Adoption · [ ] Dependencies · [ ] Compliance · [ ] Resource · [ ] Market
**Probability:** [1–5]
**Impact:** [1–5]
**Risk Score:** [P × I]
**Status:** Open

**Root Cause:**
> [Why might this happen?]

**Impact if it occurs:**
> [What breaks or regresses?]

**Mitigation Plan:**
- [ ] [Action 1]
- [ ] [Action 2]

**Contingency:**
> [Backup plan]

**Owner:** [Name]
**Review Date:** [Date]

---

## Common Risk Categories (Reference)

### Technical Risks
- Third-party API instability or rate limits
- Database migration complexity
- Performance at scale (load, latency)
- Security vulnerabilities in new endpoints
- Mobile/browser compatibility edge cases

### User Adoption Risks
- Feature too complex to discover without onboarding
- Change disrupts existing workflow (negative habituation)
- Feature solves a problem users don't know they have

### Dependency Risks
- Another team's deliverable is on the critical path
- External vendor contract or timeline
- Design assets not finalized before engineering freeze

### Compliance / Legal Risks
- Data residency or GDPR requirements
- New endpoint exposes PII
- Pricing or billing change requires terms update

### Resource Risks
- Key engineer on leave during launch window
- QA bandwidth insufficient for test coverage
- PM bandwidth split across too many initiatives

---

## Risk Review Log

| Date | Risks Reviewed | Changes Made | Next Review |
|---|---|---|---|
| [Date] | R-01, R-02 | [e.g. "R-01 score reduced after load test passed"] | [Date] |
`,
    howToUse: [
      {
        step: "Create the register at project kickoff, not at launch minus one week",
        detail:
          "A risk register built the week before launch is a list of fires, not a plan. Build it when you write the PRD. Most risks are predictable from the technical design, the dependencies, and the user behavior — you don't need hindsight to spot them.",
      },
      {
        step: "Score probability and impact separately",
        detail:
          "Teams tend to conflate high-impact with high-risk. A catastrophic edge case with 2% probability is a medium risk; a moderate issue that's near-certain is high risk. Scoring them separately forces you to think about both dimensions and avoids over-investing in low-probability scenarios.",
      },
      {
        step: "Assign an owner to every risk above medium",
        detail:
          "Unowned risks don't get mitigated — they get re-discussed in the post-mortem. Every risk with a score ≥ 7 needs a named owner with a due date. The owner doesn't have to mitigate it alone, but they're accountable for tracking it.",
      },
      {
        step: "Write the contingency before the mitigation",
        detail:
          "If mitigation fails, what do you do? Writing the contingency first removes optimism bias — it forces you to acknowledge the mitigation might not work. A launch without a rollback plan is a launch without a risk register.",
      },
      {
        step: "Review at each sprint boundary, not just at launch",
        detail:
          "Risk scores change as the build progresses. A technical risk may be resolved after a successful spike; a dependency risk may increase when a partner slips. A stale register is worse than no register — it creates false confidence.",
      },
    ],
    faqs: [
      {
        q: "How many risks should a typical feature have?",
        a: "A small feature typically has 3–7 risks; a major launch or cross-team initiative typically has 10–20. If you have fewer than 3, you probably haven't thought hard enough. If you have more than 25, you may be logging implementation tasks as risks — risks are things that could cause the goal to fail, not a task list.",
      },
      {
        q: "What's the difference between a risk and an issue?",
        a: "A risk is something that might happen. An issue is something that has already happened and needs to be resolved. Move a risk to 'Closed' and open a separate issue tracker item when a risk materializes. The risk register is forward-looking; the issue tracker is reactive.",
      },
      {
        q: "Should I include market or competitive risks?",
        a: "Yes, if they're specific and actionable. 'A competitor might launch something similar' is too vague. 'Competitor X announced a competing feature at their conference last month — they may ship before our launch window' is a real risk with a probability and a mitigation (accelerate timeline, differentiate positioning).",
      },
      {
        q: "When do I 'Accept' a risk vs. 'Mitigate' it?",
        a: "Accept a risk when the cost of mitigation exceeds the expected cost of the risk occurring, or when mitigation is simply not feasible. Document the acceptance rationale — 'we accept R-04 because the affected segment is < 1% of users and the mitigation would require a 3-week delay' is a defensible position. 'We didn't get to it' is not.",
      },
      {
        q: "Who should review the risk register besides the PM?",
        a: "At minimum: the tech lead (for technical risk accuracy), the QA lead (for coverage gaps), and the stakeholder who owns launch go/no-go. For regulated industries or enterprise features, add legal/compliance. The register is only useful as a shared artifact — a PM's private spreadsheet doesn't create accountability.",
      },
    ],
  },
];