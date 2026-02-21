export const DEMO_TEACHER = {
  name: "Ms. Priya Verma",
  subject: "Mathematics",
  school: "Delhi Public School, R.K. Puram",
  classes: ["Class 7A", "Class 7B", "Class 8A"],
};

export const DEMO_CLASS_STUDENTS = [
  { id: "1", name: "Aarav S.", accuracy: 92, topicsDone: 45, totalTopics: 52, streak: 14, lastActive: "2 min ago", status: "on-track" as const },
  { id: "2", name: "Priya P.", accuracy: 88, topicsDone: 42, totalTopics: 52, streak: 21, lastActive: "5 min ago", status: "on-track" as const },
  { id: "3", name: "Rohan K.", accuracy: 76, topicsDone: 38, totalTopics: 52, streak: 7, lastActive: "1 hr ago", status: "needs-attention" as const },
  { id: "4", name: "Ananya M.", accuracy: 95, topicsDone: 48, totalTopics: 52, streak: 30, lastActive: "10 min ago", status: "excelling" as const },
  { id: "5", name: "Vikram J.", accuracy: 62, topicsDone: 30, totalTopics: 52, streak: 0, lastActive: "3 days ago", status: "at-risk" as const },
  { id: "6", name: "Riya G.", accuracy: 84, topicsDone: 40, totalTopics: 52, streak: 11, lastActive: "30 min ago", status: "on-track" as const },
  { id: "7", name: "Arjun D.", accuracy: 71, topicsDone: 35, totalTopics: 52, streak: 3, lastActive: "2 hr ago", status: "needs-attention" as const },
  { id: "8", name: "Meera R.", accuracy: 89, topicsDone: 44, totalTopics: 52, streak: 18, lastActive: "15 min ago", status: "on-track" as const },
  { id: "9", name: "Kabir T.", accuracy: 58, topicsDone: 25, totalTopics: 52, streak: 0, lastActive: "5 days ago", status: "at-risk" as const },
  { id: "10", name: "Ishita C.", accuracy: 91, topicsDone: 46, totalTopics: 52, streak: 25, lastActive: "8 min ago", status: "excelling" as const },
  { id: "11", name: "Dev N.", accuracy: 79, topicsDone: 39, totalTopics: 52, streak: 9, lastActive: "45 min ago", status: "on-track" as const },
  { id: "12", name: "Zara A.", accuracy: 83, topicsDone: 41, totalTopics: 52, streak: 12, lastActive: "20 min ago", status: "on-track" as const },
];

export const DEMO_CLASS_STATS = [
  { classId: "7A", name: "Class 7A", students: 42, avgAccuracy: 82, coverage: 78, topSubject: "Algebra", weakSubject: "Geometry" },
  { classId: "7B", name: "Class 7B", students: 38, avgAccuracy: 76, coverage: 72, topSubject: "Numbers", weakSubject: "Data Handling" },
  { classId: "8A", name: "Class 8A", students: 40, avgAccuracy: 85, coverage: 81, topSubject: "Linear Equations", weakSubject: "Mensuration" },
];

export const DEMO_SHARED_MISTAKES = [
  { pattern: "Add numerators AND denominators in fractions", type: "CONCEPTUAL", studentCount: 12, severity: "high" as const, subject: "Mathematics" },
  { pattern: "Confuse area and perimeter formulas", type: "PROCEDURAL", studentCount: 8, severity: "medium" as const, subject: "Mathematics" },
  { pattern: "Wrong sign in negative number operations", type: "CARELESS", studentCount: 15, severity: "high" as const, subject: "Mathematics" },
  { pattern: "Skip steps in equation solving", type: "PROCEDURAL", studentCount: 6, severity: "low" as const, subject: "Mathematics" },
  { pattern: "Decimal point placement errors", type: "CONCEPTUAL", studentCount: 9, severity: "medium" as const, subject: "Mathematics" },
];

export const DEMO_REVISION_HEALTH = {
  onTrack: 68,
  backlog: 22,
  mastered: 10,
  topStruggling: ["Fractions", "Decimals", "Geometry Basics", "Ratios", "Percentages"],
  topMastered: ["Addition", "Subtraction", "Multiplication", "Place Value", "Time & Calendar"],
};

export const DEMO_TEACHER_FLAGS = [
  { id: "1", content: "Tutorial: Fraction Addition (C5)", issue: "Example uses wrong denominator", status: "open" as const, date: "Feb 19" },
  { id: "2", content: "SPARK Q12: Geometry (C7)", issue: "Diagram is misleading", status: "reviewing" as const, date: "Feb 17" },
  { id: "3", content: "Tutorial: Decimals (C4)", issue: "Voice narration cuts off early", status: "resolved" as const, date: "Feb 14" },
];
