import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/CodeNames3.0/',   // must match the repo name
  plugins: [
    react(),
    tailwindcss(),
  ],
})