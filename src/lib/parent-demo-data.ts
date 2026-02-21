import { TierKey } from "./types";

export interface ChildProfile {
  name: string;
  class: number;
  section: string;
  tier: TierKey;
  avatar: string;
  school: string;
}

export const DEMO_CHILDREN: ChildProfile[] = [
  { name: "Aarav", class: 2, section: "A", tier: "storybook", avatar: "🧒", school: "DPS R.K. Puram" },
  { name: "Priya", class: 7, section: "B", tier: "studio", avatar: "👧", school: "DPS R.K. Puram" },
  { name: "Rohan", class: 10, section: "A", tier: "board", avatar: "👦", school: "DPS R.K. Puram" },
];

export interface ParentNotification {
  id: string;
  type: "completion" | "milestone" | "revision-due" | "spark-result" | "concern" | "streak-lost" | "achievement" | "system";
  text: string;
  time: string;
  childName: string;
  emoji: string;
  read: boolean;
}

export const DEMO_PARENT_NOTIFICATIONS: ParentNotification[] = [
  { id: "1", type: "milestone", text: "Aarav mastered all Addition topics! R10 complete.", emoji: "🏆", time: "10 min ago", childName: "Aarav", read: false },
  { id: "2", type: "concern", text: "Priya scored 2/5 on Fraction Addition (Sure + Wrong = P0)", emoji: "🔴", time: "25 min ago", childName: "Priya", read: false },
  { id: "3", type: "spark-result", text: "Rohan's SPARK test complete: 82% overall, improved in Physics", emoji: "⚡", time: "1 hr ago", childName: "Rohan", read: false },
  { id: "4", type: "revision-due", text: "Priya has 8 overdue revision topics (above 5 threshold)", emoji: "🟡", time: "2 hr ago", childName: "Priya", read: true },
  { id: "5", type: "achievement", text: "Aarav earned 'Plant Grower' badge — 5 plants blooming!", emoji: "🌸", time: "3 hr ago", childName: "Aarav", read: true },
  { id: "6", type: "completion", text: "Rohan completed Chapter 4: Chemical Reactions", emoji: "✅", time: "5 hr ago", childName: "Rohan", read: true },
  { id: "7", type: "streak-lost", text: "Priya's 14-day streak ended. Gentle nudge sent.", emoji: "💔", time: "Yesterday", childName: "Priya", read: true },
  { id: "8", type: "system", text: "Weekly report for all children is ready", emoji: "📊", time: "Yesterday", childName: "All", read: true },
  { id: "9", type: "milestone", text: "Rohan's Board Readiness Score reached 78%", emoji: "🎯", time: "2 days ago", childName: "Rohan", read: true },
  { id: "10", type: "revision-due", text: "Aarav has 3 revision seeds to water today", emoji: "🌱", time: "2 days ago", childName: "Aarav", read: true },
  { id: "11", type: "spark-result", text: "Priya's SPARK: Cognitive 85, Linguistic 72, Creative 90", emoji: "🧠", time: "3 days ago", childName: "Priya", read: true },
  { id: "12", type: "achievement", text: "Aarav completed 50 tutorials — halfway champion!", emoji: "🥇", time: "4 days ago", childName: "Aarav", read: true },
];

export const DEMO_PARENT_SETTINGS = {
  reportFrequency: "weekly" as const,
  notifications: {
    milestones: true,
    weeklyReports: true,
    revisionBacklog: true,
    sparkResults: true,
    streaks: true,
    revisionHandoff: true,
    mastery: true,
    boardExam: true,
  },
  accelerationByChild: [true, false, true],
};
