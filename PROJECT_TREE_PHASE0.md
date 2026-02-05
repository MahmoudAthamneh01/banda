# Banda Chao - Final Project Tree (Phase 0)

```
banda-chao/
├── .github/
│   └── workflows/
│       └── ci.yml                          # CI: lint, typecheck, compliance, build
│
├── apps/
│   ├── api/                                # Node.js REST API
│   │   ├── prisma/
│   │   │   └── schema.prisma               # PostgreSQL schema (Prisma)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── mongo.ts                # MongoDB connection & helpers
│   │   │   │   ├── prisma.ts               # Prisma client singleton
│   │   │   │   └── README.md               # DB layer documentation
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts                 # JWT auth + RBAC middleware
│   │   │   │   ├── error-handler.ts        # API error envelope handler
│   │   │   │   ├── not-found.ts            # 404 handler
│   │   │   │   └── request-logger.ts       # Correlation ID logger
│   │   │   ├── modules/                    # Business logic scaffolds
│   │   │   │   ├── ai/
│   │   │   │   │   └── README.md           # AI provider abstraction TODO
│   │   │   │   ├── audit/
│   │   │   │   │   └── README.md           # Audit logging TODO
│   │   │   │   ├── catalog/
│   │   │   │   │   └── README.md           # Product catalog TODO
│   │   │   │   ├── compliance/
│   │   │   │   │   └── README.md           # KYC/sanctions TODO
│   │   │   │   ├── disputes/
│   │   │   │   │   └── README.md           # AI dispute resolution TODO
│   │   │   │   ├── orders/
│   │   │   │   │   └── README.md           # Order flow TODO
│   │   │   │   ├── referral/
│   │   │   │   │   └── README.md           # Event-driven referrals TODO
│   │   │   │   ├── sovereign-split/
│   │   │   │   │   └── README.md           # Revenue distribution TODO
│   │   │   │   └── wallet-ledger/
│   │   │   │       └── README.md           # Double-entry ledger TODO
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts          # Auth endpoints (JWT stubs)
│   │   │   │   ├── catalog.routes.ts       # Product endpoints (stubs)
│   │   │   │   ├── index.ts                # Route aggregator
│   │   │   │   ├── orders.routes.ts        # Order endpoints (stubs)
│   │   │   │   └── wallet.routes.ts        # Wallet endpoints (stubs)
│   │   │   └── index.ts                    # Express server entry
│   │   ├── .env.example                    # Environment template
│   │   ├── .eslintrc.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                                # Next.js 15 frontend
│       ├── public/
│       │   ├── fonts/
│       │   │   └── README.md               # Self-hosted fonts TODO
│       │   └── favicon.ico
│       ├── src/
│       │   ├── app/
│       │   │   ├── [locale]/               # Locale-prefixed routes
│       │   │   │   ├── auth/
│       │   │   │   │   ├── login/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   └── register/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── cockpit/
│       │   │   │   │   └── page.tsx        # Maker dashboard
│       │   │   │   ├── legal/
│       │   │   │   │   ├── privacy/
│       │   │   │   │   │   └── page.tsx    # PIPL-compliant privacy
│       │   │   │   │   ├── returns/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   └── terms/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── orders/
│       │   │   │   │   ├── [id]/
│       │   │   │   │   │   └── track/
│       │   │   │   │   │       └── page.tsx
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── playground/
│       │   │   │   │   └── page.tsx        # Social + RFQ
│       │   │   │   ├── products/
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── square/
│       │   │   │   │   └── page.tsx        # Marketplace
│       │   │   │   ├── throne/
│       │   │   │   │   └── page.tsx        # Admin/governance
│       │   │   │   ├── vault/
│       │   │   │   │   └── page.tsx        # Wallet/ledger
│       │   │   │   ├── layout.tsx          # Root layout with locale + dir
│       │   │   │   └── page.tsx            # Home page
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   └── ui/
│       │   │       ├── Button.tsx
│       │   │       ├── Card.tsx
│       │   │       ├── Input.tsx
│       │   │       ├── Modal.tsx
│       │   │       ├── Select.tsx
│       │   │       ├── Skeleton.tsx
│       │   │       ├── Toast.tsx
│       │   │       └── index.ts
│       │   ├── config/
│       │   │   └── i18n.ts                 # Locale config
│       │   ├── lib/
│       │   │   ├── api/
│       │   │   │   ├── auth.ts             # Auth API client
│       │   │   │   ├── catalog.ts          # Catalog API client
│       │   │   │   ├── client.ts           # Base fetch wrapper
│       │   │   │   ├── index.ts
│       │   │   │   ├── orders.ts           # Orders API client
│       │   │   │   └── wallet.ts           # Wallet API client
│       │   │   └── i18n/
│       │   │       ├── client.ts           # Client-side i18n
│       │   │       └── server.ts           # Server-side i18n
│       │   ├── locales/
│       │   │   ├── ar/
│       │   │   │   └── common.json         # Arabic translations
│       │   │   ├── en/
│       │   │   │   └── common.json         # English translations
│       │   │   └── zh/
│       │   │       └── common.json         # Chinese translations
│       │   └── middleware.ts               # Locale detection
│       ├── .eslintrc.js
│       ├── next.config.js                  # CSP headers configured
│       ├── next-env.d.ts
│       ├── package.json
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── docker/
│   ├── docker-compose.yml                  # Postgres, Mongo, Redis
│   └── README.md
│
├── docs/                                   # Existing architecture docs
│   ├── 00-index.md
│   ├── 01-srs.md
│   ├── 02-frontend-spec.md
│   ├── 04-architecture.md
│   ├── 05-security-compliance-china.md
│   ├── 06-db-schema.md
│   ├── 07-api-spec.md
│   ├── 09-adr/
│   ├── ai/
│   ├── constitution/
│   └── finance/
│
├── packages/
│   └── shared/                             # Common types
│       ├── src/
│       │   ├── index.ts
│       │   └── types.ts                    # ApiError, Locale, UserRole, etc.
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/
│   ├── compliance-allowlist.json           # Allowed/forbidden domains
│   └── compliance-check.js                 # External asset scanner
│
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierrc
├── IMPLEMENTATION_NOTES.md                 # This file
├── package.json                            # Root workspace config
├── pnpm-workspace.yaml
├── PROJECT_TREE_EXPECTED.md                # Old reference tree
├── README.md                               # Updated with setup guide
├── tsconfig.base.json
└── turbo.json
```

## Summary Statistics

- **Total directories:** ~60
- **Total files:** ~100+
- **Frontend routes:** 15 pages
- **API endpoints:** 11 stubs
- **UI components:** 7 components
- **Module scaffolds:** 9 modules
- **Database tables:** 8 (Prisma schema)
- **Middleware:** 4 (auth, error, logger, 404)

## Status

✅ **Phase 0 Complete**
- All required infrastructure in place
- All pages render without errors
- Compliance check passes
- TypeScript strict mode passes
- CI/CD configured

⏳ **Next: Implement business logic in module folders**
