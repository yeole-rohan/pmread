import { describe, it, expect } from "vitest";
import type { Decision, User } from "@/lib/types";

// ---------------------------------------------------------------------------
// Pure logic extracted from DecisionsTab.tsx — tested without mounting React
// ---------------------------------------------------------------------------

// Mirrors: const isFree = user?.plan === "free"
//          const atLimit = isFree && (decisions?.length ?? 0) >= 10
function isAtDecisionLimit(user: Pick<User, "plan"> | null, decisionCount: number): boolean {
  const isFree = user?.plan === "free";
  return isFree && decisionCount >= 10;
}

// Mirrors StatusBadge label logic
function statusLabel(status: Decision["status"]): string {
  if (status === "active") return "Active";
  if (status === "reversed") return "Reversed";
  return "Superseded";
}

// ---------------------------------------------------------------------------
describe("Decision limit — free plan", () => {
  it("is NOT at limit with 9 decisions on free plan", () => {
    expect(isAtDecisionLimit({ plan: "free" }, 9)).toBe(false);
  });

  it("IS at limit with exactly 10 decisions on free plan", () => {
    expect(isAtDecisionLimit({ plan: "free" }, 10)).toBe(true);
  });

  it("IS at limit with 11 decisions on free plan", () => {
    expect(isAtDecisionLimit({ plan: "free" }, 11)).toBe(true);
  });

  it("is NOT at limit with 10 decisions on pro plan", () => {
    expect(isAtDecisionLimit({ plan: "pro" }, 10)).toBe(false);
  });

  it("is NOT at limit with 10 decisions on teams plan", () => {
    expect(isAtDecisionLimit({ plan: "teams" }, 10)).toBe(false);
  });

  it("is NOT at limit with 10 decisions on studio plan", () => {
    expect(isAtDecisionLimit({ plan: "studio" }, 10)).toBe(false);
  });

  it("is NOT at limit when user is null", () => {
    expect(isAtDecisionLimit(null, 15)).toBe(false);
  });

  it("is NOT at limit with 0 decisions on free plan", () => {
    expect(isAtDecisionLimit({ plan: "free" }, 0)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("Decision status label mapping", () => {
  it("returns 'Active' for active status", () => {
    expect(statusLabel("active")).toBe("Active");
  });

  it("returns 'Reversed' for reversed status", () => {
    expect(statusLabel("reversed")).toBe("Reversed");
  });

  it("returns 'Superseded' for superseded status", () => {
    expect(statusLabel("superseded")).toBe("Superseded");
  });
});

// ---------------------------------------------------------------------------
describe("Decision count display helper", () => {
  // Mirrors: `decision{list.length !== 1 ? "s" : ""} logged`
  function decisionCountText(count: number): string {
    return `${count} decision${count !== 1 ? "s" : ""} logged`;
  }

  it("uses singular for 1 decision", () => {
    expect(decisionCountText(1)).toBe("1 decision logged");
  });

  it("uses plural for 0 decisions", () => {
    expect(decisionCountText(0)).toBe("0 decisions logged");
  });

  it("uses plural for 2 decisions", () => {
    expect(decisionCountText(2)).toBe("2 decisions logged");
  });

  it("uses plural for 10 decisions", () => {
    expect(decisionCountText(10)).toBe("10 decisions logged");
  });
});
