/**
 * GA4 event helper. No-ops when GA_ID is not set or gtag is not loaded.
 * Usage: trackEvent("generate_prd", { question_length: 42 })
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", eventName, params ?? {});
}
