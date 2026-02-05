# UI Quality Upgrade Plan
**Date:** 2026-02-02  
**Goal:** Raise all pages to `/en` (landing page) quality standard  
**Benchmark:** Motion, polish, life — not scaffolding

---

## Current State Assessment

### Quality Tiers (Based on Existing Audit)

| Tier | Score | Pages | Status |
|------|-------|-------|--------|
| **👑 Elite** | 10/10 | `/en` (landing) | Perfect motion, glassmorphism, composition |
| **✅ Good** | 8-9/10 | `/products`, `/cockpit`, `/vault`, `/square` | Proper shells, some motion, good density |
| **⚠️ Passable** | 6-7/10 | `/throne`, `/wallet`, `/orders` | Functional but basic, minimal motion |
| **❌ Stub** | 3-5/10 | Most Cockpit/Vault/Throne subpages | Placeholder text, no interactions |

---

## Problems to Fix

### 1. Inconsistent Motion
**Before:**
- Landing page: Smooth stagger animations
- Other pages: Instant render, jarring

**Problem:**
- No shared motion system
- Each page implements animations differently (or not at all)

**Impact:**
- Product feels "half-baked"
- No consistent brand feel

---

### 2. Missing States
**Before:**
- Blank screens during data load
- Empty lists show nothing
- Errors crash to white screen

**Problem:**
- No loading skeletons
- No empty states with CTAs
- No error boundaries

**Impact:**
- Poor UX, looks unfinished
- User doesn't know what's happening

---

### 3. Shells Not Fully Utilized
**Before:**
- Marketplace Shell: Exists but minimal (no footer, no search)
- Dashboard Shells: Sidebar lacks active state highlighting

**Problem:**
- Navigation not obvious
- No persistent elements (footer)

**Impact:**
- Feels like disconnected pages, not an app

---

### 4. Stub Pages Look Abandoned
**Before:**
- Pages say "This is a placeholder"
- Empty `<div>` with text only

**Problem:**
- No visual structure
- No mock UI to show intent

**Impact:**
- Demo/stakeholder presentations fail
- Looks like a side project

---

### 5. No Interaction Feedback
**Before:**
- Buttons don't respond to hover/click
- Cards are static
- Forms submit with no feedback

**Problem:**
- No hover states
- No loading spinners on submit
- No success toasts

**Impact:**
- Feels unresponsive, low quality

---

## Solution Components

### A) Design Tokens (Centralized)
**File:** `apps/web/src/styles/tokens.css` (already exists, enhance)

**Add:**
```css
/* Motion */
--motion-duration-fast: 150ms;
--motion-duration-normal: 300ms;
--motion-duration-slow: 500ms;
--motion-ease: cubic-bezier(0.4, 0, 0.2, 1);

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

/* Spacing (8px baseline) */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */
--space-6: 1.5rem;  /* 24px */
--space-8: 2rem;    /* 32px */

/* Zone Accents */
--accent-buyer: #3B82F6;    /* blue */
--accent-maker: #10B981;    /* emerald */
--accent-investor: #F59E0B; /* amber */
--accent-admin: #A855F7;    /* purple */
--accent-social: #EC4899;   /* pink */
```

**Usage:**
- Apply in all components via CSS variables
- No hardcoded colors/spacing

---

### B) Motion Config (Framer Motion Presets)
**File:** `apps/web/src/lib/motion-config.ts` (NEW)

**Content:**
```typescript
import { Variants } from 'framer-motion';

export const pageTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1]
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.15 }
};

export const tapScale = {
  scale: 0.98
};
```

**Usage:**
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion-config';

<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

### C) Component Library Enhancements
**Files to Edit:**

#### 1. `components/ui/skeleton.tsx`
**Add:**
- Pulse animation
- Variants: text, card, circle, button

**Example:**
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
</div>
```

#### 2. `components/ui/button.tsx`
**Add:**
- Motion variants (hover, tap)
- Loading spinner state
- Icon support

**Example:**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  disabled={loading}
>
  {loading && <Spinner />}
  {children}
</motion.button>
```

#### 3. `components/ui/card.tsx`
**Add:**
- Motion variants (hover)
- Shadow levels
- Accent border option

**Example:**
```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: 'var(--shadow-xl)' }}
  className="bg-white rounded-lg border border-slate-200 p-6"
>
  {children}
</motion.div>
```

#### 4. NEW: `components/ui/empty-state.tsx`
**Create:**
```tsx
export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="mb-4 text-slate-400">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
```

#### 5. NEW: `components/ui/toast.tsx`
**Create:**
- Success, error, info variants
- Auto-dismiss (5s)
- Stack multiple toasts

**Example:**
```tsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showToast(message: string, type: 'success' | 'error' | 'info') {
  toast[type](message, {
    position: 'bottom-right',
    autoClose: 5000
  });
}
```

---

### D) Page Template (Standard Structure)
**Every page should follow this pattern:**

```tsx
'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion-config';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useData } from '@/hooks/useData';

export default function PageName() {
  const { data, loading, error } = useData();

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<IconName size={48} />}
        title="No items yet"
        description="Get started by creating your first item."
        action={<Button>Create Item</Button>}
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="container mx-auto p-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold">Page Title</h1>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4 mt-6">
        {data.map(item => (
          <Card key={item.id}>{item.content}</Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
```

---

## Upgrade Checklist (Per Page)

### ✅ Motion
- [ ] Wrap page in `<motion.div variants={staggerContainer}>`
- [ ] Add `variants={fadeInUp}` to main sections
- [ ] Add hover states to interactive cards
- [ ] Add loading transitions (skeleton → content)

### ✅ States
- [ ] Add loading skeleton
- [ ] Add empty state with CTA
- [ ] Add error boundary
- [ ] Add success/error toasts for actions

### ✅ Structure
- [ ] Use consistent spacing (--space-* tokens)
- [ ] Use semantic HTML (header, main, section, article)
- [ ] Add proper heading hierarchy (h1 > h2 > h3)
- [ ] Use grid/flex for layouts (no absolute positioning)

### ✅ Interactions
- [ ] All buttons have hover/tap states
- [ ] Forms show validation errors inline
- [ ] Submit buttons show loading spinner
- [ ] Actions trigger success toasts

### ✅ Accessibility
- [ ] All images have alt text
- [ ] All buttons have aria-label (if icon-only)
- [ ] Focus states visible
- [ ] Keyboard navigation works

---

## Priority Upgrade Order

### Tier 1: High Traffic (Week 1)
1. ✅ `/en` (landing) — Already elite
2. 🔧 `/products` — Add filters, sorting, pagination
3. 🔧 `/products/[id]` — Add image gallery, reviews section
4. 🔧 `/cart` — Add quantity controls, remove button
5. 🔧 `/checkout` — Add multi-step form, validation

### Tier 2: Core Zones (Week 2)
6. 🔧 `/cockpit` — Upgrade to show real activity
7. 🔧 `/cockpit/inventory` — Add product table, filters
8. 🔧 `/cockpit/rfq` — Add RFQ list, create form
9. 🔧 `/vault` — Add portfolio chart
10. 🔧 `/vault/opportunities` — Add investment cards

### Tier 3: Admin (Week 3)
11. 🔧 `/throne` — Add metrics dashboard
12. 🔧 `/throne/finance` — Add sovereign funds chart
13. 🔧 `/throne/disputes` — Add dispute queue
14. 🔧 `/throne/verification` — Add KYC review UI

### Tier 4: Supporting (Week 4)
15. 🔧 `/wallet` — Add balance chart, transaction filters
16. 🔧 `/orders` — Add order history table
17. 🔧 `/orders/[id]` — Add timeline, tracking
18. 🔧 `/profile` — Add edit form

---

## Example: Before & After

### Before: `/cockpit/inventory` (Stub)
```tsx
export default function InventoryPage() {
  return (
    <div>
      <h1>Inventory</h1>
      <p>This is a placeholder.</p>
    </div>
  );
}
```

**Problems:**
- No motion
- No structure
- No content
- No states

---

### After: `/cockpit/inventory` (Upgraded)
```tsx
'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion-config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Package, Plus, Search } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

export default function InventoryPage() {
  const { products, loading, error } = useInventory();

  if (loading) {
    return <InventorySkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package size={48} />}
        title="No products yet"
        description="Start by adding your first product to inventory."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="container mx-auto p-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-slate-500">Manage your product catalog</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {products.map(product => (
          <motion.div key={product.id} variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-slate-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Stock: {product.stock}</span>
                  <span className="font-bold">¥{product.price}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function InventorySkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Improvements:**
- ✅ Motion: Stagger animations, hover states
- ✅ States: Loading skeleton, empty state
- ✅ Structure: Header, filters, grid
- ✅ Interactions: Search, filter, add product
- ✅ Polish: Shadows, spacing, typography

---

## Implementation Files

### Create New:
1. ✅ `apps/web/src/lib/motion-config.ts`
2. ✅ `apps/web/src/components/ui/empty-state.tsx`
3. ✅ `apps/web/src/components/ui/toast.tsx`
4. ✅ `apps/web/src/components/ui/error-boundary.tsx`

### Edit Existing:
5. ✅ `apps/web/src/styles/tokens.css` (add motion/shadow tokens)
6. ✅ `apps/web/src/components/ui/button.tsx` (add motion)
7. ✅ `apps/web/src/components/ui/card.tsx` (add motion)
8. ✅ `apps/web/src/components/ui/skeleton.tsx` (enhance variants)
9. ✅ ALL `page.tsx` files (apply template)

---

## Success Metrics

### Before Upgrade:
- Pages without motion: ~90%
- Pages with loading states: ~10%
- Pages with empty states: ~5%
- Hover interactions: ~30%

### After Upgrade:
- Pages with motion: 100% ✅
- Pages with loading states: 100% ✅
- Pages with empty states: 100% ✅
- Hover interactions: 100% ✅

### Subjective Quality:
- "Feels like a real product": ✅
- "Would show to investors": ✅
- "Looks better than competitors": ✅

---

## Verification Checklist

### Per Page:
1. ✅ Visit page in browser
2. ✅ Refresh → See smooth entrance animation
3. ✅ Hover over cards → See lift effect
4. ✅ Click button → See tap animation
5. ✅ Wait for load → See skeleton, not blank
6. ✅ Empty state → See helpful message + CTA
7. ✅ Trigger error → See error boundary, not crash
8. ✅ Submit form → See loading spinner + success toast

### Global:
9. ✅ Check all 3 locales (ar/en/zh)
10. ✅ Check mobile responsive
11. ✅ Check keyboard navigation
12. ✅ Run Lighthouse (aim for 90+ performance)

---

## Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| **1** | Setup + High Traffic | Motion system + products pages |
| **2** | Core Zones | Cockpit + Vault upgraded |
| **3** | Admin | Throne pages upgraded |
| **4** | Polish | Supporting pages + mobile |

**Total Time:** 4 weeks (1 developer, full-time)  
**Result:** All 49 pages at 8/10+ quality ✅

---

## Next Action

**Start with:** Motion Config + Button/Card Components

**Files:**
1. Create `apps/web/src/lib/motion-config.ts`
2. Edit `apps/web/src/components/ui/button.tsx`
3. Edit `apps/web/src/components/ui/card.tsx`
4. Edit `apps/web/src/styles/tokens.css`

**Test on:** `/products` page

**Estimated time:** 2-3 hours  
**Verification:** See smooth animations, hover states work
