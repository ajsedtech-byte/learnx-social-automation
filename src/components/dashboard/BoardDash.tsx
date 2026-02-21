"use client";
import { useState } from "react";
import { DEMO_STUDENTS, SUBJECTS_BY_TIER, DEMO_REVISION } from "@/lib/demo-data";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import GaugeRing from "@/components/ui/GaugeRing";
import Tag from "@/components/ui/Tag";
import { motion } from "framer-motion";
import Link from "next/link";

const student = DEMO_STUDENTS.board;
const subjects = SUBJECTS_BY_TIER.board;

// ═══ R-Table Schedule Legend ═══
const R_SCHEDULE = [
  { round: "R1", days: "1d", tier: "free" },
  { round: "R2", days: "3d", tier: "free" },
  { round: "R3", days: "7d", tier: "free" },
  { round: "R4", days: "14d", tier: "free" },
  { round: "R5", days: "30d", tier: "free" },
  { round: "R6", days: "60d", tier: "premium" },
  { round: "R7", days: "90d", tier: "premium" },
  { round: "R8", days: "120d", tier: "premium" },
  { round: "R9", days: "180d", tier: "premium" },
  { round: "R10", days: "365d", tier: "premium" },
] as const;

// ═══ Board Exam Quick Links ═══
const BOARD_EXAM_LINKS = [
  { label: "Mock Tests", emoji: "📝", href: "/player", count: "24 tests" },
  { label: "Previous Year Papers", emoji: "📄", href: "/revision", count: "10 years" },
  { label: "Important Questions", emoji: "⭐", href: "/revision", count: "320 Qs" },
  { label: "Chapter-wise Questions", emoji: "📚", href: "/revision", count: "1,200 Qs" },
] as const;

// ═══ PYQ counts per subject ═══
const PYQ_COUNTS: Record<string, number> = {
  math: 182,
  science: 195,
  english: 140,
  sst: 168,
  hindi: 112,
  life: 50,
};

const SYLLABUS_COVERAGE = [
  { subject: "Mathematics", emoji: "\uD83D\uDCD0", covered: 42, total: 100, color: "#6366f1" },
  { subject: "Science", emoji: "\uD83D\uDD2C", covered: 38, total: 100, color: "#2dd4bf" },
  { subject: "English", emoji: "\uD83D\uDCDD", covered: 55, total: 100, color: "#f59e0b" },
  { subject: "SST", emoji: "\uD83C\uDF0D", covered: 30, total: 100, color: "#ec4899" },
  { subject: "Hindi", emoji: "\uD83D\uDD49\uFE0F", covered: 48, total: 100, color: "#a855f7" },
  { subject: "Life Skills", emoji: "\uD83D\uDC9B", covered: 23, total: 100, color: "#10b981" },
];

export default function BoardDash() {
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const daysToExam = 87;
  const hoursToExam = 7;
  const minutesToExam = 34;
  const totalPYQs = Object.values(PYQ_COUNTS).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      <div className="blob blob-rose w-[500px] h-[500px] -top-40 -right-40 opacity-10" />
      <div className="blob blob-amber w-96 h-96 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Back Banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-4 mb-6 border-board-pink/30 bg-gradient-to-r from-board-pink/10 to-board-amber/10 relative"
          >
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
            >
              &times;
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-board-pink/20 flex items-center justify-center text-xl">📋</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">
                  Welcome back, {student.name}. 6 revision items overdue. Exam in {daysToExam} days.
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You were away for 3 days. Board prep doesn&apos;t wait. Let&apos;s catch up immediately.
                </p>
              </div>
              <button className="bg-board-pink/20 text-board-pink text-xs font-bold px-4 py-2 rounded-lg hover:bg-board-pink/30 transition-all">
                Quick Catch-Up
              </button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Exam Countdown Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass p-5 mb-6 border-board-pink/30 bg-gradient-to-r from-board-pink/10 to-board-amber/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Days / Hours / Minutes countdown */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-4xl font-black text-board-pink tabular-nums leading-none">{daysToExam}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Days</div>
                </div>
                <span className="text-2xl font-bold text-board-pink/40">:</span>
                <div className="text-center">
                  <div className="text-4xl font-black text-board-pink/80 tabular-nums leading-none">{hoursToExam.toString().padStart(2, "0")}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Hours</div>
                </div>
                <span className="text-2xl font-bold text-board-pink/40">:</span>
                <div className="text-center">
                  <div className="text-4xl font-black text-board-pink/60 tabular-nums leading-none">{minutesToExam.toString().padStart(2, "0")}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Minutes</div>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-base font-bold">CBSE Board Exam 2026</div>
                <div className="text-xs text-slate-400">March 2026 · {student.name} · Class {student.class}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tag label="CBSE" color="rose" size="md" />
              <Tag label="Class 10" color="amber" size="md" />
            </div>
          </div>
        </motion.div>

        {/* PYQ Bank + Formula Sheet Quick Access Row */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* PYQ Bank Button */}
            <Link href="/revision">
              <div className="glass-sm p-4 hover:border-board-pink/30 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-board-pink/15 flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">PYQ Bank</h3>
                      <Tag label="Board Essential" color="rose" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="text-board-pink font-bold tabular-nums">{totalPYQs}</span> PYQs Available
                    </p>
                  </div>
                  <div className="text-slate-500 group-hover:text-board-pink transition-colors text-lg">→</div>
                </div>
                <div className="flex gap-2 mt-3">
                  {subjects.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center gap-1 bg-white/[0.04] rounded px-1.5 py-0.5">
                      <span className="text-xs">{sub.emoji}</span>
                      <span className="text-[9px] text-slate-400 tabular-nums">{PYQ_COUNTS[sub.id] ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>

            {/* Formula Sheet Button */}
            <Link href="/revision">
              <div className="glass-sm p-4 hover:border-board-amber/30 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-board-amber/15 flex items-center justify-center text-2xl">
                    📐
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">Formula Sheet</h3>
                      <Tag label="Quick Ref" color="amber" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">All formulas, theorems &amp; key concepts</p>
                  </div>
                  <div className="text-slate-500 group-hover:text-board-amber transition-colors text-lg">→</div>
                </div>
                {/* Subject selector pills */}
                <div className="flex gap-2 mt-3">
                  {subjects.slice(0, 5).map((sub, i) => (
                    <div
                      key={sub.id}
                      className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium cursor-pointer transition-all
                        ${i === 0
                          ? "bg-board-amber/20 text-board-amber border border-board-amber/30"
                          : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
                        }`}
                    >
                      <span className="text-xs">{sub.emoji}</span>
                      {sub.name}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Apple Health style 3-ring progress */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <GaugeRing value={62} size={100} color="#fb7185" strokeWidth={8} label="Syllabus" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GaugeRing value={78} size={72} color="#f59e0b" strokeWidth={6} label="" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GaugeRing value={85} size={48} color="#2dd4bf" strokeWidth={5}>
                    <span className="text-[10px] font-bold text-teal">85</span>
                  </GaugeRing>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-board-pink" />
                <span className="text-xs text-slate-400">Syllabus Coverage</span>
                <span className="text-sm font-bold text-board-pink tabular-nums">62%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-board-amber" />
                <span className="text-xs text-slate-400">Mock Test Avg</span>
                <span className="text-sm font-bold text-board-amber tabular-nums">78%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal" />
                <span className="text-xs text-slate-400">Board Readiness</span>
                <span className="text-sm font-bold text-teal tabular-nums">85%</span>
              </div>
            </div>
            <div className="ml-auto flex gap-3">
              <div className="text-center">
                <div className="text-2xl font-black text-white tabular-nums">{student.xp}</div>
                <div className="text-[10px] text-slate-500">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400 tabular-nums">{student.streak}🔥</div>
                <div className="text-[10px] text-slate-500">Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {/* Subject cards with board importance */}
          <div className="col-span-2 space-y-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Subjects · Board Prep</h2>
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((sub, i) => (
                  <Link href="/player" key={sub.id}>
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      className="glass-sm p-4 hover:border-board-pink/30 hover:-translate-y-1 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{sub.emoji}</span>
                          <span className="text-sm font-bold">{sub.name}</span>
                        </div>
                        <Tag label="Board" color="rose" />
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{sub.currentTopic}</p>
                      <ProgressBar value={sub.progress} color="bg-board-pink" showLabel />
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                        <span>Ch. {sub.chaptersCompleted}/{sub.totalChapters}</span>
                        <span className="text-board-amber">PYQ: {PYQ_COUNTS[sub.id] ?? 0} questions</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Revision Heat Map with R-Table Legend */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🔄 Revision Heat Map</h2>
              <Link href="/revision">
                <GlassCard hover>
                  {/* R-Table Legend */}
                  <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spaced Repetition Schedule</span>
                    </div>
                    <div className="flex gap-1">
                      {R_SCHEDULE.map((r) => (
                        <div
                          key={r.round}
                          className={`flex-1 text-center p-1.5 rounded-lg border ${
                            r.tier === "free"
                              ? "bg-teal/5 border-teal/20"
                              : "bg-amber-500/5 border-amber-500/20"
                          }`}
                        >
                          <div className={`text-[10px] font-bold ${r.tier === "free" ? "text-teal" : "text-amber-400"}`}>
                            {r.round}
                          </div>
                          <div className="text-[9px] text-slate-500">{r.days}</div>
                          <div className={`text-[8px] mt-0.5 font-bold rounded-full px-1 inline-block ${
                            r.tier === "free"
                              ? "bg-teal/15 text-teal"
                              : "bg-amber-500/15 text-amber-400"
                          }`}>
                            {r.tier === "free" ? "Free" : "Premium"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heat Map Grid */}
                  <div className="grid grid-cols-10 gap-1.5">
                    {DEMO_REVISION.flatMap((topic) =>
                      Array.from({ length: 10 }).map((_, round) => {
                        const isDone = round < topic.currentRound;
                        const isCurrent = round === topic.currentRound;
                        return (
                          <div
                            key={`${topic.id}-${round}`}
                            className={`heat-cell ${
                              isDone
                                ? topic.lastScore >= 90 ? "bg-teal/30 text-teal" : topic.lastScore >= 70 ? "bg-indigo/30 text-indigo-light" : "bg-board-amber/30 text-board-amber"
                                : isCurrent
                                  ? "bg-board-pink/20 text-board-pink border border-board-pink/30"
                                  : "bg-white/3 text-slate-600"
                            }`}
                          >
                            {isDone ? "✓" : isCurrent ? "→" : "·"}
                          </div>
                        );
                      })
                    ).slice(0, 40)}
                  </div>
                  <div className="flex gap-3 mt-3 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-teal/30" /> 90%+</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo/30" /> 70-89%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-board-amber/30" /> &lt;70%</span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* Board Exam Preparation Quick Links */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🎯 Board Exam Preparation</h2>
              <div className="grid grid-cols-4 gap-3">
                {BOARD_EXAM_LINKS.map((link) => (
                  <Link href={link.href} key={link.label}>
                    <div className="glass-sm p-4 text-center hover:border-board-pink/30 hover:-translate-y-1 transition-all cursor-pointer group">
                      <div className="text-2xl mb-2">{link.emoji}</div>
                      <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{link.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{link.count}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Notion-style checklist */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">✅ Today&apos;s Checklist</h2>
              <GlassCard>
                <div className="space-y-2">
                  {[
                    { text: "Quadratic Equations — Discriminant", done: true },
                    { text: "Chemical Reactions (R2)", done: true },
                    { text: "English — Passage Practice", done: false },
                    { text: "SST — Nationalism Notes", done: false },
                    { text: "Mock Test — Science", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px]
                        ${item.done ? "bg-teal border-teal text-white" : "border-slate-600"}`}>
                        {item.done && "✓"}
                      </div>
                      <span className={`text-xs ${item.done ? "text-slate-500 line-through" : "text-slate-300"}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Mock test CTA */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
              <GlassCard className="bg-gradient-to-r from-board-pink/10 to-board-amber/10 border-board-pink/20">
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="font-bold text-sm">Full Mock Test</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Science · 80 marks · 3 hours</p>
                  <button className="mt-3 bg-board-pink text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-board-pink/80 transition-all">
                    Start Mock Test
                  </button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Score trend */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <GlassCard>
                <h3 className="text-xs font-bold text-slate-400 mb-3">Mock Test Trend</h3>
                <div className="flex items-end gap-2 h-20">
                  {[65, 70, 68, 75, 72, 78, 82].map((score, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t ${i === 6 ? "bg-teal" : "bg-indigo/40"}`}
                        style={{ height: `${score * 0.8}%` }}
                      />
                      <span className="text-[8px] text-slate-500 tabular-nums">{score}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Bookmark count */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-300">🔖 Bookmarked</div>
                    <div className="text-lg font-black text-board-amber tabular-nums">24</div>
                    <div className="text-[10px] text-slate-500">Important formulas & concepts</div>
                  </div>
                  <Link href="/revision" className="text-xs text-indigo-light hover:underline">View →</Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Syllabus Coverage */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4">
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
      </div>
    </div>
  );
}
