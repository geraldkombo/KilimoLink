FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile=false

COPY index.html vite.config.ts tsconfig.json ./
COPY src ./src

RUN pnpm build

EXPOSE 5173
CMD ["pnpm", "preview"]
