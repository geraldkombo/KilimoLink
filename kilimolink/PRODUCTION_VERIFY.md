# KilimoLink Direct — Production Verification Runbook

Use this after merging the final MR.

## 1. Backend on Render

Expected service settings:

- Runtime: Node
- Root directory: `kilimolink/backend`
- Build command: `npm ci && npx prisma generate && npm run build`
- Start command: `npm run start`
- Health check path: `/api/v1/health`

Required env vars:

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- `DISABLE_REDIS=true` unless Redis is provisioned
- `MOCK_PAYMENTS=true` for demo

Verify:

```bash
curl -i https://kilimolink.onrender.com/api/v1/health
curl -i https://kilimolink.onrender.com/docs
curl -i https://kilimolink.onrender.com/api/v1/products
```

Pass condition:

- Health returns HTTP 200.
- Docs route loads.
- Products endpoint returns JSON or an authenticated/validation response, not Render 404.

If Render returns 404:

- Confirm the Render service points to this repo/branch.
- Confirm `rootDir` is `kilimolink/backend` if using `render.yaml`.
- Confirm start command is `npm run start`, not a missing `start:prod` script.
- Confirm logs show `KilimoLink API running on port ...`.
- Confirm global prefix means API routes are under `/api/v1/*`.

## 2. Frontend on GitHub Pages

Verify:

```text
https://geraldkombo.github.io/KilimoLink/
https://geraldkombo.github.io/KilimoLink/market
https://geraldkombo.github.io/KilimoLink/county-dashboard
```

Pass condition:

- Homepage loads.
- Marketplace route loads after hard refresh.
- County dashboard route loads after hard refresh.
- Browser console has no fatal errors.

If deep links 404:

- Confirm `BrowserRouter` is using the Vite base path `/KilimoLink`.
- Confirm `kilimolink/web/public/404.html` is included in the GitHub Pages artifact.
- Confirm GitHub Actions deployed the latest `master`.
- Hard refresh with `Ctrl+Shift+R`.

## 3. Demo tabs to preload

Open these 30 minutes before pitch:

- `https://geraldkombo.github.io/KilimoLink/`
- `https://geraldkombo.github.io/KilimoLink/market`
- `https://geraldkombo.github.io/KilimoLink/sell`
- one product detail page
- `https://geraldkombo.github.io/KilimoLink/county-dashboard`
- `https://kilimolink.onrender.com/api/v1/health`

## 4. Final go/no-go

Go if:

- Backend health is 200.
- Frontend loads with hard refresh.
- County dashboard route works.
- Demo product exists.
- Backup video is ready.
- Unsupported numeric claims are removed or cited in `EVIDENCE_LOG.md`.

No-go only if:

- No frontend, no local build, and no backup video.

Otherwise, pitch with the backup plan.
