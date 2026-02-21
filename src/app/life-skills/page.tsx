"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_LIFE_SKILLS } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Tag from "@/components/ui/Tag";
import { motion, AnimatePresence } from "framer-motion";
import { TierKey } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════
   DURATION INDICATOR BY CLASS
   ═══════════════════════════════════════════════════════════════════ */
const DURATION_BY_TIER: Record<TierKey, string> = {
  storybook: "1-2 min \u23F1\uFE0F",
  explorer: "3-4 min \u23F1\uFE0F",
  studio: "5-8 min \u23F1\uFE0F",
  board: "10-15 min \u23F1\uFE0F",
  pro: "10-15 min \u23F1\uFE0F",
};

/* ═══════════════════════════════════════════════════════════════════
   9-DOMAIN FRAMEWORK LABELS
   Map dilemma chapters to their life skills domain
   ═══════════════════════════════════════════════════════════════════ */
interface DomainInfo {
  code: string;
  name: string;
  color: "indigo" | "teal" | "amber" | "rose" | "green" | "purple" | "white" | "red";
}

const DOMAIN_BY_TIER: Record<TierKey, DomainInfo> = {
  storybook: { code: "D", name: "Social-Emotional", color: "rose" },
  explorer: { code: "F", name: "Collaborative", color: "teal" },
  studio: { code: "G", name: "Digital Citizenship", color: "indigo" },
  board: { code: "E", name: "Moral/Ethical", color: "amber" },
  pro: { code: "H", name: "Career Ethics", color: "purple" },
};

/* ═══════════════════════════════════════════════════════════════════
   TIER ADAPTATION DESCRIPTIONS
   ═══════════════════════════════════════════════════════════════════ */
const TIER_ADAPTATION_NOTES: Record<TierKey, { short: string; detail: string; color: string }> = {
  storybook: {
    short: "Simple Scenario",
    detail: "Simple scenario, clear right choice, immediate positive outcome shown. Designed for young learners with concrete, relatable situations.",
    color: "bg-amber-400/10 border-amber-400/20 text-amber-300",
  },
  explorer: {
    short: "Multi-Option",
    detail: "Multiple options with trade-offs, no single 'right' answer, discussion of consequences. Encourages critical thinking about teamwork and fairness.",
    color: "bg-teal/10 border-teal/20 text-teal",
  },
  studio: {
    short: "Real Dilemma",
    detail: "Real dilemma, 3-4 options with merit. Real-world digital scenario with ethical complexity. No perfect answer exists.",
    color: "bg-indigo/10 border-indigo/20 text-indigo-light",
  },
  board: {
    short: "High-Stakes Ethics",
    detail: "High-stakes ethical dilemma with real exam pressure, multiple valid responses, and long-term consequences to consider.",
    color: "bg-rose-400/10 border-rose-400/20 text-rose-300",
  },
  pro: {
    short: "Systemic Ethics",
    detail: "Complex systemic ethical issue with no clear right answer. Explores technology-society tension and career implications.",
    color: "bg-purple-500/10 border-purple-500/20 text-purple-300",
  },
};

export default function LifeSkillsPage() {
  const { tier, isDark, student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";
  const dilemma = DEMO_LIFE_SKILLS[tier];
  const [selected, setSelected] = useState<number | null>(null);
  const [showAdaptationDetail, setShowAdaptationDetail] = useState(false);

  const duration = DURATION_BY_TIER[tier];
  const domain = DOMAIN_BY_TIER[tier];
  const adaptation = TIER_ADAPTATION_NOTES[tier];

  const content = (
    <div className={`min-h-screen ${tier === "storybook" ? "bg-storybook-bg font-nunito" : "bg-navy"} relative overflow-hidden`}>
      <div className="blob blob-rose w-96 h-96 -top-40 right-0 opacity-10" />
      <div className="blob blob-amber w-80 h-80 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
            {"\uD83D\uDC9B"} Life Skills
          </h1>
          <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Story-based dilemmas — no right answers, just thoughtful choices
          </p>
        </motion.div>

        {isParentView && (
          <div className={`mb-4 p-3 rounded-xl border ${isDark ? "bg-teal/5 border-teal/20" : "bg-teal-50 border-teal-200"}`}>
            <p className={`text-xs font-semibold ${isDark ? "text-teal" : "text-teal-700"}`}>
              Parent View — Life Skills uses story-based ethical dilemmas, not lectures. Discuss {student.name}&apos;s choices together to reinforce learning.
            </p>
          </div>
        )}

        {/* Chapter info */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
            {/* Top row: Chapter tag + Duration + Domain */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag label={dilemma.chapter} color="rose" size="md" />
                <Tag label={`Domain ${domain.code}: ${domain.name}`} color={domain.color} size="md" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
                }`}>
                  {duration}
                </span>
              </div>
            </div>

            {/* Tier Adaptation Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-5"
            >
              <button
                onClick={() => setShowAdaptationDetail(!showAdaptationDetail)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${adaptation.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{"\uD83C\uDFAF"}</span>
                    <span className="text-xs font-bold">Tier Adaptation: {adaptation.short}</span>
                  </div>
                  <span className="text-xs">{showAdaptationDetail ? "\u25B2" : "\u25BC"}</span>
                </div>
                <AnimatePresence>
                  {showAdaptationDetail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[11px] mt-2 opacity-80 leading-relaxed">
                        {adaptation.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
              {dilemma.title}
            </h2>

            {/* Story */}
            <div className={`${isDark ? "glass-sm" : "bg-slate-50 rounded-2xl border border-slate-100"} p-5 mb-6`}>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {dilemma.story}
              </p>
            </div>

            {/* Question */}
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
              {dilemma.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {dilemma.options.map((option, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <button
                    onClick={() => setSelected(i)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border-2
                      ${selected === i
                        ? isDark
                          ? "bg-indigo/15 border-indigo/30"
                          : "bg-indigo/10 border-indigo/20"
                        : isDark
                          ? "bg-white/3 border-white/5 hover:border-white/10"
                          : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                        ${selected === i
                          ? "bg-indigo text-white"
                          : isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
                        }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={`text-sm ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        {option.text}
                      </span>
                    </div>
                  </button>

                  {/* Outcome reveal */}
                  <AnimatePresence>
                    {selected === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-2 ml-11 p-3 rounded-xl text-xs ${
                          isDark ? "bg-teal/10 text-teal border border-teal/20" : "bg-teal/5 text-teal-dark border border-teal/10"
                        }`}>
                          <span className="font-bold">What happens: </span>{option.outcome}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Reflection */}
            {selected !== null && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6">
                <div className={`${isDark ? "glass-sm" : "bg-amber-50 rounded-2xl border border-amber-100"} p-4`}>
                  <h4 className={`text-sm font-bold mb-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                    {"\uD83D\uDCAD"} Think About It
                  </h4>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    There&apos;s no single right answer here. Every choice has consequences.
                    What matters is thinking about how your actions affect others.
                    Talk about this with someone you trust!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Domain Framework Info Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <div className={`${isDark ? "glass-sm" : "glass-light"} p-4 mb-4`}>
            <h3 className={`text-xs font-bold mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {"\uD83C\uDF10"} 9-Domain Life Skills Framework
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: "A", name: "Cognitive", emoji: "\uD83E\uDDE0" },
                { code: "B", name: "Communication", emoji: "\uD83D\uDDE3\uFE0F" },
                { code: "C", name: "Creative", emoji: "\uD83C\uDFA8" },
                { code: "D", name: "Social-Emotional", emoji: "\uD83D\uDC9B" },
                { code: "E", name: "Moral/Ethical", emoji: "\u2696\uFE0F" },
                { code: "F", name: "Collaborative", emoji: "\uD83E\uDD1D" },
                { code: "G", name: "Digital Citizenship", emoji: "\uD83D\uDCF1" },
                { code: "H", name: "Career Ethics", emoji: "\uD83D\uDCBC" },
                { code: "I", name: "Physical Wellbeing", emoji: "\uD83C\uDFC3" },
              ].map((d) => {
                const isCurrentDomain = d.code === domain.code;
                return (
                  <div
                    key={d.code}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs transition-all ${
                      isCurrentDomain
                        ? isDark
                          ? "bg-indigo/15 text-indigo-light border border-indigo/20 font-bold"
                          : "bg-indigo/10 text-indigo border border-indigo/15 font-bold"
                        : isDark
                          ? "bg-white/[0.02] text-slate-500"
                          : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <span>{d.emoji}</span>
                    <span>{d.code}: {d.name}</span>
                    {isCurrentDomain && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-indigo/20 text-indigo-light">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Chapter progress */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className={`${isDark ? "glass-sm" : "glass-light"} p-4`}>
            <h3 className={`text-xs font-bold mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              All 13 Life Skills Chapters
            </h3>
            <div className="grid grid-cols-13 gap-1">
              {Array.from({ length: 13 }).map((_, i) => {
                const done = i < 3;
                const current = i === 3;
                return (
                  <div
                    key={i}
                    className={`h-2 rounded-full ${
                      done ? "bg-teal" : current ? "bg-indigo animate-pulse" : isDark ? "bg-white/5" : "bg-slate-100"
                    }`}
                    title={`Chapter ${i + 1}`}
                  />
                );
              })}
            </div>
            <div className={`text-[10px] mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              3/13 chapters completed · Stories grow more complex each year
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
