"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import TabBar from "@/components/ui/TabBar";
import SchoolKPIs from "@/components/school-admin/SchoolKPIs";
import ClassesTab from "@/components/school-admin/ClassesTab";
import TeachersTab from "@/components/school-admin/TeachersTab";
import StudentsTab from "@/components/school-admin/StudentsTab";
import ReportsTab from "@/components/school-admin/ReportsTab";
import OnboardingWizard from "@/components/school-admin/OnboardingWizard";
import { useEmbedded } from "@/context/EmbeddedContext";

const TABS = [
  { key: "dashboard", label: "Dashboard", emoji: "\u{1F4CA}" },
  { key: "classes", label: "Classes", emoji: "\u{1F3EB}", badge: "2 new" },
  { key: "teachers", label: "Teachers", emoji: "\u{1F469}\u200D\u{1F3EB}", badge: "1 pending" },
  { key: "students", label: "Students", emoji: "\u{1F393}", badge: "5 new" },
  { key: "reports", label: "Reports", emoji: "\u{1F4C4}", badge: "3 ready" },
  { key: "onboarding", label: "Onboarding", emoji: "\u{1F680}", badge: "Step 2/4" },
];

export default function SchoolAdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const embedded = useEmbedded();

  const content = (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-rose w-[500px] h-[500px] -top-40 -right-40 opacity-8" />
      <div className="blob blob-purple w-80 h-80 bottom-40 -left-20 opacity-6" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Page header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold">
            <span className="mr-2">{"\u{1F3EB}"}</span>
            School Admin
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your school, classes, teachers, and students on LearnX
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <TabBar
            tabs={TABS}
            active={activeTab}
            onChange={setActiveTab}
            accentColor="#ec4899"
          />
        </motion.div>

        {/* Tab content */}
        {activeTab === "dashboard" && <SchoolKPIs />}
        {activeTab === "classes" && <ClassesTab />}
        {activeTab === "teachers" && <TeachersTab />}
        {activeTab === "students" && <StudentsTab />}
        {activeTab === "reports" && <ReportsTab />}
        {activeTab === "onboarding" && <OnboardingWizard />}
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
