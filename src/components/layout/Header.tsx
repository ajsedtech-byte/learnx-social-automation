"use client";
import { useState } from "react";
import { useTier } from "@/context/TierContext";
import { useLanguage, LangKey } from "@/context/LanguageContext";
import { TIERS, TierKey } from "@/lib/types";

const LANGS: { key: LangKey; label: string; flag: string }[] = [
  { key: "en", label: "English", flag: "EN" },
  { key: "hi", label: "हिन्दी", flag: "HI" },
  { key: "hinglish", label: "Hinglish", flag: "HG" },
];

const tierOrder: TierKey[] = ["storybook", "explorer", "studio", "board", "pro"];

const NOTIFICATIONS = [
  { id: 1, text: "\u{1F534} P0 Alert: 3 students inactive for 7+ days", time: "2m ago" },
  { id: 2, text: "\u{1F4CA} Weekly digest ready for Class 7A", time: "1h ago" },
  { id: 3, text: "\u{1F3AF} New milestone: Riya completed R5 for Algebra", time: "3h ago" },
  { id: 4, text: "\u26A0\uFE0F Content flag: Question #4521 reported by teacher", time: "5h ago" },
  { id: 5, text: "\u2705 Batch validation complete: 98% pass rate", time: "1d ago" },
];

export default function Header() {
  const { tier, setTier } = useTier();
  const { lang, setLang } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLang, setShowLang] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy/90 border-white/5 backdrop-blur-xl border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent">
              LearnX
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
              v2.0
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => { setShowLang(!showLang); setShowNotifications(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-xs text-slate-300 transition-all"
              >
                <span>🌐</span>
                <span className="font-medium">{LANGS.find(l => l.key === lang)?.flag}</span>
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-navy/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-[100]">
                  {LANGS.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => { setLang(l.key); setShowLang(false); }}
                      className={`w-full text-left px-3 py-2.5 text-xs transition-all flex items-center justify-between ${
                        lang === l.key
                          ? "bg-indigo/20 text-indigo-300"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{l.label}</span>
                      {lang === l.key && <span className="text-indigo-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowLang(false); }}
                className="relative w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-all"
                aria-label="Notifications"
              >
                <span className="text-base">{"\u{1F514}"}</span>
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none border-2 border-navy">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-[340px] rounded-2xl bg-navy/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden z-[100]">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">Notifications</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
                        3 unread
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer ${
                          n.id <= 3 ? "bg-white/[0.02]" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                          <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">{n.time}</span>
                        </div>
                        {n.id <= 3 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-white/[0.06] text-center">
                    <button className="text-[11px] text-indigo-400 hover:text-white transition-colors font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Class Group selector — primary navigation */}
        <div className="flex gap-2 pb-2.5 overflow-x-auto scrollbar-hide">
          {tierOrder.map((t) => {
            const cfg = TIERS[t];
            const isActive = tier === t;
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                  ${isActive
                    ? "text-white border shadow-lg"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                  }`}
                style={
                  isActive
                    ? {
                        background: `${cfg.accentColor}15`,
                        borderColor: `${cfg.accentColor}40`,
                        color: cfg.accentColor,
                        boxShadow: `0 0 20px ${cfg.accentColor}15`,
                      }
                    : undefined
                }
              >
                <span className="text-lg">{cfg.emoji}</span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[13px]">{cfg.classes}</span>
                  <span
                    className={`text-[10px] ${isActive ? "opacity-70" : "text-slate-600"}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
