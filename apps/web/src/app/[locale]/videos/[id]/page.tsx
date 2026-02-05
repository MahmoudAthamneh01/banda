"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Heart,
  Share2,
  ShoppingCart,
  UserPlus,
  Eye,
  MessageCircle,
  Send,
} from "lucide-react";
import { BuyerShell } from "@/components/layout/shells/BuyerShell";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type Comment = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
};

type AIToast = {
  message: string;
  agent: string;
  products?: string[];
} | null;

export default function VideoDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 5000 + 500));
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [aiToast, setAiToast] = useState<AIToast>(null);

  const video = {
    id,
    title: "Unboxing Premium Cotton Hoodie - Quality Review",
    cover: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='800' height='450'/%3E%3Ccircle cx='400' cy='225' r='60' fill='white' opacity='0.9'/%3E%3Cpolygon points='380,205 380,245 420,225' fill='%23333'/%3E%3C/svg%3E`,
    views: 12543,
    maker: {
      id: "maker-1",
      name: "Shenzhen Tech Co",
      avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%234f46e5' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='white'%3EST%3C/text%3E%3C/svg%3E`,
      followers: 8234,
    },
    products: [
      {
        id: "prod-1",
        name: "Premium Cotton Hoodie",
        price: 299,
        image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f59e0b' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='60' fill='white'%3E👕%3C/text%3E%3C/svg%3E`,
      },
      {
        id: "prod-2",
        name: "Matching Joggers",
        price: 199,
        image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2310b981' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='60' fill='white'%3E👖%3C/text%3E%3C/svg%3E`,
      },
    ],
  };

  // Load mock comments
  useEffect(() => {
    const mockComments: Comment[] = Array.from({ length: 8 }, (_, i) => ({
      id: `comment-${i}`,
      user: {
        name: ["Mike", "Lisa", "Tom", "Emma", "Jack", "Sara", "David", "Anna"][i],
        avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='50' height='50'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'%3E${["M", "L", "T", "E", "J", "S", "D", "A"][i]}%3C/text%3E%3C/svg%3E`,
      },
      text: [
        "Great quality! Just ordered mine 🔥",
        "Love the color options!",
        "How's the sizing? True to size?",
        "This maker is amazing, highly recommend!",
        "Added to cart, can't wait!",
        "The fabric looks so soft",
        "Perfect for winter!",
        "Best review I've seen today!",
      ][i],
      timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      likes: Math.floor(Math.random() * 50),
    }));
    setComments(mockComments);
  }, []);

  // AI: Deal Cat - bundle suggestion
  useEffect(() => {
    const timer = setTimeout(() => {
      setAiToast({
        message: "🐱 Bundle these 2 products together and save 15%! Total: ¥423 (was ¥498)",
        agent: "Deal Cat",
        products: video.products.map((p) => p.id),
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleFollow = () => {
    setFollowing(!following);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        user: {
          name: "You",
          avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%234f46e5' width='50' height='50'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'%3EY%3C/text%3E%3C/svg%3E`,
        },
        text: commentText,
        timestamp: "just now",
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  const handleAddBundle = () => {
    setAiToast({
      message: "✅ Bundle added to cart with 15% discount!",
      agent: "Deal Cat",
    });
  };

  return (
    <BuyerShell locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Main Column */}
            <div className="space-y-6">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="aspect-video bg-ink-950 rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={video.cover}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-20 w-20 text-white drop-shadow-2xl" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-200 mb-4">{video.title}</h1>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/${locale}/makers/${video.maker.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={video.maker.avatar}
                        alt={video.maker.name}
                        className="w-12 h-12 rounded-full ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all"
                      />
                      <div>
                        <p className="font-semibold text-slate-200 group-hover:text-panda-400 transition-colors">
                          {video.maker.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {video.maker.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={handleFollow}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        following
                          ? "bg-ink-800 text-slate-300"
                          : "bg-panda-500 text-white hover:bg-panda-600"
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      {following ? "Following" : "Follow"}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 transition-colors group"
                    >
                      <Heart
                        className={`h-5 w-5 group-hover:scale-110 transition-transform ${
                          liked ? "fill-red-500 text-red-500" : "text-slate-400"
                        }`}
                      />
                      <span className="text-sm text-slate-300">{likes}</span>
                    </button>
                    <button className="p-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-slate-400 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 pt-4 border-t border-ink-800">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {comments.length} comments
                  </span>
                </div>
              </motion.div>

              {/* Comments Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-bold text-slate-200 mb-4">
                  Comments ({comments.length})
                </h2>

                {/* Comment Input */}
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 rounded-lg bg-ink-850 border border-ink-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-panda-500 transition-colors"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 rounded-lg bg-panda-500 hover:bg-panda-600 disabled:bg-ink-800 disabled:text-slate-600 text-white transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-200 text-sm">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-slate-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{comment.text}</p>
                        <button className="text-xs text-slate-400 hover:text-panda-400 transition-colors flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {comment.likes > 0 && comment.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Attachments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-bold text-slate-200 mb-4">Featured Products</h2>
                <div className="space-y-4">
                  {video.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/${locale}/products/${product.id}`}
                      className="flex gap-3 p-3 rounded-lg bg-ink-850/50 hover:bg-ink-850 transition-colors group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-200 text-sm mb-1 truncate group-hover:text-panda-400 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-lg font-bold text-panda-400">¥{product.price}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic
                          }}
                          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Similar Videos */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-bold text-slate-200 mb-4">Similar Videos</h2>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Link
                      key={i}
                      href={`/${locale}/videos/similar-${i}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-ink-800 group-hover:ring-panda-500 transition-all">
                        <img
                          src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect fill='%23${Math.floor(Math.random() * 16777215).toString(16)}' width='120' height='80'/%3E%3C/svg%3E`}
                          alt="Similar video"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-panda-400 transition-colors">
                          Similar Product Review #{i + 1}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {Math.floor(Math.random() * 50 + 10)}k views
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
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
                  {aiToast.products ? (
                    <button
                      onClick={() => {
                        handleAddBundle();
                        setAiToast(null);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors"
                    >
                      Add Bundle
                    </button>
                  ) : (
                    <button
                      onClick={() => setAiToast(null)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-panda-500 hover:bg-panda-600 text-white text-sm font-medium transition-colors"
                    >
                      Got it!
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
