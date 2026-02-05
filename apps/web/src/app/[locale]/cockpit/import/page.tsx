'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, Input, Button } from '@bandachao/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle, Package, ArrowRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';
import { CreateRFQDialog } from '@/components/rfq/CreateRFQDialog';

export default function ImportPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleImport = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            await new Promise(r => setTimeout(r, 2000));
            const data = await ApiClient.post('/products/import', { url });
            setResult(data);
        } catch (err) {
            setError('Failed to import product. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-10 min-h-screen">
            <Header title="Import Product" />

            <div className="max-w-3xl mx-auto px-6 mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Paste an Alibaba URL</h2>
                    <p className="text-slate-500">Our Sovereign Engine will analyze the product, calculate landed costs, and generate a SKU.</p>
                </motion.div>

                <Card className="p-2 flex items-center gap-2 border-slate-200 shadow-lg bg-white relative overflow-hidden">
                    <div className="pl-3 text-slate-400">
                        <Search size={20} />
                    </div>
                    <Input
                        placeholder="https://www.alibaba.com/product-detail/..."
                        className="border-none shadow-none focus-visible:ring-0 text-lg h-12 bg-transparent"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button
                        size="lg"
                        onClick={handleImport}
                        disabled={loading || !url}
                        className="bg-slate-900 text-white hover:bg-slate-800 px-8"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
                    </Button>

                    {loading && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                        />
                    )}
                </Card>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </motion.div>
                )}

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <Card className="overflow-hidden border-0 shadow-xl bg-white">
                                <div className="grid md:grid-cols-2">
                                    <div className="bg-slate-100 p-8 flex items-center justify-center">
                                        <Package size={80} className="text-slate-300" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{result.name}</h3>
                                                <p className="text-sm text-slate-500 mt-1">Sovereign SKU: <span className="font-mono text-emerald-600 font-bold">{result.sku}</span></p>
                                            </div>
                                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                                Verified Supplier
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <div className="text-xs text-slate-500">Unit Cost</div>
                                                <div className="text-lg font-bold text-slate-900">¥{result.price}</div>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <div className="text-xs text-slate-500">MOQ</div>
                                                <div className="text-lg font-bold text-slate-900">{result.moq} units</div>
                                            </div>
                                        </div>

                                        <CreateRFQDialog
                                            productName={result.name}
                                            sourceSku={result.sku}
                                            sourceUrl={url}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
