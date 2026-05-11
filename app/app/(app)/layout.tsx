"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FeedbackButton from "@/components/FeedbackButton";
import SearchModal from "@/components/SearchModal";
import UpgradeModal from "@/components/UpgradeModal";
import { useUser } from "@/lib/useUser";
import { apiFetch } from "@/lib/api";
import { Project, Workspace } from "@/lib/types";
import { getToken } from "@/lib/api";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (!loading && !user && !getToken()) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.subscription_status === "expired" && pathname !== "/settings") {
      router.push("/plan-expired");
    }
  }, [user, router, pathname]);

  useEffect(() => {
    if (user) {
      apiFetch<Project[]>("/projects/").then(setProjects).catch(() => {});
      if (["teams", "studio"].includes(user.plan)) {
        apiFetch<Workspace[]>("/workspaces/").then(setWorkspaces).catch(() => {});
      }
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
        workspaces={workspaces}
        user={user}
        onProjectCreated={(p) => setProjects((prev) => [p, ...prev])}
        onProjectDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
        onProjectRenamed={(id, name) =>
          setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
        }
        onSearchOpen={() => setSearchOpen(true)}
        onUpgradeRequired={() => setShowUpgrade(true)}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <FeedbackButton />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
