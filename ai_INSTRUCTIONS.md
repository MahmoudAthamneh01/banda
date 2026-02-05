# Banda Chao — Single Source of Truth (Antigravity / AI Agent Instructions)

## 0) Role & Goal
You are a CTO-level Software Architect + UI/UX lead.
Your mission: rebuild **Banda Chao** from scratch with a **clean monorepo**, implementing the **FULL product** (not MVP) according to the latest client requirements.

You MUST produce:
- Final project skeleton (repo structure + configs + scripts)
- Full frontend foundation (Next.js 15 + React 19 + TS + Tailwind 4)
- Backend foundation (Node.js 20+ TS Headless REST API) structure only (endpoints scaffolding + modules layout)
- Documentation set (SRS + Frontend Spec + Branding Guidelines + Security/China compliance + ADRs + API Spec stubs + DB spec stubs)
- Strict China compliance enforcement (Zero External Assets) with automated checks

---

## 1) Non-Negotiable Requirements (Must Pass)
### 1.1 Tech Stack (fixed)
- Frontend: **Next.js 15 + React 19 + TypeScript + Tailwind CSS 4**
- Backend: **Node.js 20+ + TypeScript + REST API (Headless Architecture)**
- Databases: **PostgreSQL** (ACID/Finance) + **MongoDB** (Catalog)
- Hosting target: **Alibaba Cloud Hong Kong** (ECS, RDS, OSS, CDN, ACR)
- Maps: **AMap (Gaode)** only — NO Google Maps
- Fonts: **Self-hosted only** (Arabic: Cairo/Tajawal, Chinese: Noto Sans SC/PingFang SC, English: Roboto)

### 1.2 China Compliance (Zero External Assets)
ABSOLUTE RULE:
- No external CDNs/scripts/fonts/images/lottie/icons.
- No `fonts.googleapis.com`, `cdn.jsdelivr.net`, `unpkg`, etc.
- Assets only from:
  - Local `apps/web/public/assets/*`
  - or Alibaba OSS (HK) domains only (allowlisted)
- Build must fail if any external URL is detected.

### 1.3 Security Policy
- Strict **CSP** that blocks non-allowlisted sources.
- A compliance script must run before build and fail on violations.

---

## 2) Product Definition (Full System)
Banda Chao is a **Closed Digital Eco-system** with **5 Pillars**:

1) **The Square** (Public Arena)
- Live index
- Top 10 organic ranking (no paid boosting)
- “Liquidation Boxes” (Anti-gambling rules)

2) **The Cockpit** (Makers/Service Providers)
- One-click import (Taobao/Alibaba/Amazon)
- Internal RFQ + bidding
- Escrow reservation
- Fapiao lock (invoice required for withdrawals)

3) **The Playground** (Buyers)
- Visual grid catalog
- Cart + checkout
- Resell / live review points
- Gamification: Hungry Panda, Red Packets, Daily Fortune

4) **The Throne** (Owner)
- Live maps (AMap)
- Money pulse dashboard (fees split, wallet status)
- Compliance monitoring
- Force majeure trigger (2FA + password)

5) **The Vault** (Investors)
- Factory funding cycles (1 week → 3 months)
- Transparency dashboard
- Returns and risk views

---

## 3) Financial & Strategic Logic (Latest Client Additions)
### 3.1 Sovereign Fee
- Standard platform fee: **10%**
- Auto-split of the 10%:
  - 5.5% Revenue
  - 1.5% Hedge Fund
  - 1.5% R&D Vault
  - 1.5% Expansion Fund

### 3.2 Student Ambassador Tier (Special User Tier)
- Tier: `STUDENT_AMBASSADOR`
- VIP: free lifetime
- Platform fee discount: **5%** (instead of 10%)

### 3.3 Referral Engine (Generic + Event-Driven)
Must be **NOT hardcoded to students**.
- Any user can be referrer (student/company/normal)
- Any user can be referee (maker/investor/buyer/service provider)
- Rewards triggered by event types:
  - `COMMERCE_SALE`
  - `CAPITAL_INJECTION`
  - extendable
- Default universal commission: **2.5%** (rule-driven, configurable from admin later)

### 3.4 Liquidation Boxes (Anti-Gambling / Inventory Disposal)
- **No Loss Policy**: product marketValue >= boxPrice
- Available only in **last 30 days** of each 3-month cycle
- Provide “hints” category (not blind)
- price difference recorded as **Marketing Cost**

### 3.5 Gamification in Playground
- Hungry Panda: daily tamagotchi
- Red Packets: hongbao random rewards
- Daily Fortune: DOB → Chinese zodiac advice
- Badges: Bronze/Silver/Gold/Platinum + “Silk Ambassador”

---

## 4) AI in the Product (Yes, included)
AI is part of the product:
- Event-driven “AI Agents UI” (8 personas) as primary UX layer
- Justice system includes automated judge + AI arbitrator + human admin escalation
- Future roadmap uses Qwen; architecture must be modular to swap providers later
- Add foundation hooks and placeholders in frontend and backend

---

## 5) Inputs I Will Provide You
- A legacy frontend folder exists (old messy structure).
  - Use it for reference only.
  - DO NOT copy its routing or structure.
  - Rebuild clean.

---

## 6) Deliverables Required (What to generate inside this repo)
You must create these **folders/files**:

### 6.1 Clean Monorepo Structure
- `/apps/web` (Next.js)
- `/apps/api` (Node TS REST)
- `/packages/shared`, `/packages/ui`, `/packages/contracts`
- `/docs` for all documentation
- `/scripts/compliance-check.js`

### 6.2 Docs (Must exist)
Create these docs in `/docs`:
- `01-srs.md` (full product SRS)
- `02-frontend-spec.md`
- `03-branding-guidelines.md`
- `04-architecture.md`
- `05-security-compliance-china.md`
- `06-db-schema.md`
- `07-api-spec.md`
- `08-wbs-backlog-timeline.md`
- `/constitution/banda-chao-constitution-v7.md`
- `/adr/*` (Architecture Decision Records)

### 6.3 Frontend Foundation (apps/web)
- App Router with locales `/[locale]` (ar/en/zh)
- Dynamic `dir` at `<html>` root (RTL/LTR)
- i18n (i18next) — NO hardcoded strings
- Pillars routes:
  - `/[locale]/square`
  - `/[locale]/playground`
  - `/[locale]/cockpit`
  - `/[locale]/vault`
  - `/[locale]/throne`
- Public pages:
  - `/about`, `/privacy-policy`, `/terms-of-service`, `/returns`
- UI tokens and base components
- Agent system registry + event bus + placeholder scenes

### 6.4 Backend Foundation (apps/api)
- Modular REST structure:
  - auth, users, catalog, orders, payments, wallet-ledger, referral, kyc, disputes, ai, admin
- Error codes standardization
- Audit logs scaffolding
- DB adapters: Postgres + Mongo

### 6.5 Compliance Script (must fail builds)
- Create a script that scans repo code to detect external URLs and blocks build.
- Wire it into `pnpm build`.

---

## 7) Execution Order (Do exactly)
1) Create monorepo structure + package manager config (pnpm).
2) Implement compliance-check.js + enforce in build pipeline.
3) Implement web app foundation (routing, i18n, tokens, layouts).
4) Implement pillar page shells + public legal pages.
5) Implement agent UI skeleton (registry + events).
6) Create API skeleton with modules and DTOs.
7) Produce docs files as specified.

---

## 8) Definition of Done (Must be true)
- Repo builds successfully **only** if it passes Zero External Assets checks.
- Frontend has all 5 pillars routes + public pages + i18n + direction.
- Architecture is clean and extensible; no copy-paste from legacy.
- Docs exist and represent the system accurately.
- Codebase is readable and production-grade foundation.

END.
