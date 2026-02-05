'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    ShoppingCart,
    Search,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertTriangle,
    XCircle,
    MapPin,
    Upload,
    MessageSquare,
    X,
    ChevronRight,
    Eye,
    FileText,
    Camera,
    Timer,
} from 'lucide-react';

// Mock Orders Data
const MOCK_ORDERS = [
    {
        id: 'BC-2024-1892',
        buyer: {
            name: 'Zhang Wei Trading',
            location: 'Shanghai, China',
            avatar: 'ZW',
        },
        items: [
            { name: 'Premium Ceramic Tea Set', qty: 50, price: 299 },
            { name: 'Bamboo Cutting Board', qty: 30, price: 49 },
        ],
        total: '¥16,420',
        status: 'new',
        slaDeadline: '2024-02-12 18:00',
        slaHoursLeft: 24,
        createdAt: '2024-02-10',
        shippingAddress: '1234 Pudong Avenue, Shanghai 200120',
        trackingNumber: null,
    },
    {
        id: 'BC-2024-1891',
        buyer: {
            name: 'Li Fashion Co.',
            location: 'Guangzhou, China',
            avatar: 'LF',
        },
        items: [
            { name: 'Silk Scarf Collection', qty: 100, price: 89 },
        ],
        total: '¥8,900',
        status: 'processing',
        slaDeadline: '2024-02-13 12:00',
        slaHoursLeft: 42,
        createdAt: '2024-02-09',
        shippingAddress: '567 Tianhe District, Guangzhou 510620',
        trackingNumber: null,
    },
    {
        id: 'BC-2024-1890',
        buyer: {
            name: 'Chen Home Decor',
            location: 'Beijing, China',
            avatar: 'CH',
        },
        items: [
            { name: 'Blue & White Porcelain Vase', qty: 20, price: 450 },
        ],
        total: '¥9,000',
        status: 'shipped',
        slaDeadline: '2024-02-14 10:00',
        slaHoursLeft: 64,
        createdAt: '2024-02-08',
        shippingAddress: '890 Chaoyang Road, Beijing 100020',
        trackingNumber: 'SF123456789CN',
    },
    {
        id: 'BC-2024-1889',
        buyer: {
            name: 'Wang Electronics',
            location: 'Shenzhen, China',
            avatar: 'WE',
        },
        items: [
            { name: 'Jade Bracelet Set', qty: 15, price: 599 },
        ],
        total: '¥8,985',
        status: 'delivered',
        slaDeadline: null,
        slaHoursLeft: 0,
        createdAt: '2024-02-05',
        shippingAddress: '234 Futian District, Shenzhen 518000',
        trackingNumber: 'SF987654321CN',
        completedAt: '2024-02-08',
    },
    {
        id: 'BC-2024-1888',
        buyer: {
            name: 'Liu Import/Export',
            location: 'Hangzhou, China',
            avatar: 'LI',
        },
        items: [
            { name: 'Embroidered Table Runner', qty: 40, price: 79 },
        ],
        total: '¥3,160',
        status: 'dispute',
        slaDeadline: null,
        slaHoursLeft: 0,
        createdAt: '2024-02-01',
        shippingAddress: '456 Xihu District, Hangzhou 310000',
        trackingNumber: 'SF111222333CN',
        disputeReason: 'Item damaged during shipping',
    },
];

const STATUS_TABS = [
    { id: 'all', label: 'All Orders', count: MOCK_ORDERS.length },
    { id: 'new', label: 'New', count: MOCK_ORDERS.filter(o => o.status === 'new').length },
    { id: 'processing', label: 'Processing', count: MOCK_ORDERS.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: MOCK_ORDERS.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: MOCK_ORDERS.filter(o => o.status === 'delivered').length },
    { id: 'dispute', label: 'Dispute', count: MOCK_ORDERS.filter(o => o.status === 'dispute').length },
];

export default function OrdersFulfillmentPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
    const [showDetailDrawer, setShowDetailDrawer] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    // Filter orders
    const filteredOrders = MOCK_ORDERS.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const openOrderDetail = (order: typeof MOCK_ORDERS[0]) => {
        setSelectedOrder(order);
        setShowDetailDrawer(true);
    };

    const handleStatusTransition = (action: string) => {
        setPendingAction(action);
        setShowAI(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/20 text-blue-400';
            case 'processing': return 'bg-warning-500/20 text-warning-400';
            case 'shipped': return 'bg-panda-500/20 text-panda-400';
            case 'delivered': return 'bg-success-500/20 text-success-400';
            case 'dispute': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new': return <Clock className="h-4 w-4" />;
            case 'processing': return <Package className="h-4 w-4" />;
            case 'shipped': return <Truck className="h-4 w-4" />;
            case 'delivered': return <CheckCircle className="h-4 w-4" />;
            case 'dispute': return <AlertTriangle className="h-4 w-4" />;
            default: return null;
        }
    };

    const newOrdersCount = MOCK_ORDERS.filter(o => o.status === 'new').length;
    const urgentCount = MOCK_ORDERS.filter(o => o.slaHoursLeft > 0 && o.slaHoursLeft < 24).length;

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
                            <ShoppingCart className="h-8 w-8 text-success-400" />
                            Order Fulfillment
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Process and ship customer orders
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {urgentCount > 0 && (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium animate-pulse">
                                <Timer className="h-4 w-4 inline mr-1" />
                                {urgentCount} Urgent
                            </span>
                        )}
                        {newOrdersCount > 0 && (
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                                {newOrdersCount} New
                            </span>
                        )}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-5 gap-4"
                >
                    {STATUS_TABS.filter(t => t.id !== 'all').map((tab, index) => (
                        <Card
                            key={tab.id}
                            className={`bg-ink-800 border-border cursor-pointer hover:border-panda-500/50 transition-colors ${
                                activeTab === tab.id ? 'border-panda-500' : ''
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400">{tab.label}</p>
                                        <p className="text-2xl font-bold text-white">{tab.count}</p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${getStatusColor(tab.id)}`}>
                                        {getStatusIcon(tab.id)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Status Tabs */}
                                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                                    {STATUS_TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-panda-500 text-white'
                                                    : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by order ID or buyer..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-ink-800 border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-ink-900">
                                        <th className="p-4 text-left text-sm font-medium text-slate-400">Order</th>
                                        <th className="p-4 text-left text-sm font-medium text-slate-400">Buyer</th>
                                        <th className="p-4 text-left text-sm font-medium text-slate-400">Items</th>
                                        <th className="p-4 text-left text-sm font-medium text-slate-400">Total</th>
                                        <th className="p-4 text-left text-sm font-medium text-slate-400">Status</th>
                                        <th className="p-4 text-left text-sm font-medium text-slate-400">SLA</th>
                                        <th className="p-4 text-right text-sm font-medium text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center">
                                                <ShoppingCart className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
                                                <p className="text-slate-400">Orders will appear here when buyers purchase</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order, index) => (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="border-b border-border hover:bg-ink-700/50 transition-colors cursor-pointer"
                                                onClick={() => openOrderDetail(order)}
                                            >
                                                <td className="p-4">
                                                    <span className="font-mono text-white">{order.id}</span>
                                                    <p className="text-xs text-slate-500 mt-1">{order.createdAt}</p>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-panda-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                            {order.buyer.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{order.buyer.name}</p>
                                                            <p className="text-xs text-slate-400">{order.buyer.location}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-white">{order.items.length} item(s)</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-[150px]">
                                                        {order.items[0].name}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-white font-medium">{order.total}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {order.slaHoursLeft > 0 ? (
                                                        <span className={`text-sm font-medium ${
                                                            order.slaHoursLeft < 24 ? 'text-red-400' :
                                                            order.slaHoursLeft < 48 ? 'text-warning-400' : 'text-slate-300'
                                                        }`}>
                                                            {order.slaHoursLeft}h left
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-border text-slate-300 hover:bg-ink-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openOrderDetail(order);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>

                {/* Order Detail Drawer */}
                <AnimatePresence>
                    {showDetailDrawer && selectedOrder && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowDetailDrawer(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-ink-900 border-l border-border z-50 overflow-y-auto"
                            >
                                {/* Header */}
                                <div className="sticky top-0 bg-ink-900 border-b border-border p-4 flex items-center justify-between z-10">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedOrder.id}</h2>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusIcon(selectedOrder.status)}
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailDrawer(false)}
                                        className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-6">
                                    {/* Timeline */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Order Timeline</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="relative">
                                                {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                                    const statusIndex = ['new', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status);
                                                    const isCompleted = index <= statusIndex;
                                                    const isCurrent = index === statusIndex;
                                                    return (
                                                        <div key={step} className="flex items-center gap-3 pb-4 last:pb-0">
                                                            <div className={`w-3 h-3 rounded-full ${
                                                                isCompleted ? 'bg-panda-500' : 'bg-ink-600'
                                                            } ${isCurrent ? 'ring-4 ring-panda-500/30' : ''}`} />
                                                            <span className={isCompleted ? 'text-white' : 'text-slate-500'}>
                                                                {step}
                                                            </span>
                                                            {index < 3 && (
                                                                <div className={`absolute left-[5px] w-0.5 h-6 mt-4 ${
                                                                    isCompleted && index < statusIndex ? 'bg-panda-500' : 'bg-ink-600'
                                                                }`} style={{ top: `${index * 40 + 12}px` }} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Items */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Order Items</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-3">
                                            {selectedOrder.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-ink-700 rounded-lg">
                                                    <div>
                                                        <p className="text-white font-medium">{item.name}</p>
                                                        <p className="text-sm text-slate-400">Qty: {item.qty}</p>
                                                    </div>
                                                    <span className="text-white font-medium">
                                                        ¥{(item.qty * item.price).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between pt-3 border-t border-border">
                                                <span className="text-slate-400">Total</span>
                                                <span className="text-lg font-bold text-panda-400">{selectedOrder.total}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Shipping Address */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                                Shipping Address
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-white">{selectedOrder.buyer.name}</p>
                                            <p className="text-slate-400 text-sm mt-1">{selectedOrder.shippingAddress}</p>
                                        </CardContent>
                                    </Card>

                                    {/* Tracking */}
                                    {selectedOrder.trackingNumber && (
                                        <Card className="bg-ink-800 border-border">
                                            <CardHeader>
                                                <CardTitle className="text-white text-sm flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-slate-400" />
                                                    Tracking Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="font-mono text-panda-400">{selectedOrder.trackingNumber}</p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Dispute Info */}
                                    {selectedOrder.status === 'dispute' && selectedOrder.disputeReason && (
                                        <Card className="bg-red-500/10 border-red-500/30">
                                            <CardHeader>
                                                <CardTitle className="text-red-400 text-sm flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Dispute Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-white">{selectedOrder.disputeReason}</p>
                                                <Button
                                                    size="sm"
                                                    className="mt-3 bg-red-500 hover:bg-red-600"
                                                    onClick={() => router.push(`/${locale}/cockpit/disputes/${selectedOrder.id}`)}
                                                >
                                                    View Dispute
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="sticky bottom-0 bg-ink-900 border-t border-border p-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-border text-slate-300"
                                            onClick={() => router.push(`/${locale}/messages`)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Message Buyer
                                        </Button>
                                        
                                        {selectedOrder.status === 'new' && (
                                            <Button
                                                className="flex-1 bg-panda-500 hover:bg-panda-600"
                                                onClick={() => handleStatusTransition('pack')}
                                            >
                                                <Package className="h-4 w-4 mr-2" />
                                                Mark as Packed
                                            </Button>
                                        )}
                                        
                                        {selectedOrder.status === 'processing' && (
                                            <Button
                                                className="flex-1 bg-panda-500 hover:bg-panda-600"
                                                onClick={() => handleStatusTransition('ship')}
                                            >
                                                <Truck className="h-4 w-4 mr-2" />
                                                Mark as Shipped
                                            </Button>
                                        )}
                                        
                                        {selectedOrder.status === 'shipped' && (
                                            <Button
                                                className="flex-1 bg-success-500 hover:bg-success-600"
                                                onClick={() => handleStatusTransition('deliver')}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Confirm Delivery
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {/* Upload Proof */}
                                    {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') && (
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2 border-border text-slate-300"
                                        >
                                            <Camera className="h-4 w-4 mr-2" />
                                            Upload Proof of Completion
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Hungry Hippo - Process Guard */}
                <AnimatePresence>
                    {showAI && pendingAction && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 right-6 max-w-sm z-[60]"
                        >
                            <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🦛
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">Hungry Hippo</h4>
                                                <button
                                                    onClick={() => {
                                                        setShowAI(false);
                                                        setPendingAction(null);
                                                    }}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            
                                            {pendingAction === 'deliver' && (
                                                <>
                                                    <p className="text-white/90 text-sm mt-1">
                                                        ⚠️ Before marking as delivered:
                                                    </p>
                                                    <ul className="text-white/80 text-sm mt-2 space-y-1">
                                                        <li className="flex items-center gap-2">
                                                            <AlertTriangle className="h-3 w-3 text-warning-300" />
                                                            No proof of delivery uploaded yet
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle className="h-3 w-3 text-success-300" />
                                                            Buyer has not confirmed receipt
                                                        </li>
                                                    </ul>
                                                    <p className="text-white/70 text-xs mt-2">
                                                        Marking delivered without proof may affect dispute resolution.
                                                    </p>
                                                </>
                                            )}
                                            
                                            {pendingAction === 'ship' && (
                                                <>
                                                    <p className="text-white/90 text-sm mt-1">
                                                        📦 Ready to ship?
                                                    </p>
                                                    <ul className="text-white/80 text-sm mt-2 space-y-1">
                                                        <li className="flex items-center gap-2">
                                                            <AlertTriangle className="h-3 w-3 text-warning-300" />
                                                            Enter tracking number before confirming
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle className="h-3 w-3 text-success-300" />
                                                            Escrow will release after buyer confirms
                                                        </li>
                                                    </ul>
                                                </>
                                            )}

                                            {pendingAction === 'pack' && (
                                                <>
                                                    <p className="text-white/90 text-sm mt-1">
                                                        ✅ Confirming order is packed and ready!
                                                    </p>
                                                    <p className="text-white/70 text-xs mt-2">
                                                        This will move the order to Processing status.
                                                    </p>
                                                </>
                                            )}

                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-white text-green-700 hover:bg-white/90"
                                                    onClick={() => {
                                                        setShowAI(false);
                                                        setPendingAction(null);
                                                        // Apply the action
                                                    }}
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Confirm
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/30 text-white hover:bg-white/10"
                                                    onClick={() => {
                                                        setShowAI(false);
                                                        setPendingAction(null);
                                                    }}
                                                >
                                                    Cancel
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
