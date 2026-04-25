import type { Template } from "./types";

export const pmEngineeringTemplates: Template[] = [
  {
    slug: "spec-to-django",
    title: "Spec-to-Django Template",
    shortTitle: "Spec-to-Django",
    category: "PM × Engineering",
    description:
      "A PM-to-engineering handoff template that translates product requirements directly into Django model, API, and permission specifications. Reduce back-and-forth between PM and backend engineers.",
    metaDescription:
      "Free Spec-to-Django template for product managers. Translate product requirements into Django models, APIs, and permissions. Download and use.",
    filename: "spec-to-django-template.md",
    content: `# Spec-to-Django Template

**Feature:** [Feature Name]
**PM:** [Name]
**Backend Engineer:** [Name]
**Date:** [Date]
**Target Sprint:** [Sprint]

---

## 1. Feature Summary (1 paragraph)

> What is this feature? Who uses it? What problem does it solve?

[Write here]

---

## 2. Data Model

### New Models

\`\`\`python
# models.py

class [ModelName](models.Model):
    # Fields — define type, null/blank, default, help_text
    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[("active", "Active"), ("archived", "Archived")],
        default="active",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "[table_name]"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
\`\`\`

### Changes to Existing Models

| Model | Field | Change | Migration Notes |
|---|---|---|---|
| | | Add / Rename / Remove / Type change | Nullable migration? |

---

## 3. API Endpoints

| Method | Endpoint | Auth | Request Body | Response | Status Codes |
|---|---|---|---|---|---|
| GET | /api/v1/[resource]/ | JWT | — | List[ResourceSchema] | 200 |
| POST | /api/v1/[resource]/ | JWT | ResourceCreateSchema | ResourceSchema | 201, 400 |
| GET | /api/v1/[resource]/{id}/ | JWT | — | ResourceSchema | 200, 404 |
| PATCH | /api/v1/[resource]/{id}/ | JWT | ResourceUpdateSchema | ResourceSchema | 200, 400, 404 |
| DELETE | /api/v1/[resource]/{id}/ | JWT | — | — | 204, 404 |

### Request / Response Schemas

\`\`\`python
# serializers.py or schemas.py

class ResourceCreateSchema(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    status = serializers.ChoiceField(choices=["active", "archived"], default="active")

class ResourceSchema(serializers.ModelSerializer):
    class Meta:
        model = [ModelName]
        fields = ["id", "name", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
\`\`\`

---

## 4. Business Logic

> Describe non-obvious rules that must be enforced in the view or service layer.

| Rule | Where Enforced | Notes |
|---|---|---|
| Users can only see their own resources | Queryset filter in view | Use request.user.id |
| Status can only go Active → Archived, not back | Validator or save() | Raise ValidationError |
| | | |

---

## 5. Permissions

| Role | Can Create | Can Read | Can Update | Can Delete |
|---|---|---|---|---|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Member | ✅ | ✅ | Own only | Own only |
| Viewer | ❌ | ✅ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## 6. Background Jobs / Celery Tasks

| Task Name | Trigger | Frequency | Notes |
|---|---|---|---|
| | On save signal | — | |
| | Cron | Daily at 00:00 UTC | |

---

## 7. Edge Cases

> List the non-obvious cases engineering should handle:

- [ ] What happens when a user is deleted — do their resources cascade or preserve?
- [ ] What if the POST body is empty?
- [ ] What if two users create the same resource simultaneously?
- [ ] What if the foreign key references a deleted object?

---

## 8. Migration Plan

| Step | Who | Notes |
|---|---|---|
| Write migration | Engineering | Run \`makemigrations\` |
| Review migration | PM + Engineering | Check for destructive changes |
| Test on staging | QA | Confirm existing data untouched |
| Deploy to production | DevOps | Run during low-traffic window |

---

## 9. Open Questions

| Question | Owner | Due |
|---|---|---|
| | | |`,
    howToUse: [
      {
        step: "Write the feature summary before touching the technical sections",
        detail:
          "The summary forces you to articulate what the feature does in plain English. If you can't write it in one paragraph, you don't know the feature well enough to spec it for engineering.",
      },
      {
        step: "Draft the data model fields collaboratively with engineering",
        detail:
          "PMs define what data needs to exist and why. Engineers define how it's stored. Fill in the field names together — ambiguity in field names (is it 'type' or 'category'?) causes bugs that live for years.",
      },
      {
        step: "Define permissions before writing business logic",
        detail:
          "Permission tables are the most-forgotten part of any spec. Write the full matrix (owner / member / viewer × create / read / update / delete) before any code is written. Retrofitting permissions onto existing endpoints is expensive.",
      },
      {
        step: "List edge cases explicitly",
        detail:
          "Cascade deletes, concurrent writes, and empty payloads are the three most common sources of production bugs. Walk through each one and write it down — even 'not handled in v1, returns 500' is better than silence.",
      },
    ],
    faqs: [
      {
        q: "Should PMs write the actual Django code in this template?",
        a: "No. The code blocks are scaffolds that help engineers understand the spec in their own language — not production code. PMs fill in field names, types, and constraints; engineers write the actual implementation. The template eliminates a round of clarification questions, not the engineering work.",
      },
      {
        q: "How detailed should the API endpoint table be?",
        a: "Enough detail that a frontend developer could write the API client without asking questions. That means: method, path, auth requirement, request body fields, response shape, and all meaningful status codes (not just 200 and 500).",
      },
      {
        q: "What if the feature has no new models — it only modifies existing ones?",
        a: "Use the 'Changes to Existing Models' table and skip the 'New Models' section. Document every field change with its migration strategy — especially nullable vs non-nullable additions to tables with production data.",
      },
      {
        q: "When should I use this template vs a regular PRD?",
        a: "Use the Spec-to-Django template for any backend feature that creates new data models or modifies existing ones. Use a standard PRD for higher-level features where the implementation details are up to engineering. These two documents should coexist — the PRD explains 'what and why', this spec explains 'how it maps to the backend'.",
      },
    ],
  },

  // ─── 25. Spec-to-React ───────────────────────────────────────────────────────,

  {
    slug: "spec-to-react",
    title: "Spec-to-React Template",
    shortTitle: "Spec-to-React",
    category: "PM × Engineering",
    description:
      "A PM-to-frontend handoff template that translates product requirements into React component trees, state management, and API integration specs. Cut design-to-code ambiguity in half.",
    metaDescription:
      "Free Spec-to-React template for product managers. Translate product requirements into React components, state, and API specs. Download free.",
    filename: "spec-to-react-template.md",
    content: `# Spec-to-React Template

**Feature:** [Feature Name]
**PM:** [Name]
**Frontend Engineer:** [Name]
**Designer:** [Name]
**Date:** [Date]
**Target Sprint:** [Sprint]

---

## 1. Feature Summary

> What does this UI do? Who uses it? What's the success outcome?

[Write here]

---

## 2. Component Tree

> Sketch the component hierarchy. Names should match what you'll name the files.

\`\`\`
<FeaturePage>
  <PageHeader title="..." />
  <FeatureList>
    <FeatureCard key={id} />
    <FeatureCard key={id} />
  </FeatureList>
  <EmptyState />          ← show when list is empty
  <FeatureModal />        ← show on create/edit
  <DeleteConfirmDialog /> ← show on delete
</FeaturePage>
\`\`\`

---

## 3. Component Specs

### [ComponentName]

**Purpose:** [One sentence]

**Props:**
| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| | string | Yes | — | |
| | boolean | No | false | |

**States:**
| State | Type | Initial Value | Description |
|---|---|---|---|
| isLoading | boolean | false | True while API call in-flight |
| error | string \| null | null | API error message |
| items | Item[] | [] | Fetched list data |

**Events / Callbacks:**
| Event | Trigger | Handler |
|---|---|---|
| onClick | User clicks create button | Opens FeatureModal |
| onDelete | User clicks delete | Calls DELETE /api/v1/... |

---

## 4. Page States

Every page has multiple states. Define them all upfront.

| State | Trigger | What the User Sees |
|---|---|---|
| Loading | On mount, before API responds | Skeleton cards |
| Empty | API returns [] | EmptyState component with CTA |
| Populated | API returns items | List of FeatureCard |
| Error | API returns 4xx/5xx | Error banner with retry button |
| Submitting | User clicks Save in modal | Button shows spinner, form disabled |

---

## 5. API Integration

| Hook / Function | Endpoint | Method | Trigger | On Success | On Error |
|---|---|---|---|---|---|
| useFeatures() | /api/v1/features/ | GET | On mount | Set items | Set error |
| createFeature() | /api/v1/features/ | POST | Modal submit | Append to list, close modal | Show toast error |
| deleteFeature(id) | /api/v1/features/{id}/ | DELETE | Confirm dialog | Remove from list | Show toast error |

---

## 6. Routing

| Route | Page Component | Auth Required | Notes |
|---|---|---|---|
| /app/features | FeaturePage | Yes | — |
| /app/features/[id] | FeatureDetailPage | Yes | Redirect to 404 if not found |

---

## 7. Form Validation

| Field | Type | Required | Validation Rules | Error Message |
|---|---|---|---|---|
| name | text | Yes | Min 3 chars, max 100 | "Name must be 3–100 characters" |
| status | select | Yes | One of [active, archived] | "Select a valid status" |

---

## 8. Responsive Behaviour

| Breakpoint | Layout | Notes |
|---|---|---|
| < 768px (mobile) | Single column, no sidebar | FeatureModal becomes full-screen drawer |
| 768–1024px (tablet) | Two-column grid | — |
| > 1024px (desktop) | Three-column grid | — |

---

## 9. Accessibility

- [ ] All interactive elements have \`aria-label\` or visible label
- [ ] Delete confirmation dialog traps focus
- [ ] Loading state announced with \`aria-live="polite"\`
- [ ] Color is not the only differentiator (icons + text labels)
- [ ] Keyboard navigation: Tab order is logical; Esc closes modals

---

## 10. Edge Cases

- [ ] What if an item is deleted while it's open in the detail view?
- [ ] What if the create POST takes > 5 seconds?
- [ ] What if the list has > 500 items — do we paginate?
- [ ] What if the user refreshes mid-form?`,
    howToUse: [
      {
        step: "Draw the component tree first",
        detail:
          "A quick ASCII component tree (like the one in the template) eliminates most naming and nesting debates. Do this before writing anything else — it takes 10 minutes and saves 3 rounds of Figma-to-code interpretation.",
      },
      {
        step: "Define every page state explicitly",
        detail:
          "Loading, empty, populated, error, and submitting are the five states every data-driven page has. If you don't specify them, engineers and designers make different assumptions — and users get blank screens with no feedback.",
      },
      {
        step: "List API calls with their side effects",
        detail:
          "For each API call, specify what happens on success (update state? close modal? show toast?) and what happens on error. 'On success, append to list' is something engineers shouldn't have to guess.",
      },
      {
        step: "Include accessibility requirements before code is written",
        detail:
          "Retrofitting accessibility onto finished UI is expensive. The checklist in Section 9 takes 5 minutes to review but saves 2 sprints of a11y fixes. Review it with the designer, not just the engineer.",
      },
    ],
    faqs: [
      {
        q: "Do I need a Spec-to-React template if we already have Figma designs?",
        a: "Yes. Figma shows what it looks like — this template specifies what it does. State management, API integration, error handling, and edge cases are invisible in Figma. Engineers build from both.",
      },
      {
        q: "What level of detail should I specify for component props?",
        a: "Specify props that have business logic implications (e.g., 'isPro: boolean — controls whether the upgrade banner shows'). Skip purely presentational props (e.g., className, style) — those are the engineer's domain.",
      },
      {
        q: "How is this different from a design handoff in Figma?",
        a: "Figma communicates visual design. This template communicates behavior, state, data flow, and API contracts. Both are necessary — neither replaces the other.",
      },
      {
        q: "Should I fill this in for every UI change?",
        a: "No — for minor copy changes, color tweaks, or single-field form additions, a Jira ticket is sufficient. Use this template for any feature that introduces new components, new routes, or new API calls. A good rule of thumb: if it takes more than 2 days to build, it deserves a spec.",
      },
    ],
  },

  // ─── 26. API Design Spec for PMs ────────────────────────────────────────────,

  {
    slug: "api-design-spec",
    title: "API Design Spec Template for PMs",
    shortTitle: "API Design Spec",
    category: "PM × Engineering",
    description:
      "A product manager's API design spec template. Define endpoints, request/response shapes, auth, rate limits, and versioning — before engineering writes a single line.",
    metaDescription:
      "Free API design spec template for product managers. Define endpoints, schemas, auth, and versioning. Download and bridge PM-engineering gap.",
    filename: "api-design-spec-template.md",
    content: `# API Design Spec Template

**API Name:** [Name]
**Version:** v1
**PM:** [Name]
**Tech Lead:** [Name]
**Date:** [Date]
**Status:** Draft / In Review / Approved

---

## 1. Purpose

> What does this API enable? Who are the consumers (mobile app, web frontend, third-party integrations)?

[Write here]

---

## 2. Base URL

| Environment | Base URL |
|---|---|
| Development | http://localhost:8000/api/v1 |
| Staging | https://staging-api.yourproduct.com/api/v1 |
| Production | https://api.yourproduct.com/api/v1 |

---

## 3. Authentication

| Method | Description |
|---|---|
| JWT Bearer Token | \`Authorization: Bearer <token>\` in header |
| API Key | \`X-API-Key: <key>\` in header (for server-to-server) |

Token expiry: 24 hours
Refresh mechanism: POST /auth/refresh with refresh_token

---

## 4. Endpoints

### [Resource Name]

#### List

\`\`\`
GET /[resource]/
\`\`\`

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| page | integer | No | Default: 1 |
| page_size | integer | No | Default: 20, max: 100 |
| status | string | No | Filter by status |

**Response 200:**
\`\`\`json
{
  "count": 42,
  "next": "/api/v1/[resource]/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Example",
      "status": "active",
      "created_at": "2026-04-01T00:00:00Z"
    }
  ]
}
\`\`\`

---

#### Create

\`\`\`
POST /[resource]/
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "string (required, 3–255 chars)",
  "status": "active | archived (optional, default: active)"
}
\`\`\`

**Response 201:**
\`\`\`json
{
  "id": "uuid",
  "name": "Example",
  "status": "active",
  "created_at": "2026-04-01T00:00:00Z"
}
\`\`\`

**Errors:**
| Status | Code | Message |
|---|---|---|
| 400 | VALIDATION_ERROR | name is required |
| 401 | UNAUTHORIZED | Token missing or expired |
| 403 | FORBIDDEN | User lacks permission |

---

#### Retrieve

\`\`\`
GET /[resource]/{id}/
\`\`\`

**Response 200:** Same as single object above.
**Response 404:** \`{ "code": "NOT_FOUND", "message": "Resource not found" }\`

---

#### Update

\`\`\`
PATCH /[resource]/{id}/
\`\`\`

Partial update — only fields provided are updated.

---

#### Delete

\`\`\`
DELETE /[resource]/{id}/
\`\`\`

**Response 204:** No body.

---

## 5. Error Format

All errors return a consistent structure:

\`\`\`json
{
  "code": "ERROR_CODE",
  "message": "Human-readable description",
  "details": {}
}
\`\`\`

| HTTP Status | Code | When |
|---|---|---|
| 400 | VALIDATION_ERROR | Request body fails validation |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Valid token but insufficient permissions |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Duplicate resource or state conflict |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## 6. Rate Limits

| Endpoint Group | Limit | Window |
|---|---|---|
| Auth endpoints | 10 requests | per minute |
| Read endpoints | 1,000 requests | per hour |
| Write endpoints | 100 requests | per hour |

Rate limit headers returned on all responses:
- \`X-RateLimit-Limit\`
- \`X-RateLimit-Remaining\`
- \`X-RateLimit-Reset\`

---

## 7. Versioning Strategy

- Current version: **v1**
- Breaking changes get a new version (v2)
- Non-breaking additions (new optional fields, new endpoints) can be added to v1
- v1 will be supported for minimum 12 months after v2 launches
- Deprecation announced via API response header: \`Deprecation: true\`

---

## 8. Pagination

All list endpoints use cursor-based or page-based pagination:

| Type | When to Use |
|---|---|
| Page-based | < 10,000 records, user-facing tables |
| Cursor-based | > 10,000 records, infinite scroll, exports |

---

## 9. Open Questions

| Question | Owner | Due |
|---|---|---|
| | | |`,
    howToUse: [
      {
        step: "Define consumers before defining endpoints",
        detail:
          "Who calls this API? The mobile app? The web frontend? A webhook from Slack? Different consumers have different pagination, auth, and error-handling needs. Write consumers first — endpoints follow from what each consumer needs.",
      },
      {
        step: "Agree on the error format before writing any endpoint",
        detail:
          "Inconsistent error shapes are the #1 complaint from frontend engineers. Define the error object structure once in Section 5, then reference it in every endpoint. Never let individual endpoints invent their own error formats.",
      },
      {
        step: "Write request and response JSON with real example values",
        detail:
          "JSON with placeholder 'string' types is better than nothing, but JSON with real values ('name': 'Bulk CSV export') lets reviewers spot semantic mistakes (wrong field names, missing fields) that type-only specs miss.",
      },
      {
        step: "Set rate limits before shipping, not after",
        detail:
          "Rate limits defined after launch feel arbitrary and break existing integrations. Define them in this spec, communicate them to integrators on day one, and include the rate limit headers so clients can manage their own throttling.",
      },
    ],
    faqs: [
      {
        q: "Should PMs write API specs or leave it entirely to engineers?",
        a: "PMs should define what the API needs to do: what data flows in, what flows out, what business rules apply, and what consumers need. Engineers define how it's implemented. The spec is the PM's deliverable; the implementation is engineering's. Leaving the spec entirely to engineering produces technically correct but product-incorrect APIs.",
      },
      {
        q: "When should we version an API?",
        a: "Version when a change breaks existing consumers: removing a field, renaming a field, changing a field's type, or removing an endpoint. Adding new optional fields, adding new endpoints, or adding new optional query params are non-breaking — they don't require a new version.",
      },
      {
        q: "What's the difference between REST and GraphQL for internal APIs?",
        a: "REST is simpler to reason about, cache, and document for teams where the PM is involved in the spec. GraphQL gives frontends more flexibility to query exactly what they need, reducing over-fetching — better for complex, data-intensive UIs with many different query patterns. For most product features, REST is the right default.",
      },
      {
        q: "How do I handle API changes after the spec is approved?",
        a: "Non-breaking changes (new optional fields, new endpoints) can be added without a new version — just update the spec and notify consumers. Breaking changes require a new version number, a migration guide, and a deprecation timeline for the old version. Document both in a changelog.",
      },
    ],
  },

  // ─── 27. Technical Debt Scorecard ───────────────────────────────────────────,

  {
    slug: "technical-debt-scorecard",
    title: "Technical Debt Scorecard Template",
    shortTitle: "Technical Debt Scorecard",
    category: "PM × Engineering",
    description:
      "A PM-engineering scorecard for assessing and prioritizing technical debt. Quantify impact, risk, and effort so debt competes fairly with features on the roadmap.",
    metaDescription:
      "Free technical debt scorecard template for product managers. Assess, prioritize, and communicate tech debt to stakeholders. Download free.",
    filename: "technical-debt-scorecard-template.md",
    content: `# Technical Debt Scorecard

**Team:** [Team Name]
**Date:** [Date]
**PM:** [Name]
**Tech Lead:** [Name]
**Review Cycle:** [Quarterly / Sprint Planning]

---

## Why This Exists

Technical debt is invisible to stakeholders until it explodes. This scorecard gives you a shared language for debt prioritization that sits alongside features on the roadmap — not separate from it.

---

## Debt Inventory

| # | Debt Item | Component / Area | Age | Type | Score | Priority |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

**Type options:** Architecture, Dependency, Test Coverage, Documentation, Performance, Security

---

## Scoring Rubric

Each debt item is scored on 4 dimensions. Total = sum of all four.

### 1. Business Impact (1–5)

How much does this debt slow down feature delivery or hurt users today?

| Score | Description |
|---|---|
| 5 | Blocking feature development; engineers work around it weekly |
| 4 | Slowing feature development; adds 20–50% to estimates |
| 3 | Occasional friction; one sprint per quarter lost to workarounds |
| 2 | Minor annoyance; rarely affects delivery speed |
| 1 | No current impact; theoretical risk only |

### 2. Risk (1–5)

What is the probability and severity of failure if left unaddressed?

| Score | Description |
|---|---|
| 5 | Active security vulnerability or data integrity risk |
| 4 | High probability of production incident within 6 months |
| 3 | Moderate probability of incident within 12 months |
| 2 | Low probability; manageable if it fails |
| 1 | Negligible risk |

### 3. Fix Effort (1–5, inverted — lower effort = higher score)

| Score | Effort to Fix |
|---|---|
| 5 | < 1 day |
| 4 | 1–5 days |
| 3 | 1–2 weeks |
| 2 | 1–2 months |
| 1 | > 2 months / requires major re-architecture |

### 4. Future Cost (1–5)

How much more expensive will this debt become if we delay fixing it?

| Score | Description |
|---|---|
| 5 | Cost doubles every sprint (actively accumulating) |
| 4 | Cost grows significantly with each new feature in this area |
| 3 | Moderate growth; affected area is actively developed |
| 2 | Slow growth; area is rarely touched |
| 1 | Static; won't get worse if deferred |

---

## Scored Inventory

| # | Debt Item | Impact | Risk | Fix Effort | Future Cost | **Total** |
|---|---|---|---|---|---|---|
| 1 | | /5 | /5 | /5 | /5 | /20 |
| 2 | | /5 | /5 | /5 | /5 | /20 |
| 3 | | /5 | /5 | /5 | /5 | /20 |

---

## Priority Thresholds

| Score | Action |
|---|---|
| 16–20 | Fix this sprint (or immediately if security) |
| 11–15 | Schedule in next 1–2 sprints |
| 6–10 | Backlog with a target quarter |
| 1–5 | Acknowledge and defer; review next quarter |

---

## Remediation Plan

| Debt Item | Priority | Owner | Target Sprint | Effort Estimate | Done? |
|---|---|---|---|---|---|
| | P1 | | | | |
| | P2 | | | | |

---

## Debt-to-Feature Ratio Target

> As a team, we commit to allocating **[X]%** of each sprint to debt reduction.

Recommended baseline: 15–20% of sprint capacity for established products.

Track actuals vs target each sprint:

| Sprint | Debt % | Feature % | Comment |
|---|---|---|---|
| | | | |`,
    howToUse: [
      {
        step: "Run the inventory with engineering, not from memory",
        detail:
          "Ask engineers to add items to the debt inventory before the scoring session. Debt that lives only in an engineer's head isn't visible to the roadmap. A shared doc surfaces it and gives engineers a legitimate channel to raise concerns.",
      },
      {
        step: "Score Business Impact and Risk together (PM + TL)",
        detail:
          "PMs own the Business Impact score — they know which areas are actively being developed and what it costs in delivery time. Tech Leads own the Risk and Fix Effort scores. Score collaboratively but clearly divide ownership.",
      },
      {
        step: "Set the debt-to-feature ratio and defend it",
        detail:
          "Without a protected budget, debt fixes get cut in every sprint planning. 15–20% of capacity for debt is the industry standard for products with > 12 months of code. If your engineering leader disagrees with your proposed ratio, that's the conversation to have before sprint planning, not during.",
      },
      {
        step: "Review quarterly, not annually",
        detail:
          "Debt scores change as the product evolves. An area that was low-risk last year may be a P1 now because three new features were built on top of it. Quarterly reviews catch this drift before it becomes a crisis.",
      },
    ],
    faqs: [
      {
        q: "How do I convince stakeholders that tech debt belongs on the roadmap?",
        a: "Frame debt as risk, not engineering preference. A Risk score of 5 means 'high probability of a production incident in the next 6 months' — put that in those exact terms. Most stakeholders understand incident risk better than abstract 'refactoring' requests. Show the business cost of the debt, not just the technical description.",
      },
      {
        q: "What's the difference between technical debt and a bug?",
        a: "A bug is a defect in existing behavior. Technical debt is intentional or accumulated design/implementation choices that make future work harder. A slow API because of an unindexed query is debt. An API that returns the wrong data is a bug. Both belong on the roadmap, but they're tracked and prioritized differently.",
      },
      {
        q: "Should we track third-party dependency upgrades as technical debt?",
        a: "Yes. Dependency debt is one of the most dangerous categories because it accumulates silently and then explodes when a CVE is announced against an old library. Track major version gaps (especially security-relevant dependencies like auth libraries, HTTP clients, and ORMs) on the scorecard.",
      },
      {
        q: "How do we handle debt in a startup that's moving fast?",
        a: "Acknowledge it explicitly. Document each piece of debt when it's consciously incurred ('we're skipping proper test coverage here to hit the demo deadline — adding to debt log'). The danger isn't incurring debt — it's incurring it silently so nobody knows it exists. A visible debt log lets you make informed decisions about when to pay it down.",
      },
    ],
  },

  // ─── 28. Feature Flag Decision Template ─────────────────────────────────────,

  {
    slug: "feature-flag-decision",
    title: "Feature Flag Decision Template",
    shortTitle: "Feature Flag Decision",
    category: "PM × Engineering",
    description:
      "A decision template for when and how to use feature flags. Define flag scope, rollout strategy, kill switch criteria, and cleanup schedule before shipping.",
    metaDescription:
      "Free feature flag decision template for product managers. Define flag rollout, kill switch, and cleanup schedule. Download free.",
    filename: "feature-flag-decision-template.md",
    content: `# Feature Flag Decision Template

**Feature:** [Feature Name]
**Flag Key:** [feature_name_v1]
**PM:** [Name]
**Engineer:** [Name]
**Date:** [Date]
**Target Ship Date:** [Date]

---

## 1. Flag Purpose

**Why is this feature flag needed?**

- [ ] Gradual rollout (% of users)
- [ ] A/B test (control vs treatment)
- [ ] Kill switch for risky feature
- [ ] Beta / allowlist rollout (specific users or accounts)
- [ ] Canary deployment (specific servers or regions)
- [ ] Operational toggle (off during maintenance)

**Is a flag necessary here?**

> Ask: Could we ship this to 100% of users immediately with confidence? If yes, skip the flag.

[Justify why a flag is needed or not]

---

## 2. Flag Configuration

| Setting | Value |
|---|---|
| Flag Key | \`feature_name_v1\` |
| Flag Type | Boolean / Multivariate |
| Default Value (off) | false |
| Enabled Value (on) | true |
| Platform | Web / Mobile / API |
| Targeting Scope | All users / Paid users / Beta group / % rollout |

---

## 3. Rollout Plan

| Phase | Target | % Users | Start Date | Success Criteria |
|---|---|---|---|---|
| 1 — Internal | Employees only | 100% internal | Day 1 | No errors in logs |
| 2 — Beta | Beta users (allowlist) | ~5% | Day 3 | Error rate < 0.1%; no P1 bugs |
| 3 — Ramp | General users | 10% → 25% → 50% → 100% | Week 2 | Conversion / engagement metric within 5% of baseline |
| 4 — Full | All users | 100% | Week 3 | — |

**Rollout gates:** Each phase requires the previous phase's success criteria to be met before advancing.

---

## 4. Metrics to Monitor

| Metric | Baseline | Target | Alert Threshold |
|---|---|---|---|
| Error rate | | | > 0.5% → pause rollout |
| Page load time (p95) | | | > 500ms above baseline → pause |
| [Feature adoption metric] | | | |
| [Core product metric] | | | |

---

## 5. Kill Switch Criteria

> Define exactly what triggers an immediate rollback. Don't leave this to judgment in an incident.

Automatically roll back (set flag to 0%) if:
- [ ] Error rate exceeds **[X%]** for > 5 minutes
- [ ] P95 latency exceeds baseline by > **[Xms]**
- [ ] More than **[X]** user complaints in Slack/support in 1 hour
- [ ] Any data integrity issue detected

Who can pull the kill switch: **[PM / On-call engineer / Anyone]**

How to pull it: [Link to flag in LaunchDarkly / GrowthBook / Unleash]

---

## 6. Flag Lifespan

| Date | State |
|---|---|
| [Ship date] | Flag created, off by default |
| [+1 week] | Phase 1 rollout |
| [+3 weeks] | 100% rollout (if criteria met) |
| **[+6 weeks] → Cleanup deadline** | Flag removed from code and dashboard |

**Flag cleanup owner:** [Engineer Name]
**Cleanup ticket:** [Link to Jira/Linear ticket]

> Flags that aren't cleaned up become permanent feature toggles. Set a cleanup deadline at flag creation time, not after.

---

## 7. Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Flag logic error causes different behavior for flagged vs non-flagged users | Medium | High | Code review + QA both variants |
| Flag is never cleaned up | High | Medium | Calendar reminder + ticket created now |
| Partial rollout causes inconsistent UX across sessions | Low | Low | Sticky sessions by user_id, not session |

---

## 8. Dependencies

| Dependency | Status | Owner |
|---|---|---|
| Analytics event tracking | ✅ / 🔲 | |
| Monitoring dashboard updated | ✅ / 🔲 | |
| Support team briefed | ✅ / 🔲 | |`,
    howToUse: [
      {
        step: "Decide first whether a flag is actually needed",
        detail:
          "Feature flags have a cost: code complexity, test burden, and cleanup debt. If you can ship at 100% confidence immediately, skip the flag. Use flags for features with real risk (irreversible data changes, significant UX shifts, or load concerns at scale).",
      },
      {
        step: "Define kill switch criteria before launch, not during an incident",
        detail:
          "During an incident, you're under pressure and making decisions on incomplete information. Pre-define the exact numbers that trigger a rollback (error rate, latency, complaint volume). This removes judgment from a moment when judgment is least reliable.",
      },
      {
        step: "Set the cleanup deadline at flag creation",
        detail:
          "Create the cleanup ticket and assign it to a named engineer the same day you create the flag. Flags without cleanup deadlines become permanent — they accumulate in your codebase and create confusion about what behavior is 'real'. 6 weeks after 100% rollout is a reasonable default.",
      },
      {
        step: "Gate each rollout phase on explicit success criteria",
        detail:
          "Don't advance from 10% to 50% automatically after a time delay. Gate it on actual data: error rate below threshold, no P1 bugs, core metrics within normal range. This is the entire point of a gradual rollout.",
      },
    ],
    faqs: [
      {
        q: "What's the best feature flag tool for a small team?",
        a: "GrowthBook (open source, self-hostable) is ideal for cost-conscious teams. LaunchDarkly is the enterprise standard with excellent SDKs and targeting. Unleash is a solid open-source alternative. For very small teams, a simple database-backed toggle (a Feature table in Postgres) is often sufficient before you need a dedicated platform.",
      },
      {
        q: "Should flags target users or sessions?",
        a: "Target by user_id for consistency — a user who sees variant A on their laptop should also see variant A on mobile. Session-based targeting creates a jarring experience where the same person sees different versions across sessions.",
      },
      {
        q: "How many feature flags is too many?",
        a: "There's no absolute limit, but flags that live longer than 3 months are a red flag (pun intended). If you have > 50 active flags in a codebase of < 50k lines, you likely have a cleanup backlog problem. Audit flags quarterly and delete anything that's been at 100% for > 6 weeks.",
      },
      {
        q: "Can feature flags replace blue-green deployments?",
        a: "No — they're complementary. Blue-green deployments control which version of the code runs on which servers. Feature flags control which code paths execute for which users within a single deployment. Use both: deploy to blue/green, then control user exposure with flags.",
      },
    ],
  },

  // ─── 29. Architecture Decision Record ───────────────────────────────────────,

  {
    slug: "architecture-decision-record",
    title: "Architecture Decision Record (ADR) Template",
    shortTitle: "ADR Template",
    category: "PM × Engineering",
    description:
      "An Architecture Decision Record template for PM-engineering teams. Capture the context, options considered, and rationale behind key technical decisions — before institutional memory walks out the door.",
    metaDescription:
      "Free Architecture Decision Record (ADR) template. Capture technical decisions, options considered, and rationale. Download and use today.",
    filename: "architecture-decision-record-template.md",
    content: `# Architecture Decision Record

**ADR Number:** ADR-[NNN]
**Title:** [Short noun phrase describing the decision, e.g. "Use PostgreSQL as primary datastore"]
**Date:** [Date]
**Status:** Proposed / Accepted / Deprecated / Superseded by ADR-[NNN]
**Authors:** [Names]
**Deciders:** [Names]

---

## Context

> What is the situation? What problem are we solving? What forces are in play?
> Write this for a new engineer who joins 6 months from now — they need to understand *why* this decision was a decision at all.

[Write here]

---

## Decision Drivers

> What factors matter most in making this decision? List them in priority order.

1. [e.g., Must handle 10,000 concurrent connections]
2. [e.g., Must be operated by a 2-person team without a dedicated DBA]
3. [e.g., Must support JSONB for flexible schema needs]
4. [e.g., Must have strong Python client libraries]

---

## Options Considered

### Option 1: [Name]

**Description:** [What is this option?]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Estimated Cost/Effort:** [Low / Medium / High]

---

### Option 2: [Name]

**Description:**

**Pros:**
-

**Cons:**
-

**Estimated Cost/Effort:**

---

### Option 3: [Name] *(if applicable)*

**Description:**

**Pros:**
-

**Cons:**
-

---

## Decision

> State the decision clearly and unambiguously.

**We will [chosen option].**

[Brief rationale — why this option over the others, in 2–4 sentences]

---

## Consequences

### Positive
- [What becomes easier or better?]
- [What risks does this eliminate?]

### Negative / Trade-offs
- [What becomes harder?]
- [What do we give up?]

### Neutral
- [What changes but isn't clearly better or worse?]

---

## Implementation Plan

| Step | Owner | Target Date |
|---|---|---|
| | | |
| | | |

---

## Review Triggers

> Under what conditions should this ADR be revisited?

- [ ] If we exceed [X] users / [X] requests per second
- [ ] If [dependency/library] reaches end of life
- [ ] If team size grows beyond [X] engineers
- [ ] On annual review: [Date]

---

## Related Decisions

| ADR | Relationship |
|---|---|
| ADR-[NNN] | Depends on / Supersedes / Related to |

---

## References

- [Link to relevant RFC, blog post, benchmark, or prior art]`,
    howToUse: [
      {
        step: "Write the Context section for the future, not the present",
        detail:
          "The most important and most-skipped section. Write it as if you're explaining the situation to a new engineer who joins in 12 months and has zero context. What was the scale? What were the constraints? Why was this a hard decision? Without context, a future ADR reader can't evaluate whether the decision is still correct.",
      },
      {
        step: "Always document at least 2 options — even the ones you rejected",
        detail:
          "An ADR with one option isn't a record of a decision — it's a justification of something already decided. The value of an ADR is understanding why Option B was rejected, so the next engineer doesn't have to investigate and rediscover the same tradeoffs.",
      },
      {
        step: "Be explicit about trade-offs, not just benefits",
        detail:
          "The 'Consequences: Negative' section is the hardest to write and the most valuable. What do you give up by making this choice? What becomes harder? A decision with no downsides wasn't a real decision. Documenting trade-offs prevents future engineers from being blindsided by them.",
      },
      {
        step: "Set review triggers at time of decision",
        detail:
          "ADRs without review conditions become permanent law. Write down the conditions that should trigger a revisit (scale thresholds, team size changes, library EOL). Schedule an annual review at minimum. Accepted ADRs should be revisited, not just archived.",
      },
    ],
    faqs: [
      {
        q: "Who should write ADRs — PMs or engineers?",
        a: "Engineers typically write the technical sections (options, consequences, implementation). PMs write or review the Context and Decision Drivers — they know the product constraints that motivated the decision. The best ADRs are co-authored. If a PM can't explain the Context, the decision lacked a clear product rationale.",
      },
      {
        q: "How many ADRs should a team maintain?",
        a: "One per significant architectural decision. 'Significant' means: decisions that affect multiple teams, decisions about foundational technology (database, auth, deployment), or decisions that are hard to reverse. Don't write ADRs for individual feature implementations — write them for cross-cutting architectural choices.",
      },
      {
        q: "Where should ADRs live?",
        a: "In the repository, in a /docs/adr/ directory, numbered sequentially (ADR-001, ADR-002). Keeping them in the repo means they're versioned alongside the code they describe, discoverable via grep, and part of the normal code review process.",
      },
      {
        q: "Can ADRs be changed after they're accepted?",
        a: "The record itself shouldn't be edited — it's a historical document. If the decision changes, write a new ADR that supersedes the old one, and update the old ADR's status to 'Superseded by ADR-[NNN]'. This preserves the full decision history, which is the entire point.",
      },
    ],
  },

  // ─── 30. Engineering Kickoff Template ───────────────────────────────────────,

  {
    slug: "engineering-kickoff",
    title: "Engineering Kickoff Template",
    shortTitle: "Engineering Kickoff",
    category: "PM × Engineering",
    description:
      "A structured engineering kickoff template for PM-engineering alignment before sprint start. Covers goals, scope, dependencies, open questions, and success criteria — in under 45 minutes.",
    metaDescription:
      "Free engineering kickoff template. Align PM and engineering on goals, scope, dependencies, and success criteria before a sprint starts. Download free.",
    filename: "engineering-kickoff-template.md",
    content: `# Engineering Kickoff Template

**Feature / Epic:** [Name]
**Sprint / Milestone:** [Sprint Number]
**Date:** [Date]
**PM:** [Name]
**Engineering Lead:** [Name]
**Attendees:** [List]
**Duration:** 45 minutes

---

## 1. Context (5 min)

**Why are we building this?**

> 2–3 sentences on the user problem, the business motivation, and why now.

[Write here]

**Success metric:**

> One number that tells us if this shipped and worked.

[e.g., "Onboarding completion rate increases from 42% to 60% within 30 days of ship"]

---

## 2. Scope (10 min)

### In Scope

| # | Feature / Behavior | Notes |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Out of Scope (Explicitly)

| Item | Why Excluded | When It Might Come Back |
|---|---|---|
| | | |
| | | |

### What "Done" Looks Like

- [ ] Feature works end-to-end for all user types (Free, Pro, Admin)
- [ ] Unit tests cover all business logic branches
- [ ] API endpoints return correct responses for valid and invalid inputs
- [ ] Error states are handled and show meaningful messages
- [ ] Feature flag at 100% (if applicable)
- [ ] Analytics event tracking added
- [ ] [Add specific acceptance criteria]

---

## 3. Design (5 min)

| Asset | Status | Link |
|---|---|---|
| Figma designs | ✅ / 🔲 | |
| Mobile designs | ✅ / 🔲 / N/A | |
| Edge case states (empty, error, loading) | ✅ / 🔲 | |
| Responsive specs | ✅ / 🔲 / N/A | |

**Open design questions:**

| Question | Owner | Due |
|---|---|---|
| | | |

---

## 4. Technical Approach (10 min)

> Engineering lead summarizes the implementation plan. PM listens for scope or logic surprises.

**Backend:**
[What new models, endpoints, or jobs are needed?]

**Frontend:**
[What new components or routes are needed?]

**Infrastructure:**
[Any new infra, queues, or migrations needed?]

**Dependencies on other teams:**
[API team / Data team / DevOps / etc.]

---

## 5. Risks and Open Questions (10 min)

| Risk / Question | Owner | Due Date | Resolution |
|---|---|---|---|
| | | | |
| | | | |

**Blockers today:**

| Blocker | Who's unblocking it | ETA |
|---|---|---|
| | | |

---

## 6. Timeline (5 min)

| Milestone | Target Date | Owner |
|---|---|---|
| Spec / design finalized | | PM + Design |
| Backend implementation | | Engineering |
| Frontend implementation | | Engineering |
| QA sign-off | | QA |
| Feature flag at 5% | | Engineering |
| Feature flag at 100% | | PM + Engineering |
| Announcement / changelog entry | | PM |

---

## 7. Communication Plan

| Stakeholder | Communication Method | Frequency |
|---|---|---|
| Leadership | Sprint review demo | Weekly |
| Sales / CS | Async Slack update | On launch |
| Users | In-app announcement | On launch |

---

## Action Items from This Meeting

| Action | Owner | Due |
|---|---|---|
| | | |
| | | |

---

*Next sync: [Date and format — standup / async update / mid-sprint check-in]*`,
    howToUse: [
      {
        step: "Define success metric before writing scope",
        detail:
          "The success metric (Section 1) is the most important part of the kickoff. If PM and engineering can't agree on how to measure success, they'll also disagree on scope. Define it first. Everything else — in scope, out of scope, done criteria — flows from it.",
      },
      {
        step: "Fill the Out of Scope table explicitly",
        detail:
          "Teams that only define what's in scope consistently face scope creep. Explicitly writing 'multi-language support: excluded from this sprint' prevents a stakeholder from assuming it's included. The more controversial the exclusion, the more important it is to write it down.",
      },
      {
        step: "Have engineering explain the technical approach in their own words",
        detail:
          "When engineers describe the approach back to PM in the kickoff, they often surface scope surprises: 'Wait, to do X, we also need to build Y' or 'This requires a schema migration that needs a maintenance window.' These surprises are much cheaper to handle in the kickoff than in week 3.",
      },
      {
        step: "Record action items with named owners before the meeting ends",
        detail:
          "End every kickoff by reading the action items list aloud, confirming owners, and setting due dates. 'Someone' as the owner means no one. The kickoff template's job is to eliminate ambiguity — action items without names are the biggest source of post-kickoff ambiguity.",
      },
    ],
    faqs: [
      {
        q: "How is an engineering kickoff different from sprint planning?",
        a: "Sprint planning covers the whole sprint backlog across multiple features. An engineering kickoff is feature-specific — it's a focused session for one epic or feature set where PM and engineering align on scope, approach, and risks before the sprint starts. You might run 1–3 kickoffs per sprint for the largest features.",
      },
      {
        q: "Should design be in the kickoff?",
        a: "Yes — ideally design attends or has already synced with PM before the kickoff. If designs aren't ready, that's a blocker, not a 'we'll figure it out' — document it in the blockers table and don't start engineering work until it's resolved. Building without finalized designs doubles rework.",
      },
      {
        q: "What if the feature is too large for 45 minutes?",
        a: "Split the kickoff into two sessions: a scoping session (define in/out scope and success metric) and a technical deep-dive (approach, dependencies, risks). Features too large for a 90-minute total kickoff are probably too large for a single sprint — consider breaking the epic into smaller deliverables.",
      },
      {
        q: "How do we handle kickoffs for bug fixes vs feature work?",
        a: "Bug fixes rarely need a full kickoff — a Jira comment with root cause, fix approach, and test plan is usually enough. Use the kickoff template for features, epics, significant refactors, and migrations. The threshold: if the work involves cross-team coordination or takes > 3 days, do a kickoff.",
      },
    ],
  },

  // ─── 31. Design Review Checklist ───────────────────────────────────────────,

  {
    slug: "design-review-checklist",
    title: "Design Review Checklist",
    shortTitle: "Design Review",
    category: "PM × Engineering",
    description:
      "A structured checklist for PM-led design reviews. Covers usability, accessibility, edge cases, copy, responsiveness, and handoff readiness — so nothing slips between design and build.",
    metaDescription:
      "Free design review checklist for product managers. Covers usability, accessibility, edge cases, copy, and handoff readiness. Copy-paste ready.",
    filename: "design-review-checklist.md",
    content: `# Design Review Checklist
**Feature:** [Feature name]
**Designer:** [Name]
**PM Reviewer:** [Name]
**Date:** [Date]
**Status:** [ ] Draft  [ ] Reviewed  [ ] Approved  [ ] Needs revision

---

## 1. Requirements alignment

| Criterion | Pass | Notes |
|---|---|---|
| Designs cover all user stories in the PRD | | |
| Acceptance criteria are visually satisfied | | |
| Out-of-scope items are not designed (no scope creep) | | |
| Success metric is measurable from the designed flow | | |

**Gaps / missing requirements:**
[List any PRD requirements not addressed in designs]

---

## 2. User flows & edge cases

| Criterion | Pass | Notes |
|---|---|---|
| Happy path is clear and complete | | |
| Empty state is designed (no data, first-time user) | | |
| Error states are designed (API failure, validation errors) | | |
| Loading states are designed (skeleton screens or spinners) | | |
| Confirmation / success states are designed | | |
| Destructive action warnings are present (delete, cancel) | | |
| Timeout / session expiry handling is designed | | |

**Missing states:**
[List any states that need to be designed before handoff]

---

## 3. Usability

| Criterion | Pass | Notes |
|---|---|---|
| Primary action is visually prominent (clear CTA hierarchy) | | |
| Navigation / back behaviour is intuitive | | |
| Form validation messages are specific and actionable | | |
| No more than one primary CTA per screen | | |
| Task can be completed in ≤ 5 steps (or justified if more) | | |
| Cognitive load is acceptable — no screen is overwhelming | | |

**Usability concerns:**
[Note any flows that feel confusing or require explanation]

---

## 4. Copy & content

| Criterion | Pass | Notes |
|---|---|---|
| All copy is final (no "Lorem ipsum" or placeholder text) | | |
| Button labels are action-oriented (verb + noun) | | |
| Error messages explain what went wrong and what to do | | |
| Empty state copy sets expectation and provides next action | | |
| Tone is consistent with existing product voice | | |
| Character limits are tested (truncation handled gracefully) | | |

**Copy issues:**
[List any placeholder copy or tone inconsistencies]

---

## 5. Accessibility

| Criterion | Pass | Notes |
|---|---|---|
| Colour contrast meets WCAG AA (4.5:1 text, 3:1 UI elements) | | |
| Interactive elements are not colour-only (icons, labels) | | |
| Focus order is logical for keyboard navigation | | |
| Form inputs have labels (not just placeholder text) | | |
| Images have alt text noted in spec | | |
| Touch targets are ≥ 44×44px on mobile | | |

**Accessibility gaps:**
[List any accessibility issues to resolve before handoff]

---

## 6. Responsiveness & platform

| Criterion | Pass | Notes |
|---|---|---|
| Mobile (375px) breakpoint is designed | | |
| Tablet (768px) breakpoint is designed (if applicable) | | |
| Desktop (1280px+) breakpoint is designed | | |
| No horizontal scroll on mobile | | |
| Native patterns used where appropriate (bottom sheets, swipe) | | |

---

## 7. Design system consistency

| Criterion | Pass | Notes |
|---|---|---|
| Components are from the existing design system | | |
| New components are documented / added to system | | |
| Spacing follows the grid (4pt or 8pt system) | | |
| Typography matches type scale | | |
| Colours are from the defined palette | | |

**New components / deviations:**
[List any net-new components that need to be built or any intentional design system deviations]

---

## 8. Handoff readiness

| Criterion | Pass | Notes |
|---|---|---|
| All assets are exported (icons, images, custom graphics) | | |
| Interaction notes are annotated (animations, transitions, timing) | | |
| Prototype link is available for engineer reference | | |
| Responsive specs are annotated for all breakpoints | | |
| Design file is organised and named correctly | | |

---

## 9. Open questions

| Question | Owner | Due |
|---|---|---|
| [Question 1] | | |
| [Question 2] | | |

---

## Review decision

- [ ] **Approved** — ready for engineering handoff
- [ ] **Approved with minor changes** — changes listed above, no re-review needed
- [ ] **Needs revision** — re-review required before handoff

**Reviewer sign-off:** ____________________  Date: ________`,
    howToUse: [
      {
        step: "Review flows, not screens",
        detail:
          "The most common mistake in design reviews is evaluating individual screens in isolation. Walk through the complete user flow — from entry point to success state — for each user story. A screen that looks fine in isolation often reveals a broken transition or missing state when viewed as a sequence.",
      },
      {
        step: "Prioritise edge cases over happy path",
        detail:
          "The happy path is usually well-designed. The edge cases — empty states, error states, loading states, character limit overflow — are where designs break down in production. Allocate at least 30% of your review time to edge cases.",
      },
      {
        step: "Don't approve placeholder copy",
        detail:
          "Lorem ipsum and placeholder text hide real problems: a button label that's 3 words in English might be 8 words in Hindi and break the layout. A generic error message ('Something went wrong') that ships because review didn't flag it becomes permanent. Require final copy before handoff.",
      },
      {
        step: "Check accessibility early, not at the end",
        detail:
          "Accessibility issues found in design review take 10 minutes to fix. The same issues found in QA take hours of engineering rework. Colour contrast, touch target size, and keyboard focus order are all visible in design files before a line of code is written.",
      },
    ],
    faqs: [
      {
        q: "Who should run the design review — PM or design lead?",
        a: "Both should be present, but the PM leads the requirements-alignment and user flow sections while the design lead leads the design system and handoff readiness sections. The review is collaborative — it's not a PM gatekeeping design, it's PM and design ensuring nothing is missed before engineering starts.",
      },
      {
        q: "Should engineers attend the design review?",
        a: "At least one engineer should attend, specifically to flag technical feasibility concerns and to ask questions about interaction annotations. Engineers who attend the design review start the sprint with significantly better context than engineers who only see the Figma link in a Jira ticket.",
      },
      {
        q: "What if a design review blocks the sprint start?",
        a: "If blocking issues are found, fix them before engineering starts — not in parallel. The cost of a 2-day design fix before development is dramatically lower than a 2-day design change after 5 days of engineering work. If the issues are minor, approve with conditions and ensure changes are made before the component is built.",
      },
      {
        q: "How detailed should annotations be in the handoff?",
        a: "Annotations should answer the questions engineers will ask: 'What happens when the user hovers?', 'What's the animation timing?', 'What are the truncation rules?', 'What happens if this string is 100 characters?'. If an engineer has to guess, the annotation is insufficient.",
      },
    ],
  },

  // ─── 32. Post-Mortem ────────────────────────────────────────────────────────,

  {
    slug: "post-mortem",
    title: "Post-Mortem Template",
    shortTitle: "Post-Mortem",
    category: "PM × Engineering",
    description:
      "A blameless post-mortem template for product incidents and failed launches. Documents what happened, why it happened, what was learned, and what changes will prevent recurrence.",
    metaDescription:
      "Free blameless post-mortem template for product and engineering teams. Covers timeline, root cause analysis, 5 Whys, and action items. Copy-paste ready.",
    filename: "post-mortem.md",
    content: `# Post-Mortem
**Incident / Event:** [Brief title]
**Date of incident:** [Date]
**Date of post-mortem:** [Date]
**Severity:** [ ] P0 — all users affected  [ ] P1 — significant subset  [ ] P2 — minor / limited impact
**Facilitator:** [Name]
**Attendees:** [Names]
**Status:** [ ] Draft  [ ] Final  [ ] Action items in progress

---

## 1. Summary

**What happened** (2–3 sentences, no jargon):
[Plain-language description of what users experienced and for how long]

**Impact:**
- Users affected: [number or %, or "unknown"]
- Duration: [start time] → [end time] = [total duration]
- Revenue / business impact: [if known]
- Data loss: [ ] Yes  [ ] No

---

## 2. Timeline

| Time (UTC) | Event |
|---|---|
| [HH:MM] | [First sign of issue / alert triggered] |
| [HH:MM] | [Team notified / on-call paged] |
| [HH:MM] | [Initial investigation started] |
| [HH:MM] | [Hypothesis formed: suspected cause] |
| [HH:MM] | [Mitigation applied / rollback initiated] |
| [HH:MM] | [Service restored / incident resolved] |
| [HH:MM] | [Post-mortem scheduled] |

---

## 3. Root cause analysis

### Immediate cause
[The direct technical or process failure that caused the incident]
*Example: "A deploy at 14:32 introduced a null pointer exception in the payment flow."*

### Contributing factors
[The conditions that allowed the immediate cause to happen — these are the real leverage points]

1. **[Factor 1]:** [Explanation]
2. **[Factor 2]:** [Explanation]
3. **[Factor 3]:** [Explanation]

### 5 Whys

| Why | Answer |
|---|---|
| Why did [incident] happen? | [Answer] |
| Why did [answer 1] happen? | [Answer] |
| Why did [answer 2] happen? | [Answer] |
| Why did [answer 3] happen? | [Answer] |
| Why did [answer 4] happen? | [Root cause] |

### Root cause (single sentence):
> [The fundamental systemic reason this incident occurred]

---

## 4. Detection & response

| Question | Answer |
|---|---|
| How was the incident detected? | [Alert / customer report / manual discovery] |
| How long until detection after onset? | [Duration] |
| How long from detection to resolution? | [Duration] |
| Was the runbook followed? | [ ] Yes  [ ] No  [ ] No runbook existed |
| Was escalation appropriate and timely? | [ ] Yes  [ ] No — explain: |

**What slowed the response?**
[List any information gaps, missing tooling, or process failures that extended the incident]

---

## 5. What went well

[List things that worked as intended — detection that fired correctly, clear communication, fast rollback, good runbook. This is not spin — genuine positives should be reinforced.]

- [Item 1]
- [Item 2]
- [Item 3]

---

## 6. What went wrong

[List failures honestly — missing monitoring, slow escalation, insufficient testing, lack of feature flags, etc. This is blameless: focus on systems and processes, not individuals.]

- [Item 1]
- [Item 2]
- [Item 3]

---

## 7. Action items

| Action | Owner | Type | Due date | Status |
|---|---|---|---|---|
| [Action 1] | [Name] | Prevention / Detection / Process | [Date] | Open |
| [Action 2] | [Name] | Prevention / Detection / Process | [Date] | Open |
| [Action 3] | [Name] | Prevention / Detection / Process | [Date] | Open |

**Action types:**
- **Prevention** — stops this class of incident from occurring
- **Detection** — catches this class of incident faster when it does occur
- **Process** — improves response, communication, or escalation

---

## 8. Lessons learned

**What should every engineer on the team know from this incident?**
[1–3 sentences capturing the key lesson. This is the part that gets linked from future PRDs and architecture discussions.]

**Should this change our deployment / review / testing process?**
[ ] Yes — describe change: ________________________________
[ ] No

**Does this incident reveal a systemic risk elsewhere in the product?**
[ ] Yes — describe: ________________________________
[ ] No

---

## 9. Follow-up

- [ ] Action items added to Jira/Linear
- [ ] Runbook updated (or created)
- [ ] Monitoring / alerting improved
- [ ] Post-mortem shared with relevant stakeholders
- [ ] Reviewed in next sprint retrospective`,
    howToUse: [
      {
        step: "Run the post-mortem within 72 hours",
        detail:
          "Context decays fast. The engineer who fixed the incident at 2am will remember the exact sequence of events for 48 hours and a rough outline at two weeks. The timeline and root cause sections are most accurate when written while the incident is fresh. Schedule the post-mortem before the incident is resolved — don't wait until people have moved on.",
      },
      {
        step: "Keep it blameless by focusing on systems, not people",
        detail:
          "'The deploy pipeline didn't require a second reviewer' is a system failure. 'John didn't get a second review' is a blame. Both describe the same gap. The blameless framing is not just culturally kinder — it's more accurate, because the root cause is always a system that allowed one person's error to propagate unchecked.",
      },
      {
        step: "The 5 Whys stops when you reach something you can actually fix",
        detail:
          "The 5 Whys exercise is complete when you reach a root cause that has a concrete, ownable action. If the last 'why' is 'because software is complex' or 'because mistakes happen', go back one level — that's not a root cause, it's a shrug. A good root cause has a specific action item attached to it.",
      },
      {
        step: "Action items without owners and dates are decorations",
        detail:
          "The most common post-mortem failure mode: a well-written document with three action items, none assigned to a specific person, all marked 'TBD'. In the next incident retrospective, those same three items appear again. Every action item needs a name and a date before the post-mortem is closed.",
      },
    ],
    faqs: [
      {
        q: "Should every bug have a post-mortem?",
        a: "No — post-mortems are for significant incidents: P0/P1 outages, data loss, failed launches with material business impact, or any event the team wants to learn from systematically. Minor bugs fixed in a patch don't need a post-mortem. A rough threshold: if it was escalated to leadership or affected more than 5% of users, write a post-mortem.",
      },
      {
        q: "How do we make post-mortems actually change behaviour?",
        a: "Two things: (1) action items must be tracked in the same system as regular engineering work — Jira or Linear, not a Google Doc. (2) Review open post-mortem action items in the next sprint retrospective. Post-mortems that live only in a Google Drive folder get read once and forgotten.",
      },
      {
        q: "How long should a post-mortem document be?",
        a: "Long enough to capture the timeline, root cause, and action items clearly — typically 1–3 pages. Longer is not better. The goal is a document that a new engineer can read in 15 minutes and understand what happened, why, and what changed as a result.",
      },
      {
        q: "Should customers or stakeholders see the post-mortem?",
        a: "A summarised, non-technical version should be shared with affected customers and relevant stakeholders within 48–72 hours of resolution. The internal blameless post-mortem stays internal. The external communication should cover: what happened, how long, what was affected, what's been fixed, and what will prevent recurrence.",
      },
    ],
  },

  // ─── 33. AI Feature Spec ────────────────────────────────────────────────────
];