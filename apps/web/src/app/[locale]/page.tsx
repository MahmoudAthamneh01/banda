"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Lock,
  Zap,
} from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";
import { use } from "react";

export default function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  const pillars = [
    {
      name: "Square",
      icon: ShoppingBag,
      desc: "Discover products from verified makers worldwide",
      href: `/${locale}/square`,
      color: "from-panda-500 to-sky-500",
    },
    {
      name: "Cockpit",
      icon: Briefcase,
      desc: "Manage your manufacturing and sales operations",
      href: `/${locale}/cockpit`,
      color: "from-panda-700 to-panda-500",
    },
    {
      name: "Playground",
      icon: TrendingUp,
      desc: "Invest in batches and opportunities",
      href: `/${locale}/playground`,
      color: "from-jade-500 to-jade-600",
    },
    {
      name: "Social",
      icon: Users,
      desc: "Community feed, videos, and maker connections",
      href: `/${locale}/feed`,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Vault",
      icon: Lock,
      desc: "Secure wallet and financial management",
      href: `/${locale}/vault`,
      color: "from-panda-700 to-sky-500",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Escrow Protection",
      desc: "Every transaction secured by smart escrow",
    },
    {
      icon: CheckCircle,
      title: "Verified Makers",
      desc: "KYC-verified manufacturers you can trust",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      desc: "Fast payouts in your preferred currency",
    },
  ];

  return (
    <PublicShell locale={locale}>
      <div className="ambient-bg">
        {/* Hero */}
        <section className="py-20 lg:py-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-slate-200 mb-6">
                The Sovereign
                <span className="block text-gradient-primary">Digital Marketplace</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Connect directly with makers, invest in production batches, and transact in a closed-loop digital ecosystem. No intermediaries. No hidden fees. Full transparency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/${locale}/auth/register`} className="btn-primary text-lg">
                  Create Account
                </Link>
                <Link href={`/${locale}/square`} className="btn-ghost text-lg">
                  Explore Marketplace
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5 Pillars */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                Five Pillars of BandaChao
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                A complete digital nation with distinct roles and functions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={pillar.href} className="block group">
                      <div className="glass-card p-6 hover:bg-surface-strong transition-all h-full">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">
                          {pillar.name}
                        </h3>
                        <p className="text-slate-300 text-sm mb-4">{pillar.desc}</p>
                        <span className="text-panda-400 text-sm font-medium flex items-center gap-2">
                          Enter <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 px-4 bg-ink-950/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                How It Works
              </h2>
              <p className="text-slate-300">Simple. Secure. Sovereign.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  desc: "Create your account in 60 seconds. Choose your role: Buyer, Maker, or Investor.",
                },
                {
                  step: "2",
                  title: "Explore",
                  desc: "Browse verified products, respond to RFQs, or invest in production batches.",
                },
                {
                  step: "3",
                  title: "Transact",
                  desc: "Buy, sell, or invest with escrow protection. Fast settlements in your currency.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-panda-500 to-panda-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Compliance */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                Built on Trust
              </h2>
              <p className="text-slate-300">
                Security, compliance, and transparency at every step
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 text-center"
                  >
                    <div className="w-14 h-14 bg-panda-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-panda-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 px-4 bg-ink-950/50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "2,500+", label: "Active Makers" },
                { value: "12,000+", label: "Products Listed" },
                { value: "$4.2M", label: "Monthly Volume" },
                { value: "15K+", label: "Happy Buyers" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-12 w-12 text-silk-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                Start in 60 Seconds
              </h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of makers and buyers in the sovereign digital marketplace
              </p>
              <Link href={`/${locale}/auth/register`} className="btn-primary text-lg">
                Create Your Account
              </Link>
            </motion.div>
          </div>
        </section>

        {/* AI Assistant */}
        <AskPanda context="landing" />
      </div>
    </PublicShell>
  );
}
