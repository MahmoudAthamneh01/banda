'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Database,
  Globe,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  ToggleLeft,
  ToggleRight,
  Settings,
  Sparkles,
  Code,
  Server,
} from 'lucide-react';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface Service {
  name: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  lastIncident?: string;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: 'global' | 'admin' | 'beta';
}

const MOCK_SERVICES: Service[] = [
  {
    name: 'Web Frontend',
    status: 'operational',
    latency: 45,
    uptime: 99.98,
    lastIncident: 'None in 60 days',
  },
  {
    name: 'API Backend',
    status: 'operational',
    latency: 120,
    uptime: 99.95,
    lastIncident: 'None in 30 days',
  },
  {
    name: 'Database',
    status: 'degraded',
    latency: 350,
    uptime: 99.87,
    lastIncident: 'High load - 2h ago',
  },
  {
    name: 'Queue System',
    status: 'operational',
    latency: 15,
    uptime: 99.99,
    lastIncident: 'None in 90 days',
  },
];

const MOCK_FLAGS: FeatureFlag[] = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    description: 'Enable all AI assistance features across the platform',
    enabled: true,
    scope: 'global',
  },
  {
    id: 'referral-system',
    name: 'Referral System',
    description: 'Commission tracking and payout automation',
    enabled: true,
    scope: 'global',
  },
  {
    id: 'mystery-boxes',
    name: 'Mystery Boxes',
    description: 'Gamified product discovery feature',
    enabled: false,
    scope: 'beta',
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Enhanced reporting and insights dashboard',
    enabled: true,
    scope: 'admin',
  },
  {
    id: 'social-features',
    name: 'Social Features',
    description: 'User profiles, follows, and activity feeds',
    enabled: false,
    scope: 'beta',
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Alternative UI theme (currently default)',
    enabled: true,
    scope: 'global',
  },
];

const LATENCY_DATA = [
  { time: '00:00', web: 42, api: 115, db: 280 },
  { time: '04:00', web: 38, api: 108, db: 310 },
  { time: '08:00', web: 52, api: 145, db: 390 },
  { time: '12:00', web: 48, api: 128, db: 350 },
  { time: '16:00', web: 45, api: 120, db: 340 },
  { time: '20:00', web: 43, api: 118, db: 325 },
];

export default function ThroneSystemPage() {
  const [flags, setFlags] = useState(MOCK_FLAGS);
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [confirmingFlag, setConfirmingFlag] = useState<string | null>(null);

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'text-jade-400 bg-jade-500/10 border-jade-500/20';
      case 'degraded':
        return 'text-warning-400 bg-warning-500/10 border-warning-500/20';
      case 'down':
        return 'text-danger-400 bg-danger-500/10 border-danger-500/20';
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return CheckCircle;
      case 'degraded':
        return AlertTriangle;
      case 'down':
        return XCircle;
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'global':
        return 'bg-panda-500/10 text-panda-400 border-panda-500/20';
      case 'admin':
        return 'bg-ruby-500/10 text-ruby-400 border-ruby-500/20';
      case 'beta':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const toggleFlag = (flagId: string) => {
    setConfirmingFlag(flagId);
  };

  const confirmToggle = () => {
    if (!confirmingFlag) return;
    setFlags(flags.map((f) => (f.id === confirmingFlag ? { ...f, enabled: !f.enabled } : f)));
    setConfirmingFlag(null);
  };

  const operationalCount = MOCK_SERVICES.filter((s) => s.status === 'operational').length;

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-ruby-500/10">
            <Activity className="w-6 h-6 text-ruby-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200">System Health</h1>
        </div>
        <p className="text-slate-400">Monitor platform infrastructure and features</p>
      </div>

      {/* Overall Status */}
      <div className="p-6 rounded-lg bg-ink-850 border border-border mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                operationalCount === MOCK_SERVICES.length
                  ? 'bg-jade-500/10'
                  : 'bg-warning-500/10'
              }`}
            >
              {operationalCount === MOCK_SERVICES.length ? (
                <CheckCircle className="w-8 h-8 text-jade-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-warning-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-1">
                {operationalCount === MOCK_SERVICES.length
                  ? 'All Systems Operational'
                  : 'Partial Service Degradation'}
              </h2>
              <p className="text-sm text-slate-400">
                {operationalCount} of {MOCK_SERVICES.length} services running normally
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-ink-800 border border-border text-slate-300 hover:bg-ink-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {MOCK_SERVICES.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status);
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-ink-850 border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {service.name === 'Web Frontend' && (
                    <Globe className="w-4 h-4 text-slate-400" />
                  )}
                  {service.name === 'API Backend' && (
                    <Server className="w-4 h-4 text-slate-400" />
                  )}
                  {service.name === 'Database' && (
                    <Database className="w-4 h-4 text-slate-400" />
                  )}
                  {service.name === 'Queue System' && (
                    <Zap className="w-4 h-4 text-slate-400" />
                  )}
                  <h3 className="text-sm font-medium text-slate-300">{service.name}</h3>
                </div>
                <StatusIcon className={`w-4 h-4 ${getStatusColor(service.status).split(' ')[0]}`} />
              </div>

              <div
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border mb-3 ${getStatusColor(
                  service.status
                )}`}
              >
                {service.status.toUpperCase()}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Latency:</span>
                  <span
                    className={`font-medium ${
                      service.latency < 100
                        ? 'text-jade-400'
                        : service.latency < 300
                        ? 'text-warning-400'
                        : 'text-danger-400'
                    }`}
                  >
                    {service.latency}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Uptime:</span>
                  <span className="text-slate-200 font-medium">{service.uptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Incident:</span>
                  <span className="text-slate-200">{service.lastIncident}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Latency Chart (Mock) */}
      <div className="p-6 rounded-lg bg-ink-850 border border-border mb-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4">24h Latency Trends</h3>
        <div className="h-40 flex items-end justify-between gap-2">
          {LATENCY_DATA.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-1">
                <div
                  className="w-full bg-sky-500/20 rounded-t"
                  style={{ height: `${(data.web / 400) * 100}px` }}
                />
                <div
                  className="w-full bg-panda-500/20 rounded"
                  style={{ height: `${(data.api / 400) * 100}px` }}
                />
                <div
                  className="w-full bg-danger-500/20 rounded-b"
                  style={{ height: `${(data.db / 400) * 100}px` }}
                />
              </div>
              <span className="text-xs text-slate-500">{data.time}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sky-500/20" />
            <span className="text-slate-400">Web</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-panda-500/20" />
            <span className="text-slate-400">API</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-danger-500/20" />
            <span className="text-slate-400">Database</span>
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="p-6 rounded-lg bg-ink-850 border border-border mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-panda-400" />
          <h3 className="text-lg font-bold text-slate-200">Feature Flags</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Control platform features and experimental functionality
        </p>

        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-lg bg-ink-800 border border-border flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-slate-200">{flag.name}</h4>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getScopeColor(
                      flag.scope
                    )}`}
                  >
                    {flag.scope.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{flag.description}</p>
              </div>
              <button
                onClick={() => toggleFlag(flag.id)}
                className="ml-4 flex items-center gap-2"
              >
                {flag.enabled ? (
                  <ToggleRight className="w-8 h-8 text-jade-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Config Snapshot */}
      <div className="p-6 rounded-lg bg-ink-850 border border-border mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-200">Configuration Snapshot</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-400 mb-1">Build Version</div>
            <div className="text-slate-200 font-mono">v2.5.1-prod</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Environment</div>
            <div className="text-slate-200 font-mono">production</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Deploy Date</div>
            <div className="text-slate-200">2026-01-28</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Node Version</div>
            <div className="text-slate-200 font-mono">v20.11.0</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Database</div>
            <div className="text-slate-200 font-mono">PostgreSQL 16</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Cache</div>
            <div className="text-slate-200 font-mono">Redis 7.2</div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="p-4 rounded-lg bg-panda-500/5 border border-panda-500/10">
        <button
          onClick={() => setShowAIAssist(!showAIAssist)}
          className="flex items-center gap-2 w-full"
        >
          <Sparkles className="w-4 h-4 text-panda-400" />
          <span className="text-sm font-medium text-panda-400">AI System Monitor</span>
        </button>
        {showAIAssist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-xs text-slate-300 leading-relaxed space-y-2"
          >
            <p>
              🤖 <strong>System Health:</strong> Overall platform stability is good. Database
              latency spike detected at 08:00 due to scheduled backup process.
            </p>
            <p>
              <strong>Recommendation:</strong> Consider optimizing backup timing to off-peak
              hours. All services are performing within acceptable thresholds.
            </p>
            <p className="text-jade-400">
              <strong>Uptime Status:</strong> No critical incidents in the past 30 days.
              Platform availability exceeds 99.9% SLA.
            </p>
          </motion.div>
        )}
      </div>

      {/* Feature Flag Confirmation Modal */}
      <AnimatePresence>
        {confirmingFlag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmingFlag(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ink-850 border border-warning-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning-500/10">
                  <AlertTriangle className="w-6 h-6 text-warning-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-200">Confirm Feature Toggle</h3>
              </div>

              <p className="text-slate-300 mb-6">
                You are about to{' '}
                <strong className="text-warning-400">
                  {flags.find((f) => f.id === confirmingFlag)?.enabled ? 'disable' : 'enable'}
                </strong>{' '}
                the feature <strong>{flags.find((f) => f.id === confirmingFlag)?.name}</strong>.
                This change will affect the platform immediately.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingFlag(null)}
                  className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  className="flex-1 px-4 py-2 rounded bg-warning-500 text-white hover:bg-warning-600 transition-colors"
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
