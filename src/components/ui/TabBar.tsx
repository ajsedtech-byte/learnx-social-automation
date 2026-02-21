"use client";

interface Tab {
  key: string;
  label: string;
  emoji?: string;
  badge?: string;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  accentColor?: string;
}

export default function TabBar({ tabs, active, onChange, accentColor = "#6366f1" }: TabBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
              ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
            style={isActive ? { background: `${accentColor}20`, color: accentColor } : undefined}
          >
            {tab.emoji && <span>{tab.emoji}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-white/[0.08] text-slate-400"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
