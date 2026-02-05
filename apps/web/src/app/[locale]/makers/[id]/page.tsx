"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  MessageCircle,
  Star,
  MapPin,
  CheckCircle,
  Package,
  Play,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { BuyerShell } from "@/components/layout/shells/BuyerShell";

type TabType = "products" | "reviews" | "videos" | "about";

type AIToast = {
  message: string;
  agent: string;
} | null;

export default function MakerProfilePage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiToast, setAiToast] = useState<AIToast>(null);

  const maker = {
    id,
    name: "Shenzhen Tech Co",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%234f46e5' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3EST%3C/text%3E%3C/svg%3E`,
    cover: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='300'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='1200' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='30' fill='white' opacity='0.7'%3EMaker Cover%3C/text%3E%3C/svg%3E`,
    verified: true,
    rating: 4.8,
    reviewCount: 567,
    location: "Shenzhen, Guangdong, China",
    followers: 8234,
    about:
      "Leading electronics manufacturer with over 15 years of experience. Specializing in precision components, IoT devices, and custom electronics solutions. ISO 9001 certified with strict quality control.",
    specialties: ["PCB Manufacturing", "IoT Devices", "Custom Electronics", "Assembly Services"],
    certificates: ["ISO 9001:2015", "CE Certification", "RoHS Compliant", "Export License"],
  };

  // Mock products
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: `product-${i}`,
    name: ["Smart Sensor", "PCB Board", "IoT Module", "LED Controller"][i % 4] + ` V${i + 1}`,
    price: Math.floor(Math.random() * 500 + 100),
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'%3EProduct ${i + 1}%3C/text%3E%3C/svg%3E`,
  }));

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [id]);

  // AI: Deal Cat - negotiation entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiToast({
        message: "🐱 Want a better deal? I can help you negotiate bulk pricing with this maker!",
        agent: "Deal Cat (Haggle)",
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // AI: Chatty Bird - maker highlights
  useEffect(() => {
    if (activeTab === "about") {
      const timer = setTimeout(() => {
        setAiToast({
          message: "🐦 This maker has 'Fast Shipping' (avg 3-5 days) and 'Top Reviews' (4.8★ from 567 buyers)!",
          agent: "Chatty Bird",
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: "products", label: "Products", icon: Package },
    { key: "reviews", label: "Reviews", icon: Star },
    { key: "videos", label: "Videos", icon: Play },
    { key: "about", label: "About", icon: FileText },
  ];

  return (
    <BuyerShell locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="glass-card p-8 animate-pulse">
              <div className="h-48 bg-ink-850 rounded-lg mb-6" />
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-full bg-ink-850" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-ink-850 rounded w-1/3" />
                  <div className="h-4 bg-ink-850 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="relative">
              {/* Cover Image */}
              <div className="h-64 overflow-hidden">
                <img
                  src={maker.cover}
                  alt={maker.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Maker Info */}
              <div className="max-w-7xl mx-auto px-4">
                <div className="relative -mt-20 glass-card p-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Logo */}
                    <img
                      src={maker.logo}
                      alt={maker.name}
                      className="w-32 h-32 rounded-full ring-4 ring-ink-900 bg-ink-900 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h1 className="text-3xl font-bold text-slate-200 mb-2 flex items-center gap-3">
                            {maker.name}
                            {maker.verified && (
                              <CheckCircle className="h-7 w-7 text-panda-400" />
                            )}
                          </h1>
                          <p className="text-slate-400 flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4" />
                            {maker.location}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 fill-panda-400 text-panda-400" />
                              <span className="text-lg font-bold text-slate-200">
                                {maker.rating}
                              </span>
                              <span className="text-sm text-slate-400">
                                ({maker.reviewCount} reviews)
                              </span>
                            </div>
                            <span className="text-slate-400">
                              {maker.followers.toLocaleString()} followers
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFollowing(!following)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                              following
                                ? "bg-ink-800 text-slate-300 hover:bg-ink-700"
                                : "bg-panda-500 text-white hover:bg-panda-600"
                            }`}
                          >
                            <UserPlus className="h-5 w-5" />
                            {following ? "Following" : "Follow"}
                          </button>
                          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-300 font-medium transition-colors">
                            <MessageCircle className="h-5 w-5" />
                            Message
                          </button>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {maker.specialties.map((specialty, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-panda-500/20 text-panda-400 text-sm font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* RFQ CTA */}
                      <div className="p-4 rounded-lg bg-gradient-to-r from-panda-900/30 to-silk-900/30 border border-panda-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-200 font-semibold mb-1">
                              Need a custom quote?
                            </p>
                            <p className="text-sm text-slate-400">
                              Send an RFQ for bulk orders and special requirements
                            </p>
                          </div>
                          <Link
                            href={`/${locale}/cockpit/rfq/create?maker=${id}`}
                            className="px-6 py-2.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white font-medium transition-colors whitespace-nowrap"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
              <div className="glass-card">
                {/* Tab Headers */}
                <div className="flex gap-6 px-6 overflow-x-auto hide-scrollbar border-b border-ink-800">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                          activeTab === tab.key
                            ? "border-panda-500 text-panda-400"
                            : "border-transparent text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "products" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={`/${locale}/products/${product.id}`}
                            className="block group"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden mb-3 ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <h3 className="text-sm font-medium text-slate-300 mb-1 truncate group-hover:text-panda-400 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-lg font-bold text-panda-400">¥{product.price}</p>
                            <button className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors">
                              <ShoppingCart className="h-4 w-4" />
                              Add to Cart
                            </button>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-lg bg-ink-850/50"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='50' height='50'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'%3EU${i}%3C/text%3E%3C/svg%3E`}
                              alt="User"
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-200">User {i + 1}</span>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, starIdx) => (
                                    <Star
                                      key={starIdx}
                                      className={`h-3 w-3 ${
                                        starIdx < 4 ? "fill-panda-400 text-panda-400" : "text-slate-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">
                                Excellent quality and fast delivery! Highly recommend this maker for electronics projects.
                              </p>
                              <span className="text-xs text-slate-500">{Math.floor(Math.random() * 30 + 1)} days ago</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === "videos" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={`/${locale}/videos/maker-${i}`}
                            className="block group"
                          >
                            <div className="aspect-[9/16] rounded-lg overflow-hidden mb-2 relative ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all">
                              <img
                                src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='533'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='300' height='533'/%3E%3Ccircle cx='150' cy='266' r='30' fill='white' opacity='0.9'/%3E%3C/svg%3E`}
                                alt="Video"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <Play className="h-12 w-12 text-white" />
                              </div>
                            </div>
                            <p className="text-sm text-slate-300 truncate">Factory Tour Video {i + 1}</p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === "about" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">About</h3>
                        <p className="text-slate-300 leading-relaxed">{maker.about}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">
                          Certificates & Compliance
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {maker.certificates.map((cert, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-lg bg-gradient-to-br from-panda-900/20 to-silk-900/20 border border-panda-500/30 text-center"
                            >
                              <CheckCircle className="h-8 w-8 text-panda-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-slate-200">{cert}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* AI Toast */}
        <AnimatePresence>
          {aiToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 max-w-sm"
            >
              <div className="glass-card p-4 border-2 border-panda-500/50">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-panda-400 mb-1">
                      {aiToast.agent}
                    </p>
                    <p className="text-sm text-slate-300">{aiToast.message}</p>
                  </div>
                  <button
                    onClick={() => setAiToast(null)}
                    className="text-slate-400 hover:text-slate-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setAiToast(null)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors"
                  >
                    Let's do it!
                  </button>
                  <button
                    onClick={() => setAiToast(null)}
                    className="px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-300 text-sm transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BuyerShell>
  );
}
