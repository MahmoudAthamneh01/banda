import { PrismaClient } from '@prisma/client';

function normalizeDatabaseUrlForHeroku() {
    const databaseUrl = process.env.DATABASE_URL;
    const isHeroku = process.env.HEROKU === 'true' || Boolean(process.env.DYNO);

    if (!databaseUrl || !isHeroku || databaseUrl.includes('sslmode=')) {
        return;
    }

    if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
        process.env.DATABASE_URL = `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`;
    }
}

normalizeDatabaseUrlForHeroku();

export const prisma = new PrismaClient();
