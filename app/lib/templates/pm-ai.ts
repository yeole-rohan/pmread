import type { Template } from "./types";

export const pmAiTemplates: Template[] = [
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

  // ─── 34. LLM Evaluation Scorecard ──────────────────────────────────────────,

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

  // ─── 35. AI Product Risk ────────────────────────────────────────────────────,

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
  // ── Template 36 ──────────────────────────────────────────────────────────,

  {
    slug: "responsible-ai-checklist",
    title: "Responsible AI Checklist",
    shortTitle: "Responsible AI",
    category: "PM × AI",
    description:
      "A pre-launch checklist for PMs shipping AI-powered features. Covers transparency, fairness, privacy, human oversight, and accountability — with sign-off tracks for legal, security, and leadership.",
    metaDescription:
      "Free responsible AI checklist for product managers. Pre-launch review covering transparency, fairness, privacy, human oversight, and accountability for AI features.",
    filename: "responsible-ai-checklist.md",
    content: `# Responsible AI Checklist
**Feature:** [Name]
**PM:** [Name]
**Date:** [Date]
**Review stage:** [ ] Design  [ ] Pre-launch  [ ] Post-launch audit

---

## Instructions

Work through each section before shipping any AI-powered feature. Items marked **[Required]** are non-negotiable. Items marked **[Recommended]** are strongly advised but may be waived with documented justification. Check each box only when the condition is genuinely met — not aspirationally.

---

## 1. Transparency

- [ ] **[Required]** Users are informed when they are interacting with AI — not a human and not a deterministic algorithm.
- [ ] **[Required]** The AI's purpose is described in plain language in the UI (tooltip, onboarding, or help text).
- [ ] **[Recommended]** Users can see why the AI produced a given output (explanation, confidence indicator, or source citation).
- [ ] **[Recommended]** Limitations and known failure modes are documented in the help centre or onboarding flow.
- [ ] **[Recommended]** If the AI uses personalisation, users are informed what data is used and can opt out.

**Notes:** [Any transparency gaps and how they are addressed]

---

## 2. Fairness & bias

- [ ] **[Required]** The feature has been evaluated for performance differences across demographic groups (gender, age, language, region).
- [ ] **[Required]** Training data sources are documented and known biases are recorded.
- [ ] **[Recommended]** Evaluation metrics are disaggregated by user segment, not just overall accuracy.
- [ ] **[Recommended]** A process exists to flag and investigate reports of biased output from users.
- [ ] **[Recommended]** The feature avoids making decisions based on protected characteristics unless legally permitted and necessary.

**Identified biases and mitigations:** [List any known bias issues and how they are handled]

---

## 3. Privacy & data minimisation

- [ ] **[Required]** Only the minimum data required to produce the AI output is sent to the model.
- [ ] **[Required]** User PII handling is documented and reviewed by legal/privacy.
- [ ] **[Required]** If data is sent to a third-party model provider, a DPA (Data Processing Agreement) is in place.
- [ ] **[Required]** Users can request deletion of data used to train or personalise the model.
- [ ] **[Recommended]** Model inputs and outputs are not stored beyond the minimum retention period.
- [ ] **[Recommended]** A privacy impact assessment (PIA) has been completed for high-risk use cases.

**Data flow summary:** [Brief description of what data moves where]

---

## 4. Human oversight & control

- [ ] **[Required]** Users can override or ignore AI output — the system does not force compliance with AI recommendations.
- [ ] **[Required]** A fallback exists if the AI model is unavailable (graceful degradation, not hard failure).
- [ ] **[Recommended]** High-stakes decisions (financial, medical, legal, safety) require human confirmation before action.
- [ ] **[Recommended]** A "report a problem" mechanism is available in the UI for users to flag bad AI output.
- [ ] **[Recommended]** An internal escalation path exists for AI errors that cause user harm.

**Human-in-the-loop design:** [Describe where humans can intervene in the AI decision flow]

---

## 5. Accountability

- [ ] **[Required]** A named PM owns this feature and is responsible for AI behaviour post-launch.
- [ ] **[Required]** An incident response plan exists for AI failure scenarios (wrong output, harmful content, model outage).
- [ ] **[Recommended]** KPIs include an AI quality metric (error rate, override rate, user satisfaction with AI output).
- [ ] **[Recommended]** A post-launch review is scheduled at 30 and 90 days.
- [ ] **[Recommended]** Regulatory requirements (EU AI Act, RBI guidelines, sector-specific rules) have been reviewed and are documented.

---

## 6. Sign-off

| Reviewer | Role | Status | Date |
|---|---|---|---|
| | PM | [ ] Approved  [ ] Needs work | |
| | Legal / Privacy | [ ] Approved  [ ] Waived  [ ] N/A | |
| | Security | [ ] Approved  [ ] Waived  [ ] N/A | |
| | Engineering Lead | [ ] Approved  [ ] Needs work | |
| | Leadership | [ ] Approved  [ ] N/A | |

**Open items before sign-off:**
- [ ] [Item 1]
- [ ] [Item 2]`,
    howToUse: [
      {
        step: "Complete the checklist before design is finalised, not before launch",
        detail:
          "Most teams treat responsible AI as a pre-launch gate. That's too late — transparency and fairness decisions are baked into the design. Run this checklist at the design review stage so you can course-correct before engineering builds something that needs to be rearchitected.",
      },
      {
        step: "Be honest about [Required] items — don't check boxes aspirationally",
        detail:
          "The temptation is to check 'Users are informed when interacting with AI' because you plan to add a tooltip eventually. Only check items that are true today. Required items that are unchecked are blockers, not suggestions. If you can't ship with them checked, escalate — don't quietly mark them done.",
      },
      {
        step: "Use the sign-off table to surface disagreements early",
        detail:
          "Legal and security sign-off often surface requirements that change the feature design (e.g. a DPA with the model provider, or a data retention constraint). Get these stakeholders into the checklist review early — not 48 hours before launch when there's no time to respond to findings.",
      },
      {
        step: "Schedule the 30-day post-launch review before you ship",
        detail:
          "Put the 30-day review on the calendar the day you launch. Teams that plan to review 'after launch' rarely do — the next sprint starts and responsible AI monitoring falls off. A calendar invite with the checklist linked is the minimum viable process.",
      },
    ],
    faqs: [
      {
        q: "Is this checklist required for internal AI tools, or just user-facing features?",
        a: "Sections 1 (Transparency) and 2 (Fairness) are less critical for internal tools used only by employees. Sections 3 (Privacy), 4 (Human oversight), and 5 (Accountability) apply equally — internal users can be harmed by bad AI output, and internal tools that process customer data still have data protection obligations. Use the full checklist for external features; use sections 3–5 for internal tools.",
      },
      {
        q: "How does this relate to the AI Product Risk Assessment?",
        a: "The AI Product Risk Assessment scores and mitigates specific technical risks (accuracy, security, cost). This checklist covers the broader responsible AI principles — transparency, fairness, and accountability — that apply regardless of technical risk scores. Both documents are needed: use the Risk Assessment to catch what can go wrong technically; use this checklist to confirm you've met your ethical and regulatory obligations.",
      },
      {
        q: "What counts as a 'high-stakes decision' that requires human confirmation?",
        a: "Any AI output that directly causes a financial transaction, affects employment, influences a medical decision, or creates a legal obligation counts as high-stakes. For product managers: if a user could sue you because the AI was wrong, it's high-stakes. If a user would just be annoyed because the AI was wrong, it's not. Err on the side of human confirmation when you're unsure.",
      },
    ],
  },

  // ── Template 37 ──────────────────────────────────────────────────────────,

  {
    slug: "prompt-design-template",
    title: "Prompt Design Template",
    shortTitle: "Prompt Design",
    category: "PM × AI",
    description:
      "A structured template for PMs and engineers designing LLM prompts for production features. Covers system prompt, user input handling, output format, edge cases, evaluation criteria, and version history.",
    metaDescription:
      "Free prompt design template for product managers. Structure your LLM system prompts for production AI features with evaluation criteria, edge case handling, and version control.",
    filename: "prompt-design-template.md",
    content: `# Prompt Design Template
**Feature / use case:** [Name]
**Model:** [e.g. claude-sonnet-4-6, gpt-4o]
**PM:** [Name]
**Engineer:** [Name]
**Version:** v1.0
**Date:** [Date]

---

## 1. Purpose

**What is this prompt trying to accomplish?**
[1–2 sentences. Be specific about the output type — classification, generation, extraction, summarisation, etc.]

**Who is the end user?**
[Describe the user and their context — e.g. "A product manager reviewing customer feedback"]

**Where does this prompt run?**
[ ] User-triggered (on demand)  [ ] Background task (async)  [ ] Scheduled batch  [ ] Real-time (< 2s required)

---

## 2. Inputs

| Input | Type | Required | Source | Notes |
|---|---|---|---|---|
| [Input 1] | string / int / list | Yes / No | User / DB / API | [e.g. max 5,000 chars] |
| [Input 2] | | | | |
| [Input 3] | | | | |

**Input validation rules:**
- Minimum length: [e.g. 50 characters — reject if shorter]
- Maximum length: [e.g. 8,000 tokens — truncate or split if longer]
- Sanitisation: [e.g. strip HTML, remove PII before sending]
- Language handling: [English only / multilingual / detect and route]

---

## 3. System prompt

\`\`\`
[Paste the full system prompt here]
\`\`\`

**Prompt design notes:**
- Persona: [Who does the model play? e.g. "You are an expert product manager..."]
- Tone: [e.g. direct, concise, no filler phrases]
- Constraints: [e.g. "Never mention competitor products", "Always respond in the user's language"]
- Format instruction: [e.g. "Respond in JSON", "Use markdown headers", "Maximum 300 words"]

---

## 4. Expected output

**Output format:** [ ] Plain text  [ ] Markdown  [ ] JSON  [ ] Structured list  [ ] Other: ___

**Output schema (if JSON):**
\`\`\`json
{
  "field_1": "string",
  "field_2": ["array", "of", "strings"],
  "field_3": {
    "nested_field": "string"
  }
}
\`\`\`

**Output length target:** [e.g. 200–400 words, 5–10 bullet points, exactly 3 items]

**What a good output looks like:**
[Paste 1–2 example ideal outputs — this becomes your evaluation gold standard]

---

## 5. Edge cases & failure modes

| Scenario | Expected behaviour | Tested? |
|---|---|---|
| Input is too short to be meaningful | [e.g. Return error message, do not call model] | [ ] |
| Input is in an unsupported language | [e.g. Respond in English, flag language mismatch] | [ ] |
| Input contains PII (names, emails, phone numbers) | [e.g. Strip before sending, or reject with message] | [ ] |
| Input is adversarial / prompt injection attempt | [e.g. System prompt instructs model to ignore user overrides] | [ ] |
| Model returns malformed JSON | [e.g. Retry once, then return fallback response] | [ ] |
| Model is unavailable (timeout / rate limit) | [e.g. Queue and retry, or show user error] | [ ] |
| Output exceeds maximum length | [e.g. Truncate at sentence boundary, not mid-word] | [ ] |

---

## 6. Evaluation criteria

Define what "good" means before you start testing. Rate each dimension 1–5.

| Dimension | Definition of 5 (excellent) | Definition of 1 (failure) | Weight |
|---|---|---|---|
| Accuracy | Output is factually correct and grounded in input | Output contains hallucinations or invented facts | High |
| Completeness | All required elements are present | Key sections are missing | High |
| Format compliance | Output exactly matches the required format | Output ignores format instructions | Medium |
| Tone / voice | Output matches the defined persona and tone | Output is off-brand or inconsistent | Low |
| Conciseness | Output contains no unnecessary filler | Output is padded or repetitive | Medium |

**Minimum acceptable score to ship:** [e.g. Average ≥ 3.5 across all dimensions on 20 test cases]

**Evaluation method:**
[ ] Manual review by PM  [ ] Manual review by domain expert  [ ] Automated LLM-as-judge  [ ] A/B test with users

---

## 7. Cost & latency

| Metric | Estimate | Acceptable limit |
|---|---|---|
| Average input tokens | | |
| Average output tokens | | |
| Estimated cost per call | $0.00 | $0.00 |
| Estimated calls / day | | |
| Estimated monthly cost | $0.00 | $0.00 |
| P50 latency | | |
| P95 latency | | |

**Cost optimisation applied:**
- [ ] Prompt caching enabled (if provider supports it)
- [ ] Output length constrained in system prompt
- [ ] Batch processing used where real-time is not required
- [ ] Cheaper model tested and evaluated for this use case

---

## 8. Version history

| Version | Date | Author | Changes | Eval score |
|---|---|---|---|---|
| v1.0 | [Date] | [Name] | Initial version | |
| | | | | |

**Rollback plan:** [e.g. "v1.0 prompt is stored in DB and can be re-deployed without a code push"]`,
    howToUse: [
      {
        step: "Write the expected output before writing the prompt",
        detail:
          "Most teams write a prompt, run it, then decide if the output is good. This leads to drifting standards. Instead: write 5–10 ideal outputs first (Section 4), then write the prompt to produce them. The ideal outputs become your evaluation gold standard and make it obvious when a prompt change has regressed quality.",
      },
      {
        step: "Fill in the edge cases table before the first demo",
        detail:
          "Edge cases like prompt injection, PII in input, and malformed JSON always come up in demos or early users. Filling in Section 5 before you demo forces you to handle them in code — not scramble to fix them after someone's embarrassed by them publicly.",
      },
      {
        step: "Calculate cost before you show the feature to leadership",
        detail:
          "Section 7 exists because teams regularly ship AI features without knowing their per-call cost. A feature that costs $0.05/call at 10 users/day is fine. The same feature at 10,000 users/day is $1,500/day — a budget crisis. Fill this in during development, not after launch.",
      },
      {
        step: "Increment version number every time the system prompt changes",
        detail:
          "A prompt change is a code change. Version it like one. Teams that don't version prompts lose track of what changed when quality degrades. The version history table (Section 8) plus an eval score per version gives you a changelog that makes regression analysis tractable.",
      },
    ],
    faqs: [
      {
        q: "Should this document live in code or in a product/PM tool?",
        a: "The system prompt itself should live in code (or a config layer that is version-controlled). This design document should live wherever your PRDs and specs live — Notion, Confluence, or alongside the PRD in your PM tool. The document describes intent and evaluation criteria; the code contains the actual prompt. Both need to stay in sync.",
      },
      {
        q: "How often should we re-evaluate prompts after launch?",
        a: "Run a manual evaluation pass whenever: (a) the underlying model is updated by the provider, (b) the input distribution changes significantly (new user segment, new data source), (c) user complaints about AI quality spike, or (d) you change the system prompt. A lightweight eval (10–20 test cases) takes under an hour and catches most regressions before users report them.",
      },
      {
        q: "What is 'LLM-as-judge' evaluation and when should we use it?",
        a: "LLM-as-judge is when you use a second LLM call to evaluate the output of the first — e.g. asking Claude to rate whether a generated PRD section is accurate and complete on a 1–5 scale. It is useful for high-volume evaluation where manual review doesn't scale, but it introduces its own biases (models tend to prefer their own style). Use it alongside manual review for the first few evaluation rounds, not as a replacement.",
      },
    ],
  },

  // ── Template 38 ──────────────────────────────────────────────────────────
];