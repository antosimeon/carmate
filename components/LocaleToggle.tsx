'use client'

import { useI18n } from '@/components/I18nProvider'

export default function LocaleToggle() {
  const { locale, setLocale } = useI18n()

  const baseBtn =
    'px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none'
  const active =
    'bg-white text-black'
  const inactive =
    'text-white/80 hover:bg-white/15 border border-white/20'

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md bg-white/10 p-1 border border-white/20"
      role="tablist"
      aria-label="Language selector"
    >
      <button
        role="tab"
        aria-selected={locale === 'it'}
        className={`${baseBtn} ${locale === 'it' ? active : inactive}`}
        onClick={() => setLocale('it')}
      >
        IT
      </button>
      <button
        role="tab"
        aria-selected={locale === 'en'}
        className={`${baseBtn} ${locale === 'en' ? active : inactive}`}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  )
}

