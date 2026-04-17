export interface UseCase {
  slug: string;
  segment: string;
  headline: string;
  subheadline: string;
  metaDescription: string;
  heroStat: { value: string; label: string };
  painPoints: { title: string; body: string }[];
  howItHelps: { title: string; body: string }[];
  quote: { text: string; author: string; role: string };
  faqs: { q: string; a: string }[];
}

export const USE_CASES: UseCase[] = [
  {
    slug: "india-startups",
    segment: "India Startups",
    headline: "The PRD tool built for Indian startup PMs",
    subheadline:
      "Move fast from customer call to feature spec — without the ₹30,000/month enterprise tooling tax.",
    metaDescription:
      "PMRead helps Indian startup product managers turn customer feedback into PRDs fast. Priced in INR, built for lean teams. Try free.",
    heroStat: { value: "₹2,499/mo", label: "vs ₹8,000–₹30,000 for western PM tools" },
    painPoints: [
      {
        title: "Enterprise tools priced for US teams",
        body: "Productboard, Dovetail, and Aha! charge $30–$80/user/month — which is ₹2,500–₹6,500 per person. For a 3-PM startup team, that's ₹1 lakh+ per year just for tooling. PMRead Pro is ₹2,499/month for one PM, with a usable free tier.",
      },
      {
        title: "Customer calls stay in your head",
        body: "You do a user interview on Monday. By Thursday you're writing a PRD from memory — losing context, missing specifics, writing requirements that aren't grounded in what users actually said. PMRead extracts structured insights the moment you upload the recording or transcript.",
      },
      {
        title: "PRD quality matters more than you think",
        body: "In Indian startups, PMs often work with engineers who are building across multiple products. A vague spec wastes sprint capacity. PMRead generates PRDs with specific engineering tasks, acceptance criteria, and edge cases — reducing back-and-forth.",
      },
    ],
    howItHelps: [
      {
        title: "Upload → insights → PRD in under 15 minutes",
        body: "Upload a Zoom transcript or user interview PDF. PMRead extracts pain points and feature requests automatically. Click 'Generate PRD' — you get a full spec with user stories, requirements, and engineering tasks.",
      },
      {
        title: "Priced in INR, no conversion tax",
        body: "Pro plan is ₹2,499/month billed in INR via Razorpay. No international transaction fees, no dollar conversion surprises. Free tier includes 2 PRDs/month — enough to validate the product before paying.",
      },
      {
        title: "Works with how Indian PMs actually work",
        body: "Slack threads, WhatsApp screenshots saved as PDFs, Google Meet transcripts, support tickets — PMRead ingests all of them. Not just the polished Zoom recordings that US-centric tools optimise for.",
      },
    ],
    quote: {
      text: "We were using Notion AI to write PRDs but the requirements were hallucinated. PMRead's PRDs cite actual customer quotes. Engineers stopped asking 'who asked for this?' in standups.",
      author: "Priya K.",
      role: "Product Manager, B2B SaaS, Bengaluru",
    },
    faqs: [
      {
        q: "Is PMRead available in India?",
        a: "Yes. PMRead is built with Indian PMs as a primary audience. Pricing is in INR via Razorpay (₹2,499/mo Pro), and the free tier includes 2 PRDs/month.",
      },
      {
        q: "Does PMRead work with Indian languages?",
        a: "PRD generation is currently English-only. However, you can upload transcripts in Hindi or other Indian languages — PMRead will extract insights and generate the PRD in English.",
      },
      {
        q: "Can I use PMRead for a team at my startup?",
        a: "Yes. The Team plan (₹12,499/month) gives 60 shared PRDs/month for your entire PM team. Unlimited file uploads and insight extraction for all members.",
      },
      {
        q: "What types of customer feedback does PMRead ingest?",
        a: "PDF documents, text files, audio/video transcripts, Slack channels (Pro), and GitHub repositories (Pro). Most Indian startup PMs start by uploading Zoom or Google Meet transcripts.",
      },
    ],
  },

  {
    slug: "fintech",
    segment: "Fintech",
    headline: "PRD generation for fintech PMs who ship on tight compliance constraints",
    subheadline:
      "Turn regulatory feedback, customer complaints, and audit findings into structured feature specs — grounded in evidence, not assumptions.",
    metaDescription:
      "PMRead helps fintech product managers write PRDs grounded in compliance requirements, customer complaints, and audit data. Built for regulated product teams.",
    heroStat: { value: "Evidence-backed", label: "every requirement traces to a real customer or compliance source" },
    painPoints: [
      {
        title: "Requirements come from too many sources",
        body: "Fintech PRDs pull from customer complaints, RBI/SEBI circulars, audit findings, internal risk reviews, and engineer escalations — all at once. Keeping track of which requirement came from which source is painful and error-prone. PMRead tracks source provenance automatically.",
      },
      {
        title: "Compliance context gets lost in handoffs",
        body: "When a regulator flags an issue, the PM writes a requirement. By the time it reaches the engineer, the 'why' is gone. PMRead embeds the source quote — whether from a circular, a complaint ticket, or a review — into every requirement it generates.",
      },
      {
        title: "Vague specs cause expensive rework in regulated products",
        body: "In fintech, a spec that's 80% complete costs more than no spec — engineers build on assumptions that fail compliance review. PMRead's PRDs include edge cases, error states, and acceptance criteria as standard sections.",
      },
    ],
    howItHelps: [
      {
        title: "Ingest complaints, audits, and feedback in one place",
        body: "Upload RBI circulars as PDFs, export customer complaints as CSV/text, paste audit findings — PMRead extracts structured insights tagged by type (pain point, compliance requirement, feature request) and deduplicates by frequency.",
      },
      {
        title: "PRDs that cite their sources",
        body: "Every requirement in the generated PRD links back to the specific customer complaint or regulatory clause that drove it. Reviewers can verify traceability without asking the PM to reconstruct context from memory.",
      },
      {
        title: "Engineering tasks include compliance edge cases",
        body: "PMRead's PRD template includes edge cases and failure modes as a dedicated section. For fintech features like KYC flows, payment limits, or transaction flags, this section catches the compliance edge cases engineers otherwise discover in QA.",
      },
    ],
    quote: {
      text: "We upload RBI circular PDFs and customer complaint exports together. PMRead tells us which complaints are actually a regulatory gap versus a UX problem. That distinction alone saves us two planning meetings.",
      author: "Arjun M.",
      role: "Senior PM, Digital Lending, Mumbai",
    },
    faqs: [
      {
        q: "Can PMRead handle regulatory documents like RBI circulars?",
        a: "Yes. Upload the circular as a PDF — PMRead extracts the relevant requirements as structured insights. You can then generate a PRD that traces each requirement back to the specific clause.",
      },
      {
        q: "Is customer complaint data secure?",
        a: "PMRead stores extracted text (not raw files) in an encrypted database. Files are processed and discarded; we do not train on your data. See our privacy policy for details.",
      },
      {
        q: "Does PMRead work for payments, lending, and insurance products?",
        a: "Yes. PMRead is domain-agnostic — it works on whatever text you upload. Payments PMs have uploaded Stripe webhook docs; lending PMs upload credit policy changes; insurance PMs upload claims process audits.",
      },
      {
        q: "Can I upload audio from customer calls?",
        a: "Yes. Upload audio or video files and PMRead will transcribe and extract insights. Useful for escalated customer calls or recorded compliance reviews.",
      },
    ],
  },

  {
    slug: "b2b-saas",
    segment: "B2B SaaS",
    headline: "PRD generation for B2B SaaS PMs drowning in enterprise feedback",
    subheadline:
      "Turn Slack threads, sales call recordings, and support tickets into structured PRDs — without losing the enterprise context that makes them shippable.",
    metaDescription:
      "PMRead helps B2B SaaS product managers synthesise enterprise customer feedback into evidence-backed PRDs. Ingest Slack, GitHub, transcripts. Try free.",
    heroStat: { value: "15 PRDs/mo", label: "on Pro — enough for a full sprint cycle" },
    painPoints: [
      {
        title: "Enterprise feedback is fragmented across 6 channels",
        body: "Sales call notes in Notion, support tickets in Zendesk, Slack threads from CSMs, GitHub issues from enterprise engineers, QBR decks as PDFs, and the PM's own interview notes. Synthesising this into a coherent PRD takes hours. PMRead ingests all of it.",
      },
      {
        title: "'Customer X wants Y' doesn't tell you how many customers",
        body: "B2B PMs routinely over-index on the loudest enterprise customer. PMRead tracks frequency across sources — if SSO is mentioned in 8 of your last 20 customer calls, that surfaces as a top insight, not just a one-off request.",
      },
      {
        title: "Stakeholders want to see the evidence",
        body: "In B2B SaaS, engineering leads push back on requirements without evidence. PMRead's PRDs cite source quotes inline — 'Enterprise teams need SSO before adopting (mentioned by Acme, BankCo, HealthCo in calls on 3/12, 3/18, 4/2)'. That context survives stakeholder review.",
      },
    ],
    howItHelps: [
      {
        title: "Ingest Slack + GitHub for the full enterprise signal",
        body: "Connect your Slack workspace (Pro) to ingest CSM channels and enterprise support threads. Connect your GitHub repo (Pro) to give the PRD generator codebase context — so engineering tasks reference real file paths, not generic placeholders.",
      },
      {
        title: "Frequency-ranked insights for roadmap prioritisation",
        body: "PMRead surfaces the most-mentioned requests across all sources. For B2B SaaS, this is your proxy for ARR impact — the more enterprise accounts that mentioned a problem, the more revenue is gated on solving it.",
      },
      {
        title: "PRDs with enterprise-ready acceptance criteria",
        body: "B2B features need edge cases: multi-tenant isolation, admin vs member permissions, SSO edge cases, audit log requirements. PMRead's PRD template includes edge cases and failure modes as standard — not something PMs have to add manually.",
      },
    ],
    quote: {
      text: "We used to spend a full day synthesising feedback before a sprint planning. Now we upload everything to PMRead, run a PRD in 10 minutes, and spend the rest of the time reviewing it with engineering instead of writing it.",
      author: "Meera S.",
      role: "Product Lead, B2B SaaS Platform, Pune",
    },
    faqs: [
      {
        q: "Can PMRead pull from Slack channels directly?",
        a: "Yes — on the Pro plan. Connect your Slack workspace and select channels to ingest. PMRead extracts customer feedback, feature requests, and bug reports from the message history.",
      },
      {
        q: "Does GitHub integration help with B2B features?",
        a: "Significantly. When PMRead has codebase context, the engineering tasks in the PRD reference actual modules, APIs, and data models — not generic 'update the backend' tasks. Reduces planning back-and-forth.",
      },
      {
        q: "How do I handle NDA-protected customer feedback?",
        a: "PMRead does not store raw files — only extracted text is kept. Customer names are not required; you can anonymise transcripts before upload. Review our privacy policy and DPA for enterprise requirements.",
      },
      {
        q: "Can multiple PMs on a team use PMRead?",
        a: "Yes. The Team plan (₹12,499/mo or $149/mo) gives 60 shared PRDs/month across your PM team with shared projects and insights.",
      },
    ],
  },

  {
    slug: "consumer-apps",
    segment: "Consumer Apps",
    headline: "Turn app store reviews and user interviews into PRDs — fast",
    subheadline:
      "Consumer PMs ship on short cycles. PMRead gets you from user feedback to a reviewable spec in the time it takes to have a standup.",
    metaDescription:
      "PMRead helps consumer app product managers turn app store reviews, user interviews, and NPS data into structured PRDs. Fast cycles, evidence-backed requirements.",
    heroStat: { value: "Under 15 min", label: "from raw feedback to reviewable PRD draft" },
    painPoints: [
      {
        title: "Consumer feedback is high volume, low structure",
        body: "App store reviews, NPS verbatims, in-app feedback widgets, UserTesting recordings, Play Store/App Store reviews — consumer PMs deal with hundreds of data points per sprint. Manually synthesising them is either skipped entirely or becomes a PM's entire Monday.",
      },
      {
        title: "Short cycles leave no time for proper PRD writing",
        body: "2-week sprints with 3-day sprint planning windows leave almost no time to write a thoughtful spec. Most consumer app PRDs are written in 30 minutes and lack edge cases, analytics events, and success metrics. PMRead generates those sections automatically.",
      },
      {
        title: "Feature decisions aren't grounded in data",
        body: "Without structured insight extraction, consumer PMs make roadmap decisions based on the most recent user complaint or the CEO's app store review. PMRead surfaces frequency data — 'crash on checkout mentioned in 47 reviews this month' — making prioritisation defensible.",
      },
    ],
    howItHelps: [
      {
        title: "Bulk-upload app store reviews and NPS data",
        body: "Export Play Store or App Store reviews as CSV/text, export NPS verbatims, upload UserTesting transcripts — all in one project. PMRead deduplicates and frequency-ranks across all sources so you see what actually matters, not what's loudest.",
      },
      {
        title: "PRDs with analytics events as a standard section",
        body: "Consumer app PRDs need analytics events defined up front — otherwise the PM can't measure feature success post-launch. PMRead generates an analytics events section (what to track, event names, properties) as a standard output, not an afterthought.",
      },
      {
        title: "Fast iteration without losing quality",
        body: "Generate a PRD draft in 10 minutes, review with design and engineering in a 30-minute kickoff, ship. PMRead's output is markdown — paste directly into Notion, Linear, or Confluence. No reformatting needed.",
      },
    ],
    quote: {
      text: "Our app store reviews were just vibes until we started using PMRead. Now I upload 200 reviews before every planning cycle and I get ranked pain points with actual quotes. The roadmap arguments stopped.",
      author: "Rahul T.",
      role: "PM, Consumer App, Delhi",
    },
    faqs: [
      {
        q: "Can I upload app store reviews directly?",
        a: "Yes. Export Play Store or App Store reviews as CSV or text and upload to PMRead. It extracts pain points, feature requests, and bug reports — ranked by how often they appear.",
      },
      {
        q: "Does PMRead work for mobile apps vs web apps?",
        a: "PMRead is platform-agnostic. The PRD output includes mobile-specific sections if your feedback and questions are about a mobile product — otherwise the output is the same.",
      },
      {
        q: "What if I have NPS survey data?",
        a: "Export the verbatim responses as a text or CSV file and upload them as a source. PMRead treats NPS verbatims the same as interview transcripts — extracting structured insights from free-text responses.",
      },
      {
        q: "How many sources can I upload per project?",
        a: "Unlimited. Upload as many files as your project has — all insights are merged and deduplicated by frequency across sources. The more sources, the more reliable the frequency data.",
      },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
