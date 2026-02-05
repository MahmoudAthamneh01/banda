'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
  Copy,
  Check,
  MessageSquare,
  RotateCcw,
  MapPin,
  CreditCard,
  Shield,
  FileText,
  Download,
  AlertTriangle,
  Phone,
  ArrowLeft,
  ExternalLink,
  Star,
} from 'lucide-react';

// Mock Order Detail
const ORDER = {
  id: 'BC-20240115-78453',
  status: 'shipped',
  date: '2024-01-15',
  total: 937,
  subtotal: 925,
  shipping: 12,
  discount: 0,
  paymentMethod: 'Alipay ****8901',
  shippingAddress: {
    name: '张伟',
    phone: '+86 138 0000 1234',
    address: '上海市浦东新区陆家嘴环路1000号',
  },
  items: [
    { id: 1, name: 'Wireless Bluetooth Earbuds Pro X3', image: '🎧', price: 299, quantity: 1, variant: 'Black', maker: 'TechZone Factory' },
    { id: 2, name: 'Premium Cotton T-Shirt Pack', image: '👕', price: 89, quantity: 2, variant: 'Medium / White', maker: 'Fashion Forward' },
    { id: 3, name: 'Smart Home Security Camera', image: '📹', price: 459, quantity: 1, variant: 'Standard', maker: 'TechZone Factory' },
  ],
  tracking: {
    carrier: 'SF Express',
    number: 'SF1234567890',
    eta: 'January 18, 2024',
  },
};

const TIMELINE = [
  { 
    id: 1, 
    status: 'Order Placed', 
    description: 'Your order has been received and confirmed.',
    date: 'Jan 15, 2024 at 10:23 AM',
    completed: true 
  },
  { 
    id: 2, 
    status: 'Payment Confirmed', 
    description: 'Payment via Alipay was successful.',
    date: 'Jan 15, 2024 at 10:25 AM',
    completed: true 
  },
  { 
    id: 3, 
    status: 'Processing', 
    description: 'Seller is preparing your order.',
    date: 'Jan 15, 2024 at 2:30 PM',
    completed: true 
  },
  { 
    id: 4, 
    status: 'Shipped', 
    description: 'Your package is on its way! Tracking: SF1234567890',
    date: 'Jan 16, 2024 at 9:15 AM',
    completed: true,
    current: true 
  },
  { 
    id: 5, 
    status: 'Out for Delivery', 
    description: 'Package is out for delivery.',
    date: '',
    completed: false 
  },
  { 
    id: 6, 
    status: 'Delivered', 
    description: 'Package has been delivered.',
    date: '',
    completed: false 
  },
];

export default function OrderDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const copyTracking = () => {
    navigator.clipboard.writeText(ORDER.tracking.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Orders', href: `/${locale}/orders` },
    { label: ORDER.id, href: `/${locale}/orders/${ORDER.id}` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ===== HEADER ===== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Link href={`/${locale}/orders`} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Order {ORDER.id}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-sky-500/20 text-sky-400">
                  <Truck className="h-4 w-4" />
                  Shipped
                </span>
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </Button>
              <Button variant="outline" className="border-border">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== MAIN CONTENT ===== */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Timeline Tracker */}
              <div className="bg-ink-850 border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-sky-400" />
                  Shipment Tracking
                </h2>

                {/* Tracking Info */}
                <div className="flex items-center justify-between bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">{ORDER.tracking.number}</span>
                      <button 
                        onClick={copyTracking}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white"
                      >
                        {copied ? <Check className="h-3 w-3 text-jade-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Est. Delivery</p>
                    <p className="text-white font-medium">{ORDER.tracking.eta}</p>
                  </div>
                  <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {TIMELINE.map((step, index) => (
                    <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                      {/* Line & Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? step.current 
                              ? 'bg-sky-500 ring-4 ring-sky-500/30' 
                              : 'bg-jade-500'
                            : 'bg-white/10'
                        }`}>
                          {step.completed && !step.current && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        {index < TIMELINE.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${step.completed ? 'bg-jade-500' : 'bg-white/10'}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <h4 className={`font-medium ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                          {step.status}
                        </h4>
                        <p className="text-sm text-slate-400 mt-0.5">{step.description}</p>
                        {step.date && (
                          <p className="text-xs text-slate-500 mt-1">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Order Items ({ORDER.items.length})</h2>
                <div className="space-y-4">
                  {ORDER.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                        <span className="text-3xl">{item.image}</span>
                      </div>
                      <div className="flex-1">
                        <Link href={`/${locale}/products/${item.id}`} className="text-white font-medium hover:text-panda-400">
                          {item.name}
                        </Link>
                        <p className="text-sm text-slate-500">{item.variant} • {item.maker}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">¥{item.price * item.quantity}</p>
                        <p className="text-xs text-slate-500">×{item.quantity}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-amber-400">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Payment Summary */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-panda-400" />
                  Payment Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">¥{ORDER.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span className="text-white">¥{ORDER.shipping}</span>
                  </div>
                  {ORDER.discount > 0 && (
                    <div className="flex justify-between text-jade-400">
                      <span>Discount</span>
                      <span>-¥{ORDER.discount}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-white">¥{ORDER.total}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Payment Method</p>
                  <p className="text-white text-sm">{ORDER.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-jade-400" />
                  Shipping Address
                </h3>
                <div className="text-sm">
                  <p className="text-white font-medium">{ORDER.shippingAddress.name}</p>
                  <p className="text-slate-400 mt-1">{ORDER.shippingAddress.phone}</p>
                  <p className="text-slate-400 mt-2">{ORDER.shippingAddress.address}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-white/10 text-slate-300">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
                    Report an Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/10 text-slate-300">
                    <RotateCcw className="h-4 w-4 mr-2 text-sky-400" />
                    Request Return
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/10 text-slate-300">
                    <Phone className="h-4 w-4 mr-2 text-jade-400" />
                    Call Support
                  </Button>
                </div>
              </div>

              {/* Escrow Protection */}
              <div className="bg-jade-500/10 border border-jade-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-jade-400" />
                  <div>
                    <h4 className="text-white font-semibold">Escrow Protected</h4>
                    <p className="text-sm text-jade-300/80">Your payment is held safely until delivery confirmed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuyerShell>
  );
}
