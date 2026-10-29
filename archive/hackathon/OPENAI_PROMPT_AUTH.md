# KilimoLink Direct — Auth (OTP + Password)

## Context
NestJS + Prisma + PostgreSQL backend at `kilimolink/backend/`. React 19 + Vite + MUI v6 frontend at `kilimolink/web/`. Build: `npm run build && npm test` (web), `npx jest --passWithNoTests` (backend).

## Prisma (`prisma/schema.prisma`)
Add `passwordHash String?` to `User` model. The `OtpChallenge` model exists with fields: id, phone, codeHash, expiresAt, usedAt?, userId?, user?, createdAt. `OtpVerifyThrottle` exists with: id, phone, failures, lockedUntil?, updatedAt, createdAt.
Run: `npx prisma migrate dev --name add_password_hash && npx prisma generate`

## auth.service.ts (`backend/src/auth/auth.service.ts`)
Current methods: `loginWithEmail(email,name,role)`, `sendOtp(phone)` (returns `{ok:true, devCode:'123456'}`), `verifyOtp(phone,code)` (upserts user by mock email). Imports: Injectable, UnauthorizedException from @nestjs/common; JwtService; PrismaService; Role enum.

**Rewrite sendOtp(phone)**: Generate 6-digit code (`Math.floor(100000+Math.random()*900000).toString()`). Hash with `bcrypt.hash(code,10)`. Upsert `OtpChallenge`: set codeHash, expiresAt=now+10min, usedAt=null. Return `{ok:true}`. If `NODE_ENV=development`, include `devCode`.

**Rewrite verifyOtp(phone,code)**: Find `OtpChallenge` where phone matches AND usedAt IS NULL AND expiresAt>now(). If none: check/update `OtpVerifyThrottle` — upsert with failures+1. If failures>=3, set lockedUntil=now+10min, throw 429. If found: compare with `bcrypt.compare(code,challenge.codeHash)`. If match: set usedAt=now(), delete throttle, find/create user (email=`${phone}@sms.kilimolink`), return `{token}` signed with `{sub:user.id, role:user.role}`. If no match: increment throttle, throw 401.

**Add register(email,password,name,role)**: Check existing user (409 if exists). `bcrypt.hash(password,10)`. Create user with passwordHash. Return `{token, user}`.

**Add login(email,password)**: Find user by email (404 if none). `bcrypt.compare(password,user.passwordHash)` (401 if wrong). Return `{token, user}`.

## auth.controller.ts (`backend/src/auth/auth.controller.ts`)
Current: `POST login-email` → loginWithEmail, `POST otp` → sendOtp, `POST verify` → verifyOtp.
Add: `POST /auth/register` → register(dto) with body `{email,password,name,role}`. `POST /auth/login` → login(dto) with body `{email,password}`. `GET /auth/me` (JWT guard) → return req.user. Add `@UseGuards(AuthGuard('jwt'))` import.

## App.tsx (`web/src/app/App.tsx`)
Current login dialog has: email TextField, "Sign In" button, "Demo Mode" button. Auth state managed via `authenticated`, `userEmail`, `loginOpen`, `loginError`. On mount: `applyToken('user')` checks localStorage. `handleLogin()` calls `POST /auth/login-email`.

**Replace login dialog**: Add MUI `Tabs` with two tabs: "Password" and "OTP".
- Password tab: email field, password field, "Sign In" button, "Create Account" link/button
- OTP tab: phone field, "Send Code" button, 6-digit code field, "Verify" button
- Register form (toggled from Password tab): email, password, confirm password, name, role dropdown (FARMER/BUYER/TRANSPORTER), "Register" button
- Error handling: catch 401→"Wrong password", 429→"Account locked 15min", OTP expired→"Code expired", too many OTP→"Too many attempts"
- On register/login success: close dialog, set authenticated, store token/role/email/id/name in localStorage keys: `kilimolink_user_token`, `kilimolink_user_role`, `email`, `kilimolink_user_id`, `kilimolink_user_name`
- Keep "Demo Mode (offline)" button — sets demo-token-123 / demo@farmers.co.ke / FARMER
- On mount: check localStorage for token, validate with `GET /auth/me`, clear all auth if 401

## auth.e2e-spec.ts (`backend/test/auth.e2e-spec.ts`)
Rewrite to test: `POST /auth/register`→201 with token+user, `POST /auth/login`→201, `POST /auth/login` wrong password→401, `POST /auth/send-otp`→201 `{ok:true}`, `POST /auth/verify-otp`→201 with token, `GET /auth/me`→200. Use `createMockPrismaService` from `./prisma-mock`.

## Critical
- Do NOT break demo mode (demo-token-123 / demo@farmers.co.ke / FARMER)
- Every endpoint needs E2E tests
- Every frontend feature: loading/empty/error states
- MUI v6 only, no new UI libs
- Build: `cd kilimolink/web && npm run build && npm test`
- Backend tests: `cd kilimolink/backend && npx jest --passWithNoTests`
