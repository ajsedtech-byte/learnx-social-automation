"use client";
import { useRole } from "@/context/RoleContext";
import { useTier } from "@/context/TierContext";
import { DEMO_CHILDREN } from "@/lib/parent-demo-data";

export default function ChildSwitcher() {
  const { activeChild, setActiveChild } = useRole();
  const { setTier } = useTier();

  return (
    <div className="flex gap-2 mb-6">
      {DEMO_CHILDREN.map((child, i) => {
        const isActive = activeChild === i;
        return (
          <button
            key={i}
            onClick={() => {
              setActiveChild(i);
              setTier(child.tier);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${isActive
                ? "bg-teal/20 text-teal border border-teal/30"
                : "bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]"
              }`}
          >
            <span className="text-lg">{child.avatar}</span>
            <div className="text-left">
              <div className={isActive ? "text-teal" : "text-slate-300"}>{child.name}</div>
              <div className="text-[10px] text-slate-500">Class {child.class}{child.section}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
