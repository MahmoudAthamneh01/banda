'use client';

import { useEffect } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';

interface TrustScoreTriggerProps {
  sellerId: string;
  trustScore: number;
  threshold?: number;
  enabled?: boolean;
}

/**
 * TrustScoreTrigger - Triggers Trust Mother when seller trust score is low
 * 
 * Used on factory/seller pages to provide trust guidance
 */
export default function TrustScoreTrigger({
  sellerId,
  trustScore,
  threshold = 70,
  enabled = true,
}: TrustScoreTriggerProps) {
  useEffect(() => {
    if (!enabled) return;

    if (trustScore < threshold) {
      AgentEventBus.emit('TRUST_SCORE_CHECK', {
        sellerId,
        trustScore,
        threshold,
        trigger: 'trust-score-low',
        agentId: 'trust-mother',
      });

      console.log('[TrustScoreTrigger] Triggered for seller:', sellerId);
    }
  }, [sellerId, trustScore, threshold, enabled]);

  return null;
}
