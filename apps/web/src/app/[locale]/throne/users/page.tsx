'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Shield,
  AlertTriangle,
  Ban,
  UserX,
  Lock,
  FileCheck,
  Wallet,
  Users,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

type UserRole = 'BUYER' | 'MAKER' | 'INVESTOR';
type UserTier = 'BASIC' | 'PREMIUM' | 'VIP';
type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  tier: UserTier;
  kyc: KYCStatus;
  riskScore: number;
  linkedWallets: number;
  referralsCount: number;
  disputesCount: number;
  joinedAt: string;
}

const MOCK_USERS: User[] = [
  {
    id: 'user_8923',
    name: 'Sarah Chen',
    phone: '138****2341',
    role: 'BUYER',
    tier: 'VIP',
    kyc: 'VERIFIED',
    riskScore: 2.1,
    linkedWallets: 3,
    referralsCount: 12,
    disputesCount: 0,
    joinedAt: '2025-11-15',
  },
  {
    id: 'user_2341',
    name: 'Ali Manufacturing',
    phone: '136****8765',
    role: 'MAKER',
    tier: 'PREMIUM',
    kyc: 'VERIFIED',
    riskScore: 1.3,
    linkedWallets: 2,
    referralsCount: 8,
    disputesCount: 1,
    joinedAt: '2025-10-22',
  },
  {
    id: 'user_5612',
    name: 'Investment Corp',
    phone: '139****4567',
    role: 'INVESTOR',
    tier: 'VIP',
    kyc: 'VERIFIED',
    riskScore: 0.8,
    linkedWallets: 5,
    referralsCount: 4,
    disputesCount: 0,
    joinedAt: '2025-09-10',
  },
  {
    id: 'user_7823',
    name: 'Wang Electronics',
    phone: '135****9012',
    role: 'MAKER',
    tier: 'BASIC',
    kyc: 'PENDING',
    riskScore: 4.2,
    linkedWallets: 1,
    referralsCount: 0,
    disputesCount: 0,
    joinedAt: '2026-01-28',
  },
  {
    id: 'user_9012',
    name: 'Michael Wang',
    phone: '137****3456',
    role: 'BUYER',
    tier: 'PREMIUM',
    kyc: 'VERIFIED',
    riskScore: 1.9,
    linkedWallets: 2,
    referralsCount: 15,
    disputesCount: 2,
    joinedAt: '2025-12-05',
  },
  {
    id: 'user_3456',
    name: 'Green Energy Ltd',
    phone: '134****7890',
    role: 'INVESTOR',
    tier: 'PREMIUM',
    kyc: 'VERIFIED',
    riskScore: 1.1,
    linkedWallets: 3,
    referralsCount: 6,
    disputesCount: 0,
    joinedAt: '2025-11-20',
  },
  {
    id: 'user_6789',
    name: 'Li Trading',
    phone: '133****2345',
    role: 'BUYER',
    tier: 'BASIC',
    kyc: 'REJECTED',
    riskScore: 7.8,
    linkedWallets: 1,
    referralsCount: 0,
    disputesCount: 3,
    joinedAt: '2026-01-15',
  },
  {
    id: 'user_1234',
    name: 'EcoWood Factory',
    phone: '132****6789',
    role: 'MAKER',
    tier: 'VIP',
    kyc: 'VERIFIED',
    riskScore: 0.9,
    linkedWallets: 4,
    referralsCount: 22,
    disputesCount: 1,
    joinedAt: '2025-08-12',
  },
  {
    id: 'user_4567',
    name: 'Zhang Imports',
    phone: '131****0123',
    role: 'BUYER',
    tier: 'PREMIUM',
    kyc: 'VERIFIED',
    riskScore: 2.3,
    linkedWallets: 2,
    referralsCount: 9,
    disputesCount: 0,
    joinedAt: '2025-10-30',
  },
  {
    id: 'user_7890',
    name: 'Tech Ventures',
    phone: '130****4567',
    role: 'INVESTOR',
    tier: 'VIP',
    kyc: 'VERIFIED',
    riskScore: 1.0,
    linkedWallets: 6,
    referralsCount: 3,
    disputesCount: 0,
    joinedAt: '2025-09-25',
  },
  {
    id: 'user_0123',
    name: 'Phoenix Textiles',
    phone: '129****8901',
    role: 'MAKER',
    tier: 'PREMIUM',
    kyc: 'VERIFIED',
    riskScore: 1.6,
    linkedWallets: 2,
    referralsCount: 11,
    disputesCount: 0,
    joinedAt: '2025-11-08',
  },
  {
    id: 'user_3457',
    name: 'Chen Logistics',
    phone: '128****2345',
    role: 'BUYER',
    tier: 'BASIC',
    kyc: 'PENDING',
    riskScore: 3.5,
    linkedWallets: 1,
    referralsCount: 1,
    disputesCount: 0,
    joinedAt: '2026-01-20',
  },
  {
    id: 'user_6780',
    name: 'Dragon Capital',
    phone: '127****6789',
    role: 'INVESTOR',
    tier: 'PREMIUM',
    kyc: 'VERIFIED',
    riskScore: 1.2,
    linkedWallets: 3,
    referralsCount: 7,
    disputesCount: 0,
    joinedAt: '2025-10-15',
  },
  {
    id: 'user_9013',
    name: 'Smart Factory',
    phone: '126****0124',
    role: 'MAKER',
    tier: 'BASIC',
    kyc: 'VERIFIED',
    riskScore: 2.8,
    linkedWallets: 1,
    referralsCount: 4,
    disputesCount: 1,
    joinedAt: '2025-12-18',
  },
  {
    id: 'user_2346',
    name: 'Liu Commerce',
    phone: '125****4568',
    role: 'BUYER',
    tier: 'VIP',
    kyc: 'VERIFIED',
    riskScore: 1.5,
    linkedWallets: 4,
    referralsCount: 18,
    disputesCount: 0,
    joinedAt: '2025-09-05',
  },
];

type NuclearAction = 'ban' | 'suspend' | 'limit' | 'force-kyc' | null;

export default function ThroneUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [tierFilter, setTierFilter] = useState<UserTier | 'ALL'>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [nuclearAction, setNuclearAction] = useState<NuclearAction>(null);
  const [showAIAssist, setShowAIAssist] = useState(false);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesTier = tierFilter === 'ALL' || user.tier === tierFilter;
    return matchesSearch && matchesRole && matchesTier;
  });

  const getRiskColor = (score: number) => {
    if (score < 2) return 'text-jade-400';
    if (score < 5) return 'text-warning-400';
    return 'text-danger-400';
  };

  const getKYCBadge = (status: KYCStatus) => {
    const styles = {
      VERIFIED: 'bg-jade-500/10 text-jade-400 border-jade-500/20',
      PENDING: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
      REJECTED: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
    };
    return styles[status];
  };

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-ruby-500/10">
            <Users className="w-6 h-6 text-ruby-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200">User Management</h1>
        </div>
        <p className="text-slate-400">
          Oversee all platform users with god-mode controls
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="text-sm text-slate-400 mb-1">Total Users</div>
          <div className="text-2xl font-bold text-slate-200">
            {MOCK_USERS.length}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="text-sm text-slate-400 mb-1">Verified KYC</div>
          <div className="text-2xl font-bold text-jade-400">
            {MOCK_USERS.filter((u) => u.kyc === 'VERIFIED').length}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="text-sm text-slate-400 mb-1">High Risk</div>
          <div className="text-2xl font-bold text-danger-400">
            {MOCK_USERS.filter((u) => u.riskScore > 5).length}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="text-sm text-slate-400 mb-1">VIP Tier</div>
          <div className="text-2xl font-bold text-panda-400">
            {MOCK_USERS.filter((u) => u.tier === 'VIP').length}
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 p-4 rounded-lg bg-ink-850 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ink-800 border border-border rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
              />
            </div>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-ink-800 border border-border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
            >
              <option value="ALL">All Roles</option>
              <option value="BUYER">Buyer</option>
              <option value="MAKER">Maker</option>
              <option value="INVESTOR">Investor</option>
            </select>
          </div>
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-ink-800 border border-border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-panda-500/50"
            >
              <option value="ALL">All Tiers</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg bg-ink-850 border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-ink-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  User ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Tier
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  KYC
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Risk Score
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser(user)}
                  className="border-b border-border hover:bg-ink-800 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-400 font-mono">
                    {user.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-200 font-medium">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 font-mono">
                    {user.phone}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-ink-800 text-slate-300 border border-border">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-panda-500/10 text-panda-400 border border-panda-500/20">
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getKYCBadge(
                        user.kyc
                      )}`}
                    >
                      {user.kyc}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${getRiskColor(user.riskScore)}`}>
                      {user.riskScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                      }}
                      className="text-panda-400 hover:text-panda-300 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No users found matching your filters</p>
          </div>
        )}
      </div>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-ink-850 border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-200 mb-1">
                      {selectedUser.name}
                    </h2>
                    <p className="text-sm text-slate-400 font-mono">{selectedUser.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="p-4 rounded-lg bg-ink-800 border border-border mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    Profile Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Phone:</span>
                      <span className="text-sm text-slate-200 font-mono">
                        {selectedUser.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Role:</span>
                      <span className="text-sm text-slate-200">{selectedUser.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Tier:</span>
                      <span className="text-sm text-panda-400 font-medium">
                        {selectedUser.tier}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">KYC Status:</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedUser.kyc === 'VERIFIED'
                            ? 'text-jade-400'
                            : selectedUser.kyc === 'PENDING'
                            ? 'text-warning-400'
                            : 'text-danger-400'
                        }`}
                      >
                        {selectedUser.kyc}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Joined:</span>
                      <span className="text-sm text-slate-200">{selectedUser.joinedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="p-4 rounded-lg bg-ink-800 border border-border mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-300">Risk Assessment</h3>
                    <button
                      onClick={() => setShowAIAssist(!showAIAssist)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-panda-500/10 text-panda-400 text-xs hover:bg-panda-500/20 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Explain
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield
                      className={`w-8 h-8 ${
                        selectedUser.riskScore < 2
                          ? 'text-jade-400'
                          : selectedUser.riskScore < 5
                          ? 'text-warning-400'
                          : 'text-danger-400'
                      }`}
                    />
                    <div>
                      <div
                        className={`text-2xl font-bold ${getRiskColor(
                          selectedUser.riskScore
                        )}`}
                      >
                        {selectedUser.riskScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {selectedUser.riskScore < 2
                          ? 'Low Risk'
                          : selectedUser.riskScore < 5
                          ? 'Medium Risk'
                          : 'High Risk'}
                      </div>
                    </div>
                  </div>
                  {showAIAssist && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 rounded bg-panda-500/5 border border-panda-500/10"
                    >
                      <p className="text-xs text-slate-300 leading-relaxed">
                        🤖 <strong>AI Security Brain:</strong> Risk score based on KYC
                        status, dispute history, and transaction patterns. This user shows{' '}
                        {selectedUser.riskScore < 2
                          ? 'excellent'
                          : selectedUser.riskScore < 5
                          ? 'acceptable'
                          : 'concerning'}{' '}
                        behavior.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-ink-800 border border-border text-center">
                    <Wallet className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-200">
                      {selectedUser.linkedWallets}
                    </div>
                    <div className="text-xs text-slate-400">Wallets</div>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-800 border border-border text-center">
                    <Users className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-200">
                      {selectedUser.referralsCount}
                    </div>
                    <div className="text-xs text-slate-400">Referrals</div>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-800 border border-border text-center">
                    <AlertTriangle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-slate-200">
                      {selectedUser.disputesCount}
                    </div>
                    <div className="text-xs text-slate-400">Disputes</div>
                  </div>
                </div>

                {/* NUCLEAR Actions */}
                <div className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-danger-400" />
                    <h3 className="text-sm font-medium text-danger-400">
                      NUCLEAR Actions
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setNuclearAction('ban')}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-danger-500/10 border border-danger-500/30 text-danger-400 hover:bg-danger-500/20 transition-colors text-sm"
                    >
                      <Ban className="w-4 h-4" />
                      Ban User
                    </button>
                    <button
                      onClick={() => setNuclearAction('suspend')}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-warning-500/10 border border-warning-500/30 text-warning-400 hover:bg-warning-500/20 transition-colors text-sm"
                    >
                      <UserX className="w-4 h-4" />
                      Suspend
                    </button>
                    <button
                      onClick={() => setNuclearAction('limit')}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-warning-500/10 border border-warning-500/30 text-warning-400 hover:bg-warning-500/20 transition-colors text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      Limit Access
                    </button>
                    <button
                      onClick={() => setNuclearAction('force-kyc')}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-panda-500/10 border border-panda-500/30 text-panda-400 hover:bg-panda-500/20 transition-colors text-sm"
                    >
                      <FileCheck className="w-4 h-4" />
                      Force KYC
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nuclear Confirmation Modal */}
      <AnimatePresence>
        {nuclearAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNuclearAction(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-ink-850 border border-danger-500/30 rounded-lg p-6 max-w-md w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-danger-500/10">
                    <AlertTriangle className="w-6 h-6 text-danger-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200">
                    Confirm NUCLEAR Action
                  </h3>
                </div>
                <p className="text-slate-300 mb-6">
                  You are about to <strong className="text-danger-400">{nuclearAction}</strong>{' '}
                  user <strong>{selectedUser?.name}</strong>. This action requires admin
                  approval and will be logged.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNuclearAction(null)}
                    className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Execute action (mock)
                      setNuclearAction(null);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 rounded bg-danger-500 text-white hover:bg-danger-600 shadow-glow-primary transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
