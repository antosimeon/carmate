'use client'
import Image from 'next/image'

const REPO = 'carmate'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')

export default function Header() {
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--line)' }}>
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <Image src={`${BASE}/logo-carmate.png`} alt="CarMate" width={28} height={28} className="rounded-md" unoptimized />
        <span className="font-semibold">CarMate</span>
      </div>
    </header>
  )
}
