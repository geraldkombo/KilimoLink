# KilimoLink Direct - Final AI Prompt (I4C26 Demo Night)

## Context
Product: KilimoLink Direct - climate-smart food transport intelligence for Nairobi
Stack: React 19 + Vite + MUI v6 (frontend) | NestJS + Prisma + PostgreSQL + JWT (backend) | GitHub Pages (frontend) | Render (backend)
Live URLs:
- Frontend: https://geraldkombo.github.io/KilimoLink/
- Backend: https://kilimolink-1.onrender.com/api/v1/health
Deadline: June 22 (tonight) - phone-only presentation at 360-414px width

## What's Already Done (DO NOT REIMPLEMENT)
- Auth: register/login/OTP/me with bcrypt + JWT - backend + frontend login dialog (Password/OTP/Register tabs)
- Reviews: create, get by product, avgRating/reviewCount on product cards - backend + ProductDetail.tsx
- Chat: messages, conversations, thread with 5s poll - backend + Chat.tsx + nav links + message buttons on orders/product detail
- Admin dashboard: impact metrics, user list, product list, resilience logs, audit logs, throttle lock - backend + AdminPage.tsx
- CountyDashboard: fetches /impact, Skeleton/Alert/demo fallback, food-flow map placeholder, price risk cards
- Marketplace: product listing with filters (category, location, price), PremiumMarketCard with avgRating, cart, "Add to Cart"
- Orders: create with MOCK payment, list with status chips, offline demo fallback
- Products: create (farmer), update, delete - MyProducts.tsx
- AI price suggestion engine
- Deployed: GitHub Pages auto-deploy from .github/workflows/deploy.yml + Render backend
- Tests: 68/69 pass backend (1 pre-existing market distance sort fail), 8/8 pass frontend
- Prisma mock: supports findMany, findUnique, findFirst, create, update, updateMany, deleteMany, aggregate, groupBy, include (farmer, buyer, product, admin, sender, receiver, items)
- localStorage keys: kilomolink_user_token, kilomolink_user_role, email, kilomolink_user_id, kilomolink_user_name
- Demo mode: tap "Demo Mode (offline)" in sign-in - sets demo@farmers.co.ke / FARMER / demo-token-123

## What Needs Attention (Priority Order)

### P1 - Critical Fixes
0. **Language polish for Cambridge/UN audience**: Audit every user-facing string in these files for professional, institutional tone. Replace casual/farmers-market language with climate-resilience, urban-food-system, transport-intelligence terminology. Target: sounds like a submission to Cambridge City Coalition for I4C26, not a local marketplace pitch.
   - `web/src/app/App.tsx` - hero, tagline, footer
   - `web/src/pages/Marketplace.tsx` - heading, subtext
   - `web/src/pages/CountyDashboard.tsx` - all labels, descriptions, alert text
   - `web/src/pages/ProductDetail.tsx` - reviews section labels
   - `web/src/components/PremiumMarketCard.tsx` - card text
   - `web/src/pages/Chat.tsx` - empty states, placeholders
   - `PITCH_DECK.md`, `PITCH_SCRIPT.md` - verify tone matches Cambridge/UN level
   - `I4C26_PITCH_DECK.pptx` - all slide text
1. **OrdersPage table hidden columns on mobile**: `overflowX: 'auto'` applied but verify all 7 columns (Order ID, Product, Farmer Phone, Amount, Status, Date, Actions) are scrollable at 360px
2. **Message icon on OrdersPage**: verify `order.items[0].product.farmer.id` resolves correctly - farmer may be `farmerId` string not nested object
3. **Chat.tsx**: verify `GET /chat/messages/:userId` returns correct thread after `updateMany` marks read - check `orderBy: { createdAt: 'asc' }` works
4. **Auth:** verify `POST /auth/login` for user without `passwordHash` returns proper error ("Password login not available")

### P2 - Polish
5. **DeepSeek API key** `sk-be19eb78057a4cc393f7c2f35ef560d3` was exposed in `docs/CLOUD_DEPLOYMENT_GUIDE.md` - already replaced with placeholder but ensure Render env has valid key
6. **JWT secret** falls back to `'dev-secret'` in `auth.module.ts` - ensure `JWT_SECRET` is set on Render
7. **GitLab token** `glpat-CVC62...` was pasted in chat - must be revoked at GitLab Preferences → Access Tokens
8. **Build deck** `I4C26_PITCH_DECK.pptx` generated with python-pptx - verify opens correctly, slides 1-9 match PITCH_DECK.md

### P3 - Verification
9. **Run `npx prisma db push && npx prisma generate`** on Render Shell (backend dir) - this applies schema changes (passwordHash, Review, Message models)
10. **Restart Render web service** after migration
11. **Verify health**: https://kilimolink-1.onrender.com/api/v1/health → `{"status":"ok","database":"up"}`
12. **Verify GitHub Pages** auto-deploy completed at https://geraldkombo.github.io/KilimoLink/

## Key Code Gotchas
- JWT strategy returns `{ userId: payload.sub, role }` - controllers read `req.user.userId` NOT `req.user.id`
- `GET /auth/me` returns `{ userId, email, role }` via UsersService (uses `findUniqueOrThrow`)
- Chat `messageIncludes()` returns `{ sender: { select: { id: true, name: true } }, receiver: { select: { id: true, name: true } } }`
- Admin users determined by hardcoded emails `['kombo@protonmail.com', 'kilimolink@proton.me']` in `auth.service.ts:22`
- Demo user: `email='demo@farmers.co.ke'`, `role='FARMER'`, `token='demo-token-123'`

## Quick Commands
```bash
# Backend tests
cd kilimolink/backend && npx jest --passWithNoTests --forceExit
# Frontend build + test
cd kilimolink/web && npm run build && npm test
# Push both remotes
git push origin master && git push gshikunyi-group master
```
## File Map
```
kilimolink/
  backend/
    src/auth/         - AuthService, AuthController, jwt.strategy, auth.module
    src/chat/         - ChatService, ChatController, chat.module, create-message.dto
    src/reviews/     - ReviewsService, ReviewsController, reviews.module, create-review.dto
    src/market/      - MarketService (avgRating/reviewCount on products)
    src/orders/      - OrderService
    prisma/schema.prisma - User(passwordHash), Review, Message, OtpChallenge(usedAt)
    test/            - prisma-mock.ts, auth.e2e, reviews.e2e, chat.e2e, orders.e2e, market.e2e, etc.
  web/
    src/app/App.tsx  - Routes, nav (Messages link), login dialog (Password/OTP/Register)
    src/pages/       - Chat.tsx, OrdersPage.tsx, ProductDetail.tsx, Marketplace.tsx, CountyDashboard.tsx
    src/components/  - PremiumMarketCard.tsx
    src/services/    - api.ts, auth.ts
    I4C26_PITCH_DECK.pptx    - 9-slide deck (generated)
    PITCH_DECK.md            - Slide content reference
    PITCH_SCRIPT.md          - 3-min script
    TRAE_SOLO_HANDOFF.md     - Full context handoff
    build_deck.py            - PPTX generator script
```
