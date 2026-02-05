'use client';

import { useEffect } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';

interface FirstVisitTriggerProps {
  enabled?: boolean;
}

/**
 * FirstVisitTrigger - Triggers Host Panda for new users
 * 
 * Detects first visit using localStorage and triggers onboarding
 */
export default function FirstVisitTrigger({ enabled = true }: FirstVisitTriggerProps) {
  useEffect(() => {
    if (!enabled) return;

    const hasVisited = localStorage.getItem('bandachao_visited');

    if (!hasVisited) {
      // Mark as visited
      localStorage.setItem('bandachao_visited', 'true');

      // Trigger onboarding
      setTimeout(() => {
        AgentEventBus.emit('FIRST_VISIT', {
          trigger: 'first-visit',
          agentId: 'host-panda',
        });

        console.log('[FirstVisitTrigger] Triggered');
      }, 2000); // 2 second delay for better UX
    }
  }, [enabled]);

  return null;
}
