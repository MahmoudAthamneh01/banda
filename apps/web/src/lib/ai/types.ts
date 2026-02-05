/**
 * AI System Types - BandaChao AI Cast
 * Philosophy: AI as a cast of characters, not chatbots
 */

// Permission levels for AI actions
export type PermissionLevel = 'AUTO' | 'USER' | 'NUCLEAR';

// AI Character IDs
export type AICharacterId = 
  | 'CHATTY_BIRD'      // Social messenger
  | 'DEAL_CAT'         // Deal hunter
  | 'HUNGRY_HIPPO'     // Payment guardian
  | 'MAGISTRATE_MANDRILL' // Dispute judge
  | 'CYBER_WUKONG'     // Operations guardian
  | 'HOST_PANDA';      // Onboarding guide

// Event types that trigger AI responses
export type AIEventType =
  // User lifecycle
  | 'USER_FIRST_VISIT'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_ROLE_CHANGED'
  | 'USER_IDLE'
  // Navigation
  | 'NAVIGATION'
  | 'TAB_CHANGED'
  // Shopping
  | 'PRODUCT_VIEWED'
  | 'PRODUCT_DWELL'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'CART_UPDATED'
  | 'CART_ABANDONED'
  // Checkout
  | 'CHECKOUT_STARTED'
  | 'CHECKOUT_EXIT_INTENT'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'ORDER_CREATED'
  | 'ORDER_SUCCESS'
  | 'ORDER_STATUS_CHANGED'
  // Disputes
  | 'DISPUTE_OPENED'
  | 'DISPUTE_EVIDENCE_UPLOADED'
  | 'DISPUTE_RESPONSE'
  | 'DISPUTE_RESOLVED'
  // RFQ & Business
  | 'RFQ_CREATED'
  | 'RFQ_RESPONSE'
  | 'RFQ_MATCHED'
  // Inventory
  | 'INVENTORY_LOW'
  | 'INVENTORY_CRITICAL'
  | 'RESTOCK_NEEDED'
  // Platform
  | 'FLASH_DROP_STARTED'
  | 'TRENDING_PRODUCT'
  | 'PORTFOLIO_DROP'
  | 'FRAUD_FLAGGED'
  // Onboarding
  | 'ONBOARDING_STARTED'
  | 'ONBOARDING_STEP_COMPLETED'
  | 'ONBOARDING_STEP_COMPLETE' // Alias for convenience
  | 'KYC_INCOMPLETE'
  | 'KYC_SUBMITTED'
  | 'KYC_APPROVED';

// Where AI characters can appear
export type AISurface =
  | 'home'
  | 'feed'
  | 'square'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'checkout-success'
  | 'orders'
  | 'order-detail'
  | 'disputes'
  | 'dispute-detail'
  | 'cockpit-inventory'
  | 'cockpit-rfq'
  | 'cockpit-orders'
  | 'onboarding'
  | 'kyc'
  | 'throne';

// AI Character capabilities
export type AICapability =
  // Navigation
  | 'suggest_navigation'
  | 'show_insights'
  // Commerce
  | 'offer_discount'
  | 'suggest_bundle'
  | 'apply_coupon'
  // Orders
  | 'track_order'
  | 'prevent_duplicate'
  | 'payment_guidance'
  // Disputes
  | 'summarize_case'
  | 'extract_claims'
  | 'propose_ruling'
  | 'flag_evidence'
  // Operations
  | 'generate_restock'
  | 'suggest_pricing'
  | 'warn_risk'
  | 'create_draft_bid'
  // Onboarding
  | 'show_checklist'
  | 'explain_benefits'
  | 'link_docs';

// Motion/animation signatures
export type MotionSignature = 'bounce' | 'slide' | 'fade' | 'float' | 'pulse' | 'wiggle';

// AI Character definition
export interface AICharacter {
  id: AICharacterId;
  displayName: string;
  emoji: string;
  role: string;
  description: string;
  surfaces: AISurface[];
  triggers: AIEventType[];
  capabilities: AICapability[];
  permissionLevel: PermissionLevel;
  tone: string;
  styleTokens: {
    primaryColor: string;
    accentColor: string;
    motionSignature: MotionSignature;
    soundEnabled?: boolean;
  };
}

// Event payload structure
export interface AIEvent {
  type: AIEventType;
  actorId?: string;
  role?: string;
  route: string;
  payload: Record<string, unknown>;
  timestamp: number;
  correlationId: string;
}

// AI Action result
export interface AIActionResult {
  success: boolean;
  characterId: AICharacterId;
  action: string;
  requiresApproval: boolean;
  message?: string;
  data?: unknown;
  error?: string;
}

// Audit log entry
export interface AIAuditLog {
  id: string;
  characterId: AICharacterId;
  action: string;
  event: AIEvent;
  result: AIActionResult;
  userApproved: boolean | null;
  inputSnapshot: Record<string, unknown>;
  timestamp: number;
}

// UI display state for a character
export interface AICharacterUIState {
  visible: boolean;
  minimized: boolean;
  muted: boolean;
  mutedUntil?: number;
  lastInteraction?: number;
  dismissCount: number;
}
