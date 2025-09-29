'use client'
import { useI18n } from '@/components/I18nProvider'

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n()
  const isEN = locale === 'en'

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={isEN ? 'opacity-50' : 'font-semibold'}>IT</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isEN}
          onChange={(e) => setLocale(e.target.checked ? 'en' : 'it')}
        />
        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-all">
          <div
            className={`absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isEN ? 'translate-x-5' : ''
            }`}
          />
        </div>
      </label>
      <span className={isEN ? 'font-semibold' : 'opacity-50'}>EN</span>
    </div>
  )
}

