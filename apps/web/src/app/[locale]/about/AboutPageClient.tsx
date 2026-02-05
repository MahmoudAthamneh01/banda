"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Zap,
  Globe,
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Lock,
  Users,
} from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";

interface AboutPageClientProps {
  locale: string;
}

export function AboutPageClient({ locale }: AboutPageClientProps) {
  const pillars = [
    {
      name: "Square",
      icon: ShoppingBag,
      desc: "The marketplace where buyers discover verified products from makers worldwide",
      color: "from-panda-500 to-sky-500",
    },
    {
      name: "Cockpit",
      icon: Briefcase,
      desc: "Command center for makers to manage inventory, RFQs, and production batches",
      color: "from-silk-500 to-panda-500",
    },
    {
      name: "Playground",
      icon: TrendingUp,
      desc: "Investment platform for funding production batches and earning returns",
      color: "from-jade-500 to-sky-500",
    },
    {
      name: "Throne",
      icon: Shield,
      desc: "Governance system for platform decisions and community leadership",
      color: "from-ruby-500 to-panda-500",
    },
    {
      name: "Vault",
      icon: Lock,
      desc: "Secure wallet for managing funds, escrow, and cross-border settlements",
      color: "from-warn-500 to-silk-500",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust First",
      desc: "Every transaction is secured by escrow. Every maker is KYC-verified. No exceptions.",
    },
    {
      icon: Globe,
      title: "Transparency",
      desc: "Full visibility into pricing, fees, and processes. No hidden costs or surprises.",
    },
    {
      icon: Zap,
      title: "Speed",
      desc: "Fast settlements, instant notifications, and responsive support. Time is money.",
    },
    {
      icon: Heart,
      title: "Culture",
      desc: "We celebrate makers, reward buyers, and build a community that values sovereignty.",
    },
  ];

  return (
    <PublicShell locale={locale}>
      <div className="ambient-bg">
        {/* Hero */}
        <section className="py-20 lg:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-slate-200 mb-6">
                Building the
                <span className="block text-gradient-primary">
                  Digital Nation of Commerce
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                BandaChao is a closed-loop digital ecosystem where makers, buyers, and
                investors transact directly—without intermediaries, without friction,
                and without compromise.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <Target className="h-12 w-12 text-panda-400 mb-4" />
              <h2 className="text-3xl font-bold text-slate-200 mb-4">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed">
                To empower makers and buyers with a sovereign platform that eliminates
                middlemen, reduces costs, and builds trust through transparency and
                technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <Eye className="h-12 w-12 text-sky-500 mb-4" />
              <h2 className="text-3xl font-bold text-slate-200 mb-4">Our Vision</h2>
              <p className="text-slate-300 leading-relaxed">
                A world where commerce is direct, fair, and efficient. Where makers
                control their destiny, buyers get the best value, and investors fund
                real production.
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Story */}
        <section className="py-16 px-4 bg-ink-950/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-8 text-center">
              Why BandaChao Exists
            </h2>
            <div className="glass-card p-8 space-y-4 text-slate-300 leading-relaxed">
              <p>
                Traditional e-commerce platforms take 15-30% in fees, control pricing,
                and own the customer relationship. Makers are squeezed. Buyers pay more.
                Everyone loses except the platform.
              </p>
              <p>
                We built BandaChao as an alternative: a <strong className="text-slate-200">closed digital
                ecosystem</strong> where every participant has a role, every transaction is
                transparent, and every fee is justified.
              </p>
              <p>
                Think of it as a <strong className="text-slate-200">digital nation</strong> with five pillars:
                a marketplace (Square), a maker hub (Cockpit), an investment platform
                (Playground), a governance system (Throne), and a financial vault (Vault).
              </p>
              <p>
                By combining escrow protection, KYC verification, and AI-powered tools,
                we create an environment where trust is built-in, not assumed.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Pillars */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                The Five Pillars
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Each pillar serves a distinct function in our digital nation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                      {pillar.name}
                    </h3>
                    <p className="text-slate-300 text-sm">{pillar.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-ink-950/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                Our Values
              </h2>
              <p className="text-slate-300">
                The principles that guide every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6"
                  >
                    <Icon className="h-10 w-10 text-panda-400 mb-4" />
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{value.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="h-12 w-12 text-silk-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                Join the Ecosystem
              </h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Whether you're a maker, buyer, or investor, there's a place for you in
                our digital nation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/${locale}/auth/register`} className="btn-primary">
                  Create Account
                </Link>
                <Link href={`/${locale}/square`} className="btn-ghost">
                  Explore Marketplace
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI Assistant */}
        <AskPanda context="about" />
      </div>
    </PublicShell>
  );
}
