import path from 'node:path'
import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: set VITE_BASE=/<repo-name>/ in CI (see .github/workflows).
const base = process.env.VITE_BASE ?? '/'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** GitHub Pages serves 404 for unknown paths (e.g. /repo/compare). Duplicating the SPA shell as 404.html lets the app boot and React Router can read the real path. */
function spaFallback404Plugin() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const indexHtml = path.join(__dirname, 'dist', 'index.html')
      const notFoundHtml = path.join(__dirname, 'dist', '404.html')
      copyFileSync(indexHtml, notFoundHtml)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), spaFallback404Plugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
