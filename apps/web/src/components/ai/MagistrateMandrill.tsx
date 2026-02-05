"use client";

/**
 * 🐒 MAGISTRATE_MANDRILL - The Dispute Judge
 * Handles disputes: analyzes complaints, summarizes evidence, proposes fair rulings
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  MessageSquare,
  Image,
  Clock,
  Gavel,
  Eye
} from 'lucide-react';
import { getCharacter } from '@/lib/ai/registry';
import { aiEventBus } from '@/lib/ai/event-bus';
import { logAIAction } from '@/lib/ai/logger';
import { ai } from '@/lib/ai/provider';
import { CharacterAvatar, CharacterPanel, useCharacterUI } from './CharacterBase';
import type { AIEvent } from '@/lib/ai/types';

const character = getCharacter('MAGISTRATE_MANDRILL');

interface DisputeEvidence {
  id: string;
  type: 'image' | 'message' | 'tracking' | 'document';
  description: string;
  submittedBy: 'buyer' | 'seller';
  timestamp: number;
}

interface DisputeSummary {
  claimant: string;
  respondent: string;
  orderValue: number;
  claimType: string;
  claimSummary: string;
  evidenceStatus: {
    buyer: number;
    seller: number;
    total: number;
  };
  suggestedOutcome?: {
    type: 'full_refund' | 'partial_refund' | 'no_refund' | 'replacement' | 'needs_more_evidence';
    confidence: number;
    reasoning: string;
  };
}

interface MagistrateMandrillProps {
  locale: string;
  disputeId?: string;
}

export function MagistrateMandrill({ locale, disputeId }: MagistrateMandrillProps) {
  const { state, show, hide } = useCharacterUI('MAGISTRATE_MANDRILL');
  const [summary, setSummary] = useState<DisputeSummary | null>(null);
  const [evidence, setEvidence] = useState<DisputeEvidence[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [proposedRuling, setProposedRuling] = useState<string | null>(null);

  // Listen for dispute events
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Dispute opened
    unsubscribes.push(
      aiEventBus.on('DISPUTE_OPENED', async (event) => {
        const dId = event.payload.disputeId as string;
        const reason = event.payload.reason as string;

        // Initialize summary
        setSummary({
          claimant: 'Buyer',
          respondent: 'Seller',
          orderValue: 0,
          claimType: reason,
          claimSummary: '',
          evidenceStatus: { buyer: 0, seller: 0, total: 0 },
        });

        show();
        
        logAIAction({
          characterId: 'MAGISTRATE_MANDRILL',
          action: 'dispute_started',
          event,
          result: {
            success: true,
            characterId: 'MAGISTRATE_MANDRILL',
            action: 'dispute_started',
            requiresApproval: false,
          },
        });
      })
    );

    // Evidence uploaded
    unsubscribes.push(
      aiEventBus.on('DISPUTE_EVIDENCE_UPLOADED', (event) => {
        const evidenceType = event.payload.evidenceType as string;
        
        setEvidence(prev => [...prev, {
          id: `ev-${Date.now()}`,
          type: evidenceType as DisputeEvidence['type'],
          description: `New ${evidenceType} evidence`,
          submittedBy: 'buyer',
          timestamp: Date.now(),
        }]);

        // Update evidence count
        setSummary(prev => prev ? {
          ...prev,
          evidenceStatus: {
            ...prev.evidenceStatus,
            buyer: prev.evidenceStatus.buyer + 1,
            total: prev.evidenceStatus.total + 1,
          },
        } : null);
      })
    );

    // Response received
    unsubscribes.push(
      aiEventBus.on('DISPUTE_RESPONSE', (event) => {
        // Update evidence count for seller
        setSummary(prev => prev ? {
          ...prev,
          evidenceStatus: {
            ...prev.evidenceStatus,
            seller: prev.evidenceStatus.seller + 1,
            total: prev.evidenceStatus.total + 1,
          },
        } : null);
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, [show]);

  // Analyze dispute and suggest ruling
  const analyzeDispute = async () => {
    if (!summary) return;
    
    setIsAnalyzing(true);

    try {
      // Use AI to analyze the case
      const result = await ai.summarize({
        text: `
          Dispute Type: ${summary.claimType}
          Claim: ${summary.claimSummary}
          Order Value: ¥${summary.orderValue}
          Evidence from buyer: ${summary.evidenceStatus.buyer} items
          Evidence from seller: ${summary.evidenceStatus.seller} items
        `,
        style: 'bullet',
        maxLength: 200,
      });

      if (result.success && result.data) {
        setProposedRuling(result.data);
        
        // Update summary with suggested outcome
        setSummary(prev => prev ? {
          ...prev,
          suggestedOutcome: {
            type: 'partial_refund',
            confidence: 0.75,
            reasoning: result.data || '',
          },
        } : null);

        logAIAction({
          characterId: 'MAGISTRATE_MANDRILL',
          action: 'analyze_dispute',
          event: {
            type: 'DISPUTE_OPENED',
            route: `/${locale}/disputes/${disputeId}`,
            payload: { disputeId, summary },
            timestamp: Date.now(),
            correlationId: `analysis-${Date.now()}`,
          },
          result: {
            success: true,
            characterId: 'MAGISTRATE_MANDRILL',
            action: 'analyze_dispute',
            requiresApproval: true,
            data: { ruling: result.data },
          },
          userApproved: null, // Pending approval
          inputSnapshot: { summary, evidence },
        });
      }
    } catch (error) {
      console.error('[Mandrill] Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!state.visible || state.muted) return null;

  return (
    <CharacterPanel
      character={character}
      title="Dispute Analysis"
      visible={state.visible}
      onClose={hide}
      position="right"
    >
      <div className="space-y-4">
        {/* Case Overview */}
        {summary && (
          <div className="bg-violet-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-violet-400" />
              <h4 className="font-semibold text-slate-200">Case Summary</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Claim Type</span>
                <span className="text-slate-200">{summary.claimType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Value</span>
                <span className="text-slate-200">¥{summary.orderValue}</span>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Checklist */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" />
            Evidence Checklist
          </h4>
          
          {summary && (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-slate-700/50 rounded">
                <div className="text-2xl font-bold text-violet-400">
                  {summary.evidenceStatus.buyer}
                </div>
                <div className="text-xs text-slate-400">Buyer Evidence</div>
              </div>
              <div className="text-center p-2 bg-slate-700/50 rounded">
                <div className="text-2xl font-bold text-violet-400">
                  {summary.evidenceStatus.seller}
                </div>
                <div className="text-xs text-slate-400">Seller Evidence</div>
              </div>
            </div>
          )}

          {/* Evidence list */}
          {evidence.length > 0 && (
            <ul className="mt-3 space-y-2">
              {evidence.map(ev => (
                <li key={ev.id} className="flex items-center gap-2 text-sm">
                  {ev.type === 'image' && <Image className="w-4 h-4 text-slate-400" />}
                  {ev.type === 'message' && <MessageSquare className="w-4 h-4 text-slate-400" />}
                  {ev.type === 'document' && <FileText className="w-4 h-4 text-slate-400" />}
                  <span className="text-slate-300">{ev.description}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    ev.submittedBy === 'buyer' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {ev.submittedBy}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {evidence.length === 0 && (
            <p className="text-sm text-slate-400 mt-2">
              No evidence submitted yet
            </p>
          )}
        </div>

        {/* Proposed Ruling */}
        {proposedRuling && (
          <div className="bg-violet-500/5 border border-violet-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gavel className="w-5 h-5 text-violet-400" />
              <h4 className="font-semibold text-slate-200">Proposed Ruling</h4>
            </div>
            
            <p className="text-sm text-slate-300 whitespace-pre-line mb-4">
              {proposedRuling}
            </p>

            {summary?.suggestedOutcome && (
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  summary.suggestedOutcome.confidence > 0.7 ? 'bg-emerald-400' :
                  summary.suggestedOutcome.confidence > 0.4 ? 'bg-amber-400' :
                  'bg-red-400'
                }`} />
                <span className="text-slate-400">
                  Confidence: {Math.round(summary.suggestedOutcome.confidence * 100)}%
                </span>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button className="btn-ghost text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Request Review
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-3">
              ⚠️ Final decisions require human admin approval (NUCLEAR permission)
            </p>
          </div>
        )}

        {/* Analyze Button */}
        {!proposedRuling && summary && (
          <button
            onClick={analyzeDispute}
            disabled={isAnalyzing || summary.evidenceStatus.total < 1}
            className="w-full btn-primary bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Scale className="w-4 h-4 mr-2" />
                Analyze Case
              </>
            )}
          </button>
        )}

        {/* Help text */}
        <p className="text-xs text-slate-500 text-center">
          {character.displayName} reviews evidence impartially and suggests fair outcomes.
        </p>
      </div>
    </CharacterPanel>
  );
}

// Dispute status badge
export function DisputeStatusBadge({ status }: { status: 'open' | 'reviewing' | 'resolved' }) {
  const statusConfig = {
    open: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    reviewing: { icon: Scale, color: 'text-violet-400', bg: 'bg-violet-500/20' },
    resolved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color} ${config.bg}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
