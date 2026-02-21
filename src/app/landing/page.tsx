"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const TIERS_PREVIEW = [
  { name: "Storybook", classes: "Class 1-2", emoji: "\u{1F3A8}", color: "#fb923c", desc: "Big visuals, voice-first, animated stories, learning garden" },
  { name: "Explorer", classes: "Class 3-5", emoji: "\u{1F52D}", color: "#ffd700", desc: "Badge collection, hero academy, creature evolution, brain map" },
  { name: "Studio", classes: "Class 6-8", emoji: "\u{1F52C}", color: "#6366f1", desc: "Netflix-style subject browser, daily blueprint, momentum tracking" },
  { name: "Board", classes: "Class 9-10", emoji: "\u{1F3AF}", color: "#fb7185", desc: "Board exam countdown, PYQ bank, revision heatmap, mock tests" },
  { name: "Pro", classes: "Class 11-12", emoji: "\u{1F680}", color: "#10b981", desc: "Command deck, JEE/NEET prep, rank predictor, career dashboard" },
];

const FEATURES = [
  { emoji: "\u{1F9E0}", title: "SPARK Brain Profiling", desc: "9-domain intelligence mapping with adaptive diagnostic tests. Tracks cognitive, linguistic, mathematical, creative, and more.", color: "#6366f1" },
  { emoji: "\u{1F504}", title: "R1-R10 Revision System", desc: "Spaced repetition from Day 1 to Day 365. No-drop rule. Boost acceleration for perfection. Board exam mode for C10/C12.", color: "#2dd4bf" },
  { emoji: "\u{1F9EC}", title: "Mistake Genome", desc: "AI detects misconception patterns. P0 priority for dangerous mistakes. Traces root gaps to foundational class levels.", color: "#ef4444" },
  { emoji: "\u{1F49B}", title: "Life Skills", desc: "Story-based ethical dilemmas, not lectures. Tier-adapted from sharing crayons (C1) to systemic ethics (C12).", color: "#f59e0b" },
  { emoji: "\u{1F680}", title: "GroerX Career Intelligence", desc: "C6-8: Interest Radar. C9-10: Stream Explorer with recommendation. C11-12: Full career dashboard with exam readiness.", color: "#ec4899" },
  { emoji: "\u{1F4CB}", title: "Daily Blueprint", desc: "AI-generated daily tasks from 3 sources: new lessons, mistake fixes, and spaced revision. Adaptive to student performance.", color: "#a855f7" },
];

const STATS = [
  { value: "12,450", label: "Students" },
  { value: "180", label: "Schools" },
  { value: "15,280", label: "Tutorials" },
  { value: "20,000+", label: "Micro-Topics" },
  { value: "9", label: "Brain Domains" },
  { value: "5", label: "User Roles" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Create Family Account",
    desc: "Parent registers and adds their child in under 2 minutes. Select class, board, and language preference. No credit card needed.",
    icon: "\u{1F46A}",
    color: "#6366f1",
  },
  {
    step: 2,
    title: "SPARK Brain Profiling",
    desc: "Child takes an adaptive diagnostic that maps 9 intelligence domains. The AI understands how your child thinks, not just what they know.",
    icon: "\u{1F9E0}",
    color: "#2dd4bf",
  },
  {
    step: 3,
    title: "Personalized Learning Begins",
    desc: "AI generates a daily blueprint tailored to your child\u2019s brain profile, learning gaps, and revision schedule. Every day is different.",
    icon: "\u{2728}",
    color: "#a855f7",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Parent",
    school: "DPS Noida",
    rating: 5,
    text: "My daughter\u2019s confidence in Math improved in just 3 weeks. She used to cry before exams \u2014 now she asks for extra practice. The mistake genome feature is brilliant.",
    avatar: "\u{1F469}",
  },
  {
    name: "Arjun Mehta",
    role: "Student, Class 9",
    school: "Ryan International, Mumbai",
    rating: 5,
    text: "The revision system actually works. I used to forget everything after exams, but now the spaced repetition keeps bringing things back at just the right time.",
    avatar: "\u{1F468}\u200D\u{1F393}",
  },
  {
    name: "Kavitha Rajan",
    role: "Math Teacher",
    school: "Kendriya Vidyalaya, Chennai",
    rating: 5,
    text: "I can see exactly which concepts my class struggles with. The analytics dashboard saves me hours of guesswork. Now I can target my teaching precisely.",
    avatar: "\u{1F469}\u200D\u{1F3EB}",
  },
  {
    name: "Dr. Ramesh Gupta",
    role: "School Principal",
    school: "Modern Public School, Jaipur",
    rating: 5,
    text: "Enrollment and PTM reports are seamless. We onboarded 800 students via CSV in one afternoon. The parent communication has improved dramatically.",
    avatar: "\u{1F468}\u200D\u{1F4BC}",
  },
  {
    name: "Sneha Kulkarni",
    role: "Parent",
    school: "Vibgyor High, Pune",
    rating: 5,
    text: "Both my kids use it \u2014 my 7-year-old loves the story mode and my 14-year-old lives in the board exam prep. One app that adapts to both their levels.",
    avatar: "\u{1F469}",
  },
  {
    name: "Rohan Desai",
    role: "Student, Class 11",
    school: "FIITJEE, Hyderabad",
    rating: 5,
    text: "The career dashboard showed me paths I never considered. The JEE prep integration with daily blueprints keeps me on track without burnout.",
    avatar: "\u{1F468}\u200D\u{1F393}",
  },
];

const AI_FEATURES = [
  {
    icon: "\u{1F50D}",
    title: "8-Stage Content Pipeline",
    desc: "Every question passes through 10 quality gates: accuracy, grade-appropriateness, misconception traps, distractor quality, Bloom\u2019s alignment, language clarity, visual relevance, hint scaffolding, solution completeness, and board mapping.",
    color: "#6366f1",
  },
  {
    icon: "\u{1F4DA}",
    title: "51 Teaching Frameworks",
    desc: "From Bloom\u2019s Taxonomy to Polya\u2019s Problem Solving, Bruner\u2019s Spiral Curriculum to Vygotsky\u2019s ZPD \u2014 each topic is matched to the right pedagogy. The AI selects the framework that maximizes understanding for that concept and student.",
    color: "#2dd4bf",
  },
  {
    icon: "\u{1F9E9}",
    title: "Behavioral Intelligence",
    desc: "Silent tracking of time-per-question, confidence markers, answer-change patterns, session duration, and engagement curves. The system detects anxiety, guessing, and mastery \u2014 all without asking a single survey question.",
    color: "#a855f7",
  },
];

const PRICING_TIERS = [
  { round: "R1", name: "First Attempt", free: true },
  { round: "R2", name: "24hr Revision", free: true },
  { round: "R3", name: "3-Day Revision", free: true },
  { round: "R4", name: "Weekly Revision", free: true },
  { round: "R5", name: "Bi-Weekly Revision", free: true },
  { round: "R6", name: "Monthly Boost", free: false },
  { round: "R7", name: "Quarterly Deep", free: false },
  { round: "R8", name: "Half-Year Recall", free: false },
  { round: "R9", name: "Annual Review", free: false },
  { round: "R10", name: "Permanent Memory", free: false },
];

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "/" },
    { label: "API", href: "#" },
  ],
  "For Schools": [
    { label: "Enrollment", href: "#b2b" },
    { label: "Reports", href: "#b2b" },
    { label: "Admin Portal", href: "#b2b" },
    { label: "Contact Sales", href: "#b2b" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  Social: [
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      <div className="blob blob-indigo w-[600px] h-[600px] -top-60 -right-60 opacity-15" />
      <div className="blob blob-teal w-[500px] h-[500px] bottom-40 -left-40 opacity-10" />
      <div className="blob blob-purple w-[400px] h-[400px] top-1/2 right-1/4 opacity-8" />

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-black bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent">
          LearnX
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo to-teal text-white text-sm font-bold hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl font-black mb-4 leading-tight">
            Every child learns{" "}
            <span className="bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent">differently</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            K-12 Universal Course Engine. Adaptive dashboards that grow with your child.
            From playful stories to competitive exam prep — one platform, every dream.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo to-teal text-white font-bold text-lg hover:opacity-90 transition-opacity">
              {"\u{1F3AE}"} Try Demo
            </Link>
            <Link href="#b2b" className="px-8 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 font-semibold hover:bg-white/[0.1] transition-colors">
              {"\u{1F3EB}"} For Schools
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tier Preview */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-8"
        >
          5 Adaptive Tiers — Same app, 5 different experiences
        </motion.h2>
        <div className="grid grid-cols-5 gap-4">
          {TIERS_PREVIEW.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 text-center hover:bg-white/[0.06] transition-colors"
              style={{ borderTopColor: `${tier.color}40`, borderTopWidth: 3 }}
            >
              <div className="text-3xl mb-2">{tier.emoji}</div>
              <div className="text-sm font-bold text-white mb-1">{tier.name}</div>
              <div className="text-[10px] font-semibold mb-2" style={{ color: tier.color }}>{tier.classes}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{tier.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-2"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-slate-600 text-sm mb-14"
        >
          From sign-up to personalized learning in 3 simple steps
        </motion.p>
        <div className="relative flex items-start justify-between max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-8 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-[2px] bg-gradient-to-r from-indigo via-teal to-purple-500 opacity-30" />

          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center w-1/3 relative z-10"
            >
              {/* Numbered circle */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.2 + 0.1, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative"
                style={{
                  background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                  border: `2px solid ${step.color}50`,
                }}
              >
                <span className="text-2xl">{step.icon}</span>
                <span
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                  style={{ background: step.color }}
                >
                  {step.step}
                </span>
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[220px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-2"
        >
          Powered by 10 intelligent systems
        </motion.h2>
        <p className="text-center text-slate-600 text-sm mb-10">Each system works silently to personalize every student&apos;s journey</p>
        <div className="grid grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 hover:bg-white/[0.06] transition-colors"
            >
              <div className="text-2xl mb-3">{feature.emoji}</div>
              <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Board Selector */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-center">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Multi-Board Support</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {["CBSE", "ICSE", "IB", "Maharashtra", "MP Board", "Tamil Nadu", "Karnataka", "UP Board", "West Bengal"].map((board) => (
            <span key={board} className={`px-4 py-2 rounded-xl text-xs font-semibold ${board === "CBSE" ? "bg-indigo/20 text-indigo-light border border-indigo/30" : "bg-white/[0.04] text-slate-500 border border-white/[0.06]"}`}>
              {board}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-3">Phased: CBSE {"\u2192"} ICSE {"\u2192"} State Boards {"\u2192"} IB. Same concepts shared via conceptTag.</p>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-6 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Signals / Testimonials */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-2"
        >
          Trusted by Families Across India
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-slate-600 text-sm mb-10"
        >
          Hear from parents, students, teachers, and school leaders
        </motion.p>
        <div className="grid grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 hover:bg-white/[0.06] transition-colors backdrop-blur-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} className="text-yellow-400 text-sm">{"\u2B50"}</span>
                ))}
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-500">{t.role}</div>
                  <div className="text-[10px] text-slate-600">{t.school}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Powered by AI */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-2"
        >
          Powered by AI
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-slate-600 text-sm mb-10"
        >
          Built on research-grade AI systems that go far beyond simple question banks
        </motion.p>
        <div className="grid grid-cols-3 gap-4">
          {AI_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 hover:bg-white/[0.06] transition-colors relative overflow-hidden"
            >
              {/* Accent glow */}
              <div
                className="absolute top-0 left-0 w-full h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
              >
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free for Every Indian Student */}
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-10 text-center relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo/[0.05] via-transparent to-teal/[0.05] pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black mb-3">
                <span className="bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent">
                  Free for Every Indian Student
                </span>
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-3">
                Our mission: world-class education should never be behind a paywall.
                The core learning experience is completely free &mdash; forever.
              </p>
              <p className="text-[11px] text-slate-500 max-w-xl mx-auto mb-8">
                R1 through R5 (first five revision rounds) are free for every student.
                Premium unlocks R6-R10 for deep long-term memory, advanced analytics, and career tools.
              </p>
            </motion.div>

            {/* Pricing mini-table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              className="max-w-lg mx-auto"
            >
              <div className="rounded-xl overflow-hidden border border-white/[0.08]">
                {/* Table header */}
                <div className="grid grid-cols-3 bg-white/[0.06] px-4 py-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Round</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Description</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Access</span>
                </div>
                {/* Table rows */}
                {PRICING_TIERS.map((tier, i) => (
                  <motion.div
                    key={tier.round}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    viewport={{ once: true }}
                    className={`grid grid-cols-3 px-4 py-2 ${
                      i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                    } ${!tier.free ? "opacity-70" : ""}`}
                  >
                    <span className="text-xs font-mono font-bold text-white text-left">{tier.round}</span>
                    <span className="text-[11px] text-slate-400 text-left">{tier.name}</span>
                    <span className="text-right">
                      {tier.free ? (
                        <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-3">
                Premium plan coming soon. Early adopters get lifetime discounts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section id="b2b" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-10 text-center">
          <h2 className="text-3xl font-black text-white mb-2">{"\u{1F3EB}"} For Schools & Institutions</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto">
            Complete B2B solution with School Admin portal, Teacher analytics, bulk CSV enrollment,
            PTM reports, and LearnX Super Admin oversight.
          </p>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { emoji: "\u{1F4CA}", title: "Class Analytics", desc: "Real-time student performance across all classes" },
              { emoji: "\u{1F465}", title: "Bulk Enrollment", desc: "CSV upload with stream & elective support" },
              { emoji: "\u{1F4C4}", title: "PTM Reports", desc: "Per-student reports for parent-teacher meetings" },
              { emoji: "\u{1F512}", title: "Privacy Controls", desc: "Teachers see first name + last initial only" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="text-xl mb-2">{item.emoji}</div>
                <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                <div className="text-[10px] text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] pt-12 pb-8 mt-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Footer columns */}
          <div className="grid grid-cols-5 gap-8 mb-10">
            {/* Brand column */}
            <div className="col-span-1">
              <span className="text-xl font-black bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent">
                LearnX
              </span>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                K-12 Universal Course Engine. Free education for every Indian student.
              </p>
              <span className="text-[10px] text-slate-600 mt-2 inline-block">v2.0 &middot; LX20 Blueprint</span>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-bold text-white mb-3">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer bottom */}
          <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
            <div className="text-[10px] text-slate-600">
              &copy; 2026 LearnX. All rights reserved. Made with {"\u2764\uFE0F"} for India.
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Privacy</Link>
              <Link href="#" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Terms</Link>
              <Link href="#" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
