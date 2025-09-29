'use client'
import { createContext, useContext, useState } from 'react'

type I18nContextType = {
  locale: 'it' | 'en'
  setLocale: (l: 'it' | 'en') => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'it',
  setLocale: () => {},
  t: (k) => k,
})

const translations: Record<string, { it: string; en: string }> = {
  vehicles: { it: 'Veicoli', en: 'Vehicles' },
  expenses: { it: 'Spese', en: 'Expenses' },
  reminders: { it: 'Promemoria', en: 'Reminders' },
  stats: { it: 'Statistiche', en: 'Stats' },
  logout: { it: 'Esci', en: 'Logout' },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'it' | 'en'>('it')

  const t = (key: string) => translations[key]?.[locale] || key

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

