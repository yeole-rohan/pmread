"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, ChevronLeft, ChevronRight, Settings, LogOut, MoreHorizontal } from "lucide-react";
import { Project, User } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { logout } from "@/lib/auth";
import { PLAN_PRD_LIMITS } from "@/lib/constants";

interface SidebarProps {
  projects: Project[];
  user: User;
  onProjectCreated: (project: Project) => void;
  onProjectDeleted: (id: string) => void;
  onProjectRenamed: (id: string, name: string) => void;
}

export default function Sidebar({
  projects,
  user,
  onProjectCreated,
  onProjectDeleted,
  onProjectRenamed,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const prdLimit = PLAN_PRD_LIMITS[user.plan] ?? 2;
  const prdsUsed = user.prds_generated_this_month ?? 0;
  const prdsLeft = Math.max(0, prdLimit - prdsUsed);

  async function createProject() {
    const project = await apiFetch<Project>("/projects/", {
      method: "POST",
      body: JSON.stringify({ name: "New Project" }),
    });
    onProjectCreated(project);
    router.push(`/project/${project.id}`);
  }

  async function renameProject(id: string) {
    if (!renameValue.trim()) return;
    await apiFetch(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: renameValue.trim() }),
    });
    onProjectRenamed(id, renameValue.trim());
    setRenaming(null);
  }

  async function deleteProject(id: string) {
    await apiFetch(`/projects/${id}`, { method: "DELETE" });
    onProjectDeleted(id);
    router.push("/dashboard");
  }

  if (collapsed) {
    return (
      <aside className="w-12 flex flex-col items-center py-4 border-r border-gray-100 bg-gray-50 gap-4">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1 text-gray-400 hover:text-gray-700"
          title="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
        <button onClick={createProject} className="p-1 text-gray-400 hover:text-gray-700" title="New project">
          <Plus size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-60 flex flex-col border-r border-gray-100 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <span className="font-semibold text-gray-900 text-sm">PMRead</span>
        <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-gray-700">
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* New project button */}
      <div className="px-3 py-3">
        <button
          onClick={createProject}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#7F77DD] hover:bg-[#6b64c4] rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Project list */}
      <div className="flex-1 overflow-y-auto px-2">
        <p className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
          Projects
        </p>
        {projects.length === 0 ? (
          <p className="px-2 py-2 text-xs text-gray-400">
            No projects yet. Create one to get started.
          </p>
        ) : (
          projects.map((p) => {
            const isActive = pathname.includes(`/project/${p.id}`);
            return (
              <div
                key={p.id}
                className={`group relative flex items-center gap-1 px-2 py-2 rounded-lg mb-0.5 cursor-pointer ${
                  isActive ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => !renaming && router.push(`/project/${p.id}`)}
              >
                {renaming === p.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => renameProject(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameProject(p.id);
                      if (e.key === "Escape") setRenaming(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-sm bg-white border border-purple-400 rounded px-1 py-0.5 outline-none"
                  />
                ) : (
                  <span className="flex-1 text-sm truncate">{p.name}</span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === p.id ? null : p.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200"
                >
                  <MoreHorizontal size={14} />
                </button>

                {menuOpen === p.id && (
                  <div
                    className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]"
                    onMouseLeave={() => setMenuOpen(null)}
                  >
                    <button
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameValue(p.name);
                        setRenaming(p.id);
                        setMenuOpen(null);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(p.id);
                        setMenuOpen(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* User + PRD counter */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-2">
        {/* PRD usage pill */}
        <div className="px-2 py-1.5 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">PRDs this month</p>
            <span className={`text-xs font-semibold ${prdsLeft === 0 ? "text-red-500" : "text-gray-700"}`}>
              {prdsUsed} / {prdLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ${prdsLeft === 0 ? "bg-red-400" : "bg-[#7F77DD]"}`}
              style={{ width: `${Math.min(100, (prdsUsed / prdLimit) * 100)}%` }}
            />
          </div>
          {user.plan === "free" && prdsLeft <= 1 && (
            <Link
              href="/settings?upgrade=true"
              className="mt-1 block text-xs text-[#7F77DD] font-medium hover:underline"
            >
              {prdsLeft === 0 ? "Upgrade for more →" : "1 PRD left this month"}
            </Link>
          )}
        </div>

        {/* User row */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#7F77DD] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {(user.display_name || user.email)[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {user.display_name || user.email}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user.plan} plan</p>
          </div>
          <div className="flex gap-1">
            <Link href="/settings" className="p-1 text-gray-400 hover:text-gray-700">
              <Settings size={14} />
            </Link>
            <button
              onClick={() => logout()}
              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
