import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      ENVIRONMENT: '',
      BFF_DOMAIN_NAME_WITH_SCHEME: '',
      FIREBASE_API_KEY: '',
      FIREBASE_AUTH_DOMAIN: '',
      FIREBASE_PROJECT_ID: '',
      FIREBASE_STORAGE_BUCKET: '',
      FIREBASE_MESSAGING_SENDER_ID: '',
      FIREBASE_APP_ID: '',
      FIREBASE_MEASUREMENT_ID: ''
    }
  },
  typescript: {
    strict: true
  },
  css: [
    'vuetify/styles',
    '~/assets/common.scss',
    '~/assets/tailwind.css'
  ],
  build: {
    transpile: ['vuetify'],
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {}
        }
      }
    }
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
