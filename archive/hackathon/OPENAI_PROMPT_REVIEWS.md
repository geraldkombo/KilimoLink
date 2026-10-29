# KilimoLink Direct — Reviews & Ratings

## Context
NestJS + Prisma + PostgreSQL at `kilimolink/backend/`. React 19 + Vite + MUI v6 at `kilimolink/web/`. Auth (JWT) already implemented. Build: `npm run build && npm test` (web), `npx jest --passWithNoTests` (backend).

## Prisma (`prisma/schema.prisma`)
Add Review model:
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

## Backend: New `reviews/` module (`backend/src/reviews/`)
Create 4 files:

**dto/create-review.dto.ts**: `productId` (string), `rating` (int 1-5 via @Min/@Max), `comment` (optional string). Use class-validator decorators.

**reviews.service.ts**: Inject PrismaService.
- `create(userId, dto)`: Check user has a DELIVERED order containing this product. Find order where buyerId=userId AND status=DELIVERED AND items.some(productId). If none, throw 403. Check no existing review for this productId+buyerId (findUnique with compound key). Create review, return it.
- `getProductReviews(productId)`: FindMany reviews where productId, include buyer (select id,name). Compute avgRating via aggregate `_avg.rating`. Return `{avgRating, reviewCount, reviews}`.

**reviews.controller.ts**:  
- `POST /reviews` — @UseGuards(AuthGuard('jwt')). @Body() dto: CreateReviewDto. @Req() req. Return create(req.user.id, dto) → 201.
- `GET /products/:id/reviews` — Public. Return getProductReviews(id).

**reviews.module.ts**: Standard module, import PrismaModule, export ReviewsService.

**Patch market.service.ts** (`backend/src/market/market.service.ts`):
In `getProductById()` and `listProducts()`, after fetching product(s), attach `avgRating` and `reviewCount` by querying `prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true })`. Add as fields on the response object.

## Frontend: ProductDetail.tsx (`web/src/pages/ProductDetail.tsx`)
Between product description and farmer info box, add reviews section:
- State: `reviews`, `avgRating`, `reviewCount`, `reviewsLoading`, `userCanReview`, `reviewText`, `reviewRating`(default 5)
- On mount after product loads: fetch `GET /products/{id}/reviews`
- Also fetch `GET /orders` to check if user has a DELIVERED order for this product (if authenticated)
- Display: MUI `<Rating value={avgRating} readOnly size="large" />` + `({reviewCount} reviews)` text
- Review list: map reviews to Cards showing buyer name, date, Rating(readOnly,size=small), comment text
- If userCanReview: show "Write a Review" button → expands inline form with Rating(interactive) + TextField(multiline) + Submit button
- Submit: `POST /reviews` → refresh reviews, hide form
- Loading: Skeleton blocks. Empty: "No reviews yet."

## Frontend: Marketplace.tsx (`web/src/pages/Marketplace.tsx`)
Product cards use `<PremiumMarketCard product={p} />`. Pass `avgRating` and `reviewCount` from the product object. In the card, display small `<Rating value={avgRating} readOnly size="small" />` + `({reviewCount})` if available.

## Tests: New `test/reviews.e2e-spec.ts`
Use same pattern as auth.e2e-spec.ts (Test.createTestingModule, overridePrisma, overrideRedis, setGlobalPrefix api/v1).
Create users (buyer+farmers), product, delivered order. Test:
- `POST /reviews` (eligible buyer with delivered order) → 201
- `POST /reviews` (buyer who didn't order) → 403
- `GET /products/:id/reviews` → 200 with avgRating(5), reviewCount(1), reviews array
- `GET /products/:id` → 200 with avgRating, reviewCount on product

## Critical
- Do NOT break demo mode (demo-token-123)
- Every endpoint needs E2E tests
- Loading/empty/error states on frontend
- MUI v6 only
- Build: `cd kilimolink/web && npm run build && npm test`
- Backend tests: `cd kilimolink/backend && npx jest --passWithNoTests`
