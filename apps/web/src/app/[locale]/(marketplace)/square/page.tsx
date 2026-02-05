'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Package,
  Users,
  ArrowRight,
  Star,
  Flame,
  Gift,
  ChevronRight,
  BadgeCheck,
  Truck,
  X,
} from 'lucide-react';

// Mock Data
const HERO_BANNERS = [
  { id: 1, title: 'Flash Sale', subtitle: 'Up to 50% OFF', cta: 'Shop Now', color: 'from-panda-500 to-sky-500', countdown: '02:45:30' },
  { id: 2, title: 'New Arrivals', subtitle: 'Spring Collection 2026', cta: 'Explore', color: 'from-silk-500 to-panda-500', countdown: null },
  { id: 3, title: 'Verified Makers', subtitle: 'Quality Guaranteed', cta: 'Meet Makers', color: 'from-jade-500 to-sky-500', countdown: null },
];

const DISCOVERY_CARDS = [
  { id: 'trending', title: 'Trending Now', icon: TrendingUp, count: 156, color: 'bg-panda-500/20 text-panda-400', tag: 'trending' },
  { id: 'new', title: 'New Arrivals', icon: Sparkles, count: 89, color: 'bg-sky-500/20 text-sky-400', tag: 'new' },
  { id: 'verified', title: 'Verified Only', icon: Shield, count: 234, color: 'bg-jade-500/20 text-jade-400', tag: 'verified' },
  { id: 'lowstock', title: 'Low Stock', icon: Flame, count: 23, color: 'bg-red-500/20 text-red-400', tag: 'lowstock' },
  { id: 'liquidation', title: 'Mystery Deals', icon: Gift, count: 12, color: 'bg-silk-500/20 text-silk-400', tag: 'liquidation' },
  { id: 'ambassador', title: 'Ambassador Picks', icon: Star, count: 45, color: 'bg-panda-500/20 text-panda-400', tag: 'ambassador' },
];

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', emoji: '📱', count: 1250 },
  { id: 'fashion', name: 'Fashion', emoji: '👕', count: 890 },
  { id: 'home', name: 'Home & Garden', emoji: '🏠', count: 567 },
  { id: 'industrial', name: 'Industrial', emoji: '⚙️', count: 345 },
  { id: 'beauty', name: 'Beauty', emoji: '💄', count: 432 },
  { id: 'sports', name: 'Sports', emoji: '⚽', count: 234 },
  { id: 'toys', name: 'Toys & Games', emoji: '🎮', count: 189 },
  { id: 'food', name: 'Food & Beverage', emoji: '🍜', count: 156 },
];

const FEATURED_MAKERS = [
  { id: 1, name: 'TechZone Factory', badge: 'Verified', rating: 4.9, products: 156, avatar: '🏭', fastShip: true },
  { id: 2, name: 'Fashion Forward', badge: 'Ambassador', rating: 4.8, products: 89, avatar: '👗', fastShip: true },
  { id: 3, name: 'HomeStyle Co.', badge: 'Verified', rating: 4.7, products: 234, avatar: '🛋️', fastShip: false },
  { id: 4, name: 'Industrial Plus', badge: 'Verified', rating: 4.9, products: 67, avatar: '🔧', fastShip: true },
];

const LIVE_STATS = {
  dealsToday: 847,
  makersOnline: 234,
  ordersShipped: 12453,
};

export default function SquarePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showAIToast, setShowAIToast] = useState(false);
  const [aiDismissed, setAiDismissed] = useState(false);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // AI Chatty Bird - shows after load + every 45s
  useEffect(() => {
    if (aiDismissed) return;
    
    const showInitial = setTimeout(() => setShowAIToast(true), 3000);
    const interval = setInterval(() => {
      if (!aiDismissed) setShowAIToast(true);
    }, 45000);
    
    return () => {
      clearTimeout(showInitial);
      clearInterval(interval);
    };
  }, [aiDismissed]);

  return (
    <BuyerShell locale={locale} secondaryNav="discover">
      <div className="min-h-screen">
        {/* ===== HERO LOBBY ===== */}
        <section className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-r ${HERO_BANNERS[currentBanner].color} py-16 md:py-24`}
            >
              <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {HERO_BANNERS[currentBanner].title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-6">
                      {HERO_BANNERS[currentBanner].subtitle}
                    </p>
                    {HERO_BANNERS[currentBanner].countdown && (
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                        <Clock className="h-5 w-5 text-white" />
                        <span className="text-2xl font-mono text-white font-bold">
                          {HERO_BANNERS[currentBanner].countdown}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link href={`/${locale}/products`}>
                        <Button size="lg" className="bg-white text-ink-900 hover:bg-white/90 font-bold px-8">
                          {HERO_BANNERS[currentBanner].cta}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href={`/${locale}/products?filter=deals`}>
                        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                          Today's Deals
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Banner Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentBanner ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>

        {/* ===== LIVE PULSE STRIP ===== */}
        <section className="bg-ink-900/80 border-y border-border py-3 overflow-hidden">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Zap className="h-4 w-4 text-silk-400" />
                <span><strong className="text-white">{LIVE_STATS.dealsToday}</strong> deals today</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <Users className="h-4 w-4 text-jade-400" />
                <span><strong className="text-white">{LIVE_STATS.makersOnline}</strong> makers online</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-400">
                <Package className="h-4 w-4 text-panda-400" />
                <span><strong className="text-white">{LIVE_STATS.ordersShipped.toLocaleString()}</strong> orders shipped</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SMART DISCOVERY GRID ===== */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Discover</h2>
              <Link href={`/${locale}/products`} className="text-panda-400 hover:text-panda-300 text-sm flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {DISCOVERY_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.id}
                    href={`/${locale}/products?tag=${card.tag}`}
                    className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{card.title}</h3>
                    <p className="text-slate-400 text-sm">{card.count} items</p>
                    <ChevronRight className="absolute top-1/2 right-4 -translate-y-1/2 h-5 w-5 text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CATEGORY GALAXY ===== */}
        <section className="py-12 md:py-16 bg-ink-900/30">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Categories</h2>
            
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/products?category=${cat.id}`}
                  className="flex-shrink-0 flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-panda-500/30 rounded-2xl transition-all min-w-[140px] group"
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <div className="text-center">
                    <h3 className="text-white font-medium group-hover:text-panda-400 transition-colors">{cat.name}</h3>
                    <p className="text-slate-500 text-sm">{cat.count} items</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURED MAKERS ===== */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Makers</h2>
              <Link href={`/${locale}/makers`} className="text-panda-400 hover:text-panda-300 text-sm flex items-center gap-1">
                All Makers <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_MAKERS.map((maker) => (
                <Link
                  key={maker.id}
                  href={`/${locale}/makers/${maker.id}`}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-panda-500/30 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-panda-500/20 to-sky-500/20 flex items-center justify-center text-3xl">
                      {maker.avatar}
                    </div>
                    <div className="flex items-center gap-1">
                      {maker.badge === 'Verified' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-jade-500/20 text-jade-400 rounded-full text-xs">
                          <BadgeCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      {maker.badge === 'Ambassador' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-silk-500/20 text-silk-400 rounded-full text-xs">
                          <Star className="h-3 w-3" /> Ambassador
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2 group-hover:text-panda-400 transition-colors">
                    {maker.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-silk-400 fill-silk-400" />
                      {maker.rating}
                    </span>
                    <span>{maker.products} products</span>
                  </div>
                  
                  {maker.fastShip && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-sky-400">
                      <Truck className="h-3 w-3" />
                      Fast Shipping
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== AI CHATTY BIRD TOAST ===== */}
        <AnimatePresence>
          {showAIToast && !aiDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 50 }}
              className="fixed bottom-6 right-6 z-50 max-w-sm"
            >
              <div className="bg-gradient-to-br from-panda-500/90 to-sky-500/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🐼</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold text-sm">Chatty Bird</h4>
                      <button 
                        onClick={() => {
                          setShowAIToast(false);
                          setAiDismissed(true);
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      🔥 3 trending items you might like based on your interests!
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/${locale}/products?tag=trending`}>
                        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white text-xs">
                          Show Me
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/70 hover:text-white text-xs"
                        onClick={() => setShowAIToast(false)}
                      >
                        Later
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BuyerShell>
  );
}
