"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import VoiceBars from "@/components/ui/VoiceBars";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";

const STEPS = [
  { id: 1, title: "Faraday's Law", emoji: "⚡", content: "The induced EMF in a circuit is equal to the negative rate of change of magnetic flux through the circuit.\n\nε = -dΦ/dt\n\nwhere Φ = B·A·cos(θ)", importance: "P0" },
  { id: 2, title: "Lenz's Law", emoji: "🔄", content: "The direction of induced current opposes the change in flux that caused it. This is the physical basis for the negative sign in Faraday's law.\n\nKey: Nature resists change in flux.", importance: "P0" },
  { id: 3, title: "Self-Induction", emoji: "🔌", content: "ε = -L(dI/dt)\n\nL = self-inductance (Henry)\nFor solenoid: L = μ₀n²Al\n\nEnergy stored: U = ½LI²", importance: "P1" },
  { id: 4, title: "Mutual Induction", emoji: "🔗", content: "M = μ₀N₁N₂A/l\n\nε₂ = -M(dI₁/dt)\n\nTransformer equation:\nV₂/V₁ = N₂/N₁ = I₁/I₂", importance: "P0" },
  { id: 5, title: "Practice: JEE Pattern", emoji: "🎯", content: "Timed question bank — 5 questions, 10 minutes", importance: "P0" },
];

export default function ProPlayer() {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"learn" | "practice" | "review">("learn");
  const [showFormula, setShowFormula] = useState(true);
  const [timer] = useState(600);
  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-navy text-white font-mono">
      {/* Top metrics bar */}
      <div className="border-b border-white/5 px-4 py-2 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Physics · EMI · Ch. 6</span>
          <Tag label={current.importance as "P0" | "P1"} color={current.importance === "P0" ? "red" : "amber"} />
          <span className="text-slate-500">JEE Weightage: 8-10%</span>
        </div>
        <div className="flex items-center gap-3">
          <VoiceBars playing={false} color="#10b981" />
          <span className="text-slate-500">⌘K Quick Jump</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 px-4 flex items-center gap-1 py-1">
        {(["learn", "practice", "review"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all font-sans
              ${activeTab === tab ? "bg-indigo/15 text-indigo-light" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex h-[calc(100vh-160px)]">
        {/* Compact sidebar */}
        <div className="w-48 shrink-0 border-r border-white/5 p-2 overflow-y-auto">
          <div className="space-y-0.5">
            {STEPS.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all text-[11px]
                    ${isActive ? "bg-indigo/15 text-indigo-light" : isDone ? "text-teal" : "text-slate-500 hover:bg-white/5"}`}
                >
                  <span className={`text-[9px] px-1 rounded ${
                    s.importance === "P0" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  }`}>{s.importance}</span>
                  <span className="truncate font-sans">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 relative">
          <div className="relative z-10 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "learn" && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{current.emoji}</span>
                      <h2 className="text-lg font-bold font-sans">{current.title}</h2>
                      <Tag label={current.importance} color={current.importance === "P0" ? "red" : "amber"} />
                    </div>

                    <GlassCard className="mb-3">
                      <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                        {current.content}
                      </pre>
                    </GlassCard>

                    {/* Timed quiz */}
                    {step === 4 && (
                      <GlassCard className="border-emerald-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold font-sans">Speed Drill — EMI</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Time:</span>
                            <span className="font-mono text-emerald-400 text-sm tabular-nums">
                              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 glass-sm">
                            <div className="text-xs text-slate-400 mb-1">Q1 · JEE Main 2024</div>
                            <p className="text-sm font-sans">A circular coil of radius 10 cm has 100 turns. If the magnetic field changes from 2T to 0 in 0.01s, find the induced EMF.</p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {["628 V", "314 V", "62.8 V", "31.4 V"].map((opt, i) => (
                                <button key={i} className="text-xs p-2 rounded-lg bg-white/3 hover:bg-white/8 transition-all text-slate-300 font-sans">
                                  ({String.fromCharCode(97 + i)}) {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <ProgressBar value={1} max={5} color="teal" className="mt-3" showLabel />
                      </GlassCard>
                    )}
                  </>
                )}

                {activeTab === "practice" && (
                  <GlassCard>
                    <h3 className="text-sm font-bold font-sans mb-3">Mock Test — EMI Chapter</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="glass-sm p-3">
                        <div className="text-slate-400 font-sans">Questions</div>
                        <div className="text-lg font-bold text-white font-sans">25</div>
                      </div>
                      <div className="glass-sm p-3">
                        <div className="text-slate-400 font-sans">Duration</div>
                        <div className="text-lg font-bold text-white font-sans">45 min</div>
                      </div>
                      <div className="glass-sm p-3">
                        <div className="text-slate-400 font-sans">Difficulty</div>
                        <div className="text-lg font-bold text-amber-400 font-sans">Medium</div>
                      </div>
                      <div className="glass-sm p-3">
                        <div className="text-slate-400 font-sans">Last Score</div>
                        <div className="text-lg font-bold text-teal font-sans">72%</div>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-emerald-500/15 text-emerald-400 text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-500/25 transition-all font-sans">
                      Start Timed Mock →
                    </button>
                  </GlassCard>
                )}

                {activeTab === "review" && (
                  <GlassCard>
                    <h3 className="text-sm font-bold font-sans mb-3">Quick Revision Cards</h3>
                    <div className="space-y-2">
                      {["Faraday's Law: ε = -dΦ/dt", "Lenz's Law: opposes change", "Self-inductance: L = μ₀n²Al", "Energy: U = ½LI²", "Transformer: V₂/V₁ = N₂/N₁"].map((card, i) => (
                        <div key={i} className="glass-sm p-3 flex items-center justify-between">
                          <span className="text-xs">{card}</span>
                          <span className="text-[9px] text-teal">R{i + 1}/10</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            {activeTab === "learn" && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/5 disabled:opacity-30 font-sans"
                >
                  ← Prev
                </button>
                <span className="text-[10px] text-slate-600">{step + 1}/{STEPS.length}</span>
                <button
                  onClick={() => step < STEPS.length - 1 && setStep(step + 1)}
                  disabled={step === STEPS.length - 1}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo/20 text-indigo-light hover:bg-indigo/30 disabled:opacity-30 font-sans"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Formula panel (always visible for Pro) */}
        {showFormula && (
          <div className="w-56 shrink-0 border-l border-white/5 p-3 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Formulas</h3>
              <button onClick={() => setShowFormula(false)} className="text-slate-600 text-xs hover:text-slate-400">×</button>
            </div>
            <div className="space-y-2 text-[11px]">
              {[
                { label: "Faraday", formula: "ε = -NdΦ/dt" },
                { label: "Flux", formula: "Φ = BAcos(θ)" },
                { label: "Self L", formula: "L = μ₀n²Al" },
                { label: "Mutual M", formula: "M = μ₀N₁N₂A/l" },
                { label: "Energy", formula: "U = ½LI²" },
                { label: "Transformer", formula: "V₂/V₁ = N₂/N₁" },
                { label: "Motional EMF", formula: "ε = Blv" },
                { label: "AC Generator", formula: "ε = NBAω sin(ωt)" },
              ].map((f) => (
                <div key={f.label} className="p-2 bg-white/3 rounded-lg">
                  <div className="text-[9px] text-slate-500">{f.label}</div>
                  <div className="text-emerald-400">{f.formula}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
