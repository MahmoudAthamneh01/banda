1) Public + Legal + System

/ (Landing / Home Hub)

/about

/faq

/status

/privacy-policy

/terms-of-service

/return-refund

/contact (اختياري لكنه عملي)

/_not-found + صفحات error (نظامية)

2) Auth + Onboarding + KYC

/auth/signin

/auth/register

/auth/forgot-password (إن وجد reset)

/auth/verify (OTP/Phone)

/onboarding

/kyc

3) Buyer Pillar (Marketplace)

/square (Market Lobby)

/products

/products/[id]

/cart

/checkout

/checkout/success

/orders

/orders/[id]

/wallet

/messages

/notifications (اختياري لكن مهم UX)

4) Maker Pillar (Cockpit)

/cockpit (Overview)

/cockpit/products

/cockpit/products/new

/cockpit/products/[id]/edit

/cockpit/inventory

/cockpit/orders

/cockpit/orders/[id]

/cockpit/rfq

/cockpit/rfq/[id]

/cockpit/bids

/cockpit/payouts

/cockpit/settings

(لو بتبسطها بالمراحل الأولى: خلي new/edit داخل modal بدل routes منفصلة، بس وجودها أفضل للمنتج الكامل.)

5) Investor Pillar (Vault)

/vault (Dashboard)

/vault/opportunities

/vault/opportunities/[id]

/vault/portfolio

/vault/portfolio/[id]

/vault/transactions

/vault/factories

/vault/factories/[id]

6) Admin Pillar (Throne)

/throne (Command Center)

/throne/users

/throne/users/[id]

/throne/verification (KYC Queue)

/throne/finance

/throne/disputes

/throne/disputes/[id]

/throne/fraud

/throne/referrals

/throne/cycles

/throne/system

/throne/ai

/throne/audit-logs (مهم جداً للـAdmin)

7) Social Layer

/feed

/feed/[id] (Post details)

/profile (my profile)

/u/[username] أو /profile/[id] (public profile)

/videos

/videos/[id]

/makers

/makers/[id] (maker public page)

8) Settings (مشترك لكل الأدوار)

/settings

/settings/account

/settings/security

/settings/preferences

/settings/billing (لو فيه اشتراكات/خطط)

/settings/notifications

2) خريطة ظهور الـAI (Where + How)

قاعدة ذهبية: الـAI “مساعد” وليس “ديكور”. يظهر فقط عندما يضيف قيمة، وبثلاثة أنماط:

أنماط الظهور (UI Surfaces)

Inline Assist داخل الصفحة (card جانبي / hint تحت input)

Toast/Popover خفيف وسريع (إشعار ذكي)

Overlay / Modal Character (نادر — فقط للأحداث المهمة)

مستويات الصلاحيات (لو عندك)

AUTO: يظهر تلقائياً (نصائح خفيفة/تنبيهات)

USER: يظهر بعد تفاعل المستخدم (ضغط زر “Ask Panda”)

NUCLEAR: قرار حساس يحتاج تأكيد واضح (حظر/تجميد/تحكيم)

Agents وكيف لازم يبانوا (مختصر عملي)
1) Host Panda (Onboarding / Guidance)

يظهر في: /onboarding, /kyc, أول زيارة للـ/square

شكل الظهور: Inline steps + tooltip

متى: عند توقف المستخدم أو وجود نقص بيانات

ممنوع: داخل الدفع

2) Deal Cat (Conversion / Discounts)

يظهر في: /cart + /checkout (قبل الدفع فقط)

شكل: Toast صغير “خصم/اقتراح”

متى: dwell > 3s أو محاولة خروج

ممنوع: بعد نجاح الدفع

3) Hungry Hippo (Safety / Order Integrity)

يظهر في: /checkout/success + /orders/[id]

شكل: Confirmation overlay صغير لمنع double actions

متى: عند تأكيد الطلب / استلام

4) Cyber Wukong (Ops / Inventory)

يظهر في: /cockpit/inventory, /cockpit/products, /cockpit/orders

شكل: Inline alert card + CTA (“Reorder”, “Update stock”)

متى: low stock / delays

5) Magistrate Mandrill (Disputes / Arbitration)

يظهر في: /throne/disputes/[id] + (اختياري) /orders/[id] عند فتح نزاع

شكل: Side panel “Recommendation + evidence summary”

متى: عند وجود dispute فقط

ممنوع: يظهر للمستخدم العادي بدون نزاع

6) Chatty Bird (Social / Trends)

يظهر في: /feed, /videos, /makers, /square

شكل: Ticker/mini-card (خفيف)

متى: على load أو scroll depth

3) قاعدة مهمّة للـAI في كل صفحة

لكل صفحة لازم يكون:

زر ثابت: “Ask Panda” (يفتح drawer) ✅

وسطح AI تلقائي واحد فقط كحد أقصى (toast أو hint) ✅

صفحة Admin: لازم AI يكون مقيد وما يعمل شيء بدون confirmation ✅

إذا بدك نبدأ “صفحة صفحة”

إعطني من القائمة رقم الصفحة اللي بدك نبدأ فيها (مثلاً: 16 /square)، وأنا أعطيك فوراً:

محتوى الصفحة (Sections)

Components المطلوبة

States

Animations

AI surface الخاصة فيها

Acceptance Criteria (متى نقول PASS)

بدك نبدأ بـ /square ولا /products؟