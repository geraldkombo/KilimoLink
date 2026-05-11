# KilimoLink: Decentralized Urban-Rural Exchange

**KilimoLink** is a transparent marketplace and climate-action tracker designed to connect urban consumers directly with climate-resilient local producers across East Africa.

## What it Is
At its core, **KilimoLink** is a functional bridge between the city and the farm. It solves the lack of transparency in the agricultural supply chain by using the Solana blockchain to verify transactions, track carbon impact, and manage municipal agricultural funds.

## Key Components
- **The Marketplace**: A direct-to-consumer platform for urban residents to buy produce from local farmers.
- **Climate Tracking**: Real-time measurement of carbon emissions saved by choosing local sourcing over long-distance imports.
- **Governance Dashboard**: A multi-role administrative tool for cooperative managers to oversee internal fund allocation and manage member disbursements via Squads multisig.
- **Identity & Verification**: Secure, wallet-based verification for farmers and businesses to ensure trust and accountability.

## 2026 Developer Stack
- **Backend**: NestJS, Prisma, PostgreSQL (Neon), BullMQ (Redis).
- **Frontend**: React (Vite), Material UI, TanStack Query.
- **Blockchain Protocol**: Solana (Quiknode Premium RPC).
- **Identity & Onboarding**: 
    - **Privy**: Email-to-Wallet onboarding for urban farmers.
    - **Phantom Connect**: Native wallet support for experienced users.
- **Financial Operations**: **Altitude** (by Squads) for business-grade treasury, APY yield, and ACH/SWIFT payouts.

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

## GitHub Repository
https://github.com/geraldkombo/KilimoLink

## Documentation
Explore the full depth of the KilimoLink protocol:
- **[Project Thesis](file:///docs/PROJECT_THESIS.md)**: Our vision for the African urban-rural nexus.
- **[Pitch Deck Content](file:///docs/PITCH_DECK_CONTENT.md)**: Strategy and slides for institutional investors.
- **[Cooperative Standards](file:///docs/OFFICIAL_MANDATES.md)**: Alignment with SACCO frameworks and UN SDGs.
- **[API Reference](file:///docs/API_REFERENCE.md)**: Detailed documentation for developers and integrators.
- **[User Manual](file:///docs/USER_MANUAL.md)**: Step-by-step guide for farmers and agribusinesses.
- **[Security Audit](file:///docs/SECURITY_AUDIT.md)**: MAESTRO-style threat model and data protection (DPA 2019).

## Colosseum Hackathon Resources
This project leverages the official Colosseum developer tools:
- **Colosseum Copilot**: For deep ecosystem research and market gap analysis.
- **Colosseum Resources**: For identifying optimal Solana build paths and sponsor integrations.
