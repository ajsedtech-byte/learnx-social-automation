"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Tag from "@/components/ui/Tag";
import { DEMO_FEATURE_FLAGS } from "@/lib/admin-demo-data";

const SYSTEM_CONFIG = [
  { key: "API_VERSION", value: "v2.1.0", category: "Core" },
  { key: "MAX_SESSION_DURATION", value: "45 min", category: "Core" },
  { key: "JWT_EXPIRY", value: "15 min", category: "Security" },
  { key: "REFRESH_TOKEN_TTL", value: "7 days", category: "Security" },
  { key: "MAX_DEVICES", value: "3", category: "Security" },
  { key: "RATE_LIMIT", value: "100 req/min", category: "Security" },
  { key: "GEMINI_MODEL", value: "gemini-2.0-flash", category: "AI" },
  { key: "TTS_ENGINE", value: "Edge TTS", category: "AI" },
  { key: "IMAGE_GEN", value: "DALL-E 3 (placeholder)", category: "AI" },
  { key: "DB_ENGINE", value: "SQLite", category: "Storage" },
  { key: "DB_SIZE", value: "42 MB", category: "Storage" },
  { key: "CACHE_TTL", value: "5 min", category: "Storage" },
  { key: "CDN_ENABLED", value: "false", category: "Storage" },
];

const SEED_ACTIONS = [
  { label: "Seed Demo Students (50)", description: "Populate 50 demo student accounts with progress data", emoji: "🧑‍🎓" },
  { label: "Seed Curriculum C1-5", description: "Generate micro-topics and tutorials for classes 1-5", emoji: "📚" },
  { label: "Seed Curriculum C6-12", description: "Generate micro-topics and tutorials for classes 6-12", emoji: "📖" },
  { label: "Seed SPARK Tests", description: "Generate diagnostic SPARK tests for all classes", emoji: "⚡" },
  { label: "Seed Revision Data", description: "Populate R1-R10 revision schedules for demo students", emoji: "🔄" },
  { label: "Reset All Data", description: "Clear all data and start fresh (destructive)", emoji: "🗑️" },
];

export default function SettingsTab() {
  const [flags, setFlags] = useState(DEMO_FEATURE_FLAGS.map((f) => ({ ...f })));

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        {/* Feature Flags */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Feature Flags
            </h2>
            <span className="text-[10px] text-slate-500">
              {enabledCount}/{flags.length} enabled
            </span>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-1">
            {flags.map((flag, i) => (
              <motion.div
                key={flag.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
              >
                <ToggleSwitch
                  enabled={flag.enabled}
                  onChange={() => toggleFlag(flag.key)}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">{flag.label}</span>
                    <Tag
                      label={flag.enabled ? "ON" : "OFF"}
                      color={flag.enabled ? "green" : "white"}
                      size="sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{flag.description}</p>
                </div>
                <code className="text-[9px] text-slate-600 font-mono hidden group-hover:block">
                  {flag.key}
                </code>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Configuration */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            System Configuration
          </h2>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            {(() => {
              const categories = Array.from(new Set(SYSTEM_CONFIG.map((c) => c.category)));
              return categories.map((cat, ci) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + ci * 0.06 }}
                  className={ci > 0 ? "mt-4 pt-4 border-t border-white/5" : ""}
                >
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {cat}
                  </h3>
                  <div className="space-y-1.5">
                    {SYSTEM_CONFIG.filter((c) => c.category === cat).map((config) => (
                      <div
                        key={config.key}
                        className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/[0.03] transition-colors"
                      >
                        <code className="text-xs text-slate-400 font-mono">{config.key}</code>
                        <span className="text-xs font-semibold text-slate-300">{config.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* DB Seeding */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Database Seeding
          </h2>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-2">
            {SEED_ACTIONS.map((action, i) => {
              const isDestructive = action.label.includes("Reset");
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    isDestructive
                      ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-xl">{action.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200">{action.label}</div>
                    <p className="text-[10px] text-slate-500">{action.description}</p>
                  </div>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDestructive
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30"
                    }`}
                  >
                    {isDestructive ? "Reset" : "Seed"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* PDF Ingestion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            PDF Ingestion
          </h2>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
            {/* Upload area */}
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/30 transition-colors cursor-pointer">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-slate-300 font-medium">
                Drop textbook PDFs here
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Supports NCERT, ICSE, CBSE textbooks (up to 200MB)
              </p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/30 transition-colors">
                Browse Files
              </button>
            </div>

            {/* Processing queue */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Processing Queue
              </h3>
              <div className="space-y-2">
                {[
                  { name: "NCERT_Math_C10.pdf", pages: 320, status: "processing" as const, progress: 67 },
                  { name: "NCERT_Science_C9.pdf", pages: 280, status: "queued" as const, progress: 0 },
                  { name: "ICSE_English_C8.pdf", pages: 195, status: "complete" as const, progress: 100 },
                ].map((file, i) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <span className="text-lg">📄</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300 truncate">
                          {file.name}
                        </span>
                        <span className="text-[9px] text-slate-600">{file.pages}p</span>
                      </div>
                      {file.status === "processing" && (
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-1">
                          <motion.div
                            className="h-full rounded-full bg-purple-500/70"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      )}
                    </div>
                    <Tag
                      label={
                        file.status === "complete"
                          ? "Done"
                          : file.status === "processing"
                          ? `${file.progress}%`
                          : "Queued"
                      }
                      color={
                        file.status === "complete"
                          ? "green"
                          : file.status === "processing"
                          ? "purple"
                          : "white"
                      }
                      size="sm"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Extraction stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "PDFs Processed", value: "47", emoji: "📄" },
                { label: "Topics Extracted", value: "2,840", emoji: "📝" },
                { label: "Avg Accuracy", value: "94%", emoji: "🎯" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <span className="text-lg">{stat.emoji}</span>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">{stat.value}</div>
                  <div className="text-[9px] text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
