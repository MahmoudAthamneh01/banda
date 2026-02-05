'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@bandachao/ui';
import {
    Package,
    Plus,
    Search,
    Filter,
    Grid,
    List,
    MoreVertical,
    Edit,
    Copy,
    Archive,
    Trash2,
    Upload,
    Download,
    ChevronDown,
    X,
    Image as ImageIcon,
    Sparkles,
    Check,
    Tag,
    Languages,
} from 'lucide-react';

// Mock Products Data
const MOCK_PRODUCTS = [
    {
        id: 'prod-001',
        sku: 'BC-TEA-001',
        title: 'Premium Ceramic Tea Set',
        description: 'Handcrafted ceramic tea set with traditional Chinese patterns',
        price: 299,
        comparePrice: 399,
        stock: 45,
        status: 'active',
        category: 'Home & Living',
        images: ['/placeholder.png'],
        variants: 2,
        lastUpdated: '2 hours ago',
    },
    {
        id: 'prod-002',
        sku: 'BC-SLK-002',
        title: 'Silk Scarf Collection',
        description: 'Luxury silk scarves with hand-painted designs',
        price: 89,
        comparePrice: null,
        stock: 120,
        status: 'active',
        category: 'Fashion',
        images: ['/placeholder.png'],
        variants: 5,
        lastUpdated: '1 day ago',
    },
    {
        id: 'prod-003',
        sku: 'BC-JAD-003',
        title: 'Jade Bracelet Set',
        description: 'Authentic jade bracelets with gold accents',
        price: 599,
        comparePrice: 799,
        stock: 3,
        status: 'active',
        category: 'Jewelry',
        images: ['/placeholder.png'],
        variants: 3,
        lastUpdated: '3 days ago',
    },
    {
        id: 'prod-004',
        sku: 'BC-BAM-004',
        title: 'Bamboo Cutting Board',
        description: 'Eco-friendly bamboo cutting board set',
        price: 49,
        comparePrice: null,
        stock: 0,
        status: 'draft',
        category: 'Kitchen',
        images: ['/placeholder.png'],
        variants: 1,
        lastUpdated: '1 week ago',
    },
    {
        id: 'prod-005',
        sku: 'BC-POR-005',
        title: 'Blue & White Porcelain Vase',
        description: 'Traditional Chinese porcelain vase',
        price: 450,
        comparePrice: 550,
        stock: 18,
        status: 'archived',
        category: 'Home & Living',
        images: ['/placeholder.png'],
        variants: 1,
        lastUpdated: '2 weeks ago',
    },
];

const CATEGORIES = ['All', 'Home & Living', 'Fashion', 'Jewelry', 'Kitchen', 'Electronics'];
const STATUS_FILTERS = ['All', 'Active', 'Draft', 'Archived'];

export default function ProductsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingProduct, setEditingProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);
    const [showAI, setShowAI] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Filter products
    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || product.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const toggleProductSelection = (id: string) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id));
        }
    };

    const openEditor = (product?: typeof MOCK_PRODUCTS[0]) => {
        setEditingProduct(product || null);
        setShowEditor(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-success-500/20 text-success-400';
            case 'draft': return 'bg-warning-500/20 text-warning-400';
            case 'archived': return 'bg-slate-500/20 text-slate-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getStockColor = (stock: number) => {
        if (stock === 0) return 'text-red-400';
        if (stock < 10) return 'text-warning-400';
        return 'text-success-400';
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
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Products</h1>
                        <p className="text-slate-400 mt-1">
                            Manage your product catalog ({filteredProducts.length} products)
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:bg-surface"
                            onClick={() => router.push(`/${locale}/cockpit/import`)}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Import
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-slate-300 hover:bg-surface"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button
                            className="bg-panda-500 hover:bg-panda-600 text-white"
                            onClick={() => openEditor()}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </motion.div>

                {/* Filters & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-ink-800 border-border">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products by name or SKU..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-ink-700 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                    />
                                </div>

                                {/* Filter Toggles */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`border-border ${showFilters ? 'bg-panda-500/20 text-panda-400' : 'text-slate-300'}`}
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filters
                                        {(statusFilter !== 'All' || categoryFilter !== 'All') && (
                                            <span className="ml-2 w-2 h-2 bg-panda-500 rounded-full" />
                                        )}
                                    </Button>

                                    {/* View Toggle */}
                                    <div className="flex items-center bg-ink-700 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`p-2 rounded ${viewMode === 'table' ? 'bg-panda-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-panda-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <Grid className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Filters */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 mt-4 border-t border-border flex flex-wrap gap-4">
                                            {/* Status Filter */}
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Status</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {STATUS_FILTERS.map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => setStatusFilter(status)}
                                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
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

                                            {/* Category Filter */}
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Category</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {CATEGORIES.map(category => (
                                                        <button
                                                            key={category}
                                                            onClick={() => setCategoryFilter(category)}
                                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                                categoryFilter === category
                                                                    ? 'bg-panda-500 text-white'
                                                                    : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
                                                            }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedProducts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Card className="bg-panda-500/10 border-panda-500/30">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-white font-medium">
                                                {selectedProducts.length} selected
                                            </span>
                                            <button
                                                onClick={() => setSelectedProducts([])}
                                                className="text-sm text-panda-400 hover:text-panda-300"
                                            >
                                                Clear selection
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" className="border-border text-slate-300">
                                                Update Price
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-border text-slate-300">
                                                Update Stock
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-border text-slate-300">
                                                <Archive className="h-4 w-4 mr-2" />
                                                Archive
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-border text-slate-300">
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Table View */}
                {viewMode === 'table' ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-ink-800 border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-ink-900">
                                            <th className="p-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                                    onChange={selectAll}
                                                    className="rounded border-border bg-ink-700"
                                                />
                                            </th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Product</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">SKU</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Price</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Stock</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Status</th>
                                            <th className="p-4 text-left text-sm font-medium text-slate-400">Updated</th>
                                            <th className="p-4 text-right text-sm font-medium text-slate-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-12 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Package className="h-12 w-12 text-slate-600 mb-4" />
                                                        <h3 className="text-lg font-medium text-white mb-2">
                                                            No products found
                                                        </h3>
                                                        <p className="text-slate-400 mb-4">
                                                            {searchQuery ? 'Try a different search term' : 'Create your first product to get started'}
                                                        </p>
                                                        <Button
                                                            className="bg-panda-500 hover:bg-panda-600"
                                                            onClick={() => openEditor()}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Product
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((product, index) => (
                                                <motion.tr
                                                    key={product.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="border-b border-border hover:bg-ink-700/50 transition-colors group"
                                                >
                                                    <td className="p-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            onChange={() => toggleProductSelection(product.id)}
                                                            className="rounded border-border bg-ink-700"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-ink-700 rounded-lg flex items-center justify-center">
                                                                <ImageIcon className="h-6 w-6 text-slate-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white hover:text-panda-400 cursor-pointer" onClick={() => openEditor(product)}>
                                                                    {product.title}
                                                                </p>
                                                                <p className="text-sm text-slate-400">{product.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-slate-300 font-mono text-sm">
                                                        {product.sku}
                                                    </td>
                                                    <td className="p-4">
                                                        <div>
                                                            <span className="text-white font-medium">¥{product.price}</span>
                                                            {product.comparePrice && (
                                                                <span className="text-slate-500 line-through text-sm ml-2">
                                                                    ¥{product.comparePrice}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`font-medium ${getStockColor(product.stock)}`}>
                                                            {product.stock} units
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                                            {product.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-400 text-sm">
                                                        {product.lastUpdated}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openEditor(product)}
                                                                className="p-2 hover:bg-ink-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button className="p-2 hover:bg-ink-600 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                                <Copy className="h-4 w-4" />
                                                            </button>
                                                            <button className="p-2 hover:bg-ink-600 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                                                <Archive className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    /* Grid View */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="bg-ink-800 border-border hover:border-panda-500/50 transition-colors group cursor-pointer" onClick={() => openEditor(product)}>
                                    <CardContent className="p-4">
                                        <div className="aspect-square bg-ink-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                                            <ImageIcon className="h-12 w-12 text-slate-600" />
                                            <div className="absolute top-2 right-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                                    {product.status}
                                                </span>
                                            </div>
                                            <div className="absolute top-2 left-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleProductSelection(product.id);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded border-border bg-ink-700"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-white group-hover:text-panda-400 transition-colors truncate">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-3">{product.sku}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-white">¥{product.price}</span>
                                            <span className={`text-sm ${getStockColor(product.stock)}`}>
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Product Editor Drawer */}
                <AnimatePresence>
                    {showEditor && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowEditor(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-ink-900 border-l border-border z-50 overflow-y-auto"
                            >
                                {/* Drawer Header */}
                                <div className="sticky top-0 bg-ink-900 border-b border-border p-4 flex items-center justify-between z-10">
                                    <h2 className="text-xl font-bold text-white">
                                        {editingProduct ? 'Edit Product' : 'New Product'}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAI(true)}
                                            className="border-panda-500/50 text-panda-400 hover:bg-panda-500/20"
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            AI Assist
                                        </Button>
                                        <button
                                            onClick={() => setShowEditor(false)}
                                            className="p-2 hover:bg-ink-800 rounded-lg text-slate-400 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Drawer Content */}
                                <div className="p-6 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Product Title
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={editingProduct?.title || ''}
                                            placeholder="Enter product title"
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            rows={4}
                                            defaultValue={editingProduct?.description || ''}
                                            placeholder="Describe your product..."
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500 resize-none"
                                        />
                                    </div>

                                    {/* Images */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Images
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="aspect-square bg-ink-800 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-panda-500 transition-colors">
                                                <Upload className="h-6 w-6 text-slate-500 mb-1" />
                                                <span className="text-xs text-slate-500">Upload</span>
                                            </div>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="aspect-square bg-ink-800 border border-border rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-slate-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Price (¥)
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue={editingProduct?.price || ''}
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Compare at Price (¥)
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue={editingProduct?.comparePrice || ''}
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Inventory */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                SKU
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue={editingProduct?.sku || ''}
                                                placeholder="BC-XXX-000"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Stock Quantity
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue={editingProduct?.stock || ''}
                                                placeholder="0"
                                                className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            defaultValue={editingProduct?.category || ''}
                                            className="w-full px-4 py-3 bg-ink-800 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                        >
                                            <option value="">Select category</option>
                                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Status
                                        </label>
                                        <div className="flex gap-3">
                                            {['active', 'draft'].map(status => (
                                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={status}
                                                        defaultChecked={editingProduct?.status === status || (!editingProduct && status === 'draft')}
                                                        className="text-panda-500 focus:ring-panda-500"
                                                    />
                                                    <span className="text-slate-300 capitalize">{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Drawer Footer */}
                                <div className="sticky bottom-0 bg-ink-900 border-t border-border p-4 flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowEditor(false)}
                                        className="border-border text-slate-300"
                                    >
                                        Cancel
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            className="border-border text-slate-300"
                                        >
                                            Save as Draft
                                        </Button>
                                        <Button className="bg-panda-500 hover:bg-panda-600 text-white">
                                            <Check className="h-4 w-4 mr-2" />
                                            {editingProduct ? 'Update Product' : 'Publish Product'}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* AI Host Panda Assistant */}
                <AnimatePresence>
                    {showAI && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-6 right-6 max-w-sm z-[60]"
                        >
                            <Card className="bg-gradient-to-br from-jade-600 to-jade-700 border-0 shadow-xl">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            🐼
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white">Host Panda</h4>
                                                <button
                                                    onClick={() => setShowAI(false)}
                                                    className="text-white/60 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">
                                                I can help improve your listing! What would you like me to do?
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-white text-jade-700 hover:bg-white/90"
                                                >
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    Improve Description
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/30 text-white hover:bg-white/10"
                                                >
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    Generate Tags
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-white/30 text-white hover:bg-white/10"
                                                >
                                                    <Languages className="h-3 w-3 mr-1" />
                                                    Translate
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
