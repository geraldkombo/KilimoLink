FROM node:22-alpine AS builder
WORKDIR /app
COPY backend/package.json ./
COPY backend/tsconfig.json backend/tsconfig.build.json ./
COPY backend/prisma ./prisma
COPY backend/src ./src
RUN npm install 2>&1 && npx prisma generate 2>&1 && npm run build 2>&1

FROM node:22-alpine AS runtime
RUN addgroup -S kilimolink && adduser -S kilimolink -G kilimolink
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
USER kilimolink
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD sh -c "npx prisma db push --skip-generate && node dist/main.js"