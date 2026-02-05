'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@bandachao/ui';

interface Factory {
  id: string;
  rank: number;
  name: string;
  nameZh: string;
  trustScore: number;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  verified: boolean;
  category: string;
  badge?: 'gold' | 'silver' | 'bronze';
}

interface Top10BoardProps {
  factories?: Factory[];
  loading?: boolean;
}

/**
 * Top10Board - Shows top 10 performing factories
 * 
 * Used on Square homepage to showcase trusted manufacturers
 */
export default function Top10Board({ factories: initialFactories, loading = false }: Top10BoardProps) {
  const [factories, setFactories] = useState<Factory[]>(initialFactories || []);

  // Mock data for development
  useEffect(() => {
    if (!initialFactories) {
      const mockFactories: Factory[] = Array.from({ length: 10 }, (_, i) => ({
        id: `factory-${i + 1}`,
        rank: i + 1,
        name: `Factory ${i + 1}`,
        nameZh: `工厂 ${i + 1}`,
        trustScore: Math.floor(Math.random() * 20 + 80),
        totalProducts: Math.floor(Math.random() * 500 + 100),
        totalOrders: Math.floor(Math.random() * 10000 + 1000),
        rating: +(Math.random() * 1 + 4).toFixed(1),
        verified: Math.random() > 0.3,
        category: ['Electronics', 'Fashion', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
        badge: i < 3 ? (['gold', 'silver', 'bronze'] as const)[i] : undefined,
      }));
      setFactories(mockFactories);
    }
  }, [initialFactories]);

  const getBadgeColor = (badge?: 'gold' | 'silver' | 'bronze') => {
    if (!badge) return '';
    return {
      gold: 'bg-silk-500 text-ink-950',
      silver: 'bg-slate-300 text-ink-950',
      bronze: 'bg-amber-600 text-white',
    }[badge];
  };

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-silk-500 font-bold';
    if (rank <= 5) return 'text-panda-500 font-semibold';
    return 'text-slate-400';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-jade-500" size={24} />
            Top 10 Factories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-ink-850 rounded-xl animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-jade-500" size={24} />
          Top 10 Factories
        </CardTitle>
        <p className="text-sm text-slate-400 mt-2">
          Most trusted manufacturers this month
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {factories.map((factory, index) => (
            <motion.div
              key={factory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-ink-850 hover:bg-ink-800 transition-colors cursor-pointer group"
            >
              {/* Rank */}
              <div className={`text-2xl w-8 text-center ${getRankColor(factory.rank)}`}>
                {factory.rank}
              </div>

              {/* Badge */}
              {factory.badge && (
                <div className={`px-2 py-1 rounded text-xs font-bold ${getBadgeColor(factory.badge)}`}>
                  {factory.badge.toUpperCase()}
                </div>
              )}

              {/* Factory Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-200 truncate group-hover:text-panda-400 transition-colors">
                    {factory.name}
                  </h4>
                  {factory.verified && (
                    <span className="text-jade-500 text-xs">✓ Verified</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{factory.category}</p>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-slate-300">
                  <Package size={14} />
                  <span>{factory.totalProducts}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Users size={14} />
                  <span>{factory.totalOrders.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-silk-500">
                  <Star size={14} fill="currentColor" />
                  <span>{factory.rating}</span>
                </div>
              </div>

              {/* Trust Score */}
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-jade-500">
                  {factory.trustScore}
                </div>
                <div className="text-xs text-slate-400">Trust</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-4 text-center">
          <button className="text-panda-500 hover:text-panda-400 text-sm font-medium transition-colors">
            View All Factories →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
