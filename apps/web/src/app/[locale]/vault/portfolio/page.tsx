'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Briefcase,
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart3,
    DollarSign,
    Calendar,
    Clock,
    ChevronRight,
    X,
    FileText,
    Download,
    Filter,
    Eye,
    Lock,
    Unlock,
    AlertCircle,
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Sparkles,
    Activity,
    Target,
    Award,
} from 'lucide-react';

// Mock Holdings Data
const MOCK_HOLDINGS = [
    {
        id: 'h1',
        opportunityTitle: 'Hangzhou Tea Factory Expansion',
        factoryName: 'Hangzhou Premier Tea',
        category: 'Agriculture',
        investedDate: '2024-08-15',
        principal: 100000,
        currentValue: 112500,
        roi: 12.5,
        status: 'active',
        cycleEnd: '2025-02-15',
        nextDistribution: '2025-01-15',
        distributionHistory: [
            { date: '2024-11-15', amount: 4166, type: 'yield' },
            { date: '2024-10-15', amount: 4166, type: 'yield' },
            { date: '2024-09-15', amount: 4168, type: 'yield' },
        ],
        documents: ['Investment Agreement', 'Q3 Report', 'Q4 Report'],
        milestones: [
            { label: 'Investment Made', date: '2024-08-15', completed: true },
            { label: 'Production Started', date: '2024-09-01', completed: true },
            { label: 'Mid-Cycle Review', date: '2024-11-15', completed: true },
            { label: 'Cycle End', date: '2025-02-15', completed: false },
        ],
    },
    {
        id: 'h2',
        opportunityTitle: 'Bamboo Furniture Production Line',
        factoryName: 'EcoWood Industries',
        category: 'Manufacturing',
        investedDate: '2024-07-01',
        principal: 250000,
        currentValue: 295000,
        roi: 18.0,
        status: 'active',
        cycleEnd: '2025-03-01',
        nextDistribution: '2025-01-01',
        distributionHistory: [
            { date: '2024-12-01', amount: 12500, type: 'yield' },
            { date: '2024-11-01', amount: 12500, type: 'yield' },
            { date: '2024-10-01', amount: 12500, type: 'yield' },
            { date: '2024-09-01', amount: 12500, type: 'yield' },
        ],
        documents: ['Investment Agreement', 'Quarterly Reports', 'Factory Audit'],
        milestones: [
            { label: 'Investment Made', date: '2024-07-01', completed: true },
            { label: 'Equipment Purchased', date: '2024-07-15', completed: true },
            { label: 'Production Started', date: '2024-08-01', completed: true },
            { label: 'Export Shipment #1', date: '2024-10-15', completed: true },
            { label: 'Cycle End', date: '2025-03-01', completed: false },
        ],
    },
    {
        id: 'h3',
        opportunityTitle: 'Porcelain Export Facility',
        factoryName: 'Jingdezhen Ceramics',
        category: 'Artisan',
        investedDate: '2024-06-01',
        principal: 500000,
        currentValue: 625000,
        roi: 25.0,
        status: 'liquidating',
        cycleEnd: '2025-01-15',
        nextDistribution: '2025-01-15',
        distributionHistory: [
            { date: '2024-12-15', amount: 31250, type: 'yield' },
            { date: '2024-11-15', amount: 31250, type: 'yield' },
            { date: '2024-10-15', amount: 31250, type: 'yield' },
            { date: '2024-09-15', amount: 31250, type: 'yield' },
        ],
        documents: ['Investment Agreement', 'Heritage Certificate', 'Final Report'],
        milestones: [
            { label: 'Investment Made', date: '2024-06-01', completed: true },
            { label: 'Artisan Contracts Signed', date: '2024-06-15', completed: true },
            { label: 'Production Complete', date: '2024-11-01', completed: true },
            { label: 'Liquidation Window', date: '2025-01-15', completed: false },
        ],
    },
    {
        id: 'h4',
        opportunityTitle: 'Smart Home Assembly',
        factoryName: 'IoT Solutions Ltd.',
        category: 'Electronics',
        investedDate: '2024-09-01',
        principal: 150000,
        currentValue: 159000,
        roi: 6.0,
        status: 'active',
        cycleEnd: '2025-05-01',
        nextDistribution: '2025-02-01',
        distributionHistory: [
            { date: '2024-12-01', amount: 4500, type: 'yield' },
            { date: '2024-11-01', amount: 4500, type: 'yield' },
        ],
        documents: ['Investment Agreement', 'Tech Specs', 'Progress Report'],
        milestones: [
            { label: 'Investment Made', date: '2024-09-01', completed: true },
            { label: 'Component Procurement', date: '2024-09-15', completed: true },
            { label: 'Assembly Started', date: '2024-10-01', completed: true },
            { label: 'First Shipment', date: '2025-02-01', completed: false },
            { label: 'Cycle End', date: '2025-05-01', completed: false },
        ],
    },
    {
        id: 'h5',
        opportunityTitle: 'Organic Cotton Weaving',
        factoryName: 'Xinjiang Textiles',
        category: 'Textiles',
        investedDate: '2024-10-01',
        principal: 80000,
        currentValue: 82400,
        roi: 3.0,
        status: 'active',
        cycleEnd: '2025-04-01',
        nextDistribution: '2025-02-01',
        distributionHistory: [
            { date: '2024-12-01', amount: 1200, type: 'yield' },
            { date: '2024-11-01', amount: 1200, type: 'yield' },
        ],
        documents: ['Investment Agreement', 'Organic Certification'],
        milestones: [
            { label: 'Investment Made', date: '2024-10-01', completed: true },
            { label: 'Harvest Received', date: '2024-10-15', completed: true },
            { label: 'Processing Started', date: '2024-11-01', completed: true },
            { label: 'Cycle End', date: '2025-04-01', completed: false },
        ],
    },
];

// Allocation by Category
const ALLOCATION_DATA = [
    { category: 'Artisan', amount: 500000, percentage: 46.3, color: 'bg-jade-500' },
    { category: 'Manufacturing', amount: 250000, percentage: 23.1, color: 'bg-panda-500' },
    { category: 'Electronics', amount: 150000, percentage: 13.9, color: 'bg-blue-500' },
    { category: 'Agriculture', amount: 100000, percentage: 9.3, color: 'bg-emerald-500' },
    { category: 'Textiles', amount: 80000, percentage: 7.4, color: 'bg-amber-500' },
];

// Performance History (Monthly)
const PERFORMANCE_HISTORY = [
    { month: 'Jul', value: 850000, roi: 0 },
    { month: 'Aug', value: 950000, roi: 2.1 },
    { month: 'Sep', value: 1000000, roi: 5.2 },
    { month: 'Oct', value: 1050000, roi: 8.5 },
    { month: 'Nov', value: 1150000, roi: 12.3 },
    { month: 'Dec', value: 1273900, roi: 18.5 },
];

type FilterStatus = 'all' | 'active' | 'liquidating' | 'completed';

export default function PortfolioPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [selectedHolding, setSelectedHolding] = useState<typeof MOCK_HOLDINGS[0] | null>(null);
    const [showDetailDrawer, setShowDetailDrawer] = useState(false);
    const [showAI, setShowAI] = useState(false);

    // Filtered holdings
    const filteredHoldings = MOCK_HOLDINGS.filter(h => {
        if (statusFilter === 'all') return true;
        return h.status === statusFilter;
    });

    // Calculate totals
    const totalPrincipal = MOCK_HOLDINGS.reduce((sum, h) => sum + h.principal, 0);
    const totalValue = MOCK_HOLDINGS.reduce((sum, h) => sum + h.currentValue, 0);
    const totalROI = ((totalValue - totalPrincipal) / totalPrincipal) * 100;
    const totalGain = totalValue - totalPrincipal;

    const formatCurrency = (num: number) => {
        if (num >= 1000000) return `¥${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return `¥${(num / 1000).toFixed(0)}K`;
        return `¥${num.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-success-400 bg-success-500/20 border-success-500/30';
            case 'liquidating': return 'text-warning-400 bg-warning-500/20 border-warning-500/30';
            case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
        }
    };

    const openDetail = (holding: typeof MOCK_HOLDINGS[0]) => {
        setSelectedHolding(holding);
        setShowDetailDrawer(true);
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
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-200 flex items-center gap-3">
                        <Briefcase className="h-8 w-8 text-jade-400" />
                        Portfolio & Holdings
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Track your investments and monitor performance
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                        onClick={() => setShowAI(true)}
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Analysis
                    </Button>
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </motion.div>

            {/* Portfolio Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-sm">Total Invested</span>
                            <DollarSign className="h-5 w-5 text-jade-400" />
                        </div>
                        <p className="text-2xl font-bold text-slate-200">{formatCurrency(totalPrincipal)}</p>
                        <p className="text-sm text-slate-500">{MOCK_HOLDINGS.length} holdings</p>
                    </CardContent>
                </Card>

                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-sm">Current Value</span>
                            <BarChart3 className="h-5 w-5 text-panda-400" />
                        </div>
                        <p className="text-2xl font-bold text-slate-200">{formatCurrency(totalValue)}</p>
                        <div className="flex items-center gap-1 text-sm">
                            {totalGain >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-4 w-4 text-success-400" />
                                    <span className="text-success-400">+{formatCurrency(totalGain)}</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                                    <span className="text-red-400">{formatCurrency(totalGain)}</span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-sm">Total ROI</span>
                            <TrendingUp className="h-5 w-5 text-success-400" />
                        </div>
                        <p className={`text-2xl font-bold ${totalROI >= 0 ? 'text-success-400' : 'text-red-400'}`}>
                            {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(1)}%
                        </p>
                        <p className="text-sm text-slate-500">Overall performance</p>
                    </CardContent>
                </Card>

                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-sm">Pending Liquidation</span>
                            <Lock className="h-5 w-5 text-warning-400" />
                        </div>
                        <p className="text-2xl font-bold text-slate-200">
                            {formatCurrency(MOCK_HOLDINGS.filter(h => h.status === 'liquidating').reduce((sum, h) => sum + h.currentValue, 0))}
                        </p>
                        <p className="text-sm text-warning-400">
                            {MOCK_HOLDINGS.filter(h => h.status === 'liquidating').length} holding(s) ending soon
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-200 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-jade-400" />
                                    Performance History
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Simple Bar Chart */}
                            <div className="h-48 flex items-end justify-between gap-2">
                                {PERFORMANCE_HISTORY.map((item, index) => {
                                    const maxValue = Math.max(...PERFORMANCE_HISTORY.map(p => p.value));
                                    const height = (item.value / maxValue) * 100;
                                    return (
                                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-xs text-success-400">
                                                {item.roi > 0 ? `+${item.roi}%` : ''}
                                            </span>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                                className="w-full bg-jade-500/80 rounded-t hover:bg-jade-500 transition-colors cursor-pointer"
                                                title={`${formatCurrency(item.value)}`}
                                            />
                                            <span className="text-xs text-slate-400">{item.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Allocation Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardHeader>
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-panda-400" />
                                Allocation by Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {ALLOCATION_DATA.map((item, index) => (
                                    <motion.div
                                        key={item.category}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-white">{item.category}</span>
                                            <span className="text-sm text-slate-400">
                                                {formatCurrency(item.amount)} ({item.percentage}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.percentage}%` }}
                                                transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                                                className={`h-full rounded-full ${item.color}`}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Holdings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-ink-800 border-border">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-white">Your Holdings</CardTitle>
                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                {(['all', 'active', 'liquidating', 'completed'] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                                            statusFilter === status
                                                ? 'bg-jade-500 text-white'
                                                : 'bg-ink-700 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredHoldings.length === 0 ? (
                            <div className="text-center py-12">
                                <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No holdings found</h3>
                                <p className="text-slate-400">No investments match the selected filter</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredHoldings.map((holding, index) => (
                                    <motion.div
                                        key={holding.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => openDetail(holding)}
                                        className="p-4 bg-ink-700/50 rounded-lg hover:bg-ink-700 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-white font-medium">{holding.opportunityTitle}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(holding.status)}`}>
                                                        {holding.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400">{holding.factoryName} • {holding.category}</p>
                                            </div>

                                            <div className="flex items-center gap-6 md:gap-8">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Principal</p>
                                                    <p className="text-white font-medium">{formatCurrency(holding.principal)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Current Value</p>
                                                    <p className="text-white font-medium">{formatCurrency(holding.currentValue)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">ROI</p>
                                                    <p className={`font-bold ${holding.roi >= 0 ? 'text-success-400' : 'text-red-400'}`}>
                                                        {holding.roi >= 0 ? '+' : ''}{holding.roi}%
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>

                                        {/* Progress to Cycle End */}
                                        {holding.status !== 'completed' && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="text-slate-500">Cycle Progress</span>
                                                    <span className="text-slate-400">Ends {holding.cycleEnd}</span>
                                                </div>
                                                <div className="h-1.5 bg-ink-600 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            holding.status === 'liquidating' ? 'bg-warning-500' : 'bg-jade-500'
                                                        }`}
                                                        style={{
                                                            width: `${Math.min(
                                                                ((new Date().getTime() - new Date(holding.investedDate).getTime()) /
                                                                (new Date(holding.cycleEnd).getTime() - new Date(holding.investedDate).getTime())) * 100,
                                                                100
                                                            )}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {showDetailDrawer && selectedHolding && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailDrawer(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-ink-900 border-l border-border z-50 overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-ink-900 border-b border-border p-4 z-10">
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(selectedHolding.status)}`}>
                                        {selectedHolding.status}
                                    </span>
                                    <button
                                        onClick={() => setShowDetailDrawer(false)}
                                        className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-white mt-3">{selectedHolding.opportunityTitle}</h2>
                                <p className="text-slate-400">{selectedHolding.factoryName}</p>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-6">
                                {/* Investment Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-ink-800 border-border">
                                        <CardContent className="p-4">
                                            <p className="text-xs text-slate-400">Principal</p>
                                            <p className="text-xl font-bold text-white">{formatCurrency(selectedHolding.principal)}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-ink-800 border-border">
                                        <CardContent className="p-4">
                                            <p className="text-xs text-slate-400">Current Value</p>
                                            <p className="text-xl font-bold text-white">{formatCurrency(selectedHolding.currentValue)}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-ink-800 border-border">
                                        <CardContent className="p-4">
                                            <p className="text-xs text-slate-400">ROI</p>
                                            <p className={`text-xl font-bold ${selectedHolding.roi >= 0 ? 'text-success-400' : 'text-red-400'}`}>
                                                {selectedHolding.roi >= 0 ? '+' : ''}{selectedHolding.roi}%
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-ink-800 border-border">
                                        <CardContent className="p-4">
                                            <p className="text-xs text-slate-400">Gain/Loss</p>
                                            <p className={`text-xl font-bold ${selectedHolding.currentValue >= selectedHolding.principal ? 'text-success-400' : 'text-red-400'}`}>
                                                {selectedHolding.currentValue >= selectedHolding.principal ? '+' : ''}
                                                {formatCurrency(selectedHolding.currentValue - selectedHolding.principal)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Timeline */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader>
                                        <CardTitle className="text-white text-sm">Investment Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            {selectedHolding.milestones.map((milestone, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        milestone.completed ? 'bg-success-400' : 'bg-slate-600'
                                                    }`} />
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${milestone.completed ? 'text-white' : 'text-slate-400'}`}>
                                                            {milestone.label}
                                                        </p>
                                                        <p className="text-sm text-slate-500">{milestone.date}</p>
                                                    </div>
                                                    {milestone.completed && (
                                                        <CheckCircle className="h-5 w-5 text-success-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Distribution History */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white text-sm">Distribution History</CardTitle>
                                            <span className="text-xs text-slate-400">
                                                Next: {selectedHolding.nextDistribution}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-2">
                                        {selectedHolding.distributionHistory.map((dist, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 bg-ink-700/50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-success-500/20 rounded-full flex items-center justify-center">
                                                        <DollarSign className="h-4 w-4 text-success-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium capitalize">{dist.type}</p>
                                                        <p className="text-xs text-slate-400">{dist.date}</p>
                                                    </div>
                                                </div>
                                                <span className="text-success-400 font-bold">+{formatCurrency(dist.amount)}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Documents */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader>
                                        <CardTitle className="text-white text-sm">Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-2">
                                        {selectedHolding.documents.map((doc, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-ink-700/50 rounded-lg hover:bg-ink-700 cursor-pointer"
                                            >
                                                <FileText className="h-5 w-5 text-slate-400" />
                                                <span className="text-white flex-1">{doc}</span>
                                                <Download className="h-4 w-4 text-slate-400" />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* AI Analysis Modal */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 max-w-md z-50"
                    >
                        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 border-0 shadow-2xl">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                                        🧠
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-white">Finance Brain</h4>
                                            <button
                                                onClick={() => setShowAI(false)}
                                                className="text-white/60 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-white/90 text-sm mb-4">
                                            Portfolio Analysis Summary:
                                        </p>
                                        <div className="space-y-3 mb-4">
                                            <div className="p-3 bg-white/10 rounded-lg">
                                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                                    <Target className="h-4 w-4" />
                                                    Strong Performance
                                                </p>
                                                <p className="text-white/80 text-xs mt-1">
                                                    Your portfolio ROI of +18.5% exceeds the platform average of 14.2%.
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white/10 rounded-lg">
                                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Concentration Risk
                                                </p>
                                                <p className="text-white/80 text-xs mt-1">
                                                    46% in Artisan category. Consider diversifying into Electronics or Healthcare.
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white/10 rounded-lg">
                                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Upcoming Action
                                                </p>
                                                <p className="text-white/80 text-xs mt-1">
                                                    Porcelain Export holding entering liquidation window in 12 days.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-white text-teal-700 hover:bg-white/90"
                                                onClick={() => setShowAI(false)}
                                            >
                                                Got it
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-white/30 text-white hover:bg-white/10"
                                            >
                                                Get Recommendations
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
