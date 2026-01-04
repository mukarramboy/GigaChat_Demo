import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // слушаем все интерфейсы
    port: 5173,
    allowedHosts: true, // разрешаем любые хосты
    strictPort: true,    // чтобы точно использовать 5173
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
