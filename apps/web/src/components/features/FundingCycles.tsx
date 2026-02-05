'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Calendar, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@bandachao/ui';

interface FundingCycle {
  id: string;
  name: string;
  factory: string;
  targetAmount: number;
  currentAmount: number;
  investors: number;
  roi: number; // percentage
  duration: number; // days
  startDate: Date;
  endDate: Date;
  status: 'active' | 'funding' | 'completed';
  minInvestment: number;
}

interface FundingCyclesProps {
  cycles?: FundingCycle[];
  loading?: boolean;
}

/**
 * FundingCycles - Investment cycles display
 * 
 * Shows active funding cycles with progress bars and ROI info
 */
export default function FundingCycles({ cycles: initialCycles, loading = false }: FundingCyclesProps) {
  const [cycles, setCycles] = useState<FundingCycle[]>(initialCycles || []);

  // Mock data
  useEffect(() => {
    if (!initialCycles) {
      const mockCycles: FundingCycle[] = Array.from({ length: 6 }, (_, i) => {
        const targetAmount = Math.floor(Math.random() * 500000 + 100000);
        const currentAmount = Math.floor(Math.random() * targetAmount * 0.8 + targetAmount * 0.2);
        const startDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const duration = Math.floor(Math.random() * 60 + 30);

        return {
          id: `cycle-${i + 1}`,
          name: `Production Cycle ${i + 1}`,
          factory: ['Premium Electronics', 'Fashion Hub', 'Green Energy', 'Smart Home'][i % 4],
          targetAmount,
          currentAmount,
          investors: Math.floor(Math.random() * 200 + 50),
          roi: Math.floor(Math.random() * 15 + 10),
          duration,
          startDate,
          endDate: new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000),
          status: ['active', 'funding'][Math.floor(Math.random() * 2)] as 'active' | 'funding',
          minInvestment: Math.floor(Math.random() * 5000 + 1000),
        };
      });
      setCycles(mockCycles);
    }
  }, [initialCycles]);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (endDate: Date) => {
    const diff = endDate.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const getStatusColor = (status: string) => {
    return {
      active: 'text-jade-500 bg-jade-500/10 border-jade-500/30',
      funding: 'text-panda-500 bg-panda-500/10 border-panda-500/30',
      completed: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
    }[status];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 bg-ink-900 rounded-2xl animate-pulse" />
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
            <TrendingUp className="text-jade-500" size={28} />
            Funding Cycles
          </h2>
          <p className="text-slate-400 mt-1">Active investment opportunities</p>
        </div>
        <div className="text-sm text-slate-400">
          {cycles.filter((c) => c.status === 'active').length} Active
        </div>
      </div>

      {/* Cycles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cycles.map((cycle, index) => {
          const progress = getProgressPercentage(cycle.currentAmount, cycle.targetAmount);
          const daysLeft = getDaysLeft(cycle.endDate);

          return (
            <motion.div
              key={cycle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-glow-primary-sm transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cycle.name}</CardTitle>
                      <p className="text-sm text-slate-400 mt-1">{cycle.factory}</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                        cycle.status
                      )}`}
                    >
                      {cycle.status.toUpperCase()}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">
                        ${cycle.currentAmount.toLocaleString()} raised
                      </span>
                      <span className="text-slate-400">
                        Goal: ${cycle.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-ink-850 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-jade-500 to-jade-600"
                      />
                    </div>
                    <div className="text-right text-sm text-jade-500 font-semibold mt-1">
                      {progress.toFixed(1)}% funded
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-ink-850 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-panda-500 mb-1">
                        <Target size={16} />
                        <span className="text-xs font-medium text-slate-400">ROI</span>
                      </div>
                      <p className="text-xl font-bold text-slate-200">{cycle.roi}%</p>
                    </div>

                    <div className="bg-ink-850 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-silk-500 mb-1">
                        <Users size={16} />
                        <span className="text-xs font-medium text-slate-400">Investors</span>
                      </div>
                      <p className="text-xl font-bold text-slate-200">{cycle.investors}</p>
                    </div>

                    <div className="bg-ink-850 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-jade-500 mb-1">
                        <DollarSign size={16} />
                        <span className="text-xs font-medium text-slate-400">Min. Investment</span>
                      </div>
                      <p className="text-lg font-bold text-slate-200">
                        ${cycle.minInvestment.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-ink-850 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sky-500 mb-1">
                        <Calendar size={16} />
                        <span className="text-xs font-medium text-slate-400">Days Left</span>
                      </div>
                      <p className="text-lg font-bold text-slate-200">{daysLeft}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full py-2 px-4 bg-jade-500 hover:bg-jade-600 text-white rounded-xl font-medium transition-colors">
                    Invest Now
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="bg-panda-500/10 border border-panda-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-panda-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">How It Works</h4>
            <p className="text-sm text-slate-300">
              Invest in production cycles and earn returns when products are sold. Your investment helps
              manufacturers scale production and you share in the profits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
