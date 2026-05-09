import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts", "chart.js", "react-chartjs-2"],
          motion: ["framer-motion"],
          vendor: ["axios", "lucide-react"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
