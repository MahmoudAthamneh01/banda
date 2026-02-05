// Mock data for Cockpit and other pages

export const COCKPIT_STATS = [
  {
    label: 'Total Revenue',
    value: '¥284,500',
    change: '+20.1%',
    trend: 'up' as const,
  },
  {
    label: 'Active Orders',
    value: '42',
    change: '+12',
    trend: 'up' as const,
  },
  {
    label: 'Products Listed',
    value: '186',
    change: '+4',
    trend: 'up' as const,
  },
  {
    label: 'Avg. Response Time',
    value: '2.4h',
    change: '-0.8h',
    trend: 'down' as const,
  },
];

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    category: 'Electronics',
    stock: 45,
    image: '/placeholder-product.jpg',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    price: 399.99,
    category: 'Electronics',
    stock: 32,
    image: '/placeholder-product.jpg',
    rating: 4.8,
    reviews: 256,
  },
  {
    id: '3',
    name: 'Leather Messenger Bag',
    price: 159.99,
    category: 'Fashion',
    stock: 18,
    image: '/placeholder-product.jpg',
    rating: 4.3,
    reviews: 89,
  },
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-2024-001',
    status: 'delivered',
    total: 599.98,
    items: 2,
    date: '2024-01-15',
  },
  {
    id: 'ORD-2024-002',
    status: 'in-transit',
    total: 299.99,
    items: 1,
    date: '2024-01-20',
  },
  {
    id: 'ORD-2024-003',
    status: 'processing',
    total: 459.97,
    items: 3,
    date: '2024-01-22',
  },
];

export const MOCK_RFQ = [
  {
    id: 'RFQ-001',
    product: 'Custom PCB Boards',
    quantity: 5000,
    budget: '$25,000',
    deadline: '2024-02-15',
    status: 'pending',
  },
  {
    id: 'RFQ-002',
    product: 'Injection Molded Parts',
    quantity: 10000,
    budget: '$15,000',
    deadline: '2024-02-20',
    status: 'quoted',
  },
  {
    id: 'RFQ-003',
    product: 'Metal Stamping Components',
    quantity: 2500,
    budget: '$8,500',
    deadline: '2024-02-10',
    status: 'accepted',
  },
];

export const MOCK_WALLET_TRANSACTIONS = [
  {
    id: 'TXN-001',
    type: 'credit',
    amount: 2500.00,
    description: 'Payment received from Order #ORD-2024-045',
    date: '2024-01-20T10:30:00',
    status: 'completed',
  },
  {
    id: 'TXN-002',
    type: 'debit',
    amount: 150.00,
    description: 'Withdrawal to bank account',
    date: '2024-01-19T15:45:00',
    status: 'completed',
  },
  {
    id: 'TXN-003',
    type: 'credit',
    amount: 1200.00,
    description: 'Refund for cancelled order',
    date: '2024-01-18T09:15:00',
    status: 'pending',
  },
];

export const MOCK_MESSAGES = [
  {
    id: '1',
    conversationId: 'conv-001',
    sender: 'buyer',
    senderName: 'John Chen',
    message: 'Hi, I have a question about bulk pricing for PCB boards.',
    timestamp: '2024-01-20T14:30:00',
    read: false,
  },
  {
    id: '2',
    conversationId: 'conv-002',
    sender: 'buyer',
    senderName: 'Sarah Wang',
    message: 'Can you ship to Singapore?',
    timestamp: '2024-01-20T13:15:00',
    read: true,
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2024-050 has been placed.',
    timestamp: '2024-01-20T16:00:00',
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: '¥2,500 credited to your wallet.',
    timestamp: '2024-01-20T15:30:00',
    read: false,
  },
  {
    id: '3',
    type: 'rfq',
    title: 'New RFQ Request',
    message: 'You have a new RFQ for custom components.',
    timestamp: '2024-01-20T14:00:00',
    read: true,
  },
];
