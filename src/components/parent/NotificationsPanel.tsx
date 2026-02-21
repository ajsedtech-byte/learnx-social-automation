"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DEMO_PARENT_NOTIFICATIONS, ParentNotification } from "@/lib/parent-demo-data";
import { useRole } from "@/context/RoleContext";
import { DEMO_CHILDREN } from "@/lib/parent-demo-data";

export default function NotificationsPanel() {
  const { activeChild } = useRole();
  const child = DEMO_CHILDREN[activeChild];
  const [showAll, setShowAll] = useState(false);

  const filtered = DEMO_PARENT_NOTIFICATIONS.filter(
    (n) => n.childName === child.name || n.childName === "All"
  );
  const displayed = showAll ? filtered : filtered.slice(0, 5);
  const unreadCount = filtered.filter((n) => !n.read).length;

  const groupByTime = (notifs: ParentNotification[]) => {
    const today: ParentNotification[] = [];
    const yesterday: ParentNotification[] = [];
    const older: ParentNotification[] = [];
    notifs.forEach((n) => {
      if (n.time.includes("min") || n.time.includes("hr")) today.push(n);
      else if (n.time === "Yesterday") yesterday.push(n);
      else older.push(n);
    });
    return { today, yesterday, older };
  };

  const groups = groupByTime(displayed);

  const renderGroup = (label: string, notifs: ParentNotification[]) => {
    if (notifs.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
        <div className="space-y-2">
          {notifs.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                !n.read ? "bg-teal/5 border border-teal/10" : "bg-white/[0.02] border border-white/[0.04]"
              }`}
            >
              <span className="text-lg mt-0.5">{n.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? "text-slate-200" : "text-slate-400"}`}>{n.text}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-teal mt-2 shrink-0" />}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <h3 className="text-sm font-bold text-slate-200">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal/20 text-teal font-semibold">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>
      {renderGroup("Today", groups.today)}
      {renderGroup("Yesterday", groups.yesterday)}
      {renderGroup("Earlier", groups.older)}
      {filtered.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-teal hover:text-teal-light transition-colors mt-2"
        >
          {showAll ? "Show less" : `Show all ${filtered.length} notifications`}
        </button>
      )}
    </div>
  );
}
