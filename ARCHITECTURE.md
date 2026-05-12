# KilimoLink Architecture - May 2026

## Overview
KilimoLink is a decentralized, climate-resilient food marketplace designed for the urban-rural nexus in Kenya. It leverages blockchain (Solana), caching (Redis), and AI to provide a high-trust, low-friction trade environment.

## Tech Stack
- **Frontend**: React 19, Material UI, Framer Motion, p5.js
- **Backend**: NestJS, Prisma, PostgreSQL, Redis
- **Auth**: Privy (Wallet + Social Login)
- **Blockchain**: Solana (Stablecoin payments)
- **Infrastructure**: Vercel (Frontend), Docker (Backend/Redis/DB)

## Core Components

### 1. Market Layer
- **Marketplace**: Hyperlocal produce discovery using geolocation.
- **Listing Engine**: Farmer-friendly interface with AI-assisted descriptions and suggested pricing.
- **Caching**: Redis layer caches all product listings for < 50ms response times.

### 2. Trust Layer
- **Institutional Intelligence**: Direct links between global founders and Kenyan farmers.
- **Proof-of-Trade**: On-chain verification of every transaction.
- **Security**: Strict input validation (DTOs), JWT-based auth, and secret management.

### 3. Payment Layer
- **Stablecoins**: Support for USDC on Solana.
- **Cross-Border (Scaffolded)**: Alipay and Douyin Pay integration for international buyers.

### 4. Resilience & Impact
- **CO2 Tracking**: Algorithmic calculation of carbon savings from local trade.
- **Waste Diversion**: Real-time metrics on food waste reduction.
- **MCP Server**: External data integration for weather and market volatility.

## Design Principles
- **Image-Led Hierarchy**: High-impact visuals anchor the user experience.
- **Restrained Composition**: Minimalist layouts to reduce cognitive load for farmers.
- **Generative Art**: p5.js modules provide a "living" aesthetic to dashboards.

## Future Roadmap
- [ ] React Native mobile app (Expo)
- [ ] Fully integrated weather-based price prediction
- [ ] Real-time logistics tracking via Douyin Space
