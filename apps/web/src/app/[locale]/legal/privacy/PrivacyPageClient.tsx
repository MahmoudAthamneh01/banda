"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";

interface PrivacyPageClientProps {
  locale: string;
}

export function PrivacyPageClient({ locale }: PrivacyPageClientProps) {
  const [showSummary, setShowSummary] = useState(false);

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: `BandaChao ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.`,
    },
    {
      id: "data-collected",
      title: "2. Information We Collect",
      content: `We collect information that you provide directly to us, including:
      
• Account Information: Name, email, phone number, business details
• Identity Verification: Government ID, business registration (for KYC)
• Payment Information: Bank details, transaction history
• Usage Data: Browsing activity, feature usage, device information
• Communications: Messages, support tickets, feedback`,
    },
    {
      id: "why-collected",
      title: "3. Why We Collect Data",
      content: `We use your information to:

• Provide and improve our services
• Verify your identity (KYC/AML compliance)
• Process transactions and payments
• Communicate with you about your account
• Detect and prevent fraud
• Comply with legal obligations`,
    },
    {
      id: "storage",
      title: "4. Data Storage & Security",
      content: `Your data is stored securely using industry-standard encryption. We implement:

• End-to-end encryption for sensitive data
• Regular security audits
• Access controls and authentication
• Secure data centers with redundancy
• Regular backups

We retain your data for as long as your account is active or as required by law.`,
    },
    {
      id: "sharing",
      title: "5. Information Sharing",
      content: `We do not sell your personal information. We may share data with:

• Service Providers: Payment processors, KYC providers, hosting services
• Legal Authorities: When required by law or to protect rights
• Business Transfers: In case of merger or acquisition
• With Your Consent: When you explicitly authorize sharing`,
    },
    {
      id: "user-rights",
      title: "6. Your Rights",
      content: `You have the right to:

• Access your personal data
• Correct inaccurate information
• Delete your account and data
• Export your data
• Opt-out of marketing communications
• Object to data processing

To exercise these rights, contact us at privacy@bandachao.com`,
    },
    {
      id: "cookies",
      title: "7. Cookies & Tracking",
      content: `We use cookies and similar technologies for:

• Essential functionality
• Analytics and performance monitoring
• Personalization
• Security

You can control cookies through your browser settings.`,
    },
    {
      id: "contact",
      title: "8. Contact Us",
      content: `For privacy questions or concerns:

Email: privacy@bandachao.com
Address: [Your business address]

We will respond within 30 days.`,
    },
  ];

  const summary = [
    "We collect account, verification, and usage data to provide our services",
    "Your data is encrypted and stored securely in compliant data centers",
    "We do not sell your personal information to third parties",
    "You can access, correct, or delete your data at any time",
    "We comply with international data protection regulations",
  ];

  return (
    <PublicShell locale={locale}>
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-10 w-10 text-panda-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-slate-200">
                Privacy Policy
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2026
              </span>
            </div>
            
            {/* Summarize Button */}
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="btn-ghost flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {showSummary ? "Hide Summary" : "Summarize This Page"}
            </button>

            {/* Summary */}
            {showSummary && (
              <div className="glass-card p-6 mt-4 border-panda-500/30">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  AI Summary
                </h3>
                <ul className="space-y-2">
                  {summary.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-panda-400 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-400 text-xs mt-4">
                  ⚠️ This is an AI-generated summary. Please read the full policy for complete details.
                </p>
              </div>
            )}
          </div>

          {/* Table of Contents */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                  {section.title}
                </h2>
                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Related Links */}
          <div className="glass-card p-6 mt-12">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Related Policies
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/legal/terms`}
                className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
              >
                Terms of Service →
              </Link>
              <Link
                href={`/${locale}/legal/returns`}
                className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
              >
                Return & Refund Policy →
              </Link>
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <AskPanda context="legal" />
      </div>
    </PublicShell>
  );
}
