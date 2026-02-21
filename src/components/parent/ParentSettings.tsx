"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { DEMO_CHILDREN } from "@/lib/parent-demo-data";
import { DEMO_PARENT_SETTINGS } from "@/lib/parent-demo-data";

export default function ParentSettings() {
  const [settings, setSettings] = useState(DEMO_PARENT_SETTINGS);
  const [frequency, setFrequency] = useState<string>(settings.reportFrequency);

  const notifLabels: Record<string, { label: string; emoji: string; alwaysOn?: boolean }> = {
    milestones: { label: "Milestones & Achievements", emoji: "🏆", alwaysOn: true },
    weeklyReports: { label: "Weekly AI Reports", emoji: "📊" },
    revisionBacklog: { label: "Revision Backlog Alerts", emoji: "🟡" },
    sparkResults: { label: "SPARK Test Results", emoji: "⚡" },
    streaks: { label: "Streaks & Breaks", emoji: "🔥" },
    revisionHandoff: { label: "Revision Handoff (3 fails)", emoji: "🩷" },
    mastery: { label: "R10 Mastery Celebration", emoji: "🥇" },
    boardExam: { label: "Board Exam Updates", emoji: "🎯" },
  };

  return (
    <div className="space-y-6">
      {/* Linked Children */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
      >
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>👨‍👩‍👧</span> Linked Children
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{DEMO_CHILDREN.length}/3</span>
        </h3>
        <div className="space-y-3">
          {DEMO_CHILDREN.map((child, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <span className="text-lg">{child.avatar}</span>
                <div>
                  <div className="text-sm font-medium text-slate-300">{child.name}</div>
                  <div className="text-[10px] text-slate-500">Class {child.class}{child.section} · {child.school}</div>
                </div>
              </div>
              <button className="text-[10px] px-2 py-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                Unlink
              </button>
            </div>
          ))}
        </div>
        <button className="mt-3 text-xs px-4 py-2 rounded-xl bg-teal/10 text-teal hover:bg-teal/20 transition-colors font-semibold">
          + Add Child
        </button>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
      >
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🔔</span> Notification Preferences
        </h3>
        <div className="space-y-3">
          {Object.entries(notifLabels).map(([key, { label, emoji, alwaysOn }]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <span>{emoji}</span> {label}
                {alwaysOn && <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal/10 text-teal">Always on</span>}
              </span>
              <ToggleSwitch
                enabled={settings.notifications[key as keyof typeof settings.notifications]}
                onChange={alwaysOn ? undefined : () => {
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [key]: !settings.notifications[key as keyof typeof settings.notifications],
                    },
                  });
                }}
                size="sm"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
      >
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>📅</span> Report Frequency
        </h3>
        <div className="flex gap-2">
          {(["daily", "weekly", "bi-weekly"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize
                ${frequency === f
                  ? "bg-teal/20 text-teal border border-teal/30"
                  : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Acceleration Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
      >
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <span>⚡</span> Revision Acceleration
        </h3>
        <p className="text-[11px] text-slate-500 mb-4">
          When enabled, 3 consecutive perfect revision scores lets your child skip 1 R-stage.
        </p>
        <div className="space-y-3">
          {DEMO_CHILDREN.map((child, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{child.avatar} {child.name} (Class {child.class})</span>
              <ToggleSwitch
                enabled={settings.accelerationByChild[i]}
                onChange={() => {
                  const next = [...settings.accelerationByChild];
                  next[i] = !next[i];
                  setSettings({ ...settings, accelerationByChild: next });
                }}
                size="sm"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Other Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
      >
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🔐</span> Account & Privacy
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            🔗 Link 2nd Parent (via OTP)
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            📥 Export All Data
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            🏫 Enter School Code
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            🌐 Language: English
          </button>
        </div>
      </motion.div>
    </div>
  );
}
