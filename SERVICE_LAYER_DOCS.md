# BandaChao Service Layer Documentation

## Overview

The service layer provides a clean abstraction between the frontend UI and backend APIs. It enables seamless switching between mock data (for development) and real API calls (for production).

## Architecture

```
Frontend Components
        ↓
   Service Layer (Abstraction)
        ↓
   ┌─────────────┬─────────────┐
   ↓             ↓             ↓
Mock Service   Real Service  
(Development)  (Production)
```

## Configuration

Set the service mode in `.env.local`:

```bash
# Use mock data (no backend needed)
NEXT_PUBLIC_USE_MOCK_SERVICES=true

# Use real API (backend must be running)
NEXT_PUBLIC_USE_MOCK_SERVICES=false
```

## Available Services

### 1. ProductsService

Manages product catalog operations.

```typescript
import { ProductsService } from '@/services';

// Get all products (with optional filters)
const products = await ProductsService.getProducts({
  category: 'Electronics',
  minPrice: 100,
  maxPrice: 5000,
  search: 'sensor'
});

// Get single product
const product = await ProductsService.getProductById('prod-1');

// Create new product (maker only)
const newProduct = await ProductsService.createProduct({
  name: 'New Product',
  description: '...',
  price: 999,
  category: 'Electronics',
  // ...
});
```

### 2. OrdersService

Handles order creation and tracking.

```typescript
import { OrdersService } from '@/services';

// Get user's orders
const orders = await OrdersService.getOrders(userId);

// Get order details
const order = await OrdersService.getOrderById('order-1');

// Create new order
const newOrder = await OrdersService.createOrder({
  items: [
    { productId: 'prod-1', quantity: 2 }
  ],
  shippingAddress: {
    name: '李明',
    phone: '+86 138 0000 0000',
    address: '深圳湾科技生态园',
    city: 'Shenzhen',
    province: 'Guangdong',
    postalCode: '518000'
  },
  paymentMethod: 'alipay'
}, userId);

// Update order status
await OrdersService.updateOrderStatus('order-1', 'shipped');

// Cancel order
await OrdersService.cancelOrder('order-1');
```

### 3. AuthService

Authentication and user management.

```typescript
import { AuthService } from '@/services';

// Login
const { user, tokens } = await AuthService.login({
  identifier: 'user@example.com', // or phone number
  password: 'password123'
});

// Register
const { user, tokens } = await AuthService.register({
  email: 'new@example.com',
  password: 'secure-password',
  phone: '+86 138 1234 5678', // optional
  referralCode: 'FRIEND123' // optional
});

// Get current user
const currentUser = await AuthService.getCurrentUser(token);

// Update profile
const updatedUser = await AuthService.updateProfile(userId, {
  phone: '+86 138 9999 9999'
});

// Logout
await AuthService.logout();
```

### 4. WalletService

Wallet and transaction management.

```typescript
import { WalletService } from '@/services';

// Get wallet balance
const balance = await WalletService.getBalance(userId);
console.log(balance.cny); // 5000

// Get transaction history
const transactions = await WalletService.getTransactions(userId, 50);

// Deposit money
const depositTx = await WalletService.deposit(userId, 1000, 'cny');

// Withdraw money
const withdrawTx = await WalletService.withdraw(userId, 500, 'cny');

// Process payment for order
const paymentTx = await WalletService.processPayment(
  userId,
  732.22,
  'order-1',
  'alipay'
);

// Get payment methods
const methods = await WalletService.getPaymentMethods(userId);
```

### 5. RFQService

Request for Quote (RFQ) and bidding system.

```typescript
import { RFQService } from '@/services';

// Get all RFQs (with optional filters)
const rfqs = await RFQService.getRFQs({
  status: 'open',
  buyerId: 'user-1'
});

// Get RFQ details
const rfq = await RFQService.getRFQById('rfq-1');

// Create new RFQ (buyer)
const newRFQ = await RFQService.createRFQ({
  title: 'Custom IoT Sensors - Bulk Order',
  description: 'Need 5000 units...',
  category: 'Electronics',
  quantity: 5000,
  targetPrice: 15,
  deadline: '2026-02-15T23:59:59Z'
}, buyerId);

// Get bids for RFQ
const bids = await RFQService.getBidsForRFQ('rfq-1');

// Create bid (maker)
const newBid = await RFQService.createBid({
  rfqId: 'rfq-1',
  pricePerUnit: 12.5,
  deliveryTime: 30,
  message: 'We can provide high-quality sensors...'
}, makerId, makerName);

// Accept bid (buyer)
await RFQService.acceptBid('bid-1');

// Reject bid (buyer)
await RFQService.rejectBid('bid-2');

// Close RFQ
await RFQService.closeRFQ('rfq-1');
```

## Usage in Components

Example: Product listing page

```typescript
'use client';

import { useEffect, useState } from 'react';
import { ProductsService, type Product } from '@/services';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await ProductsService.getProducts({
          category: 'Electronics'
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Mock Data Features

When `USE_MOCK_SERVICES=true`:

- **Realistic delays**: Simulates network latency (200-1500ms)
- **State management**: Mock data persists during development session
- **Error simulation**: Can test error scenarios
- **No backend required**: Frontend development without API

## Real API Features

When `USE_MOCK_SERVICES=false`:

- **Full integration**: Connects to real backend API
- **Authentication**: JWT tokens for secure requests
- **Error handling**: Proper HTTP error responses
- **Production-ready**: Same code path as production

## Type Safety

All services are fully typed with TypeScript:

```typescript
// Autocomplete and type checking
const product: Product = await ProductsService.getProductById('prod-1');

// Compile-time error if wrong type
const order: Order = await OrdersService.createOrder({
  items: [{ productId: 'prod-1', quantity: 'invalid' }] // ❌ Type error
  // ...
});
```

## Best Practices

1. **Always use services**: Never call API directly from components
2. **Handle errors**: Wrap service calls in try-catch blocks
3. **Loading states**: Show loading indicators during async operations
4. **Type imports**: Import types from services for consistency
5. **Environment variables**: Keep `.env.local` in `.gitignore`

## Next Steps

1. ✅ Service layer created (Products, Orders, Auth, Wallet, RFQ)
2. 🔄 Wire services into existing pages (replace mock data imports)
3. 🔄 Complete referral service integration
4. 🔄 Add payment gateway implementations
5. 🔄 Build RFQ backend API
6. 🔄 Implement justice system service

## Troubleshooting

**Services not switching between mock/real?**
- Check `.env.local` has correct `NEXT_PUBLIC_USE_MOCK_SERVICES` value
- Restart Next.js dev server after changing env variables

**Type errors?**
- Run `pnpm typecheck` to see all TypeScript errors
- Ensure all imports use correct paths

**API not connecting?**
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check backend API is running on correct port
- Look at browser Network tab for failed requests
