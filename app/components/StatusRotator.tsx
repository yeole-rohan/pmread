"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading your customer interviews...",
  "Identifying pain points...",
  "Mapping feedback to opportunities...",
  "Ranking by impact...",
  "Writing your feature brief...",
];

interface StatusRotatorProps {
  currentMessage?: string;
}

export default function StatusRotator({ currentMessage }: StatusRotatorProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const msg = currentMessage || MESSAGES[index];

  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
      <span
        className={`text-sm text-gray-600 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {msg}
      </span>
    </div>
  );
}
