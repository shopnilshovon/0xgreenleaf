import React, { useState } from "react";

export default function SettingsPanel() {
  const [token, setToken] = useState(import.meta.env.VITE_TOKEN_ADDRESS || "");
  const [staking, setStaking] = useState(import.meta.env.VITE_STAKING_ADDRESS || "");
  const [chain, setChain] = useState(import.meta.env.VITE_CHAIN_ID || "0x13881");

  function save() {
    alert("This demo reads env variables at build time. For runtime config, host a /config.json or update Vercel envs.");
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-slate-500">Token Address</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} className="mt-2 w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Staking Contract</label>
          <input value={staking} onChange={(e) => setStaking(e.target.value)} className="mt-2 w-full border rounded-xl px-3 py-2" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Chain ID</label>
          <input value={chain} onChange={(e) => setChain(e.target.value)} className="mt-2 w-full border rounded-xl px-3 py-2" />
        </div>
      </div>

      <div className="mt-4 text-right">
        <button className="btn-primary" onClick={save}>Save</button>
      </div>
    </div>
  );
}
