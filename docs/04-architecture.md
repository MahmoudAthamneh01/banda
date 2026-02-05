# Architecture — Banda Chao (C4 + Flows)
Version: 1.0

## C1: System Context
Users -> Web (Next.js) -> API (Node TS) -> Postgres/Mongo/Redis/OSS
Payments -> Provider abstraction -> WeChat/Alipay via CN gateway
Maps -> AMap

## C2: Containers
- Web (apps/web)
- API (apps/api)
- Postgres (ACID ledger/users)
- MongoDB (catalog)
- Redis (cache, rate limit, session)
- OSS (assets/media)
- CDN (AliCloud)

## C3: Components (API)
- Auth Module (Omni-auth/Geo filter)
- User & RBAC Module
- KYC/AML Module (provider integration)
- Wallet & Ledger Module (double entry)
- Sovereign Split Engine
- Referral Engine (event-driven)
- Orders & Payments Module
- RFQ & Bidding Module
- Disputes & Justice Module
- AI Module (provider abstraction + caching + logging)
- Audit Log Module

## Key Flows
### Flow A: Checkout -> Atomic Ledger
1) Create order -> lock escrow
2) Payment success webhook
3) Begin DB transaction
4) Apply referral reward (if rule exists)
5) Apply platform fee (10% or 5% ambassador)
6) Split fee into funds
7) Credit maker net
8) Commit

### Flow B: RFQ -> Proof of Completion
- Maker creates RFQ -> providers bid -> award -> escrow reserve
- Provider completes -> maker presses “Confirm”
- Ledger releases payment

### Flow C: Dispute -> Justice System
- Automated checks -> AI arbitrator -> human admin

## China Compliance Architecture
- Strict CSP
- All assets self-hosted
- No blocked services
- Data sovereignty: China identities isolated & encrypted
