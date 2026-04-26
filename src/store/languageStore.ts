import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Lang = 'en' | 'es'

interface LanguageState {
  language: Lang
  setLanguage: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => {
        import('../i18n').then(({ default: i18n }) => i18n.changeLanguage(lang))
        set({ language: lang })
      },
    }),
    { name: 'massage-app-language' },
  ),
)
