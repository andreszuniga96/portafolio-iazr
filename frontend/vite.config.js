import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // Increase chunk size warning limit (we're splitting manually)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting — heavy libs get their own async chunks
        manualChunks(id) {
          // Three.js ecosystem — only loaded by LoadingScreen + GlobeSection
          if (id.includes("three") || id.includes("@react-three") || id.includes("@splinetool")) {
            return "vendor-three";
          }
          // Framer Motion — lazy loaded with sections
          if (id.includes("framer-motion")) {
            return "vendor-framer";
          }
          // GSAP — lazy loaded with hero/animations
          if (id.includes("gsap")) {
            return "vendor-gsap";
          }
          // Recharts / chart libs
          if (id.includes("recharts") || id.includes("d3-")) {
            return "vendor-charts";
          }
          // Radix UI components
          if (id.includes("@radix-ui")) {
            return "vendor-radix";
          }
          // jsPDF — only used in chatbot PDF export
          if (id.includes("jspdf")) {
            return "vendor-pdf";
          }
          // Supabase
          if (id.includes("@supabase")) {
            return "vendor-supabase";
          }
          // React core
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
        },
      },
    },
  },
}));
