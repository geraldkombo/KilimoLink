/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Asset base path, per deploy target:
//   GitHub Pages  -> /KilimoLink/   (project-site subpath)
//   Cloudflare Pages / Vercel / Render -> /   (domain root)
// Set BASE_PATH explicitly in each target's build; defaulting to '/' is the
// safe choice because a wrong subpath 404s every asset, while a wrong '/'
// still resolves on a subpath host in most cases.
const basePath = process.env.BASE_PATH ?? process.env.PAGES_BASE ?? '/';

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: {
    host: true,
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
  }
});

