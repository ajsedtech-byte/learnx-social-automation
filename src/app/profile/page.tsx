"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import { useTier } from "@/context/TierContext";
import { useLanguage } from "@/context/LanguageContext";

const BADGES = [
  { emoji: "🔥", label: "7-Day Streak", earned: true },
  { emoji: "🏏", label: "Century Maker", earned: true },
  { emoji: "🌱", label: "Garden Master", earned: true },
  { emoji: "🧠", label: "SPARK Explorer", earned: true },
  { emoji: "📚", label: "Bookworm", earned: true },
  { emoji: "⚡", label: "Speed Demon", earned: false },
  { emoji: "🎯", label: "Accuracy King", earned: false },
  { emoji: "🏆", label: "Top 10", earned: false },
  { emoji: "💎", label: "Diamond Scholar", earned: false },
  { emoji: "🦚", label: "Peacock Pride", earned: false },
  { emoji: "🎪", label: "All-Rounder", earned: false },
  { emoji: "🌟", label: "Star Student", earned: false },
];

const ACTIVITY_LOG = [
  { time: "Today, 9:15 AM", action: "Completed R3 for Algebra — Quadratic Equations", xp: 45 },
  { time: "Today, 8:30 AM", action: "Daily Blueprint: 5/6 tasks done", xp: 30 },
  { time: "Yesterday, 7:00 PM", action: "SPARK test: Logical-Mathematical improved to Proficient", xp: 100 },
  { time: "Yesterday, 4:30 PM", action: "Fixed mistake: Sign errors in inequalities", xp: 25 },
  { time: "2 days ago", action: "Unlocked Explorer badge: Garden Master 🌱", xp: 50 },
  { time: "2 days ago", action: "Completed Chapter 4: Triangles", xp: 60 },
  { time: "3 days ago", action: "Mock Test #4: 78% (up from 72%)", xp: 80 },
  { time: "4 days ago", action: "Life Skills: Completed 'Time Management' dilemma", xp: 20 },
];

export default function ProfilePage() {
  const { student, tierConfig } = useTier();
  const { t, lang } = useLanguage();
  const [activeSection, setActiveSection] = useState<"overview" | "badges" | "activity" | "settings">("overview");

  const sections = [
    { key: "overview" as const, label: "Overview", emoji: "👤" },
    { key: "badges" as const, label: "Badges", emoji: "🏅" },
    { key: "activity" as const, label: "Activity", emoji: "📋" },
    { key: "settings" as const, label: "Settings", emoji: "⚙️" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-navy text-white relative overflow-hidden">
        <div className="blob blob-indigo w-[500px] h-[500px] -top-40 -right-40 opacity-8" />
        <div className="blob blob-teal w-80 h-80 bottom-40 -left-20 opacity-6" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-6 mb-6"
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: `${tierConfig.accentColor}20` }}
              >
                {student.avatar}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {student.school} &middot; Class {student.class}{student.section} &middot; {tierConfig.label} Tier
                </p>

                {/* Stats row */}
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold" style={{ color: tierConfig.accentColor }}>
                      {student.xp.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-400">{student.streak}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-teal">{student.level}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {student.completedTopics}/{student.totalTopics}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Topics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-rose-400">
                      {BADGES.filter(b => b.earned).length}/{BADGES.length}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Badges</div>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-5">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Level {student.level}</span>
                <span>Level {student.level + 1}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "68%", background: `linear-gradient(90deg, ${tierConfig.accentColor}, ${tierConfig.accentColor}80)` }}
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-1">320 XP to next level</p>
            </div>
          </motion.div>

          {/* Section tabs */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="flex gap-2 mb-6"
          >
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === s.key
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Section Content */}
          <motion.div
            key={activeSection}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {activeSection === "overview" && (
              <div className="space-y-4">
                {/* SPARK Summary */}
                <div className="glass p-5">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span>🧠</span> SPARK Intelligence Profile
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["Logical-Mathematical", "Linguistic", "Spatial", "Musical", "Bodily-Kinesthetic", "Interpersonal"].map((d, i) => (
                      <div key={d} className="glass-sm p-3 text-center">
                        <div className="text-lg font-bold" style={{ color: tierConfig.accentColor }}>
                          {[78, 65, 82, 45, 70, 88][i]}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-5">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <span>📊</span> This Week
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Study Time</span>
                        <span className="font-semibold">4h 32m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Questions Solved</span>
                        <span className="font-semibold">127</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Accuracy</span>
                        <span className="font-semibold text-teal">84%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Revisions Done</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Mistakes Fixed</span>
                        <span className="font-semibold text-amber-400">3</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-5">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <span>🌱</span> Garden Status
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Plants Growing</span>
                        <span className="font-semibold">6</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Fully Bloomed</span>
                        <span className="font-semibold text-teal">2</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Streak Animal</span>
                        <span className="font-semibold">🦋 Butterfly</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Season</span>
                        <span className="font-semibold">🌸 Spring</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Garden Score</span>
                        <span className="font-semibold" style={{ color: tierConfig.accentColor }}>72/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Momentum */}
                <div className="glass p-5">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span>⚡</span> Momentum
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-black" style={{ color: tierConfig.accentColor }}>1.5x</div>
                      <div className="text-[10px] text-slate-500">Multiplier</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Speed</span>
                        <span>72/100</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: "72%" }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-300">#14</div>
                      <div className="text-[10px] text-slate-500">Rank</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "badges" && (
              <div className="glass p-5">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <span>🏅</span> Badge Collection
                  <span className="text-[10px] text-slate-500 font-normal ml-auto">
                    {BADGES.filter(b => b.earned).length} of {BADGES.length} earned
                  </span>
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {BADGES.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`glass-sm p-4 text-center transition-all ${
                        b.earned
                          ? "hover:scale-105 cursor-pointer"
                          : "opacity-40 grayscale"
                      }`}
                    >
                      <div className="text-3xl mb-2">{b.emoji}</div>
                      <div className="text-[10px] font-semibold text-slate-300">{b.label}</div>
                      {b.earned && (
                        <div className="text-[9px] text-teal mt-1">Earned ✓</div>
                      )}
                      {!b.earned && (
                        <div className="text-[9px] text-slate-600 mt-1">Locked 🔒</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "activity" && (
              <div className="glass p-5">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <span>📋</span> Activity Log
                </h3>
                <div className="space-y-1">
                  {ACTIVITY_LOG.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0"
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tierConfig.accentColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 truncate">{a.action}</p>
                        <p className="text-[10px] text-slate-600">{a.time}</p>
                      </div>
                      <div className="text-xs font-bold text-teal flex-shrink-0">+{a.xp} XP</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="space-y-4">
                <div className="glass p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <span>👤</span> {t("profile.edit")}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Display Name", value: student.name },
                      { label: "School", value: student.school },
                      { label: "Class & Section", value: `Class ${student.class}${student.section}` },
                      { label: "Board", value: "CBSE" },
                      { label: "Stream", value: student.class >= 11 ? "PCM (JEE)" : "N/A" },
                    ].map((field) => (
                      <div key={field.label} className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-xs text-slate-400">{field.label}</span>
                        <span className="text-xs font-medium text-slate-200">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <span>🔔</span> Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Daily Reminder", desc: "Get reminded to complete daily blueprint", on: true },
                      { label: "Revision Alerts", desc: "Notify when revisions are due", on: true },
                      { label: "Streak Warning", desc: "Alert before streak breaks", on: true },
                      { label: "Weekly Report", desc: "Send weekly progress to parent", on: false },
                      { label: "Leaderboard Updates", desc: "Notify on rank changes", on: false },
                    ].map((pref) => (
                      <div key={pref.label} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div>
                          <div className="text-xs font-medium text-slate-200">{pref.label}</div>
                          <div className="text-[10px] text-slate-500">{pref.desc}</div>
                        </div>
                        <div
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                            pref.on ? "bg-teal" : "bg-white/10"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              pref.on ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <span>🌐</span> Language & Accessibility
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-slate-400">Language</span>
                      <span className="text-xs font-medium text-slate-200">
                        {{"en": "English", "hi": "हिन्दी", "hinglish": "Hinglish"}[lang]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-slate-400">Font Size</span>
                      <span className="text-xs font-medium text-slate-200">Normal</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-slate-400">Voice Read-Aloud</span>
                      <span className="text-xs font-medium text-teal">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs text-slate-400">Tier</span>
                      <span className="text-xs font-medium" style={{ color: tierConfig.accentColor }}>
                        {tierConfig.emoji} {tierConfig.label} ({tierConfig.classes})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
