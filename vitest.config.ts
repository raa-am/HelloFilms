import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '@vueuse/core': fileURLToPath(new URL('./node_modules/@vueuse/core', import.meta.url)),
      'vue': fileURLToPath(new URL('./node_modules/vue', import.meta.url))
    }
  }
})
