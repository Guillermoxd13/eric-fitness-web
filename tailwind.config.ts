import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        gold: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
        },
        ink: {
          900: "#0a0a0b",
          800: "#111113",
          700: "#17171a",
          600: "#1f1f24",
          500: "#2a2a31",
          400: "#3a3a44",
        },
        hair: "rgba(255,255,255,0.08)",
        "hair-bright": "rgba(255,255,255,0.14)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(239, 68, 68, 0.5)",
        "glow-lg": "0 0 80px -12px rgba(239, 68, 68, 0.45)",
        "glow-gold": "0 0 60px -12px rgba(251, 191, 36, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239,68,68,0.18), transparent)",
        "radial-closer":
          "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(239,68,68,0.2), transparent 70%)",
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      letterSpacing: {
        tightest: "-0.045em",
        "editorial-display": "-0.035em",
        "editorial-xl": "-0.03em",
        "editorial-lg": "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
