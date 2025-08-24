import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'build'
  },
  base: '/BM_Assignment/'   // ✅ repo name yaha dalna hai
})
