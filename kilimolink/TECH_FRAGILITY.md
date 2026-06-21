# KilimoLink Direct — Technical Fragility Checklist

## #1 live-demo risk

**Backend cold start on Render free tier.**  
If the first API call happens on stage, the app may look broken for 20–60 seconds. The demo must use preloaded pages, a pre-warmed health endpoint, and a no-internet screen-recording fallback.

---

## Critical risks

| ID | Severity | Risk | Where | What fails | Prevention | Stage fallback |
|---|---|---|---|---|---|---|
| R1 | critical | Render backend cold start | `https://kilimolink.onrender.com/api/v1/health` | API returns 502/timeout before waking | Hit health endpoint every 5 min for 2 hours before pitch; preload `/market`, `/sell`, product detail | Use preloaded listing or backup video |
| R2 | critical | Product creation fails live | `web/src/pages/SellProduct.tsx` submit flow | Listing does not appear after click | Pre-create demo product; keep marketplace tab open | Say "Here is one already listed" and open product detail |
| R3 | high | OTP/email delay | Auth flow | Presenter cannot reach `/sell` | Log in 30 min before pitch; keep browser profile open | Demo public marketplace only |
| R4 | high | OSM/Leaflet tiles blocked | `web/src/pages/SellProduct.tsx` map | Gray map tiles | Preload map tiles; test venue network; keep screenshots | Explain venue blocks map tiles; GPS/radius still captured |
| R5 | high | GitHub Pages stale cache | GitHub Pages frontend | Old UI or missing fixes | Hard refresh; open `?v=demo-june23`; preload incognito | Use local build or backup recording |
| R6 | high | PostgreSQL connection drop | Backend Prisma service | 500 on marketplace/products | Keep demo data preloaded; avoid repeated writes | Show cached/preloaded pages |
| R7 | medium | API error messaging too generic | `web/src/pages/SellProduct.tsx`, `Marketplace.tsx`, `ProductDetail.tsx` | Judges see vague error | Show actual response messages; keep retry button | Narrate around failure and switch tab |
| R8 | medium | 720p projector cuts off UI | Homepage/sell form | Buttons below fold; operator scrolls awkwardly | Browser zoom 90%; rehearse on 1366x768 | Use product detail instead of sell form |
| R9 | medium | Mobile overflow | `web/src/pages/SellProduct.tsx` map/form | Horizontal scroll on phone | Test 360px/375px viewports before submission | Do not demo mobile live |
| R10 | low | Redis unavailable | Backend Redis service | Cache misses/log warnings | Use `DISABLE_REDIS=true` for demo if needed | No visible impact if graceful degradation works |

---

## Render deployment checklist

Use these settings for the NestJS backend service:

- **Root directory:** repository root or `kilimolink/backend` depending on Render service setup.
- **Build command from repo root:** `cd kilimolink/backend && npm install && npm run build`
- **Start command from repo root:** `cd kilimolink/backend && npm run start`
- **Build command from backend root:** `npm install && npm run build`
- **Start command from backend root:** `npm run start`
- **Health path:** `/api/v1/health`
- **Required env vars:**
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `DISABLE_REDIS=true` if Redis is not provisioned
  - `MOCK_PAYMENTS=true` for demo payments
  - `NODE_ENV=production`

Check Render logs for:

- App binds to `process.env.PORT`.
- Prisma connects successfully.
- `/api/v1/health` returns 200.
- No missing env var crash.

---

## June 22 rehearsal checklist

- [ ] Verify all numeric pitch claims have real citation URLs.
- [ ] Wake backend and confirm health endpoint.
- [ ] Open frontend and hard refresh.
- [ ] Log in and keep authenticated tab open.
- [ ] Create one demo listing successfully.
- [ ] Confirm marketplace displays products.
- [ ] Confirm product detail displays price truth gap / impact badge.
- [ ] Test sell form at 1366x768 and 360px width.
- [ ] Record 60-second backup demo video.
- [ ] Export slides as PDF and copy to USB.
- [ ] Save screenshots of marketplace, sell page, product detail, and county dashboard mock.
- [ ] Rehearse full pitch with timer: target 2:50, hard stop at 3:00.

---

## No-internet backup order

1. **Localhost demo:** run frontend locally with preinstalled dependencies and a preloaded backend tab if internet is partly available.
2. **Screen recording:** play full-screen 60-second demo; presenter narrates live.
3. **Screenshots in slides:** show marketplace, sell flow, product detail, and county dashboard mock.

---

## Demo rule

Never wait silently. If something takes more than two seconds, keep speaking about Grace, climate risk, and real-time food intelligence.
