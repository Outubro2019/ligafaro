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
        manualChunks: (id) => {
          // Chunk para React e bibliotecas principais
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // Chunk para Radix UI components
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            
            // Chunk para Leaflet e mapas
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'maps';
            }
            
            // Chunk para Firebase
            if (id.includes('firebase')) {
              return 'firebase';
            }
            
            // Chunk para TanStack Query
            if (id.includes('@tanstack')) {
              return 'tanstack';
            }
            
            // Chunk para outras bibliotecas grandes
            if (id.includes('recharts') || id.includes('date-fns') || id.includes('lucide-react')) {
              return 'ui-libs';
            }
            
            // Chunk para outras dependências
            return 'vendor';
          }
        },
      },
    },
    // Aumentar o limite de aviso para chunks grandes
    chunkSizeWarningLimit: 1000,
    // Otimizações adicionais
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}));
