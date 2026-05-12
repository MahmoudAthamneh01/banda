# Referral System - Multi-Tier Architecture

## Overview

BandaChao's referral system implements a **3-tier commission structure** with event-driven reward processing, ACID transaction guarantees, and configurable earning caps.

## Architecture

```
User Registration (with referral code)
           ↓
    Event: user.registered
           ↓
   Create Referral Relationship
           ↓
    Award Signup Reward (10 CNY)
           ↓
   ═══════════════════════════════
           ↓
    User Makes Order
           ↓
    Event: order.completed
           ↓
   Build Referral Chain (3 levels)
           ↓
   ┌─────────────────────────────┐
   │  Level 1 (Direct Referrer)  │
   │  - First order bonus: 50¥   │
   │  - Commission: 3%           │
   └─────────────────────────────┘
           ↓
   ┌─────────────────────────────┐
   │  Level 2 (2nd Tier)         │
   │  - Commission: 1.5%         │
   └─────────────────────────────┘
           ↓
   ┌─────────────────────────────┐
   │  Level 3 (3rd Tier)         │
   │  - Commission: 0.5%         │
   └─────────────────────────────┘
```

## Commission Structure

### Tier 1 (Direct Referral)
- **Signup Reward**: 10 CNY when referee registers
- **First Order Bonus**: 50 CNY when referee makes first purchase
- **Commission**: 3% of all referee's orders
- **Example**: Referee buys 1000 CNY → Referrer earns 30 CNY

### Tier 2 (Second Level)
- **Commission**: 1.5% of orders from 2nd level referrals
- **Example**: 2nd level user buys 1000 CNY → Referrer earns 15 CNY

### Tier 3 (Third Level)
- **Commission**: 0.5% of orders from 3rd level referrals
- **Example**: 3rd level user buys 1000 CNY → Referrer earns 5 CNY

## Earning Caps

### Per-Referee Cap
- Maximum 2,000 CNY earnings from any single referee
- Prevents abuse from colluding with high-value buyers

### Total Earnings Cap
- Maximum 50,000 CNY total referral earnings per user
- Ensures sustainable economics
- Can be adjusted based on user tier (regular vs VIP)

## Event-Driven Processing

### Events

```typescript
// User registers with referral code
eventBus.emit('user.registered', {
  userId: 'new-user-123',
  email: 'user@example.com',
  referralCode: 'ABC12345'
});

// Order completed
eventBus.emit('order.completed', {
  orderId: 'order-456',
  userId: 'user-123',
  total: 1299.99,
  items: [...]
});
```

### Listeners

The referral service automatically listens for:
- `user.registered` → Create referral relationship + signup reward
- `order.completed` → Calculate and award multi-tier commissions

## Example Scenarios

### Scenario 1: New User Signup

```
User B registers with User A's referral code
↓
Referral relationship created: A → B
↓
User A receives: 10 CNY signup reward
```

### Scenario 2: First Order

```
User B makes first order: 1000 CNY
↓
User A receives:
  - First order bonus: 50 CNY
  - Tier 1 commission: 30 CNY (3%)
  - Total: 80 CNY
```

### Scenario 3: Multi-Tier Commission

```
Chain: A → B → C → D

User D makes order: 2000 CNY
↓
Commissions awarded:
  - User C (Tier 1): 60 CNY (3%)
  - User B (Tier 2): 30 CNY (1.5%)
  - User A (Tier 3): 10 CNY (0.5%)
```

### Scenario 4: Earnings Cap Reached

```
User A has earned 1,950 CNY from User B

User B makes 500 CNY order
↓
Expected commission: 15 CNY (3%)
Allowed commission: 50 CNY (cap: 2000 - 1950)
↓
User A receives: 15 CNY (within cap)

Next order from B:
↓
Cap reached - no more commission from User B
But other referees still generate commissions
```

## Database Schema

### Referral Model

```prisma
model Referral {
  id          String   @id @default(cuid())
  referrerId  String   // User who referred
  refereeId   String   // User who was referred
  code        String   // Referral code used
  status      String   // active, inactive
  createdAt   DateTime @default(now())
  
  @@unique([referrerId, refereeId])
}
```

### Tracking in Ledger

All rewards are tracked in the `LedgerEntry` table:

```prisma
model LedgerEntry {
  id          String   @id @default(cuid())
  walletId    String
  amount      Decimal
  type        String   // REFERRAL_SIGNUP, REFERRAL_FIRST_ORDER, REFERRAL_COMMISSION
  description String
  referenceId String?  // Links to referee userId or orderId
  createdAt   DateTime @default(now())
}
```

## API Endpoints

### Get User's Referral Code

```http
GET /api/referrals/my-code
Authorization: Bearer <token>

Response:
{
  "code": "ABC12345",
  "shareUrl": "https://bandachao.com/register?ref=ABC12345"
}
```

### Get Referral Stats

```http
GET /api/referrals/stats
Authorization: Bearer <token>

Response:
{
  "totalReferrals": 15,
  "activeReferrals": 12,
  "totalEarned": 3450.50,
  "tier1Referrals": 15
}
```

### Get Referral History

```http
GET /api/referrals/history
Authorization: Bearer <token>

Response:
{
  "referrals": [
    {
      "id": "ref-1",
      "referee": {
        "id": "user-123",
        "email": "user@example.com",
        "createdAt": "2026-01-15T10:00:00Z"
      },
      "status": "active"
    }
  ],
  "stats": {
    "totalReferrals": 15,
    "activeReferrals": 12,
    "totalEarned": 3450.50
  }
}
```

## Configuration

Adjust referral rates in `apps/api/src/modules/referrals/referral.service.ts`:

```typescript
const DEFAULT_REWARD_CONFIG: ReferralRewardConfig = {
  signupReward: 10,          // Change signup reward
  firstOrderReward: 50,      // Change first order bonus
  tier1Commission: 0.03,     // 3% direct commission
  tier2Commission: 0.015,    // 1.5% 2nd level
  tier3Commission: 0.005,    // 0.5% 3rd level
  maxRewardPerReferee: 2000, // Per-referee cap
  maxTotalEarnings: 50000,   // Total earnings cap
};
```

## Testing

### Test Signup Reward

```bash
# Register with referral code
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "secure123",
    "referralCode": "ABC12345"
  }'

# Check referrer's wallet - should have +10 CNY
```

### Test Order Commission

```bash
# Complete an order
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer <token>" \
  -d '{
    "items": [{"productId": "prod-1", "quantity": 2}],
    "total": 1000
  }'

# Check all 3 tiers of referrers - should have commissions
```

## Monitoring

### Key Metrics to Track

1. **Referral Conversion Rate**: Signups → First Order
2. **Average Commission Per Referral**: Total earnings / Total referrals
3. **Top Referrers**: Users with most referrals
4. **Commission Breakdown**: Tier 1 vs Tier 2 vs Tier 3
5. **Cap Hit Rate**: % of referrers hitting earning caps

### Logging

All referral events are logged:

```
✅ Referral created: user-abc -> user-xyz
✅ Signup reward awarded: 10 CNY to user-abc
✅ First order reward: 50 CNY to user-abc
✅ Tier 1 commission: 30.00 CNY to user-abc
✅ Tier 2 commission: 15.00 CNY to user-def
✅ Multi-tier rewards processed for order order-123
```

## Anti-Fraud Measures

1. **One Referral Per User**: Users can only be referred once
2. **Active Status Check**: Only active referrals earn rewards
3. **Earning Caps**: Prevents unlimited earnings from single referee
4. **Deactivation**: Admin can deactivate fraudulent referrals
5. **Ledger Audit Trail**: All transactions are immutable and traceable

## Future Enhancements

- [ ] **Dynamic Tier Rates**: VIP users get higher commission rates
- [ ] **Time-Limited Bonuses**: Double commissions during promotions
- [ ] **Referral Leaderboard**: Public ranking of top referrers
- [ ] **NFT Badges**: Milestone rewards (10, 50, 100 referrals)
- [ ] **Referral Analytics Dashboard**: Detailed earnings breakdown
- [ ] **Automated Payouts**: Weekly/monthly commission withdrawals

## Compliance

Referral program complies with:
- Chinese advertising laws
- Anti-pyramid scheme regulations (max 3 levels)
- PIPL data protection requirements
- Tax reporting for earnings over threshold
