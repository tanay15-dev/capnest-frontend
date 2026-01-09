import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Use relative paths for assets
  server: {
    port: 3000,
    host: true, // Allow network access
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
