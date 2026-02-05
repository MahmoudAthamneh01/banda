"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { BuyerShell } from "@/components/layout/shells/BuyerShell";

type VideoType = {
  id: string;
  title: string;
  cover: string;
  duration: string;
  views: number;
  likes: number;
  maker: {
    id: string;
    name: string;
    avatar: string;
  };
  hasProduct: boolean;
  productId?: string;
};

type AIToast = {
  message: string;
  agent: string;
  productId?: string;
} | null;

export default function VideosPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [activeFilter, setActiveFilter] = useState<"forYou" | "trending" | "makers" | "reviews">("forYou");
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aiToast, setAiToast] = useState<AIToast>(null);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  // Load videos
  useEffect(() => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const mockVideos: VideoType[] = Array.from({ length: 12 }, (_, i) => ({
        id: `video-${i}`,
        title: [
          "Unboxing Premium Cotton Hoodie",
          "Factory Tour: Behind the Scenes",
          "Product Review: Smart Watch",
          "How It's Made: Leather Bags",
          "Customer Testimonial",
          "New Collection Preview",
        ][i % 6],
        cover: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='400' height='600'/%3E%3Ccircle cx='200' cy='300' r='40' fill='white' opacity='0.9'/%3E%3Cpolygon points='185,285 185,315 210,300' fill='%23333'/%3E%3C/svg%3E`,
        duration: `${Math.floor(Math.random() * 5 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        views: Math.floor(Math.random() * 50000 + 1000),
        likes: Math.floor(Math.random() * 5000 + 100),
        maker: {
          id: `maker-${i % 3}`,
          name: ["Shenzhen Tech Co", "Beijing Fashion", "Shanghai Designs"][i % 3],
          avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='50' height='50'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'%3E${["S", "B", "S"][i % 3]}%3C/text%3E%3C/svg%3E`,
        },
        hasProduct: i % 2 === 0,
        productId: i % 2 === 0 ? `product-${i}` : undefined,
      }));
      setVideos(mockVideos);
      setLoading(false);
    }, 800);
  }, [activeFilter]);

  // AI: Chatty Bird - Today's top clips
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiToast({
        message: "🐦 Today's top clips: 'Unboxing Premium Cotton Hoodie' has 10k views! Check it out.",
        agent: "Chatty Bird",
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoClick = (video: VideoType) => {
    setSelectedVideo(video);
    setWatchModalOpen(true);

    // AI: Deal Cat - Add to cart prompt for videos with products
    if (video.hasProduct) {
      setTimeout(() => {
        setAiToast({
          message: "🐱 Love this product? I can add it to your cart with a 10% bundle discount!",
          agent: "Deal Cat",
          productId: video.productId,
        });
      }, 3000);
    }
  };

  const handleAddToCart = (productId?: string) => {
    if (productId) {
      // Mock add to cart
      setAiToast({
        message: "✅ Added to cart with 10% discount applied!",
        agent: "Deal Cat",
      });
    }
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setVideos([]);
      setLoading(false);
    }, 800);
  };

  return (
    <BuyerShell locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur-md border-b border-ink-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-slate-200">Video Hub</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-[73px] z-30 bg-ink-900/90 backdrop-blur-md border-b border-ink-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto hide-scrollbar">
              {(["forYou", "trending", "makers", "reviews"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeFilter === filter
                      ? "border-panda-500 text-panda-400"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {filter === "forYou" ? "For You" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[9/16] bg-ink-850 animate-pulse rounded-2xl" />
                  <div className="h-4 bg-ink-850 animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-ink-850 animate-pulse rounded w-1/2" />
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
                Couldn't load videos
              </h3>
              <p className="text-slate-400 mb-6">Something went wrong. Please try again.</p>
              <button onClick={handleRetry} className="btn-primary">
                Retry
              </button>
            </motion.div>
          )}

          {/* Video Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleVideoClick(video)}
                  className="group cursor-pointer"
                >
                  {/* Video Card */}
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all">
                    <img
                      src={video.cover}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-16 w-16 text-white drop-shadow-lg" />
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/80 text-white text-xs font-medium">
                      {video.duration}
                    </div>

                    {/* Views Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/80 text-white text-xs">
                      <Eye className="h-3 w-3" />
                      {video.views > 1000 ? `${(video.views / 1000).toFixed(1)}k` : video.views}
                    </div>

                    {/* Product Badge */}
                    {video.hasProduct && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-panda-500 text-white text-xs font-medium">
                        Product
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-slate-200 line-clamp-2 mb-2 group-hover:text-panda-400 transition-colors">
                      {video.title}
                    </h3>
                    <Link
                      href={`/${locale}/makers/${video.maker.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-slate-400 hover:text-panda-400 transition-colors"
                    >
                      <img
                        src={video.maker.avatar}
                        alt={video.maker.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs truncate">{video.maker.name}</span>
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {video.likes > 1000 ? `${(video.likes / 1000).toFixed(1)}k` : video.likes}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Watch Mode Modal */}
        <AnimatePresence>
          {watchModalOpen && selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setWatchModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl glass-card p-6"
              >
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-ink-950 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={selectedVideo.cover}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-20 w-20 text-white drop-shadow-2xl" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-200 mb-3">
                    {selectedVideo.title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${locale}/makers/${selectedVideo.maker.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={selectedVideo.maker.avatar}
                        alt={selectedVideo.maker.name}
                        className="w-10 h-10 rounded-full ring-2 ring-ink-800"
                      />
                      <div>
                        <p className="font-medium text-slate-200">{selectedVideo.maker.name}</p>
                        <p className="text-xs text-slate-400">View profile</p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-300 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">{selectedVideo.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-300 transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Attachment */}
                {selectedVideo.hasProduct && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-panda-900/20 to-silk-900/20 border border-panda-500/30 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Featured Product</p>
                        <p className="font-semibold text-slate-200">Premium Cotton Hoodie</p>
                        <p className="text-lg font-bold text-panda-400 mt-1">¥299</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(selectedVideo.productId)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-panda-500 hover:bg-panda-600 text-white font-medium transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/${locale}/videos/${selectedVideo.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setWatchModalOpen(false)}
                    className="px-6 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
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
                  {aiToast.productId ? (
                    <button
                      onClick={() => {
                        handleAddToCart(aiToast.productId);
                        setAiToast(null);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => setAiToast(null)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors"
                    >
                      Sure!
                    </button>
                  )}
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
