// ═══ TIER TYPES ═══
export type TierKey = "storybook" | "explorer" | "studio" | "board" | "pro";

export interface TierConfig {
  key: TierKey;
  label: string;
  classes: string;
  emoji: string;
  description: string;
  bgClass: string;
  accentColor: string;
}

export const TIERS: Record<TierKey, TierConfig> = {
  storybook: {
    key: "storybook",
    label: "Storybook",
    classes: "Class 1-2",
    emoji: "🎨",
    description: "Big visuals, voice-first, playful animations",
    bgClass: "bg-storybook-bg",
    accentColor: "#fb923c",
  },
  explorer: {
    key: "explorer",
    label: "Explorer",
    classes: "Class 3-5",
    emoji: "🔭",
    description: "Split views, emerging structure, badge collection",
    bgClass: "bg-explorer-galaxy",
    accentColor: "#ffd700",
  },
  studio: {
    key: "studio",
    label: "Studio",
    classes: "Class 6-8",
    emoji: "🔬",
    description: "Sidebar nav, diagrams, note-taking, academic density",
    bgClass: "bg-navy",
    accentColor: "#6366f1",
  },
  board: {
    key: "board",
    label: "Board",
    classes: "Class 9-10",
    emoji: "🎯",
    description: "Exam countdown, formula panels, board-focused prep",
    bgClass: "bg-navy",
    accentColor: "#fb7185",
  },
  pro: {
    key: "pro",
    label: "Pro",
    classes: "Class 11-12",
    emoji: "🚀",
    description: "Dense data, competitive exam tools, career intelligence",
    bgClass: "bg-navy",
    accentColor: "#10b981",
  },
};

// ═══ STUDENT TYPES ═══
export interface Student {
  name: string;
  class: number;
  section: string;
  school: string;
  avatar: string;
  tier: TierKey;
  xp: number;
  level: number;
  streak: number;
  completedTopics: number;
  totalTopics: number;
}

// ═══ SUBJECT TYPES ═══
export interface Subject {
  id: string;
  name: string;
  emoji: string;
  color: string;
  progress: number;
  chaptersCompleted: number;
  totalChapters: number;
  currentTopic: string;
}

// ═══ SPARK TYPES ═══
export interface SparkDomain {
  name: string;
  emoji: string;
  score: number;
  maxScore: number;
  level: "Emerging" | "Developing" | "Proficient" | "Advanced" | "Exceptional";
}

export interface SparkResult {
  domains: SparkDomain[];
  overallLevel: string;
  testDate: string;
  questionsAnswered: number;
}

// ═══ REVISION TYPES ═══
export interface RevisionTopic {
  id: string;
  name: string;
  subject: string;
  currentRound: number;
  maxRounds: number;
  lastScore: number;
  nextDue: string;
  status: "due" | "upcoming" | "mastered" | "struggling";
}

// ═══ FRAMEWORK / PLAYER TYPES ═══
export interface FrameworkStep {
  id: number;
  title: string;
  emoji: string;
  content: string;
  voiceText: string;
  activity?: Activity;
}

export interface Activity {
  type: "mcq" | "drag-order" | "match-pairs" | "fill-blank" | "timed-quiz";
  question: string;
  options?: string[];
  correctAnswer?: number;
  pairs?: { left: string; right: string }[];
}

// ═══ LIFE SKILLS TYPES ═══
export interface LifeSkillDilemma {
  chapter: string;
  title: string;
  story: string;
  question: string;
  options: { text: string; outcome: string }[];
  tierAdaptation: string;
}

// ═══ GAMIFICATION TYPES ═══
export interface GardenPlant {
  subjectId: string;
  stage: "seed" | "sprout" | "sapling" | "tree" | "bloom";
  emoji: string;
  topicsCompleted: number;
}

export interface MomentumData {
  speed: number;
  maxSpeed: number;
  weeklyXP: number;
  rank: number;
  totalStudents: number;
  streakDays: number;
}

// ═══ PARENT TYPES ═══
export interface ParentCard {
  id: string;
  title: string;
  emoji: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "stable";
  tiers: TierKey[];
}

// ═══ MISTAKE GENOME ═══
export interface MistakePattern {
  id: string;
  type: string;
  description: string;
  frequency: number;
  subjects: string[];
  example: string;
  suggestion: string;
}

// ═══ GROERX CAREER ═══
export interface CareerPath {
  title: string;
  match: number;
  domains: string[];
  description: string;
  emoji: string;
}
