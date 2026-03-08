# 🚀 CryptoAI: AI-Driven Cryptocurrency Analytics & Blockchain Prediction Platform

![CryptoAI Banner](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop)

### 💎 The Future of Crypto Intelligence

**CryptoAI** is a premium, glassmorphism-styled analytics platform that combines **Machine Learning**, **Real-time Blockchain Analytics**, and **Smart Contracts** to provide a futuristic trading insights dashboard.

---

## ✨ Key Features

- 🌌 **Glassmorphism UI**: A stunning, futuristic dark theme with neon accents and fluid animations.
- 🤖 **Dual-AI Engine**:
  - **Standard**: Fast Linear Regression for quick price projections.
  - **Gemini AI**: Advanced trend analysis and sentiment projection (requires API key).
- ⛓️ **Blockchain Ledger**: All predictions are signed via MetaMask and stored on a local Ethereum network using Solidity.
- 📊 **Real-time Analytics**: Live price feeds for BTC, ETH, and SOL powered by CoinGecko.
- 📈 **Dynamic Charts**: Interactive price trajectory visualizations using Chart.js.

---

## 🛠️ Technology Stack

| Component      | Technology                               |
| :------------- | :--------------------------------------- |
| **Frontend**   | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| **Styling**    | Glassmorphism, CSS Variables, Animations |
| **Charts**     | Chart.js 4.x                             |
| **Blockchain** | Solidity, Hardhat, Ethers.js             |
| **Wallet**     | MetaMask Integration                     |
| **AI/ML**      | Gemini 1.5 Flash / Linear Regression     |

---

## 🚀 Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MetaMask Extension](https://metamask.io/)
- [Hardhat](https://hardhat.org/)

### 2. Blockchain Setup

```bash
cd blockchain
npm install
npx hardhat node
```

_In a new terminal:_

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Frontend Setup

1. Open `frontend/app.js` and paste your **Gemini API Key** (optional).
2. Open `frontend/index.html` using a local server (e.g., VS Code Live Server).
3. Connect your MetaMask to **Localhost 8545**.

---

## 📂 Project Structure

```text
crypto-ai-platform/
├── blockchain/          # Smart contract & Hardhat config
│   ├── contracts/       # Solidity sources
│   ├── scripts/         # Deployment scripts
│   └── hardhat.config.js
└── frontend/            # Web application
    ├── index.html       # UI Structure
    ├── style.css        # Futuristic Styles
    ├── app.js           # Core Logic
    ├── prediction.js    # AI Engine
    └── blockchain.js    # Web3 Integration
```

---

## 🎨 Design Philosophy

The UI is inspired by modern analytics tools like **Glassnode** and **TradingView**, utilizing:

- **Depth**: Multi-layered backdrop filters.
- **Glow**: Neon `box-shadow` and `text-shadow` effects.
- **Motion**: Smooth CSS transitions and SVG stardust backgrounds.

---

## 🛡️ Security & Integrity

- **Decentralized History**: Prediction logs are immutable once stored on the blockchain.
- **Non-Custodial**: Your wallet, your data.

---

## 🤝 Contributing

Feel free to fork this project and add new AI models or chain support!

**Author**: OM1246
**License**: MIT
