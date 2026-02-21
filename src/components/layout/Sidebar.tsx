"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { NAV_BY_ROLE } from "@/lib/role-types";

export default function Sidebar() {
  const pathname = usePathname();
  const { tier } = useTier();
  const { role } = useRole();

  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;

  const visibleItems = navItems.filter(
    (item) => !item.tiers || item.tiers.includes(tier)
  );

  return (
    <nav className="w-56 shrink-0 h-[calc(100vh-88px)] sticky top-[88px] overflow-y-auto py-4 px-3 border-r border-white/5 bg-navy">
      <div className="space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-indigo/15 text-indigo-light"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
