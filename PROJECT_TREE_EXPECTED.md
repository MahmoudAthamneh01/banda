# Banda Chao — Expected Project Tree (Final Clean Monorepo)

> NOTE: This is the authoritative expected repo structure for the rebuild.
> Goal: Clean monorepo + China Zero-External compliance + full product docs.

banda-chao/
├─ README.md
├─ LICENSE
├─ .editorconfig
├─ .gitignore
├─ .gitattributes
├─ .npmrc
├─ pnpm-workspace.yaml
├─ package.json
├─ pnpm-lock.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ prettier.config.cjs
├─ eslint.config.mjs
├─ commitlint.config.cjs
├─ lint-staged.config.cjs
├─ lefthook.yml
├─ .husky/                          # optional if using husky (or lefthook only)
│  ├─ pre-commit
│  └─ commit-msg
├─ .vscode/
│  ├─ settings.json
│  ├─ extensions.json
│  └─ launch.json
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                      # install, lint, typecheck, test, compliance-check, build
│  │  ├─ deploy-web.yml              # deploy apps/web to Alibaba ECS (or artifact upload)
│  │  └─ deploy-api.yml              # deploy apps/api to Alibaba ECS
│  ├─ pull_request_template.md
│  └─ CODEOWNERS
├─ docker/
│  ├─ Dockerfile.web                 # multi-stage build, no external deps at runtime
│  ├─ Dockerfile.api
│  ├─ docker-compose.dev.yml         # local dev (pg, mongo, redis, web, api)
│  ├─ docker-compose.prod.yml
│  └─ nginx/
│     ├─ nginx.conf
│     └─ conf.d/
│        ├─ web.conf
│        └─ api.conf
├─ scripts/
│  ├─ compliance-check.js            # CRITICAL: zero external assets scanner
│  ├─ compliance-allowlist.json      # allowed hosts (aliyuncs.com, alipay.com, wechat.com)
│  ├─ audit-deps.js                  # dependency policy checks (optional)
│  ├─ gen-env-example.js             # generate .env.example per app
│  ├─ seed-local-dev.sh
│  └─ healthcheck.sh
├─ configs/
│  ├─ csp/
│  │  ├─ csp.web.json                # canonical CSP policy
│  │  └─ csp.api.json
│  ├─ i18n/
│  │  ├─ locales.json                # supported locales + fallback rules
│  │  └─ namespaces.json
│  └─ compliance/
│     ├─ zero-external-assets.md
│     └─ china-mode.md
├─ docs/
│  ├─ 00-index.md
│  ├─ 01-srs.md
│  ├─ 02-frontend-spec.md
│  ├─ 03-branding-guidelines.md
│  ├─ 04-architecture.md
│  ├─ 05-security-compliance-china.md
│  ├─ 06-db-schema.md
│  ├─ 07-api-spec.md
│  ├─ 08-wbs-backlog-timeline.md
│  ├─ 09-adr/                         # Architecture Decision Records
│  │  ├─ ADR-0001-monorepo-tooling.md
│  │  ├─ ADR-0002-nextjs15-react19.md
│  │  ├─ ADR-0003-headless-rest-api.md
│  │  ├─ ADR-0004-postgres-mongo-split.md
│  │  ├─ ADR-0005-zero-external-assets.md
│  │  ├─ ADR-0006-csp-strategy.md
│  │  ├─ ADR-0007-i18n-rtl-strategy.md
│  │  ├─ ADR-0008-ledger-wallet-design.md
│  │  └─ ADR-0009-referral-event-driven.md
│  ├─ 10-runbooks/
│  │  ├─ local-dev.md
│  │  ├─ prod-deploy-alibaba.md
│  │  ├─ backup-restore.md
│  │  └─ incident-response.md
│  ├─ 11-diagrams/
│  │  ├─ system-context.mmd
│  │  ├─ container-architecture.mmd
│  │  ├─ sequence-checkout.mmd
│  │  ├─ sequence-dispute.mmd
│  │  ├─ erd-finance.mmd
│  │  └─ c4-notes.md
│  └─ constitution/
│     ├─ banda-chao-constitution-v7.md
│     ├─ amendments.md                # new client changes logged here
│     └─ changelog.md
├─ apps/
│  ├─ web/
│  │  ├─ README.md
│  │  ├─ package.json
│  │  ├─ next.config.js               # CSP headers + remotePatterns allow OSS only
│  │  ├─ middleware.ts                # locale routing + geo mode (CN vs GLOBAL)
│  │  ├─ tsconfig.json
│  │  ├─ postcss.config.js
│  │  ├─ tailwind.config.ts
│  │  ├─ public/
│  │  │  ├─ assets/
│  │  │  │  ├─ branding/
│  │  │  │  │  ├─ logo.svg
│  │  │  │  │  ├─ icon-192.png
│  │  │  │  │  ├─ icon-512.png
│  │  │  │  │  └─ og-image.png
│  │  │  │  ├─ fonts/                 # self-hosted only
│  │  │  │  │  ├─ ar/
│  │  │  │  │  │  ├─ Cairo-Regular.woff2
│  │  │  │  │  │  └─ Tajawal-Regular.woff2
│  │  │  │  │  ├─ zh/
│  │  │  │  │  │  ├─ NotoSansSC-Regular.woff2
│  │  │  │  │  │  └─ PingFangSC.woff2
│  │  │  │  │  └─ en/
│  │  │  │  │     └─ Roboto-Regular.woff2
│  │  │  │  ├─ icons/
│  │  │  │  │  ├─ ui/                 # local svg icons
│  │  │  │  │  └─ flags/
│  │  │  │  ├─ lottie/                # all local or OSS-only references
│  │  │  │  │  ├─ agents/
│  │  │  │  │  │  ├─ wukong_idle.json
│  │  │  │  │  │  ├─ mandrill_idle.json
│  │  │  │  │  │  ├─ deal_cat.json
│  │  │  │  │  │  ├─ style_guru.json
│  │  │  │  │  │  ├─ trust_mother.json
│  │  │  │  │  │  ├─ hungry_panda.json
│  │  │  │  │  │  ├─ chatty_bird.json
│  │  │  │  │  │  └─ host_panda.json
│  │  │  │  │  └─ scenes/
│  │  │  │  ├─ sounds/
│  │  │  │  │  └─ crunch.mp3
│  │  │  │  └─ placeholders/
│  │  │  ├─ manifest.json
│  │  │  ├─ robots.txt
│  │  │  └─ baidu.txt
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ (root)/
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ loading.tsx
│  │  │  │  │  ├─ error.tsx
│  │  │  │  │  ├─ not-found.tsx
│  │  │  │  │  └─ page.tsx             # landing -> locale redirect
│  │  │  │  ├─ [locale]/
│  │  │  │  │  ├─ layout.tsx            # sets dir (rtl/ltr), providers, theme
│  │  │  │  │  ├─ page.tsx              # locale home (entry to Square)
│  │  │  │  │  ├─ square/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ components/
│  │  │  │  │  │  │  ├─ Top10Board.tsx
│  │  │  │  │  │  │  ├─ LiveTicker.tsx
│  │  │  │  │  │  │  └─ LiquidationBoxes.tsx
│  │  │  │  │  │  └─ actions.ts
│  │  │  │  │  ├─ playground/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ components/
│  │  │  │  │  │  │  ├─ VisualGrid.tsx
│  │  │  │  │  │  │  ├─ CartDrawer.tsx
│  │  │  │  │  │  │  ├─ GamificationPanel.tsx
│  │  │  │  │  │  │  └─ DailyFortune.tsx
│  │  │  │  │  │  └─ actions.ts
│  │  │  │  │  ├─ cockpit/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ components/
│  │  │  │  │  │  │  ├─ ImportTool.tsx
│  │  │  │  │  │  │  ├─ RFQWidget.tsx
│  │  │  │  │  │  │  ├─ KarmaMeter.tsx
│  │  │  │  │  │  │  └─ FapiaoLock.tsx
│  │  │  │  │  │  └─ actions.ts
│  │  │  │  │  ├─ vault/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ components/
│  │  │  │  │  │  │  ├─ FundingCycles.tsx
│  │  │  │  │  │  │  ├─ FactoryProfile.tsx
│  │  │  │  │  │  │  └─ TransparencyCharts.tsx
│  │  │  │  │  │  └─ actions.ts
│  │  │  │  │  ├─ throne/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ components/
│  │  │  │  │  │  │  ├─ MoneyPulse.tsx
│  │  │  │  │  │  │  ├─ FraudHeatmap.tsx
│  │  │  │  │  │  │  ├─ ComplianceStatus.tsx
│  │  │  │  │  │  │  └─ ForceMajeureTrigger.tsx
│  │  │  │  │  │  └─ actions.ts
│  │  │  │  │  ├─ auth/
│  │  │  │  │  │  ├─ login/page.tsx
│  │  │  │  │  │  ├─ register/page.tsx
│  │  │  │  │  │  └─ callback/wechat/page.tsx
│  │  │  │  │  ├─ legal/
│  │  │  │  │  │  ├─ about/page.tsx
│  │  │  │  │  │  ├─ privacy-policy/page.tsx
│  │  │  │  │  │  ├─ terms-of-service/page.tsx
│  │  │  │  │  │  └─ returns/page.tsx
│  │  │  │  │  ├─ profile/[id]/page.tsx
│  │  │  │  │  ├─ notifications/page.tsx
│  │  │  │  │  ├─ orders/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ [id]/track/page.tsx
│  │  │  │  │  ├─ wallet/page.tsx
│  │  │  │  │  └─ partner-center/page.tsx
│  │  │  │  ├─ api/                     # Next route handlers (proxy/lightweight only)
│  │  │  │  │  ├─ health/route.ts
│  │  │  │  │  ├─ geoip/route.ts
│  │  │  │  │  └─ webhooks/
│  │  │  │  │     ├─ alipay/route.ts
│  │  │  │  │     └─ wechat/route.ts
│  │  │  ├─ components/
│  │  │  │  ├─ ui/                       # shared UI primitives (no external)
│  │  │  │  ├─ layout/
│  │  │  │  ├─ agents/
│  │  │  │  │  ├─ AgentRegistry.ts
│  │  │  │  │  ├─ AgentEventBus.ts
│  │  │  │  │  ├─ AgentRenderer.tsx
│  │  │  │  │  └─ triggers/
│  │  │  │  └─ charts/                   # ECharts local bundle
│  │  │  ├─ styles/
│  │  │  │  ├─ globals.css
│  │  │  │  └─ tokens.css
│  │  │  ├─ i18n/
│  │  │  │  ├─ i18n.server.ts
│  │  │  │  ├─ i18n.client.ts
│  │  │  │  ├─ config.ts
│  │  │  │  └─ resources/
│  │  │  │     ├─ ar/
│  │  │  │     │  ├─ common.json
│  │  │  │     │  ├─ square.json
│  │  │  │     │  └─ cockpit.json
│  │  │  │     ├─ en/
│  │  │  │     └─ zh/
│  │  │  ├─ lib/
│  │  │  │  ├─ env.ts
│  │  │  │  ├─ api.ts                   # typed fetch client
│  │  │  │  ├─ csp.ts
│  │  │  │  ├─ geo.ts
│  │  │  │  ├─ format.ts
│  │  │  │  └─ constants.ts
│  │  │  ├─ hooks/
│  │  │  ├─ store/
│  │  │  ├─ types/
│  │  │  └─ tests/
│  │  └─ e2e/
│  │     ├─ playwright.config.ts
│  │     └─ specs/
│  ├─ api/
│  │  ├─ README.md
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  ├─ src/
│  │  │  ├─ main.ts
│  │  │  ├─ server.ts
│  │  │  ├─ config/
│  │  │  │  ├─ env.ts
│  │  │  │  ├─ logger.ts
│  │  │  │  └─ rate-limit.ts
│  │  │  ├─ common/
│  │  │  │  ├─ errors/
│  │  │  │  │  ├─ error-codes.ts
│  │  │  │  │  ├─ http-error.ts
│  │  │  │  │  └─ handler.ts
│  │  │  │  ├─ middleware/
│  │  │  │  │  ├─ auth.ts
│  │  │  │  │  ├─ rbac.ts
│  │  │  │  │  ├─ audit-log.ts
│  │  │  │  │  └─ validate.ts
│  │  │  │  ├─ utils/
│  │  │  │  └─ types/
│  │  │  ├─ modules/
│  │  │  │  ├─ auth/
│  │  │  │  │  ├─ auth.controller.ts
│  │  │  │  │  ├─ auth.service.ts
│  │  │  │  │  ├─ auth.routes.ts
│  │  │  │  │  └─ dto.ts
│  │  │  │  ├─ users/
│  │  │  │  ├─ catalog/                # MongoDB catalog adapter
│  │  │  │  ├─ orders/
│  │  │  │  ├─ payments/
│  │  │  │  ├─ wallet-ledger/           # ACID ledger, atomic transfers
│  │  │  │  ├─ referral/                # event-driven referral engine
│  │  │  │  ├─ kyc/                     # identity verification integration stubs
│  │  │  │  ├─ disputes/                # justice system
│  │  │  │  ├─ gamification/
│  │  │  │  ├─ ai/                      # Qwen/provider abstraction
│  │  │  │  └─ admin/
│  │  │  ├─ db/
│  │  │  │  ├─ postgres/
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ migrations/
│  │  │  │  │  └─ schema.sql            # or drizzle schema output
│  │  │  │  ├─ mongo/
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ models/
│  │  │  │  └─ redis/
│  │  │  │     └─ index.ts
│  │  │  ├─ integrations/
│  │  │  │  ├─ alipay/
│  │  │  │  ├─ wechat/
│  │  │  │  ├─ amap/
│  │  │  │  ├─ alibaba-oss/
│  │  │  │  └─ lianlianpay/            # if used for native payments
│  │  │  ├─ jobs/
│  │  │  │  ├─ ranking-cron.ts
│  │  │  │  └─ liquidation-cycle.ts
│  │  │  ├─ observability/
│  │  │  │  ├─ metrics.ts
│  │  │  │  └─ tracing.ts
│  │  │  └─ tests/
│  │  ├─ openapi/
│  │  │  ├─ openapi.yaml               # API contracts
│  │  │  └─ examples/
│  │  └─ scripts/
│  │     ├─ seed.ts
│  │     └─ create-admin.ts
├─ packages/
│  ├─ shared/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ src/
│  │     ├─ constants/
│  │     ├─ types/
│  │     ├─ validators/
│  │     └─ utils/
│  ├─ contracts/
│  │  ├─ package.json
│  │  └─ src/
│  │     ├─ http/
│  │     │  ├─ error-codes.ts
│  │     │  ├─ envelopes.ts            # standard response envelope
│  │     │  └─ pagination.ts
│  │     ├─ dto/
│  │     │  ├─ auth.dto.ts
│  │     │  ├─ users.dto.ts
│  │     │  ├─ orders.dto.ts
│  │     │  ├─ wallet.dto.ts
│  │     │  ├─ referral.dto.ts
│  │     │  └─ disputes.dto.ts
│  │     └─ openapi/
│  │        └─ schema.ts               # typed schema generator (optional)
│  └─ ui/
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ src/
│        ├─ tokens/
│        │  ├─ colors.ts
│        │  ├─ spacing.ts
│        │  ├─ typography.ts
│        │  └─ radii.ts
│        ├─ components/
│        │  ├─ Button.tsx
│        │  ├─ Card.tsx
│        │  ├─ Modal.tsx
│        │  └─ ...
│        └─ index.ts
├─ infra/
│  ├─ alibaba/
│  │  ├─ ecs/
│  │  ├─ rds/
│  │  ├─ oss/
│  │  ├─ cdn/
│  │  └─ acr/
│  ├─ env/
│  │  ├─ web.env.example
│  │  ├─ api.env.example
│  │  └─ prod.env.example
│  └─ policies/
│     ├─ data-residency.md
│     ├─ pipl.md
│     └─ backups.md
└─ test-results/
   └─ (generated)

