"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Project } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    apiFetch<Project[]>("/projects/")
      .then(async (projects) => {
        if (projects.length > 0) {
          router.replace(`/project/${projects[0].id}`);
        } else {
          // No projects yet — create a default one and land there
          const project = await apiFetch<Project>("/projects/", {
            method: "POST",
            body: JSON.stringify({ name: "New Project" }),
          });
          router.replace(`/project/${project.id}`);
        }
      })
      .catch(() => router.replace("/dashboard"));
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
