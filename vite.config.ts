/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the same build works on any web path and inside Capacitor (Android).
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
