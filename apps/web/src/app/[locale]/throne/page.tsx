'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    TrendingUp,
    AlertTriangle,
    Clock,
    Shield,
    DollarSign,
    Users,
    Zap,
    CheckCircle,
    XCircle,
    AlertCircle,
    Activity,
    ChevronRight,
    Eye,
    RefreshCw,
} from 'lucide-react';

// Mock KPIs
const KPIS = [
    {
        label: 'Total GMV',
        value: '¥45.2M',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'jade',
    },
    {
        label: 'Payment Success',
        value: '98.7%',
        change: '+0.3%',
        trend: 'up',
        icon: CheckCircle,
        color: 'success',
    },
    {
        label: 'Active Disputes',
        value: '12',
        change: '+3',
        trend: 'up',
        icon: AlertTriangle,
        color: 'warning',
    },
    {
        label: 'Fraud Risk Index',
        value: '2.1',
        change: '-0.4',
        trend: 'down',
        icon: Shield,
        color: 'ruby',
    },
    {
        label: 'Cycle Day',
        value: '45/90',
        change: '50%',
        trend: 'neutral',
        icon: Zap,
        color: 'panda',
    },
    {
        label: 'Commissions Paid',
        value: '¥2.3M',
        change: '+8.2%',
        trend: 'up',
        icon: Users,
        color: 'sky',
    },
];

// Mock Live Feed
const LIVE_FEED = [
    {
        id: 1,
        type: 'verification',
        icon: CheckCircle,
        color: 'success',
        message: 'User verified',
        details: 'user_8923 (Sarah Chen) passed KYC',
        timestamp: '2 minutes ago',
    },
    {
        id: 2,
        type: 'dispute',
        icon: AlertTriangle,
        color: 'warning',
        message: 'Dispute opened',
        details: 'Order #45621 - ¥15,400 in escrow',
        timestamp: '8 minutes ago',
    },
    {
        id: 3,
        type: 'fraud',
        icon: Shield,
        color: 'ruby',
        message: 'Suspicious order flagged',
        details: 'Order #45689 - multiple red flags detected',
        timestamp: '15 minutes ago',
    },
    {
        id: 4,
        type: 'referral',
        icon: Users,
        color: 'jade',
        message: 'Referral payout executed',
        details: '¥1,250 paid to user_2341',
        timestamp: '23 minutes ago',
    },
    {
        id: 5,
        type: 'system',
        icon: Activity,
        color: 'sky',
        message: 'System health check passed',
        details: 'All services operational',
        timestamp: '45 minutes ago',
    },
    {
        id: 6,
        type: 'payment',
        icon: DollarSign,
        color: 'jade',
        message: 'Large transaction completed',
        details: '¥250,000 - Factory investment',
        timestamp: '1 hour ago',
    },
];

// Mock Critical Alerts
const CRITICAL_ALERTS = [
    {
        severity: 'high',
        title: 'Payment Failure Spike',
        message: '15 payment failures in last hour (normal: 2-3)',
        action: 'Investigate',
        link: '/throne/finance',
    },
    {
        severity: 'high',
        title: 'Fraud Detection Alert',
        message: '8 orders flagged with high risk scores',
        action: 'Review',
        link: '/throne/fraud',
    },
    {
        severity: 'medium',
        title: 'Dispute SLA Breach',
        message: '3 disputes exceeding 72h resolution window',
        action: 'Escalate',
        link: '/throne/disputes',
    },
];

// Mock AI Briefing
const AI_BRIEFING = {
    summary: 'System operating normally with 3 areas requiring attention.',
    risks: [
        { level: 'medium', area: 'Fraud Detection', detail: 'Slight uptick in suspicious orders from new accounts' },
        { level: 'low', area: 'Payment Processing', detail: 'WeChat Pay gateway response time +15ms' },
        { level: 'medium', area: 'Dispute Resolution', detail: '2 high-value disputes pending arbitration' },
    ],
    recommendations: [
        'Review new account verification thresholds',
        'Monitor payment gateway performance',
        'Prioritize high-value dispute resolution',
    ],
};

export default function ThronePage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [showAIBriefing, setShowAIBriefing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-200">Operations Command Center</h1>
                        <p className="text-slate-400 mt-1">Real-time system oversight and control</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:border-sky-500 hover:text-sky-400"
                            onClick={() => setShowAIBriefing(!showAIBriefing)}
                        >
                            <Activity className="h-4 w-4 mr-2" />
                            AI Briefing
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-slate-300"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* AI Briefing Panel */}
            {showAIBriefing && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <Card className="bg-ink-850 border-panda-500/30">
                        <CardHeader>
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                🐼 Host Panda - Daily Briefing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-300">{AI_BRIEFING.summary}</p>
                            
                            <div>
                                <h4 className="text-slate-200 font-medium mb-2">Top Risks</h4>
                                <div className="space-y-2">
                                    {AI_BRIEFING.risks.map((risk, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-ink-800 rounded-lg">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                                risk.level === 'high' ? 'bg-ruby-500' :
                                                risk.level === 'medium' ? 'bg-warning-500' :
                                                'bg-sky-500'
                                            }`} />
                                            <div className="flex-1">
                                                <p className="text-slate-200 font-medium text-sm">{risk.area}</p>
                                                <p className="text-slate-400 text-sm">{risk.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-slate-200 font-medium mb-2">Recommendations</h4>
                                <ul className="space-y-1">
                                    {AI_BRIEFING.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                            <CheckCircle className="h-4 w-4 text-jade-500 mt-0.5 flex-shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {KPIS.map((kpi, index) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="bg-ink-850 border-border hover:border-panda-500/50 hover:shadow-glow-primary-sm transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-${kpi.color}-500/20 rounded-lg flex items-center justify-center`}>
                                        <kpi.icon className={`h-6 w-6 text-${kpi.color}-400`} />
                                    </div>
                                    <div className={`flex items-center gap-1 ${
                                        kpi.trend === 'up' ? 'text-jade-400' :
                                        kpi.trend === 'down' ? 'text-ruby-400' :
                                        'text-slate-400'
                                    }`}>
                                        {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                                         kpi.trend === 'down' ? <TrendingUp className="h-4 w-4 rotate-180" /> : null}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Alerts */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-ink-850 border-border">
                        <CardHeader>
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-ruby-400" />
                                Critical Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {CRITICAL_ALERTS.map((alert, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-lg border-l-4 ${
                                        alert.severity === 'high'
                                            ? 'bg-ruby-500/10 border-ruby-500'
                                            : 'bg-warning-500/10 border-warning-500'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-slate-200 font-medium">{alert.title}</h4>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            alert.severity === 'high'
                                                ? 'bg-ruby-500 text-white'
                                                : 'bg-warning-500 text-white'
                                        }`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm mb-3">{alert.message}</p>
                                    <Button
                                        size="sm"
                                        className="bg-panda-500 hover:bg-panda-600 text-sm"
                                        onClick={() => router.push(`/${locale}${alert.link}`)}
                                    >
                                        {alert.action}
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Live Feed */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-ink-850 border-border">
                        <CardHeader>
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-jade-400 animate-pulse" />
                                Live Event Stream
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {LIVE_FEED.map((event, i) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-3 bg-ink-800 hover:bg-ink-800/80 rounded-lg cursor-pointer transition-colors group"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 bg-${event.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <event.icon className={`h-4 w-4 text-${event.color}-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-200 text-sm font-medium group-hover:text-panda-400 transition-colors">
                                                    {event.message}
                                                </p>
                                                <p className="text-slate-400 text-xs truncate">{event.details}</p>
                                                <p className="text-slate-500 text-xs mt-1">{event.timestamp}</p>
                                            </div>
                                            <Eye className="h-4 w-4 text-slate-600 group-hover:text-panda-400 transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Jump */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="bg-ink-850 border-border">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Quick Jump</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Finance', href: '/throne/finance', icon: DollarSign, color: 'jade' },
                                { label: 'Users', href: '/throne/users', icon: Users, color: 'sky' },
                                { label: 'Disputes', href: '/throne/disputes', icon: Shield, color: 'warning' },
                                { label: 'Fraud', href: '/throne/fraud', icon: AlertTriangle, color: 'ruby' },
                            ].map((item) => (
                                <Button
                                    key={item.label}
                                    variant="outline"
                                    className="border-border text-slate-300 hover:border-panda-500 hover:text-panda-400 h-auto py-4 flex-col gap-2"
                                    onClick={() => router.push(`/${locale}${item.href}`)}
                                >
                                    <item.icon className={`h-6 w-6 text-${item.color}-400`} />
                                    <span className="text-sm">{item.label}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
