"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";
import Tag from "@/components/ui/Tag";
import { DEMO_ADMIN_USERS } from "@/lib/admin-demo-data";

const ROLE_FILTERS = ["All", "Student", "Parent", "Teacher", "School Admin", "Super Admin"];

function roleColor(role: string): "indigo" | "teal" | "amber" | "purple" | "rose" {
  switch (role) {
    case "Student": return "indigo";
    case "Parent": return "teal";
    case "Teacher": return "amber";
    case "School Admin": return "purple";
    case "Super Admin": return "rose";
    default: return "indigo";
  }
}

function statusTag(status: "active" | "inactive" | "suspended") {
  switch (status) {
    case "active":
      return <Tag label="Active" color="green" />;
    case "inactive":
      return <Tag label="Inactive" color="white" />;
    case "suspended":
      return <Tag label="Suspended" color="red" />;
  }
}

function roleEmoji(role: string): string {
  switch (role) {
    case "Student": return "🧑‍🎓";
    case "Parent": return "👩";
    case "Teacher": return "👩‍🏫";
    case "School Admin": return "🏫";
    case "Super Admin": return "👑";
    default: return "👤";
  }
}

// Mock activity data for expandable row
function getActivityHistory() {
  return [
    { action: "Completed SPARK Test — Mathematics", time: "10 min ago" },
    { action: "Reviewed Revision R3 — Fractions", time: "25 min ago" },
    { action: "Watched Tutorial — Decimal Operations", time: "1 hr ago" },
    { action: "Logged in from Chrome/Windows", time: "1 hr ago" },
  ];
}

export default function UsersTab() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filtered = DEMO_ADMIN_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Role counts
  const roleCounts = ROLE_FILTERS.reduce((acc, role) => {
    acc[role] =
      role === "All"
        ? DEMO_ADMIN_USERS.length
        : DEMO_ADMIN_USERS.filter((u) => u.role === role).length;
    return acc;
  }, {} as Record<string, number>);

  const columns = [
    { key: "user", label: "User" },
    { key: "role", label: "Role", width: "120px" },
    { key: "email", label: "Email" },
    { key: "lastActive", label: "Last Active", width: "120px" },
    { key: "status", label: "Status", align: "center" as const, width: "100px" },
  ];

  const rows = filtered.map((u) => ({
    user: (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo/30 flex items-center justify-center text-sm border border-white/10">
          {roleEmoji(u.role)}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-200">{u.name}</div>
          <div className="text-[10px] text-slate-500">ID: {u.id}</div>
        </div>
      </div>
    ),
    role: <Tag label={u.role} color={roleColor(u.role)} size="sm" />,
    email: <span className="text-slate-400 text-xs">{u.email}</span>,
    lastActive: (
      <span
        className={`text-xs ${
          u.lastActive.includes("min") || u.lastActive === "Just now"
            ? "text-emerald-400"
            : u.lastActive.includes("hr")
            ? "text-slate-400"
            : "text-slate-600"
        }`}
      >
        {u.lastActive}
      </span>
    ),
    status: statusTag(u.status),
  }));

  return (
    <div className="space-y-5">
      {/* Search + Filter */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <SearchBar
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={setSearch}
        />

        {/* Role filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {ROLE_FILTERS.map((role) => {
            const isActive = roleFilter === role;
            return (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-white/5 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/8"
                }`}
              >
                {role}
                <span className="ml-1.5 text-[10px] opacity-60">{roleCounts[role]}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4"
      >
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-semibold text-slate-400 text-${col.align || "left"} whitespace-nowrap`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={false}
                  className="border-t border-white/5"
                >
                  <td
                    className="px-4 py-3 text-left text-slate-300 cursor-pointer hover:bg-white/[0.03] transition-colors"
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                  >
                    <div className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: expandedRow === i ? 90 : 0 }}
                        className="text-[10px] text-slate-500"
                      >
                        ▶
                      </motion.span>
                      {row.user}
                    </div>
                    {/* Expandable activity history */}
                    <AnimatePresence>
                      {expandedRow === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-2 ml-10"
                        >
                          <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3 space-y-1.5">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                              Recent Activity
                            </div>
                            {getActivityHistory().map((a, ai) => (
                              <div key={ai} className="flex items-center gap-2 text-[11px]">
                                <div className="w-1 h-1 rounded-full bg-purple-500/60" />
                                <span className="text-slate-400">{a.action}</span>
                                <span className="text-slate-600 ml-auto">{a.time}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                  <td className="px-4 py-3 text-left text-slate-300">{row.role}</td>
                  <td className="px-4 py-3 text-left text-slate-300">{row.email}</td>
                  <td className="px-4 py-3 text-left text-slate-300">{row.lastActive}</td>
                  <td className="px-4 py-3 text-center text-slate-300">{row.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            No users match your search.
          </div>
        )}

        {/* Footer count */}
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-[11px] text-slate-500">
            Showing {filtered.length} of {DEMO_ADMIN_USERS.length} users
          </span>
          <span className="text-[11px] text-slate-600">
            {DEMO_ADMIN_USERS.filter((u) => u.status === "active").length} active
            {" · "}
            {DEMO_ADMIN_USERS.filter((u) => u.status === "inactive").length} inactive
            {" · "}
            {DEMO_ADMIN_USERS.filter((u) => u.status === "suspended").length} suspended
          </span>
        </div>
      </motion.div>
    </div>
  );
}
