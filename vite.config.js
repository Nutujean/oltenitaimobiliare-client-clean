import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

// ✅ Plugin personalizat care copiază automat fișierul `_redirects` în `dist/`
function copyRedirectsPlugin() {
  return {
    name: "copy-redirects",
    closeBundle() {
      try {
        copyFileSync(
          resolve(__dirname, "public/_redirects"),
          resolve(__dirname, "dist/_redirects")
        );
        console.log("✅ Fișierul _redirects a fost copiat în dist/");
      } catch (err) {
        console.warn("⚠️  Nu am putut copia _redirects:", err.message);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRedirectsPlugin()],
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
