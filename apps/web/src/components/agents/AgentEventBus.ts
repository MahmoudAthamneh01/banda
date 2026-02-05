/**
 * AgentEventBus - Event-driven communication system for AI agents
 * 
 * Allows components to emit events that trigger agents to appear
 * Implements pub/sub pattern for loose coupling
 */

import type { AgentTrigger } from './AgentRegistry';

export type AgentEventType =
  | 'AGENT_TRIGGER' // Generic agent trigger
  | 'DEAL_CAT_TRIGGER' // Negotiation needed
  | 'LOW_STOCK_ALERT' // Inventory low
  | 'EXIT_INTENT' // User leaving
  | 'TRUST_SCORE_CHECK' // Check seller trust
  | 'DISPUTE_OPENED' // New dispute
  | 'FIRST_VISIT' // New user
  | 'IDLE_CART' // Cart abandoned
  | 'STYLE_QUESTION' // Fashion query
  | 'RED_PACKET_READY' // Reward available
  | 'AGENT_DISMISS' // User closed agent
  | 'AGENT_ACTION'; // Agent performed action

export interface AgentEvent {
  type: AgentEventType;
  trigger?: AgentTrigger;
  agentId?: string;
  payload?: Record<string, any>;
  timestamp: number;
}

export type EventListener = (event: AgentEvent) => void;

/**
 * Singleton event bus for agent communication
 */
class AgentEventBusClass {
  private listeners: Map<AgentEventType, Set<EventListener>> = new Map();
  private eventHistory: AgentEvent[] = [];
  private maxHistorySize = 100;

  /**
   * Subscribe to an event type
   */
  on(eventType: AgentEventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => this.off(eventType, listener);
  }

  /**
   * Unsubscribe from an event type
   */
  off(eventType: AgentEventType, listener: EventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit(eventType: AgentEventType, payload?: Record<string, any>): void {
    const event: AgentEvent = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify listeners
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error('[AgentEventBus] Listener error:', error);
        }
      });
    }

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[AgentEventBus]', eventType, payload);
    }
  }

  /**
   * Trigger an agent to appear
   */
  triggerAgent(
    trigger: AgentTrigger,
    agentId?: string,
    payload?: Record<string, any>
  ): void {
    this.emit('AGENT_TRIGGER', {
      trigger,
      agentId,
      ...payload,
    });
  }

  /**
   * Dismiss an agent
   */
  dismissAgent(agentId: string, reason?: string): void {
    this.emit('AGENT_DISMISS', {
      agentId,
      reason,
    });
  }

  /**
   * Record agent action
   */
  recordAction(agentId: string, action: string, data?: Record<string, any>): void {
    this.emit('AGENT_ACTION', {
      agentId,
      action,
      ...data,
    });
  }

  /**
   * Get recent event history
   */
  getHistory(limit?: number): AgentEvent[] {
    return limit
      ? this.eventHistory.slice(-limit)
      : [...this.eventHistory];
  }

  /**
   * Clear all listeners (use for cleanup)
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get active listener count
   */
  getListenerCount(): number {
    let count = 0;
    this.listeners.forEach((set) => (count += set.size));
    return count;
  }
}

// Export singleton instance
export const AgentEventBus = new AgentEventBusClass();

/**
 * React hook for subscribing to agent events
 */
import { useEffect, useCallback } from 'react';

export function useAgentEvent(
  eventType: AgentEventType,
  handler: EventListener
): void {
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    const unsubscribe = AgentEventBus.on(eventType, memoizedHandler);
    return unsubscribe;
  }, [eventType, memoizedHandler]);
}

/**
 * React hook for triggering agents
 */
export function useAgentTrigger() {
  return {
    trigger: useCallback(
      (trigger: AgentTrigger, agentId?: string, payload?: Record<string, any>) => {
        AgentEventBus.triggerAgent(trigger, agentId, payload);
      },
      []
    ),
    dismiss: useCallback((agentId: string, reason?: string) => {
      AgentEventBus.dismissAgent(agentId, reason);
    }, []),
    recordAction: useCallback(
      (agentId: string, action: string, data?: Record<string, any>) => {
        AgentEventBus.recordAction(agentId, action, data);
      },
      []
    ),
  };
}
