"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/lib/useUser";
import { apiFetch } from "@/lib/api";
import { Project } from "@/lib/types";
import { getToken } from "@/lib/api";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!loading && !user && !getToken()) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      apiFetch<Project[]>("/projects/").then(setProjects).catch(() => {});
    }
  }, [user, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        projects={projects}
        user={user}
        onProjectCreated={(p) => setProjects((prev) => [p, ...prev])}
        onProjectDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
        onProjectRenamed={(id, name) =>
          setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
        }
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
