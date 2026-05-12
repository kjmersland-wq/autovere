import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — keep together, loaded first
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/scheduler/") ||
            // react-i18next must live alongside React to avoid a circular
            // chunk dependency: vendor-react ↔ vendor-i18n when they are
            // in separate chunks (React is CJS; its __commonJS helper ends
            // up in vendor-i18n, which then imports React back).
            id.includes("node_modules/react-i18next")
          ) {
            return "vendor-react";
          }
          // Radix UI — large, lazy-friendly
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          // i18n stack (no React dependency here after moving react-i18next above)
          if (
            id.includes("node_modules/i18next") ||
            id.includes("node_modules/i18next-browser")
          ) {
            return "vendor-i18n";
          }
          // React Query
          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }
          // Charts — only loaded on pages that use them
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3") ||
            id.includes("node_modules/victory")
          ) {
            return "vendor-charts";
          }
          // Supabase
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase";
          }
          // next-themes + other small UI libs
          if (
            id.includes("node_modules/next-themes") ||
            id.includes("node_modules/sonner") ||
            id.includes("node_modules/vaul") ||
            id.includes("node_modules/embla-carousel") ||
            id.includes("node_modules/cmdk")
          ) {
            return "vendor-ui-ext";
          }
        },
      },
    },
  },
}));
