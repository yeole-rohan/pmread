"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function BlogSidebarCta({
  slug,
  location,
}: {
  slug: string;
  location: "sidebar" | "bottom";
}) {
  return (
    <Link
      href="/signup"
      onClick={() => trackEvent("blog_cta_click", { slug, location })}
      className={
        location === "sidebar"
          ? "block text-center px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-lg text-xs transition-colors"
          : "inline-block px-5 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
      }
    >
      {location === "sidebar" ? "Try free →" : "Try PMRead free →"}
    </Link>
  );
}
