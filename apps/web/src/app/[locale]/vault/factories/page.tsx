'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Factory,
    Search,
    Shield,
    Star,
    MapPin,
    Users,
    Package,
    TrendingUp,
    MessageSquare,
    Heart,
    HeartOff,
    X,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    Clock,
    FileText,
    Sparkles,
    Award,
    BarChart3,
    Eye,
} from 'lucide-react';

// Mock Factories Data
const MOCK_FACTORIES = [
    {
        id: 'f1',
        name: 'Hangzhou Premier Tea',
        description: 'Premium green tea processing with over 50 years of heritage. Specializing in Longjing and other regional varieties.',
        location: 'Hangzhou, Zhejiang',
        verified: true,
        rating: 4.8,
        reviewCount: 156,
        categories: ['Agriculture', 'Food & Beverage'],
        capacity: '500 tons/year',
        employeeCount: 120,
        founded: 1972,
        activeOpportunities: 2,
        totalRaised: '¥2.5M',
        completedCycles: 15,
        disputeRate: '0.2%',
        deliveryReliability: '98%',
        badge: 'Gold Partner',
        following: false,
    },
    {
        id: 'f2',
        name: 'Suzhou Silk Masters',
        description: 'Traditional silk weaving combined with modern production techniques. UNESCO recognized heritage craft.',
        location: 'Suzhou, Jiangsu',
        verified: true,
        rating: 4.6,
        reviewCount: 89,
        categories: ['Textiles', 'Crafts'],
        capacity: '10,000 meters/month',
        employeeCount: 85,
        founded: 1985,
        activeOpportunities: 1,
        totalRaised: '¥1.8M',
        completedCycles: 12,
        disputeRate: '0.5%',
        deliveryReliability: '96%',
        badge: 'Silver Partner',
        following: true,
    },
    {
        id: 'f3',
        name: 'Foshan Woodcraft',
        description: 'Master craftsmen creating premium rosewood furniture using traditional Cantonese techniques.',
        location: 'Foshan, Guangdong',
        verified: true,
        rating: 4.9,
        reviewCount: 203,
        categories: ['Crafts', 'Furniture'],
        capacity: '200 pieces/month',
        employeeCount: 45,
        founded: 1968,
        activeOpportunities: 1,
        totalRaised: '¥800K',
        completedCycles: 8,
        disputeRate: '0.0%',
        deliveryReliability: '99%',
        badge: 'Heritage Maker',
        following: false,
    },
    {
        id: 'f4',
        name: 'Dongguan Precision',
        description: 'High-tech electronics assembly and smart device manufacturing with ISO certifications.',
        location: 'Dongguan, Guangdong',
        verified: true,
        rating: 4.5,
        reviewCount: 67,
        categories: ['Electronics', 'Manufacturing'],
        capacity: '50,000 units/month',
        employeeCount: 350,
        founded: 2010,
        activeOpportunities: 1,
        totalRaised: '¥5.2M',
        completedCycles: 6,
        disputeRate: '1.2%',
        deliveryReliability: '94%',
        badge: 'Tech Pioneer',
        following: false,
    },
    {
        id: 'f5',
        name: 'Ningbo Blue & White',
        description: 'Traditional porcelain artistry specializing in blue and white patterns for domestic and export markets.',
        location: 'Ningbo, Zhejiang',
        verified: true,
        rating: 4.7,
        reviewCount: 142,
        categories: ['Crafts', 'Home Decor'],
        capacity: '5,000 pieces/month',
        employeeCount: 60,
        founded: 1990,
        activeOpportunities: 1,
        totalRaised: '¥1.2M',
        completedCycles: 10,
        disputeRate: '0.3%',
        deliveryReliability: '97%',
        badge: 'Gold Partner',
        following: true,
    },
    {
        id: 'f6',
        name: 'Chengdu Flavor House',
        description: 'Authentic Sichuan spice processing with traditional recipes and modern food safety standards.',
        location: 'Chengdu, Sichuan',
        verified: false,
        rating: 4.3,
        reviewCount: 34,
        categories: ['Food & Beverage', 'Agriculture'],
        capacity: '100 tons/month',
        employeeCount: 40,
        founded: 2015,
        activeOpportunities: 1,
        totalRaised: '¥400K',
        completedCycles: 3,
        disputeRate: '0.8%',
        deliveryReliability: '92%',
        badge: null,
        following: false,
    },
];

const CATEGORIES = ['All', 'Agriculture', 'Textiles', 'Crafts', 'Electronics', 'Manufacturing', 'Food & Beverage', 'Furniture', 'Home Decor'];

export default function FactoriesPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [selectedFactory, setSelectedFactory] = useState<typeof MOCK_FACTORIES[0] | null>(null);
    const [showProfileDrawer, setShowProfileDrawer] = useState(false);
    const [followingList, setFollowingList] = useState<string[]>(
        MOCK_FACTORIES.filter(f => f.following).map(f => f.id)
    );
    const [showAI, setShowAI] = useState(false);

    // Filter factories
    const filteredFactories = MOCK_FACTORIES.filter(factory => {
        const matchesSearch = factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            factory.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' ||
            factory.categories.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()));
        const matchesVerified = !verifiedOnly || factory.verified;
        return matchesSearch && matchesCategory && matchesVerified;
    });

    const toggleFollow = (id: string) => {
        setFollowingList(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const openProfile = (factory: typeof MOCK_FACTORIES[0]) => {
        setSelectedFactory(factory);
        setShowProfileDrawer(true);
        setShowAI(true); // Show AI trust checklist when opening profile
    };

    const getBadgeColor = (badge: string | null) => {
        switch (badge) {
            case 'Gold Partner': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Silver Partner': return 'bg-slate-400/20 text-slate-300 border-slate-400/30';
            case 'Heritage Maker': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Tech Pioneer': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            default: return 'bg-ink-700 text-slate-400 border-border';
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
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-200 flex items-center gap-3">
                            <Factory className="h-8 w-8 text-jade-400" />
                            Factories Directory
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Discover and connect with verified manufacturing partners
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">
                            {filteredFactories.length} factories found
                        </span>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search factories or locations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="px-3 py-2 bg-ink-700 border border-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => setVerifiedOnly(!verifiedOnly)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                            verifiedOnly
                                                ? 'bg-jade-500 text-white'
                                                : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
                                        }`}
                                    >
                                        <Shield className="h-4 w-4" />
                                        Verified Only
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Factories Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredFactories.length === 0 ? (
                        <Card className="bg-ink-800 border-border">
                            <CardContent className="p-12 text-center">
                                <Factory className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No factories found</h3>
                                <p className="text-slate-400">Try adjusting your search criteria</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFactories.map((factory, index) => (
                                <motion.div
                                    key={factory.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Card
                                        className="bg-ink-800 border-border hover:border-jade-500/30 transition-all duration-300 cursor-pointer h-full"
                                        onClick={() => openProfile(factory)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-jade-500/20 rounded-xl flex items-center justify-center">
                                                        <Factory className="h-6 w-6 text-jade-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-white font-semibold">{factory.name}</h3>
                                                            {factory.verified && (
                                                                <Shield className="h-4 w-4 text-jade-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-slate-400">
                                                            <MapPin className="h-3 w-3" />
                                                            {factory.location}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFollow(factory.id);
                                                    }}
                                                    className="p-2 hover:bg-ink-700 rounded-lg"
                                                >
                                                    {followingList.includes(factory.id) ? (
                                                        <Heart className="h-5 w-5 text-red-400 fill-red-400" />
                                                    ) : (
                                                        <Heart className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </button>
                                            </div>

                                            {factory.badge && (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border mb-3 ${getBadgeColor(factory.badge)}`}>
                                                    <Award className="h-3 w-3" />
                                                    {factory.badge}
                                                </span>
                                            )}

                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                                {factory.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {factory.categories.map(cat => (
                                                    <span
                                                        key={cat}
                                                        className="px-2 py-0.5 bg-ink-700 text-slate-300 rounded text-xs"
                                                    >
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-white">{factory.rating}</span>
                                                    <span className="text-slate-500">({factory.reviewCount})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-slate-400" />
                                                    <span className="text-slate-300">{factory.employeeCount}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-jade-400" />
                                                    <span className="text-jade-400">{factory.activeOpportunities} active</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-slate-400" />
                                                    <span className="text-slate-300">{factory.completedCycles} cycles</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Factory Profile Drawer */}
                <AnimatePresence>
                    {showProfileDrawer && selectedFactory && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowProfileDrawer(false)}
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
                                <div className="sticky top-0 bg-ink-900 border-b border-border p-4 z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-jade-500/20 rounded-xl flex items-center justify-center">
                                                <Factory className="h-7 w-7 text-jade-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl font-bold text-white">{selectedFactory.name}</h2>
                                                    {selectedFactory.verified && (
                                                        <Shield className="h-5 w-5 text-jade-400" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                                    <MapPin className="h-3 w-3" />
                                                    {selectedFactory.location}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowProfileDrawer(false)}
                                            className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-6">
                                    {/* Summary */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">About</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-slate-300 text-sm">
                                                {selectedFactory.description}
                                            </p>
                                            {selectedFactory.badge && (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border mt-3 ${getBadgeColor(selectedFactory.badge)}`}>
                                                    <Award className="h-3 w-3" />
                                                    {selectedFactory.badge}
                                                </span>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Track Record */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-jade-400" />
                                                Track Record
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-ink-700 rounded-lg">
                                                    <p className="text-xs text-slate-500">Total Raised</p>
                                                    <p className="text-lg font-bold text-jade-400">{selectedFactory.totalRaised}</p>
                                                </div>
                                                <div className="p-3 bg-ink-700 rounded-lg">
                                                    <p className="text-xs text-slate-500">Completed Cycles</p>
                                                    <p className="text-lg font-bold text-white">{selectedFactory.completedCycles}</p>
                                                </div>
                                                <div className="p-3 bg-ink-700 rounded-lg">
                                                    <p className="text-xs text-slate-500">Delivery Rate</p>
                                                    <p className="text-lg font-bold text-success-400">{selectedFactory.deliveryReliability}</p>
                                                </div>
                                                <div className="p-3 bg-ink-700 rounded-lg">
                                                    <p className="text-xs text-slate-500">Rating</p>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-lg font-bold text-white">{selectedFactory.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Trust Signals */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-jade-400" />
                                                Trust Signals
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    {selectedFactory.verified ? (
                                                        <CheckCircle className="h-4 w-4 text-success-400" />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-warning-400" />
                                                    )}
                                                    <span className="text-slate-300 text-sm">Identity Verified</span>
                                                </div>
                                                <span className={selectedFactory.verified ? 'text-success-400' : 'text-warning-400'}>
                                                    {selectedFactory.verified ? 'Yes' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-success-400" />
                                                    <span className="text-slate-300 text-sm">Dispute Rate</span>
                                                </div>
                                                <span className={
                                                    parseFloat(selectedFactory.disputeRate) < 1 
                                                        ? 'text-success-400' 
                                                        : 'text-warning-400'
                                                }>
                                                    {selectedFactory.disputeRate}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-success-400" />
                                                    <span className="text-slate-300 text-sm">Delivery Reliability</span>
                                                </div>
                                                <span className={
                                                    parseInt(selectedFactory.deliveryReliability) >= 95 
                                                        ? 'text-success-400' 
                                                        : 'text-warning-400'
                                                }>
                                                    {selectedFactory.deliveryReliability}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Factory Details */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Founded</span>
                                                <span className="text-white text-sm">{selectedFactory.founded}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Employees</span>
                                                <span className="text-white text-sm">{selectedFactory.employeeCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Capacity</span>
                                                <span className="text-white text-sm">{selectedFactory.capacity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Categories</span>
                                                <span className="text-white text-sm">{selectedFactory.categories.join(', ')}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Active Opportunities */}
                                    {selectedFactory.activeOpportunities > 0 && (
                                        <Card className="bg-jade-500/10 border-jade-500/30">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="h-5 w-5 text-jade-400" />
                                                        <span className="text-white font-medium">
                                                            {selectedFactory.activeOpportunities} Active Opportunities
                                                        </span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="bg-jade-500 hover:bg-jade-600"
                                                        onClick={() => {
                                                            setShowProfileDrawer(false);
                                                            router.push(`/${locale}/vault/opportunities`);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </div>
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
                                            onClick={() => toggleFollow(selectedFactory.id)}
                                        >
                                            {followingList.includes(selectedFactory.id) ? (
                                                <>
                                                    <HeartOff className="h-4 w-4 mr-2" />
                                                    Unfollow
                                                </>
                                            ) : (
                                                <>
                                                    <Heart className="h-4 w-4 mr-2" />
                                                    Follow
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-border text-slate-300"
                                            onClick={() => router.push(`/${locale}/messages`)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Message
                                        </Button>
                                        <Button
                                            className="flex-1 bg-jade-500 hover:bg-jade-600"
                                            onClick={() => {
                                                setShowProfileDrawer(false);
                                                router.push(`/${locale}/vault/opportunities`);
                                            }}
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Invest
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Security Brain - Trust Checklist */}
                <AnimatePresence>
                    {showAI && selectedFactory && showProfileDrawer && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 left-6 max-w-sm z-[60]"
                        >
                            <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-0 shadow-2xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🔒
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">Security Brain</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                Trust Checklist for {selectedFactory.name}:
                                            </p>
                                            <ul className="text-white/80 text-sm mt-2 space-y-2">
                                                <li className="flex items-center gap-2">
                                                    {selectedFactory.verified ? (
                                                        <CheckCircle className="h-4 w-4 text-success-400" />
                                                    ) : (
                                                        <AlertTriangle className="h-4 w-4 text-warning-400" />
                                                    )}
                                                    Identity {selectedFactory.verified ? 'Verified' : 'Not Verified'}
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    {selectedFactory.completedCycles >= 5 ? (
                                                        <CheckCircle className="h-4 w-4 text-success-400" />
                                                    ) : (
                                                        <AlertTriangle className="h-4 w-4 text-warning-400" />
                                                    )}
                                                    {selectedFactory.completedCycles} cycles completed
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    {parseFloat(selectedFactory.disputeRate) < 1 ? (
                                                        <CheckCircle className="h-4 w-4 text-success-400" />
                                                    ) : (
                                                        <AlertTriangle className="h-4 w-4 text-warning-400" />
                                                    )}
                                                    {selectedFactory.disputeRate} dispute rate
                                                </li>
                                            </ul>
                                            <p className="text-white/60 text-xs mt-3">
                                                Questions to ask: Production timeline? Quality guarantees?
                                            </p>
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
