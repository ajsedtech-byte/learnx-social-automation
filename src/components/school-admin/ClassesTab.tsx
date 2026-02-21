"use client";
import { motion } from "framer-motion";
import { DEMO_ALL_CLASSES } from "@/lib/school-admin-demo-data";
import DataTable from "@/components/ui/DataTable";
import ProgressBar from "@/components/ui/ProgressBar";

function AccuracyBadge({ value }: { value: number }) {
  const color =
    value >= 80
      ? "text-emerald-300 bg-emerald-400/15"
      : value >= 60
      ? "text-amber-300 bg-amber-400/15"
      : "text-red-400 bg-red-500/15";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${color}`}>
      {value}%
    </span>
  );
}

const columns = [
  { key: "class", label: "Class", width: "100px" },
  { key: "section", label: "Section", width: "80px" },
  { key: "teacher", label: "Teacher" },
  { key: "students", label: "Students", width: "90px", align: "center" as const },
  { key: "accuracy", label: "Avg Accuracy", width: "130px", align: "center" as const },
  { key: "coverage", label: "Coverage", width: "160px" },
];

export default function ClassesTab() {
  const totalStudents = DEMO_ALL_CLASSES.reduce((sum, c) => sum + c.studentCount, 0);
  const avgAccuracy = Math.round(
    DEMO_ALL_CLASSES.reduce((sum, c) => sum + c.avgAccuracy, 0) / DEMO_ALL_CLASSES.length
  );
  const avgCoverage = Math.round(
    DEMO_ALL_CLASSES.reduce((sum, c) => sum + c.coverage, 0) / DEMO_ALL_CLASSES.length
  );

  const rows = DEMO_ALL_CLASSES.map((cls) => ({
    class: <span className="font-semibold text-white">{cls.name}</span>,
    section: <span className="text-slate-300">{cls.section}</span>,
    teacher: <span className="text-slate-300">{cls.teacher}</span>,
    students: <span className="tabular-nums text-slate-300">{cls.studentCount}</span>,
    accuracy: <AccuracyBadge value={cls.avgAccuracy} />,
    coverage: (
      <div className="flex items-center gap-2">
        <ProgressBar
          value={cls.coverage}
          color={cls.coverage >= 80 ? "green" : cls.coverage >= 60 ? "amber" : "rose"}
          className="flex-1"
        />
        <span className="text-[11px] tabular-nums text-slate-400 w-10 text-right">{cls.coverage}%</span>
      </div>
    ),
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      {/* Summary strip */}
      <div className="flex items-center gap-6">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{"\u{1F3EB}"}</span>
          <div>
            <div className="text-xs text-slate-500">Total Classes</div>
            <div className="text-sm font-bold text-white">{DEMO_ALL_CLASSES.length}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{"\u{1F393}"}</span>
          <div>
            <div className="text-xs text-slate-500">Total Students</div>
            <div className="text-sm font-bold text-white">{totalStudents.toLocaleString()}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{"\u{1F3AF}"}</span>
          <div>
            <div className="text-xs text-slate-500">Avg Accuracy</div>
            <div className="text-sm font-bold text-emerald-300">{avgAccuracy}%</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{"\u{1F4CA}"}</span>
          <div>
            <div className="text-xs text-slate-500">Avg Coverage</div>
            <div className="text-sm font-bold text-sky-300">{avgCoverage}%</div>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-300">All Classes</h3>
          <span className="text-[10px] text-slate-500">{DEMO_ALL_CLASSES.length} classes across all grades</span>
        </div>
        <DataTable columns={columns} rows={rows} />
      </div>
    </motion.div>
  );
}
