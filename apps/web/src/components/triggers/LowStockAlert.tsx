'use client';

import { useEffect } from 'react';
import { AgentEventBus } from '../agents/AgentEventBus';

interface LowStockAlertProps {
  productId: string;
  currentStock: number;
  threshold?: number;
  enabled?: boolean;
}

/**
 * LowStockAlert - Triggers Cyber Wukong when product stock is low
 * 
 * Used on product detail pages to alert users about limited availability
 */
export default function LowStockAlert({
  productId,
  currentStock,
  threshold = 10,
  enabled = true,
}: LowStockAlertProps) {
  useEffect(() => {
    if (!enabled) return;

    if (currentStock <= threshold && currentStock > 0) {
      AgentEventBus.emit('LOW_STOCK_ALERT', {
        productId,
        currentStock,
        threshold,
        trigger: 'low-stock',
        agentId: 'cyber-wukong',
      });

      console.log('[LowStockAlert] Triggered for product:', productId);
    }
  }, [productId, currentStock, threshold, enabled]);

  return null;
}
