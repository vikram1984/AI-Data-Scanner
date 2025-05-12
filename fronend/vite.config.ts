import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
  include: ['date-fns','@mui/material'],
  },
  server: {
    port: 3001,
    open: false,
    
  },
 
})

