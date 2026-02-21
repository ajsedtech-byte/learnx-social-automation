"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { RoleKey, ROLES } from "@/lib/role-types";

interface RoleContextType {
  role: RoleKey;
  setRole: (r: RoleKey) => void;
  roleConfig: typeof ROLES[RoleKey];
  isStudentView: boolean;
  activeChild: number;
  setActiveChild: (i: number) => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleKey>("student");
  const [activeChild, setActiveChild] = useState(0);

  const value: RoleContextType = {
    role,
    setRole,
    roleConfig: ROLES[role],
    isStudentView: role === "student" || role === "parent",
    activeChild,
    setActiveChild,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be inside RoleProvider");
  return ctx;
}
