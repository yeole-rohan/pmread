import type { Template } from "./types";

export const metricsTemplates: Template[] = [
  // ── Template 42 ──────────────────────────────────────────────────────────
  {
    slug: "aarrr-metrics",
    title: "AARRR Pirate Metrics",
    shortTitle: "AARRR Metrics",
    category: "Metrics & Growth",
    description:
      "A complete AARRR (Acquisition, Activation, Retention, Revenue, Referral) metrics framework. Maps your funnel, identifies the leakiest stage, and defines the one metric that matters most at your current growth stage.",
    metaDescription:
      "Free AARRR pirate metrics template for product managers. Map your acquisition, activation, retention, revenue, and referral funnel with conversion benchmarks and the one metric to focus on.",
    filename: "aarrr-metrics.md",
    content: `# AARRR Pirate Metrics
**Product:** [Name]
**PM:** [Name]
**Period:** [Week / Month / Quarter]
**Date:** [Date]

---

## Overview

The AARRR framework (coined by Dave McClure) maps the five stages every user passes through. The goal is not to optimise all five simultaneously — it is to find the leakiest stage and fix it first.

| Stage | Question | Your primary metric | Current rate | Target |
|---|---|---|---|---|
| **Acquisition** | How do users find you? | | % | % |
| **Activation** | Do users experience value on the first visit? | | % | % |
| **Retention** | Do users come back? | | % | % |
| **Revenue** | Do users pay? | | % | % |
| **Referral** | Do users tell others? | | % | % |

**Leakiest stage (lowest conversion rate):** [Stage]
**Focus for this quarter:** [Stage and specific metric]

---

## 1. Acquisition

*How users discover and arrive at your product.*

| Channel | Visitors / month | % of total | CAC (₹) | Quality score (1–5) |
|---|---|---|---|---|
| Organic search (SEO) | | % | ₹ | |
| Direct / brand | | % | ₹ | |
| Paid (Google, Meta) | | % | ₹ | |
| Referral / word of mouth | | % | ₹ | |
| Social (LinkedIn, X, YouTube) | | % | ₹ | |
| Product-led (free tools) | | % | ₹ | |
| Other | | % | ₹ | |
| **Total** | | 100% | ₹ | |

**Best-performing acquisition channel:** [Channel — highest quality score per ₹ spent]
**Acquisition metric to move:** [e.g. Organic signups from SEO — currently X, target Y]

---

## 2. Activation

*The moment a new user first experiences the core value of your product — the "aha moment".*

**Aha moment definition:**
[The single action that strongly correlates with long-term retention. e.g. "User generates their first PRD within 7 days of signup"]

**Activation funnel:**

| Step | Users | Drop-off | Cumulative conversion |
|---|---|---|---|
| Signup | | — | 100% |
| [Step 2 — e.g. Created first project] | | % drop | % |
| [Step 3 — e.g. Uploaded first file] | | % drop | % |
| [Step 4 — e.g. Viewed insights] | | % drop | % |
| **Aha moment reached** | | % drop | **%** |

**Activation rate:** [%] of signups reach the aha moment within [N] days.
**Industry benchmark:** Consumer SaaS 25–40%; B2B SaaS 40–60%.

**Biggest drop-off step:** [Step — and hypothesis for why]
**One activation experiment to run:** [e.g. Add onboarding checklist, reduce steps to aha moment]

---

## 3. Retention

*Whether users return and continue getting value.*

**Retention by cohort (% of users active N days after signup):**

| Cohort | Day 1 | Day 7 | Day 14 | Day 30 | Day 90 |
|---|---|---|---|---|---|
| [Month 1] | % | % | % | % | % |
| [Month 2] | % | % | % | % | % |
| [Month 3] | % | % | % | % | % |

**Day-30 retention target:** [%]
**Retention curve:** [ ] Still declining at Day 30 (no habit formed)  [ ] Flattening at Day 30 (habit forming)  [ ] Flat after Day 14 (strong habit)

**Churn rate (monthly, paid users):** [%]
**Involuntary churn (payment failures):** [%]
**Voluntary churn (cancellations):** [%]

**Top churn reason (from exit surveys):** [Reason]
**One retention experiment to run:** [e.g. In-app nudge at Day 5 inactivity, onboarding email sequence]

---

## 4. Revenue

*Whether users pay and how much.*

| Metric | Value | MoM change |
|---|---|---|
| MRR | ₹ | % |
| ARR (MRR × 12) | ₹ | % |
| ARPU (blended) | ₹ | % |
| Free → paid conversion rate | % | % |
| Average revenue per paying user | ₹ | % |
| Expansion MRR (upgrades) | ₹ | % |
| Contraction MRR (downgrades) | ₹ | % |
| Churned MRR | ₹ | % |
| Net New MRR | ₹ | % |

**Net Revenue Retention (NRR):**
\`\`\`
NRR = (Starting MRR + Expansion MRR - Contraction MRR - Churned MRR) / Starting MRR × 100
NRR = (₹___ + ₹___ - ₹___ - ₹___) / ₹___ × 100 = ___%
\`\`\`
Target: > 100% (growth without new acquisition).

---

## 5. Referral

*Whether users bring others.*

| Metric | Value |
|---|---|
| Viral coefficient (K-factor) | |
| % of new signups from referral | % |
| NPS score | |
| % of users who have shared / referred | % |
| Referral programme conversion rate (if applicable) | % |

**K-factor formula:**
\`\`\`
K = (invitations sent per user) × (conversion rate of invitations)
K > 1 = viral growth   K < 1 = supplemental channel only
\`\`\`

**Current K-factor:** [Value]
**NPS promoter segments:** [What types of users give 9–10 NPS scores?]

---

## 6. The one metric that matters (OMTM)

At your current stage, one metric matters more than all others. Optimising the wrong metric at the wrong stage wastes resources.

| Stage | Focus | OMTM |
|---|---|---|
| Pre-product/market fit | Activation | % reaching aha moment within 7 days |
| Post-PMF, pre-scale | Retention | Day-30 retention rate |
| Scaling | Acquisition + Revenue | CAC payback period |
| Optimising | Revenue | Net Revenue Retention |

**Your current stage:** [Stage]
**Your OMTM:** [Metric]
**Current value:** [Value]
**Target:** [Value] by [Date]
**Owner:** [Name]`,
    howToUse: [
      {
        step: "Find the leakiest stage before optimising anything",
        detail:
          "The most common mistake is optimising acquisition (more signups!) when the real problem is activation (users sign up and immediately churn). Calculate the conversion rate at each stage. The stage with the lowest rate — or the biggest absolute user drop — is where to focus. More acquisition traffic poured into a broken activation funnel just burns CAC faster.",
      },
      {
        step: "Define your aha moment with data, not intuition",
        detail:
          "Look at your retained users (those still active at Day 30) and your churned users, and find the action that distinguishes them in the first 7 days. That is your aha moment. PMs often define the aha moment as 'they complete onboarding' when the data shows it's actually 'they invite a teammate' or 'they complete the first output'. Run the analysis before assuming.",
      },
      {
        step: "Separate voluntary and involuntary churn in India",
        detail:
          "Indian SaaS products have higher involuntary churn (payment failures via UPI/card) than global equivalents. Mixing them gives you a misleading picture. Involuntary churn is an ops problem — fix it with retry logic and grace periods. Voluntary churn is a product problem — fix it with activation and retention improvements. Track both separately from day one.",
      },
      {
        step: "Pick one OMTM per quarter and resist moving it",
        detail:
          "Teams that chase all five AARRR metrics simultaneously make shallow progress on all of them. Pick the one metric that, if improved, would have the highest downstream impact on business outcomes. Assign it an owner, a target, and a date. Review weekly. Don't change it mid-quarter unless the business fundamentally changes.",
      },
    ],
    faqs: [
      {
        q: "In what order should we fix the AARRR funnel?",
        a: "Always fix from the bottom up: retention before acquisition. If you increase acquisition on a leaky retention funnel, you're filling a bucket with a hole in it. Fix retention first (users who stay create word-of-mouth and expansion revenue), then activation (so new users reach the retained state faster), then acquisition (to scale what's working). Revenue and referral typically improve automatically when retention improves.",
      },
      {
        q: "What's a good Day-30 retention rate for SaaS?",
        a: "For B2B SaaS: 40–60% Day-30 retention is healthy at early stage; 60–80% is strong. For consumer apps: 20–30% is good; 40%+ is exceptional. The more important signal is the shape of the retention curve — a curve that flattens out (stops declining) indicates a retained core of habitual users, even if the absolute number is low. A curve that keeps declining to near zero at Day 90 means no habit has formed.",
      },
      {
        q: "How do we calculate NPS and what's a good score?",
        a: "NPS = % Promoters (score 9–10) minus % Detractors (score 0–6). Passives (7–8) are excluded. For SaaS products: NPS above 30 is good; above 50 is excellent; above 70 is world-class. More important than the absolute score is the trend (is it improving?) and the qualitative feedback from detractors — that tells you what to fix.",
      },
    ],
    keywords: ["aarrr metrics template", "pirate metrics template", "acquisition retention revenue metrics", "growth metrics framework", "aarrr framework product management"],
  },

  // ── Template 43 ──────────────────────────────────────────────────────────
  {
    slug: "weekly-pm-report",
    title: "Weekly PM Report",
    shortTitle: "Weekly PM Report",
    category: "Metrics & Growth",
    description:
      "A structured weekly report template for product managers. Covers key metrics, what shipped, what's blocked, decisions made, upcoming priorities, and asks from leadership — in a format that takes 20 minutes to write and 5 minutes to read.",
    metaDescription:
      "Free weekly PM report template. Structure your weekly product update with metrics, shipped work, blockers, decisions, and upcoming priorities in a format leadership can read in 5 minutes.",
    filename: "weekly-pm-report.md",
    content: `# Weekly PM Report
**Product / Area:** [Name]
**PM:** [Name]
**Week of:** [Date range, e.g. Apr 21–25, 2025]
**Sent to:** [Stakeholders / team]

---

> **Writing guidance:** This report should take you 20 minutes to write and 5 minutes to read. Be specific — numbers, not adjectives. "Signups grew" is useless. "Signups grew 18% WoW, driven by the SEO post on PRD templates" is useful. Lead with what changed, not what happened.

---

## 🔢 Metrics snapshot

| Metric | This week | Last week | WoW change | Target | Status |
|---|---|---|---|---|---|
| [Primary metric, e.g. MRR] | ₹ | ₹ | % | ₹ | 🟢 / 🟡 / 🔴 |
| [Activation rate] | % | % | % | % | |
| [DAU / WAU] | | | % | | |
| [Churn rate] | % | % | | % | |
| [NPS / CSAT] | | | | | |
| [Your metric] | | | | | |

**One sentence on the most important metric movement:**
[What moved, why, and whether it's signal or noise]

---

## ✅ Shipped this week

*Only include things that are live in production and usable by real users.*

- [ ] [Feature / fix 1] — [1-line description of what it does and why it matters]
- [ ] [Feature / fix 2]
- [ ] [Feature / fix 3]

**Impact of the most significant shipped item:**
[What behaviour or metric are you expecting to move, and by how much, and when will you know?]

---

## 🔄 In progress

| Item | Owner | Expected ship | Blocker |
|---|---|---|---|
| [Item 1] | [Name] | [Date] | None / [Blocker] |
| [Item 2] | [Name] | [Date] | |
| [Item 3] | [Name] | [Date] | |

---

## 🚧 Blockers

*Only list things that are actively blocking progress — not things you're monitoring.*

1. **[Blocker 1]:** [What is blocked, what is blocking it, what you need to unblock it, and by when]
2. **[Blocker 2]:** [Same format]

**Ask from leadership (if any):** [Specific decision or unblock you need, and the deadline for it to matter]

---

## 🧠 Decisions made

*Decisions made this week that stakeholders should be aware of.*

| Decision | Rationale | Alternatives considered |
|---|---|---|
| [Decision 1] | [Why] | [What else was on the table] |
| [Decision 2] | | |

---

## 🔭 Next week priorities

| Priority | Why it's first | Owner | Success criteria |
|---|---|---|---|
| [P1] | [Reason] | [Name] | [What done looks like] |
| [P2] | | | |
| [P3] | | | |

**What is explicitly NOT happening next week (and why):**
[The thing that looks urgent but isn't — say it so stakeholders don't ask about it]

---

## 💬 Context / commentary

*Optional. Use for anything that doesn't fit above — market signal, customer feedback, a concern, a hypothesis.*

[Free text — keep it under 150 words]`,
    howToUse: [
      {
        step: "Write it on Friday afternoon, not Monday morning",
        detail:
          "A Monday report describes last week from memory. A Friday report describes last week while you're in it. The difference is specificity — Friday you remember why signups spiked on Tuesday; Monday you just see the number. Set a recurring 30-minute block on Friday afternoons. The 20-minute write time is realistic only if you're doing it while the week is fresh.",
      },
      {
        step: "Lead every metric with the change, not the absolute",
        detail:
          "'MRR: ₹1,84,000' tells leadership nothing if they don't remember last week's number. '₹1,84,000 MRR, up 12% WoW' is useful. 'MRR up 12% WoW driven by the annual plan promotion — 8 new annual customers converted' is excellent. The change and the driver are more important than the absolute number.",
      },
      {
        step: "The 'not happening' section prevents more questions than anything else",
        detail:
          "Leadership asks about the thing you deprioritised because they don't know you deprioritised it. Explicitly naming 'we are not shipping X next week because Y is higher priority' saves you a meeting, a Slack thread, and the implied pressure to do both. It also forces you to articulate your own prioritisation logic, which is useful even if no one reads it.",
      },
      {
        step: "Use the blockers section as a forcing function, not a complaint log",
        detail:
          "A blocker entry that says 'design hasn't delivered the mocks' is a complaint. A blocker entry that says 'mocks due Friday from design; if not received by EOD Friday, engineering kickoff slips to the following Monday — flagging now so design lead is aware' is a forcing function. The difference is specificity about consequence and timeline. Only the second version prompts action.",
      },
    ],
    faqs: [
      {
        q: "How long should a weekly PM report be?",
        a: "One to two pages maximum. If it's longer, you're including things that belong in a Jira ticket or a strategy doc, not a weekly report. The test: can your CEO read it in 5 minutes and understand what matters? If they have to read it twice, it's too long. Cut the items where the update is 'on track' with no new information — those don't belong in the report.",
      },
      {
        q: "Should I include negative news in the report?",
        a: "Yes — immediately and specifically. Hiding bad news in weekly reports is the fastest way to destroy trust with leadership. The format to use: 'Metric X missed target by Y%. Root cause is Z. Plan to address it is A, B, C. Expected to recover by [date].' Leaders who find out about problems from sources other than the PM lose confidence in the PM, not the product.",
      },
      {
        q: "Who should receive the weekly report?",
        a: "Your direct manager, the engineering lead for your product area, and any stakeholders who have standing asks or dependencies on your roadmap. Don't send it to everyone — you'll water down the signal with noise. If someone hasn't engaged with a report in 4 weeks, take them off the list and offer a monthly summary instead.",
      },
    ],
    keywords: ["weekly pm report template", "product manager weekly report", "pm status update template", "weekly product update template", "pm weekly digest template"],
  },

  // ── Template 44 ──────────────────────────────────────────────────────────
  {
    slug: "churn-analysis",
    title: "Churn Analysis Template",
    shortTitle: "Churn Analysis",
    category: "Metrics & Growth",
    description:
      "A structured churn analysis framework for SaaS PMs. Covers churn rate calculation, voluntary vs involuntary split, cohort analysis, exit interview synthesis, root cause identification, and a prioritised retention action plan.",
    metaDescription:
      "Free churn analysis template for SaaS product managers. Calculate churn rate, segment voluntary vs involuntary churn, synthesise exit interviews, and build a prioritised retention action plan.",
    filename: "churn-analysis.md",
    content: `# Churn Analysis Template
**Product:** [Name]
**PM:** [Name]
**Period analysed:** [e.g. Q1 2025 / Last 90 days]
**Date:** [Date]

---

## 1. Churn rate summary

**Definitions used (fill in exactly one per row):**

| Metric | Formula | Value |
|---|---|---|
| Monthly user churn rate | Churned users / Starting users × 100 | % |
| Monthly revenue churn rate (MRR churn) | Churned MRR / Starting MRR × 100 | % |
| Net MRR churn (accounts for expansion) | (Churned MRR − Expansion MRR) / Starting MRR × 100 | % |
| Annual churn rate (approximation) | 1 − (1 − monthly rate)^12 × 100 | % |

**Benchmark comparison:**
| Stage | Acceptable monthly MRR churn | Your rate | Status |
|---|---|---|---|
| Early stage (< ₹50L ARR) | < 5% | % | 🟢 / 🟡 / 🔴 |
| Growth stage (₹50L–₹5Cr ARR) | < 3% | % | |
| Scale (> ₹5Cr ARR) | < 2% | % | |

---

## 2. Voluntary vs involuntary churn

| Type | Definition | Count | % of total churn | MRR lost |
|---|---|---|---|---|
| **Voluntary** | User actively cancelled | | % | ₹ |
| **Involuntary** | Payment failed, card expired, UPI mandate cancelled | | % | ₹ |
| **Total** | | | 100% | ₹ |

**Involuntary churn recovery:**
- Payment retries attempted: [N] times over [N] days
- Recovery rate (failed → recovered): [%]
- MRR recovered via dunning: ₹[Amount]
- Opportunity: [% of involuntary churn that could be recovered with better retry logic]

*Involuntary churn in India is higher than global benchmarks due to UPI mandate failures and card expiry patterns. A retry + grace period flow typically recovers 20–40% of failed payments.*

---

## 3. Churn by segment

| Segment | Users at start | Churned | Churn rate | MRR churned |
|---|---|---|---|---|
| Free users | | | % | ₹0 |
| [Tier 1 — e.g. Pro] | | | % | ₹ |
| [Tier 2 — e.g. Team] | | | % | ₹ |
| By tenure: < 3 months | | | % | ₹ |
| By tenure: 3–12 months | | | % | ₹ |
| By tenure: > 12 months | | | % | ₹ |
| By acquisition channel: Organic | | | % | ₹ |
| By acquisition channel: Paid | | | % | ₹ |

**Key insight from segmentation:**
[Which segment has the highest churn? What does that tell you about product-market fit for that segment?]

---

## 4. Cohort churn analysis

Track what % of each monthly cohort is still active N months later.

| Cohort | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|---|
| [Month 1 cohort] | 100% | % | % | % | % |
| [Month 2 cohort] | 100% | % | % | % | % |
| [Month 3 cohort] | 100% | % | % | % | % |

**Retention curve shape:**
[ ] Continuously declining (no habit formed — product/market fit problem)
[ ] Steep drop in Month 1, then stabilising (activation problem)
[ ] Gradual decline, stabilising around Month 3 (healthy — some long-term users)
[ ] Flat after Month 2 (strong habit — focus on acquisition)

**Month where churn is highest (greatest drop):** [Month]
**Hypothesis for why:** [Activation failure / value not delivered / competitive switch / pricing]

---

## 5. Exit interview synthesis

*Synthesise feedback from churned users: exit surveys, cancellation reasons, support tickets, and any direct interviews.*

**Exit reason distribution:**

| Reason | Count | % | Notes |
|---|---|---|---|
| Too expensive / didn't justify cost | | % | |
| Missing feature / doesn't do what I need | | % | |
| Switched to competitor | | % | Which competitor? |
| No longer need the product | | % | Seasonal / role change |
| Bad experience / bugs | | % | |
| Didn't use it enough to justify paying | | % | Activation failure |
| Other | | % | |

**Top 3 feature gaps mentioned by churned users:**
1. [Feature] — mentioned by [N] churned users
2. [Feature] — mentioned by [N] churned users
3. [Feature] — mentioned by [N] churned users

**Most common competitor switched to:** [Name — and why users chose it]

---

## 6. Root cause analysis

For each major churn driver, identify the root cause (not the symptom).

| Churn driver | Surface symptom | Root cause | Category |
|---|---|---|---|
| [Driver 1] | [e.g. "Too expensive"] | [e.g. User never completed activation — never saw ROI] | Activation |
| [Driver 2] | [e.g. "Missing feature X"] | [e.g. Wrong ICP — feature X is core to a segment we can't serve] | Positioning |
| [Driver 3] | [e.g. "Switched to competitor"] | [e.g. Competitor has better [specific capability]] | Product gap |

**Root cause categories:**
- **Activation failure** — user never experienced the core value proposition
- **Product gap** — missing feature that competing products have
- **ICP mismatch** — we acquired a customer segment we can't serve well
- **Pricing** — price doesn't match the value delivered to this segment
- **Support/experience** — bugs, slow responses, poor onboarding

---

## 7. Retention action plan

| Root cause | Proposed fix | Effort | Impact | Owner | Target date |
|---|---|---|---|---|---|
| [Root cause 1] | [Specific action] | S/M/L | H/M/L | [Name] | [Date] |
| [Root cause 2] | | | | | |
| [Root cause 3] | | | | | |

**Quick wins (< 1 week, high impact):**
- [ ] [Action 1]
- [ ] [Action 2]

**30-day retention target:** [Current %] → [Target %]
**MRR at risk if no action:** ₹[Current churn rate × MRR]`,
    howToUse: [
      {
        step: "Always split voluntary and involuntary churn before drawing any conclusions",
        detail:
          "Voluntary and involuntary churn require completely different fixes. Involuntary churn (payment failures) is an ops problem — fix it with retry logic, grace periods, and proactive card expiry warnings. Voluntary churn is a product problem. If you mix them, you'll build features to solve a payment infrastructure problem, or build payment infrastructure to solve a product problem. Calculate both separately from day one.",
      },
      {
        step: "Look at cohort churn, not aggregate churn",
        detail:
          "Aggregate monthly churn is the average of many cohorts at different stages. A growing company can have a stable 5% monthly churn while each individual cohort is worsening — because new cohorts (which are larger) dilute the older, higher-churning cohorts. Cohort analysis shows the true picture. If Month-1 churn has increased over the past three cohorts, that's a signal that something in onboarding or ICP targeting has changed.",
      },
      {
        step: "Don't trust exit survey data at face value — dig one level deeper",
        detail:
          "'Too expensive' is the most common exit survey response and usually the least honest. It is what users say when they can't articulate 'I never felt enough value to justify the cost.' Before treating it as a pricing problem, check whether those users completed activation. If 80% of 'too expensive' churners never generated a PRD (or equivalent core action), the problem is activation, not pricing. Fix the aha moment first.",
      },
      {
        step: "Run win/loss interviews on churned users within 14 days of cancellation",
        detail:
          "Exit survey data is shallow — 1-2 clicks, no context. A 20-minute conversation with a churned user in the week after they cancel yields 10× more useful signal. Users are often willing to talk because they have a concrete opinion about why they left. Ask: 'What was the moment you decided to cancel?', 'What would have made you stay?', 'What did you switch to and why?' Record every call; synthesise monthly.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between MRR churn and user churn?",
        a: "User churn counts the number of accounts lost. MRR churn counts the revenue lost. For products with multiple pricing tiers, these tell different stories. If you have high user churn on free users and low MRR churn, your product is losing non-paying users (acceptable) while retaining paying customers (healthy). If you have low user churn but high MRR churn, you're losing your high-value customers disproportionately — a serious problem. Always report both.",
      },
      {
        q: "When should we prioritise churn reduction over acquisition?",
        a: "When monthly churn exceeds 5% for B2B SaaS, acquisition investment is inefficient — you're filling a bucket with a large hole. The rule of thumb: if your churn-adjusted payback period exceeds 24 months (i.e. CAC / (ARPU × gross margin × (1 - monthly churn)^24 is negative), fix churn before scaling acquisition. Below 3% monthly churn for B2B SaaS, focus on acquisition.",
      },
      {
        q: "How many exit interviews should we do per month?",
        a: "At early stage (< 50 churned users/month): interview every churned paid user you can reach. At growth stage: interview a stratified sample — at least 5 from each major churn reason category. The minimum viable cadence is 5 interviews per month. Fewer than that and patterns don't emerge. More than 20 per month and the marginal new insight diminishes rapidly — focus on acting on what you've learned, not collecting more data.",
      },
    ],
    keywords: ["churn analysis template", "customer churn analysis product", "saas churn investigation template", "churn rate analysis framework", "user churn analysis guide"],
  },

  // ── Template 45 ──────────────────────────────────────────────────────────
  {
    slug: "experiment-design",
    title: "Experiment Design Template",
    shortTitle: "Experiment Design",
    category: "Metrics & Growth",
    description:
      "A rigorous experiment design template for PMs running A/B tests and product experiments. Covers hypothesis formulation, sample size calculation, metric selection, guardrail metrics, analysis plan, and a decision framework for shipping or reverting.",
    metaDescription:
      "Free A/B test and experiment design template for product managers. Write hypotheses, calculate sample sizes, define primary and guardrail metrics, and build a decision framework for experiment results.",
    filename: "experiment-design.md",
    content: `# Experiment Design Template
**Experiment name:** [Descriptive name, e.g. "Onboarding checklist vs. free-form"]
**PM:** [Name]  **Engineer:** [Name]  **Analyst:** [Name]
**Date designed:** [Date]  **Planned launch:** [Date]  **Planned end:** [Date]

---

## 1. Hypothesis

**Problem statement:**
[What user behaviour or metric are you trying to improve, and why does it matter now?]

**Hypothesis (fill in the blanks):**
> We believe that **[changing X]** for **[user segment Y]** will cause **[metric Z]** to **[increase/decrease]** because **[mechanism/reasoning]**.

*Example: We believe that showing an onboarding checklist to new signups will cause Day-7 activation rate to increase because users who see explicit next steps are more likely to complete the core workflow.*

**Null hypothesis:**
> [X] will have no statistically significant effect on [Z].

---

## 2. Variants

| Variant | Description | % of traffic |
|---|---|---|
| Control (A) | [Current experience — describe exactly] | % |
| Treatment (B) | [New experience — describe exactly] | % |
| Treatment (C) | [Optional second treatment] | % |

**Randomisation unit:** [ ] User  [ ] Session  [ ] Account  [ ] Device
*Use user-level randomisation for most experiments — session-level creates inconsistent experiences within a session.*

**Targeting / eligibility:**
- Include: [e.g. New signups in the last 7 days]
- Exclude: [e.g. Existing paying users, internal accounts, users in other active experiments]

---

## 3. Metrics

**Primary metric (the one this experiment is designed to move):**
| Metric | Definition | Current baseline | Direction | Minimum detectable effect (MDE) |
|---|---|---|---|---|
| [e.g. Day-7 activation rate] | % of signups who complete [aha moment] within 7 days | % | ↑ | +[X]% absolute |

*MDE: the smallest improvement worth shipping. Too small an MDE requires impractically large samples. If you can't justify a 2% absolute improvement as worth shipping, your experiment isn't ready.*

**Secondary metrics (supporting signals):**
| Metric | Direction | Notes |
|---|---|---|
| [e.g. Day-30 retention] | ↑ | Confirm activation improvement leads to long-term retention |
| [e.g. Time to aha moment] | ↓ | Faster is better |
| [e.g. Support tickets in first 7 days] | ↓ | Ensure onboarding checklist reduces confusion |

**Guardrail metrics (must not degrade):**
| Metric | Maximum allowed degradation | Notes |
|---|---|---|
| [e.g. Paid conversion rate] | No degradation > 0.5% absolute | Activation improvement must not hurt revenue |
| [e.g. Signup completion rate] | No degradation > 1% absolute | New flow must not create drop-off |
| [e.g. Page load time] | No increase > 200ms P95 | Performance guardrail |

*If any guardrail metric breaches its threshold, the experiment should be stopped regardless of primary metric results.*

---

## 4. Sample size and duration

**Sample size calculation:**

| Input | Value |
|---|---|
| Baseline conversion rate | % |
| Minimum detectable effect (MDE) | % absolute |
| Statistical significance (α) | 0.05 (95% confidence) |
| Statistical power (1 − β) | 0.80 (80% power) |
| Number of variants | [2 / 3] |
| **Required sample per variant** | **[N] users** |
| **Total required sample** | **[N × variants] users** |

*Use a sample size calculator (e.g. Evan Miller's). Don't skip this — underpowered experiments produce inconclusive results that you'll run again.*

**Traffic estimate:**
| Eligible users per day | Days to reach required sample | Planned end date |
|---|---|---|
| | | [Date] |

**Minimum run time:** [N] days (never less than 1 full week — day-of-week effects are real)
**Maximum run time:** [N] days (after this, novelty effects and external events contaminate results)

---

## 5. Implementation checklist

- [ ] Experiment logged in experiment tracking system (Amplitude, Mixpanel, LaunchDarkly, etc.)
- [ ] Randomisation verified — no imbalanced split on pre-experiment metrics
- [ ] Tracking events instrumented for primary metric and all secondary/guardrail metrics
- [ ] QA passed for both control and treatment variants
- [ ] AA test passed (run control vs. control for 48h to verify randomisation)
- [ ] Monitoring dashboard set up
- [ ] Alert configured for guardrail metric breaches

---

## 6. Analysis plan

**When to analyse:**
[ ] Fixed horizon (analyse at planned end date only — avoids p-hacking)
[ ] Sequential testing (analyse continuously with corrected p-values)

*Recommendation: fixed horizon unless you have a strong reason to stop early.*

**Statistical test:**
[ ] Z-test / chi-squared (for proportions — e.g. conversion rate)
[ ] T-test (for means — e.g. revenue per user)
[ ] Mann-Whitney U (for non-normal distributions)

**Segmentation analysis (run after primary result):**
- [ ] By acquisition channel
- [ ] By device type (mobile vs desktop)
- [ ] By user tenure (new vs returning)
- [ ] By plan type (free vs paid)

*Segment analysis is exploratory — don't use it to rescue a failed experiment. Use it to generate hypotheses for future experiments.*

---

## 7. Decision framework

| Result | Condition | Decision |
|---|---|---|
| **Ship** | Primary metric improves ≥ MDE at p < 0.05 AND all guardrails hold | Roll out to 100% |
| **Iterate** | Primary metric improves but below MDE OR guardrail warning (not breach) | Refine treatment and re-run |
| **Revert** | Primary metric neutral + guardrail breach | Stop immediately, revert to control |
| **Inconclusive** | Primary metric not significant after full run time | Do not ship; investigate why |
| **Negative** | Primary metric significantly worse | Revert; document learnings |

**Decision owner:** [Name]
**Decision deadline:** [Date — typically 3–5 business days after experiment ends]

---

## 8. Results (fill in after experiment)

| Metric | Control | Treatment | Absolute diff | Relative diff | p-value | Significant? |
|---|---|---|---|---|---|---|
| [Primary] | % | % | % | % | | Y / N |
| [Secondary 1] | | | | | | |
| [Guardrail 1] | | | | | | |

**Decision:** [ ] Ship  [ ] Iterate  [ ] Revert  [ ] Inconclusive
**Rationale:** [One paragraph explaining the decision based on data]
**Learnings for future experiments:** [What does this tell you about user behaviour?]`,
    howToUse: [
      {
        step: "Calculate sample size before launching — not after",
        detail:
          "The most common experiment mistake is launching without knowing how much traffic is needed to detect a meaningful effect. Without a sample size calculation, you either: (a) stop too early and ship a false positive, or (b) run indefinitely waiting for significance that may never come. Calculate required sample before launch. If the required sample takes more than 6 weeks at current traffic, either increase the MDE (accept a smaller improvement as significant) or don't run the experiment.",
      },
      {
        step: "Define guardrail metrics before the experiment runs, not after",
        detail:
          "Guardrail metrics defined after the experiment are just rationalisations. Before launch, list every metric you'd be embarrassed to see degrade — paid conversion, page performance, support volume. Set explicit thresholds. If a guardrail breaches during the experiment, stop it regardless of primary metric results. A 5% lift in activation that causes a 3% drop in paid conversion is not a win.",
      },
      {
        step: "Never peek at results and make decisions mid-experiment",
        detail:
          "Looking at p-values daily and stopping when p < 0.05 is p-hacking — it dramatically inflates false positive rates. If you're using a fixed-horizon design (recommended), set the analysis date before launch and don't touch it. If you have a business reason to monitor continuously, use a sequential testing framework (like Bayesian bandits or CUPED) with appropriate corrections. 'We stopped early because the result looked good' is not a valid analysis method.",
      },
      {
        step: "Run an AA test for 48 hours before every experiment",
        detail:
          "An AA test runs your randomisation split on two identical versions of the control experience. If the AA test shows a statistically significant difference between 'control' and 'control', your randomisation is broken — users are not being assigned uniformly. Fix the randomisation before running the real experiment. Skipping the AA test means your results might be driven by selection bias, not treatment effect.",
      },
    ],
    faqs: [
      {
        q: "What is the minimum detectable effect (MDE) and how do I set it?",
        a: "The MDE is the smallest improvement that would be worth shipping — the threshold below which the change isn't commercially meaningful even if it's statistically significant. Set it by asking: 'If this experiment moves the metric by X%, would we ship it?' Work backwards from that answer. A typical MDE for activation experiments is 2–5% absolute. Setting the MDE too low (e.g. 0.5%) requires huge sample sizes and very long runtimes — most teams don't have that luxury.",
      },
      {
        q: "What do we do when an experiment is inconclusive?",
        a: "An inconclusive result (no significant difference in either direction) is information, not failure. It tells you the change had no measurable effect on this metric for this population. Document what you expected to happen and why it didn't, then decide: (a) was the hypothesis wrong?, (b) was the treatment too weak?, or (c) was the metric the wrong one to measure? Use inconclusives to sharpen future hypotheses rather than re-running the same test with the same design.",
      },
      {
        q: "Can we run multiple experiments at the same time?",
        a: "Yes, with safeguards. Experiments on non-overlapping user populations or non-interacting parts of the product can run concurrently without issue. The risk is interaction effects — if Experiment A changes onboarding and Experiment B changes the first feature users encounter, the combined effect of both is not separable. Maintain a running list of active experiments and check for overlapping eligibility criteria before launching a new one.",
      },
    ],
    keywords: ["experiment design template", "product experiment template", "hypothesis testing template pm", "product test design framework", "ab test hypothesis template"],
  },

  // ── Template 46 ──────────────────────────────────────────────────────────
  {
    slug: "product-health-dashboard",
    title: "Product Health Dashboard",
    shortTitle: "Health Dashboard",
    category: "Metrics & Growth",
    description:
      "A single-page product health snapshot for PMs and leadership. Covers acquisition, activation, retention, revenue, NPS, and system reliability — with RAG status, week-on-week trends, and a commentary section that forces the PM to explain the story behind the numbers.",
    metaDescription:
      "Free product health dashboard template for product managers. Track acquisition, activation, retention, revenue, NPS, and reliability with RAG status and weekly trends in one page.",
    filename: "product-health-dashboard.md",
    content: `# Product Health Dashboard
**Product:** [Name]
**PM:** [Name]
**Period:** [Week ending / Month ending — date]
**Audience:** [ ] Team  [ ] Leadership  [ ] Board

---

> **How to use:** Update weekly or monthly. RAG status is mandatory — it forces a judgment call, not just a number. The commentary section (Section 7) is the most important part: numbers without interpretation are noise.

---

## RAG Key
🟢 On track / healthy  🟡 Watch — degrading or below target  🔴 Action required — significantly off target

---

## 1. Acquisition

| Metric | This period | Last period | Change | Target | Status |
|---|---|---|---|---|---|
| Total new signups | | | % | | 🟢/🟡/🔴 |
| Paid signups | | | % | | |
| Top acquisition channel | [Channel] | [Channel] | — | — | |
| CAC (blended) | ₹ | ₹ | % | ₹ | |
| Organic traffic (sessions) | | | % | | |

---

## 2. Activation

| Metric | This period | Last period | Change | Target | Status |
|---|---|---|---|---|---|
| Activation rate (reach aha moment) | % | % | % pts | % | |
| Median time to aha moment | days | days | | days | |
| Onboarding completion rate | % | % | % pts | % | |

**Aha moment definition:** [e.g. User generates first PRD within 7 days of signup]

---

## 3. Retention

| Metric | This period | Last period | Change | Target | Status |
|---|---|---|---|---|---|
| Day-7 retention | % | % | % pts | % | |
| Day-30 retention | % | % | % pts | % | |
| WAU / MAU ratio | | | | | |
| Monthly user churn | % | % | % pts | % | |

**Latest cohort (Month [X]) Day-30 retention:** [%]
**Retention curve shape:** [ ] Still declining  [ ] Flattening  [ ] Flat (habit formed)

---

## 4. Revenue

| Metric | This period | Last period | Change | Target | Status |
|---|---|---|---|---|---|
| MRR | ₹ | ₹ | % | ₹ | |
| New MRR | ₹ | ₹ | % | | |
| Expansion MRR | ₹ | ₹ | % | | |
| Churned MRR | ₹ | ₹ | % | | |
| Net MRR change | ₹ | ₹ | % | | |
| ARPU | ₹ | ₹ | % | ₹ | |
| Free → paid conversion | % | % | % pts | % | |
| MRR churn rate | % | % | % pts | % | |
| NRR (Net Revenue Retention) | % | % | % pts | >100% | |

---

## 5. Engagement

| Metric | This period | Last period | Change | Target | Status |
|---|---|---|---|---|---|
| DAU | | | % | | |
| WAU | | | % | | |
| MAU | | | % | | |
| [Core action] per active user | | | % | | |
| [Core action] — e.g. PRDs generated | | | % | | |
| Session length (median) | min | min | % | | |

---

## 6. NPS & Support

| Metric | This period | Last period | Change | Target | Status |
|---|---|---|---|---|---|
| NPS | | | pts | | |
| % Promoters (9–10) | % | % | | | |
| % Detractors (0–6) | % | % | | | |
| Support tickets opened | | | % | | |
| Median first response time | hrs | hrs | % | hrs | |
| CSAT | /5 | /5 | | /5 | |

---

## 7. System reliability

| Metric | This period | Target | Status |
|---|---|---|---|
| Uptime | % | 99.9% | |
| API P95 latency | ms | ms | |
| Error rate | % | <0.1% | |
| Incidents (P1/P2) | | 0 | |

---

## 8. Commentary

**One thing that went well:**
[Specific metric or outcome, with a hypothesis for why]

**One thing to watch:**
[The metric moving in the wrong direction, root cause hypothesis, and planned response]

**One decision made this period based on this data:**
[What the data told you and what you decided to do differently]

**One thing this dashboard doesn't capture that matters:**
[The qualitative signal, customer quote, or leading indicator not in the numbers above]`,
    howToUse: [
      {
        step: "Fill in RAG status as a judgment call, not a formula",
        detail:
          "RAG status forces you to own an interpretation, not just report a number. A metric can be above target and still be 🟡 if the trend is worsening. A metric can be below target and still be 🟢 if you understand why and it's expected. The act of assigning RAG status makes you think about each metric, which is the whole point. Never auto-calculate it.",
      },
      {
        step: "The commentary section is not optional",
        detail:
          "A dashboard without commentary is a spreadsheet. Section 8 forces you to synthesise: what went well, what to watch, what decision you made from the data, and what the numbers miss. Leadership can read the numbers themselves — what they need from you is the interpretation. If you can't fill in Section 8 in 10 minutes, you don't understand your product well enough yet.",
      },
      {
        step: "Pick one core engagement action and track it consistently",
        detail:
          "The 'core action per active user' row should track the one action that best represents value delivery — PRDs generated, insights extracted, reports shared, whatever is specific to your product. Define it once and never change it mid-stream. Changing the definition resets your trend line and makes the metric useless for comparison.",
      },
      {
        step: "Share this dashboard before the weekly meeting, not during it",
        detail:
          "If you present the dashboard live, the meeting becomes a numbers reading exercise. If you share it 24 hours before, the meeting becomes a discussion about the commentary. Send it the day before with a one-line summary email: 'MRR up 12% WoW. Day-30 retention slipping — flagged in commentary. See dashboard.' The meeting then starts at the problem, not the number.",
      },
    ],
    faqs: [
      {
        q: "How often should this dashboard be updated?",
        a: "Weekly for growth-stage products where metrics move meaningfully week-on-week. Monthly for mature products where weekly variance is noise. Daily for products in an active growth experiment or post-incident recovery. The cadence should match how fast your metrics actually move — daily dashboards on slow-moving metrics create false urgency and alert fatigue.",
      },
      {
        q: "Which metrics should we add for a B2B SaaS product?",
        a: "Add: pipeline-to-trial conversion rate (if you have a sales motion), trial-to-paid conversion rate, logo churn (accounts lost, not just MRR), expansion rate by account tier, and time-to-value (days from signup to first meaningful output). Remove or deprioritise DAU/MAU in favour of weekly active accounts — B2B SaaS usage is inherently less daily than consumer products.",
      },
      {
        q: "What's the difference between this and a weekly PM report?",
        a: "The weekly PM report covers what shipped, what's blocked, and what's next — it is operational. The product health dashboard covers how the product is performing against its goals — it is diagnostic. The report answers 'what did we do?' The dashboard answers 'is what we're doing working?' Both are needed; neither replaces the other.",
      },
    ],
    keywords: ["product health dashboard template", "product metrics dashboard", "pm dashboard template", "product kpi dashboard template", "product health scorecard"],
  },
];
