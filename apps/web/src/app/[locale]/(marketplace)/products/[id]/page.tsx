'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  BadgeCheck,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  MessageCircle,
  Sparkles,
  X,
  Send,
  Check,
  Clock,
  Package,
  Zap,
} from 'lucide-react';

// Mock Product Data
const MOCK_PRODUCT = {
  id: 1,
  name: 'Wireless Bluetooth Earbuds Pro X3',
  price: 299,
  originalPrice: 399,
  images: ['🎧', '📦', '🔌', '📱'],
  rating: 4.8,
  reviews: 234,
  category: 'Electronics',
  verified: true,
  badge: 'Trending',
  shipping: 'CN',
  stock: 45,
  sold: 1234,
  description: 'Experience premium wireless audio with the Earbuds Pro X3. Featuring active noise cancellation, 40-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals alike.',
  specs: [
    { label: 'Battery Life', value: '40 hours' },
    { label: 'Noise Cancellation', value: 'Active ANC' },
    { label: 'Water Resistance', value: 'IPX5' },
    { label: 'Bluetooth Version', value: '5.3' },
    { label: 'Driver Size', value: '12mm' },
    { label: 'Charging', value: 'USB-C & Wireless' },
  ],
  variants: {
    colors: ['Black', 'White', 'Navy'],
    sizes: null,
  },
  maker: {
    id: 1,
    name: 'TechZone Factory',
    rating: 4.9,
    responseTime: '< 2 hours',
    verified: true,
  },
  shippingInfo: {
    origin: 'Shenzhen, China',
    estimatedDays: '7-12 days',
    freeShipping: true,
  },
};

const MOCK_REVIEWS = [
  { id: 1, user: 'John D.', rating: 5, date: '2026-01-15', text: 'Amazing sound quality! Best earbuds I\'ve ever owned.', helpful: 23 },
  { id: 2, user: 'Sarah M.', rating: 4, date: '2026-01-10', text: 'Great product, fast shipping. ANC could be slightly better.', helpful: 15 },
  { id: 3, user: 'Mike R.', rating: 5, date: '2026-01-05', text: 'Worth every penny. Battery life is incredible!', helpful: 31 },
];

const SIMILAR_PRODUCTS = [
  { id: 2, name: 'Premium Headphones Studio', price: 459, image: '🎧', rating: 4.7 },
  { id: 3, name: 'Portable Speaker Mini', price: 129, image: '🔊', rating: 4.6 },
  { id: 4, name: 'Smart Watch Pro', price: 399, image: '⌚', rating: 4.8 },
  { id: 5, name: 'Wireless Charger Pad', price: 49, image: '🔌', rating: 4.5 },
];

export default function ProductDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'qa'>('description');
  const [isSaved, setIsSaved] = useState(false);
  const [showAIPanda, setShowAIPanda] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  // Show AI after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowAIPanda(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleAskPanda = () => {
    if (!aiMessage.trim()) return;
    setAiChat([...aiChat, { role: 'user', text: aiMessage }]);
    setTimeout(() => {
      setAiChat(prev => [...prev, { 
        role: 'ai', 
        text: 'Based on your browsing history, this product is a great match for you! The noise cancellation feature is highly rated by users with similar preferences. The 40-hour battery life is also exceptional for this price range.' 
      }]);
    }, 800);
    setAiMessage('');
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Products', href: `/${locale}/products` },
    { label: MOCK_PRODUCT.category, href: `/${locale}/products?category=electronics` },
    { label: MOCK_PRODUCT.name.slice(0, 30) + '...', href: `/${locale}/products/${id}` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ===== MAIN PRODUCT SECTION ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* ===== GALLERY ===== */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-ink-800 to-ink-850 rounded-3xl mb-4 flex items-center justify-center overflow-hidden">
                <motion.span 
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[12rem]"
                >
                  {MOCK_PRODUCT.images[currentImage]}
                </motion.span>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {MOCK_PRODUCT.badge && (
                    <span className="px-3 py-1.5 bg-panda-500 text-white rounded-full text-sm font-medium">
                      {MOCK_PRODUCT.badge}
                    </span>
                  )}
                  {MOCK_PRODUCT.verified && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-jade-500/20 text-jade-400 rounded-full text-sm">
                      <BadgeCheck className="h-4 w-4" /> Verified
                    </span>
                  )}
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={() => setCurrentImage(prev => prev === 0 ? MOCK_PRODUCT.images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-ink-900/80 hover:bg-ink-900 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setCurrentImage(prev => prev === MOCK_PRODUCT.images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-ink-900/80 hover:bg-ink-900 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 justify-center">
                {MOCK_PRODUCT.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl transition-all ${
                      currentImage === i 
                        ? 'bg-panda-500/20 border-2 border-panda-500' 
                        : 'bg-ink-850 border border-border hover:bg-ink-800'
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== CORE PURCHASE PANEL ===== */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                {MOCK_PRODUCT.name}
              </h1>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(MOCK_PRODUCT.rating) ? 'text-silk-400 fill-silk-400' : 'text-slate-400'}`} 
                    />
                  ))}
                  <span className="ml-2 text-slate-200 font-medium">{MOCK_PRODUCT.rating}</span>
                </div>
                <span className="text-slate-400">({MOCK_PRODUCT.reviews} reviews)</span>
                <span className="text-slate-400">|</span>
                <span className="text-jade-400">{MOCK_PRODUCT.sold.toLocaleString()} sold</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-slate-200">¥{MOCK_PRODUCT.price}</span>
                {MOCK_PRODUCT.originalPrice && (
                  <>
                    <span className="text-xl text-slate-400 line-through">¥{MOCK_PRODUCT.originalPrice}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-medium">
                      -{Math.round((1 - MOCK_PRODUCT.price / MOCK_PRODUCT.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Variant Selector */}
              {MOCK_PRODUCT.variants.colors && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">Color: {selectedColor}</label>
                  <div className="flex gap-3">
                    {MOCK_PRODUCT.variants.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-panda-500 text-white'
                            : 'bg-ink-850 text-slate-300 border border-border hover:bg-ink-800'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 text-slate-400 hover:text-white transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-white font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(MOCK_PRODUCT.stock, q + 1))}
                      className="p-3 text-slate-400 hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-slate-400">{MOCK_PRODUCT.stock} available</span>
                </div>
              </div>

              {/* Shipping Estimate */}
              <div className="flex items-center gap-3 p-4 bg-ink-850 border border-border rounded-xl mb-6">
                <Truck className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="text-slate-200 text-sm">
                    {MOCK_PRODUCT.shippingInfo.freeShipping ? 'Free Shipping' : 'Standard Shipping'} • {MOCK_PRODUCT.shippingInfo.estimatedDays}
                  </p>
                  <p className="text-slate-400 text-xs">From {MOCK_PRODUCT.shippingInfo.origin}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="flex-1 bg-panda-500 hover:bg-panda-600 text-white font-bold"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Link href={`/${locale}/checkout?product=${params.id}&qty=${quantity}`}>
                  <Button size="lg" variant="outline" className="border-panda-500/50 text-panda-400 hover:bg-panda-500/10">
                    <Zap className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                </Link>
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-3 rounded-xl transition-all ${
                    isSaved ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 bg-white/5 text-slate-400 hover:bg-white/10 rounded-xl transition-colors">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>

              {/* Trust Layer */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                  <Shield className="h-5 w-5 text-jade-400" />
                  <span className="text-xs text-slate-300">Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                  <RotateCcw className="h-5 w-5 text-sky-400" />
                  <span className="text-xs text-slate-300">14-day Returns</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                  <BadgeCheck className="h-5 w-5 text-panda-400" />
                  <span className="text-xs text-slate-300">Authentic Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== DETAILS TABS ===== */}
          <div className="mb-16">
            {/* Tab Headers */}
            <div className="flex gap-1 border-b border-white/10 mb-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${MOCK_PRODUCT.reviews})` },
                { id: 'qa', label: 'Q&A' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-panda-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl">
              {activeTab === 'description' && (
                <div className="prose prose-invert">
                  <p className="text-slate-300 text-lg leading-relaxed">{MOCK_PRODUCT.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-4">
                  {MOCK_PRODUCT.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-slate-400">{spec.label}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {MOCK_REVIEWS.map(review => (
                    <div key={review.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-panda-500/20 rounded-full flex items-center justify-center text-panda-400 font-bold">
                            {review.user[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{review.user}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-silk-400 fill-silk-400' : 'text-slate-600'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-slate-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-300">{review.text}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                        <button className="hover:text-white transition-colors">👍 Helpful ({review.helpful})</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No questions yet. Be the first to ask!</p>
                  <Button variant="outline" className="border-white/10 text-slate-300">
                    Ask a Question
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ===== MORE LIKE THIS ===== */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SIMILAR_PRODUCTS.map(product => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-panda-500/30 rounded-2xl overflow-hidden transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-panda-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">¥{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-silk-400 fill-silk-400" />
                        <span className="text-sm text-slate-400">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ===== AI HOST PANDA ===== */}
        <AnimatePresence>
          {showAIPanda && !aiChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <div className="bg-gradient-to-br from-panda-500/90 to-sky-500/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🐼</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold text-sm">Host Panda</h4>
                      <button onClick={() => setShowAIPanda(false)} className="text-white/60 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      This product is a great match for you because of its excellent noise cancellation and long battery life! 🎧
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white text-xs"
                      onClick={() => {
                        setAiChatOpen(true);
                        setShowAIPanda(false);
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Ask Panda a Question
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== AI CHAT MODAL ===== */}
        <AnimatePresence>
          {aiChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
              onClick={() => setAiChatOpen(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="bg-ink-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-panda-500 to-sky-500 rounded-full flex items-center justify-center">
                      <span className="text-xl">🐼</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Host Panda</h3>
                      <p className="text-xs text-slate-400">Your shopping assistant</p>
                    </div>
                  </div>
                  <button onClick={() => setAiChatOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Chat */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-panda-500/10 rounded-2xl rounded-tl-sm p-3 mr-12">
                    <p className="text-sm text-slate-300">
                      Hi! I can help you learn more about this product. What would you like to know?
                    </p>
                  </div>
                  
                  {aiChat.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`rounded-2xl p-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-panda-500 text-white ml-12 rounded-tr-sm' 
                          : 'bg-panda-500/10 text-slate-300 mr-12 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Ask about this product..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-panda-500/50"
                      onKeyDown={(e) => e.key === 'Enter' && handleAskPanda()}
                    />
                    <Button onClick={handleAskPanda} className="bg-panda-500 hover:bg-panda-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BuyerShell>
  );
}
