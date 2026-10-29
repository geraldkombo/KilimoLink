# KilimoLink Direct — Trae generates 3 split prompts for OpenAI o5.5

## Context limit: o5.5 cannot fit all 14 files in one prompt
Split the output into 3 separate files, one per feature. Each file contains only the files relevant to that feature.

## YOUR JOB
Read the files listed below. Write **3 separate files** in the workspace root:

| Output file | Feature | Files to inline |
|---|---|---|
| `OPENAI_PROMPT_AUTH.md` | Auth (OTP + password) | Files 1-6, 9-11 |
| `OPENAI_PROMPT_REVIEWS.md` | Reviews & ratings | Files 1, 5, 7, 9, 11-13 |
| `OPENAI_PROMPT_CHAT.md` | Chat & messaging | Files 1, 5, 8, 9, 14 |

Each file must be **self-contained** — include the stack, already-done context, and critical rules.

Do NOT implement any code. Do NOT run builds, tests, or git. Only read files and write the 3 prompt files.

---

## Files available (read these, split across the 3 prompts)

| # | File | Include in |
|---|------|-----------|
| 1 | `kilimolink/backend/prisma/schema.prisma` | AUTH, REVIEWS, CHAT |
| 2 | `kilimolink/backend/src/auth/auth.service.ts` | AUTH only |
| 3 | `kilimolink/backend/src/auth/auth.controller.ts` | AUTH only |
| 4 | `kilimolink/backend/src/auth/auth.module.ts` | AUTH only |
| 5 | `kilimolink/web/src/app/App.tsx` | AUTH, REVIEWS, CHAT |
| 6 | `kilimolink/web/src/pages/ProductDetail.tsx` | REVIEWS, CHAT |
| 7 | `kilimolink/web/src/pages/Marketplace.tsx` | REVIEWS only |
| 8 | `kilimolink/web/src/pages/OrdersPage.tsx` | CHAT only |
| 9 | `kilimolink/web/src/services/api.ts` | AUTH, REVIEWS, CHAT |
| 10 | `kilimolink/web/src/services/auth.ts` | AUTH only |
| 11 | `kilimolink/backend/src/orders/orders.service.ts` | AUTH, REVIEWS |
| 12 | `kilimolink/backend/test/auth.e2e-spec.ts` | AUTH only |
| 13 | `kilimolink/backend/test/market.e2e-spec.ts` | REVIEWS only |
| 14 | `kilimolink/backend/test/orders.e2e-spec.ts` | CHAT only |

---

## Format for each file

```
# KilimoLink Direct — OpenAI o5.5: [Feature Name]

## Context
You are implementing [feature] for KilimoLink Direct. You CANNOT access files or run code. All necessary file contents are inlined below.

## Stack
- Frontend: `kilimolink/web/` — React 19 + Vite + MUI v6 + TypeScript + react-router-dom v6
- Backend: `kilimolink/backend/` — NestJS + Prisma + PostgreSQL + JWT

## Already Done (context only)
[relevant subset of what's done]

## FILE: path/to/file.ts
```typescript
[full contents]
```

[repeat for each relevant file]

## Implementation Instructions
[feature-specific instructions from below]

## Critical Rules
[relevant subset]
```

---

## Feature 2 — Real Auth (OTP + Email/Password)

### Prisma
Add `passwordHash String?` to User model. Run: `npx prisma migrate dev --name add_password_hash && npx prisma generate`

### auth.service.ts
- `sendOtp(phone)`: Generate 6-digit code, bcrypt hash (10 rounds), store in `OtpChallenge` with `expiresAt = now+10min`. Return `{ok:true}`. Dev mode (`NODE_ENV=development`): include `devCode`.
- `verifyOtp(phone, code)`: Look up `OtpChallenge` by phone where `usedAt IS NULL`. Compare hash. Check `expiresAt > now`. Mark `usedAt = new Date()`. Return JWT. On fail: increment `OtpVerifyThrottle` — 3 failures in 5min → lock 10min.
- `register(email, password, name, role)`: bcrypt hash. Create user. Return JWT.
- `login(email, password)`: Find user by email. Compare hash. Return JWT.

### auth.controller.ts
- `POST /auth/register` — validated: email, password(≥6), name, role(FARMER|BUYER|TRANSPORTER)
- `POST /auth/login` — email, password
- `POST /auth/send-otp` — phone
- `POST /auth/verify-otp` — phone, code

### App.tsx
- Register form: email, password, confirm password, name, role dropdown
- Password login tab alongside existing OTP tab in sign-in dialog
- Error messages: "Wrong password", "Account locked 15min", "OTP expired", "Too many attempts"
- On success: close dialog, store `kilimolink_user_token` + `kilimolink_user_role` in localStorage
- Keep "Demo Mode (offline)" button — sets demo@farmers.co.ke / FARMER
- On mount: check localStorage for token, validate with `GET /auth/me`, clear if invalid

### Tests (auth.e2e-spec.ts)
- `POST /auth/register` → 201 with token + user
- `POST /auth/login` → 201 with token
- `POST /auth/login` wrong password → 401
- `POST /auth/send-otp` → 201 with ok:true (devCode in dev)
- `POST /auth/verify-otp` → 201 with token
- `GET /auth/me` → 200 with user details

---

## Feature 3 — Reviews & Ratings

### Prisma
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
Run: `npx prisma migrate dev --name add_reviews && npx prisma generate`

### New module `reviews/` (controller, service, module, dto)
- `POST /reviews` — JWT. Body: `{productId, rating(1-5), comment?}`. Check user ordered this product. One per product.
- `GET /products/:id/reviews` — Public. Return `{avgRating, reviewCount, reviews:[]}`. Cache 60s.
- `GET /products/:id` — Include `avgRating`, `reviewCount` (patch market.service.ts)

### ProductDetail.tsx
- Fetch reviews on mount
- Show avgRating as MUI `Rating` (read-only, large) + "(X reviews)"
- Review list: Card stack — user name, date, stars, comment
- If logged in AND ordered AND not reviewed: "Write a review" with star selector + text field
- Loading: Skeleton. Empty: "No reviews yet"

### Marketplace.tsx
- Show avgRating + reviewCount on product cards if available

### Tests (reviews.e2e-spec.ts)
- `POST /reviews` (eligible) → 201
- `POST /reviews` (not eligible) → 403
- `GET /products/:id/reviews` → 200 with avgRating, reviewCount, reviews
- `GET /products/:id` → 200 with avgRating, reviewCount

---

## Feature 4 — Chat & Messaging

### Prisma
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
Run: `npx prisma migrate dev --name add_messages && npx prisma generate`

### New module `chat/` (controller, service, module, dto)
- `POST /chat/messages` — JWT. Body: `{receiverId, text, orderId?}`
- `GET /chat/conversations` — JWT. Unique partners with last message, timestamp, unread count
- `GET /chat/messages/:userId` — JWT. Thread, ordered ASC. Mark incoming as read
- `PATCH /chat/messages/:id/read` — JWT. Set readAt

### New Chat.tsx
- Left panel: conversations — partner name, last message (50 char), timestamp, unread badge
- Right panel: message thread — bubbles (sender=blue right, receiver=gray left), timestamps
- Input: TextField + Send. Poll every 5s
- Loading: Skeleton. Empty: "No conversations yet". Error: Alert + retry

### Route + buttons
- App.tsx: `<Route path="/chat" element={<Chat />} />` (lazy import)
- OrdersPage.tsx: "Message" IconButton per order → `/chat?userId={farmerId}`
- ProductDetail.tsx: "Message Seller" button → `/chat?userId={sellerId}`

### Tests (chat.e2e-spec.ts)
- `POST /chat/messages` → 201
- `GET /chat/conversations` → 200 with unread count, preview
- `GET /chat/messages/:userId` → 200, incoming marked read
- `PATCH /chat/messages/:id/read` → 200

---

## Critical Rules (include in every prompt file)
- Do NOT break demo mode (demo@farmers.co.ke / FARMER / demo-token-123)
- Every backend endpoint needs E2E tests in `test/`
- Every frontend feature needs loading/empty/error states
- Keep MUI v6, no new UI libs
- Graceful degradation when Redis/DB unavailable
- localStorage keys: `kilimolink_user_token`, `kilimolink_user_role`, `email`, `kilimolink_user_id`, `kilimolink_user_name`
- Build: `cd kilimolink/web && npm run build && npm test`
- Backend tests: `cd kilimolink/backend && npx jest --passWithNoTests`
- Push: `git add -A && git commit -m "feat: [feature name] for I4C26" && git push origin master && git push gshikunyi-group master`
