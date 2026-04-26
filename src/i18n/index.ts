import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: (() => {
    try {
      const stored = localStorage.getItem('massage-app-language')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.state?.language) return parsed.state.language
      }
    } catch {}
    return 'en'
  })(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
