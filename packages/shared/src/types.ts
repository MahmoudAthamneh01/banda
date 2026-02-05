// Common API error codes (from docs/07-api-spec.md)
export enum ApiErrorCode {
  // Auth & access
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Compliance & KYC
  COMPLIANCE_BLOCKED = 'COMPLIANCE_BLOCKED',
  KYC_REQUIRED = 'KYC_REQUIRED',
  SANCTIONS_BLOCKED = 'SANCTIONS_BLOCKED',
  REGION_RESTRICTED = 'REGION_RESTRICTED',
  
  // Ledger & Finance
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  LEDGER_ATOMIC_FAIL = 'LEDGER_ATOMIC_FAIL',
  WITHDRAWAL_LOCKED = 'WITHDRAWAL_LOCKED',
  
  // Business logic
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode | string;
    message: string;
    details?: Record<string, unknown>;
    correlationId?: string;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// User roles (from docs/06-db-schema.md + docs/01-srs.md)
export enum UserRole {
  BUYER = 'buyer',
  MAKER = 'maker',
  INVESTOR = 'investor',
  SERVICE_PROVIDER = 'service_provider',
  AMBASSADOR = 'ambassador',
  FOUNDER = 'founder',
}

// Locale types
export type Locale = 'ar' | 'en' | 'zh';

export const SUPPORTED_LOCALES: Locale[] = ['ar', 'en', 'zh'];

export const DEFAULT_LOCALE: Locale = 'zh';

// RTL languages
export const RTL_LOCALES: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

// Pillar identifiers
export enum Pillar {
  SQUARE = 'square',
  PLAYGROUND = 'playground',
  COCKPIT = 'cockpit',
  VAULT = 'vault',
  THRONE = 'throne',
}
