# Priority Fix Plan — Frontend Implementation Roadmap
**Generated:** 2026-02-03  
**Based On:** frontend-gap-report.md, routes-map, layouts-audit, design-system-audit, ai-frontend-audit  
**Sprint Duration:** 2 weeks per sprint

---

## Executive Dashboard

**Total Issues Found:** 87  
**P0 (Blocking):** 4 issues  
**P1 (High):** 18 issues  
**P2 (Medium):** 12 issues  
**P3 (Nice to Have):** 6 issues  

**Estimated Timeline:**
- **Sprint 1 (P0):** 2 weeks - Compliance & Authentication  
- **Sprint 2 (P1):** 2 weeks - AI Infrastructure  
- **Sprint 3 (P1):** 2 weeks - Design System Migration  
- **Sprint 4 (P1-P2):** 2 weeks - Feature Components  
- **Sprint 5 (P2-P3):** 2 weeks - Polish & Missing Pages  

**Total: 10 weeks (2.5 months)**

---

## Sprint 1: P0 Blockers (Compliance & Auth) — CRITICAL

**Sprint Goal:** Unblock launch - fix compliance violations, enable authentication

**Duration:** 2 weeks  
**Team:** 2 developers  
**Priority:** 🚨 **BLOCKING**

### Issues to Fix (4 items)

#### 1. Self-Host Fonts (China Compliance)
**Issue:** No `public/assets/fonts/` folder, likely using external CDN  
**Impact:** **BLOCKING** - Violates zero-external-assets compliance (ADR-0005)  
**Affected Files:**
- `apps/web/public/assets/fonts/` (create)
- `apps/web/src/app/layout.tsx` (update font imports)

**Steps:**
1. Download fonts:
   - Arabic: Cairo-Regular.woff2, Tajawal-Regular.woff2
   - Chinese: NotoSansSC-Regular.woff2, PingFangSC.woff2
   - English: Roboto-Regular.woff2
2. Create folder structure:
   ```
   public/assets/fonts/
   ├── ar/
   ├── zh/
   └── en/
   ```
3. Update root layout to load fonts:
   ```tsx
   import localFont from 'next/font/local';
   
   const cairo = localFont({
     src: '../public/assets/fonts/ar/Cairo-Regular.woff2',
     variable: '--font-cairo',
   });
   ```
4. Update tailwind.config.ts:
   ```typescript
   fontFamily: {
     sans: ['var(--font-roboto)', 'sans-serif'],
     arabic: ['var(--font-cairo)', 'sans-serif'],
     chinese: ['var(--font-noto-sc)', 'sans-serif'],
   }
   ```
5. Run `scripts/compliance-check.js` to verify zero externals

**Acceptance Criteria:**
- ✅ All fonts load from local files
- ✅ No external font CDN requests
- ✅ Compliance check passes with 0 external hosts
- ✅ RTL (Arabic) fonts render correctly

**Estimated:** 2 days

---

#### 2. Create i18n Dictionaries
**Issue:** No translation files (ar/en/zh), i18n config exists but unused  
**Impact:** **BLOCKING** - Multi-language support broken  
**Affected Files:**
- `apps/web/src/i18n/resources/ar/` (create)
- `apps/web/src/i18n/resources/en/` (create)
- `apps/web/src/i18n/resources/zh/` (create)
- `apps/web/src/i18n/i18n.server.ts` (create)
- `apps/web/src/i18n/i18n.client.ts` (create)

**Steps:**
1. Create folder structure:
   ```
   src/i18n/resources/
   ├── ar/
   │   ├── common.json
   │   ├── square.json
   │   ├── cockpit.json
   │   ├── vault.json
   │   └── throne.json
   ├── en/
   └── zh/
   ```
2. Create common.json with basic UI strings:
   ```json
   {
     "welcome": "Welcome",
     "login": "Login",
     "logout": "Logout",
     "search": "Search",
     "cart": "Cart",
     "wallet": "Wallet"
   }
   ```
3. Create pillar-specific namespaces (square, cockpit, vault, throne)
4. Create i18n.server.ts for server components:
   ```typescript
   import { createInstance } from 'i18next';
   export async function getServerSideI18n(locale: string) { ... }
   ```
5. Create i18n.client.ts for client components:
   ```typescript
   import { useTranslation } from 'react-i18next';
   export function useI18n() { ... }
   ```
6. Update pages to use translations

**Acceptance Criteria:**
- ✅ All 3 locales have translation files (ar/en/zh)
- ✅ Common namespace has 50+ strings
- ✅ Pillar namespaces have 20+ strings each
- ✅ `useI18n()` hook works in client components
- ✅ `getServerSideI18n()` works in server components
- ✅ Language switcher changes UI text

**Estimated:** 3 days

---

#### 3. Create /auth/login Page
**Issue:** `/auth/login/` folder is empty, login broken  
**Impact:** **BLOCKING** - Users cannot authenticate  
**Affected Files:**
- `apps/web/src/app/[locale]/auth/login/page.tsx` (create)

**Steps:**
1. Create login page with 3 flows:
   - Phone/SMS (China primary)
   - WeChat OAuth
   - Alipay OAuth
2. Add CHINA_MODE vs GLOBAL_MODE detection (from middleware)
3. CHINA_MODE shows: Phone, WeChat, Alipay, Apple
4. GLOBAL_MODE shows: Google, Facebook (future)
5. Form validation (phone number, SMS code)
6. API integration:
   ```typescript
   POST /api/auth/login
   Body: { phone: string, code: string } | { provider: 'wechat', token: string }
   ```
7. Redirect to dashboard after login
8. Handle errors (invalid code, rate limit)

**Acceptance Criteria:**
- ✅ Login page renders with 3 auth options
- ✅ Phone/SMS flow works (sends code, verifies, logs in)
- ✅ WeChat OAuth button redirects to WeChat (callback handler in Sprint 2)
- ✅ Form validation works (phone format, code required)
- ✅ Error messages display correctly
- ✅ Successful login redirects to dashboard

**Estimated:** 2 days

---

#### 4. Create Public Folder Structure
**Issue:** No `public/` folder, blocking assets, lottie, PWA  
**Impact:** **BLOCKING** - No static assets, no lottie, no PWA  
**Affected Files:**
- `apps/web/public/` (create entire structure)

**Steps:**
1. Create folder structure:
   ```
   public/
   ├── assets/
   │   ├── branding/
   │   │   ├── logo.svg
   │   │   ├── icon-192.png
   │   │   ├── icon-512.png
   │   │   └── og-image.png
   │   ├── fonts/ (from Issue #1)
   │   ├── icons/
   │   │   └── ui/
   │   ├── lottie/
   │   │   ├── agents/  (placeholder for Sprint 2)
   │   │   └── scenes/
   │   └── sounds/
   │       └── crunch.mp3 (optional)
   ├── manifest.json
   ├── robots.txt
   └── baidu.txt (optional for China SEO)
   ```
2. Create manifest.json:
   ```json
   {
     "name": "BandaChao",
     "short_name": "BandaChao",
     "icons": [
       { "src": "/assets/branding/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/assets/branding/icon-512.png", "sizes": "512x512", "type": "image/png" }
     ],
     "theme_color": "#7C3AED",
     "background_color": "#0B1220",
     "display": "standalone"
   }
   ```
3. Create robots.txt:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://bandachao.com/sitemap.xml
   ```
4. Design/export logo.svg and icons (or placeholder)

**Acceptance Criteria:**
- ✅ public/ folder exists with full structure
- ✅ Branding assets present (logo, icons, OG image)
- ✅ manifest.json valid (PWA installable)
- ✅ robots.txt present
- ✅ Fonts folder ready (populated in Issue #1)
- ✅ Lottie folder ready (populated in Sprint 2)

**Estimated:** 1 day

---

### Sprint 1 Summary
- **Total Issues:** 4  
- **Total Estimated Days:** 8 days (1.6 weeks, fits in 2-week sprint)  
- **Acceptance:** All P0 blockers resolved, app is compliant and users can log in

---

## Sprint 2: P1 AI Infrastructure — HIGH

**Sprint Goal:** Enable event-driven AI agents system

**Duration:** 2 weeks  
**Team:** 2 developers  
**Priority:** 🔴 **HIGH** - Core feature

### Issues to Fix (6 items)

#### 1. Create AgentRegistry.ts
**Issue:** No central agent registry  
**Impact:** **HIGH** - Cannot discover or configure agents  
**Affected Files:**
- `apps/web/src/components/agents/AgentRegistry.ts` (create)

**Steps:**
1. Define Agent interface:
   ```typescript
   export interface Agent {
     id: string;
     name: string;
     role: string;
     description: string;
     assetPath: string;  // Lottie animation path
     surfaces: string[];  // Where agent appears
     triggers: string[];  // Event IDs
     permissions: 'AUTO' | 'USER' | 'NUCLEAR';
   }
   ```
2. Create AGENTS array with 8 agents:
   - Deal Cat (negotiation, exit intent)
   - Cyber Wukong (fraud, low stock)
   - Magistrate Mandrill (disputes)
   - Style Guru (fashion recommendations)
   - Trust Mother (trust & safety)
   - Hungry Panda (gamification)
   - Chatty Bird (support)
   - Host Panda (onboarding)
3. Export helper functions:
   ```typescript
   export function getAgentById(id: string): Agent | undefined
   export function getAgentsByTrigger(trigger: string): Agent[]
   export function getAgentsBySurface(surface: string): Agent[]
   ```

**Acceptance Criteria:**
- ✅ AgentRegistry.ts exports AGENTS array (8 agents)
- ✅ Each agent has all required fields
- ✅ Helper functions work correctly
- ✅ No TypeScript errors

**Estimated:** 1 day

---

#### 2. Create AgentEventBus.ts
**Issue:** No pub/sub system for agent triggers  
**Impact:** **HIGH** - Cannot trigger agents based on events  
**Affected Files:**
- `apps/web/src/components/agents/AgentEventBus.ts` (create)

**Steps:**
1. Create EventBus class with Map-based storage:
   ```typescript
   class EventBus {
     private listeners: Map<string, EventCallback[]>;
     subscribe(event: string, callback: EventCallback): void
     publish(event: string, data: any): void
     unsubscribe(event: string, callback: EventCallback): void
   }
   ```
2. Export singleton instance:
   ```typescript
   export const agentEventBus = new EventBus();
   ```
3. Add debugging mode (console.log events if DEV=true)
4. Add event history (last 50 events for audit)

**Acceptance Criteria:**
- ✅ EventBus class works (subscribe/publish/unsubscribe)
- ✅ Multiple subscribers to same event work
- ✅ Unsubscribe removes only specific callback
- ✅ No memory leaks (cleanup tested)

**Estimated:** 1 day

---

#### 3. Create AgentRenderer.tsx
**Issue:** No unified UI for displaying agents  
**Impact:** **HIGH** - Inconsistent agent UX  
**Affected Files:**
- `apps/web/src/components/agents/AgentRenderer.tsx` (create)

**Steps:**
1. Create AgentRenderer component:
   ```typescript
   interface AgentRendererProps {
     agent: Agent;
     mode: 'modal' | 'drawer' | 'popover';
     onClose: () => void;
     context?: any;
   }
   ```
2. Implement 3 modes:
   - Modal: Center overlay (default)
   - Drawer: Slide from right (like AskPanda)
   - Popover: Small tooltip-style
3. Add Lottie animation player (react-lottie-player)
4. Add AgentChat component (reuse AskPanda logic)
5. Add Framer Motion animations

**Acceptance Criteria:**
- ✅ AgentRenderer supports modal mode
- ✅ AgentRenderer supports drawer mode
- ✅ AgentRenderer supports popover mode
- ✅ Lottie animations play (or placeholder icon)
- ✅ Chat interface works (send/receive messages)
- ✅ Close button works in all modes

**Estimated:** 2 days

---

#### 4. Create Exit Intent Trigger (Deal Cat)
**Issue:** No exit intent detection  
**Impact:** **HIGH** - Deal Cat cannot activate  
**Affected Files:**
- `apps/web/src/components/agents/triggers/exit-intent.ts` (create)
- `apps/web/src/app/[locale]/(marketplace)/layout.tsx` (update)

**Steps:**
1. Create exit-intent.ts:
   ```typescript
   export function initExitIntentTrigger() {
     document.addEventListener('mouseleave', (e) => {
       if (e.clientY < 10) {  // Mouse near top
         agentEventBus.publish('exit_intent', { timestamp: Date.now() });
       }
     });
   }
   ```
2. Subscribe to event in marketplace layout:
   ```typescript
   useEffect(() => {
     initExitIntentTrigger();
     
     agentEventBus.subscribe('exit_intent', (data) => {
       setShowDealCat(true);  // Show Deal Cat modal
     });
   }, []);
   ```
3. Render AgentRenderer when triggered
4. Test in /products and /cart pages

**Acceptance Criteria:**
- ✅ Mouse leaving top of page triggers event
- ✅ Deal Cat modal appears
- ✅ Modal shows Deal Cat lottie + chat
- ✅ Only triggers once per session (localStorage flag)

**Estimated:** 1 day

---

#### 5. Create Low Stock Trigger (Cyber Wukong)
**Issue:** No low stock detection for makers  
**Impact:** **HIGH** - Wukong cannot alert makers  
**Affected Files:**
- `apps/web/src/components/agents/triggers/low-stock.ts` (create)
- `apps/web/src/app/[locale]/cockpit/inventory/page.tsx` (update)

**Steps:**
1. Create low-stock.ts:
   ```typescript
   export function checkLowStock(inventory: Product[]) {
     const lowStockItems = inventory.filter(p => p.stock < p.lowStockThreshold);
     if (lowStockItems.length > 0) {
       agentEventBus.publish('low_stock', { items: lowStockItems });
     }
   }
   ```
2. Call checkLowStock() on inventory page load
3. Subscribe to event in cockpit layout:
   ```typescript
   agentEventBus.subscribe('low_stock', (data) => {
     setShowWukong(true);
     setWukongContext(data.items);
   });
   ```
4. Render AgentRenderer with low stock item list

**Acceptance Criteria:**
- ✅ Low stock detection works (checks threshold)
- ✅ Cyber Wukong modal appears in cockpit
- ✅ Modal shows low stock items list
- ✅ Maker can restock from modal

**Estimated:** 1 day

---

#### 6. Source Lottie Animations (8 agents)
**Issue:** No visual assets for agents  
**Impact:** **HIGH** - Agents have no identity  
**Affected Files:**
- `apps/web/public/assets/lottie/agents/*.json` (8 files)

**Steps:**
1. Source lottie files:
   - Option A: Create custom animations (Figma/After Effects → Lottie)
   - Option B: Purchase from LottieFiles marketplace
   - Option C: Use free alternatives from LottieFiles
   - Option D: Placeholder SVGs for now (upgrade later)
2. Name files to match AgentRegistry:
   - `wukong_idle.json`
   - `mandrill_idle.json`
   - `deal_cat.json`
   - `style_guru.json`
   - `trust_mother.json`
   - `hungry_panda.json`
   - `chatty_bird.json`
   - `host_panda.json`
3. Test animations load in AgentRenderer
4. Optimize file sizes (<100KB each)

**Acceptance Criteria:**
- ✅ 8 lottie files in public/assets/lottie/agents/
- ✅ Files load correctly in AgentRenderer
- ✅ Animations loop smoothly
- ✅ Total size <800KB for all 8

**Estimated:** 2 days (if purchasing/sourcing)

---

### Sprint 2 Summary
- **Total Issues:** 6  
- **Total Estimated Days:** 8 days (1.6 weeks, fits in 2-week sprint)  
- **Acceptance:** AI system functional, Deal Cat + Wukong working

---

## Sprint 3: P1 Design System Migration — HIGH

**Sprint Goal:** Create packages/ui and migrate components

**Duration:** 2 weeks  
**Team:** 2 developers  
**Priority:** 🔴 **HIGH** - Architecture

### Issues to Fix (4 items)

#### 1. Create packages/ui Package
**Issue:** No shared UI package  
**Impact:** **HIGH** - Components not reusable  
**Affected Files:**
- `packages/ui/` (create entire package)

**Steps:**
1. Create folder structure:
   ```
   packages/ui/
   ├── package.json
   ├── tsconfig.json
   ├── src/
   │   ├── tokens/
   │   │   ├── colors.ts
   │   │   ├── spacing.ts
   │   │   ├── typography.ts
   │   │   └── radii.ts
   │   ├── components/
   │   └── index.ts
   ```
2. Create package.json:
   ```json
   {
     "name": "@bandachao/ui",
     "version": "0.1.0",
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "exports": {
       ".": "./src/index.ts",
       "./tokens": "./src/tokens/index.ts"
     }
   }
   ```
3. Create tsconfig.json (extends base)
4. Add to pnpm-workspace.yaml

**Acceptance Criteria:**
- ✅ packages/ui exists with correct structure
- ✅ package.json valid
- ✅ TypeScript compiles
- ✅ Can import from apps/web: `import { Button } from '@bandachao/ui'`

**Estimated:** 1 day

---

#### 2. Create Token Files
**Issue:** Design tokens only in tailwind.config.ts  
**Impact:** **MEDIUM** - Not reusable as TypeScript  
**Affected Files:**
- `packages/ui/src/tokens/*.ts` (create 4 files)

**Steps:**
1. Create colors.ts:
   ```typescript
   export const colors = {
     ink: { 950: "#070A0F", 900: "#0B1220", ... },
     slate: { 200: "#E6EAF2", 300: "#C9D2E3", ... },
     panda: { 500: "#7C3AED", ... },
     // ... all tokens from tailwind.config.ts
   };
   ```
2. Create spacing.ts:
   ```typescript
   export const spacing = { 0: 0, 1: 4, 2: 8, 3: 12, ... };
   ```
3. Create typography.ts:
   ```typescript
   export const typography = {
     sizes: { xs: 12, sm: 14, base: 16, ... },
     lineHeights: { tight: 1.25, normal: 1.5, ... },
   };
   ```
4. Create radii.ts:
   ```typescript
   export const radii = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 };
   ```
5. Update tailwind.config.ts to import from @bandachao/ui/tokens

**Acceptance Criteria:**
- ✅ 4 token files created
- ✅ All values match tailwind.config.ts
- ✅ tailwind.config.ts imports from @bandachao/ui/tokens
- ✅ No duplicate values

**Estimated:** 1 day

---

#### 3. Migrate 7 UI Primitives
**Issue:** UI components in apps/web instead of packages/ui  
**Impact:** **HIGH** - Not reusable across apps  
**Affected Files:**
- Move: `apps/web/src/components/ui/*.tsx` → `packages/ui/src/components/*.tsx`

**Steps:**
1. Move components (rename to PascalCase):
   - button.tsx → Button.tsx
   - card.tsx → Card.tsx
   - badge.tsx → Badge.tsx
   - dialog.tsx → Dialog.tsx
   - input.tsx → Input.tsx
   - skeleton.tsx → Skeleton.tsx
   - tabs.tsx → Tabs.tsx
2. Update imports in each component (use @bandachao/ui/tokens)
3. Export from packages/ui/src/index.ts:
   ```typescript
   export { Button } from './components/Button';
   export { Card, CardHeader, CardTitle, ... } from './components/Card';
   // ... etc
   ```
4. Update all imports in apps/web:
   ```typescript
   // Before:
   import { Button } from '@/components/ui/button';
   
   // After:
   import { Button } from '@bandachao/ui';
   ```
5. Delete old apps/web/src/components/ui/ folder
6. Run typecheck: `pnpm run typecheck`

**Acceptance Criteria:**
- ✅ All 7 components in packages/ui/src/components/
- ✅ All exports in packages/ui/src/index.ts
- ✅ All imports in apps/web updated
- ✅ No TypeScript errors
- ✅ App builds successfully

**Estimated:** 2 days

---

#### 4. Create tokens.css (Optional but Recommended)
**Issue:** No CSS variables for runtime theming  
**Impact:** **MEDIUM** - Harder to do dynamic themes  
**Affected Files:**
- `apps/web/src/styles/tokens.css` (create)

**Steps:**
1. Create tokens.css:
   ```css
   :root {
     /* Backgrounds */
     --bg: #0B1220;
     --bg-elev-1: #0F1A2D;
     --bg-elev-2: #141F33;
     
     /* Text */
     --text: #E6EAF2;
     --text-muted: #C9D2E3;
     --text-dim: #9AA6BE;
     
     /* Borders */
     --border: rgba(255,255,255,0.10);
     --border-strong: rgba(255,255,255,0.16);
     
     /* Primary */
     --primary: #7C3AED;
     --primary-hover: #6D28D9;
     
     /* ... etc for all tokens */
   }
   ```
2. Import in globals.css:
   ```css
   @import './tokens.css';
   ```
3. Update tailwind.config.ts to use CSS vars:
   ```typescript
   colors: {
     bg: 'var(--bg)',
     'bg-elev-1': 'var(--bg-elev-1)',
     // ...
   }
   ```

**Acceptance Criteria:**
- ✅ tokens.css created with all values
- ✅ Imported in globals.css
- ✅ Tailwind uses CSS vars
- ✅ No visual regressions

**Estimated:** 1 day

---

### Sprint 3 Summary
- **Total Issues:** 4  
- **Total Estimated Days:** 5 days (1 week, fits in 2-week sprint with buffer)  
- **Acceptance:** packages/ui exists, components migrated, tokens centralized

---

## Sprint 4: P1-P2 Feature Components — MEDIUM-HIGH

**Sprint Goal:** Implement missing feature components for pillars

**Duration:** 2 weeks  
**Team:** 2 developers  
**Priority:** 🔴 **P1** + 🟡 **P2**

### Issues to Fix (8 items)

#### 1. Create Top10Board.tsx (Square)
**Issue:** Missing Live Index Top10 widget (SRS FR-SQ-1)  
**Impact:** **HIGH** - Key feature missing  
**Files:** `apps/web/src/app/[locale]/(marketplace)/square/components/Top10Board.tsx`

**Steps:**
1. Create Top10Board component with:
   - Hourly updated ranking (mock data)
   - Score formula: Sales*0.5 + Quality*0.3 + DeliverySpeed*0.2
   - Product cards with image, name, score, rank badge
2. Add animations (Framer Motion stagger)
3. Link to product detail pages
4. Add "View All" button

**Estimated:** 1 day

---

#### 2. Create LiveTicker.tsx (Square)
**Issue:** Missing social proof ticker (SRS FR-SQ-3)  
**Impact:** **HIGH** - Key feature missing  
**Files:** `apps/web/src/app/[locale]/(marketplace)/square/components/LiveTicker.tsx`

**Steps:**
1. Create LiveTicker component with:
   - Scrolling ticker of recent events (purchases, reviews)
   - WebSocket connection (mock for now)
   - Animated entries (fade in from right)
2. Event types: Purchase, Review, Rating
3. Show: user (masked), product, action, timestamp

**Estimated:** 1 day

---

#### 3. Create LiquidationBoxes.tsx (Square)
**Issue:** Missing mystery box widget (SRS FR-SQ-2)  
**Impact:** **HIGH** - Key feature missing  
**Files:** `apps/web/src/app/[locale]/(marketplace)/square/components/LiquidationBoxes.tsx`

**Steps:**
1. Create LiquidationBoxes component with:
   - 3-4 mystery boxes (Cycle liquidation)
   - Category hints (no specific products)
   - "No Loss Policy" badge
   - Price vs market value
2. Add purchase flow (opens modal → payment)

**Estimated:** 1 day

---

#### 4. Create ImportTool.tsx (Cockpit)
**Issue:** Missing import tool for Taobao/1688/Alibaba (SRS FR-CO-1)  
**Impact:** **HIGH** - Key maker feature missing  
**Files:** `apps/web/src/app/[locale]/cockpit/import/components/ImportTool.tsx`

**Steps:**
1. Create ImportTool component with:
   - URL input (paste Taobao/1688/Alibaba URL)
   - "Fetch" button → scrapes product data (API call)
   - Preview scraped data (images, title, price, specs)
   - "Import to Catalog" button → saves to Mongo
2. Handle errors (invalid URL, scraping failed)

**Estimated:** 2 days

---

#### 5. Create FundingCycles.tsx (Vault)
**Issue:** Missing investment cycles widget (SRS FR-VA-1)  
**Impact:** **HIGH** - Key investor feature missing  
**Files:** `apps/web/src/app/[locale]/vault/components/FundingCycles.tsx`

**Steps:**
1. Create FundingCycles component with:
   - List of active cycles (1 week - 3 months)
   - Cycle cards: factory, amount, duration, ROI estimate
   - "Invest" button → opens investment flow
   - Progress bar (days remaining)
2. Filter: active/completed/upcoming

**Estimated:** 1 day

---

#### 6. Create TransparencyCharts.tsx (Vault)
**Issue:** Missing fee split charts (SRS FR-VA-3)  
**Impact:** **HIGH** - Key transparency feature missing  
**Files:** `apps/web/src/app/[locale]/vault/components/TransparencyCharts.tsx`

**Steps:**
1. Bundle ECharts locally (no CDN):
   ```bash
   pnpm add echarts
   ```
2. Create TransparencyCharts component with:
   - Pie chart: Sovereign fee split (5.5/1.5/1.5/1.5)
   - Line chart: Historical returns
   - Bar chart: Risk metrics
3. Self-hosted (no external CDN)

**Estimated:** 2 days

---

#### 7. Create WeChat OAuth Callback Handler
**Issue:** No /auth/callback/wechat page  
**Impact:** **HIGH** - WeChat login broken  
**Files:** `apps/web/src/app/[locale]/auth/callback/wechat/page.tsx`

**Steps:**
1. Create callback page:
   - Parse query params (code, state)
   - Exchange code for access token (API call)
   - Get user info from WeChat
   - Create/login user in BandaChao
   - Redirect to dashboard
2. Handle errors (invalid code, WeChat API down)

**Estimated:** 1 day

---

#### 8. Create Missing Legal/Utility Pages (P2)
**Issue:** Missing: /legal/about, /profile/[id], /partner-center  
**Impact:** **MEDIUM** - Nice to have  
**Files:** 3 pages to create

**Steps:**
1. Create /legal/about/page.tsx (About BandaChao page)
2. Create /profile/[id]/page.tsx (Public user profile)
3. Create /partner-center/page.tsx (Service provider onboarding)

**Estimated:** 2 days (all 3 pages)

---

### Sprint 4 Summary
- **Total Issues:** 8  
- **Total Estimated Days:** 12 days (2.4 weeks, tight fit)  
- **Acceptance:** All key feature components implemented

---

## Sprint 5: P2-P3 Polish & Nice-to-Haves — LOW-MEDIUM

**Sprint Goal:** Polish UI, add missing utility components

**Duration:** 2 weeks  
**Team:** 2 developers  
**Priority:** 🟡 **P2** + 🟢 **P3**

### Issues to Fix (12 items - pick 8-10)

#### P2 (High Value Polish)
1. **Create Breadcrumbs.tsx** (1 day) - Navigation UX
2. **Create Toast.tsx** (1 day) - User feedback (notifications, errors)
3. **Create Tooltip.tsx** (0.5 day) - Info tooltips
4. **Create Modal.tsx** (1 day) - Programmatic modals (not just Dialog)
5. **Audit & Fix VaultShell** (0.5 day) - Verify content
6. **Remove Duplicate VaultShell** (0.5 day) - Delete old location
7. **Verify & Remove Orphaned Components** (0.5 day) - Header, Footer, Sidebar, Topbar
8. **Create Remaining 4 AI Triggers** (2 days) - dispute.ts, first-login.ts, style-rec.ts, support.ts

#### P3 (Nice to Have)
9. **Create Form Components** (2 days) - Checkbox, Radio, Select, Switch
10. **Create Avatar.tsx** (0.5 day) - User avatars
11. **Create Spinner.tsx** (0.5 day) - Loading spinners
12. **Create Dropdown.tsx** (1 day) - Menus, selects

**Estimated:** 11 days total (pick 8-10 for 2-week sprint)

---

## Summary: All Priorities

| **Priority** | **Issues** | **Sprints** | **Weeks** | **Description** |
|---|---|---|---|---|
| 🚨 **P0** | 4 | Sprint 1 | 2 | Compliance & Auth (BLOCKING) |
| 🔴 **P1** | 18 | Sprints 2-4 | 6 | AI, Design System, Feature Components |
| 🟡 **P2** | 12 | Sprint 5 | 2 | Polish, Utility Components |
| 🟢 **P3** | 6 | Future | - | Nice to Have (backlog) |

**Total:** 40 issues, 10 weeks (2.5 months)

---

## Risk Mitigation

### Risk 1: Lottie Assets Delay
**Mitigation:** Use placeholder SVGs in Sprint 2, upgrade to lottie later

### Risk 2: API Not Ready
**Mitigation:** Use mock data, swap with real API calls in parallel

### Risk 3: Scope Creep
**Mitigation:** Lock scope per sprint, defer P3 items to future

### Risk 4: Team Availability
**Mitigation:** Document tasks clearly, allow async work

---

## Acceptance Criteria (Project-Wide)

Frontend is considered ✅ **LAUNCH-READY** if:
1. **P0 Issues:** All 4 resolved (compliance + auth working)
2. **P1 Issues:** At least 15/18 resolved (AI + design system + key features)
3. **P2 Issues:** At least 6/12 resolved (polish)
4. **Build:** No TypeScript errors, passes compliance check
5. **Manual Testing:** All pillars navigable, key flows work
6. **Performance:** TTFB <500ms, Lighthouse score >80

---

**End of Report**
