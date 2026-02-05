/**
 * AI System - Index Exports
 * Central export point for all AI infrastructure and character components
 */

// Types
export * from './types';

// Infrastructure
export { AI_REGISTRY, getCharacter, getCharactersForSurface, getCharactersForEvent, canAutoExecute, requiresUserApproval, isNuclearAction } from './registry';
export { AIEventBus, aiEventBus, aiEvents } from './event-bus';
export { logAIAction, getLogsByCharacter, getLogsByTimeRange, getApprovalLogs, getFailedActions, getAuditStats } from './logger';
export { initializeAIProvider, getAIProvider, ai } from './provider';
export type { AIProviderConfig, AIProviderResponse } from './provider';
