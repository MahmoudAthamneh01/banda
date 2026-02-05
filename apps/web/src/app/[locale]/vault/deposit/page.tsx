'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Plus,
    ArrowDownRight,
    CreditCard,
    Building2,
    Wallet,
    AlertCircle,
    CheckCircle,
    Clock,
    Shield,
    Info,
    X,
    ChevronRight,
    Copy,
    Smartphone,
    QrCode,
    History,
    TrendingUp,
} from 'lucide-react';

// Mock Payment Methods
const PAYMENT_METHODS = [
    {
        id: 'bank',
        name: 'Bank Transfer',
        icon: Building2,
        description: 'Transfer from your linked bank account',
        fee: 'Free',
        processingTime: 'Instant',
        minAmount: 1000,
        maxAmount: 5000000,
        recommended: true,
    },
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: CreditCard,
        description: 'Visa, Mastercard, UnionPay',
        fee: '2.5%',
        processingTime: 'Instant',
        minAmount: 100,
        maxAmount: 500000,
        recommended: false,
    },
    {
        id: 'alipay',
        name: 'Alipay',
        icon: Wallet,
        description: 'Transfer via Alipay',
        fee: '1%',
        processingTime: 'Instant',
        minAmount: 100,
        maxAmount: 1000000,
        recommended: false,
    },
    {
        id: 'wechat',
        name: 'WeChat Pay',
        icon: Smartphone,
        description: 'Transfer via WeChat',
        fee: '1%',
        processingTime: 'Instant',
        minAmount: 100,
        maxAmount: 1000000,
        recommended: false,
    },
];

// Mock Recent Deposits
const RECENT_DEPOSITS = [
    {
        id: 'd1',
        amount: 500000,
        method: 'Bank Transfer',
        status: 'completed',
        date: '2026-02-01',
        time: '09:22:31',
        reference: 'DEP-2026-000456',
    },
    {
        id: 'd2',
        amount: 200000,
        method: 'Bank Transfer',
        status: 'completed',
        date: '2026-01-15',
        time: '14:15:00',
        reference: 'DEP-2026-000123',
    },
    {
        id: 'd3',
        amount: 100000,
        method: 'Alipay',
        status: 'completed',
        date: '2025-12-20',
        time: '11:30:45',
        reference: 'DEP-2025-002345',
    },
];

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000];

export default function DepositPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_METHODS[0] | null>(null);
    const [amount, setAmount] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const selectedMethodDetails = PAYMENT_METHODS.find(m => m.id === selectedMethod?.id);

    const formatCurrency = (num: number) => {
        if (num >= 1000000) return `¥${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `¥${(num / 1000).toFixed(0)}K`;
        return `¥${num.toLocaleString()}`;
    };

    const calculateFee = () => {
        if (!selectedMethodDetails || !amount) return 0;
        if (selectedMethodDetails.fee === 'Free') return 0;
        const feePercent = parseFloat(selectedMethodDetails.fee.replace('%', ''));
        return (parseFloat(amount) * feePercent) / 100;
    };

    const handleDeposit = () => {
        setShowConfirmation(false);
        // Simulate processing
        setTimeout(() => {
            setShowSuccess(true);
        }, 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-success-400 bg-success-500/20 border-success-500/30';
            case 'pending': return 'text-warning-400 bg-warning-500/20 border-warning-500/30';
            case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <Plus className="h-8 w-8 text-jade-400" />
                        Deposit Funds
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Add funds to your investment wallet
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                        onClick={() => router.push(`/${locale}/vault/transactions`)}
                    >
                        <History className="h-4 w-4 mr-2" />
                        History
                    </Button>
                </div>
            </motion.div>

            {/* Current Balance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-gradient-to-br from-panda-700 via-panda-500 to-sky-500 border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm mb-1">Available Balance</p>
                                <p className="text-4xl font-bold text-white">¥450,000</p>
                                <p className="text-white/80 text-sm mt-2">Ready to invest</p>
                            </div>
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                                <Wallet className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deposit Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Method Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-ink-800 border-border">
                            <CardHeader>
                                <CardTitle className="text-white">Select Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {PAYMENT_METHODS.map((method, index) => (
                                    <motion.div
                                        key={method.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + index * 0.05 }}
                                        onClick={() => setSelectedMethod(method)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-glow-primary-sm ${
                                            selectedMethod?.id === method.id
                                                ? 'border-jade-500 bg-jade-500/10'
                                                : 'border-border hover:border-jade-500/50 bg-ink-850/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                selectedMethod?.id === method.id
                                                    ? 'bg-jade-500/20'
                                                    : 'bg-ink-700'
                                            }`}>
                                                <method.icon className={`h-6 w-6 ${
                                                    selectedMethod?.id === method.id
                                                        ? 'text-jade-400'
                                                        : 'text-slate-400'
                                                }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-white font-medium">{method.name}</h4>
                                                    {method.recommended && (
                                                        <span className="px-2 py-0.5 bg-jade-500/20 text-jade-400 text-xs rounded-full">
                                                            Recommended
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400 mb-2">{method.description}</p>
                                                <div className="flex items-center gap-4 text-xs">
                                                    <span className="text-slate-500">Fee: <span className="text-white">{method.fee}</span></span>
                                                    <span className="text-slate-500">•</span>
                                                    <span className="text-slate-500">Processing: <span className="text-white">{method.processingTime}</span></span>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                selectedMethod?.id === method.id
                                                    ? 'border-jade-500 bg-jade-500'
                                                    : 'border-slate-500'
                                            }`}>
                                                {selectedMethod?.id === method.id && (
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Amount Input */}
                    {selectedMethod && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-ink-800 border-border">
                                <CardHeader>
                                    <CardTitle className="text-white">Enter Amount</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Amount Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Deposit Amount (¥)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">¥</span>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full pl-12 pr-4 py-4 bg-ink-850 border border-border rounded-lg text-white text-2xl font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Min: {formatCurrency(selectedMethodDetails!.minAmount)} • Max: {formatCurrency(selectedMethodDetails!.maxAmount)}
                                        </p>
                                    </div>

                                    {/* Quick Amount Buttons */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {QUICK_AMOUNTS.map(quickAmount => (
                                            <Button
                                                key={quickAmount}
                                                variant="outline"
                                                className="border-border text-slate-300 hover:border-panda-500 hover:text-panda-400 hover:bg-panda-500/10"
                                                onClick={() => setAmount(quickAmount.toString())}
                                            >
                                                {formatCurrency(quickAmount)}
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Fee Calculation */}
                                    {amount && parseFloat(amount) > 0 && (
                                        <div className="p-4 bg-ink-850 border border-border rounded-lg space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400">Amount</span>
                                                <span className="text-white font-medium">¥{parseFloat(amount).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400">Processing Fee</span>
                                                <span className="text-white font-medium">
                                                    {calculateFee() === 0 ? 'Free' : `¥${calculateFee().toLocaleString()}`}
                                                </span>
                                            </div>
                                            <div className="h-px bg-border my-2" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-medium">Total</span>
                                                <span className="text-jade-400 text-xl font-bold">
                                                    ¥{(parseFloat(amount) + calculateFee()).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Deposit Button */}
                                    <Button
                                        className="w-full bg-panda-500 hover:bg-panda-600 hover:shadow-glow-primary text-lg py-6"
                                        disabled={!amount || parseFloat(amount) < selectedMethodDetails!.minAmount}
                                        onClick={() => setShowConfirmation(true)}
                                    >
                                        <ArrowDownRight className="h-5 w-5 mr-2" />
                                        Deposit {amount && parseFloat(amount) > 0 ? `¥${parseFloat(amount).toLocaleString()}` : 'Funds'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Security Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                    >
                        <Card className="bg-ink-850 border-border">
                            <CardHeader>
                                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-jade-500" />
                                    Secure & Protected
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-success-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-slate-300">Bank-level encryption</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-success-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-slate-300">PBOC regulated</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-success-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-slate-300">Funds segregation</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-success-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-slate-300">2FA authentication</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* How it Works */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-ink-850 border-border">
                            <CardHeader>
                                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                                    <Info className="h-4 w-4 text-sky-500" />
                                    How it Works
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-jade-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-jade-400 text-xs font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Select Method</p>
                                        <p className="text-slate-400 text-xs mt-1">Choose your preferred payment method</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-jade-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-jade-400 text-xs font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Enter Amount</p>
                                        <p className="text-slate-400 text-xs mt-1">Specify how much you want to deposit</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-jade-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-jade-400 text-xs font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Instant Credit</p>
                                        <p className="text-slate-400 text-xs mt-1">Funds available immediately</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Deposits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <Card className="bg-ink-850 border-border">
                            <CardHeader>
                                <CardTitle className="text-slate-200 text-sm">Recent Deposits</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {RECENT_DEPOSITS.map(deposit => (
                                    <div
                                        key={deposit.id}
                                        className="flex items-center justify-between p-2 bg-ink-700/50 rounded"
                                    >
                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {formatCurrency(deposit.amount)}
                                            </p>
                                            <p className="text-xs text-slate-500">{deposit.date}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(deposit.status)}`}>
                                            {deposit.status}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && selectedMethodDetails && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirmation(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 flex items-center justify-center z-[60] p-4"
                        >
                            <Card className="bg-ink-850 border-border-strong w-full max-w-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-slate-200">Confirm Deposit</CardTitle>
                                        <button
                                            onClick={() => setShowConfirmation(false)}
                                            className="text-slate-400 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-ink-800 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Payment Method</span>
                                            <span className="text-white font-medium">{selectedMethodDetails.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Amount</span>
                                            <span className="text-white font-medium">¥{parseFloat(amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Fee</span>
                                            <span className="text-white font-medium">
                                                {calculateFee() === 0 ? 'Free' : `¥${calculateFee().toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="h-px bg-border" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-medium">Total</span>
                                            <span className="text-jade-400 text-xl font-bold">
                                                ¥{(parseFloat(amount) + calculateFee()).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <div className="flex gap-3">
                                            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-blue-400 text-sm font-medium">Processing Time</p>
                                                <p className="text-slate-300 text-sm mt-1">
                                                    Funds will be available {selectedMethodDetails.processingTime.toLowerCase()} in your wallet
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-border text-slate-300"
                                            onClick={() => setShowConfirmation(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="flex-1 bg-panda-500 hover:bg-panda-600 hover:shadow-glow-primary"
                                            onClick={handleDeposit}
                                        >
                                            Confirm Deposit
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 flex items-center justify-center z-[60] p-4"
                        >
                            <Card className="bg-ink-850 border-border-strong w-full max-w-md text-center">
                                <CardContent className="p-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="w-20 h-20 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle className="h-10 w-10 text-success-500" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-slate-200 mb-2">Deposit Successful!</h3>
                                    <p className="text-slate-400 mb-6">
                                        ¥{parseFloat(amount).toLocaleString()} has been added to your wallet
                                    </p>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-border text-slate-300"
                                            onClick={() => router.push(`/${locale}/vault/transactions`)}
                                        >
                                            View Transaction
                                        </Button>
                                        <Button
                                            className="flex-1 bg-panda-500 hover:bg-panda-600 hover:shadow-glow-primary"
                                            onClick={() => router.push(`/${locale}/vault/opportunities`)}
                                        >
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Start Investing
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
