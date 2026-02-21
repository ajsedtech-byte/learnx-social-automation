"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";
import DataTable from "@/components/ui/DataTable";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import { DEMO_CLASS_STUDENTS } from "@/lib/teacher-demo-data";

const STATUS_CONFIG: Record<string, { color: "green" | "teal" | "amber" | "red"; label: string }> = {
  excelling: { color: "green", label: "Excelling" },
  "on-track": { color: "teal", label: "On Track" },
  "needs-attention": { color: "amber", label: "Needs Attention" },
  "at-risk": { color: "red", label: "At Risk" },
};

const SPARK_PREVIEW: Record<string, { strengths: string; weaknesses: string; recommendation: string }> = {
  "1": { strengths: "Strong algebraic reasoning, consistent practice", weaknesses: "Geometry proofs need work", recommendation: "Challenge with advanced problems" },
  "2": { strengths: "Excellent at word problems, great streak", weaknesses: "Calculation speed could improve", recommendation: "Timed practice sessions" },
  "3": { strengths: "Good conceptual understanding", weaknesses: "Careless errors in computation", recommendation: "Focus on step-by-step verification" },
  "4": { strengths: "Top performer, all-round excellence", weaknesses: "Minimal — could explore Olympiad", recommendation: "Enroll in advanced challenges" },
  "5": { strengths: "Creative problem-solving approach", weaknesses: "Irregular attendance, many gaps", recommendation: "Urgent intervention needed — 1-on-1 session" },
  "6": { strengths: "Steady improvement trend", weaknesses: "Struggles with fractions", recommendation: "Targeted fraction remediation" },
  "7": { strengths: "Good at mental math", weaknesses: "Written explanations are weak", recommendation: "Practice showing work" },
  "8": { strengths: "Thorough and methodical", weaknesses: "Takes too long on tests", recommendation: "Speed drills, timed practice" },
  "9": { strengths: "Engaged when present", weaknesses: "Very irregular, large backlog", recommendation: "Parent meeting recommended" },
  "10": { strengths: "Exceptional accuracy, self-driven", weaknesses: "Could participate more in class", recommendation: "Peer tutoring opportunity" },
  "11": { strengths: "Improving steadily week over week", weaknesses: "Mensuration concepts", recommendation: "Visual learning aids for geometry" },
  "12": { strengths: "Good revision habits", weaknesses: "Data handling interpretation", recommendation: "Real-world data exercises" },
};

export default function StudentList() {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = DEMO_CLASS_STUDENTS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "name", label: "Student", width: "20%" },
    { key: "accuracy", label: "Accuracy", width: "12%", align: "center" as const },
    { key: "topics", label: "Topics Done", width: "18%" },
    { key: "streak", label: "Streak", width: "10%", align: "center" as const },
    { key: "lastActive", label: "Last Active", width: "15%" },
    { key: "status", label: "Status", width: "15%", align: "center" as const },
  ];

  const rows = filtered.map((student) => {
    const statusCfg = STATUS_CONFIG[student.status];
    return {
      name: (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/20 flex items-center justify-center text-xs font-bold text-amber-300">
            {student.name.charAt(0)}
          </div>
          <span className="font-semibold text-slate-200">{student.name}</span>
        </div>
      ),
      accuracy: (
        <span
          className={`font-bold tabular-nums ${
            student.accuracy >= 85
              ? "text-emerald-400"
              : student.accuracy >= 70
              ? "text-amber-300"
              : "text-red-400"
          }`}
        >
          {student.accuracy}%
        </span>
      ),
      topics: (
        <div className="flex items-center gap-2">
          <ProgressBar
            value={student.topicsDone}
            max={student.totalTopics}
            color={student.topicsDone / student.totalTopics >= 0.8 ? "green" : "amber"}
            height="h-1.5"
            className="flex-1"
          />
          <span className="text-[10px] text-slate-500 tabular-nums whitespace-nowrap">
            {student.topicsDone}/{student.totalTopics}
          </span>
        </div>
      ),
      streak: (
        <span className={`font-bold tabular-nums ${student.streak > 0 ? "text-amber-300" : "text-slate-600"}`}>
          {student.streak > 0 ? `${student.streak}d` : "--"}
        </span>
      ),
      lastActive: <span className="text-xs text-slate-400">{student.lastActive}</span>,
      status: <Tag label={statusCfg.label} color={statusCfg.color} />,
    };
  });

  const statusCounts = {
    all: DEMO_CLASS_STUDENTS.length,
    excelling: DEMO_CLASS_STUDENTS.filter((s) => s.status === "excelling").length,
    "on-track": DEMO_CLASS_STUDENTS.filter((s) => s.status === "on-track").length,
    "needs-attention": DEMO_CLASS_STUDENTS.filter((s) => s.status === "needs-attention").length,
    "at-risk": DEMO_CLASS_STUDENTS.filter((s) => s.status === "at-risk").length,
  };

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3"
      >
        <div className="flex-1 max-w-sm">
          <SearchBar
            placeholder="Search students by name..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "excelling", "on-track", "needs-attention", "at-risk"] as const).map((status) => {
            const isActive = statusFilter === status;
            const label = status === "all" ? "All" : STATUS_CONFIG[status]?.label || status;
            const count = statusCounts[status];
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-amber-400/15 text-amber-300 border border-amber-400/25"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Privacy notice */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/5 border border-amber-400/10">
          <span className="text-xs">🔒</span>
          <span className="text-[10px] text-amber-300/70">
            Privacy mode: Showing first name + last initial only. No contact info visible.
          </span>
        </div>
      </motion.div>

      {/* Data table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={(index) =>
            setExpandedRow(expandedRow === index ? null : index)
          }
        />
      </motion.div>

      {/* Expanded row — SPARK profile preview */}
      <AnimatePresence>
        {expandedRow !== null && filtered[expandedRow] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-white/[0.04] border border-amber-400/15 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/20 flex items-center justify-center text-lg font-bold text-amber-300">
                  {filtered[expandedRow].name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    {filtered[expandedRow].name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    SPARK Profile Preview — Analyze Only
                  </p>
                </div>
                <Tag
                  label={STATUS_CONFIG[filtered[expandedRow].status].label}
                  color={STATUS_CONFIG[filtered[expandedRow].status].color}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(() => {
                  const preview = SPARK_PREVIEW[filtered[expandedRow].id];
                  if (!preview) return null;
                  return (
                    <>
                      <div className="glass-sm p-3">
                        <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                          Strengths
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {preview.strengths}
                        </p>
                      </div>
                      <div className="glass-sm p-3">
                        <h5 className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                          Areas to Improve
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {preview.weaknesses}
                        </p>
                      </div>
                      <div className="glass-sm p-3">
                        <h5 className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                          AI Recommendation
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {preview.recommendation}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span>Accuracy: <span className="text-slate-300 font-bold">{filtered[expandedRow].accuracy}%</span></span>
                  <span>Topics: <span className="text-slate-300 font-bold">{filtered[expandedRow].topicsDone}/{filtered[expandedRow].totalTopics}</span></span>
                  <span>Streak: <span className="text-slate-300 font-bold">{filtered[expandedRow].streak}d</span></span>
                </div>
                <span className="text-[10px] text-slate-600 italic">Read-only view — teachers cannot modify student data</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary bar */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-500">
            Showing {filtered.length} of {DEMO_CLASS_STUDENTS.length} students
          </span>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-slate-500">
              Avg accuracy:{" "}
              <span className="text-teal font-bold">
                {Math.round(
                  filtered.reduce((acc, s) => acc + s.accuracy, 0) / filtered.length
                )}
                %
              </span>
            </span>
            <span className="text-slate-500">
              At-risk:{" "}
              <span className="text-red-400 font-bold">
                {filtered.filter((s) => s.status === "at-risk").length}
              </span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
