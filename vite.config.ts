import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // three.js весит ~500 KB (min) — это нормально для 3D-проекта, не пугаемся предупреждения.
    chunkSizeWarningLimit: 1000,
  },
});
