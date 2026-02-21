"use client";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { DEMO_CAREERS, DEMO_SPARK } from "@/lib/demo-data";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import GlassCard from "@/components/ui/GlassCard";
import GaugeRing from "@/components/ui/GaugeRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   PARENT-SPECIFIC DATA
   ═══════════════════════════════════════════════════════════════════ */
const PARENT_CONVERSATION_STARTERS = [
  { emoji: "💬", topic: "Ask about their favorite subject this week", detail: "Children engage more when parents show genuine curiosity about specific topics" },
  { emoji: "🎯", topic: "Discuss what they want to be when they grow up", detail: "Open-ended career conversations help children explore without pressure" },
  { emoji: "🧪", topic: "Try a hands-on experiment together", detail: "Based on SPARK profile, your child shows strong naturalistic intelligence" },
  { emoji: "📖", topic: "Read a biography of someone in their top career match", detail: "Stories of real people make career paths feel tangible and achievable" },
];

const PARENT_STREAM_ADVICE = {
  studio: {
    title: "Interest Exploration Phase (Class 6-8)",
    advice: "At this stage, interests are still forming. Expose your child to diverse experiences — science fairs, art workshops, coding camps, sports. Don't push any specific stream yet.",
    doList: ["Encourage all subjects equally", "Try extracurriculars in different domains", "Watch for natural curiosity patterns", "Discuss 'what if' career scenarios casually"],
    dontList: ["Don't say 'you should become a doctor/engineer'", "Don't compare with other children's career choices", "Don't dismiss creative or unconventional interests"],
  },
  board: {
    title: "Stream Decision Phase (Class 9-10)",
    advice: "Your child will choose a stream after Class 10. Use the data below to have informed conversations. The AI recommendation is based on SPARK profile + academic performance + behavioral patterns.",
    doList: ["Discuss stream options using the match data", "Visit college open days together", "Talk to professionals in matched fields", "Consider aptitude test results seriously"],
    dontList: ["Don't force a stream based on family tradition", "Don't ignore low match scores — they indicate potential struggles", "Don't rush the decision — Class 10 results will refine recommendations"],
  },
  pro: {
    title: "Career Preparation Phase (Class 11-12)",
    advice: "Stream is chosen. Now focus on exam preparation and career path refinement. The career dashboard shows real data-driven matches. Use this to set realistic targets together.",
    doList: ["Set exam targets based on predicted rank", "Create a study schedule together", "Research specific colleges for top career matches", "Monitor exam readiness weekly"],
    dontList: ["Don't add pressure beyond what's needed", "Don't compare ranks with classmates publicly", "Don't dismiss backup options — they're safety nets, not failures"],
  },
};

export default function GroerXPage() {
  const { tier, student } = useTier();
  const { role } = useRole();
  const spark = DEMO_SPARK[tier];
  const isParent = role === "parent";

  // Tier-adapted view
  const getView = () => {
    if (tier === "storybook" || tier === "explorer") return "off";
    if (tier === "studio") return "interest-radar";
    if (tier === "board") return "stream-explorer";
    return "career-dashboard";
  };
  const view = getView();
  const parentAdvice = PARENT_STREAM_ADVICE[tier as "studio" | "board" | "pro"];

  const content = (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      <div className="blob blob-teal w-96 h-96 -top-40 -right-40 opacity-10" />
      <div className="blob blob-indigo w-80 h-80 bottom-20 -left-20 opacity-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1">
            {isParent ? "👨‍👩‍👧 " : ""}🚀 GroerX Career Intelligence
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            {isParent
              ? `${student.name}'s career interest profile — observe & guide, never push`
              : view === "off" ? "Available from Class 6"
              : view === "interest-radar" ? "Discover your interests"
              : view === "stream-explorer" ? "Explore stream options"
              : "Full career intelligence dashboard"}
          </p>
        </motion.div>

        {/* ── Parent Advisory Banner ── */}
        {isParent && view !== "off" && parentAdvice && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
            <GlassCard className="mb-6 border-teal/15">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">🧭</span>
                <div>
                  <h3 className="text-sm font-bold text-teal">{parentAdvice.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{parentAdvice.advice}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-sm p-3">
                  <h4 className="text-[10px] font-bold text-emerald-400 mb-2">✅ DO</h4>
                  <ul className="space-y-1">
                    {parentAdvice.doList.map((item, i) => (
                      <li key={i} className="text-[10px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-sm p-3">
                  <h4 className="text-[10px] font-bold text-rose-400 mb-2">❌ DON&apos;T</h4>
                  <ul className="space-y-1">
                    {parentAdvice.dontList.map((item, i) => (
                      <li key={i} className="text-[10px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-rose-400 mt-0.5">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {view === "off" && (
          <GlassCard className="text-center py-12">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-slate-300">Coming Soon</h2>
            <p className="text-sm text-slate-500 mt-2">
              {isParent
                ? `GroerX Career Intelligence will unlock when ${student.name} reaches Class 6`
                : "GroerX Career Intelligence unlocks from Class 6"}
            </p>
          </GlassCard>
        )}

        {view === "interest-radar" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <GlassCard className="mb-6">
              <h3 className="text-sm font-bold text-slate-300 mb-4">
                {isParent ? `${student.name}'s Interest Radar` : "Interest Radar"} — Based on SPARK + Performance
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {spark.domains.map((domain, i) => (
                  <div key={domain.name} className="flex items-center gap-3">
                    <GaugeRing value={domain.score} max={domain.maxScore} size={48} color={["#6366f1","#2dd4bf","#f472b6","#fbbf24","#8b5cf6","#fb923c","#10b981","#f43f5e","#06b6d4"][i]} strokeWidth={4}>
                      <span className="text-sm">{domain.emoji}</span>
                    </GaugeRing>
                    <div>
                      <div className="text-xs font-bold">{domain.name}</div>
                      <div className="text-[10px] text-slate-500">{domain.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="text-sm font-bold text-slate-300 mb-3">Emerging Interests</h3>
              <div className="flex gap-2 flex-wrap">
                {["Science & Tech", "Problem Solving", "Creative Arts", "Communication", "Nature"].map(interest => (
                  <Tag key={interest} label={interest} color="teal" size="md" />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {isParent
                  ? `Based on ${student.name}'s learning patterns — interests will sharpen over the next 2-3 years`
                  : "Based on your learning patterns — this will get more specific as you grow!"}
              </p>
            </GlassCard>
          </motion.div>
        )}

        {view === "stream-explorer" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            {isParent && (
              <div className="glass-sm p-3 mb-4 border-indigo/10">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span className="text-[10px] text-slate-400">
                    Match percentages are based on {student.name}&apos;s SPARK brain profile + subject performance. Higher match = higher predicted success & satisfaction.
                  </span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: "Science (PCM)", emoji: "⚡", desc: "Physics, Chemistry, Math — Engineering path", match: 88, exams: ["JEE Main", "JEE Adv", "BITSAT"] },
                { name: "Science (PCB)", emoji: "🧬", desc: "Physics, Chemistry, Biology — Medical path", match: 72, exams: ["NEET", "AIIMS", "JIPMER"] },
                { name: "Commerce", emoji: "📊", desc: "Accounts, Economics, Business — Finance path", match: 65, exams: ["CA", "CS", "CMA"] },
                { name: "Humanities", emoji: "📚", desc: "History, Political Sci, Psychology — Arts path", match: 58, exams: ["CLAT", "NID", "NIFT"] },
              ].map((stream) => (
                <GlassCard key={stream.name} hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stream.emoji}</span>
                      <div>
                        <h3 className="text-sm font-bold">{stream.name}</h3>
                        <p className="text-[10px] text-slate-400">{stream.desc}</p>
                      </div>
                    </div>
                    <GaugeRing value={stream.match} size={40} color="#2dd4bf" strokeWidth={3}>
                      <span className="text-[9px] font-bold text-teal">{stream.match}%</span>
                    </GaugeRing>
                  </div>
                  <div className="flex gap-1">
                    {stream.exams.map(exam => <Tag key={exam} label={exam} color="indigo" />)}
                  </div>
                </GlassCard>
              ))}
            </div>
            {isParent && (
              <GlassCard className="border-amber-500/10">
                <h3 className="text-sm font-bold text-amber-300 mb-3">📊 AI Recommendation Summary</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-sm p-3 text-center">
                    <div className="text-lg font-black text-teal">PCM</div>
                    <div className="text-[10px] text-slate-400">Strongest match</div>
                  </div>
                  <div className="glass-sm p-3 text-center">
                    <div className="text-lg font-black text-amber-400">88%</div>
                    <div className="text-[10px] text-slate-400">Match confidence</div>
                  </div>
                  <div className="glass-sm p-3 text-center">
                    <div className="text-lg font-black text-indigo-300">Engineering</div>
                    <div className="text-[10px] text-slate-400">Top career path</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3">
                  This recommendation will be refined after Class 10 board results. Current accuracy: ~78%.
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {view === "career-dashboard" && (
          <>
            {/* Career matches */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {isParent ? `${student.name}'s Top Career Matches` : "Top Career Matches"}
              </h2>
              <div className="space-y-3 mb-6">
                {DEMO_CAREERS.map((career) => (
                  <GlassCard key={career.title} hover>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{career.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold">{career.title}</h3>
                          <Tag label={`${career.match}% match`} color={career.match >= 90 ? "green" : career.match >= 80 ? "teal" : "amber"} />
                        </div>
                        <p className="text-xs text-slate-400">{career.description}</p>
                        <div className="flex gap-1 mt-1">
                          {career.domains.map(d => <Tag key={d} label={d} color="indigo" />)}
                        </div>
                      </div>
                      <ProgressBar value={career.match} color="teal" className="w-24" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>

            {/* SPARK domains affecting career */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <GlassCard>
                <h3 className="text-sm font-bold text-slate-300 mb-3">
                  {isParent ? `${student.name}'s Strengths → Career Fit` : "Your Strengths → Career Fit"}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {spark.domains.slice(0, 6).map((domain, i) => (
                    <div key={domain.name} className="flex items-center gap-2">
                      <GaugeRing value={domain.score} max={domain.maxScore} size={40} color={["#6366f1","#2dd4bf","#f472b6","#fbbf24","#8b5cf6","#fb923c"][i]} strokeWidth={3}>
                        <span className="text-sm">{domain.emoji}</span>
                      </GaugeRing>
                      <div>
                        <div className="text-xs font-bold">{domain.name}</div>
                        <Tag label={domain.level} color={domain.level === "Exceptional" ? "green" : domain.level === "Advanced" ? "teal" : "amber"} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Target info */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="glass-sm p-4 mt-4 border-teal/10">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <div>
                    <div className="text-xs font-bold text-teal">Current Target: NIT Tier-1 (Computer Science)</div>
                    <div className="text-[10px] text-slate-500">Based on JEE Main predicted rank ~12,400 and SPARK profile</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Parent-only: Exam Readiness Summary */}
            {isParent && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                <GlassCard className="mt-4 border-emerald-500/10">
                  <h3 className="text-sm font-bold text-emerald-400 mb-3">📈 Exam Readiness Summary for Parent</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "JEE Main", readiness: 72, color: "text-teal" },
                      { label: "JEE Advanced", readiness: 58, color: "text-amber-400" },
                      { label: "BITSAT", readiness: 80, color: "text-emerald-400" },
                      { label: "Board Exam", readiness: 85, color: "text-emerald-400" },
                    ].map((exam) => (
                      <div key={exam.label} className="glass-sm p-3 text-center">
                        <div className={`text-xl font-black ${exam.color}`}>{exam.readiness}%</div>
                        <div className="text-[10px] text-slate-400">{exam.label}</div>
                        <div className="h-1.5 rounded-full bg-white/5 mt-2">
                          <div className={`h-full rounded-full transition-all ${
                            exam.readiness >= 80 ? "bg-emerald-400" : exam.readiness >= 60 ? "bg-amber-400" : "bg-rose-400"
                          }`} style={{ width: `${exam.readiness}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-500 mt-3">
                    Readiness is calculated from topic coverage + revision depth + PYQ performance.
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </>
        )}

        {/* ── Parent-only: Conversation Starters ── */}
        {isParent && view !== "off" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <GlassCard className="mt-6 border-purple-500/10">
              <h3 className="text-sm font-bold text-purple-300 mb-3">💬 Conversation Starters</h3>
              <p className="text-[10px] text-slate-500 mb-3">
                AI-generated talking points based on {student.name}&apos;s SPARK profile and recent activity
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PARENT_CONVERSATION_STARTERS.map((cs) => (
                  <div key={cs.topic} className="glass-sm p-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{cs.emoji}</span>
                      <div>
                        <div className="text-xs font-medium text-slate-200">{cs.topic}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{cs.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Data Boundary for parent ── */}
        {isParent && view !== "off" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
            <div className="glass-sm p-3 border-amber-500/10 mt-4">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <div>
                  <span className="text-[10px] font-bold text-amber-300">Data Boundaries: </span>
                  <span className="text-[10px] text-slate-500">
                    Career data is for guidance only. Never pressure stream choice. AI recommendations improve with more data over time.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

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
