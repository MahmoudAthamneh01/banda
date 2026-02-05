'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    Shield,
    Download,
    Search,
    Filter,
    Eye,
    FileText,
    Calculator,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
} from 'lucide-react';

// Mock Finance KPIs
const FINANCE_KPIS = [
    {
        label: 'Escrow Balance',
        value: '¥12.5M',
        change: '+2.3M',
        trend: 'up',
        icon: Shield,
        color: 'jade',
    },
    {
        label: 'Platform Funds',
        value: '¥3.2M',
        change: '+450K',
        trend: 'up',
        icon: Wallet,
        color: 'panda',
    },
    {
        label: 'Fees Collected',
        value: '¥892K',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'jade',
    },
    {
        label: 'Referral Payouts',
        value: '¥234K',
        change: '+8.2%',
        trend: 'up',
        icon: TrendingUp,
        color: 'sky',
    },
    {
        label: 'Cashout Pending',
        value: '¥156K',
        change: '-23K',
        trend: 'down',
        icon: ArrowUpRight,
        color: 'warning',
    },
    {
        label: 'Monthly Revenue',
        value: '¥4.5M',
        change: '+15.3%',
        trend: 'up',
        icon: PieChart,
        color: 'jade',
    },
];

// Mock Ledger Entries
const LEDGER_ENTRIES = [
    {
        id: 'L-2026-00523',
        walletId: 'W-8923',
        type: 'ESCROW_IN',
        amount: 25000,
        orderId: 'ORD-45621',
        userId: 'user_8923',
        timestamp: '2026-02-03T14:32:15',
        status: 'completed',
    },
    {
        id: 'L-2026-00522',
        walletId: 'W-2341',
        type: 'REFERRAL_PAYOUT',
        amount: -1250,
        orderId: null,
        userId: 'user_2341',
        timestamp: '2026-02-03T13:45:22',
        status: 'completed',
    },
    {
        id: 'L-2026-00521',
        walletId: 'W-7654',
        type: 'FEE_COLLECTION',
        amount: 875,
        orderId: 'ORD-45619',
        userId: 'user_7654',
        timestamp: '2026-02-03T12:18:45',
        status: 'completed',
    },
    {
        id: 'L-2026-00520',
        walletId: 'W-3421',
        type: 'ESCROW_RELEASE',
        amount: -18500,
        orderId: 'ORD-45612',
        userId: 'user_3421',
        timestamp: '2026-02-03T11:22:30',
        status: 'completed',
    },
    {
        id: 'L-2026-00519',
        walletId: 'W-9012',
        type: 'INSURANCE_FUND',
        amount: 450,
        orderId: 'ORD-45621',
        userId: 'system',
        timestamp: '2026-02-03T10:55:12',
        status: 'completed',
    },
];

// Mock Sovereign Split Buckets
const SOVEREIGN_SPLIT = [
    { label: 'Operations Fund', percentage: 30, amount: 960000, color: 'panda' },
    { label: 'Growth Fund', percentage: 25, amount: 800000, color: 'jade' },
    { label: 'Insurance Pool', percentage: 20, amount: 640000, color: 'sky' },
    { label: 'Team Rewards', percentage: 15, amount: 480000, color: 'silk' },
    { label: 'Reserve Fund', percentage: 10, amount: 320000, color: 'ruby' },
];

export default function ThroneFinancePage() {
    const params = useParams();
    const locale = params.locale as string;

    const [selectedLedgerEntry, setSelectedLedgerEntry] = useState<any>(null);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSplitSimulator, setShowSplitSimulator] = useState(false);
    const [simulateAmount, setSimulateAmount] = useState('');

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ESCROW_IN': return 'jade';
            case 'ESCROW_RELEASE': return 'sky';
            case 'FEE_COLLECTION': return 'panda';
            case 'REFERRAL_PAYOUT': return 'warning';
            case 'INSURANCE_FUND': return 'ruby';
            default: return 'slate';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ESCROW_IN': return ArrowDownRight;
            case 'ESCROW_RELEASE': return ArrowUpRight;
            case 'FEE_COLLECTION': return DollarSign;
            case 'REFERRAL_PAYOUT': return TrendingUp;
            case 'INSURANCE_FUND': return Shield;
            default: return FileText;
        }
    };

    const calculateSplit = (amount: number) => {
        return SOVEREIGN_SPLIT.map(bucket => ({
            ...bucket,
            calculatedAmount: (amount * bucket.percentage) / 100,
        }));
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-200">Finance Oversight</h1>
                        <p className="text-slate-400 mt-1">Closed-loop financial control & ledger management</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:border-jade-500 hover:text-jade-400"
                            onClick={() => setShowSplitSimulator(!showSplitSimulator)}
                        >
                            <Calculator className="h-4 w-4 mr-2" />
                            Split Simulator
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-slate-300"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Split Simulator */}
            <AnimatePresence>
                {showSplitSimulator && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card className="bg-ink-850 border-jade-500/30">
                            <CardHeader>
                                <CardTitle className="text-slate-200">Sovereign Split Simulator</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Enter Amount (¥)
                                    </label>
                                    <input
                                        type="number"
                                        value={simulateAmount}
                                        onChange={(e) => setSimulateAmount(e.target.value)}
                                        placeholder="100000"
                                        className="w-full px-4 py-2 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    />
                                </div>

                                {simulateAmount && parseFloat(simulateAmount) > 0 && (
                                    <div className="space-y-2">
                                        {calculateSplit(parseFloat(simulateAmount)).map((bucket) => (
                                            <div
                                                key={bucket.label}
                                                className="flex items-center justify-between p-3 bg-ink-800 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full bg-${bucket.color}-500`} />
                                                    <span className="text-slate-300">{bucket.label}</span>
                                                    <span className="text-slate-500 text-sm">({bucket.percentage}%)</span>
                                                </div>
                                                <span className="text-jade-400 font-bold">
                                                    ¥{bucket.calculatedAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Finance KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FINANCE_KPIS.map((kpi, index) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="bg-ink-850 border-border hover:border-jade-500/50 hover:shadow-soft transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-${kpi.color}-500/20 rounded-lg flex items-center justify-center`}>
                                        <kpi.icon className={`h-6 w-6 text-${kpi.color}-400`} />
                                    </div>
                                    <div className={`flex items-center gap-1 ${
                                        kpi.trend === 'up' ? 'text-jade-400' : 'text-ruby-400'
                                    }`}>
                                        {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        <span className="text-sm font-medium">{kpi.change}</span>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-slate-200 mb-1">{kpi.value}</p>
                                <p className="text-slate-400 text-sm">{kpi.label}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ledger Explorer */}
                <div className="lg:col-span-2">
                    <Card className="bg-ink-850 border-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-200">Ledger Explorer</CardTitle>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-3 py-1 bg-ink-800 border border-border rounded text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="ESCROW_IN">Escrow In</option>
                                        <option value="ESCROW_RELEASE">Escrow Release</option>
                                        <option value="FEE_COLLECTION">Fee Collection</option>
                                        <option value="REFERRAL_PAYOUT">Referral Payout</option>
                                        <option value="INSURANCE_FUND">Insurance Fund</option>
                                    </select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by transaction ID, wallet ID, user ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-jade-500"
                                />
                            </div>

                            {/* Ledger Table */}
                            <div className="space-y-2">
                                {LEDGER_ENTRIES.map((entry, i) => {
                                    const TypeIcon = getTypeIcon(entry.type);
                                    const color = getTypeColor(entry.type);
                                    return (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-4 bg-ink-800 hover:bg-ink-800/80 rounded-lg cursor-pointer transition-colors group"
                                            onClick={() => setSelectedLedgerEntry(entry)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <TypeIcon className={`h-5 w-5 text-${color}-400`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-slate-200 font-medium text-sm">{entry.id}</h4>
                                                        <span className={`text-lg font-bold ${
                                                            entry.amount > 0 ? 'text-jade-400' : 'text-ruby-400'
                                                        }`}>
                                                            {entry.amount > 0 ? '+' : ''}¥{Math.abs(entry.amount).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                                        <span>{entry.type.replace(/_/g, ' ')}</span>
                                                        <span>•</span>
                                                        <span>Wallet: {entry.walletId}</span>
                                                        {entry.orderId && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Order: {entry.orderId}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {new Date(entry.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Eye className="h-4 w-4 text-slate-600 group-hover:text-jade-400 transition-colors" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sovereign Split Monitor */}
                <div>
                    <Card className="bg-ink-850 border-border">
                        <CardHeader>
                            <CardTitle className="text-slate-200 text-sm">Sovereign Split Monitor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-slate-400 text-sm mb-3">10% Platform Fee Distribution</p>
                                <div className="space-y-3">
                                    {SOVEREIGN_SPLIT.map((bucket) => (
                                        <div key={bucket.label}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-slate-300 text-sm">{bucket.label}</span>
                                                <span className="text-slate-400 text-xs">{bucket.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-ink-800 rounded-full h-2 mb-1">
                                                <div
                                                    className={`bg-gradient-to-r from-${bucket.color}-600 to-${bucket.color}-500 h-2 rounded-full`}
                                                    style={{ width: `${bucket.percentage}%` }}
                                                />
                                            </div>
                                            <p className="text-jade-400 text-xs font-bold">¥{bucket.amount.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Exceptions</span>
                                </div>
                                <div className="p-3 bg-warning-500/10 border border-warning-500/30 rounded-lg">
                                    <p className="text-warning-400 text-xs">
                                        Student Ambassador: 5% fee (instead of 10%)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Ledger Entry Detail Drawer */}
            <AnimatePresence>
                {selectedLedgerEntry && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLedgerEntry(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-ink-850 border-l border-border z-50 overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-200">Ledger Entry Details</h3>
                                    <button
                                        onClick={() => setSelectedLedgerEntry(null)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <FileText className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Transaction ID</p>
                                        <p className="text-slate-200 font-mono">{selectedLedgerEntry.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Type</p>
                                        <span className={`px-2 py-1 bg-${getTypeColor(selectedLedgerEntry.type)}-500/20 text-${getTypeColor(selectedLedgerEntry.type)}-400 text-sm rounded`}>
                                            {selectedLedgerEntry.type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Amount</p>
                                        <p className={`text-2xl font-bold ${
                                            selectedLedgerEntry.amount > 0 ? 'text-jade-400' : 'text-ruby-400'
                                        }`}>
                                            {selectedLedgerEntry.amount > 0 ? '+' : ''}¥{Math.abs(selectedLedgerEntry.amount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Wallet ID</p>
                                        <p className="text-slate-200 font-mono">{selectedLedgerEntry.walletId}</p>
                                    </div>
                                    {selectedLedgerEntry.orderId && (
                                        <div>
                                            <p className="text-slate-400 text-sm mb-1">Order ID</p>
                                            <p className="text-slate-200 font-mono">{selectedLedgerEntry.orderId}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">User ID</p>
                                        <p className="text-slate-200 font-mono">{selectedLedgerEntry.userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Timestamp</p>
                                        <p className="text-slate-200">{new Date(selectedLedgerEntry.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Status</p>
                                        <span className="px-2 py-1 bg-success-500/20 text-success-400 text-sm rounded">
                                            {selectedLedgerEntry.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
