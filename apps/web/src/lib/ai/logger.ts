/**
 * AI Audit Logger - Proof of AI actions
 * Every AI action must generate a log entry
 */

import type { AIAuditLog, AICharacterId, AIEvent, AIActionResult } from './types';

// Simple ID generator to avoid nanoid dependency
function generateId(): string {
  return `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// In production, this would go to a database/logging service
const auditLogs: AIAuditLog[] = [];
const MAX_LOGS = 1000;

export interface LogActionParams {
  characterId: AICharacterId;
  action: string;
  event: AIEvent;
  result: AIActionResult;
  userApproved?: boolean | null;
  inputSnapshot?: Record<string, unknown>;
}

/**
 * Log an AI action for audit purposes
 */
export function logAIAction(params: LogActionParams): AIAuditLog {
  const log: AIAuditLog = {
    id: generateId(),
    characterId: params.characterId,
    action: params.action,
    event: params.event,
    result: params.result,
    userApproved: params.userApproved ?? null,
    inputSnapshot: params.inputSnapshot ?? {},
    timestamp: Date.now(),
  };

  // Store log
  auditLogs.unshift(log);
  
  // Trim old logs
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.splice(MAX_LOGS);
  }

  // In development, also log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[AIAudit] 📝 ${params.characterId} → ${params.action}`,
      {
        success: params.result.success,
        approved: params.userApproved,
        eventType: params.event.type,
      }
    );
  }

  return log;
}

/**
 * Get audit logs for a specific character
 */
export function getLogsByCharacter(characterId: AICharacterId, limit = 50): AIAuditLog[] {
  return auditLogs
    .filter(log => log.characterId === characterId)
    .slice(0, limit);
}

/**
 * Get audit logs for a specific time range
 */
export function getLogsByTimeRange(startTime: number, endTime: number): AIAuditLog[] {
  return auditLogs.filter(
    log => log.timestamp >= startTime && log.timestamp <= endTime
  );
}

/**
 * Get audit logs that required user approval
 */
export function getApprovalLogs(limit = 50): AIAuditLog[] {
  return auditLogs
    .filter(log => log.userApproved !== null)
    .slice(0, limit);
}

/**
 * Get failed actions for review
 */
export function getFailedActions(limit = 50): AIAuditLog[] {
  return auditLogs
    .filter(log => !log.result.success)
    .slice(0, limit);
}

/**
 * Get all logs (for admin dashboard)
 */
export function getAllLogs(limit = 100): AIAuditLog[] {
  return auditLogs.slice(0, limit);
}

/**
 * Get log by ID
 */
export function getLogById(id: string): AIAuditLog | undefined {
  return auditLogs.find(log => log.id === id);
}

/**
 * Export logs (for compliance)
 */
export function exportLogs(): string {
  return JSON.stringify(auditLogs, null, 2);
}

/**
 * Clear logs (only in development)
 */
export function clearLogs(): void {
  if (process.env.NODE_ENV === 'development') {
    auditLogs.length = 0;
    console.log('[AIAudit] Logs cleared');
  }
}

/**
 * Get statistics about AI actions
 */
export function getAuditStats(): {
  totalActions: number;
  byCharacter: Record<string, number>;
  successRate: number;
  approvalRate: number;
} {
  const byCharacter: Record<string, number> = {};
  let successCount = 0;
  let approvedCount = 0;
  let approvalRequiredCount = 0;

  auditLogs.forEach(log => {
    byCharacter[log.characterId] = (byCharacter[log.characterId] || 0) + 1;
    if (log.result.success) successCount++;
    if (log.userApproved !== null) {
      approvalRequiredCount++;
      if (log.userApproved) approvedCount++;
    }
  });

  return {
    totalActions: auditLogs.length,
    byCharacter,
    successRate: auditLogs.length > 0 ? successCount / auditLogs.length : 0,
    approvalRate: approvalRequiredCount > 0 ? approvedCount / approvalRequiredCount : 0,
  };
}
