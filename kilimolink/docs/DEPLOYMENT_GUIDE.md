# Deployment Guide

## Local (Docker Compose)

1. Copy environment variables:

```bash
cp backend/.env.example backend/.env
```

2. Start services:

```bash
docker compose up --build
```

3. Run database migration and seed (from another terminal):

```bash
cd backend
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

## Production Notes

- Set `JWT_SECRET` and `DOCUMENTS_MASTER_KEY_BASE64` to strong secrets.
- Set `ENABLE_WORKERS=true` on at least one backend instance to process SMS/push queues.
- Configure `TEXTBEE_API_KEY`, `TEXTBEE_SENDER_ID`, `ONESIGNAL_APP_ID`, `ONESIGNAL_API_KEY` for external notifications.
- Put the web app behind HTTPS and lock down Admin routes with network controls.

