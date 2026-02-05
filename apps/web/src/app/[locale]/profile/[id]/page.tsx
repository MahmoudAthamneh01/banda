"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  MessageCircle,
  Heart,
  Bookmark,
  Star,
  Package,
  TrendingUp,
  CheckCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import { BuyerShell } from "@/components/layout/shells/BuyerShell";

type TabType = "posts" | "saved" | "reviews" | "resell";

type ProfileData = {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  bio: string;
  location: string;
  joinedDate: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
  kycComplete: boolean;
  languageSet: boolean;
};

type AIToast = {
  message: string;
  agent: string;
} | null;

export default function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiToast, setAiToast] = useState<AIToast>(null);

  // Load profile data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockProfile: ProfileData = {
        id,
        name: "Sarah Chen",
        avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3ESC%3C/text%3E%3C/svg%3E`,
        tier: "Gold",
        bio: "Fashion enthusiast | Sustainable living advocate | Always hunting for the best deals 🛍️",
        location: "Shanghai, China",
        joinedDate: "Jan 2025",
        stats: {
          followers: 1247,
          following: 342,
          posts: 89,
        },
        isFollowing: false,
        kycComplete: Math.random() > 0.5,
        languageSet: Math.random() > 0.3,
      };
      setProfile(mockProfile);
      setLoading(false);
    }, 800);
  }, [id]);

  // AI: Host Panda - completion checklist
  useEffect(() => {
    if (profile && (!profile.kycComplete || !profile.languageSet)) {
      const timer = setTimeout(() => {
        const missing = [];
        if (!profile.kycComplete) missing.push("KYC verification");
        if (!profile.languageSet) missing.push("language preference");
        setAiToast({
          message: `🐼 Complete your ${missing.join(" and ")} to unlock all features and earn bonus points!`,
          agent: "Host Panda",
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  // AI: Style Guru - taste profile
  useEffect(() => {
    if (profile && activeTab === "saved") {
      const timer = setTimeout(() => {
        setAiToast({
          message: "✨ Your taste profile: Modern minimalist with sustainable focus. I found 23 new items you might love!",
          agent: "Style Guru",
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, profile]);

  const handleFollow = () => {
    if (profile) {
      setProfile({
        ...profile,
        isFollowing: !profile.isFollowing,
        stats: {
          ...profile.stats,
          followers: profile.isFollowing ? profile.stats.followers - 1 : profile.stats.followers + 1,
        },
      });
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "saved", label: "Saved" },
    { key: "reviews", label: "Reviews" },
    { key: "resell", label: "Resell Plans" },
  ];

  // Mock content for tabs
  const mockContent = Array.from({ length: 6 }, (_, i) => ({
    id: `item-${i}`,
    title: ["Premium Hoodie", "Designer Bag", "Smart Watch", "Vintage Jacket", "Leather Boots", "Sunglasses"][i],
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'%3EItem ${i + 1}%3C/text%3E%3C/svg%3E`,
    price: Math.floor(Math.random() * 500 + 100),
  }));

  return (
    <BuyerShell locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
        {loading ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="glass-card p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-32 h-32 rounded-full bg-ink-850 animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-48 bg-ink-850 animate-pulse rounded" />
                  <div className="h-4 w-64 bg-ink-850 animate-pulse rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-ink-850 animate-pulse rounded" />
                    <div className="h-4 w-24 bg-ink-850 animate-pulse rounded" />
                    <div className="h-4 w-24 bg-ink-850 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : profile ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 mb-6"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full ring-4 ring-panda-500/30"
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-200 mb-2">
                        {profile.name}
                        {profile.kycComplete && (
                          <CheckCircle className="inline-block ml-2 h-6 w-6 text-panda-400" />
                        )}
                      </h1>
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-panda-500/20 to-silk-500/20 text-panda-400 text-sm font-semibold">
                        {profile.tier} Tier
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleFollow}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          profile.isFollowing
                            ? "bg-ink-800 text-slate-300 hover:bg-ink-700"
                            : "bg-panda-500 text-white hover:bg-panda-600"
                        }`}
                      >
                        <UserPlus className="h-4 w-4" />
                        {profile.isFollowing ? "Following" : "Follow"}
                      </button>
                      <button className="p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-300 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-slate-300 mb-4">{profile.bio}</p>

                  {/* Location & Join Date */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {profile.joinedDate}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div>
                      <span className="text-2xl font-bold text-slate-200">
                        {profile.stats.followers.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-400 ml-1">Followers</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-slate-200">
                        {profile.stats.following.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-400 ml-1">Following</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-slate-200">
                        {profile.stats.posts}
                      </span>
                      <span className="text-sm text-slate-400 ml-1">Posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="glass-card mb-6">
              <div className="flex gap-6 px-6 overflow-x-auto hide-scrollbar border-b border-ink-800">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-panda-500 text-panda-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "posts" && (
                  <div className="space-y-4">
                    {mockContent.slice(0, 3).map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-ink-850/50 hover:bg-ink-850 transition-colors"
                      >
                        <p className="text-slate-300 mb-2">
                          Just got this amazing {item.title}! The quality is incredible 🔥
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" /> {Math.floor(Math.random() * 100 + 20)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" /> {Math.floor(Math.random() * 20 + 5)}
                          </span>
                          <span className="ml-auto text-xs">{Math.floor(Math.random() * 24)}h ago</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "saved" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mockContent.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={`/${locale}/products/${item.id}`}
                          className="block group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-2 ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <p className="text-sm font-medium text-slate-300 truncate">
                            {item.title}
                          </p>
                          <p className="text-lg font-bold text-panda-400">¥{item.price}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {mockContent.slice(0, 4).map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-ink-850/50"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <Link
                              href={`/${locale}/products/${item.id}`}
                              className="font-medium text-slate-200 hover:text-panda-400"
                            >
                              {item.title}
                            </Link>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className={`h-4 w-4 ${
                                    starIdx < 4 ? "fill-panda-400 text-panda-400" : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300">
                          Great quality and fast shipping! Highly recommend this seller.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">{Math.floor(Math.random() * 30 + 1)} days ago</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "resell" && (
                  <div className="space-y-4">
                    {mockContent.slice(0, 3).map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-gradient-to-r from-panda-900/20 to-silk-900/20 border border-panda-500/20"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-slate-200 mb-2">{item.title}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-400">Purchase Price:</span>
                                <p className="text-slate-200 font-semibold">¥{item.price}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Target Price:</span>
                                <p className="text-panda-400 font-semibold">
                                  ¥{Math.floor(item.price * 1.3)}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400">Margin:</span>
                                <p className="text-green-400 font-semibold">+30%</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Timeframe:</span>
                                <p className="text-slate-200 font-semibold">3 months</p>
                              </div>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

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
                    Got it!
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
