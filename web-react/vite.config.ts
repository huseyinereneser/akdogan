import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// "/admin" (sonda / yok) isteğini "/admin/"e 301'le — aksi halde PHP panelinin
// göreli yönlendirmeleri (login.php → /login.php) React uygulamasına düşüyor.
const adminSlash = (): Plugin => ({
  name: "admin-trailing-slash",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/admin") {
        res.statusCode = 301;
        res.setHeader("Location", "/admin/");
        res.end();
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), adminSlash()],
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
