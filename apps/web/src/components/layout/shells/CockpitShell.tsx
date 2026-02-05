"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  FileText,
  Gavel,
  ShoppingCart,
  DollarSign,
  Settings,
  Bell,
  MessageCircle,
  Menu,
  X,
  Plus,
  ChevronDown,
  Shield,
  TrendingUp,
} from "lucide-react";

interface CockpitShellProps {
  children: React.ReactNode;
  locale: string;
}

export function CockpitShell({ children, locale }: CockpitShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: `/${locale}/cockpit`, icon: LayoutDashboard },
    { name: "Products", href: `/${locale}/cockpit/products`, icon: Package },
    { name: "Inventory", href: `/${locale}/cockpit/inventory`, icon: Warehouse },
    { name: "RFQ", href: `/${locale}/cockpit/rfq`, icon: FileText },
    { name: "Bids", href: `/${locale}/cockpit/bids`, icon: Gavel },
    { name: "Orders", href: `/${locale}/cockpit/orders`, icon: ShoppingCart },
    { name: "Payouts", href: `/${locale}/cockpit/payouts`, icon: DollarSign },
    { name: "Settings", href: `/${locale}/cockpit/settings`, icon: Settings },
  ];

  const kpis = [
    { label: "Today Orders", value: "12", trend: "+3" },
    { label: "Pending", value: "8", trend: "-2" },
    { label: "Low Stock", value: "5", trend: "+1" },
  ];

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink-950 border-r border-border fixed left-0 top-0 bottom-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href={`/${locale}/cockpit`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-silk-400 to-silk-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-slate-200">Cockpit</span>
          </Link>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-border">
          <div className="glass-card p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-panda-400 to-panda-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-200 font-semibold text-sm truncate">
                  Ali Manufacturing
                </h3>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-success-500" />
                  <span className="text-success-500 text-xs">Verified</span>
                </div>
              </div>
            </div>

            {/* KPI Chips */}
            <div className="flex flex-wrap gap-2">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="flex items-center gap-1 bg-ink-800 px-2 py-1 rounded text-xs"
                >
                  <span className="text-slate-400">{kpi.label}:</span>
                  <span className="text-slate-200 font-semibold">{kpi.value}</span>
                  <span className={`text-${kpi.trend.startsWith('+') ? 'success' : 'danger'}-500`}>
                    {kpi.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-surface hover:text-white rounded-lg transition-colors group"
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Analytics Footer */}
        <div className="p-4 border-t border-border">
          <Link
            href={`/${locale}/cockpit/analytics`}
            className="flex items-center justify-center gap-2 glass-card p-3 hover:bg-surface-strong transition-colors group"
          >
            <TrendingUp className="h-4 w-4 text-panda-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-200 text-sm font-medium">View Analytics</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-ink-900/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-300 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Create Menu */}
              <div className="relative">
                <button
                  onClick={() => setCreateMenuOpen(!createMenuOpen)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {createMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-ink-800 rounded-lg shadow-soft-lg border border-border-strong"
                    >
                      <Link
                        href={`/${locale}/cockpit/products/new`}
                        className="block px-4 py-3 text-slate-300 hover:bg-ink-700 hover:text-white transition-colors first:rounded-t-lg"
                        onClick={() => setCreateMenuOpen(false)}
                      >
                        New Product
                      </Link>
                      <Link
                        href={`/${locale}/cockpit/import`}
                        className="block px-4 py-3 text-slate-300 hover:bg-ink-700 hover:text-white transition-colors"
                        onClick={() => setCreateMenuOpen(false)}
                      >
                        Import Batch
                      </Link>
                      <Link
                        href={`/${locale}/cockpit/rfq/respond`}
                        className="block px-4 py-3 text-slate-300 hover:bg-ink-700 hover:text-white transition-colors last:rounded-b-lg"
                        onClick={() => setCreateMenuOpen(false)}
                      >
                        Respond to RFQ
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <Link
                href={`/${locale}/cockpit/notifications`}
                className="relative text-slate-300 hover:text-white transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
              </Link>

              {/* Messages */}
              <Link
                href={`/${locale}/cockpit/messages`}
                className="relative text-slate-300 hover:text-white transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-panda-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Profile */}
              <Link
                href={`/${locale}/cockpit/profile`}
                className="w-8 h-8 bg-gradient-to-br from-panda-400 to-panda-600 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform"
              >
                A
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-ink-950 border-r border-border z-50 lg:hidden flex flex-col"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Link
                  href={`/${locale}/cockpit`}
                  className="flex items-center space-x-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-silk-400 to-silk-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span className="text-xl font-bold text-slate-200">Cockpit</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-surface hover:text-white rounded-lg transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
