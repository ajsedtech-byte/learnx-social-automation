"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_CHILDREN } from "@/lib/parent-demo-data";
import { DEMO_PARENT_CARDS, DEMO_SPARK, DEMO_REVISION } from "@/lib/demo-data";
import GlassCard from "@/components/ui/GlassCard";
import GaugeRing from "@/components/ui/GaugeRing";
import Tag from "@/components/ui/Tag";
import TabBar from "@/components/ui/TabBar";
import ChildSwitcher from "@/components/parent/ChildSwitcher";
import ParentSettings from "@/components/parent/ParentSettings";
import { motion, AnimatePresence } from "framer-motion";
import { TierKey } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════
   EXTENDED PARENT CARDS — adds missing card types per blueprint
   These supplement DEMO_PARENT_CARDS from demo-data
   ═══════════════════════════════════════════════════════════════════ */
const EXTENDED_CARDS: {
  id: string; title: string; emoji: string; value: string;
  detail: string; trend: "up" | "down" | "stable"; tiers: TierKey[];
}[] = [
  { id: "px1", title: "Foundations", emoji: "\uD83E\uDDF1", value: "2 gaps", detail: "Pre-requisite check", trend: "stable", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "px2", title: "Verified Score", emoji: "\u2705", value: "78%", detail: "Actual test accuracy", trend: "up", tiers: ["explorer", "studio", "board", "pro"] },
  { id: "px3", title: "Understanding", emoji: "\uD83E\uDDE0", value: "72%", detail: "Conceptual grasp", trend: "up", tiers: ["studio", "board", "pro"] },
  { id: "px4", title: "Application", emoji: "\uD83D\uDD27", value: "68%", detail: "Problem solving", trend: "stable", tiers: ["studio", "board", "pro"] },
  { id: "px5", title: "Learning Speed", emoji: "\u26A1", value: "4.2/wk", detail: "Topics per week", trend: "up", tiers: ["studio", "board", "pro"] },
  { id: "px6", title: "Revision Status", emoji: "\uD83D\uDD04", value: "R4 avg", detail: "R-stage summary", trend: "stable", tiers: ["studio", "board", "pro"] },
  { id: "px7", title: "Growth Trend", emoji: "\uD83D\uDCC8", value: "+12%", detail: "This week vs last", trend: "up", tiers: ["explorer", "studio", "board", "pro"] },
  { id: "px8", title: "Behavioral", emoji: "\uD83D\uDCCA", value: "Consistent", detail: "Study patterns", trend: "up", tiers: ["studio", "board", "pro"] },
  { id: "px9", title: "Verdict", emoji: "\uD83E\uDD16", value: "On Track", detail: "AI assessment", trend: "up", tiers: ["explorer", "studio", "board", "pro"] },
];

/* ═══════════════════════════════════════════════════════════════════
   8 NOTIFICATION TYPES with proper styling
   ═══════════════════════════════════════════════════════════════════ */
interface TypedNotification {
  id: string;
  type: "p0-alert" | "weekly-summary" | "milestone" | "nudge" | "inactivity" | "revision-backlog" | "revision-handoff" | "r10-mastery";
  text: string;
  time: string;
  childName: string;
  read: boolean;
}

const NOTIFICATION_TYPE_STYLES: Record<string, { label: string; borderColor: string; badgeColor: string; emoji: string }> = {
  "p0-alert":          { label: "P0 Alert",          borderColor: "border-red-500/40",    badgeColor: "bg-red-500/20 text-red-400",    emoji: "\uD83D\uDED1" },
  "weekly-summary":    { label: "Weekly Summary",    borderColor: "border-blue-500/30",   badgeColor: "bg-blue-500/20 text-blue-400",   emoji: "\uD83D\uDCCA" },
  "milestone":         { label: "Milestone",         borderColor: "border-emerald-500/30",badgeColor: "bg-emerald-500/20 text-emerald-400", emoji: "\uD83C\uDFC6" },
  "nudge":             { label: "Nudge",             borderColor: "border-yellow-500/30", badgeColor: "bg-yellow-500/20 text-yellow-400", emoji: "\uD83D\uDCAA" },
  "inactivity":        { label: "Inactivity",        borderColor: "border-orange-500/30", badgeColor: "bg-orange-500/20 text-orange-400", emoji: "\u23F0" },
  "revision-backlog":  { label: "Revision Backlog",  borderColor: "border-amber-500/30",  badgeColor: "bg-amber-500/20 text-amber-400",  emoji: "\uD83D\uDFE1" },
  "revision-handoff":  { label: "Revision Handoff",  borderColor: "border-pink-500/30",   badgeColor: "bg-pink-500/20 text-pink-400",    emoji: "\uD83E\uDDEC" },
  "r10-mastery":       { label: "R10 Mastery",       borderColor: "border-yellow-400/40", badgeColor: "bg-yellow-400/20 text-yellow-300", emoji: "\uD83E\uDD47" },
};

const DEMO_TYPED_NOTIFICATIONS: TypedNotification[] = [
  { id: "tn1",  type: "p0-alert",         text: "Priya scored 2/5 on Fraction Addition with high confidence (Sure + Wrong = P0 Misconception). Immediate review recommended.", time: "10 min ago", childName: "Priya", read: false },
  { id: "tn2",  type: "weekly-summary",   text: "Your weekly AI report for all children is ready. Aarav improved in Math, Priya needs Science support.", time: "1 hr ago", childName: "All", read: false },
  { id: "tn3",  type: "milestone",        text: "Aarav mastered Chapter 3: Addition! All topics completed and passed R10 revision.", time: "2 hr ago", childName: "Aarav", read: false },
  { id: "tn4",  type: "nudge",            text: "Rohan has been studying for 90 minutes. Time for a 10-min physical activity break!", time: "3 hr ago", childName: "Rohan", read: true },
  { id: "tn5",  type: "inactivity",       text: "Priya hasn't logged in for 3 days. A gentle check-in might help maintain her streak.", time: "5 hr ago", childName: "Priya", read: true },
  { id: "tn6",  type: "revision-backlog", text: "Rohan has 6 revision items with urgency > 0.5. Chemical Bonding and Trigonometry need priority.", time: "Yesterday", childName: "Rohan", read: true },
  { id: "tn7",  type: "revision-handoff", text: "Priya's 'Algebraic Expressions' failed 3 revision attempts. Entering Mistake Genome for deep analysis.", time: "Yesterday", childName: "Priya", read: true },
  { id: "tn8",  type: "r10-mastery",      text: "Aarav completed R10 for 'Nouns & Pronouns' - topic fully mastered! Permanent knowledge confirmed.", time: "2 days ago", childName: "Aarav", read: true },
  { id: "tn9",  type: "p0-alert",         text: "Rohan consistently drops negative signs in algebra. Pattern detected across 8 questions.", time: "2 days ago", childName: "Rohan", read: true },
  { id: "tn10", type: "milestone",        text: "Priya reached Level 25! Unlocked 'Science Explorer' badge.", time: "3 days ago", childName: "Priya", read: true },
  { id: "tn11", type: "weekly-summary",   text: "Last week's report: Rohan's board readiness improved to 78%. 4 topics need revision.", time: "4 days ago", childName: "Rohan", read: true },
  { id: "tn12", type: "nudge",            text: "Aarav loves drawing! Consider encouraging creative writing too - high linguistic potential detected.", time: "5 days ago", childName: "Aarav", read: true },
];

/* ═══════════════════════════════════════════════════════════════════
   C6+ OVERVIEW ANALYTICS DATA — heatmaps, trends, confidence, mistakes
   Only shown to Studio/Board/Pro parents in Overview tab
   ═══════════════════════════════════════════════════════════════════ */
const SUBJECTS_6PLUS = ["Mathematics", "Science", "English", "SST", "Hindi", "Life Skills"];

const ACCURACY_TRENDS: Record<string, number[]> = {
  Mathematics: [62, 68, 65, 72, 78],
  Science:     [55, 58, 52, 60, 65],
  English:     [78, 80, 82, 85, 88],
  SST:         [70, 68, 72, 75, 74],
  Hindi:       [65, 70, 72, 68, 75],
  "Life Skills": [80, 82, 85, 88, 90],
};

const CONFIDENCE_MATRIX = {
  sureRight: 145, sureWrong: 8, notSureRight: 42, notSureWrong: 28, guessRight: 18, guessWrong: 35,
  total: 276,
};

const MISTAKE_PATTERNS = [
  { pattern: "Sign errors in algebra", count: 12, severity: "P0" as const, subject: "Mathematics", trend: "rising" as const },
  { pattern: "Chemical equation balancing", count: 8, severity: "P0" as const, subject: "Science", trend: "stable" as const },
  { pattern: "Tense confusion in passive", count: 5, severity: "P1" as const, subject: "English", trend: "falling" as const },
  { pattern: "Map reading errors", count: 4, severity: "P1" as const, subject: "SST", trend: "stable" as const },
  { pattern: "Fraction → Decimal conversion", count: 7, severity: "P0" as const, subject: "Mathematics", trend: "falling" as const },
  { pattern: "Hindi matra spelling", count: 3, severity: "P2" as const, subject: "Hindi", trend: "stable" as const },
];

/* ═══════════════════════════════════════════════════════════════════
   REVISION TABLE DATA per tier
   ═══════════════════════════════════════════════════════════════════ */
const GARDEN_REVISION = [
  { name: "Addition", emoji: "\uD83C\uDF3B", status: "bloomed", stage: "R10" },
  { name: "Nouns", emoji: "\uD83C\uDF3C", status: "growing", stage: "R5" },
  { name: "My Family", emoji: "\uD83C\uDF31", status: "wilted", stage: "R2" },
  { name: "Hindi Letters", emoji: "\uD83C\uDF3A", status: "growing", stage: "R4" },
  { name: "Shapes", emoji: "\uD83C\uDF38", status: "bloomed", stage: "R9" },
];

const TOPIC_REVISION = [
  { name: "Fractions", subject: "Math", label: "Growing", stage: 4 },
  { name: "Photosynthesis", subject: "Science", label: "Strong", stage: 7 },
  { name: "Parts of Speech", subject: "English", label: "Mastered", stage: 10 },
  { name: "Indian States", subject: "SST", label: "Weak", stage: 2 },
  { name: "Adjectives", subject: "Hindi", label: "Growing", stage: 5 },
];

const TABLE_REVISION = [
  { subject: "Mathematics", chapter: "Ch4: Quadratic Eq.", topic: "Discriminant", r: 5, score: 85, due: "Today" },
  { subject: "Mathematics", chapter: "Ch6: Triangles", topic: "Similarity", r: 3, score: 70, due: "Tomorrow" },
  { subject: "Science", chapter: "Ch1: Chemical Rx", topic: "Balancing Eq.", r: 7, score: 95, due: "Feb 25" },
  { subject: "Science", chapter: "Ch3: Metals", topic: "Reactivity", r: 2, score: 45, due: "Today" },
  { subject: "English", chapter: "Ch5: Voice", topic: "Active-Passive", r: 8, score: 92, due: "Feb 26" },
  { subject: "SST", chapter: "Ch3: Nationalism", topic: "Congress Role", r: 4, score: 80, due: "Feb 24" },
];

/* ═══════════════════════════════════════════════════════════════════
   TABS — dynamic per tier
   C1-5 get Garden tab, C6+ get GroerX + Momentum tabs
   ═══════════════════════════════════════════════════════════════════ */
const BASE_TABS = [
  { key: "overview", label: "Overview", emoji: "\uD83D\uDCCA" },
  { key: "brain", label: "Brain Profile", emoji: "\uD83E\uDDE0" },
  { key: "notifications", label: "Notifications", emoji: "\uD83D\uDD14" },
  { key: "revision", label: "Revision", emoji: "\uD83D\uDD04" },
];

const GARDEN_TAB = { key: "garden", label: "Garden", emoji: "\uD83C\uDF31" };
const GROERX_TAB = { key: "groerx", label: "GroerX Career", emoji: "\uD83D\uDE80" };
const MOMENTUM_TAB = { key: "momentum", label: "Momentum", emoji: "\u26A1" };
const SETTINGS_TAB = { key: "settings", label: "Settings", emoji: "\u2699\uFE0F" };

function getTabsForTier(t: TierKey) {
  const tabs = [...BASE_TABS];
  if (t === "storybook" || t === "explorer") tabs.push(GARDEN_TAB);
  if (t === "studio" || t === "board" || t === "pro") {
    tabs.push(MOMENTUM_TAB);
    tabs.push(GROERX_TAB);
  }
  tabs.push(SETTINGS_TAB);
  return tabs;
}

/* ═══════════════════════════════════════════════════════════════════
   GARDEN DATA FOR PARENT TAB (C1-5)
   ═══════════════════════════════════════════════════════════════════ */
const PARENT_GARDEN = [
  { subject: "Math", emoji: "\uD83C\uDF3B", plant: "Sunflower", stage: "bloom", topics: 8, total: 12, streak: 5 },
  { subject: "English", emoji: "\uD83C\uDF39", plant: "Rose", stage: "sapling", topics: 5, total: 10, streak: 3 },
  { subject: "Science", emoji: "\uD83C\uDF3F", plant: "Neem", stage: "tree", topics: 7, total: 9, streak: 7 },
  { subject: "Hindi", emoji: "\uD83C\uDF38", plant: "Lotus", stage: "sprout", topics: 3, total: 8, streak: 2 },
  { subject: "SST", emoji: "\uD83C\uDF3C", plant: "Daisy", stage: "seed", topics: 1, total: 6, streak: 0 },
  { subject: "Life Skills", emoji: "\uD83C\uDF3A", plant: "Tulsi", stage: "sapling", topics: 3, total: 5, streak: 4 },
];

const STAGE_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  seed: { label: "Just planted", color: "text-slate-400", emoji: "\uD83C\uDF31" },
  sprout: { label: "Sprouting", color: "text-amber-400", emoji: "\uD83C\uDF3F" },
  sapling: { label: "Growing", color: "text-teal", emoji: "\uD83C\uDF33" },
  tree: { label: "Strong", color: "text-emerald-400", emoji: "\uD83C\uDF32" },
  bloom: { label: "Blooming!", color: "text-pink-400", emoji: "\uD83C\uDF3A" },
};

/* ═══════════════════════════════════════════════════════════════════
   MOMENTUM DATA FOR PARENT TAB (C6+)
   ═══════════════════════════════════════════════════════════════════ */
const PARENT_MOMENTUM = {
  speed: 72,
  maxSpeed: 100,
  xpThisWeek: 1840,
  xpLastWeek: 1620,
  streak: 14,
  longestStreak: 28,
  xpMultiplier: "1.5x",
  xpZone: "Momentum Zone" as const,
  dailyXP: [180, 220, 340, 260, 300, 280, 260],
  dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

/* ═══════════════════════════════════════════════════════════════════
   GROERX SUMMARY FOR PARENT TAB (C6+)
   ═══════════════════════════════════════════════════════════════════ */
const PARENT_GROERX_SUMMARY = {
  topInterests: ["Science & Technology", "Problem Solving", "Mathematical Thinking"],
  topStream: { name: "Science (PCM)", match: 88 },
  topCareers: [
    { title: "Software Engineer", match: 92, emoji: "\uD83D\uDCBB" },
    { title: "Data Scientist", match: 88, emoji: "\uD83D\uDCC8" },
    { title: "Aerospace Engineer", match: 82, emoji: "\uD83D\uDE80" },
  ],
  advice: "Your child shows strong logical-mathematical and spatial intelligence. Encourage hands-on projects, coding, and science experiments. Don't push specific career — let interests develop naturally.",
};

export default function ParentPage() {
  const { tier } = useTier();
  const { activeChild } = useRole();
  const child = DEMO_CHILDREN[activeChild];
  // Use child profile for identity, tier context for dashboard behavior
  const student = { name: child.name, class: child.class, school: child.school };
  const spark = DEMO_SPARK[tier];
  const TABS = getTabsForTier(tier);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllNotifs, setShowAllNotifs] = useState(false);
  const [notifFilter, setNotifFilter] = useState<string>("all");
  const [sharePreview, setSharePreview] = useState(false);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  /* ─── Notification filtering ─── */
  const filteredNotifs = DEMO_TYPED_NOTIFICATIONS.filter(n => {
    if (notifFilter !== "all" && n.type !== notifFilter) return false;
    return true;
  });
  const displayedNotifs = showAllNotifs ? filteredNotifs : filteredNotifs.slice(0, 6);
  const unreadCount = DEMO_TYPED_NOTIFICATIONS.filter(n => !n.read).length;

  /* ─── AI Report sections (structured) ─── */
  const aiReport = {
    summaryScore: { pct: 82, trend: "up" as const, arrow: "\u2191" },
    wins: [
      "Completed 12 topics this week (+3 from last week)",
      "English accuracy improved to 85% (up from 78%)",
      "Maintained 14-day study streak consistently",
    ],
    attention: [
      "Chemical Bonding concepts scoring below 50% - needs reinforcement",
      "Algebra sign errors recurring (8 instances this week)",
    ],
    revisionHealth: { status: 75, due: 4, overdue: 2, mastered: 3 },
    suggestion: `Focus 10 minutes daily on Science reading. Schedule weekend revision for Chemical Bonding and Algebraic signs. Consider discussing science concepts during dinner for ${student.name}.`,
  };

  return (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      <div className="blob blob-indigo w-96 h-96 -top-40 -right-40 opacity-10" />
      <div className="blob blob-teal w-80 h-80 bottom-40 -left-20 opacity-8" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* ── Parent header ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67"} Parent Dashboard</h1>
              <p className="text-sm text-slate-400">
                {student.name}&apos;s progress · Class {student.class} · {student.school}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSharePreview(!sharePreview)}
                className="glass-sm px-3 py-1.5 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all font-semibold"
              >
                {"\uD83D\uDCF1"} Share on WhatsApp
              </button>
              <button className="glass-sm px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-all">
                {"\uD83D\uDCC4"} Download Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── WhatsApp Share Preview ── */}
        <AnimatePresence>
          {sharePreview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="glass p-4 border border-green-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-green-400">{"\uD83D\uDCF1"} WhatsApp Share Preview</h3>
                  <button onClick={() => setSharePreview(false)} className="text-xs text-slate-500 hover:text-slate-300">Close</button>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                    <p className="font-bold text-white">{"\uD83D\uDCDA"} LearnX Weekly Report — {student.name}</p>
                    <p>{"\uD83C\uDFAF"} Score: {aiReport.summaryScore.pct}% ({aiReport.summaryScore.arrow} improving)</p>
                    <p>{"\uD83D\uDCAA"} Wins: {aiReport.wins.length} achievements this week</p>
                    <p>{"\u26A0\uFE0F"} Needs attention: {aiReport.attention.length} areas</p>
                    <p>{"\uD83D\uDD04"} Revision: {aiReport.revisionHealth.due} topics due, {aiReport.revisionHealth.mastered} mastered</p>
                    <p className="text-slate-500 text-[10px] mt-2">via LearnX Parent App</p>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all">
                  {"\uD83D\uDCE4"} Share Card on WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Child Switcher ── */}
        <ChildSwitcher />

        {/* ── Tabs ── */}
        <div className="mb-6">
          <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} accentColor="#2dd4bf" />
        </div>

        {/* ═══════════════════════════════════════════════════════════
           TAB: OVERVIEW — Tier-adapted, visual, simple for Indian parents
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <>
            {/* ════════════════════════════════════════
               STORYBOOK / EXPLORER (C1-5) — Warm & Visual
               ════════════════════════════════════════ */}
            {(tier === "storybook" || tier === "explorer") && (
              <>
                {/* ── Big status card — one glance ── */}
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <GlassCard className="text-center py-8 mb-6 border-teal/20">
                    <div className="text-5xl mb-3">{aiReport.summaryScore.pct >= 75 ? "\uD83C\uDF1F" : aiReport.summaryScore.pct >= 50 ? "\uD83D\uDE0A" : "\uD83E\uDD17"}</div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {aiReport.summaryScore.pct >= 75
                        ? `${student.name} had a great week!`
                        : aiReport.summaryScore.pct >= 50
                        ? `${student.name} is doing well`
                        : `${student.name} needs a little help`}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {aiReport.wins[0]}
                    </p>
                  </GlassCard>
                </motion.div>

                {/* ── Subject faces — happy/ok/needs-love ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">How each subject is going</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                    {SUBJECTS_6PLUS.map((subj, i) => {
                      const score = ACCURACY_TRENDS[subj]?.[4] ?? 70;
                      const face = score >= 80 ? "\uD83D\uDE0A" : score >= 60 ? "\uD83D\uDE42" : "\uD83D\uDE1F";
                      const color = score >= 80 ? "border-emerald-500/30 bg-emerald-500/5" : score >= 60 ? "border-amber-400/30 bg-amber-400/5" : "border-rose-400/30 bg-rose-400/5";
                      const label = score >= 80 ? "Doing great" : score >= 60 ? "Okay" : "Needs help";
                      return (
                        <motion.div key={subj} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}>
                          <div className={`glass-sm p-4 text-center border ${color} rounded-2xl`}>
                            <div className="text-3xl mb-2">{face}</div>
                            <div className="text-xs font-bold text-white">{subj}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{label}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* ── Quick numbers row ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <GlassCard padding="p-4" className="text-center">
                      <div className="text-2xl mb-1">{"\uD83D\uDD25"}</div>
                      <div className="text-lg font-black text-white">5 days</div>
                      <div className="text-[10px] text-slate-400">Study streak</div>
                    </GlassCard>
                    <GlassCard padding="p-4" className="text-center">
                      <div className="text-2xl mb-1">{"\u23F0"}</div>
                      <div className="text-lg font-black text-white">2.5 hrs</div>
                      <div className="text-[10px] text-slate-400">This week</div>
                    </GlassCard>
                    <GlassCard padding="p-4" className="text-center">
                      <div className="text-2xl mb-1">{"\uD83D\uDCDA"}</div>
                      <div className="text-lg font-black text-white">12 topics</div>
                      <div className="text-[10px] text-slate-400">Completed</div>
                    </GlassCard>
                  </div>
                </motion.div>

                {/* ── AI says — plain language ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <GlassCard className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white">{"\uD83E\uDD16"} This Week&apos;s Summary</h3>
                      <button onClick={() => setSharePreview(true)} className="text-[10px] px-2.5 py-1 rounded-lg bg-green-600/10 text-green-400 hover:bg-green-600/20 transition-all font-semibold">
                        {"\uD83D\uDCF1"} Share on WhatsApp
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-sm">{"\uD83D\uDCAA"}</span>
                        <div>
                          <div className="text-xs font-bold text-emerald-400">Wins</div>
                          <p className="text-[11px] text-slate-300 mt-0.5">{aiReport.wins[0]}</p>
                        </div>
                      </div>
                      {aiReport.attention.length > 0 && (
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                          <span className="text-sm">{"\u26A0\uFE0F"}</span>
                          <div>
                            <div className="text-xs font-bold text-amber-300">Needs attention</div>
                            <p className="text-[11px] text-slate-300 mt-0.5">{aiReport.attention[0]}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <span className="text-sm">{"\uD83D\uDCA1"}</span>
                        <div>
                          <div className="text-xs font-bold text-purple-300">What you can do</div>
                          <p className="text-[11px] text-slate-300 mt-0.5">{aiReport.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </>
            )}

            {/* ════════════════════════════════════════
               STUDIO / BOARD / PRO (C6+) — Radar chart + focused insights
               ════════════════════════════════════════ */}
            {(tier === "studio" || tier === "board" || tier === "pro") && (
              <>
                {/* ── Status + Radar side-by-side ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {/* Left: Status card */}
                    <div className="col-span-2">
                      <GlassCard className={`h-full flex flex-col items-center justify-center text-center py-6 ${
                        aiReport.summaryScore.pct >= 75 ? "border-teal/20" : aiReport.summaryScore.pct >= 50 ? "border-amber-400/20" : "border-rose-400/20"
                      }`}>
                        <div className="text-5xl mb-3">
                          {aiReport.summaryScore.pct >= 75 ? "\u2705" : aiReport.summaryScore.pct >= 50 ? "\uD83D\uDFE1" : "\uD83D\uDD34"}
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{aiReport.summaryScore.pct}%</div>
                        <div className="text-sm text-slate-300 mb-2">
                          {aiReport.summaryScore.pct >= 75 ? `${student.name} is on track` : aiReport.summaryScore.pct >= 50 ? `${student.name} needs focus` : `${student.name} needs help`}
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          aiReport.summaryScore.trend === "up" ? "bg-teal/10 text-teal" : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {aiReport.summaryScore.arrow} {aiReport.summaryScore.trend === "up" ? "Improving" : "Declining"} this week
                        </span>
                        {(tier === "board" || tier === "pro") && (
                          <div className="mt-3 glass-sm px-3 py-1.5 text-[10px] text-slate-400">
                            {tier === "pro" ? "\uD83C\uDFAF JEE in 120 days" : "\uD83C\uDFAF Board exam in 87 days"}
                          </div>
                        )}
                      </GlassCard>
                    </div>

                    {/* Right: SVG Radar Chart */}
                    <div className="col-span-3">
                      <GlassCard className="h-full">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Subject Snapshot</h3>
                        <div className="flex justify-center">
                          <svg viewBox="0 0 300 260" className="w-full max-w-[340px]">
                            {/* Radar grid rings */}
                            {[20, 40, 60, 80, 100].map((ring) => (
                              <polygon key={ring} points={SUBJECTS_6PLUS.map((_, i) => {
                                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                                const r = (ring / 100) * 100;
                                return `${150 + r * Math.cos(angle)},${130 + r * Math.sin(angle)}`;
                              }).join(" ")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            ))}
                            {/* Axis lines */}
                            {SUBJECTS_6PLUS.map((_, i) => {
                              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                              return <line key={i} x1="150" y1="130" x2={150 + 100 * Math.cos(angle)} y2={130 + 100 * Math.sin(angle)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
                            })}
                            {/* Target shape (dashed) — for Board/Pro, this is the cutoff */}
                            {(tier === "board" || tier === "pro") && (
                              <polygon points={SUBJECTS_6PLUS.map((_, i) => {
                                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                                const r = 70; // 70% cutoff target
                                return `${150 + r * Math.cos(angle)},${130 + r * Math.sin(angle)}`;
                              }).join(" ")} fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
                            )}
                            {/* Actual performance shape */}
                            <polygon points={SUBJECTS_6PLUS.map((subj, i) => {
                              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                              const score = ACCURACY_TRENDS[subj]?.[4] ?? 70;
                              const r = score;
                              return `${150 + r * Math.cos(angle)},${130 + r * Math.sin(angle)}`;
                            }).join(" ")} fill="rgba(45,212,191,0.12)" stroke="rgba(45,212,191,0.7)" strokeWidth="2" />
                            {/* Data dots + labels */}
                            {SUBJECTS_6PLUS.map((subj, i) => {
                              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                              const score = ACCURACY_TRENDS[subj]?.[4] ?? 70;
                              const lx = 150 + 118 * Math.cos(angle);
                              const ly = 130 + 118 * Math.sin(angle);
                              const dx = 150 + score * Math.cos(angle);
                              const dy = 130 + score * Math.sin(angle);
                              const color = score >= 80 ? "#2dd4bf" : score >= 60 ? "#fbbf24" : "#f87171";
                              return (
                                <g key={subj}>
                                  <circle cx={dx} cy={dy} r="4" fill={color} />
                                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold" fill="rgba(255,255,255,0.7)" fontSize="10">{subj.slice(0, 4)}</text>
                                  <text x={dx} y={dy - 10} textAnchor="middle" className="text-[9px] font-bold" fill={color} fontSize="9">{score}%</text>
                                </g>
                              );
                            })}
                            {/* Legend */}
                            <circle cx="30" cy="248" r="4" fill="rgba(45,212,191,0.7)" />
                            <text x="40" y="252" fill="rgba(255,255,255,0.4)" fontSize="9">Current</text>
                            {(tier === "board" || tier === "pro") && (
                              <>
                                <line x1="95" y1="248" x2="115" y2="248" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
                                <text x="122" y="252" fill="rgba(255,255,255,0.4)" fontSize="9">Target (70%)</text>
                              </>
                            )}
                          </svg>
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </motion.div>

                {/* ── Alert cards — only the important stuff ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* Needs Attention */}
                    <div className="glass-sm p-4 border border-amber-500/15">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{"\u26A0\uFE0F"}</span>
                        <h3 className="text-sm font-bold text-amber-300">Needs Attention</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {aiReport.attention.map((a, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-amber-400 mt-0.5">{"\u2022"}</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Revision status */}
                    <div className="glass-sm p-4 border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{"\uD83D\uDD04"}</span>
                        <h3 className="text-sm font-bold text-white">Revision</h3>
                      </div>
                      <div className="h-3 rounded-full bg-white/5 mb-3">
                        <div className={`h-full rounded-full transition-all ${
                          aiReport.revisionHealth.status >= 70 ? "bg-teal" : aiReport.revisionHealth.status >= 40 ? "bg-amber-400" : "bg-rose-400"
                        }`} style={{ width: `${aiReport.revisionHealth.status}%` }} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-black text-amber-300">{aiReport.revisionHealth.due}</div>
                          <div className="text-[10px] text-slate-500">Due</div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-rose-400">{aiReport.revisionHealth.overdue}</div>
                          <div className="text-[10px] text-slate-500">Overdue</div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-teal">{aiReport.revisionHealth.mastered}</div>
                          <div className="text-[10px] text-slate-500">Mastered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Weekly study consistency — simple 7-day heatmap ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <GlassCard className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Study Consistency This Week</h3>
                    <div className="flex items-center justify-between gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                        const studied = [true, true, true, true, true, true, false][i];
                        const mins = [45, 55, 80, 60, 72, 65, 0][i];
                        return (
                          <div key={day} className="flex-1 text-center">
                            <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-lg mb-1 ${
                              studied ? "bg-teal/15 border border-teal/20" : "bg-white/[0.03] border border-white/[0.04]"
                            }`}>
                              {studied ? "\u2705" : "\u2796"}
                            </div>
                            <div className="text-[10px] text-slate-500">{day}</div>
                            {studied && <div className="text-[9px] text-teal">{mins}m</div>}
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </motion.div>

                {/* ── AI says + WhatsApp ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <GlassCard className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white">{"\uD83D\uDCA1"} What You Can Do This Week</h3>
                      <button onClick={() => setSharePreview(true)} className="text-[10px] px-2.5 py-1 rounded-lg bg-green-600/10 text-green-400 hover:bg-green-600/20 transition-all font-semibold">
                        {"\uD83D\uDCF1"} Share on WhatsApp
                      </button>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{aiReport.suggestion}</p>
                  </GlassCard>
                </motion.div>

                {/* ── Detailed analytics toggle ── */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                  <button
                    onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
                    className="w-full glass-sm p-3 text-center text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all mb-4"
                  >
                    {showDetailedAnalytics ? "\u25B2 Hide detailed analytics" : "\u25BC Show detailed analytics (heatmaps, trends, patterns)"}
                  </button>
                </motion.div>

                {/* ── Detailed analytics (hidden by default) ── */}
                <AnimatePresence>
                  {showDetailedAnalytics && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                      {/* All Insight Cards — compact grid */}
                      <GlassCard>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{"\uD83D\uDCCA"} All Insights</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {[...DEMO_PARENT_CARDS, ...EXTENDED_CARDS].filter(c => c.tiers.includes(tier)).map((card) => (
                            <div key={card.id} className="glass-sm p-2.5 text-center rounded-xl">
                              <div className="text-lg mb-0.5">{card.emoji}</div>
                              <div className="text-sm font-bold text-white">{card.value}</div>
                              <div className="text-[8px] text-slate-500">{card.title}</div>
                              <span className={`text-[8px] ${card.trend === "up" ? "text-teal" : card.trend === "down" ? "text-rose-400" : "text-slate-600"}`}>
                                {card.trend === "up" ? "\u2191" : card.trend === "down" ? "\u2193" : "\u2192"} {card.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </GlassCard>

                      {/* Accuracy Trend */}
                      <GlassCard>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{"\uD83D\uDCC8"} Accuracy Trend — Last 5 Weeks</h3>
                        <div className="space-y-3">
                          {SUBJECTS_6PLUS.map((subj) => {
                            const trend = ACCURACY_TRENDS[subj];
                            const latest = trend[trend.length - 1];
                            const delta = latest - trend[trend.length - 2];
                            return (
                              <div key={subj} className="flex items-center gap-4">
                                <div className="w-20 text-xs font-medium text-slate-300 truncate">{subj}</div>
                                <div className="flex-1 flex items-end gap-1 h-6">
                                  {trend.map((val, wi) => (
                                    <div key={wi} className="flex-1">
                                      <div className="w-full rounded-sm" style={{
                                        height: `${(val / 100) * 24}px`,
                                        backgroundColor: wi === trend.length - 1
                                          ? val >= 80 ? "rgba(45,212,191,0.6)" : val >= 60 ? "rgba(251,191,36,0.5)" : "rgba(248,113,113,0.5)"
                                          : "rgba(255,255,255,0.08)",
                                      }} />
                                    </div>
                                  ))}
                                </div>
                                <span className={`text-sm font-bold w-10 text-right ${latest >= 80 ? "text-teal" : latest >= 60 ? "text-amber-400" : "text-rose-400"}`}>{latest}%</span>
                                <span className={`text-[10px] font-bold w-8 text-right ${delta > 0 ? "text-emerald-400" : delta < 0 ? "text-rose-400" : "text-slate-500"}`}>{delta > 0 ? `+${delta}` : delta}</span>
                              </div>
                            );
                          })}
                        </div>
                      </GlassCard>

                      {/* Confidence Matrix + Mistake Patterns side-by-side */}
                      <div className="grid grid-cols-2 gap-4">
                        <GlassCard>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{"\uD83C\uDFAF"} Confidence Matrix</h3>
                          <p className="text-[10px] text-slate-500 mb-2">Sure + Wrong = dangerous misconception</p>
                          <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
                            <div className="bg-navy p-2" />
                            <div className="bg-navy p-2 text-center text-[10px] font-bold text-emerald-400">{"\u2705"} Right</div>
                            <div className="bg-navy p-2 text-center text-[10px] font-bold text-rose-400">{"\u274C"} Wrong</div>
                            <div className="bg-navy p-2 text-center text-[10px] font-bold text-indigo-300">Sure</div>
                            <div className="bg-emerald-500/10 p-2 text-center"><div className="text-lg font-black text-emerald-400">{CONFIDENCE_MATRIX.sureRight}</div></div>
                            <div className="bg-red-500/15 p-2 text-center"><div className="text-lg font-black text-red-400">{CONFIDENCE_MATRIX.sureWrong}</div><div className="text-[8px] text-red-400 font-bold">P0!</div></div>
                            <div className="bg-navy p-2 text-center text-[10px] font-bold text-amber-300">Not Sure</div>
                            <div className="bg-teal/10 p-2 text-center"><div className="text-lg font-black text-teal">{CONFIDENCE_MATRIX.notSureRight}</div></div>
                            <div className="bg-amber-500/10 p-2 text-center"><div className="text-lg font-black text-amber-400">{CONFIDENCE_MATRIX.notSureWrong}</div></div>
                            <div className="bg-navy p-2 text-center text-[10px] font-bold text-slate-400">Guess</div>
                            <div className="bg-white/[0.03] p-2 text-center"><div className="text-lg font-black text-slate-300">{CONFIDENCE_MATRIX.guessRight}</div></div>
                            <div className="bg-white/[0.03] p-2 text-center"><div className="text-lg font-black text-slate-400">{CONFIDENCE_MATRIX.guessWrong}</div></div>
                          </div>
                        </GlassCard>
                        <GlassCard>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{"\uD83E\uDDEC"} Mistake Patterns</h3>
                          <div className="space-y-2">
                            {MISTAKE_PATTERNS.slice(0, 4).map((mp) => (
                              <div key={mp.pattern} className={`flex items-center gap-2 p-2 rounded-lg border ${
                                mp.severity === "P0" ? "bg-red-500/5 border-red-500/15" : mp.severity === "P1" ? "bg-amber-500/5 border-amber-500/15" : "bg-white/[0.02] border-white/[0.05]"
                              }`}>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ${
                                  mp.severity === "P0" ? "bg-red-500/20 text-red-400" : mp.severity === "P1" ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-slate-400"
                                }`}>{mp.severity}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[11px] font-medium text-slate-200 truncate">{mp.pattern}</div>
                                  <div className="text-[9px] text-slate-500">{mp.subject}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </GlassCard>
                      </div>

                      {/* Exam Readiness — Board/Pro only */}
                      {(tier === "board" || tier === "pro") && (
                        <GlassCard>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{"\uD83C\uDFAF"} Exam Readiness</h3>
                          <div className="grid grid-cols-6 gap-3">
                            {[
                              { subject: "Maths", readiness: 68 }, { subject: "Science", readiness: 55 },
                              { subject: "English", readiness: 82 }, { subject: "SST", readiness: 72 },
                              { subject: "Hindi", readiness: 75 }, { subject: "Overall", readiness: tier === "pro" ? 81 : 73 },
                            ].map((s) => (
                              <div key={s.subject} className={`text-center p-3 rounded-xl ${s.subject === "Overall" ? "bg-indigo/10 border border-indigo/20" : "bg-white/[0.03]"}`}>
                                <div className="text-[10px] font-bold text-slate-400 mb-1">{s.subject}</div>
                                <div className={`text-xl font-black ${s.readiness >= 80 ? "text-emerald-400" : s.readiness >= 60 ? "text-amber-400" : "text-rose-400"}`}>{s.readiness}%</div>
                              </div>
                            ))}
                          </div>
                        </GlassCard>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* ── Data boundary note ── */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="glass-sm p-3 border-amber-500/10 mt-4">
                <div className="flex items-center gap-2">
                  <span>{"\uD83D\uDD12"}</span>
                  <div>
                    <span className="text-[10px] font-bold text-amber-300">Data Boundaries: </span>
                    <span className="text-[10px] text-slate-500">Observe, never control. No class comparisons — EVER. 2nd parent via OTP.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: BRAIN PROFILE
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "brain" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{"\uD83E\uDDE0"} Brain Profile — 9 Domains</h2>
            <GlassCard>
              <div className="grid grid-cols-3 gap-4">
                {spark.domains.map((domain, i) => (
                  <div key={domain.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                    <GaugeRing value={domain.score} max={domain.maxScore} size={56} color={["#6366f1","#2dd4bf","#f472b6","#fbbf24","#8b5cf6","#fb923c","#10b981","#f43f5e","#06b6d4"][i]} strokeWidth={4}>
                      <span className="text-lg">{domain.emoji}</span>
                    </GaugeRing>
                    <div>
                      <div className="text-sm font-bold text-white">{domain.name}</div>
                      <div className="text-xs text-slate-500">{domain.score}/{domain.maxScore}</div>
                      <Tag label={domain.level} color={domain.level === "Exceptional" ? "green" : domain.level === "Advanced" ? "teal" : domain.level === "Proficient" ? "indigo" : "amber"} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Overall Assessment */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <GlassCard>
                <div className="text-center">
                  <div className="text-2xl mb-2">{"\uD83C\uDFAF"}</div>
                  <div className="text-lg font-black text-white">{spark.overallLevel}</div>
                  <div className="text-[10px] text-slate-400">Overall Level</div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="text-center">
                  <div className="text-2xl mb-2">{"\uD83D\uDCCB"}</div>
                  <div className="text-lg font-black text-white">{spark.questionsAnswered}</div>
                  <div className="text-[10px] text-slate-400">Questions Answered</div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="text-center">
                  <div className="text-2xl mb-2">{"\uD83D\uDCC5"}</div>
                  <div className="text-lg font-black text-white">{spark.testDate}</div>
                  <div className="text-[10px] text-slate-400">Last Test Date</div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: NOTIFICATIONS (8 types with proper styling)
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "notifications" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="glass p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{"\uD83D\uDD14"}</span>
                  <h3 className="text-sm font-bold text-slate-200">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal/20 text-teal font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>

              {/* Type filter pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <button
                  onClick={() => setNotifFilter("all")}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    notifFilter === "all" ? "bg-teal/20 text-teal" : "bg-white/5 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  All
                </button>
                {Object.entries(NOTIFICATION_TYPE_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setNotifFilter(notifFilter === key ? "all" : key)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all flex items-center gap-1 ${
                      notifFilter === key ? style.badgeColor : "bg-white/5 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{style.emoji}</span> {style.label}
                  </button>
                ))}
              </div>

              {/* Notification items */}
              <div className="space-y-2">
                {displayedNotifs.map((n, i) => {
                  const style = NOTIFICATION_TYPE_STYLES[n.type];
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-colors border-l-4 ${style.borderColor} ${
                        !n.read ? "bg-white/[0.04]" : "bg-white/[0.02]"
                      }`}
                    >
                      <span className="text-lg mt-0.5">{style.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${style.badgeColor}`}>
                            {style.label}
                          </span>
                          <span className="text-[9px] text-slate-600">{n.childName}</span>
                          <span className="text-[9px] text-slate-600">· {n.time}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${!n.read ? "text-slate-200" : "text-slate-400"}`}>
                          {n.text}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-teal mt-2 shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>

              {filteredNotifs.length > 6 && (
                <button
                  onClick={() => setShowAllNotifs(!showAllNotifs)}
                  className="text-xs text-teal hover:text-teal-light transition-colors mt-3"
                >
                  {showAllNotifs ? "Show less" : `Show all ${filteredNotifs.length} notifications`}
                </button>
              )}

              {/* P0 Alert always-on note */}
              <div className="mt-4 glass-sm p-3 border border-red-500/10">
                <div className="flex items-center gap-2">
                  <span>{"\uD83D\uDED1"}</span>
                  <div>
                    <span className="text-[10px] font-bold text-red-400">P0 Alerts are always on: </span>
                    <span className="text-[10px] text-slate-500">
                      When a child answers Sure + Wrong, it indicates a dangerous misconception. These alerts cannot be disabled.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: REVISION (tier-adapted views)
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "revision" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {"\uD83D\uDD04"} Revision Status — {student.name}
            </h2>

            {/* ── C1-2: Garden Metaphor ── */}
            {tier === "storybook" && (
              <GlassCard>
                <h3 className="text-sm font-bold text-amber-300 mb-4">{"\uD83C\uDF3B"} {student.name}&apos;s Learning Garden</h3>
                <div className="grid grid-cols-5 gap-4">
                  {GARDEN_REVISION.map((plant) => (
                    <div key={plant.name} className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 ${
                        plant.status === "bloomed" ? "bg-emerald-500/15 border border-emerald-500/20" :
                        plant.status === "wilted" ? "bg-red-500/15 border border-red-500/20 animate-pulse" :
                        "bg-amber-500/15 border border-amber-500/20"
                      }`}>
                        {plant.emoji}
                      </div>
                      <div className="text-xs font-bold text-white">{plant.name}</div>
                      <div className={`text-[10px] ${
                        plant.status === "bloomed" ? "text-emerald-400" :
                        plant.status === "wilted" ? "text-red-400" : "text-amber-400"
                      }`}>
                        {plant.status === "bloomed" ? "Bloomed!" : plant.status === "wilted" ? "Needs water!" : "Growing..."}
                      </div>
                      <div className="text-[9px] text-slate-600">{plant.stage}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-4 text-center">
                  Water wilted flowers by practicing! Bloomed flowers are mastered forever.
                </p>
              </GlassCard>
            )}

            {/* ── C3-5: Expandable Topic List ── */}
            {tier === "explorer" && (
              <GlassCard>
                <h3 className="text-sm font-bold text-amber-300 mb-4">{"\uD83D\uDCDA"} Topic Revision List</h3>
                <div className="space-y-2">
                  {TOPIC_REVISION.map((topic) => {
                    const labelColors: Record<string, string> = {
                      Weak: "bg-red-500/15 text-red-400",
                      Growing: "bg-amber-500/15 text-amber-400",
                      Strong: "bg-teal/15 text-teal",
                      Mastered: "bg-emerald-500/15 text-emerald-400",
                    };
                    return (
                      <div key={topic.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-center">
                            <div className="text-sm font-bold text-white">R{topic.stage}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-200">{topic.name}</div>
                            <div className="text-[10px] text-slate-500">{topic.subject}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${labelColors[topic.label] || "bg-white/10 text-slate-400"}`}>
                          {topic.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {/* ── C6-8: Subject > Chapter > Topic table with R-stage ── */}
            {tier === "studio" && (
              <GlassCard>
                <h3 className="text-sm font-bold text-indigo-light mb-4">{"\uD83D\uDCCB"} Revision Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-slate-500 font-semibold">Subject</th>
                        <th className="text-left py-2 px-3 text-slate-500 font-semibold">Chapter</th>
                        <th className="text-left py-2 px-3 text-slate-500 font-semibold">Topic</th>
                        <th className="text-center py-2 px-3 text-slate-500 font-semibold">R-Stage</th>
                        <th className="text-center py-2 px-3 text-slate-500 font-semibold">Score</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-semibold">Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_REVISION.map((row, i) => (
                        <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 text-slate-300">{row.subject}</td>
                          <td className="py-2.5 px-3 text-slate-400">{row.chapter}</td>
                          <td className="py-2.5 px-3 text-white font-medium">{row.topic}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold ${
                              row.r >= 8 ? "bg-emerald-500/20 text-emerald-400" :
                              row.r >= 5 ? "bg-teal/20 text-teal" :
                              row.r >= 3 ? "bg-amber-500/20 text-amber-400" :
                              "bg-red-500/20 text-red-400"
                            }`}>
                              R{row.r}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`font-bold ${
                              row.score >= 90 ? "text-emerald-400" :
                              row.score >= 70 ? "text-teal" :
                              row.score >= 50 ? "text-amber-400" :
                              "text-red-400"
                            }`}>
                              {row.score}%
                            </span>
                          </td>
                          <td className={`py-2.5 px-3 text-right ${row.due === "Today" ? "text-rose-400 font-bold" : "text-slate-500"}`}>
                            {row.due}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* ── C9-12: Full table + heat map + exam readiness + Export PDF ── */}
            {(tier === "board" || tier === "pro") && (
              <>
                <GlassCard className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-rose-300">{"\uD83D\uDCCB"} Full Revision Table</h3>
                    <div className="flex items-center gap-3">
                      {tier === "board" && (
                        <span className="text-xs font-bold text-teal px-3 py-1 rounded-full bg-teal/15">
                          {"\uD83C\uDFAF"} Exam readiness: 73%
                        </span>
                      )}
                      {tier === "pro" && (
                        <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/15">
                          {"\uD83C\uDFAF"} Exam readiness: 81%
                        </span>
                      )}
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-semibold">
                        {"\uD83D\uDCC4"} Export PDF
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-slate-500 font-semibold">Subject</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-semibold">Chapter</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-semibold">Topic</th>
                          <th className="text-center py-2 px-3 text-slate-500 font-semibold">R-Stage</th>
                          <th className="text-center py-2 px-3 text-slate-500 font-semibold">Score</th>
                          <th className="text-right py-2 px-3 text-slate-500 font-semibold">Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...TABLE_REVISION, ...DEMO_REVISION.slice(0, 4).map(r => ({
                          subject: r.subject,
                          chapter: `Ch: ${r.name}`,
                          topic: r.name,
                          r: r.currentRound,
                          score: r.lastScore,
                          due: r.nextDue,
                        }))].map((row, i) => (
                          <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                            <td className="py-2.5 px-3 text-slate-300">{row.subject}</td>
                            <td className="py-2.5 px-3 text-slate-400">{row.chapter}</td>
                            <td className="py-2.5 px-3 text-white font-medium">{row.topic}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold ${
                                row.r >= 8 ? "bg-emerald-500/20 text-emerald-400" :
                                row.r >= 5 ? "bg-teal/20 text-teal" :
                                row.r >= 3 ? "bg-amber-500/20 text-amber-400" :
                                "bg-red-500/20 text-red-400"
                              }`}>
                                R{row.r}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`font-bold ${
                                row.score >= 90 ? "text-emerald-400" :
                                row.score >= 70 ? "text-teal" :
                                row.score >= 50 ? "text-amber-400" :
                                "text-red-400"
                              }`}>
                                {row.score}%
                              </span>
                            </td>
                            <td className={`py-2.5 px-3 text-right ${row.due === "Today" ? "text-rose-400 font-bold" : "text-slate-500"}`}>
                              {row.due}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>

                {/* Heat Map visualization */}
                <GlassCard>
                  <h3 className="text-sm font-bold text-slate-300 mb-3">{"\uD83D\uDDFA\uFE0F"} Revision Heat Map</h3>
                  <p className="text-[10px] text-slate-500 mb-3">Topic urgency by subject — darker = more urgent</p>
                  <div className="grid grid-cols-6 gap-2">
                    {["Mathematics", "Science", "English", "SST", "Hindi", "Life Skills"].map((subj) => (
                      <div key={subj} className="text-center">
                        <div className="text-[10px] font-bold text-slate-400 mb-1.5 truncate">{subj}</div>
                        {[1, 2, 3, 4].map((row) => {
                          const heat = Math.random();
                          return (
                            <div
                              key={row}
                              className="h-5 rounded mb-0.5 transition-all"
                              style={{
                                backgroundColor: heat > 0.7
                                  ? "rgba(248, 113, 113, 0.3)"
                                  : heat > 0.4
                                    ? "rgba(251, 191, 36, 0.2)"
                                    : "rgba(45, 212, 191, 0.15)",
                              }}
                              title={`${subj} topic ${row}: urgency ${Math.round(heat * 100)}%`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(45, 212, 191, 0.15)" }} />
                      <span className="text-[9px] text-slate-500">Low urgency</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(251, 191, 36, 0.2)" }} />
                      <span className="text-[9px] text-slate-500">Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(248, 113, 113, 0.3)" }} />
                      <span className="text-[9px] text-slate-500">High urgency</span>
                    </div>
                  </div>
                </GlassCard>
              </>
            )}

            {/* Data boundary note in revision tab too */}
            <div className="glass-sm p-3 border-amber-500/10 mt-4">
              <div className="flex items-center gap-2">
                <span>{"\uD83D\uDD12"}</span>
                <div>
                  <span className="text-[10px] font-bold text-amber-300">Data Boundaries: </span>
                  <span className="text-[10px] text-slate-500">Observe, never control. No class comparisons — EVER. 2nd parent via OTP.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: GARDEN (C1-5 only — Storybook/Explorer parents)
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "garden" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {"\uD83C\uDF31"} {student.name}&apos;s Learning Garden
            </h2>
            <GlassCard className="mb-4">
              <p className="text-xs text-slate-400 mb-4">
                Each subject is a plant that grows as {student.name} learns. Blooming plants mean mastery!
              </p>
              <div className="grid grid-cols-3 gap-4">
                {PARENT_GARDEN.map((g) => {
                  const stageInfo = STAGE_LABELS[g.stage];
                  return (
                    <div key={g.subject} className="glass-sm p-4 text-center">
                      <div className="text-3xl mb-2">{g.emoji}</div>
                      <div className="text-sm font-bold text-white">{g.subject}</div>
                      <div className="text-[10px] text-slate-500 mb-2">{g.plant}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <span>{stageInfo.emoji}</span>
                        <span className={`text-[10px] font-bold ${stageInfo.color}`}>{stageInfo.label}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 mb-1">
                        <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${(g.topics / g.total) * 100}%` }} />
                      </div>
                      <div className="text-[9px] text-slate-500">{g.topics}/{g.total} topics</div>
                      {g.streak > 0 && (
                        <div className="text-[9px] text-amber-400 mt-1">{"\uD83D\uDD25"} {g.streak} day streak</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
            <GlassCard className="border-amber-500/10">
              <h3 className="text-sm font-bold text-amber-300 mb-2">{"\uD83D\uDCA1"} Garden Tips for Parents</h3>
              <ul className="space-y-1.5">
                <li className="text-[10px] text-slate-300 flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">{"\u2022"}</span>Plants grow when {student.name} practices — 10 minutes a day is enough</li>
                <li className="text-[10px] text-slate-300 flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">{"\u2022"}</span>Wilting means a subject needs watering (practice) — no need to worry!</li>
                <li className="text-[10px] text-slate-300 flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">{"\u2022"}</span>Ask {student.name} to show you their garden — they love showing off blooming plants</li>
                <li className="text-[10px] text-slate-300 flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">{"\u2022"}</span>No competition — each garden is private and unique to your child</li>
              </ul>
            </GlassCard>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: MOMENTUM (C6+ only — Studio/Board/Pro parents)
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "momentum" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {"\u26A1"} {student.name}&apos;s Momentum
            </h2>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <GlassCard className="text-center">
                <div className="text-2xl font-black text-teal">{PARENT_MOMENTUM.speed}</div>
                <div className="text-[10px] text-slate-400">Speed / 100</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-black text-amber-400">{PARENT_MOMENTUM.streak}</div>
                <div className="text-[10px] text-slate-400">Day Streak</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-black text-indigo-300">{PARENT_MOMENTUM.xpMultiplier}</div>
                <div className="text-[10px] text-slate-400">XP Multiplier</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-black text-emerald-400">{PARENT_MOMENTUM.xpThisWeek}</div>
                <div className="text-[10px] text-slate-400">XP This Week</div>
              </GlassCard>
            </div>

            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold text-slate-300 mb-3">{"\uD83D\uDCC8"} Daily XP This Week</h3>
              <div className="flex items-end gap-2 h-24">
                {PARENT_MOMENTUM.dailyXP.map((xp, i) => {
                  const maxXP = Math.max(...PARENT_MOMENTUM.dailyXP);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[9px] font-bold text-slate-400">{xp}</div>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo/50 to-teal/50 transition-all"
                        style={{ height: `${(xp / maxXP) * 80}px` }}
                      />
                      <div className="text-[9px] text-slate-500">{PARENT_MOMENTUM.dayLabels[i]}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-[10px] text-slate-500">
                  Last week: {PARENT_MOMENTUM.xpLastWeek} XP
                </div>
                <div className={`text-[10px] font-bold ${PARENT_MOMENTUM.xpThisWeek > PARENT_MOMENTUM.xpLastWeek ? "text-emerald-400" : "text-rose-400"}`}>
                  {PARENT_MOMENTUM.xpThisWeek > PARENT_MOMENTUM.xpLastWeek ? "\u2191" : "\u2193"} {Math.abs(PARENT_MOMENTUM.xpThisWeek - PARENT_MOMENTUM.xpLastWeek)} XP vs last week
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-teal/10">
              <h3 className="text-sm font-bold text-teal mb-2">{"\uD83D\uDCA1"} What is Momentum?</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                Momentum tracks {student.name}&apos;s learning consistency. Speed increases with daily practice and never fully resets — we believe in &quot;dip, not drop.&quot; Even after a break, past effort is preserved.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="glass-sm p-2 text-center">
                  <div className="text-sm font-bold text-amber-400">{PARENT_MOMENTUM.longestStreak}</div>
                  <div className="text-[9px] text-slate-500">Longest Streak</div>
                </div>
                <div className="glass-sm p-2 text-center">
                  <div className="text-sm font-bold text-teal">{PARENT_MOMENTUM.xpZone}</div>
                  <div className="text-[9px] text-slate-500">Current Zone</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: GROERX CAREER (C6+ only)
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "groerx" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {"\uD83D\uDE80"} {student.name}&apos;s Career Intelligence
            </h2>

            <GlassCard className="mb-4 border-teal/10">
              <p className="text-xs text-slate-400 leading-relaxed">{PARENT_GROERX_SUMMARY.advice}</p>
            </GlassCard>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <GlassCard>
                <h3 className="text-sm font-bold text-slate-300 mb-3">{"\uD83C\uDFAF"} Top Interests</h3>
                <div className="space-y-2">
                  {PARENT_GROERX_SUMMARY.topInterests.map((interest, i) => (
                    <div key={interest} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal/20 text-teal text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-xs text-slate-300">{interest}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <h3 className="text-sm font-bold text-slate-300 mb-3">{"\uD83D\uDCCA"} Stream Match</h3>
                <div className="text-center">
                  <GaugeRing value={PARENT_GROERX_SUMMARY.topStream.match} size={80} color="#2dd4bf" strokeWidth={6}>
                    <span className="text-lg font-black text-teal">{PARENT_GROERX_SUMMARY.topStream.match}%</span>
                  </GaugeRing>
                  <div className="text-sm font-bold text-white mt-2">{PARENT_GROERX_SUMMARY.topStream.name}</div>
                  <div className="text-[10px] text-slate-500">Best stream match</div>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="mb-4">
              <h3 className="text-sm font-bold text-slate-300 mb-3">{"\uD83D\uDCBB"} Top Career Matches</h3>
              <div className="space-y-2">
                {PARENT_GROERX_SUMMARY.topCareers.map((career) => (
                  <div key={career.title} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                    <span className="text-2xl">{career.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{career.title}</div>
                      <div className="text-[10px] text-slate-500">Based on SPARK + academic performance</div>
                    </div>
                    <Tag label={`${career.match}%`} color={career.match >= 90 ? "green" : career.match >= 80 ? "teal" : "amber"} />
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="glass-sm p-3 border-amber-500/10">
              <div className="flex items-center gap-2">
                <span>{"\uD83D\uDD12"}</span>
                <div>
                  <span className="text-[10px] font-bold text-amber-300">Guidance note: </span>
                  <span className="text-[10px] text-slate-500">
                    Career data is for guidance only. Never pressure stream choice. Visit /groerx for the full interactive career dashboard.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           TAB: SETTINGS
           ═══════════════════════════════════════════════════════════ */}
        {activeTab === "settings" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <ParentSettings />
          </motion.div>
        )}
      </div>
    </div>
  );
}
