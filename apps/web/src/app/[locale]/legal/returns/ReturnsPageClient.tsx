"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";

interface ReturnsPageClientProps {
  locale: string;
}

export function ReturnsPageClient({ locale }: ReturnsPageClientProps) {
  const [showQualifier, setShowQualifier] = useState(false);

  const sections = [
    {
      id: "overview",
      title: "1. Policy Overview",
      content: `We want you to be satisfied with your purchase. If you're not happy, we offer returns and refunds subject to the conditions outlined below.

Key Points:
• 14-day return window for most items
• Items must be unused and in original packaging
• Buyer pays return shipping unless item is defective
• Refunds processed within 5-7 business days after inspection`,
    },
    {
      id: "eligible",
      title: "2. Eligible Items",
      content: `Items eligible for return:

✓ Physical products purchased through BandaChao
✓ Items received damaged or defective
✓ Items significantly different from description
✓ Wrong item shipped

Not eligible for return:

✗ Custom or made-to-order items
✗ Digital products or services
✗ Items marked as "Final Sale"
✗ Perishable goods
✗ Items damaged due to misuse`,
    },
    {
      id: "timeline",
      title: "3. Return Timeline",
      content: `Standard Returns:
• Request return within 14 days of delivery
• Ship item back within 7 days of approval
• Allow 5-7 days for inspection
• Refund processed within 5-7 business days

Defective/Damaged Items:
• Report within 48 hours of delivery
• Provide photos of damage
• Free return shipping label provided
• Faster processing (3-5 business days)`,
    },
    {
      id: "process",
      title: "4. Return Process",
      content: `Step 1: Request Return
• Go to Orders → Select order → Request Return
• Select reason and provide details
• Upload photos if applicable

Step 2: Await Approval
• Seller reviews request (24-48 hours)
• Return approved or additional info requested

Step 3: Ship Item
• Pack item securely in original packaging
• Use provided return label (if applicable)
• Ship within 7 days of approval

Step 4: Inspection
• Seller inspects returned item
• Confirms condition matches return reason

Step 5: Refund
• Refund issued to original payment method
• Allow 5-7 business days for processing`,
    },
    {
      id: "exceptions",
      title: "5. Exceptions",
      content: `Custom/Made-to-Order:
• No returns unless defective
• Maker may offer partial refund at discretion

Bulk Orders:
• Special return terms may apply
• Contact seller before purchasing

International Orders:
• Buyer responsible for return shipping costs
• Import duties are non-refundable
• Extended processing time (10-14 days)`,
    },
    {
      id: "refunds",
      title: "6. Refund Processing",
      content: `Full Refunds:
• Item defective or not as described
• Seller error (wrong item shipped)
• Item damaged in transit

Partial Refunds:
• Item returned without original packaging
• Item shows signs of use
• Missing accessories or parts

No Refund:
• Item damaged due to buyer misuse
• Return not approved by seller
• Item not returned within timeline

Refund Methods:
• Original payment method (default)
• BandaChao Wallet credit (faster)
• Bank transfer (special cases)`,
    },
    {
      id: "disputes",
      title: "7. Return Disputes",
      content: `If seller denies your return request:

1. Review denial reason carefully
2. Provide additional evidence if requested
3. Open formal dispute through platform
4. Our team will review and mediate
5. Decision made within 5-7 business days

Dispute outcomes:
• Return approved with conditions
• Partial refund offered
• Return denied with explanation
• Escalate to arbitration (rare cases)`,
    },
    {
      id: "contact",
      title: "8. Need Help?",
      content: `For return-related questions:

Email: returns@bandachao.com
Support: Open ticket in your account
AI Assistant: Use "Ask Panda" for quick guidance

Response time: 24-48 hours`,
    },
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
                Return & Refund Policy
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2026
              </span>
            </div>

            {/* Qualifier Tool */}
            <button
              onClick={() => setShowQualifier(!showQualifier)}
              className="btn-ghost flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              {showQualifier ? "Hide Qualifier" : "Do I Qualify for Return?"}
            </button>

            {showQualifier && (
              <div className="glass-card p-6 mt-4 border-panda-500/30">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Return Qualification Check
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-medium">Order Age</p>
                      <p className="text-slate-300 text-sm">
                        Within 14 days of delivery
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-medium">Item Condition</p>
                      <p className="text-slate-300 text-sm">
                        Unused with original packaging
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-danger-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-medium">Not Eligible</p>
                      <p className="text-slate-300 text-sm">
                        Custom items, Final Sale, Perishables
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-4">
                  For detailed eligibility, see sections below or contact support.
                </p>
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="glass-card p-6 mb-8 bg-panda-500/5 border-panda-500/20">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Quick Return Guide
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-panda-400 mb-1">14</div>
                <div className="text-slate-300 text-sm">Days to request</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-panda-400 mb-1">7</div>
                <div className="text-slate-300 text-sm">Days to ship back</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-panda-400 mb-1">5-7</div>
                <div className="text-slate-300 text-sm">Days inspection</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-panda-400 mb-1">5-7</div>
                <div className="text-slate-300 text-sm">Days refund</div>
              </div>
            </div>
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
                href={`/${locale}/legal/privacy`}
                className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
              >
                Privacy Policy →
              </Link>
              <Link
                href={`/${locale}/legal/terms`}
                className="text-sky-500 hover:text-sky-400 text-sm transition-colors"
              >
                Terms of Service →
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
