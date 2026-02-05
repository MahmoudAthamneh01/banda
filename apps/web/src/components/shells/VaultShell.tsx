'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrendingUp,
    Factory,
    Briefcase,
    Receipt,
    Bell,
    MessageSquare,
    ChevronDown,
    Plus,
    Menu,
    X,
    Gem,
    DollarSign,
    Activity,
    Percent,
    Droplets,
} from 'lucide-react';
import { Button } from '@bandachao/ui';

interface VaultShellProps {
    children: React.ReactNode;
    locale: string;
}

// Investor tiers
const INVESTOR_TIERS = {
    bronze: { label: 'Bronze', color: 'bg-amber-700', icon: '🥉' },
    silver: { label: 'Silver', color: 'bg-slate-400', icon: '🥈' },
    gold: { label: 'Gold', color: 'bg-yellow-500', icon: '🥇' },
    platinum: { label: 'Platinum', color: 'bg-slate-300', icon: '💎' },
    silk: { label: 'Silk Ambassador', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: '🎖️' },
};

// Mock KPIs
const QUICK_KPIS = [
    { id: 'invested', label: 'Invested', value: '¥2.5M', icon: DollarSign, color: 'text-jade-400' },
    { id: 'deals', label: 'Active Deals', value: '12', icon: Activity, color: 'text-panda-400' },
    { id: 'roi', label: 'ROI', value: '+18.5%', icon: Percent, color: 'text-success-400' },
    { id: 'liquidity', label: 'Liquidity', value: '¥450K', icon: Droplets, color: 'text-blue-400' },
];

// Sidebar navigation
const VAULT_NAV = [
    { id: 'overview', label: 'Overview', href: '/vault', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunities', href: '/vault/opportunities', icon: TrendingUp },
    { id: 'factories', label: 'Factories', href: '/vault/factories', icon: Factory },
    { id: 'portfolio', label: 'Portfolio', href: '/vault/portfolio', icon: Briefcase },
    { id: 'transactions', label: 'Transactions', href: '/vault/transactions', icon: Receipt },
];

// Animated number counter
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: string; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
        const duration = 1500;
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (numericValue - startValue) * easeOut;

            if (value.includes('M')) {
                setDisplayValue(current.toFixed(1) + 'M');
            } else if (value.includes('K')) {
                setDisplayValue(Math.round(current) + 'K');
            } else if (value.includes('%')) {
                setDisplayValue(current.toFixed(1) + '%');
            } else {
                setDisplayValue(Math.round(current).toString());
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [value]);

    return <span>{prefix}{displayValue}{suffix}</span>;
}

export default function VaultShell({ children, locale }: VaultShellProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Mock investor data
    const investor = {
        name: 'Li Investor',
        tier: 'gold' as keyof typeof INVESTOR_TIERS,
        avatar: 'LI',
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActiveRoute = (href: string) => {
        const fullPath = `/${locale}${href}`;
        if (href === '/vault') {
            return pathname === fullPath;
        }
        return pathname.startsWith(fullPath);
    };

    return (
        <div className="min-h-screen bg-ink-900 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 bg-ink-800 border-r border-border
                    flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <Link href={`/${locale}/vault`} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-jade-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Gem className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">The Vault</h1>
                                <p className="text-xs text-slate-400">Investor Portal</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Investor Badge */}
                    <div className="mt-4 p-3 bg-ink-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-jade-500 rounded-full flex items-center justify-center text-white font-bold">
                                {investor.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{investor.name}</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg">{INVESTOR_TIERS[investor.tier].icon}</span>
                                    <span className={`text-xs font-medium ${
                                        investor.tier === 'silk' ? 'text-purple-400' :
                                        investor.tier === 'platinum' ? 'text-slate-300' :
                                        investor.tier === 'gold' ? 'text-yellow-400' :
                                        investor.tier === 'silver' ? 'text-slate-400' :
                                        'text-amber-600'
                                    }`}>
                                        {INVESTOR_TIERS[investor.tier].label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {VAULT_NAV.map((item, index) => {
                        const isActive = isActiveRoute(item.href);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/${locale}${item.href}`}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-jade-500 text-white shadow-lg shadow-jade-500/20'
                                            : 'text-slate-300 hover:bg-ink-700 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Deposit CTA */}
                <div className="p-4 border-t border-border">
                    <Link href={`/${locale}/vault/deposit`}>
                        <Button className="w-full bg-gradient-to-r from-jade-500 to-emerald-500 hover:from-jade-600 hover:to-emerald-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Deposit Funds
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-ink-800 border-b border-border sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Left: Mobile menu + Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 text-slate-400 hover:text-white"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* Quick KPIs - Desktop */}
                            <div className="hidden md:flex items-center gap-6">
                                {QUICK_KPIS.map((kpi, index) => (
                                    <motion.div
                                        key={kpi.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                        <div>
                                            <p className="text-xs text-slate-400">{kpi.label}</p>
                                            <p className={`text-sm font-bold ${kpi.color}`}>
                                                {mounted ? (
                                                    <AnimatedNumber 
                                                        value={kpi.value} 
                                                        prefix={kpi.value.startsWith('+') ? '+' : kpi.value.startsWith('¥') ? '¥' : ''}
                                                    />
                                                ) : kpi.value}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <Link href={`/${locale}/vault/notifications`}>
                                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-ink-700 rounded-lg">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                </button>
                            </Link>

                            {/* Messages */}
                            <Link href={`/${locale}/vault/messages`}>
                                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-ink-700 rounded-lg">
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-panda-500 rounded-full" />
                                </button>
                            </Link>

                            {/* Deposit (Desktop) */}
                            <Link href={`/${locale}/vault/deposit`}>
                                <Button className="hidden sm:flex bg-jade-500 hover:bg-jade-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Deposit
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile KPIs */}
                    <div className="md:hidden border-t border-border px-4 py-2 overflow-x-auto">
                        <div className="flex items-center gap-4 min-w-max">
                            {QUICK_KPIS.map((kpi) => (
                                <div key={kpi.id} className="flex items-center gap-2">
                                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                    <span className={`text-sm font-bold ${kpi.color}`}>{kpi.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
