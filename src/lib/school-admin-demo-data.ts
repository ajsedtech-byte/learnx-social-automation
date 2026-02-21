export const DEMO_SCHOOL = {
  name: "Delhi Public School, R.K. Puram",
  code: "DPS-RKP",
  city: "New Delhi",
  board: "CBSE",
  studentCount: 2400,
  teacherCount: 85,
  activeToday: 1850,
  establishedYear: 1972,
};

export const DEMO_SCHOOL_KPIS = [
  { label: "Total Students", value: "2,400", trend: "+120", trendUp: true, emoji: "\u{1F393}", color: "#6366f1" },
  { label: "Active Today", value: "1,850", trend: "+8%", trendUp: true, emoji: "\u{1F4CA}", color: "#2dd4bf" },
  { label: "Avg Mastery", value: "76%", trend: "+4%", trendUp: true, emoji: "\u{1F3AF}", color: "#10b981" },
  { label: "Teachers", value: "85", trend: "+3", trendUp: true, emoji: "\u{1F4DA}", color: "#f59e0b" },
  { label: "Revision On-Track", value: "72%", trend: "+5%", trendUp: true, emoji: "\u{1F504}", color: "#a855f7" },
  { label: "SPARK Avg", value: "74%", trend: "+2%", trendUp: true, emoji: "\u26A1", color: "#ec4899" },
  { label: "Parent Engagement", value: "58%", trend: "-3%", trendUp: false, emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}", color: "#ef4444" },
  { label: "Avg Session", value: "22 min", trend: "+1 min", trendUp: true, emoji: "\u23F1\uFE0F", color: "#f59e0b" },
];

export const DEMO_ALL_CLASSES = [
  { id: "1", name: "Class 1", section: "A", teacher: "Mrs. Lakshmi", studentCount: 40, avgAccuracy: 88, coverage: 92 },
  { id: "2", name: "Class 1", section: "B", teacher: "Mrs. Deepa", studentCount: 38, avgAccuracy: 85, coverage: 89 },
  { id: "3", name: "Class 3", section: "A", teacher: "Mr. Suresh", studentCount: 42, avgAccuracy: 82, coverage: 85 },
  { id: "4", name: "Class 5", section: "A", teacher: "Ms. Kavita", studentCount: 44, avgAccuracy: 79, coverage: 78 },
  { id: "5", name: "Class 7", section: "A", teacher: "Ms. Priya", studentCount: 42, avgAccuracy: 82, coverage: 78 },
  { id: "6", name: "Class 7", section: "B", teacher: "Mr. Rajesh", studentCount: 38, avgAccuracy: 76, coverage: 72 },
  { id: "7", name: "Class 8", section: "A", teacher: "Ms. Priya", studentCount: 40, avgAccuracy: 85, coverage: 81 },
  { id: "8", name: "Class 9", section: "A", teacher: "Mr. Amit", studentCount: 45, avgAccuracy: 74, coverage: 68 },
  { id: "9", name: "Class 10", section: "A", teacher: "Mr. Amit", studentCount: 46, avgAccuracy: 78, coverage: 75 },
  { id: "10", name: "Class 10", section: "B", teacher: "Mrs. Nisha", studentCount: 44, avgAccuracy: 72, coverage: 70 },
  { id: "11", name: "Class 11", section: "A (PCM)", teacher: "Dr. Sharma", studentCount: 35, avgAccuracy: 81, coverage: 65 },
  { id: "12", name: "Class 12", section: "A (PCM)", teacher: "Dr. Sharma", studentCount: 32, avgAccuracy: 79, coverage: 60 },
];

export const DEMO_ALL_TEACHERS = [
  { id: "1", name: "Ms. Priya Verma", email: "priya.v@dps.edu", subject: "Mathematics", classes: ["7A", "7B", "8A"], status: "active" as const, lastActive: "15 min ago", flags: 2 },
  { id: "2", name: "Mr. Rajesh Iyer", email: "rajesh@dps.edu", subject: "Science", classes: ["7B", "8A"], status: "active" as const, lastActive: "2 hr ago", flags: 0 },
  { id: "3", name: "Mrs. Lakshmi Nair", email: "lakshmi@dps.edu", subject: "English", classes: ["1A", "2A"], status: "active" as const, lastActive: "30 min ago", flags: 1 },
  { id: "4", name: "Mr. Amit Joshi", email: "amit@dps.edu", subject: "Physics", classes: ["9A", "10A", "10B"], status: "active" as const, lastActive: "1 hr ago", flags: 0 },
  { id: "5", name: "Mrs. Nisha Das", email: "nisha@dps.edu", subject: "Chemistry", classes: ["10B", "11A"], status: "active" as const, lastActive: "45 min ago", flags: 0 },
  { id: "6", name: "Dr. Sharma", email: "sharma@dps.edu", subject: "Physics", classes: ["11A", "12A"], status: "active" as const, lastActive: "3 hr ago", flags: 1 },
  { id: "7", name: "Mrs. Sunita Rao", email: "sunita@dps.edu", subject: "Hindi", classes: ["3A", "5A"], status: "invited" as const, lastActive: "Never", flags: 0 },
  { id: "8", name: "Mr. Karan Mehta", email: "karan@dps.edu", subject: "Social Science", classes: ["9A"], status: "inactive" as const, lastActive: "2 weeks ago", flags: 0 },
];

export const DEMO_ALL_STUDENTS_SCHOOL = [
  { id: "1", name: "Aarav Sharma", class: "7A", section: "A", accuracy: 92, lastActive: "2 min ago", status: "active" as const },
  { id: "2", name: "Priya Patel", class: "7A", section: "A", accuracy: 88, lastActive: "5 min ago", status: "active" as const },
  { id: "3", name: "Rohan Kumar", class: "8A", section: "A", accuracy: 76, lastActive: "1 hr ago", status: "active" as const },
  { id: "4", name: "Ananya Mishra", class: "10A", section: "A", accuracy: 95, lastActive: "10 min ago", status: "active" as const },
  { id: "5", name: "Vikram Joshi", class: "7B", section: "B", accuracy: 62, lastActive: "3 days ago", status: "inactive" as const },
  { id: "6", name: "Riya Gupta", class: "9A", section: "A", accuracy: 84, lastActive: "30 min ago", status: "active" as const },
  { id: "7", name: "Arjun Das", class: "12A", section: "A", accuracy: 71, lastActive: "2 hr ago", status: "active" as const },
  { id: "8", name: "Meera Reddy", class: "5A", section: "A", accuracy: 89, lastActive: "15 min ago", status: "active" as const },
  { id: "9", name: "Kabir Thakur", class: "3A", section: "A", accuracy: 58, lastActive: "5 days ago", status: "inactive" as const },
  { id: "10", name: "Ishita Chopra", class: "1A", section: "A", accuracy: 91, lastActive: "8 min ago", status: "active" as const },
];

export const DEMO_REPORT_TYPES = [
  { type: "Weekly Digest", description: "Auto-generated every Sunday. School-wide trends, top performers, areas needing attention.", frequency: "Weekly", lastGenerated: "Feb 16, 2026", emoji: "\u{1F4CA}" },
  { type: "PTM Report", description: "Per-student report cards for parent-teacher meetings. Includes SPARK profile, revision health, and mastery breakdown.", frequency: "On-demand", lastGenerated: "Feb 10, 2026", emoji: "\u{1F4CB}" },
  { type: "Term Report", description: "Comprehensive term-end analysis. Class rankings, subject trends, improvement trajectory.", frequency: "Quarterly", lastGenerated: "Dec 15, 2025", emoji: "\u{1F4C8}" },
];

export const DEMO_ONBOARDING_STEPS = [
  { step: 1, title: "School Info", emoji: "\u{1F3EB}", description: "Verify school details and code", completed: true },
  { step: 2, title: "Invite Teachers", emoji: "\u{1F4DA}", description: "Send invite links to teachers", completed: true },
  { step: 3, title: "Enroll Students", emoji: "\u{1F465}", description: "Bulk upload via CSV or share code", completed: false },
  { step: 4, title: "Go Live", emoji: "\u{1F680}", description: "Review and launch", completed: false },
];
