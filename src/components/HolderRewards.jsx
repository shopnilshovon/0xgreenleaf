import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { TOKEN_SYMBOL } from "../config";
import { getTokenContract } from "../lib/web3";

const TOKEN_ADDR = import.meta.env.VITE_TOKEN_ADDRESS;

export default function HolderRewards() {
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [estimatedShare, setEstimatedShare] = useState(null);

  useEffect(() => {
    // read token balance for connected user if possible (UI-only)
    async function loadDemo() {
      if (!window.ethereum || !TOKEN_ADDR) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (!accounts || !accounts.length) return;
        const user = accounts[0];
        const token = getTokenContract(TOKEN_ADDR, provider);
        // totalSupply may not exist in minimal ABI; safe call
        const [rawBal, supply] = await Promise.allSettled([
          token.balanceOf(user),
          token.totalSupply ? token.totalSupply() : Promise.resolve(null)
        ]);
        const decimals = await token.decimals();
        if (rawBal.status === "fulfilled") {
          setBalance(parseFloat(ethers.formatUnits(rawBal.value, Number(decimals))));
        }
        if (supply.status === "fulfilled" && supply.value) {
          setTotalSupply(parseFloat(ethers.formatUnits(supply.value, Number(decimals))));
        }
      } catch (e) {
        console.error("HolderRewards load error", e);
      }
    }
    loadDemo();
  }, []);

  useEffect(() => {
    // demo: fixed reward pool for calculation
    const rewardPool = 100000; // e.g., 100k GLF monthly
    if (balance != null && totalSupply != null && totalSupply > 0) {
      const share = (balance / totalSupply) * rewardPool;
      setEstimatedShare(Number(share.toFixed(6)));
    } else {
      setEstimatedShare(null);
    }
  }, [balance, totalSupply]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Holder Rewards</h3>
      <p className="text-sm text-slate-500">Holders earn rewards periodically. This demo shows projected share based on your wallet balance.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="text-sm text-slate-500">Your Balance</div>
          <div className="text-2xl font-bold">{balance != null ? `${balance} ${TOKEN_SYMBOL}` : "—"}</div>
        </div>

        <div className="card">
          <div className="text-sm text-slate-500">Estimated Monthly Reward</div>
          <div className="text-2xl font-bold">{estimatedShare != null ? `${estimatedShare} ${TOKEN_SYMBOL}` : "—"}</div>
          <div className="text-xs text-slate-400 mt-2">Based on example pool of 100,000 GLF.</div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn-primary">Claim Rewards</button>
      </div>
    </div>
  );
}
