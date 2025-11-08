import React, { useEffect, useState } from "react";
import { TOKEN_SYMBOL } from "../config";
import { ethers } from "ethers";
import { getTokenContract, getStakingContract } from "../lib/web3";

const TOKEN_ADDR = import.meta.env.VITE_TOKEN_ADDRESS;
const STAKING_ADDR = import.meta.env.VITE_STAKING_ADDRESS;
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "0x13881";

export default function PoolCard({ pool }) {
  const [amount, setAmount] = useState("");
  const [projected, setProjected] = useState("0");
  const [approving, setApproving] = useState(false);
  const [staking, setStaking] = useState(false);
  const [account, setAccount] = useState(null);

  // simplistic UI-only APR read; in manual-APR system APR will come from contract or settings
  const aprBpsDefault = 500; // 5% default if not set (admin will set)
  const aprPercent = aprBpsDefault / 100;

  useEffect(() => {
    // watch account if available via window.ethereum
    (async () => {
      if (window.ethereum) {
        const accs = await window.ethereum.request({ method: "eth_accounts" });
        if (accs && accs.length) setAccount(accs[0]);
        window.ethereum.on("accountsChanged", (a) => { if (a && a.length) setAccount(a[0]); else setAccount(null); });
      }
    })();
  }, []);

  useEffect(() => {
    // compute projected reward for the full lock period
    if (!amount || Number(amount) <= 0) { setProjected("0"); return; }
    const amt = Number(amount);
    const D = pool.days;
    // reward = amount * apr% * (D/365)
    const reward = amt * (aprPercent / 100) * (D / 365);
    setProjected(reward.toFixed(6));
  }, [amount]);

  async function handleApprove() {
    if (!account) return alert("Connect wallet first");
    if (!TOKEN_ADDR || !STAKING_ADDR) return alert("Token or staking address not configured");
    setApproving(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = getTokenContract(TOKEN_ADDR, signer);
      const tx = await token.approve(STAKING_ADDR, ethers.parseUnits(amount || "0", 18));
      await tx.wait();
      alert("Approved");
    } catch (e) {
      console.error(e);
      alert("Approve failed: " + (e.message || e));
    } finally {
      setApproving(false);
    }
  }

  async function handleStake() {
    if (!account) return alert("Connect wallet first");
    if (!STAKING_ADDR) return alert("Staking contract not configured");
    if (!amount || Number(amount) <= 0) return alert("Enter amount");
    setStaking(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const staking = getStakingContract(STAKING_ADDR, signer);
      const amtWei = ethers.parseUnits(amount, 18);
      const tx = await staking.stake(pool.id, amtWei);
      await tx.wait();
      alert("Staked successfully");
      setAmount("");
    } catch (e) {
      console.error(e);
      alert("Stake failed: " + (e.message || e));
    } finally {
      setStaking(false);
    }
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold">{pool.label}</h4>
          <div className="text-xs text-slate-500 mt-1">Lock period: {pool.days} days</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{aprPercent}% APR</div>
          <div className="text-xs text-slate-400">Manual APR</div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm text-slate-600">Amount ({TOKEN_SYMBOL})</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-2" placeholder="0.0" />
        <div className="mt-2 text-sm text-slate-600">Projected reward at end: <strong>{projected} {TOKEN_SYMBOL}</strong></div>

        <div className="mt-4 flex gap-2">
          <button className="btn-primary" onClick={handleApprove} disabled={approving}>{approving ? "Approving..." : "Approve"}</button>
          <button className="px-4 py-2 rounded-xl border" onClick={handleStake} disabled={staking}>{staking ? "Staking..." : "Stake"}</button>
        </div>
      </div>
    </div>
  );
}
