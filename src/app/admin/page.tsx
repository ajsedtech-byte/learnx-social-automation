"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import TabBar from "@/components/ui/TabBar";
import PlatformPulse from "@/components/admin/PlatformPulse";
import ContentTab from "@/components/admin/ContentTab";
import SchoolsTab from "@/components/admin/SchoolsTab";
import UsersTab from "@/components/admin/UsersTab";
import DetectedGapsTab from "@/components/admin/DetectedGapsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import { useEmbedded } from "@/context/EmbeddedContext";

const TABS = [
  { key: "pulse", label: "Platform Pulse", emoji: "📡" },
  { key: "content", label: "Content", emoji: "📝" },
  { key: "schools", label: "Schools", emoji: "🏫" },
  { key: "users", label: "Users", emoji: "👥" },
  { key: "gaps", label: "Detected Gaps", emoji: "🔍" },
  { key: "settings", label: "Settings", emoji: "⚙️" },
];

function ActiveTab({ tab }: { tab: string }) {
  switch (tab) {
    case "pulse":
      return <PlatformPulse />;
    case "content":
      return <ContentTab />;
    case "schools":
      return <SchoolsTab />;
    case "users":
      return <UsersTab />;
    case "gaps":
      return <DetectedGapsTab />;
    case "settings":
      return <SettingsTab />;
    default:
      return <PlatformPulse />;
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("pulse");
  const embedded = useEmbedded();

  const content = (
    <div className="min-h-screen bg-navy text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob blob-purple w-[500px] h-[500px] -top-40 -right-40 opacity-8" />
      <div className="blob blob-indigo w-[400px] h-[400px] -bottom-32 -left-32 opacity-5" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-5"
        >
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">👑 Super Admin</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
              ADMIN
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Platform-wide analytics, content pipeline, schools, users, and system configuration
          </p>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-6 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1.5"
        >
          <TabBar
            tabs={TABS}
            active={activeTab}
            onChange={setActiveTab}
            accentColor="#a855f7"
          />
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveTab tab={activeTab} />
          </motion.div>
        </AnimatePresence>
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
