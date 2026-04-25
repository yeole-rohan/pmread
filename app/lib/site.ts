/**
 * Canonical site URL — set NEXT_PUBLIC_SITE_URL in .env per environment.
 * Stage:  https://staging-pmread.rohanyeole.com
 * Prod:   https://pmread.org
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pmread.org";

export const TWITTER_HANDLE = "@RohanYeole99904";

export const DEFAULT_OG_IMAGE = {
  url: "/og.svg",
  width: 1200,
  height: 630,
  alt: "PMRead — Turn customer research into PRDs",
};
