"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DEMO_ALL_TEACHERS } from "@/lib/school-admin-demo-data";
import DataTable from "@/components/ui/DataTable";
import Tag from "@/components/ui/Tag";

const statusColorMap: Record<string, "green" | "amber" | "red"> = {
  active: "green",
  invited: "amber",
  inactive: "red",
};

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject", width: "120px" },
  { key: "classes", label: "Classes", width: "140px" },
  { key: "status", label: "Status", width: "90px", align: "center" as const },
  { key: "lastActive", label: "Last Active", width: "110px" },
  { key: "flags", label: "Flags", width: "70px", align: "center" as const },
];

export default function TeachersTab() {
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSubject, setInviteSubject] = useState("");
  const [inviteClasses, setInviteClasses] = useState("");

  const activeCount = DEMO_ALL_TEACHERS.filter((t) => t.status === "active").length;
  const invitedCount = DEMO_ALL_TEACHERS.filter((t) => t.status === "invited").length;
  const inactiveCount = DEMO_ALL_TEACHERS.filter((t) => t.status === "inactive").length;

  const rows = DEMO_ALL_TEACHERS.map((teacher) => ({
    name: <span className="font-semibold text-white">{teacher.name}</span>,
    email: <span className="text-slate-400 text-xs">{teacher.email}</span>,
    subject: <Tag label={teacher.subject} color="purple" />,
    classes: (
      <div className="flex flex-wrap gap-1">
        {teacher.classes.map((cls) => (
          <span
            key={cls}
            className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-slate-400 font-mono"
          >
            {cls}
          </span>
        ))}
      </div>
    ),
    status: <Tag label={teacher.status} color={statusColorMap[teacher.status]} />,
    lastActive: <span className="text-xs text-slate-400">{teacher.lastActive}</span>,
    flags: teacher.flags > 0 ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/15 text-amber-300 text-[11px] font-bold">
        {teacher.flags}
      </span>
    ) : (
      <span className="text-slate-600 text-xs">--</span>
    ),
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      {/* Invite Teacher form card */}
      <div className="rounded-2xl bg-white/[0.04] border border-pink-500/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{"\u2709\uFE0F"}</span>
          <h3 className="text-sm font-bold text-white">Invite Teacher</h3>
          <span className="text-[10px] text-slate-500 ml-auto">Teachers will receive an email invite with a setup link</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Ms. Priya Verma"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-pink-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teacher@school.edu"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-pink-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">Subject</label>
            <input
              type="text"
              value={inviteSubject}
              onChange={(e) => setInviteSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-pink-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">Classes</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteClasses}
                onChange={(e) => setInviteClasses(e.target.value)}
                placeholder="e.g. 7A, 8B"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-pink-500/40 transition-all"
              />
              <button className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-sm font-semibold hover:bg-pink-500/30 transition-all border border-pink-500/20">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Active:</span>
          <span className="font-bold text-white">{activeCount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-slate-400">Invited:</span>
          <span className="font-bold text-white">{invitedCount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-slate-400">Inactive:</span>
          <span className="font-bold text-white">{inactiveCount}</span>
        </div>
        <span className="text-xs text-slate-600 ml-auto">Total: {DEMO_ALL_TEACHERS.length} teachers</span>
      </div>

      {/* Data table */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <DataTable columns={columns} rows={rows} />
      </div>
    </motion.div>
  );
}
