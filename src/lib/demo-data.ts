import {
  Student, Subject, SparkResult, RevisionTopic,
  FrameworkStep, LifeSkillDilemma, GardenPlant,
  MomentumData, ParentCard, MistakePattern, CareerPath, TierKey,
} from "./types";

// ═══ DEMO STUDENTS (one per tier) ═══
export const DEMO_STUDENTS: Record<TierKey, Student> = {
  storybook: {
    name: "Meera",
    class: 1,
    section: "A",
    school: "Delhi Public School",
    avatar: "🧒🏽",
    tier: "storybook",
    xp: 245,
    level: 3,
    streak: 5,
    completedTopics: 12,
    totalTopics: 80,
  },
  explorer: {
    name: "Aarav",
    class: 5,
    section: "B",
    school: "Kendriya Vidyalaya",
    avatar: "👦🏽",
    tier: "explorer",
    xp: 1820,
    level: 12,
    streak: 14,
    completedTopics: 86,
    totalTopics: 220,
  },
  studio: {
    name: "Kavya",
    class: 8,
    section: "C",
    school: "DAV Model School",
    avatar: "👩🏽",
    tier: "studio",
    xp: 4250,
    level: 24,
    streak: 21,
    completedTopics: 142,
    totalTopics: 380,
  },
  board: {
    name: "Rohan",
    class: 10,
    section: "A",
    school: "Ryan International",
    avatar: "👨🏽",
    tier: "board",
    xp: 6800,
    level: 32,
    streak: 45,
    completedTopics: 234,
    totalTopics: 480,
  },
  pro: {
    name: "Sneha",
    class: 12,
    section: "PCM",
    school: "St. Xavier's",
    avatar: "👩🏽‍🎓",
    tier: "pro",
    xp: 9200,
    level: 45,
    streak: 60,
    completedTopics: 312,
    totalTopics: 520,
  },
};

// ═══ SUBJECTS (tier-adapted) ═══
export const SUBJECTS_BY_TIER: Record<TierKey, Subject[]> = {
  storybook: [
    { id: "math", name: "Numbers", emoji: "🔢", color: "#6366f1", progress: 25, chaptersCompleted: 2, totalChapters: 8, currentTopic: "What is Addition?" },
    { id: "english", name: "Stories", emoji: "📖", color: "#f472b6", progress: 30, chaptersCompleted: 3, totalChapters: 10, currentTopic: "The Alphabet Song" },
    { id: "evs", name: "My World", emoji: "🌍", color: "#2dd4bf", progress: 15, chaptersCompleted: 1, totalChapters: 7, currentTopic: "My Family" },
    { id: "hindi", name: "Hindi", emoji: "🕉️", color: "#fb923c", progress: 20, chaptersCompleted: 2, totalChapters: 8, currentTopic: "अ से अनार" },
    { id: "art", name: "Drawing", emoji: "🎨", color: "#a78bfa", progress: 40, chaptersCompleted: 4, totalChapters: 10, currentTopic: "Shapes & Colors" },
    { id: "life", name: "Good Habits", emoji: "💛", color: "#fbbf24", progress: 10, chaptersCompleted: 1, totalChapters: 13, currentTopic: "Sharing is Caring" },
  ],
  explorer: [
    { id: "math", name: "Mathematics", emoji: "📐", color: "#6366f1", progress: 42, chaptersCompleted: 5, totalChapters: 12, currentTopic: "Fractions" },
    { id: "science", name: "Science", emoji: "🔬", color: "#2dd4bf", progress: 38, chaptersCompleted: 4, totalChapters: 11, currentTopic: "Photosynthesis" },
    { id: "english", name: "English", emoji: "📚", color: "#f472b6", progress: 45, chaptersCompleted: 5, totalChapters: 11, currentTopic: "Parts of Speech" },
    { id: "sst", name: "Social Studies", emoji: "🗺️", color: "#fb923c", progress: 30, chaptersCompleted: 3, totalChapters: 10, currentTopic: "Indian States" },
    { id: "hindi", name: "Hindi", emoji: "🕉️", color: "#fbbf24", progress: 35, chaptersCompleted: 4, totalChapters: 10, currentTopic: "विशेषण" },
    { id: "life", name: "Life Skills", emoji: "💛", color: "#8b5cf6", progress: 22, chaptersCompleted: 2, totalChapters: 13, currentTopic: "Being a Team Player" },
  ],
  studio: [
    { id: "math", name: "Mathematics", emoji: "📐", color: "#6366f1", progress: 55, chaptersCompleted: 7, totalChapters: 14, currentTopic: "Algebraic Expressions" },
    { id: "science", name: "Science", emoji: "🧪", color: "#2dd4bf", progress: 48, chaptersCompleted: 6, totalChapters: 13, currentTopic: "Combustion & Flame" },
    { id: "english", name: "English", emoji: "📖", color: "#f472b6", progress: 50, chaptersCompleted: 6, totalChapters: 12, currentTopic: "Active & Passive Voice" },
    { id: "sst", name: "Social Science", emoji: "🏛️", color: "#fb923c", progress: 40, chaptersCompleted: 5, totalChapters: 12, currentTopic: "French Revolution" },
    { id: "hindi", name: "Hindi", emoji: "📝", color: "#fbbf24", progress: 44, chaptersCompleted: 5, totalChapters: 11, currentTopic: "समास" },
    { id: "life", name: "Life Skills", emoji: "💛", color: "#8b5cf6", progress: 35, chaptersCompleted: 4, totalChapters: 13, currentTopic: "Managing Emotions" },
  ],
  board: [
    { id: "math", name: "Mathematics", emoji: "📐", color: "#6366f1", progress: 62, chaptersCompleted: 9, totalChapters: 15, currentTopic: "Quadratic Equations" },
    { id: "science", name: "Science", emoji: "⚗️", color: "#2dd4bf", progress: 58, chaptersCompleted: 8, totalChapters: 14, currentTopic: "Chemical Reactions" },
    { id: "english", name: "English", emoji: "📖", color: "#f472b6", progress: 65, chaptersCompleted: 8, totalChapters: 12, currentTopic: "Letter Writing" },
    { id: "sst", name: "Social Science", emoji: "🏛️", color: "#fb923c", progress: 52, chaptersCompleted: 7, totalChapters: 13, currentTopic: "Nationalism in India" },
    { id: "hindi", name: "Hindi", emoji: "📝", color: "#fbbf24", progress: 55, chaptersCompleted: 6, totalChapters: 11, currentTopic: "पत्र लेखन" },
    { id: "life", name: "Life Skills", emoji: "💛", color: "#8b5cf6", progress: 45, chaptersCompleted: 5, totalChapters: 13, currentTopic: "Peer Pressure" },
  ],
  pro: [
    { id: "physics", name: "Physics", emoji: "⚡", color: "#6366f1", progress: 68, chaptersCompleted: 10, totalChapters: 15, currentTopic: "Electromagnetic Induction" },
    { id: "chemistry", name: "Chemistry", emoji: "⚗️", color: "#2dd4bf", progress: 60, chaptersCompleted: 9, totalChapters: 16, currentTopic: "Organic Chemistry" },
    { id: "math", name: "Mathematics", emoji: "∫", color: "#f472b6", progress: 55, chaptersCompleted: 8, totalChapters: 14, currentTopic: "Integration" },
    { id: "cs", name: "Computer Science", emoji: "💻", color: "#fb923c", progress: 72, chaptersCompleted: 10, totalChapters: 14, currentTopic: "Data Structures" },
    { id: "english", name: "English", emoji: "📖", color: "#fbbf24", progress: 70, chaptersCompleted: 8, totalChapters: 11, currentTopic: "Report Writing" },
    { id: "life", name: "Life Skills", emoji: "💛", color: "#8b5cf6", progress: 50, chaptersCompleted: 6, totalChapters: 13, currentTopic: "Career Planning" },
  ],
};

// ═══ SPARK RESULTS ═══
export const DEMO_SPARK: Record<TierKey, SparkResult> = {
  storybook: {
    domains: [
      { name: "Logical", emoji: "🧩", score: 7, maxScore: 10, level: "Developing" },
      { name: "Linguistic", emoji: "📖", score: 8, maxScore: 10, level: "Proficient" },
      { name: "Spatial", emoji: "🎨", score: 6, maxScore: 10, level: "Developing" },
      { name: "Musical", emoji: "🎵", score: 9, maxScore: 10, level: "Advanced" },
      { name: "Bodily", emoji: "🤸", score: 7, maxScore: 10, level: "Developing" },
      { name: "Interpersonal", emoji: "🤝", score: 8, maxScore: 10, level: "Proficient" },
      { name: "Intrapersonal", emoji: "🧘", score: 6, maxScore: 10, level: "Developing" },
      { name: "Naturalistic", emoji: "🌿", score: 7, maxScore: 10, level: "Developing" },
      { name: "Existential", emoji: "💭", score: 5, maxScore: 10, level: "Emerging" },
    ],
    overallLevel: "Developing",
    testDate: "2026-02-15",
    questionsAnswered: 10,
  },
  explorer: {
    domains: [
      { name: "Logical", emoji: "🧩", score: 14, maxScore: 20, level: "Proficient" },
      { name: "Linguistic", emoji: "📖", score: 16, maxScore: 20, level: "Advanced" },
      { name: "Spatial", emoji: "🎨", score: 12, maxScore: 20, level: "Developing" },
      { name: "Musical", emoji: "🎵", score: 15, maxScore: 20, level: "Proficient" },
      { name: "Bodily", emoji: "🤸", score: 13, maxScore: 20, level: "Proficient" },
      { name: "Interpersonal", emoji: "🤝", score: 17, maxScore: 20, level: "Advanced" },
      { name: "Intrapersonal", emoji: "🧘", score: 11, maxScore: 20, level: "Developing" },
      { name: "Naturalistic", emoji: "🌿", score: 14, maxScore: 20, level: "Proficient" },
      { name: "Existential", emoji: "💭", score: 10, maxScore: 20, level: "Developing" },
    ],
    overallLevel: "Proficient",
    testDate: "2026-02-10",
    questionsAnswered: 15,
  },
  studio: {
    domains: [
      { name: "Logical", emoji: "🧩", score: 18, maxScore: 25, level: "Proficient" },
      { name: "Linguistic", emoji: "📖", score: 20, maxScore: 25, level: "Advanced" },
      { name: "Spatial", emoji: "🎨", score: 15, maxScore: 25, level: "Developing" },
      { name: "Musical", emoji: "🎵", score: 17, maxScore: 25, level: "Proficient" },
      { name: "Bodily", emoji: "🤸", score: 16, maxScore: 25, level: "Proficient" },
      { name: "Interpersonal", emoji: "🤝", score: 21, maxScore: 25, level: "Advanced" },
      { name: "Intrapersonal", emoji: "🧘", score: 14, maxScore: 25, level: "Developing" },
      { name: "Naturalistic", emoji: "🌿", score: 18, maxScore: 25, level: "Proficient" },
      { name: "Existential", emoji: "💭", score: 13, maxScore: 25, level: "Developing" },
    ],
    overallLevel: "Proficient",
    testDate: "2026-02-08",
    questionsAnswered: 20,
  },
  board: {
    domains: [
      { name: "Logical", emoji: "🧩", score: 22, maxScore: 25, level: "Advanced" },
      { name: "Linguistic", emoji: "📖", score: 20, maxScore: 25, level: "Advanced" },
      { name: "Spatial", emoji: "🎨", score: 18, maxScore: 25, level: "Proficient" },
      { name: "Musical", emoji: "🎵", score: 15, maxScore: 25, level: "Developing" },
      { name: "Bodily", emoji: "🤸", score: 16, maxScore: 25, level: "Proficient" },
      { name: "Interpersonal", emoji: "🤝", score: 21, maxScore: 25, level: "Advanced" },
      { name: "Intrapersonal", emoji: "🧘", score: 19, maxScore: 25, level: "Proficient" },
      { name: "Naturalistic", emoji: "🌿", score: 17, maxScore: 25, level: "Proficient" },
      { name: "Existential", emoji: "💭", score: 16, maxScore: 25, level: "Proficient" },
    ],
    overallLevel: "Advanced",
    testDate: "2026-02-05",
    questionsAnswered: 25,
  },
  pro: {
    domains: [
      { name: "Logical", emoji: "🧩", score: 24, maxScore: 25, level: "Exceptional" },
      { name: "Linguistic", emoji: "📖", score: 21, maxScore: 25, level: "Advanced" },
      { name: "Spatial", emoji: "🎨", score: 20, maxScore: 25, level: "Advanced" },
      { name: "Musical", emoji: "🎵", score: 14, maxScore: 25, level: "Developing" },
      { name: "Bodily", emoji: "🤸", score: 15, maxScore: 25, level: "Developing" },
      { name: "Interpersonal", emoji: "🤝", score: 22, maxScore: 25, level: "Advanced" },
      { name: "Intrapersonal", emoji: "🧘", score: 23, maxScore: 25, level: "Exceptional" },
      { name: "Naturalistic", emoji: "🌿", score: 18, maxScore: 25, level: "Proficient" },
      { name: "Existential", emoji: "💭", score: 20, maxScore: 25, level: "Advanced" },
    ],
    overallLevel: "Advanced",
    testDate: "2026-02-01",
    questionsAnswered: 25,
  },
};

// ═══ REVISION TOPICS ═══
export const DEMO_REVISION: RevisionTopic[] = [
  { id: "r1", name: "Addition of 2-digit numbers", subject: "Mathematics", currentRound: 5, maxRounds: 10, lastScore: 90, nextDue: "Today", status: "due" },
  { id: "r2", name: "Nouns & Pronouns", subject: "English", currentRound: 3, maxRounds: 10, lastScore: 75, nextDue: "Today", status: "due" },
  { id: "r3", name: "Photosynthesis", subject: "Science", currentRound: 7, maxRounds: 10, lastScore: 95, nextDue: "Tomorrow", status: "upcoming" },
  { id: "r4", name: "Quadratic Formula", subject: "Mathematics", currentRound: 10, maxRounds: 10, lastScore: 100, nextDue: "Mastered", status: "mastered" },
  { id: "r5", name: "Chemical Bonding", subject: "Science", currentRound: 2, maxRounds: 10, lastScore: 45, nextDue: "Today", status: "struggling" },
  { id: "r6", name: "French Revolution", subject: "Social Science", currentRound: 4, maxRounds: 10, lastScore: 80, nextDue: "Feb 23", status: "upcoming" },
  { id: "r7", name: "Trigonometry Basics", subject: "Mathematics", currentRound: 6, maxRounds: 10, lastScore: 85, nextDue: "Feb 24", status: "upcoming" },
  { id: "r8", name: "Active-Passive Voice", subject: "English", currentRound: 8, maxRounds: 10, lastScore: 92, nextDue: "Feb 25", status: "upcoming" },
];

// ═══ FRAMEWORK STEPS (Addition demo) ═══
export const DEMO_STEPS_STORYBOOK: FrameworkStep[] = [
  { id: 1, title: "Story Time!", emoji: "📖", content: "Ravi has 2 mangoes. His friend Priya gives him 3 more mangoes. Let's count how many mangoes Ravi has now!", voiceText: "Ravi has two mangoes...", activity: undefined },
  { id: 2, title: "Let's Count!", emoji: "🔢", content: "2 mangoes + 3 mangoes = ? Let's put them together and count!", voiceText: "Let's put them together...", activity: undefined },
  { id: 3, title: "The Answer!", emoji: "⭐", content: "2 + 3 = 5! Ravi now has 5 mangoes! When we put things together, it's called ADDITION.", voiceText: "Two plus three equals five...", activity: undefined },
  { id: 4, title: "Your Turn!", emoji: "🎮", content: "Now you try! Count the mangoes.", voiceText: "Now it's your turn...", activity: { type: "mcq", question: "Meera has 3 bananas. She gets 2 more. How many now?", options: ["3", "4", "5", "6"], correctAnswer: 2 } },
  { id: 5, title: "Amazing!", emoji: "🎉", content: "You did it! You learned addition! Your garden is growing!", voiceText: "You did it! Amazing!", activity: undefined },
];

export const DEMO_STEPS_STUDIO: FrameworkStep[] = [
  { id: 1, title: "Hook", emoji: "🎣", content: "Why does iron rust but gold doesn't? The answer lies in chemical reactions — transformations where substances change into entirely new materials.", voiceText: "Why does iron rust...", activity: undefined },
  { id: 2, title: "Core Concept", emoji: "📐", content: "A chemical reaction occurs when bonds between atoms break and reform to create new substances. Reactants → Products. The total mass is always conserved (Law of Conservation of Mass).", voiceText: "A chemical reaction occurs when...", activity: undefined },
  { id: 3, title: "Visual Model", emoji: "🔬", content: "Types of Reactions:\n• Combination: A + B → AB\n• Decomposition: AB → A + B\n• Displacement: A + BC → AC + B\n• Double Displacement: AB + CD → AD + CB\n• Redox: Electron transfer reactions", voiceText: "There are five types...", activity: undefined },
  { id: 4, title: "Worked Example", emoji: "✏️", content: "Balance this equation: Fe + O₂ → Fe₂O₃\nStep 1: Count atoms — Fe: 1→2, O: 2→3\nStep 2: Balance Fe → 2Fe\nStep 3: Balance O → 3/2 O₂\nStep 4: Remove fraction → 4Fe + 3O₂ → 2Fe₂O₃", voiceText: "Let's balance this equation...", activity: undefined },
  { id: 5, title: "Practice", emoji: "🎯", content: "Which type of reaction is this? 2Mg + O₂ → 2MgO", voiceText: "Which type of reaction...", activity: { type: "mcq", question: "2Mg + O₂ → 2MgO is a:", options: ["Decomposition", "Combination", "Displacement", "Double Displacement"], correctAnswer: 1 } },
  { id: 6, title: "Common Mistakes", emoji: "⚠️", content: "❌ Forgetting to balance equations\n❌ Confusing displacement with double displacement\n❌ Thinking mass changes in reactions\n✅ Always check atom counts on both sides", voiceText: "Here are common mistakes...", activity: undefined },
  { id: 7, title: "Connect", emoji: "🔗", content: "Chemical reactions connect to:\n→ Acids, Bases & Salts (neutralization)\n→ Metals & Non-metals (reactivity series)\n→ Carbon compounds (organic reactions)\n→ Life processes (metabolism)", voiceText: "Chemical reactions connect to...", activity: undefined },
  { id: 8, title: "Did You Know?", emoji: "💡", content: "Your body runs about 37 thousand billion billion chemical reactions every second! Digestion, breathing, even thinking — all chemical reactions.", voiceText: "Your body runs about...", activity: undefined },
];

// ═══ LIFE SKILLS DILEMMAS ═══
export const DEMO_LIFE_SKILLS: Record<TierKey, LifeSkillDilemma> = {
  storybook: {
    chapter: "Chapter 1: Sharing",
    title: "Meera's Crayons",
    story: "Meera has a brand new box of crayons. Her friend Priya forgot her crayons at home. Priya looks sad. Meera has enough crayons for both of them.",
    question: "What should Meera do?",
    options: [
      { text: "Share her crayons with Priya", outcome: "Priya smiles and they draw beautiful pictures together! Sharing made both of them happy." },
      { text: "Keep all crayons to herself", outcome: "Priya sits quietly with no colors. Meera has all the crayons but drawing alone isn't as fun." },
    ],
    tierAdaptation: "Simple scenario, clear right choice, immediate positive outcome shown",
  },
  explorer: {
    chapter: "Chapter 5: Teamwork",
    title: "The Science Project",
    story: "Aarav's team has a science project due Friday. Vikram hasn't done his part — he says he was busy with cricket practice. The rest of the team did their work. Without Vikram's part, the project is incomplete.",
    question: "What should Aarav suggest to the team?",
    options: [
      { text: "Help Vikram finish his part together", outcome: "The team works together, Vikram learns responsibility, and they submit a great project. Coach is impressed by their teamwork." },
      { text: "Tell the teacher Vikram didn't contribute", outcome: "Vikram gets in trouble, but the team still has an incomplete project. The friendship is strained." },
      { text: "Do Vikram's part for him", outcome: "The project is complete, but Vikram never learns. Next time, he might skip his part again." },
    ],
    tierAdaptation: "Multi-option with trade-offs, no single 'right' answer, discussion of consequences",
  },
  studio: {
    chapter: "Chapter 8: Digital Citizenship",
    title: "The Forwarded Message",
    story: "Kavya receives a WhatsApp message claiming a classmate cheated on the exam. It has been forwarded many times. She doesn't know if it's true. Her friends are asking her to forward it too.",
    question: "What should Kavya do?",
    options: [
      { text: "Don't forward — verify first", outcome: "She asks the classmate directly. Turns out it was a misunderstanding. She prevented a false rumor from spreading." },
      { text: "Forward to just close friends", outcome: "Even 'close friends' forward it further. Within hours, the whole school is talking. The classmate is devastated, and it wasn't even true." },
      { text: "Report the message as misinformation", outcome: "She takes a stand against unverified forwarding. It takes courage, but she protects someone from potential harm." },
    ],
    tierAdaptation: "Real-world digital scenario, ethical complexity, no perfect answer",
  },
  board: {
    chapter: "Chapter 10: Academic Integrity",
    title: "The Leaked Paper",
    story: "The night before the board math exam, Rohan receives a message: 'Bro, the paper leaked — here are the questions.' His friend swears it's real. Rohan has studied hard but is still nervous about quadratics.",
    question: "What does Rohan do?",
    options: [
      { text: "Ignore it and trust his preparation", outcome: "He focuses on revision instead. In the exam, none of the 'leaked' questions actually appear — it was fake. His honest preparation pays off with a solid 85%." },
      { text: "Look at it 'just to check'", outcome: "He peeks and now can't un-see it. During the exam, he's paranoid about getting caught. His anxiety hurts his performance. The leak was fake anyway." },
      { text: "Report it to the school", outcome: "Takes courage. The school investigates, and several students who memorized fake answers perform poorly. Rohan is commended for integrity." },
    ],
    tierAdaptation: "High-stakes ethical dilemma with real exam pressure, multiple valid responses, long-term consequences",
  },
  pro: {
    chapter: "Chapter 12: Career Ethics",
    title: "The Internship Dilemma",
    story: "Sneha gets selected for a summer internship at a top research lab. During orientation, she discovers they're working on an AI project that could automate thousands of data entry jobs in India. The tech is impressive, but she thinks about the workers who'd lose employment.",
    question: "How should Sneha approach this?",
    options: [
      { text: "Participate and push for responsible deployment", outcome: "She works on the project but advocates for a phased rollout with retraining programs. Her supervisor appreciates the perspective. She writes a paper on ethical AI deployment." },
      { text: "Raise concerns with the team lead", outcome: "She brings up the social impact. The team hadn't considered it deeply. They add an impact assessment to the project. Sneha gains respect for critical thinking." },
      { text: "Decline and find a different internship", outcome: "She follows her conscience but misses a learning opportunity. The project continues without her perspective. Sometimes walking away isn't the most impactful choice." },
    ],
    tierAdaptation: "Complex systemic ethical issue, no clear right answer, explores technology-society tension, career implications",
  },
};

// ═══ LEARNING GARDEN (C1-5) ═══
export const DEMO_GARDEN: GardenPlant[] = [
  { subjectId: "math", stage: "sapling", emoji: "🌱", topicsCompleted: 12 },
  { subjectId: "english", stage: "tree", emoji: "🌳", topicsCompleted: 18 },
  { subjectId: "evs", stage: "sprout", emoji: "🌿", topicsCompleted: 6 },
  { subjectId: "hindi", stage: "sapling", emoji: "🌱", topicsCompleted: 10 },
  { subjectId: "art", stage: "bloom", emoji: "🌸", topicsCompleted: 24 },
  { subjectId: "life", stage: "seed", emoji: "🫘", topicsCompleted: 2 },
];

// ═══ MOMENTUM DATA (C6-12) ═══
export const DEMO_MOMENTUM: MomentumData = {
  speed: 72,
  maxSpeed: 100,
  weeklyXP: 450,
  rank: 14,
  totalStudents: 180,
  streakDays: 21,
};

// ═══ PARENT CARDS ═══
export const DEMO_PARENT_CARDS: ParentCard[] = [
  { id: "p1", title: "Topics Completed", emoji: "📚", value: "12", detail: "+3 this week", trend: "up", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "p2", title: "Time Spent", emoji: "⏱️", value: "2.5 hrs", detail: "This week", trend: "stable", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "p3", title: "Strongest Subject", emoji: "💪", value: "English", detail: "85% accuracy", trend: "up", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "p4", title: "Needs Attention", emoji: "⚠️", value: "Science", detail: "45% accuracy", trend: "down", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "p5", title: "SPARK Level", emoji: "⚡", value: "Developing", detail: "9 domains assessed", trend: "up", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "p6", title: "Garden Growth", emoji: "🌱", value: "3 plants", detail: "2 sprouting", trend: "up", tiers: ["storybook", "explorer"] },
  { id: "p7", title: "Life Skills", emoji: "💛", value: "Ch. 3", detail: "On track", trend: "stable", tiers: ["storybook", "explorer", "studio", "board", "pro"] },
  { id: "p8", title: "Revision Due", emoji: "🔄", value: "4 topics", detail: "2 due today", trend: "stable", tiers: ["explorer", "studio", "board", "pro"] },
  { id: "p9", title: "Weekly Streak", emoji: "🔥", value: "5 days", detail: "Best: 8 days", trend: "up", tiers: ["explorer", "studio", "board", "pro"] },
  { id: "p10", title: "Momentum", emoji: "⚡", value: "72 km/h", detail: "Rank #14 in class", trend: "up", tiers: ["studio", "board", "pro"] },
  { id: "p11", title: "Mock Test Score", emoji: "📝", value: "78%", detail: "Last attempt", trend: "up", tiers: ["board", "pro"] },
  { id: "p12", title: "Syllabus Coverage", emoji: "📊", value: "62%", detail: "On track for boards", trend: "up", tiers: ["board", "pro"] },
  { id: "p13", title: "Board Readiness", emoji: "🎯", value: "Good", detail: "87 days to exam", trend: "up", tiers: ["board"] },
  { id: "p14", title: "Mistake Patterns", emoji: "🧬", value: "3 patterns", detail: "1 resolving", trend: "up", tiers: ["studio", "board", "pro"] },
  { id: "p15", title: "JEE Percentile", emoji: "🏆", value: "92.4", detail: "Predicted", trend: "up", tiers: ["pro"] },
  { id: "p16", title: "Career Match", emoji: "🚀", value: "Engineering", detail: "92% match", trend: "stable", tiers: ["pro"] },
];

// ═══ MISTAKE GENOME ═══
export const DEMO_MISTAKES: MistakePattern[] = [
  { id: "m1", type: "Calculation Error", description: "Drops negative signs in algebraic simplification", frequency: 8, subjects: ["Mathematics"], example: "-(3x+2) written as -3x+2 instead of -3x-2", suggestion: "Practice bracket expansion with sign tracking" },
  { id: "m2", type: "Concept Confusion", description: "Mixes up displacement and double displacement reactions", frequency: 5, subjects: ["Science"], example: "Classifying AB + CD → AD + CB as single displacement", suggestion: "Use the 'partner swap' analogy — double displacement = two couples swapping" },
  { id: "m3", type: "Reading Comprehension", description: "Misidentifies what the question is actually asking", frequency: 6, subjects: ["English", "Social Science"], example: "Asked for 'cause' but writes 'effect' in answer", suggestion: "Underline the action word in every question before answering" },
];

// ═══ GROERX CAREER PATHS ═══
export const DEMO_CAREERS: CareerPath[] = [
  { title: "Software Engineering", match: 94, domains: ["Logical", "Spatial", "Intrapersonal"], description: "Build the technology that powers the world", emoji: "💻" },
  { title: "Research Scientist", match: 88, domains: ["Logical", "Linguistic", "Existential"], description: "Discover new knowledge through systematic inquiry", emoji: "🔬" },
  { title: "Data Analyst", match: 85, domains: ["Logical", "Spatial", "Naturalistic"], description: "Find patterns and insights in complex data", emoji: "📊" },
  { title: "UX Designer", match: 78, domains: ["Spatial", "Interpersonal", "Linguistic"], description: "Design experiences that delight users", emoji: "🎨" },
  { title: "Entrepreneur", match: 72, domains: ["Interpersonal", "Intrapersonal", "Logical"], description: "Create and grow your own ventures", emoji: "🚀" },
];

// ═══ DAILY BLUEPRINT ═══
export interface DailyTask {
  id: string;
  time: string;
  title: string;
  subject: string;
  type: "learn" | "revise" | "practice" | "spark" | "life-skill";
  duration: string;
  completed: boolean;
  emoji: string;
}

export const DEMO_DAILY_TASKS: DailyTask[] = [
  { id: "d1", time: "9:00 AM", title: "Quadratic Equations — Discriminant", subject: "Mathematics", type: "learn", duration: "25 min", completed: true, emoji: "📐" },
  { id: "d2", time: "9:30 AM", title: "Revision: Chemical Bonding (R2)", subject: "Science", type: "revise", duration: "15 min", completed: true, emoji: "🔄" },
  { id: "d3", time: "10:00 AM", title: "Active-Passive Voice Practice", subject: "English", type: "practice", duration: "20 min", completed: false, emoji: "✏️" },
  { id: "d4", time: "10:30 AM", title: "SPARK Check: Logical Domain", subject: "SPARK", type: "spark", duration: "10 min", completed: false, emoji: "⚡" },
  { id: "d5", time: "11:00 AM", title: "Nationalism in India", subject: "Social Science", type: "learn", duration: "25 min", completed: false, emoji: "🏛️" },
  { id: "d6", time: "11:30 AM", title: "Peer Pressure — Dilemma", subject: "Life Skills", type: "life-skill", duration: "15 min", completed: false, emoji: "💛" },
];
