import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'cunos_temphomepage_leadmagnet_v2'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Production builds (vite build) → /<repo>/ for GitHub Pages.
  // Dev (vite serve) → '/' so localhost works as expected.
  base: command === 'build' ? `/${repoName}/` : '/',
  server: {
    port: 5190,
    strictPort: false,
  },
}))
