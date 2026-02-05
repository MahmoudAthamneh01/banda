'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@radix-ui/react-dialog';
import { Button } from '@bandachao/ui';
import { Input } from '@bandachao/ui';
import { ApiClient } from '@/lib/api/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateRFQProps {
    productName: string;
    sourceSku: string;
    sourceUrl?: string; // Made optional
}

export function CreateRFQDialog({ productName, sourceSku, sourceUrl }: CreateRFQProps) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(100);
    const [targetPrice, setTargetPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await ApiClient.post('/rfq/create', {
                productName,
                sourceSku,
                sourceUrl: sourceUrl || 'https://mock.alibaba', // Fallback for demo
                quantity: Number(quantity),
                targetPrice: targetPrice ? Number(targetPrice) : undefined
            });
            setOpen(false);
            router.push('/en/cockpit/rfq');
        } catch (error) {
            console.error(error);
            alert('Failed to submit RFQ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Generate RFQ
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <DialogTitle>Request for Quote</DialogTitle>
                    <DialogDescription>
                        Turn your interest in <span className="font-bold">{productName}</span> into a formal request.
                    </DialogDescription>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="qty" className="text-sm font-medium">Desired Quantity</label>
                        <Input
                            id="qty"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.valueAsNumber)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="target" className="text-sm font-medium">Target Price (CNY) - Optional</label>
                        <Input
                            id="target"
                            type="number"
                            placeholder="e.g. 120.00"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Submit RFQ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
