"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { localePath, normalizeLocale, supportedUiLocales, uiCopy } from "@/i18n/ui-copy";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const locale = normalizeLocale(typeof params.locale === "string" ? params.locale : "en");
  const copy = uiCopy[locale];
  const languages = supportedUiLocales.map((code) => ({
    code,
    name: copy.languageNames[code],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-panda-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-panda-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
            <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
              BandaChao
            </span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm uppercase">{locale}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute end-0 top-full mt-2 w-40 bg-ink-800 border border-white/10 rounded-lg shadow-lg overflow-hidden">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href={localePath(pathname, lang.code)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      locale === lang.code
                        ? "bg-panda-500/20 text-panda-300"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setLangMenuOpen(false)}
                  >
                    {lang.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-12">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
            <Link href={`/${locale}/legal/privacy`} className="hover:text-slate-200 transition-colors">
              {copy.shell.privacy}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/legal/terms`} className="hover:text-slate-200 transition-colors">
              {copy.shell.terms}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/faq`} className="hover:text-slate-200 transition-colors">
              {copy.shell.help}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/status`} className="hover:text-slate-200 transition-colors">
              {copy.shell.status}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
