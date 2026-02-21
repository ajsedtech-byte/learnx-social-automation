"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import DataTable from "@/components/ui/DataTable";
import { DEMO_CONTENT_GAPS } from "@/lib/admin-demo-data";

const SUB_TABS = [
  { key: "library", label: "Library", emoji: "\u{1F4DA}" },
  { key: "generate", label: "Generate", emoji: "\u{1F916}" },
  { key: "validate", label: "Validate", emoji: "\u2705" },
  { key: "images", label: "Images", emoji: "\u{1F5BC}\uFE0F" },
  { key: "coverage", label: "Coverage", emoji: "\u{1F4C9}" },
];

const IMAGE_ASSETS = [
  { id: "IMG-001", subject: "Mathematics", title: "Geometry - Triangles", format: "SVG", status: "approved" as const, size: "24 KB" },
  { id: "IMG-002", subject: "Science", title: "Cell Structure Diagram", format: "PNG", status: "approved" as const, size: "142 KB" },
  { id: "IMG-003", subject: "Mathematics", title: "Algebra - Equations", format: "SVG", status: "pending" as const, size: "18 KB" },
  { id: "IMG-004", subject: "English", title: "Grammar Tree Diagram", format: "SVG", status: "approved" as const, size: "12 KB" },
  { id: "IMG-005", subject: "Science", title: "Periodic Table", format: "PNG", status: "review" as const, size: "89 KB" },
  { id: "IMG-006", subject: "Hindi", title: "Matra Chart", format: "SVG", status: "approved" as const, size: "15 KB" },
  { id: "IMG-007", subject: "Mathematics", title: "Number Line", format: "SVG", status: "pending" as const, size: "8 KB" },
  { id: "IMG-008", subject: "Science", title: "Human Skeleton", format: "PNG", status: "review" as const, size: "210 KB" },
  { id: "IMG-009", subject: "Social Studies", title: "India Map - States", format: "SVG", status: "approved" as const, size: "45 KB" },
];

const LIBRARY_ITEMS = [
  { id: "Q-15280", subject: "Mathematics", topic: "Algebra", type: "MCQ", difficulty: "Medium", status: "live" as const },
  { id: "Q-15279", subject: "Science", topic: "Cells", type: "Fill-in", difficulty: "Easy", status: "live" as const },
  { id: "Q-15278", subject: "English", topic: "Grammar", type: "MCQ", difficulty: "Hard", status: "draft" as const },
  { id: "Q-15277", subject: "Hindi", topic: "Comprehension", type: "Long Answer", difficulty: "Medium", status: "live" as const },
  { id: "Q-15276", subject: "Mathematics", topic: "Geometry", type: "MCQ", difficulty: "Easy", status: "review" as const },
  { id: "Q-15275", subject: "Science", topic: "Forces", type: "MCQ", difficulty: "Hard", status: "live" as const },
];

const PIPELINE_STAGES = [
  { stage: "Classify", count: 15280, total: 15280, emoji: "🏷️", status: "complete" as const },
  { stage: "Generate", count: 11155, total: 15280, emoji: "🤖", status: "in-progress" as const },
  { stage: "Validate", count: 9820, total: 15280, emoji: "✅", status: "in-progress" as const },
  { stage: "Approve", count: 9200, total: 15280, emoji: "👍", status: "in-progress" as const },
  { stage: "Voice (TTS)", count: 8400, total: 15280, emoji: "🔊", status: "pending" as const },
  { stage: "Image Gen", count: 6100, total: 15280, emoji: "🖼️", status: "pending" as const },
  { stage: "Deploy", count: 5800, total: 15280, emoji: "🚀", status: "pending" as const },
];

const BATCH_STATUS = [
  { id: "#47", items: 20, passed: 18, softFails: 2, hardFails: 0, status: "complete" as const, time: "1 hr ago" },
  { id: "#46", items: 25, passed: 25, softFails: 0, hardFails: 0, status: "complete" as const, time: "3 hr ago" },
  { id: "#45", items: 22, passed: 19, softFails: 1, hardFails: 2, status: "review" as const, time: "5 hr ago" },
  { id: "#44", items: 30, passed: 28, softFails: 2, hardFails: 0, status: "complete" as const, time: "1 day ago" },
  { id: "#43", items: 18, passed: 16, softFails: 0, hardFails: 2, status: "review" as const, time: "1 day ago" },
];

function stageColor(status: "complete" | "in-progress" | "pending"): string {
  switch (status) {
    case "complete": return "teal";
    case "in-progress": return "amber";
    case "pending": return "bg-slate-600";
  }
}

function stageTag(status: "complete" | "in-progress" | "pending"): { label: string; color: "green" | "amber" | "white" } {
  switch (status) {
    case "complete": return { label: "Done", color: "green" };
    case "in-progress": return { label: "Running", color: "amber" };
    case "pending": return { label: "Pending", color: "white" };
  }
}

function gapColor(gapPercent: number): "green" | "amber" | "red" {
  if (gapPercent <= 10) return "green";
  if (gapPercent <= 30) return "amber";
  return "red";
}

export default function ContentTab() {
  const [activeSubTab, setActiveSubTab] = useState("library");

  const coverageColumns = [
    { key: "class", label: "Class", width: "60px" },
    { key: "subject", label: "Subject" },
    { key: "total", label: "Total", align: "right" as const },
    { key: "covered", label: "Covered", align: "right" as const },
    { key: "gap", label: "Gap %", align: "center" as const },
    { key: "bar", label: "Coverage", width: "140px" },
  ];

  const coverageRows = DEMO_CONTENT_GAPS.map((g) => ({
    class: <span className="text-slate-300 font-semibold">C{g.class}</span>,
    subject: <span className="text-slate-300">{g.subject}</span>,
    total: <span className="tabular-nums text-slate-400">{g.total}</span>,
    covered: <span className="tabular-nums text-slate-300">{g.covered}</span>,
    gap: <Tag label={`${g.gapPercent}%`} color={gapColor(g.gapPercent)} size="sm" />,
    bar: <ProgressBar value={g.covered} max={g.total} color={g.gapPercent <= 10 ? "green" : g.gapPercent <= 30 ? "amber" : "rose"} showLabel />,
  }));

  function imageStatusTag(status: "approved" | "pending" | "review"): { label: string; color: "green" | "amber" | "purple" } {
    switch (status) {
      case "approved": return { label: "Approved", color: "green" };
      case "pending": return { label: "Pending", color: "amber" };
      case "review": return { label: "In Review", color: "purple" };
    }
  }

  function libraryStatusTag(status: "live" | "draft" | "review"): { label: string; color: "green" | "white" | "amber" } {
    switch (status) {
      case "live": return { label: "Live", color: "green" };
      case "draft": return { label: "Draft", color: "white" };
      case "review": return { label: "Review", color: "amber" };
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub-tab pill bar */}
      <div className="flex gap-1.5 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06] w-fit">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-light shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Library sub-tab */}
      {activeSubTab === "library" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Content Library
          </h2>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-200 tabular-nums">15,280</span>
                <span className="text-xs text-slate-500">total questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag label="MCQ: 9,820" color="indigo" size="sm" />
                <Tag label="Fill-in: 3,120" color="teal" size="sm" />
                <Tag label="Long: 2,340" color="purple" size="sm" />
              </div>
            </div>
            <div className="space-y-2">
              {LIBRARY_ITEMS.map((item, i) => {
                const statusCfg = libraryStatusTag(item.status);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="text-xs font-mono text-slate-500 w-16">{item.id}</span>
                    <span className="text-sm text-slate-300 font-medium w-28">{item.subject}</span>
                    <span className="text-sm text-slate-400 flex-1">{item.topic}</span>
                    <span className="text-xs text-slate-500 w-20">{item.type}</span>
                    <span className="text-xs text-slate-500 w-16">{item.difficulty}</span>
                    <Tag label={statusCfg.label} color={statusCfg.color} size="sm" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Generate sub-tab: Content Generation Pipeline */}
      {activeSubTab === "generate" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Content Generation Pipeline
          </h2>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            {/* Pipeline visualization */}
            <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-2">
              {PIPELINE_STAGES.map((s, i) => (
                <div key={s.stage} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className={`flex flex-col items-center px-4 py-3 rounded-xl border transition-all ${
                      s.status === "complete"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : s.status === "in-progress"
                        ? "bg-amber-400/10 border-amber-400/20"
                        : "bg-white/[0.03] border-white/[0.06]"
                    }`}
                  >
                    <span className="text-xl mb-1">{s.emoji}</span>
                    <span className="text-[10px] font-semibold text-slate-300">{s.stage}</span>
                    <span className="text-[9px] tabular-nums text-slate-500 mt-0.5">
                      {s.count.toLocaleString()}
                    </span>
                  </motion.div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div className="text-slate-600 mx-1 text-xs">{"\u2192"}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Pipeline bars */}
            <div className="space-y-3">
              {PIPELINE_STAGES.map((s, i) => {
                const tag = stageTag(s.status);
                return (
                  <motion.div
                    key={s.stage}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                  >
                    <span className="text-lg w-8 text-center">{s.emoji}</span>
                    <div className="w-24 text-sm font-medium text-slate-300">{s.stage}</div>
                    <div className="flex-1">
                      <ProgressBar
                        value={s.count}
                        max={s.total}
                        color={stageColor(s.status)}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-slate-400 w-16 text-right">
                      {s.count.toLocaleString()}
                    </span>
                    <Tag label={tag.label} color={tag.color} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Validate sub-tab: Batch Validation Status */}
      {activeSubTab === "validate" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Batch Validation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BATCH_STATUS.map((batch, i) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-200">Batch {batch.id}</span>
                  <Tag
                    label={batch.status === "complete" ? "Complete" : "Needs Review"}
                    color={batch.status === "complete" ? "green" : "amber"}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-xs font-bold text-slate-300">{batch.items}</div>
                    <div className="text-[9px] text-slate-500">Items</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400">{batch.passed}</div>
                    <div className="text-[9px] text-slate-500">Passed</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-400">{batch.softFails}</div>
                    <div className="text-[9px] text-slate-500">Soft-Fail</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-400">{batch.hardFails}</div>
                    <div className="text-[9px] text-slate-500">Hard-Fail</div>
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={batch.passed}
                    max={batch.items}
                    color={batch.hardFails > 0 ? "rose" : "green"}
                    height="h-1.5"
                  />
                </div>
                <div className="text-[9px] text-slate-500 mt-1 text-right">{batch.time}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Images sub-tab: Image Asset Management */}
      {activeSubTab === "images" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Image Asset Management
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Tag label={`${IMAGE_ASSETS.filter((i) => i.status === "approved").length} Approved`} color="green" size="sm" />
              <Tag label={`${IMAGE_ASSETS.filter((i) => i.status === "pending").length} Pending`} color="amber" size="sm" />
              <Tag label={`${IMAGE_ASSETS.filter((i) => i.status === "review").length} In Review`} color="purple" size="sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {IMAGE_ASSETS.map((img, i) => {
              const statusCfg = imageStatusTag(img.status);
              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 hover:bg-white/[0.06] transition-colors"
                >
                  {/* Image placeholder */}
                  <div className="w-full h-24 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-3">
                    <span className="text-3xl opacity-40">{"\u{1F5BC}\uFE0F"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-slate-200 leading-tight">{img.title}</h4>
                    <Tag label={statusCfg.label} color={statusCfg.color} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{img.subject}</span>
                    <span>{"\u00B7"}</span>
                    <span>{img.format}</span>
                    <span>{"\u00B7"}</span>
                    <span>{img.size}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 font-mono">{img.id}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Coverage sub-tab: Coverage Gap Report */}
      {activeSubTab === "coverage" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Coverage Gap Report
          </h2>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
            <DataTable columns={coverageColumns} rows={coverageRows} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
