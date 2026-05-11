# KilimoLink: Hyperlocal Urban Food Resilience

**KilimoLink** is a direct-to-city marketplace designed for the **Innovate4Cities 2026** challenge. It connects urban residents with nearby farmers to reduce food waste and transport emissions.

## 🎯 Our Mission
To build climate-resilient cities by decentralizing food supply chains and empowering urban agricultural producers in informal settlements.

## ✨ Key Features
- **📍 Geolocation Market**: Find produce within walking distance of your home.
- **🌱 Impact Dashboard**: Real-time tracking of CO2 savings and waste diversion.
- **🤖 AI Price Suggestion**: Fair trade pricing powered by DeepSeek AI.
- **💳 Hybrid Payments**: Instant mock payments or Solana devnet settlements.

## 🚀 Tech Stack
- **Frontend**: React (Vite), Material UI, Leaflet, Recharts.
- **Backend**: NestJS, Prisma, OpenAI (DeepSeek).
- **Auth**: Privy (Email-to-Wallet).
- **Hosting**: Vercel (Web), Railway (API).

## 🛠️ Quick Start

1. **Clone & Install**:
   ```bash
   pnpm install
   ```

2. **Database Setup**:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

3. **Run Dev**:
   ```bash
   pnpm dev
   ```

## 📄 Documentation
- [I4C Submission](docs/I4C26_SUBMISSION.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Technical Overview](docs/TECHNICAL_OVERVIEW.md)

## 🏆 Hackathon Context
Built for **Innovate4Cities 2026** and the **Colosseum Agent Hackathon**.
- **City Resilience**: Focus on informal settlements and hyperlocal logistics.
- **Solana Integration**: Leveraging Privy for seamless on-chain identity and payments.
