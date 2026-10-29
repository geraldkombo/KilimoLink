# FINAL BUILD — KilimoLink Direct Production Complete

## Mandate

You MUST complete ALL 6 features below in order. Do NOT stop until every item is done, every test passes, and everything is pushed to both remotes. This project goes live for I4C26 — incomplete work is not acceptable.

## Start

```bash
git checkout master
git pull
git checkout -b feat/production-complete
```

## Feature 1 — Marketplace Search & Filter (Already Done)
Verify it works:
```bash
cd kilimolink/web && npm run build && npm test
```
The backend has `search`, `category`, `minPrice`, `maxPrice`, `sort` params. Frontend has search bar, category chips, sort dropdown. Demo Mode shows 6 fallback products when API returns empty.

## Feature 2 — Polish Every Loading & Error State

### AdminPage.tsx
- Add loading spinner during initial fetch
- Add error banner with retry button when API fails
- Currently catches silently — fix that

### CountyDashboard.tsx
- Currently static hardcoded data
- Fetch from `/api/v1/impact` with loading skeleton
- Fallback to demo data when offline or API fails
- Handle empty state

### Every page
- No blank screens ever
- Every API call must have user-facing error message
- Network offline must show banner consistently

Commit: `git add -A && git commit -m "feat: loading and error states across all pages"`

## Feature 3 — Admin Throttle Lock Fix

File: `kilimolink/backend/src/admin/admin-auth.service.ts`

After 5 failed login attempts, set `lockedUntil` to 15 minutes from now:
```ts
if (failures >= 5) {
  data.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
}
```

Commit: `git add -A && git commit -m "fix: admin login throttle lock after 5 failures"`

## Feature 4 — DTO Validation

### Admin resilience POST
File: `kilimolink/backend/src/admin/admin.controller.ts`
- Replace `@Body() body: any` with a proper DTO class
- Add `class-validator` decorators

### AI suggest-price POST
File: `kilimolink/backend/src/ai/ai.controller.ts`
- Replace `@Body() body: any` with a proper DTO class
- Add `class-validator` decorators

Commit: `git add -A && git commit -m "feat: DTO validation for admin resilience and AI endpoints"`

## Feature 5 — Real Auth (OTP + Password)

### Backend: `kilimolink/backend/src/auth/auth.service.ts`
- `sendOtp()`: Generate 6-digit code, hash with bcrypt, store in `OtpChallenge` table with 10min expiry. Return `{ ok: true }` only (never expose code in production). For dev, if `NODE_ENV=development`, include `devCode`.
- `verifyOtp()`: Look up `OtpChallenge` by phone, compare hash with bcrypt, check expiry, mark as used. Return JWT.
- `POST /auth/register`: Accept email, password, name, role. Hash password with bcrypt. Create user. Return JWT.
- `POST /auth/login`: Accept email, password. Compare hash. Return JWT.

### Backend: `OtpVerifyThrottle`
- After 3 failed OTP attempts in 5 minutes, lock for 10 minutes.

### Frontend: `App.tsx`
- Add register form alongside existing sign-in dialog
- Add password field to login
- Show error messages for wrong password, locked account, expired OTP

Commit: `git add -A && git commit -m "feat: real OTP and password auth"`

## Feature 6 — Reviews & Ratings

### Prisma Schema: `kilimolink/backend/prisma/schema.prisma`
Add:
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
}
```

### Run migration:
```bash
cd kilimolink/backend
npx prisma migrate dev --name add_reviews
npx prisma generate
```

### Backend: New `reviews` module
- `POST /reviews` — JWT, buyer can only review products they've ordered
- `GET /products/:id/reviews` — public, return avg rating + count + list
- `GET /products/:id` — include avgRating and reviewCount

### Frontend: `ProductDetail.tsx`
- Display star rating and existing reviews
- Allow buyers who ordered the product to submit a review
- Show average rating on product cards in Marketplace

Commit: `git add -A && git commit -m "feat: reviews and ratings"`

## Feature 7 — Chat & Messaging

### Prisma Schema
Add:
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

### Run migration:
```bash
cd kilimolink/backend
npx prisma migrate dev --name add_messages
npx prisma generate
```

### Backend: New `chat` module
- `POST /chat/messages` — JWT, create message
- `GET /chat/conversations` — JWT, list unique conversations
- `GET /chat/messages/:userId` — JWT, get thread with another user
- `PATCH /chat/messages/:id/read` — mark as read

### Frontend: New `Chat.tsx` page
- Conversations list on left, message thread on right
- "Message" button on ProductDetail and Orders pages
- Add `/chat` route to App.tsx

Commit: `git add -A && git commit -m "feat: chat and messaging"`

## Verification (Must Pass Before Push)

```bash
cd kilimolink/web && npm run build && npm test
cd kilimolink/backend && npm run build && npm test
```

Both must pass 100%. If tests fail, fix them. Do not skip.

## Push

```bash
git push origin feat/production-complete
git push shikunyi-group feat/production-complete
```

Then create PR and merge to master.

## Do NOT stop until:
- [ ] All 7 features implemented
- [ ] All backend tests pass
- [ ] Frontend build passes
- [ ] Frontend tests pass
- [ ] Both remotes pushed
- [ ] Merged to master

This is for a live I4C26 submission. Incomplete work is not acceptable.
