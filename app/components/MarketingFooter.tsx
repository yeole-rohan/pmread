import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Free Tools", href: "/tools" },
    { label: "Interview Prep", href: "/tools/interview-prep" },
    { label: "Templates", href: "/templates" },
    { label: "Integrations", href: "/integrations" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Glossary", href: "/glossary" },
    { label: "Compare", href: "/compare" },
    { label: "Use Cases", href: "/use-cases" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function MarketingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-bold text-gray-900">
                PM<span className="text-[#7F77DD]">Read</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              AI-powered PRD generator built on real customer feedback.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              Built in India 🇮🇳
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {group}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} PMRead. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social placeholders */}
            <a
              href="https://twitter.com/pmreadapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="PMRead on X (Twitter)"
            >
              X / Twitter
            </a>
            <a
              href="https://linkedin.com/company/pmread"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="PMRead on LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="mailto:rohan.yeole@rohanyeole.com"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
