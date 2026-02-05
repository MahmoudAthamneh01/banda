'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { Card } from '@bandachao/ui';

interface LiquidationBox {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  stock: number;
  sold: number;
  endsAt: number; // timestamp
  image?: string;
  category: string;
}

interface LiquidationBoxesProps {
  boxes?: LiquidationBox[];
  loading?: boolean;
}

/**
 * LiquidationBoxes - Clearance deals with countdown timers
 * 
 * Shows limited-time liquidation offers with urgency indicators
 */
export default function LiquidationBoxes({ boxes: initialBoxes, loading = false }: LiquidationBoxesProps) {
  const [boxes, setBoxes] = useState<LiquidationBox[]>(initialBoxes || []);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock data
  useEffect(() => {
    if (!initialBoxes) {
      const mockBoxes: LiquidationBox[] = Array.from({ length: 6 }, (_, i) => ({
        id: `box-${i + 1}`,
        title: `Clearance Box ${i + 1} - ${['Electronics', 'Fashion', 'Home', 'Sports'][i % 4]}`,
        originalPrice: Math.floor(Math.random() * 500 + 100),
        discountedPrice: Math.floor(Math.random() * 100 + 50),
        discount: Math.floor(Math.random() * 40 + 40),
        stock: Math.floor(Math.random() * 50 + 10),
        sold: Math.floor(Math.random() * 200 + 50),
        endsAt: Date.now() + Math.floor(Math.random() * 86400000 + 3600000), // 1-24 hours
        category: ['Electronics', 'Fashion', 'Home', 'Sports'][i % 4],
      }));
      setBoxes(mockBoxes);
    }
  }, [initialBoxes]);

  const formatTimeLeft = (endsAt: number) => {
    const diff = endsAt - currentTime;
    if (diff <= 0) return 'ENDED';

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getStockStatus = (stock: number, sold: number) => {
    const total = stock + sold;
    const percentage = (sold / total) * 100;

    if (percentage >= 90) return { color: 'text-danger-500', label: 'Almost Gone!' };
    if (percentage >= 70) return { color: 'text-warn-500', label: 'Selling Fast' };
    return { color: 'text-jade-500', label: 'In Stock' };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-ink-900 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingDown className="text-danger-500" size={28} />
            Liquidation Boxes
          </h2>
          <p className="text-slate-400 mt-1">Limited time clearance deals</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={16} />
          Updated every minute
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes.map((box, index) => {
          const timeLeft = formatTimeLeft(box.endsAt);
          const isEnding = box.endsAt - currentTime < 3600000; // Less than 1 hour
          const stockStatus = getStockStatus(box.stock, box.sold);

          return (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-glow-primary-sm transition-all cursor-pointer h-full">
                {/* Image Placeholder */}
                <div className="relative h-40 bg-ink-850 flex items-center justify-center">
                  <Package size={48} className="text-slate-600" />
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-danger-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    -{box.discount}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="font-semibold text-slate-200 line-clamp-2 group-hover:text-panda-400 transition-colors">
                    {box.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-jade-500">
                      ${box.discountedPrice}
                    </span>
                    <span className="text-sm text-slate-500 line-through">
                      ${box.originalPrice}
                    </span>
                  </div>

                  {/* Stock Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={stockStatus.color}>{stockStatus.label}</span>
                      <span className="text-slate-400">
                        {box.stock} left of {box.stock + box.sold}
                      </span>
                    </div>
                    <div className="h-2 bg-ink-850 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(box.sold / (box.stock + box.sold)) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-jade-500 to-jade-600"
                      />
                    </div>
                  </div>

                  {/* Countdown */}
                  <div
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg ${
                      isEnding ? 'bg-danger-500/20 text-danger-500' : 'bg-ink-850 text-slate-300'
                    }`}
                  >
                    <Clock size={16} className={isEnding ? 'animate-pulse' : ''} />
                    <span className="font-mono font-semibold">{timeLeft}</span>
                  </div>

                  {/* CTA */}
                  <button className="w-full py-2 px-4 bg-panda-500 hover:bg-panda-600 text-white rounded-xl font-medium transition-colors">
                    Grab This Deal
                  </button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-warn-500/10 border border-warn-500/30 rounded-xl">
        <AlertCircle className="text-warn-500 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm text-slate-300">
            <strong>Note:</strong> Liquidation boxes contain overstock or end-of-line items. All sales
            are final. Limited quantities available.
          </p>
        </div>
      </div>
    </div>
  );
}
