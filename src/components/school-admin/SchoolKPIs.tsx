"use client";
import { motion } from "framer-motion";
import { DEMO_SCHOOL, DEMO_SCHOOL_KPIS } from "@/lib/school-admin-demo-data";
import Tag from "@/components/ui/Tag";

export default function SchoolKPIs() {
  return (
    <div className="space-y-6">
      {/* School identity header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/20 flex items-center justify-center text-2xl">
              {"\u{1F3EB}"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{DEMO_SCHOOL.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <Tag label={DEMO_SCHOOL.board} color="rose" size="md" />
                <span className="text-xs text-slate-400">{DEMO_SCHOOL.city}</span>
                <span className="text-xs text-slate-500">|</span>
                <span className="text-xs text-slate-400">Code: <span className="font-mono text-pink-400">{DEMO_SCHOOL.code}</span></span>
                <span className="text-xs text-slate-500">|</span>
                <span className="text-xs text-slate-500">Est. {DEMO_SCHOOL.establishedYear}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Active Now</div>
              <div className="text-lg font-black text-pink-400 tabular-nums">
                {DEMO_SCHOOL.activeToday.toLocaleString()}
                <span className="text-xs text-slate-500 font-normal ml-1">/ {DEMO_SCHOOL.studentCount.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* KPI grid: 4 columns, 2 rows */}
      <div className="grid grid-cols-4 gap-3">
        {DEMO_SCHOOL_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.04 }}
          >
            <div
              className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 relative overflow-hidden"
              style={{ borderLeftColor: kpi.color, borderLeftWidth: 3 }}
            >
              {/* Subtle glow */}
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-10"
                style={{ background: kpi.color }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{kpi.emoji}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      kpi.trendUp
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {kpi.trendUp ? "\u2191" : "\u2193"} {kpi.trend}
                  </span>
                </div>
                <div className="text-xl font-black text-white tabular-nums">{kpi.value}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{kpi.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
