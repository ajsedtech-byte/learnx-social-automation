"use client";
import { DEMO_STUDENTS, SUBJECTS_BY_TIER, DEMO_GARDEN } from "@/lib/demo-data";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const student = DEMO_STUDENTS.storybook;
const subjects = SUBJECTS_BY_TIER.storybook;
const garden = DEMO_GARDEN;

const PLANT_STAGES = {
  seed: { emoji: "\u{1FAD8}", label: "Seed", size: "text-2xl" },
  sprout: { emoji: "\uD83C\uDF3F", label: "Sprout", size: "text-3xl" },
  sapling: { emoji: "\uD83C\uDF31", label: "Sapling", size: "text-4xl" },
  tree: { emoji: "\uD83C\uDF33", label: "Tree", size: "text-5xl" },
  bloom: { emoji: "\uD83C\uDF38", label: "Bloom!", size: "text-6xl" },
};

const GAJU_MESSAGES = [
  "You're doing amazing!",
  "Let's learn something fun today!",
  "I'm so proud of you!",
  "Every story begins with one step!",
  "You're getting smarter every day!",
  "Learning is the greatest adventure!",
  "Keep going, little star!",
  "Gaju believes in you!",
];

const SYLLABUS_COVERAGE = [
  { subject: "Mathematics", emoji: "\uD83D\uDCD0", covered: 42, total: 100, color: "#6366f1" },
  { subject: "Science", emoji: "\uD83D\uDD2C", covered: 38, total: 100, color: "#2dd4bf" },
  { subject: "English", emoji: "\uD83D\uDCDD", covered: 55, total: 100, color: "#f59e0b" },
  { subject: "SST", emoji: "\uD83C\uDF0D", covered: 30, total: 100, color: "#ec4899" },
  { subject: "Hindi", emoji: "\uD83D\uDD49\uFE0F", covered: 48, total: 100, color: "#a855f7" },
  { subject: "Life Skills", emoji: "\uD83D\uDC9B", covered: 23, total: 100, color: "#10b981" },
];

export default function StorybookDash() {
  const [gajuMessage, setGajuMessage] = useState(GAJU_MESSAGES[0]);
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  useEffect(() => {
    const idx = Math.floor(Math.random() * GAJU_MESSAGES.length);
    setGajuMessage(GAJU_MESSAGES[idx]);
  }, []);

  return (
    <div className="min-h-screen bg-storybook-bg font-nunito tier-storybook">
      {/* Warm ambient blobs */}
      <div className="blob blob-amber w-96 h-96 top-20 -left-20 opacity-20" />
      <div className="blob blob-rose w-80 h-80 top-40 right-0 opacity-15" />
      <div className="blob blob-teal w-64 h-64 bottom-20 left-1/3 opacity-10" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">
        {/* Welcome Back Banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-5 mb-6 border border-amber-200 relative"
          >
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/70 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
            >
              &times;
            </button>
            <div className="flex items-center gap-3">
              <div className="text-5xl animate-bounce-gentle">🐘</div>
              <div className="flex-1">
                <h3 className="text-base font-black text-amber-800">
                  Gaju missed you! 🐘 Let&apos;s play and learn!
                </h3>
                <p className="text-sm text-amber-600 mt-1">
                  Welcome back, {student.name}! You were away for 3 days. Your garden missed you! Let&apos;s catch up.
                </p>
                <button className="mt-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Quick Catch-Up ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Welcome - story-oriented */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-3">{student.avatar}</div>
          <h1 className="text-3xl font-black text-slate-800">
            Once upon a time, {student.name}... 🌟
          </h1>
          <p className="text-lg text-slate-500 mt-1">Your story continues today!</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ {student.xp} stars
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
              📖 {student.completedTopics} chapters read
            </span>
          </div>
        </motion.div>

        {/* Gaju says... speech bubble */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-start gap-3 mb-6"
        >
          <div className="text-5xl shrink-0 animate-bounce-gentle">🐘</div>
          <div className="relative bg-white rounded-2xl rounded-bl-sm shadow-md border border-amber-100 p-4 flex-1">
            {/* Speech bubble tail */}
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-white border-b-[6px] border-b-transparent" />
            <p className="text-sm font-bold text-amber-700">Gaju says...</p>
            <p className="text-base text-slate-600 mt-1">&quot;{gajuMessage}&quot;</p>
          </div>
        </motion.div>

        {/* Learning Garden - garden-first layout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-b from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-100 mb-6"
        >
          <h2 className="text-lg font-bold text-emerald-800 mb-1">🌱 My Garden</h2>
          <p className="text-xs text-emerald-600 mb-4">Complete chapters to grow your plants!</p>
          <div className="grid grid-cols-3 gap-4">
            {garden.map((plant) => {
              const stage = PLANT_STAGES[plant.stage];
              const sub = subjects.find((s) => s.id === plant.subjectId);
              return (
                <div key={plant.subjectId} className="flex flex-col items-center gap-1 bg-white/60 rounded-2xl p-3">
                  <div className={`${stage.size} animate-float`} style={{ animationDelay: `${Math.random() * 3}s` }}>
                    {stage.emoji}
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{sub?.name}</span>
                  <span className="text-[10px] text-emerald-500">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Your Story So Far - quest path */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg shadow-amber-100/50 border border-amber-100 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-1">📜 Your Story So Far</h2>
          <p className="text-xs text-slate-400 mb-4">Every chapter you finish adds to your story!</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const done = i < student.completedTopics;
              const current = i === student.completedTopics;
              return (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all
                    ${done ? "bg-emerald-400 text-white shadow-md" : current ? "bg-amber-400 text-white shadow-lg animate-bounce-gentle" : "bg-slate-100 text-slate-300"}
                  `}>
                    {done ? "✓" : current ? "📖" : i + 1}
                  </div>
                  {i < 11 && (
                    <div className={`w-6 h-0.5 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Story Chapters - subjects as chapters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-1">📚 Story Chapters</h2>
          <p className="text-xs text-slate-400 mb-3">Pick a chapter and continue your adventure!</p>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((sub, i) => (
              <Link href="/player" key={sub.id}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-4xl mb-2">{sub.emoji}</div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full font-bold">
                      Ch. {sub.chaptersCompleted}/{sub.totalChapters}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-700 text-base">{sub.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{sub.currentTopic}</p>
                  {/* Star progress instead of % */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className={`text-lg ${j < Math.ceil(sub.progress / 20) ? "opacity-100" : "opacity-20"}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-500 font-bold mt-2">
                    {sub.progress < 50 ? "Next chapter awaits!" : "Almost finished this story!"}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Syllabus Coverage */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg shadow-amber-100/50 border border-amber-100 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-1">🗺️ Syllabus Adventures</h2>
          <p className="text-xs text-slate-400 mb-4">How much of each story world have you explored?</p>
          <div className="space-y-3">
            {SYLLABUS_COVERAGE.map((sub) => (
              <div key={sub.subject}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sub.emoji}</span>
                    <span className="text-sm font-bold text-slate-700">{sub.subject}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {sub.covered}/{sub.total}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(sub.covered / sub.total) * 100}%`, backgroundColor: sub.color }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  You&apos;ve explored {sub.covered} out of {sub.total} {sub.subject.toLowerCase()} adventures!
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gaju Elephant CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-6xl animate-bounce-gentle mb-3">🐘</div>
          <p className="text-sm text-slate-500 mb-3 font-medium">Gaju is excited to read the next chapter with you!</p>
          <Link href="/player">
            <button className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-lg font-bold px-8 py-3 rounded-full shadow-lg shadow-amber-200/50 hover:shadow-xl hover:-translate-y-1 transition-all">
              Let&apos;s Read Together! ✨
            </button>
          </Link>
        </motion.div>

        {/* Show Mummy button */}
        <div className="text-center pb-6">
          <Link href="/parent">
            <button className="bg-pink-50 text-pink-600 text-sm font-bold px-5 py-2 rounded-full border border-pink-200 hover:bg-pink-100 transition-all">
              Show Mummy 👩‍👧
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
