export declare enum ApiErrorCode {
    AUTH_REQUIRED = "AUTH_REQUIRED",
    FORBIDDEN = "FORBIDDEN",
    INVALID_TOKEN = "INVALID_TOKEN",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    INVALID_INPUT = "INVALID_INPUT",
    COMPLIANCE_BLOCKED = "COMPLIANCE_BLOCKED",
    KYC_REQUIRED = "KYC_REQUIRED",
    SANCTIONS_BLOCKED = "SANCTIONS_BLOCKED",
    REGION_RESTRICTED = "REGION_RESTRICTED",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    LEDGER_ATOMIC_FAIL = "LEDGER_ATOMIC_FAIL",
    WITHDRAWAL_LOCKED = "WITHDRAWAL_LOCKED",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
    OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
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
export declare enum UserRole {
    BUYER = "buyer",
    MAKER = "maker",
    INVESTOR = "investor",
    SERVICE_PROVIDER = "service_provider",
    AMBASSADOR = "ambassador",
    FOUNDER = "founder"
}
export type Locale = 'ar' | 'en' | 'zh';
export declare const SUPPORTED_LOCALES: Locale[];
export declare const DEFAULT_LOCALE: Locale;
export declare const RTL_LOCALES: Locale[];
export declare function isRTL(locale: Locale): boolean;
export declare enum Pillar {
    SQUARE = "square",
    PLAYGROUND = "playground",
    COCKPIT = "cockpit",
    VAULT = "vault",
    THRONE = "throne"
}
//# sourceMappingURL=types.d.ts.map