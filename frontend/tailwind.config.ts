import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          primary: "#0A0A0A",
          secondary: "#1A1A1A",
          tertiary: "#252525",
          elevated: "#2A2A2A",
        },
        // Text colors
        text: {
          primary: "#E8E8E8",
          secondary: "#999999",
          tertiary: "#666666",
          inverse: "#0A0A0A",
        },
        // Gold accent colors
        gold: {
          primary: "#D4AF37",
          dark: "#8B6914",
          light: "#F4D03F",
          muted: "rgba(212, 175, 55, 0.12)",
        },
        // Semantic colors
        success: "#4CAF50",
        error: "#F44336",
        warning: "#FF9800",
        info: "#2196F3",
        // Border colors
        border: {
          subtle: "#2A2A2A",
          default: "#3A3A3A",
          accent: "#D4AF37",
        },
        divider: "#1F1F1F",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "SF Mono", "Consolas", "monospace"],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "24px",
        "6": "32px",
        "8": "48px",
        "10": "64px",
        "12": "96px",
      },
      borderRadius: {
        sm: "4px",
        base: "6px",
        md: "8px",
        lg: "12px",
        pill: "9999px",
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(0, 0, 0, 0.2)",
        elevated: "0 4px 12px rgba(0, 0, 0, 0.3)",
        floating: "0 24px 48px rgba(0, 0, 0, 0.6)",
        focus: "0 0 0 3px rgba(212, 175, 55, 0.12)",
        glow: "0 0 20px rgba(212, 175, 55, 0.3)",
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-in-out",
        slideUp: "slideUp 300ms ease-out",
        grain: "grain 8s steps(10) infinite",
        spotlightGlow: "spotlightGlow 2s ease-in-out infinite",
        spin: "spin 800ms linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        spotlightGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

