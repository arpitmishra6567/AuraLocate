import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: "var(--atelier-bg)",
          surface: "var(--atelier-surface)",
          subtle: "var(--atelier-subtle)",
          border: "var(--atelier-border)",
          text: "var(--atelier-text)",
          muted: "var(--atelier-muted)",
          bronze: "var(--atelier-bronze)",
          "bronze-hover": "var(--atelier-bronze-hover)",
          charcoal: "var(--atelier-charcoal)",
        },
      },
      fontFamily: {
        serif: ["var(--font-editorial)", "Newsreader", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        atelier: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
