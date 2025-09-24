'use client'

import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const sb = supabaseBrowser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const signIn = async () => {
    setError(null)
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) return setError(error.message)
    router.replace('/')
  }

  const inputCls =
    'w-full rounded-lg border border-carbon-600 bg-carbon-800 p-2 text-white placeholder-white/50 ' +
    'focus:outline-none focus:ring-2 focus:ring-racing-accent/60'

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 card p-6 bg-carbon-800">
        <h1 className="text-2xl font-bold">CarMate</h1>

        <input
          className={inputCls}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
        <input
          className={inputCls}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button className="btn btn-primary w-full" onClick={signIn}>
          Sign in
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <p className="text-xs text-white/60">Don’t have an account? Ask the admin.</p>
      </div>
    </main>
  )
}

