import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const crossOriginHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Empêche Vite de pré-bundler web-llm (incompatible avec ses imports dynamiques internes)
  optimizeDeps: {
    exclude: ['@mlc-ai/web-llm'],
  },
  server: {
    headers: crossOriginHeaders,
    proxy: {
      '/hf-api': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-api/, ''),
      }
    }
  },
  preview: {
    headers: crossOriginHeaders,
  },
})
