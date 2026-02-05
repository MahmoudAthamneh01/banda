'use client';

import { useEffect, useState } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';
import type { AgentTrigger } from '../agents/AgentRegistry';

interface RedPacketTriggerProps {
  minOrderValue?: number; // Minimum order to qualify for red packet
  agentId?: string;
}

/**
 * RedPacketTrigger - Triggers red packet (lucky money) promotional agent
 * 
 * Shows Hungry Panda when:
 * - User adds items to cart exceeding minimum value
 * - During Chinese New Year / special promotions
 * - User completes first successful order
 */
export function RedPacketTrigger({
  minOrderValue = 5000,
  agentId = 'hungry_panda',
}: RedPacketTriggerProps) {
  const [hasShownToday, setHasShownToday] = useState(false);

  useEffect(() => {
    // Check if already shown today
    const lastShown = localStorage.getItem('redPacketLastShown');
    if (lastShown) {
      const lastDate = new Date(parseInt(lastShown));
      const today = new Date();
      if (
        lastDate.getDate() === today.getDate() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getFullYear() === today.getFullYear()
      ) {
        setHasShownToday(true);
      }
    }

    // Monitor cart changes
    const checkCartValue = () => {
      const cartElement = document.querySelector('[data-cart-total]');
      if (!cartElement) return;

      const cartTotal = parseFloat(cartElement.getAttribute('data-cart-total') || '0');

      if (cartTotal >= minOrderValue && !hasShownToday) {
        console.log(`[RedPacketTrigger] Cart value ¥${cartTotal} qualifies for red packet`);

        AgentEventBus.triggerAgent('RED_PACKET_ELIGIBLE' as AgentTrigger, agentId, {
          cartTotal,
          minOrderValue,
          message: 'Congratulations! You qualify for a lucky red packet! 🧧',
          timestamp: Date.now(),
        });

        // Mark as shown today
        localStorage.setItem('redPacketLastShown', Date.now().toString());
        setHasShownToday(true);
      }
    };

    // Check on mount
    checkCartValue();

    // Observer for cart updates
    const observer = new MutationObserver(() => {
      checkCartValue();
    });

    const cartElement = document.querySelector('[data-cart-total]');
    if (cartElement) {
      observer.observe(cartElement, {
        attributes: true,
        attributeFilter: ['data-cart-total'],
      });
    }

    // Listen for cart events
    const handleCartUpdate = () => {
      checkCartValue();
    };

    document.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      observer.disconnect();
      document.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [minOrderValue, agentId, hasShownToday]);

  // Special trigger during Chinese New Year
  useEffect(() => {
    const now = new Date();
    const cnyStart = new Date(now.getFullYear(), 0, 20); // Approximate CNY range
    const cnyEnd = new Date(now.getFullYear(), 1, 10);

    if (now >= cnyStart && now <= cnyEnd && !hasShownToday) {
      console.log('[RedPacketTrigger] Chinese New Year period - triggering special red packet');

      setTimeout(() => {
        AgentEventBus.triggerAgent('RED_PACKET_ELIGIBLE' as AgentTrigger, agentId, {
          special: 'cny',
          message: '🎉 Happy Chinese New Year! Claim your lucky red packet! 🧧',
          timestamp: Date.now(),
        });

        localStorage.setItem('redPacketLastShown', Date.now().toString());
        setHasShownToday(true);
      }, 3000); // Delay 3 seconds on page load
    }
  }, [agentId, hasShownToday]);

  return null;
}

export default RedPacketTrigger;
