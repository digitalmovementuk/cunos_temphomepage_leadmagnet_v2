import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'cunos_TempHonepage_LeadMagenet'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site at /<repo>/ — env var lets local dev keep '/'
  base: process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/',
  server: {
    port: 5190,
    strictPort: false,
  },
})
