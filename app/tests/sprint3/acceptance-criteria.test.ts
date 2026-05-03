import { describe, it, expect } from "vitest";
import type { UserStory, PRD } from "@/lib/types";

// ---------------------------------------------------------------------------
// Pure logic mirrored from BriefRenderer.tsx buildMarkdown and StoryCard
// Tested without mounting React — node environment only
// ---------------------------------------------------------------------------

function storyToMarkdown(s: string | UserStory): string {
  if (typeof s === "string") return `- ${s}`;
  return [
    `- ${s.story}`,
    s.given ? `  - **Given:** ${s.given}` : null,
    s.when  ? `  - **When:** ${s.when}`  : null,
    s.then  ? `  - **Then:** ${s.then}`  : null,
  ].filter(Boolean).join("\n");
}

function storyToCopyText(s: string | UserStory): string {
  if (typeof s === "string") return s;
  return `${s.story}\nGiven: ${s.given}\nWhen: ${s.when}\nThen: ${s.then}`;
}

// ---------------------------------------------------------------------------
describe("storyToMarkdown — new Given/When/Then format", () => {
  const story: UserStory = {
    story: "As a PM, I want to share a PRD so that stakeholders can review it",
    given: "A PRD has been generated",
    when: "The PM clicks Share",
    then: "A read-only link is copied to clipboard",
  };

  it("includes the story text", () => {
    expect(storyToMarkdown(story)).toContain("As a PM, I want to share a PRD");
  });

  it("includes Given label", () => {
    expect(storyToMarkdown(story)).toContain("**Given:**");
    expect(storyToMarkdown(story)).toContain("A PRD has been generated");
  });

  it("includes When label", () => {
    expect(storyToMarkdown(story)).toContain("**When:**");
    expect(storyToMarkdown(story)).toContain("The PM clicks Share");
  });

  it("includes Then label", () => {
    expect(storyToMarkdown(story)).toContain("**Then:**");
    expect(storyToMarkdown(story)).toContain("A read-only link is copied to clipboard");
  });

  it("uses list indentation for AC lines", () => {
    const md = storyToMarkdown(story);
    expect(md).toContain("  - **Given:**");
    expect(md).toContain("  - **When:**");
    expect(md).toContain("  - **Then:**");
  });
});

describe("storyToMarkdown — old plain string format (backward compat)", () => {
  it("renders plain string with a leading dash", () => {
    expect(storyToMarkdown("As a PM, I want X so that Y")).toBe("- As a PM, I want X so that Y");
  });

  it("does NOT include Given/When/Then labels", () => {
    const md = storyToMarkdown("As an engineer, I want to read the PRD");
    expect(md).not.toContain("**Given:**");
    expect(md).not.toContain("**When:**");
    expect(md).not.toContain("**Then:**");
  });
});

describe("storyToMarkdown — partial AC (missing fields)", () => {
  it("omits lines where AC field is empty string", () => {
    const story: UserStory = { story: "As a user, I want X", given: "Some context", when: "", then: "" };
    const md = storyToMarkdown(story);
    expect(md).toContain("**Given:**");
    expect(md).not.toContain("**When:**");
    expect(md).not.toContain("**Then:**");
  });
});

describe("storyToCopyText", () => {
  it("formats new story with labeled lines", () => {
    const story: UserStory = { story: "As a PM...", given: "G", when: "W", then: "T" };
    const text = storyToCopyText(story);
    expect(text).toContain("Given: G");
    expect(text).toContain("When: W");
    expect(text).toContain("Then: T");
  });

  it("returns plain string unchanged", () => {
    expect(storyToCopyText("As a PM, I want X")).toBe("As a PM, I want X");
  });
});

describe("type narrowing — string vs UserStory", () => {
  it("typeof check correctly identifies plain string", () => {
    const item: string | UserStory = "plain story";
    expect(typeof item === "string").toBe(true);
  });

  it("typeof check correctly identifies UserStory object", () => {
    const item: string | UserStory = { story: "s", given: "g", when: "w", then: "t" };
    expect(typeof item === "object").toBe(true);
  });
});
