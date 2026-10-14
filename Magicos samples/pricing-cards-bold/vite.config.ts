import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// The build inlines all JS and CSS into one index.html, so the finished page
// opens straight from disk (double-click) with no server needed.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
