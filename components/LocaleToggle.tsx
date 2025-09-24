'use client'
import { useI18n } from '@/components/I18nProvider'

export default function LocaleToggle() {
  const { locale, toggle } = useI18n()
  return (
    <button
      onClick={toggle}
      className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
      aria-label="Switch language"
      title="Switch language"
    >
      {locale.toUpperCase()}   {/* shows IT or EN */}
    </button>
  )
}

