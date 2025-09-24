'use client'

import { useI18n } from '@/components/I18nProvider'

const REPO = 'carmate'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? `/${REPO}` : '') // '' locally, '/<repo>' on GitHub Pages

export default function Header() {
  const { t, locale, setLocale } = useI18n()

  return (
    <header className="header sticky top-0 z-20 h-16 w-full">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Plain <img> so we fully control the path on GitHub Pages */}
          <img
            src={`${BASE}/logo-carmate.png`}
            alt="CarMate"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <h1 className="text-lg font-semibold tracking-wide">{t('app_title')}</h1>
        </div>

        {/* Language toggle (pill) */}
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
