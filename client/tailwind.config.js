/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        brand: {
          50: "#eff6ff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
