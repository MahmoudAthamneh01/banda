# Navigation Map (Gate B)

**Date:** 2026-02-02
**Verification Method:** Manual Code Inspection & Update

## Central Hub: Landing Page (`/`)
The Home Page acts as the central router, providing direct access to all 5 application pillars via the Hero Grid.

## 1. Marketplace (Buyer Flow)
*   **Entry:** Home -> Click "Marketplace" -> `/products`
*   **Drill Down:** `/products` -> Click Product -> `/products/[id]`
*   **Action:** Click "Add to Cart" -> `<DealCat>` Trigger
*   **Cart:** Top Right Icon / Popover -> `/cart` -> Click "Checkout" -> `/checkout`
*   **Post-Purchase:** Checkout Success -> "View Order" -> `/orders/[id]`

## 2. The Cockpit (Maker Flow)
*   **Entry:** Home -> Click "The Cockpit" -> `/cockpit`
*   **Navigation:** Internal Dashboard Cards / Buttons
    *   "Manage Inventory" -> `/cockpit/inventory`
    *   "Sourcing Requests" -> `/cockpit/rfq`
    *   "Active Batches" -> `/cockpit/orders`

## 3. The Vault (Investor Flow)
*   **Entry:** Home -> Click "The Vault" -> `/vault`
*   **Navigation:** Internal Dashboard Stats
    *   "Yield Opportunities" -> `/vault/opportunities`
    *   "Portfolio Performance" -> `/vault/portfolio`

## 4. The Throne (Admin Flow)
*   **Entry:** Home -> Click "The Throne" -> `/throne`
*   **Navigation:** Internal Dashboard
    *   "Financial Oversight" -> `/throne/finance`
    *   "User Management" -> `/throne/users`
    *   "Fraud Detection" -> `/throne/fraud`

## 5. Social Layer
*   **Entry:** Home -> Click "Social Feed" -> `/feed`
*   **Navigation:** 
    *   Feed Items -> Click Avatar -> `/profile`
    *   Profile -> "Edit Profile" -> `/settings` (Mock)

**Verdict:** All major routes are 1-2 clicks away from the Landing Page.
