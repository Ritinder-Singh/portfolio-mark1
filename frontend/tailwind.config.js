/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Design system colors - dark theme with teal accents
        primary: {
          DEFAULT: "#14b8a6", // Teal accent
          light: "#2dd4bf",
          dark: "#0d9488",
        },
        background: {
          DEFAULT: "#0f172a", // Dark navy background
          secondary: "#1e293b", // Slightly lighter for cards
          tertiary: "#334155", // For borders and dividers
        },
        text: {
          primary: "#f8fafc", // White text
          secondary: "#94a3b8", // Gray text
          accent: "#14b8a6", // Teal text
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

