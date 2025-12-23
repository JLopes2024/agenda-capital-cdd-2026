/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
        card: "#020617",
        primary: "#38bdf8",
        muted: "#94a3b8",
        success: "#22c55e"
      }
    }
  },
  plugins: []
};
