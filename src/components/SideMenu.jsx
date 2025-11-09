// src/components/SideMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { APP_TITLE } from "../config";

const ENABLE_SETTINGS = (import.meta.env.VITE_ENABLE_SETTINGS === "true"); // default: false

export default function SideMenu({ active, onSelect, collapsed, onToggle }) {
  const [openMore, setOpenMore] = useState(false);
  const ref = useRef(null);

  // বাইরে ক্লিক করলে পপওভার বন্ধ
  useEffect(() => {
    function onDocClick(e){
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpenMore(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : "sidebar-wide"}`} ref={ref}>
      {/* Brand + controls */}
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

        <div className="flex items-center gap-1">
          {/* 3-dot more */}
          <button
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="More"
            onClick={() => setOpenMore(v => !v)}
            title="More"
          >
            ⋮
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
            title="Collapse"
          >
            {collapsed ? "☰" : "⟨⟩"}
          </button>
        </div>
      </div>

      {/* Primary nav: only Dashboard */}
      <nav className="px-3 pb-4 flex-1 overflow-auto">
        <div
          onClick={() => onSelect("dashboard")}
          className={`menu-item ${active === "dashboard" ? "menu-item-active" : ""}`}
        >
          <div className="menu-icon">🏠</div>
          {!collapsed && <span className="menu-label">Dashboard</span>}
        </div>
      </nav>

      {/* Backdrop for popover */}
      {openMore && <div className="popover-backdrop" onClick={() => setOpenMore(false)} />}

      {/* Popover menu with the rest */}
      {openMore && (
        <div
          className="popover"
          style={{
            right: collapsed ? 8 : 12,
            top: 64
          }}
        >
          <div className="popover-item" onClick={() => { onSelect("airdrop"); setOpenMore(false); }}>
            <span>🪂</span> <span>Social Tasks</span>
          </div>
          <div className="popover-item" onClick={() => { onSelect("holderRewards"); setOpenMore(false); }}>
            <span>💰</span> <span>Holder Rewards</span>
          </div>
          {ENABLE_SETTINGS && (
            <div className="popover-item" onClick={() => { onSelect("settings"); setOpenMore(false); }}>
              <span>⚙️</span> <span>Settings</span>
            </div>
          )}
        </div>
      )}

      <div className="p-3 text-[10px] text-slate-400">{!collapsed && "© Greenleaf"}</div>
    </aside>
  );
}