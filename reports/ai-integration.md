# AI Integration Proof (Gate C)

**Date:** 2026-02-02
**System:** Agentic Nervous System

## 1. Agent Montage (`AgentSystem.tsx`)
All active agents are mounted globally in `apps/web/src/components/ai/AgentSystem.tsx`. This component is included in the `RootLayout`, ensuring agents are available on every page.
*   **File:** `apps/web/src/components/ai/AgentSystem.tsx`
*   **Mechanism:** Listens for `EventBus` events and renders the corresponding agent UI (Toast, Overlay, Character).

## 2. Trigger Map
Agents are woken up by `ClientTrigger` components placed in strategic locations (Surfaces).

| Agent | Trigger Pattern | Location (File) | Behavior |
| :--- | :--- | :--- | :--- |
| **Chatty Bird** | On Load (Ticker) | `apps/web/src/app/[locale]/page.tsx` | Displays welcome message & social trends on Home. |
| **Deal Cat** | Dwell > 3s | `apps/web/src/app/[locale]/cart/page.tsx` | Appears to offer discount ("CAT10") if user hesitates. |
| **Hungry Hippo** | Checkout Success | `apps/web/src/app/[locale]/checkout/success/page.tsx` | Confirms order "chute" logic and prevents double-orders. |
| **Cyber Wukong** | Auto (Stock Low) | `apps/web/src/lib/ai/event-bus.ts` (Mock Event) | Warns Maker about inventory depletion. |
| **Magistrate Mandrill** | Dispute Open | `apps/web/src/app/[locale]/throne/disputes/page.tsx` | Analyzes evidence text for conflict resolution. |
| **Host Panda** | First Visit | `apps/web/src/app/[locale]/onboarding/page.tsx` | Guides user through KYC steps. |

## 3. Permissions & Safety
*   **Implementation:** `apps/api/src/modules/ai/permissions.service.ts`
*   **Model:**
    *   `NUCLEAR`: Requires explicit user confirmation (e.g. Throne Ban).
    *   `AUTO`: Can execute autonomously (e.g. Chatty Bird Ticker).
    *   `USER`: Standard request-response (e.g. Deal Cat Negotiation).

**Verdict:** AI Core is fully integrated with Frontend UI Surfaces via Event Bus.
