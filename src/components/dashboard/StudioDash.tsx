"use client";
import { useState } from "react";
import { DEMO_STUDENTS, SUBJECTS_BY_TIER, DEMO_SPARK, DEMO_MOMENTUM, DEMO_DAILY_TASKS } from "@/lib/demo-data";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import GaugeRing from "@/components/ui/GaugeRing";
import Tag from "@/components/ui/Tag";
import { motion } from "framer-motion";
import Link from "next/link";

const student = DEMO_STUDENTS.studio;
const subjects = SUBJECTS_BY_TIER.studio;
const spark = DEMO_SPARK.studio;
const momentum = DEMO_MOMENTUM;

// ═══ Studio Level Progression ═══
const STUDIO_LEVELS = [
  { name: "Apprentice", minXP: 0, color: "text-slate-400" },
  { name: "Creator", minXP: 1000, color: "text-indigo-light" },
  { name: "Artisan", minXP: 3000, color: "text-teal" },
  { name: "Master", minXP: 6000, color: "text-amber-400" },
  { name: "Virtuoso", minXP: 10000, color: "text-fuchsia-400" },
] as const;

function getStudioLevel(xp: number) {
  let current: (typeof STUDIO_LEVELS)[number] = STUDIO_LEVELS[0];
  let nextLevel: (typeof STUDIO_LEVELS)[number] | null = STUDIO_LEVELS[1];
  for (let i = STUDIO_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= STUDIO_LEVELS[i].minXP) {
      current = STUDIO_LEVELS[i];
      nextLevel = STUDIO_LEVELS[i + 1] ?? null;
      break;
    }
  }
  const progressToNext = nextLevel
    ? ((xp - current.minXP) / (nextLevel.minXP - current.minXP)) * 100
    : 100;
  return { current, nextLevel, progressToNext };
}

// ═══ Creative Studio Names ═══
const STUDIO_NAMES: Record<string, string> = {
  math: "Math Studio",
  science: "Science Lab",
  english: "Language Workshop",
  sst: "History Atelier",
  hindi: "Hindi Workshop",
  life: "Life Design Lab",
};

// ═══ Skill Tree Data ═══
interface SkillNode {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "locked";
}

interface SkillBranch {
  topic: string;
  emoji: string;
  nodes: SkillNode[];
}

const SKILL_TREE: SkillBranch[] = [
  {
    topic: "Algebra",
    emoji: "📐",
    nodes: [
      { id: "a1", name: "Variables", status: "completed" },
      { id: "a2", name: "Expressions", status: "completed" },
      { id: "a3", name: "Equations", status: "in-progress" },
      { id: "a4", name: "Factoring", status: "locked" },
      { id: "a5", name: "Polynomials", status: "locked" },
    ],
  },
  {
    topic: "Chemistry",
    emoji: "🧪",
    nodes: [
      { id: "c1", name: "Atoms", status: "completed" },
      { id: "c2", name: "Compounds", status: "completed" },
      { id: "c3", name: "Reactions", status: "completed" },
      { id: "c4", name: "Balancing", status: "in-progress" },
      { id: "c5", name: "Combustion", status: "locked" },
    ],
  },
  {
    topic: "Grammar",
    emoji: "📖",
    nodes: [
      { id: "g1", name: "Tenses", status: "completed" },
      { id: "g2", name: "Voice", status: "completed" },
      { id: "g3", name: "Clauses", status: "in-progress" },
      { id: "g4", name: "Modals", status: "locked" },
    ],
  },
  {
    topic: "History",
    emoji: "🏛️",
    nodes: [
      { id: "h1", name: "Revolution", status: "completed" },
      { id: "h2", name: "Nationalism", status: "in-progress" },
      { id: "h3", name: "Imperialism", status: "locked" },
      { id: "h4", name: "World Wars", status: "locked" },
    ],
  },
];

// ═══ Portfolio Data ═══
const PORTFOLIO = {
  completedWorks: 142,
  badges: [
    { emoji: "🏆", name: "First 100" },
    { emoji: "🔬", name: "Lab Ace" },
    { emoji: "📐", name: "Math Whiz" },
    { emoji: "🔥", name: "21-Day Streak" },
    { emoji: "⚡", name: "SPARK Star" },
    { emoji: "🎯", name: "Perfect Score" },
  ],
};

const SYLLABUS_COVERAGE = [
  { subject: "Mathematics", emoji: "\uD83D\uDCD0", covered: 42, total: 100, color: "#6366f1" },
  { subject: "Science", emoji: "\uD83D\uDD2C", covered: 38, total: 100, color: "#2dd4bf" },
  { subject: "English", emoji: "\uD83D\uDCDD", covered: 55, total: 100, color: "#f59e0b" },
  { subject: "SST", emoji: "\uD83C\uDF0D", covered: 30, total: 100, color: "#ec4899" },
  { subject: "Hindi", emoji: "\uD83D\uDD49\uFE0F", covered: 48, total: 100, color: "#a855f7" },
  { subject: "Life Skills", emoji: "\uD83D\uDC9B", covered: 23, total: 100, color: "#10b981" },
];

export default function StudioDash() {
  const studioLevel = getStudioLevel(student.xp);
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  return (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      <div className="blob blob-indigo w-[500px] h-[500px] -top-40 -right-40 opacity-15" />
      <div className="blob blob-teal w-96 h-96 bottom-20 -left-20 opacity-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Back Banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-4 mb-6 border-indigo/30 bg-gradient-to-r from-indigo/10 to-teal/10 relative"
          >
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
            >
              &times;
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo/20 flex items-center justify-center text-xl">🎨</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">
                  Welcome back, {student.name}. 4 revision items need attention.
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You were away for 3 days. Your studio projects are waiting for you. Let&apos;s catch up.
                </p>
              </div>
              <button className="bg-indigo/20 text-indigo-light text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo/30 transition-all">
                Quick Catch-Up
              </button>
            </div>
          </motion.div>
        )}

        {/* Header row with Studio Level */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo to-teal flex items-center justify-center text-2xl">
              {student.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold">{student.name}</h1>
              <p className="text-xs text-slate-400">Class {student.class}{student.section} · {student.school}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            {/* Studio Level badge */}
            <div className="text-center">
              <div className={`text-sm font-black ${studioLevel.current.color}`}>{studioLevel.current.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Studio Level</div>
              {studioLevel.nextLevel && (
                <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo to-teal rounded-full"
                    style={{ width: `${studioLevel.progressToNext}%` }}
                  />
                </div>
              )}
            </div>
            {/* Momentum gauge */}
            <Link href="/momentum">
              <GaugeRing value={momentum.speed} size={64} color="#6366f1" strokeWidth={5}>
                <span className="text-xs font-bold text-indigo-light">{momentum.speed}</span>
              </GaugeRing>
            </Link>
            <div className="text-center">
              <div className="text-lg font-black text-teal tabular-nums">{student.xp}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">XP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-amber-400 tabular-nums">{student.streak}🔥</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Studio Level Progression Bar */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <div className="glass-sm p-3 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Studio Progression</span>
              <span className="text-[10px] text-slate-500">
                {studioLevel.nextLevel
                  ? `${studioLevel.nextLevel.minXP - student.xp} XP to ${studioLevel.nextLevel.name}`
                  : "Max Level Reached"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {STUDIO_LEVELS.map((level, i) => {
                const isActive = level.name === studioLevel.current.name;
                const isPast = student.xp >= level.minXP;
                return (
                  <div key={level.name} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center flex-1 ${i < STUDIO_LEVELS.length - 1 ? "relative" : ""}`}>
                      <div className={`w-full h-1.5 rounded-full ${isPast ? "bg-gradient-to-r from-indigo to-teal" : "bg-white/10"}`} />
                      <span className={`text-[9px] mt-1 ${isActive ? level.color + " font-bold" : isPast ? "text-slate-400" : "text-slate-600"}`}>
                        {level.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Netflix-style horizontal scroll — Active Projects (Creative Studios) */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🎨 Active Projects</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {subjects.map((sub, i) => (
              <Link href="/player" key={sub.id}>
                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="glass-sm p-4 min-w-[200px] hover:border-indigo/30 hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{sub.emoji}</span>
                    <div>
                      <h3 className="font-bold text-sm">{STUDIO_NAMES[sub.id] ?? sub.name}</h3>
                      <p className="text-[10px] text-slate-500">Ch. {sub.chaptersCompleted}/{sub.totalChapters}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2 truncate">{sub.currentTopic}</p>
                  <ProgressBar value={sub.progress} color="indigo" showLabel />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Skill Tree Visualization */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 mt-4">🌳 Skill Tree</h2>
          <GlassCard>
            <div className="space-y-4">
              {SKILL_TREE.map((branch) => (
                <div key={branch.topic}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{branch.emoji}</span>
                    <span className="text-xs font-bold text-slate-300">{branch.topic}</span>
                    <span className="text-[10px] text-slate-500">
                      {branch.nodes.filter((n) => n.status === "completed").length}/{branch.nodes.length} mastered
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {branch.nodes.map((node, ni) => (
                      <div key={node.id} className="flex items-center">
                        {/* Node */}
                        <div
                          className={`relative group/node flex items-center justify-center w-9 h-9 rounded-xl border-2 text-[10px] font-bold transition-all
                            ${node.status === "completed"
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                              : node.status === "in-progress"
                                ? "bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse"
                                : "bg-white/[0.04] border-white/10 text-slate-600"
                            }`}
                        >
                          {node.status === "completed" ? "✓" : node.status === "in-progress" ? "◉" : "🔒"}
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none z-20">
                            {node.name}
                          </div>
                        </div>
                        {/* Connector line between nodes */}
                        {ni < branch.nodes.length - 1 && (
                          <div
                            className={`w-4 h-0.5 ${
                              node.status === "completed" ? "bg-emerald-500/40" : "bg-white/10"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Skill Tree Legend */}
            <div className="flex gap-4 mt-4 pt-3 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" /> Mastered
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" /> In Progress
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-3 rounded bg-white/[0.04] border border-white/10" /> Locked
              </span>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Daily Blueprint with Studio Tasks */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="col-span-2">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">📋 Today&apos;s Studio Tasks</h2>
            <GlassCard>
              <div className="space-y-2">
                {DEMO_DAILY_TASKS.slice(0, 4).map((task) => (
                  <div key={task.id} className={`flex items-center gap-3 p-2 rounded-xl ${task.completed ? "bg-teal/5" : "bg-white/3"}`}>
                    <span className="text-lg">{task.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${task.completed ? "text-slate-500 line-through" : "text-white"}`}>
                          {task.title}
                        </span>
                        <Tag label={task.type} color={task.type === "learn" ? "indigo" : task.type === "revise" ? "teal" : "amber"} />
                      </div>
                      <div className="text-[10px] text-slate-500">{task.time} · {task.duration}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs
                      ${task.completed ? "bg-teal border-teal text-white" : "border-slate-600"}`}>
                      {task.completed && "✓"}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/daily" className="text-xs text-indigo-light mt-3 inline-block hover:underline">View full plan →</Link>
            </GlassCard>
          </motion.div>

          {/* Right side cards */}
          <div className="space-y-4">
            {/* Portfolio Section */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🎒 Portfolio</h2>
              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-black text-teal tabular-nums">{PORTFOLIO.completedWorks}</div>
                    <div className="text-[10px] text-slate-500">Completed Works</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-400 tabular-nums">{PORTFOLIO.badges.length}</div>
                    <div className="text-[10px] text-slate-500">Badges Earned</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PORTFOLIO.badges.map((badge) => (
                    <div
                      key={badge.name}
                      className="flex items-center gap-1 bg-white/[0.06] rounded-lg px-2 py-1 group/badge relative"
                    >
                      <span className="text-sm">{badge.emoji}</span>
                      <span className="text-[9px] text-slate-400">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* SPARK mini */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">⚡ SPARK</h2>
              <Link href="/spark">
                <GlassCard hover>
                  <div className="grid grid-cols-3 gap-2">
                    {spark.domains.slice(0, 6).map((d) => (
                      <div key={d.name} className="flex flex-col items-center gap-0.5">
                        <span className="text-lg">{d.emoji}</span>
                        <span className="text-[9px] text-slate-400">{d.name}</span>
                        <span className="text-xs font-bold text-indigo-light">{d.score}/{d.maxScore}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* Momentum */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link href="/momentum">
                <GlassCard hover>
                  <div className="flex items-center gap-4">
                    <GaugeRing value={momentum.speed} size={72} color="#6366f1" strokeWidth={5}>
                      <div className="text-center">
                        <div className="text-sm font-black text-indigo-light">{momentum.speed}</div>
                        <div className="text-[8px] text-slate-500">km/h</div>
                      </div>
                    </GaugeRing>
                    <div>
                      <div className="text-xs text-slate-400">Weekly XP</div>
                      <div className="text-lg font-bold text-teal">{momentum.weeklyXP}</div>
                      <div className="text-[10px] text-slate-500">Rank #{momentum.rank} of {momentum.totalStudents}</div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* Leaderboard toggle */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-300">Leaderboard</div>
                    <div className="text-[10px] text-slate-500">Optional · Weekly reset</div>
                  </div>
                  <div className="w-10 h-5 bg-indigo/30 rounded-full relative cursor-pointer">
                    <div className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-indigo shadow-lg" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Syllabus Coverage */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }} className="mt-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">📊 Syllabus Coverage</h2>
          <GlassCard>
            <div className="flex items-center justify-between gap-3">
              {SYLLABUS_COVERAGE.map((sub) => (
                <div key={sub.subject} className="flex flex-col items-center gap-1.5 flex-1">
                  <GaugeRing value={sub.covered} max={sub.total} size={56} color={sub.color} strokeWidth={4}>
                    <span className="text-[10px] font-bold" style={{ color: sub.color }}>{sub.covered}%</span>
                  </GaugeRing>
                  <span className="text-lg">{sub.emoji}</span>
                  <span className="text-[9px] text-slate-400 text-center leading-tight">{sub.subject}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Spotify-wrapped style summary card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <div className="glass p-5 bg-gradient-to-r from-indigo/10 to-teal/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">This Week&apos;s Wrap</h3>
                <p className="text-xs text-slate-400 mt-1">You completed <span className="text-teal font-bold">12 topics</span> across <span className="text-indigo-light font-bold">4 subjects</span></p>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-2xl font-black text-teal">3.2h</div>
                  <div className="text-[9px] text-slate-500">Study Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-indigo-light">87%</div>
                  <div className="text-[9px] text-slate-500">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
