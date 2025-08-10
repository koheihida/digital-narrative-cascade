import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages用の設定: リポジトリ名をベースパスに設定
  base: process.env.NODE_ENV === 'production' ? '/digital-zen-garden-l/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  // ビルド設定
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // GitHub Pages用の最適化
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
