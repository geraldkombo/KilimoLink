# Edge API (Cloudflare Pages Functions + D1)

The canonical production backend runs **on the edge**, same-origin with the web app:

- **Full app (web + API):** https://kilimolink.pages.dev
- **API base:** https://kilimolink.pages.dev/api/v1
- **GitHub Pages mirror:** https://geraldkombo.github.io/KilimoLink/ (built with `VITE_API_BASE_URL` pointed at the edge API; CORS is open)
- **Database:** Cloudflare D1 (SQLite), binding `DB`, database `kilimolink`

## Layout

```
web/functions/api/v1/[[path]].js   — full API router (port of the NestJS backend)
web/functions/_lib/util.js         — responses, CORS, row shaping (passwordHash stripped)
web/functions/_lib/crypto.js       — PBKDF2-SHA256 password/OTP hashing (WebCrypto)
web/functions/_lib/jwt.js          — HS256 JWT sign/verify (WebCrypto), same {sub, role} payload
web/functions/_lib/data.js         — PRICE_TRUTH, oracle averages, seed datasets
web/db/schema.sql                  — D1 schema (SQLite port of prisma/schema.prisma)
web/wrangler.toml                  — Pages project + D1 binding
```

## Deploy / operate

```bash
cd kilimolink/web
npm run build                                  # PAGES_BASE=/ VITE_API_BASE_URL=/api/v1 for CF Pages
npx wrangler pages deploy dist --project-name kilimolink --branch master
npx wrangler d1 execute kilimolink --remote --file db/schema.sql   # schema (idempotent)
```

Secrets (Pages → kilimolink → Settings): `JWT_SECRET` (required, strong random),
`ADMIN_EMAILS` (comma-separated admin logins for `POST /auth/login-email`),
`MOCK_PAYMENTS=true`, `DEV_OTP=true` (returns `devCode` in send-otp responses until an
SMS provider is wired — remove for real phone auth).

Demo dataset: `GET /api/v1/seed?key=seedme-2024` (idempotent, slug ids match
`/ai/price-truth/:slug`). Admin dataset: `POST /api/v1/admin/seed` (ADMIN role only).

## Intentional deviations from the NestJS backend

1. **`passwordHash` is never returned** (Node port leaked it in every user payload).
2. **PBKDF2-SHA256 (100k iters)** replaces bcrypt (unavailable in Workers). Hash format `pbkdf2$<salt>$<hash>`; databases are separate so no cross-compat needed.
3. **Deletes fail gracefully:** `DELETE /products/:id` with existing orders and `DELETE /users/me` with linked orders return 400 with a message instead of a 500 FK crash.
4. No Redis caching layer (D1 is fast enough at this scale); no request throttler (Cloudflare edge rate limiting applies).
5. Not ported (unused by the web app): `AdminUser` table + `POST /admin/auth/login` (admin access is via `ADMIN_EMAILS` + `login-email`), `/admin/audit-logs`, `DELETE /admin/users/:id`, notifications.

Everything else — routes, payloads, status codes, validation messages, pagination shape,
Haversine distance sort, impact formulas, PRICE_TRUTH/oracle data — matches
`backend/src` 1:1 (see git history of this file's introduction for the contract audit).
