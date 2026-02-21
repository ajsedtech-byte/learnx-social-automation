"use client";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { DEMO_REVISION_HEALTH } from "@/lib/teacher-demo-data";

const HEAT_MAP_DATA = [
  ["Fractions", 35, 62, 45, 78, 28, 55, 40],
  ["Decimals", 68, 42, 55, 30, 72, 48, 60],
  ["Geometry", 25, 50, 38, 65, 45, 32, 55],
  ["Ratios", 70, 58, 82, 45, 35, 60, 75],
  ["Percentages", 40, 55, 48, 72, 60, 38, 50],
  ["Algebra", 85, 78, 90, 65, 72, 88, 80],
  ["Numbers", 92, 85, 88, 78, 82, 90, 86],
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getHeatColor(value: number): string {
  if (value >= 80) return "bg-emerald-500/60";
  if (value >= 60) return "bg-teal/40";
  if (value >= 40) return "bg-amber-400/35";
  if (value >= 25) return "bg-orange-400/35";
  return "bg-red-500/35";
}

function getHeatTextColor(value: number): string {
  if (value >= 80) return "text-emerald-300";
  if (value >= 60) return "text-teal";
  if (value >= 40) return "text-amber-300";
  if (value >= 25) return "text-orange-300";
  return "text-red-400";
}

export default function RevisionHealth() {
  const { onTrack, backlog, mastered, topStruggling, topMastered } = DEMO_REVISION_HEALTH;

  const summaryCards = [
    {
      label: "On Track",
      value: `${onTrack}%`,
      emoji: "✅",
      color: "text-teal",
      bgColor: "bg-teal/8 border-teal/15",
      description: "Students following their revision schedule",
    },
    {
      label: "Backlog",
      value: `${backlog}%`,
      emoji: "⏳",
      color: "text-amber-300",
      bgColor: "bg-amber-400/8 border-amber-400/15",
      description: "Students with overdue revision items",
    },
    {
      label: "Mastered",
      value: `${mastered}%`,
      emoji: "🏆",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/8 border-emerald-400/15",
      description: "Topics fully mastered by students",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.05 }}
          >
            <div className={`rounded-2xl border p-5 ${card.bgColor}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{card.emoji}</span>
                <div>
                  <div className={`text-2xl font-black ${card.color} tabular-nums`}>
                    {card.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-400">{card.label}</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">{card.description}</p>
              <div className="mt-3">
                <ProgressBar
                  value={parseInt(card.value)}
                  color={card.label === "On Track" ? "teal" : card.label === "Backlog" ? "amber" : "green"}
                  height="h-2"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Top 5 struggling topics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Top 5 Struggling Topics
          </h3>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-3">
            {topStruggling.map((topic, i) => (
              <div key={topic} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center text-[10px] font-bold text-red-400">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-300 flex-1">{topic}</span>
                <div className="w-24">
                  <ProgressBar
                    value={[35, 42, 48, 52, 55][i]}
                    color="bg-red-400"
                    height="h-1.5"
                  />
                </div>
                <span className="text-[10px] text-red-400 font-bold tabular-nums w-8 text-right">
                  {[35, 42, 48, 52, 55][i]}%
                </span>
                <Tag label="Struggling" color="red" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top 5 mastered topics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Top 5 Mastered Topics
          </h3>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-3">
            {topMastered.map((topic, i) => (
              <div key={topic} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-300 flex-1">{topic}</span>
                <div className="w-24">
                  <ProgressBar
                    value={[95, 93, 91, 88, 86][i]}
                    color="green"
                    height="h-1.5"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 font-bold tabular-nums w-8 text-right">
                  {[95, 93, 91, 88, 86][i]}%
                </span>
                <Tag label="Mastered" color="green" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Heat-map style grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Revision Accuracy Heat Map — This Week
        </h3>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
          {/* Day headers */}
          <div className="flex items-center mb-2">
            <div className="w-24 shrink-0" />
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex-1 text-center text-[10px] font-semibold text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heat map rows */}
          <div className="space-y-1.5">
            {HEAT_MAP_DATA.map(([topic, ...values]) => (
              <div key={topic as string} className="flex items-center">
                <div className="w-24 shrink-0 text-xs text-slate-400 font-medium truncate pr-2">
                  {topic as string}
                </div>
                <div className="flex-1 flex gap-1.5">
                  {(values as number[]).map((val, j) => (
                    <div
                      key={j}
                      className={`flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-bold ${getHeatColor(
                        val
                      )} ${getHeatTextColor(val)}`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/5">
            {[
              { label: "< 25%", color: "bg-red-500/35" },
              { label: "25-39%", color: "bg-orange-400/35" },
              { label: "40-59%", color: "bg-amber-400/35" },
              { label: "60-79%", color: "bg-teal/40" },
              { label: "80%+", color: "bg-emerald-500/60" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <span className="text-[10px] text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
