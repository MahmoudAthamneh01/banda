/**
 * AI Event Bus - The nervous system
 * Connects events to AI characters
 */

import type { AIEvent, AIEventType, AICharacterId } from './types';
import { getCharactersForEvent } from './registry';

// Simple ID generator to avoid nanoid dependency
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

type EventCallback = (event: AIEvent) => void;
type UnsubscribeFn = () => void;

interface EventSubscription {
  id: string;
  eventType: AIEventType | '*';
  characterId?: AICharacterId;
  callback: EventCallback;
}

export class AIEventBus {
  private subscriptions: EventSubscription[] = [];
  private eventHistory: AIEvent[] = [];
  private maxHistory = 100;

  /**
   * Emit an event to all subscribed listeners
   */
  emit(type: AIEventType, payload: Record<string, unknown> = {}, route: string = '/'): AIEvent {
    const event: AIEvent = {
      type,
      route,
      payload,
      timestamp: Date.now(),
      correlationId: generateId(),
    };

    // Add actor info if available (will be injected from auth context)
    if (typeof window !== 'undefined') {
      const actorId = (window as unknown as { __bandaUserId?: string }).__bandaUserId;
      const role = (window as unknown as { __bandaUserRole?: string }).__bandaUserRole;
      if (actorId) event.actorId = actorId;
      if (role) event.role = role;
    }

    // Store in history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.pop();
    }

    // Notify all relevant subscribers
    this.subscriptions.forEach(sub => {
      if (sub.eventType === '*' || sub.eventType === type) {
        try {
          sub.callback(event);
        } catch (error) {
          console.error(`[AIEventBus] Error in subscription ${sub.id}:`, error);
        }
      }
    });

    // Log for debugging in dev
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AIEventBus] 📡 ${type}`, { payload, route, correlationId: event.correlationId });
    }

    return event;
  }

  /**
   * Subscribe to specific event types
   */
  on(eventType: AIEventType | '*', callback: EventCallback, characterId?: AICharacterId): UnsubscribeFn {
    const subscription: EventSubscription = {
      id: generateId(),
      eventType,
      characterId,
      callback,
    };

    this.subscriptions.push(subscription);

    return () => {
      this.subscriptions = this.subscriptions.filter(sub => sub.id !== subscription.id);
    };
  }

  /**
   * Subscribe to events for a specific character
   */
  onCharacterTrigger(characterId: AICharacterId, callback: EventCallback): UnsubscribeFn {
    return this.on('*', (event) => {
      const characters = getCharactersForEvent(event.type);
      if (characters.some(c => c.id === characterId)) {
        callback(event);
      }
    }, characterId);
  }

  /**
   * Get recent event history
   */
  getHistory(limit = 20): AIEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  /**
   * Get events of a specific type
   */
  getEventsByType(type: AIEventType, limit = 10): AIEvent[] {
    return this.eventHistory.filter(e => e.type === type).slice(0, limit);
  }

  /**
   * Clear all subscriptions (useful for cleanup)
   */
  clearSubscriptions(): void {
    this.subscriptions = [];
  }

  /**
   * Get subscription count (for debugging)
   */
  getSubscriptionCount(): number {
    return this.subscriptions.length;
  }
}

// Singleton instance
export const aiEventBus = new AIEventBus();

// Convenience functions for common events
export const aiEvents = {
  // User lifecycle
  userFirstVisit: () => aiEventBus.emit('USER_FIRST_VISIT', {}),
  userLogin: (userId: string) => aiEventBus.emit('USER_LOGIN', { userId }),
  userLogout: () => aiEventBus.emit('USER_LOGOUT', {}),
  userIdle: (idleSeconds: number) => aiEventBus.emit('USER_IDLE', { idleSeconds }),

  // Navigation
  navigate: (from: string, to: string) => aiEventBus.emit('NAVIGATION', { from, to }, to),
  tabChanged: (tab: string) => aiEventBus.emit('TAB_CHANGED', { tab }),

  // Shopping
  productViewed: (productId: string, price: number) => 
    aiEventBus.emit('PRODUCT_VIEWED', { productId, price }),
  productDwell: (productId: string, dwellSeconds: number) => 
    aiEventBus.emit('PRODUCT_DWELL', { productId, dwellSeconds }),
  addToCart: (productId: string, quantity: number, price: number) => 
    aiEventBus.emit('ADD_TO_CART', { productId, quantity, price }),
  removeFromCart: (productId: string) => 
    aiEventBus.emit('REMOVE_FROM_CART', { productId }),
  cartAbandoned: (cartValue: number, itemCount: number) => 
    aiEventBus.emit('CART_ABANDONED', { cartValue, itemCount }),

  // Checkout
  checkoutStarted: (cartValue: number) => 
    aiEventBus.emit('CHECKOUT_STARTED', { cartValue }),
  checkoutExitIntent: () => 
    aiEventBus.emit('CHECKOUT_EXIT_INTENT', {}),
  paymentPending: (orderId: string, amount: number) => 
    aiEventBus.emit('PAYMENT_PENDING', { orderId, amount }),
  paymentSuccess: (orderId: string, amount: number) => 
    aiEventBus.emit('PAYMENT_SUCCESS', { orderId, amount }),
  paymentFailed: (orderId: string, reason: string) => 
    aiEventBus.emit('PAYMENT_FAILED', { orderId, reason }),
  orderCreated: (orderId: string) => 
    aiEventBus.emit('ORDER_CREATED', { orderId }),
  orderSuccess: (orderId: string) => 
    aiEventBus.emit('ORDER_SUCCESS', { orderId }),

  // Disputes
  disputeOpened: (disputeId: string, orderId: string, reason: string) => 
    aiEventBus.emit('DISPUTE_OPENED', { disputeId, orderId, reason }),
  disputeEvidenceUploaded: (disputeId: string, evidenceType: string) => 
    aiEventBus.emit('DISPUTE_EVIDENCE_UPLOADED', { disputeId, evidenceType }),
  disputeResponse: (disputeId: string, responderId: string) => 
    aiEventBus.emit('DISPUTE_RESPONSE', { disputeId, responderId }),

  // RFQ & Business
  rfqCreated: (rfqId: string, category: string) => 
    aiEventBus.emit('RFQ_CREATED', { rfqId, category }),
  rfqMatched: (rfqId: string, matchedMakerId: string) => 
    aiEventBus.emit('RFQ_MATCHED', { rfqId, matchedMakerId }),

  // Inventory
  inventoryLow: (productId: string, currentStock: number, threshold: number) => 
    aiEventBus.emit('INVENTORY_LOW', { productId, currentStock, threshold }),
  inventoryCritical: (productId: string, currentStock: number) => 
    aiEventBus.emit('INVENTORY_CRITICAL', { productId, currentStock }),

  // Platform
  flashDropStarted: (dropId: string, productCount: number) => 
    aiEventBus.emit('FLASH_DROP_STARTED', { dropId, productCount }),
  trendingProduct: (productId: string, interactionCount: number) => 
    aiEventBus.emit('TRENDING_PRODUCT', { productId, interactionCount }),

  // Onboarding
  onboardingStarted: (userId: string) => 
    aiEventBus.emit('ONBOARDING_STARTED', { userId }),
  onboardingStepCompleted: (step: number, totalSteps: number) => 
    aiEventBus.emit('ONBOARDING_STEP_COMPLETED', { step, totalSteps }),
  kycIncomplete: (missingFields: string[]) => 
    aiEventBus.emit('KYC_INCOMPLETE', { missingFields }),
  kycSubmitted: (userId: string) => 
    aiEventBus.emit('KYC_SUBMITTED', { userId }),
  kycApproved: (userId: string) => 
    aiEventBus.emit('KYC_APPROVED', { userId }),
};
