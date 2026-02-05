"use client";

/**
 * 🦛 HUNGRY_HIPPO - The Payment Guardian
 * Prevents order issues: double orders, payment confusion, post-checkout guidance
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  FileText,
  ArrowRight,
  RefreshCw 
} from 'lucide-react';
import { getCharacter } from '@/lib/ai/registry';
import { aiEventBus } from '@/lib/ai/event-bus';
import { logAIAction } from '@/lib/ai/logger';
import { CharacterAvatar, CharacterPanel, useCharacterUI } from './CharacterBase';
import type { AIEvent } from '@/lib/ai/types';

const character = getCharacter('HUNGRY_HIPPO');

interface HungryHippoProps {
  locale: string;
  orderId?: string;
}

type GuardianState = 
  | 'idle'
  | 'payment_pending'
  | 'payment_success'
  | 'payment_failed'
  | 'order_created'
  | 'duplicate_warning';

interface GuardianMessage {
  icon: typeof Shield;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  actions?: Array<{ label: string; route: string; primary?: boolean }>;
}

export function HungryHippo({ locale, orderId }: HungryHippoProps) {
  const router = useRouter();
  const { state, show, hide } = useCharacterUI('HUNGRY_HIPPO');
  const [guardianState, setGuardianState] = useState<GuardianState>('idle');
  const [currentMessage, setCurrentMessage] = useState<GuardianMessage | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  // Prevent duplicate order on refresh
  useEffect(() => {
    if (typeof window !== 'undefined' && orderId) {
      const storedOrderId = sessionStorage.getItem('last_completed_order');
      
      if (storedOrderId === orderId) {
        // User refreshed the success page
        setRefreshAttempts(prev => prev + 1);
        
        if (refreshAttempts > 0) {
          setGuardianState('duplicate_warning');
          setCurrentMessage({
            icon: AlertTriangle,
            title: 'Already Completed',
            message: 'This order has already been placed. No need to worry, your payment went through successfully!',
            type: 'warning',
            actions: [
              { label: 'View Order', route: `/${locale}/orders/${orderId}`, primary: true },
              { label: 'Back to Shop', route: `/${locale}` },
            ],
          });
          show();
        }
      } else {
        sessionStorage.setItem('last_completed_order', orderId);
      }
    }
  }, [orderId, locale, show, refreshAttempts]);

  // Listen for payment events
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Payment pending
    unsubscribes.push(
      aiEventBus.on('PAYMENT_PENDING', (event) => {
        setGuardianState('payment_pending');
        setCurrentMessage({
          icon: RefreshCw,
          title: 'Processing Payment',
          message: 'Hold tight! Your payment is being processed. Please don\'t refresh or close this page.',
          type: 'info',
        });
        show();
        
        logAIAction({
          characterId: 'HUNGRY_HIPPO',
          action: 'payment_guidance',
          event,
          result: {
            success: true,
            characterId: 'HUNGRY_HIPPO',
            action: 'payment_guidance',
            requiresApproval: false,
          },
        });
      })
    );

    // Payment success
    unsubscribes.push(
      aiEventBus.on('PAYMENT_SUCCESS', (event) => {
        const eventOrderId = event.payload.orderId as string;
        setLastOrderId(eventOrderId);
        setGuardianState('payment_success');
        setCurrentMessage({
          icon: CheckCircle,
          title: 'Payment Successful! 🎉',
          message: 'Your order is confirmed. The maker has been notified and will start preparing your items.',
          type: 'success',
          actions: [
            { label: 'Track Order', route: `/${locale}/orders/${eventOrderId}`, primary: true },
            { label: 'View Invoice', route: `/${locale}/orders/${eventOrderId}/invoice` },
          ],
        });
        show();
      })
    );

    // Payment failed
    unsubscribes.push(
      aiEventBus.on('PAYMENT_FAILED', (event) => {
        const reason = event.payload.reason as string;
        setGuardianState('payment_failed');
        setCurrentMessage({
          icon: AlertTriangle,
          title: 'Payment Issue',
          message: `We couldn't process your payment: ${reason}. Don't worry, you can try again.`,
          type: 'warning',
          actions: [
            { label: 'Try Again', route: `/${locale}/checkout`, primary: true },
            { label: 'Contact Support', route: `/${locale}/support` },
          ],
        });
        show();
      })
    );

    // Order created
    unsubscribes.push(
      aiEventBus.on('ORDER_CREATED', (event) => {
        const eventOrderId = event.payload.orderId as string;
        setLastOrderId(eventOrderId);
        setGuardianState('order_created');
        
        logAIAction({
          characterId: 'HUNGRY_HIPPO',
          action: 'prevent_duplicate',
          event,
          result: {
            success: true,
            characterId: 'HUNGRY_HIPPO',
            action: 'prevent_duplicate',
            requiresApproval: false,
            data: { orderId: eventOrderId },
          },
        });
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, [locale, show]);

  if (!currentMessage || !state.visible || state.muted) return null;

  const Icon = currentMessage.icon;

  return (
    <CharacterPanel
      character={character}
      title="Payment Guardian"
      visible={state.visible}
      onClose={hide}
      position="right"
    >
      <div className="space-y-4">
        {/* Status Icon */}
        <div className={`flex items-center gap-3 p-3 rounded-lg ${
          currentMessage.type === 'success' ? 'bg-emerald-500/10' :
          currentMessage.type === 'warning' ? 'bg-amber-500/10' :
          'bg-sky-500/10'
        }`}>
          <motion.div
            animate={guardianState === 'payment_pending' ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: guardianState === 'payment_pending' ? Infinity : 0, ease: 'linear' }}
          >
            <Icon className={`w-8 h-8 ${
              currentMessage.type === 'success' ? 'text-emerald-400' :
              currentMessage.type === 'warning' ? 'text-amber-400' :
              'text-sky-400'
            }`} />
          </motion.div>
          <div>
            <h4 className="font-semibold text-slate-200">{currentMessage.title}</h4>
          </div>
        </div>

        {/* Message */}
        <p className="text-slate-300 text-sm leading-relaxed">
          {currentMessage.message}
        </p>

        {/* Order Details (if available) */}
        {lastOrderId && guardianState === 'payment_success' && (
          <div className="bg-slate-800/50 rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Order ID</span>
              <code className="text-emerald-400">{lastOrderId.slice(0, 12)}...</code>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Protected by Escrow
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        {currentMessage.actions && (
          <div className="flex flex-col gap-2">
            {currentMessage.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.route)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  action.primary
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-900'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {action.label}
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="border-t border-slate-700 pt-3 mt-3">
          <p className="text-xs text-slate-500">
            💡 Tip: Your payment is protected by BandaChao Escrow. Funds are only released when you confirm receipt.
          </p>
        </div>
      </div>
    </CharacterPanel>
  );
}

// Success page companion widget
export function HungryHippoSuccess({ orderId, locale }: { orderId: string; locale: string }) {
  const router = useRouter();

  return (
    <motion.div
      className="glass-card p-6 max-w-md mx-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.4 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <CharacterAvatar character={character} size="lg" />
        <div>
          <h3 className="text-xl font-bold text-slate-200">Order Confirmed!</h3>
          <p className="text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Payment verified
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-300">
          <Package className="w-5 h-5 text-emerald-400" />
          <span>Your maker has been notified</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Payment held in secure escrow</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <FileText className="w-5 h-5 text-emerald-400" />
          <span>Invoice sent to your email</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/${locale}/orders/${orderId}`)}
          className="flex-1 btn-primary bg-emerald-500 hover:bg-emerald-600 text-slate-900"
        >
          Track Order
        </button>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="btn-ghost"
        >
          Keep Shopping
        </button>
      </div>
    </motion.div>
  );
}
