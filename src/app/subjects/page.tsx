"use client";
import { useState, useRef, useEffect } from "react";
import { useTier } from "@/context/TierContext";
import { TierKey } from "@/lib/types";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import GlassCard from "@/components/ui/GlassCard";
import GaugeRing from "@/components/ui/GaugeRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   STATIC DEMO DATA — Topics, Chapters, Subjects
   ═══════════════════════════════════════════════════════════════════ */

interface Topic {
  id: string;
  name: string;
  progress: number;        // 0-100
  rStage: number;          // Revision round 0-5
  prerequisites: string[]; // topic IDs this depends on
}

interface Chapter {
  id: string;
  name: string;
  progress: number;
  topics: Topic[];
}

interface SubjectData {
  id: string;
  name: string;
  emoji: string;
  storybookEmoji: string;   // simplified picture for young learners
  explorerEmoji: string;    // adventure-themed
  color: string;
  accentHex: string;
  syllabusCoverage: number; // Feature 10: % of syllabus covered
  chapters: Chapter[];
}

const SUBJECTS: SubjectData[] = [
  {
    id: "math",
    name: "Mathematics",
    emoji: "📐",
    storybookEmoji: "🔢",
    explorerEmoji: "🗺️",
    color: "indigo",
    accentHex: "#6366f1",
    syllabusCoverage: 68,
    chapters: [
      {
        id: "math-c1",
        name: "Number Systems",
        progress: 85,
        topics: [
          { id: "m-t1", name: "Natural Numbers", progress: 100, rStage: 5, prerequisites: [] },
          { id: "m-t2", name: "Integers", progress: 90, rStage: 4, prerequisites: ["m-t1"] },
          { id: "m-t3", name: "Rational Numbers", progress: 65, rStage: 2, prerequisites: ["m-t2"] },
        ],
      },
      {
        id: "math-c2",
        name: "Algebra",
        progress: 55,
        topics: [
          { id: "m-t4", name: "Variables & Expressions", progress: 80, rStage: 3, prerequisites: ["m-t1"] },
          { id: "m-t5", name: "Linear Equations", progress: 50, rStage: 2, prerequisites: ["m-t4", "m-t2"] },
          { id: "m-t6", name: "Polynomials", progress: 35, rStage: 1, prerequisites: ["m-t5"] },
        ],
      },
      {
        id: "math-c3",
        name: "Geometry",
        progress: 40,
        topics: [
          { id: "m-t7", name: "Lines & Angles", progress: 70, rStage: 3, prerequisites: [] },
          { id: "m-t8", name: "Triangles", progress: 30, rStage: 1, prerequisites: ["m-t7"] },
          { id: "m-t9", name: "Circles", progress: 20, rStage: 0, prerequisites: ["m-t7", "m-t8"] },
        ],
      },
      {
        id: "math-c4",
        name: "Statistics",
        progress: 25,
        topics: [
          { id: "m-t10", name: "Mean, Median, Mode", progress: 45, rStage: 2, prerequisites: ["m-t1"] },
          { id: "m-t11", name: "Probability", progress: 10, rStage: 0, prerequisites: ["m-t10", "m-t3"] },
        ],
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    emoji: "🔬",
    storybookEmoji: "🌈",
    explorerEmoji: "🧪",
    color: "teal",
    accentHex: "#14b8a6",
    syllabusCoverage: 54,
    chapters: [
      {
        id: "sci-c1",
        name: "Matter & Materials",
        progress: 75,
        topics: [
          { id: "s-t1", name: "States of Matter", progress: 95, rStage: 4, prerequisites: [] },
          { id: "s-t2", name: "Mixtures & Solutions", progress: 70, rStage: 3, prerequisites: ["s-t1"] },
          { id: "s-t3", name: "Atoms & Molecules", progress: 60, rStage: 2, prerequisites: ["s-t2"] },
        ],
      },
      {
        id: "sci-c2",
        name: "Living World",
        progress: 60,
        topics: [
          { id: "s-t4", name: "Cell Structure", progress: 80, rStage: 3, prerequisites: [] },
          { id: "s-t5", name: "Plant Systems", progress: 55, rStage: 2, prerequisites: ["s-t4"] },
          { id: "s-t6", name: "Human Body", progress: 45, rStage: 1, prerequisites: ["s-t4"] },
        ],
      },
      {
        id: "sci-c3",
        name: "Energy & Forces",
        progress: 35,
        topics: [
          { id: "s-t7", name: "Force & Motion", progress: 50, rStage: 2, prerequisites: [] },
          { id: "s-t8", name: "Light & Sound", progress: 30, rStage: 1, prerequisites: ["s-t7"] },
        ],
      },
    ],
  },
  {
    id: "english",
    name: "English",
    emoji: "📝",
    storybookEmoji: "📖",
    explorerEmoji: "🏰",
    color: "purple",
    accentHex: "#a855f7",
    syllabusCoverage: 72,
    chapters: [
      {
        id: "eng-c1",
        name: "Grammar",
        progress: 80,
        topics: [
          { id: "e-t1", name: "Parts of Speech", progress: 95, rStage: 5, prerequisites: [] },
          { id: "e-t2", name: "Tenses", progress: 85, rStage: 4, prerequisites: ["e-t1"] },
          { id: "e-t3", name: "Sentence Structure", progress: 60, rStage: 2, prerequisites: ["e-t1", "e-t2"] },
        ],
      },
      {
        id: "eng-c2",
        name: "Reading Comprehension",
        progress: 70,
        topics: [
          { id: "e-t4", name: "Main Idea & Details", progress: 90, rStage: 4, prerequisites: ["e-t1"] },
          { id: "e-t5", name: "Inference & Analysis", progress: 50, rStage: 2, prerequisites: ["e-t4"] },
        ],
      },
      {
        id: "eng-c3",
        name: "Writing",
        progress: 45,
        topics: [
          { id: "e-t6", name: "Essay Structure", progress: 60, rStage: 2, prerequisites: ["e-t3"] },
          { id: "e-t7", name: "Creative Writing", progress: 30, rStage: 1, prerequisites: ["e-t6", "e-t5"] },
        ],
      },
    ],
  },
  {
    id: "sst",
    name: "Social Studies",
    emoji: "🌍",
    storybookEmoji: "🏡",
    explorerEmoji: "🧭",
    color: "amber",
    accentHex: "#f59e0b",
    syllabusCoverage: 48,
    chapters: [
      {
        id: "sst-c1",
        name: "History",
        progress: 60,
        topics: [
          { id: "ss-t1", name: "Ancient Civilizations", progress: 85, rStage: 4, prerequisites: [] },
          { id: "ss-t2", name: "Medieval India", progress: 55, rStage: 2, prerequisites: ["ss-t1"] },
          { id: "ss-t3", name: "Modern History", progress: 40, rStage: 1, prerequisites: ["ss-t2"] },
        ],
      },
      {
        id: "sst-c2",
        name: "Geography",
        progress: 50,
        topics: [
          { id: "ss-t4", name: "Maps & Globe", progress: 90, rStage: 4, prerequisites: [] },
          { id: "ss-t5", name: "Climate & Weather", progress: 40, rStage: 1, prerequisites: ["ss-t4"] },
        ],
      },
      {
        id: "sst-c3",
        name: "Civics",
        progress: 30,
        topics: [
          { id: "ss-t6", name: "Constitution Basics", progress: 50, rStage: 2, prerequisites: [] },
          { id: "ss-t7", name: "Government & Democracy", progress: 20, rStage: 0, prerequisites: ["ss-t6"] },
        ],
      },
    ],
  },
  {
    id: "hindi",
    name: "Hindi",
    emoji: "🕉️",
    storybookEmoji: "🎭",
    explorerEmoji: "📜",
    color: "rose",
    accentHex: "#fb7185",
    syllabusCoverage: 58,
    chapters: [
      {
        id: "hin-c1",
        name: "Vyakaran (Grammar)",
        progress: 70,
        topics: [
          { id: "h-t1", name: "Sangya & Sarvanam", progress: 85, rStage: 4, prerequisites: [] },
          { id: "h-t2", name: "Kriya & Visheshan", progress: 65, rStage: 3, prerequisites: ["h-t1"] },
          { id: "h-t3", name: "Vakya Rachna", progress: 55, rStage: 2, prerequisites: ["h-t1", "h-t2"] },
        ],
      },
      {
        id: "hin-c2",
        name: "Sahitya (Literature)",
        progress: 50,
        topics: [
          { id: "h-t4", name: "Gadya (Prose)", progress: 60, rStage: 2, prerequisites: ["h-t1"] },
          { id: "h-t5", name: "Kavita (Poetry)", progress: 40, rStage: 1, prerequisites: ["h-t1"] },
        ],
      },
      {
        id: "hin-c3",
        name: "Lekhan (Writing)",
        progress: 35,
        topics: [
          { id: "h-t6", name: "Patra Lekhan", progress: 50, rStage: 2, prerequisites: ["h-t3"] },
          { id: "h-t7", name: "Nibandh", progress: 20, rStage: 0, prerequisites: ["h-t6", "h-t4"] },
        ],
      },
    ],
  },
  {
    id: "life-skills",
    name: "Life Skills",
    emoji: "💛",
    storybookEmoji: "🤝",
    explorerEmoji: "🛡️",
    color: "green",
    accentHex: "#10b981",
    syllabusCoverage: 40,
    chapters: [
      {
        id: "ls-c1",
        name: "Emotional Intelligence",
        progress: 55,
        topics: [
          { id: "l-t1", name: "Identifying Emotions", progress: 80, rStage: 3, prerequisites: [] },
          { id: "l-t2", name: "Empathy & Kindness", progress: 50, rStage: 2, prerequisites: ["l-t1"] },
        ],
      },
      {
        id: "ls-c2",
        name: "Social Skills",
        progress: 40,
        topics: [
          { id: "l-t3", name: "Teamwork", progress: 60, rStage: 2, prerequisites: ["l-t2"] },
          { id: "l-t4", name: "Conflict Resolution", progress: 25, rStage: 1, prerequisites: ["l-t2", "l-t3"] },
        ],
      },
      {
        id: "ls-c3",
        name: "Decision Making",
        progress: 20,
        topics: [
          { id: "l-t5", name: "Critical Thinking", progress: 35, rStage: 1, prerequisites: ["l-t1"] },
          { id: "l-t6", name: "Ethical Choices", progress: 10, rStage: 0, prerequisites: ["l-t5", "l-t4"] },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   HELPER: Build a flat topic map for prerequisite lookups
   ═══════════════════════════════════════════════════════════════════ */
function buildTopicMap(subjects: SubjectData[]) {
  const map: Record<string, Topic & { subjectId: string; chapterId: string }> = {};
  for (const subj of subjects) {
    for (const ch of subj.chapters) {
      for (const t of ch.topics) {
        map[t.id] = { ...t, subjectId: subj.id, chapterId: ch.id };
      }
    }
  }
  return map;
}

const TOPIC_MAP = buildTopicMap(SUBJECTS);

/* ═══════════════════════════════════════════════════════════════════
   R-STAGE BADGE
   ═══════════════════════════════════════════════════════════════════ */
function rStageColor(r: number): "green" | "teal" | "indigo" | "amber" | "rose" | "white" {
  if (r >= 5) return "green";
  if (r >= 4) return "teal";
  if (r >= 3) return "indigo";
  if (r >= 2) return "amber";
  if (r >= 1) return "rose";
  return "white";
}

/* ═══════════════════════════════════════════════════════════════════
   TIER-ADAPTED ICON
   ═══════════════════════════════════════════════════════════════════ */
function subjectIcon(subject: SubjectData, tier: TierKey) {
  if (tier === "storybook") return subject.storybookEmoji;
  if (tier === "explorer") return subject.explorerEmoji;
  return subject.emoji;
}

/* ═══════════════════════════════════════════════════════════════════
   CONNECTIVITY MAP — SVG arrows between prerequisite topics
   Feature 9: Topic Connectivity Map
   ═══════════════════════════════════════════════════════════════════ */
function ConnectivityMap({ subject, isDark }: { subject: SubjectData; isDark: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Collect all topics for this subject
  const allTopics = subject.chapters.flatMap((ch) => ch.topics);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

    for (const topic of allTopics) {
      for (const preId of topic.prerequisites) {
        const fromEl = container.querySelector(`[data-topic-id="${preId}"]`);
        const toEl = container.querySelector(`[data-topic-id="${topic.id}"]`);
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          newLines.push({
            x1: fromRect.left - rect.left + fromRect.width / 2,
            y1: fromRect.top - rect.top + fromRect.height,
            x2: toRect.left - rect.left + toRect.width / 2,
            y2: toRect.top - rect.top,
          });
        }
      }
    }
    setLines(newLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.id]);

  return (
    <div ref={containerRef} className="relative">
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ overflow: "visible" }}
      >
        <defs>
          <marker
            id={`arrow-${subject.id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isDark ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.4)"} />
          </marker>
        </defs>
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={isDark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.25)"}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            markerEnd={`url(#arrow-${subject.id})`}
          />
        ))}
      </svg>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allTopics.map((topic) => (
          <div
            key={topic.id}
            data-topic-id={topic.id}
            className={`p-3 rounded-xl border text-center transition-all ${
              isDark
                ? "bg-white/[0.03] border-white/[0.06] hover:border-indigo/30"
                : "bg-white border-slate-100 hover:border-indigo/20"
            }`}
          >
            <p className={`text-xs font-semibold mb-1 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {topic.name}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-[10px] tabular-nums ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {topic.progress}%
              </span>
              <Tag label={`R${topic.rStage}`} color={rStageColor(topic.rStage)} size="sm" />
            </div>
            {topic.prerequisites.length > 0 && (
              <p className={`text-[9px] mt-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                needs: {topic.prerequisites.map((p) => TOPIC_MAP[p]?.name ?? p).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STORYBOOK TIER VIEW — Simple picture-based subject tiles
   ═══════════════════════════════════════════════════════════════════ */
function StorybookView() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-storybook-bg font-nunito relative overflow-hidden">
      <div className="blob blob-rose w-96 h-96 -top-40 right-0 opacity-10" />
      <div className="blob blob-amber w-80 h-80 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-3xl font-bold mb-1 text-slate-800">
            My Subjects
          </h1>
          <p className="text-sm mb-6 text-slate-500">
            Tap a subject to see what you are learning!
          </p>
        </motion.div>

        {/* Subject tiles — big, picture-based */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SUBJECTS.map((subj, i) => (
            <motion.div
              key={subj.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                onClick={() => setActiveSubject(activeSubject === subj.id ? null : subj.id)}
                className={`w-full p-6 rounded-3xl border-2 transition-all text-center ${
                  activeSubject === subj.id
                    ? "border-indigo/30 bg-indigo/5 shadow-lg scale-[1.02]"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                }`}
              >
                <span className="text-5xl block mb-3">{subj.storybookEmoji}</span>
                <p className="text-sm font-bold text-slate-700">{subj.name}</p>
                <div className="mt-2">
                  <ProgressBar value={subj.syllabusCoverage} color={subj.color} height="h-2.5" showLabel />
                </div>
              </button>

              {/* Expanded chapter view */}
              <AnimatePresence>
                {activeSubject === subj.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-2">
                      {subj.chapters.map((ch) => (
                        <div key={ch.id} className="bg-white rounded-2xl border border-slate-100 p-3">
                          <p className="text-xs font-bold text-slate-600 mb-1">{ch.name}</p>
                          <ProgressBar value={ch.progress} color={subj.color} height="h-1.5" showLabel />
                          <div className="mt-2 flex flex-wrap gap-1">
                            {ch.topics.map((t) => (
                              <span key={t.id} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">
                                {t.name} {t.progress}%
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EXPLORER TIER VIEW — Adventure map style with badges
   ═══════════════════════════════════════════════════════════════════ */
function ExplorerView() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <div className="blob blob-indigo w-96 h-96 -top-40 right-0 opacity-10" />
      <div className="blob blob-teal w-80 h-80 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1 text-white">
            Adventure Map
          </h1>
          <p className="text-sm mb-6 text-slate-400">
            Explore each subject territory and unlock new badges!
          </p>
        </motion.div>

        {/* Syllabus Coverage Rings — Feature 10 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard>
            <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
              Syllabus Coverage
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {SUBJECTS.map((subj) => (
                <div key={subj.id} className="flex flex-col items-center gap-2">
                  <GaugeRing value={subj.syllabusCoverage} size={70} strokeWidth={5} color={subj.accentHex}>
                    <span className="text-lg">{subj.explorerEmoji}</span>
                  </GaugeRing>
                  <span className="text-[10px] text-slate-400 font-semibold">{subj.name}</span>
                  <span className="text-[10px] text-slate-500 tabular-nums">{subj.syllabusCoverage}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Subject territories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map((subj, i) => {
            const isActive = activeSubject === subj.id;
            const totalTopics = subj.chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
            const masteredTopics = subj.chapters.reduce(
              (sum, ch) => sum + ch.topics.filter((t) => t.rStage >= 4).length,
              0
            );

            return (
              <motion.div
                key={subj.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <GlassCard hover onClick={() => setActiveSubject(isActive ? null : subj.id)}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{subj.explorerEmoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{subj.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {masteredTopics}/{totalTopics} topics mastered
                      </p>
                    </div>
                    {/* Badge for high progress */}
                    {subj.syllabusCoverage >= 60 && (
                      <span className="text-lg" title="Explorer badge">🏅</span>
                    )}
                    {subj.syllabusCoverage >= 70 && (
                      <span className="text-lg" title="Champion badge">🏆</span>
                    )}
                  </div>
                  <ProgressBar value={subj.syllabusCoverage} color={subj.color} height="h-2" showLabel />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          {subj.chapters.map((ch) => (
                            <div key={ch.id} className="glass-sm p-3 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-slate-300">{ch.name}</p>
                                <Tag label={`${ch.progress}%`} color={ch.progress >= 70 ? "green" : "amber"} size="sm" />
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {ch.topics.map((t) => (
                                  <div
                                    key={t.id}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                                  >
                                    <span className="text-[10px] text-slate-300">{t.name}</span>
                                    <Tag label={`R${t.rStage}`} color={rStageColor(t.rStage)} size="sm" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STUDIO / BOARD / PRO TIER VIEW — Full tree view with connectivity
   ═══════════════════════════════════════════════════════════════════ */
function AdvancedView() {
  const { tier, isDark } = useTier();
  const [expandedSubject, setExpandedSubject] = useState<string | null>("math");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [showConnectivity, setShowConnectivity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <div className="blob blob-indigo w-96 h-96 -top-40 right-0 opacity-10" />
      <div className="blob blob-teal w-80 h-80 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1 text-white">
            Subject Browser
          </h1>
          <p className="text-sm mb-6 text-slate-400">
            Explore subjects, chapters, topics, and prerequisite chains
          </p>
        </motion.div>

        {/* Feature 10: Syllabus Coverage Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Syllabus Coverage
              </h2>
              <Tag label="Feature 10" color="indigo" size="sm" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {SUBJECTS.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => setExpandedSubject(expandedSubject === subj.id ? null : subj.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <GaugeRing
                    value={subj.syllabusCoverage}
                    size={76}
                    strokeWidth={5}
                    color={subj.accentHex}
                    label={subj.name.split(" ")[0]}
                  />
                  <span className={`text-[10px] font-semibold transition-colors ${
                    expandedSubject === subj.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                  }`}>
                    {subj.name}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Subject detail panels */}
        <div className="space-y-4">
          {SUBJECTS.map((subj, si) => {
            const isExpanded = expandedSubject === subj.id;
            const totalTopics = subj.chapters.reduce((s, c) => s + c.topics.length, 0);
            const completedTopics = subj.chapters.reduce(
              (s, c) => s + c.topics.filter((t) => t.progress >= 80).length,
              0
            );
            const showMap = showConnectivity === subj.id;

            return (
              <motion.div
                key={subj.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + si * 0.05 }}
              >
                <GlassCard padding="p-0">
                  {/* Subject header row */}
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : subj.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-all rounded-t-2xl"
                  >
                    <span className="text-2xl">{subjectIcon(subj, tier)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white">{subj.name}</p>
                        <Tag
                          label={`${completedTopics}/${totalTopics} topics`}
                          color={completedTopics >= totalTopics * 0.7 ? "green" : "white"}
                          size="sm"
                        />
                      </div>
                      <ProgressBar value={subj.syllabusCoverage} color={subj.color} height="h-1.5" showLabel />
                    </div>
                    <div className="flex items-center gap-3">
                      <GaugeRing value={subj.syllabusCoverage} size={48} strokeWidth={4} color={subj.accentHex} />
                      <span className={`text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                        &#9660;
                      </span>
                    </div>
                  </button>

                  {/* Expanded: chapters & topics */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06] px-5 pb-5">
                          {/* Connectivity toggle — Feature 9 */}
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                              Chapters & Topics
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowConnectivity(showMap ? null : subj.id);
                              }}
                              className={`text-[10px] px-3 py-1 rounded-full font-semibold transition-all border ${
                                showMap
                                  ? "bg-indigo/15 text-indigo-light border-indigo/30"
                                  : "bg-white/[0.04] text-slate-400 border-white/[0.06] hover:text-white"
                              }`}
                            >
                              {showMap ? "Hide" : "Show"} Connectivity Map
                            </button>
                          </div>

                          {/* Connectivity Map — Feature 9 */}
                          <AnimatePresence>
                            {showMap && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-4"
                              >
                                <div className="glass-sm p-4 rounded-xl">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm">🔗</span>
                                    <span className="text-xs font-bold text-slate-300">
                                      Topic Connectivity Map
                                    </span>
                                    <Tag label="Feature 9" color="teal" size="sm" />
                                  </div>
                                  <p className="text-[10px] text-slate-500 mb-3">
                                    Dashed arrows show prerequisite chains. A topic requires all its prerequisites before starting.
                                  </p>
                                  <ConnectivityMap subject={subj} isDark={isDark} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Chapter tree */}
                          <div className="space-y-3">
                            {subj.chapters.map((ch) => {
                              const chExpanded = expandedChapter === ch.id;
                              return (
                                <div key={ch.id} className="glass-sm rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => setExpandedChapter(chExpanded ? null : ch.id)}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02] transition-all"
                                  >
                                    <span className={`text-slate-500 text-xs transition-transform ${chExpanded ? "rotate-90" : ""}`}>
                                      &#9654;
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-slate-200">{ch.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <ProgressBar
                                        value={ch.progress}
                                        color={subj.color}
                                        height="h-1"
                                        showLabel
                                        className="w-24"
                                      />
                                    </div>
                                  </button>

                                  <AnimatePresence>
                                    {chExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="border-t border-white/[0.04] px-3 pb-3">
                                          <table className="w-full mt-2">
                                            <thead>
                                              <tr className="text-[10px] text-slate-600 uppercase">
                                                <th className="text-left py-1 font-semibold">Topic</th>
                                                <th className="text-center py-1 font-semibold w-20">Progress</th>
                                                <th className="text-center py-1 font-semibold w-14">R-Stage</th>
                                                <th className="text-left py-1 font-semibold">Prerequisites</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {ch.topics.map((t) => (
                                                <tr
                                                  key={t.id}
                                                  className="border-t border-white/[0.03] hover:bg-white/[0.02]"
                                                >
                                                  <td className="py-2">
                                                    <span className="text-xs text-slate-300">{t.name}</span>
                                                  </td>
                                                  <td className="py-2">
                                                    <ProgressBar value={t.progress} color={subj.color} height="h-1" showLabel />
                                                  </td>
                                                  <td className="py-2 text-center">
                                                    <Tag label={`R${t.rStage}`} color={rStageColor(t.rStage)} size="sm" />
                                                  </td>
                                                  <td className="py-2">
                                                    {t.prerequisites.length > 0 ? (
                                                      <div className="flex flex-wrap gap-1">
                                                        {t.prerequisites.map((pId) => (
                                                          <span
                                                            key={pId}
                                                            className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500 border border-white/[0.06]"
                                                          >
                                                            {TOPIC_MAP[pId]?.name ?? pId}
                                                          </span>
                                                        ))}
                                                      </div>
                                                    ) : (
                                                      <span className="text-[9px] text-slate-600">None</span>
                                                    )}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function SubjectsPage() {
  const { tier } = useTier();

  /* Select tier-adapted content */
  let content: React.ReactNode;

  if (tier === "storybook") {
    content = <StorybookView />;
  } else if (tier === "explorer") {
    content = <ExplorerView />;
  } else {
    content = <AdvancedView />;
  }

  /* Layout: storybook has no sidebar, matching life-skills pattern */
  if (tier === "storybook") {
    return (
      <>
        <Header />
        {content}
      </>
    );
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
