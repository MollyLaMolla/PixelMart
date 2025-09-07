import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  // Usa percorsi relativi negli asset generati (utile per deploy su sottocartelle o apertura via file://)
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("scheduler"))
              return "vendor-react";
            if (id.includes("@mui")) return "vendor-mui";
            if (id.includes("react-router")) return "vendor-router";
            if (id.includes("gsap")) return "vendor-gsap";
            // fallback generic vendors
            return "vendor-other";
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
