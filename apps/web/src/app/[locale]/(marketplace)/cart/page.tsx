'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Shield,
  RotateCcw,
  BadgeCheck,
  Truck,
  Tag,
  X,
  Gift,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

// Mock Cart Data
const INITIAL_CART_ITEMS = [
  { 
    id: 1, 
    name: 'Wireless Bluetooth Earbuds Pro X3', 
    price: 299, 
    quantity: 1, 
    image: '🎧',
    variant: 'Black',
    maker: 'TechZone Factory',
    shipping: 12,
    verified: true,
  },
  { 
    id: 2, 
    name: 'Premium Cotton T-Shirt Pack', 
    price: 89, 
    quantity: 2, 
    image: '👕',
    variant: 'Medium / White',
    maker: 'Fashion Forward',
    shipping: 8,
    verified: true,
  },
  { 
    id: 3, 
    name: 'Smart Home Security Camera', 
    price: 459, 
    quantity: 1, 
    image: '📹',
    variant: 'Standard',
    maker: 'TechZone Factory',
    shipping: 0, // Free shipping
    verified: true,
  },
];

const CROSS_SELL_ITEMS = [
  { id: 10, name: 'Wireless Charging Pad', price: 49, image: '🔌', discount: '20% OFF' },
  { id: 11, name: 'Protective Case Bundle', price: 29, image: '🛡️', discount: 'Best Seller' },
  { id: 12, name: 'Premium Audio Cable', price: 19, image: '🔊', discount: 'Add-on Deal' },
];

export default function CartPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showAIDealCat, setShowAIDealCat] = useState(false);
  const [aiDismissed, setAiDismissed] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalShipping = cartItems.reduce((sum, item) => sum + item.shipping, 0);
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal + totalShipping - discount;

  // AI Deal Cat - triggers after 3-5s of dwelling without checkout
  useEffect(() => {
    if (cartItems.length === 0 || aiDismissed) return;
    
    const timer = setTimeout(() => {
      setShowAIDealCat(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [cartItems, aiDismissed]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setCouponApplied(true);
      setCouponDiscount(Math.round(subtotal * 0.1));
    }
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Cart', href: `/${locale}/cart` },
  ];

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-ink-850 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-3">Your cart is empty</h2>
            <p className="text-slate-300 mb-8">Looks like you haven't added anything yet</p>
            <Link href={`/${locale}/products`}>
              <Button size="lg" className="bg-panda-500 hover:bg-panda-600">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </BuyerShell>
    );
  }

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart ({cartItems.length})</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== CART ITEMS ===== */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-ink-850 border border-border rounded-2xl p-6"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-ink-800 to-ink-850 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl">{item.image}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/${locale}/products/${item.id}`}>
                            <h3 className="text-slate-200 font-medium hover:text-panda-400 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-slate-400">{item.variant}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {item.verified && (
                          <span className="flex items-center gap-1 text-xs text-jade-400">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-xs text-slate-500">by {item.maker}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center bg-ink-800 border border-border rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-white font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">¥{item.price * item.quantity}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-slate-500">¥{item.price} each</p>
                          )}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Truck className="h-3 w-3" />
                        {item.shipping === 0 ? (
                          <span className="text-jade-400">Free Shipping</span>
                        ) : (
                          <span>Shipping: ¥{item.shipping}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* ===== CROSS-SELLS ===== */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-silk-400" />
                  Complete Your Set
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {CROSS_SELL_ITEMS.map(item => (
                    <div key={item.id} className="bg-ink-850 border border-border rounded-xl p-4 hover:bg-ink-800 transition-all">
                      <div className="aspect-square bg-gradient-to-br from-ink-800 to-ink-850 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-4xl">{item.image}</span>
                      </div>
                      <span className="text-xs text-panda-400 font-medium">{item.discount}</span>
                      <h4 className="text-sm text-white font-medium mt-1 line-clamp-1">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white font-bold">¥{item.price}</span>
                        <Button size="sm" variant="ghost" className="text-panda-400 hover:text-panda-300 text-xs p-0">
                          + Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== ORDER SUMMARY ===== */}
            <div className="lg:col-span-1">
              <div className="bg-ink-850 border border-border rounded-2xl p-6 sticky top-32">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="w-full bg-ink-800 border border-border rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-panda-500/50"
                        disabled={couponApplied}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-white/10 text-slate-300"
                      onClick={applyCoupon}
                      disabled={couponApplied}
                    >
                      {couponApplied ? 'Applied!' : 'Apply'}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-jade-400 mt-2">✓ Coupon SAVE10 applied! You saved ¥{couponDiscount}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-200">¥{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className="text-slate-200">{totalShipping === 0 ? 'Free' : `¥${totalShipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-jade-400">
                      <span>Discount</span>
                      <span>-¥{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-lg font-bold text-slate-200">Total</span>
                    <span className="text-2xl font-bold text-slate-200">¥{total}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link href={`/${locale}/checkout`}>
                  <Button size="lg" className="w-full bg-panda-500 hover:bg-panda-600 font-bold">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                {/* Trust */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Shield className="h-4 w-4 text-jade-400" />
                    <span>Secure checkout with escrow protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <RotateCcw className="h-4 w-4 text-sky-400" />
                    <span>Easy returns within 14 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== AI DEAL CAT ===== */}
        <AnimatePresence>
          {showAIDealCat && !aiDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 50 }}
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
                      <button 
                        onClick={() => {
                          setShowAIDealCat(false);
                          setAiDismissed(true);
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      🎉 Checkout now and unlock <strong>free express shipping</strong> on your order!
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/${locale}/checkout`}>
                        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Checkout Now
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/70 hover:text-white text-xs"
                        onClick={() => setShowAIDealCat(false)}
                      >
                        Maybe later
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
