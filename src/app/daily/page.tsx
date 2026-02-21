"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DailyTask } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ═══════════════════════════════════════════════════════ */

// Adaptive ratio presets based on tier
const RATIO_PRESETS: Record<string, { newPct: number; fixPct: number; revPct: number; label: string }> = {
  default:  { newPct: 60, fixPct: 25, revPct: 15, label: "Balanced" },
  mistakes: { newPct: 40, fixPct: 40, revPct: 20, label: "Heavy Mistakes" },
  board:    { newPct: 20, fixPct: 30, revPct: 50, label: "Board Exam" },
};

// Task count ranges by class grouping
const TASK_COUNT_MAP: Record<string, { min: number; max: number; label: string }> = {
  storybook: { min: 3, max: 4, label: "C1-2" },
  explorer:  { min: 4, max: 5, label: "C3-5" },
  studio:    { min: 5, max: 6, label: "C6-8" },
  board:     { min: 6, max: 7, label: "C9-10" },
  pro:       { min: 7, max: 9, label: "C11-12" },
};

// Task type styles: color and icon per type
const TASK_TYPE_STYLES: Record<string, { color: "indigo" | "teal" | "amber" | "purple" | "rose"; icon: string; label: string }> = {
  learn:      { color: "indigo", icon: "📘", label: "Learn" },
  revise:     { color: "teal",   icon: "🔄", label: "Revise" },
  practice:   { color: "amber",  icon: "✏️", label: "Practice" },
  fix:        { color: "amber",  icon: "🔧", label: "Fix" },
  spark:      { color: "purple", icon: "⚡", label: "SPARK" },
  "life-skill": { color: "rose", icon: "💛", label: "Life Skills" },
};

// Tier-adapted task labels for C1-2 (storybook)
const STORYBOOK_LABELS: Record<string, string> = {
  learn: "Story time!",
  revise: "Let\u2019s remember!",
  practice: "Play with numbers!",
  fix: "Fun fix-up!",
  spark: "Magic moment!",
  "life-skill": "Good habits time!",
};

// Tier-adapted demo tasks — different count per tier
type TaskWithP0 = DailyTask & { isP0?: boolean };

function getTasksForTier(tier: string): TaskWithP0[] {
  const range = TASK_COUNT_MAP[tier] || TASK_COUNT_MAP.studio;

  if (tier === "storybook") {
    return ([
      { id: "d1", time: "9:00 AM", title: "Fun time! Count the apples", subject: "Numbers", type: "learn" as const, duration: "15 min", completed: true, emoji: "🔢" },
      { id: "d2", time: "9:20 AM", title: "Let\u2019s remember! ABC song", subject: "Stories", type: "revise" as const, duration: "10 min", completed: true, emoji: "🔄" },
      { id: "d3", time: "9:35 AM", title: "Play with numbers! 2 + 3 = ?", subject: "Numbers", type: "practice" as const, duration: "15 min", completed: false, emoji: "✏️" },
      { id: "d4", time: "9:55 AM", title: "Good habits time! Sharing", subject: "Good Habits", type: "life-skill" as const, duration: "10 min", completed: false, emoji: "💛" },
    ] satisfies TaskWithP0[]).slice(0, range.max);
  }

  if (tier === "explorer") {
    return ([
      { id: "d1", time: "9:00 AM", title: "Fix: Sign errors in subtraction", subject: "Mathematics", type: "practice" as const, duration: "15 min", completed: false, emoji: "🔧", isP0: true },
      { id: "d2", time: "9:20 AM", title: "Fractions \u2014 Adding unlike fractions", subject: "Mathematics", type: "learn" as const, duration: "20 min", completed: true, emoji: "📐" },
      { id: "d3", time: "9:45 AM", title: "Revision: Parts of Speech (R3)", subject: "English", type: "revise" as const, duration: "15 min", completed: true, emoji: "🔄" },
      { id: "d4", time: "10:05 AM", title: "Photosynthesis experiment", subject: "Science", type: "learn" as const, duration: "20 min", completed: false, emoji: "🔬" },
      { id: "d5", time: "10:30 AM", title: "Being a Team Player", subject: "Life Skills", type: "life-skill" as const, duration: "10 min", completed: false, emoji: "💛" },
    ] satisfies TaskWithP0[]).slice(0, range.max);
  }

  if (tier === "board") {
    return ([
      { id: "d1", time: "9:00 AM", title: "Fix: Negative sign errors in algebra", subject: "Mathematics", type: "practice" as const, duration: "20 min", completed: false, emoji: "🔧", isP0: true },
      { id: "d2", time: "9:25 AM", title: "Quadratic Equations \u2014 Discriminant", subject: "Mathematics", type: "learn" as const, duration: "25 min", completed: true, emoji: "📐" },
      { id: "d3", time: "9:55 AM", title: "Revision: Chemical Bonding (R2)", subject: "Science", type: "revise" as const, duration: "15 min", completed: true, emoji: "🔄" },
      { id: "d4", time: "10:15 AM", title: "Active-Passive Voice Practice", subject: "English", type: "practice" as const, duration: "20 min", completed: false, emoji: "✏️" },
      { id: "d5", time: "10:40 AM", title: "SPARK Check: Logical Domain", subject: "SPARK", type: "spark" as const, duration: "10 min", completed: false, emoji: "⚡" },
      { id: "d6", time: "10:55 AM", title: "Nationalism in India", subject: "Social Science", type: "learn" as const, duration: "25 min", completed: false, emoji: "🏛️" },
      { id: "d7", time: "11:25 AM", title: "Peer Pressure \u2014 Dilemma", subject: "Life Skills", type: "life-skill" as const, duration: "15 min", completed: false, emoji: "💛" },
    ] satisfies TaskWithP0[]).slice(0, range.max);
  }

  if (tier === "pro") {
    return ([
      { id: "d1", time: "8:30 AM", title: "Fix: Integration by parts sign errors", subject: "Mathematics", type: "practice" as const, duration: "20 min", completed: false, emoji: "🔧", isP0: true },
      { id: "d2", time: "8:55 AM", title: "Electromagnetic Induction", subject: "Physics", type: "learn" as const, duration: "30 min", completed: true, emoji: "⚡" },
      { id: "d3", time: "9:30 AM", title: "Revision: Organic Reactions (R4)", subject: "Chemistry", type: "revise" as const, duration: "20 min", completed: true, emoji: "🔄" },
      { id: "d4", time: "9:55 AM", title: "Integration Practice Set", subject: "Mathematics", type: "practice" as const, duration: "25 min", completed: false, emoji: "✏️" },
      { id: "d5", time: "10:25 AM", title: "SPARK: Intrapersonal check", subject: "SPARK", type: "spark" as const, duration: "10 min", completed: false, emoji: "⚡" },
      { id: "d6", time: "10:40 AM", title: "Data Structures \u2014 Trees", subject: "Computer Science", type: "learn" as const, duration: "25 min", completed: false, emoji: "💻" },
      { id: "d7", time: "11:10 AM", title: "Revision: Electromagnetic Waves", subject: "Physics", type: "revise" as const, duration: "15 min", completed: false, emoji: "🔄" },
      { id: "d8", time: "11:30 AM", title: "Career Planning \u2014 Dilemma", subject: "Life Skills", type: "life-skill" as const, duration: "15 min", completed: false, emoji: "💛" },
      { id: "d9", time: "11:50 AM", title: "Report Writing Practice", subject: "English", type: "practice" as const, duration: "20 min", completed: false, emoji: "✏️" },
    ] satisfies TaskWithP0[]).slice(0, range.max);
  }

  // studio (default / C6-8)
  return ([
    { id: "d1", time: "9:00 AM", title: "Fix: Negative sign errors in algebra", subject: "Mathematics", type: "practice" as const, duration: "20 min", completed: false, emoji: "🔧", isP0: true },
    { id: "d2", time: "9:25 AM", title: "Algebraic Expressions \u2014 Factoring", subject: "Mathematics", type: "learn" as const, duration: "25 min", completed: true, emoji: "📐" },
    { id: "d3", time: "9:55 AM", title: "Revision: Combustion & Flame (R3)", subject: "Science", type: "revise" as const, duration: "15 min", completed: true, emoji: "🔄" },
    { id: "d4", time: "10:15 AM", title: "Active-Passive Voice Practice", subject: "English", type: "practice" as const, duration: "20 min", completed: false, emoji: "✏️" },
    { id: "d5", time: "10:40 AM", title: "SPARK Check: Logical Domain", subject: "SPARK", type: "spark" as const, duration: "10 min", completed: false, emoji: "⚡" },
    { id: "d6", time: "10:55 AM", title: "Managing Emotions \u2014 Scenario", subject: "Life Skills", type: "life-skill" as const, duration: "15 min", completed: false, emoji: "💛" },
  ] satisfies TaskWithP0[]).slice(0, range.max);
}

// Donut chart SVG component
function DonutChart({ slices, size = 100 }: { slices: { pct: number; color: string; label: string }[]; size?: number }) {
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {slices.map((slice, i) => {
        const dashLength = (slice.pct / 100) * circumference;
        const dashOffset = -accumulated;
        accumulated += dashLength;
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700"
          />
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DailyPage() {
  const { tier, isDark, student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";
  const tasks = getTasksForTier(tier);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(tasks.filter(t => t.completed).map(t => t.id))
  );
  const [showDeviation, setShowDeviation] = useState(true);
  const completed = checkedIds.size;
  const isStorybook = tier === "storybook";

  // Determine adaptive ratio based on tier
  const ratioKey = tier === "board" || tier === "pro" ? "board" : tasks.some(t => (t as { isP0?: boolean }).isP0) ? "mistakes" : "default";
  const ratio = RATIO_PRESETS[ratioKey];

  const taskRange = TASK_COUNT_MAP[tier] || TASK_COUNT_MAP.studio;

  // Check for skipped subjects (deviation detection)
  const pendingSubjects = tasks
    .filter(t => !checkedIds.has(t.id))
    .map(t => t.subject);
  const deviationSubject = pendingSubjects[0];

  function toggleTask(id: string) {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getTaskLabel(task: DailyTask): string {
    if (isStorybook) {
      return STORYBOOK_LABELS[task.type] || task.title;
    }
    return task.title;
  }

  const content = (
    <div className={`min-h-screen ${isStorybook ? "bg-storybook-bg font-nunito" : "bg-navy"} relative overflow-hidden`}>
      <div className="blob blob-indigo w-96 h-96 -top-40 right-0 opacity-10" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">

        {/* ── Header ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {isStorybook ? "Today\u2019s Fun Plan!" : "Daily Blueprint"}
              </h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {student.name}&apos;s plan for today &middot; {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-black ${isDark ? "text-indigo-light" : "text-indigo"}`}>
                {completed}/{tasks.length}
              </div>
              <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Completed</div>
            </div>
          </div>
        </motion.div>

        {/* ── Task count by class badge ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.03 }}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Tag label={`${taskRange.label}: ${taskRange.min}-${taskRange.max} tasks`} color="indigo" size="md" />
            <Tag label="Subject rotation: max 2 per subject per day" color="teal" size="md" />
          </div>
        </motion.div>

        {isParentView && (
          <div className={`mb-4 p-3 rounded-xl border ${isDark ? "bg-teal/5 border-teal/20" : "bg-teal-50 border-teal-200"}`}>
            <p className={`text-xs font-semibold ${isDark ? "text-teal" : "text-teal-700"}`}>
              Parent View — You are viewing {student.name}&apos;s daily plan. Tasks are AI-generated from 3 sources: new lessons, mistake fixes, and spaced revision.
            </p>
          </div>
        )}

        {/* ── Progress bar ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <ProgressBar value={completed} max={tasks.length} color="teal" className="mb-6" showLabel />
        </motion.div>

        {/* ── Adaptive Ratio Donut ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}>
          <div className={`${isDark ? "glass-sm" : "bg-white rounded-2xl border border-slate-100 shadow-sm"} p-5 mb-6`}>
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <DonutChart
                  size={110}
                  slices={[
                    { pct: ratio.newPct, color: "#6366f1", label: "New" },
                    { pct: ratio.fixPct, color: "#f59e0b", label: "Fix" },
                    { pct: ratio.revPct, color: "#14b8a6", label: "Revision" },
                  ]}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-[10px] font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Ratio</div>
                </div>
              </div>
              <div className="flex-1">
                <div className={`text-sm font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                  Adaptive Learning Ratio
                  <span className={`ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    ratioKey === "board" ? "bg-rose-500/15 text-rose-400"
                    : ratioKey === "mistakes" ? "bg-amber-400/15 text-amber-300"
                    : "bg-indigo/15 text-indigo-light"
                  }`}>
                    {ratio.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo" />
                    <span className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{ratio.newPct}% New Content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500" />
                    <span className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{ratio.fixPct}% Fix / Practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-teal" />
                    <span className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{ratio.revPct}% Revision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Blueprint deviation nudge ── */}
        <AnimatePresence>
          {showDeviation && deviationSubject && completed > 0 && completed < tasks.length && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className={`${isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"} rounded-2xl p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">&#128221;</span>
                  <div>
                    <div className={`text-sm font-semibold ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                      {deviationSubject} practice pending
                    </div>
                    <div className={`text-[10px] ${isDark ? "text-amber-400/70" : "text-amber-600/70"}`}>
                      Gentle nudge: try to follow your blueprint order for best results
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeviation(false)}
                  className={`text-xs px-2 py-1 rounded-lg ${isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Task list ── */}
        <div className="space-y-3">
          {tasks.map((task, i) => {
            const isChecked = checkedIds.has(task.id);
            const isP0 = i === 0 && (task as { isP0?: boolean }).isP0;
            const style = TASK_TYPE_STYLES[task.type] || TASK_TYPE_STYLES.learn;
            const displayLabel = getTaskLabel(task);

            return (
              <motion.div
                key={task.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.05 }}
              >
                <div className={`${isDark ? "glass-sm" : "bg-white rounded-2xl border border-slate-100 shadow-sm"} p-4 ${
                  isP0 && !isChecked ? isDark ? "ring-1 ring-red-500/40" : "ring-1 ring-red-300" : ""
                }`}>
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                      ${isChecked
                        ? isDark ? "bg-teal/15" : "bg-teal/10"
                        : isDark ? "bg-white/5" : "bg-slate-50"
                      }`}
                      style={!isChecked ? { backgroundColor: `${
                        style.color === "indigo" ? "rgba(99,102,241,0.1)" :
                        style.color === "teal" ? "rgba(20,184,166,0.1)" :
                        style.color === "amber" ? "rgba(245,158,11,0.1)" :
                        style.color === "purple" ? "rgba(168,85,247,0.1)" :
                        "rgba(251,113,133,0.1)"
                      }` } : undefined}
                    >
                      {style.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {/* P0 badge */}
                        {isP0 && !isChecked && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 animate-pulse">
                            P0 &mdash; Fix First
                          </span>
                        )}
                        <span className={`text-sm font-medium truncate ${
                          isChecked
                            ? isDark ? "text-slate-500 line-through" : "text-slate-400 line-through"
                            : isDark ? "text-white" : "text-slate-800"
                        }`}>
                          {displayLabel}
                        </span>
                        <Tag label={style.label} color={style.color} />
                      </div>
                      <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {task.time} &middot; {task.duration} &middot; {task.subject}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs cursor-pointer transition-all shrink-0
                        ${isChecked
                          ? "bg-teal border-teal text-white"
                          : isDark ? "border-slate-600 hover:border-slate-400" : "border-slate-300 hover:border-slate-500"
                        }`}
                    >
                      {isChecked && "\u2713"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Time summary ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className={`${isDark ? "glass-sm" : "bg-white/50 rounded-2xl border border-slate-100"} p-4 mt-6`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-lg font-bold ${isDark ? "text-indigo-light" : "text-indigo"}`}>
                  {isStorybook ? "50m" : tier === "pro" ? "3h 20m" : "1h 50m"}
                </div>
                <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Total Today</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${isDark ? "text-teal" : "text-teal-dark"}`}>
                  {isStorybook ? "25m" : tier === "pro" ? "50m" : "40 min"}
                </div>
                <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Done</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  {isStorybook ? "25m" : tier === "pro" ? "2h 30m" : "1h 10m"}
                </div>
                <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Remaining</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Legend: task type colors ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
          <div className={`${isDark ? "glass-sm" : "bg-white rounded-2xl border border-slate-100 shadow-sm"} p-4 mt-4`}>
            <div className={`text-xs font-bold mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Task Types</div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TASK_TYPE_STYLES).map(([key, s]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-sm">{s.icon}</span>
                  <Tag label={s.label} color={s.color} />
                </div>
              ))}
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
