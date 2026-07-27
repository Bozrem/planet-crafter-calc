import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGitHubPages ? "/planet-crafter-calc/" : "/",
  plugins: [svelte()],
  root: ".",
  publicDir: "public",
  resolve: {
    alias: {
      "@core": resolve(__dirname, "src/core"),
      "@data": resolve(__dirname, "data"),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist-web",
    emptyOutDir: true,
  },
});
