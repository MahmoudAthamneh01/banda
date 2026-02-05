"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import './globals.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <AlertTriangle className="h-20 w-20 text-danger-500 mx-auto mb-6" />
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-4">
          Something Went Wrong
        </h1>
        
        <p className="text-slate-300 text-lg mb-8">
          We encountered an unexpected error. Our team has been notified and is
          working on a fix.
        </p>

        {error.digest && (
          <div className="glass-card p-4 mb-8">
            <p className="text-slate-400 text-sm">
              Error ID: <code className="text-panda-400">{error.digest}</code>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <Link href="/en" className="btn-ghost">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          <Link href="/en/status" className="btn-ghost">
            Check Status
          </Link>
        </div>

        <div className="glass-card p-6 mt-12">
          <Mail className="h-8 w-8 text-panda-400 mx-auto mb-3" />
          <p className="text-slate-300 text-sm mb-3">
            Need immediate help? Contact our support team.
          </p>
          <a
            href="mailto:support@bandachao.com"
            className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
          >
            support@bandachao.com
          </a>
        </div>
      </div>
    </div>
  );
}
