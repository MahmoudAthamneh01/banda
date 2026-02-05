'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Gavel,
    Search,
    Star,
    Shield,
    Clock,
    DollarSign,
    Package,
    MessageSquare,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    X,
    Eye,
    Award,
    BarChart3,
    ThumbsUp,
    ThumbsDown,
} from 'lucide-react';

// Mock Bids Data
const MOCK_BIDS = [
    {
        id: 'bid-001',
        rfqId: 'rfq-001',
        rfqTitle: 'Bulk Ceramic Dinner Sets',
        bidder: {
            name: 'Jingdezhen Artisan Co.',
            rating: 4.9,
            reviews: 156,
            verified: true,
            responseTime: '< 2 hours',
            avatar: 'JA',
        },
        price: '¥28/unit',
        priceValue: 28,
        leadTime: '15-20 days',
        leadTimeValue: 17,
        moq: 500,
        terms: 'FOB Shenzhen',
        status: 'active',
        submittedAt: '2 hours ago',
        message: 'We have extensive experience with ceramic dinner sets. Can provide samples within 3 days.',
    },
    {
        id: 'bid-002',
        rfqId: 'rfq-001',
        rfqTitle: 'Bulk Ceramic Dinner Sets',
        bidder: {
            name: 'Foshan Ceramics Ltd.',
            rating: 4.7,
            reviews: 89,
            verified: true,
            responseTime: '< 4 hours',
            avatar: 'FC',
        },
        price: '¥25/unit',
        priceValue: 25,
        leadTime: '20-25 days',
        leadTimeValue: 22,
        moq: 300,
        terms: 'FOB Guangzhou',
        status: 'shortlisted',
        submittedAt: '5 hours ago',
        message: 'Best price guarantee. We are one of the largest ceramic manufacturers in Guangdong.',
    },
    {
        id: 'bid-003',
        rfqId: 'rfq-001',
        rfqTitle: 'Bulk Ceramic Dinner Sets',
        bidder: {
            name: 'Chaozhou Premium Wares',
            rating: 4.5,
            reviews: 42,
            verified: false,
            responseTime: '< 8 hours',
            avatar: 'CP',
        },
        price: '¥18/unit',
        priceValue: 18,
        leadTime: '30-35 days',
        leadTimeValue: 32,
        moq: 1000,
        terms: 'EXW Factory',
        status: 'active',
        submittedAt: '1 day ago',
        message: 'Competitive pricing for bulk orders. Quality guaranteed.',
        flags: ['Unusually low price'],
    },
    {
        id: 'bid-004',
        rfqId: 'rfq-001',
        rfqTitle: 'Bulk Ceramic Dinner Sets',
        bidder: {
            name: 'Shanghai Trade Hub',
            rating: 4.8,
            reviews: 234,
            verified: true,
            responseTime: '< 1 hour',
            avatar: 'ST',
        },
        price: '¥32/unit',
        priceValue: 32,
        leadTime: '10-15 days',
        leadTimeValue: 12,
        moq: 200,
        terms: 'DDP Shanghai',
        status: 'active',
        submittedAt: '3 hours ago',
        message: 'Premium quality with fastest delivery. Includes free samples.',
    },
    {
        id: 'bid-005',
        rfqId: 'rfq-002',
        rfqTitle: 'Silk Fabric Roll Wholesale',
        bidder: {
            name: 'Suzhou Silk Masters',
            rating: 4.9,
            reviews: 312,
            verified: true,
            responseTime: '< 2 hours',
            avatar: 'SS',
        },
        price: '¥850/roll',
        priceValue: 850,
        leadTime: '7-10 days',
        leadTimeValue: 8,
        moq: 50,
        terms: 'FOB Shanghai',
        status: 'active',
        submittedAt: '6 hours ago',
        message: 'Authentic Suzhou silk. Multiple certifications available.',
    },
];

const STATUS_TABS = [
    { id: 'all', label: 'All Bids' },
    { id: 'active', label: 'Active' },
    { id: 'shortlisted', label: 'Shortlisted' },
    { id: 'rejected', label: 'Rejected' },
];

function BidsManagerContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = params.locale as string;
    const rfqFilter = searchParams.get('rfq');

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBids, setSelectedBids] = useState<string[]>([]);
    const [compareMode, setCompareMode] = useState(false);
    const [showAwardModal, setShowAwardModal] = useState(false);
    const [awardingBid, setAwardingBid] = useState<typeof MOCK_BIDS[0] | null>(null);
    const [showAI, setShowAI] = useState(false);

    // Filter bids
    const filteredBids = MOCK_BIDS.filter(bid => {
        const matchesSearch = bid.bidder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bid.rfqTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || bid.status === activeTab;
        const matchesRFQ = !rfqFilter || bid.rfqId === rfqFilter;
        return matchesSearch && matchesTab && matchesRFQ;
    });

    const toggleBidSelection = (id: string) => {
        setSelectedBids(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const getSelectedBidsData = () => {
        return MOCK_BIDS.filter(bid => selectedBids.includes(bid.id));
    };

    const openAwardFlow = (bid: typeof MOCK_BIDS[0]) => {
        setAwardingBid(bid);
        setShowAwardModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-success-500/20 text-success-400';
            case 'shortlisted': return 'bg-panda-500/20 text-panda-400';
            case 'rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

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
                            <Gavel className="h-8 w-8 text-panda-400" />
                            Bids Manager
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Review, compare, and award supplier bids
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedBids.length >= 2 && (
                            <Button
                                className="bg-silk-500 hover:bg-silk-600 text-white"
                                onClick={() => {
                                    setCompareMode(true);
                                    setShowAI(true);
                                }}
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Compare ({selectedBids.length})
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:bg-surface"
                            onClick={() => router.push(`/${locale}/cockpit/rfq`)}
                        >
                            View RFQs
                        </Button>
                    </div>
                </motion.div>

                {/* Tabs & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Status Tabs */}
                                <div className="flex gap-2">
                                    {STATUS_TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                                        placeholder="Search by supplier or RFQ..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Compare Mode View */}
                <AnimatePresence>
                    {compareMode && selectedBids.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="bg-ink-800 border-panda-500/50">
                                <CardHeader className="border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-panda-400" />
                                            Comparison View
                                        </CardTitle>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCompareMode(false)}
                                            className="border-border text-slate-300"
                                        >
                                            Exit Compare
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border bg-ink-900">
                                                <th className="p-4 text-left text-sm font-medium text-slate-400 sticky left-0 bg-ink-900">Criteria</th>
                                                {getSelectedBidsData().map(bid => (
                                                    <th key={bid.id} className="p-4 text-center text-sm font-medium text-white min-w-[200px]">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="w-10 h-10 bg-panda-500 rounded-full flex items-center justify-center text-white font-bold">
                                                                {bid.bidder.avatar}
                                                            </div>
                                                            <span>{bid.bidder.name}</span>
                                                            {bid.bidder.verified && (
                                                                <span className="flex items-center gap-1 text-xs text-success-400">
                                                                    <Shield className="h-3 w-3" /> Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-border">
                                                <td className="p-4 text-slate-400 sticky left-0 bg-ink-800">Price</td>
                                                {getSelectedBidsData().map(bid => {
                                                    const prices = getSelectedBidsData().map(b => b.priceValue);
                                                    const isLowest = bid.priceValue === Math.min(...prices);
                                                    return (
                                                        <td key={bid.id} className="p-4 text-center">
                                                            <span className={`text-lg font-bold ${isLowest ? 'text-success-400' : 'text-white'}`}>
                                                                {bid.price}
                                                            </span>
                                                            {isLowest && <span className="block text-xs text-success-400">Lowest</span>}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="p-4 text-slate-400 sticky left-0 bg-ink-800">Lead Time</td>
                                                {getSelectedBidsData().map(bid => {
                                                    const times = getSelectedBidsData().map(b => b.leadTimeValue);
                                                    const isFastest = bid.leadTimeValue === Math.min(...times);
                                                    return (
                                                        <td key={bid.id} className="p-4 text-center">
                                                            <span className={`font-medium ${isFastest ? 'text-success-400' : 'text-white'}`}>
                                                                {bid.leadTime}
                                                            </span>
                                                            {isFastest && <span className="block text-xs text-success-400">Fastest</span>}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="p-4 text-slate-400 sticky left-0 bg-ink-800">MOQ</td>
                                                {getSelectedBidsData().map(bid => (
                                                    <td key={bid.id} className="p-4 text-center text-white">
                                                        {bid.moq} units
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="p-4 text-slate-400 sticky left-0 bg-ink-800">Rating</td>
                                                {getSelectedBidsData().map(bid => (
                                                    <td key={bid.id} className="p-4 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                            <span className="text-white font-medium">{bid.bidder.rating}</span>
                                                            <span className="text-slate-400">({bid.bidder.reviews})</span>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="p-4 text-slate-400 sticky left-0 bg-ink-800">Terms</td>
                                                {getSelectedBidsData().map(bid => (
                                                    <td key={bid.id} className="p-4 text-center text-white">
                                                        {bid.terms}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="p-4 sticky left-0 bg-ink-800"></td>
                                                {getSelectedBidsData().map(bid => (
                                                    <td key={bid.id} className="p-4 text-center">
                                                        <Button
                                                            size="sm"
                                                            className="bg-panda-500 hover:bg-panda-600"
                                                            onClick={() => openAwardFlow(bid)}
                                                        >
                                                            <Award className="h-4 w-4 mr-1" />
                                                            Award Bid
                                                        </Button>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bids List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {filteredBids.length === 0 ? (
                        <Card className="bg-ink-800 border-border">
                            <CardContent className="p-12 text-center">
                                <Gavel className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No bids found</h3>
                                <p className="text-slate-400 mb-4">Create RFQs to receive supplier bids</p>
                                <Button
                                    className="bg-panda-500 hover:bg-panda-600"
                                    onClick={() => router.push(`/${locale}/cockpit/rfq`)}
                                >
                                    Go to RFQ Hub
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredBids.map((bid, index) => (
                            <motion.div
                                key={bid.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={`bg-ink-800 border-border hover:border-panda-500/50 transition-all ${
                                    selectedBids.includes(bid.id) ? 'border-panda-500 ring-1 ring-panda-500/50' : ''
                                }`}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            {/* Checkbox */}
                                            <div className="flex items-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBids.includes(bid.id)}
                                                    onChange={() => toggleBidSelection(bid.id)}
                                                    className="mt-1 rounded border-border bg-ink-700 text-panda-500"
                                                />
                                                
                                                {/* Bidder Info */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-panda-500 to-panda-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {bid.bidder.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-white">{bid.bidder.name}</h3>
                                                            {bid.bidder.verified && (
                                                                <Shield className="h-4 w-4 text-success-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                                            <span className="text-white">{bid.bidder.rating}</span>
                                                            <span className="text-slate-400">({bid.bidder.reviews} reviews)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bid Details */}
                                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                                                <div>
                                                    <p className="text-xs text-slate-500">Price</p>
                                                    <p className="text-lg font-bold text-panda-400">{bid.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Lead Time</p>
                                                    <p className="text-white font-medium">{bid.leadTime}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">MOQ</p>
                                                    <p className="text-white font-medium">{bid.moq} units</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Terms</p>
                                                    <p className="text-white font-medium">{bid.terms}</p>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                                                    {bid.status}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-border text-slate-300 hover:bg-ink-700"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-panda-500 hover:bg-panda-600"
                                                    onClick={() => openAwardFlow(bid)}
                                                >
                                                    <Award className="h-4 w-4 mr-1" />
                                                    Award
                                                </Button>
                                            </div>
                                        </div>

                                        {/* RFQ Reference & Message */}
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <p className="text-xs text-slate-500 mb-2">
                                                For: <span className="text-slate-300">{bid.rfqTitle}</span>
                                                <span className="mx-2">•</span>
                                                Submitted {bid.submittedAt}
                                            </p>
                                            <p className="text-sm text-slate-400">{bid.message}</p>
                                            
                                            {/* Flags */}
                                            {bid.flags && bid.flags.length > 0 && (
                                                <div className="mt-2 flex gap-2">
                                                    {bid.flags.map((flag, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-warning-500/20 text-warning-400 rounded text-xs">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            {flag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="mt-3 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-success-500/50 text-success-400 hover:bg-success-500/20"
                                            >
                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                Shortlist
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                            >
                                                <ThumbsDown className="h-3 w-3 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Award Modal */}
                <AnimatePresence>
                    {showAwardModal && awardingBid && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAwardModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-x-4 top-[20%] mx-auto max-w-lg bg-ink-900 border border-border rounded-xl z-50"
                            >
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 bg-panda-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="h-8 w-8 text-panda-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">Award this Bid?</h2>
                                    <p className="text-slate-400 mb-6">
                                        You are about to award the contract to <span className="text-white font-medium">{awardingBid.bidder.name}</span> for {awardingBid.price} per unit.
                                    </p>

                                    <div className="bg-ink-800 rounded-lg p-4 mb-6 text-left">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500">Price</p>
                                                <p className="text-white font-medium">{awardingBid.price}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Lead Time</p>
                                                <p className="text-white font-medium">{awardingBid.leadTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">MOQ</p>
                                                <p className="text-white font-medium">{awardingBid.moq} units</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Terms</p>
                                                <p className="text-white font-medium">{awardingBid.terms}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 mb-6">
                                        This will generate an order draft and notify the supplier.
                                    </p>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-border text-slate-300"
                                            onClick={() => setShowAwardModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="flex-1 bg-panda-500 hover:bg-panda-600"
                                            onClick={() => {
                                                // Award logic here
                                                setShowAwardModal(false);
                                                router.push(`/${locale}/cockpit/orders`);
                                            }}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Confirm Award
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Magistrate Mandrill - Fairness Lens */}
                <AnimatePresence>
                    {showAI && compareMode && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 right-6 max-w-sm z-50"
                        >
                            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🦍
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">Magistrate Mandrill</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                ⚖️ Fairness Analysis:
                                            </p>
                                            <ul className="text-white/80 text-sm mt-2 space-y-1">
                                                {getSelectedBidsData().some(b => b.flags?.includes('Unusually low price')) && (
                                                    <li className="flex items-center gap-2">
                                                        <AlertTriangle className="h-3 w-3 text-warning-300" />
                                                        One bid has unusually low price - ask for proof of capability
                                                    </li>
                                                )}
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-success-300" />
                                                    Verified suppliers generally more reliable
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Eye className="h-3 w-3 text-blue-300" />
                                                    Consider requesting samples before awarding
                                                </li>
                                            </ul>
                                            <Button
                                                size="sm"
                                                className="w-full mt-3 bg-white text-purple-700 hover:bg-white/90"
                                            >
                                                Generate Risk Report
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

// Loading fallback
function BidsLoading() {
    return (
        <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-slate-400">Loading bids...</div>
        </div>
    );
}

export default function BidsManagerPage() {
    return (
        <Suspense fallback={<BidsLoading />}>
            <BidsManagerContent />
        </Suspense>
    );
}
