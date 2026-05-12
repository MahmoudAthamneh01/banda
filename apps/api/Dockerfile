FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter api...

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY tsconfig.json tsconfig.base.json ./
COPY apps/api ./apps/api

WORKDIR /app/apps/api
# Generate Prisma Client
RUN pnpm prisma:generate

# Build TypeScript
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app/apps/api

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bandaapi

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma

USER bandaapi

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/server.js"]
