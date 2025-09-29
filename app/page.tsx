'use client'
export const dynamic = 'force-static'

import { useEffect } from 'react'

const REPO = 'carmate'
const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')

export default function Home() {
  useEffect(() => {
    window.location.replace(`${BASE}/dashboard`)
  }, [])
  return <p style={{ padding: 16 }}>Reindirizzamento…</p>
}
