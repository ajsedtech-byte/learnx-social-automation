"use client";
import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/lib/supabase";

const STATUS_TABS = [
  { key: "scheduled", label: "Upcoming", color: "#3b82f6" },
  { key: "posted", label: "Posted", color: "#22c55e" },
  { key: "failed", label: "Failed", color: "#ef4444" },
];

const SERIES_COLORS: Record<string, string> = {
  "data-drop": "#f59e0b", confession: "#6366f1", overheard: "#a78bfa",
  engagement: "#fb7185", wrapped: "#ec4899", "moment-marketing": "#f97316",
  tweet: "#94a3b8", reel: "#2dd4bf", linkedin: "#0A66C2",
  launch: "#22c55e", "whatsapp-card": "#25D366",
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "IG", facebook: "FB", twitter: "X", linkedin: "LI",
  threads: "TH", telegram: "TG", youtube: "YT", pinterest: "PI",
  whatsapp: "WA", reddit: "RD",
};

export default function PostQueue() {
  const [activeStatus, setActiveStatus] = useState("scheduled");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?status=${activeStatus}&limit=50`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }, [activeStatus]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function publishNow(id: string) {
    if (!confirm("Publish this post now?")) return;
    await fetch(`/api/posts/${id}/publish`, { method: "POST" });
    fetchPosts();
  }

  async function retryPost(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "scheduled", retry_count: 0 }),
    });
    fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  return (
    <div>
      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveStatus(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeStatus === t.key
                ? "text-white"
                : "text-slate-500 hover:text-slate-300 bg-white/[0.03]"
            }`}
            style={activeStatus === t.key ? { background: `${t.color}20`, color: t.color } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="text-center text-slate-500 py-12 text-sm">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-slate-500 py-12 text-sm">
          No {activeStatus} posts found.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const seriesColor = SERIES_COLORS[p.series] || "#64748b";
            const content = typeof p.content === "object" ? Object.values(p.content)[0] : String(p.content);

            return (
              <div
                key={p.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition"
              >
                <div className="flex items-start gap-3">
                  {/* Series badge */}
                  <div
                    className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                    style={{ background: seriesColor }}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-300">{p.title}</span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                        style={{ background: `${seriesColor}20`, color: seriesColor }}
                      >
                        {p.series}
                      </span>
                    </div>

                    {/* Content preview */}
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">{content}</p>

                    {/* Bottom row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-500">
                        {p.scheduled_date} · {p.scheduled_time} IST
                      </span>
                      <div className="flex items-center gap-0.5 ml-2">
                        {p.platforms.map((pl) => (
                          <span
                            key={pl}
                            className="text-[8px] font-bold px-1 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            {PLATFORM_ICONS[pl]}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="ml-auto flex items-center gap-2">
                        {activeStatus === "scheduled" && (
                          <button
                            onClick={() => publishNow(p.id)}
                            className="text-[10px] font-semibold text-teal-400 hover:text-teal-300"
                          >
                            Publish Now
                          </button>
                        )}
                        {activeStatus === "failed" && (
                          <button
                            onClick={() => retryPost(p.id)}
                            className="text-[10px] font-semibold text-yellow-400 hover:text-yellow-300"
                          >
                            Retry
                          </button>
                        )}
                        <button
                          onClick={() => deletePost(p.id)}
                          className="text-[10px] font-semibold text-red-400/50 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
