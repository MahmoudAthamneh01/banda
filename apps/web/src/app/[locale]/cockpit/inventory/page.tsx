'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Warehouse,
    Search,
    Filter,
    AlertTriangle,
    CheckCircle,
    MinusCircle,
    Plus,
    Minus,
    History,
    TrendingDown,
    Package,
    ArrowRight,
    X,
    RefreshCw,
    FileText,
} from 'lucide-react';

// Mock Inventory Data
const MOCK_INVENTORY = [
    {
        id: 'inv-001',
        sku: 'BC-TEA-001',
        product: 'Premium Ceramic Tea Set',
        currentStock: 45,
        reserved: 12,
        available: 33,
        reorderPoint: 20,
        status: 'ok',
        location: 'Warehouse A',
        lastUpdated: '2 hours ago',
    },
    {
        id: 'inv-002',
        sku: 'BC-SLK-002',
        product: 'Silk Scarf Collection',
        currentStock: 120,
        reserved: 25,
        available: 95,
        reorderPoint: 50,
        status: 'ok',
        location: 'Warehouse B',
        lastUpdated: '1 day ago',
    },
    {
        id: 'inv-003',
        sku: 'BC-JAD-003',
        product: 'Jade Bracelet Set',
        currentStock: 3,
        reserved: 2,
        available: 1,
        reorderPoint: 15,
        status: 'critical',
        location: 'Warehouse A',
        lastUpdated: '3 hours ago',
    },
    {
        id: 'inv-004',
        sku: 'BC-BAM-004',
        product: 'Bamboo Cutting Board',
        currentStock: 8,
        reserved: 0,
        available: 8,
        reorderPoint: 25,
        status: 'low',
        location: 'Warehouse C',
        lastUpdated: '5 hours ago',
    },
    {
        id: 'inv-005',
        sku: 'BC-POR-005',
        product: 'Blue & White Porcelain Vase',
        currentStock: 0,
        reserved: 0,
        available: 0,
        reorderPoint: 10,
        status: 'critical',
        location: 'Warehouse A',
        lastUpdated: '1 day ago',
    },
    {
        id: 'inv-006',
        sku: 'BC-EMB-006',
        product: 'Embroidered Table Runner',
        currentStock: 67,
        reserved: 5,
        available: 62,
        reorderPoint: 30,
        status: 'ok',
        location: 'Warehouse B',
        lastUpdated: '12 hours ago',
    },
];

// Reorder Suggestions
const REORDER_SUGGESTIONS = [
    {
        id: 'reorder-001',
        sku: 'BC-JAD-003',
        product: 'Jade Bracelet Set',
        currentStock: 3,
        suggestedQty: 50,
        estimatedCost: '¥15,000',
        urgency: 'critical',
    },
    {
        id: 'reorder-002',
        sku: 'BC-POR-005',
        product: 'Blue & White Porcelain Vase',
        currentStock: 0,
        suggestedQty: 30,
        estimatedCost: '¥9,000',
        urgency: 'critical',
    },
    {
        id: 'reorder-003',
        sku: 'BC-BAM-004',
        product: 'Bamboo Cutting Board',
        currentStock: 8,
        suggestedQty: 100,
        estimatedCost: '¥2,500',
        urgency: 'low',
    },
];

// Audit Log
const AUDIT_LOG = [
    {
        id: 'log-001',
        action: 'Stock Added',
        product: 'Premium Ceramic Tea Set',
        change: '+50',
        user: 'Ali M.',
        reason: 'New shipment received',
        time: '2 hours ago',
    },
    {
        id: 'log-002',
        action: 'Stock Reserved',
        product: 'Silk Scarf Collection',
        change: '-25',
        user: 'System',
        reason: 'Order #BC-2024-1892',
        time: '4 hours ago',
    },
    {
        id: 'log-003',
        action: 'Stock Adjusted',
        product: 'Jade Bracelet Set',
        change: '-5',
        user: 'Ali M.',
        reason: 'Damaged goods',
        time: '1 day ago',
    },
    {
        id: 'log-004',
        action: 'Reorder Point Set',
        product: 'Bamboo Cutting Board',
        change: '25',
        user: 'Ali M.',
        reason: 'Increased demand',
        time: '2 days ago',
    },
];

const STATUS_FILTERS = ['All', 'OK', 'Low', 'Critical'];

export default function InventoryPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAdjustDrawer, setShowAdjustDrawer] = useState(false);
    const [selectedItem, setSelectedItem] = useState<typeof MOCK_INVENTORY[0] | null>(null);
    const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
    const [adjustmentQty, setAdjustmentQty] = useState(0);
    const [adjustmentReason, setAdjustmentReason] = useState('');
    const [showAI, setShowAI] = useState(false);

    // AI Trigger: Show when critical items detected
    useEffect(() => {
        const hasCritical = MOCK_INVENTORY.some(item => item.status === 'critical');
        if (hasCritical) {
            const timer = setTimeout(() => setShowAI(true), 4000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Filter inventory
    const filteredInventory = MOCK_INVENTORY.filter(item => {
        const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ok': return <CheckCircle className="h-4 w-4 text-success-400" />;
            case 'low': return <MinusCircle className="h-4 w-4 text-warning-400" />;
            case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ok': return 'bg-success-500/20 text-success-400';
            case 'low': return 'bg-warning-500/20 text-warning-400';
            case 'critical': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const openAdjustDrawer = (item: typeof MOCK_INVENTORY[0]) => {
        setSelectedItem(item);
        setAdjustmentQty(0);
        setAdjustmentReason('');
        setShowAdjustDrawer(true);
    };

    const criticalCount = MOCK_INVENTORY.filter(i => i.status === 'critical').length;
    const lowCount = MOCK_INVENTORY.filter(i => i.status === 'low').length;

    return (
        <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <Warehouse className="h-8 w-8 text-panda-400" />
                            Inventory Control
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Monitor and manage your stock levels
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {criticalCount > 0 && (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                                {criticalCount} Critical
                            </span>
                        )}
                        {lowCount > 0 && (
                            <span className="px-3 py-1 bg-warning-500/20 text-warning-400 rounded-full text-sm font-medium">
                                {lowCount} Low Stock
                            </span>
                        )}
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:bg-surface"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Stock
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total SKUs</p>
                                    <p className="text-2xl font-bold text-white">{MOCK_INVENTORY.length}</p>
                                </div>
                                <Package className="h-8 w-8 text-panda-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Units</p>
                                    <p className="text-2xl font-bold text-white">
                                        {MOCK_INVENTORY.reduce((sum, i) => sum + i.currentStock, 0)}
                                    </p>
                                </div>
                                <Warehouse className="h-8 w-8 text-jade-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Reserved</p>
                                    <p className="text-2xl font-bold text-white">
                                        {MOCK_INVENTORY.reduce((sum, i) => sum + i.reserved, 0)}
                                    </p>
                                </div>
                                <TrendingDown className="h-8 w-8 text-silk-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Need Reorder</p>
                                    <p className="text-2xl font-bold text-red-400">{REORDER_SUGGESTIONS.length}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Inventory Table */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="bg-ink-800 border-border">
                            <CardHeader className="border-b border-border">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by product or SKU..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        />
                                    </div>
                                    {/* Status Filter */}
                                    <div className="flex gap-2">
                                        {STATUS_FILTERS.map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    statusFilter === status
                                                        ? 'bg-panda-500 text-white'
                                                        : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-ink-900">
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Product</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Stock</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Available</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Reorder At</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Status</th>
                                            <th className="p-4 text-right text-sm font-medium text-slate-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInventory.map((item, index) => (
                                            <motion.tr
                                                key={item.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="border-b border-border hover:bg-ink-700/50 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-white">{item.product}</p>
                                                        <p className="text-sm text-slate-400 font-mono">{item.sku}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-white font-medium">{item.currentStock}</span>
                                                    {item.reserved > 0 && (
                                                        <span className="text-slate-400 text-sm ml-1">
                                                            ({item.reserved} reserved)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`font-medium ${
                                                        item.available === 0 ? 'text-red-400' :
                                                        item.available < item.reorderPoint ? 'text-warning-400' :
                                                        'text-success-400'
                                                    }`}>
                                                        {item.available}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    {item.reorderPoint}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                        {getStatusIcon(item.status)}
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openAdjustDrawer(item)}
                                                        className="border-border text-slate-300 hover:bg-ink-600"
                                                    >
                                                        Adjust
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Side Panels */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Reorder Suggestions */}
                        <Card className="bg-ink-800 border-border">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-warning-400" />
                                    Reorder Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {REORDER_SUGGESTIONS.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="p-4 border-b border-border last:border-0 hover:bg-ink-700/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-medium text-white text-sm">{item.product}</p>
                                                <p className="text-xs text-slate-400">{item.sku}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                item.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-warning-500/20 text-warning-400'
                                            }`}>
                                                {item.urgency}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">
                                                Suggested: <span className="text-white">{item.suggestedQty} units</span>
                                            </span>
                                            <span className="text-slate-400">{item.estimatedCost}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full mt-3 bg-panda-500/20 text-panda-400 hover:bg-panda-500/30"
                                        >
                                            Create RFQ
                                            <ArrowRight className="h-3 w-3 ml-2" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Audit Log */}
                        <Card className="bg-ink-800 border-border">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <History className="h-5 w-5 text-slate-400" />
                                    Recent Changes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                                {AUDIT_LOG.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-4 border-b border-border last:border-0"
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="text-sm font-medium text-white">{log.action}</span>
                                            <span className={`text-sm font-mono ${
                                                log.change.startsWith('+') ? 'text-success-400' :
                                                log.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'
                                            }`}>
                                                {log.change}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">{log.product}</p>
                                        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                            <span>{log.user}</span>
                                            <span>{log.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Adjust Stock Drawer */}
                <AnimatePresence>
                    {showAdjustDrawer && selectedItem && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAdjustDrawer(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ink-900 border-l border-border z-50"
                            >
                                {/* Header */}
                                <div className="sticky top-0 bg-ink-900 border-b border-border p-4 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">Adjust Stock</h2>
                                    <button
                                        onClick={() => setShowAdjustDrawer(false)}
                                        className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Product Info */}
                                    <div className="bg-ink-800 rounded-lg p-4">
                                        <p className="font-medium text-white">{selectedItem.product}</p>
                                        <p className="text-sm text-slate-400">{selectedItem.sku}</p>
                                        <div className="mt-3 flex items-center gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500">Current Stock</p>
                                                <p className="text-lg font-bold text-white">{selectedItem.currentStock}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Available</p>
                                                <p className="text-lg font-bold text-success-400">{selectedItem.available}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Reserved</p>
                                                <p className="text-lg font-bold text-warning-400">{selectedItem.reserved}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Adjustment Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Adjustment Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setAdjustmentType('add')}
                                                className={`p-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                                                    adjustmentType === 'add'
                                                        ? 'border-success-500 bg-success-500/20 text-success-400'
                                                        : 'border-border bg-ink-800 text-slate-300 hover:border-border-strong'
                                                }`}
                                            >
                                                <Plus className="h-5 w-5" />
                                                Add Stock
                                            </button>
                                            <button
                                                onClick={() => setAdjustmentType('remove')}
                                                className={`p-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                                                    adjustmentType === 'remove'
                                                        ? 'border-red-500 bg-red-500/20 text-red-400'
                                                        : 'border-border bg-ink-800 text-slate-300 hover:border-border-strong'
                                                }`}
                                            >
                                                <Minus className="h-5 w-5" />
                                                Remove Stock
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={adjustmentQty}
                                            onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                                            min={0}
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        />
                                        <p className="text-sm text-slate-400 text-center mt-2">
                                            New stock: {' '}
                                            <span className={adjustmentType === 'add' ? 'text-success-400' : 'text-red-400'}>
                                                {adjustmentType === 'add'
                                                    ? selectedItem.currentStock + adjustmentQty
                                                    : Math.max(0, selectedItem.currentStock - adjustmentQty)
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Reason Code
                                        </label>
                                        <select
                                            value={adjustmentReason}
                                            onChange={(e) => setAdjustmentReason(e.target.value)}
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        >
                                            <option value="">Select reason...</option>
                                            <option value="shipment">New Shipment Received</option>
                                            <option value="return">Customer Return</option>
                                            <option value="damaged">Damaged/Lost</option>
                                            <option value="audit">Inventory Audit</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Note (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Add a note..."
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 bg-ink-900 border-t border-border p-4 flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAdjustDrawer(false)}
                                        className="border-border text-slate-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className={adjustmentType === 'add' ? 'bg-success-500 hover:bg-success-600' : 'bg-red-500 hover:bg-red-600'}
                                        disabled={adjustmentQty === 0 || !adjustmentReason}
                                    >
                                        {adjustmentType === 'add' ? (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add {adjustmentQty} Units
                                            </>
                                        ) : (
                                            <>
                                                <Minus className="h-4 w-4 mr-2" />
                                                Remove {adjustmentQty} Units
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Cyber Wukong */}
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
                                                <h4 className="font-bold text-white">Cyber Wukong</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                📦 I detected {criticalCount} items below reorder point! 
                                                Want me to suggest optimal reorder quantities?
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-white text-orange-600 hover:bg-white/90"
                                                    onClick={() => setShowAI(false)}
                                                >
                                                    <RefreshCw className="h-3 w-3 mr-1" />
                                                    Auto-Suggest
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
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    Create RFQ
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
