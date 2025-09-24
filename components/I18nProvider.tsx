'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type Locale = 'it' | 'en'

const messages: Record<Locale, Record<string, string>> = {
  it: {
    app_title: 'CarMate',
    vehicles: 'Veicoli',
    reparations: 'Riparazioni',
    recurring_bills: 'Spese ricorrenti',
    settings: 'Impostazioni',
    logout: 'Esci',
    total_vehicles: 'Veicoli totali',
    upcoming_bills: 'Prossime scadenze',
    open_reparations: 'Riparazioni aperte',
    your_garage: 'Il tuo garage',
    add_vehicle: 'Aggiungi veicolo',
    nickname: 'Soprannome',
    make: 'Marca',
    model: 'Modello',
    plate: 'Targa',
    delete: 'Elimina',
    checking_session: 'Verifica sessione…',
    select_vehicle: 'Seleziona veicolo',
    reparation_title: 'Titolo riparazione',
    cost_example: 'Costo (es. 120.50)',
    add: 'Aggiungi',
    bill_name: 'Nome spesa (es. Assicurazione)',
    amount_example: 'Importo (es. 50)',
    interval: 'Intervallo',
    monthly: 'Mensile',
    yearly: 'Annuale',
    next_due: 'Prossima scadenza',
    next_due_on: 'prossima scadenza',
    email: 'Email',
    password: 'Password',
    sign_in: 'Accedi',
    ask_admin: 'Non hai un account? Contatta l’amministratore.',
  },
  en: {
    app_title: 'CarMate',
    vehicles: 'Vehicles',
    reparations: 'Reparations',
    recurring_bills: 'Recurring bills',
    settings: 'Settings',
    logout: 'Logout',
    total_vehicles: 'Total vehicles',
    upcoming_bills: 'Upcoming bills',
    open_reparations: 'Open reparations',
    your_garage: 'Your garage',
    add_vehicle: 'Add vehicle',
    nickname: 'Nickname',
    make: 'Make',
    model: 'Model',
    plate: 'Plate',
    delete: 'Delete',
    checking_session: 'Checking session…',
    select_vehicle: 'Select vehicle',
    reparation_title: 'Reparation title',
    cost_example: 'Cost (e.g. 120.50)',
    add: 'Add',
    bill_name: 'Bill name (e.g. Insurance)',
    amount_example: 'Amount (e.g. 50)',
    interval: 'Interval',
    monthly: 'Monthly',
    yearly: 'Yearly',
    next_due: 'Next due',
    next_due_on: 'next due',
    email: 'Email',
    password: 'Password',
    sign_in: 'Sign in',
    ask_admin: 'Don’t have an account? Ask the admin.',
  },
}

type Ctx = {
  locale: Locale
  t: (key: string) => string
  setLocale: (l: Locale) => void
  toggle: () => void
}

const I18nCtx = createContext<Ctx | null>(null)

const STORAGE_KEY = 'carmate_locale'

// ✅ ITALIAN is the real default. We read localStorage once (lazy init).
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'it'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' || saved === 'it' ? (saved as Locale) : 'it'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  const t = (key: string) => messages[locale][key] ?? key
  const toggle = () => {
    setLocale(prev => {
      const next = prev === 'it' ? 'en' : 'it'
      if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  const value = useMemo(() => ({ locale, t, setLocale, toggle }), [locale])
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

