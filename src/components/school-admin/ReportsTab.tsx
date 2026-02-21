"use client";
import { motion } from "framer-motion";
import { DEMO_REPORT_TYPES } from "@/lib/school-admin-demo-data";
import Tag from "@/components/ui/Tag";

export default function ReportsTab() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Reports & Analytics</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Generate, download, and schedule school-wide reports
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-xs font-semibold hover:bg-pink-500/30 transition-all border border-pink-500/20 flex items-center gap-1.5">
          <span>{"\u{1F4C5}"}</span>
          Schedule Report
        </button>
      </div>

      {/* Report type cards */}
      <div className="grid grid-cols-3 gap-4">
        {DEMO_REPORT_TYPES.map((report, i) => (
          <motion.div
            key={report.type}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.05 }}
          >
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 h-full flex flex-col">
              {/* Report header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-2xl shrink-0">
                  {report.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{report.type}</h4>
                  <Tag label={report.frequency} color="purple" />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                {report.description}
              </p>

              {/* Footer */}
              <div className="border-t border-white/5 pt-3 mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] text-slate-500">
                    Last generated: <span className="text-slate-400 font-medium">{report.lastGenerated}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-xl bg-pink-500/15 text-pink-400 text-xs font-semibold hover:bg-pink-500/25 transition-all border border-pink-500/15 flex items-center justify-center gap-1.5">
                    <span>{"\u2699\uFE0F"}</span>
                    Generate
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-1.5">
                    <span>{"\u{1F4E5}"}</span>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent reports list */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
        <h3 className="text-sm font-bold text-slate-300 mb-4">Recent Reports</h3>
        <div className="space-y-2">
          {[
            { name: "Weekly Digest - Feb 16, 2026", type: "Weekly Digest", status: "completed", size: "2.4 MB" },
            { name: "Weekly Digest - Feb 9, 2026", type: "Weekly Digest", status: "completed", size: "2.1 MB" },
            { name: "PTM Report - Class 10A - Feb 10, 2026", type: "PTM Report", status: "completed", size: "5.8 MB" },
            { name: "PTM Report - Class 7A - Feb 10, 2026", type: "PTM Report", status: "completed", size: "4.2 MB" },
            { name: "Term Report - Q3 2025", type: "Term Report", status: "completed", size: "12.6 MB" },
          ].map((report, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{"\u{1F4C4}"}</span>
                <div>
                  <div className="text-xs font-semibold text-slate-300">{report.name}</div>
                  <div className="text-[10px] text-slate-500">{report.type} | {report.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag label={report.status} color="green" />
                <button className="px-2 py-1 rounded-lg bg-white/5 text-slate-400 text-[10px] font-semibold hover:bg-white/10 hover:text-white transition-all">
                  {"\u{2B07}\uFE0F"} Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
