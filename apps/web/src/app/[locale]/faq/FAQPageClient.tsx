"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";

interface FAQPageClientProps {
  locale: string;
}

export function FAQPageClient({ locale }: FAQPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All" },
    { id: "accounts", name: "Accounts" },
    { id: "orders", name: "Orders & Payments" },
    { id: "wallet", name: "Wallet" },
    { id: "makers", name: "Makers" },
    { id: "investors", name: "Investors" },
    { id: "safety", name: "Safety & Disputes" },
  ];

  const faqs = [
    {
      id: "create-account",
      category: "accounts",
      question: "How do I create an account?",
      answer:
        "Click 'Get Started' in the header, enter your email and password, verify your email, and complete your profile. KYC verification is required for certain features like making purchases or listing products.",
    },
    {
      id: "kyc",
      category: "accounts",
      question: "What is KYC and why do I need it?",
      answer:
        "KYC (Know Your Customer) is identity verification required by law for financial transactions. We verify your identity using government ID and proof of address. This protects everyone from fraud and ensures a safe marketplace.",
    },
    {
      id: "track-order",
      category: "orders",
      question: "How do I track my order?",
      answer:
        "Go to Orders in your account menu, select the order, and view the tracking number and status. You'll receive notifications at each stage: Paid, Shipped, In Transit, and Delivered.",
    },
    {
      id: "payment-methods",
      category: "orders",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, bank transfers, and BandaChao Wallet. All payments are processed through secure escrow to protect both buyers and sellers.",
    },
    {
      id: "escrow",
      category: "orders",
      question: "How does escrow work?",
      answer:
        "When you place an order, funds are held in escrow (not released to seller yet). Seller ships the product. You confirm receipt and satisfaction. Funds are then released to the seller. If there's an issue, you can open a dispute before confirming.",
    },
    {
      id: "wallet-deposit",
      category: "wallet",
      question: "How do I add funds to my wallet?",
      answer:
        "Go to Wallet → Deposit, choose your payment method, enter the amount, and complete the transaction. Funds usually appear within 5-10 minutes for card payments, 1-2 business days for bank transfers.",
    },
    {
      id: "wallet-withdraw",
      category: "wallet",
      question: "How do I withdraw funds?",
      answer:
        "Go to Wallet → Withdraw, enter the amount, select your bank account, and confirm. Withdrawals are processed within 3-5 business days. There may be a small fee depending on your region.",
    },
    {
      id: "become-maker",
      category: "makers",
      question: "How do I become a maker?",
      answer:
        "Complete your KYC verification, go to Cockpit, and click 'Start Selling'. You'll need to provide business registration documents and complete maker onboarding. Once approved, you can list products and respond to RFQs.",
    },
    {
      id: "listing-fees",
      category: "makers",
      question: "What fees do makers pay?",
      answer:
        "Listing products is free. We charge a commission only when you make a sale: 5-8% depending on category and volume. Payment processing fees (2-3%) also apply. No hidden fees.",
    },
    {
      id: "rfq-respond",
      category: "makers",
      question: "How do I respond to an RFQ?",
      answer:
        "Go to Cockpit → RFQ, browse active requests, and click 'Submit Quote'. Provide pricing, timeline, MOQ, and any relevant details. Buyers will review all quotes and select the best match.",
    },
    {
      id: "invest-batch",
      category: "investors",
      question: "How do I invest in a production batch?",
      answer:
        "Go to Playground, browse available opportunities, review the maker's profile and batch details, and click 'Invest'. Minimum investment varies by batch. Returns are paid after the batch is produced and sold.",
    },
    {
      id: "investor-returns",
      category: "investors",
      question: "What returns can I expect?",
      answer:
        "Returns vary by batch and maker. Typical range is 8-15% over 3-6 months. Higher-risk batches may offer higher returns. All investments carry risk—never invest more than you can afford to lose.",
    },
    {
      id: "open-dispute",
      category: "safety",
      question: "How do I open a dispute?",
      answer:
        "Go to Orders → Select order → Open Dispute. Provide details and evidence (photos, messages). Our team will review within 24-48 hours and mediate between you and the seller. Most disputes are resolved within 5-7 days.",
    },
    {
      id: "report-fraud",
      category: "safety",
      question: "What if I suspect fraud?",
      answer:
        "Report it immediately via the 'Report' button on the product/seller page or contact support@bandachao.com. Do not complete the transaction. We take fraud seriously and will investigate all claims.",
    },
    {
      id: "data-security",
      category: "safety",
      question: "Is my data secure?",
      answer:
        "Yes. We use end-to-end encryption, secure servers, and regular security audits. We never sell your data. See our Privacy Policy for details on how we protect and use your information.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicShell locale={locale}>
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <HelpCircle className="h-12 w-12 text-panda-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Find answers to common questions. Still need help? Ask Panda or contact
              support.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="input pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-panda-500 text-white"
                    : "glass-card text-slate-300 hover:bg-surface-strong"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="text-slate-200 font-medium pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                        openFAQ === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-slate-300 text-sm leading-relaxed border-t border-border pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <Search className="empty-state-icon" />
                <h3 className="empty-state-title">No FAQs found</h3>
                <p className="empty-state-description">
                  Try different keywords or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="btn-ghost"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Still Need Help */}
          <div className="glass-card p-8 mt-12 text-center">
            <MessageCircle className="h-10 w-10 text-panda-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              Still Need Help?
            </h3>
            <p className="text-slate-300 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="btn-primary">Contact Support</button>
              <button className="btn-ghost">Ask Panda</button>
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <AskPanda context="faq" />
      </div>
    </PublicShell>
  );
}
