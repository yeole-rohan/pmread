---
title: How to Write User Stories That Engineers Love
slug: how-to-write-user-stories
description: The As/I can/So that format is just the start. Here's how to write user stories with clear acceptance criteria, edge cases covered, and zero ambiguity for engineering.
category: PRD Writing
keywords: [how to write user stories, user story template, agile user story format, acceptance criteria template, user story generator]
publishedAt: 2026-04-24
updatedAt: 2026-04-24
readingTime: 6
author: rohan-yeole
featured: false
---

A user story is the smallest unit of product work that delivers user value. Most teams use them. Almost no teams write them well.

The problem isn't the format. The problem is that "As a user, I want to see my dashboard so that I can track my progress" looks like a user story but gives an engineer nothing concrete to build from.

## The Basic Format (and Why It's Necessary but Not Sufficient)

The standard format: **As a [role], I can [action] so that [outcome].**

Each part carries weight:
- **Role** — a specific user segment, not "user" or "admin"
- **Action** — what they can do in the product
- **Outcome** — the value they get from doing it

The format keeps you honest about who benefits and why, not just what to build. But the story format alone doesn't give engineering what they need to estimate, implement, or test.

## Acceptance Criteria: Given / When / Then

Every user story needs acceptance criteria. Without them, "done" means different things to the PM, the engineer, and QA.

The GWT format works well:
- **Given** — the starting state or precondition
- **When** — the action the user takes
- **Then** — the expected result

Example for "As a PM, I can filter insights by date range so that I can focus on recent feedback":

> **Given** I am on the Insights dashboard with at least 10 insights
> **When** I select "Last 30 days" from the date filter
> **Then** only insights created in the last 30 days are shown, the count badge updates, and a filter chip shows "Last 30 days ×" with a clear option

That tells an engineer exactly what to build, what the UI should show, and what "done" means — unambiguously.

Write 2–5 GWT scenarios per story: the happy path, the empty state, and the most common error.

## The INVEST Criteria

Good user stories are:
- **Independent** — can be built and shipped without other stories
- **Negotiable** — not a contract, open to conversation with engineering
- **Valuable** — delivers something a user or business cares about
- **Estimable** — small enough that a team can estimate effort
- **Small** — completable within a single sprint
- **Testable** — QA can verify it using the defined acceptance criteria

The most violated criteria are **Independent** and **Small**. Stories with implicit dependencies cause sprint failures. Stories that are too large cause scope creep mid-sprint.

## How to Split Stories That Are Too Big

Epic: "Users can manage team members"

Split by user action:
- "As an admin, I can invite a team member by email so that they can join my workspace"
- "As an admin, I can remove a team member so that they no longer have access"
- "As an admin, I can change a team member's role so that their permissions update"
- "As a team member, I can accept an invitation so that I can access the shared workspace"

Each story is now independent, shippable, and testable. Common split patterns:
- **By user role** — admin vs. member vs. viewer
- **By action type** — create / read / update / delete
- **By data** — basic fields first, advanced fields later
- **By error path** — happy path first, error handling as a separate story
- **By viewport** — desktop-first, mobile as a follow-on (only when the experience genuinely differs)

## What to Include in Each Story

Beyond the story body and acceptance criteria, include:

**Edge cases:** What happens when the list is empty? When the user lacks permission? When the input exceeds the character limit?

**Design reference:** Link to the exact Figma frame, not a prose description of it. If no design exists yet, say so explicitly.

**Dependencies:** Name any other story or backend task that must complete first. Undocumented dependencies are the most common cause of sprint blockers.

**Definition of done:** If your team has a standard checklist (unit tests written, staging verified, analytics events firing), link it or embed it.

## Common Mistakes PMs Make

**"Users can see their data."** Who is "users"? What data? In what format? On which page? This is not a story — it's a vague direction.

**Describing the UI instead of the outcome.** "User sees a dropdown with three options" describes implementation. "User can select a time range for filtering" describes the outcome. Let engineering choose the control; you own the outcome.

**No acceptance criteria.** Engineering's interpretation of "done" will always differ from QA's, which will differ from yours. Write the AC before estimation begins — not after.

**Stories as engineering tasks.** "Set up database schema for insights table" is a technical task with no user value. It belongs in the implementation notes section of your PRD, not in the story backlog. User stories must have a user-visible outcome.

**Giant stories that span weeks.** If a story takes more than one sprint to ship, it's an epic. Break it down. A story that ships in isolation gives you faster feedback and reduces rollback risk.

## User Stories vs. Jobs to Be Done

User stories describe what the user can *do in the product*. [Jobs to Be Done](/blog/jobs-to-be-done-vs-personas) describes what the user is *trying to accomplish in their life*. They're not alternatives — they work at different levels of abstraction.

JTBD helps you decide *what to build* during discovery. User stories help you specify *how to build it* during execution. Use JTBD to validate the problem exists, then decompose the solution into user stories for the sprint.

## A Free Template

Our [User Story Template](/templates/user-story-template) includes the story format, GWT acceptance criteria structure, the INVEST checklist, and guidance on splitting epics into shippable stories.
