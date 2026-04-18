import { NextRequest } from "next/server";

type Inputs = Record<string, string>;

const PROMPTS: Record<string, (i: Inputs) => string> = {
  "prd-generator": ({ problem, users, context }) =>
    `You are an expert product manager. Write a concise, actionable PRD.

Problem statement: ${problem}
Target users: ${users || "Not specified"}
Additional context: ${context || "None"}

Format in markdown with these exact sections:
## Problem Statement
## Target Users
## User Stories
(3-5 stories in format: "As a [user], I want [feature] so that [benefit].")
## Acceptance Criteria
(bullet list for the most important story)
## Success Metrics
(3-4 measurable KPIs)
## Out of Scope
(2-3 explicit non-goals)

Be specific and actionable. No filler sentences.`.trim(),

  "feedback-analyzer": ({ feedback }) =>
    `Analyze this customer feedback and extract structured product insights.

Feedback:
${feedback}

Format in markdown:
## Key Themes
(2-5 themes, each with a brief explanation and rough mention count)
## Pain Points
(bullet list, most critical first — quote from feedback where possible)
## Feature Requests
(bullet list)
## What Users Like
(positive signals worth preserving)
## Top 3 Recommended Actions
(prioritized, with one-line reasoning for each)

Be direct. Quote from the feedback where relevant.`.trim(),

  "user-story-generator": ({ feature, role }) =>
    `Generate user stories for this feature.

Feature: ${feature}
Primary user: ${role || "end user"}

Format in markdown:
## User Stories
(4-6 stories in format: "As a [user], I want [action] so that [benefit].")

## Acceptance Criteria
For each story, list 3 Given/When/Then criteria.

## Definition of Done
(5-item checklist)

Keep stories independent, testable, and right-sized (not too big, not trivial).`.trim(),

  "persona-generator": ({ details }) =>
    `Create a vivid, specific user persona from these inputs.

User details:
${details}

Format in markdown:
## [First Name] — [Job Title]

**One-line summary**: [who they are in one sentence]

### Demographics
(age, location, industry, company size, team size)

### Goals
(top 3 professional goals)

### Frustrations
(top 3 day-to-day pain points)

### A Day in Their Life
(2-3 sentences showing their actual workflow)

### Quote
> "[A direct quote capturing their mindset]"

### Tools They Currently Use
(list 5-8 tools)

### What Would Win Them Over
(3 product qualities that matter most to this person)

Make this feel like a real, specific person — not a generic stereotype.`.trim(),

  "interview-prep": ({ jd, resume }) =>
    `You are an expert PM interview coach. Based only on the job description and resume/experience provided, generate 5–10 likely interview questions with strong answers.

Job description:
${jd}

Resume / experience:
${resume || "Not provided — generate questions based on the JD only, and note where specific experience would strengthen the answer."}

Rules:
- Questions must be specific to this JD — not generic PM questions.
- Answers MUST be grounded only in what is in the resume. Do not invent metrics, projects, or achievements.
- If the resume lacks relevant experience for a question, say so honestly: "Your resume doesn't show X — here's how to frame what you do have."
- Cover a mix based on what the JD emphasises: behavioral (STAR), product design, metrics/analytical, and strategy.
- Keep each answer 3–5 sentences. Specific and direct.
- Generate between 5 and 10 questions — more if the JD is detailed.

Format in markdown:

## Q1: [Question]
**Strong answer:** [Answer grounded in the resume]

## Q2: [Question]
**Strong answer:** [Answer]

...continue for all questions.`.trim(),

  "metric-story-generator": ({ metrics, context }) =>
    `You are an expert product analyst. Turn these raw metrics into a clear narrative for a product team.

Product context: ${context}

Metrics:
${metrics}

Format in markdown:
## Executive Summary
(1 paragraph: the headline story in plain English)

## What Changed
(bullet list: each metric with direction and significance — flag which are good/bad)

## Likely Root Causes
(ranked 1–3, each with one-line reasoning — be specific, not generic)

## Recommended Next Steps
(3–5 specific, actionable steps — who does what)

## Signals to Watch
(2–3 leading indicators to monitor next week/sprint)

Be direct and specific. Avoid generic statements like "monitor closely." If you don't have enough context for a confident hypothesis, say so.`.trim(),
};

export async function POST(req: NextRequest) {
  const body = await req.json() as { tool: string } & Inputs;
  const { tool, ...inputs } = body;

  const buildPrompt = PROMPTS[tool];
  if (!buildPrompt) {
    return Response.json({ error: "Unknown tool" }, { status: 400 });
  }

  if (!process.env.XAI_API_KEY) {
    return Response.json({ error: "AI not configured" }, { status: 503 });
  }

  const prompt = buildPrompt(inputs);

  const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!xaiRes.ok) {
    const err = await xaiRes.text();
    console.error("xAI error:", err);
    return Response.json({ error: "AI service unavailable" }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = xaiRes.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const text: string = parsed.choices?.[0]?.delta?.content ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // skip malformed SSE chunks
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
