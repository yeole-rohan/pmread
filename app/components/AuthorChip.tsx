"use client";

import Link from "next/link";
import { useState } from "react";
import type { Author } from "@/lib/authors";

interface Props {
  author: Author;
  date: string;
  readingTime: number;
  size?: "sm" | "md";
  linkToProfile?: boolean;
}

export default function AuthorChip({
  author,
  date,
  readingTime,
  size = "sm",
  linkToProfile = false,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const formatted = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const dim = size === "md" ? "w-8 h-8" : "w-6 h-6";
  const textSize = size === "md" ? "text-[9px]" : "text-[8px]";

  const avatar = (
    <div
      className={`${dim} rounded-full bg-[#7F77DD]/15 flex items-center justify-center overflow-hidden flex-shrink-0`}
    >
      {imgFailed ? (
        <span className={`${textSize} font-bold text-[#7F77DD]`}>{author.initials}</span>
      ) : (
        <img
          src={author.avatar}
          alt={author.name}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );

  const meta = (
    <span className="text-xs text-gray-400">
      {author.name} · {formatted} · {readingTime} min read
    </span>
  );

  if (linkToProfile) {
    return (
      <Link href={`/author/${author.slug}`} className="flex items-center gap-2 group w-fit">
        {avatar}
        <div>
          <p className="text-sm font-semibold text-gray-800 group-hover:text-[#7F77DD] transition-colors leading-none mb-0.5">
            {author.name}
          </p>
          <p className="text-xs text-gray-400">
            {author.role} · {formatted} · {readingTime} min read
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {avatar}
      {meta}
    </div>
  );
}
