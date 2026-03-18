// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiKey: process.env.API_KEY || '',
    accessToken: process.env.ACCESS_KEY || '',
    public: {
      tmdbApiKey: process.env.API_KEY || '',
      tmdbAccessToken: process.env.ACCESS_KEY || ''
    }
  },

  compatibilityDate: '2025-01-15',
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
