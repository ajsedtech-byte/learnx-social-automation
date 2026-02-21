"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DEMO_ALL_STUDENTS_SCHOOL } from "@/lib/school-admin-demo-data";
import DataTable from "@/components/ui/DataTable";
import SearchBar from "@/components/ui/SearchBar";
import Tag from "@/components/ui/Tag";

const statusColorMap: Record<string, "green" | "red"> = {
  active: "green",
  inactive: "red",
};

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
  { key: "name", label: "Name" },
  { key: "class", label: "Class", width: "80px" },
  { key: "accuracy", label: "Accuracy", width: "100px", align: "center" as const },
  { key: "lastActive", label: "Last Active", width: "120px" },
  { key: "status", label: "Status", width: "90px", align: "center" as const },
];

export default function StudentsTab() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");

  // Extract unique class values for filter pills
  const uniqueClasses = useMemo(() => {
    const classes = Array.from(new Set(DEMO_ALL_STUDENTS_SCHOOL.map((s) => s.class)));
    return classes.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""));
      const numB = parseInt(b.replace(/\D/g, ""));
      return numA - numB;
    });
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return DEMO_ALL_STUDENTS_SCHOOL.filter((student) => {
      const matchesSearch =
        search === "" ||
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.class.toLowerCase().includes(search.toLowerCase());
      const matchesClass = classFilter === "all" || student.class === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [search, classFilter]);

  const activeCount = filteredStudents.filter((s) => s.status === "active").length;
  const inactiveCount = filteredStudents.filter((s) => s.status === "inactive").length;

  const rows = filteredStudents.map((student) => ({
    name: <span className="font-semibold text-white">{student.name}</span>,
    class: (
      <span className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-slate-300 font-mono">
        {student.class}
      </span>
    ),
    accuracy: <AccuracyBadge value={student.accuracy} />,
    lastActive: <span className="text-xs text-slate-400">{student.lastActive}</span>,
    status: <Tag label={student.status} color={statusColorMap[student.status]} />,
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      {/* Action cards row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/[0.04] border border-pink-500/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-lg">{"\u{1F4E4}"}</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Bulk Enroll (CSV)</div>
            <div className="text-[10px] text-slate-500">Upload a CSV file to enroll students in bulk</div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-400 text-xs font-semibold hover:bg-pink-500/30 transition-all border border-pink-500/20">
            Upload
          </button>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-lg">{"\u{1F4E5}"}</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Export All Students</div>
            <div className="text-[10px] text-slate-500">Download complete student directory</div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-all border border-white/10">
            Export
          </button>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-lg">{"\u{1F4CA}"}</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Student Summary</div>
            <div className="text-[10px] text-slate-500">
              <span className="text-emerald-300 font-semibold">{activeCount}</span> active
              <span className="mx-1 text-slate-600">|</span>
              <span className="text-red-400 font-semibold">{inactiveCount}</span> inactive
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-white tabular-nums">{filteredStudents.length}</div>
            <div className="text-[10px] text-slate-500">shown</div>
          </div>
        </div>
      </div>

      {/* Search + filter strip */}
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <SearchBar
            placeholder="Search students by name or class..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setClassFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              classFilter === "all"
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            All Classes
          </button>
          {uniqueClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setClassFilter(cls)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                classFilter === cls
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <DataTable columns={columns} rows={rows} />
        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">{"\u{1F50D}"}</div>
            <div className="text-sm text-slate-400">No students match your search criteria</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
