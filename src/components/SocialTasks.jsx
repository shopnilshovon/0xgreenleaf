import React from "react";

/*
  SocialTasks.jsx
  UI-only demo for social tasks (airdrop). Replace the placeholder links/actions
  with actual verification/backend hooks when ready.
*/
export default function SocialTasks() {
  const tasks = [
    { id: "follow", title: "Follow @greenleaf_token on X", reward: "50 GLF", status: "incomplete" },
    { id: "join", title: "Join our Telegram", reward: "30 GLF", status: "incomplete" },
    { id: "retweet", title: "Retweet pinned tweet", reward: "20 GLF", status: "incomplete" }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Airdrop — Social Tasks</h3>
      <p className="text-sm text-slate-500">Complete tasks below to become eligible for the airdrop. Verification is demo-only — we'll plug a backend later.</p>

      <div className="grid gap-4">
        {tasks.map(t => (
          <div key={t.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-slate-400">Reward: {t.reward}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-xl border">Open</button>
                <button className="btn-primary">Verify</button>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">Status: <strong>{t.status}</strong></div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-sm text-slate-600">Note: This is a UI demo. To make verification secure, integrate backend checks or EIP-712 signed vouchers.</div>
      </div>
    </div>
  );
}
