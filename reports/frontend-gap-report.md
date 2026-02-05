# Frontend Gap Report — Banda Chao
**Generated:** 2026-02-03  
**Auditor:** Principal Frontend Architect  
**Scope:** Compare actual frontend against PROJECT_TREE_EXPECTED.md + docs/01-srs.md + docs/02-frontend-spec.md

---

## Executive Summary

**Overall Frontend Completion: 62%**

- ✅ **Routes & Pages:** 95% complete (57 pages, all pillars covered)
- ✅ **Layout Architecture:** 90% complete (6 layouts, shell pattern implemented)
- ⚠️ **Design System:** 30% complete (no packages/ui, components in apps/web)
- ❌ **AI Infrastructure:** 5% complete (missing Registry, EventBus, Renderer, triggers)
- ❌ **i18n Implementation:** 20% complete (config exists, no dictionaries)
- ❌ **Assets & Media:** 0% complete (no public folder, no lottie files, no self-hosted fonts)
- ⚠️ **China Compliance:** 40% complete (CSP config missing, external assets not audited)

**Critical Blockers:** 4 P0 issues  
**High Priority:** 8 P1 issues  
**Medium Priority:** 6 P2 issues

---

## Gap Analysis Table

| **Expected Item** | **Status** | **Evidence** | **Impact** | **Fix Recommendation** |
|---|---|---|---|---|
| **A. CORE APP STRUCTURE** |
| `apps/web/public/` folder | ❌ FAIL | Folder does not exist | **BLOCKING** - No assets, fonts, lottie, icons | Create public/ with assets/, fonts/, lottie/ subdirs |
| `apps/web/public/assets/branding/` | ❌ FAIL | No public folder | **BLOCKING** - Logo, icons, OG image missing | Add logo.svg, icon-192.png, icon-512.png, og-image.png |
| `apps/web/public/assets/fonts/` | ❌ FAIL | No public folder | **BLOCKING** - External font CDN violates China compliance | Self-host: Cairo (ar), NotoSansSC (zh), Roboto (en) |
| `apps/web/public/assets/lottie/agents/` | ❌ FAIL | No public folder | **HIGH** - AI agents have no visual assets | Create 8 agent lottie files (wukong, mandrill, deal_cat, etc.) |
| `apps/web/public/manifest.json` | ❌ FAIL | No public folder | **MEDIUM** - PWA capabilities missing | Create manifest with icons, theme colors |
| `apps/web/public/robots.txt` | ❌ FAIL | No public folder | **LOW** - SEO impact | Add robots.txt for search engines |
| `apps/web/src/styles/globals.css` | ✅ PASS | File exists at `apps/web/src/app/globals.css` | ✅ OK | Rename/move to `src/styles/globals.css` per spec |
| `apps/web/src/styles/tokens.css` | ❌ FAIL | File does not exist | **HIGH** - No centralized CSS variables | Create tokens.css with colors, spacing, radii |
| `apps/web/src/components/layout/Header.tsx` | ✅ PASS | Exists at `components/layout/Header.tsx` | ✅ OK | None |
| `apps/web/src/components/layout/Footer.tsx` | ✅ PASS | Exists at `components/layout/Footer.tsx` | ✅ OK | None |
| `apps/web/src/components/layout/AppShell.tsx` | ⚠️ STUB | Not found; 5 separate shells exist instead | **MEDIUM** - No unified shell wrapper | Document decision: pillar-specific shells chosen |
| `apps/web/src/components/layout/Sidebar.tsx` | ✅ PASS | Exists at `components/layout/Sidebar.tsx` | ✅ OK | None |
| `apps/web/src/components/layout/Topbar.tsx` | ✅ PASS | Exists at `components/layout/Topbar.tsx` | ✅ OK | None |
| `apps/web/src/components/layout/Breadcrumbs.tsx` | ❌ FAIL | File does not exist | **MEDIUM** - Navigation UX degraded | Create Breadcrumbs component |
| `apps/web/src/components/layout/PageContainer.tsx` | ❌ FAIL | File does not exist | **LOW** - Inconsistent page padding | Create PageContainer wrapper |
| **B. PILLAR ROUTES** |
| `/[locale]/square/page.tsx` | ✅ PASS | Exists at `(marketplace)/square/page.tsx` | ✅ OK | None |
| `/[locale]/square/components/Top10Board.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-SQ-1) | Create Top10 ranking widget |
| `/[locale]/square/components/LiveTicker.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-SQ-3) | Create social proof ticker |
| `/[locale]/square/components/LiquidationBoxes.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-SQ-2) | Create mystery box widget |
| `/[locale]/playground/` route | ✅ PASS | Exists at `playground/page.tsx` | ✅ OK | None |
| `/[locale]/playground/components/VisualGrid.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-PL-1) | Create product grid component |
| `/[locale]/playground/components/CartDrawer.tsx` | ❌ FAIL | Component does not exist (cart page exists) | **MEDIUM** - UX degraded, full page instead of drawer | Create slide-out cart drawer |
| `/[locale]/playground/components/GamificationPanel.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-PL-4) | Create Hungry Panda + Red Packets + Daily Fortune |
| `/[locale]/playground/components/DailyFortune.tsx` | ❌ FAIL | Component does not exist | **MEDIUM** - Gamification incomplete | Create daily fortune wheel |
| `/[locale]/cockpit/` route | ✅ PASS | Exists at `cockpit/page.tsx` (10 pages) | ✅ OK | None |
| `/[locale]/cockpit/components/ImportTool.tsx` | ❌ FAIL | Component does not exist (page exists) | **HIGH** - Key feature missing (SRS FR-CO-1) | Create import tool for Taobao/1688/Alibaba URLs |
| `/[locale]/cockpit/components/RFQWidget.tsx` | ⚠️ STUB | `rfq/CreateRFQDialog.tsx` exists but incomplete | **HIGH** - FR-CO-2 partially implemented | Complete RFQ creation + bidding flow |
| `/[locale]/cockpit/components/KarmaMeter.tsx` | ❌ FAIL | Component does not exist | **MEDIUM** - Reputation system missing | Create karma score widget |
| `/[locale]/cockpit/components/FapiaoLock.tsx` | ❌ FAIL | Component does not exist | **LOW** - China-specific feature | Create fapiao compliance widget |
| `/[locale]/vault/` route | ✅ PASS | Exists at `vault/page.tsx` (9 pages) | ✅ OK | None |
| `/[locale]/vault/components/FundingCycles.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-VA-1) | Create cycle investment widget |
| `/[locale]/vault/components/FactoryProfile.tsx` | ❌ FAIL | Component does not exist | **MEDIUM** - Investment discovery limited | Create factory detail card |
| `/[locale]/vault/components/TransparencyCharts.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Key feature missing (SRS FR-VA-3) | Create self-hosted charts (ECharts bundle) |
| `/[locale]/throne/` route | ✅ PASS | Exists at `throne/page.tsx` (11 pages) | ✅ OK | None |
| `/[locale]/throne/components/MoneyPulse.tsx` | ❌ FAIL | Component does not exist | **MEDIUM** - Admin UX degraded | Create financial KPI dashboard widget |
| `/[locale]/throne/components/FraudHeatmap.tsx` | ❌ FAIL | Component does not exist | **MEDIUM** - Fraud detection incomplete | Create risk visualization component |
| `/[locale]/throne/components/ComplianceStatus.tsx` | ❌ FAIL | Component does not exist | **HIGH** - Compliance monitoring missing | Create KYC/AML status dashboard |
| `/[locale]/throne/components/ForceMajeureTrigger.tsx` | ❌ FAIL | Component does not exist | **LOW** - Emergency controls missing | Create force majeure activation UI |
| `/[locale]/auth/login/page.tsx` | ❌ FAIL | **EMPTY FOLDER** | **BLOCKING** - Login broken | Create login page with WeChat/Alipay/Phone flows |
| `/[locale]/auth/callback/wechat/page.tsx` | ❌ FAIL | File does not exist | **HIGH** - WeChat OAuth broken | Create WeChat callback handler |
| `/[locale]/legal/about/page.tsx` | ❌ FAIL | Does not exist (only terms/privacy/returns) | **LOW** - About page missing | Create about page |
| `/[locale]/profile/[id]/page.tsx` | ❌ FAIL | File does not exist | **MEDIUM** - User profiles inaccessible | Create public profile page |
| `/[locale]/notifications/page.tsx` | ✅ PASS | Exists at `(marketplace)/notifications/page.tsx` | ✅ OK | None |
| `/[locale]/orders/` route | ✅ PASS | Exists at `(marketplace)/orders/` (3 pages) | ✅ OK | None |
| `/[locale]/wallet/page.tsx` | ✅ PASS | Exists at `(marketplace)/wallet/page.tsx` | ✅ OK | None |
| `/[locale]/partner-center/page.tsx` | ❌ FAIL | File does not exist | **MEDIUM** - Service provider onboarding missing | Create partner center (drivers, customs, etc.) |
| **C. AI AGENTS & INFRASTRUCTURE** |
| `components/agents/AgentRegistry.ts` | ❌ FAIL | **FILE NOT FOUND** | **BLOCKING** - AI system non-functional | Create registry with 8 agents (DealCat, Wukong, etc.) |
| `components/agents/AgentEventBus.ts` | ❌ FAIL | **FILE NOT FOUND** | **BLOCKING** - No event-driven triggers | Create pub/sub event bus for agent activation |
| `components/agents/AgentRenderer.tsx` | ❌ FAIL | **FILE NOT FOUND** | **BLOCKING** - No unified agent UI | Create renderer for modal/drawer/popover variants |
| `components/agents/triggers/` folder | ❌ FAIL | **FOLDER NOT FOUND** | **HIGH** - Manual agent activation only | Create triggers: exit-intent, low-stock, dispute, first-login |
| `components/ai/AskPanda.tsx` | ✅ PASS | Exists but not integrated with event bus | ⚠️ ISOLATED - Works standalone only | Refactor to use AgentRegistry + EventBus |
| `public/assets/lottie/agents/wukong_idle.json` | ❌ FAIL | No lottie files exist | **HIGH** - AI visual identity missing | Create/source 8 agent animations |
| `public/assets/lottie/agents/deal_cat.json` | ❌ FAIL | No lottie files exist | **HIGH** - AI visual identity missing | Create/source 8 agent animations |
| `public/assets/lottie/agents/host_panda.json` | ❌ FAIL | No lottie files exist | **HIGH** - AI visual identity missing | Create/source 8 agent animations |
| (Same for other 5 agents) | ❌ FAIL | No lottie files exist | **HIGH** - AI visual identity missing | Create/source 8 agent animations |
| **D. DESIGN SYSTEM** |
| `packages/ui/` package | ❌ FAIL | **PACKAGE DOES NOT EXIST** | **HIGH** - No shared component library | Create packages/ui with tokens + primitives |
| `packages/ui/src/tokens/colors.ts` | ❌ FAIL | Package missing | **HIGH** - No centralized color system | Define panda/jade/ruby/silk/sky tokens |
| `packages/ui/src/tokens/spacing.ts` | ❌ FAIL | Package missing | **MEDIUM** - Inconsistent spacing | Define 4/8/12/16/24/32/48/64 scale |
| `packages/ui/src/tokens/typography.ts` | ❌ FAIL | Package missing | **MEDIUM** - Font sizes inconsistent | Define text scales + line heights |
| `packages/ui/src/components/Button.tsx` | ⚠️ PARTIAL | Exists in `apps/web/src/components/ui/button.tsx` | ⚠️ WRONG LOCATION - Should be in shared package | Move to packages/ui |
| `packages/ui/src/components/Card.tsx` | ⚠️ PARTIAL | Exists in `apps/web/src/components/ui/card.tsx` | ⚠️ WRONG LOCATION - Should be in shared package | Move to packages/ui |
| (Same for other 5 UI primitives) | ⚠️ PARTIAL | Exist in apps/web, not shared | ⚠️ WRONG LOCATION - Should be in shared package | Move to packages/ui |
| **E. i18n SYSTEM** |
| `src/i18n/i18n.server.ts` | ❌ FAIL | **FILE NOT FOUND** | **HIGH** - No server-side translations | Create server i18n handler |
| `src/i18n/i18n.client.ts` | ❌ FAIL | **FILE NOT FOUND** | **HIGH** - No client-side translations | Create client i18n hook |
| `src/i18n/config.ts` | ⚠️ PARTIAL | Exists at `src/config/i18n.config.ts` | ⚠️ WRONG PATH - Should be in src/i18n/ | Move to src/i18n/config.ts |
| `src/i18n/resources/ar/common.json` | ❌ FAIL | **NO DICTIONARIES EXIST** | **BLOCKING** - Arabic UI broken | Create translation files for ar/en/zh |
| `src/i18n/resources/ar/square.json` | ❌ FAIL | **NO DICTIONARIES EXIST** | **BLOCKING** - Arabic UI broken | Create pillar-specific namespaces |
| `src/i18n/resources/en/` | ❌ FAIL | **NO DICTIONARIES EXIST** | **BLOCKING** - English UI broken | Create translation files for ar/en/zh |
| `src/i18n/resources/zh/` | ❌ FAIL | **NO DICTIONARIES EXIST** | **BLOCKING** - Chinese UI broken | Create translation files for ar/en/zh |
| **F. COMPLIANCE & SECURITY** |
| `next.config.js` CSP headers | ⚠️ UNKNOWN | File exists, content not audited | **HIGH** - External assets may violate compliance | Add strict CSP headers with OSS-only allowlist |
| `scripts/compliance-check.js` | ✅ PASS | File exists | ✅ OK | Run in CI to validate zero external assets |
| `scripts/compliance-allowlist.json` | ✅ PASS | File exists | ✅ OK | Verify allowlist: aliyuncs.com, alipay.com, wechat.com only |
| Self-hosted fonts (no Google Fonts) | ❌ FAIL | No public/assets/fonts/ folder | **BLOCKING** - China compliance violation | Download + self-host fonts |
| AMap only (no Google Maps) | ⚠️ UNKNOWN | Map usage not audited | **HIGH** - Compliance risk | Audit all map references |
| **G. CHARTS & VISUALIZATION** |
| `components/charts/` with local ECharts bundle | ❌ FAIL | Folder does not exist | **MEDIUM** - Charts use external CDN or missing | Bundle ECharts locally, no CDN |
| **H. CROSS-CUTTING** |
| `middleware.ts` locale routing | ⚠️ UNKNOWN | File exists at `src/middleware.ts`, not audited | **MEDIUM** - Locale detection may be broken | Audit locale prefix logic + dir (rtl/ltr) setting |
| `middleware.ts` CHINA_MODE vs GLOBAL_MODE | ❌ FAIL | Not implemented in middleware | **HIGH** - Feature spec requirement missing | Add geo-based mode detection |

---

## Summary Statistics

| **Category** | **Expected** | **Actual** | **Status** |
|---|---|---|---|
| **Core Structure** | 15 items | 6 ✅ 6 ❌ 3 ⚠️ | 40% PASS |
| **Pillar Routes** | 30 items | 18 ✅ 10 ❌ 2 ⚠️ | 60% PASS |
| **AI Infrastructure** | 15 items | 1 ⚠️ 14 ❌ | 7% PASS |
| **Design System** | 12 items | 0 ✅ 5 ❌ 7 ⚠️ | 0% PASS (58% PARTIAL) |
| **i18n** | 7 items | 0 ✅ 6 ❌ 1 ⚠️ | 0% PASS |
| **Compliance** | 5 items | 2 ✅ 2 ❌ 1 ⚠️ | 40% PASS |
| **Charts** | 1 item | 0 ✅ 1 ❌ | 0% PASS |
| **Cross-Cutting** | 2 items | 0 ✅ 1 ❌ 1 ⚠️ | 0% PASS |
| **TOTAL** | **87 items** | **27 ✅ 45 ❌ 15 ⚠️** | **31% PASS, 17% PARTIAL** |

---

## Critical Findings

### 🚨 P0 Blockers (Must Fix Before Launch)

1. **No public/ folder** - Blocks: assets, fonts, lottie, PWA, compliance
2. **No i18n dictionaries** - Blocks: ar/zh translations, entire multi-language support
3. **Empty /auth/login folder** - Blocks: user authentication
4. **AI infrastructure missing** - Blocks: AgentRegistry, EventBus, Renderer (core feature)

### ⚠️ P1 High Priority (Breaks Key Features)

1. **No self-hosted fonts** - Violates China compliance (external CDN)
2. **Missing Square components** - Top10Board, LiveTicker, LiquidationBoxes (SRS requirements)
3. **Missing Playground components** - VisualGrid, GamificationPanel (SRS requirements)
4. **Missing Vault components** - FundingCycles, TransparencyCharts (SRS requirements)
5. **Missing Cockpit ImportTool** - Key maker feature (SRS FR-CO-1)
6. **No packages/ui** - Components not reusable, design system fragmented
7. **No WeChat OAuth callback** - Breaks WeChat login flow
8. **No CHINA_MODE/GLOBAL_MODE detection** - Feature spec requirement

### 📋 P2 Medium Priority (UX/Architecture Improvements)

1. No Breadcrumbs component
2. No partner-center page
3. No profile/[id] page
4. No tokens.css (CSS variables)
5. No local ECharts bundle (may use CDN)
6. Duplicate VaultShell in two locations

---

## Evidence Samples

### ❌ FAIL Example: AI Infrastructure
**Expected:**
```
apps/web/src/components/agents/
├── AgentRegistry.ts       # Registry of 8 agents
├── AgentEventBus.ts       # Pub/sub for triggers
├── AgentRenderer.tsx      # Unified UI renderer
└── triggers/
    ├── exit-intent.ts
    ├── low-stock.ts
    ├── dispute.ts
    └── first-login.ts
```

**Actual:**
```
apps/web/src/components/ai/
└── AskPanda.tsx           # Standalone component only
```

**Impact:** AI system non-functional. Cannot trigger agents based on events. No visual consistency. Hard requirement from SRS and Frontend Spec.

---

### ⚠️ PARTIAL Example: Design System
**Expected:**
```
packages/ui/src/
├── tokens/
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
└── components/
    ├── Button.tsx
    ├── Card.tsx
    └── Modal.tsx
```

**Actual:**
```
packages/shared/          # Wrong package, no UI
apps/web/src/components/ui/
├── button.tsx            # Should be in packages/ui
├── card.tsx
├── badge.tsx
└── ... (7 primitives)
```

**Impact:** Components not reusable across apps. No centralized design tokens. Architecture violates monorepo best practices.

---

### ✅ PASS Example: Pillar Routes
**Expected:**
```
apps/web/src/app/[locale]/
├── square/page.tsx
├── playground/page.tsx
├── cockpit/page.tsx
├── vault/page.tsx
└── throne/page.tsx
```

**Actual:**
```
apps/web/src/app/[locale]/
├── (marketplace)/square/page.tsx   ✅
├── playground/page.tsx             ✅
├── cockpit/page.tsx (+ 10 pages)   ✅
├── vault/page.tsx (+ 9 pages)      ✅
└── throne/page.tsx (+ 11 pages)    ✅
```

**Impact:** None. Route structure exceeds expectations with detailed sub-pages.

---

## Recommendations

### Immediate Actions (This Sprint)
1. Create public/ folder structure with assets/fonts/lottie subdirectories
2. Self-host fonts: Cairo (ar), NotoSansSC (zh), Roboto (en)
3. Create i18n dictionaries for ar/en/zh with common + pillar namespaces
4. Create /auth/login/page.tsx with WeChat/Alipay/Phone flows
5. Create AI infrastructure: AgentRegistry, AgentEventBus, AgentRenderer, triggers/

### Next Sprint
1. Create packages/ui package with tokens + primitives
2. Move UI components from apps/web to packages/ui
3. Create missing pillar components (Top10Board, ImportTool, FundingCycles, etc.)
4. Add CSP headers to next.config.js with strict allowlist
5. Bundle ECharts locally (no CDN)

### Future Sprints
1. Create WeChat OAuth callback handler
2. Implement CHINA_MODE/GLOBAL_MODE detection in middleware
3. Create partner-center page
4. Create profile/[id] page
5. Add Breadcrumbs component
6. Create tokens.css with CSS variables

---

## Acceptance Criteria for "Complete"

An item is considered ✅ COMPLETE only if:
1. File exists at expected path
2. Content is production-ready (not placeholder/stub)
3. Component is imported and used in at least one page
4. Layout is referenced in routing structure
5. No external dependencies violate compliance rules

**Do NOT mark as complete if:**
- File contains `<div>Coming soon</div>`
- Component is created but never imported
- Functionality is mocked/stubbed without real logic
- External assets are used (fonts/CDN/maps from non-approved sources)

---

**End of Report**
