import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    adonisjs({ entrypoints: ['resources/js/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
