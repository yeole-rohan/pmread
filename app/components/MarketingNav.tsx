"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/** Shows "Open app →" if a PMRead token is in localStorage, else sign-in + sign-up CTAs. */
function NavCTA() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("pmread_token"));
  }, []);

  if (loggedIn) {
    return (
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Open app →
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Get started free →
      </Link>
    </>
  );
}

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xl font-bold text-gray-900">
            PM<span className="text-[#7F77DD]">Read</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href, soon }) =>
            soon ? (
              <span
                key={href}
                className="text-sm text-gray-300 font-medium cursor-default select-none"
                title="Coming soon"
              >
                {label}
              </span>
            ) : (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <NavCTA />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 -mr-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ label, href, soon }) =>
            soon ? (
              <span
                key={href}
                className="block text-sm text-gray-300 font-medium py-2 cursor-default"
              >
                {label} <span className="text-xs">(coming soon)</span>
              </span>
            ) : (
              <Link
                key={href}
                href={href}
                className="block text-sm text-gray-700 font-medium py-2 hover:text-[#7F77DD] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/login"
              className="text-sm text-gray-700 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2.5 bg-[#7F77DD] text-white text-sm font-semibold rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Get started free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
