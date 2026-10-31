import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  appType: 'spa',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
