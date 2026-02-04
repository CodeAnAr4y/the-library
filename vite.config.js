import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "app.js",
        inlineDynamicImports: true,
      },
    },
  },
});
