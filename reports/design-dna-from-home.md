# Design DNA Report: The Soul of `/en`

**Source:** `http://localhost:3000/en`
**Date:** 2026-02-02
**Status:** 🌟 **PREMIUM (Reference Standard)**

## 1. Typography System
*   **H1 (Hero)**: `96px` ExtraBold (`700`), Tracking `-4.8px`. Gradient Silver/White.
*   **H2/Cards**: `24px` Bold.
*   **Body**: `16px` Text-Slate-400.
*   **Technical**: `14px` Monospaced (`font-mono`) Text-Slate-600.

## 2. Color Palette (Dark Mode First)
*   **Canvas**: `bg-slate-950` (Deep Navy/Black > #020617).
*   **Surfaces (Cards)**: Glassmorphic Slate (`bg-slate-800/50`).
*   **Borders**: `border-slate-700` (Subtle).
*   **Accents (Pillars)**:
    *   🔵 Marketplace: Blue-500 (`#3b82f6`)
    *   🟢 Cockpit: Emerald-500 (`#10b981`)
    *   🟠 Vault: Amber-500 (`#f59e0b`)
    *   🟣 Throne: Purple-500 (`#a855f7`)
    *   💗 Social: Pink-500 (`#ec4899`)

## 3. Spacing & Rhythm
*   **Card Radius**: `rounded-xl` (12px) or `rounded-2xl` (16px).
*   **Padding**: `p-6` (24px) or `p-8` (32px).
*   **Grid Gap**: `gap-4` (16px) or `gap-6` (24px).
*   **Hero Offset**: `max-w-4xl` centered.

## 4. Micro-Interactions (The "Alive" Factor)
*   **Hover State**:
    *   Border Color Shift: Slate-700 -> Accent Color (e.g., Emerald).
    *   Icon BG: Transparent -> Semi-opaque Accent.
    *   Translation: `translate-x-1` on arrows.
*   **Entry Animation**: `Framer Motion` stagger (Hero -> Description -> Grid).

## 5. Discrepancies / Immediate Fails
*   **Chatty Bird**: The `<ClientTrigger>` code exists in `page.tsx`, but the visual "Ticker" element was **NOT DETECTED** by the crawler. The AI might be firing the event, but the *Global UI Component* receiving it (supposedly in `RootLayout` -> `AgentSystem`) isn't rendering a visible ticker bar. **Potential Gate C Fail.**

## 6. Audit Checklist for Other Routes
To pass the "Soul Score", pages must use:
- [ ] `bg-slate-950` background (not white).
- [ ] `text-slate-400` for body copy.
- [ ] `rounded-xl` cards with `bg-slate-800/50` + `border-slate-700`.
- [ ] Meaningful accent usage (Blue/Green/Amber/Purple/Pink).
- [ ] Framer Motion entry states.

**Baseline Score:** 10/10
