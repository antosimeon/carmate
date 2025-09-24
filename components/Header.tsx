'use client'

import Image from 'next/image'
import { useI18n } from '@/components/I18nProvider'

export default function Header() {
  const { t, locale, setLocale } = useI18n()

  return (
    <header className="header sticky top-0 z-20 h-16 w-full">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* LOGO */}
          <Image
            src="/logo-carmate.png"  // assicurati che sia in /public
            alt="CarMate"
            width={48}
            height={48}
            className="rounded-lg"
            priority
          />
          <h1 className="text-lg font-semibold tracking-wide">{t('app_title')}</h1>
        </div>

        {/* Toggle lingua (pill) */}
        <div className="lang-pill">
          <button
            data-active={(locale === 'it').toString()}
            onClick={() => setLocale('it')}
            aria-pressed={locale === 'it'}
            aria-label="Italiano"
          >
            IT
          </button>
          <button
            data-active={(locale === 'en').toString()}
            onClick={() => setLocale('en')}
            aria-pressed={locale === 'en'}
            aria-label="English"
          >
            EN
          </button>
        </div>
      </div>
    </header>
  )
}

