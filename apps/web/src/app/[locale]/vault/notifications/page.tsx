'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Bell,
    CheckCircle,
    AlertTriangle,
    Info,
    TrendingUp,
    DollarSign,
    Calendar,
    X,
    Check,
    Trash2,
    Filter,
    Settings,
    Clock,
    ChevronRight,
} from 'lucide-react';

// Mock Notifications
const MOCK_NOTIFICATIONS = [
    {
        id: 'n1',
        type: 'yield',
        title: 'Yield Distribution Received',
        message: 'You received ¥31,250 from Porcelain Export Facility',
        timestamp: '2026-02-03T09:30:00',
        read: false,
        action: {
            label: 'View Transaction',
            href: '/vault/transactions',
        },
    },
    {
        id: 'n2',
        type: 'alert',
        title: 'Cycle Ending Soon',
        message: 'Your investment in Porcelain Export will enter liquidation window in 12 days',
        timestamp: '2026-02-03T08:00:00',
        read: false,
        action: {
            label: 'View Portfolio',
            href: '/vault/portfolio',
        },
    },
    {
        id: 'n3',
        type: 'opportunity',
        title: 'New Opportunity Available',
        message: 'Smart Home Assembly Plant opportunity is now open for investment',
        timestamp: '2026-02-02T15:45:00',
        read: true,
        action: {
            label: 'View Details',
            href: '/vault/opportunities',
        },
    },
    {
        id: 'n4',
        type: 'investment',
        title: 'Investment Confirmed',
        message: 'Your ¥150,000 investment in Smart Home Assembly has been processed',
        timestamp: '2026-02-01T14:20:00',
        read: true,
        action: {
            label: 'View Holding',
            href: '/vault/portfolio',
        },
    },
    {
        id: 'n5',
        type: 'info',
        title: 'Platform Maintenance',
        message: 'Scheduled maintenance on Feb 5, 2026 from 2:00-4:00 AM. All services will be temporarily unavailable.',
        timestamp: '2026-02-01T10:00:00',
        read: true,
        action: null,
    },
    {
        id: 'n6',
        type: 'yield',
        title: 'Yield Distribution Received',
        message: 'You received ¥12,500 from Bamboo Furniture Production Line',
        timestamp: '2026-02-01T00:00:00',
        read: true,
        action: {
            label: 'View Transaction',
            href: '/vault/transactions',
        },
    },
    {
        id: 'n7',
        type: 'security',
        title: 'Security Alert',
        message: 'New login detected from Windows device in Beijing',
        timestamp: '2026-01-31T18:30:00',
        read: true,
        action: {
            label: 'Review Activity',
            href: '/settings/security',
        },
    },
    {
        id: 'n8',
        type: 'achievement',
        title: 'Tier Upgraded!',
        message: 'Congratulations! You\'ve been upgraded to Gold tier',
        timestamp: '2026-01-30T12:00:00',
        read: true,
        action: null,
    },
];

const NOTIFICATION_TYPES = ['All', 'Yield', 'Investment', 'Alert', 'Opportunity', 'Info'];

export default function NotificationsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [typeFilter, setTypeFilter] = useState('All');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    // Filter notifications
    const filteredNotifications = notifications.filter(notif => {
        const matchesType = typeFilter === 'All' || notif.type.toLowerCase() === typeFilter.toLowerCase();
        const matchesRead = !showUnreadOnly || !notif.read;
        return matchesType && matchesRead;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'yield': return { icon: DollarSign, color: 'text-success-400 bg-success-500/20' };
            case 'investment': return { icon: TrendingUp, color: 'text-jade-400 bg-jade-500/20' };
            case 'alert': return { icon: AlertTriangle, color: 'text-warning-400 bg-warning-500/20' };
            case 'opportunity': return { icon: Bell, color: 'text-panda-400 bg-panda-500/20' };
            case 'security': return { icon: AlertTriangle, color: 'text-red-400 bg-red-500/20' };
            case 'achievement': return { icon: CheckCircle, color: 'text-purple-400 bg-purple-500/20' };
            default: return { icon: Info, color: 'text-blue-400 bg-blue-500/20' };
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
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
                        <Bell className="h-8 w-8 text-jade-400" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Stay updated with your investments
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Mark All Read
                    </Button>
                    <Button
                        variant="outline"
                        className="border-border text-slate-300"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-ink-850 border-border">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Type Filter */}
                            <div className="flex items-center gap-2 overflow-x-auto">
                                {NOTIFICATION_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setTypeFilter(type)}
                                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                                            typeFilter === type
                                                ? 'bg-jade-500 text-white'
                                                : 'bg-ink-700 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Unread Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showUnreadOnly}
                                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                                    className="w-4 h-4 bg-ink-700 border-border rounded text-jade-500 focus:ring-jade-500"
                                />
                                <span className="text-sm text-slate-300">Unread only</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <Card className="bg-ink-800 border-border">
                    <CardContent className="p-0">
                        {filteredNotifications.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
                                <p className="text-slate-400">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredNotifications.map((notif, index) => {
                                    const iconConfig = getNotificationIcon(notif.type);
                                    const Icon = iconConfig.icon;
                                    return (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`p-4 hover:bg-ink-700/50 transition-colors ${
                                                !notif.read ? 'bg-ink-700/30' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconConfig.color}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="text-white font-medium">{notif.title}</h4>
                                                                {!notif.read && (
                                                                    <div className="w-2 h-2 bg-jade-400 rounded-full" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-400 mb-2">{notif.message}</p>
                                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatTimestamp(notif.timestamp)}
                                                                </span>
                                                                <span className="capitalize">• {notif.type}</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1">
                                                            {!notif.read && (
                                                                <button
                                                                    onClick={() => markAsRead(notif.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-success-400 hover:bg-ink-700 rounded"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notif.id)}
                                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-ink-700 rounded"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Action Button */}
                                                    {notif.action && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="mt-3 border-border text-slate-300 hover:border-jade-500 hover:text-jade-400"
                                                            onClick={() => {
                                                                markAsRead(notif.id);
                                                                router.push(`/${locale}${notif.action.href}`);
                                                            }}
                                                        >
                                                            {notif.action.label}
                                                            <ChevronRight className="h-4 w-4 ml-1" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
