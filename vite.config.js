// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // React 17+ JSX transform
      fastRefresh: true,      // Швидке оновлення компонентів
    }),
  ],

  // 🗂️ Тільки один базовий аліас
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },

  // ⚙️ Сервер розробки
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // 🚀 Продакшн-збірка
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },

  // 🔧 Прискорення старту сервера
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})