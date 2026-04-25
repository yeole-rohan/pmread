import { describe, it, expect } from "vitest";
import { TEMPLATES, getTemplate, TEMPLATE_CATEGORIES } from "@/lib/templates";

// ── TEMPLATES array ────────────────────────────────────────────────────────

describe("TEMPLATES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(TEMPLATES)).toBe(true);
    expect(TEMPLATES.length).toBeGreaterThan(0);
  });

  it("every template has required fields", () => {
    for (const t of TEMPLATES) {
      expect(t.slug, `${t.slug} missing slug`).toBeTruthy();
      expect(t.title, `${t.slug} missing title`).toBeTruthy();
      expect(t.shortTitle, `${t.slug} missing shortTitle`).toBeTruthy();
      expect(t.category, `${t.slug} missing category`).toBeTruthy();
      expect(t.description, `${t.slug} missing description`).toBeTruthy();
      expect(t.content, `${t.slug} missing content`).toBeTruthy();
    }
  });

  it("all slugs are unique", () => {
    const slugs = TEMPLATES.map((t) => t.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("all slugs are URL-safe (lowercase, hyphens only)", () => {
    for (const t of TEMPLATES) {
      expect(t.slug, `slug "${t.slug}" has invalid chars`).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("all categories are from the allowed list", () => {
    const allowed = new Set(TEMPLATE_CATEGORIES as readonly string[]);
    for (const t of TEMPLATES) {
      expect(allowed.has(t.category), `"${t.category}" not in TEMPLATE_CATEGORIES`).toBe(true);
    }
  });

  it("every template has at least one howToUse step", () => {
    for (const t of TEMPLATES) {
      expect(t.howToUse.length, `${t.slug} has no howToUse steps`).toBeGreaterThan(0);
    }
  });

  it("every howToUse step has step and detail fields", () => {
    for (const t of TEMPLATES) {
      for (const step of t.howToUse) {
        expect(step.step, `${t.slug} step missing text`).toBeTruthy();
        expect(step.detail, `${t.slug} step missing detail`).toBeTruthy();
      }
    }
  });

  it("every template has at least one FAQ", () => {
    for (const t of TEMPLATES) {
      expect(t.faqs.length, `${t.slug} has no FAQs`).toBeGreaterThan(0);
    }
  });

  it("every FAQ has q and a fields", () => {
    for (const t of TEMPLATES) {
      for (const faq of t.faqs) {
        expect(faq.q, `${t.slug} FAQ missing question`).toBeTruthy();
        expect(faq.a, `${t.slug} FAQ missing answer`).toBeTruthy();
      }
    }
  });

  it("content is non-empty string with meaningful length", () => {
    for (const t of TEMPLATES) {
      expect(t.content.length, `${t.slug} content too short`).toBeGreaterThan(50);
    }
  });
});

// ── getTemplate ────────────────────────────────────────────────────────────

describe("getTemplate", () => {
  it("returns a template for a known slug", () => {
    const slug = TEMPLATES[0].slug;
    const result = getTemplate(slug);
    expect(result).toBeDefined();
    expect(result!.slug).toBe(slug);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getTemplate("nonexistent-slug-xyz")).toBeUndefined();
  });

  it("is case-sensitive (slug must be exact)", () => {
    const slug = TEMPLATES[0].slug;
    expect(getTemplate(slug.toUpperCase())).toBeUndefined();
  });

  it("can find every template by its own slug", () => {
    for (const t of TEMPLATES) {
      expect(getTemplate(t.slug)?.slug).toBe(t.slug);
    }
  });
});

// ── TEMPLATE_CATEGORIES ────────────────────────────────────────────────────

describe("TEMPLATE_CATEGORIES", () => {
  it("is a non-empty array", () => {
    expect(TEMPLATE_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("all categories are used by at least one template", () => {
    const usedCategories = new Set(TEMPLATES.map((t) => t.category));
    for (const cat of TEMPLATE_CATEGORIES) {
      expect(usedCategories.has(cat), `Category "${cat}" has no templates`).toBe(true);
    }
  });
});
