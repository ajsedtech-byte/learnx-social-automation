"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";
import DataTable from "@/components/ui/DataTable";
import Tag from "@/components/ui/Tag";
import { DEMO_SCHOOLS } from "@/lib/admin-demo-data";

function statusTag(status: "active" | "onboarding" | "inactive") {
  switch (status) {
    case "active":
      return <Tag label="Active" color="green" />;
    case "onboarding":
      return <Tag label="Onboarding" color="amber" />;
    case "inactive":
      return <Tag label="Inactive" color="red" />;
  }
}

export default function SchoolsTab() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.board.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "name", label: "School Name" },
    { key: "city", label: "City" },
    { key: "board", label: "Board", width: "80px" },
    { key: "students", label: "Students", align: "right" as const },
    { key: "teachers", label: "Teachers", align: "right" as const },
    { key: "dau", label: "DAU", align: "right" as const },
    { key: "status", label: "Status", align: "center" as const },
  ];

  const rows = filtered.map((s) => ({
    name: (
      <div>
        <div className="text-sm font-semibold text-slate-200">{s.name}</div>
        <div className="text-[10px] text-slate-500">ID: {s.id}</div>
      </div>
    ),
    city: <span className="text-slate-300">{s.city}</span>,
    board: <Tag label={s.board} color="purple" size="sm" />,
    students: (
      <span className="tabular-nums text-slate-300 font-semibold">
        {s.studentCount.toLocaleString()}
      </span>
    ),
    teachers: (
      <span className="tabular-nums text-slate-400">{s.teacherCount}</span>
    ),
    dau: (
      <span
        className={`tabular-nums font-semibold ${
          s.dau > 0 ? "text-emerald-400" : "text-slate-600"
        }`}
      >
        {s.dau > 0 ? s.dau.toLocaleString() : "—"}
      </span>
    ),
    status: statusTag(s.status),
  }));

  // Summary stats
  const totalStudents = DEMO_SCHOOLS.reduce((sum, s) => sum + s.studentCount, 0);
  const totalDau = DEMO_SCHOOLS.reduce((sum, s) => sum + s.dau, 0);
  const activeCount = DEMO_SCHOOLS.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Schools", value: DEMO_SCHOOLS.length, emoji: "🏫", color: "text-purple-400" },
          { label: "Active", value: activeCount, emoji: "🟢", color: "text-emerald-400" },
          { label: "Total Students", value: totalStudents.toLocaleString(), emoji: "🎓", color: "text-indigo-400" },
          { label: "Combined DAU", value: totalDau.toLocaleString(), emoji: "📊", color: "text-teal" },
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

      {/* Search + Create */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <div className="flex-1">
          <SearchBar
            placeholder="Search schools by name, city, or board..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold hover:bg-purple-500/30 transition-colors whitespace-nowrap">
          + Add School
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4"
      >
        <DataTable columns={columns} rows={rows} />
        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            No schools match your search.
          </div>
        )}
      </motion.div>
    </div>
  );
}
