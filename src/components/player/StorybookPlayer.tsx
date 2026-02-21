"use client";
import { useState } from "react";
import { DEMO_STEPS_STORYBOOK } from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";
import VoiceBars from "@/components/ui/VoiceBars";

export default function StorybookPlayer() {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const current = DEMO_STEPS_STORYBOOK[step];
  const isLast = step === DEMO_STEPS_STORYBOOK.length - 1;

  const handleNext = () => {
    if (step < DEMO_STEPS_STORYBOOK.length - 1) {
      setStep(step + 1);
      setSelectedAnswer(null);
    } else {
      setShowConfetti(true);
    }
  };

  return (
    <div className="min-h-screen bg-storybook-bg font-nunito relative overflow-hidden">
      {/* Warm blobs */}
      <div className="blob blob-amber w-80 h-80 top-10 -right-20 opacity-20" />
      <div className="blob blob-rose w-64 h-64 bottom-0 -left-10 opacity-15" />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-10 text-center shadow-2xl"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-slate-800">Amazing!</h2>
            <p className="text-lg text-slate-500 mt-2">You learned Addition!</p>
            <p className="text-sm text-emerald-600 mt-1">⭐ +5 stars · 🌱 Garden growing!</p>
            <button
              onClick={() => { setShowConfetti(false); setStep(0); }}
              className="mt-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold px-6 py-2 rounded-full"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {DEMO_STEPS_STORYBOOK.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < step ? "bg-emerald-400" : i === step ? "bg-amber-400 scale-125" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Voice + mascot */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce-gentle">🐘</span>
            <VoiceBars playing color="#fb923c" />
          </div>
          <span className="text-sm text-slate-400 font-bold">
            {step + 1} / {DEMO_STEPS_STORYBOOK.length}
          </span>
        </div>

        {/* Hero image area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-pink-50 rounded-3xl p-8 mb-4 min-h-[300px] flex flex-col items-center justify-center text-center border border-amber-100 shadow-lg">
              <div className="text-7xl mb-4">{current.emoji}</div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">{current.title}</h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                {current.content}
              </p>
            </div>

            {/* Activity (if MCQ) */}
            {current.activity && current.activity.type === "mcq" && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-700 mb-4">{current.activity.question}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {current.activity.options?.map((opt, i) => {
                    const colors = ["bg-rose-100 border-rose-200 text-rose-700", "bg-sky-100 border-sky-200 text-sky-700", "bg-emerald-100 border-emerald-200 text-emerald-700", "bg-amber-100 border-amber-200 text-amber-700"];
                    const isCorrect = i === current.activity!.correctAnswer;
                    const isSelected = selectedAnswer === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswer(i)}
                        className={`p-4 rounded-2xl border-2 text-2xl font-black transition-all
                          ${isSelected
                            ? isCorrect
                              ? "bg-emerald-200 border-emerald-400 scale-105 shadow-lg"
                              : "bg-red-200 border-red-400 shake"
                            : colors[i]
                          }
                          hover:scale-105 hover:shadow-md
                        `}
                      >
                        {opt}
                        {isSelected && isCorrect && " ✓"}
                        {isSelected && !isCorrect && " ✗"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Speech bubble */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
              <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t border-slate-100 rotate-45" />
              <p className="text-base text-slate-600 italic">&ldquo;{current.voiceText}&rdquo;</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Big Next button - tap to continue */}
        <div className="mt-6 text-center">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xl font-black px-10 py-4 rounded-full shadow-lg shadow-amber-200/50 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {isLast ? "Finish! 🎉" : "Next ✨"}
          </button>
        </div>
      </div>
    </div>
  );
}
