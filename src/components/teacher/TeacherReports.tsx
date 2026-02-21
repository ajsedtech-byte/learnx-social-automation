"use client";
import { motion } from "framer-motion";
import Tag from "@/components/ui/Tag";
import { DEMO_TEACHER_FLAGS, DEMO_TEACHER, DEMO_CLASS_STATS } from "@/lib/teacher-demo-data";

const FLAG_STATUS_CONFIG: Record<string, { color: "amber" | "indigo" | "green"; label: string }> = {
  open: { color: "amber", label: "Open" },
  reviewing: { color: "indigo", label: "Reviewing" },
  resolved: { color: "green", label: "Resolved" },
};

export default function TeacherReports() {
  return (
    <div className="space-y-6">
      {/* Export section */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Export & Download
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Export PDF for PTM */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center text-lg">
                📄
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Export PDF for PTM</h4>
                <p className="text-[10px] text-slate-500">
                  Generate parent-teacher meeting report
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Creates a detailed PDF report with student performance, accuracy trends,
              revision status, and AI-generated insights. Privacy-compliant — uses first name
              + last initial format.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-amber-400/15 text-amber-300 text-xs font-semibold hover:bg-amber-400/25 transition-all border border-amber-400/20">
                📄 Export PTM Report
              </button>
              <select className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-xs text-slate-300 outline-none appearance-none cursor-pointer">
                {DEMO_CLASS_STATS.map((c) => (
                  <option key={c.classId} value={c.classId} className="bg-[#0c1222]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Download Class Report */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo/15 flex items-center justify-center text-lg">
                📊
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Download Class Report</h4>
                <p className="text-[10px] text-slate-500">
                  Comprehensive class analytics export
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Download a full class analytics report including accuracy distribution,
              topic coverage, mistake patterns, and revision health metrics. Available
              in PDF and CSV formats.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-indigo/15 text-indigo-light text-xs font-semibold hover:bg-indigo/25 transition-all border border-indigo/20">
                📊 Download PDF
              </button>
              <button className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-400 text-xs font-semibold hover:bg-white/[0.1] transition-all border border-white/[0.08]">
                📋 Download CSV
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content flagging section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Content Flags
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Existing flags list */}
          <div className="col-span-2 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-300">Flagged Content</h4>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-500">
                  Open:{" "}
                  <span className="text-amber-300 font-bold">
                    {DEMO_TEACHER_FLAGS.filter((f) => f.status === "open").length}
                  </span>
                </span>
                <span className="text-slate-500">
                  Reviewing:{" "}
                  <span className="text-indigo-light font-bold">
                    {DEMO_TEACHER_FLAGS.filter((f) => f.status === "reviewing").length}
                  </span>
                </span>
                <span className="text-slate-500">
                  Resolved:{" "}
                  <span className="text-emerald-400 font-bold">
                    {DEMO_TEACHER_FLAGS.filter((f) => f.status === "resolved").length}
                  </span>
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {DEMO_TEACHER_FLAGS.map((flag) => {
                const statusCfg = FLAG_STATUS_CONFIG[flag.status];
                return (
                  <div
                    key={flag.id}
                    className={`glass-sm p-4 transition-all ${
                      flag.status === "open"
                        ? "border-amber-400/15"
                        : flag.status === "reviewing"
                        ? "border-indigo/15"
                        : "border-emerald-400/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-200">
                            {flag.content}
                          </span>
                          <Tag label={statusCfg.label} color={statusCfg.color} />
                        </div>
                        <p className="text-xs text-slate-400">{flag.issue}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-3">
                        {flag.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flag new content card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🚩</span>
              <h4 className="text-sm font-bold text-slate-300">Flag New Content</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Found an error in a tutorial, SPARK question, or any learning content?
              Flag it here for the content team to review.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">
                  Content Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tutorial: Fractions (C5)"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-amber-400/30 transition-all"
                  readOnly
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">
                  Issue Description
                </label>
                <textarea
                  placeholder="Describe the issue..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-amber-400/30 transition-all resize-none"
                  readOnly
                />
              </div>
              <button className="w-full px-4 py-2 rounded-xl bg-amber-400/15 text-amber-300 text-xs font-semibold hover:bg-amber-400/25 transition-all border border-amber-400/20">
                🚩 Submit Flag
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly digest preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Weekly Digest Preview
        </h3>
        <div className="rounded-2xl bg-white/[0.04] border border-amber-400/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center text-lg">
                📬
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">
                  Weekly Teaching Digest
                </h4>
                <p className="text-[10px] text-slate-500">
                  {DEMO_TEACHER.name} &middot; {DEMO_TEACHER.school} &middot; Week of Feb 17
                </p>
              </div>
            </div>
            <Tag label="Auto-generated" color="amber" size="md" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass-sm p-3">
              <h5 className="text-[10px] font-bold text-teal uppercase tracking-wider mb-1.5">
                This Week&apos;s Highlights
              </h5>
              <ul className="space-y-1">
                <li className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">+</span> Class 8A accuracy improved by 4%
                </li>
                <li className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">+</span> 3 students moved from &quot;at-risk&quot; to &quot;on-track&quot;
                </li>
                <li className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">+</span> Algebra coverage reached 85%
                </li>
              </ul>
            </div>
            <div className="glass-sm p-3">
              <h5 className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                Attention Needed
              </h5>
              <ul className="space-y-1">
                <li className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-amber-400">!</span> Vikram J. and Kabir T. inactive 3+ days
                </li>
                <li className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-amber-400">!</span> Fraction errors affect 30%+ of Class 7A
                </li>
                <li className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-amber-400">!</span> Geometry coverage below 65% target
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-sm p-3 mb-4">
            <h5 className="text-[10px] font-bold text-indigo-light uppercase tracking-wider mb-1.5">
              AI Recommendation
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consider dedicating an extra session to fraction operations — the &quot;adding numerators
              and denominators&quot; error pattern is widespread and indicates a foundational gap.
              For at-risk students, a brief 1-on-1 check-in can significantly improve re-engagement.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-xl bg-amber-400/15 text-amber-300 text-xs font-semibold hover:bg-amber-400/25 transition-all border border-amber-400/20">
                📧 Send to Email
              </button>
              <button className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-slate-400 text-xs font-semibold hover:bg-white/[0.1] transition-all border border-white/[0.08]">
                📱 Share via WhatsApp
              </button>
            </div>
            <span className="text-[10px] text-slate-600 italic">
              Digest auto-sends every Sunday at 9 PM
            </span>
          </div>
        </div>
      </motion.div>

      {/* Footer notice */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/5 border border-amber-400/10">
          <span className="text-xs">🔒</span>
          <span className="text-[10px] text-amber-300/70">
            Teacher portal is analyze-only. You can view and export data, flag content issues,
            but cannot create assignments, modify student data, or access contact information.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
