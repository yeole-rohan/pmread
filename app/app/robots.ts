import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/project/", "/settings/", "/api/"],
    },
    sitemap: "https://pmread.rohanyeole.com/sitemap.xml",
  };
}
