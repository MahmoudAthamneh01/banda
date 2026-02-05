'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  BadgeCheck,
  X,
  Sparkles,
  ArrowUpDown,
  Package,
  Truck,
} from 'lucide-react';

// Mock Products
const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Bluetooth Earbuds Pro', price: 299, originalPrice: 399, image: '🎧', rating: 4.8, reviews: 234, category: 'electronics', verified: true, badge: 'Trending', shipping: 'CN' },
  { id: 2, name: 'Premium Cotton T-Shirt Pack', price: 89, originalPrice: null, image: '👕', rating: 4.6, reviews: 156, category: 'fashion', verified: true, badge: 'New', shipping: 'UAE' },
  { id: 3, name: 'Smart Home Security Camera', price: 459, originalPrice: 599, image: '📹', rating: 4.9, reviews: 89, category: 'electronics', verified: true, badge: 'Deal', shipping: 'CN' },
  { id: 4, name: 'Industrial Grade Power Tools Set', price: 1299, originalPrice: null, image: '🔧', rating: 4.7, reviews: 67, category: 'industrial', verified: false, badge: null, shipping: 'CN' },
  { id: 5, name: 'Organic Skincare Collection', price: 199, originalPrice: 249, image: '💄', rating: 4.5, reviews: 312, category: 'beauty', verified: true, badge: 'Popular', shipping: 'UAE' },
  { id: 6, name: 'Gaming Mechanical Keyboard RGB', price: 189, originalPrice: null, image: '⌨️', rating: 4.8, reviews: 445, category: 'electronics', verified: true, badge: null, shipping: 'CN' },
  { id: 7, name: 'Modern Minimalist Desk Lamp', price: 79, originalPrice: 99, image: '💡', rating: 4.4, reviews: 78, category: 'home', verified: false, badge: 'New', shipping: 'CN' },
  { id: 8, name: 'Professional Running Shoes', price: 249, originalPrice: null, image: '👟', rating: 4.7, reviews: 201, category: 'sports', verified: true, badge: null, shipping: 'UAE' },
  { id: 9, name: 'Portable Bluetooth Speaker', price: 129, originalPrice: 179, image: '🔊', rating: 4.6, reviews: 167, category: 'electronics', verified: true, badge: 'Deal', shipping: 'CN' },
  { id: 10, name: 'Luxury Leather Wallet', price: 149, originalPrice: null, image: '👛', rating: 4.9, reviews: 89, category: 'fashion', verified: true, badge: null, shipping: 'UAE' },
  { id: 11, name: 'Smart Fitness Watch Pro', price: 399, originalPrice: 499, image: '⌚', rating: 4.8, reviews: 523, category: 'electronics', verified: true, badge: 'Trending', shipping: 'CN' },
  { id: 12, name: 'Ceramic Plant Pots Set', price: 59, originalPrice: null, image: '🪴', rating: 4.3, reviews: 45, category: 'home', verified: false, badge: null, shipping: 'CN' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' },
];

const SORT_OPTIONS = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'newest', name: 'Newest First' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
];

export default function ProductsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showQuickView, setShowQuickView] = useState<number | null>(null);
  const [showAIDealCat, setShowAIDealCat] = useState(false);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [filterChanges, setFilterChanges] = useState(0);

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (verifiedOnly && !p.verified) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  // AI Deal Cat - triggers when user changes filters a lot without buying
  useEffect(() => {
    setFilterChanges(prev => prev + 1);
    if (filterChanges > 3 && !showAIDealCat) {
      setTimeout(() => setShowAIDealCat(true), 2000);
    }
  }, [selectedCategory, priceRange, verifiedOnly]);

  const toggleSaved = (id: number) => {
    setSavedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Products', href: `/${locale}/products` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ===== SEARCH + FILTERS BAR ===== */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-ink-850 text-slate-200 placeholder-slate-400 rounded-xl px-5 py-3 pl-12 border border-border focus:border-panda-500/50 focus:outline-none focus:ring-2 focus:ring-panda-500/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-border text-slate-300 hover:bg-ink-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {(selectedCategory !== 'all' || verifiedOnly) && (
                  <span className="ml-2 bg-panda-500 text-white text-xs rounded-full px-2">
                    {(selectedCategory !== 'all' ? 1 : 0) + (verifiedOnly ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="border-border text-slate-300 hover:bg-ink-800"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-ink-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                    >
                      {SORT_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                            sortBy === option.id 
                              ? 'bg-panda-500/20 text-panda-400' 
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden md:flex bg-ink-850 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-ink-800 text-slate-200' : 'text-slate-400'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-ink-800 text-slate-200' : 'text-slate-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ===== FILTERS PANEL ===== */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-ink-850 border border-border rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedCategory === cat.id
                                ? 'bg-panda-500 text-white'
                                : 'bg-ink-800 text-slate-400 hover:bg-ink-900'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Price Range</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                          className="w-24 bg-ink-800 border border-border rounded-lg px-3 py-2 text-slate-200 text-sm"
                          placeholder="Min"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                          className="w-24 bg-ink-800 border border-border rounded-lg px-3 py-2 text-slate-200 text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Ship From</label>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-sm bg-panda-500/20 text-panda-400">
                          All
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-sm bg-ink-800 text-slate-400 hover:bg-ink-900">
                          🇨🇳 China
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-sm bg-ink-800 text-slate-400 hover:bg-ink-900">
                          🇦🇪 UAE
                        </button>
                      </div>
                    </div>

                    {/* Verified */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Quality</label>
                      <button
                        onClick={() => setVerifiedOnly(!verifiedOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          verifiedOnly
                            ? 'bg-jade-500/20 text-jade-400 border border-jade-500/30'
                            : 'bg-ink-800 text-slate-400 border border-border hover:bg-ink-900'
                        }`}
                      >
                        <BadgeCheck className="h-4 w-4" />
                        Verified Only
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== RESULTS HEADER ===== */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400">
              <span className="text-slate-200 font-medium">{filteredProducts.length}</span> products found
            </p>
          </div>

          {/* ===== PRODUCT GRID ===== */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
              : 'flex flex-col gap-4'
            }>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative bg-ink-850 hover:bg-ink-800 border border-border hover:border-panda-500/30 rounded-2xl overflow-hidden transition-all ${
                    viewMode === 'list' ? 'flex gap-6 p-4' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'} bg-gradient-to-br from-ink-800 to-ink-850 flex items-center justify-center`}>
                    <span className="text-6xl">{product.image}</span>
                    
                    {/* Badge */}
                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        product.badge === 'Trending' ? 'bg-panda-500 text-white' :
                        product.badge === 'New' ? 'bg-sky-500 text-white' :
                        product.badge === 'Deal' ? 'bg-silk-500 text-ink-900' :
                        'bg-jade-500 text-white'
                      }`}>
                        {product.badge}
                      </span>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-ink-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setShowQuickView(product.id)}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleSaved(product.id)}
                        className={`p-3 rounded-full transition-colors ${
                          savedItems.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${savedItems.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : 'p-4'}>
                    <div className="flex items-center gap-2 mb-2">
                      {product.verified && (
                        <BadgeCheck className="h-4 w-4 text-jade-400" />
                      )}
                      <span className="text-xs text-slate-500">{product.shipping === 'CN' ? '🇨🇳' : '🇦🇪'}</span>
                    </div>
                    
                    <Link href={`/${locale}/products/${product.id}`}>
                      <h3 className="text-slate-200 font-medium mb-2 line-clamp-2 hover:text-panda-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-silk-400 fill-silk-400" />
                        <span className="text-sm text-slate-200">{product.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-slate-200">¥{product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-slate-400 line-through">¥{product.originalPrice}</span>
                        )}
                      </div>
                      
                      <Button size="sm" className="bg-panda-500 hover:bg-panda-600 text-white">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">No products found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
              <Button
                variant="outline"
                className="border-white/10 text-slate-300"
                onClick={() => {
                  setSelectedCategory('all');
                  setVerifiedOnly(false);
                  setPriceRange([0, 2000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* ===== LOAD MORE ===== */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/10 px-8">
                Load More Products
              </Button>
            </div>
          )}
        </div>

        {/* ===== QUICK VIEW MODAL ===== */}
        <AnimatePresence>
          {showQuickView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
              onClick={() => setShowQuickView(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-ink-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const product = MOCK_PRODUCTS.find(p => p.id === showQuickView);
                  if (!product) return null;
                  return (
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold text-white">{product.name}</h2>
                        <button onClick={() => setShowQuickView(null)} className="text-slate-400 hover:text-white">
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-xl flex items-center justify-center">
                          <span className="text-8xl">{product.image}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 text-silk-400 fill-silk-400" />
                              <span className="text-white font-medium">{product.rating}</span>
                            </div>
                            <span className="text-slate-400">({product.reviews} reviews)</span>
                            {product.verified && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-jade-500/20 text-jade-400 rounded-full text-xs">
                                <BadgeCheck className="h-3 w-3" /> Verified
                              </span>
                            )}
                          </div>
                          
                          <div className="mb-6">
                            <span className="text-3xl font-bold text-white">¥{product.price}</span>
                            {product.originalPrice && (
                              <span className="ml-3 text-lg text-slate-500 line-through">¥{product.originalPrice}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
                            <Truck className="h-4 w-4" />
                            Ships from {product.shipping === 'CN' ? 'China' : 'UAE'}
                          </div>
                          
                          <div className="flex gap-3">
                            <Button className="flex-1 bg-panda-500 hover:bg-panda-600">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Link href={`/${locale}/products/${product.id}`} className="flex-1">
                              <Button variant="outline" className="w-full border-white/10 text-slate-300">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== AI DEAL CAT POPUP ===== */}
        <AnimatePresence>
          {showAIDealCat && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed bottom-6 right-6 z-40 max-w-sm"
            >
              <div className="bg-gradient-to-br from-silk-500/90 to-panda-500/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🐱</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold text-sm">Deal Cat</h4>
                      <button onClick={() => setShowAIDealCat(false)} className="text-white/60 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      💡 Looking for a good deal? I found a bundle that saves you 15%!
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Show Bundle
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/70 hover:text-white text-xs"
                        onClick={() => setShowAIDealCat(false)}
                      >
                        No thanks
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
