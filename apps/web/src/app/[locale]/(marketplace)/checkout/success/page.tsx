'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  ArrowRight,
  Copy,
  Check,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Gift,
  Share2,
} from 'lucide-react';

const ORDER_DETAILS = {
  orderNumber: 'BC-20240115-78453',
  total: 937,
  items: 3,
  estimatedDelivery: '3-5 business days',
  shippingAddress: '上海市浦东新区陆家嘴环路1000号',
};

const TIMELINE_STEPS = [
  { id: 1, name: 'Order Placed', status: 'complete', time: 'Just now' },
  { id: 2, name: 'Payment Confirmed', status: 'current', time: 'Processing' },
  { id: 3, name: 'Preparing Shipment', status: 'upcoming', time: '' },
  { id: 4, name: 'Out for Delivery', status: 'upcoming', time: '' },
  { id: 5, name: 'Delivered', status: 'upcoming', time: '' },
];

export default function CheckoutSuccessPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(ORDER_DETAILS.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Order Confirmed', href: `/${locale}/checkout/success` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#10b981', '#22d3ee', '#f59e0b', '#8b5cf6', '#ec4899']}
        />
      )}

      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* ===== SUCCESS HEADER ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-jade-500 to-jade-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-jade-500/30">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Order Confirmed! 🎉</h1>
            <p className="text-lg text-slate-400">
              Thank you for your purchase. Your order is being processed.
            </p>
          </motion.div>

          {/* ===== ORDER CARD ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-ink-850 border border-border rounded-2xl p-8 mb-8"
          >
            {/* Order Number */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <div>
                <p className="text-sm text-slate-400 mb-1">Order Number</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-slate-200">{ORDER_DETAILS.orderNumber}</span>
                  <button 
                    onClick={copyOrderNumber}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-jade-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Total Paid</p>
                <span className="text-2xl font-bold text-slate-200">¥{ORDER_DETAILS.total}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-ink-800 rounded-xl">
                <Package className="h-6 w-6 text-panda-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Items</p>
                <p className="text-lg font-bold text-slate-200">{ORDER_DETAILS.items}</p>
              </div>
              <div className="text-center p-4 bg-ink-800 rounded-xl">
                <Truck className="h-6 w-6 text-sky-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Delivery</p>
                <p className="text-lg font-bold text-slate-200">3-5 days</p>
              </div>
              <div className="text-center p-4 bg-ink-800 rounded-xl">
                <Clock className="h-6 w-6 text-silk-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Status</p>
                <p className="text-lg font-bold text-jade-400">Processing</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-2">Shipping to</p>
              <p className="text-slate-200">{ORDER_DETAILS.shippingAddress}</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              <p className="text-sm text-slate-400 mb-4">Order Progress</p>
              <div className="flex items-center justify-between">
                {TIMELINE_STEPS.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center relative flex-1">
                    {/* Connector Line */}
                    {index > 0 && (
                      <div 
                        className={`absolute top-3 right-1/2 w-full h-0.5 ${
                          step.status === 'complete' || step.status === 'current' 
                            ? 'bg-jade-500' 
                            : 'bg-white/10'
                        }`}
                      />
                    )}
                    
                    {/* Step Circle */}
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${
                        step.status === 'complete' 
                          ? 'bg-jade-500' 
                          : step.status === 'current'
                            ? 'bg-panda-500 ring-4 ring-panda-500/30'
                            : 'bg-white/10'
                      }`}
                    >
                      {step.status === 'complete' && <Check className="h-3 w-3 text-white" />}
                      {step.status === 'current' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs mt-2 text-center ${
                      step.status === 'complete' || step.status === 'current'
                        ? 'text-slate-200'
                        : 'text-slate-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ===== AI CONGRATULATION ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-panda-500/20 to-jade-500/20 border border-panda-500/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🐼</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Host Panda says...</h3>
                <p className="text-slate-300">
                  "Great choice! 🎉 Your order includes verified products from trusted makers. 
                  I'll keep you updated on your delivery. Need anything? I'm always here!"
                </p>
              </div>
            </div>
          </motion.div>

          {/* ===== ACTIONS ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          >
            <Link href={`/${locale}/orders`}>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </Link>
            <Link href={`/${locale}/messages`}>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </Link>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href={`/${locale}/products`}>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop More
              </Button>
            </Link>
          </motion.div>

          {/* ===== REFERRAL CTA ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-silk-500/20 to-panda-500/20 border border-silk-500/30 rounded-2xl p-6 text-center"
          >
            <Gift className="h-10 w-10 text-silk-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Earn ¥50 for every friend!</h3>
            <p className="text-slate-400 mb-4">Share your referral link and earn rewards when friends make their first purchase.</p>
            <Button className="bg-silk-500 hover:bg-silk-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Get Referral Link
            </Button>
          </motion.div>

        </div>
      </div>
    </BuyerShell>
  );
}
