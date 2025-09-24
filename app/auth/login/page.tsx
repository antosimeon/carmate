'use client'
import { supabaseBrowser } from '@/lib/supabase'
import { useState } from 'react'

export default function Login() {
  const sb = supabaseBrowser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (!error) window.location.href = '/'
    else alert(error.message)
  }

  const signUp = async () => {
    const { error } = await sb.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email to confirm your account (if email confirmation is enabled).')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">CarMate</h1>
        <input className="w-full border p-2 rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white p-2 rounded" onClick={signIn}>Sign in</button>
        <button className="w-full border p-2 rounded" onClick={signUp}>Create account</button>
      </div>
    </main>
  )
}
