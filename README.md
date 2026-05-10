# KilimoLink: Decentralized Urban-Rural Exchange

**KilimoLink** is a transparent marketplace and climate-action tracker designed to connect urban consumers directly with climate-resilient local producers across East Africa.

## What it Is
At its core, **KilimoLink** is a functional bridge between the city and the farm. It solves the lack of transparency in the agricultural supply chain by using the Solana blockchain to verify transactions, track carbon impact, and manage municipal agricultural funds.

## Key Components
- **The Marketplace**: A direct-to-consumer platform for urban residents to buy produce from local farmers.
- **Climate Tracking**: Real-time measurement of carbon emissions saved by choosing local sourcing over long-distance imports.
- **Governance Dashboard**: A multi-role administrative tool for city officials to oversee agricultural cooperatives and manage funds via Squads multisig.
- **Identity & Verification**: Secure, wallet-based verification for farmers and businesses to ensure trust and accountability.

## 2026 Developer Stack
- **Backend**: NestJS, Prisma, PostgreSQL (Neon), BullMQ (Redis).
- **Frontend**: React (Vite), Material UI, TanStack Query.
- **Blockchain Protocol**: Solana (Quiknode Premium RPC).
- **Identity & Onboarding**: 
    - **Privy**: Email-to-Wallet onboarding for urban farmers.
    - **Phantom Connect**: Native wallet support for experienced users.
- **Financial Operations**: **Altitude** (by Squads) for business-grade treasury, APY yield, and ACH/SWIFT payouts.
- **Payments**: **x402 protocol** for pay-per-query agricultural data monetization.

## Network Resilience
Due to recent Devnet resets, **KilimoLink** is configured to prioritize **Quiknode Premium RPC** endpoints with automatic fallbacks to public nodes, ensuring the marketplace remains operational during network maintenance periods.

## Quickstart (Local)

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Setup Environment**:
   Create a `.env` file in `backend/` (see `backend/.env` for values provided by the Colosseum resources).

3. **Run Services**:
   ```bash
   pnpm dev
   ```

API: http://localhost:3000/api/v1  
Swagger: http://localhost:3000/docs  
Web: http://localhost:5173

## Colosseum Hackathon Resources
This project uses several sponsor tools from the Colosseum hackathon:
- **Phantom**: For wallet integration.
- **Quiknode**: For high-performance Solana RPC.
- **Neon**: For serverless PostgreSQL.
