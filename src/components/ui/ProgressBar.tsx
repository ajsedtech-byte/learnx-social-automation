"use client";

interface Props {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  indigo: "bg-indigo",
  teal: "bg-teal",
  purple: "bg-purple-500",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
  green: "bg-emerald-400",
  pink: "bg-pink-400",
};

export default function ProgressBar({ value, max = 100, color = "indigo", height = "h-2", showLabel = false, className = "" }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const bgClass = COLOR_MAP[color] || color;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`progress-bar ${height} flex-1`}>
        <div
          className={`progress-fill ${bgClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-400 tabular-nums w-10 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
