"use client";
import { motion } from "framer-motion";
import Tag from "@/components/ui/Tag";
import { DEMO_DETECTED_GAPS } from "@/lib/admin-demo-data";

function priorityColor(priority: "P0" | "P1" | "P2"): "red" | "amber" | "white" {
  switch (priority) {
    case "P0": return "red";
    case "P1": return "amber";
    case "P2": return "white";
  }
}

function statusColor(status: string): "red" | "amber" | "green" | "indigo" | "purple" | "teal" {
  switch (status) {
    case "DETECTED": return "red";
    case "GENERATING": return "amber";
    case "SELECTED": return "indigo";
    case "DEPLOYED": return "teal";
    case "RESOLVED": return "green";
    default: return "purple";
  }
}

function statusEmoji(status: string): string {
  switch (status) {
    case "DETECTED": return "🔴";
    case "GENERATING": return "🟡";
    case "SELECTED": return "🔵";
    case "DEPLOYED": return "🟢";
    case "RESOLVED": return "✅";
    default: return "⚪";
  }
}

// Mock school spread data — which schools show this gap
const SCHOOL_GAP_SPREAD = [
  { school: "DPS R.K. Puram", affectedPct: 85 },
  { school: "Modern School", affectedPct: 72 },
  { school: "La Martiniere", affectedPct: 54 },
  { school: "Bishop Cotton", affectedPct: 41 },
  { school: "KV Bangalore", affectedPct: 28 },
  { school: "Springdale", affectedPct: 0 },
];

export default function DetectedGapsTab() {
  const p0Count = DEMO_DETECTED_GAPS.filter((g) => g.priority === "P0").length;
  const p1Count = DEMO_DETECTED_GAPS.filter((g) => g.priority === "P1").length;
  const p2Count = DEMO_DETECTED_GAPS.filter((g) => g.priority === "P2").length;
  const totalStudentsAffected = DEMO_DETECTED_GAPS.reduce((s, g) => s + g.students, 0);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Gaps", value: DEMO_DETECTED_GAPS.length, emoji: "🔍", color: "text-purple-400" },
          { label: "P0 Critical", value: p0Count, emoji: "🔴", color: "text-red-400" },
          { label: "Students Affected", value: totalStudentsAffected.toLocaleString(), emoji: "🎓", color: "text-amber-400" },
          { label: "Resolved", value: DEMO_DETECTED_GAPS.filter((g) => g.status === "RESOLVED").length, emoji: "✅", color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center"
          >
            <span className="text-xl">{stat.emoji}</span>
            <div className={`text-xl font-black ${stat.color} tabular-nums mt-1`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left: Misconception cards */}
        <div className="col-span-1 space-y-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Top Misconceptions
          </h2>
          {DEMO_DETECTED_GAPS.sort((a, b) => b.students - a.students).map((gap, i) => (
            <motion.div
              key={gap.concept}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{gap.concept}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    C{gap.class} · {gap.subject}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Tag label={gap.priority} color={priorityColor(gap.priority)} size="sm" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-2 italic">
                &quot;{gap.pattern}&quot;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{statusEmoji(gap.status)}</span>
                  <Tag label={gap.status} color={statusColor(gap.status)} size="sm" />
                </div>
                <div className="flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full">
                  <span className="text-[10px] font-bold text-red-400 tabular-nums">
                    {gap.students}
                  </span>
                  <span className="text-[9px] text-red-400/60">students</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center: Priority breakdown */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Priority Breakdown
          </h2>

          {/* Priority bars */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-5"
          >
            {[
              { label: "P0 — Critical", count: p0Count, total: DEMO_DETECTED_GAPS.length, color: "#ef4444", description: "Requires immediate remedial content generation" },
              { label: "P1 — High", count: p1Count, total: DEMO_DETECTED_GAPS.length, color: "#f59e0b", description: "Queued for next content sprint" },
              { label: "P2 — Medium", count: p2Count, total: DEMO_DETECTED_GAPS.length, color: "#64748b", description: "Monitoring, auto-resolves if engagement rises" },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-300">{p.label}</span>
                  <span className="text-lg font-black tabular-nums" style={{ color: p.color }}>
                    {p.count}
                  </span>
                </div>
                <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: p.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.count / p.total) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{p.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Status pipeline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Resolution Pipeline
            </h3>
            <div className="space-y-2">
              {["DETECTED", "GENERATING", "SELECTED", "DEPLOYED", "RESOLVED"].map((status, i) => {
                const count = DEMO_DETECTED_GAPS.filter((g) => g.status === status).length;
                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm">{statusEmoji(status)}</span>
                    <span className="text-xs text-slate-400 w-24">{status}</span>
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(count / DEMO_DETECTED_GAPS.length) * 100}%`,
                          backgroundColor:
                            status === "RESOLVED" ? "#10b981" :
                            status === "DEPLOYED" ? "#2dd4bf" :
                            status === "SELECTED" ? "#6366f1" :
                            status === "GENERATING" ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-300 tabular-nums w-6 text-right">
                      {count}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: School spread mini-heatmap */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            School Spread
          </h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
          >
            <p className="text-[10px] text-slate-500 mb-4">
              Percentage of students affected by top misconception (Fraction Addition) per school
            </p>
            <div className="space-y-2.5">
              {SCHOOL_GAP_SPREAD.map((s, i) => (
                <motion.div
                  key={s.school}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300 font-medium truncate">{s.school}</span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        s.affectedPct >= 70
                          ? "text-red-400"
                          : s.affectedPct >= 40
                          ? "text-amber-400"
                          : s.affectedPct > 0
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {s.affectedPct > 0 ? `${s.affectedPct}%` : "N/A"}
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          s.affectedPct >= 70
                            ? "#ef4444"
                            : s.affectedPct >= 40
                            ? "#f59e0b"
                            : s.affectedPct > 0
                            ? "#6366f1"
                            : "#1e293b",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.affectedPct}%` }}
                      transition={{ delay: 0.35 + i * 0.05, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Subject breakdown mini */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Gaps by Subject
            </h3>
            <div className="space-y-2">
              {(() => {
                const subjCounts: Record<string, number> = {};
                DEMO_DETECTED_GAPS.forEach((g) => {
                  subjCounts[g.subject] = (subjCounts[g.subject] || 0) + 1;
                });
                return Object.entries(subjCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([subj, count], i) => (
                    <motion.div
                      key={subj}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 + i * 0.04 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-slate-400 w-24">{subj}</span>
                      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500/60"
                          style={{ width: `${(count / DEMO_DETECTED_GAPS.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300 tabular-nums w-4 text-right">
                        {count}
                      </span>
                    </motion.div>
                  ));
              })()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
