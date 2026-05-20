import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['storyweaver_logo.png'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'StoryWeaver',
        short_name: 'StoryWeaver',
        description: 'An interactive story reading experience',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'storyweaver_logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'storyweaver_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  base: process.env.GITHUB_ACTIONS ? '/storyweaver/' : '/',
  server: {
    port: 5178,
    strictPort: true,
  },
})
