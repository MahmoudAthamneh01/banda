"use client";

/**
 * 🐱 DEAL_CAT - The Deal Hunter
 * Boosts conversion: notices hesitation, offers smart discounts, suggests bundles
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Gift, Percent, X, Sparkles } from 'lucide-react';
import { getCharacter } from '@/lib/ai/registry';
import { aiEventBus } from '@/lib/ai/event-bus';
import { logAIAction } from '@/lib/ai/logger';
import { CharacterAvatar, useCharacterUI } from './CharacterBase';
import type { AIEvent } from '@/lib/ai/types';

const character = getCharacter('DEAL_CAT');

interface DealCatProps {
  locale: string;
  cartValue?: number;
  productId?: string;
}

interface DealOffer {
  type: 'discount' | 'bundle' | 'freeShipping';
  code?: string;
  value?: number;
  message: string;
  products?: Array<{ id: string; name: string; price: number }>;
}

export function DealCat({ locale, cartValue = 0, productId }: DealCatProps) {
  const { state, show, hide, mute } = useCharacterUI('DEAL_CAT');
  const [currentOffer, setCurrentOffer] = useState<DealOffer | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [triggerEvent, setTriggerEvent] = useState<AIEvent | null>(null);

  // Handle offer acceptance
  const handleAcceptOffer = useCallback(() => {
    if (currentOffer && triggerEvent) {
      // Log the action
      logAIAction({
        characterId: 'DEAL_CAT',
        action: 'apply_discount',
        event: triggerEvent,
        result: {
          success: true,
          characterId: 'DEAL_CAT',
          action: 'apply_discount',
          requiresApproval: true,
          data: { code: currentOffer.code },
        },
        userApproved: true,
        inputSnapshot: { cartValue, productId, offer: currentOffer },
      });

      // In production: apply the discount via API
      console.log(`[DealCat] 🎉 Applied offer: ${currentOffer.code}`);
      
      setShowPopover(false);
      hide();
    }
  }, [currentOffer, triggerEvent, cartValue, productId, hide]);

  // Handle offer decline
  const handleDeclineOffer = useCallback(() => {
    if (currentOffer && triggerEvent) {
      logAIAction({
        characterId: 'DEAL_CAT',
        action: 'offer_declined',
        event: triggerEvent,
        result: {
          success: true,
          characterId: 'DEAL_CAT',
          action: 'offer_declined',
          requiresApproval: false,
        },
        userApproved: false,
        inputSnapshot: { cartValue, productId, offer: currentOffer },
      });
    }
    
    setShowPopover(false);
    hide();
  }, [currentOffer, triggerEvent, cartValue, productId, hide]);

  // Listen for relevant events
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Product dwell - user hesitating
    unsubscribes.push(
      aiEventBus.on('PRODUCT_DWELL', (event) => {
        const dwellSeconds = event.payload.dwellSeconds as number;
        
        // Only trigger if dwelling 5+ seconds (hesitation)
        if (dwellSeconds >= 5) {
          setTriggerEvent(event);
          setCurrentOffer({
            type: 'discount',
            code: 'CAT10',
            value: 10,
            message: `Still deciding? Here's 10% off! 😺`,
          });
          setShowPopover(true);
          show();
        }
      })
    );

    // Cart abandoned - exit intent
    unsubscribes.push(
      aiEventBus.on('CART_ABANDONED', (event) => {
        const value = event.payload.cartValue as number;
        
        if (value > 0) {
          setTriggerEvent(event);
          
          if (value > 100) {
            setCurrentOffer({
              type: 'freeShipping',
              code: 'FREESHIP',
              message: `Wait! Free shipping on your ¥${value.toFixed(0)} order! 📦`,
            });
          } else {
            setCurrentOffer({
              type: 'discount',
              code: 'COMEBACK5',
              value: 5,
              message: `Don't leave empty-pawed! 5% off just for you 🐱`,
            });
          }
          
          setShowPopover(true);
          show();
        }
      })
    );

    // Checkout exit intent
    unsubscribes.push(
      aiEventBus.on('CHECKOUT_EXIT_INTENT', (event) => {
        setTriggerEvent(event);
        setCurrentOffer({
          type: 'discount',
          code: 'LASTCHANCE15',
          value: 15,
          message: `Final offer! 15% off if you complete now 🎁`,
        });
        setShowPopover(true);
        show();
      })
    );

    // Remove from cart - offer bundle instead
    unsubscribes.push(
      aiEventBus.on('REMOVE_FROM_CART', (event) => {
        const productId = event.payload.productId as string;
        
        // 50% chance to show bundle suggestion
        if (Math.random() > 0.5) {
          setTriggerEvent(event);
          setCurrentOffer({
            type: 'bundle',
            message: `How about a bundle deal instead? 🎀`,
            products: [
              { id: productId, name: 'Original item', price: 50 },
              { id: `${productId}-bundle`, name: 'Matching accessory', price: 15 },
            ],
          });
          setShowPopover(true);
          show();
        }
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, [show]);

  if (state.muted || !showPopover || !currentOffer) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0, transition: { type: 'spring', bounce: 0.5 } }}
        exit={{ scale: 0, y: 20 }}
      >
        <div className="glass-card p-5 max-w-sm shadow-2xl border-amber-500/30">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <CharacterAvatar character={character} size="md" />
              <div>
                <span className="text-amber-400 font-semibold">
                  {character.displayName}
                </span>
                <p className="text-xs text-slate-400">Deal Hunter</p>
              </div>
            </div>
            <button
              onClick={handleDeclineOffer}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-slate-200 text-lg mb-4">
            {currentOffer.message}
          </p>

          {/* Offer Details */}
          <div className="bg-amber-500/10 rounded-lg p-4 mb-4">
            {currentOffer.type === 'discount' && currentOffer.code && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-200">
                    {currentOffer.value}% OFF
                  </span>
                </div>
                <code className="bg-slate-800 px-3 py-1 rounded text-amber-400 font-mono">
                  {currentOffer.code}
                </code>
              </div>
            )}

            {currentOffer.type === 'freeShipping' && (
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="text-slate-200">Free Shipping</span>
                <code className="ml-auto bg-slate-800 px-3 py-1 rounded text-amber-400 font-mono">
                  {currentOffer.code}
                </code>
              </div>
            )}

            {currentOffer.type === 'bundle' && currentOffer.products && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Bundle Deal</span>
                </div>
                {currentOffer.products.map(product => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">{product.name}</span>
                    <span className="text-slate-400">¥{product.price}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="text-slate-200 font-medium">Bundle Price</span>
                  <span className="text-amber-400 font-bold">
                    ¥{(currentOffer.products.reduce((sum, p) => sum + p.price, 0) * 0.9).toFixed(0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAcceptOffer}
              className="flex-1 btn-primary bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              <Tag className="w-4 h-4 mr-2" />
              Apply Deal
            </button>
            <button
              onClick={handleDeclineOffer}
              className="btn-ghost text-slate-400"
            >
              No thanks
            </button>
          </div>

          {/* Mute option */}
          <button
            onClick={() => {
              mute();
              setShowPopover(false);
            }}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-400 mt-3"
          >
            Don't show deals for today
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact deal badge for product cards
export function DealCatBadge({ discount }: { discount: number }) {
  return (
    <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
      <span>{character.emoji}</span>
      <span>-{discount}%</span>
    </div>
  );
}
