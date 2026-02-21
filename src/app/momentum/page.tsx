"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_MOMENTUM } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import GlassCard from "@/components/ui/GlassCard";
import GaugeRing from "@/components/ui/GaugeRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════════════ */

// XP Multiplier Zones
const MULTIPLIER_ZONES = [
  { minDays: 7, label: "Full momentum", emoji: "\ud83d\ude80", multiplier: 2, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  { minDays: 4, label: "Building speed", emoji: "\ud83c\udfc3", multiplier: 1.5, color: "text-indigo-light", bg: "bg-indigo/15", border: "border-indigo/30" },
  { minDays: 0, label: "Warming up", emoji: "\ud83d\udc22", multiplier: 1, color: "text-amber-400", bg: "bg-amber-400/15", border: "border-amber-400/30" },
];

function getMultiplierZone(streakDays: number) {
  return MULTIPLIER_ZONES.find(z => streakDays >= z.minDays) || MULTIPLIER_ZONES[2];
}

// XP Unlock Rewards
const XP_REWARDS = [
  { xp: 500,  title: "Night Theme",          emoji: "\ud83c\udf19", type: "Profile Theme", unlocked: true },
  { xp: 1000, title: "Scholar",              emoji: "\ud83d\udcda", type: "Title Badge",   unlocked: true },
  { xp: 2000, title: "Galaxy Dashboard",     emoji: "\ud83c\udf0c", type: "Dashboard Skin", unlocked: true },
  { xp: 3000, title: "Scientist",            emoji: "\ud83d\udd2c", type: "Title Badge",   unlocked: true },
  { xp: 4000, title: "Neon Accent Pack",     emoji: "\ud83c\udf08", type: "Profile Theme", unlocked: true },
  { xp: 5000, title: "Achiever",             emoji: "\ud83c\udfc6", type: "Title Badge",   unlocked: false },
  { xp: 7500, title: "Custom Widget Layout", emoji: "\ud83d\udee0\ufe0f", type: "Dashboard Skin", unlocked: false },
  { xp: 10000, title: "Legend",              emoji: "\u2b50", type: "Title Badge",   unlocked: false },
];

// XP Breakdown sources
const XP_SOURCES = [
  { source: "Tutorials completed", xp: 180, emoji: "\ud83d\udcda", pct: 40 },
  { source: "Revision rounds",     xp: 90,  emoji: "\ud83d\udd04", pct: 20 },
  { source: "Mistake fixes",       xp: 68,  emoji: "\ud83d\udd27", pct: 15 },
  { source: "Mastery achievements", xp: 67, emoji: "\ud83c\udfc5", pct: 15 },
  { source: "Streak bonus",        xp: 45,  emoji: "\ud83d\udd25", pct: 10 },
];

// Leaderboard data
const LEADERBOARD = [
  { rank: 1,  name: "Arjun S.",  xp: 620, avatar: "\ud83d\udc66\ud83c\udffd" },
  { rank: 2,  name: "Priya M.",  xp: 580, avatar: "\ud83d\udc67\ud83c\udffd" },
  { rank: 3,  name: "Vikash K.", xp: 540, avatar: "\ud83d\udc66\ud83c\udffb" },
  { rank: 12, name: "Kavya R.",  xp: 460, avatar: "\ud83d\udc69\ud83c\udffd" },
  { rank: 13, name: "Dev P.",    xp: 455, avatar: "\ud83d\udc66\ud83c\udffd" },
  { rank: 14, name: "You",       xp: 450, avatar: "\ud83d\udc69\ud83c\udffd", isYou: true },
  { rank: 15, name: "Neha S.",   xp: 440, avatar: "\ud83d\udc67\ud83c\udffb" },
];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function MomentumPage() {
  const { student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";
  const m = DEMO_MOMENTUM;
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
  const [showRewards, setShowRewards] = useState(false);

  const zone = getMultiplierZone(m.streakDays);
  const currentXP = 4250; // total XP for reward tracking

  const content = (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      <div className="blob blob-indigo w-[500px] h-[500px] -top-40 -right-40 opacity-10" />
      <div className="blob blob-teal w-96 h-96 bottom-40 -left-20 opacity-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* ── Title ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1">{"\u26a1"} Momentum System</h1>
          <p className="text-sm text-slate-400 mb-6">Speed gauge + XP &mdash; keep the momentum going!</p>
        </motion.div>

        {isParentView && (
          <div className="mb-4 p-3 rounded-xl border bg-teal/5 border-teal/20">
            <p className="text-xs font-semibold text-teal">
              Parent View — This shows {student.name}&apos;s learning momentum. XP is earned through tutorials, revision, and practice. Streaks reward consistency, not speed.
            </p>
          </div>
        )}

        {/* ── XP Multiplier Zone Banner ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <div className={`${zone.bg} border ${zone.border} rounded-2xl p-5 mb-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.span
                  className="text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {zone.emoji}
                </motion.span>
                <div>
                  <div className={`text-lg font-black ${zone.color}`}>
                    {zone.label}
                  </div>
                  <div className="text-xs text-slate-400">
                    {m.streakDays}-day streak &middot; XP multiplier active
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-black ${zone.color}`}>
                  {zone.multiplier}x
                </div>
                <div className="text-[10px] text-slate-500">XP Multiplier</div>
              </div>
            </div>
            {/* Zone progression */}
            <div className="mt-4 flex gap-2">
              {MULTIPLIER_ZONES.slice().reverse().map((z, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-lg p-2 text-center text-[10px] ${
                    z.multiplier === zone.multiplier
                      ? `${z.bg} border ${z.border} font-bold`
                      : "bg-white/5"
                  }`}
                >
                  <div className="text-base mb-0.5">{z.emoji}</div>
                  <div className={z.multiplier === zone.multiplier ? z.color : "text-slate-500"}>
                    Day {z.minDays === 0 ? "1-3" : z.minDays === 4 ? "4-7" : "7+"}: {z.multiplier}x
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Dip-not-reset Banner ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}>
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-lg mt-0.5">{"\u2139\ufe0f"}</span>
            <div>
              <div className="text-sm font-bold text-sky-300">Dip, Not Reset</div>
              <div className="text-xs text-slate-400 mt-1">
                Missing 1 day = slight dip in multiplier, <span className="font-bold text-sky-300">NOT a full reset</span>.
                Missing 3+ days = drop back to Warming Up ({"\ud83d\udc22"} 1x).
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {m.streakDays >= 7
                  ? "You are at Full Momentum! Missing 1 day would drop you to Building Speed (1.5x). Recovery: 3 days."
                  : m.streakDays >= 4
                  ? "You are Building Speed! Missing 1 day would drop you to Warming Up (1x). Recovery: 4 days."
                  : "You are Warming Up! Keep going for 4 days to reach Building Speed (1.5x)."
                }
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {/* ── Main gauge (left 2 cols) ── */}
          <div className="col-span-2">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <GlassCard>
                <div className="flex items-center gap-8">
                  <GaugeRing value={m.speed} max={m.maxSpeed} size={160} color="#6366f1" strokeWidth={10}>
                    <div className="text-center">
                      <div className="text-3xl font-black text-indigo-light tabular-nums">{m.speed}</div>
                      <div className="text-[10px] text-slate-500">km/h</div>
                    </div>
                  </GaugeRing>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Speed</span>
                        <span>{m.speed}/{m.maxSpeed}</span>
                      </div>
                      <ProgressBar value={m.speed} max={m.maxSpeed} color="indigo" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-black text-teal tabular-nums">{m.weeklyXP}</div>
                        <div className="text-[10px] text-slate-500">Weekly XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-indigo-light tabular-nums">#{m.rank}</div>
                        <div className="text-[10px] text-slate-500">Class Rank</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-amber-400 tabular-nums">{m.streakDays}{"\ud83d\udd25"}</div>
                        <div className="text-[10px] text-slate-500">Day Streak</div>
                      </div>
                    </div>
                    <div className="glass-sm p-3">
                      <div className="text-xs text-slate-400 mb-1">Speed Zones</div>
                      <div className="flex gap-2 text-[10px]">
                        <Tag label={"0-30 \ud83d\udc22"} color="rose" />
                        <Tag label={"30-60 \ud83d\udeb6"} color="amber" />
                        <Tag label={"60-80 \ud83c\udfc3"} color="indigo" />
                        <Tag label={"80-100 \ud83d\ude80"} color="green" />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* ── XP Breakdown ── */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              <GlassCard className="mt-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3">{"\ud83d\udcca"} XP Breakdown — This Week</h3>
                <div className="space-y-3">
                  {XP_SOURCES.map((src, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-2 text-slate-300">
                          <span>{src.emoji}</span>
                          {src.source}
                        </span>
                        <span className="text-slate-400 tabular-nums">{src.xp} XP ({src.pct}%)</span>
                      </div>
                      <ProgressBar
                        value={src.pct}
                        max={100}
                        color={i === 0 ? "indigo" : i === 1 ? "teal" : i === 2 ? "amber" : i === 3 ? "purple" : "rose"}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total this week</span>
                  <span className="text-sm font-black text-teal tabular-nums">{m.weeklyXP} XP</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* ── Weekly XP chart ── */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <GlassCard className="mt-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3">Weekly XP Trend</h3>
                <div className="flex items-end gap-3 h-32">
                  {[320, 380, 340, 420, 390, 450, 280].map((xp, i) => {
                    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
                    const isToday = i === 5;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-slate-500 tabular-nums">{xp}</span>
                        <div
                          className={`w-full rounded-t transition-all ${isToday ? "bg-teal" : "bg-indigo/40"}`}
                          style={{ height: `${(xp / 500) * 100}%` }}
                        />
                        <span className={`text-[10px] ${isToday ? "text-teal font-bold" : "text-slate-500"}`}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div>
            {/* Leaderboard */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}>
              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-300">{"\ud83c\udfc6"} Leaderboard</h3>
                  <Tag label="Weekly" color="indigo" />
                </div>

                {leaderboardEnabled ? (
                  <div className="space-y-2">
                    {LEADERBOARD.map((entry) => {
                      const isYou = !!(entry as { isYou?: boolean }).isYou;
                      const displayName = isYou && isAnonymous
                        ? `Anonymous (#${entry.rank} of ${m.totalStudents})`
                        : isAnonymous && !isYou
                        ? `Student #${entry.rank}`
                        : entry.name;
                      const displayAvatar = isAnonymous && !isYou ? "\ud83d\udc64" : entry.avatar;

                      return (
                        <div
                          key={entry.rank}
                          className={`flex items-center gap-2 p-2 rounded-xl ${
                            isYou ? "bg-indigo/15 border border-indigo/20" : ""
                          }`}
                        >
                          <span className={`w-6 text-xs font-bold tabular-nums ${
                            entry.rank <= 3 ? "text-explorer-gold" : "text-slate-500"
                          }`}>
                            {entry.rank <= 3 ? ["\ud83e\udd47", "\ud83e\udd48", "\ud83e\udd49"][entry.rank - 1] : `#${entry.rank}`}
                          </span>
                          <span className="text-base">{displayAvatar}</span>
                          <span className={`text-xs flex-1 ${isYou ? "font-bold text-indigo-light" : "text-slate-300"}`}>
                            {displayName}
                          </span>
                          <span className="text-xs text-slate-400 tabular-nums">{entry.xp} XP</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-2xl mb-2">{"\ud83d\udeab"}</div>
                    <div className="text-xs text-slate-500">Leaderboard is hidden</div>
                    <div className="text-[10px] text-slate-600 mt-1">Toggle below to show</div>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 mt-3">
                  Resets every Monday &middot; No class comparisons
                </div>
              </GlassCard>
            </motion.div>

            {/* Anonymous toggle */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}>
              <GlassCard className="mt-4">
                <div className="space-y-3">
                  {/* Leaderboard toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-300">Leaderboard</div>
                      <div className="text-[10px] text-slate-500">Optional &middot; Weekly reset</div>
                    </div>
                    <button
                      onClick={() => setLeaderboardEnabled(!leaderboardEnabled)}
                      className={`w-10 h-5 rounded-full relative transition-all ${
                        leaderboardEnabled ? "bg-indigo" : "bg-white/10"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${
                        leaderboardEnabled ? "left-5 bg-white" : "left-0.5 bg-slate-400"
                      }`} />
                    </button>
                  </div>

                  {/* Anonymous mode toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-300">Anonymous Mode</div>
                      <div className="text-[10px] text-slate-500">
                        {isAnonymous ? `You are #${m.rank} of ${m.totalStudents}` : "Show your name"}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-10 h-5 rounded-full relative transition-all ${
                        isAnonymous ? "bg-purple-500" : "bg-white/10"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${
                        isAnonymous ? "left-5 bg-white" : "left-0.5 bg-slate-400"
                      }`} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* ── XP Unlock Rewards ── */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
              <GlassCard className="mt-4">
                <button
                  onClick={() => setShowRewards(!showRewards)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-sm font-bold text-slate-300">{"\ud83c\udf81"} XP Rewards</h3>
                  <span className={`text-xs text-slate-500 transition-transform ${showRewards ? "rotate-180" : ""}`}>
                    {"\u25bc"}
                  </span>
                </button>

                <AnimatePresence>
                  {showRewards && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mt-3">
                        {XP_REWARDS.map((reward, i) => {
                          const isUnlocked = currentXP >= reward.xp;
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2 p-2 rounded-xl ${
                                isUnlocked ? "bg-white/5" : "bg-white/[0.02] opacity-50"
                              }`}
                            >
                              <span className={`text-lg ${isUnlocked ? "" : "grayscale"}`}>{reward.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className={`text-[11px] font-bold truncate ${isUnlocked ? "text-white" : "text-slate-500"}`}>
                                  {reward.title}
                                </div>
                                <div className="text-[9px] text-slate-500">{reward.type}</div>
                              </div>
                              <div className="text-right shrink-0">
                                {isUnlocked ? (
                                  <span className="text-[10px] text-emerald-400 font-bold">{"\u2713"}</span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 tabular-nums">{reward.xp.toLocaleString()} XP</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span>Your XP: {currentXP.toLocaleString()}</span>
                          <span>Next: {(XP_REWARDS.find(r => r.xp > currentXP)?.xp || 10000).toLocaleString()} XP</span>
                        </div>
                        <ProgressBar
                          value={currentXP}
                          max={XP_REWARDS.find(r => r.xp > currentXP)?.xp || 10000}
                          color="purple"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>

            {/* ── Title badges earned ── */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.26 }}>
              <GlassCard className="mt-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3">{"\ud83c\udff7\ufe0f"} Your Titles</h3>
                <div className="flex flex-wrap gap-2">
                  {XP_REWARDS.filter(r => r.type === "Title Badge").map((badge, i) => {
                    const isUnlocked = currentXP >= badge.xp;
                    return (
                      <div
                        key={i}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          isUnlocked
                            ? "bg-indigo/15 text-indigo-light border border-indigo/20"
                            : "bg-white/5 text-slate-600 border border-white/5"
                        }`}
                      >
                        <span className={isUnlocked ? "" : "grayscale opacity-50"}>{badge.emoji}</span>
                        {badge.title}
                        {!isUnlocked && <span className="text-[9px] text-slate-600 ml-1">{badge.xp.toLocaleString()}</span>}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{content}</main>
      </div>
    </>
  );
}
