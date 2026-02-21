export type RoleKey = "student" | "parent" | "teacher" | "school-admin" | "super-admin";

export interface RoleConfig {
  key: RoleKey;
  label: string;
  emoji: string;
  accentColor: string;
  description: string;
}

export const ROLES: Record<RoleKey, RoleConfig> = {
  student: {
    key: "student",
    label: "Student",
    emoji: "🎓",
    accentColor: "#6366f1",
    description: "K-12 learner dashboard",
  },
  parent: {
    key: "parent",
    label: "Parent",
    emoji: "👨‍👩‍👧",
    accentColor: "#2dd4bf",
    description: "Child progress monitoring",
  },
  teacher: {
    key: "teacher",
    label: "Teacher",
    emoji: "📚",
    accentColor: "#f59e0b",
    description: "Class analytics & insights",
  },
  "school-admin": {
    key: "school-admin",
    label: "School Admin",
    emoji: "🏫",
    accentColor: "#ec4899",
    description: "School management & reports",
  },
  "super-admin": {
    key: "super-admin",
    label: "Super Admin",
    emoji: "👑",
    accentColor: "#a855f7",
    description: "Platform control center",
  },
};

export interface NavItem {
  label: string;
  href: string;
  emoji: string;
  tiers?: string[];
}

export const NAV_BY_ROLE: Record<RoleKey, NavItem[]> = {
  student: [
    { label: "Dashboard", href: "/", emoji: "🏠" },
    { label: "Player", href: "/player", emoji: "▶️" },
    { label: "Subjects", href: "/subjects", emoji: "📖" },
    { label: "Daily Blueprint", href: "/daily", emoji: "📋" },
    { label: "SPARK", href: "/spark", emoji: "⚡" },
    { label: "Revision", href: "/revision", emoji: "🔄" },
    { label: "Life Skills", href: "/life-skills", emoji: "💛" },
    { label: "Mistake Genome", href: "/mistakes", emoji: "🧬" },
    { label: "Garden", href: "/garden", emoji: "🌱", tiers: ["storybook", "explorer"] },
    { label: "Momentum", href: "/momentum", emoji: "⚡", tiers: ["studio", "board", "pro"] },
    { label: "GroerX", href: "/groerx", emoji: "🚀", tiers: ["studio", "board", "pro"] },
    { label: "Settings", href: "/settings", emoji: "⚙️" },
  ],
  parent: [
    { label: "Dashboard", href: "/parent", emoji: "🏠" },
    { label: "Daily Blueprint", href: "/daily", emoji: "📋" },
    { label: "SPARK Profile", href: "/spark", emoji: "⚡" },
    { label: "Revision", href: "/revision", emoji: "🔄" },
    { label: "Life Skills", href: "/life-skills", emoji: "💛" },
    { label: "Mistake Genome", href: "/mistakes", emoji: "🧬" },
    { label: "Garden", href: "/garden", emoji: "🌱", tiers: ["storybook", "explorer"] },
    { label: "Momentum", href: "/momentum", emoji: "⚡", tiers: ["studio", "board", "pro"] },
    { label: "GroerX Career", href: "/groerx", emoji: "🚀", tiers: ["studio", "board", "pro"] },
    { label: "Settings", href: "/settings", emoji: "⚙️" },
  ],
  teacher: [
    { label: "Overview", href: "/teacher", emoji: "📊" },
    { label: "Students", href: "/teacher?tab=students", emoji: "👥" },
    { label: "Revision Health", href: "/teacher?tab=revision", emoji: "🔄" },
    { label: "Mistake Patterns", href: "/teacher?tab=mistakes", emoji: "🧬" },
    { label: "Reports", href: "/teacher?tab=reports", emoji: "📄" },
    { label: "Content Flags", href: "/teacher?tab=flags", emoji: "🚩" },
    { label: "Settings", href: "/settings", emoji: "⚙️" },
  ],
  "school-admin": [
    { label: "Dashboard", href: "/school-admin", emoji: "📊" },
    { label: "Classes", href: "/school-admin?tab=classes", emoji: "🏫" },
    { label: "Teachers", href: "/school-admin?tab=teachers", emoji: "📚" },
    { label: "Students", href: "/school-admin?tab=students", emoji: "👥" },
    { label: "Reports", href: "/school-admin?tab=reports", emoji: "📄" },
    { label: "Onboarding", href: "/school-admin?tab=onboarding", emoji: "🚀" },
    { label: "Settings", href: "/settings", emoji: "⚙️" },
  ],
  "super-admin": [
    { label: "Platform Pulse", href: "/admin", emoji: "📡" },
    { label: "Content", href: "/admin?tab=content", emoji: "📝" },
    { label: "Schools", href: "/admin?tab=schools", emoji: "🏫" },
    { label: "Users", href: "/admin?tab=users", emoji: "👥" },
    { label: "Detected Gaps", href: "/admin?tab=gaps", emoji: "🔍" },
    { label: "Settings", href: "/admin?tab=settings", emoji: "⚙️" },
  ],
};
