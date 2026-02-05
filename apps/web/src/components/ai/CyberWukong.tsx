"use client";

/**
 * 🐉 CYBER_WUKONG - The Operations Guardian
 * Monitors inventory, RFQs, and operations. Warns of risks and suggests actions.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  FileText,
  DollarSign,
  Zap,
  BarChart3,
  Bell
} from 'lucide-react';
import { getCharacter } from '@/lib/ai/registry';
import { aiEventBus } from '@/lib/ai/event-bus';
import { logAIAction } from '@/lib/ai/logger';
import { ai } from '@/lib/ai/provider';
import { CharacterAvatar, CharacterPanel, CharacterBubble, useCharacterUI } from './CharacterBase';
import type { AIEvent } from '@/lib/ai/types';

const character = getCharacter('CYBER_WUKONG');

interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  suggestedRestock: number;
  severity: 'warning' | 'critical';
  timestamp: number;
}

interface RFQMatch {
  rfqId: string;
  buyerName: string;
  productCategory: string;
  quantity: number;
  suggestedBid: number;
  confidence: number;
}

interface OperationsSummary {
  lowStockItems: number;
  pendingRFQs: number;
  todayOrders: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface CyberWukongProps {
  locale: string;
}

export function CyberWukong({ locale }: CyberWukongProps) {
  const { state, show, hide, mute, setMuted } = useCharacterUI('CYBER_WUKONG');
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [rfqMatches, setRfqMatches] = useState<RFQMatch[]>([]);
  const [summary, setSummary] = useState<OperationsSummary>({
    lowStockItems: 0,
    pendingRFQs: 0,
    todayOrders: 0,
    riskLevel: 'low',
  });
  const [quickBubble, setQuickBubble] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'restock' | 'bid';
    data: unknown;
  } | null>(null);

  // Listen for operations events
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Inventory low warning
    unsubscribes.push(
      aiEventBus.on('INVENTORY_LOW', (event) => {
        const { productId, productName, currentStock } = event.payload as {
          productId: string;
          productName: string;
          currentStock: number;
        };

        const alert: InventoryAlert = {
          id: `alert-${Date.now()}`,
          productId,
          productName,
          currentStock,
          suggestedRestock: Math.max(50, currentStock * 3),
          severity: 'warning',
          timestamp: Date.now(),
        };

        setAlerts(prev => [...prev, alert]);
        setSummary(prev => ({
          ...prev,
          lowStockItems: prev.lowStockItems + 1,
        }));

        setQuickBubble(`⚠️ ${productName} running low (${currentStock} left)`);
        show();

        setTimeout(() => setQuickBubble(null), 5000);

        logAIAction({
          characterId: 'CYBER_WUKONG',
          action: 'inventory_warning',
          event,
          result: {
            success: true,
            characterId: 'CYBER_WUKONG',
            action: 'inventory_warning',
            requiresApproval: false,
            data: { alert },
          },
        });
      })
    );

    // Inventory critical
    unsubscribes.push(
      aiEventBus.on('INVENTORY_CRITICAL', (event) => {
        const { productId, productName, currentStock } = event.payload as {
          productId: string;
          productName: string;
          currentStock: number;
        };

        const alert: InventoryAlert = {
          id: `alert-${Date.now()}`,
          productId,
          productName,
          currentStock,
          suggestedRestock: 100,
          severity: 'critical',
          timestamp: Date.now(),
        };

        setAlerts(prev => [alert, ...prev.filter(a => a.productId !== productId)]);
        setSummary(prev => ({
          ...prev,
          riskLevel: 'high',
        }));

        setQuickBubble(`🚨 CRITICAL: ${productName} stock nearly empty!`);
        show();

        logAIAction({
          characterId: 'CYBER_WUKONG',
          action: 'inventory_critical',
          event,
          result: {
            success: true,
            characterId: 'CYBER_WUKONG',
            action: 'inventory_critical',
            requiresApproval: false,
            data: { alert },
          },
        });
      })
    );

    // RFQ matched
    unsubscribes.push(
      aiEventBus.on('RFQ_MATCHED', (event) => {
        const { rfqId, buyerName, productCategory, quantity } = event.payload as {
          rfqId: string;
          buyerName: string;
          productCategory: string;
          quantity: number;
        };

        const match: RFQMatch = {
          rfqId,
          buyerName,
          productCategory,
          quantity,
          suggestedBid: quantity * 100, // placeholder calculation
          confidence: 0.85,
        };

        setRfqMatches(prev => [...prev, match]);
        setSummary(prev => ({
          ...prev,
          pendingRFQs: prev.pendingRFQs + 1,
        }));

        setQuickBubble(`📋 New RFQ match: ${productCategory} (${quantity} units)`);
        show();

        setTimeout(() => setQuickBubble(null), 5000);
      })
    );

    // Restock needed
    unsubscribes.push(
      aiEventBus.on('RESTOCK_NEEDED', (event) => {
        // Aggregate for summary
        setSummary(prev => ({
          ...prev,
          lowStockItems: prev.lowStockItems + 1,
          riskLevel: prev.lowStockItems > 3 ? 'high' : prev.lowStockItems > 1 ? 'medium' : 'low',
        }));
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, [show]);

  // Generate restock order
  const generateRestockOrder = async (alert: InventoryAlert) => {
    setPendingAction({
      type: 'restock',
      data: {
        productId: alert.productId,
        quantity: alert.suggestedRestock,
      },
    });

    logAIAction({
      characterId: 'CYBER_WUKONG',
      action: 'suggest_restock',
      event: {
        type: 'INVENTORY_LOW',
        route: `/${locale}/cockpit/inventory`,
        payload: { productId: alert.productId },
        timestamp: Date.now(),
        correlationId: `restock-${alert.id}`,
      },
      result: {
        success: true,
        characterId: 'CYBER_WUKONG',
        action: 'suggest_restock',
        requiresApproval: true,
        data: {
          productId: alert.productId,
          suggestedQuantity: alert.suggestedRestock,
        },
      },
      userApproved: null,
    });
  };

  // Confirm restock
  const confirmRestock = () => {
    if (!pendingAction || pendingAction.type !== 'restock') return;

    logAIAction({
      characterId: 'CYBER_WUKONG',
      action: 'create_restock_order',
      event: {
        type: 'INVENTORY_LOW',
        route: `/${locale}/cockpit/inventory`,
        payload: (pendingAction.data || {}) as Record<string, unknown>,
        timestamp: Date.now(),
        correlationId: `restock-confirmed-${Date.now()}`,
      },
      result: {
        success: true,
        characterId: 'CYBER_WUKONG',
        action: 'create_restock_order',
        requiresApproval: true,
      },
      userApproved: true,
    });

    // Remove the alert
    const data = pendingAction.data as { productId: string };
    setAlerts(prev => prev.filter(a => a.productId !== data.productId));
    setSummary(prev => ({
      ...prev,
      lowStockItems: Math.max(0, prev.lowStockItems - 1),
    }));
    
    setPendingAction(null);
    setQuickBubble('✅ Restock order created!');
    setTimeout(() => setQuickBubble(null), 3000);
  };

  // Cancel action
  const cancelAction = () => {
    logAIAction({
      characterId: 'CYBER_WUKONG',
      action: pendingAction?.type || 'unknown',
      event: {
        type: 'INVENTORY_LOW',
        route: `/${locale}/cockpit`,
        payload: (pendingAction?.data || {}) as Record<string, unknown>,
        timestamp: Date.now(),
        correlationId: `cancelled-${Date.now()}`,
      },
      result: {
        success: false,
        characterId: 'CYBER_WUKONG',
        action: pendingAction?.type || 'unknown',
        requiresApproval: true,
        error: 'User cancelled',
      },
      userApproved: false,
    });
    
    setPendingAction(null);
  };

  // Quick bubble notification
  if (quickBubble && !state.muted) {
    return (
      <CharacterBubble
        character={character}
        message={quickBubble}
        onDismiss={() => setQuickBubble(null)}
        autoHide={5000}
      />
    );
  }

  if (!state.visible || state.muted) return null;

  return (
    <CharacterPanel
      character={character}
      title="Operations Dashboard"
      visible={state.visible}
      onClose={hide}
      position="right"
    >
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`text-center p-2 rounded-lg ${
            summary.lowStockItems > 0 ? 'bg-red-500/20' : 'bg-slate-700/50'
          }`}>
            <Package className={`w-5 h-5 mx-auto mb-1 ${
              summary.lowStockItems > 0 ? 'text-red-400' : 'text-slate-400'
            }`} />
            <div className="text-lg font-bold text-slate-200">{summary.lowStockItems}</div>
            <div className="text-xs text-slate-400">Low Stock</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${
            summary.pendingRFQs > 0 ? 'bg-amber-500/20' : 'bg-slate-700/50'
          }`}>
            <FileText className={`w-5 h-5 mx-auto mb-1 ${
              summary.pendingRFQs > 0 ? 'text-amber-400' : 'text-slate-400'
            }`} />
            <div className="text-lg font-bold text-slate-200">{summary.pendingRFQs}</div>
            <div className="text-xs text-slate-400">RFQ Matches</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-700/50">
            <BarChart3 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <div className="text-lg font-bold text-slate-200">{summary.todayOrders}</div>
            <div className="text-xs text-slate-400">Today</div>
          </div>
        </div>

        {/* Risk Level */}
        <div className={`rounded-lg p-3 flex items-center justify-between ${
          summary.riskLevel === 'high' ? 'bg-red-500/20' :
          summary.riskLevel === 'medium' ? 'bg-amber-500/20' :
          'bg-emerald-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${
              summary.riskLevel === 'high' ? 'text-red-400' :
              summary.riskLevel === 'medium' ? 'text-amber-400' :
              'text-emerald-400'
            }`} />
            <span className="text-sm font-medium text-slate-200">Risk Level</span>
          </div>
          <span className={`text-sm font-bold uppercase ${
            summary.riskLevel === 'high' ? 'text-red-400' :
            summary.riskLevel === 'medium' ? 'text-amber-400' :
            'text-emerald-400'
          }`}>
            {summary.riskLevel}
          </span>
        </div>

        {/* Pending Action Confirmation */}
        <AnimatePresence>
          {pendingAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
            >
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-400" />
                Confirm Action
              </h4>
              {pendingAction.type === 'restock' && (
                <p className="text-sm text-slate-300 mb-3">
                  Create restock order for {(pendingAction.data as { quantity: number }).quantity} units?
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={confirmRestock}
                  className="flex-1 btn-primary bg-emerald-500 hover:bg-emerald-600 text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelAction}
                  className="flex-1 btn-ghost text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inventory Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Package className="w-4 h-4 text-red-400" />
              Stock Alerts
            </h4>
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-500/20' : 'bg-amber-500/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-200">{alert.productName}</p>
                    <p className="text-sm text-slate-400">
                      {alert.currentStock} in stock
                    </p>
                  </div>
                  <button
                    onClick={() => generateRestockOrder(alert)}
                    disabled={!!pendingAction}
                    className="btn-ghost text-xs py-1 px-2 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Restock +{alert.suggestedRestock}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RFQ Matches */}
        {rfqMatches.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              RFQ Opportunities
            </h4>
            {rfqMatches.map(match => (
              <div key={match.rfqId} className="p-3 rounded-lg bg-amber-500/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-200">{match.productCategory}</p>
                    <p className="text-sm text-slate-400">
                      {match.quantity} units • {match.buyerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    Suggested: <span className="font-bold text-amber-400">¥{match.suggestedBid}</span>
                  </span>
                  <button className="btn-ghost text-xs py-1 px-2">
                    Create Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {alerts.length === 0 && rfqMatches.length === 0 && (
          <div className="text-center py-6">
            <Zap className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-sm text-slate-400">All systems operational</p>
          </div>
        )}

        {/* Help text */}
        <p className="text-xs text-slate-500 text-center">
          {character.displayName} monitors your inventory and opportunities 24/7
        </p>
      </div>
    </CharacterPanel>
  );
}

// Inventory status indicator for cockpit
export function WukongInventoryStatus({ 
  lowStockCount = 0, 
  criticalCount = 0 
}: { 
  lowStockCount?: number;
  criticalCount?: number;
}) {
  if (lowStockCount === 0 && criticalCount === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
        <Package className="w-3 h-3" />
        Stock OK
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
      criticalCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
    }`}>
      <AlertTriangle className="w-3 h-3" />
      {criticalCount > 0 ? `${criticalCount} Critical` : `${lowStockCount} Low`}
    </span>
  );
}
