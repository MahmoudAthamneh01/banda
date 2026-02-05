# DB Schema — Postgres (ACID) + Mongo (Catalog)
Version: 1.0

## 1) Postgres Core Tables (ACID)
### users
- id (uuid, pk)
- email (nullable, unique)
- phone (nullable, unique)
- region (CN/GLOBAL)
- role (enum)
- tier (enum: STANDARD, STUDENT_AMBASSADOR)
- vip_until (nullable) OR vip_is_lifetime (bool)
- social_tier (enum: DRAGON/TIGER/CUB)
- created_at, updated_at
Indexes:
- unique(phone), unique(email), idx(role), idx(tier)

### wallets
- id (uuid pk)
- user_id (fk users)
- currency (RMB)
- type (enum: USER, ESCROW, FUND_REVENUE, FUND_HEDGE, FUND_RD, FUND_EXPANSION, SYSTEM)
- balance (numeric)
Constraints:
- balance >= 0 where applicable

### ledger_entries (double-entry)
- id
- txn_id (uuid)
- wallet_id
- direction (DEBIT/CREDIT)
- amount (numeric)
- currency
- reason_code (enum/string)
- metadata (jsonb)
Indexes:
- idx(txn_id), idx(wallet_id), idx(reason_code)

### transactions
- id (uuid pk)
- type (ORDER_PAYMENT, RFQ_RELEASE, REFERRAL_REWARD, WITHDRAWAL, INVESTMENT)
- status
- reference_id (order_id, rfq_id, etc)
- created_at
Indexes: idx(type), idx(status), idx(reference_id)

### referral_rules (generic, event-driven)
- id
- referrer_id (fk users)
- referee_id (fk users)
- scope (enum: COMMERCE_SALE, CAPITAL_INJECTION, ...)
- rate (numeric)
- is_active (bool)
- created_at
Indexes: unique(referee_id, scope, is_active where is_active=true)

### orders
- id
- buyer_id
- maker_id
- amount_total
- platform_fee_rate
- platform_fee_amount
- referral_amount
- status
- created_at
Indexes: idx(buyer_id), idx(maker_id), idx(status)

### kyc_profiles
- user_id (pk/fk)
- status (PENDING/APPROVED/REJECTED)
- provider_ref
- verified_at

### sanctions_checks
- id
- user_id
- status
- provider_ref
- checked_at

### disputes
- id
- order_id
- status
- stage (AUTO/AI/HUMAN)
- verdict
- created_at

### audit_logs (critical)
- id
- action
- actor_user_id
- ip
- device_fingerprint
- legal_consent (bool)
- payload (jsonb)
- created_at
Indexes: idx(action), idx(actor_user_id)

### china_user_identities (PIPL isolated)
- user_id (fk users)
- national_id_encrypted (text)
- real_name_tokenized (text)
- created_at

## 2) MongoDB Collections
### catalog_products
- _id
- source (taobao/alibaba/amazon/manual)
- source_url
- title, description, attributes (flex)
- media (array of oss urls)
- marketValue
- category
- tags
- createdAt

### import_jobs
- _id
- maker_id
- url
- status
- result_ref

## 3) Constraints & Policies
- All money operations must be via ledger double-entry
- Use SERIALIZABLE/REPEATABLE READ for critical transfers
- No BLOB media in DB; OSS URLs only
