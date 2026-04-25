"use client";

import { useState } from "react";
import type { Author } from "@/lib/authors";

export default function AuthorAvatar({ author, size = 32 }: { author: Author; size?: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const dim = `w-[${size}px] h-[${size}px]`;
  const textSize = size >= 48 ? "text-sm" : "text-[9px]";

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#7F77DD]/15 flex items-center justify-center overflow-hidden flex-shrink-0"
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
}
