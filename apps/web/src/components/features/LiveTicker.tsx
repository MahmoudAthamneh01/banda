'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ShoppingBag, Factory, DollarSign } from 'lucide-react';

interface TickerItem {
  id: string;
  type: 'order' | 'factory' | 'deal';
  message: string;
  timestamp: number;
  icon: 'order' | 'factory' | 'deal';
  color: string;
}

interface LiveTickerProps {
  items?: TickerItem[];
  autoScroll?: boolean;
  updateInterval?: number; // ms
}

/**
 * LiveTicker - Real-time activity feed
 * 
 * Shows live updates of orders, new factories, and deals
 */
export default function LiveTicker({
  items: initialItems,
  autoScroll = true,
  updateInterval = 5000,
}: LiveTickerProps) {
  const [items, setItems] = useState<TickerItem[]>(initialItems || []);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock data generator
  const generateMockItem = (): TickerItem => {
    const types: Array<'order' | 'factory' | 'deal'> = ['order', 'factory', 'deal'];
    const type = types[Math.floor(Math.random() * types.length)];

    const messages = {
      order: [
        'New order: 500 units of Electronics from Shenzhen Factory',
        'Order placed: Fashion items worth $5,000 from Guangzhou',
        'Bulk order: 1,000 pieces ordered from verified seller',
      ],
      factory: [
        'New factory joined: Premium Electronics Ltd.',
        'Factory verified: Quality Fashion Manufacturer',
        'Top-rated factory: Green Energy Solutions',
      ],
      deal: [
        'Flash deal: 30% off on LED Lights - Limited time!',
        'Clearance: 50% discount on Winter Collection',
        'Special offer: Buy 100 get 20 free - Today only!',
      ],
    };

    const colors = {
      order: 'text-panda-500',
      factory: 'text-jade-500',
      deal: 'text-silk-500',
    };

    return {
      id: `ticker-${Date.now()}-${Math.random()}`,
      type,
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      timestamp: Date.now(),
      icon: type,
      color: colors[type],
    };
  };

  // Auto-update items
  useEffect(() => {
    if (!autoScroll || isPaused) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        const newItem = generateMockItem();
        const updated = [newItem, ...prev].slice(0, 50); // Keep last 50 items
        return updated;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [autoScroll, isPaused, updateInterval]);

  // Initialize with mock data if empty
  useEffect(() => {
    if (items.length === 0) {
      setItems(Array.from({ length: 5 }, () => generateMockItem()));
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={16} />;
      case 'factory':
        return <Factory size={16} />;
      case 'deal':
        return <DollarSign size={16} />;
      default:
        return <TrendingUp size={16} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-ink-900 border border-ink-800 rounded-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-ink-800 bg-ink-850">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-jade-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-200">Live Activity</h3>
        </div>
        <div className="text-xs text-slate-400">
          {isPaused ? 'Paused' : 'Live'}
        </div>
      </div>

      {/* Ticker Items */}
      <div className="max-h-80 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 px-4 py-3 border-b border-ink-800/50 hover:bg-ink-850 transition-colors ${
                index === 0 ? 'bg-ink-850/30' : ''
              }`}
            >
              {/* Icon */}
              <div className={`${item.color} mt-0.5`}>
                {getIcon(item.icon)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {/* Type Badge */}
              <div className={`text-xs px-2 py-0.5 rounded ${item.color} bg-current/10`}>
                {item.type}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-ink-800 bg-ink-850 text-center">
        <p className="text-xs text-slate-400">
          Hover to pause • {items.length} recent activities
        </p>
      </div>
    </div>
  );
}
