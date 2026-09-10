import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#07070a",
          900: "#0c0c11",
          800: "#14141b",
          700: "#1d1d27",
          600: "#2a2a37",
          500: "#3d3d4d",
          400: "#6b6b7d",
          300: "#9a9aab",
          200: "#c9c9d6",
          100: "#ececf2",
        },
        ember: {
          300: "#ffb38a",
          400: "#ff8f5a",
          500: "#ff6a2f",
          600: "#f0501a",
          700: "#c93d10",
        },
        sky: {
          300: "#9ad4ff",
          400: "#5fb6ff",
          500: "#2f95f0",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,106,47,.25), 0 20px 60px -20px rgba(255,106,47,.45)",
        card: "0 1px 0 0 rgba(255,255,255,.04) inset, 0 10px 40px -20px rgba(0,0,0,.8)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: ".25" },
          "50%": { opacity: ".9" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        drift: "drift 6s ease-in-out infinite",
        twinkle: "twinkle 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
