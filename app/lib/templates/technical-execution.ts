import type { Template } from "./types";

export const technicalExecutionTemplates: Template[] = [
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
    keywords: ["prd template", "product requirements document template", "prd format", "prd template free", "prd template google docs"],
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
    keywords: ["user story template", "agile user story format", "user story examples", "acceptance criteria template"],
  },
  // ─── 6. Product Launch Checklist ──────────────────────────────────────────,

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
    keywords: ["acceptance criteria template", "acceptance criteria examples", "gherkin template", "user story acceptance criteria", "definition of done template"],
  },
  // ─── 11. Product Brief Template ───────────────────────────────────────────
];