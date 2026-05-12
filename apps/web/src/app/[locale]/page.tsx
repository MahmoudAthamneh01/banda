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
import { normalizeLocale, uiCopy } from "@/i18n/ui-copy";

export default function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  const locale = normalizeLocale(rawLocale);
  const copy = uiCopy[locale];

  const pillars = [
    {
      name: copy.landing.pillars.square.name,
      icon: ShoppingBag,
      desc: copy.landing.pillars.square.desc,
      href: `/${locale}/square`,
      color: "from-panda-500 to-sky-500",
    },
    {
      name: copy.landing.pillars.cockpit.name,
      icon: Briefcase,
      desc: copy.landing.pillars.cockpit.desc,
      href: `/${locale}/cockpit`,
      color: "from-panda-700 to-panda-500",
    },
    {
      name: copy.landing.pillars.playground.name,
      icon: TrendingUp,
      desc: copy.landing.pillars.playground.desc,
      href: `/${locale}/playground`,
      color: "from-jade-500 to-jade-600",
    },
    {
      name: copy.landing.pillars.social.name,
      icon: Users,
      desc: copy.landing.pillars.social.desc,
      href: `/${locale}/feed`,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: copy.landing.pillars.vault.name,
      icon: Lock,
      desc: copy.landing.pillars.vault.desc,
      href: `/${locale}/vault`,
      color: "from-panda-700 to-sky-500",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: copy.landing.features[0].title,
      desc: copy.landing.features[0].desc,
    },
    {
      icon: CheckCircle,
      title: copy.landing.features[1].title,
      desc: copy.landing.features[1].desc,
    },
    {
      icon: Zap,
      title: copy.landing.features[2].title,
      desc: copy.landing.features[2].desc,
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
                {copy.landing.heroPrefix}
                <span className="block text-gradient-primary">{copy.landing.heroHighlight}</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                {copy.landing.heroBody}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/${locale}/auth/register`} className="btn-primary text-lg">
                  {copy.landing.createAccount}
                </Link>
                <Link href={`/${locale}/square`} className="btn-ghost text-lg">
                  {copy.landing.exploreMarketplace}
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
                {copy.landing.pillarsTitle}
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                {copy.landing.pillarsSubtitle}
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
                          {copy.landing.enter} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                {copy.landing.howTitle}
              </h2>
              <p className="text-slate-300">{copy.landing.howSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {copy.landing.steps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-panda-500 to-panda-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                    {i + 1}
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
                {copy.landing.trustTitle}
              </h2>
              <p className="text-slate-300">
                {copy.landing.trustSubtitle}
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
                { value: "2,500+", label: copy.landing.stats[0] },
                { value: "12,000+", label: copy.landing.stats[1] },
                { value: "$4.2M", label: copy.landing.stats[2] },
                { value: "15K+", label: copy.landing.stats[3] },
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
                {copy.landing.ctaTitle}
              </h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                {copy.landing.ctaBody}
              </p>
              <Link href={`/${locale}/auth/register`} className="btn-primary text-lg">
                {copy.landing.ctaButton}
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
