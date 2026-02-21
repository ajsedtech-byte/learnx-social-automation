"use client";
import { useState, useEffect } from "react";

interface Stats {
  total: number;
  scheduled: number;
  posted: number;
  failed: number;
  draft: number;
  byPlatform: Record<string, number>;
  bySeries: Record<string, number>;
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F", facebook: "#1877F2", twitter: "#1DA1F2",
  linkedin: "#0A66C2", threads: "#000000", telegram: "#26A5E4",
  youtube: "#FF0000", pinterest: "#BD081C", whatsapp: "#25D366", reddit: "#FF4500",
};

const SERIES_COLORS: Record<string, string> = {
  "data-drop": "#f59e0b", confession: "#6366f1", overheard: "#a78bfa",
  engagement: "#fb7185", wrapped: "#ec4899", "moment-marketing": "#f97316",
  tweet: "#94a3b8", reel: "#2dd4bf", linkedin: "#0A66C2",
  launch: "#22c55e", "whatsapp-card": "#25D366",
};

export default function AnalyticsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all posts in batches and compute stats client-side
        const res = await fetch("/api/posts?limit=2000");
        const data = await res.json();
        const posts = data.posts || [];

        const s: Stats = {
          total: posts.length,
          scheduled: 0, posted: 0, failed: 0, draft: 0,
          byPlatform: {}, bySeries: {},
        };

        posts.forEach((p: { status: string; platforms: string[]; series: string }) => {
          if (p.status === "scheduled") s.scheduled++;
          else if (p.status === "posted") s.posted++;
          else if (p.status === "failed") s.failed++;
          else if (p.status === "draft") s.draft++;

          p.platforms.forEach((pl: string) => {
            s.byPlatform[pl] = (s.byPlatform[pl] || 0) + 1;
          });
          s.bySeries[p.series] = (s.bySeries[p.series] || 0) + 1;
        });

        setStats(s);
      } catch {
        setStats(null);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center text-slate-500 py-12 text-sm">Loading analytics...</div>;
  if (!stats) return <div className="text-center text-slate-500 py-12 text-sm">No data yet. Generate your calendar first.</div>;

  const maxPlatform = Math.max(...Object.values(stats.byPlatform), 1);
  const maxSeries = Math.max(...Object.values(stats.bySeries), 1);

  return (
    <div>
      {/* Top stats */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {[
          { label: "Total Posts", value: stats.total, color: "#2dd4bf" },
          { label: "Scheduled", value: stats.scheduled, color: "#3b82f6" },
          { label: "Posted", value: stats.posted, color: "#22c55e" },
          { label: "Failed", value: stats.failed, color: "#ef4444" },
          { label: "Drafts", value: stats.draft, color: "#64748b" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* By Platform */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Posts by Platform</h3>
          <div className="space-y-2">
            {Object.entries(stats.byPlatform)
              .sort((a, b) => b[1] - a[1])
              .map(([platform, count]) => (
                <div key={platform} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-20 text-slate-400 uppercase">{platform}</span>
                  <div className="flex-1 h-4 bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / maxPlatform) * 100}%`,
                        background: PLATFORM_COLORS[platform] || "#64748b",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* By Series */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Posts by Series</h3>
          <div className="space-y-2">
            {Object.entries(stats.bySeries)
              .sort((a, b) => b[1] - a[1])
              .map(([series, count]) => (
                <div key={series} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-28 text-slate-400 truncate">{series}</span>
                  <div className="flex-1 h-4 bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / maxSeries) * 100}%`,
                        background: SERIES_COLORS[series] || "#64748b",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Post rate */}
      <div className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-300 mb-2">Posting Rate</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-teal-400">{(stats.total / 365).toFixed(1)}</div>
            <div className="text-[10px] text-slate-500">Posts/day (primary)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">
              {Object.values(stats.byPlatform).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-[10px] text-slate-500">Total platform posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">
              {stats.total > 0 ? ((stats.posted / stats.total) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-[10px] text-slate-500">Completion rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
