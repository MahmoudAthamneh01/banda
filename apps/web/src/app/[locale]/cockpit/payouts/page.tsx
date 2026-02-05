'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Lock,
    Clock,
    DollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle,
    X,
    Plus,
    ChevronRight,
    Shield,
    History,
    Filter,
} from 'lucide-react';

// Mock Balance Data
const BALANCE = {
    available: '¥45,680.00',
    availableRaw: 45680,
    locked: '¥12,450.00',
    lockedRaw: 12450,
    pending: '¥8,200.00',
    pendingRaw: 8200,
    total: '¥66,330.00',
    totalRaw: 66330,
};

// Mock Payout Requests
const PAYOUT_REQUESTS = [
    {
        id: 'PO-2024-0012',
        amount: '¥5,000.00',
        method: 'Bank Transfer',
        bankAccount: '****6789',
        status: 'pending',
        requestedAt: '2024-02-10 14:30',
        estimatedArrival: '2024-02-12',
    },
    {
        id: 'PO-2024-0011',
        amount: '¥10,000.00',
        method: 'Bank Transfer',
        bankAccount: '****6789',
        status: 'processing',
        requestedAt: '2024-02-08 09:15',
        estimatedArrival: '2024-02-11',
    },
    {
        id: 'PO-2024-0010',
        amount: '¥8,500.00',
        method: 'Bank Transfer',
        bankAccount: '****6789',
        status: 'completed',
        requestedAt: '2024-02-05 16:45',
        completedAt: '2024-02-07',
    },
    {
        id: 'PO-2024-0009',
        amount: '¥3,200.00',
        method: 'WeChat Pay',
        bankAccount: 'WeChat Wallet',
        status: 'completed',
        requestedAt: '2024-02-01 11:00',
        completedAt: '2024-02-01',
    },
];

// Mock Ledger Transactions
const LEDGER_TRANSACTIONS = [
    {
        id: 'TX-001',
        type: 'credit',
        description: 'Order BC-2024-1889 released',
        amount: '+¥8,985.00',
        balance: '¥66,330.00',
        date: '2024-02-10 10:30',
        reference: 'BC-2024-1889',
    },
    {
        id: 'TX-002',
        type: 'debit',
        description: 'Payout PO-2024-0012 initiated',
        amount: '-¥5,000.00',
        balance: '¥57,345.00',
        date: '2024-02-10 14:30',
        reference: 'PO-2024-0012',
    },
    {
        id: 'TX-003',
        type: 'credit',
        description: 'Order BC-2024-1885 released',
        amount: '+¥12,450.00',
        balance: '¥62,345.00',
        date: '2024-02-09 09:15',
        reference: 'BC-2024-1885',
    },
    {
        id: 'TX-004',
        type: 'lock',
        description: 'Escrow locked for dispute',
        amount: '-¥3,160.00 (locked)',
        balance: '¥49,895.00',
        date: '2024-02-08 14:00',
        reference: 'BC-2024-1888',
    },
    {
        id: 'TX-005',
        type: 'credit',
        description: 'Order BC-2024-1884 released',
        amount: '+¥5,200.00',
        balance: '¥53,055.00',
        date: '2024-02-07 16:45',
        reference: 'BC-2024-1884',
    },
    {
        id: 'TX-006',
        type: 'fee',
        description: 'Platform fee (2%)',
        amount: '-¥104.00',
        balance: '¥47,855.00',
        date: '2024-02-07 16:45',
        reference: 'BC-2024-1884',
    },
    {
        id: 'TX-007',
        type: 'debit',
        description: 'Payout PO-2024-0010 completed',
        amount: '-¥8,500.00',
        balance: '¥47,959.00',
        date: '2024-02-05 16:45',
        reference: 'PO-2024-0010',
    },
    {
        id: 'TX-008',
        type: 'credit',
        description: 'Order BC-2024-1880 released',
        amount: '+¥15,600.00',
        balance: '¥56,459.00',
        date: '2024-02-04 11:30',
        reference: 'BC-2024-1880',
    },
    {
        id: 'TX-009',
        type: 'fee',
        description: 'Platform fee (2%)',
        amount: '-¥312.00',
        balance: '¥40,859.00',
        date: '2024-02-04 11:30',
        reference: 'BC-2024-1880',
    },
    {
        id: 'TX-010',
        type: 'debit',
        description: 'Payout PO-2024-0009 completed',
        amount: '-¥3,200.00',
        balance: '¥41,171.00',
        date: '2024-02-01 11:00',
        reference: 'PO-2024-0009',
    },
];

const STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'completed', label: 'Completed' },
];

export default function PayoutsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [activeTab, setActiveTab] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('bank');
    const [showAI, setShowAI] = useState(false);
    const [ledgerFilter, setLedgerFilter] = useState('all');

    // Filter payout requests
    const filteredPayouts = PAYOUT_REQUESTS.filter(p =>
        activeTab === 'all' || p.status === activeTab
    );

    // Filter ledger
    const filteredLedger = LEDGER_TRANSACTIONS.filter(t =>
        ledgerFilter === 'all' || t.type === ledgerFilter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-warning-500/20 text-warning-400';
            case 'processing': return 'bg-blue-500/20 text-blue-400';
            case 'completed': return 'bg-success-500/20 text-success-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'credit': return 'text-success-400';
            case 'debit': return 'text-red-400';
            case 'lock': return 'text-warning-400';
            case 'fee': return 'text-slate-400';
            default: return 'text-white';
        }
    };

    const handleCreatePayout = () => {
        const amount = parseFloat(payoutAmount);
        if (amount > BALANCE.availableRaw) {
            setShowAI(true);
            return;
        }
        // Process payout
        setShowCreateModal(false);
        setPayoutAmount('');
    };

    return (
        <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <Wallet className="h-8 w-8 text-jade-400" />
                            Payouts & Earnings
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Manage your earnings and payout requests
                        </p>
                    </div>
                    <Button
                        className="bg-jade-500 hover:bg-jade-600"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Request Payout
                    </Button>
                </motion.div>

                {/* Balance Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <Card className="bg-gradient-to-br from-jade-500 to-jade-600 border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-jade-100 text-sm">Available Balance</p>
                                    <p className="text-3xl font-bold text-white mt-1">{BALANCE.available}</p>
                                </div>
                                <DollarSign className="h-12 w-12 text-jade-200/50" />
                            </div>
                            <p className="text-jade-100 text-xs mt-3">Ready to withdraw</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Locked in Escrow</p>
                                    <p className="text-2xl font-bold text-white mt-1">{BALANCE.locked}</p>
                                </div>
                                <Lock className="h-10 w-10 text-warning-400/50" />
                            </div>
                            <p className="text-slate-500 text-xs mt-3">Awaiting order completion</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Pending Payout</p>
                                    <p className="text-2xl font-bold text-white mt-1">{BALANCE.pending}</p>
                                </div>
                                <Clock className="h-10 w-10 text-blue-400/50" />
                            </div>
                            <p className="text-slate-500 text-xs mt-3">2 payout requests in progress</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Total Balance</p>
                                    <p className="text-2xl font-bold text-white mt-1">{BALANCE.total}</p>
                                </div>
                                <TrendingUp className="h-10 w-10 text-panda-400/50" />
                            </div>
                            <p className="text-panda-400 text-xs mt-3 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                +15.3% this month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payout Requests */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="bg-ink-800 border-border">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <ArrowUpRight className="h-5 w-5 text-jade-400" />
                                        Payout Requests
                                    </CardTitle>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    {STATUS_TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-jade-500 text-white'
                                                    : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    {filteredPayouts.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Wallet className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                            <p className="text-slate-400">No payout requests found</p>
                                        </div>
                                    ) : (
                                        filteredPayouts.map((payout, index) => (
                                            <motion.div
                                                key={payout.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="p-4 bg-ink-700 rounded-lg"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            payout.status === 'completed' ? 'bg-success-500/20' :
                                                            payout.status === 'processing' ? 'bg-blue-500/20' :
                                                            'bg-warning-500/20'
                                                        }`}>
                                                            <ArrowUpRight className={`h-5 w-5 ${
                                                                payout.status === 'completed' ? 'text-success-400' :
                                                                payout.status === 'processing' ? 'text-blue-400' :
                                                                'text-warning-400'
                                                            }`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{payout.amount}</p>
                                                            <p className="text-sm text-slate-400">
                                                                {payout.method} • {payout.bankAccount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                                                            {payout.status}
                                                        </span>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {payout.status === 'completed' 
                                                                ? `Completed ${payout.completedAt}`
                                                                : `ETA: ${payout.estimatedArrival}`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Compliance Notes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-ink-800 border-border">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-panda-400" />
                                    Compliance Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <div className="p-3 bg-panda-500/10 border border-panda-500/20 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-panda-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-white font-medium">KYC Verified</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Identity verification completed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-3 bg-jade-500/10 border border-jade-500/20 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-jade-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-white font-medium">Bank Account Linked</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                CMB ****6789
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-warning-500/10 border border-warning-500/20 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-warning-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-white font-medium">Tax Info Needed</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Upload business license for higher limits
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Payout Limits</h4>
                                    <div className="space-y-2 text-xs text-slate-400">
                                        <div className="flex justify-between">
                                            <span>Daily</span>
                                            <span className="text-white">¥50,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Monthly</span>
                                            <span className="text-white">¥500,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Min withdrawal</span>
                                            <span className="text-white">¥100</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Ledger */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <History className="h-5 w-5 text-slate-400" />
                                    Ledger (Last 10 Transactions)
                                </CardTitle>
                                <div className="flex gap-2">
                                    <select
                                        value={ledgerFilter}
                                        onChange={(e) => setLedgerFilter(e.target.value)}
                                        className="px-3 py-1 bg-ink-700 border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">Credits</option>
                                        <option value="debit">Debits</option>
                                        <option value="fee">Fees</option>
                                        <option value="lock">Locks</option>
                                    </select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="p-3 text-left text-xs font-medium text-slate-400">Date</th>
                                            <th className="p-3 text-left text-xs font-medium text-slate-400">Description</th>
                                            <th className="p-3 text-left text-xs font-medium text-slate-400">Reference</th>
                                            <th className="p-3 text-right text-xs font-medium text-slate-400">Amount</th>
                                            <th className="p-3 text-right text-xs font-medium text-slate-400">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLedger.map((tx, index) => (
                                            <motion.tr
                                                key={tx.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="border-b border-border/50 hover:bg-ink-700/50 transition-colors"
                                            >
                                                <td className="p-3 text-sm text-slate-400">{tx.date}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                            tx.type === 'credit' ? 'bg-success-500/20' :
                                                            tx.type === 'debit' ? 'bg-red-500/20' :
                                                            tx.type === 'lock' ? 'bg-warning-500/20' :
                                                            'bg-slate-500/20'
                                                        }`}>
                                                            {tx.type === 'credit' ? (
                                                                <ArrowDownLeft className="h-3 w-3 text-success-400" />
                                                            ) : tx.type === 'debit' ? (
                                                                <ArrowUpRight className="h-3 w-3 text-red-400" />
                                                            ) : tx.type === 'lock' ? (
                                                                <Lock className="h-3 w-3 text-warning-400" />
                                                            ) : (
                                                                <FileText className="h-3 w-3 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-white">{tx.description}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-sm text-panda-400 font-mono">{tx.reference}</span>
                                                </td>
                                                <td className={`p-3 text-right text-sm font-medium ${getTransactionColor(tx.type)}`}>
                                                    {tx.amount}
                                                </td>
                                                <td className="p-3 text-right text-sm text-white">{tx.balance}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Create Payout Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCreateModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                            >
                                <Card className="bg-ink-900 border-border w-full max-w-md">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white">Request Payout</CardTitle>
                                            <button
                                                onClick={() => setShowCreateModal(false)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-jade-500/10 border border-jade-500/30 rounded-lg">
                                            <p className="text-sm text-slate-400">Available Balance</p>
                                            <p className="text-2xl font-bold text-jade-400">{BALANCE.available}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Amount (¥)
                                            </label>
                                            <input
                                                type="number"
                                                value={payoutAmount}
                                                onChange={(e) => setPayoutAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Payout Method
                                            </label>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => setPayoutMethod('bank')}
                                                    className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${
                                                        payoutMethod === 'bank'
                                                            ? 'border-jade-500 bg-jade-500/10'
                                                            : 'border-border bg-ink-800 hover:bg-ink-700'
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        payoutMethod === 'bank' ? 'bg-jade-500' : 'bg-ink-700'
                                                    }`}>
                                                        🏦
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">Bank Transfer</p>
                                                        <p className="text-sm text-slate-400">CMB ****6789 • 1-3 business days</p>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => setPayoutMethod('wechat')}
                                                    className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${
                                                        payoutMethod === 'wechat'
                                                            ? 'border-jade-500 bg-jade-500/10'
                                                            : 'border-border bg-ink-800 hover:bg-ink-700'
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        payoutMethod === 'wechat' ? 'bg-jade-500' : 'bg-ink-700'
                                                    }`}>
                                                        💬
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">WeChat Pay</p>
                                                        <p className="text-sm text-slate-400">Instant • ¥2,000 daily limit</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-jade-500 hover:bg-jade-600"
                                            onClick={handleCreatePayout}
                                            disabled={!payoutAmount || parseFloat(payoutAmount) < 100}
                                        >
                                            Request Payout
                                        </Button>

                                        <p className="text-xs text-center text-slate-500">
                                            Minimum withdrawal: ¥100 • Processing fee may apply
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Host Panda - Payout Guide */}
                <AnimatePresence>
                    {showAI && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 right-6 max-w-sm z-[60]"
                        >
                            <Card className="bg-gradient-to-br from-jade-600 to-emerald-600 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🐼
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">Host Panda</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                ⚠️ Insufficient funds for this payout!
                                            </p>
                                            <p className="text-white/70 text-xs mt-2">
                                                Your available balance is {BALANCE.available}. 
                                                Some funds may be locked in escrow for pending orders.
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-white text-jade-700 hover:bg-white/90"
                                                    onClick={() => setShowAI(false)}
                                                >
                                                    Got it
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/30 text-white hover:bg-white/10"
                                                    onClick={() => {
                                                        setPayoutAmount(BALANCE.availableRaw.toString());
                                                        setShowAI(false);
                                                    }}
                                                >
                                                    Use Max
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
        </div>
    );
}
