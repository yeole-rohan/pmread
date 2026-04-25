export interface Template {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  metaDescription: string;
  filename: string;
  content: string;
  howToUse: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
  keywords?: string[];
}
