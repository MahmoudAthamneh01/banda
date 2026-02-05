'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Bell,
  BellOff,
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  MessageSquare,
  Tag,
  Gift,
  AlertCircle,
  Star,
  ShoppingBag,
  Wallet,
  ChevronRight,
  Settings,
  Check,
  X,
  Filter,
  MoreVertical,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

// Mock Notifications Data
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'shipping',
    title: 'Order Shipped!',
    message: 'Your order BC-78453 has been shipped. Track your delivery.',
    timestamp: '2 min ago',
    read: false,
    action: { label: 'Track Order', href: '/orders/BC-78453' },
    icon: Truck,
    color: 'sky',
  },
  {
    id: 2,
    type: 'message',
    title: 'New message from TechZone Factory',
    message: "Great! I'll ship your order today. You should receive tracking...",
    timestamp: '5 min ago',
    read: false,
    action: { label: 'Reply', href: '/messages' },
    icon: MessageSquare,
    color: 'panda',
  },
  {
    id: 3,
    type: 'deal',
    title: '🔥 Flash Sale: 50% Off Electronics',
    message: 'Limited time offer on top tech products. Ends in 2 hours!',
    timestamp: '1 hour ago',
    read: false,
    action: { label: 'Shop Now', href: '/products?sale=true' },
    icon: Tag,
    color: 'silk',
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of ¥937 for order BC-78453 was successful.',
    timestamp: '3 hours ago',
    read: true,
    action: { label: 'View Receipt', href: '/orders/BC-78453' },
    icon: CreditCard,
    color: 'jade',
  },
  {
    id: 5,
    type: 'reward',
    title: 'You earned ¥50 bonus!',
    message: 'Your friend made their first purchase. Bonus added to wallet.',
    timestamp: 'Yesterday',
    read: true,
    action: { label: 'View Wallet', href: '/wallet' },
    icon: Gift,
    color: 'amber',
  },
  {
    id: 6,
    type: 'review',
    title: 'Review your recent purchase',
    message: 'Share your experience with Organic Green Tea Collection',
    timestamp: '2 days ago',
    read: true,
    action: { label: 'Write Review', href: '/orders/BC-42156' },
    icon: Star,
    color: 'amber',
  },
  {
    id: 7,
    type: 'delivered',
    title: 'Order Delivered',
    message: 'Your order BC-42156 has been delivered successfully.',
    timestamp: '3 days ago',
    read: true,
    action: { label: 'Confirm Receipt', href: '/orders/BC-42156' },
    icon: CheckCircle,
    color: 'jade',
  },
  {
    id: 8,
    type: 'alert',
    title: 'Price drop on wishlist item',
    message: 'Pro Gaming Keyboard is now 20% off! Original price: ¥999',
    timestamp: '4 days ago',
    read: true,
    action: { label: 'View Product', href: '/products/5' },
    icon: AlertCircle,
    color: 'red',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'unread', label: 'Unread', count: 3 },
  { id: 'orders', label: 'Orders', count: 4 },
  { id: 'messages', label: 'Messages', count: 1 },
  { id: 'deals', label: 'Deals', count: 1 },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    sky: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30' },
    panda: { bg: 'bg-panda-500/20', text: 'text-panda-400', border: 'border-panda-500/30' },
    silk: { bg: 'bg-silk-500/20', text: 'text-silk-400', border: 'border-silk-500/30' },
    jade: { bg: 'bg-jade-500/20', text: 'text-jade-400', border: 'border-jade-500/30' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  };
  return colors[color] || colors.panda;
};

export default function NotificationsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showAIDigest, setShowAIDigest] = useState(false);

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'orders') return ['shipping', 'delivered', 'payment'].includes(notif.type);
    if (activeFilter === 'messages') return notif.type === 'message';
    if (activeFilter === 'deals') return ['deal', 'alert', 'reward'].includes(notif.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Notifications', href: `/${locale}/notifications` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ===== HEADER ===== */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-200">Notifications</h1>
              <p className="text-slate-300 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border"
                onClick={() => setShowAIDigest(!showAIDigest)}
              >
                <Sparkles className="h-4 w-4 mr-2 text-panda-400" />
                AI Digest
              </Button>
              <Button variant="outline" size="sm" className="border-white/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ===== AI DIGEST ===== */}
          <AnimatePresence>
            {showAIDigest && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-r from-panda-500/20 to-jade-500/20 border border-panda-500/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🐼</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">Your Daily Digest</h3>
                        <Zap className="h-4 w-4 text-amber-400" />
                      </div>
                      <p className="text-slate-300 text-sm">
                        📦 <strong>1 order shipped</strong> - Your earbuds are on the way! Expected delivery in 3-5 days.<br />
                        💬 <strong>1 new message</strong> - TechZone Factory responded about your order.<br />
                        🔥 <strong>Flash sale ending soon</strong> - 50% off electronics for the next 2 hours!<br />
                        🎁 <strong>You earned ¥50</strong> - Thanks for referring a friend!
                      </p>
                      <Button size="sm" className="mt-3 bg-panda-500 hover:bg-panda-600 text-xs">
                        Got it, thanks!
                      </Button>
                    </div>
                    <button 
                      onClick={() => setShowAIDigest(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== FILTERS ===== */}
          <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeFilter === tab.id
                      ? 'bg-panda-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilter === tab.id ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white whitespace-nowrap"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {/* ===== NOTIFICATIONS LIST ===== */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-12 w-12 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No notifications</h2>
              <p className="text-slate-400">You're all caught up! Check back later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif, index) => {
                const IconComponent = notif.icon;
                const colorClasses = getColorClasses(notif.color);

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white/5 border rounded-2xl p-5 transition-all hover:bg-white/10 ${
                      notif.read ? 'border-white/10' : `border-l-4 ${colorClasses.border}`
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses.bg}`}>
                        <IconComponent className={`h-6 w-6 ${colorClasses.text}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-medium ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                            {notif.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-500">{notif.timestamp}</span>
                            <button className="text-slate-500 hover:text-white p-1">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{notif.message}</p>
                        <div className="flex items-center gap-3">
                          {notif.action && (
                            <Link href={`/${locale}${notif.action.href}`}>
                              <Button 
                                size="sm" 
                                className={`text-xs ${colorClasses.bg} ${colorClasses.text} hover:opacity-80 border ${colorClasses.border}`}
                              >
                                {notif.action.label}
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          )}
                          {!notif.read && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-slate-500 hover:text-white flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Mark read
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ===== NOTIFICATION SETTINGS HINT ===== */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-panda-500/20 rounded-xl flex items-center justify-center">
                <BellOff className="h-6 w-6 text-panda-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Manage your notifications</h4>
                <p className="text-sm text-slate-400">Choose what updates you want to receive and how often.</p>
              </div>
              <Button variant="outline" className="border-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BuyerShell>
  );
}
