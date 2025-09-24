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
    if (error) {
      setError(error.message)
      return
    }
    router.replace('/') // respects basePath when deployed to GitHub Pages
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">CarMate</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-black text-white p-2 rounded"
          onClick={signIn}
        >
          Sign in
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-xs text-gray-500">
          Don’t have an account? Ask the admin.
        </p>
      </div>
    </main>
  )
}

