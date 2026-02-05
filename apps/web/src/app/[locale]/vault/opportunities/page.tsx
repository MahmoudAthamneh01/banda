'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Sparkles,
    Search,
    Filter,
    Grid3X3,
    List,
    TrendingUp,
    Clock,
    DollarSign,
    Shield,
    Factory,
    Calendar,
    FileText,
    X,
    ChevronRight,
    Star,
    Bookmark,
    BookmarkCheck,
    BarChart3,
    Info,
    ArrowUpRight,
    Check,
    AlertTriangle,
} from 'lucide-react';

// Mock Opportunities Data
const MOCK_OPPORTUNITIES = [
    {
        id: 'opp-1',
        title: 'Hangzhou Tea Factory Expansion',
        description: 'Expand production capacity for premium green tea processing with modern equipment upgrade.',
        factory: {
            id: 'f1',
            name: 'Hangzhou Premier Tea',
            verified: true,
            rating: 4.8,
        },
        expectedYield: { min: 12, max: 15 },
        cycleDuration: '6 months',
        minTicket: 10000,
        maxTicket: 100000,
        totalRaising: 500000,
        raised: 350000,
        risk: 'low',
        category: 'Agriculture',
        region: 'East China',
        deadline: '2024-02-15',
        daysLeft: 5,
        stage: 'open',
        investors: 24,
        milestones: [
            { title: 'Equipment Purchase', status: 'completed' },
            { title: 'Installation', status: 'in_progress' },
            { title: 'Testing', status: 'pending' },
            { title: 'Full Production', status: 'pending' },
        ],
        documents: ['Business Plan', 'Financial Projections', 'Factory Audit'],
    },
    {
        id: 'opp-2',
        title: 'Suzhou Silk Production Line',
        description: 'New automated silk weaving production line with traditional patterns and modern efficiency.',
        factory: {
            id: 'f2',
            name: 'Suzhou Silk Masters',
            verified: true,
            rating: 4.6,
        },
        expectedYield: { min: 18, max: 22 },
        cycleDuration: '12 months',
        minTicket: 25000,
        maxTicket: 250000,
        totalRaising: 1000000,
        raised: 650000,
        risk: 'medium',
        category: 'Textiles',
        region: 'East China',
        deadline: '2024-02-22',
        daysLeft: 12,
        stage: 'open',
        investors: 18,
        milestones: [
            { title: 'Machinery Order', status: 'completed' },
            { title: 'Facility Prep', status: 'in_progress' },
            { title: 'Installation', status: 'pending' },
            { title: 'Production Start', status: 'pending' },
        ],
        documents: ['Business Plan', 'Market Analysis', 'Risk Assessment'],
    },
    {
        id: 'opp-3',
        title: 'Foshan Furniture Workshop',
        description: 'Traditional rosewood furniture crafting workshop expansion with skilled artisan training.',
        factory: {
            id: 'f3',
            name: 'Foshan Woodcraft',
            verified: true,
            rating: 4.9,
        },
        expectedYield: { min: 10, max: 12 },
        cycleDuration: '3 months',
        minTicket: 5000,
        maxTicket: 50000,
        totalRaising: 200000,
        raised: 180000,
        risk: 'low',
        category: 'Crafts',
        region: 'South China',
        deadline: '2024-02-13',
        daysLeft: 3,
        stage: 'closing',
        investors: 42,
        milestones: [
            { title: 'Workshop Setup', status: 'completed' },
            { title: 'Artisan Training', status: 'completed' },
            { title: 'Production', status: 'in_progress' },
            { title: 'Distribution', status: 'pending' },
        ],
        documents: ['Business Plan', 'Artisan Profiles'],
    },
    {
        id: 'opp-4',
        title: 'Dongguan Tech Assembly',
        description: 'High-tech electronics assembly facility for smart home devices and IoT products.',
        factory: {
            id: 'f4',
            name: 'Dongguan Precision',
            verified: true,
            rating: 4.5,
        },
        expectedYield: { min: 20, max: 25 },
        cycleDuration: '9 months',
        minTicket: 50000,
        maxTicket: 500000,
        totalRaising: 2000000,
        raised: 800000,
        risk: 'high',
        category: 'Electronics',
        region: 'South China',
        deadline: '2024-03-01',
        daysLeft: 20,
        stage: 'open',
        investors: 12,
        milestones: [
            { title: 'Facility Lease', status: 'completed' },
            { title: 'Equipment', status: 'pending' },
            { title: 'Certification', status: 'pending' },
            { title: 'Production', status: 'pending' },
        ],
        documents: ['Business Plan', 'Tech Specs', 'Market Analysis', 'Risk Assessment'],
    },
    {
        id: 'opp-5',
        title: 'Ningbo Porcelain Collection',
        description: 'Traditional blue and white porcelain production for export market expansion.',
        factory: {
            id: 'f5',
            name: 'Ningbo Blue & White',
            verified: true,
            rating: 4.7,
        },
        expectedYield: { min: 14, max: 16 },
        cycleDuration: '6 months',
        minTicket: 15000,
        maxTicket: 150000,
        totalRaising: 600000,
        raised: 420000,
        risk: 'medium',
        category: 'Crafts',
        region: 'East China',
        deadline: '2024-02-18',
        daysLeft: 8,
        stage: 'open',
        investors: 28,
        milestones: [
            { title: 'Material Sourcing', status: 'completed' },
            { title: 'Artisan Team', status: 'completed' },
            { title: 'Production', status: 'in_progress' },
            { title: 'Export Setup', status: 'pending' },
        ],
        documents: ['Business Plan', 'Export License'],
    },
    {
        id: 'opp-6',
        title: 'Chengdu Spice Processing',
        description: 'Authentic Sichuan spice processing and packaging facility for domestic and international markets.',
        factory: {
            id: 'f6',
            name: 'Chengdu Flavor House',
            verified: false,
            rating: 4.3,
        },
        expectedYield: { min: 8, max: 10 },
        cycleDuration: '4 months',
        minTicket: 8000,
        maxTicket: 80000,
        totalRaising: 300000,
        raised: 120000,
        risk: 'low',
        category: 'Food',
        region: 'West China',
        deadline: '2024-02-25',
        daysLeft: 15,
        stage: 'open',
        investors: 15,
        milestones: [
            { title: 'Facility Upgrade', status: 'in_progress' },
            { title: 'Certification', status: 'pending' },
            { title: 'Production', status: 'pending' },
            { title: 'Distribution', status: 'pending' },
        ],
        documents: ['Business Plan', 'Food Safety Cert'],
    },
];

const CATEGORIES = ['All', 'Agriculture', 'Textiles', 'Crafts', 'Electronics', 'Food', 'Manufacturing'];
const RISK_LEVELS = ['All', 'Low', 'Medium', 'High'];
const REGIONS = ['All', 'East China', 'South China', 'West China', 'North China'];

function OpportunitiesContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = params.locale as string;

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [riskFilter, setRiskFilter] = useState('All');
    const [regionFilter, setRegionFilter] = useState('All');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [selectedOpportunity, setSelectedOpportunity] = useState<typeof MOCK_OPPORTUNITIES[0] | null>(null);
    const [showDetailDrawer, setShowDetailDrawer] = useState(false);
    const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
    const [compareList, setCompareList] = useState<string[]>([]);
    const [showCompareMode, setShowCompareMode] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [investAmount, setInvestAmount] = useState('');

    // Filter opportunities
    const filteredOpportunities = MOCK_OPPORTUNITIES.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.factory.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || opp.category === categoryFilter;
        const matchesRisk = riskFilter === 'All' || opp.risk.toLowerCase() === riskFilter.toLowerCase();
        const matchesRegion = regionFilter === 'All' || opp.region === regionFilter;
        const matchesMin = !minInvestment || opp.minTicket >= parseInt(minInvestment);
        const matchesMax = !maxInvestment || opp.minTicket <= parseInt(maxInvestment);
        return matchesSearch && matchesCategory && matchesRisk && matchesRegion && matchesMin && matchesMax;
    });

    const toggleSaved = (id: string) => {
        setSavedOpportunities(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleCompare = (id: string) => {
        if (compareList.includes(id)) {
            setCompareList(prev => prev.filter(c => c !== id));
        } else if (compareList.length < 3) {
            setCompareList(prev => [...prev, id]);
        }
    };

    const openDetail = (opp: typeof MOCK_OPPORTUNITIES[0]) => {
        setSelectedOpportunity(opp);
        setShowDetailDrawer(true);
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'bg-success-500/20 text-success-400 border-success-500/30';
            case 'medium': return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const compareOpportunities = MOCK_OPPORTUNITIES.filter(o => compareList.includes(o.id));

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
                            <Sparkles className="h-8 w-8 text-jade-400" />
                            Opportunities Marketplace
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Discover investment opportunities in verified factories
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">
                            {filteredOpportunities.length} opportunities found
                        </span>
                        <div className="flex bg-ink-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-jade-500 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-jade-500 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Filters Bar */}
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
                                        placeholder="Search opportunities or factories..."
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

                                    <select
                                        value={riskFilter}
                                        onChange={(e) => setRiskFilter(e.target.value)}
                                        className="px-3 py-2 bg-ink-700 border border-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    >
                                        {RISK_LEVELS.map(risk => (
                                            <option key={risk} value={risk}>{risk} Risk</option>
                                        ))}
                                    </select>

                                    <select
                                        value={regionFilter}
                                        onChange={(e) => setRegionFilter(e.target.value)}
                                        className="px-3 py-2 bg-ink-700 border border-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    >
                                        {REGIONS.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Min ¥"
                                        value={minInvestment}
                                        onChange={(e) => setMinInvestment(e.target.value)}
                                        className="w-24 px-3 py-2 bg-ink-700 border border-border rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Max ¥"
                                        value={maxInvestment}
                                        onChange={(e) => setMaxInvestment(e.target.value)}
                                        className="w-24 px-3 py-2 bg-ink-700 border border-border rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                    />
                                </div>
                            </div>

                            {/* Compare Bar */}
                            {compareList.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 bg-jade-500/10 border border-jade-500/30 rounded-lg flex items-center justify-between"
                                >
                                    <span className="text-jade-400 text-sm">
                                        {compareList.length} selected for comparison
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-jade-500/30 text-jade-400"
                                            onClick={() => setCompareList([])}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-jade-500 hover:bg-jade-600"
                                            onClick={() => {
                                                setShowCompareMode(true);
                                                setShowAI(true);
                                            }}
                                            disabled={compareList.length < 2}
                                        >
                                            <BarChart3 className="h-4 w-4 mr-1" />
                                            Compare
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Opportunities Grid/List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredOpportunities.length === 0 ? (
                        <Card className="bg-ink-800 border-border">
                            <CardContent className="p-12 text-center">
                                <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No opportunities match your filters</h3>
                                <p className="text-slate-400">Try adjusting your search criteria</p>
                            </CardContent>
                        </Card>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOpportunities.map((opp, index) => (
                                <motion.div
                                    key={opp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Card
                                        className={`bg-ink-800 border-border hover:border-jade-500/30 transition-all duration-300 cursor-pointer h-full ${
                                            compareList.includes(opp.id) ? 'ring-2 ring-jade-500' : ''
                                        }`}
                                        onClick={() => openDetail(opp)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(opp.risk)}`}>
                                                    {opp.risk} risk
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSaved(opp.id);
                                                        }}
                                                        className="p-1.5 hover:bg-ink-700 rounded"
                                                    >
                                                        {savedOpportunities.includes(opp.id) ? (
                                                            <BookmarkCheck className="h-4 w-4 text-jade-400" />
                                                        ) : (
                                                            <Bookmark className="h-4 w-4 text-slate-400" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCompare(opp.id);
                                                        }}
                                                        className={`p-1.5 rounded ${
                                                            compareList.includes(opp.id)
                                                                ? 'bg-jade-500 text-white'
                                                                : 'hover:bg-ink-700 text-slate-400'
                                                        }`}
                                                    >
                                                        <BarChart3 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                                {opp.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-3">
                                                <Factory className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm text-slate-300">{opp.factory.name}</span>
                                                {opp.factory.verified && (
                                                    <Shield className="h-3 w-3 text-jade-400" />
                                                )}
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400">Expected Yield</span>
                                                    <span className="text-jade-400 font-medium">
                                                        {opp.expectedYield.min}-{opp.expectedYield.max}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400">Min Investment</span>
                                                    <span className="text-white">¥{opp.minTicket.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-400">Duration</span>
                                                    <span className="text-white">{opp.cycleDuration}</span>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mb-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-400">
                                                        ¥{opp.raised.toLocaleString()} raised
                                                    </span>
                                                    <span className="text-slate-400">
                                                        {Math.round((opp.raised / opp.totalRaising) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(opp.raised / opp.totalRaising) * 100}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-jade-500 rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <span className={`${opp.daysLeft <= 5 ? 'text-warning-400' : 'text-slate-500'}`}>
                                                    <Clock className="h-3 w-3 inline mr-1" />
                                                    {opp.daysLeft} days left
                                                </span>
                                                <span className="text-slate-500">
                                                    {opp.investors} investors
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-ink-800 border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-ink-900">
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Opportunity</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Factory</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Yield</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Min Ticket</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Risk</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Progress</th>
                                            <th className="p-4 text-right text-sm font-medium text-slate-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOpportunities.map((opp) => (
                                            <tr
                                                key={opp.id}
                                                className="border-b border-border hover:bg-ink-700/50 transition-colors cursor-pointer"
                                                onClick={() => openDetail(opp)}
                                            >
                                                <td className="p-4">
                                                    <p className="text-white font-medium">{opp.title}</p>
                                                    <p className="text-xs text-slate-500">{opp.category}</p>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-300">{opp.factory.name}</span>
                                                        {opp.factory.verified && (
                                                            <Shield className="h-3 w-3 text-jade-400" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-jade-400 font-medium">
                                                        {opp.expectedYield.min}-{opp.expectedYield.max}%
                                                    </span>
                                                </td>
                                                <td className="p-4 text-white">
                                                    ¥{opp.minTicket.toLocaleString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(opp.risk)}`}>
                                                        {opp.risk}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="w-24">
                                                        <div className="h-2 bg-ink-600 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-jade-500 rounded-full"
                                                                style={{ width: `${(opp.raised / opp.totalRaising) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {Math.round((opp.raised / opp.totalRaising) * 100)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button size="sm" className="bg-jade-500 hover:bg-jade-600">
                                                        Invest
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </motion.div>

                {/* Opportunity Detail Drawer */}
                <AnimatePresence>
                    {showDetailDrawer && selectedOpportunity && (
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
                                <div className="sticky top-0 bg-ink-900 border-b border-border p-4 z-10">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(selectedOpportunity.risk)}`}>
                                                {selectedOpportunity.risk} risk
                                            </span>
                                            <h2 className="text-xl font-bold text-white mt-2">
                                                {selectedOpportunity.title}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => setShowDetailDrawer(false)}
                                            className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-6">
                                    {/* Overview */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-slate-300 text-sm">
                                                {selectedOpportunity.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <p className="text-xs text-slate-500">Expected Yield</p>
                                                    <p className="text-lg font-bold text-jade-400">
                                                        {selectedOpportunity.expectedYield.min}-{selectedOpportunity.expectedYield.max}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Duration</p>
                                                    <p className="text-lg font-bold text-white">
                                                        {selectedOpportunity.cycleDuration}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Min Investment</p>
                                                    <p className="text-lg font-bold text-white">
                                                        ¥{selectedOpportunity.minTicket.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Max Investment</p>
                                                    <p className="text-lg font-bold text-white">
                                                        ¥{selectedOpportunity.maxTicket.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Factory */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Factory</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-jade-500/20 rounded-lg flex items-center justify-center">
                                                    <Factory className="h-6 w-6 text-jade-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-medium">
                                                            {selectedOpportunity.factory.name}
                                                        </span>
                                                        {selectedOpportunity.factory.verified && (
                                                            <Shield className="h-4 w-4 text-jade-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm text-slate-400">
                                                            {selectedOpportunity.factory.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 border-border text-slate-300"
                                                onClick={() => router.push(`/${locale}/vault/factories`)}
                                            >
                                                View Factory Profile
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Timeline Milestones */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Timeline</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-3">
                                                {selectedOpportunity.milestones.map((milestone, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                            milestone.status === 'completed' ? 'bg-success-500' :
                                                            milestone.status === 'in_progress' ? 'bg-warning-500' :
                                                            'bg-ink-600'
                                                        }`}>
                                                            {milestone.status === 'completed' ? (
                                                                <Check className="h-3 w-3 text-white" />
                                                            ) : (
                                                                <span className="text-xs text-white">{i + 1}</span>
                                                            )}
                                                        </div>
                                                        <span className={
                                                            milestone.status === 'completed' ? 'text-success-400' :
                                                            milestone.status === 'in_progress' ? 'text-warning-400' :
                                                            'text-slate-500'
                                                        }>
                                                            {milestone.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Documents */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-2">
                                            {selectedOpportunity.documents.map((doc, i) => (
                                                <button
                                                    key={i}
                                                    className="w-full flex items-center gap-3 p-3 bg-ink-700 rounded-lg hover:bg-ink-600 transition-colors"
                                                >
                                                    <FileText className="h-4 w-4 text-slate-400" />
                                                    <span className="text-slate-300 text-sm">{doc}</span>
                                                    <ChevronRight className="h-4 w-4 text-slate-500 ml-auto" />
                                                </button>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Invest CTA */}
                                <div className="sticky bottom-0 bg-ink-900 border-t border-border p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-slate-400 text-sm">
                                            {selectedOpportunity.daysLeft} days left
                                        </span>
                                        <span className="text-slate-400 text-sm">
                                            {selectedOpportunity.investors} investors
                                        </span>
                                    </div>
                                    <Button
                                        className="w-full bg-jade-500 hover:bg-jade-600"
                                        onClick={() => setShowInvestModal(true)}
                                    >
                                        <ArrowUpRight className="h-4 w-4 mr-2" />
                                        Invest Now
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Compare Mode Modal */}
                <AnimatePresence>
                    {showCompareMode && compareOpportunities.length >= 2 && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCompareMode(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-4 md:inset-10 bg-ink-900 border border-border rounded-2xl z-50 overflow-y-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-white">Compare Opportunities</h2>
                                        <button
                                            onClick={() => setShowCompareMode(false)}
                                            className="p-2 hover:bg-ink-800 rounded-lg text-slate-400"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="p-4 text-left text-sm font-medium text-slate-400">Criteria</th>
                                                    {compareOpportunities.map(opp => (
                                                        <th key={opp.id} className="p-4 text-left text-sm font-medium text-white">
                                                            {opp.title}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-border">
                                                    <td className="p-4 text-slate-400">Factory</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4 text-white">{opp.factory.name}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="p-4 text-slate-400">Expected Yield</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4 text-jade-400 font-medium">
                                                            {opp.expectedYield.min}-{opp.expectedYield.max}%
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="p-4 text-slate-400">Risk Level</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4">
                                                            <span className={`px-2 py-1 rounded text-xs ${getRiskColor(opp.risk)}`}>
                                                                {opp.risk}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="p-4 text-slate-400">Duration</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4 text-white">{opp.cycleDuration}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="p-4 text-slate-400">Min Investment</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4 text-white">¥{opp.minTicket.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="p-4 text-slate-400">Progress</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4 text-white">
                                                            {Math.round((opp.raised / opp.totalRaising) * 100)}%
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    <td className="p-4 text-slate-400">Category</td>
                                                    {compareOpportunities.map(opp => (
                                                        <td key={opp.id} className="p-4 text-white">{opp.category}</td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Invest Modal */}
                <AnimatePresence>
                    {showInvestModal && selectedOpportunity && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowInvestModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 flex items-center justify-center z-[60] p-4"
                            >
                                <Card className="bg-ink-900 border-border w-full max-w-md">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white">Invest</CardTitle>
                                            <button
                                                onClick={() => setShowInvestModal(false)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-slate-300 text-sm">{selectedOpportunity.title}</p>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Investment Amount (¥)
                                            </label>
                                            <input
                                                type="number"
                                                value={investAmount}
                                                onChange={(e) => setInvestAmount(e.target.value)}
                                                placeholder={`Min ¥${selectedOpportunity.minTicket.toLocaleString()}`}
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-jade-500"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Range: ¥{selectedOpportunity.minTicket.toLocaleString()} - ¥{selectedOpportunity.maxTicket.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-jade-500/10 border border-jade-500/30 rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Expected Return</span>
                                                <span className="text-jade-400 font-medium">
                                                    {selectedOpportunity.expectedYield.min}-{selectedOpportunity.expectedYield.max}%
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-jade-500 hover:bg-jade-600"
                                            disabled={!investAmount || parseInt(investAmount) < selectedOpportunity.minTicket}
                                            onClick={() => {
                                                setShowInvestModal(false);
                                                setShowDetailDrawer(false);
                                                router.push(`/${locale}/vault/transactions`);
                                            }}
                                        >
                                            Confirm Investment
                                        </Button>

                                        <p className="text-xs text-center text-slate-500">
                                            By investing, you agree to the terms and conditions
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Panda Consultant / Finance Brain */}
                <AnimatePresence>
                    {showAI && showCompareMode && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-6 right-6 max-w-sm z-[70]"
                        >
                            <Card className="bg-gradient-to-br from-jade-600 to-emerald-600 border-0 shadow-2xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🧠
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">Finance Brain</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                Comparing {compareOpportunities.length} opportunities:
                                            </p>
                                            <ul className="text-white/80 text-sm mt-2 space-y-1">
                                                <li className="flex items-start gap-2">
                                                    <Info className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                                                    Higher yield often means higher risk
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Info className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                                                    Consider diversifying across categories
                                                </li>
                                                {compareOpportunities.some(o => o.risk === 'high') && (
                                                    <li className="flex items-start gap-2">
                                                        <AlertTriangle className="h-4 w-4 text-red-300 mt-0.5 flex-shrink-0" />
                                                        High-risk option detected
                                                    </li>
                                                )}
                                            </ul>
                                            <Button
                                                size="sm"
                                                className="mt-3 bg-white text-jade-700 hover:bg-white/90"
                                                onClick={() => setShowAI(false)}
                                            >
                                                Thanks!
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

function LoadingState() {
    return (
        <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-slate-400">Loading opportunities...</div>
        </div>
    );
}

export default function OpportunitiesPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <OpportunitiesContent />
        </Suspense>
    );
}
