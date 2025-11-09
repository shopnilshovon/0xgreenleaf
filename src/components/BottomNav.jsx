// src/components/BottomNav.jsx
import React from "react";

export default function BottomNav({ active, onSelect }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "airdrop", label: "Tasks", icon: "🪂" },
    { key: "holderRewards", label: "Rewards", icon: "💰" },
  ];

  return (
    <nav className="bottom-nav md:hidden">
      {items.map((it) => (
        <button
          key={it.key}
          className={`bottom-nav-item ${active === it.key ? "bottom-nav-active" : ""}`}
          onClick={() => onSelect(it.key)}
        >
          <span className="text-lg">{it.icon}</span>
          <span className="text-[11px]">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}