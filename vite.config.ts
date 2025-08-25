import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Opciones del servidor (en desarrollo)
    host: "127.0.0.1", // escucha en la IP de loop-back (evita problemas con Spotify)
    port: 5173, // puerto fijo para que la redirect_uri coincida
  },
});
