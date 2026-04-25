import type { Template } from "./types";

export const pmIndiaTemplates: Template[] = [
  {
    slug: "india-gtm",
    title: "India GTM Template",
    shortTitle: "India GTM",
    category: "PM × India",
    description:
      "A go-to-market template built for India launches. Covers tier-1/2/3 city sequencing, vernacular language strategy, payment method mix (UPI, wallets, EMI, COD), distribution channels, regulatory considerations, and pricing localisation.",
    metaDescription:
      "Free India go-to-market template for product managers. Covers city-tier sequencing, UPI/Razorpay payments, vernacular language strategy, distribution channels, and India-specific regulatory requirements.",
    filename: "india-gtm.md",
    content: `# India GTM Template
**Product / Feature:** [Name]
**PM:** [Name]
**Target launch date:** [Date]
**Launch scope:** [ ] National  [ ] Tier-1 only  [ ] Tier-1 + Tier-2  [ ] Regional pilot

---

## 1. Market context

**Target segment:**
| Dimension | Definition |
|---|---|
| Geography | [e.g. Metro + Tier-1 first, expand to Tier-2 in Q2] |
| Demographics | [Age, income bracket, device type] |
| Behaviour | [e.g. Mobile-first, UPI users, vernacular-preferred] |
| Company type (B2B) | [e.g. SMBs with 10–200 employees, bootstrapped or early-stage] |

**City tier strategy:**
- **Tier-1 (Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune):** [Approach and rationale]
- **Tier-2 (Jaipur, Lucknow, Ahmedabad, Surat, Kochi…):** [Approach and rationale — often 2× the TAM of Tier-1]
- **Tier-3 and rural:** [Include/exclude and why]

**Language strategy:**
- Primary: [ ] English  [ ] Hindi  [ ] Regional (specify: ___)
- Vernacular support required: [ ] Yes  [ ] No
- Languages to support at launch: [List]
- Localisation scope: [ ] UI strings only  [ ] UI + support  [ ] UI + support + content  [ ] Full product

---

## 2. Pricing

**Pricing model:** [ ] Free + paid tiers  [ ] Subscription  [ ] Pay-per-use  [ ] Enterprise negotiated  [ ] Marketplace

**Price points:**

| Tier | INR / month | INR / year | USD equivalent | Rationale |
|---|---|---|---|---|
| Free | ₹0 | ₹0 | $0 | [What's included and why] |
| [Tier 2] | ₹ | ₹ | $≈ | |
| [Tier 3] | ₹ | ₹ | $≈ | |

**Pricing anchors:**
- Competitor A: [Price in INR]
- Competitor B: [Price in INR]
- Global product with India pricing: [Price in INR]

**GST treatment:** [ ] Prices shown inclusive of GST  [ ] GST added at checkout
**GST rate applicable:** [ ] 18% (software / SaaS)  [ ] Other: ___

---

## 3. Payments

**Payment method mix (India users expect all of these):**

| Method | Required at launch | Provider | Notes |
|---|---|---|---|
| UPI (GPay, PhonePe, Paytm, BHIM) | [ ] Yes  [ ] No | Razorpay / PayU | Dominant for < ₹5,000 transactions |
| UPI AutoPay (recurring) | [ ] Yes  [ ] No | Razorpay | Required for subscriptions |
| Debit card | [ ] Yes  [ ] No | Razorpay | Needed for Tier-2/3 |
| Credit card | [ ] Yes  [ ] No | Razorpay | Urban + premium users |
| Net banking | [ ] Yes  [ ] No | Razorpay | Enterprise + older demographics |
| EMI (no-cost EMI) | [ ] Yes  [ ] No | Razorpay / Cardless | Converts high-ticket purchases |
| Wallets (Paytm, Mobikwik) | [ ] Yes  [ ] No | Razorpay | Declining share but still relevant |
| Cash on Delivery | [ ] Yes  [ ] No | [Logistics partner] | Physical products only |

**Payment failure handling:**
- Retry strategy: [e.g. 3 retries over 3 days, then downgrade]
- Grace period after failed payment: [e.g. 7 days access, then paywalled]
- User communication: [SMS + email + in-app notification]

---

## 4. Distribution channels

| Channel | Priority | Owner | Target CAC | Notes |
|---|---|---|---|---|
| SEO / content (Hindi + English) | | | ₹ | |
| WhatsApp (groups, broadcast) | | | ₹ | High open rates in India |
| YouTube (Hindi explainer / demo) | | | ₹ | |
| LinkedIn (B2B) | | | ₹ | |
| Community (Slack, Discord, Telegram) | | | ₹ | |
| Referral / word of mouth | | | ₹ | |
| Inside sales / WhatsApp outbound (B2B) | | | ₹ | |
| Partnership / channel resellers | | | ₹ | |
| App stores (Play Store, App Store) | | | ₹ | |

**WhatsApp strategy:**
[ ] Not used  [ ] Customer support only  [ ] Marketing broadcast  [ ] Community  [ ] Transactional (OTP, receipts)

---

## 5. Regulatory & compliance checklist

- [ ] **GST registration:** Mandatory if annual revenue > ₹20 lakh (₹10 lakh for some states)
- [ ] **Data localisation:** RBI mandates payment data storage in India; check if applicable
- [ ] **IT Act 2000 / DPDP Act 2023:** Privacy notice and consent mechanism in place
- [ ] **Terms of Service and Privacy Policy:** India-specific disclosures (DPDP Act)
- [ ] **Cancellation & refund policy:** Consumer Protection Act 2019 requirements
- [ ] **Grievance officer:** Mandatory for platforms with Indian users — named contact, 30-day resolution SLA
- [ ] **SEBI / RBI / IRDAI:** Check if product touches financial services, insurance, or lending
- [ ] **App store compliance:** Play Store and App Store India-specific payment rules (if applicable)

**Regulatory review owner:** [Name and role]

---

## 6. Launch sequence

| Phase | Scope | Duration | Success criteria | Go/No-Go owner |
|---|---|---|---|---|
| Alpha | Internal + 20 design partners | 2 weeks | [Metric] | PM |
| Beta | 200 invite-only users, Tier-1 only | 4 weeks | [Metric] | PM + growth |
| GA — Tier-1 | Open signup, metro cities | 4 weeks | [Metric] | PM |
| GA — Tier-2 expansion | Vernacular + Tier-2 onboarding | Ongoing | [Metric] | PM |

---

## 7. Metrics

| Metric | Target at 30 days | Target at 90 days |
|---|---|---|
| Signups | | |
| Activation rate (completed core action) | | |
| Week-1 retention | | |
| MRR | ₹ | ₹ |
| CAC | ₹ | ₹ |
| NPS | | |`,
    howToUse: [
      {
        step: "Set your city-tier strategy before setting your price",
        detail:
          "Pricing that converts in Bangalore often doesn't convert in Lucknow. Tier-2 and Tier-3 users have lower willingness to pay but represent 2–3× the addressable market of Tier-1. Decide your tier sequence first — if you're starting with Tier-1 only, you can price higher and expand down. If you're going broad on day one, price for the median India user, not the median Bangalore user.",
      },
      {
        step: "Launch with UPI AutoPay from day one for any subscription product",
        detail:
          "UPI AutoPay (via Razorpay or PayU) is the lowest-friction recurring payment method for India. Subscriptions that require credit card numbers see 3–5× higher drop-off at checkout. Setting up UPI AutoPay requires NPCI approval through your payment provider — this takes 1–3 weeks. Start the process during development, not the week before launch.",
      },
      {
        step: "Appoint a grievance officer before you publicly launch",
        detail:
          "Under the IT Act and DPDP Act, any platform with Indian users must publicly name a grievance officer with a response SLA of 30 days. This is a legal requirement, not a nice-to-have. Add the officer's name and email to your Privacy Policy and Terms of Service before going live. Failing to do so is a compliance risk that regulators have begun to enforce.",
      },
      {
        step: "Test your WhatsApp strategy as a distribution channel early",
        detail:
          "WhatsApp has 500M+ active users in India with open rates that dwarf email. For B2C, a WhatsApp community or broadcast list can be your highest-ROI distribution channel. For B2B, WhatsApp outbound (personalised, not spam) converts better than cold email in India. Build a WhatsApp presence in beta — don't wait for GA.",
      },
    ],
    faqs: [
      {
        q: "Do I need to register for GST before launching?",
        a: "You need GST registration if your annual turnover exceeds ₹20 lakh (₹10 lakh in some northeastern states) or if you sell digital services to consumers in India regardless of turnover (OIDAR provisions). For SaaS products, GST at 18% applies from the first rupee collected. Register before you start charging users — retroactive GST compliance is painful and penalties apply.",
      },
      {
        q: "Should we price in INR or USD?",
        a: "Price in INR for any product primarily targeting Indian users. INR pricing reduces friction at checkout, avoids FX confusion, and signals that you've built for India. USD pricing is appropriate only for products targeting Indian enterprises that are already used to international SaaS billing. For consumer and SMB products, always INR.",
      },
      {
        q: "How important is Hindi localisation vs. English?",
        a: "For Tier-1 (metro) B2B products targeting educated professionals: English is fine and Hindi localisation is optional. For consumer apps targeting Tier-2 and beyond, or for products where the primary user is not a professional: Hindi (and regional languages) are table stakes. The rule: if your target user reads WhatsApp forwards in Hindi, they want your product in Hindi.",
      },
      {
        q: "What is the DPDP Act and what does it require?",
        a: "The Digital Personal Data Protection Act 2023 is India's primary data privacy legislation. It requires: (a) clear and specific consent before processing personal data, (b) a privacy notice in plain language, (c) a grievance mechanism, and (d) data erasure on request. For most SaaS products, compliance means updating your Privacy Policy, adding a consent flow at signup, and naming a grievance officer. Consult legal counsel for products that handle sensitive data (health, finance, children).",
      },
    ],
  },

  // ── Template 39 ──────────────────────────────────────────────────────────,

  {
    slug: "unit-economics",
    title: "Unit Economics Template",
    shortTitle: "Unit Economics",
    category: "PM × India",
    description:
      "A unit economics framework for Indian SaaS and consumer products. Calculates CAC, LTV, payback period, contribution margin, and cohort-level retention — with India-specific benchmarks and INR-first inputs.",
    metaDescription:
      "Free unit economics template for Indian product managers and founders. Calculate CAC, LTV, payback period, and contribution margin with India SaaS benchmarks and INR inputs.",
    filename: "unit-economics.md",
    content: `# Unit Economics Template
**Product:** [Name]
**Model:** [ ] B2C subscription  [ ] B2B SaaS  [ ] Marketplace  [ ] Transactional
**Currency:** INR (₹)
**Period:** [Month / Quarter / Year]
**Prepared by:** [Name]  **Date:** [Date]

---

## 1. Revenue per unit

| Metric | Value | Notes |
|---|---|---|
| Average Revenue Per User (ARPU) — monthly | ₹ | Blended across all paid tiers |
| Average Revenue Per Account (ARPA) — monthly | ₹ | For B2B: per company, not per seat |
| Gross margin on revenue | % | Revenue minus direct COGS (hosting, payments, support) |
| Net Revenue Retention (NRR) | % | Expansion + contraction + churn; target > 100% for SaaS |
| Monthly churn rate | % | Paid users who cancel in a given month |
| Average contract length | months | |

**COGS breakdown (per user per month):**
| Cost item | ₹ / user / month | Notes |
|---|---|---|
| Hosting / infrastructure | ₹ | AWS, GCP, etc. |
| AI / LLM inference | ₹ | Per-user AI cost |
| Payment processing | ₹ | Razorpay: ~2% + ₹3 per transaction |
| Customer support (burdened) | ₹ | |
| Other direct costs | ₹ | |
| **Total COGS** | **₹** | |
| **Gross margin** | **%** | (ARPU − COGS) / ARPU |

---

## 2. Customer Acquisition Cost (CAC)

| Channel | Monthly spend (₹) | New customers acquired | CAC (₹) | Notes |
|---|---|---|---|---|
| SEO / content | ₹ | | ₹ | |
| Paid social (Meta, LinkedIn) | ₹ | | ₹ | |
| YouTube / video | ₹ | | ₹ | |
| Referral / word of mouth | ₹ | | ₹ | |
| Sales / outbound | ₹ | | ₹ | |
| Partnerships | ₹ | | ₹ | |
| **Blended total** | **₹** | | **₹** | |

**Fully-loaded CAC:** Include salaries of sales and marketing headcount (burdened cost) divided by new customers acquired. Most early-stage teams underestimate CAC by 2–3× when they exclude headcount.

| Component | Monthly cost (₹) |
|---|---|
| Ad spend | ₹ |
| Sales & marketing headcount (burdened) | ₹ |
| Tools (CRM, email, analytics) | ₹ |
| Agency / contractor fees | ₹ |
| **Total S&M spend** | **₹** |
| New customers this month | |
| **Fully-loaded CAC** | **₹** |

---

## 3. Lifetime Value (LTV)

**Simple LTV (gross margin basis):**
\`\`\`
LTV = (ARPU × Gross margin %) / Monthly churn rate
\`\`\`

| Input | Value |
|---|---|
| ARPU (monthly) | ₹ |
| Gross margin | % |
| Monthly churn | % |
| **LTV** | **₹** |

**LTV with expansion revenue:**
If NRR > 100% (customers expand over time), use the discounted cash flow method instead. Discount rate for India SaaS: typically 15–20% annually.

---

## 4. Key ratios

| Ratio | Your value | India SaaS benchmark | Status |
|---|---|---|---|
| LTV : CAC | : 1 | > 3:1 | |
| CAC payback period | months | < 18 months | |
| Gross margin | % | 65–80% (SaaS) | |
| NRR | % | > 100% (growth signal) | |
| Monthly churn | % | < 3% (healthy) | |

**CAC payback period:**
\`\`\`
Payback = CAC / (ARPU × Gross margin %)
\`\`\`

---

## 5. Cohort retention

Track each monthly acquisition cohort's retained revenue over time. This is more honest than aggregate churn.

| Cohort | Month 0 | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|---|
| [Jan cohort] | 100% | % | % | % | % |
| [Feb cohort] | 100% | % | % | % | % |
| [Mar cohort] | 100% | % | % | % | % |

**Observations:**
- [e.g. Month-1 drop is high → onboarding problem]
- [e.g. Month-3 stabilises → product has a retained core]

---

## 6. Path to contribution positive

At current CAC and churn, when does a cohort become contribution-positive (cumulative revenue > CAC)?

| Scenario | CAC | ARPU | Gross margin | Churn | Payback month |
|---|---|---|---|---|---|
| Current | ₹ | ₹ | % | % | |
| Optimistic (lower CAC) | ₹ | ₹ | % | % | |
| Pessimistic (higher churn) | ₹ | ₹ | % | % | |

---

## 7. India-specific considerations

**Payment failure impact on churn:**
UPI AutoPay failures are common in India (bank server downtime, insufficient balance). Track involuntary churn separately from voluntary churn. Involuntary churn inflates your churn rate — a dunning/retry flow can recover 20–40% of failed payments.

**INR depreciation:**
If you have USD-denominated costs (AWS, OpenAI/Anthropic, Stripe fees) and INR revenue, currency risk affects your gross margin. At ₹84/USD, a $0.01/user/month cost increase is ₹0.84/user/month — small at 100 users, material at 10,000.

**GST pass-through:**
Ensure your ARPU figures are net of GST (18%). If you collect ₹1,000/month from a customer, your recognisable revenue is ₹847 (the rest is GST owed to the government). Modelling on gross-of-GST ARPU overstates revenue.`,
    howToUse: [
      {
        step: "Calculate fully-loaded CAC, not just ad spend",
        detail:
          "Early-stage teams routinely underestimate CAC by 2–3× because they only count ad spend. Fully-loaded CAC includes sales and marketing headcount (burdened: salary + benefits + equity dilution), tools, agency fees, and content production. If your LTV:CAC ratio looks great on ad spend alone but terrible when you include headcount, your business model is funding its growth with labour it isn't accounting for.",
      },
      {
        step: "Track cohort retention before you trust your churn number",
        detail:
          "Aggregate monthly churn is misleading when your user base is growing. A cohort table (Section 5) shows what actually happens to users acquired in a given month. If Month-1 retention is 40%, you have an activation/onboarding problem. If Month-1 is 80% but Month-6 is 20%, you have a long-tail engagement problem. Both look like '5% monthly churn' in aggregate but require completely different fixes.",
      },
      {
        step: "Separate voluntary and involuntary churn in India",
        detail:
          "India has unusually high involuntary churn — UPI AutoPay and card payments fail frequently due to bank downtime, OTP friction, and insufficient balance. Treat involuntary churn as an ops problem (dunning, retry, grace period), not a product problem. Mix them together and you'll build the wrong thing. Target: recover ≥ 30% of failed payments within 7 days through a retry and in-app notification flow.",
      },
      {
        step: "Model your gross margin net of GST from day one",
        detail:
          "GST at 18% on SaaS revenue is owed to the government — it is not your revenue. If you model unit economics on gross-of-GST ARPU, your LTV will be overstated by 18% and your business will look more attractive than it is. Model revenue as net-of-GST from the first spreadsheet.",
      },
    ],
    faqs: [
      {
        q: "What is a good LTV:CAC ratio for an India SaaS product?",
        a: "The global benchmark of 3:1 applies to India SaaS as well, but the absolute numbers are different. An India SaaS product with ₹500 ARPU and ₹1,500 CAC at 3:1 is healthy. The more important number is payback period — if CAC payback exceeds 18 months, you need significant capital to fund growth. Most India-focused SaaS products target 9–12 month payback as a capital-efficient model.",
      },
      {
        q: "How do I calculate LTV when I don't have 12 months of retention data?",
        a: "Use the simple formula (ARPU × gross margin) / monthly churn as an approximation. Be conservative: use your worst monthly churn rate, not your best. For early-stage products (< 6 months of data), LTV is an estimate, not a fact — treat it as a planning input, not a fundraising claim. State your assumptions explicitly when sharing the number with investors.",
      },
      {
        q: "Should I include founding team time as a CAC cost?",
        a: "Yes, if you are using it to make operating decisions. Exclude it if you are presenting to investors who understand that founding team time is a sunk cost at the pre-seed stage. The honest internal number includes all labour. The fundraising number typically excludes founders but includes hired sales and marketing headcount.",
      },
    ],
  },

  // ── Template 40 ──────────────────────────────────────────────────────────,

  {
    slug: "fundraising-prd",
    title: "Fundraising PRD",
    shortTitle: "Fundraising PRD",
    category: "PM × India",
    description:
      "A PRD format tailored for fundraising conversations — frames the problem, solution, and build plan in the language investors use. Covers market sizing, why now, defensibility, and the specific ask. Built for India-based founders raising pre-seed to Series A.",
    metaDescription:
      "Free fundraising PRD template for Indian founders and PMs. Frame your product in investor language — problem, solution, market size, why now, defensibility, and the ask. Pre-seed to Series A.",
    filename: "fundraising-prd.md",
    content: `# Fundraising PRD
**Company / Product:** [Name]
**Stage:** [ ] Pre-seed  [ ] Seed  [ ] Pre-Series A  [ ] Series A
**Round size:** ₹ [Amount] / $[Amount]
**PM / Founder:** [Name]  **Date:** [Date]

---

> **How to use this document:**
> This is not a pitch deck. It is the written product narrative that goes *behind* the pitch deck — the document you send to investors before a meeting so they arrive informed, and the document they share with partners during partner review. It should be readable in 8–12 minutes. Be specific. Investors read hundreds of vague documents. Specificity signals rigour.

---

## 1. The problem

**One sentence:**
[The single clearest statement of the problem you solve]

**Who has this problem?**
[Describe the user — job title, company type, behaviour, geography. Be specific: "Product managers at Indian SaaS companies with 20–200 employees" is better than "product managers".]

**How big is the pain? Evidence:**
- [Data point 1 — ideally from your own customer interviews]
- [Data point 2 — industry research or published data]
- [Data point 3 — competitor or proxy market evidence]

**What do they do today?**
[The current workaround — this is your real competition. Be honest. "They use spreadsheets" is less compelling than "they spend 4 hours after each customer interview manually transferring notes into Notion, then re-read everything before writing the PRD".]

**Why is the current solution inadequate?**
[The specific failure mode of the workaround that your product addresses]

---

## 2. The solution

**One sentence:**
[What your product does — lead with outcome, not features]

**The core mechanism (how it works in plain language):**
[3–5 sentences. Describe the user workflow from problem to solution. No jargon. An investor who has never managed a product should understand this.]

**Demo or proof:**
[ ] Live product available at [URL]
[ ] Recorded demo at [URL]
[ ] Prototype / mockups available

**The "aha moment" — when does the user first feel the value?**
[Describe the specific moment in the product where value becomes undeniable. This tells investors you understand your activation metric.]

---

## 3. Market

**TAM (Total Addressable Market):**
[₹ / $ — the total spend on this category globally or in India]

**SAM (Serviceable Addressable Market):**
[₹ / $ — the portion you can realistically reach with your distribution model]

**SOM (Serviceable Obtainable Market — 3-year target):**
[₹ / $ — what you will capture in 3 years given your go-to-market]

**Market sizing approach:** [ ] Top-down (TAM × share)  [ ] Bottom-up (customers × ARPU)
*Investors trust bottom-up more. If you've done both, present bottom-up first.*

**Bottom-up calculation:**
\`\`\`
[Target customers in India] × [% reachable via your channels] × [% who will pay] × [ARPU] = [SOM]
[Number] × [%] × [%] × ₹[ARPU] = ₹[SOM]
\`\`\`

---

## 4. Why now

Three conditions that make this the right time to build this product:

1. **[Enabling condition 1]:** [e.g. LLM costs dropped 90% in 18 months — the AI cost that made this category uneconomical is now viable]
2. **[Enabling condition 2]:** [e.g. India SaaS market crossed $10B ARR — enough paying customers exist to support this category]
3. **[Enabling condition 3]:** [e.g. Post-COVID, remote work normalised async documentation — the behaviour PMRead requires is now standard]

*"Why now" is the question most decks skip. Investors who pass often do so because they don't believe this is the right time — not because they don't believe in the problem.*

---

## 5. Traction

| Metric | Value | Period |
|---|---|---|
| Signups | | |
| Active users (weekly) | | |
| Paying customers | | |
| MRR | ₹ | |
| MoM growth | % | |
| NPS / CSAT | | |
| Notable customers | [Names if permissible] | |

**Most compelling customer story (1 paragraph):**
[The customer who gets the most value from your product — what they were doing before, what they do now, and what the measurable difference is]

---

## 6. Business model

| Revenue stream | Description | ARPU (₹/month) | Status |
|---|---|---|---|
| [e.g. Pro subscription] | [Description] | ₹ | [ ] Live  [ ] Planned |
| [e.g. Team plan] | [Description] | ₹ | [ ] Live  [ ] Planned |

**Unit economics summary:**
- CAC: ₹[amount]
- LTV: ₹[amount]
- LTV:CAC: [ratio]
- Gross margin: [%]
- CAC payback: [months]

---

## 7. Why we win — defensibility

| Moat | Description | Strength today | Strength at scale |
|---|---|---|---|
| Data moat | [e.g. Proprietary training data from customer feedback] | Weak | Medium |
| Network effect | [e.g. Insights are richer when more team members upload] | None | Medium |
| Switching cost | [e.g. Historical insights and PRDs live in PMRead] | Medium | Strong |
| Brand / distribution | [e.g. #1 for "India PRD tool" on Google] | Weak | Medium |
| Regulatory | [e.g. India data localisation advantage] | N/A | N/A |

**Why a well-funded competitor can't immediately replicate what you've built:**
[Be honest. "We have a 6-month head start" is not a moat. "We have 18 months of insight data from 200 companies that trains our ranking model" is a moat.]

---

## 8. Team

| Name | Role | Relevant background |
|---|---|---|
| [Name] | CEO / PM | [e.g. 5 years as PM at Razorpay, shipped X feature used by Y users] |
| [Name] | CTO / Engineering | [e.g. Previously staff engineer at Swiggy, built real-time logistics at scale] |

**Why this team?**
[The specific experience that makes this team the right one to solve this problem — not generic "we're passionate", but domain expertise, network, or unfair access that others don't have]

---

## 9. The ask

**Round size:** ₹[Amount] / $[Amount]
**Instrument:** [ ] SAFE  [ ] Convertible note  [ ] Priced equity
**Valuation cap / pre-money:** ₹[Amount] / $[Amount]

**Use of funds (18-month runway):**

| Category | Amount (₹) | % of round | What it buys |
|---|---|---|---|
| Engineering | ₹ | % | [e.g. 2 senior engineers, 18 months] |
| Go-to-market | ₹ | % | [e.g. Content + SEO + 1 growth hire] |
| Infrastructure | ₹ | % | [e.g. AWS + LLM inference costs at 10× current scale] |
| Operations | ₹ | % | [e.g. Legal, compliance, office] |
| **Total** | **₹** | **100%** | |

**Milestones this round gets you to:**
- [ ] [Milestone 1 — e.g. ₹X MRR by [date]]
- [ ] [Milestone 2 — e.g. Series A-ready metrics: 3:1 LTV:CAC, < 5% monthly churn]
- [ ] [Milestone 3 — e.g. [N] enterprise design partners signed]

**What changes after this round that doesn't change without it:**
[The specific bets you can take with this capital that you cannot take at the current burn rate]`,
    howToUse: [
      {
        step: "Write the 'What do they do today?' section before anything else",
        detail:
          "The current workaround is the most important thing in this document. It defines your real competition (not Notion or Dovetail — the actual behaviour), your baseline for measuring value, and the switching cost you need to overcome. Investors who don't understand the incumbent behaviour will not understand why your product is compelling. Interview 5 customers about their current workflow before writing this section.",
      },
      {
        step: "Use bottom-up market sizing exclusively",
        detail:
          "Top-down market sizing ('the global PM software market is $X billion, we will capture 1%') is a red flag for sophisticated investors. It signals you don't know your customer. Bottom-up sizing forces you to name a specific number of target customers, a realistic conversion rate, and a realistic ARPU. If the resulting number is smaller than the TAM-percentage number, that's the honest market size — and investors will respect the honesty.",
      },
      {
        step: "Answer 'Why now' before the investor asks it",
        detail:
          "'Why now' is the question most founders cannot answer — which is why most investors ask it. Three structural reasons that make this the right moment (technology shift, regulatory change, behaviour change, market inflection) are more convincing than traction alone. If you can't answer why this wasn't built 5 years ago, you haven't thought through why it will survive competition from better-funded players.",
      },
      {
        step: "Be specific about use of funds — line-item level, not categories",
        detail:
          "Vague use of funds ('product, marketing, operations') signals an early-stage team that hasn't modelled their business. Line-item specificity ('2 senior engineers at ₹30L/year = ₹60L, 18 months runway = ₹90L') shows financial rigour and makes your milestones credible. Investors who question your use of funds are really questioning whether you know how to allocate capital — answer that question before they ask it.",
      },
    ],
    faqs: [
      {
        q: "Should this be sent before or after a pitch meeting?",
        a: "Send a 1-page version (problem + solution + traction + ask) before the meeting to give the investor enough context to ask good questions. Send the full Fundraising PRD after the meeting to the partner who attended, along with a note asking them to share it in the partner review. The full document is designed for the partner review stage — where your champion is presenting to colleagues who haven't met you.",
      },
      {
        q: "How is a Fundraising PRD different from a pitch deck?",
        a: "A pitch deck is a visual narrative designed for a 10-minute presentation. A Fundraising PRD is a written document designed for an 8-minute read. They cover the same ground but serve different stages: deck for the first meeting, PRD for due diligence and partner review. The PRD is longer, more specific, and includes evidence that doesn't fit on a slide (customer quotes, cohort tables, unit economics detail).",
      },
      {
        q: "What's the right pre-money valuation for an India pre-seed / seed round?",
        a: "India pre-seed (₹1–3 crore) typically closes at ₹5–15 crore pre-money valuation. Seed (₹3–8 crore) closes at ₹15–40 crore pre-money. These are ranges, not norms — traction, team pedigree, and market size all move the number. The right valuation is the one that leaves enough dilution for future rounds: avoid raising pre-seed at a valuation that makes Series A math awkward. Rule of thumb: don't give up more than 15–20% at pre-seed.",
      },
      {
        q: "Should I include financial projections?",
        a: "Include a 3-year projection as a supplement, not in the main document. State the assumptions explicitly (growth rate, churn, hiring plan) because investors will stress-test the assumptions, not the numbers. Don't anchor to a specific revenue figure — anchor to the model. 'At 5% monthly growth and 3% churn with current ARPU, we reach ₹X ARR in 24 months' is more credible than 'We will reach ₹X ARR in 24 months'.",
      },
    ],
  },

  // ── Template 41 ──────────────────────────────────────────────────────────
  {
    slug: "b2b-saas-pricing",
    title: "B2B SaaS Pricing Template",
    shortTitle: "B2B SaaS Pricing",
    category: "PM × India",
    description:
      "A pricing design framework for Indian B2B SaaS products. Covers packaging tiers, pricing metrics, value-based anchoring, competitive positioning, INR vs USD considerations, and a pricing change communication plan.",
    metaDescription:
      "Free B2B SaaS pricing template for Indian product managers and founders. Design tiers, choose pricing metrics, set INR price points, and plan pricing changes with this step-by-step framework.",
    filename: "b2b-saas-pricing.md",
    content: `# B2B SaaS Pricing Template
**Product:** [Name]
**PM / Founder:** [Name]
**Date:** [Date]
**Stage:** [ ] Pre-launch pricing  [ ] Pricing refresh  [ ] Expansion to new segment

---

## 1. Pricing objective

What is this pricing designed to achieve right now?

[ ] **Maximise adoption** — lowest viable price, optimise for user count over revenue
[ ] **Maximise revenue** — extract maximum willingness-to-pay from current market
[ ] **Qualify buyers** — price filters out non-serious buyers; supports enterprise sales
[ ] **Compete on price** — undercut incumbents to win market share
[ ] **Signal quality** — premium price positions product above low-end alternatives

*Pick one primary objective. Pricing that tries to achieve all of these achieves none.*

---

## 2. Customer segments and willingness to pay

| Segment | Description | Company size | Budget authority | WTP range (₹/month) |
|---|---|---|---|---|
| [Segment 1] | [e.g. Solo founders / indie hackers] | 1 | Self-serve | ₹0–₹500 |
| [Segment 2] | [e.g. SMB product teams] | 10–100 | PM or founder | ₹1,000–₹5,000 |
| [Segment 3] | [e.g. Mid-market SaaS companies] | 100–500 | VP Product | ₹10,000–₹50,000 |
| [Segment 4] | [e.g. Enterprise] | 500+ | CPO / procurement | ₹50,000+ |

**Primary segment you are pricing for:** [Name]

**How WTP was determined:**
[ ] Customer interviews (n = ___)
[ ] Competitive pricing research
[ ] Van Westendorp price sensitivity survey
[ ] Conjoint analysis
[ ] Gut feel (flag: validate before launch)

---

## 3. Pricing metric

The pricing metric is *what you charge for* — the unit that scales with value delivered.

| Metric option | Aligns with value? | Easy for customer to understand? | Easy for you to meter? | Notes |
|---|---|---|---|---|
| Per seat / per user | | | | Most common in B2B SaaS |
| Per project / workspace | | | | Good for project-based tools |
| Usage-based (API calls, docs processed) | | | | High alignment, complex billing |
| Per outcome (PRDs generated, insights extracted) | | | | Ideal if outcomes are measurable |
| Flat rate | | | | Simple; misses expansion revenue |
| Hybrid (base + usage) | | | | Common at scale |

**Selected pricing metric:** [Metric]
**Rationale:** [Why this metric aligns best with the value the customer receives]

---

## 4. Tier design

| | [Free / Starter] | [Growth / Pro] | [Business / Team] | [Enterprise] |
|---|---|---|---|---|
| **Monthly price (INR)** | ₹0 | ₹ | ₹ | Custom |
| **Annual price (INR)** | ₹0 | ₹ | ₹ | Custom |
| **Annual discount** | — | % off | % off | Negotiated |
| **[Core limit 1]** | | | | Unlimited |
| **[Core limit 2]** | | | | Unlimited |
| **[Feature A]** | ✗ | ✓ | ✓ | ✓ |
| **[Feature B]** | ✗ | ✗ | ✓ | ✓ |
| **Support** | Community | Email | Priority | Dedicated CSM |
| **SLA** | None | None | 99.9% uptime | 99.9% + custom |
| **Billing** | — | Self-serve | Self-serve | Invoice / PO |

**Free tier purpose:**
[ ] Acquisition funnel (freemium → paid conversion)
[ ] Permanent free tier for small users (PLG)
[ ] Free trial only (time-limited, not permanent)
[ ] No free tier

**What limits drive upgrades from free → paid?**
[The specific friction points that make paying users prefer the paid tier]

**What limits drive upgrades from Growth → Business?**
[The specific team/collaboration features that unlock at the higher tier]

---

## 5. Pricing in INR vs USD

| Scenario | Recommendation |
|---|---|
| Primary market is India | Price in INR. Always. |
| India + global mix | INR for India, USD for international. Two separate pricing pages. |
| Enterprise India customers | INR invoice preferred; USD acceptable for MNCs |
| India startup with USD runway | Internal modelling in USD; customer-facing in INR |

**Your pricing currency:** [ ] INR only  [ ] INR + USD  [ ] USD only

**INR to USD equivalence check:**
| Tier | INR price | USD equivalent at ₹84/$ | Global comparable | vs. Global |
|---|---|---|---|---|
| [Tier 1] | ₹ | $ | $ | [X% cheaper / at parity] |
| [Tier 2] | ₹ | $ | $ | |
| [Tier 3] | ₹ | $ | $ | |

*India SaaS products typically price at 30–60% of global equivalents. Lower is not always better — underpricing signals low quality to enterprise buyers.*

**GST:** All INR prices should be displayed as exclusive of GST (18%). Show GST as a separate line item at checkout. Inclusive pricing creates accounting complexity.

---

## 6. Competitive positioning

| Competitor | Price (INR equivalent) | Pricing metric | Key differentiator |
|---|---|---|---|
| [Competitor 1] | ₹ /month | | |
| [Competitor 2] | ₹ /month | | |
| [Global tool (India pricing)] | ₹ /month | | |
| **Your product** | **₹ /month** | | |

**Positioning statement:**
[Your product] is [cheaper / at parity / premium] vs. [primary competitor] because [reason — different metric, different segment, different value].

---

## 7. Annual vs monthly discount

| Discount level | Effect |
|---|---|
| < 10% | Insufficient incentive; most customers stay monthly |
| 15–20% | Standard; converts ~20–30% of customers to annual |
| 25–30% | Strong incentive; increases annual conversion and reduces churn |
| > 30% | May signal pricing uncertainty; use only during launch promotions |

**Your annual discount:** [%]
**Annual plan objective:** [ ] Reduce churn  [ ] Improve cash flow  [ ] Both

---

## 8. Pricing change communication plan

*Every pricing change — new tiers, limit reductions, price increases — requires a communication plan. Surprises create churn.*

**Grandfather policy:**
[ ] Existing customers keep current price forever
[ ] Existing customers keep current price for [N] months, then migrate
[ ] Existing customers get [X%] discount on new price
[ ] No grandfather — all customers migrate immediately

**Communication timeline:**
| Action | Timing | Channel |
|---|---|---|
| Email announcement | [N] days before change | Email + in-app banner |
| In-app notice | [N] days before change | Dashboard banner |
| Final reminder | 3 days before change | Email |
| FAQ / help article | Before announcement | Help centre |

**Rollback plan:** [How you will handle the pricing change if conversion drops > X% or churn spikes > Y%]`,
    howToUse: [
      {
        step: "Define your pricing objective before designing tiers",
        detail:
          "Pricing that tries to maximise adoption AND maximise revenue simultaneously ends up doing neither. Decide your objective first — adoption-stage products should price for breadth (generous free tier, low entry point); revenue-stage products should price for depth (fewer tiers, higher ARPU, annual commitment). Mixing these produces tiers that confuse buyers and cannibalize upgrade revenue.",
      },
      {
        step: "Validate willingness-to-pay with real customers before setting numbers",
        detail:
          "The single most common pricing mistake is pricing from cost-up ('our costs are ₹X, so we charge ₹3X') or competitor-down ('they charge ₹2,000, so we charge ₹1,500'). Neither approach is anchored in how much customers actually value the outcome. Run 5–10 customer interviews with the Van Westendorp question set ('At what price would this be too expensive? Too cheap? A bargain? Beginning to be expensive?') before finalising numbers.",
      },
      {
        step: "Choose a pricing metric that scales with the value customers get",
        detail:
          "Per-seat pricing is the default but not always the right choice. If a customer gets value from PRDs generated (not from seats), per-PRD pricing captures more revenue from high-volume users without pricing out small teams. The test: does the pricing metric go up when the customer gets more value? If yes, use it. If the metric can go up while value stays flat (e.g. paying per seat when only 2 of 10 seats are active), consider a different metric.",
      },
      {
        step: "Plan the grandfather policy before announcing any price change",
        detail:
          "Price increases are the #1 trigger for B2B churn and negative reviews in India. The antidote is a generous, clearly-communicated grandfather policy. Customers who feel treated fairly stay — even at higher prices. Announce the change 30+ days before it takes effect, offer a locked-in rate for annual commitment, and make the grandfather terms prominent. Companies that handle price changes poorly create more churn than the price increase generates in revenue.",
      },
    ],
    faqs: [
      {
        q: "Should Indian B2B SaaS products charge less than global competitors?",
        a: "Not necessarily. For SMB and consumer segments, India pricing at 30–50% of global is appropriate because WTP is genuinely lower. For enterprise buyers — large Indian tech companies, banks, MNCs — WTP is closer to global rates and underpricing signals low quality. The key is to segment: price your SMB tier for India, and price your enterprise tier for the value delivered, not the geography.",
      },
      {
        q: "When should we move from flat-rate to usage-based pricing?",
        a: "Move to usage-based when: (a) your costs scale linearly with usage, (b) usage varies significantly across customers (a 10× usage difference between your smallest and largest customer), and (c) customers can predict and control their usage. Usage-based pricing aligns revenue with value but creates billing unpredictability for customers — mitigate this with monthly caps or commitment tiers that offer usage discounts.",
      },
      {
        q: "How do we handle GST on SaaS subscriptions in India?",
        a: "SaaS subscriptions are taxed at 18% GST in India (classified as 'Online Information Database Access and Retrieval' / OIDAR services). Always display prices ex-GST with GST shown as a separate line item at checkout. For B2B customers with GST registration, the GST is recoverable as input credit — so inclusive pricing gives them less clarity. Register for GST before you start billing; penalties for late registration apply retrospectively.",
      },
    ],
  },
];