import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // New service worker activates on the next app launch without a prompt.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Favorites',
        short_name: 'Favorites',
        lang: 'ru',
        display: 'standalone',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        // TODO: add PNG icons (192, 512, apple-touch-icon 180) before installing on iPhone.
        icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        // SPA routing: any navigation offline falls back to index.html.
        navigateFallback: '/index.html',
      },
    }),
  ],
})
