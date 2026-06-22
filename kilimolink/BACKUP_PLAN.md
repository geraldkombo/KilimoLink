# KilimoLink Direct — Backup Demo Plan (No Internet)

## Tier 1: Localhost (Best Case)

**Prerequisite (prep June 21 evening):**
```bash
cd web
npm install          # all deps cached
npm run build        # prod build in dist/
```

**At venue if WiFi fails:**
```bash
cd web
npm run dev          # starts on localhost:5173
```

Open `http://localhost:5173` in browser. Backend still needs internet (Render API). If no internet at all → Tier 2.

**Keep backend alive for localhost:**
```bash
# Run this in a separate terminal window — hits backend every 4 min
while ($true) { curl -s https://kilimolink.onrender.com/api/v1/health | Out-Null; Start-Sleep -Seconds 240 }
```

---

## Tier 2: Pre-recorded Video

**Tool:** OBS Studio (free) or Loom (free, no install needed)

**Record this sequence (60 seconds max):**
```
:00-:05   Open browser → navigate to geraldkombo.github.io/KilimoLink
:05-:15   Log in with demo account
:15-:30   Navigate to /sell, select "Sukuma Wiki (Kale)", price auto-fills
:30-:38   Click "Help me write this" → AI description generates
:38-:48   Click map on Kibera, toggle privacy mode
:48-:55   Submit listing → redirect to marketplace → new product visible
:55-:60   Zoom in on product card, show the map marker
```

**Export settings:** MP4, 1080p, H.264, ~50MB. Save to USB + Google Drive.

---

## Tier 3: Screenshots in Slides

Take these 5 screenshots and embed in slide deck:

1. **Homepage** — Hero section with impact stats visible
2. **Sell form** — Product listing form with price auto-filled (45 KES)
3. **Map view** — Location picker showing Kibera with privacy circle
4. **AI description** — Generated description visible
5. **Marketplace** — New product card visible in grid

---

## Venue Prep Checklist (June 22)

```
[ ] Laptop fully charged + charger in bag
[ ] HDMI adapter (if using USB-C)
[ ] USB stick with:
    [ ] Slide deck (PPTX + PDF)
    [ ] Demo video (MP4)
    [ ] Offline HTML backup
[ ] Phone with:
    [ ] Hotspot enabled and tested
    [ ] Render health endpoint bookmarked
    [ ] Frontend URL bookmarked
[ ] Google Drive link shared with all confirmed Team 10 members
[ ] Printed copies of:
    [ ] Pitch script (for presenter)
    [ ] Demo choreography (for operator)
    [ ] Emergency runbook (for support)
```

## Emergency Contacts

| Issue | Contact | Phone |
|-------|---------|-------|
| Backend down | Render Status | status.render.com |
| GitHub Pages down | GitHub Status | status.github.com |
| Venue tech issue | Event organizer | Get number at registration |

## Final Word

> If EVERYTHING fails — no internet, no laptop, no projector — gather the judges around one phone showing the app. The team should narrate one story: Nairobi's food resilience officer cannot see the city's food system today; KilimoLink gives her real-time intelligence.
