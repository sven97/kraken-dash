import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages project path, e.g. https://<user>.github.io/kraken-dash/
// Change '/kraken-dash/' if you publish under a different repo name.
// https://vite.dev/config/
export default defineConfig({
  base: '/kraken-dash/',
  plugins: [react()],
})
