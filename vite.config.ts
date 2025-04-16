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
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aumentar o limite de aviso para chunks grandes (padrão é 500kb)
    chunkSizeWarningLimit: 1000, // 1000kb = 1mb
    rollupOptions: {
      external: [
        'node-fetch',
        'child_process',
        'fs/promises',
        'util',
        'path'
      ],
      output: {
        // Estratégia de chunking melhorada
        manualChunks: (id) => {
          // Chunk para React e bibliotecas relacionadas
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          
          // Chunk para componentes Radix UI
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          
          // Chunk para Firebase
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
          
          // Chunk para Leaflet e mapas
          if (id.includes('node_modules/leaflet') ||
              id.includes('node_modules/react-leaflet')) {
            return 'maps';
          }
          
          // Chunk para gráficos e visualizações
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          
          // Chunk para utilitários e outras bibliotecas menores
          if (id.includes('node_modules') &&
             !id.includes('firebase') &&
             !id.includes('react') &&
             !id.includes('@radix-ui') &&
             !id.includes('leaflet') &&
             !id.includes('recharts')) {
            return 'vendors';
          }
        },
      },
    },
  },
}));
