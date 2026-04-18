export interface Integration {
  slug: string;
  name: string;
  tagline: string;
  headline: string;
  subheadline: string;
  metaDescription: string;
  plan: string; // e.g. "Pro+"
  heroStat: { value: string; label: string };
  howItWorks: { step: string; body: string }[];
  benefits: { title: string; body: string }[];
  setupSteps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const INTEGRATIONS: Integration[] = [
  {
    slug: "slack",
    name: "Slack",
    tagline: "Slack Integration",
    headline: "Turn Slack feedback into product insights — automatically",
    subheadline:
      "Connect a Slack channel and PMRead pulls customer messages, CSM threads, and support escalations directly into your insight dashboard. No copy-paste.",
    metaDescription:
      "PMRead's Slack integration ingests customer feedback channels and extracts structured product insights automatically. Available on Pro plan.",
    plan: "Pro",
    heroStat: {
      value: "Up to 1,000",
      label: "messages ingested per channel per run",
    },
    howItWorks: [
      {
        step: "1. Connect your Slack workspace",
        body: "Provide your Slack bot token (xoxb-...) from a Slack app with read permissions on the channels you want to ingest. No OAuth dance — paste the token directly in PMRead.",
      },
      {
        step: "2. Choose a channel and project",
        body: "Select which Slack channel to pull from (#customer-feedback, #support-escalations, #csm-channel) and which PMRead project to add the insights to.",
      },
      {
        step: "3. Insights extracted automatically",
        body: "PMRead pulls the last N messages (up to 1,000), runs AI extraction, and adds pain points, feature requests, and bug reports to your insight dashboard — deduplicated and frequency-ranked.",
      },
    ],
    benefits: [
      {
        title: "Stop losing signal in #customer-feedback",
        body: "Customer feedback posted in Slack is read once, reacted to, and forgotten. PMRead turns that stream into a structured insight board — so a comment from 3 months ago that 12 customers echoed gets surfaced when you're writing the PRD.",
      },
      {
        title: "CSM channel → roadmap input",
        body: "CSMs often know what's blocking enterprise accounts before PMs do. Ingest the CSM channel and PMRead extracts the product signals buried in status updates and escalation threads.",
      },
      {
        title: "Frequency-ranked across all sources",
        body: "Slack insights are merged with insights from uploaded transcripts, PDFs, and GitHub. If the same request appears in 3 Slack threads and 2 customer calls, PMRead surfaces it with a frequency count of 5 — not as 5 separate items.",
      },
    ],
    setupSteps: [
      {
        title: "Create a Slack app in your workspace",
        body: "Go to api.slack.com/apps → Create New App → From Scratch. Name it anything (e.g. 'PMRead Bot'). Add OAuth scope: channels:history, channels:read, groups:history, groups:read.",
      },
      {
        title: "Install the app and copy the bot token",
        body: "In your Slack app settings → Install App → Install to Workspace. Copy the Bot User OAuth Token (starts with xoxb-).",
      },
      {
        title: "Invite the bot to your channel",
        body: "In Slack, open the channel you want to ingest and type /invite @YourBotName. The bot needs to be a member to read messages.",
      },
      {
        title: "Paste the token in PMRead",
        body: "In your PMRead project, open the Ingest tab → Slack → paste your bot token, enter the channel name (without #), and click Ingest.",
      },
    ],
    faqs: [
      {
        q: "What permissions does the Slack bot need?",
        a: "channels:history and channels:read for public channels. groups:history and groups:read for private channels. No write permissions are needed — PMRead only reads.",
      },
      {
        q: "Does PMRead store my Slack messages?",
        a: "PMRead stores the extracted insight text, not the raw messages. The formatted message text used for extraction is discarded after processing. Review our privacy policy for details.",
      },
      {
        q: "How often can I re-ingest a channel?",
        a: "As often as you like. Each ingest pulls the latest N messages. If you run it weekly, you get a rolling feed of fresh customer signal in your insight dashboard.",
      },
      {
        q: "Can I ingest multiple channels into the same project?",
        a: "Yes. Run the Slack ingest flow multiple times with different channels — #customer-feedback, #support-escalations, #csm-updates — all into the same project. Insights are merged and deduplicated.",
      },
      {
        q: "Is Slack ingestion available on the free plan?",
        a: "No. Slack ingestion requires a Pro plan (₹2,499/mo or $29/mo). The free tier supports file uploads and insight extraction but not external source connections.",
      },
    ],
  },

  {
    slug: "github",
    name: "GitHub",
    tagline: "GitHub Integration",
    headline: "Connect your codebase — get PRDs with real engineering context",
    subheadline:
      "PMRead reads your GitHub repository and uses codebase structure, open issues, and recent PRs as context when generating PRDs. Engineering tasks reference actual files and APIs, not generic placeholders.",
    metaDescription:
      "PMRead's GitHub integration reads your repository to generate PRDs with real engineering context — file paths, APIs, and data models. Available on Pro plan.",
    plan: "Pro",
    heroStat: {
      value: "Zero generic tasks",
      label: "engineering tasks reference your actual codebase",
    },
    howItWorks: [
      {
        step: "1. Connect via GitHub OAuth",
        body: "Click 'Connect GitHub' in your PMRead project settings. You'll be redirected to GitHub to authorise read access on the repositories you select. No write access is requested.",
      },
      {
        step: "2. Select a repository",
        body: "Choose the repository that contains the product you're writing a PRD for. PMRead reads the repo structure, key files, open issues, and recent pull requests.",
      },
      {
        step: "3. Generate a PRD with codebase context",
        body: "When you click 'Generate PRD', the codebase summary is included as context. The resulting PRD has engineering tasks that reference real modules, data models, and API endpoints — not 'update the backend'.",
      },
    ],
    benefits: [
      {
        title: "Engineering tasks your team will actually use",
        body: "Without codebase context, PRD engineering tasks read like: 'Update the backend to support the new feature.' With GitHub connected, they read like: 'Add a billing_period field to the users table, update UserOut schema in schemas/user.py, and add a PATCH endpoint in routers/billing.py.' One is skippable. The other is a sprint ticket.",
      },
      {
        title: "Open issues as an insight source",
        body: "GitHub issues — especially those labelled 'bug' or 'customer-reported' — are a high-signal feedback source that most PMs never ingest. PMRead reads open issues and surfaces them alongside customer interview insights.",
      },
      {
        title: "Closes the gap between PM and engineering",
        body: "The most common sprint planning friction is PMs writing requirements that ignore existing architecture. With codebase context, PMRead catches constraints before the kickoff — reducing back-and-forth by giving engineers a spec that already speaks their language.",
      },
    ],
    setupSteps: [
      {
        title: "Open your PMRead project settings",
        body: "Navigate to any project → Settings → Integrations → GitHub.",
      },
      {
        title: "Authorise via GitHub OAuth",
        body: "Click 'Connect GitHub'. You'll be redirected to GitHub to approve read access. Select which repositories PMRead can access — you can limit it to just the relevant repo.",
      },
      {
        title: "Select a repository for this project",
        body: "Back in PMRead, choose the repository that maps to this product. PMRead will index the structure and recent activity.",
      },
      {
        title: "Generate a PRD — codebase context included automatically",
        body: "No extra steps. The next time you click 'Generate PRD', GitHub context is included automatically. You'll see engineering tasks reference actual files and APIs.",
      },
    ],
    faqs: [
      {
        q: "What data does PMRead read from GitHub?",
        a: "Repository file structure, key source files (to understand data models and APIs), open issues, and recent pull requests. PMRead does not read secrets, .env files, or files in .gitignore.",
      },
      {
        q: "Does PMRead get write access to my repository?",
        a: "No. PMRead requests read-only access (repo scope without write). It never creates issues, PRs, or commits.",
      },
      {
        q: "Does this work with private repositories?",
        a: "Yes. GitHub OAuth with the repo scope covers private repositories you own or have access to. You control which repositories PMRead can see during the OAuth flow.",
      },
      {
        q: "What languages and frameworks does PMRead understand?",
        a: "PMRead reads code as text, so it works with any language. It's most useful when your codebase has clear file names, models, and API routes — Python/FastAPI, TypeScript/Next.js, Ruby on Rails, Django, and similar structured codebases work well.",
      },
      {
        q: "Is GitHub integration available on the free plan?",
        a: "No. GitHub integration requires a Pro plan (₹2,499/mo or $29/mo).",
      },
    ],
  },
];

export function getIntegration(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug);
}
