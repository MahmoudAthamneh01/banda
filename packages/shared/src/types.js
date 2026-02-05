"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pillar = exports.RTL_LOCALES = exports.DEFAULT_LOCALE = exports.SUPPORTED_LOCALES = exports.UserRole = exports.ApiErrorCode = void 0;
exports.isRTL = isRTL;
var ApiErrorCode;
(function (ApiErrorCode) {
    ApiErrorCode["AUTH_REQUIRED"] = "AUTH_REQUIRED";
    ApiErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ApiErrorCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    ApiErrorCode["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    ApiErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ApiErrorCode["COMPLIANCE_BLOCKED"] = "COMPLIANCE_BLOCKED";
    ApiErrorCode["KYC_REQUIRED"] = "KYC_REQUIRED";
    ApiErrorCode["SANCTIONS_BLOCKED"] = "SANCTIONS_BLOCKED";
    ApiErrorCode["REGION_RESTRICTED"] = "REGION_RESTRICTED";
    ApiErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    ApiErrorCode["LEDGER_ATOMIC_FAIL"] = "LEDGER_ATOMIC_FAIL";
    ApiErrorCode["WITHDRAWAL_LOCKED"] = "WITHDRAWAL_LOCKED";
    ApiErrorCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ApiErrorCode["DUPLICATE_ENTRY"] = "DUPLICATE_ENTRY";
    ApiErrorCode["OPERATION_NOT_ALLOWED"] = "OPERATION_NOT_ALLOWED";
    ApiErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ApiErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ApiErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
})(ApiErrorCode || (exports.ApiErrorCode = ApiErrorCode = {}));
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "buyer";
    UserRole["MAKER"] = "maker";
    UserRole["INVESTOR"] = "investor";
    UserRole["SERVICE_PROVIDER"] = "service_provider";
    UserRole["AMBASSADOR"] = "ambassador";
    UserRole["FOUNDER"] = "founder";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.SUPPORTED_LOCALES = ['ar', 'en', 'zh'];
exports.DEFAULT_LOCALE = 'zh';
exports.RTL_LOCALES = ['ar'];
function isRTL(locale) {
    return exports.RTL_LOCALES.includes(locale);
}
var Pillar;
(function (Pillar) {
    Pillar["SQUARE"] = "square";
    Pillar["PLAYGROUND"] = "playground";
    Pillar["COCKPIT"] = "cockpit";
    Pillar["VAULT"] = "vault";
    Pillar["THRONE"] = "throne";
})(Pillar || (exports.Pillar = Pillar = {}));
//# sourceMappingURL=types.js.map