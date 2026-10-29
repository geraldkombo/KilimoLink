# KILIMOLINK DIRECT — EMERGENCY PHONE PRESENTATION MODE

## Critical Constraint
- Presenting from a **phone only** — no laptop, no projector
- Must open `https://geraldkombo.github.io/KilimoLink/` in Chrome on Android
- All demo actions must work on a **720p mobile screen**, one-handed
- No keyboard, no mouse — touch only

## Project
KilimoLink Direct — Nairobi's AI food system climate intelligence platform  
**Team 10** — I4C26 Hackathon, pitch June 23 5pm EAT (3 min)

## Current State

### Working
- React SPA deployed to GitHub Pages (`geraldkombo.github.io/KilimoLink/`)
- NestJS backend on Render free tier (`kilimolink.onrender.com/api/v1` — sleeps on idle)
- Marketplace: browse products, product detail
- County dashboard prototype at `/county-dashboard`
- Auth: email-based, JWT stored in localStorage
- Framer Motion animations throughout
- MUI v6 responsive components

### Known Issues Needing Fix
1. **Auth login fails** when backend is cold (Render sleep). Most critical issue.
2. **Impact section** shows `-` instead of numbers when backend is cold
3. **Mobile UX**: some layouts may not be optimized for phone-presentation
4. **No offline fallback** — entire app breaks without internet
5. **CountyDashboard**: demo data is hardcoded (good), but some API calls fail silently

## Auth System (for login bypass fix)

File: `web/src/services/auth.ts`
- Token key: `kilimolink_user_token`
- Role key: `kilimolink_user_role`
- Email stored under: `email`
- On page load, calls `applyToken('user')` which reads token from localStorage, sets it on axios

Emergency bypass (paste in Chrome DevTools console):
```js
localStorage.setItem("kilimolink_user_token", "demo-token-123");
localStorage.setItem("kilimolink_user_role", "FARMER");
localStorage.setItem("email", "demo@farmers.co.ke");
location.reload();
```

File: `web/src/services/api.ts`
- `apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'`
- `.env` has `http://localhost:3000/api/v1`
- `.env.production` has `https://kilimolink.onrender.com/api/v1`
- Production build correctly uses Render URL

## Key Files
```
kilimolink/PITCH_SCRIPT.md          — 3-min pitch script
kilimolink/PITCH_DECK.md            — slide deck spec
kilimolink/DEMO_CHOREOGRAPHY.md     — 30-sec live demo steps
kilimolink/BACKUP_PLAN.md           — emergency fallbacks
kilimolink/TECH_FRAGILITY.md        — breakage risks
kilimolink/CRITERIA_MATRIX.md       — judging criteria mapping
kilimolink/HACKATHON_PROMPT.md      — master AI prompt
kilimolink/I4C26_FINAL_READINESS.md — readiness checklist
kilimolink/EVIDENCE_LOG.md          — evidence for claims (needs filling)
kilimolink/PRODUCTION_VERIFY.md     — production verification
kilimolink/README.md                — project README

kilimolink/web/src/app/App.tsx              — main app shell + homepage
kilimolink/web/src/services/api.ts           — axios config
kilimolink/web/src/services/auth.ts          — auth (localStorage)
kilimolink/web/src/pages/CountyDashboard.tsx — county dashboard prototype
kilimolink/web/src/pages/Marketplace.tsx     — marketplace listing
kilimolink/web/src/pages/SellProduct.tsx     — sell flow
kilimolink/web/src/pages/ProductDetail.tsx   — product detail
kilimolink/web/src/pages/MyProducts.tsx      — farmer's products
kilimolink/web/src/pages/OrdersPage.tsx      — orders
kilimolink/web/src/pages/AdminPage.tsx       — admin
kilimolink/web/src/components/BackgroundArt.tsx — homepage background
kilimolink/web/.env                          — dev env (localhost)
kilimolink/web/.env.production               — prod env (render.com)

kilimolink/backend/src/main.ts               — NestJS entry
kilimolink/backend/src/auth/                 — auth module
kilimolink/backend/src/market/               — products/market module
kilimolink/backend/src/orders/               — orders module
kilimolink/backend/src/ai/                   — AI suggestions module
kilimolink/backend/src/oracle/               — price oracle module
kilimolink/backend/src/users/                — users module
kilimolink/backend/src/health/               — health endpoint
kilimolink/backend/prisma/schema.prisma      — DB schema
kilimolink/backend/test/                     — backend tests (48 pass)
```

## What Needs to Be Perfect for Phone Presentation

### 1. Auth Bypass (Highest Priority)
The app needs to auto-login when the backend is cold. Options:
- Add a "Demo Mode" button on the sign-in screen that sets localStorage keys directly (no API call)
- Or modify `applyToken()` in auth.ts to create a guest session when API is unreachable

### 2. Mobile-First Demo Flow
The 30-second demo must work on a phone screen:
- `/county-dashboard` must look good at 360px-414px width
- All cards, typography, buttons must be touch-friendly (min 48px tap targets)
- The sell flow must be operable one-handed
- Map interactions (leaflet) must work on mobile touch

### 3. Offline/Cold Resilience
- When API calls fail (503/timeout), show cached/fallback data
- Impact section should show demo numbers instead of `-` when API fails
- Marketplace should show seeded demo products when backend is cold

### 4. Critical UI Fixes
- Hero CTA buttons: "Explore Marketplace" and "Start Selling" — ensure they're large enough for phone taps
- County Dashboard: the prototype has hardcoded data — ensure it renders without any API call
- App bar: ensure hamburger menu works on mobile
- Footer: ensure readable on mobile

## Git Repos
- GitHub: `geraldkombo/KilimoLink` (main deployment)
- GitLab: `254reportnewsdesk/kilimolink` (latest push)

## Build Commands
```bash
cd kilimolink/web
npm install
npm run build          # tsc -b && vite build
npm test               # vitest run (8 tests pass)
```

## Backend Validation
```bash
cd kilimolink/backend
npm ci
npx prisma generate
npm run build
npm test               # jest (48 tests pass)
```
