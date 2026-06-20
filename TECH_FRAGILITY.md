# KilimoLink — Technical Fragility Checklist

## 🔴 PRIORITY 1: Will Break the Demo

| # | Risk | File | Line(s) | What fails | Fix |
|---|------|------|---------|------------|-----|
| R1 | **Backend cold start** | Render free tier sleeps after 15 min | N/A | First request after idle returns 502 for 20-30s | Hit `/api/v1/health` every 5 min from a phone for 30 min before pitch |
| R2 | **Leaflet tiles blocked** | Venue firewall blocks OSM tile server | `EgressDemo` / `SellProduct.tsx` | Map shows gray tiles only | Pre-cache tiles or use a tile fallback like `{url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}` with retry |
| R3 | **JWT token expiry mid-demo** | `auth.module.ts` | `expiresIn: '7d'` | API returns 401 | Log in fresh 30 min before pitch. Save token to localStorage backup. |
| R4 | **GitHub Pages cache** | Old version served | `.github/workflows/deploy.yml` | New features missing | Hard refresh (Ctrl+Shift+R). Or append `?v=` timestamp to URL. Pre-load in incognito. |
| R5 | **PostgreSQL connection drop** | Render free tier limited connections | `prisma.service.ts` | API returns 500 | Confirm `DATABASE_URL` has `?connection_limit=1`. Pooler might help but not needed for demo. |

## 🟡 PRIORITY 2: Will Look Bad

| # | Risk | File | Line(s) | What fails | Fix |
|---|------|------|---------|------------|-----|
| R6 | **API error unhandled in UI** | `SellProduct.tsx` | 301-304 | `catch` block shows generic message instead of helpful text | User sees "Failed to list product" — add the actual error message from response |
| R7 | **No loading state on Marketplace** | `Marketplace.tsx` | (check file) | Page renders empty while API loads | Add `<CircularProgress />` or skeleton while fetching |
| R8 | **Mobile responsiveness** | `SellProduct.tsx` | Map container | Map renders at 0px height on small viewports | Set explicit `height: { xs: '300px', md: '400px' }` on parent Box (already done) |
| R9 | **OTP email delay** | Render free tier outgoing emails slow | `auth.controller.ts` | User waits >30s for OTP | Show "Resend OTP" button after 15s. Pre-generate a demo OTP code. |

## 🟢 PRIORITY 3: Nice to Fix

| # | Risk | File | Fix |
|---|------|------|-----|
| R10 | **No offline detection** | `App.tsx` | Add `window.addEventListener('offline', ...)` to show a banner |
| R11 | **Skeleton loaders absent** | `Marketplace.tsx`, `ProductDetail.tsx` | Add MUI `<Skeleton />` while data fetches |
| R12 | **Browser console errors** | Various | Check console.log for unexpected warnings during demo run |
| R13 | **Swagger docs cached 404** | `main.ts` | Confirm `/docs` route serves Swagger UI (it should) |
| R14 | **No rate limit on demo** | `app.module.ts` | Throttler is configured (60 req/min). Won't hit during demo but good to know. |

## Pre-Demo Runbook (June 22 evening)

```
[ ] 1. Wake backend: curl https://kilimolink.onrender.com/api/v1/health → "ok"
[ ] 2. Open frontend: https://geraldkombo.github.io/KilimoLink/ → loads in <5s
[ ] 3. Log in with demo account → get OTP → dashboard loads
[ ] 4. Create a test product → appears on marketplace
[ ] 5. Open Swagger docs: https://kilimolink.onrender.com/docs → loads
[ ] 6. Hard refresh (Ctrl+Shift+R) → confirm latest version
[ ] 7. Test on phone browser → responsive
[ ] 8. Turn off WiFi → confirm offline banner shows
[ ] 9. Record 60s Loom screen recording as backup
[ ] 10. Save screenshots of each page to slide deck
[ ] 11. Export slides as PDF to USB stick
[ ] 12. Upload everything to Google Drive
[ ] 13. Hit health endpoint every 5 min during the 2 hours before pitch
```

## Emergency Fixes

| Symptom | Immediate fix | Permanent fix |
|---------|---------------|---------------|
| Backend returns 502 | Wait 30s, retry. Say "waking up our server" | Keep hitting health endpoint |
| Map shows gray | Press F5. If persists, say "the venue firewall blocks maps" and move on | Pre-cache tiles |
| Auth fails | Say "let me show you the marketplace instead" and navigate to /market | Check JWT expiry |
| Page is blank | Ctrl+Shift+R hard refresh | Check console for errors |
| Product creation fails | Navigate to existing product in marketplace and say "here's one already listed" | Fix API error handling |
