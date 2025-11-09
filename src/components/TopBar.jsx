// src/components/TopBar.jsx
import React from "react";
export default function TopBar() {
  return (
    <div className="mt-4 border rounded-xl p-4 bg-white/60">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Stake GLF, complete social tasks and earn rewards.</div>
        <div className="badge">Polygon Mainnet</div>
      </div>
    </div>
  );
}