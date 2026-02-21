"use client";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ placeholder = "Search...", value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-500 outline-none focus:border-indigo/40 focus:bg-white/8 transition-all"
      />
    </div>
  );
}
