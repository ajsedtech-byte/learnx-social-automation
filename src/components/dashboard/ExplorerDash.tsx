"use client";
import { useState } from "react";
import { DEMO_STUDENTS, SUBJECTS_BY_TIER, DEMO_SPARK, DEMO_GARDEN } from "@/lib/demo-data";
import ProgressBar from "@/components/ui/ProgressBar";
import GaugeRing from "@/components/ui/GaugeRing";
import { motion } from "framer-motion";
import Link from "next/link";

const student = DEMO_STUDENTS.explorer;
const subjects = SUBJECTS_BY_TIER.explorer;
const spark = DEMO_SPARK.explorer;
const garden = DEMO_GARDEN;

const BADGE_COLLECTION = [
  { emoji: "🌟", name: "First Steps", earned: true },
  { emoji: "🔥", name: "5-Day Streak", earned: true },
  { emoji: "🧩", name: "Puzzle Master", earned: true },
  { emoji: "📖", name: "Bookworm", earned: true },
  { emoji: "🏆", name: "Quiz Champion", earned: false },
  { emoji: "🎯", name: "Perfect Score", earned: false },
  { emoji: "🌈", name: "All Subjects", earned: false },
  { emoji: "👑", name: "Level 20", earned: false },
];

// Cricket progression tiers
const CRICKET_LEVELS = [
  { label: "Gully Cricket", emoji: "🏏", minLevel: 1 },
  { label: "District", emoji: "🏟️", minLevel: 10 },
  { label: "State", emoji: "🏅", minLevel: 20 },
  { label: "National", emoji: "🇮🇳", minLevel: 30 },
  { label: "IPL", emoji: "🏆", minLevel: 40 },
];

function getCricketTierIndex(level: number): number {
  let idx = 0;
  for (let i = CRICKET_LEVELS.length - 1; i >= 0; i--) {
    if (level >= CRICKET_LEVELS[i].minLevel) {
      idx = i;
      break;
    }
  }
  return idx;
}

// Derive cricket stats from student data
const totalRuns = student.xp;
const boundaries = Math.floor(student.completedTopics * 0.6); // ~60% of completed topics as 4s
const sixes = Math.floor(student.completedTopics * 0.15); // ~15% of completed topics as 6s
const currentOver = student.level;
const strikeRate = Math.round((student.completedTopics / student.totalTopics) * 100);
const cricketIdx = getCricketTierIndex(student.level);

const SYLLABUS_COVERAGE = [
  { subject: "Mathematics", emoji: "\uD83D\uDCD0", covered: 42, total: 100, color: "#6366f1" },
  { subject: "Science", emoji: "\uD83D\uDD2C", covered: 38, total: 100, color: "#2dd4bf" },
  { subject: "English", emoji: "\uD83D\uDCDD", covered: 55, total: 100, color: "#f59e0b" },
  { subject: "SST", emoji: "\uD83C\uDF0D", covered: 30, total: 100, color: "#ec4899" },
  { subject: "Hindi", emoji: "\uD83D\uDD49\uFE0F", covered: 48, total: 100, color: "#a855f7" },
  { subject: "Life Skills", emoji: "\uD83D\uDC9B", covered: 23, total: 100, color: "#10b981" },
];

export default function ExplorerDash() {
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-explorer-galaxy via-[#1a0533] to-[#0c1222] text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob blob-purple w-96 h-96 top-0 right-0 opacity-20" />
      <div className="blob blob-indigo w-80 h-80 bottom-40 -left-20 opacity-15" />
      <div className="blob blob-teal w-64 h-64 bottom-0 right-1/4 opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* Welcome Back Banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-5 mb-6 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-explorer-gold/10 relative"
          >
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
            >
              &times;
            </button>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🗺️</div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">
                  Your adventure awaits! 🗺️ 3 quests are waiting!
                </h3>
                <p className="text-sm text-purple-300 mt-1">
                  Welcome back, {student.name}! You were away for 3 days. Your garden missed you! Let&apos;s catch up.
                </p>
                <button className="mt-3 bg-gradient-to-r from-purple-500 to-explorer-gold text-white text-sm font-bold px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Quick Catch-Up 🚀
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Welcome + Cricket Stats Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{student.avatar}</div>
            <div>
              <h1 className="text-2xl font-bold">{student.name}&apos;s World</h1>
              <p className="text-sm text-purple-300">{student.school} · {student.section}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-explorer-gold">{totalRuns} 🏏</div>
              <div className="text-[10px] text-purple-400 uppercase tracking-wider">Runs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-teal">Not Out! {student.streak} 🔥</div>
              <div className="text-[10px] text-purple-400 uppercase tracking-wider">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-light">Over {currentOver}</div>
              <div className="text-[10px] text-purple-400 uppercase tracking-wider">Level</div>
            </div>
          </div>
        </motion.div>

        {/* Runs Progress to next over */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="glass-sm p-3 mb-6"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Over {currentOver}</span>
            <span>{student.xp % 200}/200 Runs to Over {currentOver + 1}</span>
          </div>
          <ProgressBar value={student.xp % 200} max={200} color="bg-gradient-to-r from-explorer-gold to-amber-300" />
        </motion.div>

        {/* Cricket Scoreboard */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="glass p-5 mb-6"
        >
          <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">🏏 Cricket Scoreboard</h2>
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
              <div className="text-2xl font-black text-explorer-gold">{totalRuns}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Total Runs</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
              <div className="text-2xl font-black text-emerald-400">{boundaries}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Boundaries (4s)</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
              <div className="text-2xl font-black text-amber-400">{sixes}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Sixes (6s)</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
              <div className="text-2xl font-black text-purple-400">{currentOver}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Current Over</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
              <div className="text-2xl font-black text-teal">{strikeRate}%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Strike Rate</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left column: Subjects as "Worlds" - adventure map style */}
          <div className="col-span-2 space-y-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-1">🗺️ Worlds to Explore</h2>
              <p className="text-[11px] text-slate-500 mb-3">Navigate the islands — each world is a new expedition!</p>

              {/* Adventure Map with dotted path connections */}
              <div className="relative">
                {/* Dotted path SVG connecting the islands */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                  <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#6b21a8" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                  <line x1="25%" y1="100%" x2="75%" y2="100%" stroke="#6b21a8" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                  <line x1="75%" y1="50%" x2="75%" y2="100%" stroke="#6b21a8" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                  <line x1="25%" y1="50%" x2="25%" y2="100%" stroke="#6b21a8" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                </svg>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {subjects.map((sub, i) => {
                    const isDiscovered = sub.progress > 0;
                    return (
                      <Link href="/player" key={sub.id}>
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                          className="glass-sm p-4 hover:border-purple-500/30 hover:-translate-y-1 transition-all cursor-pointer group relative"
                        >
                          {/* Island indicator */}
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#0c1222] animate-pulse" />

                          <div className="flex items-start justify-between mb-2">
                            <span className="text-3xl group-hover:scale-110 transition-transform">{sub.emoji}</span>
                            <div className="text-right">
                              <span className="text-xs font-mono text-purple-400">{sub.chaptersCompleted}/{sub.totalChapters}</span>
                              {sub.chaptersCompleted > 0 && (
                                <div className="text-[9px] text-emerald-400 font-bold">
                                  {sub.chaptersCompleted >= sub.totalChapters
                                    ? "Six! 6 runs! 🏏"
                                    : `Boundary! ${sub.chaptersCompleted * 4} runs!`}
                                </div>
                              )}
                            </div>
                          </div>
                          <h3 className="font-bold text-white text-sm">{sub.name}</h3>
                          <p className="text-[11px] text-slate-400 mb-1">{sub.currentTopic}</p>
                          <p className="text-[10px] text-purple-400 font-medium mb-2">
                            {isDiscovered ? "You discovered this territory!" : "New territory unlocked!"}
                          </p>
                          <ProgressBar value={sub.progress} color="purple" />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Expedition Log - SPARK Radar Preview */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">📋 Expedition Log — Brain Map</h2>
              <Link href="/spark">
                <div className="glass p-5 hover:border-purple-500/30 transition-all cursor-pointer">
                  <div className="grid grid-cols-5 gap-2">
                    {spark.domains.slice(0, 5).map((d) => (
                      <div key={d.name} className="flex flex-col items-center gap-1">
                        <GaugeRing value={d.score} max={d.maxScore} size={56} color="#8b5cf6" strokeWidth={4}>
                          <span className="text-lg">{d.emoji}</span>
                        </GaugeRing>
                        <span className="text-[9px] text-slate-400">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right column: Badges + Garden + Cricket Progression */}
          <div className="space-y-4">
            {/* Badge Collection */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">🏅 Badge Wall</h2>
              <div className="glass p-4">
                <div className="grid grid-cols-4 gap-2">
                  {BADGE_COLLECTION.map((b, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                        ${b.earned ? "bg-explorer-gold/10" : "bg-white/3 opacity-40"}
                      `}
                    >
                      <span className={`text-2xl ${b.earned ? "" : "grayscale"}`}>{b.emoji}</span>
                      <span className="text-[8px] text-slate-400 text-center leading-tight">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Mini Garden */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
              <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">🌱 My Garden</h2>
              <Link href="/garden">
                <div className="glass p-4 hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="grid grid-cols-3 gap-3">
                    {garden.slice(0, 6).map((plant) => (
                      <div key={plant.subjectId} className="flex flex-col items-center">
                        <span className="text-3xl animate-float" style={{ animationDelay: `${Math.random() * 3}s` }}>
                          {plant.emoji}
                        </span>
                        <span className="text-[9px] text-emerald-400">{plant.topicsCompleted}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Cricket Progression Tracker */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="glass p-4 text-center">
                <div className="text-xs text-purple-400 mb-2">🏏 Cricket Progression</div>
                <div className="flex items-center justify-center gap-1 text-xl flex-wrap">
                  {CRICKET_LEVELS.map((tier, i) => {
                    const isActive = i === cricketIdx;
                    const isPast = i < cricketIdx;
                    return (
                      <div key={tier.label} className="flex items-center gap-1">
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl ${isPast ? "opacity-30" : isActive ? "" : "opacity-30"}`}>
                            {tier.emoji}
                          </span>
                          <span className={`text-[8px] mt-0.5 ${isActive ? "text-explorer-gold font-bold" : "text-slate-500"}`}>
                            {tier.label}
                          </span>
                        </div>
                        {i < CRICKET_LEVELS.length - 1 && (
                          <span className="text-purple-500 text-sm mx-0.5">&rarr;</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-500 mt-2">
                  Over {currentOver} — {CRICKET_LEVELS[cricketIdx].label} Level
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Syllabus Coverage */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4"
        >
          <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">🧭 Syllabus Coverage — Territories Explored</h2>
          <div className="glass p-5">
            <div className="grid grid-cols-6 gap-4">
              {SYLLABUS_COVERAGE.map((sub) => (
                <div key={sub.subject} className="flex flex-col items-center gap-2">
                  <GaugeRing value={sub.covered} max={sub.total} size={64} color={sub.color} strokeWidth={5}>
                    <span className="text-lg">{sub.emoji}</span>
                  </GaugeRing>
                  <span className="text-[10px] text-slate-400 text-center">{sub.subject}</span>
                  <span className="text-xs font-bold text-purple-300">{sub.covered}% explored</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
