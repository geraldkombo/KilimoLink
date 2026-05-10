FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile=false

COPY tsconfig.json tsconfig.build.json ./
COPY prisma ./prisma
COPY src ./src

RUN pnpm prisma:generate && pnpm build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
