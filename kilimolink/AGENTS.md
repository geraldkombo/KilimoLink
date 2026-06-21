# KilimoLink Direct — AI Agent Development Guide

## Overview
**KilimoLink Direct** is a hyperlocal urban food resilience marketplace connecting city consumers directly with local farmers across East Africa.

- **Stack**: NestJS (backend) + React/Vite (frontend) + PostgreSQL (database) + Redis (cache)
- **Auth**: Privy (email-to-wallet) + JWT
- **Payments**: Mock/Solana devnet (USDC)
- **Hosting**: Render (API, `kilimolink.onrender.com`) + GitHub Pages (web, `geraldkombo.github.io/KilimoLink`)

## Key Rules

1. **All new code must have accompanying tests** — backend tests use Jest + supertest, frontend uses Vitest
2. **TypeScript strict mode** — no `any` unless absolutely necessary and justified
3. **NestJS patterns** — use modules, controllers, services; keep business logic in services
4. **Prisma schema** — all DB changes via Prisma migrations; use `prisma db push` for dev
5. **API routes** — always under `/api/v1/` prefix; use NestJS decorators for validation
6. **Frontend** — React 19 + MUI v6 + react-router-dom v6; keep components in `web/src/components/`
7. **Environment variables** — add to `.env.example` and validate in config service
8. **Redis** — use `RedisService` for caching; graceful degradation when unavailable
9. **Docker** — multi-stage builds; non-root users; health checks on all services
10. **Test suite must pass** before any PR: `pnpm test`

## Test Commands
```bash
pnpm --filter @kilimolink/backend test   # Jest backend tests
pnpm --filter @kilimolink/web test       # Vitest frontend tests
pnpm test                                # All tests
```

## File Map
```
backend/            — NestJS API (src/)
  src/
    admin/          — Admin dashboard endpoints
    ai/             — AI price suggestion service
    auth/           — JWT auth, OTP, login
    common/         — Shared guards, decorators, services
    health/         — Health check endpoint
    market/         — Product listing/creation
    oracle/         — Price oracle
    orders/         — Order management
    users/          — User profile
  prisma/           — Schema + migrations + seed
  test/             — Jest test files
web/                — React SPA (src/)
  src/
    pages/          — Route pages
    components/     — Reusable UI components
    services/       — API clients, auth helpers
    app/            — Context providers, app shell
```
