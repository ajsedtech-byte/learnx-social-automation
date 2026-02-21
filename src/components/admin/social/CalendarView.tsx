"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { Post } from "@/lib/supabase";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#000000",
  linkedin: "#0A66C2",
  threads: "#000000",
  telegram: "#26A5E4",
  youtube: "#FF0000",
  pinterest: "#BD081C",
  whatsapp: "#25D366",
  reddit: "#FF4500",
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "IG",
  facebook: "FB",
  twitter: "X",
  linkedin: "LI",
  threads: "TH",
  telegram: "TG",
  youtube: "YT",
  pinterest: "PI",
  whatsapp: "WA",
  reddit: "RD",
};

const SERIES_LABELS: Record<string, { label: string; color: string }> = {
  "data-drop": { label: "Data Drop", color: "#f59e0b" },
  confession: { label: "Confession", color: "#6366f1" },
  overheard: { label: "Overheard", color: "#a78bfa" },
  engagement: { label: "Engagement", color: "#fb7185" },
  wrapped: { label: "Wrapped", color: "#ec4899" },
  "moment-marketing": { label: "Moment", color: "#f97316" },
  tweet: { label: "Tweet", color: "#94a3b8" },
  reel: { label: "Reel", color: "#2dd4bf" },
  linkedin: { label: "LinkedIn", color: "#0A66C2" },
  launch: { label: "Launch", color: "#22c55e" },
  "whatsapp-card": { label: "WhatsApp", color: "#25D366" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  scheduled: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  posted: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  failed: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  draft: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-500" },
  publishing: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const dateFrom = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const dateTo = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth}`;
    try {
      const res = await fetch(`/api/posts?date_from=${dateFrom}&date_to=${dateTo}&limit=500`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }, [year, month, daysInMonth]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const postsByDate: Record<string, Post[]> = {};
  posts.forEach((p) => {
    const d = p.scheduled_date;
    if (!postsByDate[d]) postsByDate[d] = [];
    postsByDate[d].push(p);
  });

  function selectDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDay(dateStr);
    setSelectedPosts(postsByDate[dateStr] || []);
  }

  // Count stats
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const posted = posts.filter((p) => p.status === "posted").length;
  const failed = posts.filter((p) => p.status === "failed").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  if (loading) return <div className="text-center text-slate-500 py-12 text-sm">Loading calendar...</div>;

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Scheduled", count: scheduled, color: "blue" },
          { label: "Posted", count: posted, color: "green" },
          { label: "Failed", count: failed, color: "red" },
          { label: "Drafts", count: drafts, color: "slate" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className={`text-2xl font-bold text-${s.color}-400`}>{s.count}</div>
            <div className="text-xs text-slate-500">{s.label} this month</div>
          </div>
        ))}
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="text-slate-400 hover:text-white text-sm bg-white/5 px-3 py-1.5 rounded-lg transition"
        >
          Previous
        </button>
        <h2 className="text-lg font-bold">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="text-slate-400 hover:text-white text-sm bg-white/5 px-3 py-1.5 rounded-lg transition"
        >
          Next
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/[0.06]">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-slate-500 font-semibold py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 border-b border-r border-white/[0.03]" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayPosts = postsByDate[dateStr] || [];
            const isToday = dateStr === new Date().toISOString().split("T")[0];
            const isSelected = dateStr === selectedDay;

            return (
              <div
                key={day}
                onClick={() => selectDay(day)}
                className={`h-24 border-b border-r border-white/[0.03] p-1.5 cursor-pointer transition hover:bg-white/[0.03]
                  ${isSelected ? "bg-teal-500/[0.08] ring-1 ring-teal-500/30" : ""}
                  ${isToday ? "bg-indigo-500/[0.05]" : ""}`}
              >
                <div className={`text-xs font-semibold mb-1 ${isToday ? "text-teal-400" : "text-slate-400"}`}>
                  {day}
                </div>
                {dayPosts.length > 0 && (
                  <div className="flex flex-wrap gap-0.5">
                    {dayPosts.slice(0, 4).map((p, pi) => {
                      const series = SERIES_LABELS[p.series];
                      const status = STATUS_STYLES[p.status] || STATUS_STYLES.draft;
                      return (
                        <div
                          key={pi}
                          className="flex items-center gap-0.5"
                          title={`${series?.label || p.series} — ${p.status}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {p.platforms.slice(0, 3).map((pl) => (
                            <span
                              key={pl}
                              className="text-[7px] font-bold opacity-60"
                              style={{ color: PLATFORM_COLORS[pl] || "#94a3b8" }}
                            >
                              {PLATFORM_ICONS[pl]}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                    {dayPosts.length > 4 && (
                      <span className="text-[8px] text-slate-500">+{dayPosts.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
        >
          <h3 className="text-sm font-bold mb-3 text-slate-300">
            Posts for {selectedDay} ({selectedPosts.length})
          </h3>
          {selectedPosts.length === 0 ? (
            <p className="text-xs text-slate-500">No posts scheduled for this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedPosts.map((p) => {
                const series = SERIES_LABELS[p.series];
                const status = STATUS_STYLES[p.status] || STATUS_STYLES.draft;
                return (
                  <div key={p.id} className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${status.text}`}>
                        {p.status}
                      </span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${series?.color || "#666"}20`, color: series?.color || "#666" }}
                      >
                        {series?.label || p.series}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto">{p.scheduled_time} IST</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold mb-1">{p.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {typeof p.content === "object" ? Object.values(p.content)[0] : String(p.content)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {p.platforms.map((pl) => (
                        <span
                          key={pl}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: `${PLATFORM_COLORS[pl]}20`, color: PLATFORM_COLORS[pl] }}
                        >
                          {PLATFORM_ICONS[pl]}
                        </span>
                      ))}
                      <button
                        className="ml-auto text-[10px] text-teal-400 hover:text-teal-300 font-semibold"
                        onClick={async () => {
                          if (!confirm("Publish this post now?")) return;
                          await fetch(`/api/posts/${p.id}/publish`, { method: "POST" });
                          fetchPosts();
                        }}
                      >
                        Publish Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
