# UI Rebuild Zoning Plan

**Objective:** Break the "Global Sidebar" pattern and create distinct experience zones per user role (`apps/web/src/components/layout/shells/*`).

## 1. Zoning Strategy

### Zone A: Public + Buyer (The Marketplace)
*   **Target Audience:** Guests, Shoppers.
*   **Layout Style:** Consumer E-commerce (No Sidebar).
*   **Key Components:**
    *   `MarketplaceHeader` (Logo, Search, Cart, Profile).
    *   `MarketplaceFooter` (Legal, Links).
    *   `CategoryNav` (Sticky Top Bar).
    *   `MobileBottomNav` (Home, Search, Cart, Profile).
*   **Routes:** `/`, `/products/**`, `/cart`, `/checkout`, `/orders`.

### Zone B: Maker Cockpit (The Workshop)
*   **Target Audience:** Suppliers, Manufacturers.
*   **Layout Style:** "Premium Console" (Collapsible, Minimal Sidebar).
*   **Visual Identity:** Emerald accents, "Technical/blueprint" feel.
*   **Key Components:**
    *   `CockpitSidebar` (Slim, icon-focused).
    *   `CockpitHeader` (Breadcrumbs, RFQ Quick Action).
*   **Routes:** `/cockpit/**`.

### Zone C: Investor Vault (The Terminal)
*   **Target Audience:** Capital Allocators.
*   **Layout Style:** "Portfolio/DeFi" (Top-heavy navigation, data-dense).
*   **Visual Identity:** Amber/Gold accents, "Financial" feel.
*   **Key Components:**
    *   `VaultHeader` (Portfolio Balance, Asset Ticker).
    *   `VaultNav` (Tabs: Opportunities | Portfolio | History).
*   **Routes:** `/vault/**`.

### Zone D: Admin Throne (The Control Room)
*   **Target Audience:** Platform Operators.
*   **Layout Style:** "Mission Control" (Dense Sidebar, Audit Logs).
*   **Visual Identity:** Purple accents, "System" feel.
*   **Key Components:**
    *   `ThroneSidebar` (System Status, AI, Users).
*   **Routes:** `/throne/**`.

## 2. File Restructuring Plan
1.  **Create Shell Components:**
    *   `src/components/layout/shells/MarketplaceShell.tsx`
    *   `src/components/layout/shells/CockpitShell.tsx`
    *   `src/components/layout/shells/VaultShell.tsx`
    *   `src/components/layout/shells/ThroneShell.tsx`
2.  **Update Route Groups:**
    *   `src/app/[locale]/(marketplace)/layout.tsx` -> Uses `MarketplaceShell`
    *   `src/app/[locale]/cockpit/layout.tsx` -> Uses `CockpitShell`
    *   `src/app/[locale]/vault/layout.tsx` -> Uses `VaultShell`
    *   `src/app/[locale]/throne/layout.tsx` -> Uses `ThroneShell`
