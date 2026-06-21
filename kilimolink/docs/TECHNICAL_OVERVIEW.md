# KilimoLink Technical Overview

## Architecture
The platform follows a modern micro-services-lite architecture:
- **Backend**: NestJS provides a robust, type-safe API layer. Prisma ORM handles database abstractions, allowing for easy switching between SQLite (local) and PostgreSQL (production).
- **Frontend**: React (Vite) ensures a fast, responsive user experience. Material UI provides a clean, accessible design system.
- **Identity**: Privy manages the transition from Web2 (email/phone) to Web3 (Solana wallet) without user friction.

## Core Logic
### 1. Distance Sorting (Haversine Formula)
We compute distances on the fly in the `MarketService` to ensure users always see the most climate-efficient options first.
```typescript
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;
// ... a, c calculation ...
const distance = R * c;
```

### 2. Impact Calculation
Metrics are derived from transactional data:
- `co2SavedKg`: Each local order saves an estimated 1kg of CO2 compared to standard logistics.
- `wasteDivertedKg`: Calculated based on the shelf-life preserved by direct trade.

### 3. AI Price Oracle
Integration with DeepSeek via OpenAI SDK provides farmers with real-time pricing guidance based on local market trends.

## Environment Setup
Required variables:
- `VITE_PRIVY_APP_ID`: From Privy Dashboard.
- `MOCK_PAYMENTS`: Set to `true` for demo environments.
- `DATABASE_URL`: Postgres connection string for Railway.
