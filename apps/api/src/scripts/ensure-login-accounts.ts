import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../lib/db';

type LoginAccount = {
  email: string;
  username: string;
  role: Role;
  displayName: string;
  locale: string;
  country: string;
  city: string;
};

const accounts: LoginAccount[] = [
  {
    email: 'owner@bandachao.com',
    username: 'owner',
    role: Role.OWNER,
    displayName: 'BandaChao Owner',
    locale: 'en',
    country: 'JO',
    city: 'Amman',
  },
  {
    email: 'admin@bandachao.com',
    username: 'admin',
    role: Role.ADMIN,
    displayName: 'BandaChao Admin',
    locale: 'ar',
    country: 'JO',
    city: 'Amman',
  },
  {
    email: 'buyer@bandachao.com',
    username: 'buyer-demo',
    role: Role.BUYER,
    displayName: 'Demo Buyer',
    locale: 'ar',
    country: 'JO',
    city: 'Amman',
  },
  {
    email: 'maker@bandachao.com',
    username: 'maker-demo',
    role: Role.MAKER,
    displayName: 'Shenzhen Demo Factory',
    locale: 'zh',
    country: 'CN',
    city: 'Shenzhen',
  },
  {
    email: 'investor@bandachao.com',
    username: 'investor-demo',
    role: Role.INVESTOR,
    displayName: 'Demo Investor',
    locale: 'en',
    country: 'AE',
    city: 'Dubai',
  },
  {
    email: 'service@bandachao.com',
    username: 'service-demo',
    role: Role.SERVICE_PROVIDER,
    displayName: 'Demo Service Provider',
    locale: 'zh',
    country: 'CN',
    city: 'Guangzhou',
  },
  {
    email: 'ambassador@bandachao.com',
    username: 'ambassador-demo',
    role: Role.AMBASSADOR,
    displayName: 'Demo Ambassador',
    locale: 'ar',
    country: 'JO',
    city: 'Irbid',
  },
];

function getSeedPassword() {
  const password = process.env.LOGIN_SEED_PASSWORD || process.env.SEED_LOGIN_PASSWORD;

  if (!password && process.env.NODE_ENV === 'production') {
    throw new Error('LOGIN_SEED_PASSWORD is required to create production login accounts.');
  }

  return password || 'password123';
}

async function ensureWallets(userId: string) {
  await prisma.wallet.upsert({
    where: {
      userId_type_currency: {
        userId,
        type: 'FIAT',
        currency: 'CNY',
      },
    },
    update: {},
    create: {
      userId,
      type: 'FIAT',
      currency: 'CNY',
      balance: 10000,
    },
  });

  await prisma.wallet.upsert({
    where: {
      userId_type_currency: {
        userId,
        type: 'POINTS',
        currency: 'POINTS',
      },
    },
    update: {},
    create: {
      userId,
      type: 'POINTS',
      currency: 'POINTS',
      balance: 500,
    },
  });
}

async function ensureAccount(account: LoginAccount, passwordHash: string) {
  const user = await prisma.user.upsert({
    where: { email: account.email },
    update: {
      password: passwordHash,
      username: account.username,
      role: account.role,
      profile: {
        upsert: {
          create: {
            displayName: account.displayName,
            locale: account.locale,
            country: account.country,
            city: account.city,
            kycStatus: account.role === Role.BUYER ? 'PENDING' : 'APPROVED',
          },
          update: {
            displayName: account.displayName,
            locale: account.locale,
            country: account.country,
            city: account.city,
            kycStatus: account.role === Role.BUYER ? 'PENDING' : 'APPROVED',
          },
        },
      },
    },
    create: {
      email: account.email,
      password: passwordHash,
      username: account.username,
      role: account.role,
      profile: {
        create: {
          displayName: account.displayName,
          locale: account.locale,
          country: account.country,
          city: account.city,
          kycStatus: account.role === Role.BUYER ? 'PENDING' : 'APPROVED',
        },
      },
    },
  });

  await ensureWallets(user.id);
  return user;
}

async function main() {
  const passwordHash = await bcrypt.hash(getSeedPassword(), 10);
  const users = [];

  for (const account of accounts) {
    users.push(await ensureAccount(account, passwordHash));
  }

  console.log('Login accounts ready:', users.map((user) => `${user.email}:${user.role}`).join(', '));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
