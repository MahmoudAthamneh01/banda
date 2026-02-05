"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, ExternalLink } from "lucide-react";

interface PublicShellProps {
  children: React.ReactNode;
  locale: string;
}

export function PublicShell({ children, locale }: PublicShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "zh", name: "中文" },
  ];

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ink-900/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-panda-400 to-panda-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-slate-200">BandaChao</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href={`/${locale}/about`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href={`/${locale}/faq`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href={`/${locale}/status`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Status
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm uppercase">{locale}</span>
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-ink-800 rounded-lg shadow-soft-lg border border-border-strong"
                    >
                      {languages.map((lang) => (
                        <Link
                          key={lang.code}
                          href={`/${lang.code}`}
                          className={`block px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            locale === lang.code
                              ? "bg-panda-500/20 text-panda-400"
                              : "text-slate-300 hover:bg-ink-700 hover:text-white"
                          }`}
                          onClick={() => setLangMenuOpen(false)}
                        >
                          {lang.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth CTAs */}
              <Link
                href={`/${locale}/auth/signin`}
                className="hidden sm:inline-flex text-slate-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="btn-primary"
              >
                Get Started
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-ink-850"
            >
              <nav className="px-4 py-4 space-y-2">
                <Link
                  href={`/${locale}/about`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href={`/${locale}/status`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Status
                </Link>
                <Link
                  href={`/${locale}/auth/signin`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Global Footer */}
      <footer className="bg-ink-950 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-panda-400 to-panda-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-lg font-bold text-slate-200">BandaChao</span>
              </div>
              <p className="text-slate-400 text-sm">
                A sovereign digital marketplace for makers, buyers, and investors.
              </p>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/legal/privacy`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/legal/terms`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/legal/returns`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Return & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/faq`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/status`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/square`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Explore Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/cockpit`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Become a Maker
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/auth/register`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} BandaChao. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://twitter.com/bandachao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
