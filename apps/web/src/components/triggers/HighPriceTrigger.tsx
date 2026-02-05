'use client';

import { useEffect, useState } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';
import type { AgentTrigger } from '../agents/AgentRegistry';

interface HighPriceTriggerProps {
  threshold?: number; // Default price threshold (e.g., 10000)
  agentId?: string;
}

/**
 * HighPriceTrigger - Triggers when user views high-value items
 * 
 * Monitors product page views and triggers Deal Cat or Wukong for negotiation
 * when items exceed price threshold
 */
export function HighPriceTrigger({ threshold = 10000, agentId = 'deal_cat' }: HighPriceTriggerProps) {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if we're on a product page
    const checkHighPrice = () => {
      // Look for price elements on the page
      const priceElements = document.querySelectorAll('[data-price]');
      
      priceElements.forEach((element) => {
        const price = parseFloat(element.getAttribute('data-price') || '0');
        
        if (price >= threshold && !hasTriggered) {
          console.log(`[HighPriceTrigger] Detected high-value item: ¥${price}`);
          
          AgentEventBus.triggerAgent('HIGH_PRICE_ITEM' as AgentTrigger, agentId, {
            price,
            threshold,
            timestamp: Date.now(),
          });

          setHasTriggered(true);

          // Reset after 5 minutes
          setTimeout(() => {
            setHasTriggered(false);
          }, 5 * 60 * 1000);
        }
      });
    };

    // Check on mount
    checkHighPrice();

    // Check on price changes (observe DOM)
    const observer = new MutationObserver(() => {
      checkHighPrice();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-price'],
    });

    return () => {
      observer.disconnect();
    };
  }, [threshold, agentId, hasTriggered]);

  return null;
}

export default HighPriceTrigger;
