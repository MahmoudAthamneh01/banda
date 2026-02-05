"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Sparkles,
    Factory,
    Briefcase,
    Receipt,
    Bell,
    MessageCircle,
    Menu,
    X,
    Wallet,
    TrendingUp,
    Shield,
    ChevronDown,
    ArrowUpRight,
    Gem,
    Crown,
    Award,
} from "lucide-react";
import { Button } from "@bandachao/ui";

interface VaultShellProps {
    children: React.ReactNode;
    locale: string;
}

// Animated number counter
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <span>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
}

// Investor tier badge
function TierBadge({ tier }: { tier: string }) {
    const tierConfig: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
        Bronze: { color: "text-amber-600", icon: <Award className="h-3 w-3" />, bg: "bg-amber-500/20" },
        Silver: { color: "text-slate-300", icon: <Award className="h-3 w-3" />, bg: "bg-slate-400/20" },
        Gold: { color: "text-yellow-400", icon: <Crown className="h-3 w-3" />, bg: "bg-yellow-500/20" },
        Platinum: { color: "text-cyan-300", icon: <Gem className="h-3 w-3" />, bg: "bg-cyan-500/20" },
        "Silk Ambassador": { color: "text-silk-400", icon: <Gem className="h-3 w-3" />, bg: "bg-silk-500/20" },
    };

    const config = tierConfig[tier] || tierConfig.Bronze;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            {config.icon}
            {tier}
        </span>
    );
}

export function VaultShell({ children, locale }: VaultShellProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);

    const navigation = [
        { name: "Overview", href: `/${locale}/vault`, icon: LayoutDashboard },
        { name: "Opportunities", href: `/${locale}/vault/opportunities`, icon: Sparkles },
        { name: "Factories", href: `/${locale}/vault/factories`, icon: Factory },
        { name: "Portfolio", href: `/${locale}/vault/portfolio`, icon: Briefcase },
        { name: "Transactions", href: `/${locale}/vault/transactions`, icon: Receipt },
    ];

    const kpis = [
        { label: "Invested", value: 125000, prefix: "¥", trend: null },
        { label: "Active Deals", value: 8, trend: "+2" },
        { label: "ROI", value: 12.5, suffix: "%", trend: "+3.2%" },
        { label: "Liquidity", value: 45000, prefix: "¥", trend: null },
    ];

    const investorProfile = {
        name: "Chen Wei Capital",
        tier: "Gold",
        avatar: "CW",
    };

    const isActivePath = (href: string) => {
        if (href === `/${locale}/vault`) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-ink-900 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-ink-950 to-ink-900 border-r border-border fixed left-0 top-0 bottom-0">
                {/* Logo */}
                <div className="p-6 border-b border-border">
                    <Link href={`/${locale}/vault`} className="flex items-center space-x-3">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-10 h-10 bg-gradient-to-br from-jade-400 to-jade-600 rounded-xl flex items-center justify-center shadow-lg shadow-jade-500/20"
                        >
                            <Wallet className="h-5 w-5 text-white" />
                        </motion.div>
                        <div>
                            <span className="text-xl font-bold text-white">Vault</span>
                            <p className="text-xs text-slate-400">Investment Portal</p>
                        </div>
                    </Link>
                </div>

                {/* Investor Profile Section */}
                <div className="p-4 border-b border-border">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-ink-800/50 backdrop-blur rounded-xl p-4 border border-border"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-jade-400 to-jade-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {investorProfile.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate">
                                    {investorProfile.name}
                                </h3>
                                <TierBadge tier={investorProfile.tier} />
                            </div>
                        </div>

                        {/* Quick KPIs */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {kpis.slice(0, 4).map((kpi, index) => (
                                <motion.div
                                    key={kpi.label}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="bg-ink-900/50 px-3 py-2 rounded-lg"
                                >
                                    <p className="text-xs text-slate-400">{kpi.label}</p>
                                    <p className="text-sm font-bold text-white">
                                        <AnimatedNumber
                                            value={kpi.value}
                                            prefix={kpi.prefix}
                                            suffix={kpi.suffix}
                                        />
                                    </p>
                                    {kpi.trend && (
                                        <span className="text-xs text-success-400">{kpi.trend}</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
                    {navigation.map((item, index) => {
                        const Icon = item.icon;
                        const active = isActivePath(item.href);
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        active
                                            ? "bg-jade-500 text-white shadow-lg shadow-jade-500/20"
                                            : "text-slate-300 hover:bg-ink-800 hover:text-white"
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 transition-transform ${active ? "" : "group-hover:scale-110"}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {active && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-2 h-2 bg-white rounded-full"
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Deposit CTA */}
                <div className="p-4 border-t border-border">
                    <Button
                        onClick={() => setShowDepositModal(true)}
                        className="w-full bg-gradient-to-r from-jade-500 to-jade-600 hover:from-jade-600 hover:to-jade-700 text-white shadow-lg shadow-jade-500/20"
                    >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Deposit Funds
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-ink-950 to-ink-900 border-r border-border z-50 lg:hidden"
                        >
                            {/* Same sidebar content as desktop */}
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <Link href={`/${locale}/vault`} className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-jade-400 to-jade-600 rounded-xl flex items-center justify-center">
                                        <Wallet className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white">Vault</span>
                                </Link>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <nav className="p-4 space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActivePath(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                active
                                                    ? "bg-jade-500 text-white"
                                                    : "text-slate-300 hover:bg-ink-800"
                                            }`}
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

            {/* Main Content */}
            <div className="flex-1 lg:ml-72">
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-ink-900/95 backdrop-blur-sm border-b border-border">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-300 hover:text-white"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Desktop: Investor Badge */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-ink-800 rounded-lg border border-border">
                                <Shield className="h-4 w-4 text-jade-400" />
                                <span className="text-sm text-slate-300">Accredited Investor</span>
                            </div>
                            <TierBadge tier={investorProfile.tier} />
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            {/* Deposit CTA - Desktop */}
                            <Button
                                onClick={() => setShowDepositModal(true)}
                                size="sm"
                                className="hidden md:flex bg-jade-500 hover:bg-jade-600"
                            >
                                Deposit
                            </Button>

                            {/* Notifications */}
                            <button className="relative p-2 text-slate-300 hover:text-white hover:bg-ink-800 rounded-lg transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-jade-500 rounded-full" />
                            </button>

                            {/* Messages */}
                            <Link
                                href={`/${locale}/messages`}
                                className="p-2 text-slate-300 hover:text-white hover:bg-ink-800 rounded-lg transition-colors"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>

            {/* Deposit Modal (Mock) */}
            <AnimatePresence>
                {showDepositModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDepositModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        >
                            <div className="bg-ink-900 border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
                                    <button
                                        onClick={() => setShowDepositModal(false)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-jade-500/10 border border-jade-500/30 rounded-xl">
                                        <p className="text-sm text-slate-400">Available Balance</p>
                                        <p className="text-2xl font-bold text-jade-400">¥45,000.00</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Amount (¥)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Payment Method
                                        </label>
                                        <div className="space-y-2">
                                            <button className="w-full p-3 bg-ink-800 hover:bg-ink-700 border border-border rounded-xl text-left flex items-center gap-3 transition-colors">
                                                <span className="text-2xl">🏦</span>
                                                <div>
                                                    <p className="text-white font-medium">Bank Transfer</p>
                                                    <p className="text-xs text-slate-400">1-3 business days</p>
                                                </div>
                                            </button>
                                            <button className="w-full p-3 bg-ink-800 hover:bg-ink-700 border border-border rounded-xl text-left flex items-center gap-3 transition-colors">
                                                <span className="text-2xl">💳</span>
                                                <div>
                                                    <p className="text-white font-medium">Alipay / WeChat</p>
                                                    <p className="text-xs text-slate-400">Instant</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-jade-500 hover:bg-jade-600">
                                        Continue to Deposit
                                    </Button>

                                    <p className="text-xs text-center text-slate-500">
                                        Funds are held securely in escrow • Withdrawal rules apply
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
