import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PMRead — Turn customer research into PRDs",
    template: "%s | PMRead",
  },
  description:
    "Upload customer interviews and feedback. PMRead extracts insights and generates evidence-backed PRDs your engineers can build from.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "PMRead",
  },
  twitter: { card: "summary_large_image" },
  verification: { google: "xueZ9q7sAS6VO8lAIskvJovfMinZGQZiGJ4uqPNbNgs" },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "true"
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-white text-gray-900 font-sans">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
