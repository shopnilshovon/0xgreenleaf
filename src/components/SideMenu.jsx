// src/components/SideMenu.jsx
import React from "react";
import { APP_TITLE } from "../config";

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "airdrop", label: "Social Tasks", icon: "🪂" },
  { key: "holderRewards", label: "Holder Rewards", icon: "💰" },
  { key: "settings", label: "Settings", icon: "⚙️" }
];

export default function SideMenu({ active, onSelect, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : "sidebar-wide"}`}>
      {/* Brand + collapse */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--greenleaf)] text-white font-bold flex items-center justify-center">
            G
          </div>
          {!collapsed && (
            <div>
              <div className="text-lg font-semibold">{APP_TITLE}</div>
              <div className="text-xs text-slate-400">Greenleaf</div>
            </div>
          )}
        </div>
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-slate-100" aria-label="toggle menu">
          {collapsed ? "☰" : "⟨⟩"}
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 pb-4 flex-1 overflow-auto">
        {MENU.map(item => (
          <div
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`menu-item ${active === item.key ? "menu-item-active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <div className="menu-icon">{item.icon}</div>
            {!collapsed && <span className="menu-label">{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* footer space (clean end) */}
      <div className="p-3 text-[10px] text-slate-400">{!collapsed && "© Greenleaf"}</div>
    </aside>
  );
}