"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import TabBar from "@/components/ui/TabBar";
import ClassOverview from "@/components/teacher/ClassOverview";
import StudentList from "@/components/teacher/StudentList";
import RevisionHealth from "@/components/teacher/RevisionHealth";
import MistakePatterns from "@/components/teacher/MistakePatterns";
import ContentFlags from "@/components/teacher/ContentFlags";
import TeacherReports from "@/components/teacher/TeacherReports";
import { DEMO_TEACHER } from "@/lib/teacher-demo-data";
import { useEmbedded } from "@/context/EmbeddedContext";

const TABS = [
  { key: "overview", label: "Overview", emoji: "📋" },
  { key: "students", label: "Students", emoji: "👥" },
  { key: "revision", label: "Revision Health", emoji: "🔄" },
  { key: "mistakes", label: "Mistake Patterns", emoji: "🧬" },
  { key: "flags", label: "Flags", emoji: "🚩" },
  { key: "reports", label: "Reports", emoji: "📊" },
];

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClass, setSelectedClass] = useState("7A");
  const embedded = useEmbedded();

  const content = (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob blob-amber w-[500px] h-[500px] -top-40 -right-40 opacity-8" />
      <div className="blob blob-indigo w-80 h-80 bottom-40 -left-20 opacity-6" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Page header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">
              <span className="mr-2">👩‍🏫</span>Teacher Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[11px] font-semibold border border-amber-400/20">
                Analyze Only
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            {DEMO_TEACHER.name} &middot; {DEMO_TEACHER.subject} &middot; {DEMO_TEACHER.school}
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <TabBar
            tabs={TABS}
            active={activeTab}
            onChange={setActiveTab}
            accentColor="#f59e0b"
          />
        </motion.div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "overview" && (
            <ClassOverview
              selectedClass={selectedClass}
              onClassChange={setSelectedClass}
            />
          )}
          {activeTab === "students" && <StudentList />}
          {activeTab === "revision" && <RevisionHealth />}
          {activeTab === "mistakes" && <MistakePatterns />}
          {activeTab === "flags" && <ContentFlags />}
          {activeTab === "reports" && <TeacherReports />}
        </motion.div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
}
