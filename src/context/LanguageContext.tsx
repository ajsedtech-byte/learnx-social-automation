"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type LangKey = "en" | "hi" | "hinglish";

interface LanguageContextType {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  t: (key: string) => string;
  langLabel: string;
}

const LANG_LABELS: Record<LangKey, string> = {
  en: "English",
  hi: "हिन्दी",
  hinglish: "Hinglish",
};

/* ── Minimal translation dictionary ──
   In production this would be a full i18n system.
   We ship enough keys to demonstrate the feature. */
const DICT: Record<string, Record<LangKey, string>> = {
  "nav.home": { en: "Home", hi: "होम", hinglish: "Home" },
  "nav.spark": { en: "SPARK Profile", hi: "स्पार्क प्रोफ़ाइल", hinglish: "SPARK Profile" },
  "nav.revision": { en: "Revision", hi: "रिवीज़न", hinglish: "Revision" },
  "nav.daily": { en: "Daily Blueprint", hi: "दैनिक ब्लूप्रिंट", hinglish: "Daily Blueprint" },
  "nav.mistakes": { en: "Mistake Genome", hi: "गलती जीनोम", hinglish: "Mistake Genome" },
  "nav.garden": { en: "Garden", hi: "बगीचा", hinglish: "Garden" },
  "nav.momentum": { en: "Momentum", hi: "गति", hinglish: "Momentum" },
  "nav.player": { en: "Player", hi: "प्लेयर", hinglish: "Player" },
  "nav.lifeSkills": { en: "Life Skills", hi: "जीवन कौशल", hinglish: "Life Skills" },
  "nav.groerx": { en: "GroerX Career", hi: "ग्रोएरएक्स करियर", hinglish: "GroerX Career" },
  "nav.parent": { en: "Parent View", hi: "अभिभावक दृश्य", hinglish: "Parent View" },
  "nav.teacher": { en: "Teacher", hi: "शिक्षक", hinglish: "Teacher" },
  "nav.admin": { en: "Super Admin", hi: "सुपर एडमिन", hinglish: "Super Admin" },
  "nav.schoolAdmin": { en: "School Admin", hi: "स्कूल एडमिन", hinglish: "School Admin" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल", hinglish: "Profile" },
  "nav.settings": { en: "Settings", hi: "सेटिंग्स", hinglish: "Settings" },

  "dash.welcome": { en: "Welcome back", hi: "वापसी पर स्वागत", hinglish: "Welcome back" },
  "dash.streak": { en: "Day Streak", hi: "दिन की स्ट्रीक", hinglish: "Day Streak" },
  "dash.xp": { en: "XP Earned", hi: "XP अर्जित", hinglish: "XP Earned" },
  "dash.level": { en: "Level", hi: "स्तर", hinglish: "Level" },
  "dash.topics": { en: "Topics Done", hi: "विषय पूर्ण", hinglish: "Topics Done" },

  "spark.title": { en: "SPARK Intelligence Profile", hi: "स्पार्क बुद्धिमत्ता प्रोफ़ाइल", hinglish: "SPARK Intelligence Profile" },
  "spark.test": { en: "Take Test", hi: "टेस्ट दें", hinglish: "Test Do" },
  "spark.confidence": { en: "Confidence", hi: "विश्वास", hinglish: "Confidence" },

  "revision.title": { en: "Spaced Revision", hi: "स्पेस्ड रिवीज़न", hinglish: "Spaced Revision" },
  "revision.due": { en: "Due Today", hi: "आज देय", hinglish: "Aaj Due" },
  "revision.round": { en: "Round", hi: "राउंड", hinglish: "Round" },

  "mistakes.title": { en: "Mistake Genome", hi: "गलती जीनोम", hinglish: "Mistake Genome" },
  "mistakes.strengths": { en: "Strengths", hi: "ताकतें", hinglish: "Strengths" },
  "mistakes.practice": { en: "Needs Practice", hi: "अभ्यास ज़रूरी", hinglish: "Practice Chahiye" },

  "garden.title": { en: "Knowledge Garden", hi: "ज्ञान बगीचा", hinglish: "Knowledge Garden" },
  "garden.showMummy": { en: "Show Mummy", hi: "मम्मी को दिखाओ", hinglish: "Mummy Ko Dikhao" },

  "momentum.title": { en: "Momentum", hi: "गति", hinglish: "Momentum" },
  "momentum.speed": { en: "Current Speed", hi: "वर्तमान गति", hinglish: "Current Speed" },

  "daily.title": { en: "Today's Blueprint", hi: "आज का ब्लूप्रिंट", hinglish: "Aaj Ka Blueprint" },
  "daily.tasks": { en: "tasks for today", hi: "आज के कार्य", hinglish: "aaj ke tasks" },

  "parent.title": { en: "Parent Dashboard", hi: "अभिभावक डैशबोर्ड", hinglish: "Parent Dashboard" },
  "parent.aiReport": { en: "AI Weekly Report", hi: "AI साप्ताहिक रिपोर्ट", hinglish: "AI Weekly Report" },

  "profile.title": { en: "My Profile", hi: "मेरी प्रोफ़ाइल", hinglish: "Meri Profile" },
  "profile.edit": { en: "Edit Profile", hi: "प्रोफ़ाइल संपादित करें", hinglish: "Profile Edit Karo" },

  "common.loading": { en: "Loading...", hi: "लोड हो रहा...", hinglish: "Loading..." },
  "common.save": { en: "Save", hi: "सहेजें", hinglish: "Save Karo" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें", hinglish: "Cancel" },
  "common.search": { en: "Search", hi: "खोजें", hinglish: "Search" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangKey>("en");

  const t = (key: string): string => {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en ?? key;
  };

  const value: LanguageContextType = {
    lang,
    setLang,
    t,
    langLabel: LANG_LABELS[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
