import React from "react";
import { APP_TITLE } from "../config";

const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "airdrop", label: "Social Tasks" },
  { key: "holderRewards", label: "Holder Rewards" }
];

export default function SideMenu({ active, onSelect, collapsed, onToggle }) {
  return (
    <aside className={`bg-white p-4 rounded-2xl shadow-card h-full flex flex-col`} style={{ width: collapsed ? 80 : 260 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--greenleaf)] flex items-center justify-center text-white font-bold">G</div>
          {!collapsed && <div>
            <div className="text-lg font-semibold">{APP_TITLE}</div>
            <div className="text-xs text-slate-400">Greenleaf</div>
          </div>}
        </div>
        <div><button onClick={onToggle} className="p-2 rounded-md hover:bg-slate-100">{collapsed ? "☰" : "⤫"}</button></div>
      </div>

      <nav className="mt-6 flex-1 overflow-auto">
        {MENU_ITEMS.map(it => (
          <div key={it.key} onClick={() => onSelect(it.key)} className={`menu-item ${active === it.key ? "menu-item-active" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[var(--greenleaf)]">{it.label[0]}</div>
            {!collapsed && <span>{it.label}</span>}
          </div>
        ))}
      </nav>

      <div className="mt-4">
        {!collapsed && <div className="text-xs text-slate-500">Connected: <strong>—</strong></div>}
        <div className="mt-2">
          <button className="btn-primary w-full">Connect Wallet</button>
        </div>
      </div>
    </aside>
  );
}