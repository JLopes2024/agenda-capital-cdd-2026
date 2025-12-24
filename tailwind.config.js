export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#f8fafc",
          dark: "#020617",
        },
        card: {
          light: "#ffffff",
          dark: "#020617",
        },
        text: {
          light: "#020617",
          dark: "#e5e7eb",
        },
        muted: {
          light: "#64748b",
          dark: "#94a3b8",
        },
        primary: {
          light: "#38bdf8",
          dark: "#38bdf8",
        },
        success: {
          light: "#16a34a",
          dark: "#22c55e",
        },
      },
    },
  },
  plugins: [],
};
