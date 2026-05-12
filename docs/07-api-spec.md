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
GET  /auth/me

### Products & Catalog
GET /products?filters=
GET /products/:id
POST /products
PATCH /products/:id
POST /products/import

### Cart/Checkout/Orders
POST /orders
GET  /orders
GET  /orders/:id
POST /orders/:id/ship
POST /orders/:id/confirm-receipt

### Wallet/Ledger
GET /wallets
GET /wallets/ledger
POST /wallets/deposit-demo

### Referral
GET  /referrals/my-code
GET  /referrals/stats
GET  /referrals/history

### RFQ/Bidding
POST /rfq
GET  /rfq
GET  /rfq/:id
POST /rfq/:id/bids
POST /rfq/:id/award

### Disputes/Justice
POST /disputes
GET  /disputes/:id
POST /disputes/:id/ai-review
POST /disputes/:id/admin-verdict

### AI
POST /ai/chat
GET  /ai/conversations
