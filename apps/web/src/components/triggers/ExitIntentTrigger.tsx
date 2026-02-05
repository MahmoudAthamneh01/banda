'use client';

import { useEffect, useCallback, useRef } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';

interface ExitIntentTriggerProps {
  enabled?: boolean;
  sensitivity?: number; // 0-100, higher = more sensitive
  cooldown?: number; // ms between triggers
}

/**
 * ExitIntentTrigger - Detects when user is about to leave and triggers agent
 * 
 * Triggers on:
 * - Mouse leaving viewport (desktop)
 * - Rapid scroll to top (mobile)
 * - Tab visibility change
 */
export default function ExitIntentTrigger({
  enabled = true,
  sensitivity = 50,
  cooldown = 60000, // 1 minute
}: ExitIntentTriggerProps) {
  const lastTriggerRef = useRef<number>(0);

  const triggerExitIntent = useCallback(() => {
    const now = Date.now();
    if (now - lastTriggerRef.current < cooldown) {
      return; // Cooldown period
    }

    lastTriggerRef.current = now;
    AgentEventBus.emit('EXIT_INTENT', {
      timestamp: now,
      trigger: 'exit-intent',
    });

    console.log('[ExitIntent] Triggered');
  }, [cooldown]);

  useEffect(() => {
    if (!enabled) return;

    // Desktop: Mouse leaving viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= sensitivity) {
        triggerExitIntent();
      }
    };

    // Mobile: Rapid scroll to top
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollSpeed = Math.abs(currentScrollY - lastScrollY);

      if (currentScrollY < 50 && scrollSpeed > sensitivity) {
        triggerExitIntent();
      }

      lastScrollY = currentScrollY;
    };

    // Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerExitIntent();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, sensitivity, triggerExitIntent]);

  return null; // This is a behavior component
}
