import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name:             'AGROPOLY BFA',
        short_name:       'AGROPOLY',
        description:      'El juego de mesa del Banco de Fomento Agropecuario de El Salvador',
        theme_color:      '#0D2B14',
        background_color: '#060E08',
        display:          'standalone',
        orientation:      'any',
        start_url:        '/',
        lang:             'es-SV',
        // Using SVG icon — modern browsers (Chrome 99+, Safari 16+) accept SVG for installable PWAs.
        // To target older Android: generate /public/icon-192.png + /public/icon-512.png from this SVG
        // (e.g. via https://realfavicongenerator.net/) and add their entries here.
        icons: [
          { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache app shell + Three.js (large bundle worth caching)
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Don't try to cache the WebSocket / Colyseus endpoints
        navigateFallbackDenylist: [/^\/colyseus/, /^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion', 'gsap'],
          'audio-vendor': ['howler', 'tone'],
        },
      },
    },
  },
})
