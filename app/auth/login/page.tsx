'use client'

import Image from 'next/image'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/components/I18nProvider'

export default function Login() {
  const router = useRouter()
  const sb = supabaseBrowser()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const signIn = async () => {
    setError(null)
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) return setError(error.message)
    router.replace('/')
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm card p-6">
        <div className="flex flex-col items-center gap-3 mb-4">
          <Image
            src="/logo-carmate.png"
            alt="CarMate"
            width={56}
            height={56}
            className="rounded-xl transition-transform duration-400 ease-smooth hover:scale-105"
            priority
          />
          <h1 className="text-2xl font-bold">{t('app_title')}</h1>
        </div>

        <div className="space-y-3">
          <input
            className="input"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
          <input
            className="input"
            placeholder={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button className="btn btn-primary w-full" onClick={signIn}>
            {t('sign_in')}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-[var(--muted)]">{t('ask_admin')}</p>
        </div>
      </div>
    </main>
  )
}

