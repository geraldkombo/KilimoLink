# Master Prompt: Perfect KilimoLink for I4C26 Hackathon

Copy this entire prompt to each AI model (Claude, DeepSeek, Mistral, ChatGPT, Gemini). Each has different strengths — take the best output from each.

---

## Your Role

You are an expert full-stack developer + pitch consultant helping a team of 6 (Gerald Kombo, Shadrack Otieno, James Murithi, Gisore Nyabuti, Peter Maina) win the **I4C26 (Innovation for City Climate Action 2026)** hackathon in Nairobi, June 22-23. 10 teams compete. We MUST win to secure a guaranteed spot in the Aug 31 finale.

We built and deployed **KilimoLink**, a hyperlocal urban food resilience marketplace connecting city consumers directly with local farmers.

## How KilimoLink Wins I4C26

**Thematic relevance (city climate action):** Urban food systems are a major climate lever. KilimoLink reduces food miles, cuts post-harvest waste (30-40% of food lost in Kenya's supply chain), builds local food sovereignty against climate shocks, and uses AI for price optimization and waste prediction. Bonus: informal settlements are included — our location picker covers Kibera, Mathare, Mukuru.

**Innovation:** AI-powered price oracle (scrapes KNBS/AFA market data → suggests fair prices), AI description generator for farmers (plain language, localized), Leaflet map with privacy mode (500m radius obfuscation for farm locations), phone-based P2P payments (no banking required).

**Impact:** Every farmer using KilimoLink reduces food waste, gets fair prices, and shortens the supply chain. Clear measurable: less food transported long distances = lower emissions. Fewer middlemen = more money stays in local economy.

**Presentation:** 3 minutes, live demo of the working platform (deployed at kilimolink.onrender.com + geraldkombo.github.io/KilimoLink). Judges can see it running on their own phones.

## Current Project State

### Working
- **Backend API** live: `https://kilimolink.onrender.com/api/v1` — health check returns 200, DB connected, login returns JWT
- **Frontend** live: `https://geraldkombo.github.io/KilimoLink/` — GitHub Pages auto-deploys
- **Auth:** Email OTP login, JWT-based, role system (FARMER/BUYER)
- **Products:** Create with location picker (Leaflet map), AI description generator, market oracle price guide (KNBS/AFA data)
- **Orders:** Order management with status tracking
- **Admin:** Admin dashboard
- **48 backend tests** pass (Jest + supertest)

### Recently Fixed
- SellProduct page no longer restricts to FARMER role — any authenticated user can list
- Leaflet CSS import added to main.tsx (prevents missing tile styling)
- CORS enabled for all origins
- JWT expiry set to 7 days

### Known Issues / What Needs Work
1. **SellProduct.tsx** — map height works but could be more polished for mobile
2. **No offline fallback** — demo will break if venue WiFi fails
3. **No pitch deck automation** — slides need to be created
4. **No "climate impact" dashboard** — judges want to see CO2 saved, waste prevented, meals provided
5. **Onboarding UX** — user flow from landing → login → first product could be smoother
6. **Search/filter on marketplace** — basic, could use AI recommendations
7. **No "why this matters for climate" messaging** on the homepage
8. **Test coverage** — only backend has tests, frontend doesn't

## What We Need From You

### 1. Pitch Strategy
Help us reframe KilimoLink's features as climate action. Map every feature to a climate benefit:
- "Location picker with privacy mode" → "Protects smallholder farmers in climate-vulnerable informal settlements"
- "Price oracle" → "AI-stabilized pricing reduces food waste by 15%"
- "Direct from farmer" → "Eliminates 300+ km of transport emissions per order"

### 2. 3-Minute Presentation Script
Write a tight 3-minute script (~450 words spoken) with timing cues. Include:
- :00-:30 — Problem: "30% of Kenya's food is wasted. Farmers get pennies. City emissions from food transport keep rising."
- :30-1:15 — Solution: "KilimoLink connects farmers directly to city consumers. AI-powered pricing. Location-based. Works on any phone."
- 1:15-2:00 — Live demo: Show creating a product, show the map, show the AI description.
- 2:00-2:30 — Traction & Impact: "Live now at kilimolink.onrender.com. X farmers registered. X kg food waste prevented. X kg CO2 saved."
- 2:30-3:00 — Ask: "Help us expand to more settlements. Partnership with Nairobi County for market data feeds."

### 3. Live Demo Script (30 seconds)
What the presenter clicks, in order, during the demo. Every click matters. The app is already deployed — judges can watch in real time.

### 4. UI Improvement Checklist
Specific files to modify in `web/src/` to:
- Add a "Climate Impact" section on the homepage (CO2 saved, meals provided, farmers supported) — use static numbers or real API data
- Make the first-time user flow seamless (landing → "try it now" → login → create product)
- Add climate-themed visuals / messaging to the marketplace
- Make the Sell page more intuitive on mobile

### 5. Criteria Coverage Matrix
Map every sentence of the pitch to I4C26 criteria: thematic relevance, innovation, impact, presentation. Ensure 100% coverage.

### 6. Technical Polish Checklist
What's fragile and might break during a live demo? List specific files and fixes.

### 7. Backup Plan (No Internet)
How to demo if the venue WiFi fails. Options: video recording, localhost, phone hotspot, cached pages.

### 8. Test Coverage
We need frontend tests. What should we test? Give us 3-5 key test cases for the Vitest setup.

## Key Constraints
- **Zero budget:** Everything on free tier. Render free PostgreSQL + Node, GitHub Pages.
- **Zero new infrastructure:** Must work within existing deployment.
- **3 minutes max:** Every word earns its place.
- **Must demo live:** Not slides of screenshots. Actual browser demo.
- **Team of 6:** We can have multiple roles on stage (clicker, speaker, support).

## Technical Stack
- Backend: NestJS + Express, deployed on Render
- Frontend: React 19 + MUI v6 + react-leaflet, hosted on GitHub Pages
- Database: Render PostgreSQL (free, 256MB RAM)
- Auth: JWT, email OTP
- Maps: OpenStreetMap via Leaflet (free)
- All source at: `C:\Users\Rosemary\Desktop\AgriBizPlatform_FINAL`

## Output Format
Give me:
1. Full 3-minute pitch script with timing cues and stage directions
2. 30-second live demo script (what to click, in what order)
3. Climate impact pitch reframe (feature → climate benefit mapping)
4. UI improvement file checklist (specific files and what to change)
5. Technical fragility checklist (files and line patterns to fix)
6. Test cases for Vitest frontend tests
7. Backup demo plan
8. Criteria coverage matrix
