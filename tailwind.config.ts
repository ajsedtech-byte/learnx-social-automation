import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette from LX20 Blueprint
        navy: {
          DEFAULT: "#0c1222",
          light: "#111827",
          lighter: "#1e293b",
        },
        indigo: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
          muted: "rgba(99,102,241,0.15)",
        },
        teal: {
          DEFAULT: "#2dd4bf",
          light: "#5eead4",
          dark: "#14b8a6",
          muted: "rgba(45,212,191,0.15)",
        },
        // Tier-specific
        storybook: {
          bg: "#fff8f0",
          warm: "#fef3c7",
          orange: "#fb923c",
          pink: "#f472b6",
        },
        explorer: {
          galaxy: "#1a0533",
          gold: "#ffd700",
          purple: "#8b5cf6",
        },
        board: {
          pink: "#fb7185",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        glass: "16px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "grow": "grow 1s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "confetti": "confetti 1s ease-out forwards",
        "wave": "wave 1.5s ease-in-out infinite",
        "gauge-fill": "gaugeFill 1.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        grow: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(-200px) rotate(720deg)", opacity: "0" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.5)" },
          "50%": { transform: "scaleY(1)" },
        },
        gaugeFill: {
          "0%": { strokeDashoffset: "283" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
