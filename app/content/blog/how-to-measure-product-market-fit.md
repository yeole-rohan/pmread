---
title: How to Measure Product-Market Fit
slug: how-to-measure-product-market-fit
description: Product-market fit is real but hard to measure. Here's the framework PMs actually use — retention curves, Sean Ellis score, and the signals that don't lie.
category: Product Strategy
keywords: [product market fit, how to measure product market fit, pmf survey, sean ellis test, product market fit metrics]
publishedAt: 2026-04-24
updatedAt: 2026-04-24
readingTime: 7
author: rohan-yeole
featured: false
---

Product-market fit is one of those concepts that everyone uses and almost nobody measures rigorously.

The classic definition — Marc Andreessen's "product is in a good market with a product that can satisfy that market" — is true but not operational. It doesn't tell you what to look at, when you have it, or when you're close.

Here's how to actually measure it.

## The Retention Curve Test

The most reliable signal of product-market fit is a retention curve that flattens.

Plot the percentage of users who are still active at each week (or month, depending on your product's natural cadence) after signup. If the curve hits zero and stays there, you don't have PMF. If it flattens and stabilizes — even at a low percentage — you have a core of users who've made your product a habit.

What "flattens" looks like depends on the category:
- **B2B SaaS tools:** D30 retention above 20% is a signal; above 35% is strong
- **Consumer apps (daily use):** D7 above 25% is a signal; D30 above 15% is strong
- **Low-frequency B2B (monthly use):** Week 12 retention above 40% is strong

The shape of the curve matters more than the absolute numbers. A curve that decays slowly and then flattens is a much better signal than one that drops fast but never fully reaches zero.

## The Sean Ellis 40% Rule

Sean Ellis, who helped grow Dropbox and LogMeIn, proposed a simple survey question: **"How would you feel if you could no longer use [product]?"**

Response options: Very disappointed / Somewhat disappointed / Not disappointed

If 40% or more of respondents say "very disappointed," you have (or are approaching) PMF. Below 40% means you haven't found it yet or you haven't found the right segment.

The benchmark is controversial — some products cross 40% with a niche segment before finding broader appeal — but it's useful because it forces you to ask users directly rather than infer from usage data alone.

Run this survey at 30 days post-signup, with users who have used the product at least twice (single-session users skew the results heavily).

## Cohort-Based NPS

A single NPS number is almost meaningless for measuring PMF. Cohort-based NPS tells you something.

Look at NPS by signup month. If the score is improving across cohorts — October cohort scores higher than September, November higher than October — you're improving the product experience in a way that's actually landing. If it's flat or declining despite feature work, you're shipping to the wrong problem.

The "detractor" open-text responses are often the most useful data point in the whole survey. They tell you what's missing, not just that something is.

## Qualitative Signals You Can't Ignore

Numbers tell you *that* something is happening. Qualitative research tells you *why*. For PMF specifically, the qualitative signals that matter most are:

**Organic word-of-mouth.** Are users referring others without being asked? This is the clearest PMF signal in B2C and increasingly common in B2B (especially bottom-up tools). Track referral source carefully in your signup flow.

**Workarounds.** Are users building workarounds to get more out of your product? Users who create Zapier automations, write scripts, or hack together browser extensions to extend your product are telling you they're deeply invested. That's a PMF signal.

**Pull requests and feature requests with specificity.** "I'd love a dark mode" is table stakes. "I need an API endpoint for batch insight export because I'm syncing PMRead with our internal wiki every week" is a PMF signal — this user has built you into their workflow.

**Resistance to churning.** When you talk to churned users and they say "I had to switch because my company mandated X" or "my role changed" rather than "it wasn't useful" — that's a different signal than pure churn rate suggests.

## B2B vs. B2C PMF Looks Different

In **B2C**, PMF often shows up as viral growth, high daily active usage, and social sharing. The retention signal is fast — you know within weeks. The Sean Ellis score is easy to collect at scale.

In **B2B**, PMF shows up more slowly. A customer who renews, expands seats, and refers a colleague 9 months after signup is exhibiting PMF — you just had to wait for the renewal cycle to see it. The Sean Ellis survey is harder to run (fewer users, each one matters more), so qualitative signals carry more weight.

The other B2B-specific signal: **expansion revenue**. If customers are consistently expanding from a lower tier to a higher tier, or adding seats, without you having to sell them on it — that's strong PMF within that segment.

## What to Do When You Don't Have PMF

Most teams respond to weak PMF signals by shipping more features. That's usually the wrong move.

The right sequence is:
1. **Narrow the segment.** Find the 20% of users where your retention is strongest, and understand them deeply. PMF is always segment-specific before it's general.
2. **Talk to your best users.** The "very disappointed" cohort in your Ellis survey has the answer. Run the [User Interview Script](/templates/user-interview-script) with them — specifically: what job are they hiring your product to do, and what's missing?
3. **Cut features, not add them.** Products that try to be everything to everyone achieve PMF for no one. The most common path to PMF is finding the core loop that works and making it obviously better.
4. **Change the retention metric, not the goal.** If your "active user" definition is too loose (any login counts), tighten it to meaningful engagement. A better metric will show you where PMF exists more clearly.

## PMF Is Not Binary

The hardest thing to accept about product-market fit is that it's a spectrum, not a threshold. You don't suddenly "have" it on a Tuesday.

What you're looking for is the combination of signals pointing in the same direction: retention flattening, Ellis score rising, organic referrals appearing, qualitative research confirming the core use case. When three of those four are moving together, you're in the zone.

Track them consistently. The month-over-month trend in your Ellis score is more useful than any single reading.
