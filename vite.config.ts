import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-router": '/src/packages/react-router',
      "react-router-dom": '/src/packages/react-router-dom',
      "history": '/src/packages/history',
    }
  },
  server: {
    open: true,
    force: true,
  }
})
