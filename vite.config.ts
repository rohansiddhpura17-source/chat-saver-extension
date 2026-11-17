import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Multi-page build: index.html is the full-page app, popup.src.html
      // is the extension popup's source (manifest.json:
      // action.default_popup is "popup.html"). The input file is named
      // popup.src.html — NOT popup.html — because the built popup.html is
      // also copied back to the project root by scripts/package-extension.mjs
      // (see there), and a build input must never be its own output.
      // Both pages share src/main.tsx, so Vite emits one shared bundle.
      input: {
        main: resolve(root, 'index.html'),
        popup: resolve(root, 'popup.src.html'),
      },
    },
  },
})
