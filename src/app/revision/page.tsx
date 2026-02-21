"use client";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_REVISION } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

// ═══ EXTENDED DEMO DATA FOR NEW FEATURES ═══

interface ExtendedRevisionTopic {
  id: string;
  name: string;
  subject: string;
  currentRound: number;
  maxRounds: number;
  lastScore: number;
  nextDue: string;
  status: "due" | "upcoming" | "mastered" | "struggling";
  // New LX20 fields
  consecutivePerfect: number;
  consecutiveFails: number;
  daysOverdue: number;
  intervalDays: number;
  coreConcept: string;
  keyFormula: string;
  isBoost: boolean;
  returnFromVacation: boolean;
}

const EXTENDED_REVISION: ExtendedRevisionTopic[] = [
  {
    ...DEMO_REVISION[0],
    consecutivePerfect: 3,
    consecutiveFails: 0,
    daysOverdue: 0,
    intervalDays: 7,
    coreConcept: "Adding two-digit numbers uses place value: add ones first, then tens, carrying over when the ones sum exceeds 9.",
    keyFormula: "34 + 27 = (30+20) + (4+7) = 50 + 11 = 61",
    isBoost: false,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[1],
    consecutivePerfect: 0,
    consecutiveFails: 1,
    daysOverdue: 1,
    intervalDays: 3,
    coreConcept: "Nouns name people, places, or things. Pronouns replace nouns to avoid repetition.",
    keyFormula: "Noun: Ravi → Pronoun: He/Him",
    isBoost: false,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[2],
    consecutivePerfect: 2,
    consecutiveFails: 0,
    daysOverdue: 0,
    intervalDays: 14,
    coreConcept: "Plants convert CO2 and water into glucose and oxygen using sunlight energy captured by chlorophyll.",
    keyFormula: "6CO2 + 6H2O → C6H12O6 + 6O2",
    isBoost: false,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[3],
    consecutivePerfect: 5,
    consecutiveFails: 0,
    daysOverdue: 0,
    intervalDays: 30,
    coreConcept: "The quadratic formula finds roots of ax2 + bx + c = 0 using the discriminant to determine the nature of roots.",
    keyFormula: "x = (-b +/- sqrt(b2-4ac)) / 2a",
    isBoost: false,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[4],
    consecutivePerfect: 0,
    consecutiveFails: 3,
    daysOverdue: 2,
    intervalDays: 2,
    coreConcept: "Atoms bond by sharing (covalent) or transferring (ionic) electrons to achieve stable electron configurations.",
    keyFormula: "Ionic: Na + Cl -> Na+Cl- | Covalent: H-H shared pair",
    isBoost: true,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[5],
    consecutivePerfect: 1,
    consecutiveFails: 0,
    daysOverdue: 0,
    intervalDays: 5,
    coreConcept: "The French Revolution (1789) overthrew monarchy, driven by inequality, Enlightenment ideas, and economic crisis.",
    keyFormula: "1789: Storming of Bastille -> Declaration of Rights",
    isBoost: false,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[6],
    consecutivePerfect: 0,
    consecutiveFails: 0,
    daysOverdue: 0,
    intervalDays: 10,
    coreConcept: "Trigonometric ratios relate angles to side lengths in right triangles using sine, cosine, and tangent.",
    keyFormula: "sin(th) = opp/hyp, cos(th) = adj/hyp, tan(th) = opp/adj",
    isBoost: false,
    returnFromVacation: false,
  },
  {
    ...DEMO_REVISION[7],
    consecutivePerfect: 4,
    consecutiveFails: 0,
    daysOverdue: 0,
    intervalDays: 21,
    coreConcept: "Active voice: subject performs action. Passive voice: subject receives action. Convert by swapping subject/object and changing verb form.",
    keyFormula: "Active: S+V+O -> Passive: O + be + V3 + by S",
    isBoost: false,
    returnFromVacation: false,
  },
];

// ═══ DISGUISED LANGUAGE FOR C1-5 ═══
const C1_5_LABELS = [
  "Let's play with [topic] again!",
  "Fun time!",
  "Quick game!",
  "Show what you know!",
  "Remember this? Let's go!",
  "Your turn to shine!",
  "One more round!",
  "Can you remember?",
];

function getDisguisedLabel(topicName: string, index: number): string {
  const label = C1_5_LABELS[index % C1_5_LABELS.length];
  return label.replace("[topic]", topicName);
}

// ═══ URGENCY SCORING ═══
function getUrgencyScore(daysOverdue: number, intervalDays: number): number {
  if (intervalDays === 0) return 0;
  return daysOverdue / intervalDays;
}

function getUrgencyColor(score: number): { bg: string; text: string; label: string } {
  if (score > 1.0) return { bg: "bg-red-500/15", text: "text-red-400", label: "Forgotten" };
  if (score >= 0.3) return { bg: "bg-amber-400/15", text: "text-amber-300", label: "Getting stale" };
  return { bg: "bg-emerald-400/15", text: "text-emerald-300", label: "Fine" };
}

// ═══ FILTER TYPES ═══
type FilterKey = "due-today" | "due-week" | "all" | "mastered";

export default function RevisionPage() {
  const { tier, isDark, student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";
  const isInvisible = tier === "storybook" || tier === "explorer"; // C1-5: invisible revision
  const isC1to5 = tier === "storybook" || tier === "explorer";
  const isC6Plus = tier === "studio" || tier === "board" || tier === "pro";
  const isC9Plus = tier === "board" || tier === "pro";
  const isBoardTier = tier === "board";

  // State
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showCardPreview, setShowCardPreview] = useState<string | null>(null);
  const [showQuizFlow, setShowQuizFlow] = useState(false);
  const [showVacationBanner, setShowVacationBanner] = useState(true);

  // Demo state: simulate a student returning from vacation
  const isVacationReturn = true; // demo flag

  // ═══ FILTER LOGIC ═══
  const filteredTopics = useMemo(() => {
    switch (activeFilter) {
      case "due-today":
        return EXTENDED_REVISION.filter(t => t.nextDue === "Today");
      case "due-week":
        return EXTENDED_REVISION.filter(t => t.nextDue === "Today" || t.nextDue === "Tomorrow" || t.status === "due");
      case "mastered":
        return EXTENDED_REVISION.filter(t => t.status === "mastered");
      default:
        return EXTENDED_REVISION;
    }
  }, [activeFilter]);

  const filterCounts = useMemo(() => ({
    "due-today": EXTENDED_REVISION.filter(t => t.nextDue === "Today").length,
    "due-week": EXTENDED_REVISION.filter(t => t.nextDue === "Today" || t.nextDue === "Tomorrow" || t.status === "due").length,
    "all": EXTENDED_REVISION.length,
    "mastered": EXTENDED_REVISION.filter(t => t.status === "mastered").length,
  }), []);

  // ═══ BACKLOG COUNT ═══
  const backlogCount = EXTENDED_REVISION.filter(t => t.status === "due" || t.status === "struggling").length;
  const overdueCount = EXTENDED_REVISION.filter(t => t.daysOverdue > 0).length;

  // ═══ BOARD EXAM MODE STATS ═══
  const boardExamDays = 87;
  const revisionComplete = 73;

  const content = (
    <div className={`min-h-screen ${tier === "storybook" ? "bg-storybook-bg" : "bg-navy"} relative overflow-hidden`}>
      <div className="blob blob-teal w-96 h-96 -top-40 -right-40 opacity-10" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">

        {/* ═══ HEADER ═══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
            {isC1to5 ? "🌱 Memory Garden" : "🔄 Revision Tracker"}
          </h1>
          <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {isInvisible
              ? "Revision happens automatically — your child doesn't see this!"
              : `R1-R10 per micro-topic · ${tier === "board" || tier === "pro" ? "Heat map view" : "Table view"}`
            }
          </p>
        </motion.div>

        {isParentView && (
          <div className={`mb-4 p-3 rounded-xl border ${isDark ? "bg-teal/5 border-teal/20" : "bg-teal-50 border-teal-200"}`}>
            <p className={`text-xs font-semibold ${isDark ? "text-teal" : "text-teal-700"}`}>
              Parent View — You are viewing {student.name}&apos;s revision status. Topics cycle through R1-R10 spaced repetition rounds automatically.
            </p>
          </div>
        )}

        {/* ═══ FEATURE 15: VACATION / WELCOME BACK BANNER ═══ */}
        {isVacationReturn && showVacationBanner && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="mb-4"
          >
            <div className={`${isDark ? "bg-amber-400/10 border border-amber-400/20" : "bg-amber-50 border border-amber-200"} rounded-2xl p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌅</span>
                <div>
                  <div className={`text-sm font-bold ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                    Welcome back, {student.name}!
                  </div>
                  <div className={`text-xs ${isDark ? "text-amber-400/70" : "text-amber-600"}`}>
                    We&apos;ll ease you in over 3 days. No rush — your schedule has been adjusted.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowVacationBanner(false)}
                className={`text-xs px-3 py-1 rounded-full ${isDark ? "text-amber-400 hover:bg-amber-400/10" : "text-amber-600 hover:bg-amber-100"} transition`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ FEATURE 11: BOARD EXAM REVISION MODE (C10/Board tier) ═══ */}
        {isBoardTier && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
            <div className={`${isDark ? "bg-board-pink/10 border border-board-pink/20" : "bg-pink-50 border border-pink-200"} rounded-2xl p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className={`text-sm font-bold ${isDark ? "text-board-pink" : "text-pink-700"}`}>
                      Board Exam Revision Mode
                    </div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Board exams in <span className="font-black">{boardExamDays} days</span>. {revisionComplete}% revision complete.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Revision ratio</div>
                    <div className={`text-xs font-bold ${isDark ? "text-board-pink" : "text-pink-600"}`}>50% of daily plan</div>
                  </div>
                  <div className={`w-16 h-16 rounded-full border-4 ${isDark ? "border-board-pink/30" : "border-pink-300"} flex items-center justify-center`}>
                    <span className={`text-lg font-black ${isDark ? "text-board-pink" : "text-pink-600"}`}>{boardExamDays}</span>
                  </div>
                </div>
              </div>
              <ProgressBar value={revisionComplete} max={100} color="rose" className="mt-3" showLabel />
            </div>
          </motion.div>
        )}

        {/* ═══ FEATURE 9: BACKLOG COUNT ═══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}>
          <div className={`${isDark ? "glass-sm" : "bg-white/50 rounded-2xl border border-slate-100"} p-3 mb-4 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {backlogCount} revision{backlogCount !== 1 ? "s" : ""} pending
              </span>
              {overdueCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-semibold">
                  {overdueCount} overdue
                </span>
              )}
            </div>
            <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {EXTENDED_REVISION.filter(t => t.status === "mastered").length} mastered total
            </div>
          </div>
        </motion.div>

        {/* ═══ STATS ROW ═══ */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "Due Today", value: EXTENDED_REVISION.filter(r => r.status === "due").length.toString(), color: "rose", emoji: "🔴" },
            { label: "Upcoming", value: EXTENDED_REVISION.filter(r => r.status === "upcoming").length.toString(), color: "amber", emoji: "🟡" },
            { label: "Mastered", value: EXTENDED_REVISION.filter(r => r.status === "mastered").length.toString(), color: "green", emoji: "🟢" },
            { label: "Struggling", value: EXTENDED_REVISION.filter(r => r.status === "struggling").length.toString(), color: "purple", emoji: "🟣" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <div className={`${isDark ? "glass-sm" : "glass-light"} p-4 text-center`}>
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>{stat.value}</div>
                <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══ FEATURE 8: FILTER ROW ═══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {([
              { key: "due-today" as FilterKey, label: "Due today", color: "rose" },
              { key: "due-week" as FilterKey, label: "Due this week", color: "amber" },
              { key: "all" as FilterKey, label: "All", color: "indigo" },
              { key: "mastered" as FilterKey, label: "Mastered", color: "green" },
            ]).map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter.key
                    ? filter.color === "rose"
                      ? "bg-rose-400/20 text-rose-300 ring-1 ring-rose-400/30"
                      : filter.color === "amber"
                        ? "bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30"
                        : filter.color === "green"
                          ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/30"
                          : "bg-indigo/20 text-indigo-light ring-1 ring-indigo/30"
                    : isDark
                      ? "bg-white/5 text-slate-400 hover:bg-white/10"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {filter.label}
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  activeFilter === filter.key
                    ? "bg-white/10"
                    : isDark ? "bg-white/5" : "bg-slate-200"
                }`}>
                  {filterCounts[filter.key]}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ═══ FEATURE 2: QUIZ-FIRST FLOW VISUALIZATION ═══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}>
          <GlassCard className="mb-4">
            <button
              onClick={() => setShowQuizFlow(!showQuizFlow)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🧩</span>
                <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  Quiz-First Flow
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? "bg-indigo/15 text-indigo-light" : "bg-indigo-50 text-indigo-600"}`}>
                  How revision works
                </span>
              </div>
              <motion.span
                animate={{ rotate: showQuizFlow ? 180 : 0 }}
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showQuizFlow && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {/* R1 Flow */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-teal/5 border border-teal/10" : "bg-teal-50 border border-teal-100"}`}>
                      <Tag label="R1" color="teal" size="md" />
                      <div className="flex items-center gap-1.5 flex-1">
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-teal/10 text-teal" : "bg-teal-100 text-teal-700"}`}>
                          Card first
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>→</span>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-indigo/10 text-indigo-light" : "bg-indigo-100 text-indigo-700"}`}>
                          Quiz (3 Qs)
                        </div>
                      </div>
                      <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>First exposure — read, then test</span>
                    </div>

                    {/* R2-R5 Flow */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-indigo/5 border border-indigo/10" : "bg-indigo-50 border border-indigo-100"}`}>
                      <Tag label="R2-R5" color="indigo" size="md" />
                      <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-indigo/10 text-indigo-light" : "bg-indigo-100 text-indigo-700"}`}>
                          Quiz first
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>→</span>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-emerald-400/10 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
                          Pass = Done
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>/</span>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-rose-400/10 text-rose-300" : "bg-rose-100 text-rose-700"}`}>
                          Fail = Card
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>→</span>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
                          Retest
                        </div>
                      </div>
                    </div>

                    {/* R6-R10 Flow */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? "bg-purple-500/5 border border-purple-500/10" : "bg-purple-50 border border-purple-100"}`}>
                      <Tag label="R6-R10" color="purple" size="md" />
                      <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-purple-500/10 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
                          Quiz only
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>→</span>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-rose-400/10 text-rose-300" : "bg-rose-100 text-rose-700"}`}>
                          Fail = Card
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>→</span>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
                          Retest
                        </div>
                      </div>
                      {/* FEATURE 14: R6-R10 Premium indicator */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-50 text-amber-600"}`}>
                        🔒 Plus
                      </span>
                    </div>

                    {/* FEATURE 3: Pass/Fail Rule */}
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? "bg-white/3" : "bg-slate-50"}`}>
                      <span className="text-sm">✅</span>
                      <span className={`text-[11px] font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        Pass rule: <span className="font-bold">2 out of 3 correct = advance</span> to next round
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* ═══ HEAT MAP FOR BOARD/PRO ═══ */}
        {(tier === "board" || tier === "pro") && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <GlassCard className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-300">Revision Heat Map (R1-R10)</h3>
                {/* FEATURE 14: R1-R5 Free / R6-R10 Premium header badges */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 text-[9px] font-bold">
                    R1-R5 Free
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[9px] font-bold">
                    🔒 R6-R10 Plus
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-[10px] text-slate-500 pb-2 pr-4">Topic</th>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <th key={i} className={`text-center text-[10px] pb-2 w-8 ${i < 5 ? "text-slate-500" : "text-amber-400/60"}`}>
                          R{i + 1}
                        </th>
                      ))}
                      <th className="text-center text-[10px] text-slate-500 pb-2">Status</th>
                      <th className="text-center text-[10px] text-slate-500 pb-2">Urgency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTopics.map((topic) => {
                      const urgency = getUrgencyScore(topic.daysOverdue, topic.intervalDays);
                      const urgencyStyle = getUrgencyColor(urgency);
                      return (
                        <tr key={topic.id} className="border-t border-white/3">
                          <td className="py-2 pr-4">
                            <div className="flex items-center gap-1.5">
                              <div className="text-xs font-medium text-slate-300">{topic.name}</div>
                              {/* FEATURE 5: Fast Track badge */}
                              {topic.consecutivePerfect >= 3 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 text-[9px] font-bold" title="3 consecutive perfect scores — Fast Track!">
                                  🚀 Fast
                                </span>
                              )}
                              {/* FEATURE 6: 3-consecutive-fail indicator */}
                              {topic.consecutiveFails >= 3 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[9px] font-bold" title="Flagged to Mistake Genome">
                                  ⚠️ Flagged
                                </span>
                              )}
                              {/* FEATURE 13: Post-R10 Mastered badge */}
                              {topic.status === "mastered" && topic.currentRound >= 10 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-300 text-[9px] font-bold">
                                  🏅 Mastered
                                </span>
                              )}
                              {/* FEATURE 4: Boost badge */}
                              {topic.isBoost && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo/15 text-indigo-light text-[9px] font-bold">
                                  {isC1to5 ? "Fun time!" : "Extra Practice"}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-[10px] text-slate-500">{topic.subject}</div>
                              {/* FEATURE 3: Pass/Fail rule indicator */}
                              <div className="text-[9px] text-slate-600">2/3 to advance</div>
                            </div>
                          </td>
                          {Array.from({ length: 10 }).map((_, round) => {
                            const isDone = round < topic.currentRound;
                            const isCurrent = round === topic.currentRound;
                            return (
                              <td key={round} className="text-center py-2">
                                <div className={`heat-cell mx-auto ${
                                  isDone
                                    ? topic.lastScore >= 90 ? "bg-teal/30 text-teal" : topic.lastScore >= 70 ? "bg-indigo/30 text-indigo-light" : "bg-amber-400/30 text-amber-300"
                                    : isCurrent
                                      ? "bg-board-pink/20 text-board-pink ring-1 ring-board-pink/30"
                                      : "bg-white/3 text-slate-700"
                                }`}>
                                  {isDone ? "✓" : isCurrent ? "→" : "·"}
                                </div>
                              </td>
                            );
                          })}
                          <td className="text-center py-2">
                            <Tag
                              label={topic.status === "mastered" ? "Mastered" : topic.status === "struggling" ? "Boost" : topic.status === "due" ? "Due" : "Scheduled"}
                              color={topic.status === "mastered" ? "green" : topic.status === "struggling" ? "rose" : topic.status === "due" ? "amber" : "indigo"}
                            />
                          </td>
                          {/* FEATURE 7: Urgency score badge */}
                          <td className="text-center py-2">
                            {topic.status !== "mastered" && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${urgencyStyle.bg} ${urgencyStyle.text}`}>
                                {urgency.toFixed(1)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-3 text-[9px] text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-teal/30" /> 90%+ score</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo/30" /> 70-89%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400/30" /> Below 70%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-board-pink/20 ring-1 ring-board-pink/30" /> Current</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400/15" /> Fine (&lt;0.3)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400/15" /> Stale (0.3-1.0)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/15" /> Forgotten (&gt;1.0)</span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ═══ CARD LIST FOR STUDIO ═══ */}
        {tier === "studio" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const urgency = getUrgencyScore(topic.daysOverdue, topic.intervalDays);
                const urgencyStyle = getUrgencyColor(urgency);
                return (
                  <GlassCard key={topic.id} hover>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-white">{topic.name}</span>
                          <Tag label={topic.subject} color="indigo" />
                          <Tag
                            label={topic.status === "mastered" ? "Mastered" : topic.status === "struggling" ? "Boost" : topic.status === "due" ? "Due" : "Scheduled"}
                            color={topic.status === "mastered" ? "green" : topic.status === "struggling" ? "rose" : topic.status === "due" ? "amber" : "white"}
                          />
                          {/* FEATURE 5: Fast Track badge */}
                          {topic.consecutivePerfect >= 3 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 text-[10px] font-bold">
                              🚀 Fast Track
                            </span>
                          )}
                          {/* FEATURE 6: 3-consecutive-fail */}
                          {topic.consecutiveFails >= 3 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-bold">
                              ⚠️ Flagged
                            </span>
                          )}
                          {/* FEATURE 13: Mastered gold badge */}
                          {topic.status === "mastered" && topic.currentRound >= 10 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-300 text-[10px] font-bold">
                              🏅 Mastered
                            </span>
                          )}
                          {/* FEATURE 4: Boost revision badge */}
                          {topic.isBoost && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo/15 text-indigo-light text-[10px] font-bold">
                              Extra Practice
                            </span>
                          )}
                          {/* FEATURE 7: Urgency badge */}
                          {topic.status !== "mastered" && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${urgencyStyle.bg} ${urgencyStyle.text}`} title={urgencyStyle.label}>
                              {urgency.toFixed(1)}
                            </span>
                          )}
                          {/* FEATURE 14: Free/Plus indicator */}
                          {topic.currentRound <= 5 ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 text-[9px] font-bold">Free</span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[9px] font-bold">🔒 Plus</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Round {topic.currentRound}/{topic.maxRounds}</span>
                          <span>Last: {topic.lastScore}%</span>
                          <span>Next: {topic.nextDue}</span>
                          {/* FEATURE 3: Pass/fail rule */}
                          <span className="text-[10px] text-slate-500">2/3 correct = advance</span>
                        </div>

                        {/* FEATURE 5: Fast Track message */}
                        {topic.consecutivePerfect >= 3 && (
                          <div className="mt-1.5 text-[10px] text-emerald-400/80">
                            You&apos;re remembering this so well, we&apos;re speeding up!
                          </div>
                        )}

                        {/* FEATURE 6: 3-fail message */}
                        {topic.consecutiveFails >= 3 && (
                          <div className="mt-1.5 text-[10px] text-red-400/80">
                            Flagged to Mistake Genome for deeper analysis
                          </div>
                        )}

                        {/* FEATURE 13: Mastered celebration */}
                        {topic.status === "mastered" && topic.currentRound >= 10 && (
                          <div className="mt-1.5 text-[10px] text-yellow-300/80">
                            🏅 Mastered — No more revisions!
                          </div>
                        )}

                        {/* FEATURE 4: Boost details */}
                        {topic.isBoost && (
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-indigo-light/70">
                            <span>🔊</span>
                            <span>2 easier + 1 standard question</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* FEATURE 1: Card preview toggle */}
                        <button
                          onClick={() => setShowCardPreview(showCardPreview === topic.id ? null : topic.id)}
                          className={`text-[10px] px-2 py-1 rounded-lg transition ${
                            showCardPreview === topic.id
                              ? "bg-indigo/20 text-indigo-light"
                              : "bg-white/5 text-slate-500 hover:bg-white/10"
                          }`}
                        >
                          📄 Card
                        </button>
                        <ProgressBar value={topic.currentRound} max={topic.maxRounds} color={topic.status === "mastered" ? "teal" : "indigo"} className="w-24" showLabel />
                      </div>
                    </div>

                    {/* FEATURE 1: Revision Card Content Preview */}
                    <AnimatePresence>
                      {showCardPreview === topic.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`mt-3 p-3 rounded-xl ${isDark ? "bg-white/3 border border-white/5" : "bg-slate-50 border border-slate-100"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs">📋</span>
                              <span className={`text-[11px] font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Revision Card Preview</span>
                            </div>
                            <div className={`text-xs mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                              <span className="font-semibold">Core Concept:</span> {topic.coreConcept}
                            </div>
                            <div className={`text-xs mb-2 font-mono ${isDark ? "bg-indigo/5 text-indigo-light border border-indigo/10" : "bg-indigo-50 text-indigo-700 border border-indigo-100"} px-2 py-1 rounded-lg`}>
                              {topic.keyFormula}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? "bg-teal/10 text-teal" : "bg-teal-100 text-teal-700"}`}>
                                3 questions
                              </span>
                              <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                {topic.currentRound === 1 ? "Card first → then quiz" : topic.currentRound <= 5 ? "Quiz first → fail shows card" : "Quiz only"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ STORYBOOK/EXPLORER: GARDEN-STYLE (INVISIBLE) ═══ */}
        {isInvisible && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-6 text-center`}>
              <div className="text-5xl mb-4">🌱</div>
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                Growing Quietly
              </h3>
              <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {student.name}&apos;s revision happens naturally through the learning flow.
                <br />Topics come back at the perfect time — no stress, no pressure.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {EXTENDED_REVISION.slice(0, 6).map((topic, idx) => (
                  <div key={topic.id} className={`${isDark ? "glass-sm" : "bg-white rounded-2xl border border-slate-100"} p-3 relative`}>
                    <div className="text-2xl mb-1">{topic.status === "mastered" ? "🌸" : topic.status === "due" ? "🌱" : topic.status === "struggling" ? "🥀" : "🫘"}</div>
                    {/* FEATURE 10: Disguised language for C1-5 */}
                    <div className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {getDisguisedLabel(topic.name, idx)}
                    </div>
                    <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {topic.status === "mastered" ? "Bloomed!" : `Growing (R${topic.currentRound})`}
                    </div>
                    {/* FEATURE 4: Boost badge for C1-5 */}
                    {topic.isBoost && (
                      <span className="absolute top-1 right-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-indigo/15 text-indigo-light text-[8px] font-bold">
                        Fun time!
                      </span>
                    )}
                    {/* FEATURE 5: Fast Track — shown differently for C1-5 */}
                    {topic.consecutivePerfect >= 3 && (
                      <div className="mt-1 text-[9px] text-emerald-400/80">
                        Super memory!
                      </div>
                    )}
                    {/* FEATURE 13: Mastered celebration for C1-5 */}
                    {topic.status === "mastered" && topic.currentRound >= 10 && (
                      <div className="mt-1 text-[9px] text-yellow-300">
                        🏅 You did it!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ FEATURE 1: REVISION CARD CONTENT PREVIEW (standalone for Board/Pro) ═══ */}
        {(tier === "board" || tier === "pro") && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <GlassCard className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h3 className="text-sm font-bold text-slate-300">Current Revision Card</h3>
                </div>
                <Tag label="3 questions" color="teal" />
              </div>
              {(() => {
                const currentItem = EXTENDED_REVISION.find(t => t.status === "due") || EXTENDED_REVISION[0];
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-white">{currentItem.name}</span>
                      <Tag label={`R${currentItem.currentRound}`} color="indigo" />
                      {currentItem.consecutivePerfect >= 3 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 text-[9px] font-bold">
                          🚀 Fast Track
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 mb-2">
                      <span className="font-semibold text-slate-200">Core Concept:</span> {currentItem.coreConcept}
                    </div>
                    <div className="text-xs font-mono bg-indigo/5 text-indigo-light border border-indigo/10 px-3 py-2 rounded-lg mb-2">
                      {currentItem.keyFormula}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>
                        {currentItem.currentRound === 1 ? "Card first → Quiz (3 Qs)" : currentItem.currentRound <= 5 ? "Quiz first → Pass=Done, Fail=Show Card → Retest" : "Quiz only → Fail=Card → Retest"}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span>2/3 correct = advance</span>
                    </div>
                  </div>
                );
              })()}
            </GlassCard>
          </motion.div>
        )}

        {/* ═══ FEATURE 4: BOOST REVISION SECTION ═══ */}
        {EXTENDED_REVISION.some(t => t.isBoost) && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}>
            <GlassCard className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💪</span>
                <h3 className={`text-sm font-bold ${isDark ? "text-indigo-light" : "text-indigo-600"}`}>
                  Boost Revision
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? "bg-indigo/15 text-indigo-light" : "bg-indigo-50 text-indigo-600"}`}>
                  {isC1to5 ? "Fun time!" : "Extra Practice"}
                </span>
              </div>
              {EXTENDED_REVISION.filter(t => t.isBoost).map((topic) => (
                <div key={topic.id} className={`p-3 rounded-xl mb-2 ${isDark ? "bg-indigo/5 border border-indigo/10" : "bg-indigo-50 border border-indigo-100"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{topic.name}</span>
                        <Tag label={topic.subject} color="indigo" />
                        {topic.consecutiveFails >= 3 && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[9px] font-bold">
                            ⚠️ Flagged
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          🔊 Voice-guided
                        </span>
                        <span className={`text-[10px] ${isDark ? "text-indigo-light/70" : "text-indigo-500"}`}>
                          2 easier + 1 standard question
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={topic.currentRound} max={topic.maxRounds} color="indigo" className="w-20" showLabel />
                  </div>
                </div>
              ))}
              {EXTENDED_REVISION.filter(t => t.isBoost && t.consecutiveFails >= 3).length > 0 && (
                <div className={`mt-2 p-2 rounded-lg ${isDark ? "bg-red-500/5 border border-red-500/10" : "bg-red-50 border border-red-100"}`}>
                  <span className={`text-[10px] ${isDark ? "text-red-400/70" : "text-red-500"}`}>
                    ⚠️ Topics with 3+ consecutive fails are flagged to Mistake Genome for deeper pattern analysis.
                  </span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* ═══ FEATURE 12: EXPORT REVISION AS PDF (C9+ only) ═══ */}
        {isC9Plus && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className={`${isDark ? "glass-sm" : "bg-white/50 rounded-2xl border border-slate-100"} p-3 mb-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <div>
                  <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Export Revision Schedule</div>
                  <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Download your full revision plan as PDF</div>
                </div>
              </div>
              <button className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isDark
                  ? "bg-indigo/20 text-indigo-light hover:bg-indigo/30 border border-indigo/20"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ FEATURE 13: MASTERED CELEBRATION SECTION ═══ */}
        {EXTENDED_REVISION.some(t => t.status === "mastered" && t.currentRound >= 10) && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}>
            <div className={`${isDark ? "bg-yellow-400/5 border border-yellow-400/15" : "bg-yellow-50 border border-yellow-200"} rounded-2xl p-4 mb-4`}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏅</div>
                <div>
                  <div className={`text-sm font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"}`}>
                    Topics Fully Mastered
                  </div>
                  <div className={`text-xs ${isDark ? "text-yellow-400/60" : "text-yellow-600"}`}>
                    These topics completed all 10 revision rounds with flying colors. No more revisions needed!
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {EXTENDED_REVISION.filter(t => t.status === "mastered" && t.currentRound >= 10).map(t => (
                  <span key={t.id} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${isDark ? "bg-yellow-400/10 text-yellow-300" : "bg-yellow-100 text-yellow-700"}`}>
                    🏅 {t.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ FEATURE 5: FAST TRACK SECTION ═══ */}
        {EXTENDED_REVISION.some(t => t.consecutivePerfect >= 3) && isC6Plus && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.33 }}>
            <div className={`${isDark ? "bg-emerald-400/5 border border-emerald-400/15" : "bg-emerald-50 border border-emerald-200"} rounded-2xl p-4 mb-4`}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <div className={`text-sm font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                    Fast Track Topics
                  </div>
                  <div className={`text-xs ${isDark ? "text-emerald-400/60" : "text-emerald-600"}`}>
                    3 consecutive perfect scores — revision intervals accelerated!
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {EXTENDED_REVISION.filter(t => t.consecutivePerfect >= 3).map(t => (
                  <div key={t.id} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? "bg-emerald-400/5" : "bg-emerald-50"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚀</span>
                      <span className={`text-xs font-medium ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>{t.name}</span>
                      <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>({t.consecutivePerfect} perfect in a row)</span>
                    </div>
                    <span className={`text-[10px] ${isDark ? "text-emerald-400/70" : "text-emerald-600"}`}>
                      You&apos;re remembering this so well, we&apos;re speeding up!
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ ACCELERATION INFO ═══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className={`${isDark ? "glass-sm" : "bg-white/50 rounded-2xl border border-slate-100"} p-4 mt-4`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <div>
                <div className={`text-xs font-bold ${isDark ? "text-teal" : "text-teal-dark"}`}>Acceleration Active</div>
                <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  3 perfect scores in a row? Skip 1 revision round! No reset ever — fail = boost, not drop.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (tier === "storybook") {
    return <><Header />{content}</>;
  }

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
