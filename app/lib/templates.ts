export interface Template {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  metaDescription: string;
  filename: string;
  content: string;
  howToUse: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
}


export const TEMPLATES: Template[] = [
  {
    slug: "prd-template",
    title: "PRD Template",
    shortTitle: "PRD",
    category: "Technical Execution",
    description:
      "A complete product requirements document template covering problem statement, user stories, functional requirements, success metrics, and launch timeline.",
    metaDescription:
      "Free PRD template for product managers. Covers problem statement, user stories, requirements, success metrics, and timeline. Copy-paste ready.",
    filename: "prd-template.md",
    content: `# Product Requirements Document (PRD)

**Product:** [Product or Feature Name]
**Author:** [Your Name]
**Status:** Draft / In Review / Approved
**Last Updated:** [Date]
**Version:** 1.0

---

## 1. Problem Statement

> What problem are we solving, and for whom?

[Describe the core problem in 2–4 sentences. Include who experiences this problem, how often, and what the current workaround is.]

**Customer evidence:** [Link to interviews, tickets, or survey data]

---

## 2. Goals & Non-Goals

### Goals
- [ ] [Primary outcome — what success looks like for the user]
- [ ] [Secondary outcome — what success looks like for the business]
- [ ] [Measurable target, e.g. "reduce time-to-complete by 30%"]

### Non-Goals (explicitly out of scope)
- [What we are NOT building in this version]
- [Edge case or user type we are deliberately excluding]

---

## 3. Background & Context

[Optional: market context, previous attempts, regulatory drivers, or strategic rationale. Keep it to 1–2 paragraphs.]

---

## 4. User Stories

| As a… | I want to… | So that… |
|---|---|---|
| [persona] | [action] | [benefit] |
| [persona] | [action] | [benefit] |
| [persona] | [action] | [benefit] |

---

## 5. Functional Requirements

### Must Have (P0)
- [ ] **[Requirement ID] [Requirement Name]:** [Description of what the system must do]
- [ ] **[Requirement ID] [Requirement Name]:** [Description]

### Should Have (P1)
- [ ] **[Requirement ID] [Requirement Name]:** [Description]

### Nice to Have (P2)
- [ ] **[Requirement ID] [Requirement Name]:** [Description]

---

## 6. UX & Design Requirements

- [Key UX constraint or principle, e.g. "must work on mobile browsers"]
- [Accessibility requirement, e.g. "meets WCAG 2.1 AA"]
- [Link to design files, Figma, or wireframes]

---

## 7. Technical Requirements & Constraints

- [API dependency or third-party service]
- [Performance target, e.g. "page loads in < 2s on 4G"]
- [Data or security constraint]

---

## 8. Success Metrics

| Metric | Baseline | Target | Measurement Method |
|---|---|---|---|
| [Primary metric] | [Current] | [Goal] | [How to measure] |
| [Secondary metric] | [Current] | [Goal] | [How to measure] |

**Review date:** [Date to review metrics after launch]

---

## 9. Timeline & Milestones

| Milestone | Owner | Date |
|---|---|---|
| Design complete | [Name] | [Date] |
| Engineering kickoff | [Name] | [Date] |
| Internal beta | [Name] | [Date] |
| Launch | [Name] | [Date] |

---

## 10. Open Questions

- [ ] [Question that needs resolution before development begins]
- [ ] [Dependency that needs clarification]

---

## 11. Appendix

- [Link to user research]
- [Link to competitive analysis]
- [Link to data / analytics]
`,
    howToUse: [
      {
        step: "Start with the problem",
        detail:
          "Fill in Section 1 first. A crisp problem statement anchors everything else and prevents scope creep.",
      },
      {
        step: "Define non-goals explicitly",
        detail:
          "Listing what you are not building is as important as listing what you are. It prevents misaligned expectations with engineering.",
      },
      {
        step: "Write user stories before requirements",
        detail:
          "User stories force you to think from the customer's perspective. Requirements often follow naturally once the stories are clear.",
      },
      {
        step: "Set measurable success metrics",
        detail:
          "Every PRD should answer 'how will we know if this worked?' before a line of code is written.",
      },
    ],
    faqs: [
      {
        q: "How long should a PRD be?",
        a: "Long enough to be unambiguous, short enough to be read. For most features, 2–5 pages is right. For large platform bets, 8–12 pages is reasonable. If it's longer than 15 pages, split it into smaller pieces.",
      },
      {
        q: "What's the difference between a PRD, BRD, and MRD?",
        a: "An MRD (Market Requirements Document) describes the market problem and opportunity — written by product or marketing. A BRD (Business Requirements Document) captures what the business needs — common in enterprise IT. A PRD describes what the product should do — written by the PM. In most startups and tech companies, the PRD is the only document that matters.",
      },
      {
        q: "Should engineering be involved before the PRD is written?",
        a: "Yes. The best PRDs are written in collaboration with an engineering lead. Their early input on feasibility and constraints makes the requirements more realistic and avoids late rewrites.",
      },
      {
        q: "Do I need a PRD for small features?",
        a: "For very small changes (< 1 sprint, low risk), a well-written Jira or Linear ticket with acceptance criteria is often enough. Reserve the full PRD format for features that span multiple teams, involve significant user journey changes, or carry high ambiguity.",
      },
    ],
  },
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
    slug: "buyer-persona-template",
    title: "Buyer Persona Template",
    shortTitle: "Persona",
    category: "Research",
    description:
      "A detailed buyer persona template covering demographics, goals, frustrations, buying behavior, tools, and messaging — built for product managers and marketers.",
    metaDescription:
      "Free buyer persona template for product managers. Covers demographics, goals, frustrations, buying behavior, tools used, and positioning. Backed by real interviews.",
    filename: "buyer-persona-template.md",
    content: `# Buyer Persona

**Persona Name:** [Give them a memorable name, e.g. "Startup Sarah"]
**Created:** [Date]
**Based on:** [N customer interviews / survey of N respondents / assumption — mark clearly]

---

## At a Glance

> *"[A memorable quote that captures their mindset — use a real customer quote if you have one]"*

| | |
|---|---|
| **Job Title** | [e.g. Head of Product, Senior PM, Founder] |
| **Industry** | [e.g. B2B SaaS, Fintech, E-commerce] |
| **Company Size** | [e.g. Series A startup, 50–200 employees] |
| **Location** | [City/Country or remote] |
| **Reports To** | [e.g. VP Product, CEO] |
| **Team Size** | [e.g. manages 3 engineers + 1 designer] |

---

## Demographics

- **Age range:** [e.g. 28–38]
- **Education:** [e.g. B.Tech from IIT, MBA from ISB — or "varies"]
- **Years of experience:** [e.g. 4–7 years in product]
- **Tech savviness:** Low / Medium / High

---

## Goals

1. **[Primary goal]** — [Why this goal matters to them]
2. **[Secondary goal]** — [Why this goal matters to them]
3. **[Personal goal]** — [Career growth, recognition, reducing stress]

---

## Frustrations & Pain Points

1. **[Pain point]** — [What causes this and how frequently it happens]
2. **[Pain point]** — [What causes this and how frequently it happens]
3. **[Pain point]** — [What causes this and how frequently it happens]

---

## A Day in Their Life

[2–4 sentences describing a typical workday: what they do in the morning, what meetings they attend, where they feel friction, how they end the day. Make it concrete.]

---

## How They Make Buying Decisions

- **Discovers tools via:** [e.g. peer recommendations, Twitter/X, LinkedIn, Google search]
- **Evaluation process:** [e.g. signs up for trial, loops in manager, compares 2–3 options]
- **Decision drivers:** [e.g. integrations with existing stack, security, time-to-value]
- **Blockers to buying:** [e.g. needs IT approval, budget frozen, switching costs]
- **Champion vs. buyer:** [e.g. they champion the tool but manager signs the contract]

---

## Tools They Use

| Category | Current Tools |
|---|---|
| Product management | [e.g. Jira, Linear, Notion] |
| Communication | [e.g. Slack, email, Zoom] |
| Analytics | [e.g. Mixpanel, Amplitude, GA4] |
| Documentation | [e.g. Confluence, Notion, Google Docs] |
| Design collaboration | [e.g. Figma, Miro] |

---

## How Our Product Wins Them Over

1. **[Value proposition 1]** — [Why this resonates specifically with this persona]
2. **[Value proposition 2]** — [Why this resonates specifically with this persona]
3. **[Value proposition 3]** — [Why this resonates specifically with this persona]

---

## What They Say vs. What They Mean

| What they say | What they actually mean |
|---|---|
| "We need more features" | "The current features don't solve my real workflow" |
| "It's too expensive" | "I don't see enough value for the price" |
| "[Their objection]" | "[Underlying concern]" |

---

## Messaging That Resonates

- **Headline:** [One-line message that speaks to their primary goal]
- **Pain to lead with:** [The frustration you should open with]
- **Proof they need:** [Case study type, metric, or social proof that converts them]
- **Channel to reach them:** [Where they consume content]
`,
    howToUse: [
      {
        step: "Ground it in real interviews",
        detail:
          "A persona built from 5+ customer interviews is 10x more useful than one built from assumptions. Mark any section that's assumed vs. validated so your team knows where to be cautious.",
      },
      {
        step: "Fill the quote first",
        detail:
          "The 'At a Glance' quote anchors the whole persona. If you don't have a real quote, use one that sounds like something a real customer would say — it makes the persona feel human.",
      },
      {
        step: "One persona per user type",
        detail:
          "Don't blend two different users into one persona to save time. If your SMB buyer and your enterprise buyer have fundamentally different goals, create two separate personas. Blended personas lead to blended product decisions.",
      },
      {
        step: "Share it widely",
        detail:
          "A persona that lives only in the PM's Notion is worthless. Present it in an all-hands, paste it in your team Slack, and reference it explicitly when making product decisions.",
      },
    ],
    faqs: [
      {
        q: "How many buyer personas should a product have?",
        a: "2–4 personas covers most B2B products. One primary (your ICP), one or two secondary, and an optional anti-persona (who you're not building for). More than 4 usually signals unclear positioning rather than genuine user diversity.",
      },
      {
        q: "What's the difference between a buyer persona and a user persona?",
        a: "A buyer persona describes who makes the purchase decision — their goals, objections, and buying journey. A user persona describes who uses the product day-to-day. In B2C they're often the same person. In B2B they're often different: the buyer might be a VP of Engineering while the user is a developer.",
      },
      {
        q: "How often should personas be updated?",
        a: "Review personas at least once a year, or after any significant customer discovery sprint. Early-stage companies often discover their ICP is different from their original assumptions within 6 months. A stale persona is worse than no persona.",
      },
      {
        q: "What data sources work best for building personas?",
        a: "In priority order: customer interviews (most valuable), sales call recordings, support ticket themes, survey data, CRM data. Analytics can tell you what users do but not why they do it — pair quantitative data with qualitative interviews for the most useful personas.",
      },
    ],
  },
  {
    slug: "user-story-template",
    title: "User Story Template",
    shortTitle: "User Stories",
    category: "Technical Execution",
    description:
      "A user story template with acceptance criteria in Given/When/Then format, definition of done, and an INVEST checklist. Ready to paste into Jira or Linear.",
    metaDescription:
      "Free user story template with acceptance criteria. As a / I want / So that format with Given/When/Then scenarios, definition of done, and INVEST checklist. Copy into Jira.",
    filename: "user-story-template.md",
    content: `# User Story Template

**Feature:** [Feature Name]
**Epic:** [Parent Epic, if applicable]
**Sprint / Milestone:** [Sprint X / Q[X] Milestone]
**Author:** [PM Name]
**Status:** Draft / Refined / Ready for Dev

---

## User Story Format

> **As a** [type of user],
> **I want** [to perform some action],
> **so that** [I can achieve some goal or benefit].

---

## Story 1: [Short Story Name]

**Story:**
> As a **[user type]**, I want **[action]** so that **[benefit]**.

**Priority:** P0 / P1 / P2
**Estimated effort:** [Story points or T-shirt size]
**Dependencies:** [Any blockers or prerequisites]

### Acceptance Criteria

**Scenario 1: [Happy path description]**
- **Given** [initial context / precondition]
- **When** [the user takes this action]
- **Then** [the system responds with this outcome]

**Scenario 2: [Edge case or error state]**
- **Given** [context]
- **When** [action]
- **Then** [expected outcome]

**Scenario 3: [Permission or role variation — if applicable]**
- **Given** [user does not have permission / is not logged in / etc.]
- **When** [they attempt the action]
- **Then** [the system blocks or handles it correctly]

### Definition of Done
- [ ] Unit tests cover the main scenarios
- [ ] Acceptance criteria reviewed and approved by PM
- [ ] Design matches approved Figma spec
- [ ] No regressions in related flows
- [ ] Analytics event fires correctly (if applicable)
- [ ] Accessible at WCAG 2.1 AA level

### Notes & Open Questions
- [Any implementation note or open question for engineering / design]

---

## Story 2: [Short Story Name]

**Story:**
> As a **[user type]**, I want **[action]** so that **[benefit]**.

**Priority:** P0 / P1 / P2
**Estimated effort:** [Story points or T-shirt size]
**Dependencies:** [Any blockers]

### Acceptance Criteria

**Scenario 1: [Happy path]**
- **Given** [context]
- **When** [action]
- **Then** [outcome]

**Scenario 2: [Error state]**
- **Given** [context]
- **When** [action]
- **Then** [outcome]

### Definition of Done
- [ ] Unit tests cover the main scenarios
- [ ] Acceptance criteria reviewed by PM
- [ ] No regressions in related flows

### Notes
- [Any note]

---

## Story 3: [Short Story Name]

**Story:**
> As a **[user type]**, I want **[action]** so that **[benefit]**.

**Priority:** P0 / P1 / P2

### Acceptance Criteria

**Scenario 1:**
- **Given** [context]
- **When** [action]
- **Then** [outcome]

---

## Good User Story Checklist (INVEST)

- [ ] **Independent** — can be developed and delivered without requiring another story
- [ ] **Negotiable** — the how is open to discussion between PM and engineering
- [ ] **Valuable** — delivers clear value to a specific user
- [ ] **Estimable** — engineering can give a rough size (if not, it needs breaking down)
- [ ] **Small** — completable within one sprint
- [ ] **Testable** — acceptance criteria are verifiable

---

## Related Artifacts

- Design: [Figma link]
- Epic: [Link to parent epic in Jira/Linear]
- PRD: [Link to PRD]
- Analytics spec: [Link]
`,
    howToUse: [
      {
        step: "Write the story before the criteria",
        detail:
          "The 'As a / I want / So that' format forces you to name the user, the action, and the benefit. If you can't fill in all three, the story isn't well-defined yet.",
      },
      {
        step: "Write at least 3 scenarios per story",
        detail:
          "Happy path, error state, and a permission or edge case. Stories with only a happy path scenario regularly cause rework when engineers discover the edge cases during development.",
      },
      {
        step: "Use the INVEST checklist before refinement",
        detail:
          "Run each story through the checklist before bringing it to sprint planning. Stories that fail the 'Small' check should be split. Stories that fail 'Testable' need more specific acceptance criteria.",
      },
      {
        step: "Link to design and analytics specs",
        detail:
          "A story without a Figma link and an analytics event spec is incomplete. Engineers shouldn't have to guess what the design looks like or whether to add tracking.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a user story and a task?",
        a: "A user story describes what a user needs and why — it belongs in planning and refinement. A task describes what an engineer does to implement a story — it belongs in sprint tickets. 'Allow users to export reports as PDF' is a user story. 'Add PDF generation library and wire up download button' is a task.",
      },
      {
        q: "How many acceptance criteria should a story have?",
        a: "Typically 2–5 scenarios. Fewer than 2 means you haven't thought through edge cases. More than 6 usually means the story is too big and should be split into smaller pieces.",
      },
      {
        q: "Should user stories include technical implementation details?",
        a: "No. User stories describe the 'what' and 'why', not the 'how'. Technical implementation is the engineering team's responsibility. If you're writing 'the system should use a REST API to call...', you're writing a technical spec, not a user story.",
      },
      {
        q: "What's a good story point estimate?",
        a: "Points measure relative complexity, not time. A 1-point story is trivially simple. An 8-point story is large and risky — it often needs to be split. Most healthy teams complete 2–5 point stories in a day or two. If your team consistently takes multiple sprints to complete stories, they're too large.",
      },
    ],
  },
  // ─── 6. Product Launch Checklist ──────────────────────────────────────────
  {
    slug: "product-launch-checklist",
    title: "Product Launch Checklist",
    shortTitle: "Launch Checklist",
    category: "Growth",
    description:
      "A 50-point pre-launch checklist covering product readiness, marketing, sales enablement, support preparation, engineering ops, and post-launch review.",
    metaDescription:
      "Free product launch checklist for PMs. 50 items across product, marketing, sales, support, and ops. Copy-paste ready, no signup required.",
    filename: "product-launch-checklist.md",
    content: `# Product Launch Checklist

**Feature / Product:** [Name]
**Launch Date:** [Date]
**PM Owner:** [Name]
**Status:** In Progress / Ready / Launched

---

## 4 Weeks Before Launch

### Product Readiness
- [ ] Feature complete and merged to main
- [ ] All P0 and P1 bugs resolved
- [ ] End-to-end testing complete on staging
- [ ] Accessibility review passed (WCAG 2.1 AA)
- [ ] Mobile and cross-browser testing done
- [ ] Performance benchmarks met (load time, API latency)
- [ ] Security review signed off
- [ ] Feature flag configured; rollout % set to 0%

### Analytics & Instrumentation
- [ ] All analytics events defined and implemented
- [ ] Dashboard created to track launch metrics
- [ ] Baseline metrics captured before launch
- [ ] Error monitoring alerts configured

---

## 2 Weeks Before Launch

### Marketing & Comms
- [ ] Launch blog post written and reviewed
- [ ] Email campaign drafted and approved
- [ ] In-app announcement / tooltip written
- [ ] Social media posts scheduled
- [ ] Landing page or docs page updated
- [ ] SEO metadata updated for new pages
- [ ] Screenshots / demo video recorded

### Sales Enablement
- [ ] Sales one-pager updated with new feature
- [ ] Demo script updated
- [ ] Sales team briefed in a 30-min session
- [ ] Objection-handling FAQ shared with sales
- [ ] Key accounts identified for early outreach

### Support Readiness
- [ ] Help center article written and published
- [ ] Support team trained on new feature
- [ ] Known limitations documented for support
- [ ] Escalation path defined for launch-day issues
- [ ] FAQ page updated

---

## 1 Week Before Launch

### Legal & Compliance
- [ ] Privacy policy updated if data handling changed
- [ ] Terms of service updated if needed
- [ ] Legal sign-off received

### Internal Alignment
- [ ] Launch announcement sent to all-hands channel
- [ ] Engineering on-call briefed on launch risks
- [ ] Rollback plan documented and reviewed
- [ ] Launch war-room channel created in Slack
- [ ] Go / No-Go criteria defined

---

## Launch Day

- [ ] Feature flag ramped to target % (e.g. 10% → 50% → 100%)
- [ ] Analytics dashboard monitored for 2 hours post-launch
- [ ] Error rate checked every 30 minutes
- [ ] Customer support queue monitored
- [ ] Blog post and email published
- [ ] Social posts published
- [ ] Sales team notified: "live now"

---

## 1 Week Post-Launch

- [ ] Launch metrics reviewed against baseline
- [ ] Customer feedback collected (in-app, support tickets, sales calls)
- [ ] Top 3 issues identified and triaged
- [ ] Retrospective scheduled with team
- [ ] Learnings documented in launch log

---

## Launch Log (fill in after)

| Date | What happened | Action taken |
|---|---|---|
| Launch day | | |
| Day 3 | | |
| Week 1 | | |
`,
    howToUse: [
      {
        step: "Assign owners to every section",
        detail:
          "A checklist without owners is a wishlist. Before the 4-week mark, assign Marketing, Eng, and Support owners to their sections so nobody assumes someone else is handling it.",
      },
      {
        step: "Use the Go/No-Go criteria",
        detail:
          "Define your Go/No-Go threshold explicitly: 'We launch if zero P0 bugs exist and error rate on staging is below 0.1%'. Vague criteria lead to last-minute debates.",
      },
      {
        step: "Start with a feature flag at 0%",
        detail:
          "Always launch behind a feature flag at 0% and ramp gradually. This gives you a kill switch if something goes wrong without a full rollback.",
      },
      {
        step: "Monitor for the first 2 hours",
        detail:
          "Most launch-day issues surface in the first 2 hours. Keep the PM and an engineer watching the dashboard during the initial ramp — don't walk away after pressing go.",
      },
    ],
    faqs: [
      {
        q: "How far in advance should launch prep begin?",
        a: "4 weeks is the minimum for a significant feature. For major product launches, 8 weeks is safer. The most common mistake is treating launch prep as a 1-week task — marketing and sales enablement alone take 2–3 weeks to do well.",
      },
      {
        q: "What's a feature flag and why does it matter for launches?",
        a: "A feature flag is a code toggle that lets you enable or disable a feature for specific users or percentages without deploying new code. It gives you a kill switch if a launch goes wrong and lets you do gradual rollouts (10% → 50% → 100%) to catch issues before they affect everyone.",
      },
      {
        q: "What should be in the Go/No-Go criteria?",
        a: "Minimum: zero P0 bugs, error rate within acceptable range, analytics firing correctly, and support team briefed. Optional but valuable: a successful internal beta with at least 5 users, and sign-off from legal if the feature touches data or payments.",
      },
      {
        q: "How do I handle a bad launch?",
        a: "First, kill the feature flag if the issue is severe. Second, communicate internally before externally — the team needs to know before customers do. Third, write a blameless post-mortem within 48 hours. Customers tolerate mistakes; what they don't tolerate is silence.",
      },
    ],
  },

  // ─── 7. Competitive Analysis Matrix ───────────────────────────────────────
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
  },

  // ─── 8. Go-to-Market Template ─────────────────────────────────────────────
  {
    slug: "go-to-market-template",
    title: "Go-to-Market Template",
    shortTitle: "GTM Plan",
    category: "Growth",
    description:
      "A complete go-to-market plan template covering target customer, positioning, pricing, channels, launch phases, success metrics, and team responsibilities.",
    metaDescription:
      "Free go-to-market template for product managers. Target customer, positioning, pricing, channels, launch phases, and success metrics. Copy-paste ready.",
    filename: "go-to-market-template.md",
    content: `# Go-to-Market Plan

**Product / Feature:** [Name]
**PM Owner:** [Name]
**Launch Target:** [Quarter / Date]
**Status:** Draft / Approved / In Execution

---

## 1. What We're Launching

> [2–3 sentences: what it is, what problem it solves, and who it's for]

**Launch type:**
- [ ] New product
- [ ] Major feature
- [ ] Incremental update
- [ ] Repositioning / pricing change

---

## 2. Target Customer

**Primary segment:** [Specific description — not "everyone"]
**Job title(s):** [Who will use / buy this]
**Company profile:** [Industry, size, growth stage]
**Problem they have today:** [The pain this solves]
**How they solve it today:** [Current workaround or competitor]

---

## 3. Positioning & Messaging

**Positioning statement:**
> For [target customer], [product name] is the [category] that [key benefit] because [reason to believe]. Unlike [competitor or alternative], we [key differentiator].

**Tagline:** [One memorable line]

**Key messages by audience:**

| Audience | Core message | Proof point |
|---|---|---|
| [User / end-user] | [What matters to them] | [Stat, story, or feature] |
| [Buyer / economic buyer] | [What matters to them] | [ROI, risk reduction, etc.] |
| [Champion] | [What makes them look good] | [Career / team impact] |

---

## 4. Pricing & Packaging

| Plan | Price | What's included | Who it's for |
|---|---|---|---|
| Free | ₹0 / $0 | [Features] | [Persona] |
| [Plan name] | ₹[X]/mo | [Features] | [Persona] |
| [Plan name] | ₹[X]/mo | [Features] | [Persona] |
| Enterprise | Contact us | [Features] | [Persona] |

**Pricing rationale:** [Why these price points — competitive context, value metric, willingness to pay data]

---

## 5. Channels

| Channel | Tactic | Owner | Timeline | KPI |
|---|---|---|---|---|
| Product | In-app announcement, onboarding nudge | PM | Launch day | Activation rate |
| Email | Announcement to existing users | Marketing | Launch day | Open rate, clicks |
| Content | Blog post targeting [keyword] | Marketing | T-7 | Organic traffic |
| Social | [LinkedIn / Twitter / X post] | Marketing | Launch day | Impressions |
| Sales | Outbound to [ICP segment] | Sales | T+3 | Demos booked |
| PR | [Outlet name] if relevant | Marketing | T-3 | Coverage |
| Community | [Slack / Discord / Reddit] | Marketing | Launch day | Engagement |

---

## 6. Launch Phases

### Phase 1 — Private Beta (T-4 weeks to T-2 weeks)
**Goal:** [Validate product is ready; collect early feedback]
**Audience:** [N hand-picked customers]
**Success criteria:** [E.g. NPS > 30, zero P0 bugs]
**Owner:** [PM]

### Phase 2 — Soft Launch (T-2 weeks to launch)
**Goal:** [Test messaging and channel mix; build pipeline]
**Audience:** [Waitlist / early adopters / % of existing users]
**Success criteria:** [E.g. 50 signups, 3 case studies]
**Owner:** [Marketing]

### Phase 3 — General Availability
**Goal:** [Drive adoption across target segment]
**Audience:** [All users / specific tier]
**Success criteria:** [Metric + target]
**Owner:** [PM + Marketing]

### Phase 4 — Post-Launch Optimization (T+30 to T+90)
**Goal:** [Improve activation and retention; feed learnings into roadmap]
**Success criteria:** [Retention metric at day 30]
**Owner:** [PM]

---

## 7. Success Metrics

| Metric | Baseline | Week 1 target | Month 1 target | Owner |
|---|---|---|---|---|
| [Activation rate] | [X%] | [Y%] | [Z%] | [Name] |
| [Revenue / MRR impact] | [X] | — | [Y] | [Name] |
| [Retention / DAU] | [X] | — | [Y] | [Name] |
| [NPS / CSAT] | [X] | — | [Y] | [Name] |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk] | High / Med / Low | High / Med / Low | [Plan] |
| [Risk] | | | |

---

## 9. Team & Responsibilities

| Function | Owner | Commitment |
|---|---|---|
| Product | [Name] | [Hours/week or % time] |
| Engineering | [Name] | |
| Marketing | [Name] | |
| Sales | [Name] | |
| Design | [Name] | |
| Support | [Name] | |
`,
    howToUse: [
      {
        step: "Write the positioning statement first",
        detail:
          "Everything else in the GTM plan flows from positioning. If you can't complete the sentence 'For [customer], we are the [category] that [benefit] because [reason to believe]', your strategy isn't clear enough yet.",
      },
      {
        step: "Segment your messages by audience",
        detail:
          "The person who uses your product and the person who pays for it often care about completely different things. Map your messages separately for user, buyer, and champion — don't write one message and expect it to work for all three.",
      },
      {
        step: "Stagger your launch in phases",
        detail:
          "A private beta before general availability lets you find product issues and collect testimonials before your main launch. Going straight to GA skips the safety net.",
      },
      {
        step: "Define metrics before launch, not after",
        detail:
          "Decide what success looks like before you see the data — otherwise you'll unconsciously cherry-pick metrics that make the launch look good.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a GTM plan and a marketing plan?",
        a: "A GTM plan is a strategic document that covers the full picture: target customer, positioning, pricing, channels, launch phases, and success metrics. A marketing plan is one component — it covers channels, campaigns, and content. PMs own the GTM plan; marketing owns execution within it.",
      },
      {
        q: "Who should be involved in building the GTM plan?",
        a: "The PM leads it, but it should be built with inputs from sales (customer objections), marketing (messaging and channels), and support (common questions post-launch). Surprises on launch day usually happen when one of these functions wasn't looped in early enough.",
      },
      {
        q: "How detailed should the GTM plan be for a small feature vs. a new product?",
        a: "For an incremental feature: 2–3 pages focused on messaging, channels, and success metrics. For a major product launch: the full template, including private beta, phased rollout, and risk register. Invest in planning proportional to launch risk.",
      },
      {
        q: "When is it too late to change the positioning?",
        a: "Once sales training is done and marketing assets are in production. After that, changes cascade across materials, demos, and messaging — which is expensive and demoralizing for the team. Lock positioning 3 weeks before launch.",
      },
    ],
  },

  // ─── 9. Release Notes Template ────────────────────────────────────────────
  {
    slug: "release-notes-template",
    title: "Release Notes Template",
    shortTitle: "Release Notes",
    category: "Growth",
    description:
      "A release notes template that works for both internal engineering changelogs and customer-facing product updates. Covers version, highlights, new features, improvements, bug fixes, and deprecations.",
    metaDescription:
      "Free release notes template for product managers. Internal changelog and customer-facing format. New features, improvements, bug fixes, deprecations. Copy-paste ready.",
    filename: "release-notes-template.md",
    content: `# Release Notes

---

## Version [X.Y.Z] — [Date]

> **One-line summary:** [The most important thing in this release in plain English]

---

### ✨ New Features

#### [Feature Name]
[2–3 sentences describing what it does and why it matters to the user. Avoid technical jargon. Focus on the user benefit, not the implementation.]

**How to access:** [Settings → X, or "available to all Pro users", or "enabled by default"]

---

#### [Feature Name]
[Description]

**How to access:** [Location / tier / flag]

---

### ⚡ Improvements

- **[Improvement]:** [What changed and how it's better. E.g. "Export now runs 3x faster for files over 50MB."]
- **[Improvement]:** [Description]
- **[Improvement]:** [Description]

---

### 🐛 Bug Fixes

- Fixed: [Describe the bug that was fixed, not the code that changed. E.g. "Dashboard failed to load for users with more than 500 projects."]
- Fixed: [Description]
- Fixed: [Description]

---

### ⚠️ Deprecations & Breaking Changes

> ⚠️ Action required if you use [X].

- **[API endpoint / feature]** will be removed on **[date]**. Migrate to [new endpoint / feature] by then. [Migration guide link]
- **[Setting / behavior]** has changed. [What the old behavior was and what it is now.]

---

### 🔧 Under the Hood

> *(Optional — include for developer-facing products or internal changelogs)*

- Upgraded [dependency] from [v1] to [v2]
- Migrated [service] to [new infrastructure]
- Reduced p99 API latency from [X]ms to [Y]ms

---

### Known Issues

- [ ] [Issue]: [Description and workaround if available]. Fix expected in [next version / date].

---

### What's Coming Next

> A brief preview of what's in progress — builds anticipation without making commitments.

- [Feature in progress] — [Expected quarter / "coming soon"]
- [Feature in progress] — [Expected quarter]

---

---

## Version [X.Y.Z-1] — [Previous Date]

> **One-line summary:** [Previous release summary]

### ✨ New Features
[...]

### 🐛 Bug Fixes
[...]

---

## Changelog Archive

| Version | Date | Highlights |
|---|---|---|
| [X.Y.Z] | [Date] | [Key change] |
| [X.Y.Z-1] | [Date] | [Key change] |
`,
    howToUse: [
      {
        step: "Write for users, not engineers",
        detail:
          "Release notes that describe 'refactored the auth middleware' mean nothing to customers. Translate every change into user impact: 'Login is now 40% faster' instead of 'optimized token validation.'",
      },
      {
        step: "Lead with the most important change",
        detail:
          "The one-line summary at the top sets expectations. If this release ships one headline feature, say so clearly — don't bury it in a list of 15 bullet points.",
      },
      {
        step: "Call out deprecations prominently",
        detail:
          "Deprecation warnings must be obvious — use the ⚠️ section with a clear date and migration path. Customers who miss deprecation notices become angry support tickets 3 months later.",
      },
      {
        step: "Keep a living changelog, not just versioned snapshots",
        detail:
          "The Changelog Archive table at the bottom turns your release notes page into a searchable record of what shipped when. This is invaluable for sales ('when did X ship?'), support, and onboarding new PMs.",
      },
    ],
    faqs: [
      {
        q: "How long should release notes be?",
        a: "As short as the release warrants. A patch with 3 bug fixes needs 3 bullet points. A major release might need 2 pages. The mistake is padding minor releases with filler or compressing major releases into a tweetable summary that leaves users confused.",
      },
      {
        q: "Should release notes be customer-facing or internal?",
        a: "Both — but they serve different audiences. Customer-facing notes focus on user benefit, plain language, and 'how to access' guidance. Internal engineering changelogs include technical detail: PRs, infra changes, performance deltas. Use this template for customer-facing; maintain a separate internal CHANGELOG.md for engineering.",
      },
      {
        q: "Who should write release notes?",
        a: "The PM should own the customer-facing release notes with input from engineering (for accuracy) and marketing (for tone). Engineers writing raw changelogs is fine for internal use, but customer-facing notes need a PM to translate technical changes into user benefit.",
      },
      {
        q: "How often should I publish release notes?",
        a: "At minimum, with every public-facing release. High-frequency shipping teams (weekly or more) often batch notes into a weekly digest. Monthly summaries work well for customers who don't want to track every deployment. Whatever cadence you choose, be consistent — customers notice when the changelog goes quiet.",
      },
    ],
  },

  // ─── 10. Acceptance Criteria Template ─────────────────────────────────────
  {
    slug: "acceptance-criteria",
    title: "Acceptance Criteria Template",
    shortTitle: "Acceptance Criteria",
    category: "Technical Execution",
    description:
      "A structured acceptance criteria template using Given/When/Then scenarios, business rules, edge cases, non-functional requirements, and a definition of done. Ready for Jira or Linear.",
    metaDescription:
      "Free acceptance criteria template for product managers. Given/When/Then format, business rules, edge cases, non-functional requirements, and definition of done. Copy into Jira.",
    filename: "acceptance-criteria-template.md",
    content: `# Acceptance Criteria

**Feature / Story:** [Feature Name]
**Author:** [PM Name]
**Date:** [Date]
**Status:** Draft / Reviewed / Approved

> **Tip:** Acceptance criteria describe observable behaviour the system must exhibit. They are the contract between PM and engineering. If it's not written here, it's not in scope.

---

## Feature Summary

> [1–2 sentences: what this feature does and who it's for]

**User type:** [Who triggers this flow]
**Entry point:** [Where the user starts — e.g. "Settings page → Billing tab"]

---

## Scenario 1: [Happy Path — Main Success Case]

> The most common, successful use of this feature.

- **Given** [the user is in state X — e.g. "logged in, has a Pro plan, has at least one project"]
- **When** [the user takes action Y — e.g. "clicks 'Export PDF'"]
- **Then** [the system does Z — e.g. "a PDF is generated and downloaded within 5 seconds containing all active insights"]

**Additional conditions:**
- [Any other expected system behaviour in this scenario]
- [What the user sees / hears / receives]

---

## Scenario 2: [Alternative Success Path]

> A valid variation of the happy path.

- **Given** [context]
- **When** [action]
- **Then** [outcome]

---

## Scenario 3: [Error / Failure State]

> What happens when something goes wrong.

- **Given** [the user is in a state where the action could fail — e.g. "file exceeds 50MB"]
- **When** [they attempt the action]
- **Then** [the system shows a clear error message: "[copy]" and does not proceed]

**Error message copy:** "[Exact text the user sees]"

---

## Scenario 4: [Permission / Role Boundary]

> What happens when a user without access tries this action.

- **Given** [user is on the Free plan / is not an admin / is not logged in]
- **When** [they attempt the action]
- **Then** [they see a paywall / redirect to login / see a disabled state with tooltip "Upgrade to Pro"]

---

## Scenario 5: [Edge Case — add as many as needed]

- **Given** [unusual but valid context]
- **When** [action]
- **Then** [expected outcome]

---

## Business Rules

> Constraints the system must always enforce, regardless of scenario.

- [ ] [Rule 1 — e.g. "A user may not export more than 10 PDFs per day on the Free plan"]
- [ ] [Rule 2 — e.g. "Export always uses the most recently saved version of the document"]
- [ ] [Rule 3]

---

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| Performance | [e.g. "Response within 3s for files under 10MB"] |
| Accessibility | [e.g. "All interactive elements keyboard-navigable; error messages announced by screen reader"] |
| Browser support | [e.g. "Chrome 110+, Safari 16+, Firefox 110+, Edge 110+"] |
| Mobile | [e.g. "Responsive at 375px viewport; no horizontal scroll"] |
| Security | [e.g. "Only the file owner may download; no public URL without auth token"] |

---

## Out of Scope

> Be explicit — this prevents scope creep and "but I assumed..." conversations.

- [Feature or behaviour that is NOT included in this ticket]
- [Future enhancement that is intentionally deferred]

---

## Definition of Done

- [ ] All scenarios above pass in staging
- [ ] Acceptance criteria reviewed and signed off by PM before merge
- [ ] Analytics event fires on [key action] with [expected properties]
- [ ] No regressions in [related flow]
- [ ] Help center updated if this is a user-visible change
- [ ] Design matches approved Figma spec (link: [URL])
`,
    howToUse: [
      {
        step: "Always write Scenario 3 — the failure state",
        detail:
          "Most PMs write the happy path and stop. Failure states are where the most debates happen during development. Write what the user sees when something goes wrong before engineering starts building.",
      },
      {
        step: "Include the exact error message copy",
        detail:
          "Don't write 'show an error message' — write the exact copy. This forces you to think about tone and information density, and prevents engineers from shipping unhelpful messages like 'Error 500'.",
      },
      {
        step: "Use the Business Rules section for invariants",
        detail:
          "Business rules are constraints that must always hold regardless of scenario — like rate limits, access controls, or data retention rules. Listing them separately prevents them from being accidentally omitted from one scenario.",
      },
      {
        step: "Get engineering sign-off before sprint starts",
        detail:
          "Acceptance criteria that engineers haven't read before starting a sprint aren't acceptance criteria — they're surprises at code review. Walk through the scenarios together in refinement.",
      },
    ],
    faqs: [
      {
        q: "How is acceptance criteria different from a user story?",
        a: "A user story describes what the user wants and why ('As a PM, I want to export my PRD as a PDF so I can share it with stakeholders'). Acceptance criteria describe the specific conditions under which that story is considered complete. Every user story should have acceptance criteria; not every acceptance criteria set needs a full user story.",
      },
      {
        q: "How many scenarios should I write?",
        a: "At minimum: 1 happy path, 1 error state, and 1 permission boundary. For complex flows, 6–10 scenarios is normal. If you find yourself writing more than 12, the story is probably too large and should be split.",
      },
      {
        q: "Should acceptance criteria be written in Given/When/Then format?",
        a: "Given/When/Then (Gherkin-style) is the most common format because it forces you to specify context, trigger, and outcome separately — which prevents ambiguous criteria. It can also be used directly by QA for automated test cases. That said, for simple internal features, a checklist of conditions is fine.",
      },
      {
        q: "Who owns acceptance criteria?",
        a: "The PM writes the first draft; engineering validates it for completeness and technical feasibility; QA uses it as the test spec. All three should review before a ticket enters development. If engineering consistently discovers gaps during development, the criteria aren't being reviewed early enough.",
      },
    ],
  },
  // ─── 11. Product Brief Template ───────────────────────────────────────────
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
  },

  // ─── 12. Lean Canvas ──────────────────────────────────────────────────────
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
  },

  // ─── 13. North Star Metric Framework ──────────────────────────────────────
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
  },

  // ─── 14. Jobs to be Done (JTBD) ───────────────────────────────────────────
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
  },

  // ─── 15. Customer Journey Map ─────────────────────────────────────────────
  {
    slug: "customer-journey-map",
    title: "Customer Journey Map Template",
    shortTitle: "Journey Map",
    category: "Research",
    description:
      "A customer journey map template covering stages, touchpoints, actions, thoughts, emotions, pain points, and opportunities — with a product implications section.",
    metaDescription:
      "Free customer journey map template for PMs and UX researchers. Stages, touchpoints, emotions, pain points, and product opportunities. Copy-paste ready, no signup.",
    filename: "customer-journey-map-template.md",
    content: `# Customer Journey Map

**Persona:** [Name of the persona this map is for]
**Scenario:** [What the customer is trying to accomplish — e.g. "Onboarding and getting first value from PMRead"]
**Author:** [Name]
**Date:** [Date]
**Based on:** [N interviews / usability sessions / support data]

---

## Journey Stages

> Define 4–7 stages that cover the customer's end-to-end experience.

| Stage | [Stage 1] | [Stage 2] | [Stage 3] | [Stage 4] | [Stage 5] |
|---|---|---|---|---|---|
| **Name** | Awareness | Consideration | Onboarding | First Value | Retention |
| **Goal** | [What the customer is trying to do] | | | | |

---

## Touchpoints

> Where does the customer interact with your product, brand, or team at each stage?

| Stage | Touchpoints |
|---|---|
| [Stage 1] | [Website, ad, word of mouth, review site] |
| [Stage 2] | [Demo, trial signup, pricing page, comparison sites] |
| [Stage 3] | [Welcome email, in-app onboarding, docs] |
| [Stage 4] | [Core feature, first "aha moment"] |
| [Stage 5] | [Email, in-app nudges, support, renewal] |

---

## Actions, Thoughts & Emotions

### [Stage 1: Awareness]

**Actions** (what the customer does):
- [Action 1]
- [Action 2]

**Thoughts** (what they're thinking):
- "[Quote or paraphrase from research]"

**Emotions** (how they feel):
😐 Neutral / 😕 Frustrated / 😊 Hopeful / 😟 Anxious / 😄 Delighted

Emotional intensity: ▁▂▃▄▅ [mark the level]

---

### [Stage 2: Consideration]

**Actions:**
- [Action]

**Thoughts:**
- "[Quote]"

**Emotions:** [Feeling] — Intensity: ▁▂▃▄▅

---

### [Stage 3: Onboarding]

**Actions:**
- [Action]

**Thoughts:**
- "[Quote]"

**Emotions:** [Feeling] — Intensity: ▁▂▃▄▅

---

### [Stage 4: First Value]

**Actions:**
- [Action]

**Thoughts:**
- "[Quote]"

**Emotions:** [Feeling] — Intensity: ▁▂▃▄▅

---

### [Stage 5: Retention]

**Actions:**
- [Action]

**Thoughts:**
- "[Quote]"

**Emotions:** [Feeling] — Intensity: ▁▂▃▄▅

---

## Pain Points by Stage

| Stage | Pain Point | Severity (1–5) | Source |
|---|---|---|---|
| [Stage] | [Specific friction the customer experiences] | [1–5] | [Interview / support ticket / analytics] |
| | | | |

---

## Moments of Truth

> The 2–3 moments where the customer's relationship with your product is won or lost.

1. **[Moment name]** — [Stage] — [Why this moment is critical and what determines success]
2. **[Moment name]** — [Stage] — [Description]
3. **[Moment name]** — [Stage] — [Description]

---

## Opportunities

| Stage | Opportunity | Priority | Owner |
|---|---|---|---|
| [Stage] | [What we could do to improve this stage] | High / Med / Low | [Team] |
| | | | |

---

## Product & Design Implications

| Finding | Implication | Recommended action |
|---|---|---|
| [Key insight from map] | [What this means for product design] | [What to build or change] |
| | | |
`,
    howToUse: [
      {
        step: "Map one persona and one scenario at a time",
        detail:
          "A journey map that tries to cover all users and all journeys covers nothing. Pick your primary persona and their most important job. Create separate maps for meaningfully different journeys.",
      },
      {
        step: "Ground every row in real research",
        detail:
          "Journey maps built from assumptions are fiction. Mark each row with its source — interview quote, support ticket, analytics event. If a cell can't be backed by evidence, that's a research gap, not a fact to invent.",
      },
      {
        step: "Focus on the Moments of Truth",
        detail:
          "Three moments determine whether a customer stays or churns. Finding and naming these moments is the most valuable output of a journey map. Once identified, instrument them analytically and invest disproportionately in making them excellent.",
      },
      {
        step: "Use it in cross-functional workshops",
        detail:
          "A journey map is most valuable when built collaboratively with design, support, and sales in the room. Support knows where customers fail; sales knows where they hesitate; design knows where they get confused. None of these are visible to the PM alone.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a customer journey map and a service blueprint?",
        a: "A customer journey map shows the customer's experience — what they do, think, and feel. A service blueprint goes deeper, mapping the front-stage (customer-visible) and back-stage (internal processes) that deliver that experience. Start with the journey map; build a service blueprint if you need to redesign operations, not just UX.",
      },
      {
        q: "How many stages should a journey map have?",
        a: "4–7 stages is the sweet spot. Fewer than 4 is too abstract to be actionable. More than 7 becomes hard to read and usually means you've zoomed in too close to one part of the journey. Common stage patterns: Awareness → Consider → Onboard → Use → Retain, or Discover → Trial → Activate → Adopt → Expand.",
      },
      {
        q: "Should journey maps be current-state or future-state?",
        a: "Build current-state first — it documents reality and reveals opportunities. Then build a future-state map to articulate where you're taking the experience. The gap between them is your product roadmap. Never start with future-state alone; it produces aspirational fiction rather than grounded design.",
      },
      {
        q: "How do I validate a journey map?",
        a: "Walk through it with 3–5 customers and ask 'does this reflect your experience?' at each stage. You'll quickly discover where the map is wrong or incomplete. Also compare the pain points and moments of truth against your analytics — if a moment of truth isn't measurable, add instrumentation.",
      },
    ],
  },

  // ─── 16. Empathy Map ──────────────────────────────────────────────────────
  {
    slug: "empathy-map",
    title: "Empathy Map Template",
    shortTitle: "Empathy Map",
    category: "Research",
    description:
      "An empathy map template for product teams covering what users say, think, do, and feel — plus their pains and gains. Built for synthesis after user interviews.",
    metaDescription:
      "Free empathy map template for product managers and UX researchers. Says, thinks, does, feels, pains, and gains. Built for post-interview synthesis. No signup required.",
    filename: "empathy-map-template.md",
    content: `# Empathy Map

**Persona / User Segment:** [Name — e.g. "Startup Sarah: Solo PM at Series A"]
**Scenario:** [Context — e.g. "Preparing a PRD after customer discovery"]
**Author:** [Name]
**Date:** [Date]
**Sources:** [N interviews, session recordings, support tickets]

---

## WHO are we empathising with?

[2–3 sentences describing this user: their role, context, and the situation we're mapping]

**Goal in this scenario:**
[What they are trying to accomplish — the job they're hired to do]

---

## SAYS

> Direct quotes or close paraphrases from research. Use real language — don't sanitise.

- "[Quote from interview or support ticket]"
- "[Quote]"
- "[Quote]"
- "[Quote]"

*What do they say publicly vs. what do they say to close colleagues? Note any gaps.*

---

## THINKS

> What they think but might not say out loud. Infer from behaviour, hesitation, and subtext.

- [Thought / belief about the problem or solution]
- [Worry or concern they haven't voiced]
- [Assumption they hold about how things should work]
- [What success looks like in their head]

---

## DOES

> Observable actions and behaviours — what you see them actually do.

- [Workaround they use today]
- [Tool they switch to / from]
- [Repetitive behaviour that reveals friction]
- [What they do immediately after encountering the problem]

---

## FEELS

> Emotional state. Mark the intensity.

| Emotion | Context | Intensity |
|---|---|---|
| [Frustrated] | [When they have to manually copy data between tools] | ●●●●○ |
| [Anxious] | [Before presenting the PRD to leadership] | ●●●○○ |
| [Relieved] | [When the synthesis finally comes together] | ●●●●● |
| [Proud] | [When the team ships based on their PRD] | ●●●●● |

---

## PAINS

> Obstacles, frustrations, and fears standing between them and their goal.

- **[Pain]:** [Specific description — e.g. "Takes 3–4 hours to manually tag and group 40 interview notes"]
- **[Pain]:** [Description]
- **[Pain]:** [Description]
- **[Fear]:** [What they're afraid of if things go wrong]

---

## GAINS

> What they hope to achieve — the outcomes, benefits, and desires.

- **[Gain]:** [What a great outcome looks like — e.g. "PRD that references specific customer quotes"]
- **[Gain]:** [Description]
- **[Gain]:** [Description]
- **[Aspiration]:** [Bigger career or personal goal this connects to]

---

## Key Insights

> The 3 most actionable insights from this empathy map — the non-obvious things that should change how you design.

1. **[Insight]:** [What it means for product design or messaging]
2. **[Insight]:** [What it means]
3. **[Insight]:** [What it means]

---

## Design Implications

| Insight | Design response |
|---|---|
| [Pain or gain] | [Feature, copy, or UX change that addresses it] |
| | |
`,
    howToUse: [
      {
        step: "Fill it immediately after interviews — while memories are fresh",
        detail:
          "The empathy map is a synthesis tool, not a data collection tool. Fill it within 24 hours of your last interview while direct quotes and body language are still vivid. Don't wait for a batch of 10 interviews.",
      },
      {
        step: "Keep SAYS and THINKS separate",
        detail:
          "The gap between what users say and what they think is where the most valuable insights live. If a user says 'I don't mind the extra steps' but takes three workarounds to avoid them, that contradiction belongs in THINKS.",
      },
      {
        step: "Use it with your team, not just for your notes",
        detail:
          "Print or share the empathy map in your next design critique or sprint planning. It builds shared understanding faster than a 5-page research report. Engineers who see a real user quote are more motivated to solve the right problem.",
      },
      {
        step: "Convert pains and gains directly into product opportunities",
        detail:
          "Every pain is a feature request in disguise. Every gain is a success metric in disguise. Use the Design Implications section to translate the empathy map directly into product decisions — not just as a research artifact.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between an empathy map and a persona?",
        a: "A persona is a composite profile of a user type — who they are, their goals, frustrations, and background. An empathy map is a deeper dive into a specific scenario — what a user says, thinks, does, and feels in a particular context. Empathy maps are more useful for design; personas are more useful for strategy and positioning.",
      },
      {
        q: "How many users should one empathy map represent?",
        a: "One empathy map should represent one user type in one scenario. If you're finding that the SAYS and THINKS sections contradict each other because you're mixing two different types of users, split into two maps. Blended maps produce blended, unusable insights.",
      },
      {
        q: "When should I use an empathy map vs. a journey map?",
        a: "Use an empathy map to understand a user's internal state — their emotions, beliefs, and motivations — at a given moment. Use a journey map to understand how that state changes over time across multiple touchpoints. Start with empathy maps per stage, then assemble them into a journey map.",
      },
      {
        q: "Can I create an empathy map from secondary research instead of interviews?",
        a: "Yes, but mark it clearly as assumption-based and validate it quickly. G2 reviews, Reddit threads, and support tickets are useful sources. The risk of skipping primary research is that your empathy map reflects the loudest voices (people who write public reviews) rather than your actual target user.",
      },
    ],
  },

  // ─── 17. User Interview Script ────────────────────────────────────────────
  {
    slug: "user-interview-script",
    title: "User Interview Script Template",
    shortTitle: "Interview Script",
    category: "Research",
    description:
      "A user interview script template with opening protocol, warm-up questions, problem exploration, solution probing, and closing. Includes a notetaking framework.",
    metaDescription:
      "Free user interview script for product managers. Opening, warm-up, problem exploration, solution probing, and closing. Pairs with feedback analyzer tool. No signup.",
    filename: "user-interview-script-template.md",
    content: `# User Interview Script

**Interview goal:** [One sentence — what you're trying to learn]
**Interviewer:** [Name]
**Duration:** [45–60 minutes]
**Format:** [Video call / in-person]

> **Before you start:** Record with permission. Take sparse notes — don't type full sentences or you'll stop listening. Have a notetaker if possible.

---

## Pre-Interview Checklist
- [ ] Recording consent obtained
- [ ] Notetaker briefed (if applicable)
- [ ] Screener confirms participant fits target profile
- [ ] Interviewer has NOT shared product screenshots or features yet

---

## Opening (5 minutes)

> Build rapport. Reduce social desirability bias. Set expectations.

"Thanks so much for joining today. This call is about understanding how you [general topic — e.g. 'currently manage customer feedback'], not about testing anything I've built. There are no right or wrong answers — I genuinely want to understand your experience, even if that includes things that are frustrating or broken.

I'll be mostly asking questions and listening. You can stop at any time and there's nothing confidential here — I might share anonymised quotes with my team.

Do I have your permission to record this call for my own notes? [Wait for yes.]

Any questions before we start?"

---

## Warm-Up (5 minutes)

> Establish context and get them talking. Start broad.

1. "Tell me a bit about your role and what a typical day looks like for you."
2. "How long have you been doing [relevant activity]?"
3. "What tools do you use day-to-day for [topic area]?"

---

## Problem Exploration (20 minutes)

> Explore the problem space deeply. Do NOT mention your solution. Use "tell me more" liberally.

**Main question:**
"Walk me through the last time you had to [do the job you're investigating]. Start from the beginning."

**Follow-up probes (use as needed — don't ask all):**
- "What were you trying to accomplish at that point?"
- "What did you do next?"
- "What was frustrating about that step?"
- "How long did that take?"
- "What did you do to work around [problem]?"
- "What would have made that easier?"
- "How often does this happen?"
- "What's the impact when this goes wrong?"
- "Who else is involved when you do this?"

**Dig into their current solution:**
- "What tools or processes do you use today for this?"
- "What do you like about how you do it currently?"
- "What would you change if you could?"
- "Have you tried other tools? What happened?"

---

## Solution Probing (10 minutes)

> Use only if you have a specific hypothesis to test. Show mockups or describe the concept.

> ⚠️ **Important:** Do not describe the solution before completing the Problem section. Let the problem dictate what you show.

"I'd like to show you something we're thinking about and get your honest reaction."

[Show mockup / describe concept]

- "What's your first reaction?"
- "What would you expect to happen if you clicked/tapped [X]?"
- "When in your workflow might you use something like this?"
- "What would make you trust this output?"
- "What's missing that would make this useful for you?"
- "Would you pay for something like this? What would feel like a fair price?"

---

## Closing (5 minutes)

- "Is there anything you expected me to ask that I didn't?"
- "Is there anyone else you think I should talk to about this?"
- "Would you be open to a follow-up call if we have specific questions later?"

"That's really helpful — thank you. I'll send you a summary of our main takeaways in the next week."

---

## Notetaking Template

Use this during the call. Fill in immediately after.

**Participant:** [Code/name] | **Date:** [Date] | **Duration:** [X min]

| Category | Notes | Quotes (verbatim) |
|---|---|---|
| Context / role | | |
| Current workflow | | |
| Pain points | | |
| Workarounds | | |
| Reactions to concept | | |
| Surprising / unexpected | | |

**Top 3 insights from this interview:**
1.
2.
3.

**Open questions this interview raised:**
-
`,
    howToUse: [
      {
        step: "Never show the solution before exhausting the problem",
        detail:
          "The biggest mistake in user interviews is revealing your solution in the first 10 minutes. Once you describe what you're building, the participant starts trying to help you rather than describing their actual experience. Complete the Problem Exploration section first — always.",
      },
      {
        step: "Use the 'walk me through the last time' prompt",
        detail:
          "Abstract questions get abstract answers. 'Walk me through the last time you...' grounds the conversation in a specific, recent memory with real emotions and real friction. It's the single most valuable interview technique.",
      },
      {
        step: "Take sparse notes — listen more than you type",
        detail:
          "Full-sentence notetaking while interviewing means you stop listening. Capture keywords, short phrases, and exact quotes in the moment. Fill in the Notetaking Template within 30 minutes of the call ending while memory is fresh.",
      },
      {
        step: "End with 'Is there anything you expected me to ask that I didn't?'",
        detail:
          "This closing question surfaces the topics participants assumed were relevant but didn't come up. It often reveals the most important insight of the session — the thing they were waiting to say.",
      },
    ],
    faqs: [
      {
        q: "How many user interviews do I need?",
        a: "5 interviews within a single user segment typically reveal 85% of the patterns (Nielsen's law). For a new product or major pivot, aim for 10–15 across 2–3 segments. Quality matters more than quantity — one deep 60-minute interview with a real target customer beats five 15-minute calls with anyone who'll talk to you.",
      },
      {
        q: "Should interviews be recorded?",
        a: "Yes, with consent. Recordings let you quote customers accurately and share clips with stakeholders who weren't on the call. They also mean you can focus on listening rather than frantic note-taking. AI transcription tools (Otter.ai, Grain, Fireflies) reduce the effort to near zero.",
      },
      {
        q: "Who should conduct user interviews — PM or UX researcher?",
        a: "Ideally both, but PMs who conduct their own interviews build far deeper empathy than those who only read research reports. The PM should be present in at least 50% of interviews, even if a researcher leads. Hearing a customer say 'this is the most frustrating part of my job' directly is irreplaceable.",
      },
      {
        q: "How do I handle participants who jump to solution suggestions?",
        a: "Acknowledge it and redirect: 'That's really interesting — I want to make sure I understand the problem before we talk about solutions. Can you tell me more about what's frustrating when you do X today?' Don't ignore solution suggestions — log them — but don't let them derail the problem exploration.",
      },
    ],
  },

  // ─── 18. Kano Model ───────────────────────────────────────────────────────
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

  // ─── 19. Stakeholder Map ──────────────────────────────────────────────────
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

  // ─── 20. A/B Test Plan ────────────────────────────────────────────────────
  {
    slug: "ab-test-plan",
    title: "A/B Test Plan Template",
    shortTitle: "A/B Test Plan",
    category: "Growth",
    description:
      "An A/B test plan template for product and growth PMs. Covers hypothesis, variants, sample size calculation, success metrics, guardrail metrics, and a results analysis section.",
    metaDescription:
      "Free A/B test plan template for product managers. Hypothesis, variants, sample size, primary metric, guardrails, and results analysis. Copy-paste ready, no signup.",
    filename: "ab-test-plan-template.md",
    content: `# A/B Test Plan

**Test Name:** [Short descriptive name — e.g. "Onboarding CTA Copy Test"]
**Author:** [PM Name]
**Date Created:** [Date]
**Target Launch Date:** [Date]
**Status:** Planned / Running / Complete / Stopped

---

## Hypothesis

> If we [change], then [metric] will [increase / decrease] by [X%] because [reason based on evidence].

**Full hypothesis:**
> If we **[describe the change]**, then **[primary metric]** will **[direction + magnitude]** because **[insight from research, prior test, or theory that explains the mechanism]**.

**Evidence that informed this hypothesis:**
- [User interview insight, heatmap data, prior test result, or competitor observation]

---

## Background & Motivation

[2–3 sentences: What problem are you solving? Why is this worth testing now? What do you expect to learn?]

---

## Variants

| Variant | Description | Visual / Link |
|---|---|---|
| **Control (A)** | Current experience — no changes | [Screenshot / Figma link] |
| **Treatment (B)** | [What changes — be precise about every element that differs] | [Screenshot / Figma link] |
| **Treatment (C)** *(if applicable)* | [Third variant] | [Link] |

> ⚠️ Change only one thing between control and treatment unless this is a multivariate test. Multiple simultaneous changes make it impossible to know what caused the result.

---

## Target Audience

**Who sees this test:**
- [User segment — e.g. "New signups in their first 7 days"]
- [Inclusion criteria — e.g. "Desktop only, English locale"]
- [Exclusion criteria — e.g. "Existing customers, internal team"]

**Traffic allocation:**
- Control: [50%]
- Treatment: [50%]

---

## Metrics

### Primary Metric (the one that determines winner)
- **Metric:** [e.g. "Onboarding completion rate"]
- **Current baseline:** [X%]
- **Minimum Detectable Effect (MDE):** [+Y% relative — e.g. "+10% relative = from 40% to 44%"]
- **Direction:** [Increase / Decrease]

### Secondary Metrics (context, not decision-makers)
- [e.g. "Time to complete onboarding"]
- [e.g. "Step 2 drop-off rate"]

### Guardrail Metrics (must not worsen)
- [e.g. "Day 7 retention — must not drop below X%"]
- [e.g. "Support ticket volume — must not increase by more than Y%"]

---

## Sample Size & Duration

| Input | Value |
|---|---|
| Baseline conversion rate | [X%] |
| Minimum Detectable Effect | [+Y% relative] |
| Statistical significance | 95% |
| Statistical power | 80% |
| **Required sample size per variant** | **[N users]** |
| Daily eligible users | [N] |
| **Estimated test duration** | **[X days]** |

> Use a sample size calculator (e.g. Evan Miller's) with the above inputs. Never end a test early because results look good — wait for full duration.

---

## Implementation

| Task | Owner | Status |
|---|---|---|
| Variant built in code | [Engineer] | 🔲 |
| Feature flag configured | [Engineer] | 🔲 |
| Analytics events firing in all variants | [Engineer] | 🔲 |
| QA on staging | [Engineer + PM] | 🔲 |
| Pre-test data baseline captured | [Data] | 🔲 |

---

## Results (fill in after test)

**Test ran:** [Start date] → [End date]
**Total users in test:** [N control] vs [N treatment]
**Result:** [Winner / No significant difference / Inconclusive]

| Metric | Control | Treatment | Relative change | p-value | Significant? |
|---|---|---|---|---|---|
| [Primary metric] | [X%] | [Y%] | [+Z%] | [0.0X] | Yes / No |
| [Secondary metric] | | | | | |
| [Guardrail metric] | | | | | |

**Decision:** [Ship treatment / Keep control / Run follow-up test]

**Learnings:**
- [What this test confirmed or disproved]
- [What to test next]
`,
    howToUse: [
      {
        step: "Write the hypothesis before you write any code",
        detail:
          "A test without a hypothesis is just a coin flip. The hypothesis forces you to commit to a mechanism — why you believe the change will work. If you can't articulate the 'because' clause, you don't understand the problem well enough to run the test.",
      },
      {
        step: "Calculate sample size before launching, not after",
        detail:
          "The biggest mistake in A/B testing is peeking at results early and calling a winner when they look good. Pre-calculating sample size tells you the minimum duration to run — commit to it before you see a single data point.",
      },
      {
        step: "Define guardrail metrics in advance",
        detail:
          "A test that increases primary metric by 10% but increases support volume by 30% is not a win. Define your guardrails before the test runs so you can't rationalise ignoring them after seeing the primary result.",
      },
      {
        step: "Document learnings even when the test loses",
        detail:
          "A failed test that disproves a hypothesis is as valuable as a winning one — it prevents you from running the same test again in 6 months. The Learnings section is mandatory, not optional.",
      },
    ],
    faqs: [
      {
        q: "How long should an A/B test run?",
        a: "Until you reach the required sample size. Minimum 1 full week to account for day-of-week effects (user behaviour differs Monday vs. Friday). Maximum 4 weeks — beyond that, novelty effects fade and seasonal factors introduce noise. Calculate the duration upfront and don't deviate.",
      },
      {
        q: "What's statistical significance and why does 95% matter?",
        a: "Statistical significance at 95% means there's a 5% chance the result occurred by random chance. At 90%, that's a 10% chance — meaning roughly 1 in 10 'winning' tests is actually a false positive. In a product with many tests running, false positives compound quickly. 95% is the industry standard.",
      },
      {
        q: "Can I run multiple A/B tests at the same time?",
        a: "Yes, on different user segments or different parts of the product. Running two tests on the same users at the same time risks interaction effects — a user who sees both Treatment B and Treatment C may respond differently than one who sees only one change. Use mutual exclusion if your experimentation platform supports it.",
      },
      {
        q: "What do I do if the test shows no significant difference?",
        a: "A null result is a real result. It means either the change doesn't matter to users, or your MDE was too small to detect a real effect. Document it as 'no significant difference', decide whether to run the test with a larger sample or a bolder variant, and move on. Don't ship the treatment just because it didn't lose.",
      },
    ],
  },

  // ─── 21. Sprint Retrospective ───────────────────────────────────────────────
  {
    slug: "sprint-retrospective",
    title: "Sprint Retrospective Template",
    shortTitle: "Sprint Retrospective",
    category: "Growth",
    description:
      "A structured sprint retrospective template for product and engineering teams. Covers what went well, what to improve, and concrete action items — in under 60 minutes.",
    metaDescription:
      "Free sprint retrospective template for PM and engineering teams. What went well, what to improve, action items. Copy, run, and iterate.",
    filename: "sprint-retrospective-template.md",
    content: `# Sprint Retrospective Template

**Sprint:** [Sprint Number / Name]
**Date:** [Date]
**Facilitator:** [Name]
**Team:** [Team Name]
**Duration:** 60 minutes

---

## Pre-Retro Data Pull (5 min)

Before the meeting, collect:

| Metric | Target | Actual | Delta |
|---|---|---|---|
| Story points committed | | | |
| Story points completed | | | |
| Bugs opened | | | |
| Bugs closed | | | |
| Sprint goal achieved? | Yes/No | | |

---

## Format: Start / Stop / Continue

### What Went Well — Continue ✅

> Things the team did that created value. Be specific — name the practice, not just the feeling.

| Item | Owner | Action |
|---|---|---|
| | | |
| | | |

### What Needs to Change — Stop / Improve ⚠️

> Friction points, repeated mistakes, or processes that cost more than they deliver.

| Item | Root Cause | Proposed Fix |
|---|---|---|
| | | |
| | | |

### What to Try — Start 🚀

> New experiments to run in the next sprint. Each must be specific enough to evaluate.

| Experiment | Owner | How We'll Measure It |
|---|---|---|
| | | |
| | | |

---

## Action Items

| # | Action | Owner | Due Date | Done? |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Rule:** No more than 3 action items per retro. More than 3 means none of them get done.

---

## Sprint Goal Review

**What was the sprint goal?**
> [State it verbatim from the sprint planning doc]

**Was it achieved?**
- [ ] Yes — fully
- [ ] Partially — [explain what was left and why]
- [ ] No — [explain root cause]

---

## Team Health Check (optional, anonymous)

Rate 1–5 on each dimension. Collect via anonymous poll (Mentimeter, Slido, or sticky notes).

| Dimension | Score | Trend vs Last Sprint |
|---|---|---|
| Clarity of priorities | /5 | ↑ / → / ↓ |
| Quality of collaboration | /5 | |
| Technical confidence | /5 | |
| Process friction | /5 | |
| Morale / energy | /5 | |

---

## Retro Review from Last Sprint

**What actions did we commit to last retro?**

| Action | Did we do it? | Impact |
|---|---|---|
| | Yes / No | |
| | Yes / No | |

---

## Notes

[Free-form notes, themes, or patterns observed across multiple sprints]

---

*Next retro: [Date]*`,
    howToUse: [
      {
        step: "Pull sprint data before the meeting",
        detail:
          "Fill in the metrics table (points committed vs completed, bugs, sprint goal) before the session starts. Grounding the retro in numbers prevents the conversation from becoming purely emotional.",
      },
      {
        step: "Run the Start / Stop / Continue exercise",
        detail:
          "Give each team member 5 minutes to add items silently (sticky notes or a shared doc). Then group, dot-vote on the most important items, and discuss the top 3–5 in each column.",
      },
      {
        step: "Commit to exactly 3 action items",
        detail:
          "Cap it at 3. Each must have a named owner and a due date before the next retro. If you can't name an owner, it won't get done — cut it.",
      },
      {
        step: "Review last retro's actions first",
        detail:
          "Open every retro by checking whether you actually did what you committed to last time. If the same action item appears three retros in a row, it's a systemic problem, not an individual one.",
      },
    ],
    faqs: [
      {
        q: "How long should a sprint retrospective take?",
        a: "60 minutes for a 2-week sprint. 90 minutes if there were major incidents, team changes, or release issues worth unpacking. Retros rarely need more than 90 minutes — if they do, split the agenda into two sessions.",
      },
      {
        q: "Should PMs facilitate the retro or should it be the Scrum Master?",
        a: "Whoever facilitates should not be the one whose work is under the most scrutiny. If the PM owns prioritization decisions that caused pain, the EM or Scrum Master should facilitate. Rotate facilitation so everyone learns to run them.",
      },
      {
        q: "What if the team never implements retro action items?",
        a: "Cap action items at 3 and always start the next retro by reviewing them publicly. If action items consistently go undone, raise it as a meta-issue in the retro itself — it's usually a capacity or prioritization problem, not a motivation one.",
      },
      {
        q: "What's the difference between a retrospective and a post-mortem?",
        a: "A retrospective is a regular team health ritual that covers the whole sprint. A post-mortem is a targeted investigation of a specific incident or failure (an outage, a missed launch, a customer escalation). Both use similar formats but have different scopes and triggers.",
      },
    ],
  },

  // ─── 22. RICE Scoring Template ──────────────────────────────────────────────
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

  // ─── 23. MoSCoW Method Template ─────────────────────────────────────────────
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
  {
    slug: "spec-to-django",
    title: "Spec-to-Django Template",
    shortTitle: "Spec-to-Django",
    category: "PM × Engineering",
    description:
      "A PM-to-engineering handoff template that translates product requirements directly into Django model, API, and permission specifications. Reduce back-and-forth between PM and backend engineers.",
    metaDescription:
      "Free Spec-to-Django template for product managers. Translate product requirements into Django models, APIs, and permissions. Download and use.",
    filename: "spec-to-django-template.md",
    content: `# Spec-to-Django Template

**Feature:** [Feature Name]
**PM:** [Name]
**Backend Engineer:** [Name]
**Date:** [Date]
**Target Sprint:** [Sprint]

---

## 1. Feature Summary (1 paragraph)

> What is this feature? Who uses it? What problem does it solve?

[Write here]

---

## 2. Data Model

### New Models

\`\`\`python
# models.py

class [ModelName](models.Model):
    # Fields — define type, null/blank, default, help_text
    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[("active", "Active"), ("archived", "Archived")],
        default="active",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "[table_name]"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
\`\`\`

### Changes to Existing Models

| Model | Field | Change | Migration Notes |
|---|---|---|---|
| | | Add / Rename / Remove / Type change | Nullable migration? |

---

## 3. API Endpoints

| Method | Endpoint | Auth | Request Body | Response | Status Codes |
|---|---|---|---|---|---|
| GET | /api/v1/[resource]/ | JWT | — | List[ResourceSchema] | 200 |
| POST | /api/v1/[resource]/ | JWT | ResourceCreateSchema | ResourceSchema | 201, 400 |
| GET | /api/v1/[resource]/{id}/ | JWT | — | ResourceSchema | 200, 404 |
| PATCH | /api/v1/[resource]/{id}/ | JWT | ResourceUpdateSchema | ResourceSchema | 200, 400, 404 |
| DELETE | /api/v1/[resource]/{id}/ | JWT | — | — | 204, 404 |

### Request / Response Schemas

\`\`\`python
# serializers.py or schemas.py

class ResourceCreateSchema(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    status = serializers.ChoiceField(choices=["active", "archived"], default="active")

class ResourceSchema(serializers.ModelSerializer):
    class Meta:
        model = [ModelName]
        fields = ["id", "name", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
\`\`\`

---

## 4. Business Logic

> Describe non-obvious rules that must be enforced in the view or service layer.

| Rule | Where Enforced | Notes |
|---|---|---|
| Users can only see their own resources | Queryset filter in view | Use request.user.id |
| Status can only go Active → Archived, not back | Validator or save() | Raise ValidationError |
| | | |

---

## 5. Permissions

| Role | Can Create | Can Read | Can Update | Can Delete |
|---|---|---|---|---|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Member | ✅ | ✅ | Own only | Own only |
| Viewer | ❌ | ✅ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## 6. Background Jobs / Celery Tasks

| Task Name | Trigger | Frequency | Notes |
|---|---|---|---|
| | On save signal | — | |
| | Cron | Daily at 00:00 UTC | |

---

## 7. Edge Cases

> List the non-obvious cases engineering should handle:

- [ ] What happens when a user is deleted — do their resources cascade or preserve?
- [ ] What if the POST body is empty?
- [ ] What if two users create the same resource simultaneously?
- [ ] What if the foreign key references a deleted object?

---

## 8. Migration Plan

| Step | Who | Notes |
|---|---|---|
| Write migration | Engineering | Run \`makemigrations\` |
| Review migration | PM + Engineering | Check for destructive changes |
| Test on staging | QA | Confirm existing data untouched |
| Deploy to production | DevOps | Run during low-traffic window |

---

## 9. Open Questions

| Question | Owner | Due |
|---|---|---|
| | | |`,
    howToUse: [
      {
        step: "Write the feature summary before touching the technical sections",
        detail:
          "The summary forces you to articulate what the feature does in plain English. If you can't write it in one paragraph, you don't know the feature well enough to spec it for engineering.",
      },
      {
        step: "Draft the data model fields collaboratively with engineering",
        detail:
          "PMs define what data needs to exist and why. Engineers define how it's stored. Fill in the field names together — ambiguity in field names (is it 'type' or 'category'?) causes bugs that live for years.",
      },
      {
        step: "Define permissions before writing business logic",
        detail:
          "Permission tables are the most-forgotten part of any spec. Write the full matrix (owner / member / viewer × create / read / update / delete) before any code is written. Retrofitting permissions onto existing endpoints is expensive.",
      },
      {
        step: "List edge cases explicitly",
        detail:
          "Cascade deletes, concurrent writes, and empty payloads are the three most common sources of production bugs. Walk through each one and write it down — even 'not handled in v1, returns 500' is better than silence.",
      },
    ],
    faqs: [
      {
        q: "Should PMs write the actual Django code in this template?",
        a: "No. The code blocks are scaffolds that help engineers understand the spec in their own language — not production code. PMs fill in field names, types, and constraints; engineers write the actual implementation. The template eliminates a round of clarification questions, not the engineering work.",
      },
      {
        q: "How detailed should the API endpoint table be?",
        a: "Enough detail that a frontend developer could write the API client without asking questions. That means: method, path, auth requirement, request body fields, response shape, and all meaningful status codes (not just 200 and 500).",
      },
      {
        q: "What if the feature has no new models — it only modifies existing ones?",
        a: "Use the 'Changes to Existing Models' table and skip the 'New Models' section. Document every field change with its migration strategy — especially nullable vs non-nullable additions to tables with production data.",
      },
      {
        q: "When should I use this template vs a regular PRD?",
        a: "Use the Spec-to-Django template for any backend feature that creates new data models or modifies existing ones. Use a standard PRD for higher-level features where the implementation details are up to engineering. These two documents should coexist — the PRD explains 'what and why', this spec explains 'how it maps to the backend'.",
      },
    ],
  },

  // ─── 25. Spec-to-React ───────────────────────────────────────────────────────
  {
    slug: "spec-to-react",
    title: "Spec-to-React Template",
    shortTitle: "Spec-to-React",
    category: "PM × Engineering",
    description:
      "A PM-to-frontend handoff template that translates product requirements into React component trees, state management, and API integration specs. Cut design-to-code ambiguity in half.",
    metaDescription:
      "Free Spec-to-React template for product managers. Translate product requirements into React components, state, and API specs. Download free.",
    filename: "spec-to-react-template.md",
    content: `# Spec-to-React Template

**Feature:** [Feature Name]
**PM:** [Name]
**Frontend Engineer:** [Name]
**Designer:** [Name]
**Date:** [Date]
**Target Sprint:** [Sprint]

---

## 1. Feature Summary

> What does this UI do? Who uses it? What's the success outcome?

[Write here]

---

## 2. Component Tree

> Sketch the component hierarchy. Names should match what you'll name the files.

\`\`\`
<FeaturePage>
  <PageHeader title="..." />
  <FeatureList>
    <FeatureCard key={id} />
    <FeatureCard key={id} />
  </FeatureList>
  <EmptyState />          ← show when list is empty
  <FeatureModal />        ← show on create/edit
  <DeleteConfirmDialog /> ← show on delete
</FeaturePage>
\`\`\`

---

## 3. Component Specs

### [ComponentName]

**Purpose:** [One sentence]

**Props:**
| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| | string | Yes | — | |
| | boolean | No | false | |

**States:**
| State | Type | Initial Value | Description |
|---|---|---|---|
| isLoading | boolean | false | True while API call in-flight |
| error | string \| null | null | API error message |
| items | Item[] | [] | Fetched list data |

**Events / Callbacks:**
| Event | Trigger | Handler |
|---|---|---|
| onClick | User clicks create button | Opens FeatureModal |
| onDelete | User clicks delete | Calls DELETE /api/v1/... |

---

## 4. Page States

Every page has multiple states. Define them all upfront.

| State | Trigger | What the User Sees |
|---|---|---|
| Loading | On mount, before API responds | Skeleton cards |
| Empty | API returns [] | EmptyState component with CTA |
| Populated | API returns items | List of FeatureCard |
| Error | API returns 4xx/5xx | Error banner with retry button |
| Submitting | User clicks Save in modal | Button shows spinner, form disabled |

---

## 5. API Integration

| Hook / Function | Endpoint | Method | Trigger | On Success | On Error |
|---|---|---|---|---|---|
| useFeatures() | /api/v1/features/ | GET | On mount | Set items | Set error |
| createFeature() | /api/v1/features/ | POST | Modal submit | Append to list, close modal | Show toast error |
| deleteFeature(id) | /api/v1/features/{id}/ | DELETE | Confirm dialog | Remove from list | Show toast error |

---

## 6. Routing

| Route | Page Component | Auth Required | Notes |
|---|---|---|---|
| /app/features | FeaturePage | Yes | — |
| /app/features/[id] | FeatureDetailPage | Yes | Redirect to 404 if not found |

---

## 7. Form Validation

| Field | Type | Required | Validation Rules | Error Message |
|---|---|---|---|---|
| name | text | Yes | Min 3 chars, max 100 | "Name must be 3–100 characters" |
| status | select | Yes | One of [active, archived] | "Select a valid status" |

---

## 8. Responsive Behaviour

| Breakpoint | Layout | Notes |
|---|---|---|
| < 768px (mobile) | Single column, no sidebar | FeatureModal becomes full-screen drawer |
| 768–1024px (tablet) | Two-column grid | — |
| > 1024px (desktop) | Three-column grid | — |

---

## 9. Accessibility

- [ ] All interactive elements have \`aria-label\` or visible label
- [ ] Delete confirmation dialog traps focus
- [ ] Loading state announced with \`aria-live="polite"\`
- [ ] Color is not the only differentiator (icons + text labels)
- [ ] Keyboard navigation: Tab order is logical; Esc closes modals

---

## 10. Edge Cases

- [ ] What if an item is deleted while it's open in the detail view?
- [ ] What if the create POST takes > 5 seconds?
- [ ] What if the list has > 500 items — do we paginate?
- [ ] What if the user refreshes mid-form?`,
    howToUse: [
      {
        step: "Draw the component tree first",
        detail:
          "A quick ASCII component tree (like the one in the template) eliminates most naming and nesting debates. Do this before writing anything else — it takes 10 minutes and saves 3 rounds of Figma-to-code interpretation.",
      },
      {
        step: "Define every page state explicitly",
        detail:
          "Loading, empty, populated, error, and submitting are the five states every data-driven page has. If you don't specify them, engineers and designers make different assumptions — and users get blank screens with no feedback.",
      },
      {
        step: "List API calls with their side effects",
        detail:
          "For each API call, specify what happens on success (update state? close modal? show toast?) and what happens on error. 'On success, append to list' is something engineers shouldn't have to guess.",
      },
      {
        step: "Include accessibility requirements before code is written",
        detail:
          "Retrofitting accessibility onto finished UI is expensive. The checklist in Section 9 takes 5 minutes to review but saves 2 sprints of a11y fixes. Review it with the designer, not just the engineer.",
      },
    ],
    faqs: [
      {
        q: "Do I need a Spec-to-React template if we already have Figma designs?",
        a: "Yes. Figma shows what it looks like — this template specifies what it does. State management, API integration, error handling, and edge cases are invisible in Figma. Engineers build from both.",
      },
      {
        q: "What level of detail should I specify for component props?",
        a: "Specify props that have business logic implications (e.g., 'isPro: boolean — controls whether the upgrade banner shows'). Skip purely presentational props (e.g., className, style) — those are the engineer's domain.",
      },
      {
        q: "How is this different from a design handoff in Figma?",
        a: "Figma communicates visual design. This template communicates behavior, state, data flow, and API contracts. Both are necessary — neither replaces the other.",
      },
      {
        q: "Should I fill this in for every UI change?",
        a: "No — for minor copy changes, color tweaks, or single-field form additions, a Jira ticket is sufficient. Use this template for any feature that introduces new components, new routes, or new API calls. A good rule of thumb: if it takes more than 2 days to build, it deserves a spec.",
      },
    ],
  },

  // ─── 26. API Design Spec for PMs ────────────────────────────────────────────
  {
    slug: "api-design-spec",
    title: "API Design Spec Template for PMs",
    shortTitle: "API Design Spec",
    category: "PM × Engineering",
    description:
      "A product manager's API design spec template. Define endpoints, request/response shapes, auth, rate limits, and versioning — before engineering writes a single line.",
    metaDescription:
      "Free API design spec template for product managers. Define endpoints, schemas, auth, and versioning. Download and bridge PM-engineering gap.",
    filename: "api-design-spec-template.md",
    content: `# API Design Spec Template

**API Name:** [Name]
**Version:** v1
**PM:** [Name]
**Tech Lead:** [Name]
**Date:** [Date]
**Status:** Draft / In Review / Approved

---

## 1. Purpose

> What does this API enable? Who are the consumers (mobile app, web frontend, third-party integrations)?

[Write here]

---

## 2. Base URL

| Environment | Base URL |
|---|---|
| Development | http://localhost:8000/api/v1 |
| Staging | https://staging-api.yourproduct.com/api/v1 |
| Production | https://api.yourproduct.com/api/v1 |

---

## 3. Authentication

| Method | Description |
|---|---|
| JWT Bearer Token | \`Authorization: Bearer <token>\` in header |
| API Key | \`X-API-Key: <key>\` in header (for server-to-server) |

Token expiry: 24 hours
Refresh mechanism: POST /auth/refresh with refresh_token

---

## 4. Endpoints

### [Resource Name]

#### List

\`\`\`
GET /[resource]/
\`\`\`

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| page | integer | No | Default: 1 |
| page_size | integer | No | Default: 20, max: 100 |
| status | string | No | Filter by status |

**Response 200:**
\`\`\`json
{
  "count": 42,
  "next": "/api/v1/[resource]/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Example",
      "status": "active",
      "created_at": "2026-04-01T00:00:00Z"
    }
  ]
}
\`\`\`

---

#### Create

\`\`\`
POST /[resource]/
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "string (required, 3–255 chars)",
  "status": "active | archived (optional, default: active)"
}
\`\`\`

**Response 201:**
\`\`\`json
{
  "id": "uuid",
  "name": "Example",
  "status": "active",
  "created_at": "2026-04-01T00:00:00Z"
}
\`\`\`

**Errors:**
| Status | Code | Message |
|---|---|---|
| 400 | VALIDATION_ERROR | name is required |
| 401 | UNAUTHORIZED | Token missing or expired |
| 403 | FORBIDDEN | User lacks permission |

---

#### Retrieve

\`\`\`
GET /[resource]/{id}/
\`\`\`

**Response 200:** Same as single object above.
**Response 404:** \`{ "code": "NOT_FOUND", "message": "Resource not found" }\`

---

#### Update

\`\`\`
PATCH /[resource]/{id}/
\`\`\`

Partial update — only fields provided are updated.

---

#### Delete

\`\`\`
DELETE /[resource]/{id}/
\`\`\`

**Response 204:** No body.

---

## 5. Error Format

All errors return a consistent structure:

\`\`\`json
{
  "code": "ERROR_CODE",
  "message": "Human-readable description",
  "details": {}
}
\`\`\`

| HTTP Status | Code | When |
|---|---|---|
| 400 | VALIDATION_ERROR | Request body fails validation |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Valid token but insufficient permissions |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Duplicate resource or state conflict |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## 6. Rate Limits

| Endpoint Group | Limit | Window |
|---|---|---|
| Auth endpoints | 10 requests | per minute |
| Read endpoints | 1,000 requests | per hour |
| Write endpoints | 100 requests | per hour |

Rate limit headers returned on all responses:
- \`X-RateLimit-Limit\`
- \`X-RateLimit-Remaining\`
- \`X-RateLimit-Reset\`

---

## 7. Versioning Strategy

- Current version: **v1**
- Breaking changes get a new version (v2)
- Non-breaking additions (new optional fields, new endpoints) can be added to v1
- v1 will be supported for minimum 12 months after v2 launches
- Deprecation announced via API response header: \`Deprecation: true\`

---

## 8. Pagination

All list endpoints use cursor-based or page-based pagination:

| Type | When to Use |
|---|---|
| Page-based | < 10,000 records, user-facing tables |
| Cursor-based | > 10,000 records, infinite scroll, exports |

---

## 9. Open Questions

| Question | Owner | Due |
|---|---|---|
| | | |`,
    howToUse: [
      {
        step: "Define consumers before defining endpoints",
        detail:
          "Who calls this API? The mobile app? The web frontend? A webhook from Slack? Different consumers have different pagination, auth, and error-handling needs. Write consumers first — endpoints follow from what each consumer needs.",
      },
      {
        step: "Agree on the error format before writing any endpoint",
        detail:
          "Inconsistent error shapes are the #1 complaint from frontend engineers. Define the error object structure once in Section 5, then reference it in every endpoint. Never let individual endpoints invent their own error formats.",
      },
      {
        step: "Write request and response JSON with real example values",
        detail:
          "JSON with placeholder 'string' types is better than nothing, but JSON with real values ('name': 'Bulk CSV export') lets reviewers spot semantic mistakes (wrong field names, missing fields) that type-only specs miss.",
      },
      {
        step: "Set rate limits before shipping, not after",
        detail:
          "Rate limits defined after launch feel arbitrary and break existing integrations. Define them in this spec, communicate them to integrators on day one, and include the rate limit headers so clients can manage their own throttling.",
      },
    ],
    faqs: [
      {
        q: "Should PMs write API specs or leave it entirely to engineers?",
        a: "PMs should define what the API needs to do: what data flows in, what flows out, what business rules apply, and what consumers need. Engineers define how it's implemented. The spec is the PM's deliverable; the implementation is engineering's. Leaving the spec entirely to engineering produces technically correct but product-incorrect APIs.",
      },
      {
        q: "When should we version an API?",
        a: "Version when a change breaks existing consumers: removing a field, renaming a field, changing a field's type, or removing an endpoint. Adding new optional fields, adding new endpoints, or adding new optional query params are non-breaking — they don't require a new version.",
      },
      {
        q: "What's the difference between REST and GraphQL for internal APIs?",
        a: "REST is simpler to reason about, cache, and document for teams where the PM is involved in the spec. GraphQL gives frontends more flexibility to query exactly what they need, reducing over-fetching — better for complex, data-intensive UIs with many different query patterns. For most product features, REST is the right default.",
      },
      {
        q: "How do I handle API changes after the spec is approved?",
        a: "Non-breaking changes (new optional fields, new endpoints) can be added without a new version — just update the spec and notify consumers. Breaking changes require a new version number, a migration guide, and a deprecation timeline for the old version. Document both in a changelog.",
      },
    ],
  },

  // ─── 27. Technical Debt Scorecard ───────────────────────────────────────────
  {
    slug: "technical-debt-scorecard",
    title: "Technical Debt Scorecard Template",
    shortTitle: "Technical Debt Scorecard",
    category: "PM × Engineering",
    description:
      "A PM-engineering scorecard for assessing and prioritizing technical debt. Quantify impact, risk, and effort so debt competes fairly with features on the roadmap.",
    metaDescription:
      "Free technical debt scorecard template for product managers. Assess, prioritize, and communicate tech debt to stakeholders. Download free.",
    filename: "technical-debt-scorecard-template.md",
    content: `# Technical Debt Scorecard

**Team:** [Team Name]
**Date:** [Date]
**PM:** [Name]
**Tech Lead:** [Name]
**Review Cycle:** [Quarterly / Sprint Planning]

---

## Why This Exists

Technical debt is invisible to stakeholders until it explodes. This scorecard gives you a shared language for debt prioritization that sits alongside features on the roadmap — not separate from it.

---

## Debt Inventory

| # | Debt Item | Component / Area | Age | Type | Score | Priority |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

**Type options:** Architecture, Dependency, Test Coverage, Documentation, Performance, Security

---

## Scoring Rubric

Each debt item is scored on 4 dimensions. Total = sum of all four.

### 1. Business Impact (1–5)

How much does this debt slow down feature delivery or hurt users today?

| Score | Description |
|---|---|
| 5 | Blocking feature development; engineers work around it weekly |
| 4 | Slowing feature development; adds 20–50% to estimates |
| 3 | Occasional friction; one sprint per quarter lost to workarounds |
| 2 | Minor annoyance; rarely affects delivery speed |
| 1 | No current impact; theoretical risk only |

### 2. Risk (1–5)

What is the probability and severity of failure if left unaddressed?

| Score | Description |
|---|---|
| 5 | Active security vulnerability or data integrity risk |
| 4 | High probability of production incident within 6 months |
| 3 | Moderate probability of incident within 12 months |
| 2 | Low probability; manageable if it fails |
| 1 | Negligible risk |

### 3. Fix Effort (1–5, inverted — lower effort = higher score)

| Score | Effort to Fix |
|---|---|
| 5 | < 1 day |
| 4 | 1–5 days |
| 3 | 1–2 weeks |
| 2 | 1–2 months |
| 1 | > 2 months / requires major re-architecture |

### 4. Future Cost (1–5)

How much more expensive will this debt become if we delay fixing it?

| Score | Description |
|---|---|
| 5 | Cost doubles every sprint (actively accumulating) |
| 4 | Cost grows significantly with each new feature in this area |
| 3 | Moderate growth; affected area is actively developed |
| 2 | Slow growth; area is rarely touched |
| 1 | Static; won't get worse if deferred |

---

## Scored Inventory

| # | Debt Item | Impact | Risk | Fix Effort | Future Cost | **Total** |
|---|---|---|---|---|---|---|
| 1 | | /5 | /5 | /5 | /5 | /20 |
| 2 | | /5 | /5 | /5 | /5 | /20 |
| 3 | | /5 | /5 | /5 | /5 | /20 |

---

## Priority Thresholds

| Score | Action |
|---|---|
| 16–20 | Fix this sprint (or immediately if security) |
| 11–15 | Schedule in next 1–2 sprints |
| 6–10 | Backlog with a target quarter |
| 1–5 | Acknowledge and defer; review next quarter |

---

## Remediation Plan

| Debt Item | Priority | Owner | Target Sprint | Effort Estimate | Done? |
|---|---|---|---|---|---|
| | P1 | | | | |
| | P2 | | | | |

---

## Debt-to-Feature Ratio Target

> As a team, we commit to allocating **[X]%** of each sprint to debt reduction.

Recommended baseline: 15–20% of sprint capacity for established products.

Track actuals vs target each sprint:

| Sprint | Debt % | Feature % | Comment |
|---|---|---|---|
| | | | |`,
    howToUse: [
      {
        step: "Run the inventory with engineering, not from memory",
        detail:
          "Ask engineers to add items to the debt inventory before the scoring session. Debt that lives only in an engineer's head isn't visible to the roadmap. A shared doc surfaces it and gives engineers a legitimate channel to raise concerns.",
      },
      {
        step: "Score Business Impact and Risk together (PM + TL)",
        detail:
          "PMs own the Business Impact score — they know which areas are actively being developed and what it costs in delivery time. Tech Leads own the Risk and Fix Effort scores. Score collaboratively but clearly divide ownership.",
      },
      {
        step: "Set the debt-to-feature ratio and defend it",
        detail:
          "Without a protected budget, debt fixes get cut in every sprint planning. 15–20% of capacity for debt is the industry standard for products with > 12 months of code. If your engineering leader disagrees with your proposed ratio, that's the conversation to have before sprint planning, not during.",
      },
      {
        step: "Review quarterly, not annually",
        detail:
          "Debt scores change as the product evolves. An area that was low-risk last year may be a P1 now because three new features were built on top of it. Quarterly reviews catch this drift before it becomes a crisis.",
      },
    ],
    faqs: [
      {
        q: "How do I convince stakeholders that tech debt belongs on the roadmap?",
        a: "Frame debt as risk, not engineering preference. A Risk score of 5 means 'high probability of a production incident in the next 6 months' — put that in those exact terms. Most stakeholders understand incident risk better than abstract 'refactoring' requests. Show the business cost of the debt, not just the technical description.",
      },
      {
        q: "What's the difference between technical debt and a bug?",
        a: "A bug is a defect in existing behavior. Technical debt is intentional or accumulated design/implementation choices that make future work harder. A slow API because of an unindexed query is debt. An API that returns the wrong data is a bug. Both belong on the roadmap, but they're tracked and prioritized differently.",
      },
      {
        q: "Should we track third-party dependency upgrades as technical debt?",
        a: "Yes. Dependency debt is one of the most dangerous categories because it accumulates silently and then explodes when a CVE is announced against an old library. Track major version gaps (especially security-relevant dependencies like auth libraries, HTTP clients, and ORMs) on the scorecard.",
      },
      {
        q: "How do we handle debt in a startup that's moving fast?",
        a: "Acknowledge it explicitly. Document each piece of debt when it's consciously incurred ('we're skipping proper test coverage here to hit the demo deadline — adding to debt log'). The danger isn't incurring debt — it's incurring it silently so nobody knows it exists. A visible debt log lets you make informed decisions about when to pay it down.",
      },
    ],
  },

  // ─── 28. Feature Flag Decision Template ─────────────────────────────────────
  {
    slug: "feature-flag-decision",
    title: "Feature Flag Decision Template",
    shortTitle: "Feature Flag Decision",
    category: "PM × Engineering",
    description:
      "A decision template for when and how to use feature flags. Define flag scope, rollout strategy, kill switch criteria, and cleanup schedule before shipping.",
    metaDescription:
      "Free feature flag decision template for product managers. Define flag rollout, kill switch, and cleanup schedule. Download free.",
    filename: "feature-flag-decision-template.md",
    content: `# Feature Flag Decision Template

**Feature:** [Feature Name]
**Flag Key:** [feature_name_v1]
**PM:** [Name]
**Engineer:** [Name]
**Date:** [Date]
**Target Ship Date:** [Date]

---

## 1. Flag Purpose

**Why is this feature flag needed?**

- [ ] Gradual rollout (% of users)
- [ ] A/B test (control vs treatment)
- [ ] Kill switch for risky feature
- [ ] Beta / allowlist rollout (specific users or accounts)
- [ ] Canary deployment (specific servers or regions)
- [ ] Operational toggle (off during maintenance)

**Is a flag necessary here?**

> Ask: Could we ship this to 100% of users immediately with confidence? If yes, skip the flag.

[Justify why a flag is needed or not]

---

## 2. Flag Configuration

| Setting | Value |
|---|---|
| Flag Key | \`feature_name_v1\` |
| Flag Type | Boolean / Multivariate |
| Default Value (off) | false |
| Enabled Value (on) | true |
| Platform | Web / Mobile / API |
| Targeting Scope | All users / Paid users / Beta group / % rollout |

---

## 3. Rollout Plan

| Phase | Target | % Users | Start Date | Success Criteria |
|---|---|---|---|---|
| 1 — Internal | Employees only | 100% internal | Day 1 | No errors in logs |
| 2 — Beta | Beta users (allowlist) | ~5% | Day 3 | Error rate < 0.1%; no P1 bugs |
| 3 — Ramp | General users | 10% → 25% → 50% → 100% | Week 2 | Conversion / engagement metric within 5% of baseline |
| 4 — Full | All users | 100% | Week 3 | — |

**Rollout gates:** Each phase requires the previous phase's success criteria to be met before advancing.

---

## 4. Metrics to Monitor

| Metric | Baseline | Target | Alert Threshold |
|---|---|---|---|
| Error rate | | | > 0.5% → pause rollout |
| Page load time (p95) | | | > 500ms above baseline → pause |
| [Feature adoption metric] | | | |
| [Core product metric] | | | |

---

## 5. Kill Switch Criteria

> Define exactly what triggers an immediate rollback. Don't leave this to judgment in an incident.

Automatically roll back (set flag to 0%) if:
- [ ] Error rate exceeds **[X%]** for > 5 minutes
- [ ] P95 latency exceeds baseline by > **[Xms]**
- [ ] More than **[X]** user complaints in Slack/support in 1 hour
- [ ] Any data integrity issue detected

Who can pull the kill switch: **[PM / On-call engineer / Anyone]**

How to pull it: [Link to flag in LaunchDarkly / GrowthBook / Unleash]

---

## 6. Flag Lifespan

| Date | State |
|---|---|
| [Ship date] | Flag created, off by default |
| [+1 week] | Phase 1 rollout |
| [+3 weeks] | 100% rollout (if criteria met) |
| **[+6 weeks] → Cleanup deadline** | Flag removed from code and dashboard |

**Flag cleanup owner:** [Engineer Name]
**Cleanup ticket:** [Link to Jira/Linear ticket]

> Flags that aren't cleaned up become permanent feature toggles. Set a cleanup deadline at flag creation time, not after.

---

## 7. Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Flag logic error causes different behavior for flagged vs non-flagged users | Medium | High | Code review + QA both variants |
| Flag is never cleaned up | High | Medium | Calendar reminder + ticket created now |
| Partial rollout causes inconsistent UX across sessions | Low | Low | Sticky sessions by user_id, not session |

---

## 8. Dependencies

| Dependency | Status | Owner |
|---|---|---|
| Analytics event tracking | ✅ / 🔲 | |
| Monitoring dashboard updated | ✅ / 🔲 | |
| Support team briefed | ✅ / 🔲 | |`,
    howToUse: [
      {
        step: "Decide first whether a flag is actually needed",
        detail:
          "Feature flags have a cost: code complexity, test burden, and cleanup debt. If you can ship at 100% confidence immediately, skip the flag. Use flags for features with real risk (irreversible data changes, significant UX shifts, or load concerns at scale).",
      },
      {
        step: "Define kill switch criteria before launch, not during an incident",
        detail:
          "During an incident, you're under pressure and making decisions on incomplete information. Pre-define the exact numbers that trigger a rollback (error rate, latency, complaint volume). This removes judgment from a moment when judgment is least reliable.",
      },
      {
        step: "Set the cleanup deadline at flag creation",
        detail:
          "Create the cleanup ticket and assign it to a named engineer the same day you create the flag. Flags without cleanup deadlines become permanent — they accumulate in your codebase and create confusion about what behavior is 'real'. 6 weeks after 100% rollout is a reasonable default.",
      },
      {
        step: "Gate each rollout phase on explicit success criteria",
        detail:
          "Don't advance from 10% to 50% automatically after a time delay. Gate it on actual data: error rate below threshold, no P1 bugs, core metrics within normal range. This is the entire point of a gradual rollout.",
      },
    ],
    faqs: [
      {
        q: "What's the best feature flag tool for a small team?",
        a: "GrowthBook (open source, self-hostable) is ideal for cost-conscious teams. LaunchDarkly is the enterprise standard with excellent SDKs and targeting. Unleash is a solid open-source alternative. For very small teams, a simple database-backed toggle (a Feature table in Postgres) is often sufficient before you need a dedicated platform.",
      },
      {
        q: "Should flags target users or sessions?",
        a: "Target by user_id for consistency — a user who sees variant A on their laptop should also see variant A on mobile. Session-based targeting creates a jarring experience where the same person sees different versions across sessions.",
      },
      {
        q: "How many feature flags is too many?",
        a: "There's no absolute limit, but flags that live longer than 3 months are a red flag (pun intended). If you have > 50 active flags in a codebase of < 50k lines, you likely have a cleanup backlog problem. Audit flags quarterly and delete anything that's been at 100% for > 6 weeks.",
      },
      {
        q: "Can feature flags replace blue-green deployments?",
        a: "No — they're complementary. Blue-green deployments control which version of the code runs on which servers. Feature flags control which code paths execute for which users within a single deployment. Use both: deploy to blue/green, then control user exposure with flags.",
      },
    ],
  },

  // ─── 29. Architecture Decision Record ───────────────────────────────────────
  {
    slug: "architecture-decision-record",
    title: "Architecture Decision Record (ADR) Template",
    shortTitle: "ADR Template",
    category: "PM × Engineering",
    description:
      "An Architecture Decision Record template for PM-engineering teams. Capture the context, options considered, and rationale behind key technical decisions — before institutional memory walks out the door.",
    metaDescription:
      "Free Architecture Decision Record (ADR) template. Capture technical decisions, options considered, and rationale. Download and use today.",
    filename: "architecture-decision-record-template.md",
    content: `# Architecture Decision Record

**ADR Number:** ADR-[NNN]
**Title:** [Short noun phrase describing the decision, e.g. "Use PostgreSQL as primary datastore"]
**Date:** [Date]
**Status:** Proposed / Accepted / Deprecated / Superseded by ADR-[NNN]
**Authors:** [Names]
**Deciders:** [Names]

---

## Context

> What is the situation? What problem are we solving? What forces are in play?
> Write this for a new engineer who joins 6 months from now — they need to understand *why* this decision was a decision at all.

[Write here]

---

## Decision Drivers

> What factors matter most in making this decision? List them in priority order.

1. [e.g., Must handle 10,000 concurrent connections]
2. [e.g., Must be operated by a 2-person team without a dedicated DBA]
3. [e.g., Must support JSONB for flexible schema needs]
4. [e.g., Must have strong Python client libraries]

---

## Options Considered

### Option 1: [Name]

**Description:** [What is this option?]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Estimated Cost/Effort:** [Low / Medium / High]

---

### Option 2: [Name]

**Description:**

**Pros:**
-

**Cons:**
-

**Estimated Cost/Effort:**

---

### Option 3: [Name] *(if applicable)*

**Description:**

**Pros:**
-

**Cons:**
-

---

## Decision

> State the decision clearly and unambiguously.

**We will [chosen option].**

[Brief rationale — why this option over the others, in 2–4 sentences]

---

## Consequences

### Positive
- [What becomes easier or better?]
- [What risks does this eliminate?]

### Negative / Trade-offs
- [What becomes harder?]
- [What do we give up?]

### Neutral
- [What changes but isn't clearly better or worse?]

---

## Implementation Plan

| Step | Owner | Target Date |
|---|---|---|
| | | |
| | | |

---

## Review Triggers

> Under what conditions should this ADR be revisited?

- [ ] If we exceed [X] users / [X] requests per second
- [ ] If [dependency/library] reaches end of life
- [ ] If team size grows beyond [X] engineers
- [ ] On annual review: [Date]

---

## Related Decisions

| ADR | Relationship |
|---|---|
| ADR-[NNN] | Depends on / Supersedes / Related to |

---

## References

- [Link to relevant RFC, blog post, benchmark, or prior art]`,
    howToUse: [
      {
        step: "Write the Context section for the future, not the present",
        detail:
          "The most important and most-skipped section. Write it as if you're explaining the situation to a new engineer who joins in 12 months and has zero context. What was the scale? What were the constraints? Why was this a hard decision? Without context, a future ADR reader can't evaluate whether the decision is still correct.",
      },
      {
        step: "Always document at least 2 options — even the ones you rejected",
        detail:
          "An ADR with one option isn't a record of a decision — it's a justification of something already decided. The value of an ADR is understanding why Option B was rejected, so the next engineer doesn't have to investigate and rediscover the same tradeoffs.",
      },
      {
        step: "Be explicit about trade-offs, not just benefits",
        detail:
          "The 'Consequences: Negative' section is the hardest to write and the most valuable. What do you give up by making this choice? What becomes harder? A decision with no downsides wasn't a real decision. Documenting trade-offs prevents future engineers from being blindsided by them.",
      },
      {
        step: "Set review triggers at time of decision",
        detail:
          "ADRs without review conditions become permanent law. Write down the conditions that should trigger a revisit (scale thresholds, team size changes, library EOL). Schedule an annual review at minimum. Accepted ADRs should be revisited, not just archived.",
      },
    ],
    faqs: [
      {
        q: "Who should write ADRs — PMs or engineers?",
        a: "Engineers typically write the technical sections (options, consequences, implementation). PMs write or review the Context and Decision Drivers — they know the product constraints that motivated the decision. The best ADRs are co-authored. If a PM can't explain the Context, the decision lacked a clear product rationale.",
      },
      {
        q: "How many ADRs should a team maintain?",
        a: "One per significant architectural decision. 'Significant' means: decisions that affect multiple teams, decisions about foundational technology (database, auth, deployment), or decisions that are hard to reverse. Don't write ADRs for individual feature implementations — write them for cross-cutting architectural choices.",
      },
      {
        q: "Where should ADRs live?",
        a: "In the repository, in a /docs/adr/ directory, numbered sequentially (ADR-001, ADR-002). Keeping them in the repo means they're versioned alongside the code they describe, discoverable via grep, and part of the normal code review process.",
      },
      {
        q: "Can ADRs be changed after they're accepted?",
        a: "The record itself shouldn't be edited — it's a historical document. If the decision changes, write a new ADR that supersedes the old one, and update the old ADR's status to 'Superseded by ADR-[NNN]'. This preserves the full decision history, which is the entire point.",
      },
    ],
  },

  // ─── 30. Engineering Kickoff Template ───────────────────────────────────────
  {
    slug: "engineering-kickoff",
    title: "Engineering Kickoff Template",
    shortTitle: "Engineering Kickoff",
    category: "PM × Engineering",
    description:
      "A structured engineering kickoff template for PM-engineering alignment before sprint start. Covers goals, scope, dependencies, open questions, and success criteria — in under 45 minutes.",
    metaDescription:
      "Free engineering kickoff template. Align PM and engineering on goals, scope, dependencies, and success criteria before a sprint starts. Download free.",
    filename: "engineering-kickoff-template.md",
    content: `# Engineering Kickoff Template

**Feature / Epic:** [Name]
**Sprint / Milestone:** [Sprint Number]
**Date:** [Date]
**PM:** [Name]
**Engineering Lead:** [Name]
**Attendees:** [List]
**Duration:** 45 minutes

---

## 1. Context (5 min)

**Why are we building this?**

> 2–3 sentences on the user problem, the business motivation, and why now.

[Write here]

**Success metric:**

> One number that tells us if this shipped and worked.

[e.g., "Onboarding completion rate increases from 42% to 60% within 30 days of ship"]

---

## 2. Scope (10 min)

### In Scope

| # | Feature / Behavior | Notes |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Out of Scope (Explicitly)

| Item | Why Excluded | When It Might Come Back |
|---|---|---|
| | | |
| | | |

### What "Done" Looks Like

- [ ] Feature works end-to-end for all user types (Free, Pro, Admin)
- [ ] Unit tests cover all business logic branches
- [ ] API endpoints return correct responses for valid and invalid inputs
- [ ] Error states are handled and show meaningful messages
- [ ] Feature flag at 100% (if applicable)
- [ ] Analytics event tracking added
- [ ] [Add specific acceptance criteria]

---

## 3. Design (5 min)

| Asset | Status | Link |
|---|---|---|
| Figma designs | ✅ / 🔲 | |
| Mobile designs | ✅ / 🔲 / N/A | |
| Edge case states (empty, error, loading) | ✅ / 🔲 | |
| Responsive specs | ✅ / 🔲 / N/A | |

**Open design questions:**

| Question | Owner | Due |
|---|---|---|
| | | |

---

## 4. Technical Approach (10 min)

> Engineering lead summarizes the implementation plan. PM listens for scope or logic surprises.

**Backend:**
[What new models, endpoints, or jobs are needed?]

**Frontend:**
[What new components or routes are needed?]

**Infrastructure:**
[Any new infra, queues, or migrations needed?]

**Dependencies on other teams:**
[API team / Data team / DevOps / etc.]

---

## 5. Risks and Open Questions (10 min)

| Risk / Question | Owner | Due Date | Resolution |
|---|---|---|---|
| | | | |
| | | | |

**Blockers today:**

| Blocker | Who's unblocking it | ETA |
|---|---|---|
| | | |

---

## 6. Timeline (5 min)

| Milestone | Target Date | Owner |
|---|---|---|
| Spec / design finalized | | PM + Design |
| Backend implementation | | Engineering |
| Frontend implementation | | Engineering |
| QA sign-off | | QA |
| Feature flag at 5% | | Engineering |
| Feature flag at 100% | | PM + Engineering |
| Announcement / changelog entry | | PM |

---

## 7. Communication Plan

| Stakeholder | Communication Method | Frequency |
|---|---|---|
| Leadership | Sprint review demo | Weekly |
| Sales / CS | Async Slack update | On launch |
| Users | In-app announcement | On launch |

---

## Action Items from This Meeting

| Action | Owner | Due |
|---|---|---|
| | | |
| | | |

---

*Next sync: [Date and format — standup / async update / mid-sprint check-in]*`,
    howToUse: [
      {
        step: "Define success metric before writing scope",
        detail:
          "The success metric (Section 1) is the most important part of the kickoff. If PM and engineering can't agree on how to measure success, they'll also disagree on scope. Define it first. Everything else — in scope, out of scope, done criteria — flows from it.",
      },
      {
        step: "Fill the Out of Scope table explicitly",
        detail:
          "Teams that only define what's in scope consistently face scope creep. Explicitly writing 'multi-language support: excluded from this sprint' prevents a stakeholder from assuming it's included. The more controversial the exclusion, the more important it is to write it down.",
      },
      {
        step: "Have engineering explain the technical approach in their own words",
        detail:
          "When engineers describe the approach back to PM in the kickoff, they often surface scope surprises: 'Wait, to do X, we also need to build Y' or 'This requires a schema migration that needs a maintenance window.' These surprises are much cheaper to handle in the kickoff than in week 3.",
      },
      {
        step: "Record action items with named owners before the meeting ends",
        detail:
          "End every kickoff by reading the action items list aloud, confirming owners, and setting due dates. 'Someone' as the owner means no one. The kickoff template's job is to eliminate ambiguity — action items without names are the biggest source of post-kickoff ambiguity.",
      },
    ],
    faqs: [
      {
        q: "How is an engineering kickoff different from sprint planning?",
        a: "Sprint planning covers the whole sprint backlog across multiple features. An engineering kickoff is feature-specific — it's a focused session for one epic or feature set where PM and engineering align on scope, approach, and risks before the sprint starts. You might run 1–3 kickoffs per sprint for the largest features.",
      },
      {
        q: "Should design be in the kickoff?",
        a: "Yes — ideally design attends or has already synced with PM before the kickoff. If designs aren't ready, that's a blocker, not a 'we'll figure it out' — document it in the blockers table and don't start engineering work until it's resolved. Building without finalized designs doubles rework.",
      },
      {
        q: "What if the feature is too large for 45 minutes?",
        a: "Split the kickoff into two sessions: a scoping session (define in/out scope and success metric) and a technical deep-dive (approach, dependencies, risks). Features too large for a 90-minute total kickoff are probably too large for a single sprint — consider breaking the epic into smaller deliverables.",
      },
      {
        q: "How do we handle kickoffs for bug fixes vs feature work?",
        a: "Bug fixes rarely need a full kickoff — a Jira comment with root cause, fix approach, and test plan is usually enough. Use the kickoff template for features, epics, significant refactors, and migrations. The threshold: if the work involves cross-team coordination or takes > 3 days, do a kickoff.",
      },
    ],
  },

  // ─── 31. Design Review Checklist ───────────────────────────────────────────
  {
    slug: "design-review-checklist",
    title: "Design Review Checklist",
    shortTitle: "Design Review",
    category: "PM × Engineering",
    description:
      "A structured checklist for PM-led design reviews. Covers usability, accessibility, edge cases, copy, responsiveness, and handoff readiness — so nothing slips between design and build.",
    metaDescription:
      "Free design review checklist for product managers. Covers usability, accessibility, edge cases, copy, and handoff readiness. Copy-paste ready.",
    filename: "design-review-checklist.md",
    content: `# Design Review Checklist
**Feature:** [Feature name]
**Designer:** [Name]
**PM Reviewer:** [Name]
**Date:** [Date]
**Status:** [ ] Draft  [ ] Reviewed  [ ] Approved  [ ] Needs revision

---

## 1. Requirements alignment

| Criterion | Pass | Notes |
|---|---|---|
| Designs cover all user stories in the PRD | | |
| Acceptance criteria are visually satisfied | | |
| Out-of-scope items are not designed (no scope creep) | | |
| Success metric is measurable from the designed flow | | |

**Gaps / missing requirements:**
[List any PRD requirements not addressed in designs]

---

## 2. User flows & edge cases

| Criterion | Pass | Notes |
|---|---|---|
| Happy path is clear and complete | | |
| Empty state is designed (no data, first-time user) | | |
| Error states are designed (API failure, validation errors) | | |
| Loading states are designed (skeleton screens or spinners) | | |
| Confirmation / success states are designed | | |
| Destructive action warnings are present (delete, cancel) | | |
| Timeout / session expiry handling is designed | | |

**Missing states:**
[List any states that need to be designed before handoff]

---

## 3. Usability

| Criterion | Pass | Notes |
|---|---|---|
| Primary action is visually prominent (clear CTA hierarchy) | | |
| Navigation / back behaviour is intuitive | | |
| Form validation messages are specific and actionable | | |
| No more than one primary CTA per screen | | |
| Task can be completed in ≤ 5 steps (or justified if more) | | |
| Cognitive load is acceptable — no screen is overwhelming | | |

**Usability concerns:**
[Note any flows that feel confusing or require explanation]

---

## 4. Copy & content

| Criterion | Pass | Notes |
|---|---|---|
| All copy is final (no "Lorem ipsum" or placeholder text) | | |
| Button labels are action-oriented (verb + noun) | | |
| Error messages explain what went wrong and what to do | | |
| Empty state copy sets expectation and provides next action | | |
| Tone is consistent with existing product voice | | |
| Character limits are tested (truncation handled gracefully) | | |

**Copy issues:**
[List any placeholder copy or tone inconsistencies]

---

## 5. Accessibility

| Criterion | Pass | Notes |
|---|---|---|
| Colour contrast meets WCAG AA (4.5:1 text, 3:1 UI elements) | | |
| Interactive elements are not colour-only (icons, labels) | | |
| Focus order is logical for keyboard navigation | | |
| Form inputs have labels (not just placeholder text) | | |
| Images have alt text noted in spec | | |
| Touch targets are ≥ 44×44px on mobile | | |

**Accessibility gaps:**
[List any accessibility issues to resolve before handoff]

---

## 6. Responsiveness & platform

| Criterion | Pass | Notes |
|---|---|---|
| Mobile (375px) breakpoint is designed | | |
| Tablet (768px) breakpoint is designed (if applicable) | | |
| Desktop (1280px+) breakpoint is designed | | |
| No horizontal scroll on mobile | | |
| Native patterns used where appropriate (bottom sheets, swipe) | | |

---

## 7. Design system consistency

| Criterion | Pass | Notes |
|---|---|---|
| Components are from the existing design system | | |
| New components are documented / added to system | | |
| Spacing follows the grid (4pt or 8pt system) | | |
| Typography matches type scale | | |
| Colours are from the defined palette | | |

**New components / deviations:**
[List any net-new components that need to be built or any intentional design system deviations]

---

## 8. Handoff readiness

| Criterion | Pass | Notes |
|---|---|---|
| All assets are exported (icons, images, custom graphics) | | |
| Interaction notes are annotated (animations, transitions, timing) | | |
| Prototype link is available for engineer reference | | |
| Responsive specs are annotated for all breakpoints | | |
| Design file is organised and named correctly | | |

---

## 9. Open questions

| Question | Owner | Due |
|---|---|---|
| [Question 1] | | |
| [Question 2] | | |

---

## Review decision

- [ ] **Approved** — ready for engineering handoff
- [ ] **Approved with minor changes** — changes listed above, no re-review needed
- [ ] **Needs revision** — re-review required before handoff

**Reviewer sign-off:** ____________________  Date: ________`,
    howToUse: [
      {
        step: "Review flows, not screens",
        detail:
          "The most common mistake in design reviews is evaluating individual screens in isolation. Walk through the complete user flow — from entry point to success state — for each user story. A screen that looks fine in isolation often reveals a broken transition or missing state when viewed as a sequence.",
      },
      {
        step: "Prioritise edge cases over happy path",
        detail:
          "The happy path is usually well-designed. The edge cases — empty states, error states, loading states, character limit overflow — are where designs break down in production. Allocate at least 30% of your review time to edge cases.",
      },
      {
        step: "Don't approve placeholder copy",
        detail:
          "Lorem ipsum and placeholder text hide real problems: a button label that's 3 words in English might be 8 words in Hindi and break the layout. A generic error message ('Something went wrong') that ships because review didn't flag it becomes permanent. Require final copy before handoff.",
      },
      {
        step: "Check accessibility early, not at the end",
        detail:
          "Accessibility issues found in design review take 10 minutes to fix. The same issues found in QA take hours of engineering rework. Colour contrast, touch target size, and keyboard focus order are all visible in design files before a line of code is written.",
      },
    ],
    faqs: [
      {
        q: "Who should run the design review — PM or design lead?",
        a: "Both should be present, but the PM leads the requirements-alignment and user flow sections while the design lead leads the design system and handoff readiness sections. The review is collaborative — it's not a PM gatekeeping design, it's PM and design ensuring nothing is missed before engineering starts.",
      },
      {
        q: "Should engineers attend the design review?",
        a: "At least one engineer should attend, specifically to flag technical feasibility concerns and to ask questions about interaction annotations. Engineers who attend the design review start the sprint with significantly better context than engineers who only see the Figma link in a Jira ticket.",
      },
      {
        q: "What if a design review blocks the sprint start?",
        a: "If blocking issues are found, fix them before engineering starts — not in parallel. The cost of a 2-day design fix before development is dramatically lower than a 2-day design change after 5 days of engineering work. If the issues are minor, approve with conditions and ensure changes are made before the component is built.",
      },
      {
        q: "How detailed should annotations be in the handoff?",
        a: "Annotations should answer the questions engineers will ask: 'What happens when the user hovers?', 'What's the animation timing?', 'What are the truncation rules?', 'What happens if this string is 100 characters?'. If an engineer has to guess, the annotation is insufficient.",
      },
    ],
  },

  // ─── 32. Post-Mortem ────────────────────────────────────────────────────────
  {
    slug: "post-mortem",
    title: "Post-Mortem Template",
    shortTitle: "Post-Mortem",
    category: "PM × Engineering",
    description:
      "A blameless post-mortem template for product incidents and failed launches. Documents what happened, why it happened, what was learned, and what changes will prevent recurrence.",
    metaDescription:
      "Free blameless post-mortem template for product and engineering teams. Covers timeline, root cause analysis, 5 Whys, and action items. Copy-paste ready.",
    filename: "post-mortem.md",
    content: `# Post-Mortem
**Incident / Event:** [Brief title]
**Date of incident:** [Date]
**Date of post-mortem:** [Date]
**Severity:** [ ] P0 — all users affected  [ ] P1 — significant subset  [ ] P2 — minor / limited impact
**Facilitator:** [Name]
**Attendees:** [Names]
**Status:** [ ] Draft  [ ] Final  [ ] Action items in progress

---

## 1. Summary

**What happened** (2–3 sentences, no jargon):
[Plain-language description of what users experienced and for how long]

**Impact:**
- Users affected: [number or %, or "unknown"]
- Duration: [start time] → [end time] = [total duration]
- Revenue / business impact: [if known]
- Data loss: [ ] Yes  [ ] No

---

## 2. Timeline

| Time (UTC) | Event |
|---|---|
| [HH:MM] | [First sign of issue / alert triggered] |
| [HH:MM] | [Team notified / on-call paged] |
| [HH:MM] | [Initial investigation started] |
| [HH:MM] | [Hypothesis formed: suspected cause] |
| [HH:MM] | [Mitigation applied / rollback initiated] |
| [HH:MM] | [Service restored / incident resolved] |
| [HH:MM] | [Post-mortem scheduled] |

---

## 3. Root cause analysis

### Immediate cause
[The direct technical or process failure that caused the incident]
*Example: "A deploy at 14:32 introduced a null pointer exception in the payment flow."*

### Contributing factors
[The conditions that allowed the immediate cause to happen — these are the real leverage points]

1. **[Factor 1]:** [Explanation]
2. **[Factor 2]:** [Explanation]
3. **[Factor 3]:** [Explanation]

### 5 Whys

| Why | Answer |
|---|---|
| Why did [incident] happen? | [Answer] |
| Why did [answer 1] happen? | [Answer] |
| Why did [answer 2] happen? | [Answer] |
| Why did [answer 3] happen? | [Answer] |
| Why did [answer 4] happen? | [Root cause] |

### Root cause (single sentence):
> [The fundamental systemic reason this incident occurred]

---

## 4. Detection & response

| Question | Answer |
|---|---|
| How was the incident detected? | [Alert / customer report / manual discovery] |
| How long until detection after onset? | [Duration] |
| How long from detection to resolution? | [Duration] |
| Was the runbook followed? | [ ] Yes  [ ] No  [ ] No runbook existed |
| Was escalation appropriate and timely? | [ ] Yes  [ ] No — explain: |

**What slowed the response?**
[List any information gaps, missing tooling, or process failures that extended the incident]

---

## 5. What went well

[List things that worked as intended — detection that fired correctly, clear communication, fast rollback, good runbook. This is not spin — genuine positives should be reinforced.]

- [Item 1]
- [Item 2]
- [Item 3]

---

## 6. What went wrong

[List failures honestly — missing monitoring, slow escalation, insufficient testing, lack of feature flags, etc. This is blameless: focus on systems and processes, not individuals.]

- [Item 1]
- [Item 2]
- [Item 3]

---

## 7. Action items

| Action | Owner | Type | Due date | Status |
|---|---|---|---|---|
| [Action 1] | [Name] | Prevention / Detection / Process | [Date] | Open |
| [Action 2] | [Name] | Prevention / Detection / Process | [Date] | Open |
| [Action 3] | [Name] | Prevention / Detection / Process | [Date] | Open |

**Action types:**
- **Prevention** — stops this class of incident from occurring
- **Detection** — catches this class of incident faster when it does occur
- **Process** — improves response, communication, or escalation

---

## 8. Lessons learned

**What should every engineer on the team know from this incident?**
[1–3 sentences capturing the key lesson. This is the part that gets linked from future PRDs and architecture discussions.]

**Should this change our deployment / review / testing process?**
[ ] Yes — describe change: ________________________________
[ ] No

**Does this incident reveal a systemic risk elsewhere in the product?**
[ ] Yes — describe: ________________________________
[ ] No

---

## 9. Follow-up

- [ ] Action items added to Jira/Linear
- [ ] Runbook updated (or created)
- [ ] Monitoring / alerting improved
- [ ] Post-mortem shared with relevant stakeholders
- [ ] Reviewed in next sprint retrospective`,
    howToUse: [
      {
        step: "Run the post-mortem within 72 hours",
        detail:
          "Context decays fast. The engineer who fixed the incident at 2am will remember the exact sequence of events for 48 hours and a rough outline at two weeks. The timeline and root cause sections are most accurate when written while the incident is fresh. Schedule the post-mortem before the incident is resolved — don't wait until people have moved on.",
      },
      {
        step: "Keep it blameless by focusing on systems, not people",
        detail:
          "'The deploy pipeline didn't require a second reviewer' is a system failure. 'John didn't get a second review' is a blame. Both describe the same gap. The blameless framing is not just culturally kinder — it's more accurate, because the root cause is always a system that allowed one person's error to propagate unchecked.",
      },
      {
        step: "The 5 Whys stops when you reach something you can actually fix",
        detail:
          "The 5 Whys exercise is complete when you reach a root cause that has a concrete, ownable action. If the last 'why' is 'because software is complex' or 'because mistakes happen', go back one level — that's not a root cause, it's a shrug. A good root cause has a specific action item attached to it.",
      },
      {
        step: "Action items without owners and dates are decorations",
        detail:
          "The most common post-mortem failure mode: a well-written document with three action items, none assigned to a specific person, all marked 'TBD'. In the next incident retrospective, those same three items appear again. Every action item needs a name and a date before the post-mortem is closed.",
      },
    ],
    faqs: [
      {
        q: "Should every bug have a post-mortem?",
        a: "No — post-mortems are for significant incidents: P0/P1 outages, data loss, failed launches with material business impact, or any event the team wants to learn from systematically. Minor bugs fixed in a patch don't need a post-mortem. A rough threshold: if it was escalated to leadership or affected more than 5% of users, write a post-mortem.",
      },
      {
        q: "How do we make post-mortems actually change behaviour?",
        a: "Two things: (1) action items must be tracked in the same system as regular engineering work — Jira or Linear, not a Google Doc. (2) Review open post-mortem action items in the next sprint retrospective. Post-mortems that live only in a Google Drive folder get read once and forgotten.",
      },
      {
        q: "How long should a post-mortem document be?",
        a: "Long enough to capture the timeline, root cause, and action items clearly — typically 1–3 pages. Longer is not better. The goal is a document that a new engineer can read in 15 minutes and understand what happened, why, and what changed as a result.",
      },
      {
        q: "Should customers or stakeholders see the post-mortem?",
        a: "A summarised, non-technical version should be shared with affected customers and relevant stakeholders within 48–72 hours of resolution. The internal blameless post-mortem stays internal. The external communication should cover: what happened, how long, what was affected, what's been fixed, and what will prevent recurrence.",
      },
    ],
  },

  // ─── 33. AI Feature Spec ────────────────────────────────────────────────────
  {
    slug: "ai-feature-spec",
    title: "AI Feature Spec",
    shortTitle: "AI Feature Spec",
    category: "PM × AI",
    description:
      "A PRD template for product features that incorporate AI/ML models. Covers model selection rationale, confidence thresholds, fallback behaviour, evaluation criteria, and responsible AI considerations.",
    metaDescription:
      "Free AI feature spec template for product managers. Covers model selection, confidence thresholds, fallback behaviour, evaluation criteria, and responsible AI. Copy-paste ready.",
    filename: "ai-feature-spec.md",
    content: `# AI Feature Spec
**Feature name:** [Name]
**PM:** [Name]
**Engineering lead:** [Name]
**AI/ML lead:** [Name]
**Date:** [Date]
**Status:** [ ] Draft  [ ] In review  [ ] Approved

---

## 1. Problem & motivation

**What problem does this feature solve?**
[Clear problem statement grounded in user evidence]

**Why does this require AI?**
[Explicit justification — could this be solved with rules or search? If not, why not?]

**User evidence (source → frequency):**
- [Source 1] — [N] mentions
- [Source 2] — [N] mentions

---

## 2. Feature description

**What the user experiences:**
[Plain-language description of the feature from the user's perspective — no model jargon]

**Input:** [What data goes into the model — user text, structured data, documents, images]
**Output:** [What the model produces — label, score, generated text, ranked list]
**Where in the product:** [Which screen / workflow / API endpoint]

---

## 3. Model & approach

| Decision | Choice | Rationale |
|---|---|---|
| Model / approach | [e.g. Claude claude-sonnet-4-6, fine-tuned BERT, heuristic baseline] | |
| Hosted vs self-hosted | [API / cloud / on-device] | |
| Latency budget | [e.g. < 2s P95] | |
| Cost per inference | [estimated] | |
| Prompt vs fine-tune | [zero-shot / few-shot / fine-tuned] | |

**Prompt design (if LLM):**
\`\`\`
[Draft prompt or system instructions — include output format specification]
\`\`\`

---

## 4. Confidence & thresholds

| Threshold | Behaviour |
|---|---|
| High confidence (≥ [X]) | Show result to user directly |
| Medium confidence ([Y]–[X]) | Show result with caveat / "review suggested" |
| Low confidence (< [Y]) | Fall back to human review / hide AI output |

**How is confidence measured?**
[Softmax probability / LLM self-reported confidence / separate classifier / heuristic]

**Known cases where confidence is unreliable:**
[e.g. "Model overconfident on short inputs", "Confidence not calibrated for domain X"]

---

## 5. Fallback behaviour

**What happens when the model fails or is unavailable?**

| Failure mode | Fallback | User message |
|---|---|---|
| Model API timeout / error | [Retry 1x, then show manual option] | "AI processing unavailable — you can continue manually." |
| Low confidence output | [Show output with disclaimer] | "This suggestion may need review." |
| Input outside expected distribution | [Reject or flag] | "We couldn't process this input. Try rephrasing." |
| Rate limit exceeded | [Queue / degrade gracefully] | "High demand — your result will be ready in [X] seconds." |

**Can the user correct or override the AI output?**
[ ] Yes — describe edit/override UX: ________________________________
[ ] No — justify: ________________________________

---

## 6. Evaluation criteria

**What does "good enough" mean for this feature?**
Before shipping, the model must meet these criteria on the evaluation dataset:

| Metric | Target | Minimum acceptable |
|---|---|---|
| [Precision / Accuracy / BLEU / etc.] | [X%] | [Y%] |
| [Latency P50] | [Xms] | [Yms] |
| [Latency P95] | [Xms] | [Yms] |
| [Cost per 1K requests] | [$X] | [$Y] |

**Evaluation dataset:**
- Size: [N examples]
- Source: [how was it collected / labelled]
- Known biases or gaps: [document them]

**Human baseline (if applicable):**
[What accuracy does a human expert achieve on this task? The model target should be set in relation to this.]

---

## 7. Online monitoring

| Signal | Alert threshold | Owner |
|---|---|---|
| Model error rate | > [X%] | [Name] |
| Latency P95 | > [Xms] | [Name] |
| User override / correction rate | > [X%] | [Name] |
| Thumbs down / negative feedback rate | > [X%] | [Name] |
| Cost per day | > $[X] | [Name] |

**How are we collecting feedback on AI output quality?**
[ ] Explicit feedback (thumbs up/down)
[ ] Implicit signal (user edits output, user ignores output)
[ ] Manual sampling review
[ ] None planned

---

## 8. Responsible AI

| Consideration | Assessment | Mitigation |
|---|---|---|
| **Bias** — does the model perform worse for any user group? | | |
| **Hallucination** — can the model generate false information confidently? | | |
| **Privacy** — is user data sent to a third-party model provider? | | |
| **Explainability** — can we explain why the model produced this output? | | |
| **Over-reliance** — will users trust AI output without critical review? | | |
| **Misuse** — can the feature be manipulated to produce harmful outputs? | | |

**Data handling:**
- Is user data used to train / fine-tune the model? [ ] Yes  [ ] No
- Is user data sent to a third-party API? [ ] Yes (provider: ________) [ ] No
- Is data retained by the model provider? [ ] Yes  [ ] No  [ ] Unknown

---

## 9. Engineering tasks

1. [ ] Implement prompt / model inference call with timeout and retry logic
2. [ ] Add confidence threshold logic and fallback paths
3. [ ] Build user feedback collection (thumbs up/down or implicit signal)
4. [ ] Add logging: input hash, model version, confidence score, latency, cost per call
5. [ ] Set up monitoring alerts for error rate, latency, cost
6. [ ] Evaluation harness: run model against eval dataset, output metrics report
7. [ ] Feature flag to roll out to [X%] of users first
8. [ ] Rate limiting / cost cap to prevent runaway inference spend

---

## 10. Launch criteria

- [ ] Evaluation metrics meet targets on held-out test set
- [ ] Fallback behaviour tested and works correctly
- [ ] Monitoring alerts configured and tested
- [ ] Feature flag set to [X%] rollout
- [ ] Privacy / legal review complete (if user data is sent to third-party)
- [ ] Responsible AI checklist signed off`,
    howToUse: [
      {
        step: "Write the fallback before writing the happy path",
        detail:
          "AI features fail in ways that standard software doesn't: model timeouts, low-confidence outputs, distribution shifts, hallucinations. If you don't design the fallback before engineering starts, engineers will improvise it under deadline pressure — usually by showing a confusing error message or silently degrading. Define fallback behaviour in the spec.",
      },
      {
        step: "Set evaluation criteria before you see the model results",
        detail:
          "If you define 'good enough' after seeing the model's performance, you'll unconsciously anchor on what the model can achieve rather than what users need. Define the minimum acceptable metrics before the model is evaluated. If the model doesn't hit the minimum, the feature doesn't ship — or the approach changes.",
      },
      {
        step: "Justify AI explicitly — default to simpler approaches",
        detail:
          "The spec asks: 'Why does this require AI?' This question catches features where a keyword filter, a sort algorithm, or a simple classifier would be more reliable and cheaper. AI is the right choice when the feature genuinely needs generalisation or generation. It's the wrong choice when it's the trendy option.",
      },
      {
        step: "Treat user correction rate as your primary quality signal",
        detail:
          "After launch, the single most useful signal for AI output quality is how often users edit or override the output. A high correction rate means the model is saving users effort but not getting it right — useful. A very low correction rate could mean the model is great, or that users trust it without checking — dangerous. Instrument both.",
      },
    ],
    faqs: [
      {
        q: "Do I need this template for every feature that uses an LLM API call?",
        a: "Yes, if the LLM output is user-facing. A background data-enrichment call that users never see can use a lighter-weight spec. But if users see, act on, or trust the model output, you need explicit decisions on confidence thresholds, fallback behaviour, and responsible AI — regardless of how simple the call seems.",
      },
      {
        q: "What if we don't know which model to use yet?",
        a: "Document the evaluation criteria first (Section 6) and then run model comparisons against those criteria. The model choice should be driven by your defined metrics — latency, quality, cost — not by what the team is most familiar with.",
      },
      {
        q: "How do we handle the responsible AI section if we're a small team?",
        a: "Fill it in honestly, even if the mitigations are lightweight. 'We reviewed and decided the bias risk is low because the feature only processes structured data' is a legitimate entry. The goal is explicit decision-making — not a compliance theatre checkbox. Small teams can do this in 20 minutes.",
      },
      {
        q: "What's the difference between confidence threshold and evaluation accuracy?",
        a: "Evaluation accuracy is measured offline against a labelled dataset before you ship. Confidence threshold is the real-time signal the model produces for each individual inference. You need both: offline accuracy tells you the model works on average; confidence thresholds determine how you handle cases where the model is uncertain in production.",
      },
    ],
  },

  // ─── 34. LLM Evaluation Scorecard ──────────────────────────────────────────
  {
    slug: "llm-evaluation-scorecard",
    title: "LLM Evaluation Scorecard",
    shortTitle: "LLM Eval",
    category: "PM × AI",
    description:
      "A structured scorecard for evaluating LLM outputs against product quality criteria. Use it when comparing models, prompt variants, or assessing whether output quality meets the bar to ship.",
    metaDescription:
      "Free LLM evaluation scorecard for product managers. Score models on accuracy, completeness, format, tone, and edge cases. Compare models and make go/no-go decisions.",
    filename: "llm-evaluation-scorecard.md",
    content: `# LLM Evaluation Scorecard
**Feature / use case:** [Name]
**Evaluator(s):** [Names]
**Date:** [Date]
**Models / prompts compared:** [List]

---

## 1. What we're evaluating

**Task description:**
[Plain description of what the LLM is being asked to do — e.g. "Extract structured pain points from a user interview transcript"]

**Input format:**
[Describe the input — transcript, document, structured data, etc.]

**Expected output format:**
[Describe the expected output — e.g. "JSON array of {type, content, quote} objects"]

**Sample inputs used in this evaluation:**
| ID | Input description | Source |
|---|---|---|
| S1 | [Brief description] | [e.g. Real customer transcript] |
| S2 | [Brief description] | |
| S3 | [Brief description] | |

---

## 2. Scoring rubric

Score each criterion 1–5 using the definitions below.

| Score | Meaning |
|---|---|
| 5 | Excellent — meets or exceeds expectations, no issues |
| 4 | Good — minor issues that don't affect usability |
| 3 | Acceptable — noticeable issues but output is still usable |
| 2 | Poor — significant issues, output needs substantial correction |
| 1 | Failing — output is incorrect, harmful, or unusable |

---

## 3. Evaluation criteria

### A. Accuracy & factual correctness
*Does the output contain only information that can be traced to the input? No hallucinated facts.*

| Sample | Model A | Model B | Notes |
|---|---|---|---|
| S1 | /5 | /5 | |
| S2 | /5 | /5 | |
| S3 | /5 | /5 | |
| **Average** | | | |

### B. Completeness
*Does the output capture all relevant information from the input? Nothing significant is missed.*

| Sample | Model A | Model B | Notes |
|---|---|---|---|
| S1 | /5 | /5 | |
| S2 | /5 | /5 | |
| S3 | /5 | /5 | |
| **Average** | | | |

### C. Format adherence
*Does the output match the required format exactly — correct JSON schema, required sections, length constraints?*

| Sample | Model A | Model B | Notes |
|---|---|---|---|
| S1 | /5 | /5 | |
| S2 | /5 | /5 | |
| S3 | /5 | /5 | |
| **Average** | | | |

### D. Relevance
*Is the output relevant to the task? No off-topic content, tangents, or unnecessary caveats.*

| Sample | Model A | Model B | Notes |
|---|---|---|---|
| S1 | /5 | /5 | |
| S2 | /5 | /5 | |
| S3 | /5 | /5 | |
| **Average** | | | |

### E. Tone & voice
*Does the output match the expected tone — professional, concise, consistent with product voice?*

| Sample | Model A | Model B | Notes |
|---|---|---|---|
| S1 | /5 | /5 | |
| S2 | /5 | /5 | |
| S3 | /5 | /5 | |
| **Average** | | | |

### F. Edge case handling
*How does the model behave on ambiguous, short, noisy, or out-of-distribution inputs?*

| Edge case | Model A | Model B | Notes |
|---|---|---|---|
| Empty / very short input | /5 | /5 | |
| Input in unexpected language | /5 | /5 | |
| Input with contradictory information | /5 | /5 | |
| Sensitive / potentially harmful input | /5 | /5 | |
| **Average** | | | |

---

## 4. Summary scorecard

| Criterion | Weight | Model A (raw avg) | Model A (weighted) | Model B (raw avg) | Model B (weighted) |
|---|---|---|---|---|---|
| Accuracy | 30% | | | | |
| Completeness | 25% | | | | |
| Format adherence | 20% | | | | |
| Relevance | 15% | | | | |
| Tone & voice | 5% | | | | |
| Edge case handling | 5% | | | | |
| **Total weighted score** | 100% | | **/5** | | **/5** |

---

## 5. Latency & cost

| Metric | Model A | Model B |
|---|---|---|
| Median latency (P50) | | |
| P95 latency | | |
| Avg tokens in | | |
| Avg tokens out | | |
| Cost per 1K requests (estimated) | | |

---

## 6. Failure modes observed

**Model A failures:**
- [Describe specific failures observed — type, frequency, severity]

**Model B failures:**
- [Describe specific failures observed]

---

## 7. Decision

**Selected model / prompt:** [Name]
**Reason:** [1–2 sentences explaining why this choice won on the criteria that matter most]

**Minimum bar met?**
- [ ] Accuracy ≥ [target]%
- [ ] P95 latency ≤ [target]ms
- [ ] Cost per 1K requests ≤ $[target]
- [ ] No critical failure modes observed

**Conditions / caveats for shipping:**
[Any known gaps or edge cases to monitor post-launch]`,
    howToUse: [
      {
        step: "Weight criteria before you see the scores",
        detail:
          "The weights in Section 4 should be agreed before running the evaluation. If you see the scores first, you'll unconsciously weight the criteria that favour the model you prefer. For a PRD generation task, accuracy might be 40%; for a copywriting task, tone might be 30%. Set weights based on what matters to users.",
      },
      {
        step: "Use real customer data as evaluation samples",
        detail:
          "Synthetic inputs produce artificially clean results. Real customer transcripts, support tickets, or feedback have the noise, ambiguity, and off-topic content that models encounter in production. An LLM that scores 4.8/5 on clean samples and 2/5 on real inputs will fail in production.",
      },
      {
        step: "Always include at least one adversarial / edge case input",
        detail:
          "Test the empty input, the 1-word input, the input in an unexpected language, and the input that could produce harmful output. Models that aren't tested on edge cases ship with silent failure modes — output that looks correct but isn't, or refusals that show a raw error to users.",
      },
      {
        step: "Document failures, not just scores",
        detail:
          "An average score of 3.8 doesn't tell you whether the model fails consistently on one type of input or intermittently across many. Section 6 (failure modes) is often more valuable than the scorecard itself — it tells you what to monitor and what to include in the system prompt to mitigate.",
      },
    ],
    faqs: [
      {
        q: "How many samples do I need for a reliable evaluation?",
        a: "For an initial model selection decision, 20–50 diverse samples is usually enough to identify clear quality differences. For a go/no-go shipping decision, 100+ samples with a mix of real and edge case inputs gives higher confidence. For high-stakes applications (medical, legal, financial), consider 500+ with domain expert labelling.",
      },
      {
        q: "Should evaluations be done by PM, engineering, or a domain expert?",
        a: "Ideally at least two independent evaluators to reduce bias. For domain-specific tasks (legal, medical, fintech), include a domain expert. PM evaluates against user needs; engineering evaluates format and reliability. Inter-rater agreement — how often your evaluators agree — is itself a useful signal.",
      },
      {
        q: "How often should we re-run evaluations?",
        a: "Re-evaluate when: (1) the model provider releases a new version, (2) you change the prompt significantly, (3) online monitoring signals a quality regression, or (4) the input distribution changes materially. Model quality is not static — a model that passed in January may behave differently after a provider update.",
      },
      {
        q: "What if both models score similarly?",
        a: "Break ties on cost and latency first. If those are similar too, default to the model with better edge case handling (Section 3F) — edge cases are where user trust erodes. If still tied, pick the model with the larger provider ecosystem for tooling, support, and longevity.",
      },
    ],
  },

  // ─── 35. AI Product Risk ────────────────────────────────────────────────────
  {
    slug: "ai-product-risk",
    title: "AI Product Risk Assessment",
    shortTitle: "AI Risk",
    category: "PM × AI",
    description:
      "A risk assessment framework for AI-powered product features. Identifies risks across accuracy, fairness, privacy, security, and dependency — with mitigation strategies and go/no-go criteria.",
    metaDescription:
      "Free AI product risk assessment template for product managers. Covers accuracy, fairness, privacy, security, and over-reliance risks with scoring and mitigation strategies.",
    filename: "ai-product-risk.md",
    content: `# AI Product Risk Assessment
**Feature:** [Name]
**PM:** [Name]
**Date:** [Date]
**AI approach:** [LLM / classifier / recommendation system / other]
**Risk level:** [ ] Low  [ ] Medium  [ ] High  [ ] Critical

---

## 1. Feature summary

**What does this AI feature do?**
[2–3 sentences describing the feature and what the model produces]

**Who are the users affected?**
[Describe the user population — size, technical sophistication, vulnerability]

**What decisions does the AI output influence?**
[ ] Informational only (user has full context to verify)
[ ] Assists user decision (output is one input among many)
[ ] Drives user decision (users likely to follow output without scrutiny)
[ ] Automated decision (no human in the loop)

*The higher on this list, the higher the scrutiny required.*

---

## 2. Risk register

Rate each risk: **Likelihood** (1–5) × **Impact** (1–5) = **Risk score** (1–25)

### 2.1 Accuracy & reliability risks

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Model produces incorrect output with high confidence (hallucination) | /5 | /5 | | |
| Model fails silently — no error, but wrong answer | /5 | /5 | | |
| Performance degrades on inputs outside training distribution | /5 | /5 | | |
| Model provider outage disrupts feature availability | /5 | /5 | | |
| Model version update changes output behaviour without warning | /5 | /5 | | |

### 2.2 Fairness & bias risks

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Model performs worse for certain demographic groups | /5 | /5 | | |
| Output reinforces or amplifies existing stereotypes | /5 | /5 | | |
| Training data underrepresents key user segments | /5 | /5 | | |
| Feature has disparate impact on protected characteristics | /5 | /5 | | |

### 2.3 Privacy & data risks

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| User PII sent to third-party model provider | /5 | /5 | | |
| Model memorises and reproduces sensitive training data | /5 | /5 | | |
| Prompt injection attack extracts system prompt or user data | /5 | /5 | | |
| Logs contain sensitive model inputs/outputs | /5 | /5 | | |

### 2.4 Security risks

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Adversarial input manipulates model to produce harmful output | /5 | /5 | | |
| Output contains malicious content (XSS, code injection) | /5 | /5 | | |
| Jailbreak / prompt injection bypasses content policy | /5 | /5 | | |
| Cost exhaustion attack (adversarial high-token inputs) | /5 | /5 | | |

### 2.5 User experience & over-reliance risks

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Users trust AI output without critical review | /5 | /5 | | |
| AI automation reduces user skill over time | /5 | /5 | | |
| Confusing or unexplainable outputs erode user trust | /5 | /5 | | |
| Users blame product when AI output is wrong | /5 | /5 | | |

---

## 3. Top risks summary

List all risks with score ≥ 12 (high risk) below. These require a mitigation plan before shipping.

| Risk | Score | Mitigation | Owner | Status |
|---|---|---|---|---|
| [High risk 1] | | | | |
| [High risk 2] | | | | |

---

## 4. Mitigation strategies

For each high-risk item, describe the mitigation in detail:

**[Risk name]:**
- Mitigation approach: [Description]
- Engineering effort: [ ] < 1 day  [ ] 1–3 days  [ ] 1 week+
- Residual risk after mitigation: [ ] Low  [ ] Medium  [ ] High
- Acceptable to ship with residual risk? [ ] Yes  [ ] No

---

## 5. Monitoring plan

| Signal | Threshold | Action | Owner |
|---|---|---|---|
| Model error rate | > [X%] | Page on-call | |
| User correction / override rate | > [X%] | Flag for review | |
| Negative feedback rate | > [X%] | Escalate to PM | |
| Latency P95 | > [Xms] | Alert engineering | |
| Daily inference cost | > $[X] | Alert + cap | |

**Manual sampling cadence:**
[ ] Daily  [ ] Weekly  [ ] Monthly  [ ] Never
*Recommendation: weekly manual sampling for the first month post-launch for any Medium or High risk feature.*

---

## 6. Go / No-Go criteria

**The feature may not ship if:**
- [ ] Any risk scores ≥ 20 without an accepted mitigation
- [ ] Privacy review is not complete (if user data sent to third party)
- [ ] Security review is not complete (if feature accepts user-generated input)
- [ ] Evaluation accuracy is below the minimum defined in the AI Feature Spec
- [ ] Fallback behaviour for model failure is untested

**Approval required from:**
| Stakeholder | Required for | Sign-off |
|---|---|---|
| Legal / Privacy | Any user PII sent to third-party API | |
| Security | Any user-generated input processed by model | |
| PM | All other conditions | |

---

## 7. Review history

| Date | Reviewer | Changes |
|---|---|---|
| [Date] | [Name] | Initial assessment |
| | | |`,
    howToUse: [
      {
        step: "Score likelihood and impact before discussing mitigations",
        detail:
          "Teams that jump to mitigations before scoring risks tend to under-score the risks they already have mitigations for, and over-score risks they don't know how to handle. Score the risk register cold first, then discuss mitigations for the high-score items. This surfaces risks the team had silently assumed were handled.",
      },
      {
        step: "Pay special attention to over-reliance in high-stakes domains",
        detail:
          "In consumer apps, a wrong restaurant recommendation is annoying. In fintech, a wrong compliance recommendation can cause a regulatory violation. The 'drives user decision' and 'automated decision' rows in Section 1 are the most important to assess honestly — they determine the acceptable accuracy floor and whether human-in-the-loop is required.",
      },
      {
        step: "Test prompt injection before launching any user-input feature",
        detail:
          "If users can provide any text that reaches the LLM, they can potentially inject instructions that override your system prompt. Test by having a team member attempt to extract the system prompt, produce off-topic output, or bypass content restrictions. This takes 30 minutes and catches most exploits before launch.",
      },
      {
        step: "Set a cost cap before launch",
        detail:
          "LLM inference costs scale with usage — a viral feature or a cost exhaustion attack can generate a $10,000 bill overnight. Set a daily cost cap in your model provider settings and configure an alert at 50% of the cap. This is a 10-minute setup that every AI feature should have before it goes live.",
      },
    ],
    faqs: [
      {
        q: "Is this risk assessment required for internal / admin-only AI tools?",
        a: "A lighter version, yes. Internal tools don't need the fairness or over-reliance sections to the same depth, but accuracy, privacy, and security risks apply equally — internal users can also be harmed by wrong AI output or a data breach. Use the full template for external user-facing features; use Sections 2.1, 2.3, and 2.4 for internal tools.",
      },
      {
        q: "How is this different from the AI Feature Spec?",
        a: "The AI Feature Spec defines what you're building and how (model choice, thresholds, fallback). The AI Product Risk Assessment evaluates what could go wrong across the full risk surface. Both are needed: one defines the design, the other stress-tests it. Complete the Feature Spec first, then use it as input to the Risk Assessment.",
      },
      {
        q: "What risk score threshold should trigger a no-ship decision?",
        a: "A score of 20+ (e.g. Likelihood 4 × Impact 5) should require a concrete mitigation before shipping. A score of 25 (5×5) with no viable mitigation is a no-ship condition. These thresholds should be calibrated to your product's domain — a 20 in a children's education app requires more scrutiny than a 20 in a developer tool.",
      },
      {
        q: "Who should own this document?",
        a: "PM owns the document and is responsible for completing it before the feature ships. Legal/privacy and security sign off on their sections. Engineering lead reviews the technical risk mitigations. This is a PM accountability document — not a task that can be delegated to engineering or legal.",
      },
    ],
  },
];

export function getTemplate(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export const TEMPLATE_CATEGORIES = [
  "Planning",
  "Technical Execution",
  "Research",
  "Discovery",
  "Growth",
  "PM × Engineering",
  "PM × AI",
  "PM × India",
  "Metrics & Growth",
] as const;
