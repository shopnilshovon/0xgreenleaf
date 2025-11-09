// src/components/SideMenu.jsx
import React from "react";
import { APP_TITLE } from "../config";

export default function SideMenu({ active, onSelect, collapsed, onToggle }) {
  const MENU = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "airdrop", label: "Social Tasks", icon: "🪂" },
    { key: "holderRewards", label: "Holder Rewards", icon: "💰" },
  ];
  const width = collapsed ? 78 : 260;

  return (
    <aside className="sidebar" style={{ width }}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--greenleaf)] text-white font-bold flex items-center justify-center">G</div>
          {!collapsed && (
            <div>
              <div className="text-lg font-semibold">{APP_TITLE}</div>
              <div className="text-xs text-slate-400">Greenleaf</div>
            </div>
          )}
        </div>
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-slate-100" title="Collapse">
          {collapsed ? "☰" : "⟨⟩"}
        </button>
      </div>

      <nav className="px-3 pb-4 flex-1 overflow-auto">
        {MENU.map((it) => (
          <div
            key={it.key}
            onClick={() => onSelect(it.key)}
            className={`menu-item ${active === it.key ? "menu-item-active" : ""}`}
          >
            <div className="menu-icon">{it.icon}</div>
            {!collapsed && <span className="menu-label">{it.label}</span>}
          </div>
        ))}
      </nav>

      <div className="p-3 text-[10px] text-slate-400">{!collapsed && "© Greenleaf"}</div>
    </aside>
  );
}