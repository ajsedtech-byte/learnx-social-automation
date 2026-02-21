"use client";
import { useState, useEffect, useCallback } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_SPARK } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import GaugeRing from "@/components/ui/GaugeRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { motion, AnimatePresence } from "framer-motion";

// ═══ CONSTANTS ═══
const DOMAIN_COLORS = ["#6366f1", "#2dd4bf", "#f472b6", "#fbbf24", "#8b5cf6", "#fb923c", "#10b981", "#f43f5e", "#06b6d4"];

type ConfidenceLevel = "sure" | "not_sure" | "guess";

// ═══ CONFIDENCE MATRIX TYPES ═══
interface ConfidenceMatrixCell {
  key: string;
  label: string;
  description: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  priority: string;
  count: number;
}

// ═══ 6 SPARK TEST TYPES ═══
const SPARK_TEST_TYPES = [
  { key: "DIAGNOSTIC", label: "Diagnostic", emoji: "🔍", description: "First login assessment", color: "indigo" as const },
  { key: "TOPIC_COMPLETION", label: "Topic Done", emoji: "✅", description: "After micro-topic", color: "teal" as const },
  { key: "CHAPTER_COMPLETION", label: "Chapter Done", emoji: "📖", description: "After chapter", color: "green" as const },
  { key: "PERIODIC", label: "Monthly", emoji: "📅", description: "Monthly check-in", color: "purple" as const },
  { key: "TRIGGERED", label: "Triggered", emoji: "🔄", description: "After 3 fails", color: "amber" as const },
  { key: "YEARLY_RESET", label: "Yearly Reset", emoji: "🎯", description: "Annual full reset", color: "rose" as const },
];

// ═══ DEMO CONFIDENCE MATRIX DATA ═══
const DEMO_CONFIDENCE_MATRIX: ConfidenceMatrixCell[] = [
  { key: "true_mastery", label: "TRUE MASTERY", description: "Sure + Correct", color: "#10b981", bgClass: "bg-emerald-500/12", textClass: "text-emerald-400", borderClass: "border-emerald-500/20", priority: "", count: 42 },
  { key: "dangerous_misconception", label: "DANGEROUS MISCONCEPTION", description: "Sure + Wrong", color: "#ef4444", bgClass: "bg-red-500/12", textClass: "text-red-400", borderClass: "border-red-500/20", priority: "P0", count: 5 },
  { key: "partial_understanding", label: "PARTIAL UNDERSTANDING", description: "Not Sure + Correct", color: "#f59e0b", bgClass: "bg-amber-500/12", textClass: "text-amber-400", borderClass: "border-amber-500/20", priority: "", count: 18 },
  { key: "honest_gap", label: "HONEST GAP", description: "Not Sure + Wrong", color: "#6366f1", bgClass: "bg-indigo-500/12", textClass: "text-indigo-400", borderClass: "border-indigo-500/20", priority: "P1", count: 12 },
  { key: "lucky_guess", label: "LUCKY GUESS", description: "Guess + Correct", color: "#a855f7", bgClass: "bg-purple-500/12", textClass: "text-purple-400", borderClass: "border-purple-500/20", priority: "", count: 8 },
  { key: "no_knowledge", label: "NO KNOWLEDGE", description: "Guess + Wrong", color: "#64748b", bgClass: "bg-slate-500/12", textClass: "text-slate-400", borderClass: "border-slate-500/20", priority: "P2", count: 15 },
];

// ═══ TIER-BASED QUESTION CONFIG ═══
function getTestConfig(studentClass: number): { questions: string; duration: string; totalQuestions: number } {
  if (studentClass <= 2) return { questions: "10 fun questions", duration: "3-4 min", totalQuestions: 10 };
  if (studentClass <= 4) return { questions: "10-12 questions", duration: "4-6 min", totalQuestions: 12 };
  if (studentClass === 5) return { questions: "12-15 questions", duration: "5-8 min", totalQuestions: 15 };
  if (studentClass <= 7) return { questions: "15-18 questions", duration: "8-10 min", totalQuestions: 18 };
  if (studentClass === 8) return { questions: "18-20 questions", duration: "10-12 min", totalQuestions: 20 };
  if (studentClass <= 10) return { questions: "20-25 questions", duration: "12-15 min", totalQuestions: 25 };
  return { questions: "25 questions", duration: "13-15 min", totalQuestions: 25 };
}

// ═══ DEMO TEST QUESTIONS (multi-subject) ═══
interface TestQuestion {
  id: number;
  subject: string;
  subjectEmoji: string;
  domain: string;
  question: string;
  options: string[];
  correctAnswer: number;
  isVisual?: boolean;
}

function getDemoQuestions(tier: string): TestQuestion[] {
  if (tier === "storybook") {
    return [
      { id: 1, subject: "Math", subjectEmoji: "🔢", domain: "Logical", question: "Which shape comes next? ⬛ ⬛ 🔴 ⬛ ⬛ 🔴 ⬛ ⬛ ?", options: ["🔴", "⬛", "🔵", "⬜"], correctAnswer: 0, isVisual: true },
      { id: 2, subject: "Math", subjectEmoji: "🔢", domain: "Logical", question: "Ravi has 3 apples. Mom gives 2 more. How many? 🍎🍎🍎 + 🍎🍎 = ?", options: ["4", "5", "6", "3"], correctAnswer: 1, isVisual: true },
      { id: 3, subject: "Math", subjectEmoji: "🔢", domain: "Spatial", question: "Which is bigger? 🐘 or 🐁?", options: ["🐘", "🐁"], correctAnswer: 0, isVisual: true },
      { id: 4, subject: "Stories", subjectEmoji: "📖", domain: "Linguistic", question: "What sound does a cat make?", options: ["🐱 Meow!", "🐶 Woof!", "🐦 Tweet!", "🐸 Ribbit!"], correctAnswer: 0, isVisual: true },
      { id: 5, subject: "Stories", subjectEmoji: "📖", domain: "Linguistic", question: "Which word rhymes with 'cat'? 🐱", options: ["🎩 Hat", "🐕 Dog", "☀️ Sun", "🌙 Moon"], correctAnswer: 0, isVisual: true },
      { id: 6, subject: "My World", subjectEmoji: "🌍", domain: "Naturalistic", question: "Which comes from a tree? 🌳", options: ["🍎 Apple", "🧀 Cheese", "🍞 Bread", "🥛 Milk"], correctAnswer: 0, isVisual: true },
      { id: 7, subject: "My World", subjectEmoji: "🌍", domain: "Interpersonal", question: "A friend falls down. What do you do?", options: ["🤗 Help them up!", "🏃 Run away", "😴 Ignore", "😠 Laugh"], correctAnswer: 0, isVisual: true },
      { id: 8, subject: "Music", subjectEmoji: "🎵", domain: "Musical", question: "Which instrument makes a LOUD sound? 🔊", options: ["🥁 Drum!", "🪶 Feather", "☁️ Cloud", "📱 Phone"], correctAnswer: 0, isVisual: true },
      { id: 9, subject: "Drawing", subjectEmoji: "🎨", domain: "Spatial", question: "How many sides does a triangle have? 🔺", options: ["3", "4", "5", "2"], correctAnswer: 0, isVisual: true },
      { id: 10, subject: "Drawing", subjectEmoji: "🎨", domain: "Bodily", question: "Point to the RED circle!", options: ["🔴", "🔵", "🟢", "🟡"], correctAnswer: 0, isVisual: true },
    ];
  }
  // Explorer / Studio / Board / Pro questions
  return [
    { id: 1, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: tier === "explorer" ? "What is 3/4 + 1/4?" : "If all roses are flowers, and some flowers fade quickly, which statement must be true?", options: tier === "explorer" ? ["1", "2/4", "1/2", "4/4"] : ["All roses fade quickly", "Some roses fade quickly", "No roses fade", "Cannot be determined"], correctAnswer: tier === "explorer" ? 0 : 0 },
    { id: 2, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: tier === "explorer" ? "Which number is the smallest: 0.5, 0.05, 5, 0.005?" : "Solve: x^2 - 5x + 6 = 0", options: tier === "explorer" ? ["0.005", "0.05", "0.5", "5"] : ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = -1, -6"], correctAnswer: 0 },
    { id: 3, subject: "Mathematics", subjectEmoji: "📐", domain: "Spatial", question: "How many lines of symmetry does a square have?", options: ["2", "4", "1", "6"], correctAnswer: 1 },
    { id: 4, subject: "Science", subjectEmoji: "🔬", domain: "Naturalistic", question: tier === "explorer" ? "What do plants need to make food?" : "Which type of reaction is: 2Mg + O2 -> 2MgO?", options: tier === "explorer" ? ["Sunlight, water, CO2", "Only water", "Only sunlight", "Soil and water"] : ["Combination", "Decomposition", "Displacement", "Redox"], correctAnswer: 0 },
    { id: 5, subject: "Science", subjectEmoji: "🔬", domain: "Logical", question: tier === "explorer" ? "What is the boiling point of water?" : "The pH of a neutral solution is:", options: tier === "explorer" ? ["100 C", "0 C", "50 C", "200 C"] : ["7", "0", "14", "1"], correctAnswer: 0 },
    { id: 6, subject: "Science", subjectEmoji: "🔬", domain: "Naturalistic", question: "Which organ pumps blood in the human body?", options: ["Heart", "Brain", "Lungs", "Liver"], correctAnswer: 0 },
    { id: 7, subject: "English", subjectEmoji: "📚", domain: "Linguistic", question: tier === "explorer" ? "Which is a noun? 'The cat sat on the mat.'" : "Identify the voice: 'The cake was eaten by the children.'", options: tier === "explorer" ? ["cat", "sat", "on", "the"] : ["Passive voice", "Active voice", "Imperative", "Exclamatory"], correctAnswer: 0 },
    { id: 8, subject: "English", subjectEmoji: "📚", domain: "Linguistic", question: "Choose the correct spelling:", options: ["Beautiful", "Beutiful", "Beautifull", "Beautful"], correctAnswer: 0 },
    { id: 9, subject: "Social Studies", subjectEmoji: "🏛️", domain: "Interpersonal", question: tier === "explorer" ? "What is the capital of India?" : "The Quit India Movement was launched in which year?", options: tier === "explorer" ? ["New Delhi", "Mumbai", "Kolkata", "Chennai"] : ["1942", "1930", "1920", "1947"], correctAnswer: 0 },
    { id: 10, subject: "Social Studies", subjectEmoji: "🏛️", domain: "Existential", question: "Why do we need rules in society?", options: ["To maintain order and fairness", "To punish people", "To make life difficult", "No reason"], correctAnswer: 0 },
    ...(tier !== "explorer" ? [
      { id: 11, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: "If a triangle has angles 60, 60, and 60, it is:", options: ["Equilateral", "Isosceles", "Scalene", "Right-angled"], correctAnswer: 0 },
      { id: 12, subject: "Science", subjectEmoji: "🔬", domain: "Logical", question: "Newton's third law states:", options: ["Every action has equal and opposite reaction", "F = ma", "Objects at rest stay at rest", "Energy cannot be created"], correctAnswer: 0 },
      { id: 13, subject: "English", subjectEmoji: "📚", domain: "Linguistic", question: "A word that modifies a verb is called:", options: ["Adverb", "Adjective", "Noun", "Pronoun"], correctAnswer: 0 },
      { id: 14, subject: "Social Studies", subjectEmoji: "🏛️", domain: "Interpersonal", question: "Democracy means:", options: ["Government by the people", "Rule by one person", "Military rule", "No government"], correctAnswer: 0 },
      { id: 15, subject: "Mathematics", subjectEmoji: "📐", domain: "Spatial", question: "The area of a circle with radius 7 cm is approximately:", options: ["154 cm^2", "44 cm^2", "22 cm^2", "49 cm^2"], correctAnswer: 0 },
    ] : []),
    ...(tier === "board" || tier === "pro" ? [
      { id: 16, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: "The discriminant of 2x^2 + 3x - 5 = 0 is:", options: ["49", "25", "9", "-31"], correctAnswer: 0 },
      { id: 17, subject: "Science", subjectEmoji: "🔬", domain: "Naturalistic", question: "Ozone layer protects us from:", options: ["UV radiation", "Infrared radiation", "Visible light", "Radio waves"], correctAnswer: 0 },
      { id: 18, subject: "English", subjectEmoji: "📚", domain: "Linguistic", question: "The figure of speech in 'The wind howled' is:", options: ["Personification", "Simile", "Metaphor", "Alliteration"], correctAnswer: 0 },
      { id: 19, subject: "Science", subjectEmoji: "🔬", domain: "Logical", question: "Ohm's law states:", options: ["V = IR", "F = ma", "E = mc^2", "PV = nRT"], correctAnswer: 0 },
      { id: 20, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: "Sum of first n natural numbers is:", options: ["n(n+1)/2", "n^2", "2n+1", "n(n-1)/2"], correctAnswer: 0 },
    ] : []),
    ...(tier === "pro" ? [
      { id: 21, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: "Integral of sin(x) dx is:", options: ["-cos(x) + C", "cos(x) + C", "sin(x) + C", "-sin(x) + C"], correctAnswer: 0 },
      { id: 22, subject: "Science", subjectEmoji: "🔬", domain: "Logical", question: "Heisenberg's uncertainty principle relates:", options: ["Position and momentum", "Energy and time", "Mass and velocity", "All of the above"], correctAnswer: 0 },
      { id: 23, subject: "English", subjectEmoji: "📚", domain: "Linguistic", question: "A 'red herring' in literature is:", options: ["A misleading clue", "A type of fish", "A character trait", "A plot device"], correctAnswer: 0 },
      { id: 24, subject: "Science", subjectEmoji: "🔬", domain: "Naturalistic", question: "IUPAC name of CH3-CH2-OH is:", options: ["Ethanol", "Methanol", "Propanol", "Butanol"], correctAnswer: 0 },
      { id: 25, subject: "Mathematics", subjectEmoji: "📐", domain: "Logical", question: "The rank of a 3x3 identity matrix is:", options: ["3", "1", "0", "9"], correctAnswer: 0 },
    ] : []),
  ];
}

// ═══ ENCOURAGING MICRO-FEEDBACK ═══
const POSITIVE_FEEDBACK = [
  "Great thinking! 🌟",
  "You're doing awesome! ✨",
  "Nice work! 🎉",
  "Keep it up! 💪",
  "Brilliant! ⭐",
  "Way to go! 🚀",
  "Fantastic effort! 🌈",
  "You're on fire! 🔥",
];

const NEUTRAL_FEEDBACK = [
  "Interesting choice! 🤔",
  "Good effort! Keep going! 💫",
  "That's how we learn! 🌱",
  "Every answer teaches us something! 📚",
  "Thinking is the goal! 🧠",
  "You're learning! 🌟",
];

function getRandomFeedback(isCorrect: boolean): string {
  const pool = isCorrect ? POSITIVE_FEEDBACK : NEUTRAL_FEEDBACK;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══ STORYBOOK POSITIVE LABELS ═══
function getStorybookDomainLabel(domain: { name: string; emoji: string; score: number; maxScore: number }): string {
  const pct = domain.score / domain.maxScore;
  const labels: Record<string, string[]> = {
    Logical: ["You love puzzles! 🧩", "You're a star at counting! ⭐"],
    Linguistic: ["You love stories! 📖", "Words are your superpower! ✨"],
    Spatial: ["You're an amazing artist! 🎨", "Colors love you! 🌈"],
    Musical: ["You love music! 🎵", "You're a little rockstar! 🎸"],
    Bodily: ["You love to move! 🤸", "Super active star! 💃"],
    Interpersonal: ["You're a great friend! 🤗", "Everyone loves playing with you! 💕"],
    Intrapersonal: ["You know yourself! 🧘", "You're so thoughtful! 💭"],
    Naturalistic: ["You love nature! 🌿", "Plant expert! 🌻"],
    Existential: ["You ask great questions! 💡", "So curious! 🔍"],
  };
  const domainLabels = labels[domain.name] || ["Amazing! ⭐"];
  return pct >= 0.6 ? domainLabels[0] : domainLabels[1];
}

// ═══ SUBJECT BREAK MESSAGES ═══
function getSubjectBreakMessage(completedSubject: string, nextSubject: string): { message: string; emoji: string } {
  const emojiMap: Record<string, string> = {
    Math: "🔢", Mathematics: "📐", Science: "🧪", English: "📚",
    "Social Studies": "🏛️", Stories: "📖", "My World": "🌍",
    Music: "🎵", Drawing: "🎨", Hindi: "🕉️",
  };
  return {
    message: `${completedSubject} done! Ready for ${nextSubject}?`,
    emoji: emojiMap[nextSubject] || "📝",
  };
}

// ═══ MAIN COMPONENT ═══
export default function SparkPage() {
  const { tier, isDark, student } = useTier();
  const { role } = useRole();
  const isParentView = role === "parent";
  const spark = DEMO_SPARK[tier];
  const [view, setView] = useState<"profile" | "test">("profile");

  // --- Test state ---
  const testConfig = getTestConfig(student.class);
  const demoQuestions = getDemoQuestions(tier);
  const totalQuestions = Math.min(testConfig.totalQuestions, demoQuestions.length);
  const questions = demoQuestions.slice(0, totalQuestions);

  const [testPhase, setTestPhase] = useState<"intro" | "active" | "break" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [answers, setAnswers] = useState<{ questionId: number; selected: number; confidence: ConfidenceLevel; correct: boolean }[]>([]);
  const [breakSubject, setBreakSubject] = useState<{ completed: string; next: string } | null>(null);

  // Silent timer tracking (no visible timer)
  const [silentStartTime] = useState<number>(Date.now());
  const [silentElapsed, setSilentElapsed] = useState(0);

  useEffect(() => {
    if (testPhase === "active") {
      const interval = setInterval(() => {
        setSilentElapsed(Math.floor((Date.now() - silentStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [testPhase, silentStartTime]);

  // Check for subject breaks
  const checkForSubjectBreak = useCallback((nextIndex: number): boolean => {
    if (nextIndex >= questions.length) return false;
    const currentSubject = questions[nextIndex - 1]?.subject;
    const nextSubject = questions[nextIndex]?.subject;
    if (currentSubject && nextSubject && currentSubject !== nextSubject) {
      setBreakSubject({ completed: currentSubject, next: nextSubject });
      setTestPhase("break");
      return true;
    }
    return false;
  }, [questions]);

  // Handle answer selection
  const handleSelectAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(optionIndex);
  };

  // Handle confidence selection (after answering)
  const handleConfidence = (level: ConfidenceLevel) => {
    if (confidence !== null || selectedAnswer === null) return;
    setConfidence(level);
    const isCorrect = selectedAnswer === questions[currentQ].correctAnswer;
    const feedback = getRandomFeedback(isCorrect);
    setFeedbackText(feedback);
    setShowFeedback(true);

    // Record answer
    setAnswers(prev => [...prev, {
      questionId: questions[currentQ].id,
      selected: selectedAnswer,
      confidence: level,
      correct: isCorrect,
    }]);

    // Auto-advance after showing feedback
    setTimeout(() => {
      setShowFeedback(false);
      const nextQ = currentQ + 1;
      if (nextQ >= questions.length) {
        setTestPhase("result");
      } else if (!checkForSubjectBreak(nextQ)) {
        setCurrentQ(nextQ);
        setSelectedAnswer(null);
        setConfidence(null);
      } else {
        // Subject break will handle the transition
        setCurrentQ(nextQ);
        setSelectedAnswer(null);
        setConfidence(null);
      }
    }, 1500);
  };

  // Continue after subject break
  const handleContinueAfterBreak = () => {
    setBreakSubject(null);
    setTestPhase("active");
  };

  // Reset test
  const handleResetTest = () => {
    setTestPhase("intro");
    setCurrentQ(0);
    setSelectedAnswer(null);
    setConfidence(null);
    setShowFeedback(false);
    setFeedbackText("");
    setAnswers([]);
    setBreakSubject(null);
  };

  // ═══ PROFILE VIEW ═══
  const renderProfileView = () => {
    const isStorybook = tier === "storybook";
    const isExplorer = tier === "explorer";
    const isStudio = tier === "studio";
    const isBoardOrPro = tier === "board" || tier === "pro";

    return (
      <>
        {/* ─── STORYBOOK TIER: Positive growth labels only ─── */}
        {isStorybook && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Your Superpowers! ⭐</h3>
              <p className="text-xs text-slate-500 mb-4">{student.name} is amazing at so many things!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {spark.domains.map((domain) => (
                  <motion.div
                    key={domain.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 bg-white/60 rounded-2xl p-3 border border-slate-100"
                  >
                    <span className="text-3xl">{domain.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-700">{getStorybookDomainLabel(domain)}</div>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.round((domain.score / domain.maxScore) * 5) ? "opacity-100" : "opacity-20"}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── EXPLORER TIER: Simple radar, strengths first ─── */}
        {isExplorer && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
              <h3 className={`text-sm font-bold mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Your Brain Map 🧠</h3>
              <div className="grid grid-cols-3 gap-4">
                {[...spark.domains]
                  .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))
                  .map((domain, i) => (
                    <div key={domain.name} className="flex items-center gap-3">
                      <GaugeRing value={domain.score} max={domain.maxScore} size={64} color={DOMAIN_COLORS[i % DOMAIN_COLORS.length]} strokeWidth={5}>
                        <span className="text-lg">{domain.emoji}</span>
                      </GaugeRing>
                      <div>
                        <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-700"}`}>{domain.name}</div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {i < 3 ? "Strength! 💪" : "Area to explore 🔭"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── STUDIO TIER: Full radar + subject snapshot ─── */}
        {isStudio && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
              <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Brain Radar + Subject Snapshot</h3>
              <p className={`text-xs mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Your brain is strongest in {spark.domains.reduce((a, b) => a.score / a.maxScore > b.score / b.maxScore ? a : b).name}! 🧠
              </p>
              <div className="grid grid-cols-3 gap-4">
                {spark.domains.map((domain, i) => (
                  <div key={domain.name} className="flex items-center gap-3">
                    <GaugeRing value={domain.score} max={domain.maxScore} size={64} color={DOMAIN_COLORS[i]} strokeWidth={5}>
                      <span className="text-lg">{domain.emoji}</span>
                    </GaugeRing>
                    <div>
                      <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-700"}`}>{domain.name}</div>
                      <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {domain.score}/{domain.maxScore}
                      </div>
                      <Tag
                        label={domain.level}
                        color={domain.level === "Exceptional" ? "green" : domain.level === "Advanced" ? "teal" : domain.level === "Proficient" ? "indigo" : domain.level === "Developing" ? "amber" : "rose"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── BOARD/PRO TIER: Detailed 9-domain radar, scores, strengths/weaknesses, plan ─── */}
        {isBoardOrPro && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
              <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>9-Domain Intelligence Radar</h3>
              <p className={`text-xs mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Detailed assessment across all cognitive domains
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {spark.domains.map((domain, i) => (
                  <div key={domain.name} className="flex items-center gap-3">
                    <GaugeRing value={domain.score} max={domain.maxScore} size={64} color={DOMAIN_COLORS[i]} strokeWidth={5}>
                      <span className="text-lg">{domain.emoji}</span>
                    </GaugeRing>
                    <div>
                      <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-700"}`}>{domain.name}</div>
                      <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {domain.score}/{domain.maxScore} ({Math.round((domain.score / domain.maxScore) * 100)}%)
                      </div>
                      <Tag
                        label={domain.level}
                        color={domain.level === "Exceptional" ? "green" : domain.level === "Advanced" ? "teal" : domain.level === "Proficient" ? "indigo" : domain.level === "Developing" ? "amber" : "rose"}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 ${isDark ? "bg-emerald-500/8 border border-emerald-500/15" : "bg-emerald-50 border border-emerald-100"}`}>
                  <h4 className={`text-xs font-bold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Top Strengths 💪</h4>
                  {[...spark.domains]
                    .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))
                    .slice(0, 3)
                    .map(d => (
                      <div key={d.name} className={`text-xs mb-1 ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
                        {d.emoji} {d.name} — {d.level}
                      </div>
                    ))}
                </div>
                <div className={`rounded-xl p-4 ${isDark ? "bg-amber-500/8 border border-amber-500/15" : "bg-amber-50 border border-amber-100"}`}>
                  <h4 className={`text-xs font-bold mb-2 ${isDark ? "text-amber-400" : "text-amber-700"}`}>Growth Areas 🌱</h4>
                  {[...spark.domains]
                    .sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))
                    .slice(0, 3)
                    .map(d => (
                      <div key={d.name} className={`text-xs mb-1 ${isDark ? "text-amber-300" : "text-amber-600"}`}>
                        {d.emoji} {d.name} — {d.level}
                      </div>
                    ))}
                </div>
              </div>

              {/* Personalized Plan (board/pro only) */}
              <div className={`mt-4 rounded-xl p-4 ${isDark ? "bg-indigo/8 border border-indigo/15" : "bg-indigo-50 border border-indigo-100"}`}>
                <h4 className={`text-xs font-bold mb-2 ${isDark ? "text-indigo-light" : "text-indigo"}`}>Personalized Plan 📋</h4>
                <div className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <p>1. Focus on {[...spark.domains].sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))[0].name} domain — schedule 2 extra practice sessions this week</p>
                  <p>2. Maintain your {[...spark.domains].sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))[0].name} strength with weekly challenges</p>
                  <p>3. Take the next SPARK assessment in 30 days to track growth</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ 6-CELL CONFIDENCE MATRIX (all tiers except storybook) ═══ */}
        {tier !== "storybook" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
              <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Confidence Matrix</h3>
              <p className={`text-xs mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                How well does {student.name} know what they know?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DEMO_CONFIDENCE_MATRIX.map((cell) => (
                  <div
                    key={cell.key}
                    className={`rounded-xl p-3 border ${isDark ? `${cell.bgClass} ${cell.borderClass}` : "bg-white border-slate-100"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black tracking-wide ${isDark ? cell.textClass : "text-slate-700"}`}>
                        {cell.label}
                      </span>
                      {cell.priority && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          cell.priority === "P0" ? "bg-red-500/20 text-red-400" :
                          cell.priority === "P1" ? "bg-indigo-500/20 text-indigo-400" :
                          "bg-slate-500/20 text-slate-400"
                        }`}>
                          {cell.priority}
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{cell.description}</div>
                    <div className={`text-xl font-black ${isDark ? cell.textClass : "text-slate-800"}`}>{cell.count}</div>
                    <ProgressBar value={cell.count} max={100} color={cell.key === "true_mastery" ? "green" : cell.key === "dangerous_misconception" ? "rose" : cell.key === "partial_understanding" ? "amber" : cell.key === "honest_gap" ? "indigo" : cell.key === "lucky_guess" ? "purple" : "indigo"} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ 6 SPARK TEST TYPES ═══ */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className={`${isDark ? "glass" : "glass-light"} p-6 mb-6`}>
            <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Test Types</h3>
            <p className={`text-xs mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              SPARK assesses you at different moments in your journey
            </p>
            <div className="flex flex-wrap gap-2">
              {SPARK_TEST_TYPES.map((type) => (
                <div
                  key={type.key}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${isDark ? "border-white/5 bg-white/3" : "border-slate-100 bg-white/60"}`}
                >
                  <span className="text-lg">{type.emoji}</span>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-700"}`}>{type.label}</div>
                    <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{type.description}</div>
                  </div>
                  <Tag label={type.key} color={type.color} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══ OVERALL ASSESSMENT + SCORE HISTORY ═══ */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-5`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Overall Assessment</h3>
              <div className="text-center mb-4">
                <div className={`text-3xl font-black ${isDark ? "text-indigo-light" : "text-indigo"}`}>{spark.overallLevel}</div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {spark.questionsAnswered} questions &middot; Last: {spark.testDate}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Top Domain</span>
                  <span className={`font-bold ${isDark ? "text-teal" : "text-teal-dark"}`}>
                    {spark.domains.reduce((a, b) => a.score / a.maxScore > b.score / b.maxScore ? a : b).name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Growth Area</span>
                  <span className={`font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                    {spark.domains.reduce((a, b) => a.score / a.maxScore < b.score / b.maxScore ? a : b).name}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-5`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Score History</h3>
              <div className="flex items-end gap-2 h-24">
                {[60, 65, 68, 72, 75, 78].map((score, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${i === 5 ? "bg-teal" : isDark ? "bg-indigo/40" : "bg-indigo/20"}`}
                      style={{ height: `${score}%` }}
                    />
                    <span className={`text-[8px] tabular-nums ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  };

  // ═══ PROGRESS DOTS (replaces "Q1 of 25") ═══
  const renderProgressDots = () => {
    return (
      <div className="flex items-center gap-1 flex-wrap max-w-xs">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < currentQ
                ? `w-2 h-2 ${isDark ? "bg-teal" : "bg-teal-600"}`  // answered
                : i === currentQ
                ? `w-3 h-3 ${isDark ? "bg-indigo-light" : "bg-indigo"} ring-2 ring-indigo/30` // current
                : `w-2 h-2 ${isDark ? "bg-white/10" : "bg-slate-200"}` // remaining
            }`}
          />
        ))}
      </div>
    );
  };

  // ═══ TEST VIEW ═══
  const renderTestView = () => {
    // --- INTRO PHASE ---
    if (testPhase === "intro") {
      return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className={`${isDark ? "glass" : "glass-light"} p-6`}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🧠</div>
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>SPARK Assessment</h2>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {testConfig.questions} ({testConfig.duration}) &middot; No right or wrong answers
              </p>
              {/* Max 15 min indicator */}
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium ${isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Max 15 min
              </div>
            </div>

            {/* Tier-specific description */}
            <div className={`text-center mb-6 ${isDark ? "text-slate-500" : "text-slate-400"} text-xs`}>
              {tier === "storybook" && "All fun and visual questions! Like a game 🎮"}
              {tier === "explorer" && "Explore how your brain works! Each question reveals a strength 🔭"}
              {tier === "studio" && "Comprehensive assessment across all domains and subjects 🔬"}
              {tier === "board" && "Detailed diagnostic to map your cognitive strengths for board prep 🎯"}
              {tier === "pro" && "Advanced intelligence mapping for competitive exam readiness 🚀"}
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTestPhase("active")}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                  isDark ? "bg-indigo text-white hover:bg-indigo/80" : "bg-indigo text-white hover:bg-indigo/90"
                }`}
              >
                {tier === "storybook" ? "Let's Play! 🎮" : "Start Assessment"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    }

    // --- SUBJECT BREAK PHASE ---
    if (testPhase === "break" && breakSubject) {
      const breakMsg = getSubjectBreakMessage(breakSubject.completed, breakSubject.next);
      return (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className={`${isDark ? "glass" : "glass-light"} p-8 text-center`}>
            <div className="text-5xl mb-4">{breakMsg.emoji}</div>
            <h2 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>
              {breakMsg.message}
            </h2>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Take a breath. You&apos;re doing great! 🌟
            </p>
            <div className="mb-6">
              {renderProgressDots()}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinueAfterBreak}
              className={`px-8 py-3 rounded-xl font-bold text-sm ${isDark ? "bg-teal text-white" : "bg-teal-600 text-white"}`}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      );
    }

    // --- RESULT PHASE ---
    if (testPhase === "result") {
      const correctCount = answers.filter(a => a.correct).length;
      const sureCorrect = answers.filter(a => a.confidence === "sure" && a.correct).length;
      const sureWrong = answers.filter(a => a.confidence === "sure" && !a.correct).length;
      const notSureCorrect = answers.filter(a => a.confidence === "not_sure" && a.correct).length;
      const notSureWrong = answers.filter(a => a.confidence === "not_sure" && !a.correct).length;
      const guessCorrect = answers.filter(a => a.confidence === "guess" && a.correct).length;
      const guessWrong = answers.filter(a => a.confidence === "guess" && !a.correct).length;

      const resultMatrix: { label: string; desc: string; count: number; colorClass: string; priority?: string }[] = [
        { label: "TRUE MASTERY", desc: "Sure + Correct", count: sureCorrect, colorClass: "text-emerald-400" },
        { label: "DANGEROUS MISCONCEPTION", desc: "Sure + Wrong", count: sureWrong, colorClass: "text-red-400", priority: "P0" },
        { label: "PARTIAL UNDERSTANDING", desc: "Not Sure + Correct", count: notSureCorrect, colorClass: "text-amber-400" },
        { label: "HONEST GAP", desc: "Not Sure + Wrong", count: notSureWrong, colorClass: "text-indigo-400", priority: "P1" },
        { label: "LUCKY GUESS", desc: "Guess + Correct", count: guessCorrect, colorClass: "text-purple-400" },
        { label: "NO KNOWLEDGE", desc: "Guess + Wrong", count: guessWrong, colorClass: "text-slate-400", priority: "P2" },
      ];

      // Tier-adapted result display
      if (tier === "storybook") {
        // Storybook: ONLY positive growth labels
        return (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className={`${isDark ? "glass" : "glass-light"} p-8 text-center`}>
              <div className="text-5xl mb-4">🌟</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Amazing job, {student.name}!</h2>
              <p className="text-sm text-slate-500 mb-6">You answered {answers.length} questions! You&apos;re a superstar!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {spark.domains.slice(0, 4).map(domain => (
                  <div key={domain.name} className="bg-white/60 rounded-2xl p-3 border border-slate-100">
                    <span className="text-2xl">{domain.emoji}</span>
                    <div className="text-sm font-bold text-slate-700 mt-1">{getStorybookDomainLabel(domain)}</div>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetTest}
                className="px-6 py-2.5 rounded-xl bg-indigo text-white font-bold text-sm"
              >
                Play Again! 🎮
              </motion.button>
            </div>
          </motion.div>
        );
      }

      return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className={`${isDark ? "glass" : "glass-light"} p-6`}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📊</div>
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Assessment Complete!</h2>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {correctCount}/{answers.length} correct &middot; Time: {Math.floor(silentElapsed / 60)}:{String(silentElapsed % 60).padStart(2, "0")}
              </p>
            </div>

            {/* Confidence Matrix Result */}
            {(tier === "explorer") && (
              <div className="mb-6">
                <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Your Strengths Shine! 🌟</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[...spark.domains]
                    .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))
                    .slice(0, 3)
                    .map(d => (
                      <div key={d.name} className={`text-center p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-white/60 border border-slate-100"}`}>
                        <span className="text-2xl">{d.emoji}</span>
                        <div className={`text-xs font-bold mt-1 ${isDark ? "text-white" : "text-slate-700"}`}>{d.name}</div>
                        <div className={`text-[10px] ${isDark ? "text-teal" : "text-teal-600"}`}>Strength! 💪</div>
                      </div>
                    ))}
                </div>
                <p className={`text-xs mt-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Areas to explore: {
                  [...spark.domains]
                    .sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))
                    .slice(0, 2)
                    .map(d => `${d.emoji} ${d.name}`)
                    .join(", ")
                }</p>
              </div>
            )}

            {/* Full confidence matrix for studio/board/pro */}
            {(tier === "studio" || tier === "board" || tier === "pro") && (
              <div className="mb-6">
                <h3 className={`text-sm font-bold mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Confidence Matrix</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {resultMatrix.map((cell) => (
                    <div
                      key={cell.label}
                      className={`rounded-xl p-3 border ${isDark ? "border-white/5 bg-white/3" : "border-slate-100 bg-white/60"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black tracking-wide ${isDark ? cell.colorClass : "text-slate-700"}`}>
                          {cell.label}
                        </span>
                        {cell.priority && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            cell.priority === "P0" ? "bg-red-500/20 text-red-400" :
                            cell.priority === "P1" ? "bg-indigo-500/20 text-indigo-400" :
                            "bg-slate-500/20 text-slate-400"
                          }`}>{cell.priority}</span>
                        )}
                      </div>
                      <div className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{cell.desc}</div>
                      <div className={`text-lg font-black mt-1 ${isDark ? cell.colorClass : "text-slate-800"}`}>{cell.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetTest}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm ${isDark ? "bg-indigo text-white" : "bg-indigo text-white"}`}
              >
                Retake Assessment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView("profile")}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm ${isDark ? "bg-white/5 text-slate-300 hover:bg-white/10" : "bg-slate-100 text-slate-700"}`}
              >
                View Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    }

    // --- ACTIVE TEST PHASE ---
    const q = questions[currentQ];
    const isStorybook = tier === "storybook";

    return (
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className={`${isDark ? "glass" : "glass-light"} p-6`}>
          {/* Header: Domain tag + Progress dots + Silent timer icon */}
          <div className="flex items-center justify-between mb-4">
            <Tag label={`${q.domain} Domain`} color="indigo" size="md" />
            <div className="flex items-center gap-3">
              {renderProgressDots()}
              {/* Silent tracking indicator — tiny clock, no numbers */}
              <div className={`${isDark ? "text-slate-600" : "text-slate-300"}`} title="Time is being tracked silently">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Subject tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">{q.subjectEmoji}</span>
            <span className={`text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>{q.subject}</span>
          </div>

          {/* Question */}
          <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-slate-800"} ${isStorybook ? "text-lg" : ""}`}>
            {q.question}
          </h3>

          {/* Answer options */}
          <div className={`grid ${isStorybook ? "grid-cols-2" : "grid-cols-2"} gap-3`}>
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const hasAnswered = selectedAnswer !== null;
              const isCorrectOption = i === q.correctAnswer;

              let optionStyle = "";
              if (hasAnswered && confidence !== null) {
                // After confidence is chosen, show correct/selected
                if (isCorrectOption) {
                  optionStyle = isDark
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = isDark
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-amber-300 bg-amber-50 text-amber-700";
                } else {
                  optionStyle = isDark
                    ? "border-white/5 bg-white/3 text-slate-500 opacity-50"
                    : "border-slate-100 bg-white text-slate-400 opacity-50";
                }
              } else if (isSelected) {
                // Selected but no confidence yet
                optionStyle = isDark
                  ? "border-indigo/50 bg-indigo/15 text-indigo-light ring-2 ring-indigo/30"
                  : "border-indigo/30 bg-indigo/10 text-indigo ring-2 ring-indigo/20";
              } else {
                optionStyle = isDark
                  ? "border-white/5 hover:border-indigo/30 bg-white/3 text-slate-300"
                  : "border-slate-100 hover:border-indigo/20 bg-white text-slate-700";
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                  whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={hasAnswered}
                  className={`${isStorybook ? "p-4 rounded-2xl text-2xl" : "p-3 rounded-xl text-sm text-left"} transition-all border ${optionStyle}`}
                >
                  {isStorybook ? opt : `(${String.fromCharCode(97 + i)}) ${opt}`}
                </motion.button>
              );
            })}
          </div>

          {/* ═══ CONFIDENCE TRACKING BUTTONS — shown after answer selection ═══ */}
          <AnimatePresence>
            {selectedAnswer !== null && confidence === null && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="mt-4"
              >
                <p className={`text-xs text-center mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  How sure are you?
                </p>
                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConfidence("sure")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      isDark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    Sure {isStorybook ? "😊" : ""}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConfidence("not_sure")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      isDark ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    Not Sure {isStorybook ? "🤔" : ""}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConfidence("guess")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      isDark ? "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20" : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    Guess {isStorybook ? "🎲" : ""}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ ENCOURAGING MICRO-FEEDBACK ═══ */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ y: 10, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.9 }}
                className={`mt-4 text-center py-3 rounded-xl ${
                  isDark ? "bg-white/5" : "bg-slate-50"
                }`}
              >
                <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  {feedbackText}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thin progress bar at bottom */}
          <div className="mt-6">
            <ProgressBar value={currentQ + 1} max={questions.length} color="indigo" />
          </div>
        </div>
      </motion.div>
    );
  };

  // ═══ MAIN RENDER ═══
  const content = (
    <div className={`min-h-screen ${tier === "storybook" ? "bg-storybook-bg" : "bg-navy"} relative overflow-hidden`}>
      <div className="blob blob-indigo w-96 h-96 -top-40 -right-40 opacity-10" />
      <div className="blob blob-teal w-80 h-80 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {tier === "storybook" ? "My Brain! 🧠" : "SPARK Brain Profile"}
              </h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {tier === "storybook"
                  ? `${student.name}'s Superpowers`
                  : `${student.name}'s 9-Domain Intelligence Map`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setView("profile"); handleResetTest(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "profile" ? (isDark ? "bg-indigo/15 text-indigo-light" : "bg-indigo/10 text-indigo") : (isDark ? "text-slate-500" : "text-slate-400")}`}
              >
                Profile
              </button>
              <button
                onClick={() => setView("test")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "test" ? (isDark ? "bg-indigo/15 text-indigo-light" : "bg-indigo/10 text-indigo") : (isDark ? "text-slate-500" : "text-slate-400")}`}
              >
                {tier === "storybook" ? "Play!" : "Take Test"}
              </button>
            </div>
          </div>
        </motion.div>

        {isParentView && (
          <div className={`mb-4 p-3 rounded-xl border ${isDark ? "bg-teal/5 border-teal/20" : "bg-teal-50 border-teal-200"}`}>
            <p className={`text-xs font-semibold ${isDark ? "text-teal" : "text-teal-700"}`}>
              Parent View — You are viewing {student.name}&apos;s brain profile. SPARK results help you understand how your child learns best.
            </p>
          </div>
        )}

        {view === "profile" && renderProfileView()}
        {view === "test" && renderTestView()}
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
