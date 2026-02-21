"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { SUBJECTS_BY_TIER } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

// Growth milestones: Seed(0-4) -> Sprout(5-9) -> Sapling(10-14) -> Tree(15-19) -> Bloom(20+)
const STAGES = [
  { key: "seed",    emoji: "\ud83e\udeb4", label: "Seed",    minTopics: 0,  maxTopics: 4 },
  { key: "sprout",  emoji: "\ud83c\udf3f", label: "Sprout",  minTopics: 5,  maxTopics: 9 },
  { key: "sapling", emoji: "\ud83c\udf31", label: "Sapling", minTopics: 10, maxTopics: 14 },
  { key: "tree",    emoji: "\ud83c\udf33", label: "Tree",    minTopics: 15, maxTopics: 19 },
  { key: "bloom",   emoji: "\ud83c\udf38", label: "Bloom!",  minTopics: 20, maxTopics: 999 },
];

// Correct plant types per subject (blueprint spec)
const SUBJECT_PLANTS: Record<string, { emoji: string; name: string }> = {
  math:    { emoji: "\ud83c\udf3b", name: "Sunflower" },
  science: { emoji: "\ud83c\udf33", name: "Banyan Tree" },
  hindi:   { emoji: "\ud83e\udeb7", name: "Lotus" },
  english: { emoji: "\ud83c\udf39", name: "Rose" },
  evs:     { emoji: "\ud83c\udf3f", name: "Neem" },
  life:    { emoji: "\ud83e\udeb4", name: "Tulsi" },
  art:     { emoji: "\ud83c\udf3b", name: "Sunflower" },
  sst:     { emoji: "\ud83c\udf33", name: "Banyan Tree" },
};

// Weekly streak animals
const STREAK_ANIMALS = [
  { minDays: 14, emoji: "\ud83e\udd9a", name: "Peacock", message: "A majestic peacock visits your garden!" },
  { minDays: 7,  emoji: "\ud83e\udd9c", name: "Parrot",  message: "A friendly parrot flew in!" },
  { minDays: 3,  emoji: "\ud83e\udd8b", name: "Butterfly", message: "A butterfly is visiting!" },
];

function getStreakAnimal(streak: number) {
  return STREAK_ANIMALS.find(a => streak >= a.minDays) || null;
}

// Seasonal themes
function getCurrentSeason(): { name: string; emoji: string; decoration: string; bgExtra: string } {
  const month = new Date().getMonth(); // 0-11
  // Check special Indian occasions by approximate month
  // Diwali (Oct/Nov), Holi (Feb/Mar), Independence Day (Aug)
  if (month === 7) return { name: "Independence Day", emoji: "\ud83c\uddee\ud83c\uddf3", decoration: "Tricolor ribbons flutter across your garden!", bgExtra: "border-orange-300" };
  if (month === 1 || month === 2) return { name: "Holi Season", emoji: "\ud83c\udfa8\ud83c\udf08", decoration: "Colors splash across your garden!", bgExtra: "border-pink-300" };
  if (month === 9 || month === 10) return { name: "Diwali Festival", emoji: "\ud83e\udea9\u2728", decoration: "Diyas light up your garden!", bgExtra: "border-amber-300" };
  // Default seasons
  if (month >= 2 && month <= 4) return { name: "Spring", emoji: "\ud83c\udf38", decoration: "Flowers bloom everywhere! Plants grow faster!", bgExtra: "border-pink-200" };
  if (month >= 5 && month <= 7) return { name: "Monsoon", emoji: "\ud83c\udf27\ufe0f", decoration: "Rain waters your plants! Extra growth!", bgExtra: "border-blue-200" };
  if (month >= 8 && month <= 10) return { name: "Autumn", emoji: "\ud83c\udf42", decoration: "Golden leaves decorate your garden!", bgExtra: "border-amber-200" };
  return { name: "Winter", emoji: "\u2744\ufe0f", decoration: "Cozy garden under the winter sky!", bgExtra: "border-slate-200" };
}

// Demo garden data with subject-correct plants, wilting support
interface GardenPlantData {
  subjectId: string;
  topicsCompleted: number;
  lastActiveDay: number; // days since last activity, 0=today
}

const DEMO_GARDEN_DATA: GardenPlantData[] = [
  { subjectId: "math",    topicsCompleted: 12, lastActiveDay: 0 },
  { subjectId: "english", topicsCompleted: 18, lastActiveDay: 1 },
  { subjectId: "evs",     topicsCompleted: 6,  lastActiveDay: 0 },
  { subjectId: "hindi",   topicsCompleted: 10, lastActiveDay: 4 }, // wilted!
  { subjectId: "art",     topicsCompleted: 24, lastActiveDay: 0 },
  { subjectId: "life",    topicsCompleted: 2,  lastActiveDay: 5 }, // wilted!
];

function getStage(topics: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (topics >= STAGES[i].minTopics) return STAGES[i];
  }
  return STAGES[0];
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function GardenPage() {
  const { tier, student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";
  const subjects = SUBJECTS_BY_TIER[tier] || SUBJECTS_BY_TIER.storybook;
  const isStorybook = tier === "storybook";
  const [showShareToast, setShowShareToast] = useState(false);

  const streakAnimal = getStreakAnimal(student.streak);
  const season = getCurrentSeason();

  function handleShowMummy() {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  }

  const content = (
    <div className={`min-h-screen ${isStorybook ? "bg-storybook-bg font-nunito" : "bg-gradient-to-br from-explorer-galaxy via-[#1a0533] to-[#0c1222]"} relative overflow-hidden`}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">

        {/* ── Header ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className={`text-2xl font-bold mb-1 ${isStorybook ? "text-slate-800" : "text-white"}`}>
            {"\ud83c\udf31"} Learning Garden
          </h1>
          <p className={`text-sm mb-2 ${isStorybook ? "text-slate-500" : "text-purple-300"}`}>
            Complete topics to grow your plants! Each subject has its own plant.
          </p>
          {/* NO comparison / NO leaderboards notice */}
          <div className={`text-[10px] mb-4 ${isStorybook ? "text-emerald-600" : "text-emerald-400"}`}>
            {"\ud83d\udc9a"} Your personal garden &mdash; no competition, just growth!
          </div>
        </motion.div>

        {isParentView && (
          <div className={`mb-4 p-3 rounded-xl border ${isStorybook ? "bg-teal-50 border-teal-200" : "bg-teal/5 border-teal/20"}`}>
            <p className={`text-xs font-semibold ${isStorybook ? "text-teal-700" : "text-teal"}`}>
              Parent View — This is {student.name}&apos;s Learning Garden. Each plant represents a subject and grows as topics are completed. Wilted plants indicate inactivity.
            </p>
          </div>
        )}

        {/* ── Seasonal banner ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <div className={`${isStorybook
            ? `bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border ${season.bgExtra}`
            : "glass-sm border-amber-500/10"
          } p-4 mb-5`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{season.emoji}</span>
              <div>
                <div className={`text-sm font-bold ${isStorybook ? "text-amber-700" : "text-amber-300"}`}>
                  {season.name} Active
                </div>
                <div className={`text-xs ${isStorybook ? "text-amber-600/70" : "text-slate-400"}`}>
                  {season.decoration}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Streak animal visitor ── */}
        {streakAnimal && (
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <div className={`${isStorybook
              ? "bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-200"
              : "glass-sm border-sky-500/10"
            } p-4 mb-5 flex items-center gap-4`}>
              <motion.span
                className="text-4xl"
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                {streakAnimal.emoji}
              </motion.span>
              <div>
                <div className={`text-sm font-bold ${isStorybook ? "text-sky-700" : "text-sky-300"}`}>
                  {streakAnimal.message}
                </div>
                <div className={`text-xs ${isStorybook ? "text-sky-500" : "text-slate-400"}`}>
                  {student.streak}-day streak! Keep going to attract more visitors!
                </div>
                <div className={`text-[10px] mt-1 ${isStorybook ? "text-slate-400" : "text-slate-500"}`}>
                  3 days = {"\ud83e\udd8b"} Butterfly &middot; 7 days = {"\ud83e\udd9c"} Parrot &middot; 14 days = {"\ud83e\udd9a"} Peacock
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Garden field ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className={`${isStorybook
            ? "bg-gradient-to-b from-emerald-50 to-green-100 rounded-3xl border border-emerald-200"
            : "glass"
          } p-8 mb-6 relative`}>

            {/* Streak animal floating above garden */}
            {streakAnimal && (
              <motion.div
                className="absolute -top-3 right-6 text-3xl z-10"
                animate={{ x: [0, 20, -10, 15, 0], y: [0, -5, 3, -8, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              >
                {streakAnimal.emoji}
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-6">
              {DEMO_GARDEN_DATA.map((plant, i) => {
                const stage = getStage(plant.topicsCompleted);
                const sub = subjects.find(s => s.id === plant.subjectId);
                const plantType = SUBJECT_PLANTS[plant.subjectId];
                const nextStage = STAGES[STAGES.indexOf(stage) + 1];
                const isWilted = plant.lastActiveDay >= 3;

                // Use subject-specific plant emoji unless wilted
                const displayEmoji = isWilted ? "\ud83e\udd40" : (plantType?.emoji || stage.emoji);

                return (
                  <motion.div
                    key={plant.subjectId}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className={`${isStorybook ? "bg-white/80 rounded-2xl shadow-md" : "glass-sm"} p-5 text-center relative ${
                      isWilted ? "opacity-75" : ""
                    }`}
                  >
                    {/* Wilted overlay */}
                    {isWilted && (
                      <div className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isStorybook ? "bg-rose-100 text-rose-600" : "bg-rose-500/20 text-rose-400"
                      }`}>
                        {plant.lastActiveDay}d inactive
                      </div>
                    )}

                    <div
                      className={`text-5xl mb-2 ${isWilted ? "" : "animate-float"}`}
                      style={!isWilted ? { animationDelay: `${i * 0.5}s` } : undefined}
                    >
                      {displayEmoji}
                    </div>

                    <h3 className={`font-bold text-sm mb-0.5 ${isStorybook ? "text-slate-700" : "text-white"}`}>
                      {sub?.name || plant.subjectId}
                    </h3>

                    {plantType && (
                      <div className={`text-[10px] ${isStorybook ? "text-slate-400" : "text-slate-500"}`}>
                        {plantType.name} {plantType.emoji}
                      </div>
                    )}

                    <div className={`text-xs font-medium mt-1 mb-1 ${
                      isWilted
                        ? isStorybook ? "text-rose-500" : "text-rose-400"
                        : isStorybook ? "text-emerald-600" : "text-emerald-400"
                    }`}>
                      {isWilted ? "Wilted!" : stage.label}
                    </div>

                    <div className={`text-[10px] ${isStorybook ? "text-slate-400" : "text-slate-500"}`}>
                      {plant.topicsCompleted} topics done
                    </div>

                    {isWilted ? (
                      <div className={`text-[10px] mt-1 ${isStorybook ? "text-rose-400" : "text-rose-300"}`}>
                        Your plant misses you! Come back to water it!
                      </div>
                    ) : nextStage ? (
                      <div className={`text-[10px] mt-1 ${isStorybook ? "text-amber-600" : "text-amber-400"}`}>
                        {nextStage.minTopics - plant.topicsCompleted} more {"\u2192"} {SUBJECT_PLANTS[plant.subjectId]?.emoji || nextStage.emoji} {nextStage.label}
                      </div>
                    ) : (
                      <div className={`text-[10px] mt-1 font-bold ${isStorybook ? "text-pink-500" : "text-pink-400"}`}>
                        {"\u2728"} Fully bloomed!
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── "Show Mummy" button ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
          <button
            onClick={handleShowMummy}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] mb-5 ${
              isStorybook
                ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300"
                : "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30"
            }`}
          >
            {"\ud83d\udc69\u200d\ud83d\udc67"} Show Mummy My Garden!
          </button>
        </motion.div>

        {/* Share toast */}
        <AnimatePresence>
          {showShareToast && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.9 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                <span className="text-xl">{"\ud83d\udcf8"}</span>
                <div>
                  <div className="font-bold text-sm">Screenshot ready!</div>
                  <div className="text-[10px] text-white/80">Share your garden with Mummy!</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Growth stages legend ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className={`${isStorybook ? "bg-white rounded-2xl border border-slate-100 shadow-sm" : "glass-sm"} p-4`}>
            <h3 className={`text-xs font-bold mb-3 ${isStorybook ? "text-slate-600" : "text-slate-400"}`}>
              Growth Milestones
            </h3>
            <div className="flex items-center justify-between">
              {STAGES.map((stage, i) => (
                <div key={stage.key} className="flex items-center gap-2">
                  <span className="text-2xl">{stage.emoji}</span>
                  <div>
                    <div className={`text-xs font-bold ${isStorybook ? "text-slate-700" : "text-white"}`}>{stage.label}</div>
                    <div className={`text-[10px] ${isStorybook ? "text-slate-400" : "text-slate-500"}`}>
                      {stage.minTopics}-{stage.maxTopics === 999 ? "+" : stage.maxTopics} topics
                    </div>
                  </div>
                  {i < STAGES.length - 1 && <span className={`text-lg mx-2 ${isStorybook ? "text-slate-300" : "text-slate-600"}`}>{"\u2192"}</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Subject plant guide ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
          <div className={`${isStorybook ? "bg-white rounded-2xl border border-slate-100 shadow-sm" : "glass-sm"} p-4 mt-4`}>
            <h3 className={`text-xs font-bold mb-3 ${isStorybook ? "text-slate-600" : "text-slate-400"}`}>
              Your Plants
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SUBJECT_PLANTS).filter(([key]) =>
                DEMO_GARDEN_DATA.some(g => g.subjectId === key)
              ).map(([key, plant]) => {
                const sub = subjects.find(s => s.id === key);
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-lg">{plant.emoji}</span>
                    <div>
                      <div className={`text-[10px] font-bold ${isStorybook ? "text-slate-700" : "text-white"}`}>
                        {sub?.name || key}
                      </div>
                      <div className={`text-[9px] ${isStorybook ? "text-slate-400" : "text-slate-500"}`}>
                        {plant.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Wilting info ── */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className={`${isStorybook
            ? "bg-rose-50 rounded-2xl border border-rose-100"
            : "glass-sm border-rose-500/10"
          } p-4 mt-4`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{"\ud83e\udd40"}</span>
              <div>
                <div className={`text-xs font-bold ${isStorybook ? "text-rose-700" : "text-rose-300"}`}>
                  Plant Wilting
                </div>
                <div className={`text-[10px] ${isStorybook ? "text-rose-600/70" : "text-slate-500"}`}>
                  Plants inactive for 3+ days will wilt. Come back and practice to revive them!
                  Your plants miss you when you are away!
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
