"use client";
import { useState } from "react";
import { DEMO_STEPS_STUDIO } from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import VoiceBars from "@/components/ui/VoiceBars";
import Tag from "@/components/ui/Tag";

export default function StudioPlayer() {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const current = DEMO_STEPS_STUDIO[step];

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar nav */}
        <div className="w-56 shrink-0 border-r border-white/5 p-3 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Topic</h3>
            <h2 className="text-sm font-bold">Chemical Reactions</h2>
            <p className="text-[10px] text-slate-400 mt-1">Science · Ch. 1 · Class 10</p>
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
                    ${isActive ? "bg-indigo/15 text-indigo-light border border-indigo/20" :
                      isDone ? "text-teal" : "text-slate-500 hover:bg-white/5"}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                    ${isDone ? "bg-teal/20 text-teal" : isActive ? "bg-indigo/20 text-indigo-light" : "bg-white/5 text-slate-600"}`}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Notes area */}
          <div className="mt-6">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2">📝 Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your notes here..."
              className="w-full bg-white/3 border border-white/5 rounded-xl p-2 text-xs text-slate-300 placeholder:text-slate-600 resize-none h-24 focus:outline-none focus:border-indigo/30"
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="blob blob-indigo w-96 h-96 -top-40 -right-40 opacity-10" />

          <div className="relative z-10 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Tag label={`Step ${step + 1}/${DEMO_STEPS_STUDIO.length}`} color="indigo" size="md" />
                <VoiceBars playing color="#6366f1" />
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-white/5">
                  🔖 Bookmark
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step content */}
                <GlassCard className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{current.emoji}</span>
                    <h2 className="text-xl font-bold">{current.title}</h2>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {current.content}
                  </div>
                </GlassCard>

                {/* Activity */}
                {current.activity && current.activity.type === "mcq" && (
                  <GlassCard className="border-indigo/20 mb-4">
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
                            <span className="font-mono text-xs text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                            {isSelected && isCorrect && <span className="float-right text-teal">✓ Correct</span>}
                            {isSelected && !isCorrect && <span className="float-right text-red-400">✗ Try again</span>}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswer !== null && selectedAnswer === current.activity.correctAnswer && (
                      <div className="mt-3 p-3 rounded-xl bg-teal/10 text-xs text-teal">
                        Excellent! This is a combination reaction — two reactants combine to form a single product.
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Did You Know */}
                {current.title === "Did You Know?" && (
                  <div className="glass-sm p-4 border-amber-500/20 bg-amber-500/5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                      <span>💡</span> Fun Fact
                    </div>
                    <p className="text-xs text-slate-300">{current.content}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => { if (step > 0) { setStep(step - 1); setSelectedAnswer(null); } }}
                disabled={step === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={() => { if (step < DEMO_STEPS_STUDIO.length - 1) { setStep(step + 1); setSelectedAnswer(null); } }}
                disabled={step === DEMO_STEPS_STUDIO.length - 1}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo text-white hover:bg-indigo-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
