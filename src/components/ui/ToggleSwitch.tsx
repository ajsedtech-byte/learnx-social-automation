"use client";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange?: () => void;
  label?: string;
  size?: "sm" | "md";
}

export default function ToggleSwitch({ enabled, onChange, label, size = "md" }: ToggleSwitchProps) {
  const w = size === "sm" ? "w-8" : "w-10";
  const h = size === "sm" ? "h-4" : "h-5";
  const dot = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const translate = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <button onClick={onChange} className="flex items-center gap-2 group">
      <div className={`${w} ${h} rounded-full transition-colors relative ${enabled ? "bg-indigo" : "bg-white/10"}`}>
        <div className={`${dot} rounded-full bg-white absolute top-0.5 left-0.5 transition-transform ${enabled ? translate : "translate-x-0"}`} />
      </div>
      {label && <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>}
    </button>
  );
}
