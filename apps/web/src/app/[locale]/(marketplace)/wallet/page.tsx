'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { Button } from '@bandachao/ui';
import {
  Wallet,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Clock,
  Shield,
  CreditCard,
  Plus,
  Minus,
  ChevronRight,
  Filter,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Gift,
  Sparkles,
  X,
} from 'lucide-react';

// Mock Wallet Data
const WALLET_DATA = {
  available: 12450.00,
  locked: 3200.00,
  total: 15650.00,
  currency: '¥',
};

const TRANSACTIONS = [
  {
    id: 1,
    type: 'deposit',
    description: 'Bank Transfer Deposit',
    amount: 5000,
    status: 'completed',
    date: '2024-01-15',
    time: '14:32',
    reference: 'DEP-78453',
  },
  {
    id: 2,
    type: 'purchase',
    description: 'Order #BC-20240115-78453',
    amount: -937,
    status: 'completed',
    date: '2024-01-15',
    time: '10:25',
    reference: 'BC-78453',
  },
  {
    id: 3,
    type: 'escrow',
    description: 'Escrow Hold - Order #BC-20240114-65821',
    amount: -1299,
    status: 'pending',
    date: '2024-01-14',
    time: '16:45',
    reference: 'ESC-65821',
  },
  {
    id: 4,
    type: 'refund',
    description: 'Refund - Order #BC-20240110-42156',
    amount: 459,
    status: 'completed',
    date: '2024-01-12',
    time: '09:15',
    reference: 'REF-42156',
  },
  {
    id: 5,
    type: 'withdrawal',
    description: 'Bank Withdrawal',
    amount: -2000,
    status: 'completed',
    date: '2024-01-10',
    time: '11:00',
    reference: 'WD-31489',
  },
  {
    id: 6,
    type: 'bonus',
    description: 'Referral Bonus - New User',
    amount: 50,
    status: 'completed',
    date: '2024-01-08',
    time: '20:30',
    reference: 'REF-BONUS-123',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'deposit', label: 'Deposits' },
  { id: 'withdrawal', label: 'Withdrawals' },
  { id: 'purchase', label: 'Purchases' },
  { id: 'refund', label: 'Refunds' },
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return { icon: ArrowDownLeft, color: 'text-jade-400', bg: 'bg-jade-500/20' };
    case 'purchase':
      return { icon: CreditCard, color: 'text-sky-400', bg: 'bg-sky-500/20' };
    case 'escrow':
      return { icon: Lock, color: 'text-amber-400', bg: 'bg-amber-500/20' };
    case 'refund':
      return { icon: RefreshCw, color: 'text-panda-400', bg: 'bg-panda-500/20' };
    case 'withdrawal':
      return { icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/20' };
    case 'bonus':
      return { icon: Gift, color: 'text-silk-400', bg: 'bg-silk-500/20' };
    default:
      return { icon: Wallet, color: 'text-slate-400', bg: 'bg-white/10' };
  }
};

export default function WalletPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [activeFilter, setActiveFilter] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const filteredTransactions = TRANSACTIONS.filter(tx => 
    activeFilter === 'all' || tx.type === activeFilter
  );

  const breadcrumbs = [
    { label: 'Square', href: `/${locale}/square` },
    { label: 'Wallet', href: `/${locale}/wallet` },
  ];

  return (
    <BuyerShell locale={locale} secondaryNav="breadcrumbs" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ===== BALANCE CARDS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Total Balance */}
            <div className="md:col-span-2 bg-gradient-to-br from-panda-600 to-panda-700 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-white/80" />
                    <span className="text-white/80 font-medium">Total Balance</span>
                  </div>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="text-5xl font-bold text-white mb-6">
                  {showBalance ? `${WALLET_DATA.currency}${WALLET_DATA.total.toLocaleString()}` : '••••••'}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setShowDepositModal(true)}
                    className="bg-white text-panda-600 hover:bg-white/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Deposit
                  </Button>
                  <Button 
                    onClick={() => setShowWithdrawModal(true)}
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>

            {/* Balance Breakdown */}
            <div className="space-y-4">
              {/* Available */}
              <div className="bg-jade-500/10 border border-jade-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-jade-400" />
                  <span className="text-jade-300 font-medium">Available</span>
                </div>
                <p className="text-3xl font-bold text-slate-200">
                  {showBalance ? `${WALLET_DATA.currency}${WALLET_DATA.available.toLocaleString()}` : '••••'}
                </p>
                <p className="text-sm text-jade-400/80 mt-1">Ready to spend</p>
              </div>

              {/* Locked */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-300 font-medium">In Escrow</span>
                </div>
                <p className="text-3xl font-bold text-slate-200">
                  {showBalance ? `${WALLET_DATA.currency}${WALLET_DATA.locked.toLocaleString()}` : '••••'}
                </p>
                <p className="text-sm text-amber-400/80 mt-1">Held for pending orders</p>
              </div>
            </div>
          </div>

          {/* ===== TRANSACTIONS ===== */}
          <div className="bg-ink-850 border border-border rounded-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">Transaction History</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-white/10">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-border overflow-x-auto">
              <div className="flex gap-2">
                {FILTER_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeFilter === tab.id
                        ? 'bg-panda-500 text-white'
                        : 'bg-ink-800 text-slate-400 hover:bg-ink-900 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-border">
              {filteredTransactions.map((tx, index) => {
                const config = getTransactionIcon(tx.type);
                const TxIcon = config.icon;
                const isPositive = tx.amount > 0;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-ink-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}>
                        <TxIcon className={`h-6 w-6 ${config.color}`} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-200 font-medium">{tx.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{tx.date} at {tx.time}</span>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-xs text-slate-500 font-mono">{tx.reference}</span>
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isPositive ? 'text-jade-400' : 'text-slate-200'}`}>
                          {isPositive ? '+' : ''}{WALLET_DATA.currency}{Math.abs(tx.amount).toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tx.status === 'completed' 
                            ? 'bg-jade-500/20 text-jade-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {tx.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Load More */}
            <div className="p-6 border-t border-border text-center">
              <Button variant="ghost" className="text-slate-400 hover:text-slate-200">
                Load More Transactions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ===== QUICK LINKS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-ink-850 border border-border rounded-xl p-6 hover:bg-ink-800 transition-all cursor-pointer">
              <Shield className="h-8 w-8 text-jade-400 mb-3" />
              <h4 className="text-slate-200 font-semibold mb-1">Escrow Protection</h4>
              <p className="text-sm text-slate-400">Learn how your funds are protected</p>
            </div>
            <div className="bg-ink-850 border border-border rounded-xl p-6 hover:bg-ink-800 transition-all cursor-pointer">
              <CreditCard className="h-8 w-8 text-sky-400 mb-3" />
              <h4 className="text-slate-200 font-semibold mb-1">Payment Methods</h4>
              <p className="text-sm text-slate-400">Manage your linked accounts</p>
            </div>
            <div className="bg-ink-850 border border-border rounded-xl p-6 hover:bg-ink-800 transition-all cursor-pointer">
              <Gift className="h-8 w-8 text-silk-400 mb-3" />
              <h4 className="text-white font-semibold mb-1">Refer & Earn</h4>
              <p className="text-sm text-slate-400">Get ¥50 for each friend</p>
            </div>
          </div>
        </div>

        {/* ===== DEPOSIT MODAL ===== */}
        <AnimatePresence>
          {showDepositModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDepositModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-onyx-900 border border-white/10 rounded-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Deposit Funds</h3>
                  <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">¥</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl text-white placeholder-slate-600 focus:outline-none focus:border-panda-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mb-6">
                    {[100, 500, 1000, 5000].map(amount => (
                      <button
                        key={amount}
                        className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                      >
                        ¥{amount}
                      </button>
                    ))}
                  </div>
                  <Button className="w-full bg-panda-500 hover:bg-panda-600">
                    Continue to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== WITHDRAW MODAL ===== */}
        <AnimatePresence>
          {showWithdrawModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowWithdrawModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-onyx-900 border border-white/10 rounded-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
                  <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4 p-4 bg-jade-500/10 border border-jade-500/30 rounded-xl">
                    <p className="text-sm text-jade-300">Available Balance: <strong>¥{WALLET_DATA.available.toLocaleString()}</strong></p>
                  </div>
                  <div className="mb-6">
                    <label className="text-sm text-slate-400 mb-2 block">Withdraw Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">¥</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl text-white placeholder-slate-600 focus:outline-none focus:border-panda-500/50"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="text-sm text-slate-400 mb-2 block">Withdraw to</label>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Bank Account</p>
                        <p className="text-xs text-slate-500">****1234</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-panda-500 hover:bg-panda-600">
                    Withdraw Funds
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BuyerShell>
  );
}
