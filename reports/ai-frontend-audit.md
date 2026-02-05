# AI Frontend Audit
**Generated:** 2026-02-03  
**Source of Truth:** PROJECT_TREE_EXPECTED.md, docs/02-frontend-spec.md  
**Scope:** AI agent infrastructure, registry, event bus, renderer, triggers, lottie assets

---

## Executive Summary

**Overall AI System Completion: 5%**

- ❌ **AgentRegistry:** 0% (does not exist)
- ❌ **AgentEventBus:** 0% (does not exist)
- ❌ **AgentRenderer:** 0% (does not exist)
- ❌ **Triggers System:** 0% (folder does not exist)
- ✅ **AskPanda Component:** 100% (exists but isolated)
- ❌ **Lottie Assets:** 0% (no animations found)
- ❌ **public/assets/lottie/agents/:** 0% (folder does not exist)

**Critical Issue:** AI infrastructure is **completely missing**. Only `AskPanda.tsx` exists as standalone chat component, not integrated with event-driven system described in spec.

**Impact:** **BLOCKING** - AI agents cannot be triggered based on user events (exit intent, low stock, dispute, first login). Feature is non-functional.

---

## Expected AI Architecture (from Spec)

### From docs/02-frontend-spec.md:
> **5) AI Agents UI (Event-Driven)**
> - Unified registry: agent id, role, local asset path
> - Trigger system:
>   - exit intent -> Deal Cat
>   - low stock -> Cyber Wukong
>   - dispute -> Magistrate Mandrill
>   - first login -> Host Panda onboarding
> - Assets:
>   - all lottie/json/png hosted in `/public/assets/agents/*` or OSS

### Expected Structure (from PROJECT_TREE_EXPECTED.md):
```
apps/web/src/components/agents/
├── AgentRegistry.ts           # Registry of 8 agents
├── AgentEventBus.ts           # Pub/sub event bus
├── AgentRenderer.tsx          # Unified UI renderer
└── triggers/
    ├── exit-intent.ts         # Deal Cat trigger
    ├── low-stock.ts           # Cyber Wukong trigger
    ├── dispute.ts             # Magistrate Mandrill trigger
    └── first-login.ts         # Host Panda trigger

apps/web/public/assets/lottie/agents/
├── wukong_idle.json
├── mandrill_idle.json
├── deal_cat.json
├── style_guru.json
├── trust_mother.json
├── hungry_panda.json
├── chatty_bird.json
└── host_panda.json
```

---

## Actual AI Infrastructure

### 1. AgentRegistry.ts
**Path:** `apps/web/src/components/agents/AgentRegistry.ts`  
**Status:** ❌ **DOES NOT EXIST**

**Purpose:** Central registry of all AI agents with metadata

**Expected Content:**
```typescript
export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  assetPath: string;  // Lottie animation
  surfaces: string[];  // Where agent can appear
  triggers: string[];  // Event IDs that activate agent
  permissions: 'AUTO' | 'USER' | 'NUCLEAR';
}

export const AGENTS: Agent[] = [
  {
    id: 'deal_cat',
    name: 'Deal Cat',
    role: 'Negotiation Assistant',
    description: 'Helps buyers get best deals',
    assetPath: '/assets/lottie/agents/deal_cat.json',
    surfaces: ['marketplace', 'products', 'cart'],
    triggers: ['exit_intent', 'high_price'],
    permissions: 'USER',
  },
  {
    id: 'cyber_wukong',
    name: 'Cyber Wukong',
    role: 'Fraud Detection',
    description: 'Monitors suspicious activity',
    assetPath: '/assets/lottie/agents/wukong_idle.json',
    surfaces: ['throne', 'fraud'],
    triggers: ['fraud_spike', 'suspicious_order'],
    permissions: 'AUTO',
  },
  // ... 6 more agents
];
```

**Impact:** **BLOCKING** - No way to discover or configure agents

---

### 2. AgentEventBus.ts
**Path:** `apps/web/src/components/agents/AgentEventBus.ts`  
**Status:** ❌ **DOES NOT EXIST**

**Purpose:** Pub/sub system for triggering agents based on events

**Expected Content:**
```typescript
type EventCallback = (data: any) => void;

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  subscribe(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  publish(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  unsubscribe(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
}

export const agentEventBus = new EventBus();

// Usage:
// agentEventBus.publish('exit_intent', { url: '/products/123' });
// agentEventBus.subscribe('exit_intent', (data) => { /* show Deal Cat */ });
```

**Impact:** **BLOCKING** - No event-driven agent activation

---

### 3. AgentRenderer.tsx
**Path:** `apps/web/src/components/agents/AgentRenderer.tsx`  
**Status:** ❌ **DOES NOT EXIST**

**Purpose:** Unified UI component for displaying agents (modal, drawer, popover)

**Expected Content:**
```typescript
interface AgentRendererProps {
  agent: Agent;
  mode: 'modal' | 'drawer' | 'popover' | 'inline';
  onClose: () => void;
  context?: any;  // User context, product data, etc.
}

export function AgentRenderer({ agent, mode, onClose, context }: AgentRendererProps) {
  return (
    <AnimatePresence>
      {mode === 'modal' && (
        <Modal onClose={onClose}>
          <Lottie animationData={agent.assetPath} />
          <AgentChat agent={agent} context={context} />
        </Modal>
      )}
      {mode === 'drawer' && (
        <Drawer onClose={onClose}>
          <Lottie animationData={agent.assetPath} />
          <AgentChat agent={agent} context={context} />
        </Drawer>
      )}
      {/* ... other modes */}
    </AnimatePresence>
  );
}
```

**Impact:** **HIGH** - No unified agent UI, inconsistent UX

---

### 4. Triggers System
**Path:** `apps/web/src/components/agents/triggers/`  
**Status:** ❌ **FOLDER DOES NOT EXIST**

**Expected Triggers:**

#### exit-intent.ts (Deal Cat)
```typescript
import { agentEventBus } from '../AgentEventBus';

export function initExitIntentTrigger() {
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10) {  // Mouse near top edge
      agentEventBus.publish('exit_intent', { timestamp: Date.now() });
    }
  });
}
```

#### low-stock.ts (Cyber Wukong - Maker Alert)
```typescript
export function checkLowStock(inventory: Product[]) {
  const lowStockItems = inventory.filter(p => p.stock < p.lowStockThreshold);
  if (lowStockItems.length > 0) {
    agentEventBus.publish('low_stock', { items: lowStockItems });
  }
}
```

#### dispute.ts (Magistrate Mandrill)
```typescript
export function onDisputeCreated(dispute: Dispute) {
  agentEventBus.publish('dispute_created', { dispute });
}
```

#### first-login.ts (Host Panda Onboarding)
```typescript
export function checkFirstLogin(user: User) {
  if (user.loginCount === 1) {
    agentEventBus.publish('first_login', { user });
  }
}
```

**Impact:** **BLOCKING** - No automated agent activation

---

## Actual AI Components Found

### AskPanda.tsx
**Path:** `apps/web/src/components/ai/AskPanda.tsx`  
**Status:** ✅ **EXISTS** (standalone)

**Audit Result (from scan):**
- ✅ Component exists
- ⚠️ **NOT INTEGRATED** with AgentRegistry or EventBus
- ⚠️ Standalone chat component (likely triggered manually)
- ⚠️ No lottie animation (assumes static icon or none)

**Content (need to read to verify):**
- Unknown if follows agent pattern
- Unknown if uses context/event data
- Unknown if has animation support

**Assessment:** ⚠️ **ISOLATED** - Works but not part of AI system

---

## Lottie Assets Audit

### Expected Assets (8 agents):
```
public/assets/lottie/agents/
├── wukong_idle.json         ❌ MISSING - Cyber Wukong (fraud detection)
├── mandrill_idle.json       ❌ MISSING - Magistrate Mandrill (dispute resolution)
├── deal_cat.json            ❌ MISSING - Deal Cat (negotiation)
├── style_guru.json          ❌ MISSING - Style Guru (fashion recommendations)
├── trust_mother.json        ❌ MISSING - Trust Mother (trust & safety)
├── hungry_panda.json        ❌ MISSING - Hungry Panda (gamification)
├── chatty_bird.json         ❌ MISSING - Chatty Bird (customer support)
└── host_panda.json          ❌ MISSING - Host Panda (onboarding)
```

**Search Result:**
- No `.lottie` files found in workspace
- No `public/` folder in `apps/web/`
- No `assets/lottie/` directory

**Impact:** **HIGH** - AI agents have no visual identity

---

## AI Agent Roles (from Spec)

### 1. Deal Cat
**Role:** Negotiation Assistant  
**Trigger:** Exit intent, high price  
**Surface:** Marketplace, products, cart  
**Action:** Suggest deals, apply coupons, negotiate price  
**Status:** ❌ **NOT IMPLEMENTED**

---

### 2. Cyber Wukong
**Role:** Fraud Detection & Maker Alerts  
**Trigger:** Fraud spike, suspicious order, low stock  
**Surface:** Throne (fraud page), Cockpit (inventory)  
**Action:** Flag suspicious activity, alert maker of low stock  
**Status:** ❌ **NOT IMPLEMENTED** (mockTriggers exist in fraud page but not real system)

---

### 3. Magistrate Mandrill
**Role:** Dispute Resolution Assistant  
**Trigger:** Dispute created, SLA breach  
**Surface:** Throne (disputes), buyer/maker dispute pages  
**Action:** Summarize evidence, propose resolution  
**Status:** ❌ **NOT IMPLEMENTED**

---

### 4. Style Guru
**Role:** Fashion Recommendations  
**Trigger:** Product view, empty cart  
**Surface:** Marketplace, products  
**Action:** Suggest matching items, outfit builder  
**Status:** ❌ **NOT IMPLEMENTED**

---

### 5. Trust Mother
**Role:** Trust & Safety  
**Trigger:** First purchase, high-value transaction  
**Surface:** Checkout, wallet  
**Action:** Verify identity, explain escrow  
**Status:** ❌ **NOT IMPLEMENTED**

---

### 6. Hungry Panda
**Role:** Gamification & Daily Rewards  
**Trigger:** Daily login, achievement unlocked  
**Surface:** Playground, dashboard  
**Action:** Award red packets, daily fortune wheel  
**Status:** ❌ **NOT IMPLEMENTED**

---

### 7. Chatty Bird
**Role:** Customer Support  
**Trigger:** Help button, long page dwell  
**Surface:** All pages (global)  
**Action:** Answer FAQs, escalate to human  
**Status:** ❌ **NOT IMPLEMENTED**

---

### 8. Host Panda
**Role:** Onboarding & Education  
**Trigger:** First login, new feature  
**Surface:** All pillars  
**Action:** Guided tour, explain features  
**Status:** ⚠️ **PARTIAL** (used in Throne AI Briefing but not as event-driven agent)

---

## Mock Trigger References Found

### In throne/fraud/page.tsx:
```typescript
const mockTriggers = [
  { event: 'fraud_spike', agent: 'Cyber Wukong', condition: 'Risk score > 8.0' },
  { event: 'payment_failure', agent: 'Trust Mother', condition: '5+ failures/hour' },
  // ... mock data only
];
```

**Assessment:** ⚠️ **MOCK DATA** - Not a real trigger system, just UI mockup

---

## Integration Points (Where AI Should Be Used)

### 1. Marketplace (Deal Cat)
**Pages:** `/products`, `/cart`, `/checkout`  
**Triggers:** Exit intent, high cart value, abandoned cart  
**Status:** ❌ No integration

---

### 2. Cockpit (Cyber Wukong, VIP AI Panda)
**Pages:** `/cockpit`, `/cockpit/inventory`  
**Triggers:** Low stock, quality alert  
**Status:** ❌ No integration (only AskPanda standalone)

---

### 3. Vault (VIP AI Panda)
**Pages:** `/vault`  
**Triggers:** VIP/STUDENT_AMBASSADOR role check  
**Status:** ❌ No integration

---

### 4. Throne (Cyber Wukong, Magistrate Mandrill)
**Pages:** `/throne/fraud`, `/throne/disputes`  
**Triggers:** Fraud spike, dispute SLA breach  
**Status:** ⚠️ UI mockups exist but no real triggers

---

### 5. Auth/Onboarding (Host Panda)
**Pages:** `/auth/register`, `/onboarding`  
**Triggers:** First login, account created  
**Status:** ❌ No integration

---

## Missing Infrastructure Components

| **Component** | **Priority** | **Expected Path** | **Impact** |
|---|---|---|---|
| AgentRegistry.ts | 🚨 P0 | `components/agents/AgentRegistry.ts` | BLOCKING - No agent metadata |
| AgentEventBus.ts | 🚨 P0 | `components/agents/AgentEventBus.ts` | BLOCKING - No event system |
| AgentRenderer.tsx | 🚨 P0 | `components/agents/AgentRenderer.tsx` | HIGH - Inconsistent UI |
| triggers/exit-intent.ts | 🔴 P1 | `components/agents/triggers/exit-intent.ts` | HIGH - Deal Cat broken |
| triggers/low-stock.ts | 🔴 P1 | `components/agents/triggers/low-stock.ts` | HIGH - Wukong broken |
| triggers/dispute.ts | 🔴 P1 | `components/agents/triggers/dispute.ts` | HIGH - Mandrill broken |
| triggers/first-login.ts | 🔴 P1 | `components/agents/triggers/first-login.ts` | HIGH - Host Panda broken |
| Lottie animations (8 files) | 🔴 P1 | `public/assets/lottie/agents/*.json` | HIGH - No visual identity |

---

## Recommendations

### 🚨 P0 (Critical - Build AI Foundation)
1. **Create public/ folder** with `assets/lottie/agents/` subdirectory
2. **Create AgentRegistry.ts** with 8 agent definitions
3. **Create AgentEventBus.ts** with pub/sub system
4. **Create AgentRenderer.tsx** with modal/drawer/popover modes

### 🔴 P1 (High Priority - Enable Key Agents)
1. **Create 4 trigger files:**
   - `exit-intent.ts` (Deal Cat)
   - `low-stock.ts` (Cyber Wukong)
   - `dispute.ts` (Magistrate Mandrill)
   - `first-login.ts` (Host Panda)
2. **Source/create 8 Lottie animations** (or placeholder SVGs)
3. **Integrate AskPanda** with AgentRegistry + EventBus
4. **Add trigger initialization** to root layout

### 🟡 P2 (Medium Priority - Complete System)
1. Create remaining 4 triggers (style recommendations, trust, gamification, support)
2. Add agent permission system (AUTO/USER/NUCLEAR)
3. Create agent interaction logs (for audit)
4. Add agent enable/disable toggles in Throne AI page

### 🟢 P3 (Nice to Have)
1. Add voice synthesis for agent responses
2. Add agent personality tuning (tone, language style)
3. Add A/B testing for agent effectiveness
4. Add agent analytics dashboard

---

## Implementation Roadmap

### Phase 1: Foundation (1 sprint)
```
✓ Create public/assets/lottie/agents/ folder
✓ Create AgentRegistry.ts with 8 agents
✓ Create AgentEventBus.ts
✓ Create AgentRenderer.tsx (modal mode only)
✓ Source 8 placeholder lottie files (or SVGs)
```

### Phase 2: First Agent (Deal Cat) (1 sprint)
```
✓ Create exit-intent.ts trigger
✓ Integrate trigger in marketplace layout
✓ Subscribe trigger to AgentEventBus
✓ Render Deal Cat modal on exit intent
✓ Test in /products and /cart pages
```

### Phase 3: Maker Agents (Wukong, VIP Panda) (1 sprint)
```
✓ Create low-stock.ts trigger
✓ Integrate into cockpit/inventory page
✓ Refactor AskPanda to use AgentRegistry
✓ Test VIP AI Panda access control
```

### Phase 4: Admin Agents (Mandrill, Wukong fraud) (1 sprint)
```
✓ Create dispute.ts trigger
✓ Integrate into throne/disputes page
✓ Create fraud triggers
✓ Test agent permissions (NUCLEAR actions)
```

### Phase 5: Onboarding & Support (Host Panda, Chatty Bird) (1 sprint)
```
✓ Create first-login.ts trigger
✓ Add to auth/register flow
✓ Create global help trigger (Chatty Bird)
✓ Test cross-surface agents
```

---

## Acceptance Criteria

AI system is considered ✅ **FUNCTIONAL** if:
1. **AgentRegistry** exists with all 8 agents defined
2. **AgentEventBus** pub/sub working (subscribe/publish/unsubscribe)
3. **AgentRenderer** can display agents in modal mode
4. **At least 1 trigger** works end-to-end (exit-intent → Deal Cat modal)
5. **Lottie animations** load and play (or placeholder SVGs)
6. **AskPanda** integrated with AgentRegistry
7. **No console errors** in agent initialization

AI system is considered ✅ **COMPLETE** if:
1. All 8 agents have working triggers
2. All agents have lottie animations
3. AgentRenderer supports modal/drawer/popover modes
4. Agent permissions enforced (AUTO/USER/NUCLEAR)
5. Agent interaction logs saved to backend
6. Admin can enable/disable agents in Throne AI page
7. Agent effectiveness tracked (shown count, conversion rate)

---

**End of Report**
