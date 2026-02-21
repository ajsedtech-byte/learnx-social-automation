"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { TierKey, TIERS } from "@/lib/types";
import { DEMO_STUDENTS } from "@/lib/demo-data";

interface TierContextType {
  tier: TierKey;
  setTier: (t: TierKey) => void;
  student: typeof DEMO_STUDENTS[TierKey];
  tierConfig: typeof TIERS[TierKey];
  isDark: boolean; // storybook = light, rest = dark
}

const TierContext = createContext<TierContextType | null>(null);

export function TierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<TierKey>("storybook");

  const value: TierContextType = {
    tier,
    setTier,
    student: DEMO_STUDENTS[tier],
    tierConfig: TIERS[tier],
    isDark: tier !== "storybook",
  };

  return (
    <TierContext.Provider value={value}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error("useTier must be inside TierProvider");
  return ctx;
}
