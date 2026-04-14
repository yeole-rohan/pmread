"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Old route — redirect to project page where Generate PRD lives
export default function NewRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/project/${params.id}?tab=prds`);
  }, [params.id, router]);

  return null;
}
