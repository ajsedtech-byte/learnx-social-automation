"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRole } from "@/context/RoleContext";
import { useTier } from "@/context/TierContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ParentSettings from "@/components/parent/ParentSettings";
import { DEMO_TEACHER } from "@/lib/teacher-demo-data";

function StudentSettings() {
  const { student } = useTier();
  const [lang, setLang] = useState("en");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>👤</span> Profile
        </h3>
        <div className="space-y-3">
          {[
            { label: "Name", value: student.name },
            { label: "Class", value: `Class ${student.class}${student.section}` },
            { label: "School", value: student.school },
            { label: "Board", value: "CBSE" },
            { label: "Email", value: `${student.name.toLowerCase()}@learnx.app` },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-sm text-slate-300">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🌐</span> Language
        </h3>
        <div className="flex gap-2">
          {[{ key: "en", label: "English" }, { key: "hi", label: "Hindi" }, { key: "hinglish", label: "Hinglish" }].map((l) => (
            <button
              key={l.key}
              onClick={() => setLang(l.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${lang === l.key ? "bg-indigo/20 text-indigo-light border border-indigo/30" : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Language change applies from next tutorial. Hindi/Sanskrit always in Hindi.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🎮</span> Engagement
        </h3>
        <div className="space-y-3">
          <ToggleSwitch enabled={false} label="Show on class leaderboard" />
          <ToggleSwitch enabled={true} label="Anonymous mode (leaderboard)" />
          <ToggleSwitch enabled={true} label="Sound effects" />
          <ToggleSwitch enabled={true} label="Animation effects" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🔐</span> Account
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            🔑 Change Password
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            📥 Export My Data
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4">⚙️ System Configuration</h3>
        <div className="space-y-3">
          {[
            { label: "API Endpoint", value: "https://api.learnx.app" },
            { label: "Database", value: "Supabase PostgreSQL" },
            { label: "Session Expiry", value: "7 days" },
            { label: "Rate Limit", value: "100 req/min" },
            { label: "Max Devices", value: "3 per student" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-xs text-teal font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4">🚩 Feature Flags</h3>
        <div className="space-y-3">
          <ToggleSwitch enabled={true} label="Revision Planner" />
          <ToggleSwitch enabled={true} label="Mistake Genome" />
          <ToggleSwitch enabled={true} label="GroerX Career" />
          <ToggleSwitch enabled={false} label="Leaderboard (Beta)" />
          <ToggleSwitch enabled={false} label="Mock Tests" />
          <ToggleSwitch enabled={false} label="PDF Ingestion" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4">🗄️ Database</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            🌱 Seed Demo Data
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-400 hover:bg-white/[0.06] transition-colors">
            📤 Export Database
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 transition-colors">
            ⚠️ Reset Database (requires confirmation)
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TeacherSettings() {
  const [defaultView, setDefaultView] = useState("overview");
  const [sortStudents, setSortStudents] = useState("name");
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [inactivityAlerts, setInactivityAlerts] = useState(true);
  const [contentFlagUpdates, setContentFlagUpdates] = useState(false);
  const [newEnrollmentAlerts, setNewEnrollmentAlerts] = useState(true);
  const [reportFormat, setReportFormat] = useState("pdf");
  const [autoWeeklyReports, setAutoWeeklyReports] = useState(true);
  const [ptmTemplate, setPtmTemplate] = useState("standard");

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>👩‍🏫</span> Profile
        </h3>
        <div className="space-y-3">
          {[
            { label: "Name", value: DEMO_TEACHER.name },
            { label: "Email", value: `${DEMO_TEACHER.name.toLowerCase().replace(/\s+/g, ".").replace("ms.", "")}@learnx.app` },
            { label: "School", value: DEMO_TEACHER.school },
            { label: "Subject Taught", value: DEMO_TEACHER.subject },
            { label: "Classes Assigned", value: DEMO_TEACHER.classes.join(", ") },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-sm text-slate-300">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Class Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>📋</span> Class Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Default View</label>
            <div className="flex gap-2">
              {[{ key: "overview", label: "Overview" }, { key: "students", label: "Students" }, { key: "revision", label: "Revision" }].map((v) => (
                <button
                  key={v.key}
                  onClick={() => setDefaultView(v.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${defaultView === v.key ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Sort Students By</label>
            <div className="flex gap-2">
              {[{ key: "name", label: "Name" }, { key: "performance", label: "Performance" }, { key: "activity", label: "Activity" }].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortStudents(s.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${sortStudents === s.key ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>🔔</span> Notification Preferences
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-5 rounded-full bg-indigo relative cursor-not-allowed opacity-80">
                <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 translate-x-5" />
              </div>
              <span className="text-sm text-slate-400">P0 Alert (student misconceptions)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">Always On</span>
          </div>
          <ToggleSwitch enabled={weeklyDigest} onChange={() => setWeeklyDigest(!weeklyDigest)} label="Weekly digest email" />
          <ToggleSwitch enabled={inactivityAlerts} onChange={() => setInactivityAlerts(!inactivityAlerts)} label="Student inactivity alerts (>3 days)" />
          <ToggleSwitch enabled={contentFlagUpdates} onChange={() => setContentFlagUpdates(!contentFlagUpdates)} label="Content flag updates" />
          <ToggleSwitch enabled={newEnrollmentAlerts} onChange={() => setNewEnrollmentAlerts(!newEnrollmentAlerts)} label="New student enrollment alerts" />
        </div>
      </motion.div>

      {/* Report Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>📊</span> Report Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Default Report Format</label>
            <div className="flex gap-2">
              {[{ key: "pdf", label: "PDF" }, { key: "csv", label: "CSV" }].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setReportFormat(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${reportFormat === f.key ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ToggleSwitch enabled={autoWeeklyReports} onChange={() => setAutoWeeklyReports(!autoWeeklyReports)} label="Auto-generate weekly reports" />
          <div>
            <label className="text-xs text-slate-500 mb-2 block">PTM Report Template</label>
            <div className="flex gap-2">
              {[{ key: "standard", label: "Standard" }, { key: "detailed", label: "Detailed" }, { key: "summary", label: "Summary" }].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPtmTemplate(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${ptmTemplate === t.key ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Privacy Note */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <div>
            <span className="text-[10px] font-bold text-amber-300">Privacy Note: </span>
            <span className="text-[10px] text-slate-500">
              Student names shown as First Name + Last Initial for privacy. Full names visible only to School Admin.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  const { role } = useRole();

  const content = (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1">⚙️ Settings</h1>
          <p className="text-sm text-slate-500 mb-6">Manage your preferences</p>
        </motion.div>

        {role === "parent" && <ParentSettings />}
        {role === "student" && <StudentSettings />}
        {(role === "super-admin" || role === "school-admin") && <AdminSettings />}
        {role === "teacher" && <TeacherSettings />}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{content}</main>
      </div>
    </>
  );
}
