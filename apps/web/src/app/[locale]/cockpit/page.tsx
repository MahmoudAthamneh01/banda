'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    TrendingUp,
    TrendingDown,
    Package,
    Warehouse,
    FileText,
    ShoppingCart,
    DollarSign,
    AlertTriangle,
    Clock,
    CheckCircle,
    ArrowRight,
    Plus,
    Upload,
    MessageSquare,
    ExternalLink,
    Zap,
    X,
} from 'lucide-react';

// Mock KPI Data
const KPIS = [
    {
        id: 'revenue',
        label: 'Monthly Revenue',
        value: '¥128,450',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'from-success-500 to-success-600',
    },
    {
        id: 'orders',
        label: 'Pending Orders',
        value: '24',
        change: '+8',
        trend: 'up',
        icon: ShoppingCart,
        color: 'from-panda-500 to-panda-600',
    },
    {
        id: 'inventory',
        label: 'Inventory Alerts',
        value: '7',
        change: '+3',
        trend: 'up',
        icon: Warehouse,
        color: 'from-warning-500 to-warning-600',
    },
    {
        id: 'rfq',
        label: 'RFQs Awaiting',
        value: '5',
        change: '-2',
        trend: 'down',
        icon: FileText,
        color: 'from-silk-500 to-silk-600',
    },
];

// Action Cards
const ACTION_CARDS = [
    {
        id: 'add-product',
        title: 'Add Product',
        description: 'Create a new product listing',
        icon: Plus,
        href: '/cockpit/products/new',
        color: 'bg-panda-500',
    },
    {
        id: 'import',
        title: 'Import Products',
        description: 'Bulk import from CSV or Excel',
        icon: Upload,
        href: '/cockpit/import',
        color: 'bg-silk-500',
    },
    {
        id: 'rfq',
        title: 'Respond to RFQ',
        description: 'View and respond to buyer requests',
        icon: MessageSquare,
        href: '/cockpit/rfq',
        color: 'bg-jade-500',
    },
    {
        id: 'orders',
        title: 'View Orders',
        description: 'Manage pending shipments',
        icon: ShoppingCart,
        href: '/cockpit/orders',
        color: 'bg-success-500',
    },
];

// Work Queue Items
const WORK_QUEUE = [
    {
        id: 'wq-1',
        type: 'low-stock',
        title: 'Low Stock Alert',
        description: 'Ceramic Tea Set - Only 3 left',
        priority: 'high',
        action: '/cockpit/inventory',
        actionLabel: 'Restock',
    },
    {
        id: 'wq-2',
        type: 'shipment',
        title: 'Shipment Needed',
        description: 'Order #BC-2024-1892 - Pack & Ship',
        priority: 'medium',
        action: '/cockpit/orders/BC-2024-1892',
        actionLabel: 'Process',
    },
    {
        id: 'wq-3',
        type: 'rfq-expiring',
        title: 'RFQ Expiring Soon',
        description: 'Bulk Silk Scarves - 2 days left',
        priority: 'high',
        action: '/cockpit/rfq/rfq-003',
        actionLabel: 'Respond',
    },
    {
        id: 'wq-4',
        type: 'payout',
        title: 'Payout Ready',
        description: '¥8,500 available for withdrawal',
        priority: 'low',
        action: '/cockpit/payouts',
        actionLabel: 'Request',
    },
    {
        id: 'wq-5',
        type: 'review',
        title: 'New Review',
        description: 'Customer left 5-star review',
        priority: 'low',
        action: '/cockpit/reviews',
        actionLabel: 'View',
    },
];

// Mini Feed
const MINI_FEED = [
    {
        id: 'feed-1',
        type: 'stock',
        message: 'Stock updated: Bamboo Cutting Board +50 units',
        time: '5 min ago',
        icon: Package,
    },
    {
        id: 'feed-2',
        type: 'bid',
        message: 'Bid submitted for RFQ #RF-2024-089',
        time: '1 hour ago',
        icon: FileText,
    },
    {
        id: 'feed-3',
        type: 'payout',
        message: 'Payout ¥12,300 processed successfully',
        time: '3 hours ago',
        icon: DollarSign,
    },
    {
        id: 'feed-4',
        type: 'order',
        message: 'Order #BC-2024-1890 delivered',
        time: '5 hours ago',
        icon: CheckCircle,
    },
    {
        id: 'feed-5',
        type: 'stock',
        message: 'Low stock warning: Jade Bracelet Set',
        time: '6 hours ago',
        icon: AlertTriangle,
    },
];

export default function CockpitHomePage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    
    const [showAI, setShowAI] = useState(false);
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

    // AI Trigger: Show Cyber Wukong when there are alerts
    useEffect(() => {
        const hasAlerts = WORK_QUEUE.some(item => item.priority === 'high');
        if (hasAlerts) {
            const timer = setTimeout(() => setShowAI(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const highPriorityCount = WORK_QUEUE.filter(item => item.priority === 'high').length;

    return (
        <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-200">
                            Welcome back, Ali 👋
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Here&apos;s what&apos;s happening with your business today
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:bg-surface"
                            onClick={() => router.push(`/${locale}/cockpit/analytics`)}
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Analytics
                        </Button>
                        <Button
                            className="bg-panda-500 hover:bg-panda-600 text-white"
                            onClick={() => router.push(`/${locale}/cockpit/products/new`)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Product
                        </Button>
                    </div>
                </motion.div>

                {/* KPI Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {KPIS.map((kpi, index) => {
                        const Icon = kpi.icon;
                        return (
                            <motion.div
                                key={kpi.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <Card className="bg-ink-800 border-border hover:border-border-strong transition-colors cursor-pointer group">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className={`flex items-center gap-1 text-sm ${
                                                kpi.trend === 'up' ? 'text-success-400' : 'text-red-400'
                                            }`}>
                                                {kpi.trend === 'up' ? (
                                                    <TrendingUp className="h-3 w-3" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3" />
                                                )}
                                                {kpi.change}
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-2xl font-bold text-slate-200 group-hover:text-panda-400 transition-colors">
                                                {kpi.value}
                                            </p>
                                            <p className="text-sm text-slate-400">{kpi.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Action Cards - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <Card className="bg-ink-800 border-border h-full">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-slate-200 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-panda-400" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {ACTION_CARDS.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <motion.button
                                            key={card.id}
                                            whileHover={{ x: 4 }}
                                            onClick={() => router.push(`/${locale}${card.href}`)}
                                            className="w-full flex items-center gap-4 p-3 bg-ink-700 hover:bg-ink-600 rounded-lg transition-colors text-left group"
                                        >
                                            <div className={`p-2 rounded-lg ${card.color}`}>
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-200 group-hover:text-panda-400 transition-colors">
                                                    {card.title}
                                                </p>
                                                <p className="text-sm text-slate-400 truncate">
                                                    {card.description}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-panda-400 transition-colors" />
                                        </motion.button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Work Queue - Center */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1"
                    >
                        <Card className="bg-ink-800 border-border h-full">
                            <CardHeader className="border-b border-border">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-slate-200 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-warning-400" />
                                        Work Queue
                                    </CardTitle>
                                    {highPriorityCount > 0 && (
                                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                                            {highPriorityCount} urgent
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    {WORK_QUEUE.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className={`p-4 border-b border-border last:border-0 hover:bg-ink-700 transition-colors cursor-pointer ${
                                                selectedQueue === item.id ? 'bg-ink-700' : ''
                                            }`}
                                            onClick={() => setSelectedQueue(selectedQueue === item.id ? null : item.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                                    item.priority === 'high' ? 'bg-red-500' :
                                                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-200 text-sm">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm text-slate-400 truncate">
                                                        {item.description}
                                                    </p>
                                                    <AnimatePresence>
                                                        {selectedQueue === item.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="mt-3"
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        router.push(`/${locale}${item.action}`);
                                                                    }}
                                                                    className="bg-panda-500 hover:bg-panda-600 text-white"
                                                                >
                                                                    {item.actionLabel}
                                                                    <ExternalLink className="h-3 w-3 ml-2" />
                                                                </Button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Mini Feed - Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <Card className="bg-ink-800 border-border h-full">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-slate-200 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-success-400" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    {MINI_FEED.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 + index * 0.05 }}
                                                className="p-4 border-b border-border last:border-0 hover:bg-ink-700 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        item.type === 'stock' ? 'bg-warning-500/20 text-warning-400' :
                                                        item.type === 'bid' ? 'bg-silk-500/20 text-silk-400' :
                                                        item.type === 'payout' ? 'bg-success-500/20 text-success-400' :
                                                        item.type === 'order' ? 'bg-panda-500/20 text-panda-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-300">
                                                            {item.message}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {item.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* AI Cyber Wukong Alert */}
                <AnimatePresence>
                    {showAI && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 right-6 max-w-sm z-50"
                        >
                            <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🐵
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-slate-200">
                                                    Cyber Wukong
                                                </h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-slate-300 text-sm mt-1">
                                                ⚠️ You have {highPriorityCount} urgent items requiring attention. 
                                                Low stock and expiring RFQ detected!
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-white text-orange-600 hover:bg-white/90"
                                                    onClick={() => {
                                                        router.push(`/${locale}/cockpit/inventory`);
                                                        setShowAI(false);
                                                    }}
                                                >
                                                    Fix Stock
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/30 text-white hover:bg-white/10"
                                                    onClick={() => {
                                                        router.push(`/${locale}/cockpit/rfq`);
                                                        setShowAI(false);
                                                    }}
                                                >
                                                    View RFQs
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
