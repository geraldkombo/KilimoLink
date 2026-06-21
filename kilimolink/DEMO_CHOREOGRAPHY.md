# KilimoLink Direct — 30-Second Live Demo Choreography

**Presenter:** Gerald  
**Operator:** Shadrack  
**Slide support:** James  
**Demo goal:** Prove the marketplace works, then reveal it as Nairobi's food-system data engine.

---

## Pre-demo setup: 10 minutes before pitch

| Step | Who | Action | Success check |
|---|---|---|---|
| 1 | Peter | Open `https://kilimolink.onrender.com/api/v1/health` | Returns `status: ok` |
| 2 | Gisore | Open `https://geraldkombo.github.io/KilimoLink/` | Homepage loads fully |
| 3 | Shadrack | Log in with demo account | Token stored; `/sell` opens |
| 4 | Shadrack | Preload `/market`, `/sell`, and one product detail tab | No cold navigation during demo |
| 5 | James | Open slide deck to "Live Demo" slide | Ready to switch back after demo |
| 6 | Everyone | Close extra tabs, silence notifications, set browser zoom to 90% | 720p projector-safe |

---

## 30-second demo sequence

Timing starts when Gerald says: **"This looks like a marketplace, but it is actually Nairobi's food data engine."**

| Time | Presenter line | Operator action | Screen proof |
|---|---|---|---|
| :00 | "This looks like a marketplace..." | Show `/market` | Product cards visible |
| :03 | "Every listing records origin, price, and supply." | Click a Sukuma Wiki or tomato card | Product detail opens |
| :07 | "The price truth gap shows what the farmer earns versus broker markup." | Point to price/impact area | Price/impact visible |
| :10 | "Now watch a farmer create a new data point." | Navigate to `/sell` | Sell form visible |
| :13 | "Sukuma wiki, a Nairobi staple." | Select **Sukuma Wiki (Kale)** | Price auto-fills 45 KES |
| :16 | "AI helps the farmer write the listing." | Click **Help me write this** | Description appears |
| :20 | "The map captures supply location while protecting privacy." | Click Kibera/Kilimani area on map | Marker or privacy radius visible |
| :24 | "Privacy mode hides the exact farm location." | Toggle privacy mode if not already enabled | 500m radius appears |
| :27 | "One click lists it." | Click **List My Produce Now** | Loading state / redirect starts |
| :30 | "That transaction becomes climate intelligence for Grace." | Open `/county-dashboard` or switch to preloaded dashboard tab | County dashboard visual |

---

## If anything fails

- **Backend slow/cold:** Stay on preloaded product detail and say, "The live backend is waking; this preloaded listing shows the same data flow."
- **Product submission fails:** Open existing marketplace card and say, "Here is one already listed; every order produces the same data signal."
- **Map tiles fail:** Keep marker/radius visible if possible; say, "Venue map tiles are blocked, but GPS coordinates and privacy radius are already captured."
- **OTP fails:** Use pre-authenticated browser profile. If not available, demo public marketplace only.
- **Internet fails:** Play the 60-second backup recording while presenter narrates live.

---

## What not to do

- Do not type long text live.
- Do not wait silently for network calls.
- Do not explain implementation details during the 30-second demo.
- Do not apologize; narrate the climate data story.
- Do not claim the county dashboard is fully live unless it is deployed.

---

## Final transition line

> "The marketplace is working today. By August 31, this data powers Grace's county dashboard: food flows, price alerts, climate disruption warnings, and informal settlement risk." 
