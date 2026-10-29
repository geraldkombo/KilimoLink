# KilimoLink Direct — High-Tier AI Build Prompt

You are building a production-ready urban food resilience marketplace called **KilimoLink Direct**. This is NOT a demo — it must be a fully functional app for I4C26 judging. The transport/logistics angle is core: climate-smart food transport intelligence for Nairobi.

## Stack
- **Frontend**: React 19 + Vite + MUI v6 + TypeScript + react-router-dom v6 (`/kilimolink/web/`)
- **Backend**: NestJS + Prisma + PostgreSQL + JWT auth (`/kilimolink/backend/`)
- **Deployed at**: https://geraldkombo.github.io/KilimoLink/ (GitHub Pages) and https://kilimolink-1.onrender.com/api/v1/health (Render)
- **Build**: `cd kilimolink/web && npm run build` then `npm test`

---

## CRITICAL — Implement These 6 Features in Order

### 1. REAL AUTH (OTP + Email/Password)
**Backend:** `/kilimolink/backend/src/auth/`
- `auth.service.ts` `sendOtp()` is currently a mock returning `devCode: '123456'` — replace with real OTP generation (6-digit), hash with bcrypt, store in `OtpChallenge` table, and return `{ ok: true }` only (never expose the code in production)
- `verifyOtp()` currently ignores the code parameter — implement proper hash comparison against `OtpChallenge.codeHash`, check expiry with `expiresAt`, mark challenge used
- The `OtpChallenge` and `OtpVerifyThrottle` tables already exist in Prisma schema — use them
- For dev/test, keep a fallback: if `NODE_ENV=development`, still return `devCode` for debugging
- Add password-based auth as alternative: `POST /auth/register` (email, password, name, role) and `POST /auth/login` (email, password) — hash passwords with bcrypt
- **Frontend:** Add sign-up form alongside existing sign-in dialog in `App.tsx`

### 2. SEARCH & FILTERS ON MARKETPLACE
**Backend:** `/kilimolink/backend/src/market/market.service.ts` — `listProducts()`
- Add query params: `search` (text search on title + description), `category` (Vegetables/Fruits/Dairy/Grains/Other), `minPrice`, `maxPrice`, `sort` (price_asc, price_desc, newest, oldest)
- Build proper Prisma `where` clause from these params
- **Frontend:** `/kilimolink/web/src/pages/Marketplace.tsx` — add a search bar at top, category chips/pills below it, price range sliders or quick filters, sort dropdown. Replace current client-side-only search with real API query.

### 3. RATINGS & REVIEWS
**Backend:** New module `/kilimolink/backend/src/reviews/`
- Add `Review` model to Prisma schema: `id`, `productId` (FK→Product), `buyerId` (FK→User), `rating` (Int 1-5), `comment` (String?), `createdAt`
- `POST /reviews` — JWT-protected, buyer can only review products they've ordered (check Orders)
- `GET /products/:id/reviews` — public, returns avg rating + count + all reviews, cached
- Add `avgRating` and `reviewCount` virtual fields to Product responses
- **Frontend:** Add star rating UI on ProductDetail page, show existing reviews list, allow buyers to submit review after delivery

### 4. CHAT / MESSAGING
**Backend:** New module `/kilimolink/backend/src/chat/`
- Add `Message` model to Prisma: `id`, `senderId` (FK→User), `receiverId` (FK→User), `orderId` (FK→Order, optional), `text`, `readAt` (DateTime?), `createdAt`
- `POST /chat/messages` — JWT-protected, create message
- `GET /chat/conversations` — JWT-protected, list unique conversations for current user
- `GET /chat/messages/:otherUserId` — JWT-protected, get message thread between current user and other user, ordered by createdAt
- `PATCH /chat/messages/:id/read` — mark as read
- Optional: Add SSE or simple polling for real-time updates
- **Frontend:** New `/kilimolink/web/src/pages/Chat.tsx` — simple chat UI showing conversations list and message thread. Add "Message" button on ProductDetail and Orders pages. Add `/chat` route to App.tsx.

### 5. POLISH EVERY LOADING & ERROR STATE
**Frontend audit across all pages:**
- **AdminPage.tsx**: Add loading spinner during initial `fetchData`, add error banner when API fails (currently catch just console.errors), add retry button
- **CountyDashboard.tsx**: Currently static with hardcoded data. Make it fetch from `/api/v1/impact` with loading skeleton, error handling, and fallback demo data when offline
- **All pages**: Ensure every API call has try/catch with user-facing error message. No blank screens ever. No unhandled promises.
- **Auth errors**: Show specific messages for rate limiting, wrong credentials, expired tokens
- **Network errors**: Show offline banner consistently (already exists in App.tsx, verify it works on every page)

### 6. FULL CRUD POLISH
- **Market disruption alerts** (`/kilimolink/backend/src/market/market-insights.controller.ts`): Replace hardcoded `{ active: false, status: 'stable' }` with real data — compute from recent price volatility in orders/products, or make it configurable by admin
- **Admin login throttle**: Fix `admin-auth.service.ts` — `lockedUntil` is never set (line creates throttle with only `failures`). After 5 failures, set `lockedUntil` to `new Date(Date.now() + 15*60*1000)` (15 min lockout)
- **DTO validation**: Add proper DTO classes with `class-validator` decorators to `POST /admin/resilience` (currently `Body() body: any`), `POST /ai/suggest-price` (currently `Body() body: any`)

---

## Non-Negotiable Rules

1. **Every new backend feature MUST have E2E tests** — look at existing tests in `/kilimolink/backend/test/` for patterns (Jest + supertest, NestJS test factory)
2. **Every new frontend feature MUST handle loading, empty, and error states** — use MUI Skeleton, CircularProgress, Alert components
3. **No blank screens** — if API fails, show cached/fallback data with a "offline" notice
4. **TypeScript strict** — no `any` types
5. **Run tests after every change**: `cd kilimolink/web && npm run build && npm test`
6. **Commit after each feature**: `git add -A && git commit -m "feat: ..." && git push origin master`

---

## What's Already Done (Don't Re-do)
- Renamed all branding to "KilimoLink Direct" (hero, navbar, footer, dialogs, meta tags)
- Removed v1.2.0, Pricing Guide, Farmer Tips, Start Selling from footer
- Replaced em dashes with hyphens in all user-facing copy
- Tagline: "Move food faster. Waste less. Earn more."
- Lazy-loaded all 7 page routes with React.lazy() + Suspense, preload Marketplace & CountyDashboard
- Camera photo upload with canvas compression on SellProduct
- Offline demo fallbacks on Marketplace, ProductDetail, MyProducts, OrdersPage
- Mobile layout fixed at 360px-414px

---

## Deployment
- GitHub Pages auto-deploys on push to `origin/master` (`.github/workflows/deploy.yml`)
- Render backend at `https://kilimolink-1.onrender.com/api/v1/health`
- To verify: `curl https://kilimolink-1.onrender.com/api/v1/health` should return `{"status":"ok"}`
- Render env vars to verify: `NODE_ENV=production`, `DISABLE_REDIS=true`, `MOCK_PAYMENTS=true`

## Key Files
| Path | Purpose |
|------|---------|
| `kilimolink/web/src/app/App.tsx` | Main app shell with routes and auth dialogs |
| `kilimolink/web/src/pages/Marketplace.tsx` | Product listing with loading/empty/error states |
| `kilimolink/web/src/pages/ProductDetail.tsx` | Single product view with order button |
| `kilimolink/web/src/pages/CountyDashboard.tsx` | Static — needs real data + loading states |
| `kilimolink/web/src/pages/AdminPage.tsx` | Admin panel — needs loading/error states |
| `kilimolink/web/src/services/api.ts` | Axios client with error interceptors |
| `kilimolink/backend/src/auth/auth.service.ts` | Auth logic — OTP is mock, needs real implementation |
| `kilimolink/backend/src/market/market.service.ts` | Product CRUD — needs search/filter params |
| `kilimolink/backend/prisma/schema.prisma` | Database schema — add Review and Message models |
| `kilimolink/backend/test/` | E2E tests — add tests for new features |
