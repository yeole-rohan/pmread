---
title: "How to Write Acceptance Criteria Engineers Won't Argue With"
slug: acceptance-criteria-guide
description: Vague acceptance criteria cause rework. Here's the acceptance criteria template and Given/When/Then format that eliminates the most common sources of disagreement at handoff.
category: PRD Writing
keywords: [acceptance criteria template, ai acceptance criteria generator, gherkin format]
publishedAt: 2026-04-26
updatedAt: 2026-04-26
readingTime: 6
author: rohan-yeole
featured: false
---

The most expensive moment in product development is when an engineer finishes building something and the PM says "that's not what I meant."

Usually, neither person is wrong. The engineer built exactly what the requirements said. The PM meant something slightly different but didn't write it down. The gap between intent and spec costs a sprint of rework.

Acceptance criteria close that gap — but only if they're specific enough to leave no room for the wrong interpretation.

## What Acceptance Criteria Are

Acceptance criteria define when a user story is done. They are the explicit conditions that must be true for the feature to be considered complete and shippable.

They are not design specs. They don't describe the UI in detail.
They are not technical specs. They don't describe implementation.
They are not test scripts. QA will derive those from the criteria, but criteria aren't written for testers — they're written for the person implementing the feature.

The audience is the engineer who has to build it. Write criteria that answer every question they'll have before they ask it.

## The Given/When/Then Format (Gherkin)

The most reliable acceptance criteria template is the Given/When/Then structure — also called Gherkin format in BDD (Behaviour-Driven Development).

```
Given [context / initial state]
When [action the user takes]
Then [expected outcome]
```

**Example — a search feature:**

```
Given a user is on the insights board with at least one insight
When they type "export" in the search field
Then only insights containing "export" in the content or quote field are shown
And the count badge updates to reflect the filtered number
And clearing the search field restores all insights
```

The structure forces you to specify:
- The starting condition (what state is the system in?)
- The trigger (what does the user do?)
- The outcome (what happens, exactly?)

A criterion that can't be written in Given/When/Then is usually a criterion that isn't specific enough yet.

## The And / But Extensions

Given/When/Then can be extended with `And` (additional conditions in the same clause) and `But` (exceptions):

```
Given a user is on the free plan
When they click "Generate PRD"
Then the modal opens
But the generate button is disabled
And a tooltip reads "Upgrade to Pro to generate more PRDs this month"
```

`But` is particularly useful for edge cases — the scenarios where the happy path doesn't apply.

## What Good Acceptance Criteria Cover

### The happy path

The primary scenario where everything works as intended. This is the main Given/When/Then for the feature.

### Edge cases

The scenarios that break the happy path. Good criteria always cover:

- **Empty state** — what happens when there's no data?
- **Error state** — what happens when an API call fails?
- **Permission edge cases** — what happens for a free user vs. a paid user? An admin vs. a viewer?
- **Limit cases** — what happens when the user hits a quota, a character limit, or a rate limit?
- **Concurrent state** — what happens if two users act simultaneously?

Each edge case should be a separate criterion. "The feature handles errors gracefully" is not an acceptance criterion — it's a hope.

### Non-functional requirements

Performance, accessibility, and security conditions that are part of done:

```
Given any user loads the insights board
Then the page renders in under 1.5 seconds on a 4G connection
```

```
Given a screen reader user navigates the insights board
Then all interactive elements have accessible labels
And focus order follows the visual reading order
```

## What Bad Acceptance Criteria Look Like

**Too vague:**
> "Users can filter insights."

An engineer reading this will make reasonable choices about filter behaviour, empty states, and interactions with search — and those choices will probably differ from what the PM had in mind.

**Solution-prescribing:**
> "Add a dropdown with the options Pain Point, Feature Request, Decision, Action Item."

This describes the UI, not the behaviour. It prevents engineering from finding a better implementation. Acceptance criteria should define what the user can do, not how the UI is built.

**Missing the edge cases:**
> "The export button generates a PDF of the PRD."

What happens when the PRD is still being generated? When the user has no PRDs? When the PDF exceeds the file size limit? When the download fails? The happy path criterion needs at least three edge case companions.

**Unmeasurable:**
> "The feature is fast."

Fast is not a criterion. "The PRD generates in under 8 seconds for documents up to 20 requirements" is a criterion.

## A Complete Example

**User story:** As a Pro user, I can export a PRD as a PDF so that I can share it with stakeholders who don't have access to PMRead.

**Acceptance criteria:**

```
Given a Pro user viewing a completed PRD
When they click "Export PDF"
Then a PDF download begins within 2 seconds
And the PDF includes all 10 PRD sections
And the PDF filename is "{prd-title}-{date}.pdf"
```

```
Given a Pro user viewing a PRD that is still generating
When the Export PDF button is visible
Then it is disabled
And a tooltip reads "PDF available once generation is complete"
```

```
Given a free user viewing a completed PRD
When they view the PRD actions
Then the Export PDF button is visible but disabled
And a tooltip reads "Export to PDF is a Pro feature — upgrade to access"
```

```
Given any user
When a PDF export fails due to a server error
Then an error toast appears: "Export failed. Please try again."
And the download does not start
```

## The AI Acceptance Criteria Generator Question

AI tools can help generate first-draft acceptance criteria from a user story description. The output is often useful for the happy path but typically misses edge cases specific to your product's data model, permission system, or business rules.

Use AI-generated criteria as a starting point, then add the edge cases that only you know about — the ones specific to your specific user types, your specific plan tiers, your specific technical constraints.

The edge cases are where the real value of acceptance criteria lies. They're also what AI gets wrong most reliably.

Use the free [Acceptance Criteria Template](/templates/acceptance-criteria) to structure your next user story handoff.
