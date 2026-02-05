'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Play,
  StopCircle,
  FileText,
  Clock,
  Sparkles,
  Download,
  Shield,
  Package,
  Scale,
} from 'lucide-react';

interface CycleData {
  currentDay: number;
  totalDays: number;
  phase: 'ACTIVE' | 'LIQUIDATION' | 'TRANSITIONING';
  startDate: string;
  endDate: string;
  liquidationStart: string;
  revenue: number;
  disputes: number;
  liquidationValue: number;
  metrics: {
    ordersCompleted: number;
    activeDisputes: number;
    inventoryValue: number;
    platformFees: number;
  };
}

const MOCK_CYCLE: CycleData = {
  currentDay: 45,
  totalDays: 90,
  phase: 'ACTIVE',
  startDate: '2025-12-20',
  endDate: '2026-03-20',
  liquidationStart: '2026-02-18',
  revenue: 4500000,
  disputes: 12,
  liquidationValue: 890000,
  metrics: {
    ordersCompleted: 1247,
    activeDisputes: 12,
    inventoryValue: 890000,
    platformFees: 225000,
  },
};

const CYCLE_HISTORY = [
  {
    cycle: 'Cycle 4',
    period: '2025-09-22 - 2025-12-20',
    revenue: 4200000,
    disputes: 8,
    disputeRatio: '0.64%',
    liquidationValue: 750000,
    status: 'completed',
  },
  {
    cycle: 'Cycle 3',
    period: '2025-06-23 - 2025-09-21',
    revenue: 3800000,
    disputes: 15,
    disputeRatio: '1.12%',
    liquidationValue: 680000,
    status: 'completed',
  },
  {
    cycle: 'Cycle 2',
    period: '2025-03-25 - 2025-06-22',
    revenue: 3200000,
    disputes: 11,
    disputeRatio: '0.89%',
    liquidationValue: 520000,
    status: 'completed',
  },
];

type NuclearAction = 'start-liquidation' | 'end-cycle' | 'generate-report' | null;

export default function ThroneCyclesPage() {
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [nuclearAction, setNuclearAction] = useState<NuclearAction>(null);

  const progress = (MOCK_CYCLE.currentDay / MOCK_CYCLE.totalDays) * 100;
  const daysUntilLiquidation = 60 - MOCK_CYCLE.currentDay;
  const isLiquidationPhase = MOCK_CYCLE.currentDay >= 60;

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-ruby-500/10">
            <Calendar className="w-6 h-6 text-ruby-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200">Cycle Management</h1>
        </div>
        <p className="text-slate-400">
          Monitor and control the 90-day operational cycles
        </p>
      </div>

      {/* Current Cycle Overview */}
      <div className="p-6 rounded-lg bg-ink-850 border border-border mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-1">Current Cycle (Day {MOCK_CYCLE.currentDay})</h2>
            <p className="text-sm text-slate-400">
              {MOCK_CYCLE.startDate} → {MOCK_CYCLE.endDate}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded text-sm font-medium border ${
                MOCK_CYCLE.phase === 'ACTIVE'
                  ? 'bg-jade-500/10 text-jade-400 border-jade-500/20'
                  : MOCK_CYCLE.phase === 'LIQUIDATION'
                  ? 'bg-warning-500/10 text-warning-400 border-warning-500/20'
                  : 'bg-panda-500/10 text-panda-400 border-panda-500/20'
              }`}
            >
              {MOCK_CYCLE.phase}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Cycle Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-ink-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${
                isLiquidationPhase
                  ? 'bg-gradient-to-r from-warning-500 to-danger-500'
                  : 'bg-gradient-to-r from-jade-500 to-panda-500'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Day 1</span>
            <span className="text-warning-400">← Liquidation (Day 60)</span>
            <span>Day 90</span>
          </div>
        </div>

        {/* Timeline Marker */}
        {!isLiquidationPhase && (
          <div className="p-3 rounded-lg bg-warning-500/5 border border-warning-500/20 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning-400" />
              <span className="text-sm text-warning-400 font-medium">
                Liquidation phase starts in {daysUntilLiquidation} days
              </span>
            </div>
          </div>
        )}

        {isLiquidationPhase && (
          <div className="p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-danger-400" />
              <span className="text-sm text-danger-400 font-medium">
                LIQUIDATION PHASE ACTIVE - Last 30 days
              </span>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-ink-800 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-jade-400" />
              <div className="text-xs text-slate-400">Revenue</div>
            </div>
            <div className="text-xl font-bold text-jade-400">
              ${(MOCK_CYCLE.revenue / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="p-4 rounded-lg bg-ink-800 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-warning-400" />
              <div className="text-xs text-slate-400">Active Disputes</div>
            </div>
            <div className="text-xl font-bold text-warning-400">{MOCK_CYCLE.disputes}</div>
            <div className="text-xs text-slate-500">
              {((MOCK_CYCLE.disputes / MOCK_CYCLE.metrics.ordersCompleted) * 100).toFixed(2)}% ratio
            </div>
          </div>
          <div className="p-4 rounded-lg bg-ink-800 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-panda-400" />
              <div className="text-xs text-slate-400">Liquidation Value</div>
            </div>
            <div className="text-xl font-bold text-panda-400">
              ${(MOCK_CYCLE.liquidationValue / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="p-4 rounded-lg bg-ink-800 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <div className="text-xs text-slate-400">Orders Completed</div>
            </div>
            <div className="text-xl font-bold text-slate-200">
              {MOCK_CYCLE.metrics.ordersCompleted.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* AI Philosopher */}
      <div className="p-4 rounded-lg bg-panda-500/5 border border-panda-500/10 mb-6">
        <button
          onClick={() => setShowAIAssist(!showAIAssist)}
          className="flex items-center gap-2 w-full"
        >
          <Sparkles className="w-4 h-4 text-panda-400" />
          <span className="text-sm font-medium text-panda-400">
            AI Philosopher Brain - Cycle Insights
          </span>
        </button>
        {showAIAssist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-xs text-slate-300 leading-relaxed space-y-2"
          >
            <p>
              🤖 <strong>Cycle Health:</strong> Current cycle is performing 7% better than
              previous cycle in revenue. Dispute ratio is improving (0.96% vs 1.12% previous).
            </p>
            <p>
              <strong>Liquidation Forecast:</strong> Based on current inventory levels,
              projected liquidation completion is 85-90%. Consider early buyer outreach.
            </p>
            <p className="text-jade-400">
              <strong>Recommendation:</strong> Cycle transition is on track. No immediate
              intervention required. Monitor dispute resolution in final 15 days.
            </p>
          </motion.div>
        )}
      </div>

      {/* NUCLEAR Actions */}
      <div className="p-6 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-danger-400" />
          <h3 className="text-lg font-bold text-danger-400">NUCLEAR Cycle Actions</h3>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          These actions affect the entire platform cycle. Use with extreme caution.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setNuclearAction('start-liquidation')}
            disabled={isLiquidationPhase}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-warning-500/10 border border-warning-500/30 text-warning-400 hover:bg-warning-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6" />
            <span className="text-sm font-medium">Start Liquidation</span>
            <span className="text-xs text-slate-400">Force early liquidation</span>
          </button>
          <button
            onClick={() => setNuclearAction('end-cycle')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-danger-500/10 border border-danger-500/30 text-danger-400 hover:bg-danger-500/20 transition-colors"
          >
            <StopCircle className="w-6 h-6" />
            <span className="text-sm font-medium">End Cycle Now</span>
            <span className="text-xs text-slate-400">Immediate cycle closure</span>
          </button>
          <button
            onClick={() => setNuclearAction('generate-report')}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-panda-500/10 border border-panda-500/30 text-panda-400 hover:bg-panda-500/20 transition-colors"
          >
            <FileText className="w-6 h-6" />
            <span className="text-sm font-medium">Generate Report</span>
            <span className="text-xs text-slate-400">Full cycle analytics</span>
          </button>
        </div>
      </div>

      {/* Cycle History */}
      <div className="rounded-lg bg-ink-850 border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold text-slate-200">Previous Cycles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-ink-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Cycle
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Period
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Disputes
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Dispute Ratio
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Liquidation
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {CYCLE_HISTORY.map((cycle, index) => (
                <motion.tr
                  key={cycle.cycle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border hover:bg-ink-800 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-200 font-medium">{cycle.cycle}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{cycle.period}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-jade-400">
                      <DollarSign className="w-3 h-3" />
                      {(cycle.revenue / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-200">{cycle.disputes}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${
                        parseFloat(cycle.disputeRatio) < 1
                          ? 'text-jade-400'
                          : 'text-warning-400'
                      }`}
                    >
                      {cycle.disputeRatio}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-200">
                      ${(cycle.liquidationValue / 1000).toFixed(0)}K
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                      Completed
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <h3 className="text-xl font-bold text-slate-200">Confirm NUCLEAR Action</h3>
              </div>

              {nuclearAction === 'start-liquidation' && (
                <div>
                  <p className="text-slate-300 mb-4">
                    You are about to <strong className="text-warning-400">force start the liquidation phase</strong>. This will:
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 mb-6">
                    <li>Notify all makers to liquidate inventory</li>
                    <li>Lock new order creation</li>
                    <li>Start 30-day liquidation countdown</li>
                  </ul>
                </div>
              )}

              {nuclearAction === 'end-cycle' && (
                <div>
                  <p className="text-slate-300 mb-4">
                    You are about to <strong className="text-danger-400">forcefully end the current cycle</strong>. This will:
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 mb-6">
                    <li>Immediately close all active operations</li>
                    <li>Force liquidation of remaining inventory</li>
                    <li>Generate final cycle report</li>
                    <li>Transition to next cycle</li>
                  </ul>
                </div>
              )}

              {nuclearAction === 'generate-report' && (
                <div>
                  <p className="text-slate-300 mb-6">
                    Generate a comprehensive analytics report for the current cycle including revenue, disputes, liquidation metrics, and performance trends.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setNuclearAction(null)}
                  className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Execute action
                    if (nuclearAction === 'generate-report') {
                      // Download report
                    }
                    setNuclearAction(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded text-white transition-all ${
                    nuclearAction === 'generate-report'
                      ? 'bg-panda-500 hover:bg-panda-600 shadow-glow-primary'
                      : 'bg-danger-500 hover:bg-danger-600'
                  }`}
                >
                  {nuclearAction === 'generate-report' ? 'Generate' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
