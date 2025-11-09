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
import { APP_TITLE } from "../config";

const SHOW_SETTINGS_BUTTON = (import.meta.env.VITE_SHOW_SETTINGS === "true"); // optional flag

export default function AppShell() {
  const [active, setActive] = useState("dashboard"); // dashboard | airdrop | holderRewards | settings
  const [collapsed, setCollapsed] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <SideMenu
            active={active}
            onSelect={(k) => {
              setActive(k);
              if (k === "settings") setOpenSettings(true); // settings menu খুললে modal open
            }}
            collapsed={collapsed}
            onToggle={() => setCollapsed(s => !s)}
          />
        </div>

        <div className="lg:col-span-9">
          <div className="card">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{APP_TITLE} Dashboard</h2>
              <div className="flex items-center gap-3">
                <WalletConnect />
                {SHOW_SETTINGS_BUTTON && (
                  <button className="px-3 py-2 rounded-xl border" onClick={() => setOpenSettings(true)}>
                    Settings
                  </button>
                )}
              </div>
            </div>

            <TopBar />

            {/* Content */}
            <div className="mt-6">
              {active === "dashboard" && <PoolsGrid />}
              {active === "airdrop" && <SocialTasks />}
              {active === "holderRewards" && <HolderRewards />}
              {/* settings view আমার modal-এই খোলা হচ্ছে */}
            </div>
          </div>
        </div>
      </div>

      {/* Settings modal always available but header button hidden by default */}
      <Modal open={openSettings} onClose={() => setOpenSettings(false)} title="Settings">
        <SettingsPanel />
      </Modal>
    </div>
  );
}