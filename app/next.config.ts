import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Prod API URL — must be set via NEXT_PUBLIC_API_URL in production .env
const PROD_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Prod CSP: strict — only allow the configured API origin.
const CSP_PROD = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${PROD_API_URL} https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com`,
  "frame-src https://api.razorpay.com",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// Dev CSP: permissive — wildcard localhost covers any port (API on 8000, HMR
// on 3000, etc.) regardless of what NEXT_PUBLIC_API_URL is set to.
// unsafe-eval needed for Next.js source maps; ws:// needed for HMR websocket.
const CSP_DEV = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
  "frame-src https://api.razorpay.com",
  "img-src 'self' data: https: http:",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const CSP = isProd ? CSP_PROD : CSP_DEV;

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control",   value: "off" },
          { key: "Content-Security-Policy",  value: CSP },
          // HSTS: only in production — browsers reject it on HTTP (L10 fix)
          ...(isProd ? [{
            key:   "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
