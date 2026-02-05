"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Image as ImageIcon,
  Video,
  Package,
  TrendingUp,
  Users,
  QrCode,
  AlertCircle,
} from "lucide-react";
import { BuyerShell } from "@/components/layout/shells/BuyerShell";

type PostType = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    tier: string;
  };
  content: string;
  media?: string[];
  attachments?: {
    type: "product" | "maker" | "video";
    id: string;
    name: string;
  }[];
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
  timestamp: string;
};

type AIToast = {
  message: string;
  agent: string;
  type?: "info" | "warning";
} | null;

export default function FeedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [activeTab, setActiveTab] = useState<"following" | "trending" | "reviews" | "videos">("following");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aiToast, setAiToast] = useState<AIToast>(null);

  // Load mock posts
  useEffect(() => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const mockPosts: PostType[] = Array.from({ length: 10 }, (_, i) => ({
        id: `post-${i}`,
        user: {
          id: `user-${i}`,
          name: ["Sarah Chen", "Mike Wang", "Lisa Liu", "Tom Zhang", "Emma Lee"][i % 5],
          avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='white'%3E${["S", "M", "L", "T", "E"][i % 5]}%3C/text%3E%3C/svg%3E`,
          tier: ["Bronze", "Silver", "Gold", "Platinum"][i % 4],
        },
        content: [
          "Just received my order! Quality is amazing 🔥",
          "Found this incredible maker in Guangzhou - their fabric is top-notch!",
          "Check out this video review of the new product line 🎥",
          "Love the packaging design from this maker! 📦",
          "Best deal I've found this month! Sharing with everyone 💯",
        ][i % 5],
        media: i % 3 === 0 ? [`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white'%3EPost Image ${i}%3C/text%3E%3C/svg%3E`] : undefined,
        attachments: i % 2 === 0 ? [
          {
            type: ["product", "maker", "video"][i % 3] as "product" | "maker" | "video",
            id: `entity-${i}`,
            name: ["Premium Cotton Hoodie", "GZ Fashion Maker", "Product Review Video"][i % 3],
          },
        ] : [],
        likes: Math.floor(Math.random() * 500) + 10,
        comments: Math.floor(Math.random() * 100) + 5,
        shares: Math.floor(Math.random() * 50),
        liked: Math.random() > 0.7,
        saved: Math.random() > 0.8,
        timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      }));
      setPosts(mockPosts);
      setLoading(false);
    }, 800);
  }, [activeTab]);

  // AI: Chatty Bird - trending topics
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiToast({
        message: "🐦 'Sustainable fashion' is trending today! 3 makers you follow are discussing it.",
        agent: "Chatty Bird",
        type: "info",
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, saved: !p.saved } : p));
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setPosts([]);
      setLoading(false);
    }, 800);
  };

  return (
    <BuyerShell locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur-md border-b border-ink-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-slate-200">Community Feed</h1>
          </div>
        </div>

        {/* Feed Tabs */}
        <div className="sticky top-[73px] z-30 bg-ink-900/90 backdrop-blur-md border-b border-ink-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto hide-scrollbar">
              {(["following", "trending", "reviews", "videos"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-panda-500 text-panda-400"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Feed List */}
            <div className="space-y-4">
              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="glass-card p-6">
                      <div className="flex gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-ink-850 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-ink-850 animate-pulse rounded" />
                          <div className="h-3 w-20 bg-ink-850 animate-pulse rounded" />
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-ink-850 animate-pulse rounded w-full" />
                        <div className="h-4 bg-ink-850 animate-pulse rounded w-3/4" />
                      </div>
                      <div className="h-48 bg-ink-850 animate-pulse rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && posts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-12 text-center"
                >
                  <Users className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Follow makers and users to see their posts here
                  </p>
                  <Link href={`/${locale}/makers`} className="btn-primary">
                    Discover Makers
                  </Link>
                </motion.div>
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
                    Couldn't load feed
                  </h3>
                  <p className="text-slate-400 mb-6">Something went wrong. Please try again.</p>
                  <button onClick={handleRetry} className="btn-primary">
                    Retry
                  </button>
                </motion.div>
              )}

              {/* Post Cards */}
              {!loading && !error && posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 hover:bg-ink-850/50 transition-colors"
                >
                  {/* User Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Link href={`/${locale}/profile/${post.user.id}`}>
                      <img
                        src={post.user.avatar}
                        alt={post.user.name}
                        className="w-12 h-12 rounded-full ring-2 ring-ink-800 hover:ring-panda-500 transition-all"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/${locale}/profile/${post.user.id}`}
                        className="font-semibold text-slate-200 hover:text-panda-400 transition-colors"
                      >
                        {post.user.name}
                      </Link>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-panda-500/20 text-panda-400">
                        {post.user.tier}
                      </span>
                      <p className="text-sm text-slate-400">{post.timestamp}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-slate-300 mb-4">{post.content}</p>

                  {/* Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={post.media[0]}
                        alt="Post media"
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  {/* Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.attachments.map((att, i) => {
                        const Icon = att.type === "product" ? Package : att.type === "video" ? Video : Users;
                        const href =
                          att.type === "product"
                            ? `/${locale}/products/${att.id}`
                            : att.type === "maker"
                            ? `/${locale}/makers/${att.id}`
                            : `/${locale}/videos/${att.id}`;
                        return (
                          <Link
                            key={i}
                            href={href}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 border border-ink-700 transition-colors"
                          >
                            <Icon className="h-4 w-4 text-panda-400" />
                            <span className="text-sm text-slate-300">{att.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-ink-800">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group"
                    >
                      <Heart
                        className={`h-5 w-5 group-hover:scale-110 transition-transform ${
                          post.liked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-panda-400 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-panda-400 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                    <button
                      onClick={() => handleSave(post.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-panda-400 transition-colors ml-auto"
                    >
                      <Bookmark
                        className={`h-5 w-5 ${post.saved ? "fill-panda-400 text-panda-400" : ""}`}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Rail (Desktop) */}
            <div className="hidden lg:block space-y-4">
              {/* Trending Makers */}
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-panda-400" />
                  Trending Makers
                </h3>
                <div className="space-y-3">
                  {["Shenzhen Tech Co", "Beijing Fashion", "Shanghai Designs"].map((maker, i) => (
                    <Link
                      key={i}
                      href={`/${locale}/makers/${i}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink-850 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-panda-500 to-silk-500 flex items-center justify-center text-white font-bold">
                        {maker[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{maker}</p>
                        <p className="text-xs text-slate-400">{Math.floor(Math.random() * 10 + 5)}k followers</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top Deals Today */}
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">🔥 Top Deals</h3>
                <div className="space-y-3">
                  {["Premium Hoodie", "Designer Bag", "Smart Watch"].map((product, i) => (
                    <Link
                      key={i}
                      href={`/${locale}/products/${i}`}
                      className="block p-3 rounded-lg bg-ink-850 hover:bg-ink-800 transition-colors"
                    >
                      <p className="text-sm font-medium text-slate-200 mb-1">{product}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-panda-400">¥{Math.floor(Math.random() * 500 + 100)}</span>
                        <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">-{Math.floor(Math.random() * 30 + 10)}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Referral QR Card */}
              <div className="glass-card p-4 bg-gradient-to-br from-panda-900/20 to-silk-900/20">
                <div className="text-center">
                  <QrCode className="h-12 w-12 text-panda-400 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">Invite Friends</h3>
                  <p className="text-xs text-slate-400 mb-4">Share your QR code and earn rewards</p>
                  <button className="btn-primary w-full text-sm">Generate QR</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Toast */}
        <AnimatePresence>
          {aiToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 max-w-sm"
            >
              <div
                className={`glass-card p-4 border-2 ${
                  aiToast.type === "warning" ? "border-red-500/50" : "border-panda-500/50"
                }`}
              >
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
                    Sure!
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
