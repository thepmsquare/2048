import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/2048/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "2048",
        short_name: "2048",
        description: "2048 Game",
        theme_color: "#0FF",
        background_color: "#000",
        display: "standalone",
        start_url: "/2048/",
        icons: [
          {
            src: "2048.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "2048.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "2048.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
