FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY backend/package.json backend/pnpm-lock.yaml* ./
COPY backend/tsconfig.json backend/tsconfig.build.json ./
COPY backend/prisma ./prisma
COPY backend/src ./src
RUN pnpm install --frozen-lockfile=false && pnpm prisma:generate && pnpm build

FROM node:22-alpine AS runtime
RUN corepack enable
RUN addgroup -S kilimolink && adduser -S kilimolink -G kilimolink
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
RUN pnpm install --frozen-lockfile=false --prod
USER kilimolink
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]