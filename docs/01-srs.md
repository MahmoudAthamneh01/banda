# SRS — Banda Chao (Full Product)
Version: 1.0
Status: Binding
Scope: Full product (not MVP-only)

## 1. Purpose
Define complete system requirements for Banda Chao as a closed-loop digital ecosystem with 5 pillars, strict China compliance, and sovereign financial logic.

## 2. Stakeholders
- Owner/Founder (Throne)
- Buyers (Playground)
- Makers/Factories + Service Providers (Cockpit)
- Investors (Vault)
- Admin/Moderation/Compliance
- AI Agents (system interface components)

## 3. System Context (High Level)
- Web (Next.js) consumes Headless REST API
- API writes:
  - Postgres: users, auth, KYC, wallets, ledger, disputes, audit logs, referral rules
  - Mongo: product catalog, media metadata, imported listings
- OSS stores all assets/media (self-hosted)
- Payments: WeChat Pay / Alipay via local gateway (LianLian Pay) or provider abstraction
- Maps: AMap only
- Compliance gate prevents external dependencies

## 4. Roles & Permissions (RBAC)
Roles:
- BUYER
- MAKER
- SERVICE_PROVIDER (Driver/Customs/Translator/etc)
- INVESTOR
- OWNER (Super Admin)
- ADMIN (delegated)
Tiers:
- STANDARD (default)
- STUDENT_AMBASSADOR (VIP lifetime + fee 5%)
- Social tiers: DRAGON/TIGER/CUB (derived from score)

## 5. Functional Requirements (By Pillar)
### 5.1 The Square (Public)
FR-SQ-1 Live Index Top10
- Hourly job calculates:
  Score = SalesVol*0.5 + Quality*0.3 + DeliverySpeed*0.2
- No paid boosting allowed

FR-SQ-2 Liquidation Boxes (Anti-Gambling)
- Enforce No Loss Policy and cycle timing
- Provide category hints
- Record marketing cost difference

FR-SQ-3 Social Proof Ticker
- Show recent events (purchase/live review) via websocket

### 5.2 The Cockpit (Maker & Service Providers)
FR-CO-1 Import Tool
- Accept URLs: Taobao/1688/Alibaba/Amazon
- Create product listing + media references
- Store catalog data in Mongo; transactional metadata in Postgres

FR-CO-2 Internal RFQ & Bidding
- Maker creates RFQ
- Matching by geo range
- Providers bid; maker awards
- Escrow reserves funds until proof of completion

FR-CO-3 VIP AI Panda Consultant
- Available if VIP OR STUDENT_AMBASSADOR
- Read-only analytics + recommendations (no auto financial actions without approval)

### 5.3 The Playground (Buyer)
FR-PL-1 Visual Grid browsing
- Browse products, collections, creators
FR-PL-2 Cart/Checkout
- Payment initiation, order creation, tracking
FR-PL-3 Resell & Live Review
- Buyer can resell; live review generates points
FR-PL-4 Gamification
- Hungry Panda daily
- Red Packets
- Daily Fortune

### 5.4 The Throne (Owner)
FR-TH-1 Monitoring dashboards
- latency inside CN
- payment success
- commissions distributed
- owner payouts
FR-TH-2 Admin-gated withdrawals
- AML checks + source lock
FR-TH-3 Emergency controls
- force majeure activation for regions
- freeze penalties job

### 5.5 The Vault (Investor)
FR-VA-1 Investment cycles
- fund maker for 1 week–3 months
- track performance
FR-VA-2 Disbursement rules
- locked funds; use internal payments only
FR-VA-3 Transparency charts (self-hosted)
- show fee splits and risk metrics

## 6. Cross-Cutting Functional Requirements
### 6.1 Closed Loop Economy
- Funds circulate in internal wallets
- No external bank payout except via admin gate
- Proof-of-completion required for service payouts

### 6.2 Sovereign Fee Engine
- Standard platform fee: 10%
- Auto-split: 5.5/1.5/1.5/1.5
- Special: STUDENT_AMBASSADOR fee 5%
- Referral reward is processed BEFORE distributing platform net revenue (when applicable)

### 6.3 Referral Engine (Event-Driven)
- Referral rules stored as data
- Reward triggers:
  - COMMERCE_SALE (orders)
  - CAPITAL_INJECTION (investments)
- Processing must occur in same ACID transaction as the trigger

### 6.4 Justice System
- Automated judge: clear digital disputes
- AI arbitrator: analyzes text/images
- Human admin: final escalation

## 7. Non-Functional Requirements
### 7.1 China Compliance (Hard)
- Zero external assets
- strict CSP allowlist
- AMap only
- PIPL: isolate China identity data; encrypt

### 7.2 Security
- KYC/AML + sanctions screening
- source-of-funds lock (deposit IBAN == withdrawal IBAN where applicable)
- audit logs for every critical action

### 7.3 Performance
- target TTFB: < 500ms avg API
- cached endpoints via Redis
- CDN for OSS assets inside China

### 7.4 Observability
- request tracing, error reporting
- logs with correlation IDs

## 8. Data Requirements
- Postgres: ACID ledger, users, KYC, disputes, audit
- Mongo: flexible product catalog, imported listings
- OSS: media & assets only (no DB blobs)

## 9. Acceptance Criteria (Examples)
- Mystery box cannot be published if marketValue < boxPrice
- Student ambassador always gets VIP true and fee rate 5%
- Referral reward is paid before sovereign fund split
- compliance-check fails build if any external host is referenced
