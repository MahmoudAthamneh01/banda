"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  CheckCircle,
  Star,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { BuyerShell } from "@/components/layout/shells/BuyerShell";

type Maker = {
  id: string;
  name: string;
  logo: string;
  cover: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  tags: string[];
  followers: number;
};

type AIToast = {
  message: string;
  agent: string;
} | null;

export default function MakersPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [makers, setMakers] = useState<Maker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    category: "",
    country: "",
  });
  const [aiToast, setAiToast] = useState<AIToast>(null);

  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Other"];
  const countries = ["China", "USA", "Germany", "Japan", "Korea", "Vietnam"];

  // Load makers
  useEffect(() => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const mockMakers: Maker[] = Array.from({ length: 12 }, (_, i) => ({
        id: `maker-${i}`,
        name: [
          "Shenzhen Tech Co",
          "Beijing Fashion House",
          "Shanghai Designs Ltd",
          "Guangzhou Electronics",
          "Chengdu Crafts",
          "Hangzhou Textiles",
          "Suzhou Manufacturing",
          "Wuhan Industries",
          "Nanjing Exports",
          "Tianjin Products",
          "Xiamen Makers",
          "Qingdao Factory",
        ][i],
        logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='white'%3E${["S", "B", "S", "G", "C", "H", "S", "W", "N", "T", "X", "Q"][i]}%3C/text%3E%3C/svg%3E`,
        cover: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white' opacity='0.7'%3EMaker Cover ${i}%3C/text%3E%3C/svg%3E`,
        verified: Math.random() > 0.3,
        rating: Math.random() * 1.5 + 3.5,
        reviewCount: Math.floor(Math.random() * 500 + 50),
        location: ["Shenzhen", "Beijing", "Shanghai", "Guangzhou", "Chengdu", "Hangzhou"][i % 6] + ", China",
        category: categories[i % categories.length],
        tags: ["Fast Shipping", "Quality Guaranteed", "Eco-Friendly", "Custom Orders"].slice(0, Math.floor(Math.random() * 3) + 2),
        followers: Math.floor(Math.random() * 10000 + 500),
      }));
      setMakers(mockMakers);
      setLoading(false);
    }, 800);
  }, [filters]);

  // AI: Chatty Bird - recommendations based on saves
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiToast({
        message: "🐦 Based on your saved items, I recommend checking out 'Shenzhen Tech Co' and 'Beijing Fashion House'!",
        agent: "Chatty Bird",
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setMakers([]);
      setLoading(false);
    }, 800);
  };

  const filteredMakers = makers.filter((maker) => {
    if (searchQuery && !maker.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.verifiedOnly && !maker.verified) {
      return false;
    }
    if (filters.category && maker.category !== filters.category) {
      return false;
    }
    if (filters.country && !maker.location.includes(filters.country)) {
      return false;
    }
    return true;
  });

  return (
    <BuyerShell locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur-md border-b border-ink-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-200">Makers Directory</h1>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search makers..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-ink-850 border border-ink-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-panda-500 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-300 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Top Makers Strip */}
        <div className="bg-gradient-to-r from-panda-900/20 to-silk-900/20 border-b border-ink-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-panda-400" />
              Top Makers This Week
            </h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {makers.slice(0, 5).map((maker) => (
                <Link
                  key={maker.id}
                  href={`/${locale}/makers/${maker.id}`}
                  className="flex-shrink-0 w-32 group"
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-panda-500/30 group-hover:ring-panda-500 transition-all">
                    <img src={maker.logo} alt={maker.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-center text-slate-300 line-clamp-2 group-hover:text-panda-400 transition-colors">
                    {maker.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-6">
                  <div className="h-32 bg-ink-850 animate-pulse rounded-lg mb-4" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-ink-850 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-ink-850 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-ink-850 animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-12 text-center"
            >
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                Couldn't load makers
              </h3>
              <p className="text-slate-400 mb-6">Something went wrong. Please try again.</p>
              <button onClick={handleRetry} className="btn-primary">
                Retry
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMakers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-12 text-center"
            >
              <Search className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">No makers found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({ verifiedOnly: false, category: "", country: "" });
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </motion.div>
          )}

          {/* Makers Grid */}
          {!loading && !error && filteredMakers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMakers.map((maker, index) => (
                <motion.div
                  key={maker.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/${locale}/makers/${maker.id}`} className="block group">
                    <div className="glass-card p-6 hover:bg-ink-850/50 transition-all h-full">
                      {/* Cover Image */}
                      <div className="h-32 rounded-lg overflow-hidden mb-4 relative">
                        <img
                          src={maker.cover}
                          alt={maker.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        {maker.verified && (
                          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-panda-500">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Maker Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <img
                          src={maker.logo}
                          alt={maker.name}
                          className="w-16 h-16 rounded-full ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-200 mb-1 truncate group-hover:text-panda-400 transition-colors">
                            {maker.name}
                          </h3>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-panda-400 text-panda-400" />
                            <span className="text-sm font-semibold text-slate-300">
                              {maker.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({maker.reviewCount})
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {maker.location}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {maker.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-panda-500/20 text-panda-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-ink-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {maker.followers.toLocaleString()} followers
                        </span>
                        <span className="text-sm font-medium text-panda-400 flex items-center gap-1">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Drawer */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFilterOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ink-900 z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-200">Filters</h2>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Verified Only */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.verifiedOnly}
                          onChange={(e) =>
                            setFilters({ ...filters, verifiedOnly: e.target.checked })
                          }
                          className="w-5 h-5 rounded bg-ink-850 border-ink-700 text-panda-500 focus:ring-panda-500"
                        />
                        <span className="text-slate-300">Verified makers only</span>
                      </label>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-ink-850 border border-ink-700 text-slate-200 focus:outline-none focus:border-panda-500"
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Country
                      </label>
                      <select
                        value={filters.country}
                        onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-ink-850 border border-ink-700 text-slate-200 focus:outline-none focus:border-panda-500"
                      >
                        <option value="">All Countries</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => {
                        setFilters({ verifiedOnly: false, category: "", country: "" });
                        setFilterOpen(false);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-300 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="flex-1 btn-primary"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
                    <p className="text-xs font-semibold text-panda-400 mb-1">{aiToast.agent}</p>
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
                    Check them out!
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
