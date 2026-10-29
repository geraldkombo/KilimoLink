# GITLAB DUO AI — COMPLETE PROJECT CONTEXT

## CRITICAL: Read ALL files in this repo before answering.

This repo contains KilimoLink Direct — a React/Vite SPA + NestJS backend for the I4C26/AI x CCA Hackathon 2026.

---

## THE SITUATION

- **Hackathon:** AI x City Climate Action Hackathon 2026, ideation sprint at Innovate4Cities
- **Team originally:** Team 6 (Transport topic) — Gerald Kombo, Gisore Nyabuti, James Murithi, Peter Maina, Shadrack Otieno
- **User's actual team:** Team 10 (they took Dorcas's spot) — Damien, Trevor, Yvonne, Regan, user
- **Team 10 topic:** Mis/Dis-Information (according to orientation)
- **BUT user is told their team must stay under Transport theme**
- **Pitch:** June 23, 17:00-19:00 EAT, Conference Room 2, strict 3 min
- **Files due:** June 22, 23:50 EAT (already submitted? user needs confirmation)
- **Live URL:** https://geraldkombo.github.io/KilimoLink/
- **Backend:** https://kilimolink.onrender.com/api/v1 (Render free tier, sleeps)

---

## THE PRODUCT

**KilimoLink Direct** — Nairobi's AI food system climate intelligence platform.

The marketplace is the data engine. Every farmer listing and buyer order generates real-time data on food origin, price, route, and quantity. The county dashboard is the real product — giving Nairobi City County's food resilience officer visibility into food flows, price shocks, supply disruption risks, and climate impact.

### Key features:
- Marketplace (farmers list produce, buyers order directly)
- County Dashboard prototype (/county-dashboard) — food-flow map, price heatmap, AI disruption alerts, carbon/waste impact
- AI Price Suggestion (oracle-based pricing from government market data)
- Privacy Mode (protects farmer exact location with 500m radius)
- Price Truth Gap (shows broker markup vs farmer price)

---

## THE PROBLEM

1. **Topic mismatch:** The product is food/climate intelligence, but the official team topic is Transport. The pitch needs a transport angle — food transport emissions, supply chain route disruption from climate events, urban food logistics optimization.

2. **Render backend is down** (free tier sleeps on idle). The app must work fully offline from hardcoded demo data.

3. **Phone-only presentation** — user has no laptop, presenting from a mobile browser.

4. **Deadline passed?** Files were due June 22 23:50 EAT. Need to confirm status.

---

## KEY FILES IN THIS REPO

### Deliverables (under kilimolink/):
- PITCH_SCRIPT.md — 3-min pitch script
- PITCH_DECK.md — slide deck spec
- DEMO_CHOREOGRAPHY.md — 30-sec live demo steps
- BACKUP_PLAN.md — emergency fallbacks
- CRITERIA_MATRIX.md — judging criteria mapping
- HACKATHON_PROMPT.md — master AI prompt
- I4C26_FINAL_READINESS.md — readiness checklist
- EVIDENCE_LOG.md — evidence for claims
- PRODUCTION_VERIFY.md — production verification
- README.md — project README
- EMERGENCY_PHONE_PRESENTATION.md — phone presentation guide

### Web app (kilimolink/web/src/):
- app/App.tsx — main app shell + HomePage
- services/api.ts — axios config
- services/auth.ts — localStorage auth
  - Keys: kilimolink_user_token, kilimolink_user_role, email
- pages/CountyDashboard.tsx — county dashboard
- pages/Marketplace.tsx — marketplace listing
- pages/SellProduct.tsx — sell form
- pages/ProductDetail.tsx — product detail
- pages/MyProducts.tsx — farmer's products
- pages/OrdersPage.tsx — orders
- .env — dev env (localhost:3000)
- .env.production — prod env (render.com)

### Backend (kilimolink/backend/):
- Full NestJS API with auth, products, orders, AI, oracle, users, health modules
- Prisma schema + migrations
- 48 passing tests

---

## WHAT NEEDS TO BE DONE

### 1. Transport Alignment
Update pitch to emphasize food transport as climate transport solution:
- Food miles = transport emissions
- Climate-disrupted supply routes (flooded roads)
- Direct farm-to-consumer = transport optimization
- The marketplace reduces urban freight emissions

### 2. Make App Work Offline (Phone Demo)
- Demo Mode bypass (already partially done — "Demo Mode (offline)" button on sign-in)
- Impact section: hardcoded demo numbers when API fails
- Marketplace: demo products when API fails
- Sell form: localStorage fallback when API fails
- County Dashboard: already hardcoded data, no API needed
- Mobile-responsive for 360px width

### 3. Emergency Pitch Fixes
- Confirm if files were submitted by June 22 deadline
- Update pitch script with transport angle
- Ensure 3-min script is tight

---

## BUILD & DEPLOY
```bash
cd kilimolink/web
npm install
npm run build    # tsc -b && vite build
# Push to origin master — GitHub Actions auto-deploys to Pages
```

## TESTS
```bash
cd kilimolink/backend && npm test   # 48 tests
cd kilimolink/web && npm test        # 8 tests
```

## GIT
- origin: https://github.com/geraldkombo/KilimoLink.git (GitHub Pages)
- shikunyi-group: https://gitlab.com/shikunyi-group/shikunyi-project.git
- 254reportnewsdesk: https://gitlab.com/254reportnewsdesk/kilimolink.git

## COMMANDS FOR AI
Read all files in this repo. Understand the full project. Fix everything for a winning phone-only presentation. Prioritize: transport alignment in pitch, offline demo mode, mobile UX, deadline confirmation.
