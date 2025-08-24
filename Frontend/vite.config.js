import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'build',
    // Add this if deploying to GitHub Pages
    base: '/Assignment/'
  }
});
