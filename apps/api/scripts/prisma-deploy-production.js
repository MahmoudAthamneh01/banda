const { spawnSync } = require('node:child_process');

const databaseUrl = process.env.DATABASE_URL;
const isHeroku = process.env.HEROKU === 'true' || Boolean(process.env.DYNO);

if (databaseUrl && isHeroku && !databaseUrl.includes('sslmode=')) {
  process.env.DATABASE_URL = `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`;
}

const result = spawnSync(
  'pnpm',
  ['exec', 'prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'],
  {
    cwd: __dirname + '/..',
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
