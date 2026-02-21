"use client";

interface Props {
  label: string;
  color?: "indigo" | "teal" | "amber" | "rose" | "green" | "purple" | "white" | "red";
  size?: "sm" | "md";
}

const colorClasses = {
  indigo: "bg-indigo/15 text-indigo-light",
  teal: "bg-teal/15 text-teal",
  amber: "bg-amber-400/15 text-amber-300",
  rose: "bg-rose-400/15 text-rose-300",
  green: "bg-emerald-400/15 text-emerald-300",
  purple: "bg-purple-500/15 text-purple-300",
  white: "bg-white/10 text-white/70",
  red: "bg-red-500/15 text-red-400",
};

export default function Tag({ label, color = "indigo", size = "sm" }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${colorClasses[color]} ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>
      {label}
    </span>
  );
}
