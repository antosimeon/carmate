'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Locale = 'it' | 'en'
const messages: Record<Locale, Record<string, string>> = {
  it: { app_title:'CarMate', /* ...rest of IT strings... */ },
  en: { app_title:'CarMate', /* ...rest of EN strings... */ },
}

type Ctx = { locale: Locale; t: (k: string) => string; setLocale: (l: Locale)=>void; toggle: ()=>void }
const I18nCtx = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('it')
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('carmate_locale')) as Locale | null
    if (saved === 'it' || saved === 'en') setLocale(saved)
  }, [])
  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('carmate_locale', locale)
  }, [locale])

  const t = (k: string) => messages[locale][k] ?? k
  const toggle = () => setLocale(prev => (prev === 'it' ? 'en' : 'it'))
  const value = useMemo(() => ({ locale, t, setLocale, toggle }), [locale])
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

