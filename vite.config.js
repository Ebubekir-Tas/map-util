import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://map-editor-mauve.vercel.app', // Your Vercel backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: to remove '/api' from the path
      },
    },
  },
})
