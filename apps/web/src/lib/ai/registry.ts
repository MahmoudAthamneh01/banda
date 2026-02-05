/**
 * AI Agent Registry - The character directory
 * Each character has a clear role, style, and permissions
 */

import type { AICharacter, AICharacterId } from './types';

// 🐦 CHATTY_BIRD - The Social Messenger
const CHATTY_BIRD: AICharacter = {
  id: 'CHATTY_BIRD',
  displayName: 'Chatty Bird',
  emoji: '🐦',
  role: 'Social Messenger',
  description: 'Delivers platform pulse: trends, market activity, quick signals to important pages',
  surfaces: ['home', 'feed', 'square'],
  triggers: [
    'USER_FIRST_VISIT',
    'USER_IDLE',
    'TAB_CHANGED',
    'FLASH_DROP_STARTED',
    'TRENDING_PRODUCT',
  ],
  capabilities: ['suggest_navigation', 'show_insights'],
  permissionLevel: 'AUTO',
  tone: 'Friendly, brief, informative. Uses emojis sparingly. Never pushy.',
  styleTokens: {
    primaryColor: '#60A5FA', // sky-400
    accentColor: '#3B82F6', // blue-500
    motionSignature: 'float',
    soundEnabled: false,
  },
};

// 🐱 DEAL_CAT - The Deal Hunter
const DEAL_CAT: AICharacter = {
  id: 'DEAL_CAT',
  displayName: 'Deal Cat',
  emoji: '🐱',
  role: 'Deal Hunter',
  description: 'Boosts conversion: notices hesitation, offers smart discounts, suggests bundles',
  surfaces: ['product', 'cart', 'checkout'],
  triggers: [
    'PRODUCT_DWELL',
    'CART_ABANDONED',
    'REMOVE_FROM_CART',
    'CHECKOUT_EXIT_INTENT',
    'ADD_TO_CART',
  ],
  capabilities: ['offer_discount', 'suggest_bundle', 'apply_coupon'],
  permissionLevel: 'USER',
  tone: 'Playful, persuasive but not annoying. Respects "no thanks".',
  styleTokens: {
    primaryColor: '#F59E0B', // amber-500
    accentColor: '#D97706', // amber-600
    motionSignature: 'bounce',
    soundEnabled: false,
  },
};

// 🦛 HUNGRY_HIPPO - The Payment Guardian
const HUNGRY_HIPPO: AICharacter = {
  id: 'HUNGRY_HIPPO',
  displayName: 'Hungry Hippo',
  emoji: '🦛',
  role: 'Payment Guardian',
  description: 'Prevents order issues: double orders, payment confusion, post-checkout guidance',
  surfaces: ['checkout', 'checkout-success', 'order-detail'],
  triggers: [
    'PAYMENT_PENDING',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'ORDER_CREATED',
    'ORDER_SUCCESS',
  ],
  capabilities: ['track_order', 'prevent_duplicate', 'payment_guidance'],
  permissionLevel: 'AUTO',
  tone: 'Reassuring, clear, protective. Uses simple language for complex payment flows.',
  styleTokens: {
    primaryColor: '#10B981', // emerald-500
    accentColor: '#059669', // emerald-600
    motionSignature: 'slide',
    soundEnabled: false,
  },
};

// 🐒 MAGISTRATE_MANDRILL - The Judge
const MAGISTRATE_MANDRILL: AICharacter = {
  id: 'MAGISTRATE_MANDRILL',
  displayName: 'Magistrate Mandrill',
  emoji: '🐒',
  role: 'Dispute Judge',
  description: 'Handles disputes: analyzes complaints, summarizes evidence, proposes fair rulings',
  surfaces: ['disputes', 'dispute-detail', 'order-detail', 'throne'],
  triggers: [
    'DISPUTE_OPENED',
    'DISPUTE_EVIDENCE_UPLOADED',
    'DISPUTE_RESPONSE',
  ],
  capabilities: ['summarize_case', 'extract_claims', 'propose_ruling', 'flag_evidence'],
  permissionLevel: 'NUCLEAR', // For ruling execution
  tone: 'Formal, impartial, thorough. Uses legal-adjacent language but remains accessible.',
  styleTokens: {
    primaryColor: '#8B5CF6', // violet-500
    accentColor: '#7C3AED', // violet-600
    motionSignature: 'fade',
    soundEnabled: false,
  },
};

// 🐉 CYBER_WUKONG - The Operations Guardian
const CYBER_WUKONG: AICharacter = {
  id: 'CYBER_WUKONG',
  displayName: 'Cyber Wukong',
  emoji: '🐉',
  role: 'Operations Guardian',
  description: 'Maker intelligence: inventory alerts, RFQ matching, pricing suggestions, risk warnings',
  surfaces: ['cockpit-inventory', 'cockpit-rfq', 'cockpit-orders'],
  triggers: [
    'INVENTORY_LOW',
    'INVENTORY_CRITICAL',
    'RFQ_MATCHED',
    'ORDER_STATUS_CHANGED',
    'RESTOCK_NEEDED',
  ],
  capabilities: ['generate_restock', 'suggest_pricing', 'warn_risk', 'create_draft_bid'],
  permissionLevel: 'USER',
  tone: 'Strategic, data-driven, proactive. Speaks like a trusted operations advisor.',
  styleTokens: {
    primaryColor: '#EF4444', // red-500
    accentColor: '#DC2626', // red-600
    motionSignature: 'pulse',
    soundEnabled: false,
  },
};

// 🐼 HOST_PANDA - The Guide
const HOST_PANDA: AICharacter = {
  id: 'HOST_PANDA',
  displayName: 'Host Panda',
  emoji: '🐼',
  role: 'Onboarding Guide',
  description: 'Guides new users: step-by-step onboarding, KYC assistance, reduces drop-off',
  surfaces: ['onboarding', 'kyc', 'home'],
  triggers: [
    'USER_FIRST_VISIT',
    'ONBOARDING_STARTED',
    'ONBOARDING_STEP_COMPLETED',
    'KYC_INCOMPLETE',
  ],
  capabilities: ['show_checklist', 'explain_benefits', 'link_docs'],
  permissionLevel: 'AUTO',
  tone: 'Warm, patient, encouraging. Never rushes. Celebrates small wins.',
  styleTokens: {
    primaryColor: '#22C55E', // green-500 (panda brand)
    accentColor: '#16A34A', // green-600
    motionSignature: 'wiggle',
    soundEnabled: false,
  },
};

// Complete registry
export const AI_REGISTRY: Record<AICharacterId, AICharacter> = {
  CHATTY_BIRD,
  DEAL_CAT,
  HUNGRY_HIPPO,
  MAGISTRATE_MANDRILL,
  CYBER_WUKONG,
  HOST_PANDA,
};

// Helper functions
export function getCharacter(id: AICharacterId): AICharacter {
  return AI_REGISTRY[id];
}

export function getCharactersForSurface(surface: string): AICharacter[] {
  return Object.values(AI_REGISTRY).filter(char => 
    char.surfaces.includes(surface as never)
  );
}

export function getCharactersForEvent(eventType: string): AICharacter[] {
  return Object.values(AI_REGISTRY).filter(char => 
    char.triggers.includes(eventType as never)
  );
}

export function canAutoExecute(character: AICharacter): boolean {
  return character.permissionLevel === 'AUTO';
}

export function requiresUserApproval(character: AICharacter): boolean {
  return character.permissionLevel === 'USER';
}

export function isNuclearAction(character: AICharacter): boolean {
  return character.permissionLevel === 'NUCLEAR';
}
