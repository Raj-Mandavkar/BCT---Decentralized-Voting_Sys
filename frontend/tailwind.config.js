/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#e5edff",
          200: "#cddbfe",
          300: "#b4c6fc",
          400: "#8da2f8",
          500: "#5d5fef", // Primary blue from the new design
          600: "#4b4ce0",
          700: "#3b3cc4",
          800: "#2d2ea3",
          900: "#242585",
        },
        surface: {
          50: "#ffffff", // Main background
          100: "#f8fafc", // Slightly off-white for sections
          200: "#f1f5f9",
          300: "#e2e8f0", // Borders
        },
        accent: {
          orange: "#f97316",
          green: "#10b981",
          yellow: "#eab308",
        },
        // Avatar colors from the design
        avatar: {
          pink: "#ff7ce5",
          blue: "#60a5fa",
          green: "#84cc16",
          teal: "#14b8a6"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "card": "0 2px 10px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.08)",
        "button": "0 4px 14px rgba(93, 95, 239, 0.3)",
      },
    },
  },
  plugins: [],
}
