'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  Sparkles,
  Shield,
  X,
} from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'info-requested';

interface Submission {
  id: string;
  userId: string;
  name: string;
  country: string;
  priority: Priority;
  submittedAt: string;
  docs: string[];
  status: SubmissionStatus;
  flags?: string[];
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'KYC-2026-0234',
    userId: 'user_9012',
    name: 'Michael Wang',
    country: 'CN',
    priority: 'high',
    submittedAt: '2h ago',
    docs: ['National ID', 'Proof of Address', 'Business License'],
    status: 'pending',
    flags: ['First-time submission', 'High-value account'],
  },
  {
    id: 'KYC-2026-0235',
    userId: 'user_7823',
    name: 'Wang Electronics',
    country: 'CN',
    priority: 'high',
    submittedAt: '3h ago',
    docs: ['Business License', 'Tax Registration'],
    status: 'pending',
    flags: ['Maker onboarding'],
  },
  {
    id: 'KYC-2026-0236',
    userId: 'user_3457',
    name: 'Chen Logistics',
    country: 'SG',
    priority: 'medium',
    submittedAt: '5h ago',
    docs: ['Passport', 'Bank Statement'],
    status: 'pending',
  },
  {
    id: 'KYC-2026-0237',
    userId: 'user_4521',
    name: 'Green Energy Ltd',
    country: 'US',
    priority: 'medium',
    submittedAt: '6h ago',
    docs: ['Corporate Documents', 'Directors Info'],
    status: 'pending',
  },
  {
    id: 'KYC-2026-0238',
    userId: 'user_8765',
    name: 'Liu Trading',
    country: 'HK',
    priority: 'low',
    submittedAt: '8h ago',
    docs: ['ID Card', 'Utility Bill'],
    status: 'pending',
  },
  {
    id: 'KYC-2026-0239',
    userId: 'user_2109',
    name: 'Smart Factory Co',
    country: 'JP',
    priority: 'medium',
    submittedAt: '10h ago',
    docs: ['Company Registration', 'Financial Statements'],
    status: 'pending',
    flags: ['Investor application'],
  },
  {
    id: 'KYC-2026-0240',
    userId: 'user_5643',
    name: 'Phoenix Textiles',
    country: 'IN',
    priority: 'low',
    submittedAt: '12h ago',
    docs: ['Aadhaar Card', 'PAN Card'],
    status: 'pending',
  },
  {
    id: 'KYC-2026-0241',
    userId: 'user_9876',
    name: 'Dragon Imports',
    country: 'CN',
    priority: 'high',
    submittedAt: '14h ago',
    docs: ['Business License', 'Import License'],
    status: 'pending',
    flags: ['Expedited request'],
  },
];

const REJECTION_TEMPLATES = [
  'Document quality insufficient - please resubmit clear photos',
  'Address proof outdated - must be within 3 months',
  'Business license verification failed',
  'Identity mismatch detected',
  'Sanctioned entity detected',
  'Incomplete documentation',
];

export default function ThroneVerificationPage() {
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [decision, setDecision] = useState<'approve' | 'reject' | 'request-info' | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAIAssist, setShowAIAssist] = useState(false);

  const filteredSubmissions = MOCK_SUBMISSIONS.filter((sub) => {
    if (priorityFilter === 'all') return true;
    return sub.priority === priorityFilter;
  });

  const getPriorityColor = (priority: Priority) => {
    if (priority === 'high') return 'text-danger-400 bg-danger-500/10 border-danger-500/20';
    if (priority === 'medium')
      return 'text-warning-400 bg-warning-500/10 border-warning-500/20';
    return 'text-slate-400 bg-ink-800 border-border';
  };

  const stats = {
    pending: MOCK_SUBMISSIONS.filter((s) => s.status === 'pending').length,
    avgTime: '4.2h',
    thisWeek: 127,
  };

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-ruby-500/10">
            <FileCheck className="w-6 h-6 text-ruby-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200">KYC/AML Verification Queue</h1>
        </div>
        <p className="text-slate-400">Review and approve user identity submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-warning-400" />
            <div className="text-sm text-slate-400">Pending Review</div>
          </div>
          <div className="text-2xl font-bold text-warning-400">{stats.pending}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="text-sm text-slate-400">Avg Review Time</div>
          </div>
          <div className="text-2xl font-bold text-slate-200">{stats.avgTime}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-ink-850 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-jade-400" />
            <div className="text-sm text-slate-400">Processed This Week</div>
          </div>
          <div className="text-2xl font-bold text-jade-400">{stats.thisWeek}</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 rounded-lg bg-ink-850 border border-border">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-panda-500 text-white shadow-glow-primary'
                    : 'bg-ink-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 && (
          <div className="py-12 text-center rounded-lg bg-ink-850 border border-border">
            <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No submissions in this priority level</p>
          </div>
        )}

        {filteredSubmissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedSubmission(submission)}
            className="p-4 rounded-lg bg-ink-850 border border-border hover:border-panda-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                    submission.priority
                  )}`}
                >
                  {submission.priority.toUpperCase()}
                </div>
                <div className="text-sm text-slate-400 font-mono">{submission.id}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {submission.submittedAt}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium mb-1">{submission.name}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>User: {submission.userId}</span>
                  <span>•</span>
                  <span>Country: {submission.country}</span>
                  <span>•</span>
                  <span>{submission.docs.length} documents</span>
                </div>
                {submission.flags && submission.flags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {submission.flags.map((flag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-warning-500/10 text-warning-400 border border-warning-500/20"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded bg-panda-500 text-white hover:bg-panda-600 shadow-glow-primary transition-all opacity-0 group-hover:opacity-100">
                <Eye className="w-4 h-4" />
                Review
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[700px] bg-ink-850 border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-slate-200">
                        {selectedSubmission.name}
                      </h2>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                          selectedSubmission.priority
                        )}`}
                      >
                        {selectedSubmission.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-mono">
                      {selectedSubmission.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="p-2 hover:bg-ink-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Submission Info */}
                <div className="p-4 rounded-lg bg-ink-800 border border-border mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    Submission Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">User ID:</span>
                      <span className="text-sm text-slate-200 font-mono">
                        {selectedSubmission.userId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Country:</span>
                      <span className="text-sm text-slate-200">
                        {selectedSubmission.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Submitted:</span>
                      <span className="text-sm text-slate-200">
                        {selectedSubmission.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flags */}
                {selectedSubmission.flags && selectedSubmission.flags.length > 0 && (
                  <div className="p-4 rounded-lg bg-warning-500/5 border border-warning-500/20 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-warning-400" />
                      <h3 className="text-sm font-medium text-warning-400">Flags</h3>
                    </div>
                    <ul className="space-y-1">
                      {selectedSubmission.flags.map((flag, i) => (
                        <li key={i} className="text-sm text-slate-300">
                          • {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Documents */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    Submitted Documents ({selectedSubmission.docs.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSubmission.docs.map((doc, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-ink-800 border border-border hover:border-panda-500/50 transition-colors group cursor-pointer"
                      >
                        <div className="aspect-[4/3] bg-ink-900 rounded mb-2 flex items-center justify-center">
                          <FileCheck className="w-8 h-8 text-slate-600" />
                        </div>
                        <div className="text-sm text-slate-200 font-medium mb-1">{doc}</div>
                        <button className="flex items-center gap-1 text-xs text-panda-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="p-4 rounded-lg bg-panda-500/5 border border-panda-500/10 mb-4">
                  <button
                    onClick={() => setShowAIAssist(!showAIAssist)}
                    className="flex items-center gap-2 w-full"
                  >
                    <Sparkles className="w-4 h-4 text-panda-400" />
                    <span className="text-sm font-medium text-panda-400">
                      AI Legal Panda Analysis
                    </span>
                  </button>
                  {showAIAssist && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-xs text-slate-300 leading-relaxed"
                    >
                      <p className="mb-2">
                        🤖 <strong>Document Quality:</strong> All documents appear clear and
                        legible. No red flags detected in image quality.
                      </p>
                      <p className="mb-2">
                        <strong>Identity Verification:</strong> Name matches across all
                        documents. Address proof is recent (within 2 months).
                      </p>
                      <p>
                        <strong>Recommendation:</strong> Documents meet verification
                        standards. No sanctions matches found. Safe to approve.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Decision Panel */}
                {!decision && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-300">Make Decision</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setDecision('approve')}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-jade-500/10 border border-jade-500/30 text-jade-400 hover:bg-jade-500/20 transition-colors"
                      >
                        <CheckCircle className="w-6 h-6" />
                        <span className="text-sm font-medium">Approve</span>
                      </button>
                      <button
                        onClick={() => setDecision('request-info')}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-warning-500/10 border border-warning-500/30 text-warning-400 hover:bg-warning-500/20 transition-colors"
                      >
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-sm font-medium">Request Info</span>
                      </button>
                      <button
                        onClick={() => setDecision('reject')}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-danger-500/10 border border-danger-500/30 text-danger-400 hover:bg-danger-500/20 transition-colors"
                      >
                        <XCircle className="w-6 h-6" />
                        <span className="text-sm font-medium">Reject</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Decision Forms */}
                {decision === 'reject' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20"
                  >
                    <h3 className="text-sm font-medium text-danger-400 mb-3">
                      Rejection Reason
                    </h3>
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 mb-3 bg-ink-800 border border-border rounded text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-danger-500/50"
                    >
                      <option value="">Select a reason...</option>
                      {REJECTION_TEMPLATES.map((template, i) => (
                        <option key={i} value={template}>
                          {template}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDecision(null)}
                        className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!rejectionReason}
                        className="flex-1 px-4 py-2 rounded bg-danger-500 text-white hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </motion.div>
                )}

                {decision === 'approve' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-jade-500/5 border border-jade-500/20"
                  >
                    <h3 className="text-sm font-medium text-jade-400 mb-3">
                      Confirm Approval
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      This will verify the user and grant them full platform access.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDecision(null)}
                        className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button className="flex-1 px-4 py-2 rounded bg-jade-500 text-white hover:bg-jade-600 transition-colors text-sm">
                        Approve & Verify
                      </button>
                    </div>
                  </motion.div>
                )}

                {decision === 'request-info' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-warning-500/5 border border-warning-500/20"
                  >
                    <h3 className="text-sm font-medium text-warning-400 mb-3">
                      Request Additional Information
                    </h3>
                    <textarea
                      placeholder="Describe what additional information is needed..."
                      className="w-full px-3 py-2 mb-3 bg-ink-800 border border-border rounded text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-warning-500/50 resize-none"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDecision(null)}
                        className="flex-1 px-4 py-2 rounded bg-ink-800 text-slate-300 hover:bg-ink-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button className="flex-1 px-4 py-2 rounded bg-warning-500 text-white hover:bg-warning-600 transition-colors text-sm">
                        Send Request
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
