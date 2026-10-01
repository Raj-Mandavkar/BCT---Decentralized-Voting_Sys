import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose the Hardhat local node to the dev server
  server: {
    port: 3000,
  },
})
