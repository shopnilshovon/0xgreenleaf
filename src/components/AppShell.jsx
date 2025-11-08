import React, { useState } from "react";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import PoolsGrid from "./PoolsGrid";
import Modal from "./Modal";
import WalletConnect from "./WalletConnect";
import SettingsPanel from "./SettingsPanel";
import { APP_TITLE } from "../config";

export default function AppShell() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <SideMenu active={active} onSelect={setActive} collapsed={collapsed} onToggle={() => setCollapsed(s => !s)} />
        </div>

        <div className="lg:col-span-9">
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{APP_TITLE} Dashboard</h2>
              <div className="flex items-center gap-3">
                <WalletConnect />
                <button className="px-3 py-2 rounded-xl border" onClick={() => setOpenSettings(true)}>Settings</button>
              </div>
            </div>

            <TopBar />
            <div className="mt-6">
              <PoolsGrid />
            </div>
          </div>
        </div>
      </div>

      <Modal open={openSettings} onClose={() => setOpenSettings(false)} title="Settings">
        <SettingsPanel />
      </Modal>
    </div>
  );
}
