import type { Template } from "./types";

export const growthTemplates: Template[] = [
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
    keywords: ["product launch checklist", "product launch plan template", "feature launch checklist free", "go live checklist product", "product release checklist"],
  },

  // ─── 7. Competitive Analysis Matrix ───────────────────────────────────────,

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
    keywords: ["go to market template", "gtm template product launch", "go to market strategy template", "product launch go to market", "gtm plan template free"],
  },

  // ─── 9. Release Notes Template ────────────────────────────────────────────,

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
    keywords: ["release notes template", "changelog template", "product update template", "release notes format", "software release notes example"],
  },

  // ─── 10. Acceptance Criteria Template ─────────────────────────────────────,

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
    keywords: ["ab test plan template", "a/b testing template product", "experiment plan template", "ab testing product management", "split test template free"],
  },

  // ─── 21. Sprint Retrospective ───────────────────────────────────────────────,

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
    keywords: ["sprint retrospective template", "agile retrospective template", "sprint retro template free", "what went well retrospective", "retrospective action items template"],
  },

  // ─── 22. RICE Scoring Template ──────────────────────────────────────────────

  // ─── 49. Customer Onboarding Checklist ───────────────────────────────────
  {
    slug: "customer-onboarding-checklist",
    title: "Customer Onboarding Checklist",
    shortTitle: "Onboarding Checklist",
    category: "Growth",
    description:
      "A PM-focused onboarding checklist covering the full user journey from signup to first value — activation milestones, friction points, in-app prompts, and a 30-day health check.",
    metaDescription:
      "Free customer onboarding checklist for product managers. Cover activation milestones, friction audit, in-app prompts, and 30-day retention signals. Copy-paste ready.",
    filename: "customer-onboarding-checklist.md",
    content: `# Customer Onboarding Checklist

**Product:** [Product or feature name]
**PM Owner:** [Name]
**Date:** [Date]
**Target Segment:** [e.g. "Individual PMs", "SMB ops teams", "Enterprise IT admins"]

---

## What Good Onboarding Looks Like

> The goal is not tutorial completion — it's **time to first value**. A user who reaches their first meaningful outcome in session 1 is 5× more likely to return in week 2.

Define your "first value" moment before checking anything else:

**First Value Event:** [e.g. "User generates their first PRD with at least 3 insights", "User sends their first report", "Team member invites a colleague"]
**Target Time to First Value:** [e.g. "< 10 minutes from signup", "< 1 session"]

---

## Phase 1: Signup & Account Setup

- [ ] Signup flow is < 3 steps
- [ ] Password requirements are clearly stated (not discovered on error)
- [ ] Email verification sends within 30 seconds
- [ ] Verification email lands in inbox, not spam (test with Gmail, Outlook, Apple Mail)
- [ ] Verification link works on mobile browser
- [ ] After verification, user lands on the right page (not a 404 or raw dashboard)
- [ ] If SSO / OAuth — flow completes in one window, no redirect loops
- [ ] Error states are human-readable (not "Error 422: Unprocessable Entity")
- [ ] Progress indicator present if setup is multi-step
- [ ] User can recover from a wrong email address

**Friction audit:**
> [Note any drop-off observed in funnel analytics — where do users abandon?]

---

## Phase 2: First Session — Activation

- [ ] Empty state is helpful, not blank (shows what to do next, not a blank canvas)
- [ ] First action is obvious from the UI (one primary CTA above the fold)
- [ ] First action is achievable in < 2 minutes with zero prior knowledge
- [ ] Sample data or a guided demo project is available (reduces blank-page paralysis)
- [ ] Tooltips / coach marks explain core vocabulary on first encounter
- [ ] Tooltips can be dismissed and don't re-appear on every visit
- [ ] Progress toward "first value" is visible to the user
- [ ] User is shown a success state after completing the first action (celebration moment)
- [ ] No dead ends — every error or empty state has a next step

**First Value Gate:**
- [ ] User reaches the First Value Event above within the target time
- [ ] Event is tracked in analytics (not just assumed)

---

## Phase 3: Email Onboarding Sequence

- [ ] Welcome email sends immediately after signup (not after verification)
- [ ] Welcome email content matches the product — no generic SaaS template language
- [ ] Day 2 email: nudge users who haven't reached First Value Event
- [ ] Day 5 email: feature highlight for users who have reached First Value
- [ ] Day 10 email: social proof or use-case story
- [ ] Unsubscribe works and is GDPR/CAN-SPAM compliant
- [ ] Emails render correctly on mobile (test in Litmus or equivalent)
- [ ] From name is recognizable (not "noreply@company.com")
- [ ] Reply-to is a real inbox that gets read

**Email sequence map:**

| Day | Trigger | Subject | Goal |
|---|---|---|---|
| 0 | Signup | [e.g. "Welcome to PMRead — here's where to start"] | First login |
| 2 | No First Value | [e.g. "Haven't gotten started? Here's 3 minutes"] | Activation |
| 5 | First Value reached | [e.g. "You've got your first PRD — here's what's next"] | Second session |
| 10 | Active user | [e.g. "How [Customer] uses PMRead for sprint planning"] | Habit formation |

---

## Phase 4: In-App Onboarding Elements

- [ ] Onboarding checklist (sidebar or dashboard widget) with completion %
- [ ] Checklist items are actionable, not informational ("Upload your first file" not "Learn about uploads")
- [ ] Checklist auto-hides after completion (does not persist as clutter)
- [ ] Feature discovery tooltips fire contextually (on relevant page/state, not on every page)
- [ ] Help docs linked from within the app (not only in a footer link)
- [ ] In-app chat or support widget accessible during onboarding
- [ ] Video walkthrough available (2–3 min max, linked from empty state or checklist)

---

## Phase 5: 30-Day Health Check

Review these signals at day 30 for each new cohort:

| Signal | Target | Actual | Status |
|---|---|---|---|
| Day 1 retention (returned after signup day) | > 40% | | |
| Day 7 retention | > 25% | | |
| Day 30 retention | > 15% | | |
| % reached First Value Event | > 60% | | |
| % completed onboarding checklist | > 40% | | |
| Support tickets in first 7 days (topic) | < 5% of cohort | | |
| NPS / CSAT at day 14 | > 30 NPS | | |

**Top friction points identified this cohort:**
1. [e.g. "30% of users abandon at step 2 of project setup"]
2. [e.g. "Most common day-1 support question: 'how do I invite teammates'"]

**Actions for next cohort:**
- [ ] [Improvement 1]
- [ ] [Improvement 2]

---

## Onboarding Anti-Patterns (Avoid These)

- **Forced product tour on login** — users skip it. Contextual tips beat linear tours.
- **Requiring credit card at signup** — drops activation by 20–40% in most B2B SaaS.
- **Generic empty state** — "No projects yet" is not a CTA. "Create your first project in 2 minutes →" is.
- **Verification email > 2 minutes** — users move on. Check your sending infra.
- **Onboarding that teaches features, not outcomes** — show the user what they can do, not how the system works.
`,
    howToUse: [
      {
        step: "Define your First Value Event before reviewing the checklist",
        detail:
          "Everything in this checklist is in service of getting the user to one moment: the first time they get genuine value from the product. If you can't articulate that moment, the checklist will optimize for feature exposure rather than user success. Write it at the top before proceeding.",
      },
      {
        step: "Run through Phase 1–4 as a new user",
        detail:
          "Open an incognito window, sign up with a fresh email, and go through the entire flow while checking items off. Do this with someone who has never used the product (a friend, a new hire, a designer). You will find friction you have been blind to.",
      },
      {
        step: "Instrument every phase before optimizing",
        detail:
          "You need funnel data for each phase to know where to invest. Guessing that the email sequence is the problem when 40% of users abandon at signup is wasted effort. Set up event tracking for each phase gate before running the 30-day health check.",
      },
      {
        step: "Review Phase 5 by cohort, not by overall averages",
        detail:
          "Day 30 retention averaged across all time loses the signal in noise. Compare the August cohort to the September cohort after you made an onboarding change — that's how you know if it worked. Cohort analysis is the only honest measure of onboarding improvement.",
      },
      {
        step: "Treat onboarding as a product surface, not a one-time project",
        detail:
          "Onboarding decays as the product changes. A tooltip written for v1 that refers to a button that no longer exists creates confusion. Assign someone to own onboarding health as an ongoing metric — not a quarterly audit.",
      },
    ],
    faqs: [
      {
        q: "What's the most common onboarding mistake PMs make?",
        a: "Optimizing for tutorial completion instead of first value. A user who watches all 5 onboarding videos and never sends a real message has not been successfully onboarded. Track the First Value Event as your north star, not 'checklist completed %'.",
      },
      {
        q: "Should onboarding be the same for all user types?",
        a: "No. A solo PM and an enterprise team have different goals, different first actions, and different success criteria. If you have meaningfully different segments, consider branching the onboarding flow: 'Are you using this for yourself or with a team?' routes to different checklists and email sequences.",
      },
      {
        q: "How long should the onboarding email sequence run?",
        a: "For most SaaS products: 14 days is sufficient. After 14 days, users are either active (shift to feature education) or churned (shift to win-back, not more onboarding). Extending onboarding emails past 30 days for inactive users rarely works and trains users to ignore your domain.",
      },
      {
        q: "When should you use an in-app tour vs. contextual tooltips?",
        a: "In-app tours (modal overlays on login) work only when the product is very simple and the first action is genuinely unclear. For any product with more than 3 features, users skip tours. Contextual tooltips that fire when a user first encounters a feature are 3–5× more effective than tours because they appear when the user is motivated.",
      },
      {
        q: "What's a good day-30 retention target for a new SaaS product?",
        a: "Benchmarks vary by category: B2B SaaS tools average 20–35% D30. Consumer apps average 10–20%. The more important metric is the delta between cohorts — if D30 improves from 18% to 24% after an onboarding redesign, that's a strong signal regardless of absolute benchmark.",
      },
    ],
    keywords: ["customer onboarding checklist", "saas onboarding template", "user onboarding checklist product", "client onboarding checklist free", "onboarding plan template"],
  },

  // ─── 50. Feature Announcement Template ───────────────────────────────────
  {
    slug: "feature-announcement",
    title: "Feature Announcement Template",
    shortTitle: "Feature Announcement",
    category: "Growth",
    description:
      "A complete feature announcement template covering in-app messaging, email, changelog entry, social post, and internal sales/support enablement — so every launch reaches every audience consistently.",
    metaDescription:
      "Free feature announcement template for product managers. Cover in-app, email, changelog, social, and internal enablement for every launch. Copy-paste ready.",
    filename: "feature-announcement.md",
    content: `# Feature Announcement Template

**Feature Name:** [Name]
**Launch Date:** [Date]
**PM Owner:** [Name]
**Tiers Affected:** [ ] All · [ ] Pro+ · [ ] Team+ · [ ] Enterprise only

---

## Core Message (Write This First)

Before drafting any channel-specific copy, align on one message:

**What changed:** [One sentence — what the feature does]
**Why it matters to the user:** [One sentence — the outcome, not the capability]
**Who it's for:** [The primary user segment]
**Call to action:** [The single next step you want them to take]

> Example: "You can now generate a shareable read-only link for any PRD — send it to engineers and designers without needing them to create an account. Useful for review cycles and stakeholder presentations. [Try it now →]"

---

## 1. In-App Announcement

**Format:** [ ] Banner · [ ] Modal · [ ] Tooltip · [ ] What's New tab · [ ] None

**Headline (< 12 words):**
[e.g. "Share your PRD with anyone — no account needed"]

**Body (< 40 words):**
[e.g. "Generate a read-only link from any PRD. Share with engineers, designers, or stakeholders — they can view without logging in. Links expire in 30 days or revoke any time from PRD settings."]

**CTA button:** [e.g. "Generate share link"]
**Link:** [e.g. opens PRD → Share modal]
**Dismiss behavior:** [ ] X to dismiss · [ ] Dismiss after click · [ ] Persistent for 7 days

**Target:** [ ] All users · [ ] Pro+ only · [ ] Users who have generated ≥ 1 PRD

---

## 2. Email Announcement

**Subject line (A/B options):**
- Option A: [e.g. "Share your PRDs without a login requirement"]
- Option B: [e.g. "New: read-only PRD links for stakeholder review"]

**Preview text:** [e.g. "Your designers and engineers don't need an account to review your PRDs."]

**Email body:**

---

Hi [First name],

**[Headline — same as in-app or slightly longer]**

[Body — 2–3 short paragraphs. Lead with the user outcome, not the feature mechanics. Paragraph 1: what the feature does. Paragraph 2: when to use it / who it's for. Paragraph 3: optional — one customer quote or early access example.]

[CTA button: "Try [Feature Name] →"]

If you have feedback on this feature, reply to this email — we read every response.

— [PM or founder name], [Company]

---

**Send to:** [ ] All active users · [ ] Pro+ subscribers · [ ] Users who triggered [X event]
**Send timing:** [ ] Launch day · [ ] 2 days after launch · [ ] On feature discovery trigger

---

## 3. Changelog Entry

**Date:** [YYYY-MM-DD]
**Tag:** [ ] New · [ ] Improved · [ ] Fixed · [ ] Removed

**Title:** [e.g. "Shareable read-only PRD links"]

**Body:**
> [2–5 sentences. Be specific: what was added, how to access it, any limits or tier restrictions. Avoid "we're excited to" — lead with the feature. Include one screenshot or GIF if available.]

**Access:** [e.g. "Available to all Pro+ subscribers. Accessible from the Share button on any PRD."]

---

## 4. Social / LinkedIn Post

**Format:** [ ] Short (tweet-style) · [ ] Long (LinkedIn article) · [ ] Thread

**Draft:**

[Headline — what shipped]

[Context — 1 sentence on the problem it solves]

[The feature — 2–3 bullets, outcome-focused, not mechanics-focused]

[CTA — link to changelog, product, or demo]

[Optional: screenshot or video]

---

**Example:**
We just shipped shareable read-only PRD links.

Before: share a PRD → engineer has to create an account → they don't → back to PDF.

Now: one link, no login, revokable any time.

Available to all Pro users. [link]

---

## 5. Internal Enablement

### Sales / CS talking points

**One-liner:** [e.g. "PRD share links let PMs loop in engineers without buying extra seats"]
**Common objection:** [e.g. "Do they need to log in?"] → **Answer:** [e.g. "No — read-only link, no account needed"]
**Upgrade angle (if applicable):** [e.g. "Share links are Pro+ — use this as a trial-to-paid nudge"]
**Demo step:** [Where to show it in a live demo]

### Support FAQ update

**Add to help docs:**

> **Q: Can I share a PRD with someone who doesn't have a PMRead account?**
> A: Yes — click Share on any PRD, generate a read-only link, and send it. Viewers don't need to sign up. Links are valid for 30 days by default; you can revoke them from PRD settings at any time.

### Intercom / support tag

Create tag: \`share-link-issue\` for incoming support tickets related to this feature.

---

## 6. Launch Metrics

Define how you'll know if the announcement worked:

| Metric | Target (Day 7) | Actual |
|---|---|---|
| In-app banner click-through rate | > 12% | |
| Email open rate | > 35% | |
| Email click-to-open rate | > 20% | |
| Feature activation (users who tried it) | > 15% of eligible | |
| Upgrade conversions attributed to feature | > [X] | |

---

## Announcement Checklist

- [ ] Core message written and reviewed by 1 stakeholder
- [ ] In-app message tested in staging (renders correctly on mobile)
- [ ] Email tested in Litmus or equivalent (Gmail, Outlook, Apple Mail)
- [ ] Changelog entry published
- [ ] Social post scheduled (or drafted for marketing to send)
- [ ] Sales/CS briefed before launch (not after)
- [ ] Support FAQ updated
- [ ] Analytics events firing for feature activation
- [ ] Metrics dashboard bookmarked for day 7 review
`,
    howToUse: [
      {
        step: "Write the core message before any channel copy",
        detail:
          "The core message section exists because teams jump to writing email copy before they've agreed on what the feature does and who it's for. If you can't fill in the four fields in 10 minutes, the launch brief is not ready. Resolve alignment before drafting.",
      },
      {
        step: "Lead every channel with the user outcome, not the feature capability",
        detail:
          "Bad: 'We've added shareable link functionality.' Good: 'Send your PRD to engineers — they don't need to create an account.' The capability describes the system. The outcome describes what the user can now do. Users respond to the outcome.",
      },
      {
        step: "Brief sales and support before public announcement, not after",
        detail:
          "Every launch creates inbound — support tickets, sales objections, upgrade questions. If your CS team finds out about the feature from the changelog, you've created an internal trust problem. Send the internal enablement doc at least 24 hours before launch.",
      },
      {
        step: "Set metrics before launch, not after",
        detail:
          "Section 6 forces you to decide what success looks like before you can see the numbers. Teams that set metrics post-launch unconsciously calibrate targets to match actuals. Set them first, check them on day 7.",
      },
      {
        step: "Send the email 2–3 days after launch, not the same day",
        detail:
          "Same-day email to users before the feature is fully rolled out (or before you've found the first bugs) creates support load. Launch → monitor for 48 hours → send email. This also gives you time to include a real activation screenshot instead of a mock.",
      },
    ],
    faqs: [
      {
        q: "Should every feature get a full announcement?",
        a: "No. Use this template for features that change user behavior or require users to discover something new. Bug fixes and backend improvements don't need email announcements — a changelog entry is enough. Small UX polish changes don't need in-app banners — they just need good empty states. Reserve full announcements for features with meaningful activation steps.",
      },
      {
        q: "How do I write a good subject line?",
        a: "Specificity beats cleverness. 'New feature available' performs worst. 'Share your PRDs without a login' performs best. Name the feature or outcome directly, put the most interesting word near the front, and test two variants if your list is large enough (> 2,000) to get statistical signal.",
      },
      {
        q: "How long should the launch email be?",
        a: "Short. 3 paragraphs, 1 CTA. Users scan, they don't read. If you have more than 3 things to say, you're announcing too much at once. The email's job is to get the user back into the product — not to explain every nuance of the feature.",
      },
      {
        q: "What makes a good changelog entry?",
        a: "Four things: (1) specific — names the feature, not 'improvements'. (2) Visual — includes a screenshot or GIF. (3) Honest about scope — mentions tier restrictions or known limits. (4) Linkable — has a direct URL so you can share it in Slack or email. Bad changelog: 'Various improvements.' Good: 'Shareable read-only PRD links (Pro+) — generate a link from the Share button on any PRD.'",
      },
      {
        q: "How do I measure whether the announcement worked?",
        a: "Feature activation rate is the only metric that matters — did users who received the announcement actually use the feature? Email open rate and click-through are leading indicators, but a 40% open rate with 2% activation means the announcement worked but the feature didn't. Track both.",
      },
    ],
    keywords: ["feature announcement template", "product update announcement template", "feature release communication template", "in-app announcement template", "product changelog template"],
  },
];