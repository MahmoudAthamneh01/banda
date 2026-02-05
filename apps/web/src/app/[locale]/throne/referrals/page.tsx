'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Plus,
  X,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Percent,
  CheckCircle,
  XCircle,
  Sparkles,
  Download,
} from 'lucide-react';

type ReferralScope = 'COMMERCE_SALE' | 'CAPITAL_INJECTION' | 'SERVICE_FEE';

interface ReferralRule {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId: string;
  refereeName: string;
  scope: ReferralScope;
  rate: number;
  active: boolean;
  createdAt: string;
  activationWindow?: string;
  totalEarned?: number;
}

interface PayoutLog {
  id: string;
  ruleId: string;
  referrer: string;
  amount: number;
  triggeredBy: string;
  timestamp: string;
  txnLink: string;
}

const MOCK_RULES: ReferralRule[] = [
  {
    id: 'REF-001',
    referrerId: 'user_2341',
    referrerName: 'Ali Manufacturing',
    refereeId: 'user_8923',
    refereeName: 'Sarah Chen',
    scope: 'COMMERCE_SALE',
    rate: 2.5,
    active: true,
    createdAt: '2026-01-15',
    activationWindow: '90 days',
    totalEarned: 4250,
  },
  {
    id: 'REF-002',
    referrerId: 'user_1234',
    referrerName: 'EcoWood Factory',
    refereeId: 'user_9012',
    refereeName: 'Michael Wang',
    scope: 'COMMERCE_SALE',
    rate: 1.8,
    active: true,
    createdAt: '2026-01-10',
    activationWindow: '90 days',
    totalEarned: 3180,
  },
  {
    id: 'REF-003',
    referrerId: 'user_7890',
    referrerName: 'Tech Ventures',
    refereeId: 'user_3456',
    refereeName: 'Green Energy Ltd',
    scope: 'CAPITAL_INJECTION',
    rate: 0.5,
    active: true,
    createdAt: '2025-12-20',
    activationWindow: '180 days',
    totalEarned: 8500,
  },
  {
    id: 'REF-004',
    referrerId: 'user_4567',
    referrerName: 'Zhang Imports',
    refereeId: 'user_6789',
    refereeName: 'Li Trading',
    scope: 'COMMERCE_SALE',
    rate: 3.0,
    active: false,
    createdAt: '2025-11-30',
    activationWindow: 'Expired',
    totalEarned: 1200,
  },
  {
    id: 'REF-005',
    referrerId: 'user_0123',
    referrerName: 'Phoenix Textiles',
    refereeId: 'user_3457',
    refereeName: 'Chen Logistics',
    scope: 'SERVICE_FEE',
    rate: 5.0,
    active: true,
    createdAt: '2026-01-08',
    activationWindow: '60 days',
    totalEarned: 890,
  },
  {
    id: 'REF-006',
    referrerId: 'user_2346',
    referrerName: 'Liu Commerce',
    refereeId: 'user_7823',
    refereeName: 'Wang Electronics',
    scope: 'COMMERCE_SALE',
    rate: 2.0,
    active: true,
    createdAt: '2026-01-25',
    activationWindow: '90 days',
    totalEarned: 520,
  },
  {
    id: 'REF-007',
    referrerId: 'user_5612',
    referrerName: 'Investment Corp',
    refereeId: 'user_9013',
    refereeName: 'Smart Factory',
    scope: 'CAPITAL_INJECTION',
    rate: 0.75,
    active: true,
    createdAt: '2025-12-15',
    activationWindow: '180 days',
    totalEarned: 12300,
  },
  {
    id: 'REF-008',
    referrerId: 'user_9012',
    referrerName: 'Michael Wang',
    refereeId: 'user_6780',
    refereeName: 'Dragon Capital',
    scope: 'COMMERCE_SALE',
    rate: 2.2,
    active: true,
    createdAt: '2026-01-20',
    activationWindow: '90 days',
    totalEarned: 1680,
  },
  {
    id: 'REF-009',
    referrerId: 'user_8923',
    referrerName: 'Sarah Chen',
    refereeId: 'user_4521',
    refereeName: 'Green Packaging',
    scope: 'SERVICE_FEE',
    rate: 4.5,
    active: true,
    createdAt: '2026-01-12',
    activationWindow: '60 days',
    totalEarned: 340,
  },
  {
    id: 'REF-010',
    referrerId: 'user_3456',
    referrerName: 'Green Energy Ltd',
    refereeId: 'user_2109',
    refereeName: 'Smart Factory Co',
    scope: 'CAPITAL_INJECTION',
    rate: 0.6,
    active: true,
    createdAt: '2026-01-05',
    activationWindow: '180 days',
    totalEarned: 6780,
  },
];

const MOCK_PAYOUTS: PayoutLog[] = [
  {
    id: 'PAY-2026-0089',
    ruleId: 'REF-001',
    referrer: 'Ali Manufacturing',
    amount: 125.5,
    triggeredBy: 'ORD-45612',
    timestamp: '2026-02-03 10:30',
    txnLink: 'LDG-89234',
  },
  {
    id: 'PAY-2026-0088',
    ruleId: 'REF-003',
    referrer: 'Tech Ventures',
    amount: 850.0,
    triggeredBy: 'INV-12345',
    timestamp: '2026-02-02 14:15',
    txnLink: 'LDG-89201',
  },
  {
    id: 'PAY-2026-0087',
    ruleId: 'REF-002',
    referrer: 'EcoWood Factory',
    amount: 90.8,
    triggeredBy: 'ORD-45589',
    timestamp: '2026-02-01 09:20',
    txnLink: 'LDG-89178',
  },
  {
    id: 'PAY-2026-0086',
    ruleId: 'REF-007',
    referrer: 'Investment Corp',
    amount: 1230.0,
    triggeredBy: 'INV-12340',
    timestamp: '2026-01-31 16:45',
    txnLink: 'LDG-89156',
  },
  {
    id: 'PAY-2026-0085',
    ruleId: 'REF-008',
    referrer: 'Michael Wang',
    amount: 68.4,
    triggeredBy: 'ORD-45521',
    timestamp: '2026-01-30 11:30',
    txnLink: 'LDG-89134',
  },
];

type ModalMode = 'create' | 'edit' | null;

export default function ThroneReferralsPage() {
  const [selectedRule, setSelectedRule] = useState<ReferralRule | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [showPayouts, setShowPayouts] = useState(false);

  const getScopeBadge = (scope: ReferralScope) => {
    switch (scope) {
      case 'COMMERCE_SALE':
        return 'bg-panda-500/10 text-panda-400 border-panda-500/20';
      case 'CAPITAL_INJECTION':
        return 'bg-jade-500/10 text-jade-400 border-jade-500/20';
      case 'SERVICE_FEE':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  const getScopeLabel = (scope: ReferralScope) => {
    switch (scope) {
      case 'COMMERCE_SALE':
        return 'Commerce Sale';
      case 'CAPITAL_INJECTION':
        return 'Capital Injection';
      case 'SERVICE_FEE':
        return 'Service Fee';
    }
  };

  const stats = {
    activeRules: MOCK_RULES.filter((r) => r.active).length,
    totalEarned: MOCK_RULES.reduce((sum, r) => sum + (r.totalEarned || 0), 0),
    thisMonth: MOCK_PAYOUTS.reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ruby-500/10">
              <Users className="w-6 h-6 text-ruby-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-200">Referral Engine</h1>
              <p className="text-slate-400">Manage referral rules and payouts</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPayouts(!showPayouts)}
              className="px-4 py-2 rounded-lg bg-ink-850 border border-border text-slate-300 hover:bg-ink-800 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Payout History
            </button>
            <button
              onClick={() => setModalMode('create')}
              className="px-4 py-2 rounded-lg bg-panda-500 text-white hover:bg-panda-600 shadow-glow-primary transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Rule
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-jade-400" />
            <div className="text-sm text-slate-400">Active Rules</div>
          </div>
          <div className="text-2xl font-bold text-jade-400">{stats.activeRules}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <div className="text-sm text-slate-400">Total Earned (All Time)</div>
          </div>
          <div className="text-2xl font-bold text-slate-200">
            ${stats.totalEarned.toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-panda-400" />
            <div className="text-sm text-slate-400">This Month Payouts</div>
          </div>
          <div className="text-2xl font-bold text-panda-400">
            ${stats.thisMonth.toLocaleString()}
          </div>
        </motion.div>
      </div>

      {/* Rules Table */}
      <div className="rounded-lg bg-ink-850 border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-ink-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Rule ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Referrer → Referee
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Scope
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Rate
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Earned
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RULES.map((rule, index) => (
                <motion.tr
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedRule(rule)}
                  className="border-b border-border hover:bg-ink-800 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400 font-mono">{rule.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-200">{rule.referrerName}</div>
                    <div className="text-xs text-slate-400">→ {rule.refereeName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getScopeBadge(
                        rule.scope
                      )}`}
                    >
                      {getScopeLabel(rule.scope)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-panda-400">
                      {rule.rate}
                      <Percent className="w-3 h-3" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {rule.active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-jade-500/10 text-jade-400 border border-jade-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-jade-400">
                      ${rule.totalEarned?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{rule.createdAt}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRule(rule);
                          setModalMode('edit');
                        }}
                        className="p-1 hover:bg-ink-700 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-panda-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete action
                        }}
                        className="p-1 hover:bg-ink-700 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-danger-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="p-4 rounded-lg bg-panda-500/5 border border-panda-500/10">
        <button
          onClick={() => setShowAIAssist(!showAIAssist)}
          className="flex items-center gap-2 w-full"
        >
          <Sparkles className="w-4 h-4 text-panda-400" />
          <span className="text-sm font-medium text-panda-400">
            AI Referral Assistant - Conflict Detection
          </span>
        </button>
        {showAIAssist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-xs text-slate-300 leading-relaxed space-y-2"
          >
            <p>
              🤖 <strong>Status:</strong> No conflicting rules detected. All referral scopes
              are properly segmented.
            </p>
            <p>
              <strong>Recommendation:</strong> Consider adding rate limits for high-value
              capital injection referrals to prevent abuse.
            </p>
            <p className="text-warning-400">
              <strong>Warning:</strong> REF-004 expired. Consider deactivating or renewing.
            </p>
          </motion.div>
        )}
      </div>

      {/* Payout History Drawer */}
      <AnimatePresence>
        {showPayouts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayouts(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[700px] bg-ink-850 border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-200">Payout History</h2>
                    <p className="text-sm text-slate-400">Recent referral commission payouts</p>
                  </div>
                  <button
                    onClick={() => setShowPayouts(false)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  {MOCK_PAYOUTS.map((payout, i) => (
                    <motion.div
                      key={payout.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg bg-ink-800 border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-400 font-mono">
                              {payout.id}
                            </span>
                            <span className="text-xs text-slate-500">({payout.ruleId})</span>
                          </div>
                          <div className="text-sm text-slate-200 font-medium">
                            {payout.referrer}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-jade-400">
                            ${payout.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div>
                          Triggered by: <span className="font-mono">{payout.triggeredBy}</span>
                        </div>
                        <div>{payout.timestamp}</div>
                      </div>
                      <button className="mt-2 text-xs text-panda-400 hover:text-panda-300 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View in Ledger ({payout.txnLink})
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Full History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalMode(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ink-850 border border-border rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-slate-200 mb-4">
                {modalMode === 'create' ? 'Create Referral Rule' : 'Edit Referral Rule'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Referrer ID</label>
                  <input
                    type="text"
                    placeholder="user_1234"
                    className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Referee ID</label>
                  <input
                    type="text"
                    placeholder="user_5678"
                    className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Scope</label>
                  <select className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50">
                    <option value="COMMERCE_SALE">Commerce Sale</option>
                    <option value="CAPITAL_INJECTION">Capital Injection</option>
                    <option value="SERVICE_FEE">Service Fee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Activation Window (days)
                  </label>
                  <input
                    type="number"
                    placeholder="90"
                    className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalMode(null)}
                  className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setModalMode(null)}
                  className="flex-1 px-4 py-2 rounded bg-panda-500 text-white hover:bg-panda-600 shadow-glow-primary transition-all"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
