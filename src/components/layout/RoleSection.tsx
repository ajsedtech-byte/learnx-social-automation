"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface RoleSectionProps {
  label: string;
  emoji: string;
  accentColor: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function RoleSection({
  label,
  emoji,
  accentColor,
  description,
  badge,
  children,
  defaultOpen = false,
}: RoleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden transition-colors"
      style={{
        border: `1px solid ${isOpen ? accentColor + "30" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {/* Clickable header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all cursor-pointer"
        style={{
          background: isOpen ? `${accentColor}0a` : "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: `${accentColor}15` }}
          >
            {emoji}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{label}</span>
              {badge && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">{description}</p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 text-xs shrink-0 ml-4"
        >
          ▼
        </motion.span>
      </button>

      {/* Content — role-section-content class hides duplicate headers & min-h-screen via CSS */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="role-section-content"
          style={{ borderTop: `1px solid ${accentColor}15` }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
