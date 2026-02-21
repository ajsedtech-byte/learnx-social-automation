"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Tag from "@/components/ui/Tag";

type FlagType = "Error" | "Misleading" | "Too Hard" | "Too Easy";
type FlagStatus = "Open" | "Reviewing" | "Resolved";

interface ContentFlag {
  id: string;
  questionPreview: string;
  questionId: string;
  flagType: FlagType;
  dateFlagged: string;
  status: FlagStatus;
  description: string;
}

const DEMO_FLAGS: ContentFlag[] = [
  {
    id: "FLG-001",
    questionPreview: "Q: What is the area of a circle with radius 7cm? Options list \u03C0r instead of \u03C0r\u00B2",
    questionId: "Q-4521",
    flagType: "Error",
    dateFlagged: "2026-02-19",
    status: "Open",
    description: "The formula shown in option B is incorrect - displays \u03C0r instead of \u03C0r\u00B2. Students selecting this get marked wrong even though it matches the displayed option.",
  },
  {
    id: "FLG-002",
    questionPreview: "Q: Simplify 3x + 2x - x. Answer key says 5x but correct answer is 4x.",
    questionId: "Q-4487",
    flagType: "Error",
    dateFlagged: "2026-02-18",
    status: "Reviewing",
    description: "Answer key has 5x as correct answer but 3x + 2x - x = 4x. Multiple students marked wrong incorrectly.",
  },
  {
    id: "FLG-003",
    questionPreview: "Q: Calculate compound interest for principal 50000 at 12% for 3 years compounded quarterly.",
    questionId: "Q-4502",
    flagType: "Too Hard",
    dateFlagged: "2026-02-17",
    status: "Open",
    description: "This question is tagged as Class 7 Medium difficulty but involves quarterly compounding which is Class 9+ level. 94% of students got it wrong.",
  },
];

const FLAG_TYPE_CONFIG: Record<FlagType, { color: "red" | "amber" | "purple" | "teal"; emoji: string }> = {
  "Error": { color: "red", emoji: "\u274C" },
  "Misleading": { color: "amber", emoji: "\u26A0\uFE0F" },
  "Too Hard": { color: "purple", emoji: "\u{1F4AA}" },
  "Too Easy": { color: "teal", emoji: "\u{1F4A4}" },
};

const STATUS_CONFIG: Record<FlagStatus, { color: "red" | "amber" | "green"; label: string }> = {
  "Open": { color: "red", label: "Open" },
  "Reviewing": { color: "amber", label: "Reviewing" },
  "Resolved": { color: "green", label: "Resolved" },
};

const FLAG_TYPES: FlagType[] = ["Error", "Misleading", "Too Hard", "Too Easy"];

export default function ContentFlags() {
  const [showForm, setShowForm] = useState(false);
  const [formContentId, setFormContentId] = useState("");
  const [formFlagType, setFormFlagType] = useState<FlagType>("Error");
  const [formDescription, setFormDescription] = useState("");

  return (
    <div className="space-y-6">
      {/* Header info */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-1">
                Content Flags
              </h3>
              <p className="text-xs text-slate-500">
                Report and track issues with questions, answer keys, and difficulty levels.
                Flagged content is reviewed by the content team and corrected.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-lg font-black text-red-400">{DEMO_FLAGS.filter((f) => f.status === "Open").length}</div>
                <div className="text-[10px] text-slate-500">Open</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-lg font-black text-amber-300">{DEMO_FLAGS.filter((f) => f.status === "Reviewing").length}</div>
                <div className="text-[10px] text-slate-500">Reviewing</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all"
              >
                {showForm ? "Cancel" : "\u{1F6A9} Flag New Content"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Flag form */}
      {showForm && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
            <h4 className="text-sm font-bold text-slate-300 mb-4">Flag New Content</h4>
            <div className="space-y-4">
              {/* Content ID */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Content / Question ID</label>
                <input
                  type="text"
                  value={formContentId}
                  onChange={(e) => setFormContentId(e.target.value)}
                  placeholder="e.g. Q-4521"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/30 transition-colors"
                />
              </div>

              {/* Flag type selector */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Flag Type</label>
                <div className="flex gap-2">
                  {FLAG_TYPES.map((type) => {
                    const cfg = FLAG_TYPE_CONFIG[type];
                    const isSelected = formFlagType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setFormFlagType(type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? "bg-red-500/15 border-red-500/25 text-red-300"
                            : "bg-white/[0.03] border-white/[0.06] text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <span>{cfg.emoji}</span>
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the issue with this content..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/30 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormContentId("");
                    setFormDescription("");
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/25 text-red-300 text-xs font-semibold hover:bg-red-500/30 transition-all"
                >
                  Submit Flag
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Flag list */}
      <div className="space-y-3">
        {DEMO_FLAGS.map((flag, i) => {
          const typeCfg = FLAG_TYPE_CONFIG[flag.flagType];
          const statusCfg = STATUS_CONFIG[flag.status];
          return (
            <motion.div
              key={flag.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <div
                className={`rounded-2xl bg-white/[0.04] border p-5 transition-all ${
                  flag.status === "Open" ? "border-red-500/20" : "border-white/[0.06]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Flag type icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      flag.flagType === "Error"
                        ? "bg-red-500/15"
                        : flag.flagType === "Misleading"
                        ? "bg-amber-400/15"
                        : flag.flagType === "Too Hard"
                        ? "bg-purple-500/15"
                        : "bg-teal/15"
                    }`}
                  >
                    {typeCfg.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-slate-600">{flag.questionId}</span>
                      <Tag label={flag.flagType} color={typeCfg.color} size="sm" />
                      <Tag label={statusCfg.label} color={statusCfg.color} size="sm" />
                      <span className="ml-auto text-[10px] text-slate-600">{flag.dateFlagged}</span>
                    </div>

                    <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                      {flag.questionPreview}
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {flag.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-4 gap-3">
          {FLAG_TYPES.map((type) => {
            const cfg = FLAG_TYPE_CONFIG[type];
            const count = DEMO_FLAGS.filter((f) => f.flagType === type).length;
            return (
              <div key={type} className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
                <div className="text-xl mb-1">{cfg.emoji}</div>
                <div className="text-lg font-black text-slate-200 mb-0.5">{count}</div>
                <div className="text-[10px] text-slate-400">{type}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
