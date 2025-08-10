import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'
import { existsSync } from 'fs'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages用の設定: リポジトリ名をベースパスに設定
  base: process.env.NODE_ENV === 'production' ? '/digital-narrative-cascade/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      // Spark環境でない場合のフォールバック設定
      ...(existsSync(resolve(projectRoot, 'packages/spark-tools/dist/spark.js')) ? {} : {
        '@github/spark/spark': resolve(projectRoot, 'src/lib/spark-mock.ts'),
        '@github/spark/hooks': resolve(projectRoot, 'src/hooks/useKV.ts')
      })
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
