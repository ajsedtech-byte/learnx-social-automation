"use client";
import { motion } from "framer-motion";
import {
  DEMO_PLATFORM_STATS,
  DEMO_ENGAGEMENT_HEATMAP,
  DEMO_DAU_TREND,
  DEMO_FEATURE_USAGE,
  DEMO_PLATFORM_ALERTS,
} from "@/lib/admin-demo-data";

function engagementColor(value: number): string {
  if (value >= 75) return "bg-emerald-500/80";
  if (value >= 55) return "bg-teal/60";
  if (value >= 40) return "bg-amber-400/60";
  if (value >= 25) return "bg-orange-400/50";
  return "bg-red-500/40";
}

function engagementText(value: number): string {
  if (value >= 75) return "text-emerald-200";
  if (value >= 55) return "text-teal";
  if (value >= 40) return "text-amber-200";
  return "text-red-300";
}

function severityStyle(severity: "critical" | "warning" | "info"): string {
  switch (severity) {
    case "critical":
      return "border-l-red-500 bg-red-500/5";
    case "warning":
      return "border-l-amber-400 bg-amber-400/5";
    case "info":
      return "border-l-blue-400 bg-blue-400/5";
  }
}

export default function PlatformPulse() {
  const maxDau = Math.max(...DEMO_DAU_TREND.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Stat cards row */}
      <div className="grid grid-cols-6 gap-3">
        {DEMO_PLATFORM_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center"
          >
            <div className="text-2xl mb-1.5">{stat.emoji}</div>
            <div className="text-xl font-black text-white tabular-nums">{stat.value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stat.label}</div>
            <div
              className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                stat.trendUp
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {stat.trendUp ? "↑" : "↓"} {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left 2/3: Heatmap + DAU */}
        <div className="col-span-2 space-y-4">
          {/* Engagement Heatmap */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              Engagement Heatmap
            </h2>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] text-slate-500 font-semibold pb-2 pr-3 w-16">
                      Class
                    </th>
                    {["Math", "Science", "English", "Hindi", "Social", "Life Skills"].map(
                      (subj) => (
                        <th
                          key={subj}
                          className="text-center text-[10px] text-slate-500 font-semibold pb-2 px-1"
                        >
                          {subj}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ENGAGEMENT_HEATMAP.map((row, ri) => (
                    <motion.tr
                      key={row.class}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + ri * 0.03 }}
                    >
                      <td className="text-xs font-semibold text-slate-400 py-0.5 pr-3">
                        C{row.class}
                      </td>
                      {row.subjects.map((subj) => (
                        <td key={subj.name} className="px-1 py-0.5">
                          <div
                            className={`heat-cell ${engagementColor(subj.engagement)} ${engagementText(subj.engagement)} mx-auto`}
                            title={`${subj.name} C${row.class}: ${subj.engagement}%`}
                          >
                            {subj.engagement}
                          </div>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {/* Legend */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                <span className="text-[9px] text-slate-500">Legend:</span>
                {[
                  { label: "75+", cls: "bg-emerald-500/80" },
                  { label: "55-74", cls: "bg-teal/60" },
                  { label: "40-54", cls: "bg-amber-400/60" },
                  { label: "25-39", cls: "bg-orange-400/50" },
                  { label: "<25", cls: "bg-red-500/40" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${l.cls}`} />
                    <span className="text-[9px] text-slate-500">{l.label}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* DAU Trend */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              DAU Trend (Last 7 Days)
            </h2>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
              <div className="flex items-end gap-2 h-36">
                {DEMO_DAU_TREND.map((d, i) => {
                  const heightPct = (d.value / maxDau) * 100;
                  return (
                    <motion.div
                      key={d.day}
                      className="flex-1 flex flex-col items-center gap-1"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.45 + i * 0.05, duration: 0.4 }}
                      style={{ transformOrigin: "bottom" }}
                    >
                      <span className="text-[10px] tabular-nums text-slate-400 font-semibold">
                        {(d.value / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-purple-500/60 to-purple-400/30 transition-all"
                        style={{ height: `${heightPct}%`, minHeight: 4 }}
                      />
                      <span className="text-[10px] text-slate-500 font-medium">{d.day}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right 1/3: Feature usage + Alerts */}
        <div className="space-y-4">
          {/* Feature Usage */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              Feature Adoption
            </h2>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-3">
              {DEMO_FEATURE_USAGE.map((f, i) => (
                <motion.div
                  key={f.feature}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-300 font-medium">{f.feature}</span>
                    <span className="text-xs text-slate-400 tabular-nums font-semibold">
                      {f.usage}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${f.usage}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alert Feed */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              Platform Alerts
            </h2>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 max-h-[340px] overflow-y-auto space-y-2">
              {DEMO_PLATFORM_ALERTS.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.04 }}
                  className={`border-l-2 rounded-lg px-3 py-2.5 ${severityStyle(alert.severity)}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">{alert.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {alert.message}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
