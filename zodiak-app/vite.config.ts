import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const THEME = "#0b0d1b";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [
      react(),
      VitePWA({
        // Ask the seeker before swapping in a new version (see components/pwa/UpdateToast.tsx)
        registerType: "prompt",
        injectRegister: false,
        // icons/ and images/ are already matched by workbox.globPatterns
        includeManifestIcons: false,
        manifest: {
          id: "/",
          name: "Zodiak — Pandit Jii",
          short_name: "Zodiak",
          description: "Your birth chart, AI astrology and Pandit-checked remedies.",
          lang: "en",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          theme_color: THEME,
          background_color: THEME,
          categories: ["lifestyle"],
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,woff2}"],
          // Desktop landing screenshots load on demand; phones never need them offline
          globIgnores: ["landing/**"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          cleanupOutdatedCaches: true,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api(\/|$)/, /^\/sanctum(\/|$)/, /^\/admin(\/|$)/, /^\/payments(\/|$)/, /^\/build\//, /^\/up$/],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
              handler: "StaleWhileRevalidate",
              options: { cacheName: "google-fonts-stylesheets" },
            },
            {
              urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts",
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              // Only the public remedy catalogue is cached. Every other /api and /sanctum
              // call (login, orders, chat, profile) always goes to the network.
              urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/api/v1/remedies"),
              method: "GET",
              handler: "NetworkFirst",
              options: {
                cacheName: "api-remedies",
                networkTimeoutSeconds: 4,
                cacheableResponse: { statuses: [200] },
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    server: {
      port: 5173,
      // Laravel (zodiak-dashboard) serves the JSON API
      proxy: Object.fromEntries(
        ["/api", "/sanctum"].map((path) => [path, { target: env.API_PROXY_TARGET || "http://127.0.0.1:8000", changeOrigin: true }]),
      ),
    },
    preview: {
      port: 4173,
      proxy: Object.fromEntries(
        ["/api", "/sanctum"].map((path) => [path, { target: env.API_PROXY_TARGET || "http://127.0.0.1:8000", changeOrigin: true }]),
      ),
    },
  };
});
