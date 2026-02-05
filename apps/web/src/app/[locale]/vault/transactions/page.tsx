'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Receipt,
    Search,
    Filter,
    Download,
    Calendar,
    X,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    FileText,
    Printer,
    Copy,
    ExternalLink,
    HelpCircle,
    MessageSquare,
    Sparkles,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Minus,
} from 'lucide-react';

// Mock Transactions Data
const MOCK_TRANSACTIONS = [
    {
        id: 'tx-001',
        type: 'investment',
        title: 'Investment in Hangzhou Tea Factory',
        description: 'Initial investment in tea processing expansion opportunity',
        amount: 100000,
        fee: 500,
        netAmount: 100500,
        date: '2024-08-15',
        time: '14:32:18',
        status: 'completed',
        reference: 'INV-2024-001234',
        opportunity: 'Hangzhou Tea Factory Expansion',
        factory: 'Hangzhou Premier Tea',
        breakdown: [
            { label: 'Principal Investment', amount: 100000 },
            { label: 'Platform Fee (0.5%)', amount: 500 },
        ],
    },
    {
        id: 'tx-002',
        type: 'yield',
        title: 'Yield Distribution - Hangzhou Tea',
        description: 'Monthly yield distribution for September 2024',
        amount: 4168,
        fee: 0,
        netAmount: 4168,
        date: '2024-09-15',
        time: '00:00:00',
        status: 'completed',
        reference: 'YLD-2024-005678',
        opportunity: 'Hangzhou Tea Factory Expansion',
        factory: 'Hangzhou Premier Tea',
        breakdown: [
            { label: 'Gross Yield', amount: 4375 },
            { label: 'Withholding Tax (5%)', amount: -207 },
        ],
    },
    {
        id: 'tx-003',
        type: 'investment',
        title: 'Investment in Bamboo Furniture',
        description: 'Investment in sustainable bamboo production line',
        amount: 250000,
        fee: 1250,
        netAmount: 251250,
        date: '2024-07-01',
        time: '10:15:44',
        status: 'completed',
        reference: 'INV-2024-000987',
        opportunity: 'Bamboo Furniture Production Line',
        factory: 'EcoWood Industries',
        breakdown: [
            { label: 'Principal Investment', amount: 250000 },
            { label: 'Platform Fee (0.5%)', amount: 1250 },
        ],
    },
    {
        id: 'tx-004',
        type: 'yield',
        title: 'Yield Distribution - Bamboo Furniture',
        description: 'Monthly yield distribution for December 2024',
        amount: 12500,
        fee: 0,
        netAmount: 12500,
        date: '2024-12-01',
        time: '00:00:00',
        status: 'completed',
        reference: 'YLD-2024-012345',
        opportunity: 'Bamboo Furniture Production Line',
        factory: 'EcoWood Industries',
        breakdown: [
            { label: 'Gross Yield', amount: 13158 },
            { label: 'Withholding Tax (5%)', amount: -658 },
        ],
    },
    {
        id: 'tx-005',
        type: 'deposit',
        title: 'Wallet Deposit',
        description: 'Bank transfer deposit to investment wallet',
        amount: 500000,
        fee: 0,
        netAmount: 500000,
        date: '2024-06-01',
        time: '09:22:31',
        status: 'completed',
        reference: 'DEP-2024-000456',
        opportunity: null,
        factory: null,
        breakdown: [
            { label: 'Deposit Amount', amount: 500000 },
            { label: 'Processing Fee', amount: 0 },
        ],
    },
    {
        id: 'tx-006',
        type: 'withdrawal',
        title: 'Partial Withdrawal',
        description: 'Withdrawal to linked bank account',
        amount: 50000,
        fee: 100,
        netAmount: 49900,
        date: '2024-10-20',
        time: '16:45:12',
        status: 'completed',
        reference: 'WTH-2024-000789',
        opportunity: null,
        factory: null,
        breakdown: [
            { label: 'Withdrawal Amount', amount: 50000 },
            { label: 'Bank Transfer Fee', amount: -100 },
        ],
    },
    {
        id: 'tx-007',
        type: 'refund',
        title: 'Fee Adjustment Refund',
        description: 'Platform fee adjustment credit',
        amount: 125,
        fee: 0,
        netAmount: 125,
        date: '2024-11-05',
        time: '11:30:00',
        status: 'completed',
        reference: 'REF-2024-000012',
        opportunity: 'Bamboo Furniture Production Line',
        factory: 'EcoWood Industries',
        breakdown: [
            { label: 'Refund Amount', amount: 125 },
        ],
    },
    {
        id: 'tx-008',
        type: 'investment',
        title: 'Investment in Porcelain Export',
        description: 'Investment in traditional ceramics export facility',
        amount: 500000,
        fee: 2500,
        netAmount: 502500,
        date: '2024-06-01',
        time: '11:00:00',
        status: 'completed',
        reference: 'INV-2024-000654',
        opportunity: 'Porcelain Export Facility',
        factory: 'Jingdezhen Ceramics',
        breakdown: [
            { label: 'Principal Investment', amount: 500000 },
            { label: 'Platform Fee (0.5%)', amount: 2500 },
        ],
    },
    {
        id: 'tx-009',
        type: 'yield',
        title: 'Yield Distribution - Porcelain',
        description: 'Monthly yield distribution for December 2024',
        amount: 31250,
        fee: 0,
        netAmount: 31250,
        date: '2024-12-15',
        time: '00:00:00',
        status: 'completed',
        reference: 'YLD-2024-015678',
        opportunity: 'Porcelain Export Facility',
        factory: 'Jingdezhen Ceramics',
        breakdown: [
            { label: 'Gross Yield', amount: 32895 },
            { label: 'Withholding Tax (5%)', amount: -1645 },
        ],
    },
    {
        id: 'tx-010',
        type: 'investment',
        title: 'Investment in Smart Home Assembly',
        description: 'Investment in IoT device manufacturing',
        amount: 150000,
        fee: 750,
        netAmount: 150750,
        date: '2024-09-01',
        time: '13:20:55',
        status: 'completed',
        reference: 'INV-2024-001567',
        opportunity: 'Smart Home Assembly Plant',
        factory: 'IoT Solutions Ltd.',
        breakdown: [
            { label: 'Principal Investment', amount: 150000 },
            { label: 'Platform Fee (0.5%)', amount: 750 },
        ],
    },
    {
        id: 'tx-011',
        type: 'deposit',
        title: 'Wallet Deposit',
        description: 'Bank transfer deposit to investment wallet',
        amount: 200000,
        fee: 0,
        netAmount: 200000,
        date: '2024-08-30',
        time: '08:15:00',
        status: 'completed',
        reference: 'DEP-2024-000789',
        opportunity: null,
        factory: null,
        breakdown: [
            { label: 'Deposit Amount', amount: 200000 },
        ],
    },
    {
        id: 'tx-012',
        type: 'withdrawal',
        title: 'Pending Withdrawal',
        description: 'Withdrawal request to linked bank account',
        amount: 30000,
        fee: 100,
        netAmount: 29900,
        date: '2025-01-02',
        time: '09:00:00',
        status: 'pending',
        reference: 'WTH-2025-000001',
        opportunity: null,
        factory: null,
        breakdown: [
            { label: 'Withdrawal Amount', amount: 30000 },
            { label: 'Bank Transfer Fee', amount: -100 },
        ],
    },
];

const TRANSACTION_TYPES = ['All', 'Investment', 'Yield', 'Deposit', 'Withdrawal', 'Refund'];
const STATUS_FILTERS = ['All', 'Completed', 'Pending', 'Failed'];

type TransactionType = 'investment' | 'yield' | 'deposit' | 'withdrawal' | 'refund';
type StatusType = 'completed' | 'pending' | 'failed';

export default function TransactionsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [selectedTx, setSelectedTx] = useState<typeof MOCK_TRANSACTIONS[0] | null>(null);
    const [showDetailDrawer, setShowDetailDrawer] = useState(false);
    const [showAI, setShowAI] = useState(false);

    // Filter transactions
    const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
        const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tx.factory && tx.factory.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === 'All' || tx.type.toLowerCase() === typeFilter.toLowerCase();
        const matchesStatus = statusFilter === 'All' || tx.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesDateStart = !dateRange.start || new Date(tx.date) >= new Date(dateRange.start);
        const matchesDateEnd = !dateRange.end || new Date(tx.date) <= new Date(dateRange.end);
        return matchesSearch && matchesType && matchesStatus && matchesDateStart && matchesDateEnd;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate summaries
    const totalInvested = MOCK_TRANSACTIONS.filter(t => t.type === 'investment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalYield = MOCK_TRANSACTIONS.filter(t => t.type === 'yield' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalDeposits = MOCK_TRANSACTIONS.filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = MOCK_TRANSACTIONS.filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const formatCurrency = (num: number) => {
        if (Math.abs(num) >= 1000000) return `¥${(num / 1000000).toFixed(2)}M`;
        if (Math.abs(num) >= 1000) return `¥${(num / 1000).toFixed(0)}K`;
        return `¥${num.toLocaleString()}`;
    };

    const getTypeIcon = (type: TransactionType) => {
        switch (type) {
            case 'investment': return <ArrowUpRight className="h-4 w-4" />;
            case 'yield': return <TrendingUp className="h-4 w-4" />;
            case 'deposit': return <ArrowDownRight className="h-4 w-4" />;
            case 'withdrawal': return <ArrowUpRight className="h-4 w-4" />;
            case 'refund': return <RefreshCw className="h-4 w-4" />;
            default: return <Minus className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: TransactionType) => {
        switch (type) {
            case 'investment': return 'text-panda-400 bg-panda-500/20';
            case 'yield': return 'text-success-400 bg-success-500/20';
            case 'deposit': return 'text-jade-400 bg-jade-500/20';
            case 'withdrawal': return 'text-orange-400 bg-orange-500/20';
            case 'refund': return 'text-blue-400 bg-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    const getStatusColor = (status: StatusType) => {
        switch (status) {
            case 'completed': return 'text-success-400 bg-success-500/20 border-success-500/30';
            case 'pending': return 'text-warning-400 bg-warning-500/20 border-warning-500/30';
            case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
        }
    };

    const getStatusIcon = (status: StatusType) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4" />;
            case 'pending': return <Clock className="h-4 w-4" />;
            case 'failed': return <XCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getAmountDisplay = (tx: typeof MOCK_TRANSACTIONS[0]) => {
        const isCredit = ['yield', 'deposit', 'refund'].includes(tx.type);
        return {
            prefix: isCredit ? '+' : '-',
            color: isCredit ? 'text-success-400' : 'text-orange-400',
            amount: tx.type === 'withdrawal' ? tx.netAmount : tx.amount,
        };
    };

    const openDetail = (tx: typeof MOCK_TRANSACTIONS[0]) => {
        setSelectedTx(tx);
        setShowDetailDrawer(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
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
                        <Receipt className="h-8 w-8 text-jade-400" />
                        Transactions & Ledger
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Complete history of all your financial activities
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                        onClick={() => setShowAI(true)}
                    >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        AI Assistant
                    </Button>
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-panda-500/20 rounded-lg flex items-center justify-center">
                                <ArrowUpRight className="h-4 w-4 text-panda-400" />
                            </div>
                            <span className="text-slate-400 text-sm">Invested</span>
                        </div>
                        <p className="text-xl font-bold text-white">{formatCurrency(totalInvested)}</p>
                    </CardContent>
                </Card>

                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-success-500/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-success-400" />
                            </div>
                            <span className="text-slate-400 text-sm">Yield Earned</span>
                        </div>
                        <p className="text-xl font-bold text-success-400">+{formatCurrency(totalYield)}</p>
                    </CardContent>
                </Card>

                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-jade-500/20 rounded-lg flex items-center justify-center">
                                <ArrowDownRight className="h-4 w-4 text-jade-400" />
                            </div>
                            <span className="text-slate-400 text-sm">Deposited</span>
                        </div>
                        <p className="text-xl font-bold text-white">{formatCurrency(totalDeposits)}</p>
                    </CardContent>
                </Card>

                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <ArrowUpRight className="h-4 w-4 text-orange-400" />
                            </div>
                            <span className="text-slate-400 text-sm">Withdrawn</span>
                        </div>
                        <p className="text-xl font-bold text-white">{formatCurrency(totalWithdrawals)}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, reference, or factory..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                />
                            </div>

                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-2 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jade-500"
                            >
                                {TRANSACTION_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jade-500"
                            >
                                {STATUS_FILTERS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="px-3 py-2 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jade-500"
                                />
                                <span className="text-slate-400">to</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="px-3 py-2 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jade-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Transactions List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-ink-800 border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Transaction History</CardTitle>
                            <span className="text-sm text-slate-400">
                                {filteredTransactions.length} transactions
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Receipt className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No transactions found</h3>
                                <p className="text-slate-400">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTransactions.map((tx, index) => {
                                    const amountDisplay = getAmountDisplay(tx);
                                    return (
                                        <motion.div
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => openDetail(tx)}
                                            className="p-4 bg-ink-700/50 rounded-lg hover:bg-ink-700 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Type Icon */}
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(tx.type as TransactionType)}`}>
                                                    {getTypeIcon(tx.type as TransactionType)}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-white font-medium truncate">{tx.title}</h4>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(tx.status as StatusType)}`}>
                                                            {tx.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-slate-400">{tx.date}</span>
                                                        <span className="text-slate-600">•</span>
                                                        <span className="text-sm text-slate-500 font-mono">{tx.reference}</span>
                                                    </div>
                                                </div>

                                                {/* Amount */}
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${amountDisplay.color}`}>
                                                        {amountDisplay.prefix}{formatCurrency(amountDisplay.amount)}
                                                    </p>
                                                    {tx.fee > 0 && (
                                                        <p className="text-xs text-slate-500">Fee: {formatCurrency(tx.fee)}</p>
                                                    )}
                                                </div>

                                                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {showDetailDrawer && selectedTx && (
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
                            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-ink-900 border-l border-border z-50 overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-ink-900 border-b border-border p-4 z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(selectedTx.status as StatusType)}`}>
                                        {selectedTx.status}
                                    </span>
                                    <button
                                        onClick={() => setShowDetailDrawer(false)}
                                        className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-white">{selectedTx.title}</h2>
                                <p className="text-slate-400 text-sm mt-1">{selectedTx.description}</p>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-6">
                                {/* Amount Summary */}
                                <Card className="bg-ink-800 border-border">
                                    <CardContent className="p-5">
                                        <div className="text-center">
                                            <p className="text-sm text-slate-400 mb-1">
                                                {['yield', 'deposit', 'refund'].includes(selectedTx.type) ? 'Amount Received' : 'Amount Paid'}
                                            </p>
                                            <p className={`text-4xl font-bold ${getAmountDisplay(selectedTx).color}`}>
                                                {getAmountDisplay(selectedTx).prefix}
                                                {formatCurrency(getAmountDisplay(selectedTx).amount)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Transaction Details */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader>
                                        <CardTitle className="text-white text-sm">Transaction Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Reference</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono text-sm">{selectedTx.reference}</span>
                                                <button
                                                    onClick={() => copyToClipboard(selectedTx.reference)}
                                                    className="text-slate-400 hover:text-white"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Type</span>
                                            <span className="text-white capitalize">{selectedTx.type}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Date</span>
                                            <span className="text-white">{selectedTx.date} {selectedTx.time}</span>
                                        </div>
                                        {selectedTx.factory && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Factory</span>
                                                <span className="text-white">{selectedTx.factory}</span>
                                            </div>
                                        )}
                                        {selectedTx.opportunity && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Opportunity</span>
                                                <span className="text-white text-right text-sm">{selectedTx.opportunity}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Breakdown */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader>
                                        <CardTitle className="text-white text-sm">Amount Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-3">
                                        {selectedTx.breakdown.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                                <span className="text-slate-400">{item.label}</span>
                                                <span className={`font-medium ${item.amount < 0 ? 'text-red-400' : 'text-white'}`}>
                                                    {item.amount < 0 ? '' : '¥'}{item.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between pt-2 border-t border-border">
                                            <span className="text-white font-medium">Net Amount</span>
                                            <span className={`text-lg font-bold ${getAmountDisplay(selectedTx).color}`}>
                                                ¥{selectedTx.netAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="border-border text-slate-300">
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print
                                    </Button>
                                    <Button variant="outline" className="border-border text-slate-300">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </div>

                                {/* Support Link */}
                                <Card className="bg-ink-800/50 border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-jade-500/20 rounded-lg flex items-center justify-center">
                                                <MessageSquare className="h-5 w-5 text-jade-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">Need help with this transaction?</p>
                                                <p className="text-sm text-slate-400">Contact our support team</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* AI Legal Panda Assistant */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 max-w-md z-50"
                    >
                        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-0 shadow-2xl">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                                        ⚖️
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-white">Legal Panda</h4>
                                            <button
                                                onClick={() => setShowAI(false)}
                                                className="text-white/60 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-white/90 text-sm mb-4">
                                            How can I help you with your transactions?
                                        </p>
                                        <div className="space-y-2 mb-4">
                                            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors">
                                                📋 Explain platform fees
                                            </button>
                                            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors">
                                                💰 How is withholding tax calculated?
                                            </button>
                                            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors">
                                                📝 Help me write a support ticket
                                            </button>
                                            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors">
                                                🔍 Dispute a transaction
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Ask a question..."
                                                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                            />
                                            <Button className="bg-white text-indigo-700 hover:bg-white/90">
                                                Ask
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
