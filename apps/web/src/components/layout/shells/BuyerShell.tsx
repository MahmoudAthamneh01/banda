"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Wallet,
  MessageCircle,
  Bell,
  User,
  Menu,
  X,
  Home,
  Package,
  Settings,
  LogOut,
  Globe,
  Sparkles,
  ChevronDown,
  Tag,
  Grid3X3,
  Store,
  ClipboardList,
} from "lucide-react";

interface BuyerShellProps {
  children: React.ReactNode;
  locale: string;
  secondaryNav?: 'discover' | 'breadcrumbs';
  breadcrumbs?: { label: string; href: string }[];
}

export function BuyerShell({ children, locale, secondaryNav, breadcrumbs }: BuyerShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [walletBalance] = useState('¥12,450');
  const [cartCount] = useState(3);
  const [notifCount] = useState(5);
  const [hasUnreadMessages] = useState(true);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = () => setProfileMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const secondaryTabs = [
    { id: 'discover', label: 'Discover', icon: Sparkles, href: `/${locale}/square` },
    { id: 'deals', label: 'Deals', icon: Tag, href: `/${locale}/products?filter=deals` },
    { id: 'categories', label: 'Categories', icon: Grid3X3, href: `/${locale}/products?view=categories` },
    { id: 'makers', label: 'Makers', icon: Store, href: `/${locale}/makers` },
    { id: 'orders', label: 'Your Orders', icon: ClipboardList, href: `/${locale}/orders` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
      {/* ===== TOPBAR ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ink-900/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* LEFT: Logo + Square Button */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-panda-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-panda-500/20">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-white hidden sm:block group-hover:text-panda-400 transition-colors">
                  BandaChao
                </span>
              </Link>
              
              <Link 
                href={`/${locale}/square`}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-panda-500/10 hover:bg-panda-500/20 border border-panda-500/30 rounded-lg text-panda-400 hover:text-panda-300 transition-all"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Square</span>
              </Link>
            </div>

            {/* CENTER: Search */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, makers, deals..."
                  className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-slate-400 rounded-xl px-5 py-2.5 pl-12 border border-white/10 focus:border-panda-500/50 focus:outline-none focus:ring-2 focus:ring-panda-500/20 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Language */}
              <button className="hidden lg:flex items-center gap-1 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium">EN</span>
              </button>

              {/* Wallet Mini */}
              <Link
                href={`/${locale}/wallet`}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-silk-500/10 hover:bg-silk-500/20 border border-silk-500/30 rounded-lg text-silk-400 hover:text-silk-300 transition-all"
              >
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">{walletBalance}</span>
              </Link>

              {/* Notifications */}
              <Link
                href={`/${locale}/notifications`}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </Link>

              {/* Messages */}
              <Link
                href={`/${locale}/messages`}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {hasUnreadMessages && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-panda-500 rounded-full" />
                )}
              </Link>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-panda-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen(!profileMenuOpen);
                  }}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-panda-500 to-sky-500 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
                </button>
                
                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-ink-800 rounded-xl shadow-xl border border-white/10 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-medium">John Doe</p>
                        <p className="text-slate-400 text-sm">john@example.com</p>
                      </div>
                      <div className="py-2">
                        <Link href={`/${locale}/profile`} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link href={`/${locale}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Package className="h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                        <Link href={`/${locale}/wallet`} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Wallet className="h-4 w-4" />
                          <span>Wallet</span>
                        </Link>
                        <Link href={`/${locale}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="py-2 border-t border-white/10">
                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 px-4 py-3 bg-ink-900"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, makers, deals..."
                  className="w-full bg-white/5 text-white placeholder-slate-400 rounded-xl px-4 py-3 pl-11 border border-white/10 focus:border-panda-500/50 focus:outline-none"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <button onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SECONDARY NAV ===== */}
        {secondaryNav === 'discover' && (
          <div className="hidden md:block border-t border-white/5 bg-ink-900/50">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
                {secondaryTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        {secondaryNav === 'breadcrumbs' && breadcrumbs && (
          <div className="hidden md:block border-t border-white/5 bg-ink-900/50">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 h-12 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-slate-600">/</span>}
                    <Link 
                      href={crumb.href}
                      className={i === breadcrumbs.length - 1 ? "text-white" : "text-slate-400 hover:text-white transition-colors"}
                    >
                      {crumb.label}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-ink-900"
            >
              <nav className="px-4 py-4 space-y-1">
                {secondaryTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-white/10 my-2 pt-2">
                  <Link
                    href={`/${locale}/wallet`}
                    className="flex items-center justify-between px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      <span>Wallet</span>
                    </div>
                    <span className="text-silk-400 font-medium">{walletBalance}</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className={`pt-16 ${secondaryNav ? 'md:pt-28' : ''}`}>
        {children}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-ink-950 border-t border-white/5 mt-20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href={`/${locale}/legal/privacy`} className="hover:text-slate-300 transition-colors">Privacy</Link>
              <Link href={`/${locale}/legal/terms`} className="hover:text-slate-300 transition-colors">Terms</Link>
              <Link href={`/${locale}/faq`} className="hover:text-slate-300 transition-colors">Help</Link>
              <Link href={`/${locale}/status`} className="hover:text-slate-300 transition-colors">Status</Link>
            </div>
            <p className="text-sm text-slate-600">© 2026 BandaChao. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
