# Layout Architecture Audit

**Date:** 2026-02-02
**Status:** ❌ **FAIL** (Missing Persistent Shells)

## 1. Requirement Checklist
| Layout Shell | Requirement | Status | Gap |
| :--- | :--- | :--- | :--- |
| **Global Shell** | Header/Footer | ⚠️ **PARTIAL** | Home link works, but no persistent Footer on many pages. |
| **Buyer Shell** | Top Nav + Cart Icon | ✅ **PASS** | Present in `/products`, `/[id]`. |
| **Maker Shell** | Persistent Sidebar | ❌ **FAIL** | Uses "Hub & Spoke" (Dashboard -> Page) instead of Sidebar. |
| **Investor Shell** | Persistent Sidebar | ❌ **FAIL** | Uses "Hub & Spoke". |
| **Admin Shell** | Persistent Sidebar | ❌ **FAIL** | Uses "Hub & Spoke". |

## 2. Architectural Gap
The "Zoning Plan" requested strictly distinguished shells for Maker/Investor/Admin.
Currently, these are implemented as **Next.js Route Groups** (`layout.tsx`) that render a *Dashboard Page*, but they do **NOT** wrap children in a persistent `Sidebar` component.

**Impact:**
*   **Navigation Friction:** Users must press "Back" or "Home" to switch tools, rather than jumping from "Inventory" to "Orders" directly via a sidebar.
*   **Consistency:** Violates the "App Shell" expectation for complex tools (Cockpit/Throne).

## 3. Implementation Plan
Create `src/components/layout/Shell.tsx`:
```tsx
export function Shell({ sidebarItems, children }) {
    return (
        <div className="flex min-h-screen">
          <aside className="w-64 border-r bg-slate-900">
             {/* Nav Links */}
          </aside>
          <main className="flex-1 bg-slate-950">
             {children}
          </main>
        </div>
    )
}
```
Refactor `cockpit/layout.tsx` to use this Shell.
