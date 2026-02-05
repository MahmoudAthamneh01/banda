'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
    Crown,
    LayoutDashboard,
    DollarSign,
    Users,
    Shield,
    AlertTriangle,
    Search,
    Zap,
    GitBranch,
    Activity,
    Brain,
    Bell,
    Menu,
    X,
    ChevronDown,
    CheckCircle,
    Clock,
    FileText,
    UserCheck,
    Ban,
    Pause,
    Flag,
} from 'lucide-react';

interface ThroneShellProps {
    children: React.ReactNode;
    locale: string;
}

const ADMIN_ROLES = {
    OWNER: { label: 'Owner', color: 'ruby-500' },
    ADMIN: { label: 'Admin', color: 'panda-500' },
    MODERATOR: { label: 'Moderator', color: 'sky-500' },
    FINANCE_OFFICER: { label: 'Finance', color: 'jade-500' },
};

// Mock recent audit actions
const RECENT_ACTIONS = [
    { action: 'User verified', user: 'admin@bandachao.com', timestamp: '2 min ago', type: 'success' },
    { action: 'Wallet frozen', user: 'mod@bandachao.com', timestamp: '15 min ago', type: 'warning' },
    { action: 'Dispute resolved', user: 'admin@bandachao.com', timestamp: '1 hour ago', type: 'success' },
    { action: 'Cycle started', user: 'owner@bandachao.com', timestamp: '2 hours ago', type: 'info' },
    { action: 'Rule updated', user: 'admin@bandachao.com', timestamp: '3 hours ago', type: 'info' },
];

// Mock alerts
const CRITICAL_ALERTS = [
    { type: 'fraud', message: 'Fraud spike detected: +23% last hour', severity: 'high' },
    { type: 'payment', message: '5 payment failures in last 10 minutes', severity: 'medium' },
    { type: 'dispute', message: '3 disputes exceeding SLA', severity: 'high' },
];

export function ThroneShell({ children, locale }: ThroneShellProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [alertsOpen, setAlertsOpen] = useState(false);
    const [auditStripExpanded, setAuditStripExpanded] = useState(false);

    const currentRole = 'OWNER'; // Mock - replace with actual auth

    const navigation = [
        { name: 'Overview', href: `/${locale}/throne`, icon: LayoutDashboard, badge: null },
        { name: 'Finance', href: `/${locale}/throne/finance`, icon: DollarSign, badge: null },
        { name: 'Users', href: `/${locale}/throne/users`, icon: Users, badge: null },
        { name: 'Verification', href: `/${locale}/throne/verification`, icon: UserCheck, badge: '12' },
        { name: 'Disputes', href: `/${locale}/throne/disputes`, icon: Shield, badge: '3' },
        { name: 'Fraud', href: `/${locale}/throne/fraud`, icon: AlertTriangle, badge: '8' },
        { name: 'Referrals', href: `/${locale}/throne/referrals`, icon: GitBranch, badge: null },
        { name: 'Cycles', href: `/${locale}/throne/cycles`, icon: Zap, badge: null },
        { name: 'System', href: `/${locale}/throne/system`, icon: Activity, badge: null },
        { name: 'AI Control', href: `/${locale}/throne/ai`, icon: Brain, badge: null },
    ];

    const quickActions = [
        { label: 'Freeze Wallet', icon: Ban, danger: true },
        { label: 'Start Liquidation', icon: Zap, danger: true },
        { label: 'Flag User', icon: Flag, danger: false },
        { label: 'Escalate Dispute', icon: AlertTriangle, danger: false },
    ];

    return (
        <div className="min-h-screen bg-ink-900 flex flex-col">
            {/* Admin Topbar */}
            <header className="sticky top-0 z-40 bg-ink-950 border-b border-ruby-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Logo + Role Badge */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-slate-300 hover:text-white"
                        >
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        <Link href={`/${locale}/throne`} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-ruby-600 to-ruby-500 rounded-lg flex items-center justify-center">
                                <Crown className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-200 hidden sm:block">Throne</span>
                        </Link>

                        <div className={`px-3 py-1 bg-${ADMIN_ROLES[currentRole as keyof typeof ADMIN_ROLES].color}/20 border border-${ADMIN_ROLES[currentRole as keyof typeof ADMIN_ROLES].color}/30 rounded-full`}>
                            <span className={`text-${ADMIN_ROLES[currentRole as keyof typeof ADMIN_ROLES].color} text-sm font-bold`}>
                                {ADMIN_ROLES[currentRole as keyof typeof ADMIN_ROLES].label}
                            </span>
                        </div>
                    </div>

                    {/* Center: Global Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users, orders, wallets, transactions..."
                                className="w-full pl-10 pr-4 py-2 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-ruby-500"
                            />
                        </div>
                    </div>

                    {/* Right: Quick Actions + Alerts */}
                    <div className="flex items-center gap-2">
                        {/* Alerts */}
                        <div className="relative">
                            <button
                                onClick={() => setAlertsOpen(!alertsOpen)}
                                className="relative p-2 text-slate-300 hover:text-white hover:bg-ink-800 rounded-lg transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                {CRITICAL_ALERTS.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-ruby-500 rounded-full animate-pulse" />
                                )}
                            </button>

                            <AnimatePresence>
                                {alertsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-80 bg-ink-850 border border-border rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-border">
                                            <h3 className="text-slate-200 font-bold text-sm">Critical Alerts</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {CRITICAL_ALERTS.map((alert, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 border-b border-border hover:bg-ink-800 cursor-pointer ${
                                                        alert.severity === 'high' ? 'border-l-2 border-l-ruby-500' : 'border-l-2 border-l-warning-500'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                                                            alert.severity === 'high' ? 'text-ruby-400' : 'text-warning-400'
                                                        }`} />
                                                        <div className="flex-1">
                                                            <p className="text-slate-300 text-sm">{alert.message}</p>
                                                            <span className={`text-xs ${
                                                                alert.severity === 'high' ? 'text-ruby-400' : 'text-warning-400'
                                                            }`}>
                                                                {alert.type.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Quick Actions */}
                        <div className="relative">
                            <button
                                onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                                className="flex items-center gap-2 px-3 py-2 bg-ruby-500/10 border border-ruby-500/30 text-ruby-400 hover:bg-ruby-500/20 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Zap className="h-4 w-4" />
                                <span className="hidden sm:inline">Quick Actions</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>

                            <AnimatePresence>
                                {quickActionsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-56 bg-ink-850 border border-border rounded-lg shadow-lg overflow-hidden"
                                    >
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-ink-800 transition-colors ${
                                                    action.danger ? 'text-ruby-400 hover:bg-ruby-500/10' : 'text-slate-300'
                                                }`}
                                            >
                                                <action.icon className="h-4 w-4" />
                                                <span className="text-sm">{action.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Admin Sidebar */}
                <aside className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    fixed lg:static inset-y-0 left-0 z-30
                    w-64 bg-ink-950 border-r border-border
                    transition-transform duration-300 ease-in-out
                    flex flex-col
                    lg:mt-0 mt-14
                `}>
                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                                        ${isActive
                                            ? 'bg-ruby-500/20 text-ruby-400 border border-ruby-500/30'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-ink-800'
                                        }
                                    `}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 bg-ruby-500 text-white text-xs rounded-full font-bold">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-border">
                        <div className="bg-ink-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-300 text-sm font-medium">Cycle Day 45/90</span>
                            </div>
                            <div className="w-full bg-ink-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-ruby-600 to-ruby-500 h-2 rounded-full" style={{ width: '50%' }} />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Audit Strip */}
                    <div className="bg-ink-850 border-b border-border">
                        <div className="px-4 py-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-warning-400" />
                                    <span className="text-warning-400 text-sm font-medium">
                                        All actions are logged and auditable
                                    </span>
                                </div>
                                <button
                                    onClick={() => setAuditStripExpanded(!auditStripExpanded)}
                                    className="text-sky-400 text-sm hover:text-sky-300 transition-colors flex items-center gap-1"
                                >
                                    View Audit Trail
                                    <ChevronDown className={`h-3 w-3 transition-transform ${auditStripExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {auditStripExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-3 space-y-1"
                                    >
                                        {RECENT_ACTIONS.map((action, i) => (
                                            <div key={i} className="flex items-center gap-3 px-3 py-2 bg-ink-800 rounded text-sm">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    action.type === 'success' ? 'bg-success-500' :
                                                    action.type === 'warning' ? 'bg-warning-500' :
                                                    'bg-sky-500'
                                                }`} />
                                                <span className="text-slate-300 flex-1">{action.action}</span>
                                                <span className="text-slate-500 text-xs">{action.user}</span>
                                                <span className="text-slate-600 text-xs">{action.timestamp}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
