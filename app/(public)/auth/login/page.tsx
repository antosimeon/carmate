'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'

const REPO = 'carmate'
const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')

export default function LoginPage() {
  const sb = supabaseBrowser()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.replace('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Errore di login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 w-full max-w-sm">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={`${BASE}/logo-carmate.png`}
          alt="CarMate"
          width={80}
          height={80}
          className="rounded-md mb-2"
          unoptimized
        />
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          className="input w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          inputMode="email"
        />
        <input
          type="password"
          className="input w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="btn btn-primary w-full flex justify-center"
          disabled={loading}
        >
          {loading ? 'Attendere…' : 'Accedi'}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
      <p className="mt-6 text-center text-xs text-[color:var(--text)]/60" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        © {new Date().getFullYear()} Antonello Simeon
      </p>
    </div>
  )
}
