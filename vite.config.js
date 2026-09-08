import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,ico,webp}']
      },
      manifest: {
        name: 'VaniSetu OS',
        short_name: 'VaniSetu',
        description: 'Bilingual Primary Education OS for Jharkhand',
        theme_color: '#0F4D2A',
        background_color: '#F0F2F9',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    watch: {
      ignored: ['**/PALASH/**', '**/SIH/**', '**/android/**', '**/build_desktop/**', '**/dist_electron/**', '**/lib/**', '**/*.tmp']
    }
  },
  base: './'
})
