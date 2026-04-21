/**
 * Canonical site URL — set NEXT_PUBLIC_SITE_URL in .env per environment.
 * Stage:  https://staging-pmread.rohanyeole.com
 * Prod:   https://pmread.org
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pmread.org";
