'use client'

import LocaleToggle from '@/components/LocaleToggle'
import { useI18n } from '@/components/I18nProvider'

export default function Header() {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-racing-red text-white shadow-soft">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-3 w-3 rounded-full bg-white/90 shadow" />
          <h1 className="text-lg font-semibold tracking-wide">{t('app_title')}</h1>
        </div>
        <LocaleToggle />
      </div>
    </header>
  )
}

