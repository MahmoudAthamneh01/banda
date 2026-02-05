import Link from "next/link";
import { Search, Home, ShoppingBag, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-panda-500 via-sky-500 to-silk-500 bg-clip-text text-transparent mb-4">404</h1>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                Page Not Found
              </h2>
              <p className="text-slate-300 text-lg">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                Where would you like to go?
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  href="/en"
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group"
                >
                  <Home className="h-8 w-8 text-panda-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 text-sm font-medium">Home</span>
                </Link>
                <Link
                  href="/en/square"
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group"
                >
                  <ShoppingBag className="h-8 w-8 text-panda-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 text-sm font-medium">
                    Marketplace
                  </span>
                </Link>
                <Link
                  href="/en/faq"
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group"
                >
                  <HelpCircle className="h-8 w-8 text-panda-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 text-sm font-medium">Help</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/en" className="px-6 py-3 bg-panda-500 hover:bg-panda-600 text-white rounded-lg font-medium transition-colors inline-flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
              <Link href="/en/square" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors inline-flex items-center border border-white/10">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </div>
          </div>
        </div>
  );
}
