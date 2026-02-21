// Schools (6 entries)
export const DEMO_SCHOOLS = [
  { id: "1", name: "Delhi Public School, R.K. Puram", city: "New Delhi", board: "CBSE", studentCount: 2400, teacherCount: 85, dau: 1850, status: "active" as const },
  { id: "2", name: "Modern School, Barakhamba", city: "New Delhi", board: "CBSE", studentCount: 1800, teacherCount: 62, dau: 1200, status: "active" as const },
  { id: "3", name: "La Martiniere College", city: "Kolkata", board: "ICSE", studentCount: 1200, teacherCount: 45, dau: 890, status: "active" as const },
  { id: "4", name: "Bishop Cotton School", city: "Shimla", board: "ICSE", studentCount: 800, teacherCount: 30, dau: 620, status: "active" as const },
  { id: "5", name: "Kendriya Vidyalaya #1", city: "Bangalore", board: "CBSE", studentCount: 1500, teacherCount: 52, dau: 980, status: "onboarding" as const },
  { id: "6", name: "Springdale School", city: "Jaipur", board: "CBSE", studentCount: 600, teacherCount: 22, dau: 0, status: "inactive" as const },
];

// Users across roles (15)
export const DEMO_ADMIN_USERS = [
  { id: "1", name: "Aarav Sharma", role: "Student", email: "aarav@learnx.app", lastActive: "2 min ago", status: "active" as const },
  { id: "2", name: "Priya Patel", role: "Student", email: "priya@learnx.app", lastActive: "5 min ago", status: "active" as const },
  { id: "3", name: "Rohan Kumar", role: "Student", email: "rohan@learnx.app", lastActive: "1 hr ago", status: "active" as const },
  { id: "4", name: "Ananya Singh", role: "Student", email: "ananya@learnx.app", lastActive: "3 hr ago", status: "active" as const },
  { id: "5", name: "Mrs. Sharma", role: "Parent", email: "sharma@gmail.com", lastActive: "10 min ago", status: "active" as const },
  { id: "6", name: "Mr. Patel", role: "Parent", email: "patel@gmail.com", lastActive: "1 day ago", status: "active" as const },
  { id: "7", name: "Ms. Priya Verma", role: "Teacher", email: "priya.v@dps.edu", lastActive: "15 min ago", status: "active" as const },
  { id: "8", name: "Mr. Rajesh Iyer", role: "Teacher", email: "rajesh@dps.edu", lastActive: "2 hr ago", status: "active" as const },
  { id: "9", name: "Mrs. Sunita Das", role: "Teacher", email: "sunita@modern.edu", lastActive: "1 day ago", status: "active" as const },
  { id: "10", name: "Mr. Kapoor", role: "School Admin", email: "kapoor@dps.edu", lastActive: "30 min ago", status: "active" as const },
  { id: "11", name: "Mrs. Mehra", role: "School Admin", email: "mehra@modern.edu", lastActive: "2 hr ago", status: "active" as const },
  { id: "12", name: "Vikram Joshi", role: "Student", email: "vikram@learnx.app", lastActive: "5 days ago", status: "inactive" as const },
  { id: "13", name: "Riya Gupta", role: "Student", email: "riya@learnx.app", lastActive: "3 days ago", status: "suspended" as const },
  { id: "14", name: "Mr. Mehta", role: "Teacher", email: "mehta@kvb.edu", lastActive: "Never", status: "inactive" as const },
  { id: "15", name: "Admin", role: "Super Admin", email: "admin@learnx.app", lastActive: "Just now", status: "active" as const },
];

// Feature flags (8)
export const DEMO_FEATURE_FLAGS = [
  { key: "revision_planner", label: "Revision Planner", enabled: true, description: "R1-R10 spaced repetition system" },
  { key: "mistake_genome", label: "Mistake Genome", enabled: true, description: "AI-powered mistake pattern detection" },
  { key: "groerx", label: "GroerX Career", enabled: true, description: "Career intelligence system for C6+" },
  { key: "leaderboard", label: "Leaderboard", enabled: false, description: "Weekly class leaderboard (opt-in)" },
  { key: "parent_reports", label: "AI Parent Reports", enabled: true, description: "Weekly AI-generated progress reports" },
  { key: "mock_tests", label: "Mock Tests", enabled: false, description: "Full-length board exam mocks" },
  { key: "speed_drill", label: "Speed Drills", enabled: true, description: "Timed practice for competitive exams" },
  { key: "pdf_ingestion", label: "PDF Ingestion", enabled: false, description: "Auto-extract content from textbook PDFs" },
];

// Platform alerts (8)
export const DEMO_PLATFORM_ALERTS = [
  { type: "gap", message: "Fraction Addition: 340 students share misconception 'add numerators AND denominators'", severity: "critical" as const, time: "2 min ago", emoji: "🔴" },
  { type: "churn", message: "12 students inactive for 5+ days in Class 8", severity: "warning" as const, time: "15 min ago", emoji: "🟡" },
  { type: "content", message: "Batch #47 validation complete: 18/20 passed, 2 soft-fails", severity: "info" as const, time: "1 hr ago", emoji: "🔵" },
  { type: "school", message: "KV Bangalore onboarding complete — 1,500 students enrolled", severity: "info" as const, time: "2 hr ago", emoji: "🟢" },
  { type: "gap", message: "Decimal placement error rising in C5 Mathematics (180 students)", severity: "warning" as const, time: "3 hr ago", emoji: "🟡" },
  { type: "teacher", message: "3 new content flags from teachers this week", severity: "info" as const, time: "5 hr ago", emoji: "🔵" },
  { type: "revision", message: "C10 revision backlog at 23% — above 15% threshold", severity: "warning" as const, time: "6 hr ago", emoji: "🟡" },
  { type: "content", message: "TTS generation queue: 45 pending, avg 2.3s/clip", severity: "info" as const, time: "8 hr ago", emoji: "🔵" },
];

// Engagement heatmap data (12 classes x 6 subjects)
export const DEMO_ENGAGEMENT_HEATMAP = Array.from({ length: 12 }, (_, i) => ({
  class: i + 1,
  subjects: [
    { name: "Math", engagement: Math.round(40 + Math.random() * 55) },
    { name: "Science", engagement: Math.round(35 + Math.random() * 55) },
    { name: "English", engagement: Math.round(30 + Math.random() * 60) },
    { name: "Hindi", engagement: Math.round(25 + Math.random() * 50) },
    { name: "Social", engagement: Math.round(20 + Math.random() * 55) },
    { name: "Life Skills", engagement: Math.round(15 + Math.random() * 45) },
  ],
}));

// Content gaps
export const DEMO_CONTENT_GAPS = [
  { class: 1, subject: "Mathematics", total: 120, covered: 114, gapPercent: 5 },
  { class: 1, subject: "English", total: 95, covered: 90, gapPercent: 5 },
  { class: 2, subject: "Mathematics", total: 135, covered: 125, gapPercent: 7 },
  { class: 3, subject: "Science", total: 160, covered: 140, gapPercent: 13 },
  { class: 4, subject: "Mathematics", total: 180, covered: 162, gapPercent: 10 },
  { class: 5, subject: "Science", total: 200, covered: 170, gapPercent: 15 },
  { class: 6, subject: "Physics", total: 220, covered: 44, gapPercent: 80 },
  { class: 7, subject: "Chemistry", total: 240, covered: 36, gapPercent: 85 },
  { class: 8, subject: "Biology", total: 210, covered: 21, gapPercent: 90 },
  { class: 9, subject: "Mathematics", total: 280, covered: 28, gapPercent: 90 },
  { class: 10, subject: "Physics", total: 300, covered: 30, gapPercent: 90 },
  { class: 11, subject: "Physics", total: 350, covered: 35, gapPercent: 90 },
  { class: 12, subject: "Chemistry", total: 380, covered: 38, gapPercent: 90 },
];

// Detected gaps (platform-wide misconceptions)
export const DEMO_DETECTED_GAPS = [
  { concept: "Fraction Addition", class: 5, subject: "Mathematics", pattern: "Add numerators AND denominators", students: 340, priority: "P0" as const, status: "DETECTED" as const },
  { concept: "Decimal Placement", class: 5, subject: "Mathematics", pattern: "Ignore decimal point in multiplication", students: 180, priority: "P0" as const, status: "GENERATING" as const },
  { concept: "Photosynthesis", class: 7, subject: "Science", pattern: "Plants breathe CO2 only", students: 156, priority: "P1" as const, status: "DEPLOYED" as const },
  { concept: "Tense Agreement", class: 4, subject: "English", pattern: "Mix past and present in same sentence", students: 124, priority: "P1" as const, status: "DETECTED" as const },
  { concept: "Area vs Perimeter", class: 6, subject: "Mathematics", pattern: "Confuse area and perimeter formulas", students: 98, priority: "P1" as const, status: "SELECTED" as const },
  { concept: "Chemical Equations", class: 10, subject: "Chemistry", pattern: "Don't balance equations", students: 87, priority: "P2" as const, status: "DETECTED" as const },
  { concept: "Newton's 3rd Law", class: 9, subject: "Physics", pattern: "Action-reaction on same body", students: 72, priority: "P2" as const, status: "DETECTED" as const },
  { concept: "Subject-Verb Agreement", class: 3, subject: "English", pattern: "Plural noun + singular verb", students: 65, priority: "P2" as const, status: "RESOLVED" as const },
];

// Platform stats
export const DEMO_PLATFORM_STATS = [
  { label: "Total Students", value: "12,450", trend: "+340", trendUp: true, emoji: "🎓" },
  { label: "Active Today", value: "8,240", trend: "+12%", trendUp: true, emoji: "📊" },
  { label: "Schools", value: "180", trend: "+3", trendUp: true, emoji: "🏫" },
  { label: "Tutorials", value: "15,280", trend: "+420", trendUp: true, emoji: "📚" },
  { label: "SPARK Tests", value: "4,820", trend: "+180", trendUp: true, emoji: "⚡" },
  { label: "Avg Session", value: "24 min", trend: "+2 min", trendUp: true, emoji: "⏱️" },
];

// DAU trend (last 7 days)
export const DEMO_DAU_TREND = [
  { day: "Mon", value: 7200 },
  { day: "Tue", value: 7800 },
  { day: "Wed", value: 8100 },
  { day: "Thu", value: 7600 },
  { day: "Fri", value: 8400 },
  { day: "Sat", value: 6200 },
  { day: "Sun", value: 5800 },
];

// Feature usage
export const DEMO_FEATURE_USAGE = [
  { feature: "Tutorial Player", usage: 92, color: "#6366f1" },
  { feature: "SPARK Tests", usage: 78, color: "#2dd4bf" },
  { feature: "Revision Planner", usage: 65, color: "#10b981" },
  { feature: "Daily Blueprint", usage: 58, color: "#f59e0b" },
  { feature: "Mistake Genome", usage: 42, color: "#ef4444" },
  { feature: "GroerX Career", usage: 28, color: "#ec4899" },
];
