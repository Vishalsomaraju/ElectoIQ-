import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  envPrefix: 'VITE_',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    coverage: {
      reporter: ['text', 'lcov'],
      thresholds: {
        functions: 70,
        lines: 70,
        branches: 60,
      },
    },
  },
})
