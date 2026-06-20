# KilimoLink — Live Demo Choreography (30 seconds)

**Operator:** Shadrack | **Presenter:** Gerald | **Support:** James (slide advancer)

---

## Pre-Demo Setup (10 min before pitch)

| Step | Who | Action |
|------|-----|--------|
| 1 | Peter | Hit `kilimolink.onrender.com/api/v1/health` on phone — confirm 200 |
| 2 | Gisore | Open Chrome, load `geraldkombo.github.io/KilimoLink` — fully loaded |
| 3 | Shadrack | Log in with demo account (email: `demo@kilimolink.com`, OTP will be sent) |
| 4 | James | Open slide deck on second monitor, advance to "Live Demo" slide |
| 5 | Everyone | Silence phones. Close all other tabs. |

---

## Demo Sequence

Timing starts when Gerald says: **"Let me show you."**

| Time | Presenter (Gerald) | Operator (Shadrack) | Screen |
|------|-------------------|---------------------|--------|
| :00 | "Let me show you." | — | Architecture slide → live browser |
| :02 | "I'm listing Sukuma Wiki..." | Click **"Start Selling"** button on homepage | Landing page with CTA |
| :05 | "...a Nairobi staple." | Navigate to **/sell** page via menu | Sell page loads with form |
| :08 | "App auto-fills the market price..." | Click **"Sukuma Wiki (Kale)"** from dropdown | Price auto-fills **45 KES**, oracle badge appears |
| :12 | "One click generates a description." | Click **"Help me write this"** button | AI description animates in |
| :15 | "I tap the map to show where it's grown..." | Click map on **Kibera** area | Marker appears on map at Kibera |
| :19 | "...Kibera." | Click **Privacy Mode** toggle | 500m radius circle appears around marker |
| :22 | "I set privacy mode so the farmer's location is protected..." | Click photo sample **"Kale/Sukuma"** chip | Image URL fills in |
| :25 | "And I list it." | Click **"List My Produce Now"** button | Loading spinner → redirect to /market |
| :28 | "That took fifteen seconds." | — | New product visible in marketplace grid |
| :30 | "That's climate adaptation, live." | — | James advances slide to "Impact" |

---

## Backup Cues

- **If dropdown doesn't load:** Type "Sukuma Wiki" in title field manually — price still auto-fills via oracle
- **If map doesn't render:** Skip map step. Say "our privacy-preserving location system works even offline"
- **If submission fails:** Say "Let me show you one already listed" — click on an existing product in marketplace
- **If the page is cached/old:** Hit F5 (hard refresh Ctrl+Shift+R) — operator does this while presenter pauses

---

## What NOT to do during demo

- ❌ Don't hover over UI elements trying to find the right button
- ❌ Don't read text from the screen
- ❌ Don't apologize if something is slow — fill the gap with narrative
- ❌ Don't tab between windows — use Alt+Tab if needed, but ideally single monitor
- ❌ Don't explain the technology — that's what the architecture slide is for

---

## Post-Demo

1. Gerald closes: "That took fifteen seconds. That's climate adaptation, live."
2. James advances to impact slide
3. Gerald transitions to impact numbers
