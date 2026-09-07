import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // gonder.php ve panelin ürettiği JSON'lar için: geliştirmede mevcut
    // PHP sunucusuna vekil (php -S localhost:8000 ya da Apache).
    proxy: {
      "/gonder.php": "http://localhost:8000",
    },
  },
});
