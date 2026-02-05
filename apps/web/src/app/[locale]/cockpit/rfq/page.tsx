'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    FileText,
    Search,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Award,
    MessageSquare,
    Calendar,
    DollarSign,
    Package,
    Users,
    ChevronRight,
    X,
    Paperclip,
    Send,
    Sparkles,
    AlertCircle,
    Eye,
    ArrowRight,
} from 'lucide-react';

// Mock RFQ Data
const MOCK_RFQS = [
    {
        id: 'rfq-001',
        title: 'Bulk Ceramic Dinner Sets',
        category: 'Home & Living',
        qtyRange: '500-1000',
        targetPrice: '¥25-30/unit',
        deadline: '2024-02-15',
        daysLeft: 5,
        status: 'open',
        bidsCount: 8,
        description: 'Looking for high-quality ceramic dinner sets for restaurant chain. Must be microwave and dishwasher safe.',
        requirements: ['Food-grade ceramic', 'Microwave safe', 'Dishwasher safe', 'Custom logo printing'],
        createdAt: '2024-02-01',
    },
    {
        id: 'rfq-002',
        title: 'Silk Fabric Roll Wholesale',
        category: 'Textiles',
        qtyRange: '100-200 rolls',
        targetPrice: '¥800-1000/roll',
        deadline: '2024-02-20',
        daysLeft: 10,
        status: 'open',
        bidsCount: 12,
        description: 'Premium silk fabric for fashion brand. Multiple colors needed.',
        requirements: ['100% pure silk', 'Various colors', 'Bulk discount', 'Sample first'],
        createdAt: '2024-02-05',
    },
    {
        id: 'rfq-003',
        title: 'Custom Tea Packaging Boxes',
        category: 'Packaging',
        qtyRange: '5000-10000',
        targetPrice: '¥2-5/unit',
        deadline: '2024-02-12',
        daysLeft: 2,
        status: 'open',
        bidsCount: 6,
        description: 'Eco-friendly tea packaging boxes with custom design.',
        requirements: ['Recyclable material', 'Custom print', 'Food safe', 'Quick turnaround'],
        createdAt: '2024-02-08',
    },
    {
        id: 'rfq-004',
        title: 'Bamboo Kitchen Utensils Set',
        category: 'Kitchen',
        qtyRange: '2000-3000',
        targetPrice: '¥15-20/set',
        deadline: '2024-02-08',
        daysLeft: 0,
        status: 'in_review',
        bidsCount: 15,
        description: 'Complete bamboo kitchen utensil sets for retail.',
        requirements: ['FSC certified', '6-piece set', 'Gift box packaging'],
        createdAt: '2024-01-25',
    },
    {
        id: 'rfq-005',
        title: 'Porcelain Vase Collection',
        category: 'Home Decor',
        qtyRange: '300-500',
        targetPrice: '¥50-80/piece',
        deadline: '2024-01-30',
        daysLeft: -5,
        status: 'awarded',
        bidsCount: 9,
        awardedTo: 'Jingdezhen Artisan Co.',
        description: 'Traditional Chinese porcelain vases for boutique stores.',
        requirements: ['Hand-painted', 'Various sizes', 'Traditional patterns'],
        createdAt: '2024-01-15',
    },
    {
        id: 'rfq-006',
        title: 'Leather Wallet Bulk Order',
        category: 'Fashion',
        qtyRange: '1000-2000',
        targetPrice: '¥30-40/piece',
        deadline: '2024-01-20',
        daysLeft: -15,
        status: 'closed',
        bidsCount: 4,
        description: 'Genuine leather wallets for corporate gifts.',
        requirements: ['Genuine leather', 'RFID blocking', 'Custom embossing'],
        createdAt: '2024-01-05',
    },
];

const STATUS_TABS = [
    { id: 'all', label: 'All RFQs', count: MOCK_RFQS.length },
    { id: 'open', label: 'Open', count: MOCK_RFQS.filter(r => r.status === 'open').length },
    { id: 'in_review', label: 'In Review', count: MOCK_RFQS.filter(r => r.status === 'in_review').length },
    { id: 'awarded', label: 'Awarded', count: MOCK_RFQS.filter(r => r.status === 'awarded').length },
    { id: 'closed', label: 'Closed', count: MOCK_RFQS.filter(r => r.status === 'closed').length },
];

const CATEGORIES = ['All', 'Home & Living', 'Textiles', 'Packaging', 'Kitchen', 'Home Decor', 'Fashion', 'Electronics'];

export default function RFQHubPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [selectedRFQ, setSelectedRFQ] = useState<typeof MOCK_RFQS[0] | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAI, setShowAI] = useState(false);

    // Filter RFQs
    const filteredRFQs = MOCK_RFQS.filter(rfq => {
        const matchesSearch = rfq.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || rfq.status === activeTab;
        const matchesCategory = categoryFilter === 'All' || rfq.category === categoryFilter;
        return matchesSearch && matchesTab && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-success-500/20 text-success-400';
            case 'in_review': return 'bg-warning-500/20 text-warning-400';
            case 'awarded': return 'bg-panda-500/20 text-panda-400';
            case 'closed': return 'bg-slate-500/20 text-slate-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <Clock className="h-4 w-4" />;
            case 'in_review': return <Eye className="h-4 w-4" />;
            case 'awarded': return <Award className="h-4 w-4" />;
            case 'closed': return <XCircle className="h-4 w-4" />;
            default: return null;
        }
    };

    const totalBids = MOCK_RFQS.reduce((sum, rfq) => sum + rfq.bidsCount, 0);
    const openRFQs = MOCK_RFQS.filter(r => r.status === 'open').length;
    const urgentRFQs = MOCK_RFQS.filter(r => r.status === 'open' && r.daysLeft <= 3).length;

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
                            <FileText className="h-8 w-8 text-silk-400" />
                            RFQ Hub
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Manage requests for quotation and source products
                        </p>
                    </div>
                    <Button
                        className="bg-panda-500 hover:bg-panda-600 text-white"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create RFQ
                    </Button>
                </motion.div>

                {/* Stats */}
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
                                    <p className="text-sm text-slate-400">Total RFQs</p>
                                    <p className="text-2xl font-bold text-white">{MOCK_RFQS.length}</p>
                                </div>
                                <FileText className="h-8 w-8 text-silk-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Open RFQs</p>
                                    <p className="text-2xl font-bold text-success-400">{openRFQs}</p>
                                </div>
                                <Clock className="h-8 w-8 text-success-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Bids</p>
                                    <p className="text-2xl font-bold text-panda-400">{totalBids}</p>
                                </div>
                                <Users className="h-8 w-8 text-panda-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Urgent</p>
                                    <p className="text-2xl font-bold text-red-400">{urgentRFQs}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs & Filters */}
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
                                            <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                                                {tab.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Search & Category */}
                                <div className="flex flex-1 gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search RFQs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        />
                                    </div>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="px-4 py-2 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* RFQ List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        {filteredRFQs.length === 0 ? (
                            <Card className="bg-ink-800 border-border">
                                <CardContent className="p-12 text-center">
                                    <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">No RFQs found</h3>
                                    <p className="text-slate-400 mb-4">Create your first RFQ to start sourcing</p>
                                    <Button
                                        className="bg-panda-500 hover:bg-panda-600"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create RFQ
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredRFQs.map((rfq, index) => (
                                <motion.div
                                    key={rfq.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        className={`bg-ink-800 border-border hover:border-panda-500/50 transition-all cursor-pointer ${
                                            selectedRFQ?.id === rfq.id ? 'border-panda-500 ring-1 ring-panda-500/50' : ''
                                        }`}
                                        onClick={() => setSelectedRFQ(rfq)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
                                                            {getStatusIcon(rfq.status)}
                                                            {rfq.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        {rfq.status === 'open' && rfq.daysLeft <= 3 && (
                                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">
                                                                {rfq.daysLeft} days left
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-white text-lg">{rfq.title}</h3>
                                                    <p className="text-sm text-slate-400">{rfq.category}</p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-500" />
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-slate-500">Quantity</p>
                                                    <p className="text-white font-medium">{rfq.qtyRange}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500">Target Price</p>
                                                    <p className="text-white font-medium">{rfq.targetPrice}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500">Bids</p>
                                                    <p className="text-panda-400 font-medium">{rfq.bidsCount} bids</p>
                                                </div>
                                            </div>

                                            {rfq.status === 'awarded' && rfq.awardedTo && (
                                                <div className="mt-3 pt-3 border-t border-border">
                                                    <p className="text-sm text-slate-400">
                                                        <Award className="h-4 w-4 inline mr-1 text-panda-400" />
                                                        Awarded to: <span className="text-white">{rfq.awardedTo}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Detail Panel / Bid Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        {selectedRFQ ? (
                            <>
                                {/* RFQ Detail */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader className="border-b border-border">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white">RFQ Details</CardTitle>
                                            <button
                                                onClick={() => setSelectedRFQ(null)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-white text-lg mb-2">{selectedRFQ.title}</h3>
                                            <p className="text-sm text-slate-400">{selectedRFQ.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-ink-700 p-3 rounded-lg">
                                                <p className="text-slate-500 mb-1">Quantity</p>
                                                <p className="text-white font-medium">{selectedRFQ.qtyRange}</p>
                                            </div>
                                            <div className="bg-ink-700 p-3 rounded-lg">
                                                <p className="text-slate-500 mb-1">Target Price</p>
                                                <p className="text-white font-medium">{selectedRFQ.targetPrice}</p>
                                            </div>
                                            <div className="bg-ink-700 p-3 rounded-lg">
                                                <p className="text-slate-500 mb-1">Deadline</p>
                                                <p className="text-white font-medium">{selectedRFQ.deadline}</p>
                                            </div>
                                            <div className="bg-ink-700 p-3 rounded-lg">
                                                <p className="text-slate-500 mb-1">Category</p>
                                                <p className="text-white font-medium">{selectedRFQ.category}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">Requirements</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRFQ.requirements.map((req, i) => (
                                                    <span key={i} className="px-2 py-1 bg-ink-700 text-slate-300 rounded text-xs">
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 bg-panda-500 hover:bg-panda-600"
                                                onClick={() => router.push(`/${locale}/cockpit/bids?rfq=${selectedRFQ.id}`)}
                                            >
                                                View Bids ({selectedRFQ.bidsCount})
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-border text-slate-300"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Q&A Preview */}
                                <Card className="bg-ink-800 border-border">
                                    <CardHeader className="border-b border-border">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5 text-slate-400" />
                                            Q&A Thread
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3 text-sm">
                                            <div className="bg-ink-700 p-3 rounded-lg">
                                                <p className="text-slate-400 mb-1">Supplier asked:</p>
                                                <p className="text-white">Is custom packaging included?</p>
                                                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                                            </div>
                                            <div className="bg-panda-500/10 p-3 rounded-lg border border-panda-500/30">
                                                <p className="text-panda-400 mb-1">You replied:</p>
                                                <p className="text-white">Yes, custom packaging is required.</p>
                                                <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Reply to questions..."
                                                className="flex-1 px-3 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 text-sm"
                                            />
                                            <Button size="sm" className="bg-panda-500">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            /* Bid Inbox Summary */
                            <Card className="bg-ink-800 border-border">
                                <CardHeader className="border-b border-border">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Users className="h-5 w-5 text-panda-400" />
                                        Bid Inbox
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="text-center py-6">
                                        <p className="text-3xl font-bold text-panda-400 mb-1">{totalBids}</p>
                                        <p className="text-slate-400">Total bids received</p>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {MOCK_RFQS.filter(r => r.bidsCount > 0).slice(0, 3).map(rfq => (
                                            <div key={rfq.id} className="flex items-center justify-between p-2 bg-ink-700 rounded-lg">
                                                <span className="text-sm text-white truncate flex-1">{rfq.title}</span>
                                                <span className="text-sm text-panda-400 font-medium ml-2">{rfq.bidsCount} bids</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        className="w-full bg-panda-500/20 text-panda-400 hover:bg-panda-500/30"
                                        onClick={() => router.push(`/${locale}/cockpit/bids`)}
                                    >
                                        View All Bids
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </div>

                {/* Create RFQ Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCreateModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-x-4 top-[10%] mx-auto max-w-2xl bg-ink-900 border border-border rounded-xl z-50 max-h-[80vh] overflow-y-auto"
                            >
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-ink-900 border-b border-border p-4 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">Create New RFQ</h2>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowAI(true)}
                                            className="border-silk-500/50 text-silk-400 hover:bg-silk-500/20"
                                        >
                                            <Sparkles className="h-4 w-4 mr-1" />
                                            AI Optimize
                                        </Button>
                                        <button
                                            onClick={() => setShowCreateModal(false)}
                                            className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            RFQ Title *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Bulk Order - Premium Tea Sets"
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Category *
                                        </label>
                                        <select className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500">
                                            <option value="">Select category</option>
                                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Product Specifications *
                                        </label>
                                        <textarea
                                            rows={4}
                                            placeholder="Describe your requirements in detail..."
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500 resize-none"
                                        />
                                    </div>

                                    {/* Quantity & Price */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Quantity Range *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 500-1000 units"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Target Price
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., ¥25-30/unit"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Deadline */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Deadline *
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        />
                                    </div>

                                    {/* Attachments */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Attachments
                                        </label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-panda-500/50 transition-colors cursor-pointer">
                                            <Paperclip className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                                            <p className="text-slate-400 text-sm">Drop files here or click to upload</p>
                                            <p className="text-slate-500 text-xs mt-1">PDF, Images, Documents (Max 10MB)</p>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded border-border bg-ink-700 text-panda-500" />
                                            <span className="text-sm text-slate-300">Allow partial fulfillment</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="sticky bottom-0 bg-ink-900 border-t border-border p-4 flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCreateModal(false)}
                                        className="border-border text-slate-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="bg-panda-500 hover:bg-panda-600 text-white">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Publish RFQ
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI RFQ Optimizer */}
                <AnimatePresence>
                    {showAI && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 right-6 max-w-sm z-[60]"
                        >
                            <Card className="bg-gradient-to-br from-silk-600 to-silk-700 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🐼
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">RFQ Optimizer</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                I can help improve your RFQ! Missing fields detected:
                                            </p>
                                            <ul className="text-white/80 text-sm mt-2 space-y-1">
                                                <li className="flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3 text-warning-300" />
                                                    MOQ not specified
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3 text-warning-300" />
                                                    Material requirements missing
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3 text-warning-300" />
                                                    Packaging details needed
                                                </li>
                                            </ul>
                                            <Button
                                                size="sm"
                                                className="w-full mt-3 bg-white text-silk-700 hover:bg-white/90"
                                            >
                                                <Sparkles className="h-3 w-3 mr-1" />
                                                Auto-complete Fields
                                            </Button>
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
