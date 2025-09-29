'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
const REPO = 'carmate'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    ;(async () => {
      try {
        const { data: { user } } = await supabaseBrowser().auth.getUser()
        if (user) setOk(true)
        else { setOk(false); window.location.href = `${BASE}/auth/login` }
      } catch { setOk(false); window.location.href = `${BASE}/auth/login` }
    })()
  }, [])
  if (ok !== true) return null
  return <>{children}</>
}
