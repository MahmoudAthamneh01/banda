'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Briefcase,
    Percent,
    Shield,
    AlertTriangle,
    ChevronRight,
    Calendar,
    Clock,
    CheckCircle,
    Activity,
    Lock,
    Unlock,
    ArrowRight,
    X,
    Lightbulb,
    BarChart3,
    PieChart,
    Zap,
} from 'lucide-react';

// Mock KPI Data
const KPIS = [
    {
        id: 'invested',
        label: 'Total Invested',
        value: '¥2,500,000',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'jade',
    },
    {
        id: 'portfolio',
        label: 'Portfolio Value',
        value: '¥2,962,500',
        change: '+18.5%',
        trend: 'up',
        icon: Briefcase,
        color: 'panda',
    },
    {
        id: 'roi',
        label: 'ROI (All Time)',
        value: '+18.5%',
        change: '+3.2%',
        trend: 'up',
        icon: Percent,
        color: 'success',
    },
    {
        id: 'risk',
        label: 'Risk Score',
        value: 'Moderate',
        subtext: '6.2/10',
        icon: Shield,
        color: 'warning',
    },
];

// Mock Holdings
const TOP_HOLDINGS = [
    {
        id: '1',
        name: 'Shanghai Silk Factory',
        invested: '¥800,000',
        value: '¥952,000',
        roi: '+19%',
        category: 'Textiles',
    },
    {
        id: '2',
        name: 'Guangzhou Ceramics Hub',
        invested: '¥600,000',
        value: '¥708,000',
        roi: '+18%',
        category: 'Home Goods',
    },
    {
        id: '3',
        name: 'Shenzhen Tech Assembly',
        invested: '¥500,000',
        value: '¥575,000',
        roi: '+15%',
        category: 'Electronics',
    },
];

// Mock Opportunities
const OPPORTUNITY_FEED = [
    {
        id: '1',
        title: 'Hangzhou Tea Processing Expansion',
        factory: 'Hangzhou Tea Co.',
        yield: '15-20%',
        minTicket: '¥50,000',
        risk: 'low',
        cycle: 'Q2 2026',
        daysLeft: 12,
    },
    {
        id: '2',
        title: 'Bamboo Furniture Production Line',
        factory: 'EcoWood Industries',
        yield: '18-24%',
        minTicket: '¥100,000',
        risk: 'medium',
        cycle: 'Q2 2026',
        daysLeft: 8,
    },
    {
        id: '3',
        title: 'Porcelain Export Facility',
        factory: 'Jingdezhen Ceramics',
        yield: '22-28%',
        minTicket: '¥200,000',
        risk: 'high',
        cycle: 'Q2 2026',
        daysLeft: 15,
    },
    {
        id: '4',
        title: 'Organic Cotton Weaving',
        factory: 'Xinjiang Textiles',
        yield: '12-16%',
        minTicket: '¥30,000',
        risk: 'low',
        cycle: 'Q2 2026',
        daysLeft: 20,
    },
    {
        id: '5',
        title: 'Smart Home Assembly Plant',
        factory: 'IoT Solutions Ltd.',
        yield: '20-26%',
        minTicket: '¥150,000',
        risk: 'medium',
        cycle: 'Q3 2026',
        daysLeft: 45,
    },
];

// Mock Liquidity
const LIQUIDITY = {
    available: '¥450,000',
    locked: '¥2,050,000',
    nextUnlock: '2026-03-15',
    withdrawalRules: 'Available after cycle completion',
};

// Mock System Status
const SYSTEM_STATUS = {
    cycleStatus: 'Q1 2026 - Active',
    cycleEnd: '2026-03-31',
    disputeRate: '0.8%',
    healthScore: 'Excellent',
};

export default function VaultHomePage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [showAI, setShowAI] = useState(false);
    const [dateRange, setDateRange] = useState('all');
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    // Show AI advisor on first visit
    useEffect(() => {
        if (isFirstVisit) {
            const timer = setTimeout(() => {
                setShowAI(true);
                setIsFirstVisit(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isFirstVisit]);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'text-success-400 bg-success-500/20';
            case 'medium': return 'text-warning-400 bg-warning-500/20';
            case 'high': return 'text-red-400 bg-red-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-200">
                        Investor Command Deck
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Track your investments and discover opportunities
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-ink-800 border border-border rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-jade-500"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="all">All time</option>
                    </select>
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                        onClick={() => setShowAI(true)}
                    >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        AI Advisor
                    </Button>
                </div>
            </motion.div>

            {/* KPI Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {KPIS.map((kpi, index) => (
                    <motion.div
                        key={kpi.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`bg-ink-800 border-border hover:border-${kpi.color}-500/50 transition-colors`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400">{kpi.label}</p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className={`text-2xl font-bold mt-1 ${
                                                kpi.color === 'jade' ? 'text-jade-400' :
                                                kpi.color === 'panda' ? 'text-panda-400' :
                                                kpi.color === 'success' ? 'text-success-400' :
                                                'text-warning-400'
                                            }`}
                                        >
                                            {kpi.value}
                                        </motion.p>
                                        {kpi.change && (
                                            <div className={`flex items-center gap-1 mt-2 text-sm ${
                                                kpi.trend === 'up' ? 'text-success-400' : 'text-red-400'
                                            }`}>
                                                {kpi.trend === 'up' ? (
                                                    <TrendingUp className="h-4 w-4" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4" />
                                                )}
                                                {kpi.change}
                                            </div>
                                        )}
                                        {kpi.subtext && (
                                            <p className="text-sm text-slate-500 mt-1">{kpi.subtext}</p>
                                        )}
                                    </div>
                                    <div className={`p-3 rounded-lg ${
                                        kpi.color === 'jade' ? 'bg-jade-500/20' :
                                        kpi.color === 'panda' ? 'bg-panda-500/20' :
                                        kpi.color === 'success' ? 'bg-success-500/20' :
                                        'bg-warning-500/20'
                                    }`}>
                                        <kpi.icon className={`h-6 w-6 ${
                                            kpi.color === 'jade' ? 'text-jade-400' :
                                            kpi.color === 'panda' ? 'text-panda-400' :
                                            kpi.color === 'success' ? 'text-success-400' :
                                            'text-warning-400'
                                        }`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio Snapshot */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="bg-ink-800 border-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-200 flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-panda-400" />
                                    Portfolio Snapshot
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-border text-slate-300"
                                    onClick={() => router.push(`/${locale}/vault/portfolio`)}
                                >
                                    View Portfolio
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                {TOP_HOLDINGS.map((holding, index) => (
                                    <motion.div
                                        key={holding.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-ink-700 rounded-lg hover:bg-ink-600 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/${locale}/vault/portfolio`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-jade-500/20 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="h-6 w-6 text-jade-400" />
                                            </div>
                                            <div>
                                                <p className="text-slate-200 font-medium">{holding.name}</p>
                                                <p className="text-sm text-slate-400">{holding.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-200 font-medium">{holding.value}</p>
                                            <p className="text-sm text-success-400">{holding.roi}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Liquidity Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-ink-800 border-border h-full">
                        <CardHeader>
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-400" />
                                Liquidity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                            <div className="p-4 bg-jade-500/10 border border-jade-500/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Unlock className="h-4 w-4 text-jade-400" />
                                    <span className="text-sm text-slate-400">Available</span>
                                </div>
                                <p className="text-2xl font-bold text-jade-400">{LIQUIDITY.available}</p>
                            </div>

                            <div className="p-4 bg-ink-700 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock className="h-4 w-4 text-warning-400" />
                                    <span className="text-sm text-slate-400">Locked in Cycles</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-200">{LIQUIDITY.locked}</p>
                            </div>

                            <div className="p-3 bg-ink-700 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Next Unlock</span>
                                    <span className="text-sm text-slate-200 font-medium">{LIQUIDITY.nextUnlock}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full border-border text-slate-400"
                                disabled
                            >
                                Request Withdrawal
                            </Button>
                            <p className="text-xs text-slate-500 text-center">
                                {LIQUIDITY.withdrawalRules}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Opportunity Feed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="bg-ink-800 border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-warning-400" />
                                New Opportunities
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-slate-300"
                                onClick={() => router.push(`/${locale}/vault/opportunities`)}
                            >
                                View All
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {OPPORTUNITY_FEED.map((opp, index) => (
                                <motion.div
                                    key={opp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                    className="p-4 bg-ink-700 rounded-lg hover:bg-ink-600 transition-colors cursor-pointer group"
                                    onClick={() => router.push(`/${locale}/vault/opportunities`)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(opp.risk)}`}>
                                            {opp.risk}
                                        </span>
                                        <span className="text-xs text-slate-500">{opp.daysLeft}d left</span>
                                    </div>
                                    <h4 className="text-slate-200 font-medium text-sm mb-1 line-clamp-2 group-hover:text-jade-400 transition-colors">
                                        {opp.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-3">{opp.factory}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-success-400 font-medium">{opp.yield}</span>
                                        <span className="text-slate-500">Min: {opp.minTicket}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Trust & System Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="bg-ink-800 border-border">
                    <CardHeader>
                        <CardTitle className="text-slate-200 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-jade-400" />
                            Trust & System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-ink-700 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-panda-400" />
                                    <span className="text-sm text-slate-400">Current Cycle</span>
                                </div>
                                <p className="text-slate-200 font-medium">{SYSTEM_STATUS.cycleStatus}</p>
                                <p className="text-xs text-slate-500 mt-1">Ends: {SYSTEM_STATUS.cycleEnd}</p>
                            </div>

                            <div className="p-4 bg-ink-700 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-success-400" />
                                    <span className="text-sm text-slate-400">Dispute Rate</span>
                                </div>
                                <p className="text-success-400 font-medium">{SYSTEM_STATUS.disputeRate}</p>
                                <p className="text-xs text-slate-500 mt-1">Industry avg: 2.1%</p>
                            </div>

                            <div className="p-4 bg-ink-700 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-jade-400" />
                                    <span className="text-sm text-slate-400">System Health</span>
                                </div>
                                <p className="text-jade-400 font-medium">{SYSTEM_STATUS.healthScore}</p>
                                <p className="text-xs text-slate-500 mt-1">All systems operational</p>
                            </div>

                            <div className="p-4 bg-ink-700 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-slate-400">Next Settlement</span>
                                </div>
                                <p className="text-blue-400 font-medium">Mar 31, 2026</p>
                                <p className="text-xs text-slate-500 mt-1">56 days remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* AI Panda Consultant */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 max-w-md z-50"
                    >
                        <Card className="bg-ink-800 border border-jade-500/30 shadow-2xl shadow-jade-500/10">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-jade-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-3xl">
                                        🐼
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-slate-200">Panda Consultant</h4>
                                            <button
                                                onClick={() => setShowAI(false)}
                                                className="text-slate-400 hover:text-slate-200"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-4">
                                            Welcome to your Vault! Here are my recommendations to get started:
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-3 p-3 bg-jade-500/10 border border-jade-500/20 rounded-lg">
                                                <div className="w-8 h-8 bg-jade-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Shield className="h-4 w-4 text-jade-400" />
                                                </div>
                                                <p className="text-slate-200 text-sm">
                                                    <strong className="text-jade-400">Start with low-risk</strong> — Build confidence first
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-panda-500/10 border border-panda-500/20 rounded-lg">
                                                <div className="w-8 h-8 bg-panda-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <PieChart className="h-4 w-4 text-panda-400" />
                                                </div>
                                                <p className="text-slate-200 text-sm">
                                                    <strong className="text-panda-400">Diversify across 3+ factories</strong> — Spread your risk
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Clock className="h-4 w-4 text-blue-400" />
                                                </div>
                                                <p className="text-slate-200 text-sm">
                                                    <strong className="text-blue-400">Understand cycle timing</strong> — Liquidation windows matter
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                className="bg-jade-500 hover:bg-jade-600 text-white"
                                                onClick={() => router.push(`/${locale}/vault/opportunities`)}
                                            >
                                                Browse Opportunities
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-border text-slate-300 hover:bg-ink-700"
                                                onClick={() => setShowAI(false)}
                                            >
                                                Got it
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
