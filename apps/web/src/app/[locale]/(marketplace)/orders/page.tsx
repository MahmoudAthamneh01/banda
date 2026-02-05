'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
  RotateCcw,
  X,
  Sparkles,
  Eye,
} from 'lucide-react';

// Mock Orders Data
const MOCK_ORDERS = [
  {
    id: 'BC-20240115-78453',
    status: 'processing',
    statusLabel: 'Processing',
    date: '2024-01-15',
    total: 937,
    items: [
      { id: 1, name: 'Wireless Bluetooth Earbuds Pro X3', image: '🎧', price: 299, quantity: 1 },
      { id: 2, name: 'Premium Cotton T-Shirt Pack', image: '👕', price: 89, quantity: 2 },
      { id: 3, name: 'Smart Home Security Camera', image: '📹', price: 459, quantity: 1 },
    ],
    maker: 'TechZone Factory',
    eta: '3-5 days',
  },
  {
    id: 'BC-20240110-65821',
    status: 'shipped',
    statusLabel: 'Shipped',
    date: '2024-01-10',
    total: 1299,
    items: [
      { id: 4, name: 'Pro Gaming Mechanical Keyboard', image: '⌨️', price: 799, quantity: 1 },
      { id: 5, name: 'RGB Gaming Mouse', image: '🖱️', price: 500, quantity: 1 },
    ],
    maker: 'GamerGear Pro',
    eta: 'Tomorrow',
    trackingNumber: 'SF1234567890',
  },
  {
    id: 'BC-20240105-42156',
    status: 'delivered',
    statusLabel: 'Delivered',
    date: '2024-01-05',
    total: 459,
    items: [
      { id: 6, name: 'Organic Green Tea Collection', image: '🍵', price: 199, quantity: 1 },
      { id: 7, name: 'Ceramic Tea Set', image: '☕', price: 260, quantity: 1 },
    ],
    maker: 'Tea Masters',
    deliveredDate: '2024-01-08',
  },
  {
    id: 'BC-20231228-31489',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    date: '2023-12-28',
    total: 2499,
    items: [
      { id: 8, name: 'Smart Drone 4K Camera', image: '🚁', price: 2499, quantity: 1 },
    ],
    maker: 'SkyTech Innovations',
    cancelReason: 'Out of stock',
  },
];

const STATUS_TABS = [
  { id: 'all', label: 'All Orders', count: 4 },
  { id: 'active', label: 'Active', count: 2 },
  { id: 'delivered', label: 'Delivered', count: 1 },
  { id: 'cancelled', label: 'Cancelled', count: 1 },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'processing':
      return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20' };
    case 'shipped':
      return { icon: Truck, color: 'text-sky-400', bg: 'bg-sky-500/20' };
    case 'delivered':
      return { icon: CheckCircle, color: 'text-jade-400', bg: 'bg-jade-500/20' };
    case 'cancelled':
      return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' };
    default:
      return { icon: Package, color: 'text-slate-400', bg: 'bg-white/10' };
  }
};

export default function OrdersPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIChattyBird, setShowAIChattyBird] = useState(false);
  const [aiDismissed, setAiDismissed] = useState(false);

  // Filter orders based on tab
  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['processing', 'shipped'].includes(order.status);
    return order.status === activeTab;
  }).filter(order => 
    searchQuery === '' || 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // AI Chatty Bird appears after viewing orders
  useEffect(() => {
    if (!aiDismissed) {
      const timer = setTimeout(() => {
        setShowAIChattyBird(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [aiDismissed]);

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Orders', href: `/${locale}/orders` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ===== HEADER ===== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full bg-ink-850 border border-border rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-panda-500/50"
              />
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-panda-500 text-white'
                    : 'bg-ink-850 text-slate-400 hover:bg-ink-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* ===== ORDERS LIST ===== */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-ink-850 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-3">No orders found</h2>
              <p className="text-slate-300 mb-8">
                {activeTab !== 'all' ? 'No orders in this category' : "You haven't placed any orders yet"}
              </p>
              <Link href={`/${locale}/products`}>
                <Button className="bg-panda-500 hover:bg-panda-600">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-ink-850 border border-border rounded-2xl overflow-hidden hover:border-border-strong transition-all"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-slate-200 font-bold">{order.id}</span>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {order.statusLabel}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">Ordered on {order.date} • {order.maker}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-slate-200">¥{order.total}</span>
                          <Link href={`/${locale}/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="border-border">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 overflow-x-auto pb-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 bg-ink-800 rounded-xl p-3 flex-shrink-0">
                            <div className="w-12 h-12 bg-ink-900 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">{item.image}</span>
                            </div>
                            <div>
                              <p className="text-sm text-slate-200 font-medium line-clamp-1 max-w-[150px]">{item.name}</p>
                              <p className="text-xs text-slate-400">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-sm text-slate-400 flex-shrink-0">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="text-sm text-slate-400">
                          {order.status === 'shipped' && order.eta && (
                            <span className="flex items-center gap-1 text-sky-400">
                              <Truck className="h-4 w-4" />
                              Arriving {order.eta}
                            </span>
                          )}
                          {order.status === 'delivered' && order.deliveredDate && (
                            <span className="flex items-center gap-1 text-jade-400">
                              <CheckCircle className="h-4 w-4" />
                              Delivered on {order.deliveredDate}
                            </span>
                          )}
                          {order.status === 'cancelled' && order.cancelReason && (
                            <span className="flex items-center gap-1 text-red-400">
                              <XCircle className="h-4 w-4" />
                              {order.cancelReason}
                            </span>
                          )}
                          {order.status === 'processing' && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Clock className="h-4 w-4" />
                              Est. delivery: {order.eta}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {order.status === 'delivered' && (
                            <Button size="sm" variant="outline" className="border-white/10 text-xs">
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Buy Again
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-slate-400 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== AI CHATTY BIRD ===== */}
        <AnimatePresence>
          {showAIChattyBird && !aiDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 50 }}
              className="fixed bottom-6 right-6 z-40 max-w-sm"
            >
              <div className="bg-gradient-to-br from-sky-500/90 to-panda-500/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🐦</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold text-sm">Chatty Bird</h4>
                      <button 
                        onClick={() => {
                          setShowAIChattyBird(false);
                          setAiDismissed(true);
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      📦 Good news! Your latest order is being processed. Want me to notify you when it ships?
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Yes, notify me
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/70 hover:text-white text-xs"
                        onClick={() => setShowAIChattyBird(false)}
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
