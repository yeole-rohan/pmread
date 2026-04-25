export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  initials: string;
  linkedin: string;
  twitter?: string;
}

export const AUTHORS: Record<string, Author> = {
  "rohan-yeole": {
    slug: "rohan-yeole",
    name: "Rohan Yeole",
    role: "Founder, PMRead",
    bio: "Rohan built PMRead after spending years watching great PMs ship the wrong things because their requirements weren't grounded in real customer evidence. He writes about AI-powered product workflows, PRD craft, and how product teams in India are closing the global PM gap.",
    avatar: "/authors/rohanyeole.png",
    initials: "RY",
    linkedin: "https://linkedin.com/in/yeole-rohan",
    twitter: "https://x.com/RohanYeole99904",
  },
};

export function getAuthor(slug: string): Author | null {
  return AUTHORS[slug] ?? null;
}
