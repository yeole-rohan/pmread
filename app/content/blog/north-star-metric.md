---
title: "North Star Metric: How to Pick the Right One"
slug: north-star-metric
description: Your north star metric is wrong if only one team can influence it. Here's how to pick one that aligns product, engineering, and growth around the same outcome.
category: Product Strategy
keywords: [north star metric, north star metric definition, nsm product management, product metrics, north star metric examples]
publishedAt: 2026-04-24
updatedAt: 2026-04-24
readingTime: 6
author: rohan-yeole
featured: false
---

Most teams pick a north star metric that's either too high-level to act on or too narrow to mean anything beyond one team.

The north star metric is the single number that best captures the core value your product delivers to users. It's not a revenue metric (that's a business metric), it's not a feature metric (that's a leading indicator), and it's not an engagement metric unless engagement *is* your core value.

Getting it right is harder than it sounds.

## What Makes a Good North Star Metric

A good north star metric has five properties:

**It measures user value, not business value.** Monthly Recurring Revenue is a business outcome, not a user value. "Weekly active reports generated" or "insights extracted per project" measures whether users are getting something out of the product. Revenue follows user value; it doesn't define it.

**Multiple teams can influence it.** If only the growth team can move the metric, it's a growth metric, not a north star. Engineering, product, design, and customer success should each be able to identify initiatives that would move it.

**It's leading, not lagging.** Revenue and churn are lagging indicators — they tell you what already happened. A good north star leads revenue: it predicts it. If your north star is rising, revenue should follow in 30–90 days.

**It's resistant to gaming.** "Users who complete onboarding" gets gamed the moment the onboarding flow is redesigned to lower the bar. "Users who generate at least one PRD per month" is harder to game because it requires genuine product usage.

**It correlates with retention.** Run the analysis: which in-product action in week 1 most strongly predicts whether a user is still active at week 8? That action is probably your north star — or a strong candidate for it.

## Examples by Product Type

| Product type | North star metric |
|---|---|
| Collaboration tool (Slack) | Messages sent per active team |
| Marketplace (Airbnb) | Nights booked |
| Creator platform (Spotify) | Time listening per user |
| PM tool (PMRead) | PRDs generated from customer evidence |
| SaaS analytics (Amplitude) | Queries run per user |
| E-commerce | Purchases per buyer per quarter |

Notice that none of these are revenue metrics, and none are purely engagement metrics like "daily active users." They all measure a unit of value delivered.

## The "One Thing" Test

Ask your team: if users do *one thing* in your product that tells you it's working, what is it?

For Duolingo, it's completing a lesson. For Notion, it's sharing a page. For GitHub, it's a commit. For PMRead, it's generating a PRD from uploaded customer evidence — not just creating an account, not just uploading a file, but completing the core loop.

The answer to the "one thing" question is usually your north star.

## How to Validate Your Candidate Metric

Before committing to a north star, validate it with two tests:

**Retention correlation test.** Take your candidate metric (e.g., "users who generated ≥ 1 PRD in week 1") and compare their 8-week retention to users who didn't. If the retained cohort is significantly larger, you've found a metric that predicts long-term value. If there's no difference, the metric doesn't capture what makes users stick.

**Business correlation test.** Does improving the metric lead to better business outcomes (revenue, expansion, lower churn) within a 60–90 day lag? If you can show the historical correlation, your metric has credibility with leadership.

## North Star vs. Input Metrics

The north star alone isn't enough to run the business. You need **input metrics** — the team-level metrics that, when improved, move the north star.

```
North Star: PRDs generated from customer evidence per month

Input metrics:
├── Acquisition: Signups from organic search
├── Activation: % of users who upload a file in session 1
├── Engagement: Avg. insights extracted per project
└── Retention: % of users who return to generate a second PRD
```

Each team owns one or two input metrics. Product and engineering own activation and engagement. Growth owns acquisition. Customer success owns retention for enterprise. The north star is the shared accountability everyone works toward.

## Common Mistakes

**Picking DAU/WAU as the north star.** Active users is an engagement metric, not a value metric. A user who logs in daily but doesn't accomplish anything is "active" but not getting value. Move one level deeper: active users *who do X*.

**Using a metric no one can explain.** If your customer success team can't describe the north star to a new customer in one sentence, it's not a north star — it's a dashboard KPI. Simplicity is a feature of the metric, not a compromise.

**Changing it every quarter.** The north star should be stable for at least a year. Changing it constantly signals that you're chasing symptoms rather than measuring the core value proposition. Pick carefully, then commit.

**Ignoring the ceiling.** Some metrics have natural ceilings: you can only generate so many PRDs per month as a solo PM. If your north star has a hard ceiling that doesn't scale with your growth ambitions, you'll need to revisit it — but only once you've hit the ceiling, not preemptively.

Use our [North Star Metric template](/templates/north-star-metric) to map your candidate metric against retention and business data, and define the input metrics for each team.
