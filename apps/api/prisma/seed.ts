import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertUser(params: {
  email: string;
  password: string;
  username: string;
  role: 'USER' | 'MAKER' | 'INVESTOR' | 'ADMIN' | 'OWNER' | 'AMBASSADOR';
  displayName: string;
}) {
  const password = await bcrypt.hash(params.password, 10);

  return prisma.user.upsert({
    where: { email: params.email },
    update: {},
    create: {
      email: params.email,
      password,
      username: params.username,
      role: params.role,
      profile: {
        create: {
          displayName: params.displayName,
          locale: 'en',
          country: 'CN',
          city: 'Shenzhen',
          kycStatus: params.role === 'USER' ? 'PENDING' : 'APPROVED',
        },
      },
      wallets: {
        create: [
          { type: 'FIAT', currency: 'CNY', balance: 10000 },
          { type: 'POINTS', currency: 'POINTS', balance: 500 },
        ],
      },
    },
  });
}

async function main() {
  const admin = await upsertUser({
    email: 'admin@bandachao.local',
    password: 'password123',
    username: 'admin',
    role: 'OWNER',
    displayName: 'BandaChao Owner',
  });

  const maker = await upsertUser({
    email: 'maker@bandachao.local',
    password: 'password123',
    username: 'maker-demo',
    role: 'MAKER',
    displayName: 'Shenzhen Demo Factory',
  });

  const buyer = await upsertUser({
    email: 'buyer@bandachao.local',
    password: 'password123',
    username: 'buyer-demo',
    role: 'USER',
    displayName: 'Demo Buyer',
  });

  await prisma.referral.upsert({
    where: { refereeId: buyer.id },
    update: {},
    create: {
      referrerId: admin.id,
      refereeId: buyer.id,
      code: admin.referralCode,
    },
  });

  const product = await prisma.product.upsert({
    where: { sku: 'BC-DEMO-TEA-001' },
    update: {},
    create: {
      makerId: maker.id,
      sku: 'BC-DEMO-TEA-001',
      name: 'Premium Bamboo Tea Set',
      description: 'Starter catalog item for local development and checkout tests.',
      price: 129.0,
      currency: 'CNY',
      category: 'Home',
      stock: 250,
      status: 'ACTIVE',
      media: {
        create: {
          type: 'PRODUCT',
          url: '/assets/branding/logo.svg',
          alt: 'Demo product image',
        },
      },
    },
  });

  await prisma.order.upsert({
    where: { id: 'seed-order-001' },
    update: {},
    create: {
      id: 'seed-order-001',
      buyerId: buyer.id,
      makerId: maker.id,
      status: 'PAID',
      amountSubtotal: 258.0,
      amountTotal: 258.0,
      platformFeeRate: 0.1,
      platformFeeAmount: 25.8,
      currency: 'CNY',
      items: {
        create: {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          quantity: 2,
          unitPrice: product.price,
          total: 258.0,
        },
      },
    },
  });

  await prisma.rfq.upsert({
    where: { id: 'seed-rfq-001' },
    update: {},
    create: {
      id: 'seed-rfq-001',
      userId: maker.id,
      status: 'SUBMITTED',
      productName: 'Custom IoT Sensor Batch',
      description: 'Need supplier quotes for a small test production run.',
      category: 'Electronics',
      quantity: 500,
      targetPrice: 35.0,
      sourceUrl: 'https://example.local/source/iot-sensor',
      sourceSku: 'IOT-SENSOR-DEMO',
    },
  });

  console.log('Seed completed:', {
    users: [admin.email, maker.email, buyer.email],
    product: product.sku,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
