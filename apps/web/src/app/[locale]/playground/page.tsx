'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './playground.css';
import { 
  Search, Filter, Bell, MessageSquare, ShoppingCart, 
  Heart, Share2, Plus, TrendingUp, Zap, Gift, Star,
  X, ChevronDown, Sparkles, Package, Eye
} from 'lucide-react';
import { Button, Card, CardContent, Badge, Input } from '@bandachao/ui';
import Image from 'next/image';
import { use } from 'react';

type PlaygroundItemType = 'product' | 'video' | 'maker' | 'batch';

interface PlaygroundItem {
  id: string;
  type: PlaygroundItemType;
  title: string;
  price?: number;
  media: string[];
  badges?: string[];
  maker?: string;
  likes?: number;
  saved?: boolean;
  inStock?: boolean;
  trending?: boolean;
  resellPotential?: number;
}

const HERO_STRIPS = [
  { id: 'drop', label: "Today's Drop", icon: Zap, color: 'from-amber-500 to-orange-500' },
  { id: 'makers', label: 'Top Makers', icon: Star, color: 'from-purple-500 to-pink-500' },
  { id: 'deals', label: 'Hot Deals', icon: TrendingUp, color: 'from-red-500 to-rose-500' },
  { id: 'resell', label: 'Resell Picks', icon: Package, color: 'from-green-500 to-emerald-500' },
  { id: 'fortune', label: 'Daily Fortune', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
];

const TABS = ['For You', 'Trending', 'Categories', 'Flash Drops', 'Mystery Boxes'];

interface PlaygroundPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { locale } = use(params);
  const [activeTab, setActiveTab] = useState('For You');
  const [filterOpen, setFilterOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<PlaygroundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiToast, setAiToast] = useState<{ message: string; agent: string } | null>(null);
  const [userActionCount, setUserActionCount] = useState(0);
  const [hasCompletedKYC, setHasCompletedKYC] = useState(false);
  const [resellModalOpen, setResellModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlaygroundItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  // Mock data generation
  useEffect(() => {
    const mockItems: PlaygroundItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      type: ['product', 'video', 'maker', 'batch'][Math.floor(Math.random() * 4)] as PlaygroundItemType,
      title: `Amazing Product ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 100,
      media: [`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='${Math.floor(Math.random() * 200) + 300}'%3E%3Crect width='300' height='${Math.floor(Math.random() * 200) + 300}' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3EProduct ${i + 1}%3C/text%3E%3C/svg%3E`],
      badges: Math.random() > 0.5 ? ['Verified', 'Trending'] : ['In Stock'],
      maker: `Maker ${Math.floor(Math.random() * 10) + 1}`,
      likes: Math.floor(Math.random() * 1000),
      saved: false,
      inStock: Math.random() > 0.3,
      trending: Math.random() > 0.7,
      resellPotential: Math.floor(Math.random() * 100),
    }));
    
    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 1000);
  }, [activeTab]);

  // AI triggers
  useEffect(() => {
    // Chatty Bird - first visit today
    const lastVisit = localStorage.getItem('playground_last_visit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      setTimeout(() => {
        setAiToast({
          message: '🐦 3 makers trending now! Check "Top Makers"',
          agent: 'Chatty Bird'
        });
        localStorage.setItem('playground_last_visit', today);
      }, 2000);
    }

    // Deal Cat - user hovering simulation
    const hoverTimer = setTimeout(() => {
      setAiToast({
        message: '🐱 Want a bundle deal? I can help you save 15%!',
        agent: 'Deal Cat'
      });
    }, 8000);

    // Host Panda - KYC reminder
    if (!hasCompletedKYC) {
      const kycTimer = setTimeout(() => {
        setAiToast({
          message: '🐼 Complete KYC to unlock rewards and earn points!',
          agent: 'Host Panda'
        });
      }, 15000);
      
      return () => {
        clearTimeout(hoverTimer);
        clearTimeout(kycTimer);
      };
    }

    return () => clearTimeout(hoverTimer);
  }, [hasCompletedKYC]);

  // Style Guru - after 8+ actions
  useEffect(() => {
    if (userActionCount >= 8) {
      setAiToast({
        message: '✨ Based on your taste, I found 12 items you might love!',
        agent: 'Style Guru'
      });
    }
  }, [userActionCount]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current || loading || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setTimeout(() => {
      const newItems: PlaygroundItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: `item-${items.length + i}`,
        type: ['product', 'video', 'maker', 'batch'][Math.floor(Math.random() * 4)] as PlaygroundItemType,
        title: `Amazing Product ${items.length + i + 1}`,
        price: Math.floor(Math.random() * 1000) + 100,
        media: [`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='${Math.floor(Math.random() * 200) + 300}'%3E%3Crect width='300' height='${Math.floor(Math.random() * 200) + 300}' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3EProduct ${items.length + i + 1}%3C/text%3E%3C/svg%3E`],
        badges: Math.random() > 0.5 ? ['Verified', 'Trending'] : ['In Stock'],
        maker: `Maker ${Math.floor(Math.random() * 10) + 1}`,
        likes: Math.floor(Math.random() * 1000),
        saved: false,
        inStock: Math.random() > 0.3,
        trending: Math.random() > 0.7,
        resellPotential: Math.floor(Math.random() * 100),
      }));
      
      setItems([...items, ...newItems]);
      setLoading(false);
      
      if (items.length >= 50) {
        setHasMore(false);
      }
    }, 1000);
  };

  const handleSave = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, saved: !item.saved } : item
    ));
    setUserActionCount(prev => prev + 1);
  };

  const handleAddToCart = (id: string) => {
    setCartCount(prev => prev + 1);
    setUserActionCount(prev => prev + 1);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      const mockItems: PlaygroundItem[] = Array.from({ length: 20 }, (_, i) => ({
        id: `item-${i}`,
        type: ['product', 'video', 'maker', 'batch'][Math.floor(Math.random() * 4)] as PlaygroundItemType,
        title: `Amazing Product ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 100,
        media: [`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='${Math.floor(Math.random() * 200) + 300}'%3E%3Crect width='300' height='${Math.floor(Math.random() * 200) + 300}' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3EProduct ${i + 1}%3C/text%3E%3C/svg%3E`],
        badges: Math.random() > 0.5 ? ['Verified', 'Trending'] : ['In Stock'],
        maker: `Maker ${Math.floor(Math.random() * 10) + 1}`,
        likes: Math.floor(Math.random() * 1000),
        saved: false,
        inStock: Math.random() > 0.3,
        trending: Math.random() > 0.7,
        resellPotential: Math.floor(Math.random() * 100),
      }));
      setItems(mockItems);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur-xl border-b border-ink-800">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="text-xl font-bold bg-gradient-to-r from-panda-400 to-silk-400 bg-clip-text text-transparent">
              Playground
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, makers, batches…"
                  className="pl-10 bg-ink-800 border-ink-700 text-slate-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilterOpen(true)}
                className="text-slate-400 hover:text-slate-200"
              >
                <Filter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative text-slate-400 hover:text-slate-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-4 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'text-panda-400 border-b-2 border-panda-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Strip */}
        <div className="max-w-[1920px] mx-auto px-4 py-6">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            {HERO_STRIPS.map((strip) => {
              const Icon = strip.icon;
              return (
                <motion.button
                  key={strip.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl bg-gradient-to-r ${strip.color} text-white font-medium shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{strip.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-4 pb-20">
          <div className="flex gap-6">
            {/* Main Grid */}
            <div className="flex-1">
              {loading && items.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-ink-850 rounded-2xl h-80" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">😵</div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">Couldn't load feed</h3>
                  <p className="text-slate-400 mb-6">Something went wrong. Please try again.</p>
                  <Button onClick={handleRetry} className="bg-panda-600 hover:bg-panda-700">
                    Retry
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">No items match your filters</h3>
                  <p className="text-slate-400 mb-6">Try adjusting your filters or explore trending items</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setFilterOpen(true)} variant="outline">
                      Reset Filters
                    </Button>
                    <Button onClick={() => setActiveTab('Trending')} className="bg-panda-600 hover:bg-panda-700">
                      View Trending
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((item, index) => (
                      <PlaygroundCard
                        key={item.id}
                        item={item}
                        index={index}
                        onSave={handleSave}
                        onAddToCart={handleAddToCart}
                        onResell={(item) => {
                          setSelectedItem(item);
                          setResellModalOpen(true);
                        }}
                        onReview={(item) => {
                          setSelectedItem(item);
                          setReviewModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Loading more indicator */}
                  {loading && items.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-ink-850 rounded-2xl h-80" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!hasMore && (
                    <div className="text-center py-8 text-slate-400">
                      You've reached the end! 🎉
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Gamification Sidebar */}
            <div className="hidden xl:block w-80 space-y-4">
              <Card className="bg-ink-900 border-ink-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl">🐼</div>
                    <div>
                      <h3 className="font-semibold text-slate-200">Hungry Panda</h3>
                      <p className="text-xs text-slate-400">Daily Feed</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-ink-850 rounded-xl">
                      <p className="text-sm text-slate-300">5 new products match your taste!</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-panda-500 to-silk-500">
                      View Feed
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-ink-900 border-ink-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl">🧧</div>
                    <div>
                      <h3 className="font-semibold text-slate-200">Red Packets</h3>
                      <p className="text-xs text-slate-400">Hongbao Rewards</p>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-red-500">¥50</div>
                    <p className="text-sm text-slate-400 mt-1">Available to claim</p>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Claim Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-ink-900 border-ink-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h3 className="font-semibold text-slate-200">Daily Fortune</h3>
                      <p className="text-xs text-slate-400">Your luck today</p>
                    </div>
                  </div>
                  <div className="text-center py-6">
                    <div className="text-6xl mb-2">🍀</div>
                    <p className="text-lg font-medium text-green-400">Great Fortune</p>
                    <p className="text-sm text-slate-400 mt-2">
                      Perfect day for shopping!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* AI Toast */}
        <AnimatePresence>
          {aiToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 right-6 z-50 max-w-md"
            >
              <Card className="bg-gradient-to-r from-panda-900 to-silk-900 border-panda-500 shadow-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {aiToast.agent === 'Deal Cat' && '🐱'}
                      {aiToast.agent === 'Chatty Bird' && '🐦'}
                      {aiToast.agent === 'Style Guru' && '✨'}
                      {aiToast.agent === 'Host Panda' && '🐼'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200 mb-1">
                        {aiToast.agent}
                      </p>
                      <p className="text-sm text-slate-300">{aiToast.message}</p>
                    </div>
                    <button
                      onClick={() => setAiToast(null)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 bg-panda-600 hover:bg-panda-700">
                      Sure!
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAiToast(null)}
                      className="text-slate-300"
                    >
                      Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Drawer */}
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

        {/* Cart Drawer */}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} count={cartCount} />

        {/* Resell Intent Modal */}
        <ResellModal 
          open={resellModalOpen} 
          onClose={() => setResellModalOpen(false)} 
          item={selectedItem}
        />

        {/* Quick Review Modal */}
        <ReviewModal 
          open={reviewModalOpen} 
          onClose={() => setReviewModalOpen(false)} 
          item={selectedItem}
        />

        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-ink-900 border-t border-ink-800 md:hidden">
          <div className="flex justify-around py-2">
            {['Home', 'Square', 'Playground', 'Cart', 'Profile'].map((item) => (
              <button
                key={item}
                className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400"
              >
                <div className="h-6 w-6" />
                <span className="text-xs">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
  );
}

// Playground Card Component
function PlaygroundCard({ 
  item, 
  index,
  onSave, 
  onAddToCart,
  onResell,
  onReview
}: { 
  item: PlaygroundItem; 
  index: number;
  onSave: (id: string) => void;
  onAddToCart: (id: string) => void;
  onResell?: (item: PlaygroundItem) => void;
  onReview?: (item: PlaygroundItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const height = 250 + (index % 3) * 50; // Masonry effect

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Card className="overflow-hidden bg-ink-900 border-ink-800 hover:border-panda-500 transition-all">
        <div className="relative" style={{ height: `${height}px` }}>
          <Image
            src={item.media[0]}
            alt={item.title}
            fill
            unoptimized
            className="object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {item.badges?.map((badge) => (
              <Badge key={badge} className="bg-black/50 text-white text-xs">
                {badge}
              </Badge>
            ))}
          </div>

          {/* Quick Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onSave(item.id)}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Heart className={`h-5 w-5 ${item.saved ? 'fill-red-500' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onAddToCart(item.id)}
                  className="bg-panda-600 hover:bg-panda-700 text-white"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-3">
          <h3 className="font-medium text-slate-200 text-sm line-clamp-2 mb-1">
            {item.title}
          </h3>
          {item.price && (
            <div className="flex items-center justify-between">
              <span className="text-panda-400 font-bold">¥{item.price}</span>
              {item.resellPotential && item.resellPotential > 70 && (
                <Badge className="bg-green-900 text-green-300 text-xs">
                  +{item.resellPotential}% ROI
                </Badge>
              )}
            </div>
          )}
          {item.maker && (
            <p className="text-xs text-slate-400 mt-1">{item.maker}</p>
          )}
          
          {/* Quick actions */}
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="flex-1 text-xs"
              onClick={() => onResell?.(item)}
            >
              Resell
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="flex-1 text-xs"
              onClick={() => onReview?.(item)}
            >
              Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Filter Drawer Component
function FilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ink-900 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-200">Filters</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-200 mb-3">Category</h3>
                  <div className="space-y-2">
                    {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-slate-300">
                        <input type="checkbox" className="rounded" />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-200 mb-3">Price Range</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" className="bg-ink-850" />
                    <Input placeholder="Max" type="number" className="bg-ink-850" />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-200 mb-3">Options</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>Verified only</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>In stock</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>Trending</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>High resell potential</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-200 mb-3">Sort By</h3>
                  <select className="w-full bg-ink-850 border-ink-700 rounded-xl p-2 text-slate-200">
                    <option>Popular</option>
                    <option>New</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Reset
                </Button>
                <Button onClick={onClose} className="flex-1 bg-panda-600 hover:bg-panda-700">
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Cart Drawer Component
function CartDrawer({ open, onClose, count }: { open: boolean; onClose: () => void; count: number }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ink-900 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-200">Cart ({count})</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {count === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Your cart is empty</p>
                  <Button onClick={onClose} className="mt-4">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {/* Mock cart items */}
                    {Array.from({ length: count }).map((_, i) => (
                      <Card key={i} className="bg-ink-850 border-ink-800">
                        <CardContent className="p-4 flex gap-4">
                          <div className="w-20 h-20 bg-ink-800 rounded-xl" />
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-200">Product {i + 1}</h4>
                            <p className="text-sm text-slate-400">¥299</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button size="sm" variant="outline">-</Button>
                              <span className="text-slate-200">1</span>
                              <Button size="sm" variant="outline">+</Button>
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-300">
                            <X className="h-5 w-5" />
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="border-t border-ink-800 pt-4 mb-4">
                    <div className="flex justify-between text-lg font-bold text-slate-200">
                      <span>Total</span>
                      <span>¥{count * 299}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-panda-600 hover:bg-panda-700 text-lg py-6">
                    Go to Checkout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Resell Intent Modal
function ResellModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: PlaygroundItem | null }) {
  const [margin, setMargin] = useState(20);
  const [timeframe, setTimeframe] = useState('3-months');

  if (!item) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="bg-ink-900 border-ink-800 max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-200">Resell Intent</h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-200 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-400">Purchase Price: ¥{item.price}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Expected Margin (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>0%</span>
                      <span className="text-panda-400 font-bold">{margin}%</span>
                      <span>100%</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Estimated Sell Price: ¥{Math.round(item.price! * (1 + margin / 100))}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Timeframe
                    </label>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full bg-ink-850 border-ink-700 rounded-xl p-2 text-slate-200"
                    >
                      <option value="1-month">1 Month</option>
                      <option value="3-months">3 Months</option>
                      <option value="6-months">6 Months</option>
                      <option value="1-year">1 Year</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700">
                      Save Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Quick Review Modal
function ReviewModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: PlaygroundItem | null }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  if (!item) return null;

  const handleSubmit = () => {
    // Mock review submission
    console.log('Review submitted:', { item: item.id, rating, review });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="bg-ink-900 border-ink-800 max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-200">Quick Review</h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-200 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-400">Share your experience</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-3xl transition-all hover:scale-110"
                        >
                          {star <= rating ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Tell us what you think..."
                      rows={4}
                      className="w-full bg-ink-850 border-ink-700 rounded-xl p-3 text-slate-200 resize-none"
                    />
                  </div>

                  <div className="bg-panda-900/20 border border-panda-500/30 rounded-xl p-3">
                    <p className="text-sm text-panda-300">
                      🎁 Earn +50 points for your review!
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={rating === 0}
                      className="flex-1 bg-panda-600 hover:bg-panda-700"
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
