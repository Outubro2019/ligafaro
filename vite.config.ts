import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/jogo-wordle': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/jogo-wordle/, '/public/jogo-wordle')
      },
      '/jogo-qa': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/jogo-qa/, '/public/jogo-qa')
      },
      '/jogo_sopa': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/jogo_sopa/, '/public/jogo_sopa')
      }
    },
    fs: {
      // Permitir servir arquivos de fora do diretório raiz
      allow: ['..']
    },
  },
  publicDir: 'public',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'node-fetch',
        'child_process',
        'fs/promises',
        'util',
        'path'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
