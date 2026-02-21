"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_STEPS_STORYBOOK, DEMO_STEPS_STUDIO } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   FRAMEWORK STEP TAGS — shown as indicators for the universal flow
   ═══════════════════════════════════════════════════════════════════ */
const FRAMEWORK_TAGS = [
  { label: "U1 Misconception Shield", emoji: "\u26A0\uFE0F", color: "bg-amber-500/15 text-amber-300" },
  { label: "U2 Knowledge Web", emoji: "\uD83D\uDD17", color: "bg-indigo/15 text-indigo-light" },
  { label: "Content", emoji: "\uD83D\uDCD6", color: "bg-teal/15 text-teal" },
  { label: "Test", emoji: "\uD83C\uDFAF", color: "bg-rose-400/15 text-rose-300" },
  { label: "Practice", emoji: "\u270F\uFE0F", color: "bg-purple-500/15 text-purple-300" },
  { label: "Recall", emoji: "\uD83E\uDDE0", color: "bg-emerald-400/15 text-emerald-300" },
];

/* ═══════════════════════════════════════════════════════════════════
   DEMO FORMULA DATA for Board/Pro layout
   ═══════════════════════════════════════════════════════════════════ */
const DEMO_FORMULAS = [
  { label: "Quadratic Formula", formula: "x = (-b +- sqrt(b^2 - 4ac)) / 2a" },
  { label: "Discriminant", formula: "D = b^2 - 4ac" },
  { label: "Sum of roots", formula: "alpha + beta = -b/a" },
  { label: "Product of roots", formula: "alpha * beta = c/a" },
  { label: "Nature of roots", formula: "D > 0: Real & distinct, D = 0: Real & equal, D < 0: No real roots" },
];

/* ═══════════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS for Pro tier
   ═══════════════════════════════════════════════════════════════════ */
const SHORTCUTS = [
  { keys: "\u2190 \u2192", action: "Prev / Next step" },
  { keys: "N", action: "Toggle notes" },
  { keys: "B", action: "Bookmark" },
  { keys: "\u2318K", action: "Command palette" },
  { keys: "M", action: "Mute/Unmute voice" },
];

export default function PlayerPage() {
  const { tier, isDark, student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";

  /* Decide which demo steps and layout to use */
  const isStorybook = tier === "storybook";
  const isExplorerStudio = tier === "explorer" || tier === "studio";

  const demoSteps = isStorybook ? DEMO_STEPS_STORYBOOK : DEMO_STEPS_STUDIO;

  const [currentStep, setCurrentStep] = useState(0);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [showCommandHint, setShowCommandHint] = useState(false);

  const step = demoSteps[currentStep];
  const totalSteps = demoSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    }
  };
  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(null);
    }
  };

  /* ─── Activity Renderer ─── */
  const renderActivity = () => {
    if (!step.activity) return null;
    const act = step.activity;

    if (act.type === "mcq" && act.options) {
      return (
        <div className="mt-4 space-y-2">
          <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
            {act.question}
          </p>
          {act.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(i)}
              className={`w-full text-left p-3 rounded-xl transition-all border-2 text-sm
                ${selectedOption === i
                  ? i === act.correctAnswer
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                  : isDark
                    ? "bg-white/5 border-white/5 hover:border-white/15 text-slate-300"
                    : "bg-white border-slate-100 hover:border-slate-200 text-slate-700"
                }`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2
                ${selectedOption === i
                  ? i === act.correctAnswer ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  : isDark ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500"
                }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
          {selectedOption !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className={`text-xs mt-2 p-2 rounded-lg ${
                selectedOption === act.correctAnswer
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-rose-500/10 text-rose-300"
              }`}>
                {selectedOption === act.correctAnswer ? "Correct! Well done!" : `Not quite. The answer is ${act.options[act.correctAnswer!]}.`}
              </p>
            </motion.div>
          )}
        </div>
      );
    }

    /* Placeholder for other activity types */
    if (act.type === "drag-order") {
      return (
        <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-purple-300 font-bold mb-2">Drag to Order</p>
          <p className="text-xs text-slate-400">{act.question}</p>
          <div className="mt-2 space-y-1">
            {act.options?.map((opt, i) => (
              <div key={i} className="p-2 rounded-lg bg-white/5 text-sm text-slate-300 cursor-grab active:cursor-grabbing">
                {opt}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (act.type === "match-pairs") {
      return (
        <div className="mt-4 p-4 rounded-xl bg-teal/10 border border-teal/20">
          <p className="text-xs text-teal font-bold mb-2">Match Pairs</p>
          <p className="text-xs text-slate-400">{act.question}</p>
        </div>
      );
    }

    if (act.type === "fill-blank") {
      return (
        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-300 font-bold mb-2">Fill in the Blank</p>
          <p className="text-xs text-slate-400">{act.question}</p>
          <input
            type="text"
            placeholder="Type your answer..."
            className="mt-2 w-full p-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/30"
          />
        </div>
      );
    }

    return null;
  };

  /* ─── Framework Step Tags Row ─── */
  const renderFrameworkTags = () => (
    <div className={`flex flex-wrap gap-1.5 ${isStorybook ? "justify-center mb-4" : "mb-3"}`}>
      {FRAMEWORK_TAGS.map((tag, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${tag.color} ${
            i === 0 && currentStep === 0 ? "ring-1 ring-amber-500/40 animate-pulse" : ""
          }`}
        >
          {tag.emoji} {tag.label}
        </span>
      ))}
    </div>
  );

  /* ─── Step Dots ─── */
  const renderStepDots = (size: "sm" | "lg" = "sm") => (
    <div className={`flex items-center justify-center gap-1.5 ${size === "lg" ? "py-4" : "py-2"}`}>
      {demoSteps.map((_, i) => (
        <button
          key={i}
          onClick={() => { setCurrentStep(i); setSelectedOption(null); }}
          className={`rounded-full transition-all ${
            i === currentStep
              ? size === "lg"
                ? "w-6 h-6 bg-amber-400 scale-110"
                : "w-3 h-3 bg-indigo"
              : i < currentStep
                ? size === "lg"
                  ? "w-5 h-5 bg-teal/60"
                  : "w-2.5 h-2.5 bg-teal/40"
                : size === "lg"
                  ? "w-5 h-5 bg-white/10"
                  : "w-2.5 h-2.5 bg-white/10"
          }`}
          title={`Step ${i + 1}: ${demoSteps[i].title}`}
        />
      ))}
    </div>
  );

  /* ─── Voice Indicator ─── */
  const renderVoiceToggle = (alwaysOn = false) => {
    if (alwaysOn) {
      return (
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-300">
          <span className="text-lg animate-pulse">{"\uD83D\uDD0A"}</span>
          <span className="text-xs font-bold">Voice On</span>
        </div>
      );
    }
    return (
      <button
        onClick={() => setVoiceMuted(!voiceMuted)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all text-xs font-bold ${
          voiceMuted
            ? "bg-white/5 text-slate-500"
            : isDark ? "bg-indigo/15 text-indigo-light" : "bg-indigo/10 text-indigo"
        }`}
      >
        <span className="text-lg">{voiceMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A"}</span>
        {voiceMuted ? "Muted" : "Voice"}
      </button>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     LAYOUT A — STORYBOOK (C1-2)
     Full-screen image, big text, playful, voice-auto, tap-advance
     ═══════════════════════════════════════════════════════════════ */
  const renderStorybookLayout = () => (
    <div
      className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 font-nunito relative overflow-hidden cursor-pointer select-none"
      onClick={goNext}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* Top bar: title + voice */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-amber-800">
              {"\uD83D\uDCD6"} What is Addition?
            </h1>
            <p className="text-xs text-amber-600/70">Meera&apos;s Mango Story</p>
          </div>
          {renderVoiceToggle(true)}
        </div>

        {isParentView && (
          <div className="mb-4 p-3 rounded-xl border bg-teal-50 border-teal-200">
            <p className="text-xs font-semibold text-teal-700">
              Parent View — You are previewing {student.name}&apos;s tutorial player. Lessons use voice narration, story-based content, and interactive activities.
            </p>
          </div>
        )}

        {/* Framework tags */}
        {renderFrameworkTags()}

        {/* Full-screen image area with text overlay */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          {/* Big emoji visual */}
          <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 border-4 border-amber-200/50 flex items-center justify-center mb-6 shadow-xl">
            <span className="text-8xl">{step.emoji}</span>
          </div>

          {/* Big title */}
          <h2 className="text-2xl font-black text-amber-900 mb-3">
            {step.title}
          </h2>

          {/* Big content text */}
          <p className="text-lg leading-relaxed text-amber-800/80 max-w-sm">
            {step.content}
          </p>

          {/* Activity (if any) — stop propagation so tap-advance doesn't fire */}
          <div onClick={(e) => e.stopPropagation()}>
            {step.activity && (
              <div className="mt-4 text-left w-full max-w-sm">
                {renderActivity()}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tap indicator */}
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center text-xs text-amber-500/60 mt-2"
        >
          Tap anywhere to continue {"\u25B6"}
        </motion.p>

        {/* Big playful nav buttons */}
        <div className="flex items-center justify-between mt-4 mb-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-200 text-3xl font-black text-amber-600 disabled:opacity-30 hover:bg-amber-200 transition-all active:scale-90 shadow-lg"
          >
            {"\u25C0"}
          </button>

          <div className="text-center">
            <span className="text-sm font-bold text-amber-700">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          <button
            onClick={goNext}
            disabled={currentStep === totalSteps - 1}
            className="w-16 h-16 rounded-2xl bg-amber-400 border-2 border-amber-500 text-3xl font-black text-white disabled:opacity-30 hover:bg-amber-500 transition-all active:scale-90 shadow-lg"
          >
            {"\u25B6"}
          </button>
        </div>

        {/* Step dots */}
        {renderStepDots("lg")}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════
     LAYOUT B — EXPLORER / STUDIO (C3-8)
     Split view, step sidebar, progress dots, notes (C6+)
     ═══════════════════════════════════════════════════════════════ */
  const renderExplorerStudioLayout = () => {
    const showNotes = tier === "studio"; // C6+ only
    const tutorialTitle = tier === "explorer" ? "Photosynthesis: How Plants Make Food" : "Chemical Reactions & Equations";

    return (
      <div className={`min-h-[calc(100vh-88px)] ${isDark ? "bg-navy" : "bg-slate-50"} relative overflow-hidden`}>
        <div className="blob blob-indigo w-80 h-80 -top-32 right-0 opacity-8" />
        <div className="blob blob-teal w-72 h-72 bottom-20 -left-20 opacity-6" />

        <div className="relative z-10 flex h-[calc(100vh-88px)]">
          {/* Step sidebar (collapsible) */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="shrink-0 border-r border-white/5 overflow-hidden"
              >
                <div className="w-60 p-4 h-full overflow-y-auto">
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    Steps
                  </h3>
                  <div className="space-y-1">
                    {demoSteps.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => { setCurrentStep(i); setSelectedOption(null); }}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                          i === currentStep
                            ? isDark ? "bg-indigo/15 text-indigo-light" : "bg-indigo/10 text-indigo"
                            : i < currentStep
                              ? isDark ? "text-teal/70" : "text-teal"
                              : isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-base">{s.emoji}</span>
                        <span className="truncate">{s.title}</span>
                        {i < currentStep && <span className="ml-auto text-teal text-xs">{"\u2713"}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Top toolbar */}
            <div className={`sticky top-0 z-20 ${isDark ? "bg-navy/90 border-white/5" : "bg-white/90 border-slate-100"} backdrop-blur-lg border-b px-6 py-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2 rounded-lg transition-all ${isDark ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                    title="Toggle steps panel"
                  >
                    {sidebarOpen ? "\u2B9C" : "\u2B9E"}
                  </button>
                  <div>
                    <h1 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                      {tutorialTitle}
                    </h1>
                    <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Step {currentStep + 1} of {totalSteps}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderVoiceToggle()}
                  {showNotes && (
                    <button
                      onClick={() => setNotesOpen(!notesOpen)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        notesOpen
                          ? "bg-amber-400/15 text-amber-300"
                          : isDark ? "bg-white/5 text-slate-400 hover:text-slate-200" : "bg-slate-100 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {"\uD83D\uDCDD"} Notes
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className={`mt-2 h-1 rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo to-teal"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Parent banner */}
            {isParentView && (
              <div className="px-6 pt-4">
                <div className={`mb-0 p-3 rounded-xl border ${isDark ? "bg-teal/5 border-teal/20" : "bg-teal-50 border-teal-200"}`}>
                  <p className={`text-xs font-semibold ${isDark ? "text-teal" : "text-teal-700"}`}>
                    Parent View — You are previewing {student.name}&apos;s tutorial player. Lessons adapt to their tier with split-view content and interactive activities.
                  </p>
                </div>
              </div>
            )}

            {/* Framework tags */}
            <div className="px-6 pt-4">
              {renderFrameworkTags()}
            </div>

            {/* Split view: Visual + Content */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Visual area */}
                <motion.div
                  key={`visual-${currentStep}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${isDark ? "glass" : "glass-light"} p-8 flex flex-col items-center justify-center min-h-[300px]`}
                >
                  <span className="text-7xl mb-4">{step.emoji}</span>
                  <h2 className={`text-xl font-bold text-center ${isDark ? "text-white" : "text-slate-800"}`}>
                    {step.title}
                  </h2>
                </motion.div>

                {/* Right: Content */}
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <div className={`${isDark ? "glass" : "glass-light"} p-6 flex-1`}>
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {step.content}
                    </p>
                    {renderActivity()}
                  </div>

                  {/* Key Points panel */}
                  <div className={`mt-3 ${isDark ? "glass-sm" : "bg-slate-50 rounded-xl border border-slate-100"} p-4`}>
                    <h4 className={`text-xs font-bold mb-2 ${isDark ? "text-indigo-light" : "text-indigo"}`}>
                      {"\uD83D\uDD11"} Key Points
                    </h4>
                    <ul className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      <li>{"  \u2022"} {step.content.split(".")[0]}.</li>
                      <li>{"  \u2022"} Voice text: &quot;{step.voiceText}&quot;</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Notes area (C6+ only) */}
            <AnimatePresence>
              {showNotes && notesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4 overflow-hidden"
                >
                  <div className={`${isDark ? "glass" : "glass-light"} p-4`}>
                    <h4 className={`text-sm font-bold mb-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                      {"\uD83D\uDCDD"} My Notes
                    </h4>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Type your notes for this step..."
                      rows={4}
                      className={`w-full p-3 rounded-xl text-sm resize-none outline-none transition-colors ${
                        isDark
                          ? "bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:border-amber-500/30"
                          : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-amber-400"
                      }`}
                    />
                    <p className={`text-[10px] mt-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                      Notes are saved locally for this session
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30 ${
                    isDark
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {"\u25C0"} Previous
                </button>

                {renderStepDots()}

                <button
                  onClick={goNext}
                  disabled={currentStep === totalSteps - 1}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo text-white hover:bg-indigo/80 transition-all disabled:opacity-30"
                >
                  Next {"\u25B6"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     LAYOUT C — BOARD / PRO (C9-12)
     Sidebar nav with all steps, content, formula panel, bookmarks,
     exam badge, keyboard shortcuts
     ═══════════════════════════════════════════════════════════════ */
  const renderBoardProLayout = () => {
    const isBoard = tier === "board";
    const isPro = tier === "pro";
    const tutorialTitle = isBoard ? "Quadratic Equations" : "Electromagnetic Induction";

    return (
      <div className="min-h-[calc(100vh-88px)] bg-navy relative overflow-hidden">
        <div className="blob blob-rose w-80 h-80 -top-32 right-0 opacity-6" />
        <div className="blob blob-indigo w-72 h-72 bottom-20 -left-20 opacity-6" />

        <div className="relative z-10 flex h-[calc(100vh-88px)]">
          {/* Left Sidebar: All steps listed */}
          <div className="w-56 shrink-0 border-r border-white/5 overflow-y-auto p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              {"\uD83D\uDCCB"} Tutorial Steps
            </h3>
            <div className="space-y-0.5">
              {demoSteps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setCurrentStep(i); setSelectedOption(null); }}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    i === currentStep
                      ? "bg-rose-500/15 text-rose-300 font-bold"
                      : i < currentStep
                        ? "text-teal/60"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 border border-current">
                    {i < currentStep ? "\u2713" : i + 1}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>

            {/* Progress summary */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-[10px] text-slate-500 mb-1">Progress</div>
              <div className="h-1.5 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-600 mt-1">
                {currentStep + 1}/{totalSteps} steps
              </div>
            </div>
          </div>

          {/* Center: Main content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Top toolbar */}
            <div className="sticky top-0 z-20 bg-navy/90 backdrop-blur-lg border-b border-white/5 px-6 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold text-white">{tutorialTitle}</h1>
                    {isBoard && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300">
                        {"\uD83D\uDCCB"} Board Exam Topic
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Step {currentStep + 1}: {step.title} {step.emoji}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {renderVoiceToggle()}
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      bookmarked
                        ? "bg-amber-400/15 text-amber-300"
                        : "bg-white/5 text-slate-400 hover:text-amber-300"
                    }`}
                  >
                    {"\u2B50"} {bookmarked ? "Saved" : "Bookmark"}
                  </button>
                  {isPro && (
                    <button
                      onClick={() => setShowCommandHint(!showCommandHint)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/5 text-slate-500 text-[10px] font-mono hover:text-slate-300 transition-all"
                    >
                      {"\u2318"}K
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Parent banner */}
            {isParentView && (
              <div className="px-6 pt-4">
                <div className="mb-0 p-3 rounded-xl border bg-teal/5 border-teal/20">
                  <p className="text-xs font-semibold text-teal">
                    Parent View — You are previewing {student.name}&apos;s tutorial player. Board/Pro lessons include formula panels, bookmarks, and exam-relevant tagging.
                  </p>
                </div>
              </div>
            )}

            {/* Framework tags */}
            <div className="px-6 pt-4">
              {renderFrameworkTags()}
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="glass p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{step.emoji}</span>
                      <div>
                        <h2 className="text-lg font-bold text-white">{step.title}</h2>
                        <p className="text-[10px] text-slate-500">
                          {step.voiceText}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                      {step.content}
                    </p>
                    {renderActivity()}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-slate-300 hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  {"\u25C0"} Prev
                </button>
                {renderStepDots()}
                <button
                  onClick={goNext}
                  disabled={currentStep === totalSteps - 1}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all disabled:opacity-30"
                >
                  Next {"\u25B6"}
                </button>
              </div>
            </div>

            {/* Command Palette Hint (Pro) */}
            <AnimatePresence>
              {isPro && showCommandHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-6 pb-4"
                >
                  <div className="glass-sm p-4 border border-indigo/20">
                    <h4 className="text-xs font-bold text-indigo-light mb-2">{"\u2318"}K Command Palette</h4>
                    <p className="text-[10px] text-slate-500">
                      Search topics, jump to steps, toggle tools...
                    </p>
                    <input
                      type="text"
                      placeholder="Type a command..."
                      className="mt-2 w-full p-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/30"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard shortcuts footer (Pro) */}
            {isPro && (
              <div className="px-6 pb-4">
                <div className="glass-sm p-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {"\u2328\uFE0F"} Keyboard Shortcuts
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {SHORTCUTS.map((sc) => (
                      <div key={sc.keys} className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400 border border-white/10">
                          {sc.keys}
                        </kbd>
                        <span className="text-[10px] text-slate-600">{sc.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Formula Panel */}
          <div className="w-64 shrink-0 border-l border-white/5 overflow-y-auto p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              {"\uD83E\uDDEA"} Formula Panel
            </h3>
            <div className="space-y-2">
              {DEMO_FORMULAS.map((f, i) => (
                <div key={i} className="glass-sm p-3">
                  <div className="text-[10px] font-bold text-rose-300 mb-1">{f.label}</div>
                  <div className="text-xs text-slate-400 font-mono leading-relaxed">{f.formula}</div>
                </div>
              ))}
            </div>

            {/* Bookmark panel */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {"\u2B50"} Bookmarks
              </h3>
              {bookmarked ? (
                <div className="glass-sm p-2 text-xs text-amber-300">
                  {"\u2B50"} Step {currentStep + 1}: {step.title} — saved
                </div>
              ) : (
                <p className="text-[10px] text-slate-600">
                  Click the bookmark button to save important steps
                </p>
              )}
            </div>

            {/* Exam badge area (Board) */}
            {isBoard && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {"\uD83C\uDFAF"} Board Exam Info
                </h3>
                <div className="glass-sm p-3 border border-rose-500/10">
                  <div className="text-xs font-bold text-rose-300 mb-1">{"\uD83D\uDCCB"} Board Exam Topic</div>
                  <p className="text-[10px] text-slate-500">
                    This topic appears in 90% of board exams. Weightage: 6-8 marks.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">CBSE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">ICSE</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: Pick layout by tier
     ═══════════════════════════════════════════════════════════════ */
  const renderContent = () => {
    if (isStorybook) return renderStorybookLayout();
    if (isExplorerStudio) return renderExplorerStudioLayout();
    return renderBoardProLayout();
  };

  /* Storybook gets no sidebar, others get Header + Sidebar */
  if (isStorybook) {
    return (
      <>
        <Header />
        {renderContent()}
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </>
  );
}
