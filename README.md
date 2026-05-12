# Banda Chao - Sovereign Marketplace & DAO Platform

**Phase 0 Foundation + Full Frontend Implementation**

Banda Chao is a closed-loop digital ecosystem featuring a sovereign marketplace, event-driven referral engine, and DAO governance—all built with strict China compliance.

## 📦 Monorepo Structure

```
banda-chao/
├── apps/
│   ├── web/          # Next.js 15 frontend (zero external assets)
│   └── api/          # Node.js 20+ REST API
├── packages/
│   └── shared/       # Common types and utilities
├── docs/             # Architecture & specifications
├── scripts/          # Compliance checks & tooling
└── docker/           # Local dev environment
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 10.14.0
- PostgreSQL 16+ or Docker & Docker Compose

### Installation

1. **Clone and install dependencies**
   ```bash
   corepack enable
   pnpm install
   ```

2. **Start local database services**
   ```bash
   docker compose -f docker/docker-compose.yml up -d postgres redis mongo
   ```
   Docker maps PostgreSQL to `localhost:5433`. If you use a native local PostgreSQL service, create a `banda` user and `banda_db` database and point `DATABASE_URL` at that port instead.

3. **Setup environment**
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit DATABASE_URL, JWT_SECRET, and ALLOWED_ORIGINS

   cd ../web
   echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local
   ```

4. **Run Prisma migrations**
   ```bash
   cd apps/api
   pnpm prisma:generate
   pnpm prisma:deploy
   pnpm prisma:seed
   ```

5. **Start development servers**
   ```bash
   # From root - starts both web and api
   pnpm dev
   ```

   Or run individually:
   ```bash
   # Frontend only
   cd apps/web
   pnpm dev
   
   # API only
   cd apps/api
   pnpm dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Health check: http://localhost:3001/health

## 🛠️ Available Commands

### Root Level
```bash
pnpm dev           # Run all apps in dev mode
pnpm build         # Build all apps
pnpm lint          # Run configured static checks
pnpm typecheck     # Type check all packages
pnpm test          # Run configured tests
pnpm compliance    # Run compliance check
pnpm clean         # Clean all build artifacts
```

### Compliance
```bash
node scripts/compliance-check.js   # Scan for external assets
```

## 🔒 Compliance & Security

**This project enforces ZERO EXTERNAL ASSETS policy for China compliance:**

- ❌ No Google Fonts, CDNs, or external scripts
- ✅ All fonts/assets must be self-hosted
- ✅ Strict CSP headers configured
- ✅ Automated compliance checks in CI/CD

**The build will FAIL if any violations are detected.**

## 📚 Documentation

- [Architecture Overview](docs/04-architecture.md)
- [API Specification](docs/07-api-spec.md)
- [Database Schema](docs/06-db-schema.md)
- [Security & Compliance](docs/05-security-compliance-china.md)
- [Phase 0 Implementation Notes](IMPLEMENTATION_NOTES.md)

## 🌍 i18n Support

The platform supports:
- 🇸🇦 Arabic (RTL)
- 🇬🇧 English
- 🇨🇳 Chinese (Default)

Locale routing: `/[locale]/...` (e.g., `/zh/square`, `/ar/vault`)

## 🎨 Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- i18next

**Backend:**
- Node.js 20+
- Express
- TypeScript (strict mode)
- Prisma (PostgreSQL)
- MongoDB native driver
- Redis

**Infrastructure:**
- Docker Compose (local dev)
- Alibaba Cloud (production target)
- GitHub Actions (CI/CD)

## 📋 Phase 0 Status

✅ Monorepo foundation with pnpm workspaces  
✅ Next.js 15 web app with App Router  
✅ i18n routing with RTL support  
✅ Strict CSP + self-hosted fonts  
✅ All pillar pages (Square, Playground, Cockpit, Vault, Throne)  
✅ Auth, products, orders, legal pages  
✅ UI component library  
✅ Typed API client  
✅ REST API with JWT auth, users, products, orders, wallets, RFQ, referrals, and local AI proxy  
✅ Double-entry wallet ledger for demo deposits, order payments, maker payouts, platform fees, and referral rewards  
✅ 3-tier referral rewards with signup, first-order, commission tracking, and earning caps  
✅ Prisma schema, initial migration, and seed data  
✅ Docker dev environment  
✅ Compliance check script + CI  

**Next:** Connect production Postgres, set production `NEXT_PUBLIC_API_URL` and `ALLOWED_ORIGINS`, then replace local demo AI/payment paths with real providers.

## 🤝 Contributing

This is a closed-loop ecosystem project. Refer to the Constitution for governance rules.

## 📄 License

Proprietary - All rights reserved.
