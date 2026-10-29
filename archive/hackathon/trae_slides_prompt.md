# Trae AI — Build KilimoLink Direct Pitch Deck

**Paste this into Trae AI.** Create a 5-slide Google Slides deck (16:9). If Trae cannot access Google Slides, output standalone HTML/CSS.

---

## COLORS & FONTS

- **Primary green:** #2E7D32
- **Charcoal text:** #1B1B1B
- **Amber accent:** #F9A825
- **Alert red (middleman/rumor only):** #C62828
- **Background:** Off-white #FAFAFA or white
- **Headings:** Montserrat Bold 800
- **Body:** Inter Regular 400
- **Format:** 16:9 widescreen

---

## SLIDE 1 — TITLE

**Background:** green #2E7D32, white text, centered

- **Headline 48pt:** KilimoLink Direct
- **Subtitle 24pt:** Honest data for urban food resilience
- **URL line 14pt amber #F9A825:** live at kilimolink.onrender.com
- **Bottom 12pt white 70%:** I4C26 Ideation Sprint · Team 10 · Nairobi

---

## SLIDE 2 — PROBLEM

**Layout:** Two-column split (left text, right visual), white bg

**Left column:**
- **Headline 32pt charcoal:** 30% rots. Farmers paid 38% below reference.
- **Body 16pt #555:** Every rainy season, a third of Kenya's food spoils before it reaches a table. Not because it's bad — because farmers price off WhatsApp rumours while middlemen pocket the difference. On Nairobi roads that barely hold in the rains, every unnecessary truck-kilometre is wasted emissions and wasted food.
- **Source line 10pt #999:** Sources: KNBS & AFA price bulletins (2026)

**Right column — two horizontal bars titled "Sukuma Wiki price (KES)":**
- Red #C62828 bar at ~62% width, label "Middleman quote: 28 KES"
- Green #2E7D32 bar at 100% width, label "KNBS reference: 45 KES"
- Amber #F9A825 chip below: "38% below the reference price"

---

## SLIDE 3 — SOLUTION

**Layout:** Center headline, 3-node horizontal flow below, white bg

**Headline 32pt charcoal:** Farmer → KilimoLink → Kitchen. No middleman, no lie.

**Flow graphic (3 rounded boxes, green theme, connected by green arrows):**
- Box 1 "Farmer lists produce" (icon 👨‍🌾) → Box 2 "Matches the KNBS/AFA reference price — not WhatsApp" (icon 📊) → Box 3 "Buyer orders direct. No middleman." (icon 🏠)

**Sub-label 14pt #666:** Every order tracked: food miles avoided, waste diverted, farmer paid fairly.

---

## SLIDE 4 — DEMO

**Layout:** Full-bleed screenshot placeholder, minimal overlay, white bg

**Center:** Large placeholder box labeled "INSERT: price-truth-gap-screenshot.png" (~80% of slide), showing red bar "WhatsApp / middleman: 28 KES", green bar "KNBS Food Price Bulletin (2026-05): 45 KES", red chip "Farmer paid 17 KES below reference — 38%".

**Overlay top-left 24pt white with dark shadow:** Live. Running now.

**Footnote 14pt grey #666 at bottom:** Reference price: KNBS/AFA bulletins. Middleman rate: representative field quote, being validated with farmers.

**Bottom bar green #2E7D32, white text:** "Presenter demos the live system during this slide."

---

## SLIDE 5 — ASK

**Background:** charcoal #1B1B1B, white text, centered

**Headline 36pt white:** One city to pilot

**Bullets 18pt white 80% (small amber icons):**
- Nairobi County GIS data → map food access gaps
- KALRO partnership → crop yield forecasts
- Your belief → urban climate resilience starts with food

**Center:** QR-code placeholder box (120x120) labeled "QR → kilimolink.onrender.com"

**Bottom 14pt amber #F9A825:** kilimolink.onrender.com

---

## PRESENTER NOTES (Dorcas, solo, ~3 min)

**Slide 1 (:00-:25):** "Kenya loses 30% of its food in transit while Nairobi families pay double — produce trucked hundreds of kilometres on roads that barely hold in the rains. That's not bad economics. It's a climate crisis we can taste. This is exactly the city-scale action GCoM and UN-Habitat call for."

**Slide 2 (:25-:50):** "The people who pay the most and eat the worst live in our informal settlements — Kibera, Mathare. And farmers price their crops off WhatsApp rumours and middlemen who lie to them. Bad information spoils food before bad roads do. The middleman quotes 28 shillings; KNBS says 45. That 38% gap is the lie."

**Slide 3 (:50-1:20):** "The solution: a farmer lists produce, KilimoLink matches it to the KNBS and AFA government reference price — not a WhatsApp rumour — and a buyer orders direct. No middleman, no lie. Let me show you — it's live." *(On that last line, silently Ctrl+Tab to the browser, then keep talking into the demo.)*

**Slide 4 (1:20-1:50):** *(Live browser or backup video.)* "This is the Price Truth Gap. Red is the middleman's quote, green is the government reference. That 38% gap is the lie we delete — and we're honest that the middleman figure is a field quote we're validating, not a guess we're hiding."

**Slide 5 (1:50-3:00):** "On the live system right now, conservatively measured: real waste diverted, real farmers, one genuine completed order — a buyer, a farmer, a delivery. To scale we need three things: Nairobi County GIS data, a KALRO partnership, and one city to pilot. We're ready for Nairobi. KilimoLink Direct is live, running now, and it works. Honest data is Nairobi's climate infrastructure. Thank you."

---

## BACKUP VIDEO INSTRUCTIONS (OBS / Xbox Game Bar)

Record a 60-second backup using Windows+G (Xbox Game Bar) or OBS. Save as MP4.

**Setup (before recording):**
1. Wake the backend first: open kilimolink.onrender.com/api/v1/health — wait for 200 (cold start 20-30s).
2. Log in as the demo account so the green Demo banner shows.
3. Open two tabs: Tab 1 = /sell with "Sukuma Wiki" pre-selected; Tab 2 = /market.
4. Browser zoom 110%, full-screen, close bookmarks bar and dev console.

**Sequence (narrate as you go):**
1. (0-10s) Tab 1 /sell, Sukuma Wiki selected, price 45 KES. Point cursor at Price Truth Gap: red 28 vs green 45, then the "38% below reference" chip.
2. (10-20s) Click "Help me write this" → description fills. Click map near Kibera → marker; toggle privacy → 500m circle.
3. (20-30s) Click a photo preset chip → image fills. Click "List My Produce Now."
4. (30-40s) Land on /market; scroll once over the product grid.
5. (40-50s) Click "Add to Cart" on a card → Snackbar "Order placed!" appears.
6. (50-60s) Point at cart badge incrementing in nav. Hold on the green Demo banner for the last beat.

**Save as:** kilimolink-demo-backup.mp4 — Desktop + USB + phone (Google Drive offline copy).

**Phone backup:** Upload MP4 to phone, test playback in airplane mode offline. If laptop fails, play phone video while you narrate live through the room mic (mute the phone — no phone-to-mic, feedback will ruin audio).
