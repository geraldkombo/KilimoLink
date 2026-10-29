# KilimoLink Direct — Trae Solo Handoff for I4C26 Submission

## Skills to Enable in Trae Solo

Enable these skills (from the 2026 Trae Solo skill marketplace):

| Skill | Why |
|-------|-----|
| **frontend-design** (Anthropic) | Polish UI to production-grade — no generic AI aesthetics |
| **react-best-practices** (Vercel) | Apply React 19 performance optimization guidelines |
| **security-best-practices** (OpenAI) | Audit auth/Owasp — review Python, JS/TS, Go |
| **gh-cli** (Github) | All git operations — commit, push, PR, release |
| **shadcn** (shadcn) | Manage shadcn/ui components in the project |
| **webapp-testing** (Anthropic) | Run Playwright tests, debug, screenshot |
| **slides** (OpenAI) | Build/edit the I4C26 pitch `.pptx` |
| **chart-visualization** (Bytedance) | Pick optimal chart types for County Dashboard |
| **data-analysis** (Bytedance) | Analyze KNBS/AFA data files if needed |

---

## Project Context

**Product**: KilimoLink Direct — climate-smart food transport intelligence for Nairobi
**Stack**: React 19 + Vite + MUI v6 (frontend) | NestJS + Prisma + PostgreSQL (backend) | GitHub Pages (frontend) | Render (backend)
**Live URLs**:
- Frontend: https://geraldkombo.github.io/KilimoLink/
- Backend: https://kilimolink-1.onrender.com/api/v1/health (status: ok, DB: up)
**Domain**: kilimolink.onrender.com

### What's Already Done

1. **Renamed all visible branding** to "KilimoLink Direct" in hero, navbar, dialogs, footer, `<title>`, meta tags, API error messages
2. **Removed v1.2.0** from footer
3. **Replaced all 6 em dashes** with hyphens in user-facing copy
4. **Changed tagline**: "Move food faster. Waste less. Earn more."
5. **Removed "Pricing Guide" and "Farmer Tips"** vanity links from footer
6. **Lazy-loaded all 7 page routes** with React.lazy() + Suspense; preload Marketplace & CountyDashboard after 2s
7. **Build passes** (tsc -b && vite build), **8/8 tests pass**
8. **Pushed** to origin/master (GitHub Pages) and shikunyi-group/master (GitLab)
9. **Transport angle** woven into PITCH_SCRIPT.md and PITCH_DECK.md
10. **Camera upload** with canvas compression replaces old URL/gallery approach
11. **Demo offline fallbacks** on Marketplace, ProductDetail, MyProducts, OrdersPage
12. **SellProduct mobile layout** fixed for 360px

---

## Tasks for Trae Solo

### 1. Verify & Polish Frontend
Activate: `frontend-design` + `react-best-practices` + `shadcn`

- [ ] Open the app at `kilimolink/web/src/app/App.tsx` and run `npm run dev`
- [ ] Check every page at 360px-414px width (phone-only presentation)
- [ ] Ensure no text overflows, buttons wrap correctly, drawer is usable
- [ ] Verify the offline banner shows when network is disconnected
- [ ] Run `npm test` — all 8 should pass
- [ ] Run `npm run build` — should pass cleanly

### 2. Security Audit
Activate: `security-best-practices`

- [ ] Review `kilimolink/backend/src/auth/` for JWT handling
- [ ] Review `kilimolink/web/src/services/api.ts` for token storage
- [ ] Review localStorage keys: `kilimolink_user_token`, `kilimolink_user_role`, `email`
- [ ] Check for any hardcoded secrets or exposed tokens

### 3. GitHub Operations
Activate: `gh-cli`

- [ ] `git status` — verify clean working tree
- [ ] `git push origin master` — deploy to GitHub Pages
- [ ] `git push shikunyi-group master` — deploy to GitLab
- [ ] If any new commits needed, use conventional commit format

### 4. Slide Deck
Activate: `slides`

- [ ] Read `PITCH_DECK.md` for the 9-slide structure
- [ ] Build `I4C26_PITCH_DECK.pptx` with proper layout
- [ ] Ensure transport/logistics angle is on every slide
- [ ] Keep under 3-min presentation time

### 5. Dashboard Data & Charts
Activate: `chart-visualization` + `data-analysis`

- [ ] Review `kilimolink/web/src/pages/CountyDashboard.tsx`
- [ ] Ensure charts render with demo/fallback data when API is offline
- [ ] Consider if any chart type should change for better readability on phone

### 6. End-to-End Test
Activate: `webapp-testing`

- [ ] Run Playwright tests on the live frontend: https://geraldkombo.github.io/KilimoLink/
- [ ] Test flow: Home → Marketplace → Product Detail → County Dashboard
- [ ] Test Demo Mode: tap "Demo Mode (offline)" in sign-in dialog
- [ ] Take screenshots at 390px width for documentation
- [ ] Take screenshots of offline/demo fallback pages

---

## Submission Checklist (I4C26)

- [ ] Frontend URL: https://geraldkombo.github.io/KilimoLink/ working
- [ ] Backend URL: https://kilimolink-1.onrender.com/api/v1/health returning 200
- [ ] Demo Mode works — tap "Demo Mode (offline)" in sign-in dialog
- [ ] All pages load on 360px-414px phone screen
- [ ] Pitch script under 3 minutes (read PITCH_SCRIPT.md aloud with timer)
- [ ] Deck slides match pitch (read PITCH_DECK.md)
- [ ] Deadline: June 22, 23:50 EAT (about 9.5 hours from now)

---

## Key Files

| File | Purpose |
|------|---------|
| `kilimolink/web/src/app/App.tsx` | Main app shell with all branding, routes, lazy loading |
| `kilimolink/web/index.html` | Meta tags, title, OG tags |
| `PITCH_SCRIPT.md` | 3-minute pitch script with transport angle |
| `PITCH_DECK.md` | 9-slide deck structure |
| `DEMO_CHOREOGRAPHY.md` | 30-second live demo steps |
| `I4C26_FINAL_READINESS.md` | Readiness checklist |
| `TECH_FRAGILITY.md` | Cold start, OTP, Leaflet tile risks |
| `BACKUP_PLAN.md` | Offline/video/screenshot fallback tiers |
| `render.yaml` | Render Blueprint with env vars |
| `.github/workflows/deploy.yml` | GitHub Pages auto-deploy on push to master |

## Auth Keys (for reference — do not expose)

- localStorage: `kilimolink_user_token`, `kilimolink_user_role`, `email`
- Demo mode sets: token = `demo-token-123`, email = `demo@farmers.co.ke`, role = `FARMER`
- Render env vars to verify: `NODE_ENV=production`, `DISABLE_REDIS=true`, `MOCK_PAYMENTS=true`
