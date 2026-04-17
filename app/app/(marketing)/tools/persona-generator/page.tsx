import type { Metadata } from "next";
import PersonaGeneratorTool from "./PersonaGeneratorTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free AI Persona Generator — User Persona Creator | PMRead",
  description:
    "Turn bullet points about your users into a structured persona card. Free AI persona generator for product managers — no signup required.",
  alternates: { canonical: "https://pmread.rohanyeole.comanyeole.com/tools/persona-generator" },
  openGraph: {
    title: "Free AI Persona Generator | PMRead",
    description: "Paste notes about your user and get a full persona card with goals, frustrations, a memorable quote, and recommended product qualities.",
    url: "https://pmread.rohanyeole.comanyeole.com/tools/persona-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Persona Generator | PMRead",
    description: "Paste notes about your user and get a full persona card with goals, frustrations, a memorable quote, and recommended product qualities.",
  },
};

const FAQS = [
  {
    q: "What information should I include about my user?",
    a: "Job title, company size, key responsibilities, tools they use, main frustrations, and goals. Real data from interviews beats assumptions — even rough notes work well.",
  },
  {
    q: "How many personas should a product have?",
    a: "2–4 covers most products. One primary (your ideal customer), one or two secondary, and optionally one anti-persona (who you are not building for). More than four is usually a sign of unclear targeting.",
  },
  {
    q: "Are personas the same as customer segments?",
    a: "No. Segments are groups defined by measurable attributes (e.g. 'SMB customers under 50 seats'). Personas are fictional individuals that represent a segment — they make segments human and memorable for your team.",
  },
  {
    q: "Is this persona generator free?",
    a: "Yes, completely free. No signup, no account, and no credit card required.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free AI User Persona Generator",
      applicationCategory: "BusinessApplication",
      description: "Generate structured user personas from bullet points or interview notes using AI. Free, no signup required.",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: "https://pmread.rohanyeole.comanyeole.com/tools/persona-generator",
    },
    {
      "@type": "HowTo",
      name: "How to create a user persona with AI",
      description: "Turn raw notes about your users into a complete, structured persona card.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Gather your observations", text: "Collect notes from customer interviews, surveys, or any observations about this type of user. Bullet points work perfectly." },
        { "@type": "HowToStep", position: 2, name: "Paste into the tool", text: "Paste your notes into the text area. Include job title, frustrations, goals, and tools they use for the best results." },
        { "@type": "HowToStep", position: 3, name: "Generate", text: "Click Generate Persona. The AI produces a complete card with demographics, goals, frustrations, a day in their life, and a memorable quote." },
        { "@type": "HowToStep", position: 4, name: "Copy or download", text: "Copy the persona into Notion or Confluence, or download as a Markdown file to share with your team." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pmread.rohanyeole.comanyeole.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://pmread.rohanyeole.comanyeole.com/tools" },
        { "@type": "ListItem", position: 3, name: "Persona Generator", item: "https://pmread.rohanyeole.comanyeole.com/tools/persona-generator" },
      ],
    },
  ],
};

const OTHER_TOOLS = [
  { name: "PRD Generator", href: "/tools/prd-generator" },
  { name: "Feedback Analyzer", href: "/tools/feedback-analyzer" },
  { name: "User Story Generator", href: "/tools/user-story-generator" },
  { name: "Feature Prioritization", href: "/tools/feature-prioritization" },
];

export default function PersonaGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-gray-600">Tools</Link>
            <span>/</span>
            <span className="text-gray-600">Persona Generator</span>
          </nav>

          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#7F77DD] uppercase mb-3">
              Free Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              User Persona Generator
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Paste bullet points, interview notes, or observations about your user — get a
              complete persona card with demographics, goals, frustrations, a memorable quote,
              and the product qualities that matter most to them. No signup required.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <PersonaGeneratorTool />
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What this tool generates</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Name & role", text: "A realistic name and job title grounded in your inputs" },
                { label: "Demographics", text: "Age, location, industry, company size, and team context" },
                { label: "Goals", text: "Top 3 professional goals driving their decisions" },
                { label: "Frustrations", text: "The pain points they live with every day" },
                { label: "A day in their life", text: "Their actual workflow in 2–3 sentences" },
                { label: "Memorable quote", text: "One line that captures their mindset and voice" },
                { label: "Tools they use", text: "Their current tech stack — for positioning and integration bets" },
                { label: "What wins them over", text: "The 3 product qualities that matter most to them" },
              ].map(({ label, text }) => (
                <div key={label} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-900 pt-2">Tips for better personas</h2>
            <ul className="space-y-1.5 text-sm text-gray-600 list-disc pl-5">
              <li>Base personas on real interviews, not assumptions — this tool is only as good as your input</li>
              <li>Include specific details: job title, company size, tools used, specific frustrations</li>
              <li>Create one persona per distinct user type — do not blend two different users into one</li>
              <li>Update personas quarterly as you learn more from customers</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform CTA */}
          <div className="mt-12 rounded-2xl border border-[#7F77DD]/20 bg-purple-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Want AI insights from your actual customer data?
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              PMRead ingests PDFs, audio, Zoom transcripts, Slack channels, and GitHub — and
              generates PRDs grounded in real evidence, not guesses.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-2.5 bg-[#7F77DD] hover:bg-[#6b64c4] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Get started free →
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Other free tools</p>
            <div className="flex flex-wrap gap-2">
              {OTHER_TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors bg-white"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
