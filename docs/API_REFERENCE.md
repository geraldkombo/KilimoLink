# API Reference

Base URL: `/api/v1`

Swagger/OpenAPI: `/docs`

## Auth

- `POST /auth/otp` `{ phone }` → sends OTP (TextBee via queue)
- `POST /auth/verify` `{ phone, code }` → returns `{ token }`

## Business Profiles

- `POST /businesses` (Bearer token) → upsert business profile
- `GET /businesses/me` (Bearer token) → current business profile

## Users

- `GET /users/me` (Bearer token)
- `POST /users/me/consent` (Bearer token) `{ consentSms, consentPush }`
- `DELETE /users/me` (Bearer token)

## Market

- `GET /products?category=&county=&minPrice=&maxPrice=&search=`
- `POST /products` (Bearer token) → list produce for sale
- `PATCH /products/:id` (Bearer token)
- `DELETE /products/:id` (Bearer token)
- `POST /orders` (Bearer token) → place order
- `GET /orders/:id`
- `PATCH /orders/:id/status` (Bearer token)
- `GET /products/:id/reviews`
- `POST /products/:id/reviews` (Bearer token, requires delivered order)

## Admin

- `POST /admin/auth/login` `{ email, password, totp? }`
- `GET /admin/analytics` (Bearer admin token)

## Donor

- `GET /donor/impact-metrics` (public, aggregated only)
- `GET /donor/impact-metrics/export.csv` (public)

## Future Extensions (Grant Readiness)

- `GET /oracle/prices?product=&region=` → fetches verified statistical data (KNBS-aligned)
- `POST /governance/proposals` (Bearer token) → submit cooperative fund proposal
- `GET /governance/proposals/:id/votes` → track on-chain multisig/DAO votes
- `GET /market/disruption-alerts` → real-time alerts based on NDMA drought phases
