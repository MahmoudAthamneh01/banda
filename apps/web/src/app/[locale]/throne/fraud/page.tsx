'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Target,
  Eye,
  Flag,
  X,
  Sparkles,
  Download,
  User,
  ShoppingCart,
  DollarSign,
  Filter,
  Plus,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

type FlaggedItemType = 'order' | 'user' | 'transaction' | 'pattern';

interface FlaggedItem {
  id: string;
  type: FlaggedItemType;
  targetId: string;
  targetName: string;
  reason: string;
  riskScore: number;
  flaggedAt: string;
  flaggedBy: 'AI' | 'Manual';
  status: 'new' | 'investigating' | 'resolved' | 'false-positive';
  details: string[];
}

interface FraudRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: number;
  falsePositives: number;
}

const MOCK_FLAGGED: FlaggedItem[] = [
  {
    id: 'FLAG-001',
    type: 'order',
    targetId: 'ORD-45689',
    targetName: 'Suspicious Order',
    reason: 'Multiple red flags',
    riskScore: 8.5,
    flaggedAt: '15 min ago',
    flaggedBy: 'AI',
    status: 'new',
    details: [
      'Unusually large first order',
      'Payment from new account',
      'Delivery address mismatch',
    ],
  },
  {
    id: 'FLAG-002',
    type: 'user',
    targetId: 'user_7823',
    targetName: 'Wang Electronics',
    reason: 'Velocity spike detected',
    riskScore: 7.2,
    flaggedAt: '1h ago',
    flaggedBy: 'AI',
    status: 'investigating',
    details: ['5 orders in 10 minutes', 'Different shipping addresses', 'New KYC account'],
  },
  {
    id: 'FLAG-003',
    type: 'transaction',
    targetId: 'TXN-89234',
    targetName: 'Large Payment',
    reason: 'Amount threshold exceeded',
    riskScore: 6.8,
    flaggedAt: '2h ago',
    flaggedBy: 'Manual',
    status: 'investigating',
    details: ['$150,000 transaction', 'First large payment', 'Beneficiary in high-risk region'],
  },
  {
    id: 'FLAG-004',
    type: 'pattern',
    targetId: 'PAT-445',
    targetName: 'Circular Trading',
    reason: 'Suspicious pattern detected',
    riskScore: 9.1,
    flaggedAt: '3h ago',
    flaggedBy: 'AI',
    status: 'new',
    details: [
      'Same goods trading between 3 accounts',
      'Price manipulation suspected',
      'Linked wallet addresses',
    ],
  },
  {
    id: 'FLAG-005',
    type: 'user',
    targetId: 'user_3421',
    targetName: 'Green Energy Ltd',
    reason: 'KYC document mismatch',
    riskScore: 5.5,
    flaggedAt: '4h ago',
    flaggedBy: 'AI',
    status: 'resolved',
    details: ['Address proof mismatch', 'Resolved: Updated documents provided'],
  },
  {
    id: 'FLAG-006',
    type: 'order',
    targetId: 'ORD-45623',
    targetName: 'High-Value Rush Order',
    reason: 'Rush order + high value',
    riskScore: 7.9,
    flaggedAt: '5h ago',
    flaggedBy: 'AI',
    status: 'investigating',
    details: ['Expedited shipping requested', '$75,000 value', 'New maker relationship'],
  },
  {
    id: 'FLAG-007',
    type: 'transaction',
    targetId: 'TXN-89156',
    targetName: 'Chargeback Risk',
    reason: 'Payment method flagged',
    riskScore: 6.3,
    flaggedAt: '8h ago',
    flaggedBy: 'AI',
    status: 'false-positive',
    details: ['High chargeback history', 'False positive: Legitimate customer'],
  },
  {
    id: 'FLAG-008',
    type: 'user',
    targetId: 'user_9087',
    targetName: 'Dragon Imports',
    reason: 'Sanctions list match',
    riskScore: 9.8,
    flaggedAt: '10h ago',
    flaggedBy: 'AI',
    status: 'new',
    details: [
      'Name similarity to sanctioned entity',
      'Requires manual verification',
      'Account locked pending review',
    ],
  },
];

const MOCK_RULES: FraudRule[] = [
  {
    id: 'RULE-001',
    name: 'Velocity Check',
    description: 'Flags users with >5 orders in 10 minutes',
    enabled: true,
    triggers: 23,
    falsePositives: 4,
  },
  {
    id: 'RULE-002',
    name: 'Large First Order',
    description: 'Flags first orders >$50,000',
    enabled: true,
    triggers: 12,
    falsePositives: 2,
  },
  {
    id: 'RULE-003',
    name: 'Address Mismatch',
    description: 'Shipping address differs from billing',
    enabled: true,
    triggers: 45,
    falsePositives: 18,
  },
  {
    id: 'RULE-004',
    name: 'Sanctions Screening',
    description: 'Auto-check against sanctions lists',
    enabled: true,
    triggers: 3,
    falsePositives: 0,
  },
  {
    id: 'RULE-005',
    name: 'Circular Trading',
    description: 'Detects goods cycling between accounts',
    enabled: true,
    triggers: 8,
    falsePositives: 1,
  },
  {
    id: 'RULE-006',
    name: 'IP Anomaly',
    description: 'Login from unusual location',
    enabled: false,
    triggers: 0,
    falsePositives: 0,
  },
];

export default function ThroneFraudPage() {
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null);
  const [typeFilter, setTypeFilter] = useState<FlaggedItemType | 'all'>('all');
  const [showRules, setShowRules] = useState(false);
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [rules, setRules] = useState(MOCK_RULES);

  const filteredItems = MOCK_FLAGGED.filter((item) => {
    if (typeFilter === 'all') return true;
    return item.type === typeFilter;
  });

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-danger-400';
    if (score >= 6) return 'text-warning-400';
    return 'text-jade-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
      case 'investigating':
        return 'bg-warning-500/10 text-warning-400 border-warning-500/20';
      case 'resolved':
        return 'bg-jade-500/10 text-jade-400 border-jade-500/20';
      case 'false-positive':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-ink-800 text-slate-400 border-border';
    }
  };

  const getTypeIcon = (type: FlaggedItemType) => {
    switch (type) {
      case 'order':
        return ShoppingCart;
      case 'user':
        return User;
      case 'transaction':
        return DollarSign;
      case 'pattern':
        return Target;
    }
  };

  const stats = {
    riskSpikes: 3,
    flaggedOrders: MOCK_FLAGGED.filter((f) => f.type === 'order').length,
    suspiciousUsers: MOCK_FLAGGED.filter((f) => f.type === 'user').length,
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ruby-500/10">
              <Shield className="w-6 h-6 text-ruby-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-200">Fraud Detection</h1>
              <p className="text-slate-400">Monitor and prevent fraudulent activity</p>
            </div>
          </div>
          <button
            onClick={() => setShowRules(!showRules)}
            className="px-4 py-2 rounded-lg bg-panda-500 text-white hover:bg-panda-600 shadow-glow-primary transition-all flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Rules Engine
          </button>
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
            <TrendingUp className="w-4 h-4 text-danger-400" />
            <div className="text-sm text-slate-400">Risk Spikes (24h)</div>
          </div>
          <div className="text-2xl font-bold text-danger-400">{stats.riskSpikes}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-warning-400" />
            <div className="text-sm text-slate-400">Flagged Orders</div>
          </div>
          <div className="text-2xl font-bold text-warning-400">{stats.flaggedOrders}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-slate-400" />
            <div className="text-sm text-slate-400">Suspicious Users</div>
          </div>
          <div className="text-2xl font-bold text-slate-200">{stats.suspiciousUsers}</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 rounded-lg bg-ink-850 border border-border">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-2">
            {(['all', 'order', 'user', 'transaction', 'pattern'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  typeFilter === type
                    ? 'bg-panda-500 text-white shadow-glow-primary'
                    : 'bg-ink-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 && (
          <div className="py-12 text-center rounded-lg bg-ink-850 border border-border">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No flagged items in this category</p>
          </div>
        )}

        {filteredItems.map((item, index) => {
          const Icon = getTypeIcon(item.type);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="p-4 rounded-lg bg-ink-850 border border-border hover:border-danger-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400 font-mono">{item.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {item.type.toUpperCase()} • {item.flaggedBy} • {item.flaggedAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Risk Score</div>
                    <div className={`text-lg font-bold ${getRiskColor(item.riskScore)}`}>
                      {item.riskScore.toFixed(1)}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded bg-danger-500 text-white hover:bg-danger-600 shadow-glow-primary transition-all opacity-0 group-hover:opacity-100">
                    <Eye className="w-4 h-4" />
                    Investigate
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-slate-200 font-medium mb-1">{item.targetName}</h3>
                <p className="text-sm text-slate-400 mb-2">{item.reason}</p>
                <div className="flex flex-wrap gap-2">
                  {item.details.slice(0, 2).map((detail, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-danger-500/10 text-danger-400 border border-danger-500/20"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {detail}
                    </span>
                  ))}
                  {item.details.length > 2 && (
                    <span className="text-xs text-slate-500">
                      +{item.details.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-ink-850 border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-200 mb-1">
                      {selectedItem.targetName}
                    </h2>
                    <p className="text-sm text-slate-400 font-mono">{selectedItem.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Risk Score */}
                <div className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-danger-400">Risk Assessment</h3>
                    <button
                      onClick={() => setShowAIAssist(!showAIAssist)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-panda-500/10 text-panda-400 text-xs hover:bg-panda-500/20 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Explain
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className={`w-8 h-8 ${getRiskColor(selectedItem.riskScore)}`} />
                    <div>
                      <div className={`text-2xl font-bold ${getRiskColor(selectedItem.riskScore)}`}>
                        {selectedItem.riskScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {selectedItem.riskScore >= 8
                          ? 'Critical Risk'
                          : selectedItem.riskScore >= 6
                          ? 'High Risk'
                          : 'Medium Risk'}
                      </div>
                    </div>
                  </div>
                  {showAIAssist && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 rounded bg-panda-500/5 border border-panda-500/10"
                    >
                      <p className="text-xs text-slate-300 leading-relaxed">
                        🤖 <strong>AI Cyber Wukong:</strong> This item triggered multiple fraud
                        detection rules simultaneously. Pattern analysis suggests {selectedItem.riskScore >= 8 ? 'immediate action required' : 'manual review recommended'}.
                        Check transaction history and linked accounts.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 rounded-lg bg-ink-800 border border-border mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Flagged Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Target ID:</span>
                      <span className="text-sm text-slate-200 font-mono">
                        {selectedItem.targetId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Type:</span>
                      <span className="text-sm text-slate-200">
                        {selectedItem.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Flagged By:</span>
                      <span className="text-sm text-slate-200">{selectedItem.flaggedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Time:</span>
                      <span className="text-sm text-slate-200">{selectedItem.flaggedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Red Flags */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Red Flags</h3>
                  <div className="space-y-2">
                    {selectedItem.details.map((detail, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-lg bg-ink-800 border border-border"
                      >
                        <AlertTriangle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-200">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 rounded bg-jade-500 text-white hover:bg-jade-600 transition-colors flex items-center justify-center gap-2">
                    <Flag className="w-4 h-4" />
                    Mark as False Positive
                  </button>
                  <button className="w-full px-4 py-2 rounded bg-warning-500 text-white hover:bg-warning-600 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Assign to Investigator
                  </button>
                  <button className="w-full px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rules Engine Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ink-850 border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-panda-500/10">
                    <Target className="w-6 h-6 text-panda-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200">Fraud Detection Rules</h3>
                </div>
                <button
                  onClick={() => setShowRules(false)}
                  className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <button className="w-full mb-4 px-4 py-2 rounded bg-panda-500 text-white hover:bg-panda-600 shadow-glow-primary transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Rule
              </button>

              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-lg bg-ink-800 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-200 mb-1">
                          {rule.name}
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">{rule.description}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>Triggers: {rule.triggers}</span>
                          <span>False Positives: {rule.falsePositives}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className="flex items-center gap-2 ml-4"
                      >
                        {rule.enabled ? (
                          <ToggleRight className="w-8 h-8 text-jade-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
