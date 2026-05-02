import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Pure logic extracted from FilesTab.tsx — tested without mounting React
// ---------------------------------------------------------------------------

const INGEST_DOMAIN = "ingest.pmread.com";

// Mirrors: const email = token ? `${token}@ingest.pmread.com` : null
function buildIngestEmail(token: string | null | undefined): string | null {
  return token ? `${token}@${INGEST_DOMAIN}` : null;
}

// Mirrors: const newToken = res.ingest_email.split("@")[0]
function extractTokenFromEmail(ingestEmail: string): string {
  return ingestEmail.split("@")[0];
}

// ---------------------------------------------------------------------------
describe("buildIngestEmail — email address construction", () => {
  it("builds correct email address from a valid token", () => {
    expect(buildIngestEmail("abc123def456789012345678901234")).toBe(
      "abc123def456789012345678901234@ingest.pmread.com"
    );
  });

  it("returns null when token is null", () => {
    expect(buildIngestEmail(null)).toBeNull();
  });

  it("returns null when token is undefined", () => {
    expect(buildIngestEmail(undefined)).toBeNull();
  });

  it("returns null when token is empty string", () => {
    expect(buildIngestEmail("")).toBeNull();
  });

  it("always uses ingest.pmread.com domain", () => {
    const email = buildIngestEmail("sometoken");
    expect(email).toContain("@ingest.pmread.com");
  });

  it("token appears before the @ sign", () => {
    const token = "deadbeef1234";
    const email = buildIngestEmail(token);
    expect(email?.split("@")[0]).toBe(token);
  });
});

// ---------------------------------------------------------------------------
describe("extractTokenFromEmail — regenerate response parsing", () => {
  it("extracts token from full email address", () => {
    expect(extractTokenFromEmail("abc123def456@ingest.pmread.com")).toBe("abc123def456");
  });

  it("handles 32-char hex token (gen_random_bytes output)", () => {
    const token = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
    const email = `${token}@ingest.pmread.com`;
    expect(extractTokenFromEmail(email)).toBe(token);
  });

  it("round-trips: build then extract returns original token", () => {
    const original = "feedface12345678feedface12345678";
    const email = buildIngestEmail(original)!;
    expect(extractTokenFromEmail(email)).toBe(original);
  });

  it("does not include the @ character in the extracted token", () => {
    const token = extractTokenFromEmail("mytoken@ingest.pmread.com");
    expect(token).not.toContain("@");
  });
});

// ---------------------------------------------------------------------------
describe("IngestEmailSection initial state", () => {
  // Mirrors: useState<string | null>(initialToken ?? null)
  function resolveInitialToken(prop: string | null | undefined): string | null {
    return prop ?? null;
  }

  it("uses provided token as initial state", () => {
    expect(resolveInitialToken("existingtoken123")).toBe("existingtoken123");
  });

  it("defaults to null when initialToken is undefined", () => {
    expect(resolveInitialToken(undefined)).toBeNull();
  });

  it("defaults to null when initialToken is null", () => {
    expect(resolveInitialToken(null)).toBeNull();
  });
});
