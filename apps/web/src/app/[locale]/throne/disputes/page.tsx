'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  AlertTriangle,
  Clock,
  FileText,
  MessageSquare,
  DollarSign,
  Sparkles,
  X,
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';

type DisputeStage =
  | 'REVIEW'
  | 'EVIDENCE_COLLECTION'
  | 'MEDIATION'
  | 'ARBITRATION'
  | 'RESOLVED';

interface Dispute {
  id: string;
  buyerId: string;
  buyerName: string;
  makerId: string;
  makerName: string;
  orderId: string;
  amount: number;
  stage: DisputeStage;
  slaHours: number;
  opened: string;
  description: string;
  escalated: boolean;
}

interface TimelineEvent {
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
}

interface Evidence {
  id: string;
  party: 'buyer' | 'maker';
  type: 'document' | 'image' | 'message';
  name: string;
  uploadedAt: string;
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'DIS-2026-0089',
    buyerId: 'user_8923',
    buyerName: 'Sarah Chen',
    makerId: 'maker_1234',
    makerName: 'EcoWood Factory',
    orderId: 'ORD-45612',
    amount: 25000,
    stage: 'REVIEW',
    slaHours: 48,
    opened: '2026-02-01',
    description: 'Product quality does not match specifications',
    escalated: false,
  },
  {
    id: 'DIS-2026-0088',
    buyerId: 'user_9012',
    buyerName: 'Michael Wang',
    makerId: 'maker_5678',
    makerName: 'Phoenix Textiles',
    orderId: 'ORD-45589',
    amount: 18500,
    stage: 'EVIDENCE_COLLECTION',
    slaHours: 72,
    opened: '2026-01-30',
    description: 'Late delivery - 15 days beyond agreed timeline',
    escalated: true,
  },
  {
    id: 'DIS-2026-0087',
    buyerId: 'user_2341',
    buyerName: 'Ali Manufacturing',
    makerId: 'maker_9012',
    makerName: 'Dragon Materials',
    orderId: 'ORD-45521',
    amount: 42000,
    stage: 'MEDIATION',
    slaHours: 24,
    opened: '2026-01-28',
    description: 'Wrong product variant shipped',
    escalated: true,
  },
  {
    id: 'DIS-2026-0086',
    buyerId: 'user_4567',
    buyerName: 'Zhang Imports',
    makerId: 'maker_3456',
    makerName: 'Smart Factory',
    orderId: 'ORD-45478',
    amount: 12000,
    stage: 'REVIEW',
    slaHours: 60,
    opened: '2026-01-27',
    description: 'Payment dispute - partial refund requested',
    escalated: false,
  },
  {
    id: 'DIS-2026-0085',
    buyerId: 'user_7890',
    buyerName: 'Tech Ventures',
    makerId: 'maker_7890',
    makerName: 'Green Energy Ltd',
    orderId: 'ORD-45423',
    amount: 35000,
    stage: 'ARBITRATION',
    slaHours: 12,
    opened: '2026-01-25',
    description: 'Contract breach - specifications not met',
    escalated: true,
  },
  {
    id: 'DIS-2026-0084',
    buyerId: 'user_1234',
    buyerName: 'Liu Commerce',
    makerId: 'maker_2345',
    makerName: 'Wang Electronics',
    orderId: 'ORD-45398',
    amount: 8500,
    stage: 'EVIDENCE_COLLECTION',
    slaHours: 96,
    opened: '2026-01-24',
    description: 'Damaged goods received',
    escalated: false,
  },
];

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    timestamp: '2026-02-01 14:30',
    actor: 'Sarah Chen (Buyer)',
    action: 'Opened dispute',
    details: 'Product quality does not match specifications',
  },
  {
    timestamp: '2026-02-01 15:15',
    actor: 'System',
    action: 'Notified maker',
    details: 'EcoWood Factory has 48h to respond',
  },
  {
    timestamp: '2026-02-01 18:45',
    actor: 'EcoWood Factory (Maker)',
    action: 'Responded',
    details: 'Provided QC certificates and manufacturing logs',
  },
  {
    timestamp: '2026-02-02 09:20',
    actor: 'Sarah Chen (Buyer)',
    action: 'Uploaded evidence',
    details: '3 photos showing defects',
  },
];

const MOCK_EVIDENCE: Evidence[] = [
  {
    id: 'EV-001',
    party: 'buyer',
    type: 'image',
    name: 'product-defect-1.jpg',
    uploadedAt: '2026-02-02 09:20',
  },
  {
    id: 'EV-002',
    party: 'buyer',
    type: 'image',
    name: 'product-defect-2.jpg',
    uploadedAt: '2026-02-02 09:20',
  },
  {
    id: 'EV-003',
    party: 'maker',
    type: 'document',
    name: 'qc-certificate.pdf',
    uploadedAt: '2026-02-01 18:45',
  },
  {
    id: 'EV-004',
    party: 'maker',
    type: 'document',
    name: 'manufacturing-log.xlsx',
    uploadedAt: '2026-02-01 18:45',
  },
];

type NuclearAction = 'settlement' | 'escalate' | 'final-decision' | 'release-escrow' | null;

export default function ThroneDisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [nuclearAction, setNuclearAction] = useState<NuclearAction>(null);
  const [showAIAssist, setShowAIAssist] = useState(false);

  const getStageColor = (stage: DisputeStage) => {
    switch (stage) {
      case 'REVIEW':
        return 'bg-warning-500/10 text-warning-400 border-warning-500/20';
      case 'EVIDENCE_COLLECTION':
        return 'bg-panda-500/10 text-panda-400 border-panda-500/20';
      case 'MEDIATION':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'ARBITRATION':
        return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
      case 'RESOLVED':
        return 'bg-jade-500/10 text-jade-400 border-jade-500/20';
    }
  };

  const getSLAColor = (hours: number) => {
    if (hours > 48) return 'text-jade-400';
    if (hours > 24) return 'text-warning-400';
    return 'text-danger-400';
  };

  const stats = {
    active: MOCK_DISPUTES.filter((d) => d.stage !== 'RESOLVED').length,
    escalated: MOCK_DISPUTES.filter((d) => d.escalated).length,
    avgResolutionDays: 5.2,
  };

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-ruby-500/10">
            <Scale className="w-6 h-6 text-ruby-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200">Arbitration Center</h1>
        </div>
        <p className="text-slate-400">Resolve disputes with wisdom and fairness</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-4 h-4 text-warning-400" />
            <div className="text-sm text-slate-400">Active Disputes</div>
          </div>
          <div className="text-2xl font-bold text-warning-400">{stats.active}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-danger-400" />
            <div className="text-sm text-slate-400">Escalated</div>
          </div>
          <div className="text-2xl font-bold text-danger-400">{stats.escalated}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="text-sm text-slate-400">Avg Resolution</div>
          </div>
          <div className="text-2xl font-bold text-slate-200">
            {stats.avgResolutionDays}d
          </div>
        </motion.div>
      </div>

      {/* Disputes Table */}
      <div className="rounded-lg bg-ink-850 border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-ink-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Dispute ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Parties
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  SLA
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Opened
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DISPUTES.map((dispute, index) => (
                <motion.tr
                  key={dispute.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedDispute(dispute)}
                  className="border-b border-border hover:bg-ink-800 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400 font-mono">
                        {dispute.id}
                      </span>
                      {dispute.escalated && (
                        <AlertTriangle className="w-3 h-3 text-danger-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-200">{dispute.buyerName}</div>
                    <div className="text-xs text-slate-400">vs {dispute.makerName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-jade-400">
                      <DollarSign className="w-3 h-3" />
                      {dispute.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStageColor(
                        dispute.stage
                      )}`}
                    >
                      {dispute.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${getSLAColor(dispute.slaHours)}`} />
                      <span className={`text-sm font-medium ${getSLAColor(dispute.slaHours)}`}>
                        {dispute.slaHours}h
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{dispute.opened}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDispute(dispute);
                      }}
                      className="text-panda-400 hover:text-panda-300 text-sm font-medium flex items-center gap-1"
                    >
                      Review
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {MOCK_DISPUTES.length === 0 && (
          <div className="py-12 text-center">
            <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No active disputes</p>
            <p className="text-sm text-slate-500 mt-1">Peace reigns in the kingdom</p>
          </div>
        )}
      </div>

      {/* Dispute Detail Drawer */}
      <AnimatePresence>
        {selectedDispute && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDispute(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[800px] bg-ink-850 border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-slate-200">
                        {selectedDispute.id}
                      </h2>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStageColor(
                          selectedDispute.stage
                        )}`}
                      >
                        {selectedDispute.stage.replace('_', ' ')}
                      </span>
                      {selectedDispute.escalated && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-danger-500/10 text-danger-400 border border-danger-500/20">
                          ESCALATED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">Order: {selectedDispute.orderId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* SLA Warning */}
                {selectedDispute.slaHours < 24 && (
                  <div className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-danger-400" />
                      <span className="text-sm font-medium text-danger-400">
                        SLA Critical: {selectedDispute.slaHours}h remaining
                      </span>
                    </div>
                  </div>
                )}

                {/* Parties Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-ink-800 border border-border">
                    <div className="text-xs text-slate-400 mb-2">Buyer (Claimant)</div>
                    <div className="text-sm font-medium text-slate-200 mb-1">
                      {selectedDispute.buyerName}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedDispute.buyerId}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-ink-800 border border-border">
                    <div className="text-xs text-slate-400 mb-2">Maker (Respondent)</div>
                    <div className="text-sm font-medium text-slate-200 mb-1">
                      {selectedDispute.makerName}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedDispute.makerId}
                    </div>
                  </div>
                </div>

                {/* Dispute Details */}
                <div className="p-4 rounded-lg bg-ink-800 border border-border mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    Dispute Description
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed mb-3">
                    {selectedDispute.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-jade-400" />
                      <span className="text-slate-400">Amount:</span>
                      <span className="text-jade-400 font-medium">
                        ${selectedDispute.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">Opened:</span>
                      <span className="text-slate-200">{selectedDispute.opened}</span>
                    </div>
                  </div>
                </div>

                {/* AI Magistrate */}
                <div className="p-4 rounded-lg bg-panda-500/5 border border-panda-500/10 mb-4">
                  <button
                    onClick={() => setShowAIAssist(!showAIAssist)}
                    className="flex items-center gap-2 w-full"
                  >
                    <Sparkles className="w-4 h-4 text-panda-400" />
                    <span className="text-sm font-medium text-panda-400">
                      AI Magistrate Mandrill - Case Analysis
                    </span>
                  </button>
                  {showAIAssist && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-xs text-slate-300 leading-relaxed space-y-2"
                    >
                      <p>
                        🤖 <strong>Evidence Assessment:</strong> Both parties provided
                        supporting documents. Buyer's photos show visible defects. Maker's QC
                        certificates indicate passing standards at production.
                      </p>
                      <p>
                        <strong>Contract Analysis:</strong> Order specifications require Grade A
                        quality. Visual inspection photos suggest Grade B quality received.
                      </p>
                      <p className="text-panda-400">
                        <strong>Recommended Resolution:</strong> Partial refund of 35% ($8,750)
                        or full replacement at maker's cost. Buyer keeps existing goods with
                        discount.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    {MOCK_TIMELINE.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-panda-500" />
                          {i < MOCK_TIMELINE.length - 1 && (
                            <div className="w-px h-full bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-400">{event.timestamp}</span>
                            <span className="text-xs text-slate-200 font-medium">
                              {event.actor}
                            </span>
                          </div>
                          <div className="text-sm text-slate-200">{event.action}</div>
                          {event.details && (
                            <div className="text-xs text-slate-400 mt-1">{event.details}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    Evidence ({MOCK_EVIDENCE.length})
                  </h3>
                  <div className="space-y-2">
                    {MOCK_EVIDENCE.map((evidence) => (
                      <div
                        key={evidence.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-ink-800 border border-border hover:border-panda-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-200">{evidence.name}</div>
                            <div className="text-xs text-slate-400">
                              {evidence.party === 'buyer' ? 'Buyer' : 'Maker'} •{' '}
                              {evidence.uploadedAt}
                            </div>
                          </div>
                        </div>
                        <button className="text-xs text-panda-400 hover:text-panda-300">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NUCLEAR Actions */}
                <div className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-danger-400" />
                    <h3 className="text-sm font-medium text-danger-400">NUCLEAR Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setNuclearAction('settlement')}
                      className="px-3 py-2 rounded bg-panda-500/10 border border-panda-500/30 text-panda-400 hover:bg-panda-500/20 transition-colors text-sm"
                    >
                      Propose Settlement
                    </button>
                    <button
                      onClick={() => setNuclearAction('escalate')}
                      className="px-3 py-2 rounded bg-warning-500/10 border border-warning-500/30 text-warning-400 hover:bg-warning-500/20 transition-colors text-sm"
                    >
                      Escalate
                    </button>
                    <button
                      onClick={() => setNuclearAction('final-decision')}
                      className="px-3 py-2 rounded bg-danger-500/10 border border-danger-500/30 text-danger-400 hover:bg-danger-500/20 transition-colors text-sm"
                    >
                      Final Decision
                    </button>
                    <button
                      onClick={() => setNuclearAction('release-escrow')}
                      className="px-3 py-2 rounded bg-jade-500/10 border border-jade-500/30 text-jade-400 hover:bg-jade-500/20 transition-colors text-sm"
                    >
                      Release Escrow
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nuclear Confirmation Modal */}
      <AnimatePresence>
        {nuclearAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNuclearAction(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ink-850 border border-danger-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-danger-500/10">
                  <AlertTriangle className="w-6 h-6 text-danger-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-200">Confirm Action</h3>
              </div>
              <p className="text-slate-300 mb-6">
                You are about to <strong className="text-danger-400">{nuclearAction}</strong>{' '}
                for dispute <strong>{selectedDispute?.id}</strong>. This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setNuclearAction(null)}
                  className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setNuclearAction(null);
                    setSelectedDispute(null);
                  }}
                  className="flex-1 px-4 py-2 rounded bg-danger-500 text-white hover:bg-danger-600 shadow-glow-primary transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
