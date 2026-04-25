"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function TemplateViewTracker({ slug, templateName }: { slug: string; templateName: string }) {
  useEffect(() => {
    trackEvent("template_view", { slug, template_name: templateName });
  }, [slug, templateName]);

  return null;
}
