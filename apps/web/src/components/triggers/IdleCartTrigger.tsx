'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';

interface IdleCartTriggerProps {
  cartItemCount: number;
  idleTime?: number; // ms before triggering
  enabled?: boolean;
}

/**
 * IdleCartTrigger - Triggers Chatty Bird when cart is idle for too long
 * 
 * Helps recover abandoned carts by offering assistance
 */
export default function IdleCartTrigger({
  cartItemCount,
  idleTime = 300000, // 5 minutes
  enabled = true,
}: IdleCartTriggerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerIdleCart = useCallback(() => {
    if (cartItemCount > 0) {
      AgentEventBus.emit('IDLE_CART', {
        cartItemCount,
        trigger: 'idle-cart',
        agentId: 'chatty-bird',
      });

      console.log('[IdleCartTrigger] Triggered');
    }
  }, [cartItemCount]);

  useEffect(() => {
    if (!enabled || cartItemCount === 0) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(triggerIdleCart, idleTime);

    // Reset on user activity
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(triggerIdleCart, idleTime);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [enabled, cartItemCount, idleTime, triggerIdleCart]);

  return null;
}
