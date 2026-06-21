# ─── MASTER PROMPT: PERFECT KILIMOLINK TO WIN I4C26 ───

Copy this ENTIRE thing to each AI (Claude, DeepSeek, Mistral, ChatGPT, Gemini). Do not summarize. Do not skip sections. Every word earns its place.

═══════════════════════════════════════════════════════════════
## CONTEXT: THE HACKATHON
═══════════════════════════════════════════════════════════════

**Event:** I4C26 — Innovation for City Climate Action 2026
**Date:** June 22-23, Nairobi (live pitch June 23)
**Hosts:** GCoM + UN-Habitat + UTM + CHIA
**Teams:** 10 competing. One winner guaranteed spot in Aug 31 finale.
**Pitch:** 3 minutes. Live demo required. No slides of screenshots.

**Judging criteria (equal weight each):**
1. Thematic relevance (city climate action, AI-driven, informal settlements = bonus)
2. Innovation (differentiated, unique, team lived experience = bonus)
3. Impact (clear climate benefit, measurable)
4. Presentation (3 min, clear, compelling, visual)

**Bonus topics (extra points):** urban transportation, informal settlements, mis/disinformation

**Deadline:** Submit progress update by Sun June 21 12pm EAT

═══════════════════════════════════════════════════════════════
## OUR PROJECT: KILIMOLINK
═══════════════════════════════════════════════════════════════

**What it is:** A hyperlocal urban food resilience marketplace connecting city consumers directly with local farmers across East Africa. Live and deployed.

**Stack:** NestJS (backend) + React/Vite/MUI v6 (frontend) + PostgreSQL (Render) + Redis (graceful degradation) + JWT auth + react-leaflet maps

**Deployed URLs (live right now):**
- Backend API: https://kilimolink.onrender.com/api/v1
- Frontend: https://geraldkombo.github.io/KilimoLink/
- API Docs (Swagger): https://kilimolink.onrender.com/docs

**Team:** 6 members — Gerald Kombo, Shadrack Otieno, James Murithi, Gisore Nyabuti, Peter Maina

═══════════════════════════════════════════════════════════════
## EXISTING FEATURES (what works right now)
═══════════════════════════════════════════════════════════════

1. **Auth:** Email OTP login, JWT tokens (7d expiry), role system (BUYER/FARMER)
2. **Product creation:** Form with category select, price auto-filled from oracle, AI description generator, location picker (Leaflet map with click-to-set, GPS, neighborhood search, privacy mode with 500m radius obfuscation), photo URL upload with sample images
3. **Marketplace:** Grid of products with images, prices, farmer info, location
4. **Product detail:** Full product view with contact info, location shown on map
5. **Orders:** Order creation and status tracking
6. **My Products:** Farmer's own product listing management
7. **Admin dashboard:** Admin-only panel
8. **Price oracle:** GET /api/v1/oracle/prices with category-based pricing from KNBS/AFA market data
9. **Disruption alerts:** GET /api/v1/market/disruption-alerts for weather/transport notices
10. **Health check:** GET /api/v1/health returns { status: "ok", database: "up" }
11. **48 backend tests passing** (Jest + supertest)
12. **GitHub Pages auto-deploy** on push to master

═══════════════════════════════════════════════════════════════
## RECENT FIXES (already applied)
═══════════════════════════════════════════════════════════════

- Farmer-only restriction removed from SellProduct — any authenticated user can list
- Leaflet CSS imported in main.tsx — tiles render correctly
- CORS enabled for all origins — GitHub Pages can call API
- JWT expiry set to 7 days
- Backend cold-start handled via boot function + health server wrapper
- TypeScript output path fixed (rootDir: "src")
- Frontend API URL fixed to kilimolink.onrender.com

═══════════════════════════════════════════════════════════════
## THE ASKS — 8 DELIVERABLES
═══════════════════════════════════════════════════════════════

### DELIVERABLE 1: REFRAME KILIMOLINK FOR THE CLIMATE NARRATIVE

I need you to take every feature of KilimoLink and map it to a climate action benefit. This is NOT optional — the judges are scoring thematic relevance. Give me a table:

| Feature | Current framing | Climate reframe | Which criterion it hits |
|---------|----------------|-----------------|------------------------|
| Direct farmer-to-consumer marketplace | "Cut out middlemen" | "Eliminates 300+ km of冷链 transport emissions per transaction. Food travels from farm gate to city kitchen in <2 hours instead of 3+ days through wholesale chains." | Thematic relevance, Impact |
| AI price oracle | "Fair prices for farmers" | "AI reduces food waste by pricing produce at market-clearing rates. 30-40% of food is wasted in Kenya because farmers don't know the right price. Our ML model predicts optimal price using KNBS/AFA historical data + real-time supply." | Innovation, Impact |
| Location picker + privacy mode | "Find nearby produce" | "Enables hyperlocal food loops. The average meal in Nairobi travels 150km. KilimoLink targets <5km. Privacy mode protects smallholder farmers in informal settlements from price exploitation." | Thematic relevance, Bonus: informal settlements |
| AI description generator | "Help farmers write listings" | "AI lowers barrier for farmers with low literacy. Climate adaptation tech must serve EVERYONE, not just the educated." | Innovation, Bonus: lived experience |
| Phone-based P2P payments | "M-Pesa integration" | "No bank account needed. 80% of informal settlement residents have a phone but no bank. Financial inclusion is climate resilience." | Bonus: informal settlements |
| Disruption alerts | "Weather/transport alerts" | "Real-time climate adaptation. When heavy rain hits, our AI alerts farmers and reroutes logistics. Climate early warning = less food waste." | Thematic relevance, Innovation |
| Market place grid + map | "Browse and buy" | "Visualizes Nairobi's food desert problem. Shows which neighborhoods lack fresh food access. Data drives policy." | Impact |

### DELIVERABLE 2: THE PERFECT 3-MINUTE PITCH SCRIPT

Write a verbatim script with:
- **Timing cues** (:00, :15, :30, etc.)
- **Stage directions** (what the presenter does, what the clicker does)
- **Slide cues** (what's on screen behind them)
- **Tone:** Urgent but hopeful. Tech but human. Kenya-specific but globally relevant.
- **~450 words** at moderate speaking pace

**Required beats:**
- :00-:25 — The hook. Start with a visceral image: "Every rainy season, 30% of Kenya's food rots while city families pay double for imported produce. That's not just an economic problem. It's a climate problem."
- :25-:50 — The problem deepens: food miles, waste, farmer poverty, climate vulnerability. Connect to Nairobi specifically.
- :50-1:30 — Enter KilimoLink. "We built the operating system for urban food resilience." Live demo starts here.
- 1:30-2:00 — Live demo. Show the actual app on screen. Create a product, show the map, trigger AI description. The clicker does this while presenter talks.
- 2:00-2:30 — Impact & Traction. Numbers: "We're live. X farmers onboarding. X kg waste prevented in pilot. Our AI oracle reduces overpricing by 40%."
- 2:30-3:00 — The ask + close. "We need: 1) Nairobi County GIS data to expand, 2) partnership with KALRO for crop yield forecasts, 3) you to believe that the solution to urban climate resilience already exists — it's on your screen right now."

### DELIVERABLE 3: LIVE DEMO CHOREOGRAPHY

A second-by-second script of exactly what the operator/clicker does during the demo. Assume:
- Presenter has a laptop connected to projector
- Clicker has a separate device or coordinates with presenter
- App is already loaded in the browser at geraldkombo.github.io/KilimoLink
- Backend is already woken up (we hit health endpoint 10 min before)

**Must include:**
1. Opening the app (what page to land on)
2. Navigating to sell page
3. Selecting a product from the dropdown (use "Sukuma Wiki (Kale)" as demo — recognizable to Kenyan judges)
4. Showing price auto-filled from oracle ($45 KES — show it's market-verified)
5. Clicking "Help me write this" to generate AI description
6. Clicking on the map to set a location (click on Kibera/Kilimani area)
7. Showing privacy mode toggle
8. Submitting the listing
9. Showing it appear on the marketplace

**Pacing:** Each step must take < 3 seconds. Total demo: 30 seconds. The rest of the 3 min is narrative.

### DELIVERABLE 4: UI IMPROVEMENT CHECKLIST

Give me exact file paths and line patterns in `C:\Users\Rosemary\Desktop\AgriBizPlatform_FINAL\web\src\` to modify for maximum hackathon impact:

**4a. Climate impact dashboard** — Add a stat bar on the homepage showing:
- "X kg CO₂ saved" (calculate: each order avoids avg 15km food transport = ~3kg CO2)
- "X meals facilitated" (each kg of produce = ~2 meals)
- "X farmers earning fair wages" (unique farmers with active listings)
These can be static demo numbers or fetch from a /api/v1/impact endpoint.

**4b. Homepage reframe** — The current homepage is generic. Rewrite the hero section to lead with climate action, not just "fresh food."

**4c. Mobile responsiveness** — The sell page map works but needs explicit testing on 375px viewport. Fix any overflow.

**4d. Loading states** — Add skeleton loaders for marketplace grid and product detail while data fetches.

**4e. Offline detection** — Show a banner "You're offline — some features may not work" using navigator.onLine.

### DELIVERABLE 5: TECHNICAL FRAGILITY CHECKLIST

Go through every file in the codebase and identify what WILL break during a live demo. Be paranoid. Assume the worst.

**Must check:**
- What if the PostgreSQL connection drops mid-demo? (graceful error handling?)
- What if Redis is unreachable? (we use DISABLE_REDIS=true — does the fallback actually work?)
- What if the user's JWT expires? (7d is safe but check token refresh logic)
- What if GitHub Pages serves a cached old version? (cache-busting?)
- What if the Leaflet tile server (OSM) is blocked at the venue? (tile fallback?)
- What if the browser is old/IE? (not needed, but Chrome/firefox)
- What if the demo laptop has no internet? (offline plan)
- What if the screen resolution is 720p projector? (all pages responsive?)
- What if we hit Render's rate limiting? (we have 10 min between wake-up and demo)
- What if the AI description generator's API call fails? (it uses setTimeout mock — confirm it's not hitting a real API that could 500)

For each risk, give: file path, the line that will break, what error it throws, and the fix.

### DELIVERABLE 6: FRONTEND TEST CASES

We have 48 backend tests. We need frontend tests. Write 5 test files using Vitest + jsdom:

1. **Marketplace rendering** — Does the product grid render? Test with mock data.
2. **SellProduct form validation** — Does it reject empty form? Does it submit with valid data?
3. **Auth flow** — Can user log in? Is JWT stored in localStorage?
4. **Map component** — Does LocationPicker render markers on click?
5. **AI description generator** — Does generateAIDescription return a non-empty string for each category?

For each: import path, mock setup, test assertions, and expected pass/fail conditions.

### DELIVERABLE 7: BACKUP DEMO PLAN (NO INTERNET)

Assume the venue WiFi is completely dead. Your phone hotspot is also not working (interference from 10 teams all tethering). Walk me through:

1. **Best option:** Localhost demo. The app runs on localhost:5173 with `npm run dev`. Pre-cache all dependencies. Pre-warm the backend before leaving home so Render doesn't cold-start. Show the app running on localhost with the real backend API.

2. **Second option:** Screen recording. Record a 60-second demo video on your laptop. Play it fullscreen during the pitch. Presenter narrates over it.

3. **Third option:** Screenshots in slides. Have 5 key screenshots embedded in the slide deck as last resort.

4. **Preparation checklist for June 21 evening:**
   - [ ] Run `npm run dev` locally — confirm it works offline (after initial build)
   - [ ] Record 60-sec Loom/OBS screen recording of full demo flow
   - [ ] Export slides as PDF to USB stick
   - [ ] Upload everything to Google Drive
   - [ ] Save all passwords/tokens in a text file on desktop
   - [ ] Confirm phone can hotspot (designate team member)
   - [ ] Hit health endpoint every 5 min during the 2 hours before pitch

### DELIVERABLE 8: CRITERIA COVERAGE MATRIX

Build a table mapping every sentence of the pitch to the judging criteria:

| Pitch sentence/talking point | Thematic relevance | Innovation | Impact | Presentation | Bonus: urban transport | Bonus: informal settlements | Bonus: mis/disinfo |
|---|---|---|---|---|---|---|---|
| "30% of Kenya's food rots" | ✓ | | ✓ | | ✓ | | |
| "300km food miles" | ✓ | | | | ✓ | | |
| "AI predicts optimal price" | | ✓ | ✓ | | | | |
| "Works in Kibera" | | | | | | ✓ | |
| [every single beat...] | | | | | | | |

Every criterion must be hit at least TWICE. The mis/disinformation bonus is the hardest — think about how food market data integrity relates (or skip if forced).

═══════════════════════════════════════════════════════════════
## TECHNICAL DETAILS FOR CODE GENERATION
═══════════════════════════════════════════════════════════════

**Source root:** C:\Users\Rosemary\Desktop\AgriBizPlatform_FINAL

**Key backend files:**
- `backend/src/main.ts` — NestJS bootstrap, CORS, Swagger, ValidationPipe
- `backend/src/market/market.controller.ts` — Product CRUD endpoints
- `backend/src/oracle/` — Price oracle service
- `backend/src/orders/` — Order management
- `backend/src/auth/` — JWT auth module
- `backend/src/ai/` — AI price suggestion service
- `backend/src/common/` — Shared guards, decorators
- `backend/src/health/` — Health check controller
- `backend/prisma/schema.prisma` — Database schema

**Key frontend files:**
- `web/src/app/App.tsx` — Router, app shell, homepage, auth dialogs
- `web/src/pages/SellProduct.tsx` — Product creation form with map
- `web/src/pages/Marketplace.tsx` — Product grid
- `web/src/pages/ProductDetail.tsx` — Single product view
- `web/src/pages/MyProducts.tsx` — Farmer's products
- `web/src/pages/OrdersPage.tsx` — Order management
- `web/src/services/api.ts` — Axios instance with base URL
- `web/src/services/auth.ts` — Auth service (applyToken, loadRole, etc.)
- `web/src/app/ProductContext.tsx` — Global product state
- `web/src/components/BackgroundArt.tsx` — Visual component
- `web/src/main.tsx` — Entry point

**Deployment:**
- GitHub Pages: Auto-deploys via `.github/workflows/deploy.yml` on push to master
- Render: Manual deploy via API (API key: rnd_ywosgG9rZalm0EOiGmu0XY002E8C)
- Vite base: `/KilimoLink/`
- Backend port: process.env.PORT || 3000
- Frontend env: `VITE_API_BASE_URL=https://kilimolink.onrender.com/api/v1`

**Database:** Render PostgreSQL free tier (256MB RAM, 1GB storage)
- DATABASE_URL (internal connection string set on Render)
- Redis: DISABLE_REDIS=true in production (graceful degradation)

**Style conventions:**
- MUI v6 sx prop for styling
- NestJS decorators for validation
- No semicolons in TypeScript (actually check — the codebase may use semicolons)
- Prices in KES (Kenyan Shillings)
- Locations in lat/lng coordinates

═══════════════════════════════════════════════════════════════
## OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Return your answer as 8 clearly labeled sections matching the deliverables above. For code changes, give me EXACT file paths and the EXACT code to replace. Do not say "add this to the file" — show me the before and after.

Use this template for each code change:

```
### FILE: web/src/pages/Example.tsx
### CHANGE: Add climate impact stat bar
### BEFORE (lines 45-50):
[existing code]
### AFTER:
[new code]
```

I will review the output from all 5 AI models and take the best from each. The winning output determines which AI I trust for final implementation.

═══════════════════════════════════════════════════════════════
## FINAL REMINDERS
═══════════════════════════════════════════════════════════════

- This is a COMPETITION. Differentiated wins. If your advice sounds like generic hackathon advice, it's worthless.
- We have 6 people. We can split tasks. Give us things to parallelize.
- The judges are from GCoM, UN-Habitat, UTM, CHIA — they care about actual climate impact, not tech buzzwords.
- 3 minutes is NOTHING. Cut every fluff word. "Utilize" → "Use." "Leverage" → never say this.
- The demo MUST work live. Prioritize stability over new features.
- I have ONE chance to prompt you. Make it count.
