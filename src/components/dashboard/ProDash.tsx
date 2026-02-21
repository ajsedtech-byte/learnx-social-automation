"use client";
import { useState } from "react";
import { DEMO_STUDENTS, SUBJECTS_BY_TIER, DEMO_MOMENTUM, DEMO_CAREERS } from "@/lib/demo-data";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import GaugeRing from "@/components/ui/GaugeRing";
import Tag from "@/components/ui/Tag";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ═══ TYPES ═══
type TabKey = "Learn" | "Practice" | "Review" | "Analytics";
type StreamKey = "JEE" | "NEET" | "Foundation" | "Olympiad";

// ═══ DEMO DATA ═══
const student = DEMO_STUDENTS.pro;
const subjects = SUBJECTS_BY_TIER.pro;
const momentum = DEMO_MOMENTUM;

// Stream-specific header metrics
const STREAM_METRICS: Record<StreamKey, { label: string; value: string; color: string; priority: string }[]> = {
  JEE: [
    { label: "JEE", value: "92.4%ile", color: "text-emerald-400", priority: "P0" },
    { label: "Board", value: "88%", color: "text-indigo-light", priority: "P0" },
    { label: "Velocity", value: `${momentum.speed}`, color: "text-teal", priority: "P1" },
    { label: "Rank", value: `#${momentum.rank}`, color: "text-amber-400", priority: "P2" },
  ],
  NEET: [
    { label: "NEET", value: "94.1%ile", color: "text-emerald-400", priority: "P0" },
    { label: "Board", value: "91%", color: "text-indigo-light", priority: "P0" },
    { label: "Biology", value: "96%", color: "text-teal", priority: "P1" },
    { label: "Rank", value: "#8", color: "text-amber-400", priority: "P2" },
  ],
  Foundation: [
    { label: "Board", value: "88%", color: "text-emerald-400", priority: "P0" },
    { label: "NTSE", value: "Top 5%", color: "text-indigo-light", priority: "P0" },
    { label: "Velocity", value: "68", color: "text-teal", priority: "P1" },
    { label: "Rank", value: "#22", color: "text-amber-400", priority: "P2" },
  ],
  Olympiad: [
    { label: "IMO", value: "Gold", color: "text-emerald-400", priority: "P0" },
    { label: "INPhO", value: "Silver", color: "text-indigo-light", priority: "P0" },
    { label: "Speed", value: "1.4m/Q", color: "text-teal", priority: "P1" },
    { label: "Rank", value: "#3", color: "text-amber-400", priority: "P2" },
  ],
};

// Stream-specific rank predictor
const STREAM_RANK: Record<StreamKey, { rank: string; label: string; delta: string }> = {
  JEE: { rank: "~12,400", label: "JEE Main Predicted Rank", delta: "2,100 from last mock" },
  NEET: { rank: "~4,200", label: "NEET Predicted Rank", delta: "800 from last mock" },
  Foundation: { rank: "Top 5%", label: "Board Predicted Percentile", delta: "2% from last test" },
  Olympiad: { rank: "~Top 50", label: "National Olympiad Rank", delta: "12 spots from last round" },
};

// Stream-specific subject weights
const STREAM_WEIGHTS: Record<StreamKey, Record<string, string>> = {
  JEE: { physics: "30%", chemistry: "30%", math: "40%", cs: "-", english: "-", life: "-" },
  NEET: { physics: "25%", chemistry: "25%", math: "-", cs: "-", english: "-", life: "-", biology: "50%" },
  Foundation: { physics: "20%", chemistry: "20%", math: "20%", cs: "15%", english: "15%", life: "10%" },
  Olympiad: { physics: "30%", chemistry: "20%", math: "50%", cs: "-", english: "-", life: "-" },
};

// Practice tab data
const SPEED_DRILL_OPTIONS = [
  { duration: "5 min", questions: 10, label: "Quick Fire", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  { duration: "10 min", questions: 20, label: "Standard", color: "text-indigo-light", bg: "bg-indigo/15" },
  { duration: "15 min", questions: 30, label: "Extended", color: "text-amber-300", bg: "bg-amber-500/15" },
];

const TOPIC_PRACTICE_GRID = [
  { subject: "Physics", emoji: "⚡", chapters: ["Mechanics", "Electrostatics", "Optics", "Modern Physics", "Thermodynamics"], questionsAvailable: 840 },
  { subject: "Chemistry", emoji: "⚗️", chapters: ["Organic", "Inorganic", "Physical", "Electrochemistry", "Polymers"], questionsAvailable: 760 },
  { subject: "Mathematics", emoji: "∫", chapters: ["Calculus", "Algebra", "Coordinate Geo", "Probability", "Vectors"], questionsAvailable: 920 },
];

const PYQ_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];
const PYQ_EXAMS = ["JEE Main", "JEE Advanced", "NEET", "BITSAT", "KVPY"];

const PRACTICE_STATS = [
  { label: "Questions Attempted", value: "2,847", trend: "+124 this week" },
  { label: "Accuracy", value: "78.4%", trend: "+2.1% from last week" },
  { label: "Avg Time/Question", value: "2.3 min", trend: "-0.2 min improvement" },
  { label: "Streak Days", value: "18", trend: "Best: 26 days" },
];

const CUSTOM_TEST_DIFFICULTIES = ["Easy", "Medium", "Hard", "Mixed"];
const CUSTOM_TEST_COUNTS = [10, 20, 30, 50];

// Review tab data
const BOOKMARKED_QUESTIONS = [
  { id: 1, subject: "Physics", topic: "Electromagnetic Induction", difficulty: "Hard", source: "JEE Adv 2024" },
  { id: 2, subject: "Chemistry", topic: "Organic Mechanisms", difficulty: "Medium", source: "Module 7" },
  { id: 3, subject: "Mathematics", topic: "Definite Integrals", difficulty: "Hard", source: "JEE Main 2023" },
  { id: 4, subject: "Physics", topic: "Rotational Dynamics", difficulty: "Hard", source: "JEE Adv 2023" },
  { id: 5, subject: "Chemistry", topic: "Coordination Compounds", difficulty: "Medium", source: "NEET 2024" },
  { id: 6, subject: "Mathematics", topic: "Probability Distributions", difficulty: "Medium", source: "Module 12" },
  { id: 7, subject: "Physics", topic: "Wave Optics", difficulty: "Medium", source: "JEE Main 2024" },
  { id: 8, subject: "Chemistry", topic: "Thermodynamics", difficulty: "Hard", source: "JEE Adv 2022" },
  { id: 9, subject: "Mathematics", topic: "3D Geometry", difficulty: "Hard", source: "JEE Adv 2024" },
  { id: 10, subject: "Physics", topic: "Semiconductors", difficulty: "Easy", source: "Module 15" },
  { id: 11, subject: "Chemistry", topic: "p-Block Elements", difficulty: "Medium", source: "NEET 2023" },
  { id: 12, subject: "Mathematics", topic: "Matrices & Determinants", difficulty: "Medium", source: "JEE Main 2022" },
  { id: 13, subject: "Physics", topic: "Capacitors", difficulty: "Hard", source: "JEE Adv 2023" },
  { id: 14, subject: "Chemistry", topic: "Electrochemistry", difficulty: "Hard", source: "JEE Main 2024" },
  { id: 15, subject: "Mathematics", topic: "Differential Equations", difficulty: "Hard", source: "JEE Adv 2024" },
  { id: 16, subject: "Physics", topic: "Gravitation", difficulty: "Medium", source: "Module 4" },
  { id: 17, subject: "Chemistry", topic: "Chemical Kinetics", difficulty: "Medium", source: "JEE Main 2023" },
  { id: 18, subject: "Mathematics", topic: "Sequences & Series", difficulty: "Medium", source: "Module 6" },
  { id: 19, subject: "Physics", topic: "Fluid Mechanics", difficulty: "Hard", source: "JEE Adv 2022" },
  { id: 20, subject: "Chemistry", topic: "Aldehydes & Ketones", difficulty: "Medium", source: "NEET 2024" },
  { id: 21, subject: "Mathematics", topic: "Conic Sections", difficulty: "Hard", source: "JEE Adv 2023" },
  { id: 22, subject: "Physics", topic: "Magnetic Effects", difficulty: "Medium", source: "JEE Main 2024" },
  { id: 23, subject: "Chemistry", topic: "Solutions & Colligative", difficulty: "Medium", source: "Module 9" },
  { id: 24, subject: "Mathematics", topic: "Limits & Continuity", difficulty: "Medium", source: "JEE Main 2023" },
];

const MISTAKE_LOG = [
  { id: 1, subject: "Physics", topic: "Electromagnetic Induction", type: "Sign Error", date: "Feb 20", question: "Faraday's law direction", count: 3 },
  { id: 2, subject: "Chemistry", topic: "Organic Chemistry", type: "Mechanism Error", date: "Feb 19", question: "SN1 vs SN2 conditions", count: 5 },
  { id: 3, subject: "Mathematics", topic: "Integration", type: "Calculation Error", date: "Feb 20", question: "Integration by parts boundary", count: 2 },
  { id: 4, subject: "Physics", topic: "Optics", type: "Concept Confusion", date: "Feb 18", question: "Diffraction vs interference pattern", count: 4 },
  { id: 5, subject: "Chemistry", topic: "Electrochemistry", type: "Unit Error", date: "Feb 19", question: "Cell potential calculation", count: 2 },
  { id: 6, subject: "Mathematics", topic: "Probability", type: "Logic Error", date: "Feb 17", question: "Conditional probability setup", count: 3 },
  { id: 7, subject: "Physics", topic: "Thermodynamics", type: "Formula Error", date: "Feb 16", question: "Adiabatic process work done", count: 2 },
  { id: 8, subject: "Chemistry", topic: "Inorganic", type: "Memory Error", date: "Feb 18", question: "d-block electronic config exceptions", count: 6 },
];

const WEAK_AREAS_HEATMAP = [
  { subject: "Physics", easy: 92, medium: 78, hard: 54 },
  { subject: "Chemistry", easy: 88, medium: 72, hard: 48 },
  { subject: "Mathematics", easy: 95, medium: 81, hard: 61 },
  { subject: "CS", easy: 96, medium: 88, hard: 72 },
  { subject: "English", easy: 94, medium: 86, hard: 78 },
];

const REVISION_SCHEDULE = [
  { round: "R1", label: "Day 1", status: "done" as const, topics: 42 },
  { round: "R2", label: "Day 3", status: "done" as const, topics: 42 },
  { round: "R3", label: "Day 7", status: "done" as const, topics: 38 },
  { round: "R4", label: "Day 14", status: "done" as const, topics: 35 },
  { round: "R5", label: "Day 21", status: "active" as const, topics: 30 },
  { round: "R6", label: "Day 30", status: "pending" as const, topics: 0 },
  { round: "R7", label: "Day 45", status: "pending" as const, topics: 0 },
  { round: "R8", label: "Day 60", status: "pending" as const, topics: 0 },
  { round: "R9", label: "Day 90", status: "pending" as const, topics: 0 },
  { round: "R10", label: "Day 120", status: "pending" as const, topics: 0 },
];

const FLAGGED_FORMULAS = [
  { id: 1, subject: "Physics", formula: "E = -dPhi/dt (Faraday's Law)", priority: "high" },
  { id: 2, subject: "Mathematics", formula: "integral(u dv) = uv - integral(v du)", priority: "high" },
  { id: 3, subject: "Chemistry", formula: "E_cell = E_cathode - E_anode", priority: "medium" },
  { id: 4, subject: "Physics", formula: "F = qv x B (Lorentz Force)", priority: "medium" },
  { id: 5, subject: "Mathematics", formula: "P(A|B) = P(A^B)/P(B) (Bayes)", priority: "high" },
  { id: 6, subject: "Chemistry", formula: "delta_G = -nFE_cell", priority: "medium" },
  { id: 7, subject: "Physics", formula: "lambda = h/mv (de Broglie)", priority: "low" },
  { id: 8, subject: "Mathematics", formula: "det(AB) = det(A).det(B)", priority: "low" },
];

// Analytics tab data
const MOCK_TEST_RANKS = [
  { test: "Mock 1", rank: 18200, percentile: 86.2 },
  { test: "Mock 2", rank: 16800, percentile: 88.1 },
  { test: "Mock 3", rank: 15100, percentile: 89.8 },
  { test: "Mock 4", rank: 14600, percentile: 90.4 },
  { test: "Mock 5", rank: 13200, percentile: 91.6 },
  { test: "Mock 6", rank: 12400, percentile: 92.4 },
];

const SUBJECT_ACCURACY_RADAR = [
  { subject: "Physics", accuracy: 78, angle: 0 },
  { subject: "Chemistry", accuracy: 72, angle: 72 },
  { subject: "Mathematics", accuracy: 81, angle: 144 },
  { subject: "CS", accuracy: 88, angle: 216 },
  { subject: "English", accuracy: 86, angle: 288 },
];

const TIME_PER_QUESTION = [
  { subject: "Physics", avgTime: 2.8, target: 2.0 },
  { subject: "Chemistry", avgTime: 2.1, target: 1.8 },
  { subject: "Mathematics", avgTime: 3.2, target: 2.5 },
  { subject: "CS", avgTime: 1.6, target: 1.5 },
  { subject: "English", avgTime: 1.2, target: 1.0 },
];

const SCORE_COMPARISON = [
  { subject: "Physics", yours: 156, top10: 172, average: 118 },
  { subject: "Chemistry", yours: 148, top10: 168, average: 112 },
  { subject: "Mathematics", yours: 162, top10: 178, average: 124 },
];

const WEEKLY_VELOCITY = [
  { label: "Topics Covered", value: "28", target: "30", pct: 93 },
  { label: "Questions Solved", value: "342", target: "400", pct: 85 },
  { label: "Hours Studied", value: "32.5h", target: "35h", pct: 93 },
  { label: "Mock Tests", value: "2", target: "2", pct: 100 },
];

const PERFORMANCE_TREND = [
  { test: "Test 1", score: 68 },
  { test: "Test 2", score: 72 },
  { test: "Test 3", score: 71 },
  { test: "Test 4", score: 76 },
  { test: "Test 5", score: 78 },
  { test: "Test 6", score: 74 },
  { test: "Test 7", score: 80 },
  { test: "Test 8", score: 82 },
  { test: "Test 9", score: 85 },
  { test: "Test 10", score: 88 },
];

// ═══ HELPER: Heatmap cell color ═══
function heatColor(val: number): string {
  if (val >= 90) return "bg-emerald-500/40 text-emerald-300";
  if (val >= 75) return "bg-emerald-500/20 text-emerald-400";
  if (val >= 60) return "bg-amber-500/20 text-amber-300";
  if (val >= 45) return "bg-red-500/20 text-red-400";
  return "bg-red-500/40 text-red-300";
}

// ═══ HELPER: Bar chart renderer (text-based) ═══
function MiniBar({ value, max, color = "bg-emerald-400" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const SYLLABUS_COVERAGE = [
  { subject: "Mathematics", emoji: "\uD83D\uDCD0", covered: 42, total: 100, color: "#6366f1" },
  { subject: "Science", emoji: "\uD83D\uDD2C", covered: 38, total: 100, color: "#2dd4bf" },
  { subject: "English", emoji: "\uD83D\uDCDD", covered: 55, total: 100, color: "#f59e0b" },
  { subject: "SST", emoji: "\uD83C\uDF0D", covered: 30, total: 100, color: "#ec4899" },
  { subject: "Hindi", emoji: "\uD83D\uDD49\uFE0F", covered: 48, total: 100, color: "#a855f7" },
  { subject: "Life Skills", emoji: "\uD83D\uDC9B", covered: 23, total: 100, color: "#10b981" },
];

// ═══ COMPONENT ═══
export default function ProDash() {
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("Learn");
  const [stream, setStream] = useState<StreamKey>("JEE");
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1800); // 30 min default
  const [timerRunning, setTimerRunning] = useState(false);
  const [reviewSubjectFilter, setReviewSubjectFilter] = useState<string>("All");
  const [pyqYear, setPyqYear] = useState("2024");
  const [pyqExam, setPyqExam] = useState("JEE Main");
  const [customDifficulty, setCustomDifficulty] = useState("Mixed");
  const [customCount, setCustomCount] = useState(30);
  const [customSubjects, setCustomSubjects] = useState<string[]>(["Physics", "Chemistry", "Mathematics"]);

  const metrics = STREAM_METRICS[stream];
  const rankInfo = STREAM_RANK[stream];
  const weights = STREAM_WEIGHTS[stream];

  // Timer display
  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Toggle subject in custom test builder
  const toggleCustomSubject = (subj: string) => {
    setCustomSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  // Filter bookmarks/mistakes by subject
  const filteredBookmarks = reviewSubjectFilter === "All"
    ? BOOKMARKED_QUESTIONS
    : BOOKMARKED_QUESTIONS.filter((q) => q.subject === reviewSubjectFilter);

  const filteredMistakes = reviewSubjectFilter === "All"
    ? MISTAKE_LOG
    : MISTAKE_LOG.filter((m) => m.subject === reviewSubjectFilter);

  // ═══ TIMED TEST OVERLAY ═══
  if (timerActive) {
    return (
      <div className="min-h-screen bg-navy text-white relative overflow-hidden font-mono">
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {/* Timer header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-lg font-bold font-sans">Timed Mock Test</h1>
                <p className="text-[10px] text-slate-500">{stream} Pattern &middot; {customCount} Questions &middot; {customDifficulty}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-black tabular-nums font-sans ${timerRunning ? "text-emerald-400" : "text-amber-400"}`}>
                  {formatTimer(timerSeconds)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      timerRunning
                        ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                        : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                    }`}
                  >
                    {timerRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={() => { setTimerActive(false); setTimerRunning(false); setTimerSeconds(1800); }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all"
                  >
                    End Test
                  </button>
                </div>
              </div>
            </div>

            {/* Mock questions */}
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-slate-500 tabular-nums w-6 font-sans">Q{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-xs text-slate-300 font-sans mb-3">
                        {i === 0 && "A uniform magnetic field B = 0.5T is applied perpendicular to a circular loop of radius 10cm. If the loop is rotated at 60 RPM, find the peak EMF induced."}
                        {i === 1 && "Calculate the hybridization of the central atom in XeF4 and predict its geometry."}
                        {i === 2 && "Evaluate the definite integral: integral from 0 to pi/2 of sin^4(x) dx."}
                        {i === 3 && "A projectile is launched at 45 degrees with initial velocity 20 m/s. Neglecting air resistance, find the maximum height reached."}
                        {i === 4 && "The rate constant of a first-order reaction is 0.0693 min^-1. Calculate the half-life."}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {["(A)", "(B)", "(C)", "(D)"].map((opt) => (
                          <button key={opt} className="text-left px-3 py-2 rounded-lg bg-white/[0.03] text-[11px] text-slate-400 hover:bg-white/[0.08] hover:text-white transition-all font-sans">
                            {opt} Option {opt.charAt(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="text-[9px] text-slate-500 hover:text-amber-400 transition-all">Flag</button>
                      <button className="text-[9px] text-slate-500 hover:text-indigo-light transition-all">Skip</button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Question navigator */}
            <div className="mt-4">
              <GlassCard>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Question Navigator</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: customCount }, (_, i) => (
                    <button
                      key={i}
                      className={`w-7 h-7 rounded text-[10px] font-bold tabular-nums transition-all ${
                        i < 5 ? "bg-indigo/20 text-indigo-light" : "bg-white/[0.04] text-slate-500 hover:bg-white/[0.08]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ MAIN DASHBOARD ═══
  return (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden font-mono">
      <div className="blob blob-indigo w-[400px] h-[400px] -top-40 right-20 opacity-8" />
      <div className="blob blob-teal w-72 h-72 bottom-40 -left-20 opacity-6" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        {/* Welcome Back Banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-sm p-3 mb-3 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal/5 relative"
          >
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded bg-white/10 text-slate-500 hover:text-white flex items-center justify-center text-xs font-bold transition-all"
            >
              &times;
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-base">📊</div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-white font-sans">
                  Welcome back, {student.name}. 8 items in revision backlog. JEE in 120 days.
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  You were away for 3 days. Consistency matters. Let&apos;s catch up.
                </p>
              </div>
              <button className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500/25 transition-all font-sans">
                Quick Catch-Up
              </button>
            </div>
          </motion.div>
        )}

        {/* Command deck header */}
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal flex items-center justify-center text-xl">
              {student.avatar}
            </div>
            <div>
              <h1 className="text-base font-bold font-sans">{student.name}</h1>
              <p className="text-[10px] text-slate-500 font-mono">C12 &middot; {stream === "NEET" ? "PCB" : "PCM"} &middot; {student.school}</p>
            </div>
          </div>
          {/* Metrics row */}
          <div className="flex items-center gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className={`text-xs font-bold ${m.color} tabular-nums`}>{m.value}</div>
                <div className="flex items-center gap-1 justify-center">
                  <span className={`text-[8px] px-1 rounded ${
                    m.priority === "P0" ? "bg-red-500/20 text-red-400" :
                    m.priority === "P1" ? "bg-amber-500/20 text-amber-400" :
                    "bg-slate-500/20 text-slate-400"
                  }`}>{m.priority}</span>
                  <span className="text-[9px] text-slate-500">{m.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stream selector pills */}
        <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.03 }} className="flex items-center gap-2 mb-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider mr-1 font-sans">Stream</span>
          {(["JEE", "NEET", "Foundation", "Olympiad"] as StreamKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setStream(s)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                stream === s
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-white/[0.04] text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {s}
            </button>
          ))}
          {/* Start Timed Test button */}
          <button
            onClick={() => setTimerActive(true)}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal/20 text-emerald-400 text-[11px] font-bold hover:from-emerald-500/30 hover:to-teal/30 transition-all ring-1 ring-emerald-500/20"
          >
            <span className="font-sans">Start Timed Test</span>
            <span className="text-[9px] opacity-60">30:00</span>
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <div className="flex gap-1 mb-4">
            {(["Learn", "Practice", "Review", "Analytics"] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans ${
                  activeTab === tab
                    ? "bg-indigo/15 text-indigo-light"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto text-[10px] text-slate-500 flex items-center gap-1">
              <span className="opacity-50">Cmd+K</span> Quick Jump
            </div>
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {/* ═══════════════ LEARN TAB ═══════════════ */}
          {activeTab === "Learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-4 gap-3">
                {/* Subjects - compact data table */}
                <div className="col-span-2 space-y-3">
                  <div className="glass-sm overflow-hidden">
                    <div className="grid grid-cols-[1fr_80px_80px_60px_40px] gap-2 p-2 text-[9px] text-slate-500 uppercase tracking-wider border-b border-white/5">
                      <span>Subject</span>
                      <span>Coverage</span>
                      <span>{stream} Wt.</span>
                      <span>Status</span>
                      <span></span>
                    </div>
                    {subjects.map((sub, i) => (
                      <Link href="/player" key={sub.id}>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.15 + i * 0.03 }}
                          className="grid grid-cols-[1fr_80px_80px_60px_40px] gap-2 p-2.5 items-center hover:bg-white/3 cursor-pointer transition-all border-b border-white/3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{sub.emoji}</span>
                            <div>
                              <div className="text-xs font-bold font-sans">{sub.name}</div>
                              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{sub.currentTopic}</div>
                            </div>
                          </div>
                          <div>
                            <ProgressBar value={sub.progress} color="indigo" />
                            <span className="text-[10px] text-slate-400 tabular-nums">{sub.progress}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            {weights[sub.id] || "-"}
                          </div>
                          <Tag
                            label={sub.progress >= 70 ? "On Track" : sub.progress >= 50 ? "Monitor" : "Behind"}
                            color={sub.progress >= 70 ? "green" : sub.progress >= 50 ? "amber" : "red"}
                          />
                          <span className="text-slate-600 text-xs">&#8594;</span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <GlassCard>
                      <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Quick Actions</h3>
                      <div className="space-y-1.5">
                        {[
                          { label: "Formula Sheet", key: "Cmd+F", emoji: "📋" },
                          { label: "Mock Test", key: "Cmd+T", emoji: "📝" },
                          { label: "Revision", key: "Cmd+R", emoji: "🔄" },
                          { label: "PYQ Bank", key: "Cmd+P", emoji: "📚" },
                        ].map((a) => (
                          <button key={a.label} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-white/5 transition-all">
                            <span>{a.emoji}</span>
                            <span className="flex-1 text-left text-slate-300 font-sans">{a.label}</span>
                            <span className="text-[9px] text-slate-600 font-mono">{a.key}</span>
                          </button>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Burnout gauge */}
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                    <GlassCard>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-slate-300 font-sans">Burnout Monitor</h3>
                          <p className="text-[10px] text-slate-500">Based on study patterns &amp; breaks</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={35} max={100} color="bg-emerald-400" className="w-24" />
                          <span className="text-[10px] text-emerald-400 font-bold tabular-nums">35%</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-emerald-500 mt-1">Healthy study rhythm. Keep it up.</div>
                    </GlassCard>
                  </motion.div>
                </div>

                {/* Right side - Rank + Velocity */}
                <div className="space-y-3">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                    <GlassCard>
                      <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Rank Predictor</h3>
                      <div className="text-center">
                        <div className="text-3xl font-black text-emerald-400 tabular-nums font-sans">{rankInfo.rank}</div>
                        <div className="text-[10px] text-slate-400">{rankInfo.label}</div>
                        <div className="text-[9px] text-emerald-500 mt-1">&#8593; {rankInfo.delta}</div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <GlassCard>
                      <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Velocity</h3>
                      <div className="space-y-2">
                        {[
                          { label: "Topics/Day", value: "4.2", trend: "up" },
                          { label: "Accuracy", value: "87%", trend: "flat" },
                          { label: "Speed", value: "2.1 min/Q", trend: "up" },
                          { label: "Consistency", value: "92%", trend: "up" },
                        ].map((v) => (
                          <div key={v.label} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{v.label}</span>
                            <span className="font-bold text-white tabular-nums">
                              {v.value}{" "}
                              <span className="text-emerald-400">
                                {v.trend === "up" ? "\u2191" : v.trend === "flat" ? "\u2192" : "\u2193"}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Stream comparison */}
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                    <GlassCard>
                      <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">
                        Stream: {stream === "NEET" ? "PCB" : stream === "Foundation" ? "All" : stream === "Olympiad" ? "PCM+" : "PCM"}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {stream === "JEE" && ["JEE Main", "JEE Adv", "Board"].map((exam) => (
                          <Tag key={exam} label={exam} color={exam === "JEE Main" ? "green" : exam === "JEE Adv" ? "amber" : "indigo"} />
                        ))}
                        {stream === "NEET" && ["NEET UG", "AIIMS", "Board"].map((exam) => (
                          <Tag key={exam} label={exam} color={exam === "NEET UG" ? "green" : exam === "AIIMS" ? "amber" : "indigo"} />
                        ))}
                        {stream === "Foundation" && ["Board", "NTSE", "Olympiad"].map((exam) => (
                          <Tag key={exam} label={exam} color={exam === "Board" ? "green" : exam === "NTSE" ? "amber" : "indigo"} />
                        ))}
                        {stream === "Olympiad" && ["IMO", "INPhO", "INCHO"].map((exam) => (
                          <Tag key={exam} label={exam} color={exam === "IMO" ? "green" : exam === "INPhO" ? "amber" : "indigo"} />
                        ))}
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500">
                        {stream === "JEE" && "Target: NIT Tier-1 (CS)"}
                        {stream === "NEET" && "Target: AIIMS Delhi (MBBS)"}
                        {stream === "Foundation" && "Target: Top 5% Board + Competitive Edge"}
                        {stream === "Olympiad" && "Target: International Olympiad Selection"}
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>

                {/* Far right - Career */}
                <div className="space-y-3">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">GroerX Career</h2>
                    <Link href="/groerx">
                      <GlassCard hover>
                        <div className="space-y-3">
                          {DEMO_CAREERS.slice(0, 3).map((career) => (
                            <div key={career.title} className="flex items-center gap-2">
                              <span className="text-lg">{career.emoji}</span>
                              <div className="flex-1">
                                <div className="text-xs font-bold font-sans">{career.title}</div>
                                <ProgressBar value={career.match} color="teal" className="mt-1" />
                              </div>
                              <span className="text-xs font-bold text-teal tabular-nums">{career.match}%</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[9px] text-indigo-light mt-2 hover:underline">View full career map &#8594;</div>
                      </GlassCard>
                    </Link>
                  </motion.div>

                  {/* Analytics mini */}
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <GlassCard>
                      <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Week Analytics</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="text-lg font-black text-indigo-light tabular-nums font-sans">18.5h</div>
                          <div className="text-[8px] text-slate-500">Study Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-black text-teal tabular-nums font-sans">142</div>
                          <div className="text-[8px] text-slate-500">Questions</div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ PRACTICE TAB ═══════════════ */}
          {activeTab === "Practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-4 gap-3">
                {/* Left 2 cols */}
                <div className="col-span-2 space-y-3">
                  {/* Speed Drill */}
                  <GlassCard className="border-emerald-500/10">
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Speed Drill</h3>
                    <p className="text-[10px] text-slate-400 mb-3">Timed question sets. Pick your intensity.</p>
                    <div className="grid grid-cols-3 gap-2">
                      {SPEED_DRILL_OPTIONS.map((opt) => (
                        <button
                          key={opt.duration}
                          className={`${opt.bg} rounded-lg p-3 text-center hover:scale-[1.02] transition-all`}
                        >
                          <div className={`text-lg font-black tabular-nums font-sans ${opt.color}`}>{opt.duration}</div>
                          <div className="text-[10px] text-slate-400">{opt.questions} questions</div>
                          <div className={`text-[9px] font-bold mt-1 ${opt.color}`}>{opt.label}</div>
                        </button>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Topic-wise Practice */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Topic-wise Practice</h3>
                    <div className="space-y-3">
                      {TOPIC_PRACTICE_GRID.map((subj) => (
                        <div key={subj.subject}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm">{subj.emoji}</span>
                            <span className="text-xs font-bold font-sans text-slate-300">{subj.subject}</span>
                            <span className="text-[9px] text-slate-500 ml-auto">{subj.questionsAvailable} Qs</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {subj.chapters.map((ch) => (
                              <button
                                key={ch}
                                className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[10px] text-slate-400 hover:bg-indigo/15 hover:text-indigo-light transition-all font-sans"
                              >
                                {ch}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Previous Year Questions */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Previous Year Questions</h3>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1">
                        <label className="text-[9px] text-slate-500 block mb-1 font-sans">Exam</label>
                        <div className="flex flex-wrap gap-1">
                          {PYQ_EXAMS.map((ex) => (
                            <button
                              key={ex}
                              onClick={() => setPyqExam(ex)}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                                pyqExam === ex
                                  ? "bg-indigo/20 text-indigo-light"
                                  : "bg-white/[0.04] text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {ex}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mb-3">
                      {PYQ_YEARS.map((yr) => (
                        <button
                          key={yr}
                          onClick={() => setPyqYear(yr)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold tabular-nums transition-all ${
                            pyqYear === yr
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/[0.04] text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-slate-400">
                        <span className="text-white font-bold">{pyqExam} {pyqYear}</span> &middot; 90 questions available
                      </div>
                      <button className="bg-indigo/15 text-indigo-light text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo/25 transition-all">
                        Start PYQ Set &#8594;
                      </button>
                    </div>
                  </GlassCard>
                </div>

                {/* Right side */}
                <div className="space-y-3">
                  {/* Custom Test Builder */}
                  <GlassCard className="border-indigo/10">
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Custom Test Builder</h3>
                    <div className="space-y-3">
                      {/* Subject selection */}
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-1 font-sans">Subjects</label>
                        <div className="flex flex-wrap gap-1.5">
                          {["Physics", "Chemistry", "Mathematics", "CS", "English"].map((s) => (
                            <button
                              key={s}
                              onClick={() => toggleCustomSubject(s)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                customSubjects.includes(s)
                                  ? "bg-indigo/20 text-indigo-light ring-1 ring-indigo/30"
                                  : "bg-white/[0.04] text-slate-500"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Difficulty */}
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-1 font-sans">Difficulty</label>
                        <div className="flex gap-1.5">
                          {CUSTOM_TEST_DIFFICULTIES.map((d) => (
                            <button
                              key={d}
                              onClick={() => setCustomDifficulty(d)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                customDifficulty === d
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-white/[0.04] text-slate-500"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Question count */}
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-1 font-sans">Questions</label>
                        <div className="flex gap-1.5">
                          {CUSTOM_TEST_COUNTS.map((c) => (
                            <button
                              key={c}
                              onClick={() => setCustomCount(c)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold tabular-nums transition-all ${
                                customCount === c
                                  ? "bg-teal/20 text-teal"
                                  : "bg-white/[0.04] text-slate-500"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setTimerActive(true)}
                        className="w-full mt-1 bg-gradient-to-r from-emerald-500/15 to-teal/15 text-emerald-400 text-[11px] font-bold px-3 py-2 rounded-lg hover:from-emerald-500/25 hover:to-teal/25 transition-all"
                      >
                        Generate &amp; Start Test &#8594;
                      </button>
                    </div>
                  </GlassCard>

                  {/* Practice Stats */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Practice Stats</h3>
                    <div className="space-y-2.5">
                      {PRACTICE_STATS.map((stat) => (
                        <div key={stat.label}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{stat.label}</span>
                            <span className="text-xs font-bold text-white tabular-nums font-sans">{stat.value}</span>
                          </div>
                          <div className="text-[9px] text-emerald-500">{stat.trend}</div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Far right col */}
                <div className="space-y-3">
                  {/* Rank predictor (persistent) */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Rank Predictor</h3>
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-400 tabular-nums font-sans">{rankInfo.rank}</div>
                      <div className="text-[10px] text-slate-400">{rankInfo.label}</div>
                      <div className="text-[9px] text-emerald-500 mt-1">&#8593; {rankInfo.delta}</div>
                    </div>
                  </GlassCard>

                  {/* Recent practice sessions */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Recent Sessions</h3>
                    <div className="space-y-2">
                      {[
                        { date: "Today", type: "Speed Drill", score: "18/20", time: "8:42" },
                        { date: "Yesterday", type: "PYQ JEE 2024", score: "72/90", time: "2:45:00" },
                        { date: "Feb 19", type: "Custom Test", score: "24/30", time: "38:15" },
                        { date: "Feb 18", type: "Speed Drill", score: "14/15", time: "4:55" },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-[10px] py-1 border-b border-white/3 last:border-0">
                          <div>
                            <div className="text-slate-300 font-sans">{s.type}</div>
                            <div className="text-[9px] text-slate-500">{s.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold tabular-nums">{s.score}</div>
                            <div className="text-[9px] text-slate-500 tabular-nums">{s.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Burnout gauge (persistent) */}
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-300 font-sans">Burnout</h3>
                        <p className="text-[9px] text-slate-500">Study pattern health</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={35} max={100} color="bg-emerald-400" className="w-16" />
                        <span className="text-[10px] text-emerald-400 font-bold tabular-nums">35%</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ REVIEW TAB ═══════════════ */}
          {activeTab === "Review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Subject filter */}
              <div className="flex gap-1.5 mb-3">
                {["All", "Physics", "Chemistry", "Mathematics", "CS", "English"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReviewSubjectFilter(s)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                      reviewSubjectFilter === s
                        ? "bg-indigo/20 text-indigo-light"
                        : "bg-white/[0.04] text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Left 2 cols */}
                <div className="col-span-2 space-y-3">
                  {/* Bookmarked Questions */}
                  <GlassCard>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">
                        Bookmarked Questions
                        <span className="ml-1.5 text-indigo-light">{filteredBookmarks.length}</span>
                      </h3>
                    </div>
                    <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                      {filteredBookmarks.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer"
                        >
                          <span className="text-[9px] text-slate-500 tabular-nums w-5 font-sans">#{q.id}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] text-slate-300 font-sans truncate">{q.topic}</div>
                            <div className="text-[9px] text-slate-500">{q.source}</div>
                          </div>
                          <Tag
                            label={q.difficulty}
                            color={q.difficulty === "Hard" ? "red" : q.difficulty === "Medium" ? "amber" : "green"}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Mistake Log */}
                  <GlassCard className="border-red-500/10">
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">
                      Mistake Log
                      <span className="ml-1.5 text-red-400">{filteredMistakes.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {filteredMistakes.map((m) => (
                        <div key={m.id} className="p-2 rounded-lg bg-white/[0.02] border border-white/3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Tag label={m.type} color="red" />
                              <span className="text-[10px] text-slate-400 font-sans">{m.topic}</span>
                            </div>
                            <span className="text-[9px] text-slate-500 tabular-nums">{m.date}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">{m.question}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-500">{m.subject}</span>
                            <span className="text-[9px] text-red-400 tabular-nums">Repeated {m.count}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Right col */}
                <div className="space-y-3">
                  {/* Weak Areas Heatmap */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Weak Areas Heatmap</h3>
                    <div className="space-y-0.5">
                      {/* Header */}
                      <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase tracking-wider mb-1">
                        <span></span>
                        <span className="text-center">Easy</span>
                        <span className="text-center">Medium</span>
                        <span className="text-center">Hard</span>
                      </div>
                      {WEAK_AREAS_HEATMAP.map((row) => (
                        <div key={row.subject} className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1">
                          <span className="text-[10px] text-slate-400 font-sans">{row.subject}</span>
                          {[row.easy, row.medium, row.hard].map((val, i) => (
                            <div
                              key={i}
                              className={`text-center py-1 rounded text-[10px] font-bold tabular-nums ${heatColor(val)}`}
                            >
                              {val}%
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Flagged Formulas */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Flagged Formulas</h3>
                    <div className="space-y-1.5">
                      {FLAGGED_FORMULAS.map((f) => (
                        <div key={f.id} className="flex items-start gap-2 px-1.5 py-1 rounded hover:bg-white/[0.04] transition-all">
                          <span className={`text-[8px] mt-0.5 ${
                            f.priority === "high" ? "text-red-400" : f.priority === "medium" ? "text-amber-400" : "text-slate-500"
                          }`}>
                            {f.priority === "high" ? "!!!" : f.priority === "medium" ? "!!" : "!"}
                          </span>
                          <div>
                            <div className="text-[10px] text-slate-300 font-mono">{f.formula}</div>
                            <div className="text-[9px] text-slate-500">{f.subject}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Far right col */}
                <div className="space-y-3">
                  {/* Revision Schedule R1-R10 */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Revision Schedule</h3>
                    <div className="space-y-1.5">
                      {REVISION_SCHEDULE.map((r) => (
                        <div key={r.round} className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-sans ${
                            r.status === "done"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : r.status === "active"
                              ? "bg-indigo/20 text-indigo-light ring-1 ring-indigo/30"
                              : "bg-white/[0.04] text-slate-500"
                          }`}>
                            {r.round}
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] text-slate-300 font-sans">{r.label}</div>
                            {r.status === "done" && (
                              <div className="text-[9px] text-emerald-500 tabular-nums">{r.topics} topics revised</div>
                            )}
                            {r.status === "active" && (
                              <div className="text-[9px] text-indigo-light tabular-nums">{r.topics} topics &middot; In progress</div>
                            )}
                            {r.status === "pending" && (
                              <div className="text-[9px] text-slate-500">Scheduled</div>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold ${
                            r.status === "done" ? "text-emerald-400" : r.status === "active" ? "text-indigo-light" : "text-slate-600"
                          }`}>
                            {r.status === "done" ? "\u2713" : r.status === "active" ? "\u25CF" : "\u25CB"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Burnout gauge (persistent) */}
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-300 font-sans">Burnout</h3>
                        <p className="text-[9px] text-slate-500">Study pattern health</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={35} max={100} color="bg-emerald-400" className="w-16" />
                        <span className="text-[10px] text-emerald-400 font-bold tabular-nums">35%</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ ANALYTICS TAB ═══════════════ */}
          {activeTab === "Analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-4 gap-3">
                {/* Left 2 cols */}
                <div className="col-span-2 space-y-3">
                  {/* Rank Prediction Trend */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Rank Prediction Trend</h3>
                    <div className="space-y-1.5">
                      {MOCK_TEST_RANKS.map((m, i) => (
                        <div key={m.test} className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 w-14 font-sans">{m.test}</span>
                          <div className="flex-1">
                            <MiniBar value={100 - (m.rank / 20000) * 100} max={100} color="bg-emerald-400" />
                          </div>
                          <span className="text-[10px] text-slate-300 tabular-nums w-14 text-right font-sans">#{m.rank.toLocaleString()}</span>
                          <span className="text-[9px] text-emerald-400 tabular-nums w-14 text-right">{m.percentile}%ile</span>
                          {i > 0 && (
                            <span className="text-[9px] text-emerald-500 w-10 text-right">
                              &#8593;{(MOCK_TEST_RANKS[i - 1].rank - m.rank).toLocaleString()}
                            </span>
                          )}
                          {i === 0 && <span className="w-10" />}
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Subject Accuracy Radar (text-based pentagon representation) */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Subject Accuracy Radar</h3>
                    <div className="flex items-center justify-center py-2">
                      {/* SVG pentagon radar chart */}
                      <svg viewBox="0 0 200 200" className="w-48 h-48">
                        {/* Grid pentagons */}
                        {[0.25, 0.5, 0.75, 1].map((scale) => (
                          <polygon
                            key={scale}
                            points={SUBJECT_ACCURACY_RADAR.map((_, i) => {
                              const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                              const r = 80 * scale;
                              return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                            }).join(" ")}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                          />
                        ))}
                        {/* Axis lines */}
                        {SUBJECT_ACCURACY_RADAR.map((_, i) => {
                          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                          return (
                            <line
                              key={i}
                              x1="100"
                              y1="100"
                              x2={100 + 80 * Math.cos(angle)}
                              y2={100 + 80 * Math.sin(angle)}
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="1"
                            />
                          );
                        })}
                        {/* Data polygon */}
                        <polygon
                          points={SUBJECT_ACCURACY_RADAR.map((s, i) => {
                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                            const r = (s.accuracy / 100) * 80;
                            return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                          }).join(" ")}
                          fill="rgba(99,102,241,0.15)"
                          stroke="rgba(99,102,241,0.6)"
                          strokeWidth="2"
                        />
                        {/* Data points + labels */}
                        {SUBJECT_ACCURACY_RADAR.map((s, i) => {
                          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                          const r = (s.accuracy / 100) * 80;
                          const labelR = 95;
                          return (
                            <g key={s.subject}>
                              <circle
                                cx={100 + r * Math.cos(angle)}
                                cy={100 + r * Math.sin(angle)}
                                r="3"
                                fill="#6366f1"
                              />
                              <text
                                x={100 + labelR * Math.cos(angle)}
                                y={100 + labelR * Math.sin(angle)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-slate-400 text-[8px] font-sans"
                              >
                                {s.subject} ({s.accuracy}%)
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </GlassCard>

                  {/* Score Comparison */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Your Score vs Top 10% vs Average</h3>
                    <div className="space-y-3">
                      {SCORE_COMPARISON.map((s) => (
                        <div key={s.subject}>
                          <div className="text-[10px] text-slate-400 font-sans mb-1">{s.subject}</div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-emerald-400 w-12">You</span>
                              <MiniBar value={s.yours} max={200} color="bg-emerald-400" />
                              <span className="text-[10px] text-white tabular-nums w-8 text-right font-sans">{s.yours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-indigo-light w-12">Top 10%</span>
                              <MiniBar value={s.top10} max={200} color="bg-indigo" />
                              <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right font-sans">{s.top10}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-500 w-12">Average</span>
                              <MiniBar value={s.average} max={200} color="bg-white/20" />
                              <span className="text-[10px] text-slate-500 tabular-nums w-8 text-right font-sans">{s.average}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Right col */}
                <div className="space-y-3">
                  {/* Time per Question */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Avg Time / Question</h3>
                    <div className="space-y-2.5">
                      {TIME_PER_QUESTION.map((t) => (
                        <div key={t.subject}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-slate-400 font-sans">{t.subject}</span>
                            <span className={`text-[10px] font-bold tabular-nums ${
                              t.avgTime <= t.target ? "text-emerald-400" : "text-amber-300"
                            }`}>
                              {t.avgTime} min
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MiniBar
                              value={t.avgTime}
                              max={4}
                              color={t.avgTime <= t.target ? "bg-emerald-400" : "bg-amber-400"}
                            />
                            <span className="text-[8px] text-slate-500 tabular-nums">target: {t.target}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Weekly Velocity */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Weekly Velocity</h3>
                    <div className="space-y-2.5">
                      {WEEKLY_VELOCITY.map((w) => (
                        <div key={w.label}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-slate-400 font-sans">{w.label}</span>
                            <span className="text-[10px] text-white font-bold tabular-nums font-sans">
                              {w.value} <span className="text-slate-500 font-normal">/ {w.target}</span>
                            </span>
                          </div>
                          <MiniBar
                            value={w.pct}
                            max={100}
                            color={w.pct >= 90 ? "bg-emerald-400" : w.pct >= 70 ? "bg-amber-400" : "bg-red-400"}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Far right col */}
                <div className="space-y-3">
                  {/* Performance Trend */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-sans">Performance Trend (Last 10 Tests)</h3>
                    <div className="space-y-1">
                      {PERFORMANCE_TREND.map((p, i) => (
                        <div key={p.test} className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 w-12 font-sans">{p.test}</span>
                          <div className="flex-1">
                            <MiniBar value={p.score} max={100} color={p.score >= 80 ? "bg-emerald-400" : p.score >= 70 ? "bg-teal" : "bg-amber-400"} />
                          </div>
                          <span className="text-[10px] text-white tabular-nums w-8 text-right font-bold font-sans">{p.score}%</span>
                          {i > 0 && (
                            <span className={`text-[9px] tabular-nums w-8 text-right ${
                              p.score >= PERFORMANCE_TREND[i - 1].score ? "text-emerald-400" : "text-red-400"
                            }`}>
                              {p.score >= PERFORMANCE_TREND[i - 1].score ? "+" : ""}{p.score - PERFORMANCE_TREND[i - 1].score}
                            </span>
                          )}
                          {i === 0 && <span className="w-8" />}
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Rank predictor (persistent) */}
                  <GlassCard>
                    <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Rank Predictor</h3>
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-400 tabular-nums font-sans">{rankInfo.rank}</div>
                      <div className="text-[10px] text-slate-400">{rankInfo.label}</div>
                      <div className="text-[9px] text-emerald-500 mt-1">&#8593; {rankInfo.delta}</div>
                    </div>
                  </GlassCard>

                  {/* Burnout gauge (persistent) */}
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-300 font-sans">Burnout</h3>
                        <p className="text-[9px] text-slate-500">Study pattern health</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={35} max={100} color="bg-emerald-400" className="w-16" />
                        <span className="text-[10px] text-emerald-400 font-bold tabular-nums">35%</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Syllabus Coverage */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mt-3">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans">Syllabus Coverage</h3>
          <GlassCard padding="p-3">
            <div className="flex items-center justify-between gap-2">
              {SYLLABUS_COVERAGE.map((sub) => (
                <div key={sub.subject} className="flex flex-col items-center gap-1 flex-1">
                  <GaugeRing value={sub.covered} max={sub.total} size={48} color={sub.color} strokeWidth={3}>
                    <span className="text-[9px] font-bold" style={{ color: sub.color }}>{sub.covered}%</span>
                  </GaugeRing>
                  <span className="text-sm">{sub.emoji}</span>
                  <span className="text-[8px] text-slate-500 text-center leading-tight">{sub.subject}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
