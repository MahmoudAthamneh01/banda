"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, ExternalLink } from "lucide-react";
import { localePath, normalizeLocale, supportedUiLocales, uiCopy } from "@/i18n/ui-copy";

interface PublicShellProps {
  children: React.ReactNode;
  locale: string;
}

export function PublicShell({ children, locale }: PublicShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const pathname = usePathname();
  const localeCode = normalizeLocale(locale);
  const copy = uiCopy[localeCode];
  const translatedLanguages = supportedUiLocales.map((code) => ({
    code,
    name: copy.languageNames[code],
  }));

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
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href={`/${locale}/about`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {copy.shell.about}
              </Link>
              <Link
                href={`/${locale}/faq`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {copy.shell.faq}
              </Link>
              <Link
                href={`/${locale}/status`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {copy.shell.status}
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
                      {translatedLanguages.map((lang) => (
                        <Link
                          key={lang.code}
                          href={localePath(pathname, lang.code)}
                          className={`block px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            localeCode === lang.code
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
                href={`/${locale}/auth/login`}
                className="hidden sm:inline-flex text-slate-300 hover:text-white transition-colors"
              >
                {copy.shell.signIn}
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="btn-primary"
              >
                {copy.shell.getStarted}
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
                  {copy.shell.about}
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {copy.shell.faq}
                </Link>
                <Link
                  href={`/${locale}/status`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {copy.shell.status}
                </Link>
                <Link
                  href={`/${locale}/auth/login`}
                  className="block px-3 py-2 text-slate-300 hover:bg-ink-800 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {copy.shell.signIn}
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
                {copy.shell.footerDescription}
              </p>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">{copy.shell.legal}</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/legal/privacy`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/legal/terms`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/legal/returns`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.returns}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">{copy.shell.company}</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/faq`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.faq}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/status`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.systemStatus}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-slate-200 font-semibold mb-4">{copy.shell.start}</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/square`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.exploreMarketplace}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/cockpit`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.becomeMaker}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/auth/register`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {copy.shell.createAccount}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} BandaChao. {copy.shell.rights}
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
