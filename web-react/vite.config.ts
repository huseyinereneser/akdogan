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
    // Geliştirmede PHP tarafı ayrı bir sunucuda çalışır; şu komutla başlat:
    //   cd web-react && php -S localhost:8000
    // Aşağıdaki vekil sayesinde panel http://localhost:5173/admin/ üzerinden,
    // form gönderimi de /gonder.php üzerinden aynı origin'de erişilebilir.
    proxy: {
      "/admin": "http://localhost:8000",
      "/gonder.php": "http://localhost:8000",
    },
  },
});
