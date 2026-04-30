import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/storyweaver/' : '/',
  server: {
    port: 5178,
    strictPort: true,
  },
})
