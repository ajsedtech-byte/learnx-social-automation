"use client";
import { ReactNode } from "react";
import { useTier } from "@/context/TierContext";
import { useRole } from "@/context/RoleContext";
import { useEmbedded } from "@/context/EmbeddedContext";

interface Props {
  children: ReactNode;
  className?: string;
  padding?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", padding = "p-5", hover = false, onClick }: Props) {
  const { isDark } = useTier();
  const { role } = useRole();
  const embedded = useEmbedded();
  // Dark glass when: dark tier, non-student role, OR embedded in main page accordion (always dark bg)
  const dark = isDark || role !== "student" || embedded;

  return (
    <div
      onClick={onClick}
      className={`
        ${dark ? "glass" : "glass-light"}
        ${padding}
        ${hover ? dark ? "hover:border-indigo/30 hover:-translate-y-1 transition-all cursor-pointer" : "hover:border-indigo/20 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
