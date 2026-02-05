# BandaChao Design System - نظام الألوان الكامل

## الفلسفة
- **Dark-first**: روح دولة رقمية + Animations فخمة
- **Token-based**: كل شيء عبر Tokens، لا ألوان عشوائية
- **Hierarchy واضح**: تباين ممتاز بين النصوص والخلفيات
- **Glow/Depth**: واجهات حية بدون فوضى

---

## 1. Core Palette (الألوان الأساسية)

### Neutrals (أساس الواجهة)
```
Ink-950: #070A0F  خلفية عميقة جداً
Ink-900: #0B1220  خلفية رئيسية ✅ (bg الأساسي)
Ink-850: #0F1A2D  سطح عميق
Ink-800: #141F33  سطح
Ink-700: #1E2A44  حدود/فواصل

Slate-200: #E6EAF2  نص فاتح جداً ✅ (العناوين)
Slate-300: #C9D2E3  نص ثانوي ✅ (النص العادي)
Slate-400: #9AA6BE  نص خافت (فقط للثانوي)
```

### Primary (هوية أساسية)
```
Panda-500: #7C3AED  بنفسجي ملكي ✅ (CTA أساسي)
Panda-600: #6D28D9  hover
Panda-700: #5B21B6  pressed
```

### Secondary (إحساس صيني/سوق)
```
Silk-500: #F6C453  ذهبي حريري ✅ (Badges/نقاط)
Silk-600: #E9B63E  hover
```

### Tertiary / Links
```
Sky-500: #38BDF8  روابط/info ✅
```

### Semantic
```
Success-500: #22C55E  نجاح/تأكيد
Warn-500: #F59E0B     تحذير
Danger-500: #EF4444    خطر/رفض
```

### Special
```
Ruby-500: #FF3D81   Red Packet/مكافآت
Jade-500: #10B981   عروض/خصومات/Profit
```

---

## 2. Design Tokens (المهم فعلياً)

### Background & Surfaces
```css
--bg: #0B1220                              /* الخلفية الأساسية */
--bg-elev-1: #0F1A2D                       /* سطح مرتفع 1 */
--bg-elev-2: #141F33                       /* سطح مرتفع 2 */
--surface: rgba(255,255,255,0.04)          /* Glass surface */
--surface-strong: rgba(255,255,255,0.07)   /* Glass قوي */
```

**استخدام:**
```tsx
<div className="bg-ink-900">              {/* خلفية صفحة */}
<div className="bg-bg-elev-1">            {/* Card بسيط */}
<div className="glass-card">              {/* Card زجاجي */}
<div className="glass-card-strong">       {/* Card زجاجي قوي */}
```

### Borders & Dividers
```css
--border: rgba(255,255,255,0.10)          /* حدود عادية */
--border-strong: rgba(255,255,255,0.16)   /* حدود واضحة */
```

**استخدام:**
```tsx
<div className="border border-border">           {/* حد خفيف */}
<div className="border border-border-strong">    {/* حد واضح */}
```

### Text Hierarchy (قواعد ثابتة!)
```css
--text: #E6EAF2          /* Slate-200 - نص أساسي */
--text-muted: #C9D2E3    /* Slate-300 - نص ثانوي */
--text-dim: #9AA6BE      /* Slate-400 - نص خافت */
```

**قواعد:**
- ✅ العناوين: `text-slate-200` أو `text-white`
- ✅ النص العادي: `text-slate-300`
- ✅ النص الثانوي: `text-slate-400`
- ❌ **لا تستخدم** `text-slate-400` كنص أساسي أبداً

**أمثلة:**
```tsx
<h1 className="text-slate-200">عنوان رئيسي</h1>
<p className="text-slate-300">نص عادي واضح</p>
<span className="text-slate-400">معلومة ثانوية</span>
```

### Actions
```css
--primary: #7C3AED       /* Panda-500 */
--primary-hover: #6D28D9 /* Panda-600 */
--secondary: #F6C453     /* Silk-500 */
--link: #38BDF8          /* Sky-500 */
```

---

## 3. Gradients (للمشهد السينمائي)

### Primary Glow (خلف hero/highlights)
```tsx
<div className="bg-glow-primary">
  {/* Panda-700 → Panda-500 → Sky-500 */}
</div>
```

### Silk Highlight (VIP/rewards)
```tsx
<div className="bg-silk-highlight">
  {/* Silk-600 → Silk-500 → Panda-500 */}
</div>
```

### Ambient Background (خلفية محيطة)
```tsx
<div className="ambient-bg min-h-screen">
  {/* دوائر blur خلفية بنفسجي + أزرق */}
</div>
```

### Text Gradients
```tsx
<h1 className="text-gradient-primary">نص بتدرج بنفسجي → أزرق</h1>
<h1 className="text-gradient-silk">نص بتدرج ذهبي → بنفسجي</h1>
```

---

## 4. Shadows & Glow

### Soft Shadows (للبطاقات)
```tsx
<div className="shadow-soft">      {/* ظل خفيف */}
<div className="shadow-soft-lg">   {/* ظل كبير */}
```

### Glow Effects (للـ CTA/Focus/VIP)
```tsx
{/* Primary Glow - فقط hover/focus */}
<button className="hover:shadow-glow-primary-sm">
<button className="focus:shadow-glow-primary">

{/* Gold Glow - فقط VIP/Badges */}
<span className="badge-vip shadow-glow-gold-sm">VIP</span>
```

**القاعدة:** Glow يظهر فقط في:
- ✅ hover/focus/active
- ✅ عناصر مكافأة (VIP, Red Packet)
- ❌ **لا** يظهر في الحالة العادية

---

## 5. Components Classes (جاهزة للاستخدام)

### Buttons
```tsx
{/* Primary CTA */}
<button className="btn-primary">اشتري الآن</button>

{/* Secondary */}
<button className="btn-secondary">عرض التفاصيل</button>

{/* Ghost */}
<button className="btn-ghost">إلغاء</button>
```

### Badges
```tsx
<span className="badge-gold">+200 نقطة</span>
<span className="badge-vip">VIP Member</span>
```

### Cards
```tsx
<div className="glass-card p-6">
  {/* محتوى البطاقة */}
</div>

<div className="glass-card-strong p-8">
  {/* بطاقة أقوى للتركيز */}
</div>
```

### Input
```tsx
<input 
  type="text" 
  className="input" 
  placeholder="ابحث..."
/>
```

### Loading Skeleton
```tsx
<div className="skeleton h-20 w-full" />
```

### Empty State
```tsx
<div className="empty-state">
  <ShoppingCart className="empty-state-icon" />
  <h3 className="empty-state-title">السلة فارغة</h3>
  <p className="empty-state-description">أضف منتجات لبدء التسوق</p>
  <button className="btn-primary">تصفح المنتجات</button>
</div>
```

---

## 6. States Colors (مهمة لكل صفحة)

### Loading State
```tsx
<div className="space-y-4">
  <div className="skeleton h-12 w-full" />
  <div className="skeleton h-32 w-full" />
  <div className="skeleton h-8 w-3/4" />
</div>
```

### Empty State
```tsx
<div className="empty-state">
  <Icon className="empty-state-icon" />
  <h3 className="empty-state-title">عنوان</h3>
  <p className="empty-state-description">وصف</p>
  <button className="btn-primary">CTA</button>
</div>
```

### Error State
```tsx
<div className="glass-card p-6 border-danger-500">
  <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
  <h3 className="text-slate-200 text-center mb-2">حدث خطأ</h3>
  <p className="text-slate-300 text-center mb-4">الوصف</p>
  <button className="btn-primary w-full">إعادة المحاولة</button>
</div>
```

### Warning State
```tsx
<div className="glass-card p-4 border-warn-500 bg-warn-500/10">
  <div className="flex items-start gap-3">
    <AlertTriangle className="w-5 h-5 text-warn-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-slate-200 font-medium">تحذير</p>
      <p className="text-slate-300 text-sm mt-1">الرسالة</p>
    </div>
  </div>
</div>
```

---

## 7. قواعد التباين (ليش صفحاتك كانت "باردة"؟)

### المشاكل الشائعة:
❌ نص رمادي على خلفية رمادية  
❌ لا hierarchy واضح  
❌ لا accent يقود العين  

### الحل:
✅ العناوين: `text-slate-200` أو أبيض  
✅ النص العادي: `text-slate-300`  
✅ النص الثانوي: `text-slate-400`  
✅ حدود واضحة: `border-border-strong`  
✅ Card background واضح: `glass-card` أو `bg-bg-elev-1`  

### أمثلة صحيحة:
```tsx
{/* ✅ Good - تباين واضح */}
<div className="glass-card p-6">
  <h2 className="text-slate-200 text-2xl font-bold mb-2">عنوان واضح</h2>
  <p className="text-slate-300 mb-4">نص عادي واضح</p>
  <span className="text-slate-400 text-sm">معلومة ثانوية</span>
  <button className="btn-primary mt-4">CTA واضح</button>
</div>

{/* ❌ Bad - تباين ضعيف */}
<div className="bg-ink-900 p-6">
  <h2 className="text-slate-400 text-xl">عنوان خافت</h2>
  <p className="text-slate-400">نص خافت</p>
  <button className="bg-ink-800 text-slate-400">CTA ضعيف</button>
</div>
```

---

## 8. Checklist لكل صفحة جديدة

- [ ] الخلفية: `bg-ink-900` أو `ambient-bg`
- [ ] العناوين: `text-slate-200` أو أفتح
- [ ] النص العادي: `text-slate-300`
- [ ] البطاقات: `glass-card` مع `shadow-soft`
- [ ] الحدود: `border-border` أو `border-border-strong`
- [ ] CTA أساسي: `btn-primary` مع hover glow
- [ ] Loading: `skeleton` components
- [ ] Empty state: `empty-state` مع icon + CTA
- [ ] Glow: فقط على hover/focus/VIP
