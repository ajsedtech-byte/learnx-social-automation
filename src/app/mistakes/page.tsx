"use client";
import { useState, useEffect, useMemo } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import GlassCard from "@/components/ui/GlassCard";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
type LifecycleState = "ACTIVE" | "IN_PROGRESS" | "IMPROVED" | "MASTERED" | "REOPENED";
type Priority = "P0" | "P1" | "P2";
type Confidence = "sure" | "not_sure" | "guess";

interface MistakeGenomeItem {
  id: string;
  /** Topic / concept name */
  topic: string;
  /** Subject area */
  subject: string;
  /** Subtopic for C6+ display */
  subtopic?: string;
  /** The full question text */
  question?: string;
  /** Student's wrong answer */
  wrongAnswer?: string;
  /** Correct answer */
  correctAnswer?: string;
  /** Brief explanation of why it's wrong */
  whyWrong?: string;
  /** Detailed gap analysis for C11-12 */
  detailedExplanation?: string;
  /** Character emoji for storybook tier */
  characterEmoji?: string;
  /** Lifecycle state */
  state: LifecycleState;
  /** Student confidence when they answered */
  confidence: Confidence;
  /** Computed priority */
  priority: Priority;
  /** Strike count (0-3) */
  strikes: number;
  /** Frequency detected */
  frequency: number;
  /** Prerequisite chain for fix pipeline */
  prerequisiteChain?: string[];
  /** Fix tutorial duration */
  fixDuration?: string;
  /** Retest schedule */
  retestFirst?: string;
  retestSecond?: string;
  /** Regression message */
  regressionNote?: string;
  /** AI suggestion */
  suggestion: string;
  /** Resolution percentage */
  resolution: number;
}

interface StrengthItem {
  id: string;
  topic: string;
  subject: string;
  characterEmoji?: string;
  masteredDate: string;
  score: number;
  celebrationMsg: string;
}

// ═══════════════════════════════════════════════════════════
// LIFECYCLE CONFIG
// ═══════════════════════════════════════════════════════════
const LIFECYCLE_CONFIG: Record<LifecycleState, {
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  tagColor: "rose" | "amber" | "teal" | "green" | "red";
  description: string;
  pulse?: boolean;
}> = {
  ACTIVE: {
    label: "Active",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    textClass: "text-red-400",
    tagColor: "rose",
    description: "Wrong answer detected, queued for fix",
    pulse: true,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#f59e0b",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    textClass: "text-amber-400",
    tagColor: "amber",
    description: "Working on fix tutorial",
  },
  IMPROVED: {
    label: "Improved",
    color: "#2dd4bf",
    bgClass: "bg-teal/10",
    borderClass: "border-teal/30",
    textClass: "text-teal",
    tagColor: "teal",
    description: "Practice questions correct! Retest scheduled",
  },
  MASTERED: {
    label: "Mastered",
    color: "#eab308",
    bgClass: "bg-yellow-400/10",
    borderClass: "border-yellow-400/30",
    textClass: "text-yellow-400",
    tagColor: "green",
    description: "Both retests passed!",
  },
  REOPENED: {
    label: "Reopened",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    textClass: "text-red-400",
    tagColor: "red",
    description: "Reappeared — priority escalated",
  },
};

const LIFECYCLE_ORDER: LifecycleState[] = ["ACTIVE", "IN_PROGRESS", "IMPROVED", "MASTERED", "REOPENED"];

// ═══════════════════════════════════════════════════════════
// PRIORITY CONFIG
// ═══════════════════════════════════════════════════════════
const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  internalLabel: string;
  color: string;
  tagColor: "rose" | "amber" | "white";
}> = {
  P0: { label: "Urgent", internalLabel: "Dangerous Misconception", color: "#ef4444", tagColor: "rose" },
  P1: { label: "Important", internalLabel: "Honest Gap", color: "#f59e0b", tagColor: "amber" },
  P2: { label: "Normal", internalLabel: "Expected Gap", color: "#64748b", tagColor: "white" },
};

// ═══════════════════════════════════════════════════════════
// DEMO DATA — MISTAKES (Needs Practice tab)
// ═══════════════════════════════════════════════════════════
const DEMO_GENOME_MISTAKES: MistakeGenomeItem[] = [
  {
    id: "mg1",
    topic: "Negative Sign Distribution",
    subject: "Mathematics",
    subtopic: "Algebraic Expressions",
    question: "Simplify: 5 - (3x + 2)",
    wrongAnswer: "5 - 3x + 2 = 7 - 3x",
    correctAnswer: "5 - 3x - 2 = 3 - 3x",
    whyWrong: "Failed to distribute the negative sign to ALL terms inside the bracket. The minus before the bracket flips the sign of every term inside.",
    detailedExplanation: "This is a fundamental distribution error. When a negative sign (or subtraction) precedes parentheses, every term inside must have its sign reversed. This is equivalent to multiplying by -1: -(3x+2) = (-1)(3x) + (-1)(2) = -3x - 2. This pattern recurs in polynomial manipulation, equation solving, and calculus.",
    characterEmoji: "🐱",
    state: "ACTIVE",
    confidence: "sure",
    priority: "P0",
    strikes: 2,
    frequency: 8,
    prerequisiteChain: ["C7 Algebraic Expressions", "C6 Integer Operations", "C5 Negative Numbers", "C3 Subtraction Concepts"],
    fixDuration: "4 min",
    suggestion: "Practice bracket expansion with sign tracking — write out each step",
    resolution: 15,
  },
  {
    id: "mg2",
    topic: "Displacement vs Double Displacement",
    subject: "Science",
    subtopic: "Chemical Reactions",
    question: "Classify: AgNO3 + NaCl -> AgCl + NaNO3",
    wrongAnswer: "Single Displacement",
    correctAnswer: "Double Displacement",
    whyWrong: "In double displacement, BOTH compounds exchange partners. In single displacement, only ONE element replaces another in a compound.",
    detailedExplanation: "The confusion stems from not counting how many species are swapped. Single displacement: A + BC -> AC + B (one swap). Double displacement: AB + CD -> AD + CB (mutual swap). Mnemonic: 'double = two couples swapping dance partners'. This distinction is critical for predicting reaction products and understanding precipitation reactions.",
    characterEmoji: "🧪",
    state: "IN_PROGRESS",
    confidence: "not_sure",
    priority: "P1",
    strikes: 1,
    frequency: 5,
    prerequisiteChain: ["C10 Chemical Reactions", "C9 Atoms & Molecules", "C7 Elements & Compounds"],
    fixDuration: "3 min",
    retestFirst: "Feb 26",
    suggestion: "Use the 'partner swap' analogy — single = one person cuts in, double = two couples swap",
    resolution: 45,
  },
  {
    id: "mg3",
    topic: "Cause vs Effect in Comprehension",
    subject: "English",
    subtopic: "Reading Comprehension",
    question: "What was the CAUSE of the protagonist leaving the village?",
    wrongAnswer: "He went to the city and became successful",
    correctAnswer: "The drought destroyed his family's farmland",
    whyWrong: "Confused cause (reason WHY something happened) with effect (what happened AFTER). The question asks for the trigger, not the outcome.",
    detailedExplanation: "Cause-effect confusion is a critical reading comprehension gap. The cause is the antecedent event/condition that leads to a consequence. Students must distinguish between temporal sequence (what happened next) and causal relationship (what made it happen). Strategy: underline the action word in the question — 'cause' means look BACKWARDS in the text.",
    characterEmoji: "📖",
    state: "IMPROVED",
    confidence: "sure",
    priority: "P0",
    strikes: 0,
    frequency: 6,
    prerequisiteChain: ["C8 Comprehension Strategies", "C6 Paragraph Structure", "C4 Sentence Meaning"],
    fixDuration: "5 min",
    retestFirst: "Feb 24",
    retestSecond: "Mar 3",
    suggestion: "Underline the action word in every question before answering",
    resolution: 75,
  },
  {
    id: "mg4",
    topic: "Quadratic Formula Sign Error",
    subject: "Mathematics",
    subtopic: "Quadratic Equations",
    question: "Solve: x^2 - 5x + 6 = 0 using the quadratic formula",
    wrongAnswer: "x = (5 +/- sqrt(25+24)) / 2 = (5 +/- 7) / 2",
    correctAnswer: "x = (5 +/- sqrt(25-24)) / 2 = (5 +/- 1) / 2 => x=3 or x=2",
    whyWrong: "Used +4ac instead of -4ac in discriminant. The formula is b^2 - 4ac, and the minus is critical.",
    detailedExplanation: "The discriminant b^2-4ac determines the nature and value of roots. Using +4ac instead of -4ac dramatically changes results. For this equation: a=1, b=-5, c=6. Discriminant = (-5)^2 - 4(1)(6) = 25-24 = 1. The error of adding instead of subtracting gives 49, yielding completely wrong roots. This sign error propagates to all quadratic-based problems in higher mathematics.",
    characterEmoji: "🔢",
    state: "ACTIVE",
    confidence: "guess",
    priority: "P2",
    strikes: 0,
    frequency: 3,
    prerequisiteChain: ["C10 Quadratic Equations", "C9 Polynomials", "C8 Linear Equations", "C7 Algebraic Expressions"],
    fixDuration: "3 min",
    suggestion: "Write the formula on a card and circle the minus sign before -4ac every time",
    resolution: 10,
  },
  {
    id: "mg5",
    topic: "French Revolution Timeline",
    subject: "Social Science",
    subtopic: "History - Modern World",
    question: "What event triggered the French Revolution in 1789?",
    wrongAnswer: "Napoleon's rise to power",
    correctAnswer: "The storming of the Bastille on July 14, 1789",
    whyWrong: "Napoleon rose to power AFTER the Revolution (1799). The student confused the trigger event with a consequence that came a decade later.",
    detailedExplanation: "This represents a chronological sequencing error common in history. The French Revolution timeline: Estates General (May 1789) -> Tennis Court Oath (June) -> Storming of Bastille (July 14) -> Declaration of Rights (August) -> ... -> Reign of Terror (1793-94) -> Directory -> Napoleon's coup (1799). Students must separate causes, events, and consequences along the timeline.",
    characterEmoji: "🏛️",
    state: "REOPENED",
    confidence: "sure",
    priority: "P0",
    strikes: 3,
    frequency: 4,
    prerequisiteChain: ["C9 Modern History", "C8 World Events", "C7 Timeline Skills"],
    fixDuration: "5 min",
    retestFirst: "Feb 25",
    regressionNote: "This one came back — we'll try a different approach this time",
    suggestion: "Build a visual timeline: pin events on a number line before answering any question",
    resolution: 30,
  },
  {
    id: "mg6",
    topic: "Electromagnetic Induction Direction",
    subject: "Physics",
    subtopic: "Electromagnetic Induction",
    question: "A magnet is pushed into a coil. In which direction does the induced current flow?",
    wrongAnswer: "Same direction as the magnetic field",
    correctAnswer: "In the direction that opposes the change (Lenz's Law) — the induced current creates a field opposing the magnet's approach",
    whyWrong: "Ignored Lenz's Law. The induced current always opposes the change that caused it — this is a conservation of energy consequence.",
    detailedExplanation: "Lenz's Law states the induced EMF drives current in a direction to oppose the flux change. If the north pole approaches, the coil's near face becomes a north pole (repelling the magnet). This follows from energy conservation: if the current aided the magnet, we'd get perpetual motion. Common error: students assume current follows the field direction rather than opposing the change.",
    characterEmoji: "⚡",
    state: "IN_PROGRESS",
    confidence: "not_sure",
    priority: "P1",
    strikes: 1,
    frequency: 4,
    prerequisiteChain: ["C12 EMI", "C10 Magnetism", "C9 Current Electricity", "C8 Electrostatics"],
    fixDuration: "4 min",
    retestFirst: "Mar 1",
    suggestion: "Remember: Nature is lazy — induced effects always OPPOSE the change causing them",
    resolution: 40,
  },
];

// ═══════════════════════════════════════════════════════════
// DEMO DATA — STRENGTHS
// ═══════════════════════════════════════════════════════════
const DEMO_STRENGTHS: StrengthItem[] = [
  { id: "s1", topic: "Addition & Subtraction", subject: "Mathematics", characterEmoji: "🌟", masteredDate: "Feb 10", score: 98, celebrationMsg: "Absolutely nailed it!" },
  { id: "s2", topic: "Photosynthesis", subject: "Science", characterEmoji: "🌱", masteredDate: "Feb 12", score: 95, celebrationMsg: "Plant science pro!" },
  { id: "s3", topic: "Nouns & Pronouns", subject: "English", characterEmoji: "📚", masteredDate: "Feb 14", score: 92, celebrationMsg: "Grammar champion!" },
  { id: "s4", topic: "Indian States & Capitals", subject: "Social Science", characterEmoji: "🗺️", masteredDate: "Feb 8", score: 100, celebrationMsg: "Perfect score! Geography wizard!" },
  { id: "s5", topic: "Number Patterns", subject: "Mathematics", characterEmoji: "🔢", masteredDate: "Feb 16", score: 96, celebrationMsg: "Pattern master!" },
  { id: "s6", topic: "Active & Passive Voice", subject: "English", characterEmoji: "✍️", masteredDate: "Feb 18", score: 90, celebrationMsg: "Voice conversion ace!" },
  { id: "s7", topic: "Laws of Motion", subject: "Physics", characterEmoji: "🚀", masteredDate: "Feb 5", score: 94, celebrationMsg: "Newton would be proud!" },
  { id: "s8", topic: "Periodic Table Groups", subject: "Chemistry", characterEmoji: "⚗️", masteredDate: "Feb 19", score: 97, celebrationMsg: "Elemental mastery!" },
];

// ═══════════════════════════════════════════════════════════
// HELPER: tier grouping
// ═══════════════════════════════════════════════════════════
type TierGroup = "storybook" | "explorer" | "studio" | "board" | "pro";
function getTierGroup(tier: TierGroup): "C1-2" | "C3-5" | "C6-8" | "C9-10" | "C11-12" {
  switch (tier) {
    case "storybook": return "C1-2";
    case "explorer": return "C3-5";
    case "studio": return "C6-8";
    case "board": return "C9-10";
    case "pro": return "C11-12";
  }
}

// ═══════════════════════════════════════════════════════════
// CONFETTI COMPONENT
// ═══════════════════════════════════════════════════════════
function ConfettiParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ["#fbbf24", "#ef4444", "#6366f1", "#2dd4bf", "#f472b6", "#a78bfa"][i % 6],
    size: 4 + Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: "-5%", width: p.size, height: p.size, background: p.color }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 300, opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: 1.5 + Math.random(), delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MICRO CELEBRATION COMPONENT
// ═══════════════════════════════════════════════════════════
function MicroCelebration({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal/20 to-indigo/20 border border-teal/20"
    >
      <motion.span
        animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm"
      >
        🎉
      </motion.span>
      <span className="text-xs font-semibold text-teal">{message}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// LIFECYCLE STATE INDICATOR
// ═══════════════════════════════════════════════════════════
function LifecycleIndicator({ state, isDark }: { state: LifecycleState; isDark: boolean }) {
  const cfg = LIFECYCLE_CONFIG[state];
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <div
          className={`w-3 h-3 rounded-full`}
          style={{ backgroundColor: cfg.color }}
        />
        {cfg.pulse && (
          <motion.div
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: cfg.color }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <span className={`text-xs font-bold ${cfg.textClass}`}>{cfg.label}</span>
      <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        — {cfg.description}
        {state === "MASTERED" && " 🎉"}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LIFECYCLE TRANSITION ARROWS (between cards)
// ═══════════════════════════════════════════════════════════
function LifecycleTransitionArrow({ from, to, isDark }: { from: LifecycleState; to: LifecycleState; isDark: boolean }) {
  const fromCfg = LIFECYCLE_CONFIG[from];
  const toCfg = LIFECYCLE_CONFIG[to];
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 py-1"
    >
      <span className={`text-[10px] font-semibold ${fromCfg.textClass}`}>{fromCfg.label}</span>
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
      >
        →
      </motion.span>
      <span className={`text-[10px] font-semibold ${toCfg.textClass}`}>{toCfg.label}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// FIX PIPELINE (prerequisite chain)
// ═══════════════════════════════════════════════════════════
function FixPipeline({ chain, duration, isDark }: { chain: string[]; duration: string; isDark: boolean }) {
  return (
    <div className={`mt-3 p-3 rounded-xl ${isDark ? "bg-indigo/5 border border-indigo/10" : "bg-indigo-50 border border-indigo-100"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">🔗</span>
        <span className={`text-[10px] font-bold ${isDark ? "text-indigo-light" : "text-indigo"}`}>
          PREREQUISITE CHAIN — We&apos;re tracing the foundation...
        </span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {chain.map((step, i) => (
          <span key={step} className="flex items-center gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              i === 0
                ? isDark ? "bg-indigo/20 text-indigo-light" : "bg-indigo-100 text-indigo-700"
                : isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
            }`}>
              {step}
            </span>
            {i < chain.length - 1 && (
              <span className={`text-[10px] ${isDark ? "text-slate-600" : "text-slate-300"}`}>←</span>
            )}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-3 py-1.5 rounded-lg bg-indigo text-white text-xs font-bold shadow-lg shadow-indigo/20"
        >
          Fix This ({duration})
        </motion.button>
        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          Micro-tutorial targeting the root gap
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STRIKE INDICATOR
// ═══════════════════════════════════════════════════════════
function StrikeIndicator({ strikes, isDark }: { strikes: number; isDark: boolean }) {
  if (strikes === 0) return null;

  const messages: Record<number, string> = {
    1: "Different angle tutorial queued",
    2: "Going deeper in prerequisites",
    3: "We're working on something special for you",
  };

  return (
    <div className={`flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg ${
      strikes === 3
        ? isDark ? "bg-purple-500/10 border border-purple-500/20" : "bg-purple-50 border border-purple-100"
        : isDark ? "bg-amber-400/5 border border-amber-400/10" : "bg-amber-50 border border-amber-100"
    }`}>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${
              s <= strikes
                ? strikes === 3 ? "bg-purple-500" : "bg-amber-400"
                : isDark ? "bg-white/10" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className={`text-[10px] font-medium ${
        strikes === 3
          ? isDark ? "text-purple-300" : "text-purple-600"
          : isDark ? "text-amber-300" : "text-amber-600"
      }`}>
        Strike {strikes}/3 — {messages[strikes]}{strikes === 3 ? " ✨" : ""}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RETEST TIMING
// ═══════════════════════════════════════════════════════════
function RetestSchedule({ first, second, isDark }: { first?: string; second?: string; isDark: boolean }) {
  if (!first) return null;
  return (
    <div className={`flex items-center gap-3 mt-2 text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
      <span className="flex items-center gap-1">
        <span>🕐</span> First retest: <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>{first}</span>
        <span className={`${isDark ? "text-slate-600" : "text-slate-300"}`}>(3 days after fix)</span>
      </span>
      {second && (
        <span className="flex items-center gap-1">
          <span>🕐</span> Second retest: <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>{second}</span>
          <span className={`${isDark ? "text-slate-600" : "text-slate-300"}`}>(7 days later)</span>
        </span>
      )}
      {second && (
        <span className={`font-semibold ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
          Both correct = MASTERED 🏅
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STATS SUMMARY BAR
// ═══════════════════════════════════════════════════════════
function StatsSummary({ mistakes, isDark, tierGroup }: { mistakes: MistakeGenomeItem[]; isDark: boolean; tierGroup: string }) {
  const total = mistakes.length;
  const p0Count = mistakes.filter(m => m.priority === "P0").length;
  const fixingThisWeek = mistakes.filter(m => m.state === "IN_PROGRESS" || m.state === "ACTIVE").length;
  const masteredThisMonth = mistakes.filter(m => m.state === "MASTERED").length + 3; // +3 from earlier this month

  const stats = [
    { label: "Total Patterns", value: total, emoji: "🧬", color: isDark ? "text-indigo-light" : "text-indigo" },
    { label: "Urgent (P0)", value: p0Count, emoji: "🔴", color: p0Count > 0 ? "text-red-400" : "text-teal" },
    { label: "Fixing This Week", value: fixingThisWeek, emoji: "🔧", color: isDark ? "text-amber-300" : "text-amber-600" },
    { label: "Mastered This Month", value: masteredThisMonth, emoji: "🏆", color: isDark ? "text-yellow-400" : "text-yellow-600" },
  ];

  // Gentler labels for younger tiers
  if (tierGroup === "C1-2") {
    stats[0].label = "Things to Learn";
    stats[1] = { label: "Fun Challenges", value: fixingThisWeek, emoji: "🎮", color: isDark ? "text-amber-300" : "text-amber-600" };
    stats[2] = { label: "Practicing Now", value: fixingThisWeek, emoji: "✨", color: isDark ? "text-teal" : "text-teal" };
    stats[3].label = "Stars Earned";
    stats[3].emoji = "⭐";
  } else if (tierGroup === "C3-5") {
    stats[1] = { label: "Quick Challenges", value: fixingThisWeek, emoji: "💪", color: isDark ? "text-amber-300" : "text-amber-600" };
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <GlassCard padding="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="text-xl">{stat.emoji}</span>
              <div>
                <div className={`text-lg font-black tabular-nums ${stat.color}`}>{stat.value}</div>
                <div className={`text-[10px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// TIER-ADAPTED MISTAKE CARD
// ═══════════════════════════════════════════════════════════
function MistakeCard({
  item,
  index,
  tierGroup,
  isDark,
  isParentOrAdmin,
}: {
  item: MistakeGenomeItem;
  index: number;
  tierGroup: string;
  isDark: boolean;
  isParentOrAdmin: boolean;
}) {
  const [showFixPipeline, setShowFixPipeline] = useState(false);
  const priorityCfg = PRIORITY_CONFIG[item.priority];

  // Celebration messages based on state transitions
  const celebrationMsg = item.state === "IMPROVED"
    ? "You crushed it! 💪"
    : item.state === "MASTERED"
      ? "3 misconceptions mastered this week!"
      : null;

  // ── Render tier-adapted content ──
  function renderContent() {
    switch (tierGroup) {
      // ── C1-2 STORYBOOK: Very gentle, concept name + emoji only ──
      case "C1-2":
        return (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{item.characterEmoji}</span>
              <div>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  {item.topic}
                </h3>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.subject}</span>
              </div>
            </div>
            {(item.state === "ACTIVE" || item.state === "REOPENED") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFixPipeline(!showFixPipeline)}
                className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white text-sm font-bold shadow-lg"
              >
                Let&apos;s play! 🎮
              </motion.button>
            )}
          </div>
        );

      // ── C3-5 EXPLORER: Encouraging, topic + correct answer as hint ──
      case "C3-5":
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.characterEmoji}</span>
              <div>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.topic}</h3>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.subject}</span>
              </div>
            </div>
            {item.correctAnswer && (
              <div className={`${isDark ? "glass-sm" : "bg-emerald-50 rounded-xl border border-emerald-100"} p-3 mb-2`}>
                <div className={`text-[10px] font-bold mb-1 ${isDark ? "text-teal" : "text-emerald-600"}`}>HINT</div>
                <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  The correct answer is: <span className="font-semibold">{item.correctAnswer}</span>
                </p>
              </div>
            )}
            {(item.state === "ACTIVE" || item.state === "REOPENED") && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowFixPipeline(!showFixPipeline)}
                className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo to-teal text-white text-sm font-bold shadow-lg"
              >
                Quick Challenge! ⚡
              </motion.button>
            )}
          </div>
        );

      // ── C6-8 STUDIO: Simple + clear, topic + subtopic + simplified question + both answers ──
      case "C6-8":
        return (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.topic}</h3>
              {item.subtopic && (
                <Tag label={item.subtopic} color="indigo" />
              )}
            </div>
            <p className={`text-xs mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.subject}</p>

            {item.question && (
              <div className={`${isDark ? "glass-sm" : "bg-slate-50 rounded-xl border border-slate-100"} p-3 mb-2`}>
                <div className={`text-[10px] font-bold mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>QUESTION</div>
                <code className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.question}</code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-2">
              {item.wrongAnswer && (
                <div className={`p-2 rounded-lg ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"}`}>
                  <div className={`text-[10px] font-bold ${isDark ? "text-red-400" : "text-red-500"}`}>YOUR ANSWER</div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-red-300" : "text-red-600"}`}>{item.wrongAnswer}</p>
                </div>
              )}
              {item.correctAnswer && (
                <div className={`p-2 rounded-lg ${isDark ? "bg-teal/10 border border-teal/20" : "bg-emerald-50 border border-emerald-100"}`}>
                  <div className={`text-[10px] font-bold ${isDark ? "text-teal" : "text-emerald-600"}`}>CORRECT</div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-teal" : "text-emerald-700"}`}>{item.correctAnswer}</p>
                </div>
              )}
            </div>

            {(item.state === "ACTIVE" || item.state === "REOPENED") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFixPipeline(!showFixPipeline)}
                className="px-4 py-2 rounded-lg bg-indigo text-white text-xs font-bold shadow-lg shadow-indigo/20"
              >
                Fix This 🔧
              </motion.button>
            )}
          </div>
        );

      // ── C9-10 BOARD: Direct + academic, full question + correct + brief explanation ──
      case "C9-10":
        return (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.topic}</h3>
              {item.subtopic && <Tag label={item.subtopic} color="indigo" />}
              <Tag label={item.subject} color="purple" />
            </div>

            {item.question && (
              <div className={`${isDark ? "glass-sm" : "bg-slate-50 rounded-xl border border-slate-100"} p-3 mb-2 mt-2`}>
                <div className={`text-[10px] font-bold mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>QUESTION</div>
                <code className={`text-xs ${isDark ? "text-slate-200" : "text-slate-800"}`}>{item.question}</code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-2">
              {item.wrongAnswer && (
                <div className={`p-2 rounded-lg ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"}`}>
                  <div className={`text-[10px] font-bold ${isDark ? "text-red-400" : "text-red-500"}`}>YOUR ANSWER</div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-red-300" : "text-red-600"}`}>{item.wrongAnswer}</p>
                </div>
              )}
              {item.correctAnswer && (
                <div className={`p-2 rounded-lg ${isDark ? "bg-teal/10 border border-teal/20" : "bg-emerald-50 border border-emerald-100"}`}>
                  <div className={`text-[10px] font-bold ${isDark ? "text-teal" : "text-emerald-600"}`}>CORRECT ANSWER</div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-teal" : "text-emerald-700"}`}>{item.correctAnswer}</p>
                </div>
              )}
            </div>

            {item.whyWrong && (
              <div className={`p-3 rounded-xl mb-2 ${isDark ? "bg-amber-400/5 border border-amber-400/10" : "bg-amber-50 border border-amber-100"}`}>
                <div className={`text-[10px] font-bold mb-0.5 ${isDark ? "text-amber-300" : "text-amber-600"}`}>WHY IT&apos;S WRONG</div>
                <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.whyWrong}</p>
              </div>
            )}

            {(item.state === "ACTIVE" || item.state === "REOPENED") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFixPipeline(!showFixPipeline)}
                className="px-4 py-2 rounded-lg bg-indigo text-white text-xs font-bold shadow-lg shadow-indigo/20"
              >
                Fix This 🔧
              </motion.button>
            )}
          </div>
        );

      // ── C11-12 PRO: Professional + detailed gap analysis ──
      case "C11-12":
        return (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.topic}</h3>
              {item.subtopic && <Tag label={item.subtopic} color="indigo" />}
              <Tag label={item.subject} color="purple" />
            </div>

            {item.question && (
              <div className={`${isDark ? "glass-sm" : "bg-slate-50 rounded-xl border border-slate-100"} p-3 mb-2 mt-2`}>
                <div className={`text-[10px] font-bold mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>FULL QUESTION</div>
                <code className={`text-xs ${isDark ? "text-slate-200" : "text-slate-800"}`}>{item.question}</code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-2">
              {item.wrongAnswer && (
                <div className={`p-2 rounded-lg ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"}`}>
                  <div className={`text-[10px] font-bold ${isDark ? "text-red-400" : "text-red-500"}`}>YOUR ANSWER</div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-red-300" : "text-red-600"}`}>{item.wrongAnswer}</p>
                </div>
              )}
              {item.correctAnswer && (
                <div className={`p-2 rounded-lg ${isDark ? "bg-teal/10 border border-teal/20" : "bg-emerald-50 border border-emerald-100"}`}>
                  <div className={`text-[10px] font-bold ${isDark ? "text-teal" : "text-emerald-600"}`}>CORRECT ANSWER</div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-teal" : "text-emerald-700"}`}>{item.correctAnswer}</p>
                </div>
              )}
            </div>

            {item.whyWrong && (
              <div className={`p-3 rounded-xl mb-2 ${isDark ? "bg-amber-400/5 border border-amber-400/10" : "bg-amber-50 border border-amber-100"}`}>
                <div className={`text-[10px] font-bold mb-0.5 ${isDark ? "text-amber-300" : "text-amber-600"}`}>WHY IT&apos;S WRONG</div>
                <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.whyWrong}</p>
              </div>
            )}

            {item.detailedExplanation && (
              <div className={`p-3 rounded-xl mb-2 ${isDark ? "bg-indigo/5 border border-indigo/10" : "bg-indigo-50 border border-indigo-100"}`}>
                <div className={`text-[10px] font-bold mb-0.5 ${isDark ? "text-indigo-light" : "text-indigo"}`}>DETAILED GAP ANALYSIS</div>
                <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.detailedExplanation}</p>
              </div>
            )}

            {(item.state === "ACTIVE" || item.state === "REOPENED") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFixPipeline(!showFixPipeline)}
                className="px-4 py-2 rounded-lg bg-indigo text-white text-xs font-bold shadow-lg shadow-indigo/20"
              >
                Fix This 🔧
              </motion.button>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="relative"
    >
      {/* Confetti for MASTERED */}
      {item.state === "MASTERED" && <ConfettiParticles />}

      <GlassCard>
        {/* Top row: lifecycle + priority + frequency + subjects */}
        <div className="flex items-start justify-between mb-3">
          <LifecycleIndicator state={item.state} isDark={isDark} />
          <div className="flex items-center gap-2">
            {/* Priority badge — only visible to parent/admin internally */}
            {isParentOrAdmin && (
              <Tag label={`${item.priority} — ${priorityCfg.internalLabel}`} color={priorityCfg.tagColor} />
            )}
            <Tag
              label={`${item.frequency}x detected`}
              color={item.frequency > 6 ? "rose" : item.frequency > 4 ? "amber" : "green"}
            />
          </div>
        </div>

        {/* Regression message for REOPENED */}
        {item.state === "REOPENED" && item.regressionNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"}`}
          >
            <span className="text-sm">🔄</span>
            <span className={`text-xs font-medium ${isDark ? "text-red-300" : "text-red-600"}`}>
              {item.regressionNote}
            </span>
            <Tag label="Priority Escalated" color="red" />
          </motion.div>
        )}

        {/* Tier-adapted content */}
        {renderContent()}

        {/* AI Suggestion — shown for all tiers except storybook */}
        {tierGroup !== "C1-2" && (
          <div className={`flex items-start gap-2 p-3 rounded-xl mt-3 ${isDark ? "bg-teal/5 border border-teal/10" : "bg-teal-50/50 border border-teal-100"}`}>
            <span className="text-sm">💡</span>
            <div>
              <div className={`text-[10px] font-bold mb-0.5 ${isDark ? "text-teal" : "text-teal-700"}`}>AI SUGGESTION</div>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.suggestion}</p>
            </div>
          </div>
        )}

        {/* Fix Pipeline */}
        <AnimatePresence>
          {showFixPipeline && item.prerequisiteChain && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FixPipeline chain={item.prerequisiteChain} duration={item.fixDuration || "3 min"} isDark={isDark} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strike indicator */}
        <StrikeIndicator strikes={item.strikes} isDark={isDark} />

        {/* Retest schedule */}
        <RetestSchedule first={item.retestFirst} second={item.retestSecond} isDark={isDark} />

        {/* Resolution progress */}
        <div className="mt-3 flex items-center gap-3">
          <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Resolution:</span>
          <ProgressBar
            value={item.resolution}
            color={item.resolution < 30 ? "bg-rose-400" : item.resolution < 60 ? "bg-amber-400" : "bg-teal"}
            className="flex-1"
          />
          <span className={`text-[10px] font-bold tabular-nums ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {item.resolution}%
          </span>
        </div>

        {/* Celebration for improved / mastered */}
        {celebrationMsg && (
          <div className="mt-3">
            <MicroCelebration message={celebrationMsg} />
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// STRENGTH CARD
// ═══════════════════════════════════════════════════════════
function StrengthCard({
  item,
  index,
  tierGroup,
  isDark,
}: {
  item: StrengthItem;
  index: number;
  tierGroup: string;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.08 }}
    >
      <GlassCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl"
            >
              {item.characterEmoji}
            </motion.span>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.topic}</h3>
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.subject}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-right`}>
              <div className={`text-lg font-black tabular-nums ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                {item.score}%
              </div>
              <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Mastered {item.masteredDate}
              </div>
            </div>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-xl"
            >
              ⭐
            </motion.span>
          </div>
        </div>
        {tierGroup === "C1-2" ? (
          <div className={`mt-2 text-xs font-medium ${isDark ? "text-teal" : "text-teal-600"}`}>
            {item.celebrationMsg} 🌟
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <Tag label="MASTERED" color="green" />
            <span className={`text-xs ${isDark ? "text-teal" : "text-teal-600"}`}>
              {item.celebrationMsg}
            </span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════
export default function MistakesPage() {
  const { tier, isDark } = useTier();
  const tierGroup = getTierGroup(tier);

  const { role } = useRole();
  const isParentOrAdmin = role === "parent" || role === "super-admin" || role === "school-admin";

  // ── Tab config based on tier ──
  const needsPracticeLabel = tierGroup === "C1-2"
    ? "Let's Practice! 🎮"
    : tierGroup === "C3-5"
      ? "Getting Better 🌟"
      : "Needs Practice 💪";

  const tabs = [
    { key: "strengths", label: "Strengths ⭐" },
    { key: "practice", label: needsPracticeLabel },
  ];

  // C1-5: Strengths tab opens first. C6+: Needs Practice opens first.
  const defaultTab = (tierGroup === "C1-2" || tierGroup === "C3-5") ? "strengths" : "practice";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Reset tab when tier changes
  useEffect(() => {
    const newDefault = (tierGroup === "C1-2" || tierGroup === "C3-5") ? "strengths" : "practice";
    setActiveTab(newDefault);
  }, [tierGroup]);

  // Sort mistakes: P0 first, then P1, then P2. Within each priority, REOPENED first.
  const sortedMistakes = useMemo(() => {
    return [...DEMO_GENOME_MISTAKES].sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2 };
      const stateOrder: Record<LifecycleState, number> = { REOPENED: 0, ACTIVE: 1, IN_PROGRESS: 2, IMPROVED: 3, MASTERED: 4 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return stateOrder[a.state] - stateOrder[b.state];
    });
  }, []);

  // Lifecycle flow label for the page
  const tierTitle = tierGroup === "C1-2"
    ? "🧬 My Learning Adventures"
    : tierGroup === "C3-5"
      ? "🧬 My Learning Map"
      : "🧬 Mistake Genome";

  const tierSubtitle = tierGroup === "C1-2"
    ? "Every challenge makes you stronger!"
    : tierGroup === "C3-5"
      ? "AI-detected patterns — turning mistakes into superpowers"
      : "AI-detected error patterns — not failures, just growth areas";

  const content = (
    <div className={`min-h-screen ${tier === "storybook" ? "bg-storybook-bg" : "bg-navy"} relative overflow-hidden`}>
      <div className="blob blob-purple w-96 h-96 -top-40 -right-40 opacity-10" />
      <div className="blob blob-teal w-72 h-72 bottom-20 -left-20 opacity-5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* ── Page header ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
            {tierTitle}
          </h1>
          <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {tierSubtitle}
          </p>
        </motion.div>

        {/* ── Stats summary ── */}
        <div className="mb-5">
          <StatsSummary mistakes={DEMO_GENOME_MISTAKES} isDark={isDark} tierGroup={tierGroup} />
        </div>

        {/* ── 5-State Lifecycle Legend ── */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-5"
        >
          <GlassCard padding="p-3">
            <div className={`text-[10px] font-bold mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              LIFECYCLE FLOW
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {LIFECYCLE_ORDER.map((state, i) => {
                const cfg = LIFECYCLE_CONFIG[state];
                return (
                  <span key={state} className="flex items-center gap-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <span className={`text-[10px] font-semibold ${cfg.textClass}`}>{cfg.label}</span>
                    </span>
                    {i < LIFECYCLE_ORDER.length - 1 && (
                      <motion.span
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className={`text-xs mx-1 ${isDark ? "text-slate-600" : "text-slate-300"}`}
                      >
                        →
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Two-Tab Layout ── */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                    ${isActive
                      ? isDark
                        ? "bg-white/10 text-white border border-white/20 shadow-lg"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-md"
                      : isDark
                        ? "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "strengths" ? (
            <motion.div
              key="strengths"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {DEMO_STRENGTHS.length === 0 ? (
                <GlassCard>
                  <div className="text-center py-8">
                    <span className="text-3xl block mb-2">⭐</span>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Keep learning! Your mastered concepts will appear here.
                    </p>
                  </div>
                </GlassCard>
              ) : (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <div className={`text-xs font-semibold mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {tierGroup === "C1-2"
                        ? `${DEMO_STRENGTHS.length} things you're amazing at!`
                        : `${DEMO_STRENGTHS.length} concepts mastered`}
                    </div>
                  </motion.div>
                  {DEMO_STRENGTHS.map((s, i) => (
                    <StrengthCard key={s.id} item={s} index={i} tierGroup={tierGroup} isDark={isDark} />
                  ))}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className={`text-xs font-semibold mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {tierGroup === "C1-2"
                    ? `${sortedMistakes.length} fun challenges waiting!`
                    : tierGroup === "C3-5"
                      ? `${sortedMistakes.length} areas getting stronger`
                      : `${sortedMistakes.length} patterns detected — sorted by priority`}
                </div>
              </motion.div>

              {sortedMistakes.map((item, i) => {
                // Show transition arrows between cards with different states
                const prevItem = i > 0 ? sortedMistakes[i - 1] : null;
                const showTransition = prevItem && prevItem.state !== item.state;

                return (
                  <div key={item.id}>
                    {showTransition && prevItem && (
                      <LifecycleTransitionArrow from={prevItem.state} to={item.state} isDark={isDark} />
                    )}
                    <div className="py-1.5">
                      <MistakeCard
                        item={item}
                        index={i}
                        tierGroup={tierGroup}
                        isDark={isDark}
                        isParentOrAdmin={isParentOrAdmin}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Info / How it works ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className={`${isDark ? "glass-sm" : "bg-white/50 rounded-2xl border border-slate-100"} p-4 mt-6`}>
            <div className="flex items-center gap-2">
              <span>🧬</span>
              <div>
                <div className={`text-xs font-bold ${isDark ? "text-indigo-light" : "text-indigo"}`}>
                  {tierGroup === "C1-2" ? "How Your Adventures Work" : "How Mistake Genome Works"}
                </div>
                <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  {tierGroup === "C1-2"
                    ? "We watch how you learn and find the perfect challenges for you. Each one makes your brain stronger! Play games, win stars, and grow your garden!"
                    : tierGroup === "C3-5"
                      ? "AI finds areas where you can improve and creates special practice just for you. Fix mistakes, pass two retests, and master it forever! Every mistake is a chance to level up."
                      : "AI analyzes all your answers to find recurring error patterns. Each pattern goes through 5 states: Active → In Progress → Improved → Mastered (or Reopened if it returns). P0 misconceptions (confident + wrong) are prioritized. Fix tutorials trace prerequisite chains to find the root gap. 3 strikes = escalated intervention. Two successful retests = Mastered."}
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
