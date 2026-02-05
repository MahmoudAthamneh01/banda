# Frontend Spec — Banda Chao (Next.js 15)
Version: 1.0

## 1) Goals
- Implement 5 pillars UI with strict China compliance
- Event-driven AI agents as UI components
- 3 languages: ar/en/zh with correct dir handling
- Zero external assets, strict CSP

## 2) Routing Map (App Router)
- `/[locale]/square` (home)
- `/[locale]/playground` (buyer browse)
- `/[locale]/cockpit` (maker/service provider)
- `/[locale]/vault` (investor)
- `/[locale]/throne` (owner/admin)

Plus:
- `/[locale]/auth/login`, `/[locale]/auth/register`
- `/[locale]/products/[id]`, `/[locale]/orders/[id]/track`
- `/[locale]/legal/privacy`, `/[locale]/legal/terms`, `/[locale]/legal/returns`

## 3) Layout & Design System
- Colors:
  - Primary: #FF9900
  - Background: #F5F7FA
  - Text: #1A1A1A
- Typography (self-hosted):
  - zh: Noto Sans SC or PingFang SC
  - ar: Cairo or Tajawal
  - en: Roboto
- Components:
  - Buttons, Cards, Badges, Tabs, Modals, Toasts
- Charts:
  - Use self-hosted library bundle (no CDN)

## 4) i18n Strategy
- Use i18next with namespaces
- Language detection priority:
  1) URL prefix (/ar, /zh, /en)
  2) Accept-Language header
  3) default: zh
- Set `<html dir="rtl|ltr">` dynamically based on locale

## 5) AI Agents UI (Event-Driven)
- Unified registry: agent id, role, local asset path
- Trigger system:
  - exit intent -> Deal Cat
  - low stock -> Cyber Wukong
  - dispute -> Magistrate Mandrill
  - first login -> Host Panda onboarding
- Assets:
  - all lottie/json/png hosted in `/public/assets/agents/*` or OSS

## 6) China Mode vs Global Mode
- Login buttons and providers are rendered based on region
- CHINA_MODE shows: Phone/SMS, WeChat, Alipay, Apple
- GLOBAL_MODE may show: Google/Facebook/etc (if enabled later)
- Maps: AMap only in both modes

## 7) Frontend Security Rules
- CSP headers enforced from Next config (no external script)
- No remote fonts
- No untrusted HTML injection
- All API calls use `NEXT_PUBLIC_API_URL`

## 8) Pages Minimum Content (Per Pillar)
- Square: Top10 widget, liquidation boxes, live ticker
- Playground: visual grid, product detail, cart/checkout, gamification widgets
- Cockpit: import tool, RFQ board, bids, wallet summary, VIP AI panel
- Vault: cycles list, invest flow, transparency charts
- Throne: money pulse, payouts, compliance dashboard, disputes admin panel
