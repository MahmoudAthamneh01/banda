/**
 * AI System - Index Exports
 * Central export point for all AI infrastructure and character components
 */

// Types
export * from './types';

// Infrastructure
export { aiCharacterRegistry, getCharacter, getCharactersForSurface, getCharactersForEvent, canAutoExecute, requiresUserApproval, isNuclearAction } from './registry';
export { AIEventBus, aiEventBus, aiEvents } from './event-bus';
export { logAIAction, getLogsByCharacter, getLogsByTimeRange, getApprovalLogs, getFailedActions, getAuditStats } from './logger';
export { initializeAIProvider, ai } from './provider';
export type { AIProvider } from './provider';
