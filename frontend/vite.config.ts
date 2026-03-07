import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Слушаем все интерфейсы (для Docker)
    port: 5173,
    proxy: {
      // Все запросы на /api будут перенаправляться на бэкенд
      '/api': {
        target: 'http://backend:8000', // Имя сервиса в docker-compose
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Убираем префикс /api, если нужно
      },
      // Или проксируем конкретные эндпоинты auth/orders
      '/auth': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})