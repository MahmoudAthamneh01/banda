# API Spec — REST (Headless)
Version: 1.0

## Base
- Base URL: /api
- Auth: JWT (access) + refresh; region-based provider options

## Error Model
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable",
    "details": { ... }
  }
}

Common Codes:
- AUTH_REQUIRED
- FORBIDDEN
- VALIDATION_FAILED
- COMPLIANCE_BLOCKED
- INSUFFICIENT_FUNDS
- LEDGER_ATOMIC_FAIL
- KYC_REQUIRED
- SANCTIONS_BLOCKED

## Key Endpoints (High level)
### Auth
POST /auth/login
POST /auth/register
POST /auth/refresh
GET  /auth/providers?region=CN

### Products & Catalog
GET /products?filters=
GET /products/:id
POST /cockpit/import (maker only)
GET /search/visual (image search)

### Cart/Checkout/Orders
POST /checkout/create
POST /payments/webhook
GET  /orders
GET  /orders/:id
POST /orders/:id/confirm-receipt

### Wallet/Ledger
GET /wallets/me
GET /ledger/transactions?limit=
POST /withdrawals/request (admin-gated)

### Referral
POST /referrals/rules (admin)
GET  /referrals/my-code
POST /referrals/scan (QR -> tracking)

### RFQ/Bidding
POST /rfq
GET  /rfq
POST /rfq/:id/bid
POST /rfq/:id/award
POST /rfq/:id/confirm-completion

### Disputes/Justice
POST /disputes
GET  /disputes/:id
POST /disputes/:id/ai-review
POST /disputes/:id/admin-verdict

### AI
POST /ai/chat (VIP or ambassador)
POST /ai/translate
POST /ai/analyze-image
