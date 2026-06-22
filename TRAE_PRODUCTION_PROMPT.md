# KilimoLink Direct — Production Push Prompt (I4C26)

You are building production features for KilimoLink Direct, a live I4C26 submission. The app is deployed at https://geraldkombo.github.io/KilimoLink/ (frontend) and https://kilimolink-1.onrender.com/api/v1/health (backend). Deadline: June 22, 23:50 EAT.

## Stack
- Frontend: React 19 + Vite + MUI v6 + TypeScript + react-router-dom v6 in `kilimolink/web/`
- Backend: NestJS + Prisma + PostgreSQL + JWT in `kilimolink/backend/`
- Build: `cd kilimolink/web && npm run build && npm test`
- Backend tests: `cd kilimolink/backend && npx jest --passWithNoTests`

## What's Already Done (Do NOT Re-do)
- Search/filter on Marketplace with category chips, sort dropdown, price filter
- Demo mode fallback showing 6 DEMO_PRODUCTS when API empty
- Lazy-loaded all 7 routes with React.lazy() + Suspense
- Camera upload with canvas compression on SellProduct
- Offline demo fallbacks on Marketplace, ProductDetail, MyProducts, OrdersPage
- Branding: "KilimoLink Direct", tagline "Move food faster. Waste less. Earn more."
- Footer clean: no Pricing Guide, Farmer Tips, Start Selling, v1.2.0
- Mobile layout at 360px-414px

---

## IMPLEMENT ALL 4 FEATURES BELOW IN ORDER

### Feature 1 — Loading, Error & Offline UX Fixes

**CountyDashboard.tsx** (`kilimolink/web/src/pages/CountyDashboard.tsx`):
- Currently has static/hardcoded data. Make it fetch from `/api/v1/impact` at mount
- Show MUI `Skeleton` (rectangular, 6 variants matching card layout) while loading
- On API error, show MUI `Alert severity="error"` with retry button and fallback to demo data
- Handle empty state: show "No impact data yet" with illustration

**AdminPage.tsx** (`kilimolink/web/src/pages/AdminPage.tsx`):
- Add `CircularProgress` centered during initial `fetchData` call
- Wrap fetch in try/catch — on error show `Alert severity="error"` + retry button
- Show inline `Snackbar` messages for successful actions (resilience log created, etc.)

**Marketplace.tsx** — verify existing loading/error states:
- Ensure search loading shows `LinearProgress` at top of product grid
- If API returns `[]` AND not in Demo Mode, show "No products match your filters"
- If API completely fails (network error), show alert + "Tap to retry" + fallback to DEMO_PRODUCTS
- Verify offline banner from App.tsx is visible on this page

**Every page check**:
- No blank screens at any point (loading → data OR loading → error → retry)
- No unhandled promise rejections
- Network offline banner must show on Marketplace, CountyDashboard, AdminPage

Commit message: `feat: loading skeletons, error banners, offline UX across all pages`

### Feature 2 — Real Auth (OTP + Email/Password)

**Prisma Schema** (`kilimolink/backend/prisma/schema.prisma`):
- The `OtpChallenge` and `OtpVerifyThrottle` models already exist
- Add `passwordHash String?` field to `User` model (optional for backward compat)
- Run: `npx prisma migrate dev --name add_password_hash` then `npx prisma generate`

**Backend auth.service.ts** (`kilimolink/backend/src/auth/auth.service.ts`):
- `sendOtp()`: Generate 6-digit code, hash with bcrypt (10 rounds), store in `OtpChallenge` with `expiresAt = now + 10min`. Return `{ ok: true }` only. In dev (`NODE_ENV=development`), include `devCode` for debugging.
- `verifyOtp()`: Look up `OtpChallenge` by phone where `usedAt IS NULL`. Compare hash with bcrypt. Check `expiresAt > now`. Mark `usedAt = new Date()`. Return JWT. On failure, increment `OtpVerifyThrottle` — if 3 failures in 5 min, lock for 10 min.
- `register()`: New method — accept email, password, name, role. Hash password with bcrypt. Create user. Return JWT.
- `login()`: New method — accept email, password. Find user by email. Compare hash. Return JWT.

**Backend auth.controller.ts** (`kilimolink/backend/src/auth/auth.controller.ts`):
- Add `POST /auth/register` → `register(dto: RegisterDto)` with email, password, name, role validation
- Add `POST /auth/login` → `login(dto: LoginDto)` with email, password
- Add `POST /auth/send-otp` (existing, update implementation)
- Add `POST /auth/verify-otp` (existing, update implementation)

**Frontend App.tsx** (`kilimolink/web/src/app/App.tsx`):
- Add register form: email, password, confirm password, name, role dropdown (FARMER/BUYER/TRANSPORTER)
- Add password login tab alongside existing OTP tab in sign-in dialog
- Show specific error messages: "Wrong password", "Account locked (15 min)", "OTP expired", "Too many attempts"
- On successful register/login, close dialog and update auth context
- Keep "Demo Mode (offline)" button as fallback — sets demo@farmers.co.ke / role=FARMER
- Store token in localStorage key `kilimolink_user_token`, role in `kilimolink_user_role`

**Auth persistence**: On app mount, check localStorage for existing token. If found, validate with `GET /auth/me` (JWT-protected). If invalid, clear and show sign-in.

Commit message: `feat: real OTP auth with bcrypt, password register/login, frontend forms`

### Feature 3 — Reviews & Ratings

**Prisma Schema** — Add:
```prisma
model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  buyerId   String
  buyer     User     @relation(fields: [buyerId], references: [id])
  rating    Int
  comment   String?
  createdAt DateTime @default(now())

  @@unique([productId, buyerId])
}
```
Run: `npx prisma migrate dev --name add_reviews` then `npx prisma generate`

**Backend reviews module** — `kilimolink/backend/src/reviews/`:
- `POST /reviews` — JWT-protected. Body: `{ productId, rating (1-5), comment? }`. Check that user has ordered this product (query Orders table). Enforce unique productId+buyerId (one review per product). Return created review.
- `GET /products/:id/reviews` — Public. Return `{ avgRating, reviewCount, reviews: [...] }`. Cache with Prisma or in-memory for 60s.
- `GET /products/:id` — Include computed `avgRating` and `reviewCount` in response

**Frontend ProductDetail.tsx** (`kilimolink/web/src/pages/ProductDetail.tsx`):
- Fetch `GET /products/:id/reviews` on mount
- Display average rating as MUI `Rating` component (read-only, large) with `(X reviews)` label
- Show review list as MUI `Card` stack — each with user name, date, rating stars, comment text
- If user is logged in AND has ordered this product AND hasn't reviewed: show "Write a review" section with star selector (1-5) + text field
- Loading state: `Skeleton` for rating summary + `Skeleton` list for reviews
- Empty state: "No reviews yet"

**Frontend Marketplace.tsx** — show avgRating + reviewCount on product cards if available

Commit message: `feat: reviews and ratings with eligibility check, star UI, avg display`

### Feature 4 — Chat & Messaging

**Prisma Schema** — Add:
```prisma
model Message {
  id         String   @id @default(cuid())
  senderId   String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiverId String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  orderId    String?
  order      Order?   @relation(fields: [orderId], references: [id])
  text       String
  readAt     DateTime?
  createdAt  DateTime @default(now())
}
```
Run: `npx prisma migrate dev --name add_messages` then `npx prisma generate`

**Backend chat module** — `kilimolink/backend/src/chat/`:
- `POST /chat/messages` — JWT-protected. Body: `{ receiverId, text, orderId? }`. Create message. Return created message.
- `GET /chat/conversations` — JWT-protected. Return list of unique conversation partners with last message preview, timestamp, unread count. Group by `CASE WHEN senderId = userId THEN receiverId ELSE senderId END`.
- `GET /chat/messages/:userId` — JWT-protected. Return all messages between current user and `:userId` ordered by `createdAt ASC`. Mark messages as read where `receiverId = currentUserId AND readAt IS NULL`.
- `PATCH /chat/messages/:id/read` — JWT-protected. Set `readAt = new Date()` for given message if `receiverId` matches current user.

**Frontend Chat.tsx** — new page at `kilimolink/web/src/pages/Chat.tsx`:
- Left panel: conversations list — each item shows partner name, last message preview (truncated 50 chars), timestamp, unread badge
- Right panel: message thread — scrollable, newest at bottom. Messages from current user aligned right (blue/green bubble), from other user aligned left (gray bubble). Show timestamp under each message.
- Input bar at bottom: MUI `TextField` + send `IconButton` (SendIcon)
- Poll for new messages every 5 seconds with `GET /chat/messages/:userId` when a conversation is open
- Loading state: `Skeleton` list for conversations + `Skeleton` for message area
- Empty state: "No conversations yet. Start by messaging a farmer from the marketplace."
- Error state: Alert with retry

**Frontend App.tsx** — add `<Route path="/chat" element={<Chat />} />` inside `<Suspense>` (lazy import)

**Frontend OrdersPage.tsx** — add "Message" `IconButton` next to each order. Opens `/chat?userId={farmerId}`.

**Frontend ProductDetail.tsx** — add "Message Seller" `Button` for logged-in users. Opens `/chat?userId={sellerId}`.

Commit message: `feat: chat and messaging with conversations, threads, unread counts`

---

## Verification (Run After ALL 4 Features)

```bash
cd kilimolink/web && npm run build
if ($?) { npm test }
cd kilimolink/backend && npx jest --passWithNoTests
```

Both must pass. Fix any test failures.

## Push

```bash
git add -A && git commit -m "feat: complete production features for I4C26"
git push origin master
git push shikunyi-group master
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `kilimolink/web/src/app/App.tsx` | Routes, auth dialogs, offline banner |
| `kilimolink/web/src/pages/Marketplace.tsx` | Product grid with search/filter |
| `kilimolink/web/src/pages/ProductDetail.tsx` | Product detail + reviews section |
| `kilimolink/web/src/pages/CountyDashboard.tsx` | Impact dashboard (needs loading/error) |
| `kilimolink/web/src/pages/AdminPage.tsx` | Admin panel (needs loading/error) |
| `kilimolink/web/src/pages/Chat.tsx` | NEW — chat page |
| `kilimolink/web/src/pages/OrdersPage.tsx` | Add message button |
| `kilimolink/backend/src/auth/auth.service.ts` | Auth logic (OTP + password) |
| `kilimolink/backend/src/auth/auth.controller.ts` | Auth endpoints |
| `kilimolink/backend/src/reviews/` | NEW — reviews module |
| `kilimolink/backend/src/chat/` | NEW — chat module |
| `kilimolink/backend/prisma/schema.prisma` | Add Review + Message models |
| `kilimolink/backend/test/` | E2E tests |

## Auth Keys (localStorage)
- `kilimolink_user_token` — JWT
- `kilimolink_user_role` — FARMER / BUYER / TRANSPORTER
- `email` — user email
- `kilimolink_user_id` — user ID
- `kilimolink_user_name` — display name
- Demo mode: token=`demo-token-123`, email=`demo@farmers.co.ke`, role=`FARMER`

## Important Notes
- Do NOT break existing demo mode — it's critical for the phone presentation
- All backend changes must handle case when Redis/DB is unavailable (graceful degradation)
- Keep MUI components, don't introduce new UI libraries
- Every new frontend feature needs: loading → data | empty | error states
- Every new backend endpoint needs E2E tests in `kilimolink/backend/test/`
