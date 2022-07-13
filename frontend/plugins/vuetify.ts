import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const primaryColor = '#475569'
const customTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: primaryColor,
    thin: '#F8FAFC',
    thin2: '#E2E8F0',
    accent: '#FEF08A',
    'on-surface': primaryColor,
    'on-background': primaryColor,
    'on-thin': primaryColor,
    'on-accent': primaryColor,
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    },
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
