import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 404.html is a page of its own; Vercel serves it for any unknown path.
    rollupOptions: {
      input: { main: 'index.html', notFound: '404.html' },
    },
  },
})
