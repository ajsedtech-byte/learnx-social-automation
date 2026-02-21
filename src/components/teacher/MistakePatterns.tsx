"use client";
import { motion } from "framer-motion";
import Tag from "@/components/ui/Tag";
import { DEMO_SHARED_MISTAKES, DEMO_CLASS_STUDENTS } from "@/lib/teacher-demo-data";

const SEVERITY_CONFIG: Record<string, { color: "red" | "amber" | "teal"; label: string }> = {
  high: { color: "red", label: "High" },
  medium: { color: "amber", label: "Medium" },
  low: { color: "teal", label: "Low" },
};

const TYPE_CONFIG: Record<string, { color: "purple" | "indigo" | "amber"; label: string }> = {
  CONCEPTUAL: { color: "purple", label: "Conceptual" },
  PROCEDURAL: { color: "indigo", label: "Procedural" },
  CARELESS: { color: "amber", label: "Careless" },
};

export default function MistakePatterns() {
  const totalStudents = DEMO_CLASS_STUDENTS.length;
  const sharedThreshold = Math.ceil(totalStudents * 0.3);

  return (
    <div className="space-y-6">
      {/* Header info */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-1">
                Mistake Genome Analysis
              </h3>
              <p className="text-xs text-slate-500">
                AI-detected patterns across your class. These are the most common errors students
                are making. Use these insights to adjust your teaching focus.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-lg font-black text-amber-300">{DEMO_SHARED_MISTAKES.length}</div>
                <div className="text-[10px] text-slate-500">Patterns</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-lg font-black text-red-400">
                  {DEMO_SHARED_MISTAKES.filter((m) => m.severity === "high").length}
                </div>
                <div className="text-[10px] text-slate-500">High Severity</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shared pattern banner */}
      {DEMO_SHARED_MISTAKES.filter((m) => m.studentCount >= sharedThreshold).length > 0 && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-xl bg-red-500/8 border border-red-500/15 px-4 py-3 flex items-center gap-3">
            <span className="text-base">🚨</span>
            <div>
              <span className="text-xs font-bold text-red-400">
                30%+ Shared Pattern Alert
              </span>
              <span className="text-xs text-slate-400 ml-2">
                {DEMO_SHARED_MISTAKES.filter((m) => m.studentCount >= sharedThreshold).length}{" "}
                mistake pattern{DEMO_SHARED_MISTAKES.filter((m) => m.studentCount >= sharedThreshold).length > 1 ? "s" : ""}{" "}
                affect more than 30% of your class — may indicate a teaching gap.
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mistake cards */}
      <div className="grid grid-cols-1 gap-3">
        {DEMO_SHARED_MISTAKES.map((mistake, i) => {
          const severityCfg = SEVERITY_CONFIG[mistake.severity];
          const typeCfg = TYPE_CONFIG[mistake.type];
          const isShared = mistake.studentCount >= sharedThreshold;
          const percentage = Math.round((mistake.studentCount / totalStudents) * 100);

          return (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12 + i * 0.05 }}
            >
              <div
                className={`rounded-2xl bg-white/[0.04] border p-5 transition-all ${
                  isShared ? "border-red-500/20" : "border-white/[0.06]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Severity indicator */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      mistake.severity === "high"
                        ? "bg-red-500/15"
                        : mistake.severity === "medium"
                        ? "bg-amber-400/15"
                        : "bg-teal/15"
                    }`}
                  >
                    {mistake.severity === "high" ? "🔴" : mistake.severity === "medium" ? "🟡" : "🟢"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-slate-200">{mistake.pattern}</h4>
                      {isShared && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-[10px] font-bold text-red-400 whitespace-nowrap">
                          30%+ shared
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      Subject: {mistake.subject}
                    </p>

                    <div className="flex items-center gap-3">
                      <Tag label={typeCfg.label} color={typeCfg.color} size="md" />
                      <Tag label={`${severityCfg.label} Severity`} color={severityCfg.color} size="md" />
                      <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">Affected:</span>
                          <span className="text-sm font-bold text-amber-300 tabular-nums">
                            {mistake.studentCount}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            ({percentage}%)
                          </span>
                        </div>

                        {/* Student dots */}
                        <div className="flex -space-x-1 ml-2">
                          {Array.from({ length: Math.min(mistake.studentCount, 5) }).map((_, j) => (
                            <div
                              key={j}
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/20 flex items-center justify-center text-[8px] font-bold text-amber-300"
                            >
                              {DEMO_CLASS_STUDENTS[j]?.name.charAt(0)}
                            </div>
                          ))}
                          {mistake.studentCount > 5 && (
                            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[8px] font-bold text-slate-400">
                              +{mistake.studentCount - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary insights */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
            <div className="text-lg font-black text-purple-300 mb-1">
              {DEMO_SHARED_MISTAKES.filter((m) => m.type === "CONCEPTUAL").length}
            </div>
            <div className="text-[10px] text-slate-400">Conceptual Errors</div>
            <p className="text-[9px] text-slate-600 mt-1">Core understanding gaps</p>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
            <div className="text-lg font-black text-indigo-light mb-1">
              {DEMO_SHARED_MISTAKES.filter((m) => m.type === "PROCEDURAL").length}
            </div>
            <div className="text-[10px] text-slate-400">Procedural Errors</div>
            <p className="text-[9px] text-slate-600 mt-1">Step/process mistakes</p>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
            <div className="text-lg font-black text-amber-300 mb-1">
              {DEMO_SHARED_MISTAKES.filter((m) => m.type === "CARELESS").length}
            </div>
            <div className="text-[10px] text-slate-400">Careless Errors</div>
            <p className="text-[9px] text-slate-600 mt-1">Attention/rush mistakes</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
