import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/members": 
      {
        target: "http://localhost:5000",
        secure: false,
      },
      '/findWord': {
        target: "http://localhost:5000",
        secure: false,
      },
      "/initiateWord": {
        target: "http://localhost:5000",
        secure: false,
      }
    },
    port: 3000,
  }
})
