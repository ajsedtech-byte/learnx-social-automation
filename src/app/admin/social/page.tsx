"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TabBar from "@/components/ui/TabBar";
import CalendarView from "@/components/admin/social/CalendarView";
import PostQueue from "@/components/admin/social/PostQueue";
import PlatformConnector from "@/components/admin/social/PlatformConnector";
import AnalyticsPanel from "@/components/admin/social/AnalyticsPanel";

const TABS = [
  { key: "calendar", label: "Calendar", emoji: "📅" },
  { key: "queue", label: "Queue", emoji: "📤" },
  { key: "platforms", label: "Platforms", emoji: "🔗", badge: "10" },
  { key: "analytics", label: "Analytics", emoji: "📊" },
];

function ActiveTab({ tab }: { tab: string }) {
  switch (tab) {
    case "calendar":
      return <CalendarView />;
    case "queue":
      return <PostQueue />;
    case "platforms":
      return <PlatformConnector />;
    case "analytics":
      return <AnalyticsPanel />;
    default:
      return <CalendarView />;
  }
}

export default function SocialAdminPage() {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-[#060a14] text-white relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed w-[500px] h-[500px] -top-40 -right-40 bg-indigo-600/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed w-[400px] h-[400px] -bottom-32 -left-32 bg-teal-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-5"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">📱 Social Media Automation</h1>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                365 days · 10 platforms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/admin"
                className="text-xs text-slate-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg transition"
              >
                Back to Admin
              </a>
              <button
                onClick={async () => {
                  if (!confirm("Generate 365-day calendar? This will create ~1,800 posts.")) return;
                  const res = await fetch("/api/calendar/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ start_date: new Date().toISOString().split("T")[0] }),
                  });
                  const data = await res.json();
                  alert(`Generated ${data.count || 0} posts!`);
                }}
                className="text-xs font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400/20 px-3 py-1.5 rounded-lg transition"
              >
                Generate Calendar
              </button>
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            Automated posting across Instagram, Facebook, Twitter, LinkedIn, Threads, Telegram, YouTube, Pinterest, WhatsApp & Reddit
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <TabBar
            tabs={TABS}
            active={activeTab}
            onChange={setActiveTab}
            accentColor="#2dd4bf"
          />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveTab tab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
