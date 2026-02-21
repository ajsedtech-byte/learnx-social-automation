"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceBars from "@/components/ui/VoiceBars";

const STEPS = [
  { id: 1, title: "What is Addition?", emoji: "🧩", content: "Addition means putting numbers together to find the total. When Aarav has 4 marbles and Priya gives him 3 more, we ADD them: 4 + 3 = 7", image: "🔢 + 🔢 = ❓" },
  { id: 2, title: "Number Line", emoji: "📏", content: "A number line helps us visualize addition. Start at 4, jump 3 steps forward. Where do you land? At 7!", image: "← 0 1 2 3 [4] → → → [7] 8 9 10 →" },
  { id: 3, title: "Key Points", emoji: "📌", content: "• Addition uses the + symbol\n• The result is called the SUM\n• Order doesn't matter: 3+4 = 4+3\n• Adding 0 gives the same number", image: "3 + 4 = 4 + 3 = 7 ✓" },
  { id: 4, title: "Practice", emoji: "✏️", content: "Match the pairs!", image: "Match Game" },
  { id: 5, title: "Badge Unlocked!", emoji: "🏅", content: "You've earned the Addition Explorer badge! +50 XP", image: "🏅 Addition Explorer" },
];

export default function ExplorerPlayer() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-explorer-galaxy via-[#1a0533] to-[#0c1222] text-white relative overflow-hidden">
      <div className="blob blob-purple w-96 h-96 top-0 right-0 opacity-15" />
      <div className="blob blob-teal w-64 h-64 bottom-20 -left-10 opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* Step pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`step-pill ${
                i < step ? "step-pill-done" : i === step ? "step-pill-active" : "step-pill-pending"
              }`}
            >
              {i < step ? "✓" : ""} {s.title}
            </button>
          ))}
        </div>

        {/* Voice indicator */}
        <div className="flex items-center gap-3 mb-4">
          <VoiceBars playing color="#8b5cf6" />
          <span className="text-xs text-purple-400">{current.title}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Split view: Image left + Content right */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left - visual */}
              <div className="glass p-8 flex flex-col items-center justify-center min-h-[350px] bg-gradient-to-br from-purple-500/10 to-teal/5">
                <div className="text-5xl mb-4">{current.emoji}</div>
                <div className="text-center text-lg font-mono text-purple-200">
                  {current.image}
                </div>
              </div>

              {/* Right - content */}
              <div className="glass p-6 flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-4">{current.title}</h2>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {current.content}
                </div>

                {/* Match pairs activity */}
                {current.title === "Practice" && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { left: "2 + 3", right: "5" },
                      { left: "4 + 1", right: "5" },
                      { left: "3 + 3", right: "6" },
                      { left: "5 + 2", right: "7" },
                    ].map((pair, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="glass-sm px-3 py-2 text-sm font-mono text-purple-300 flex-1 text-center cursor-pointer hover:bg-purple-500/20 transition-all">
                          {pair.left}
                        </div>
                        <span className="text-slate-600">→</span>
                        <div className="glass-sm px-3 py-2 text-sm font-mono text-explorer-gold flex-1 text-center cursor-pointer hover:bg-explorer-gold/20 transition-all">
                          {pair.right}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Badge unlock */}
                {current.title === "Badge Unlocked!" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-center"
                  >
                    <div className="text-6xl mb-2 animate-bounce-gentle">🏅</div>
                    <div className="text-xs text-explorer-gold font-bold">+50 XP earned!</div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm text-purple-400 hover:bg-white/5 transition-all disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={() => step < STEPS.length - 1 && setStep(step + 1)}
            disabled={step === STEPS.length - 1}
            className="px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo text-white hover:shadow-lg transition-all disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
