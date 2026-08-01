import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Caminhos relativos para funcionar no Electron sem servidor
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
