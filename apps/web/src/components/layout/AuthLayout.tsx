import Link from "next/link";
import { Globe } from "lucide-react";
import { useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "zh", name: "中文" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-panda-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/en" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-panda-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
            <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
              BandaChao
            </span>
          </Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">EN</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-ink-800 border border-white/10 rounded-lg shadow-lg overflow-hidden">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}`}
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
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

      {/* Main Content */}
      <main className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
            <Link href="/en/legal/privacy" className="hover:text-slate-200 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/en/legal/terms" className="hover:text-slate-200 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/en/faq" className="hover:text-slate-200 transition-colors">
              Help
            </Link>
            <span>•</span>
            <Link href="/en/status" className="hover:text-slate-200 transition-colors">
              Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
