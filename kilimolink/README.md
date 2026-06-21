# KilimoLink Direct: Hyperlocal Urban Food Resilience

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Solana](https://img.shields.io/badge/Solana-1.98-9945FF?logo=solana)](https://solana.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![tests](https://img.shields.io/badge/tests-30+/30+-success)](https://github.com/geraldkombo/KilimoLink/actions)
[![CI](https://github.com/geraldkombo/KilimoLink/actions/workflows/ci.yml/badge.svg)](https://github.com/geraldkombo/KilimoLink/actions/workflows/ci.yml)

**KilimoLink Direct** is a direct-to-city marketplace designed for the **Innovate4Cities 2026** challenge. It connects urban residents with nearby farmers to reduce food waste and transport emissions across East Africa.

---

## Table of Contents

- [Mission](#-our-mission)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Quick Start](#%EF%B8%8F-quick-start)
- [Testing](#-testing)
- [Docker Production](#-docker-production)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Hackathon Context](#-hackathon-context)

---

## Our Mission

To build climate-resilient cities by decentralizing food supply chains and empowering urban agricultural producers in informal settlements.

**Why It Matters:**
- **30%+** of food in Africa spoils before reaching consumers
- **85%** of Nairobi's fresh produce comes from rural areas 100+ km away
- Urban farming could supply **20-30%** of city food needs by 2030
- Every km shortened in the food supply chain reduces CO2 by **~0.5 kg** per delivery

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Geolocation Market** | Find produce within walking distance of your home using Haversine distance sorting |
| **Impact Dashboard** | Real-time tracking of CO2 savings, waste diversion, and green space metrics |
| **AI Price Suggestion** | Fair trade pricing powered by intelligent category baselines with attribute adjustment |
| **Hybrid Payments** | Instant mock payments or Solana devnet USDC settlements |
| **Privy Auth** | Email-to-wallet authentication with JWT session management |
| **Price Oracle** | Simulated market price feeds with category averages in KES |
| **Admin Console** | Impact metrics, user/product management, resilience logs, data seeding |
| **Swagger Docs** | Auto-generated API documentation at `/docs` |

---

## Architecture

```
                    ┌──────────────────────────────────────┐
                    │         React SPA (Vite)              │
                    │  MUI v6 / Leaflet / Recharts / p5.js  │
                    └──────────────┬───────────────────────┘
                                   │ HTTP / JWT
                    ┌──────────────▼───────────────────────┐
                    │       NestJS API Server              │
                    │    /api/v1/* — 20+ endpoints          │
                    │                                      │
                    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
                    │  │Auth  │ │Market│ │Orders│ │ AI   ││
                    │  └──────┘ └──────┘ └──────┘ └──────┘│
                    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
                    │  │Oracle│ │Admin │ │Users │ │Health││
                    │  └──────┘ └──────┘ └──────┘ └──────┘│
                    └──────┬──────────────┬───────────────┘
                           │              │
                    ┌──────▼──────┐ ┌──────▼──────┐
                    │  PostgreSQL  │ │    Redis     │
                    │  (Prisma)    │ │   (Cache)    │
                    └─────────────┘ └─────────────┘
```

### Data Flow

1. **User** authenticates via Privy → backend issues JWT
2. **Farmer** creates product listing with geolocation → cached in Redis
3. **Buyer** browses marketplace → products sorted by Haversine distance
4. **Buyer** places order → product quantity decremented → impact metrics updated
5. **AI service** suggests fair prices based on category baseline + attributes
6. **Oracle** provides market price snapshots from simulated feeds
7. **Admin** monitors impact metrics, manages users/products, seeds demo data

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | NestJS + TypeScript | 11.0 |
| **Frontend** | React + Vite + MUI | 19 / 6 |
| **Database** | PostgreSQL (via Prisma) | 16 |
| **Cache** | Redis | 7 |
| **Auth** | Privy + JWT (passport) | 1.99 |
| **Blockchain** | Solana Web3.js + Squads | 1.98 |
| **Maps** | Leaflet / react-leaflet | 1.9 |
| **Charts** | Recharts | 3.8 |
| **API Docs** | Swagger (NestJS) | 11 |
| **Security** | Helmet + Throttler + CORS | — |

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | — | Liveness check |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login-email` | — | Login/signup with email |
| `POST` | `/auth/otp` | — | Send OTP (mock) |
| `POST` | `/auth/verify` | — | Verify OTP (mock) |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/me` | JWT | Get current user |
| `DELETE` | `/users/me` | JWT | Delete account |

### Market
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/products` | JWT+Farmer | Create product listing |
| `GET` | `/products` | — | List products (with lat/lng sort) |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/orders` | JWT | Create order |
| `GET` | `/orders` | JWT | Get user orders |

### AI
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ai/suggest-price` | JWT | AI price suggestion |

### Oracle
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/oracle/prices` | — | Price snapshot |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/admin/auth/login` | — | Admin login |
| `GET` | `/admin/impact` | JWT+Admin | Impact metrics |
| `GET` | `/admin/users` | JWT+Admin | List all users |
| `GET` | `/admin/products` | JWT+Admin | List all products |
| `DELETE` | `/admin/products/:id` | JWT+Admin | Delete product |
| `DELETE` | `/admin/users/:id` | JWT+Admin | Delete user |
| `POST` | `/admin/seed` | JWT+Admin | Seed demo data |
| `GET` | `/admin/audit-logs` | JWT+Admin | Admin audit logs |
| `GET` | `/admin/resilience` | JWT+Admin | Resilience logs |
| `POST` | `/admin/resilience` | JWT+Admin | Create resilience log |

---

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9
- PostgreSQL 16 (or Docker)
- Redis 7 (or Docker)

### Development Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp backend/.env.example backend/.env
cp web/.env.example web/.env
# Edit .env files with your configuration

# 3. Start PostgreSQL and Redis (Docker)
docker compose up -d db redis

# 4. Generate Prisma client and push schema
cd backend
npx prisma generate
npx prisma db push
npx ts-node --transpile-only prisma/seed.ts
cd ..

# 5. Start development servers
pnpm dev
```

- **API**: http://localhost:3000
- **Web**: http://localhost:5173
- **Swagger Docs**: http://localhost:3000/docs

---

## Testing

**Currently: 30+ tests across 8 test suites.**

```bash
# Backend tests (Jest)
pnpm --filter @kilimolink/backend test

# Frontend tests (Vitest)
pnpm --filter @kilimolink/web test

# All tests
pnpm test

# Run specific backend test
pnpm --filter @kilimolink/backend test -- --testPathPattern=auth
```

### Test Suites

| Suite | File | Coverage |
|-------|------|----------|
| Health | `test/health.e2e-spec.ts` | Health endpoint |
| Auth | `test/auth.e2e-spec.ts` | Login, OTP, verify, admin auto-grant |
| Market | `test/market.e2e-spec.ts` | Product CRUD, distance sort, auth guards |
| Orders | `test/orders.e2e-spec.ts` | Create order, insufficient qty, user orders |
| AI | `test/ai.e2e-spec.ts` | Price suggestion, auth, edge cases |
| Oracle | `test/oracle.e2e-spec.ts` | Price snapshots, unknown products |
| Users | `test/users.e2e-spec.ts` | Profile get/delete, auth |
| Admin | `test/admin.e2e-spec.ts` | Impact, CRUD, resilience, login, auth guards |

---

## Docker Production

### Production Stack
- **Nginx** — Reverse proxy with TLS, rate limiting, gzip, security headers
- **Backend** — NestJS with multi-stage build, non-root user, health checks
- **Web** — Static files served by Nginx, API proxied to backend
- **PostgreSQL** — Persistent data storage
- **Redis** — In-memory cache

### Run Full Stack

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Scale backend replicas
docker compose up -d --scale backend=3
```

### Health Checks
All services include Docker health checks:
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`
- **Backend**: `GET /health` endpoint
- **Web**: Nginx status

---

## Deployment

### Railway (Backend API)

```bash
railway login
railway up
```

The `railway.json` at root configures:
- Build: `pnpm install → prisma generate → prisma migrate deploy → build`
- Deploy: `node dist/main.js`
- Health check: `/api/v1/health`

### Vercel (Frontend)

The `vercel.json` configures SPA rewrites. Connect your GitHub repo to Vercel for automatic deployments.

```bash
vercel --prod
```

---

## Project Structure

```
kilimolink/
├── backend/                  # NestJS API (45 source files)
│   ├── src/
│   │   ├── admin/            # Admin dashboard (auth, impact, CRUD, seed)
│   │   ├── ai/               # AI price suggestion service
│   │   ├── auth/             # JWT auth, email login, OTP
│   │   ├── common/
│   │   │   ├── auth/         # Guards, decorators (JWT, Roles)
│   │   │   ├── notifications/# SMS/Push transport
│   │   │   ├── payments/     # Payment service scaffold
│   │   │   ├── prisma/       # Database client (PostgreSQL)
│   │   │   └── redis/        # Caching with graceful degradation
│   │   ├── health/           # Health check endpoint
│   │   ├── market/           # Product listing/creation
│   │   ├── oracle/           # Price oracle
│   │   ├── orders/           # Order management
│   │   └── users/            # User profile
│   ├── prisma/
│   │   ├── schema.prisma     # 10 models + 4 enums
│   │   ├── seed.ts           # Database seed script
│   │   └── seed_data/        # JSON datasets (KNBS, products)
│   └── test/                 # 8 test suites (30+ tests)
├── web/                      # React SPA (19 source files)
│   ├── src/
│   │   ├── app/              # App shell, routing, contexts
│   │   ├── pages/            # 5 route pages
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API client, auth, security
│   │   └── types/            # Type declarations
│   └── public/               # Static assets
├── mcp-server/               # MCP server (market/weather tools)
├── mobile/                   # React Native app scaffold
├── docker-compose.yml        # Full production stack
├── AGENTS.md                 # AI agent development guide
└── .github/workflows/        # CI + Deploy pipelines
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [I4C Submission](docs/I4C26_SUBMISSION.md) | Innovate4Cities 2026 challenge submission |
| [Demo Script](docs/DEMO_SCRIPT.md) | Step-by-step walkthrough |
| [Technical Overview](docs/TECHNICAL_OVERVIEW.md) | Architecture deep dive |
| [API Reference](docs/API_REFERENCE.md) | Detailed API documentation |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Production deployment |
| [Press Release](docs/PRESS_RELEASE.md) | Project announcement |
| [Strategic Proposal](docs/STRATEGIC_PROPOSAL.md) | Market strategy |
| [Security Audit](docs/SECURITY_AUDIT.md) | Security review |

---

## Hackathon Context

Built for **Innovate4Cities 2026** and the **Colosseum Agent Hackathon**.

- **City Resilience**: Focus on informal settlements and hyperlocal logistics
- **Solana Integration**: Leveraging Privy for seamless on-chain identity and payments
- **Track**: Urban Food Systems & Climate Resilience
- **Team**: Gerald Kombo (lead), opencode.ai (agent-assisted development)

---

## License

[MIT](LICENSE) — See LICENSE file for details.

---

## Acknowledgments

- Innovate4Cities 2026 challenge
- Colosseum Agent Hackathon
- NASA POWER for satellite data
- Unsplash for placeholder imagery
- Open-source community (NestJS, React, Prisma, and all dependencies)
