"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Search } from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";

interface TermsPageClientProps {
  locale: string;
}

export function TermsPageClient({ locale }: TermsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: `These Terms of Service ("Terms") govern your access to and use of BandaChao ("Platform", "we", "us", or "our"). By accessing or using our Platform, you agree to be bound by these Terms.`,
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      content: `To use BandaChao, you must:

• Be at least 18 years old
• Have legal capacity to enter into contracts
• Not be prohibited from using the Platform under applicable laws
• Complete KYC verification for certain features

Businesses must be legally registered and authorized to operate.`,
    },
    {
      id: "accounts",
      title: "3. Accounts & Conduct",
      content: `Account Registration:
• You must provide accurate and complete information
• You are responsible for maintaining account security
• You must not share your account credentials
• You must notify us immediately of any unauthorized access

Prohibited Activities:
• Fraud, misrepresentation, or deceptive practices
• Violating laws or regulations
• Infringing intellectual property rights
• Manipulating prices or reviews
• Using the Platform for illegal transactions`,
    },
    {
      id: "payments",
      title: "4. Payments & Fees",
      content: `Pricing:
• All prices are listed in the specified currency
• Prices may change without notice
• You are responsible for all applicable taxes

Fees:
• Transaction fees apply to sales and purchases
• Payment processing fees may apply
• Fee structure is available in your account settings

Payments:
• Payments are processed through our secure payment system
• Escrow protects both buyers and sellers
• Refunds are subject to our Return & Refund Policy`,
    },
    {
      id: "transactions",
      title: "5. Transactions & Escrow",
      content: `All transactions on BandaChao are protected by escrow:

• Buyer pays into escrow upon order
• Seller ships product and provides tracking
• Buyer confirms receipt and satisfaction
• Funds released to seller upon confirmation
• Disputes handled through our resolution process

Transactions are final once escrow is released, subject to our dispute policy.`,
    },
    {
      id: "disputes",
      title: "6. Disputes & Arbitration",
      content: `Dispute Resolution Process:
1. Contact the other party directly
2. Open a formal dispute in your account
3. Provide evidence (photos, messages, tracking)
4. Our team reviews and mediates
5. Decision is made within 7-14 business days

Arbitration:
• Disputes that cannot be resolved through mediation may go to arbitration
• Arbitration is binding and final
• You waive the right to class action lawsuits

Jurisdiction: [Your jurisdiction] governs these Terms.`,
    },
    {
      id: "liability",
      title: "7. Liability & Warranty",
      content: `Platform Warranty:
• We provide the Platform "as is" without warranties
• We do not guarantee uninterrupted or error-free service
• We are not liable for user-generated content

User Liability:
• Users are liable for their own actions and listings
• Makers are responsible for product quality and accuracy
• Buyers are responsible for reading product descriptions

Limitation of Liability:
• Our total liability is limited to fees paid in the last 12 months
• We are not liable for indirect or consequential damages
• Some jurisdictions do not allow liability limitations`,
    },
    {
      id: "termination",
      title: "8. Termination",
      content: `We may suspend or terminate your account if:

• You violate these Terms
• You engage in fraudulent activity
• Required by law
• You request account deletion

Upon termination:
• Your access to the Platform will cease
• Outstanding transactions will be completed or refunded
• Your data will be handled per our Privacy Policy`,
    },
    {
      id: "changes",
      title: "9. Changes to Terms",
      content: `We may update these Terms at any time. We will notify you of material changes via:

• Email notification
• Platform announcement
• Updated "Last Modified" date

Continued use after changes constitutes acceptance of the new Terms.`,
    },
    {
      id: "contact",
      title: "10. Contact Us",
      content: `For questions about these Terms:

Email: legal@bandachao.com
Address: [Your business address]

We will respond within 5-7 business days.`,
    },
  ];

  const filteredSections = searchQuery
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  return (
    <PublicShell locale={locale}>
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-10 w-10 text-panda-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-slate-200">
                Terms of Service
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2026
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find clause..."
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
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
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    {section.title}
                  </h2>
                  <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </section>
              ))
            ) : (
              <div className="empty-state">
                <Search className="empty-state-icon" />
                <h3 className="empty-state-title">No results found</h3>
                <p className="empty-state-description">
                  Try different keywords or browse all sections
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn-ghost"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Related Links */}
          <div className="glass-card p-6 mt-12">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Related Policies
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/legal/privacy`}
                className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
              >
                Privacy Policy →
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
