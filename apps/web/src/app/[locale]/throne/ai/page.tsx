'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Activity,
  Shield,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Settings,
  Zap,
  ToggleLeft,
  ToggleRight,
  Edit2,
  X,
} from 'lucide-react';

type AgentStatus = 'enabled' | 'disabled';
type Permission = 'AUTO' | 'USER' | 'NUCLEAR';

interface AIAgent {
  id: string;
  name: string;
  displayName: string;
  status: AgentStatus;
  surfaces: string[];
  permission: Permission;
  interactions: number;
  successRate: number;
  lastActive: string;
  description: string;
}

interface InteractionLog {
  id: string;
  agent: string;
  timestamp: string;
  surface: string;
  prompt: string;
  outcome: 'success' | 'failure' | 'fallback';
  latency: number;
}

const MOCK_AGENTS: AIAgent[] = [
  {
    id: 'dealcat',
    name: 'DealCat',
    displayName: '🐱 DealCat',
    status: 'enabled',
    surfaces: ['marketplace', 'products', 'orders'],
    permission: 'AUTO',
    interactions: 12450,
    successRate: 94.2,
    lastActive: '2 min ago',
    description: 'Product recommendations and deal hunting',
  },
  {
    id: 'hungryhippo',
    name: 'HungryHippo',
    displayName: '🦛 HungryHippo',
    status: 'enabled',
    surfaces: ['marketplace', 'search'],
    permission: 'AUTO',
    interactions: 8920,
    successRate: 91.8,
    lastActive: '5 min ago',
    description: 'Market intelligence and trend analysis',
  },
  {
    id: 'chattybird',
    name: 'ChattyBird',
    displayName: '🐦 ChattyBird',
    status: 'enabled',
    surfaces: ['chat', 'support'],
    permission: 'USER',
    interactions: 15670,
    successRate: 88.5,
    lastActive: '1 min ago',
    description: 'Customer support and conversation assistance',
  },
  {
    id: 'cyberwukong',
    name: 'CyberWukong',
    displayName: '🐵 CyberWukong',
    status: 'enabled',
    surfaces: ['throne', 'fraud', 'security'],
    permission: 'USER',
    interactions: 3240,
    successRate: 96.7,
    lastActive: '10 min ago',
    description: 'Fraud detection and security analysis',
  },
  {
    id: 'magistratemandrill',
    name: 'MagistrateMandrill',
    displayName: '⚖️ MagistrateMandrill',
    status: 'enabled',
    surfaces: ['throne', 'disputes'],
    permission: 'NUCLEAR',
    interactions: 890,
    successRate: 93.4,
    lastActive: '30 min ago',
    description: 'Dispute resolution and arbitration assistance',
  },
  {
    id: 'hostpanda',
    name: 'HostPanda',
    displayName: '🐼 HostPanda',
    status: 'enabled',
    surfaces: ['throne', 'all'],
    permission: 'USER',
    interactions: 5430,
    successRate: 97.1,
    lastActive: '3 min ago',
    description: 'General admin assistance and platform guidance',
  },
];

const MOCK_LOGS: InteractionLog[] = [
  {
    id: 'LOG-001',
    agent: 'DealCat',
    timestamp: '2026-02-03 14:25',
    surface: 'marketplace',
    prompt: 'User requested eco-friendly products',
    outcome: 'success',
    latency: 1200,
  },
  {
    id: 'LOG-002',
    agent: 'ChattyBird',
    timestamp: '2026-02-03 14:22',
    surface: 'support',
    prompt: 'Help with order tracking',
    outcome: 'success',
    latency: 890,
  },
  {
    id: 'LOG-003',
    agent: 'CyberWukong',
    timestamp: '2026-02-03 14:15',
    surface: 'fraud',
    prompt: 'Analyze suspicious transaction pattern',
    outcome: 'success',
    latency: 2100,
  },
  {
    id: 'LOG-004',
    agent: 'HungryHippo',
    timestamp: '2026-02-03 14:10',
    surface: 'search',
    prompt: 'Market trend analysis for electronics',
    outcome: 'success',
    latency: 1450,
  },
  {
    id: 'LOG-005',
    agent: 'HostPanda',
    timestamp: '2026-02-03 14:05',
    surface: 'throne',
    prompt: 'Explain referral rule conflict',
    outcome: 'success',
    latency: 980,
  },
  {
    id: 'LOG-006',
    agent: 'DealCat',
    timestamp: '2026-02-03 13:58',
    surface: 'products',
    prompt: 'Generate product description',
    outcome: 'failure',
    latency: 3200,
  },
];

type ModalMode = 'edit-permissions' | 'provider-settings' | null;

export default function ThroneAIPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showLogs, setShowLogs] = useState(false);

  const toggleAgent = (agentId: string) => {
    setAgents(
      agents.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'enabled' ? 'disabled' : 'enabled' }
          : a
      )
    );
  };

  const getPermissionColor = (permission: Permission) => {
    switch (permission) {
      case 'AUTO':
        return 'bg-jade-500/10 text-jade-400 border-jade-500/20';
      case 'USER':
        return 'bg-panda-500/10 text-panda-400 border-panda-500/20';
      case 'NUCLEAR':
        return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'text-jade-400 bg-jade-500/10 border-jade-500/20';
      case 'failure':
        return 'text-danger-400 bg-danger-500/10 border-danger-500/20';
      case 'fallback':
        return 'text-warning-400 bg-warning-500/10 border-warning-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return CheckCircle;
      case 'failure':
        return XCircle;
      case 'fallback':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const stats = {
    totalInteractions: agents.reduce((sum, a) => sum + a.interactions, 0),
    avgSuccessRate:
      agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length,
    activeAgents: agents.filter((a) => a.status === 'enabled').length,
  };

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ruby-500/10">
              <Bot className="w-6 h-6 text-ruby-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-200">AI Control Room</h1>
              <p className="text-slate-400">Manage AI agents and permissions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="px-4 py-2 rounded-lg bg-ink-850 border border-border text-slate-300 hover:bg-ink-800 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Interaction Logs
            </button>
            <button
              onClick={() => setModalMode('provider-settings')}
              className="px-4 py-2 rounded-lg bg-panda-500 text-white hover:bg-panda-600 shadow-glow-primary transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Provider Settings
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
            <Sparkles className="w-4 h-4 text-panda-400" />
            <div className="text-sm text-slate-400">Active Agents</div>
          </div>
          <div className="text-2xl font-bold text-panda-400">
            {stats.activeAgents}/{agents.length}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <div className="text-sm text-slate-400">Total Interactions</div>
          </div>
          <div className="text-2xl font-bold text-slate-200">
            {stats.totalInteractions.toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-jade-400" />
            <div className="text-sm text-slate-400">Avg Success Rate</div>
          </div>
          <div className="text-2xl font-bold text-jade-400">
            {stats.avgSuccessRate.toFixed(1)}%
          </div>
        </motion.div>
      </div>

      {/* Agent Registry */}
      <div className="rounded-lg bg-ink-850 border border-border overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold text-slate-200">Agent Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-ink-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Agent
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Surfaces
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Permission
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Interactions
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Success Rate
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Last Active
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedAgent(agent)}
                  className="border-b border-border hover:bg-ink-800 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-panda-400" />
                      <div>
                        <div className="text-sm text-slate-200 font-medium">
                          {agent.displayName}
                        </div>
                        <div className="text-xs text-slate-400">{agent.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAgent(agent.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      {agent.status === 'enabled' ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-jade-400" />
                          <span className="text-xs text-jade-400 font-medium">
                            ENABLED
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-slate-600" />
                          <span className="text-xs text-slate-500 font-medium">
                            DISABLED
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {agent.surfaces.slice(0, 2).map((surface) => (
                        <span
                          key={surface}
                          className="inline-block px-2 py-0.5 rounded text-xs bg-ink-700 text-slate-400"
                        >
                          {surface}
                        </span>
                      ))}
                      {agent.surfaces.length > 2 && (
                        <span className="text-xs text-slate-500">
                          +{agent.surfaces.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPermissionColor(
                        agent.permission
                      )}`}
                    >
                      {agent.permission}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-200">
                      {agent.interactions.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            agent.successRate >= 95
                              ? 'bg-jade-500'
                              : agent.successRate >= 90
                              ? 'bg-panda-500'
                              : 'bg-warning-500'
                          }`}
                          style={{ width: `${agent.successRate}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          agent.successRate >= 95
                            ? 'text-jade-400'
                            : agent.successRate >= 90
                            ? 'text-panda-400'
                            : 'text-warning-400'
                        }`}
                      >
                        {agent.successRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{agent.lastActive}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgent(agent);
                        setModalMode('edit-permissions');
                      }}
                      className="p-1 hover:bg-ink-700 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-panda-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="p-6 rounded-lg bg-ink-850 border border-border mb-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Permission Levels</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-jade-500/5 border border-jade-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-jade-400" />
              <span className="text-sm font-medium text-jade-400">AUTO</span>
            </div>
            <p className="text-xs text-slate-300">
              Agent can act autonomously without user confirmation. Used for
              recommendations and non-critical suggestions.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-panda-500/5 border border-panda-500/20">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-panda-400" />
              <span className="text-sm font-medium text-panda-400">USER</span>
            </div>
            <p className="text-xs text-slate-300">
              Agent provides suggestions but requires user confirmation. Used for most
              interactions.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-danger-400" />
              <span className="text-sm font-medium text-danger-400">NUCLEAR</span>
            </div>
            <p className="text-xs text-slate-300">
              Agent can only assist with admin-level decisions. Requires explicit admin
              approval.
            </p>
          </div>
        </div>
      </div>

      {/* Interaction Logs Drawer */}
      <AnimatePresence>
        {showLogs && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogs(false)}
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
                    <h2 className="text-2xl font-bold text-slate-200">
                      AI Interaction Logs
                    </h2>
                    <p className="text-sm text-slate-400">Recent AI agent activity</p>
                  </div>
                  <button
                    onClick={() => setShowLogs(false)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  {MOCK_LOGS.map((log, i) => {
                    const OutcomeIcon = getOutcomeIcon(log.outcome);
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-lg bg-ink-800 border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-panda-400" />
                            <span className="text-sm font-medium text-slate-200">
                              {log.agent}
                            </span>
                            <span className="text-xs text-slate-500">
                              {log.surface}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getOutcomeColor(
                                log.outcome
                              )}`}
                            >
                              <OutcomeIcon className="w-3 h-3" />
                              {log.outcome}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{log.prompt}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{log.timestamp}</span>
                          <span>Latency: {log.latency}ms</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modalMode === 'edit-permissions' && selectedAgent && (
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
                Edit {selectedAgent.displayName} Permissions
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Permission Level
                  </label>
                  <select className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50">
                    <option value="AUTO">AUTO - Autonomous</option>
                    <option value="USER">USER - Requires Confirmation</option>
                    <option value="NUCLEAR">NUCLEAR - Admin Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Allowed Surfaces
                  </label>
                  <div className="space-y-2">
                    {['marketplace', 'throne', 'chat', 'support', 'all'].map(
                      (surface) => (
                        <label key={surface} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={selectedAgent.surfaces.includes(surface)}
                            className="rounded bg-ink-800 border-border"
                          />
                          <span className="text-sm text-slate-300">{surface}</span>
                        </label>
                      )
                    )}
                  </div>
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
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {modalMode === 'provider-settings' && (
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
                AI Provider Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Provider
                  </label>
                  <select className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50">
                    <option value="deepseek">DeepSeek (Current)</option>
                    <option value="mock">Mock (Testing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Rate Limit (requests/min)
                  </label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full px-3 py-2 bg-ink-800 border border-border rounded text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-ink-800 border-border"
                    />
                    <span className="text-sm text-slate-300">Enable Response Caching</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-ink-800 border-border"
                    />
                    <span className="text-sm text-slate-300">
                      Log All Interactions
                    </span>
                  </label>
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
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
