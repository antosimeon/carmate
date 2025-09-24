'use client'

import Image from 'next/image'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/components/I18nProvider'

const REPO = 'carmate'
const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn()
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6">
      {/* Login card */}
      <div className="w-full max-w-sm card p-6">
        <div className="flex flex-col items-center gap-3 mb-4">
          <Image
            src={`${BASE}/logo-carmate.png`}
            alt="CarMate"
            width={56}
            height={56}
            className="rounded-xl transition-transform duration-400 ease-smooth hover:scale-105"
            priority
            unoptimized
          />
          <h1 className="text-2xl font-bold">{t('login')}</h1>
        </div>

        {/* ✅ Wrap inputs in a form so Enter works */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
          <button type="submit" className="btn btn-primary w-full">
            {t('sign_in')}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-[var(--muted)]">{t('ask_admin')}</p>
        </form>
      </div>

      {/* Copyright */}
      <p
        className="mt-6 text-xs text-muted-foreground text-center"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
      >
        © {new Date().getFullYear()} Antonello Simeon
      </p>
    </main>
  )
}

