'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart3, TrendingUp, DollarSign, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@bandachao/ui';

interface ProfitDistribution {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface MonthlyTrend {
  month: string;
  profit: number;
  distributed: number;
}

interface InvestorShare {
  name: string;
  investment: number;
  returns: number;
  roi: number;
}

interface TransparencyChartsProps {
  distribution?: ProfitDistribution[];
  trends?: MonthlyTrend[];
  investors?: InvestorShare[];
}

/**
 * TransparencyCharts - Profit distribution visualization
 * 
 * Shows how profits are distributed among stakeholders with interactive charts
 */
export default function TransparencyCharts({ 
  distribution: initialDistribution, 
  trends: initialTrends,
  investors: initialInvestors 
}: TransparencyChartsProps) {
  const [distribution, setDistribution] = useState<ProfitDistribution[]>(initialDistribution || []);
  const [trends, setTrends] = useState<MonthlyTrend[]>(initialTrends || []);
  const [investors, setInvestors] = useState<InvestorShare[]>(initialInvestors || []);
  const [activeChart, setActiveChart] = useState<'distribution' | 'trends' | 'investors'>('distribution');

  // Mock data
  useEffect(() => {
    if (!initialDistribution) {
      setDistribution([
        { category: 'Investors', amount: 450000, percentage: 45, color: 'jade' },
        { category: 'Factory', amount: 300000, percentage: 30, color: 'panda' },
        { category: 'Platform', amount: 150000, percentage: 15, color: 'silk' },
        { category: 'Reserve Fund', amount: 100000, percentage: 10, color: 'sky' },
      ]);
    }

    if (!initialTrends) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setTrends(
        months.map((month) => ({
          month,
          profit: Math.floor(Math.random() * 500000 + 500000),
          distributed: Math.floor(Math.random() * 300000 + 300000),
        }))
      );
    }

    if (!initialInvestors) {
      setInvestors(
        Array.from({ length: 8 }, (_, i) => {
          const investment = Math.floor(Math.random() * 50000 + 10000);
          const roi = Math.floor(Math.random() * 20 + 10);
          const returns = Math.floor(investment * (roi / 100));
          return {
            name: `Investor ${i + 1}`,
            investment,
            returns,
            roi,
          };
        })
      );
    }
  }, [initialDistribution, initialTrends, initialInvestors]);

  const totalProfit = distribution.reduce((sum, item) => sum + item.amount, 0);
  const maxTrendValue = Math.max(...trends.map((t) => Math.max(t.profit, t.distributed)));

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      jade: 'bg-jade-500',
      panda: 'bg-panda-500',
      silk: 'bg-silk-500',
      sky: 'bg-sky-500',
      danger: 'bg-danger-500',
    };
    return colors[color] || 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <PieChart className="text-jade-500" size={28} />
            Transparency Dashboard
          </h2>
          <p className="text-slate-400 mt-1">Real-time profit distribution and analytics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-ink-800 hover:bg-ink-700 text-slate-200 rounded-xl font-medium transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 p-1 bg-ink-900 rounded-xl border border-ink-800">
        <button
          onClick={() => setActiveChart('distribution')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeChart === 'distribution'
              ? 'bg-jade-500 text-white shadow-glow-primary-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Profit Distribution
        </button>
        <button
          onClick={() => setActiveChart('trends')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeChart === 'trends'
              ? 'bg-jade-500 text-white shadow-glow-primary-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Monthly Trends
        </button>
        <button
          onClick={() => setActiveChart('investors')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeChart === 'investors'
              ? 'bg-jade-500 text-white shadow-glow-primary-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Investor Returns
        </button>
      </div>

      {/* Profit Distribution */}
      {activeChart === 'distribution' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Pie Chart (Visual Representation) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 mb-2">Total Distributed</p>
                  <p className="text-4xl font-bold text-jade-500">
                    ${totalProfit.toLocaleString()}
                  </p>
                </div>

                {/* Horizontal Stacked Bar */}
                <div className="h-12 flex rounded-xl overflow-hidden">
                  {distribution.map((item, index) => (
                    <motion.div
                      key={item.category}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`${getColorClass(item.color)} flex items-center justify-center text-white font-semibold text-sm`}
                      style={{ minWidth: '60px' }}
                    >
                      {item.percentage}%
                    </motion.div>
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-2 pt-4">
                  {distribution.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${getColorClass(item.color)}`} />
                        <span className="text-slate-300 text-sm">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-200 font-semibold">
                          ${item.amount.toLocaleString()}
                        </p>
                        <p className="text-slate-400 text-xs">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="text-jade-500" size={20} />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-jade-500/10 border border-jade-500/30 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Total Revenue (Last 30 Days)</p>
                  <p className="text-2xl font-bold text-jade-500">$1,245,000</p>
                  <p className="text-xs text-jade-400 mt-1">↑ 12% from last month</p>
                </div>

                <div className="p-4 bg-panda-500/10 border border-panda-500/30 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Active Investments</p>
                  <p className="text-2xl font-bold text-panda-500">43</p>
                  <p className="text-xs text-panda-400 mt-1">8 new this month</p>
                </div>

                <div className="p-4 bg-silk-500/10 border border-silk-500/30 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Average ROI</p>
                  <p className="text-2xl font-bold text-silk-500">18.5%</p>
                  <p className="text-xs text-silk-400 mt-1">Above industry average</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Monthly Trends */}
      {activeChart === 'trends' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="text-panda-500" size={20} />
                6-Month Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => {
                  const profitWidth = (trend.profit / maxTrendValue) * 100;
                  const distributedWidth = (trend.distributed / maxTrendValue) * 100;

                  return (
                    <div key={trend.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-300">{trend.month}</span>
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span>Profit: ${trend.profit.toLocaleString()}</span>
                          <span>Distributed: ${trend.distributed.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="h-3 bg-ink-850 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${profitWidth}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-panda-500"
                          />
                        </div>
                        <div className="h-3 bg-ink-850 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${distributedWidth}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                            className="h-full bg-jade-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-4 pt-4 border-t border-ink-800">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 rounded bg-panda-500" />
                    <span className="text-sm text-slate-400">Total Profit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 rounded bg-jade-500" />
                    <span className="text-sm text-slate-400">Distributed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Investor Returns */}
      {activeChart === 'investors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="text-jade-500" size={20} />
                Top Investors Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ink-800">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-400">
                        Investor
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-slate-400">
                        Investment
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-slate-400">
                        Returns
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-slate-400">
                        ROI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((investor, index) => (
                      <motion.tr
                        key={investor.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-ink-850 hover:bg-ink-900 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <span className="text-slate-200 font-medium">{investor.name}</span>
                        </td>
                        <td className="py-3 px-2 text-right text-slate-300">
                          ${investor.investment.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-jade-500 font-semibold">
                            +${investor.returns.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="px-2 py-1 bg-jade-500/10 text-jade-500 rounded text-sm font-semibold">
                            {investor.roi}%
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Trust Banner */}
      <div className="bg-jade-500/10 border border-jade-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-jade-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">100% Transparent</h4>
            <p className="text-sm text-slate-300">
              All profit distributions are recorded on-chain and auditable. View detailed transaction
              history and smart contract interactions in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
