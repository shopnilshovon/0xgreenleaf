// src/components/AppShell.jsx
import React, { useState } from "react";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import PoolsGrid from "./PoolsGrid";
import Modal from "./Modal";
import WalletConnect from "./WalletConnect";
import SettingsPanel from "./SettingsPanel";
import SocialTasks from "./SocialTasks";
import HolderRewards from "./HolderRewards";
import BottomNav from "./BottomNav";
import { APP_TITLE } from "../config";

const ENABLE_SETTINGS = (import.meta.env.VITE_ENABLE_SETTINGS === "true"); // default false

export default function AppShell() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const handleSelect = (k) => {
    if (k === "settings" && ENABLE_SETTINGS) {
      setOpenSettings(true);
    } else {
      setActive(k);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block md:col-span-3">
          <SideMenu
            active={active}
            onSelect={handleSelect}
            collapsed={collapsed}
            onToggle={() => setCollapsed((s) => !s)}
          />
        </div>

        <div className="md:col-span-9">
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{APP_TITLE} Dashboard</h2>
              <div className="flex items-center gap-3">
                <WalletConnect />
                {/* header settings removed for clean look */}
              </div>
            </div>

            <TopBar />

            <div className="mt-6">
              {active === "dashboard" && <PoolsGrid />}
              {active === "airdrop" && <SocialTasks />}
              {active === "holderRewards" && <HolderRewards />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav active={active} onSelect={setActive} />

      {/* Settings modal (optional) */}
      {ENABLE_SETTINGS && (
        <Modal open={openSettings} onClose={() => setOpenSettings(false)} title="Settings">
          <SettingsPanel />
        </Modal>
      )}
    </div>
  );
}