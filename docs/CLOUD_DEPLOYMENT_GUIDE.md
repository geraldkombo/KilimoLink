# Production Deployment Guide: KilimoLink

This guide outlines the steps to deploy KilimoLink to **Railway (Backend)** and **Vercel (Frontend)** for the Innovate4Cities 2026 demo.

## 1. Backend: Railway Deployment
Railway is recommended for the NestJS/Prisma backend.

### Steps:
1. **Connect GitHub**: Log in to [Railway.app](https://railway.app) and connect the `KilimoLink` repository.
2. **Setup Database**: 
   - Add a **PostgreSQL** plugin to your Railway project.
   - Railway will automatically provide a `DATABASE_URL`.
3. **Configure Environment Variables**:
   - `DATABASE_URL`: (Automatically set by Railway Postgres).
   - `JWT_SECRET`: Generate a strong random string.
   - `MOCK_PAYMENTS`: `false` (for real mode).
   - `DEEPSEEK_API_KEY`: `sk-be19eb78057a4cc393f7c2f35ef560d3`.
   - `PORT`: `3000`.
4. **Build Command**: `pnpm install && cd backend && npx prisma generate && npx prisma migrate deploy && pnpm run build`.
5. **Start Command**: `cd backend && pnpm run start:prod`.

## 2. Frontend: Vercel Deployment
Vercel is the optimal choice for the React/Vite frontend.

### Steps:
1. **Connect GitHub**: Log in to [Vercel.com](https://vercel.com) and import the `KilimoLink` repository.
2. **Root Directory**: Set to `web`.
3. **Configure Environment Variables**:
   - `VITE_API_BASE_URL`: The URL of your Railway backend (e.g., `https://kilimolink-api.up.railway.app/api/v1`).
   - `VITE_PRIVY_APP_ID`: `cmp000ywe01mm0cldpk8r2kt7`.
4. **Framework Preset**: Select `Vite`.
5. **Install Command**: `pnpm install`.
6. **Build Command**: `pnpm run build`.

## 3. Post-Deployment Verification
1. Visit your Vercel URL.
2. Ensure the "Nearby Produce" section loads (requires Backend API connection).
3. Test a login via Privy.
4. Verify the Admin Impact Dashboard shows real-time data from the production database.
