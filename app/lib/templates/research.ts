import type { Template } from "./types";

export const researchTemplates: Template[] = [
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

  // ─── 16. Empathy Map ──────────────────────────────────────────────────────,

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

  // ─── 17. User Interview Script ────────────────────────────────────────────,

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
];