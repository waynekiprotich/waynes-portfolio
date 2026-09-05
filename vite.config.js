import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // gsap is the only dependency big enough to be worth its own
          // chunk; routing is now ~1kB of local code and belongs inline.
          gsap: ['gsap'],
        },
      },
    },
  },
})
