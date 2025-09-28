import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config corect pentru Netlify
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
});
