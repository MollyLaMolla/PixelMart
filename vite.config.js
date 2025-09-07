import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Base corretta per GitHub Pages: sostituire con il nome del repo
  base: mode === "production" ? "/PixelMart.Deploy/" : "/",
  plugins: [react()],
  build: {
    // Lascia gestire a Rollup/Vite l'auto-splitting per evitare problemi di ordine
    chunkSizeWarningLimit: 900,
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
}));
