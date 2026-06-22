# KilimoLink Direct — I4C26 Final Readiness

## Winning frame

KilimoLink is not a generic farm-to-table marketplace.

**KilimoLink is Nairobi's AI food system climate intelligence platform.** The marketplace is the data engine. The county dashboard is the product.

- **One city:** Nairobi.
- **One user:** Nairobi City County food system resilience officer.
- **One problem:** no real-time visibility into food flows, price shocks, waste, emissions, and climate disruption.
- **One solution:** a working marketplace that generates transaction data for a county climate dashboard.

---

## Readiness verdict by judging criterion

### 1. Thematic relevance — ✅ ready

KilimoLink now clearly connects food access, transport emissions, food waste methane, climate disruption, and informal settlement vulnerability in one Nairobi-specific system.

**Stage sentence:** KilimoLink tells Nairobi where food is, where it is going, and when climate will break the chain.

### 2. Innovation — ✅ ready

The innovation is marketplace-as-data-engine: farmer/buyer activity creates food-flow intelligence for city government.

**Stage sentence:** Competitors move food or show prices; KilimoLink helps the city understand, predict, and climate-proof its food system.

### 3. Impact — ⚠️ ready after citation verification

Impact logic is strong, but every numeric claim must be citation-backed before the final submission.

**Stage sentence:** Every order estimates reduced food miles, avoided waste, price transparency, and neighborhood-level risk signals for Nairobi County.

### 4. Presentation — ✅ ready

The story now follows one character, one problem, one solution, and a 30-second demo path.

**Stage sentence:** KilimoLink Direct helps Nairobi see where food is, where it is going, and where climate risk will hit next — before families feel the shock.

---

## June 22 must-do checklist

- [ ] Merge the pitch polish MR.
- [ ] Run frontend build: `cd kilimolink/web && npm install && npm run build`.
- [ ] Run backend build/tests: `cd kilimolink/backend && npm install && npm run build && npm test`.
- [ ] Verify Render health: `https://kilimolink.onrender.com/api/v1/health` using `kilimolink/PRODUCTION_VERIFY.md`.
- [ ] Verify GitHub Pages latest UI and `/county-dashboard` load after hard refresh.
- [ ] Open and preload `/market`, `/sell`, one `/product/:id`, and `/county-dashboard`.
- [ ] Log in 30 minutes before pitch and keep the browser open.
- [ ] Create one demo product before rehearsal.
- [ ] Record 60-second backup demo video.
- [ ] Export slides to PDF and copy to USB.
- [ ] Fill `kilimolink/EVIDENCE_LOG.md` with real source URLs and remove/soften any unsupported number.
- [ ] Run `bash kilimolink/scripts/final-validate.sh` locally. GitLab CI was intentionally not required because this project currently has no usable GitLab runner.
- [ ] Rehearse to 2:50 so interruptions do not exceed 3:00.

---

## Claims that must not be spoken unless verified

Do not say these numbers on stage until the team has a real URL in the evidence doc:

- Nairobi imports or sources a specific percentage of food from outside the county.
- Kenya loses a specific percentage of food between farm and table.
- Kibera/Mathare/Mukuru residents pay a specific percentage more for food.
- A specific number of smallholder farmers supply Nairobi.
- A specific CO₂e saved per transaction.
- A specific methane impact from Dandora food waste.

Use safer phrasing if not verified:

- "Nairobi depends heavily on surrounding counties for food."
- "A significant share of fresh produce is lost before reaching consumers."
- "Food waste creates methane, and long routes increase transport emissions."
- "Informal settlements feel price shocks first."
- "The dashboard estimates impact using transparent formulas that the city can audit."

---

## Final demo sequence

1. Open marketplace: "This looks like a marketplace, but it is actually Nairobi's food data engine."
2. Open product: "Each listing captures product, price, origin, destination, and farmer signal."
3. Open sell page: "A farmer can create a new data point in seconds."
4. Select Sukuma Wiki and generate AI description.
5. Show map + privacy radius.
6. Open `/county-dashboard`: "This is what the county dashboard shows."
7. Point to AI alert: "Climate risk becomes an early warning, not a surprise."

---

## Backup plan

- **If backend is slow:** use preloaded product and dashboard tabs.
- **If product creation fails:** show existing listing.
- **If map fails:** show dashboard and say GPS/radius is captured even if venue blocks map tiles.
- **If internet fails:** play screen recording and narrate live.
- **If all tech fails:** use PDF screenshots and keep the climate intelligence story.

---

## Project name

Keep **KilimoLink Direct**.

Use this subtitle everywhere:

> Nairobi's AI Food System Climate Intelligence Platform
