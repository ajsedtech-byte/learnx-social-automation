"use client";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { DEMO_CLASS_STATS } from "@/lib/teacher-demo-data";

const SUBJECT_PROGRESS = [
  { name: "Algebra", progress: 85, color: "amber" },
  { name: "Geometry", progress: 62, color: "amber" },
  { name: "Numbers", progress: 91, color: "amber" },
  { name: "Data Handling", progress: 74, color: "amber" },
  { name: "Mensuration", progress: 58, color: "amber" },
];

const RECENT_ACTIVITY = [
  { text: "Ananya M. scored 98% on SPARK Algebra test", time: "10 min ago", emoji: "⚡" },
  { text: "Vikram J. resumed after 3-day absence", time: "1 hr ago", emoji: "🔄" },
  { text: "Class 7A average accuracy rose by 3%", time: "2 hr ago", emoji: "📈" },
  { text: "Rohan K. completed overdue revision set", time: "3 hr ago", emoji: "✅" },
  { text: "5 students flagged for revision backlog", time: "Today", emoji: "⚠️" },
];

interface ClassOverviewProps {
  selectedClass: string;
  onClassChange: (classId: string) => void;
}

export default function ClassOverview({ selectedClass, onClassChange }: ClassOverviewProps) {
  const classData = DEMO_CLASS_STATS.find((c) => c.classId === selectedClass) || DEMO_CLASS_STATS[0];

  const statCards = [
    { label: "Students", value: classData.students, emoji: "👥", color: "text-amber-300" },
    { label: "Avg Accuracy", value: `${classData.avgAccuracy}%`, emoji: "🎯", color: "text-teal" },
    { label: "Coverage", value: `${classData.coverage}%`, emoji: "📊", color: "text-indigo-light" },
    { label: "Weak Subject", value: classData.weakSubject, emoji: "⚠️", color: "text-rose-300" },
  ];

  return (
    <div className="space-y-6">
      {/* Class selector */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-2 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-all appearance-none cursor-pointer"
          >
            {DEMO_CLASS_STATS.map((c) => (
              <option key={c.classId} value={c.classId} className="bg-[#0c1222] text-slate-200">
                {c.name}
              </option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-2">
            <Tag label={classData.topSubject} color="green" size="md" />
            <span className="text-[10px] text-slate-500">Top subject</span>
          </div>
        </div>
      </motion.div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 + i * 0.04 }}
          >
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 text-center">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className={`text-xl font-black ${stat.color} tabular-nums`}>{stat.value}</div>
              <div className="text-[10px] text-slate-400 mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Subject-wise progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Subject-Wise Progress
          </h3>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
            {SUBJECT_PROGRESS.map((subj) => (
              <div key={subj.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">{subj.name}</span>
                  <span className="text-xs font-bold text-amber-300 tabular-nums">{subj.progress}%</span>
                </div>
                <ProgressBar value={subj.progress} color={subj.color} height="h-2" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Recent Activity
          </h3>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-3">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">{activity.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-300 leading-relaxed">{activity.text}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick class comparison */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          All Classes at a Glance
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_CLASS_STATS.map((cls) => {
            const isSelected = cls.classId === selectedClass;
            return (
              <div
                key={cls.classId}
                onClick={() => onClassChange(cls.classId)}
                className={`rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-amber-400/10 border border-amber-400/25"
                    : "bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${isSelected ? "text-amber-300" : "text-slate-300"}`}>
                    {cls.name}
                  </span>
                  <span className="text-[10px] text-slate-500">{cls.students} students</span>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-[10px] text-slate-500">Accuracy</div>
                    <div className="text-sm font-bold text-teal tabular-nums">{cls.avgAccuracy}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Coverage</div>
                    <div className="text-sm font-bold text-indigo-light tabular-nums">{cls.coverage}%</div>
                  </div>
                  <div className="ml-auto">
                    <Tag label={cls.weakSubject} color="amber" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
