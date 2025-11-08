Greenleaf UI — starter demo
===========================

Features:
- React + Vite + Tailwind
- Wallet connect (MetaMask) with auto network switch
- GLF balance display
- 3 staking pools (7/15/30 days) UI with approve->stake flows (hooks to contract)
- Config-driven via .env

Quick start:
1. Copy files into a folder
2. `cp .env.example .env` and fill addresses
3. `npm install`
4. `npm run dev`
5. Open http://localhost:5173

To deploy: push to GitHub, import repo into Vercel, set env vars in Vercel dashboard.

Note: This repo expects a deployed GLF token and a staking contract that matches the ABI in src/abi/Staking.json. If you need solidity contract + hardhat scripts, ask me and I'll add them.
