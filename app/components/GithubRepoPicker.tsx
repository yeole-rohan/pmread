"use client";

import { GitBranch } from "lucide-react";

interface Props {
  projectId: string;
  githubConnected: boolean;
  isPro?: boolean;
}

// GitHub codebase indexing — coming soon
export default function GitBranchRepoPicker(_props: Props) {
  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 cursor-default select-none"
      title="GitHub codebase context — coming soon"
    >
      <GitBranch size={13} />
      Coming soon
    </span>
  );
}
