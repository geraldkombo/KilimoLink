# Cloud Deployment Guide (Railway & Vercel)

Once your code is on GitHub, follow these steps to go live.

## 1. Backend: Railway Deployment
Railway will host your NestJS API and PostgreSQL database.

1.  **Login to [Railway.app](https://railway.app/)** and click "New Project" -> "Deploy from GitHub repo".
2.  **Select the `KilimoLink` repository**.
3.  **Add a Database**: Click "New" -> "Database" -> "Add PostgreSQL".
4.  **Configure Environment Variables**: Go to the "Variables" tab of your backend service and add:
    - `DATABASE_URL`: (Railway will automatically provide this if you added the PG database).
    - `JWT_SECRET`: (Use a long random string).
    - `DOCUMENTS_MASTER_KEY_BASE64`: (Use the one from your local `.env`).
    - `SOLANA_RPC_URL`: `https://cool-sparkling-putty.solana-devnet.quiknode.pro/193e15a0bf88b4b6cb225aed43ff6c92b221fd42`
    - `SOLANA_WSS_URL`: `wss://cool-sparkling-putty.solana-devnet.quiknode.pro/193e15a0bf88b4b6cb225aed43ff6c92b221fd42`
    - `PORT`: `3000`
5.  **Root Directory**: Ensure the "Root Directory" in settings is set to `/backend`.

## 2. Frontend: Vercel Deployment
Vercel will host your React/Vite application.

1.  **Login to [Vercel.com](https://vercel.com/)** and click "Add New" -> "Project".
2.  **Import your `KilimoLink` repository**.
3.  **Configure Project Settings**:
    - **Framework Preset**: Vite.
    - **Root Directory**: `web`.
4.  **Add Environment Variables**:
    - `VITE_API_BASE_URL`: (Your Railway backend URL + `/api/v1`, e.g., `https://backend-production.up.railway.app/api/v1`).
    - `VITE_SOLANA_RPC_URL`: `https://cool-sparkling-putty.solana-devnet.quiknode.pro/193e15a0bf88b4b6cb225aed43ff6c92b221fd42`
    - `VITE_PRIVY_APP_ID`: `cmp000ywe01mm0cldpk8r2kt7`
5.  **Click Deploy**.

## 3. Post-Deployment Verification
- Visit your Vercel URL to see the app.
- Try logging in with Privy (Email/Phone).
- Visit `https://your-backend.railway.app/docs` to see the live Swagger API documentation.
