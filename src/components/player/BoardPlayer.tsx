"use client";
import { useState } from "react";
import { DEMO_STEPS_STUDIO } from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import VoiceBars from "@/components/ui/VoiceBars";
import Tag from "@/components/ui/Tag";

export default function BoardPlayer() {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFormula, setShowFormula] = useState(false);
  const current = DEMO_STEPS_STUDIO[step];

  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Board importance banner */}
      <div className="bg-board-pink/10 border-b border-board-pink/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag label="Board Important" color="rose" size="md" />
          <span className="text-xs text-slate-400">Chemical Reactions · 5 marks · Frequently asked</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag label="PYQ: 2019, 2020, 2022" color="amber" />
          <button className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-white/5">
            🔖 Bookmark
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-56 shrink-0 border-r border-white/5 p-3 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Chapter 1</h3>
            <h2 className="text-sm font-bold">Chemical Reactions & Equations</h2>
            <div className="flex gap-1 mt-2">
              <Tag label="CBSE" color="rose" />
              <Tag label="5 marks" color="amber" />
            </div>
          </div>

          <div className="space-y-1">
            {DEMO_STEPS_STUDIO.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={i}
                  onClick={() => { setStep(i); setSelectedAnswer(null); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-xs
                    ${isActive ? "bg-board-pink/15 text-board-pink border border-board-pink/20" :
                      isDone ? "text-teal" : "text-slate-500 hover:bg-white/5"}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                    ${isDone ? "bg-teal/20 text-teal" : isActive ? "bg-board-pink/20 text-board-pink" : "bg-white/5 text-slate-600"}`}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Exam tips */}
          <div className="mt-6 glass-sm p-3 border-board-amber/20">
            <h4 className="text-[10px] text-board-amber font-bold uppercase tracking-wider mb-2">💡 Board Tips</h4>
            <ul className="text-[10px] text-slate-400 space-y-1">
              <li>• Always balance equations</li>
              <li>• Write state symbols</li>
              <li>• Draw diagrams if asked</li>
              <li>• Show 2-3 examples per type</li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tag label={`Step ${step + 1}/${DEMO_STEPS_STUDIO.length}`} color="rose" size="md" />
                <VoiceBars playing color="#fb7185" />
              </div>
              <button
                onClick={() => setShowFormula(!showFormula)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${showFormula ? "bg-board-amber/20 text-board-amber" : "text-slate-500 hover:bg-white/5"}`}
              >
                <span>𝑓𝑥</span> Formula Panel
              </button>
            </div>

            <div className="flex gap-4">
              {/* Content */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                  >
                    <GlassCard className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{current.emoji}</span>
                        <h2 className="text-xl font-bold">{current.title}</h2>
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {current.content}
                      </div>
                    </GlassCard>

                    {current.activity && current.activity.type === "mcq" && (
                      <GlassCard className="border-board-pink/20 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag label="Board Pattern Q" color="rose" />
                          <span className="text-[10px] text-slate-500">2 marks</span>
                        </div>
                        <h3 className="text-sm font-bold mb-3">{current.activity.question}</h3>
                        <div className="space-y-2">
                          {current.activity.options?.map((opt, i) => {
                            const isCorrect = i === current.activity!.correctAnswer;
                            const isSelected = selectedAnswer === i;
                            return (
                              <button
                                key={i}
                                onClick={() => setSelectedAnswer(i)}
                                className={`w-full text-left p-3 rounded-xl text-sm transition-all border
                                  ${isSelected
                                    ? isCorrect
                                      ? "bg-teal/15 border-teal/30 text-teal"
                                      : "bg-red-500/15 border-red-500/30 text-red-400"
                                    : "bg-white/3 border-white/5 text-slate-300 hover:bg-white/5"
                                  }`}
                              >
                                ({String.fromCharCode(97 + i)}) {opt}
                                {isSelected && isCorrect && <span className="float-right">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </GlassCard>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => step > 0 && setStep(step - 1)}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 disabled:opacity-30"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => step < DEMO_STEPS_STUDIO.length - 1 && setStep(step + 1)}
                    disabled={step === DEMO_STEPS_STUDIO.length - 1}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-board-pink text-white hover:bg-board-pink/80 disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Formula panel (drawer) */}
              {showFormula && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="w-64 shrink-0"
                >
                  <GlassCard className="border-board-amber/20">
                    <h3 className="text-xs font-bold text-board-amber mb-3">𝑓𝑥 Formula Panel</h3>
                    <div className="space-y-3 text-xs">
                      <div className="p-2 bg-white/3 rounded-lg">
                        <div className="text-slate-400 text-[10px] mb-1">Combination</div>
                        <div className="font-mono text-slate-200">A + B → AB</div>
                      </div>
                      <div className="p-2 bg-white/3 rounded-lg">
                        <div className="text-slate-400 text-[10px] mb-1">Decomposition</div>
                        <div className="font-mono text-slate-200">AB → A + B</div>
                      </div>
                      <div className="p-2 bg-white/3 rounded-lg">
                        <div className="text-slate-400 text-[10px] mb-1">Displacement</div>
                        <div className="font-mono text-slate-200">A + BC → AC + B</div>
                      </div>
                      <div className="p-2 bg-white/3 rounded-lg">
                        <div className="text-slate-400 text-[10px] mb-1">Double Displacement</div>
                        <div className="font-mono text-slate-200">AB + CD → AD + CB</div>
                      </div>
                      <div className="p-2 bg-white/3 rounded-lg">
                        <div className="text-slate-400 text-[10px] mb-1">Iron Oxidation</div>
                        <div className="font-mono text-slate-200">4Fe + 3O₂ → 2Fe₂O₃</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
