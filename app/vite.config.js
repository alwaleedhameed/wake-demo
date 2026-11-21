import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /<repo-name>/, so every asset path needs that prefix.
// Locally (npm run dev) we keep it at the root.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/wake-demo/' : '/',
  server: { host: true }, // also listen on the Wi-Fi address, so a phone on the same network can open it
}))
